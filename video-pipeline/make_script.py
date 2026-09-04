#!/usr/bin/env python3
"""Turn a published post's verified answer block into a 45-80 word video script.

Uses the answer block specifically because it already passed the Agent OS legal
verifier -- the factual claims in the video are the same ones that cleared
review. Nothing new is asserted here.
"""
import glob, json, os, re, sys

MIN_W, MAX_W = 45, 80
STATE = "video-pipeline/rendered.json"

def field(fm, key):
    m = re.search(rf'^{key}:\s*"(.*)"\s*$', fm, re.M)
    return m.group(1) if m else None

def spoken(t):
    """TTS reads bare section numbers badly. Spell the common ones."""
    t = re.sub(r"§\s*", "", t)
    for a, b in [("2255","twenty-two fifty-five"), ("2254","twenty-two fifty-four"),
                 ("2241","twenty-two forty-one"), ("3582","thirty-five eighty-two"),
                 ("1983","nineteen eighty-three")]:
        t = t.replace(a, b)
    t = re.sub(r"\b\d+\s*U\.?S\.?C\.?\s*", "", t)
    return re.sub(r"\s+", " ", t).strip()

def main():
    done = set()
    if os.path.exists(STATE):
        done = set(json.load(open(STATE)).get("rendered", []))

    candidates = []
    for path in sorted(glob.glob("src/posts/*.md")):
        slug = os.path.basename(path)[:-3]
        if slug in done: continue
        txt = open(path, encoding="utf-8").read()
        if txt.count("---") < 2: continue
        fm = txt.split("---")[1]
        if 'track: "post-conviction"' not in fm: continue
        ans, title = field(fm, "answer"), field(fm, "title")
        if not ans or not title: continue
        candidates.append((slug, title, ans))

    if not candidates:
        print("::notice::No unrendered post with an answer block. Nothing to do.")
        sys.exit(78)          # neutral: not a failure

    slug, title, ans = candidates[-1]     # newest first
    body = spoken(ans)
    words = body.split()

    if len(words) > MAX_W - 8:
        cut = " ".join(words[:MAX_W - 10])
        body = cut.rsplit(".", 1)[0] + "." if "." in cut else cut
    tail = "Find out where you stand before anything else."
    script = (body + " " + tail).strip()

    n = len(script.split())
    if n < MIN_W:
        print(f"::warning::script only {n} words for {slug}; skipping rather than "
              f"publishing filler")
        sys.exit(78)
    if n > MAX_W:
        script = " ".join(script.split()[:MAX_W])

    open("video-pipeline/script.txt", "w").write(script + "\n")
    with open(os.environ.get("GITHUB_OUTPUT", "/dev/stdout"), "a") as f:
        f.write(f"slug={slug}\n")
        f.write(f"title={title}\n")
    print(f"script for {slug}: {len(script.split())} words")
    print(script)

if __name__ == "__main__":
    main()
