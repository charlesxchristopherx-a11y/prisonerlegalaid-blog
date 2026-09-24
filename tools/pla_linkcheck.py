#!/usr/bin/env python3
"""
PLA LINK CHECKER — canonical. Run against live sites or a local _site build.

  python3 pla_linkcheck.py                     # both live sites
  python3 pla_linkcheck.py --site https://x    # one live site
  python3 pla_linkcheck.py --dir _site --base https://prisonerlegalaid.blog

Exit codes:  0 = every link resolves.  1 = at least one broken link.
Designed to be a BUILD GATE: a non-zero exit must fail the deploy.
"""
import re, sys, json, os, argparse, subprocess, concurrent.futures as cf
from urllib.parse import urljoin, urldefrag, urlparse

UA = "Mozilla/5.0 (compatible; PLA-LinkCheck/1.0)"
# Bare origins used only for <link rel=preconnect>; they 404 by design.
IGNORE_TARGETS = {"https://fonts.googleapis.com", "https://fonts.gstatic.com"}
# Hosts that refuse bots with 403 but are fine for humans. Reported as WARN, not FAIL.
SOFT_403_HOSTS = {"www.uscourts.gov", "uscourts.gov", "www.bop.gov", "www.linkedin.com",
                  "www.facebook.com", "www.instagram.com", "www.tiktok.com"}

def curl(url, method="GET", timeout=25):
    cmd = ["curl","-sS","-L","-m",str(timeout),"-A",UA,"-w","\n__S__%{http_code}"]
    if method == "HEAD": cmd.append("-I")
    cmd.append(url)
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout+10)
        m = re.search(r"__S__(\d{3})$", r.stdout)
        return (int(m.group(1)) if m else 0), (r.stdout[:m.start()] if m else "")
    except Exception:
        return 0, ""

A_RE   = re.compile(r'<a\b[^>]*?href\s*=\s*["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.I|re.S)
SRC_RE = re.compile(r'<(?:img|script)\b[^>]*?src\s*=\s*["\']([^"\']+)["\']', re.I)
CSS_RE = re.compile(r'<link\b[^>]*?rel\s*=\s*["\']stylesheet["\'][^>]*?href\s*=\s*["\']([^"\']+)["\']', re.I)

def text_of(h):
    h = re.sub(r'<[^>]+>', ' ', h)
    return re.sub(r'\s+', ' ', h).strip()

def collect_live(sites):
    pages = {}
    for s in sites:
        st, body = curl(s.rstrip("/") + "/sitemap.xml")
        if st != 200:
            print(f"FATAL: {s}/sitemap.xml returned {st}", file=sys.stderr); sys.exit(2)
        for u in re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body):
            pages[u] = None
    def grab(u):
        st, b = curl(u); return u, st, b
    with cf.ThreadPoolExecutor(8) as ex:
        for u, st, b in ex.map(grab, list(pages)): pages[u] = (st, b)
    return pages

def collect_dir(d, base):
    """HTML pages to scan, plus an index of EVERY built file.

    Build mode previously indexed only .html, so every stylesheet, image and PDF
    that exists on disk was reported 404 and the gate could never pass. The asset
    index below is what the resolver checks non-HTML targets against.
    """
    pages, assets = {}, set()
    for root, _, files in os.walk(d):
        for f in files:
            p = os.path.join(root, f)
            rel = os.path.relpath(p, d).replace(os.sep, "/")
            url = base.rstrip("/") + "/" + re.sub(r'(^|/)index\.html$', r'\1', rel)
            assets.add(url)
            if f.endswith(".html"):
                pages[url] = (200, open(p, encoding="utf-8", errors="replace").read())
    return pages, assets

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", action="append")
    ap.add_argument("--dir"); ap.add_argument("--base")
    ap.add_argument("--json")
    a = ap.parse_args()

    if a.dir:
        if not a.base: print("--dir requires --base", file=sys.stderr); sys.exit(2)
        pages, assets = collect_dir(a.dir, a.base); local = {u for u in pages} | assets
    else:
        sites = a.site or ["https://prisonerlegalaid.com", "https://prisonerlegalaid.blog"]
        pages = collect_live(sites); local = None

    occ = []
    for p, (st, body) in pages.items():
        if st != 200: continue
        for m in A_RE.finditer(body):
            raw = m.group(1).strip()
            if raw.startswith(("mailto:", "tel:", "javascript:", "#", "sms:")): continue
            occ.append((p, raw, urldefrag(urljoin(p, raw))[0], text_of(m.group(2))[:70], "link"))
        for rx, kind in ((SRC_RE, "asset"), (CSS_RE, "stylesheet")):
            for m in rx.finditer(body):
                raw = m.group(1).strip()
                if raw.startswith("data:"): continue
                occ.append((p, raw, urldefrag(urljoin(p, raw))[0], "", kind))

    targets = sorted({o[2] for o in occ
                      if o[2].startswith("http") and o[2] not in IGNORE_TARGETS})

    status = {}
    if local is not None:
        # Build mode checks INTERNAL links only. External targets were previously
        # compared against the local file index too, so every outbound link on the
        # site came back 404 and the gate failed permanently. Run live mode
        # (no --dir) to check external links.
        base_host = urlparse(a.base).netloc
        norm = {u.rstrip("/") for u in local}
        for t in targets:
            if urlparse(t).netloc != base_host:
                continue  # not this build's concern
            status[t] = 200 if (t.rstrip("/") + "/" in local or t in local
                                or t.rstrip("/") in norm) else 404
    else:
        def chk(t):
            st, _ = curl(t, "HEAD", 20)
            if st in (0, 403, 404, 405):
                st2, _ = curl(t, "GET", 25)
                if st2: st = st2
            return t, st
        with cf.ThreadPoolExecutor(10) as ex:
            for t, st in ex.map(chk, targets): status[t] = st

    fails, warns = [], []
    for p, raw, res, txt, kind in occ:
        st = status.get(res)
        if st is None or st < 400: continue
        host = urlparse(res).netloc
        row = (st, res, p, txt, raw, kind)
        (warns if (st == 403 and host in SOFT_403_HOSTS) else fails).append(row)

    deadpages = [(u, v[0]) for u, v in pages.items() if v[0] != 200]

    print(f"pages checked      : {len(pages)}")
    print(f"link targets tested: {len(targets)}")
    print(f"broken             : {len(fails)} occurrence(s)")
    print(f"warnings (soft 403): {len(warns)}")
    if deadpages:
        print(f"\nSITEMAP PAGES NOT 200 ({len(deadpages)}):")
        for u, st in deadpages: print(f"  {st}  {u}")
    if fails:
        print("\nBROKEN LINKS")
        by = {}
        for st, res, p, txt, raw, kind in fails: by.setdefault((st, res, raw), []).append((p, txt))
        for (st, res, raw), v in sorted(by.items(), key=lambda x: -len(x[1])):
            print(f"\n  [{st}] {res}")
            print(f"        href as written: {raw}")
            print(f"        anchor text    : {v[0][1]!r}")
            print(f"        appears on {len(v)} page(s):")
            for p, _ in v: print(f"          - {p}")
    if warns:
        print("\nWARNINGS — host refuses bots; verify by hand, do not auto-fix")
        for st, res, p, txt, raw, kind in warns:
            print(f"  [{st}] {res}  (on {p})")
    if a.json:
        json.dump({"fails": fails, "warns": warns, "deadpages": deadpages,
                   "pages": len(pages), "targets": len(targets)}, open(a.json, "w"), indent=1)
    if not fails and not deadpages:
        print("\nPASS — every link resolves.")
        return 0
    print(f"\nFAIL — {len(fails)} broken link occurrence(s), {len(deadpages)} dead page(s).")
    return 1

sys.exit(main())
