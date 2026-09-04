#!/usr/bin/env python3
"""
PLA short-form video renderer.

Pipeline: script -> TTS -> Whisper timings -> caption-synced vertical MP4.

DESIGN NOTES FOR WHOEVER MAINTAINS THIS
---------------------------------------
1. Whisper supplies TIMING ONLY. Displayed words come from the original
   script. Whisper is accurate but not perfect (it rendered "court appointed"
   as "court -appointive" in testing) and a transcription error must never
   appear on screen as if it were the copy.

2. Line breaking is grammar-aware, not width-aware. Breaking purely on
   character count produced orphans like "appointed for the" / "trial".
   We break at punctuation, then at conjunctions, and refuse to leave a
   dangling function word.

3. Every stage validates and fails LOUDLY. An unattended pipeline that
   silently emits a broken video is worse than one that stops and reports.

Exit codes: 0 ok, 1 usage/config, 2 upstream API failure, 3 validation failure.
"""
import argparse, base64, json, os, re, subprocess, sys, textwrap, difflib

# ---------------------------------------------------------------- constants
FB  = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FSB = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"   # SemiBold not present on all runners; Bold is the fallback
FM  = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"
ACCENT, BLUE, WHITE = "0xF0B429", "0x5BA4F0", "0xFFFFFF"
W, H = 1080, 1920
TAIL = 4.0
SITE, PHONE = "prisonerlegalaid.blog", "786-408-5073"

# Target 20-30s of narration. Aura speaks ~2.6 words/sec.
WORDS_MIN, WORDS_MAX = 45, 80
DUR_MIN, DUR_MAX = 14.0, 34.0

# Words we refuse to strand at the end of a line.
DANGLERS = {
 "a","an","the","of","to","in","on","for","and","or","but","is","are","was",
 "were","be","been","it","he","she","they","that","this","with","as","at",
 "by","from","not","no","if","so","can","may","do","does","did","has","have",
 "had","you","your","his","her","their","our","my","its","who","what","when"
}
BREAKERS = {"and","but","so","because","however","although","which","that","when","if","while"}

class Fail(Exception): pass

def log(m): print(f"[render] {m}", flush=True)

# ---------------------------------------------------------------- helpers
def esc(t):
    return (t.replace("\\", "\\\\").replace(":", "\\:")
             .replace("'", "\u2019").replace("%", "\\%"))

def norm(w): return re.sub(r"[^a-z0-9]", "", w.lower())

def cf(account, token, email, model, payload, out=None):
    """Call Workers AI. Supports API-token or global-key auth."""
    hdr = (["-H", f"Authorization: Bearer {token}"] if token
           else ["-H", f"X-Auth-Email: {email}", "-H", f"X-Auth-Key: {os.environ['CF_API_KEY']}"])
    with open("/tmp/_pl.json", "w") as f: json.dump(payload, f)
    cmd = (["curl", "-s", "--max-time", "180", "-X", "POST",
            f"https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/{model}"]
           + hdr + ["-H", "Content-Type: application/json", "--data", "@/tmp/_pl.json"])
    if out: cmd += ["-o", out]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        raise Fail(f"network failure calling {model}: {r.stderr.decode()[:200]}")
    return r.stdout

# ---------------------------------------------------------------- steps
def check_script(script):
    words = script.split()
    n = len(words)
    if n < WORDS_MIN:
        raise Fail(f"script too short: {n} words (min {WORDS_MIN}). Short scripts "
                   f"produce videos under {DUR_MIN}s that read as filler.")
    if n > WORDS_MAX:
        raise Fail(f"script too long: {n} words (max {WORDS_MAX}). Over ~30s, "
                   f"completion rate drops sharply on Reels and TikTok.")
    banned = [r"guarantee[a-z]* (result|outcome|release|recovery|win)",
              r"\bwe are a law firm\b", r"\bour attorneys?\b", r"\$\s?\d"]
    for b in banned:
        if re.search(b, script, re.I):
            raise Fail(f"script contains a prohibited claim pattern: {b}")
    log(f"script ok: {n} words (~{n/2.6:.0f}s expected)")
    return n

def tts(script, account, token, email, voice, out):
    cf(account, token, email, "@cf/deepgram/aura-2-en",
       {"text": script, "speaker": voice}, out)
    if not os.path.exists(out) or os.path.getsize(out) < 4000:
        head = open(out, "rb").read(300) if os.path.exists(out) else b""
        raise Fail(f"TTS returned no usable audio. First bytes: {head[:200]!r}")
    d = probe(out)
    if not (DUR_MIN <= d <= DUR_MAX):
        raise Fail(f"narration is {d:.1f}s, outside the {DUR_MIN}-{DUR_MAX}s window")
    log(f"tts ok: {d:.1f}s, voice={voice}")
    return d

def probe(path):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                        "-of","csv=p=0",path], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except ValueError: raise Fail(f"ffprobe could not read {path}")

def transcribe(audio, account, token, email, out):
    b64 = base64.b64encode(open(audio,"rb").read()).decode()
    cf(account, token, email, "@cf/openai/whisper-large-v3-turbo", {"audio": b64}, out)
    d = json.load(open(out))
    if not d.get("success"):
        raise Fail(f"whisper failed: {d.get('errors')}")
    words=[]
    for s in d["result"]["segments"]:
        for w in s.get("words",[]):
            words.append({"w":w["word"].strip(),"s":float(w["start"]),"e":float(w["end"])})
    if len(words) < 10:
        raise Fail(f"whisper returned only {len(words)} words -- timing unreliable")
    log(f"whisper ok: {len(words)} word timings")
    return words

def align(script, ww):
    """Attach Whisper timings to the ORIGINAL script words."""
    sw=[w for w in re.split(r"\s+", script.strip()) if w]
    sm=difflib.SequenceMatcher(a=[norm(x) for x in sw], b=[norm(x["w"]) for x in ww],
                               autojunk=False)
    t=[None]*len(sw); matched=0
    for tag,i1,i2,j1,j2 in sm.get_opcodes():
        if tag=="equal":
            for k in range(i2-i1):
                t[i1+k]={"w":sw[i1+k],"s":ww[j1+k]["s"],"e":ww[j1+k]["e"]}
            matched+=i2-i1
        elif j2>j1 and i2>i1:
            st,en=ww[j1]["s"], ww[j2-1]["e"]; n=i2-i1; step=(en-st)/n if n else 0
            for k in range(n):
                t[i1+k]={"w":sw[i1+k],"s":st+k*step,"e":st+(k+1)*step}
    for i,x in enumerate(t):
        if x is None:
            pv=next((t[j] for j in range(i-1,-1,-1) if t[j]),None)
            nx=next((t[j] for j in range(i+1,len(t)) if t[j]),None)
            s=pv["e"] if pv else 0.0; e=nx["s"] if nx else s+0.3
            t[i]={"w":sw[i],"s":s,"e":max(e,s+0.05)}
    ratio=matched/max(1,len(sw))
    if ratio < 0.55:
        raise Fail(f"only {ratio:.0%} of script words aligned to audio -- "
                   f"captions would drift out of sync")
    # timings must be non-decreasing
    for i in range(1,len(t)):
        if t[i]["s"] < t[i-1]["s"] - 0.01:
            t[i]["s"]=t[i-1]["s"]; t[i]["e"]=max(t[i]["e"], t[i]["s"]+0.05)
    log(f"alignment ok: {ratio:.0%} exact match")
    return t

def phrases(words, max_words=9, max_gap=0.5):
    """Group into on-screen phrases. Prefer sentence ends, then a real pause,
    then a conjunction. Never end a phrase on a dangling function word."""
    out, cur = [], []
    for i,w in enumerate(words):
        cur.append(w)
        bare = re.sub(r"[^A-Za-z']","", w["w"]).lower()
        ends_sent = w["w"].rstrip('"\u201d\u2019').endswith((".","!","?",":",";"))
        gap = (words[i+1]["s"]-w["e"]) if i+1<len(words) else 999
        nxt = re.sub(r"[^A-Za-z']","",words[i+1]["w"]).lower() if i+1<len(words) else ""
        want = ends_sent or gap>max_gap or len(cur)>=max_words or (nxt in BREAKERS and len(cur)>=4)
        if want and bare in DANGLERS and not ends_sent and len(cur)<max_words+2:
            continue                      # do not strand "the", "for", "and"...
        if want:
            out.append(cur); cur=[]
    if cur:
        if out and len(cur)<=2: out[-1].extend(cur)   # absorb a stub tail
        else: out.append(cur)
    return [{"text":" ".join(x["w"] for x in p).strip(),
             "s":p[0]["s"], "e":p[-1]["e"]} for p in out]

def split_lines(text, width):
    """Balanced wrap that will not leave a dangling function word."""
    lines = textwrap.wrap(text, width=width) or [text]
    changed=True
    while changed and len(lines)>1:
        changed=False
        for i in range(len(lines)-1):
            last = re.sub(r"[^A-Za-z']","",lines[i].split()[-1]).lower()
            if last in DANGLERS:
                w=lines[i].split(); moved=w.pop()
                lines[i]=" ".join(w); lines[i+1]=moved+" "+lines[i+1]
                changed=True
    if len(lines)>1 and len(lines[-1].split())==1 and len(lines[-1])<=6:
        lines[-2]+=" "+lines[-1]; lines=lines[:-1]
    return [l for l in lines if l.strip()]

def build_filter(ph, narr, dur):
    endc = narr+0.25; fb = dur-1.3
    f=["[0:v]format=rgba[base]"]
    f.append(f"[base]drawbox=x='60+50*sin(t/3.5)':y='560+45*cos(t/4.5)':w=960:h=760:"
             f"color=0x1C2736@0.6:t=fill:enable='lt(t,{endc:.2f})'[g1]")
    f.append("[g1]boxblur=60:2[g2]"); prev="g2"
    f.append(f"[{prev}][1:v]overlay=x=(W-w)/2:y=1556:enable='lt(t,{endc:.2f})'[lg]"); prev="lg"
    f.append(f"[{prev}]drawtext=fontfile={FM}:text='{esc(SITE)}':fontcolor=white@0.62:"
             f"fontsize=38:x=(w-text_w)/2:y=1704:enable='lt(t,{endc:.2f})'[br]"); prev="br"
    kend=min(ph[0]["e"]+0.35, narr)
    f.append(f"[{prev}]drawtext=fontfile={FM}:text='FOR FAMILIES ON THE OUTSIDE':"
             f"fontcolor={ACCENT}:fontsize=36:x=(w-text_w)/2:y=650:"
             f"enable='between(t,0.15,{kend:.2f})'[k]")
    f.append(f"[k]drawbox=x=(1080-140)/2:y=708:w=140:h=5:color={ACCENT}@0.95:t=fill:"
             f"enable='between(t,0.15,{kend:.2f})'[r]"); prev="r"
    idx=0; FIN=FOUT=0.26
    for i,p in enumerate(ph):
        L=len(p["text"]); first=(i==0)
        size = 82 if first else (76 if L<28 else (62 if L<50 else 52))
        lines = split_lines(p["text"], 20 if size>=72 else 27)
        blk=len(lines)*(size+18)
        y0 = 820 if first else (H//2-blk//2+10)
        s=p["s"]; e=min(p["e"]+0.28, narr); ve=min(e+FOUT, narr+0.05)
        for j,line in enumerate(lines):
            y=y0+j*(size+18)
            al=(f"if(lt(t,{s:.2f}),0,if(lt(t,{s+FIN:.2f}),(t-{s:.2f})/{FIN},"
                f"if(lt(t,{e:.2f}),1,if(lt(t,{ve:.2f}),1-(t-{e:.2f})/{FOUT},0))))")
            yy=f"{y}-16*(1-min(1,max(0,(t-{s:.2f})/{FIN})))"
            o=f"p{idx}"; idx+=1
            f.append(f"[{prev}]drawtext=fontfile={FB}:text='{esc(line)}':fontcolor={WHITE}:"
                     f"fontsize={size}:x=(w-text_w)/2:y='{yy}':alpha='{al}':"
                     f"enable='between(t,{s:.2f},{ve:.2f})'[{o}]"); prev=o
    f.append(f"[{prev}]drawbox=x=0:y=0:w='1080*min(t,{narr:.2f})/{narr:.2f}':h=8:"
             f"color={ACCENT}@0.9:t=fill:enable='lt(t,{endc:.2f})'[pb]"); prev="pb"
    ein=0.45
    ea=(f"if(lt(t,{endc:.2f}),0,if(lt(t,{endc+ein:.2f}),(t-{endc:.2f})/{ein},"
        f"if(lt(t,{fb:.2f}),1,max(0,1-(t-{fb:.2f})/1.3))))")
    f.append(f"[{prev}]drawbox=x=0:y=0:w={W}:h={H}:color=black@1:t=fill:"
             f"enable='gte(t,{endc:.2f})'[blk]"); prev="blk"
    f.append(f"[{prev}][2:v]overlay=x=(W-w)/2:y=640:enable='gte(t,{endc:.2f})'[elg]"); prev="elg"
    for txt,font,size,y in ((SITE,FB,70,1010),(PHONE,FSB,84,1128),
                            ("Free case review",FM,40,1268)):
        o=f"e{y}"
        f.append(f"[{prev}]drawtext=fontfile={font}:text='{esc(txt)}':fontcolor={BLUE}:"
                 f"fontsize={size}:x=(w-text_w)/2:y={y}:alpha='{ea}':"
                 f"enable='gte(t,{endc:.2f})'[{o}]"); prev=o
    f.append(f"[{prev}]fade=t=out:st={fb:.2f}:d=1.3:color=black[out]")
    return ";".join(f)

def verify_output(path, expect):
    if not os.path.exists(path) or os.path.getsize(path) < 50000:
        raise Fail("output missing or implausibly small")
    r=subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries",
      "stream=width,height,nb_frames","-show_entries","format=duration",
      "-of","json",path],capture_output=True,text=True)
    d=json.loads(r.stdout); st=d["streams"][0]
    if (st["width"],st["height"])!=(W,H):
        raise Fail(f"wrong dimensions {st['width']}x{st['height']}")
    got=float(d["format"]["duration"])
    if abs(got-expect)>1.5:
        raise Fail(f"duration {got:.1f}s differs from expected {expect:.1f}s")
    a=subprocess.run(["ffprobe","-v","error","-select_streams","a:0",
      "-show_entries","stream=codec_name","-of","csv=p=0",path],
      capture_output=True,text=True).stdout.strip()
    if not a: raise Fail("output has no audio track")
    log(f"output verified: {W}x{H}, {got:.1f}s, audio={a}")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--script",required=True); ap.add_argument("--out",required=True)
    ap.add_argument("--voice",default="helena")
    ap.add_argument("--logo-small",default="logo_small.png")
    ap.add_argument("--logo-end",default="logo_end.png")
    ap.add_argument("--workdir",default=".")
    a=ap.parse_args()
    acct=os.environ.get("CF_ACCOUNT_ID"); tok=os.environ.get("CF_API_TOKEN")
    email=os.environ.get("CF_EMAIL")
    if not acct or (not tok and not os.environ.get("CF_API_KEY")):
        log("FATAL: set CF_ACCOUNT_ID and CF_API_TOKEN (or CF_API_KEY + CF_EMAIL)")
        sys.exit(1)
    for p in (FB,FSB,FM,a.logo_small,a.logo_end):
        if not os.path.exists(p):
            log(f"FATAL: missing required asset {p}"); sys.exit(1)
    script=open(a.script).read().strip()
    wd=a.workdir; audio=os.path.join(wd,"vo.mp3"); wj=os.path.join(wd,"whisper.json")
    try:
        check_script(script)
        narr=tts(script,acct,tok,email,a.voice,audio)
        ww=transcribe(audio,acct,tok,email,wj)
        ph=phrases(align(script,ww))
        log(f"phrases: {len(ph)}")
        for p in ph: log(f"   {p['s']:5.2f}-{p['e']:5.2f}  {p['text']}")
        dur=narr+TAIL
        fp=os.path.join(wd,"filter.txt")
        open(fp,"w").write(build_filter(ph,narr,dur))
        r=subprocess.run(["ffmpeg","-y","-f","lavfi",
          "-i",f"color=c=0x0E1116:s={W}x{H}:d={dur}:r=30",
          "-i",a.logo_small,"-i",a.logo_end,"-i",audio,
          "-filter_complex_script",fp,"-map","[out]","-map","3:a",
          "-c:v","libx264","-preset","medium","-crf","20","-pix_fmt","yuv420p",
          "-c:a","aac","-b:a","160k","-r","30","-t",f"{dur}",a.out],
          capture_output=True,text=True)
        if r.returncode: raise Fail(f"ffmpeg failed:\n{r.stderr[-900:]}")
        verify_output(a.out,dur)
        log(f"SUCCESS -> {a.out}")
    except Fail as e:
        log(f"FAILED: {e}"); sys.exit(3)
    except Exception as e:
        log(f"UNEXPECTED: {type(e).__name__}: {e}"); sys.exit(2)

if __name__=="__main__": main()
