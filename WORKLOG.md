# WORKLOG — running session log (append-only)

**Every Claude session (chat or Cowork) that touches this repo appends one
entry here, newest first, in the same commit as its final push. Same protocol
and entry template as `prisonerlegalaid-com/WORKLOG.md` — read that file's
header if this is your first session. If a session touches both sites, log in
both repos and say so in each entry.**

---

## 2026-08-22 · chat · (this commit) — host Google Search Console verification file
- Did: added `src/static/google987f21ef8371cd2b.html`, served at
  `/google987f21ef8371cd2b.html` via passthrough copy (not template processing, so the
  bytes Google fetches match the bytes it issued exactly — verified with `cmp`).
- Did: `eleventyConfig.ignores.add("src/static/**")` — without it Eleventy ALSO renders the
  file as a template and emits a stray duplicate at `/static/<name>/index.html`.
- **DO NOT DELETE THIS FILE.** Google requires it to stay in place permanently; removing it
  un-verifies the `prisonerlegalaid.blog` Search Console property. Noted in `.eleventy.js`.
- Verified: build 44 files; served file byte-identical to Google's original; no stray
  `/static/` output; sitemap unchanged at 43 urls and does not include the verify file.
- Open for next session: Chris clicks Verify in Search Console, then submits the sitemap.

---

## 2026-08-22 · chat · 5384cc7 — SEO: sitemap.xml + robots.txt Sitemap directive
- Did: added `/sitemap.xml` (`src/sitemap.njk`) — 43 URLs: `/`, `/litigation/`, `/blog/`,
  and every PUBLISHED post. Added `dateISO` and `newestPostDate` filters to `.eleventy.js`.
- Did: worker now serves its own `/robots.txt` with a `Sitemap:` directive. Cloudflare's
  managed robots.txt allowed crawling but pointed at no sitemap — same gap `.com` had.
- Did: **added `run_worker_first: true` to `wrangler.jsonc`.** This repo did not have it
  (`.com` did). Without it Cloudflare can bypass Worker logic entirely, so the new robots
  route would have silently never fired. This is a known, previously documented trap.
- **CRITICAL for anyone editing the sitemap:** it iterates `collections.posts`, NOT
  `collections.all`. This repo drip-publishes by filtering future-dated posts out of that
  collection — but Eleventy STILL WRITES those pages to disk, so they are live at their URL
  and merely unlisted. Iterating `collections.all` would submit the unpublished drip queue
  to Google. Verified by test this session: a post dated 2099-01-01 is written to `_site`
  but correctly excluded from the sitemap. Re-run that test if the sitemap is ever changed.
- Verified: build clean 44 files; sitemap parses as valid XML, 43 urls; drip-exclusion
  regression test passed; `wrangler.jsonc` still valid JSON.
- Also touched `.com` this session (see that repo's WORKLOG): same sitemap/robots work plus
  a footer Resources column and a homepage CTA fix.
- Open for next session: **Chris must add `prisonerlegalaid.blog` as a Search Console
  property and submit `https://prisonerlegalaid.blog/sitemap.xml`** — needs his Google
  account. Also: the drip vault was flagged as running low around Aug 26; when it refills
  with future-dated posts, confirm they stay out of the sitemap.

---

## 2026-08-21 · chat · 825790d
- Did: established this WORKLOG as part of the cross-session coordination
  protocol created today in the `.com` repo (its commit `5025bf3`). No `.blog`
  content or code changed this session.
- Verified: n/a — log-only commit.
- Open for next session: nothing from this session.
