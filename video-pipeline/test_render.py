"""Unit tests for the caption logic. These run without any network or GPU and
are the guard against silent regressions in the unattended pipeline."""
import sys, importlib.util
spec=importlib.util.spec_from_file_location("r","render.py")
r=importlib.util.module_from_spec(spec)
sys.argv=["x"]; spec.loader.exec_module(r)

fails=[]
def ok(cond,msg):
    print(("  PASS  " if cond else "  FAIL  ")+msg)
    if not cond: fails.append(msg)

print("split_lines: never strands a function word")
for text,width in [("Court appointed lawyers are usually appointed for the trial",20),
                   ("It is filed after the appeal in the same criminal case",20),
                   ("There is usually a one year deadline and it often starts",27),
                   ("No fee is required with this motion",20)]:
    lines=r.split_lines(text,width)
    bad=[l for l in lines[:-1]
         if __import__("re").sub(r"[^A-Za-z']","",l.split()[-1]).lower() in r.DANGLERS]
    ok(not bad, f"{text[:34]}... -> {lines} (no dangling)")

print("\nsplit_lines: no single short orphan line")
lines=r.split_lines("A lot of people think there is nothing more that can be done",27)
ok(not(len(lines)>1 and len(lines[-1].split())==1 and len(lines[-1])<=6),
   f"{lines}")

print("\nphrases: splits on sentence ends, absorbs stubs")
words=[{"w":w,"s":i*0.4,"e":i*0.4+0.35} for i,w in enumerate(
  "There is no filing fee. A lot of people think there is. It matters.".split())]
ph=r.phrases(words)
ok(len(ph)>=2, f"{len(ph)} phrases from 3 sentences")
ok(all(len(p["text"].split())>=2 for p in ph), "no one-word phrases")

print("\nphrases: never ends a phrase on a dangler")
words=[{"w":w,"s":i*0.35,"e":i*0.35+0.3} for i,w in enumerate(
  "Court appointed lawyers are usually appointed for the trial and the direct appeal today".split())]
ph=r.phrases(words)
import re as _re
bad=[p["text"] for p in ph[:-1]
     if _re.sub(r"[^A-Za-z']","",p["text"].split()[-1]).lower() in r.DANGLERS]
ok(not bad, f"phrase tails clean: {[p['text'] for p in ph]}")

print("\ncheck_script: rejects out-of-range and prohibited copy")
def raises(fn):
    try: fn(); return False
    except r.Fail: return True
ok(raises(lambda: r.check_script("too short")), "rejects short script")
ok(raises(lambda: r.check_script(" ".join(["word"]*200))), "rejects long script")
ok(raises(lambda: r.check_script(" ".join(["word"]*60)+" we guarantee release")),
   "rejects guarantee claim")
ok(r.check_script(" ".join(["word"]*60))==60, "accepts in-range script")

print("\nalign: original words survive a mis-transcription")
script="Court appointed lawyers are usually appointed"
ww=[{"w":"Court","s":0,"e":.3},{"w":"-appointive","s":.3,"e":.7},
    {"w":"lawyers","s":.7,"e":1.0},{"w":"are","s":1.0,"e":1.2},
    {"w":"usually","s":1.2,"e":1.6},{"w":"appointed","s":1.6,"e":2.0}]
t=r.align(script,ww)
ok(" ".join(x["w"] for x in t)==script, "displayed text == original script")
ok(all(t[i]["s"]<=t[i+1]["s"]+0.01 for i in range(len(t)-1)), "timings monotonic")

print("\nRESULT:", "ALL PASS" if not fails else f"{len(fails)} FAILURES")
sys.exit(1 if fails else 0)
