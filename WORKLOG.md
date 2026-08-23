# WORKLOG — running session log (append-only)

**Every Claude session (chat or Cowork) that touches this repo appends one
entry here, newest first, in the same commit as its final push. Same protocol
and entry template as `prisonerlegalaid-com/WORKLOG.md` — read that file's
header if this is your first session. If a session touches both sites, log in
both repos and say so in each entry.**

---

## 2026-08-23 · chat · 0c1da23 — Stripe live; $149 pay button added to /case-file/
- **Stripe is connected and the full catalogue is built in LIVE mode** (`livemode: true` verified
  on every object). Connection `029a720c-aa6d-8bf8-9dc1-d3378d346ac9` "Prisoner Legal Aid LLC",
  set as the Zapier default. 6 products, 8 prices, 6 payment links — all created via API, no
  dashboard work. Full ID table in
  `prisonerlegalaid-com/claude/HANDOFF-2026-08-22-writ-large-offer-and-stripe.md` §4b.
- Did: added the **$149 payment link as a SECONDARY CTA** on `/case-file/`, below the free
  case review, framed "Already spoken with us and ready to go ahead?".
  **Deliberately not the primary button.** This page's architecture funnels through the free
  review first, and the page promises *"if your case is largely sealed, we will tell you before
  taking payment, not after."* A prominent self-serve buy button invites cold payment ahead of
  that conversation and puts the page at odds with its own promise. Secondary framing keeps the
  call in front of the money.
- **Backstop for anyone who pays cold anyway:** the Stripe checkout confirmation message repeats
  the sealed-record promise and commits to a full refund. Set at link creation.
- **Legal-position language on this page was NOT touched** and was asserted intact after the
  edit: the "we do not evaluate the case" sentence, the "not a law firm" sentence, and the
  "before taking payment, not after" sentence all verified present post-patch.
- Verified: build clean 46 files; link renders in `_site/case-file/index.html`; `buy.stripe.com`
  appears on that page and **no other page** in the build.
- **Process note:** the code commit (0c1da23) shipped WITHOUT this entry because the WORKLOG
  anchor assertion failed on an en-dash mismatch and the shell continued past it. The assert did
  its job — it caught a bad edit rather than corrupting the file — but it was not wired to abort
  the commit. **A future session should `set -e` or gate the commit on the log edit succeeding.**
- Open for Chris: statement descriptor (`PRISONER LEGAL AID`) is an account setting, not an API
  object — one field in Stripe settings, his only manual task.

## 2026-08-22 · chat · (this commit) — www.prisonerlegalaid.blog canonicalization

- **Reported:** `www.prisonerlegalaid.blog` goes nowhere.
- **Root cause: no DNS record exists for the `www` hostname on the .blog zone.**
  `getent hosts www.prisonerlegalaid.blog` returns NXDOMAIN; curl returns 000 (connection
  never established). The apex resolves and serves 200 normally. `.com` has both a www DNS
  record and a Worker redirect; `.blog` had neither.
- **Fixed in code here:** added the `www -> apex` 301 to `worker/index.js`, mirroring .com.
- **NOT fixable from code — requires a Cloudflare dashboard change by Chris:** add a proxied
  DNS record for `www` on the prisonerlegalaid.blog zone. Until that record exists the
  hostname is NXDOMAIN and requests never reach the Worker, so the redirect above cannot
  fire. Code alone does not resolve this.
- Diagnostic to re-run after the DNS record is added:
  `curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}' https://www.prisonerlegalaid.blog/`
  Expect `301 -> https://prisonerlegalaid.blog/`.

---

## 2026-08-22 · chat · prior — add /case-file/ front-end offer page
- Did: new `/case-file/` page — the Docket & Record Retrieval offer approved by Chris as the
  paid front-end hook (free case review sits in front of it). Added to nav + footer, added to
  sitemap (44 urls now).
- **Pricing published: flat $149, all retrieval fees included, credited toward engagement.**
  Chris clarified 2026-08-22 that **standing rule 4 (no dollar figures) governs the .com site
  only — it does not bind .blog.** Writ Large may publish prices. `.com` remains price-free.
- **Engagement pricing (§2255 / §2241 / compassionate release) stays quote-only by choice**,
  not by rule: quoting collateral-attack work sight-unseen invites a competitor to undercut a
  published number, and high-ticket work converts better on a call. Only the front-end offer
  is public.
- Positioning is deliberately clerical — "document retrieval and organization," explicit
  "we do not evaluate the case or recommend a course of action." That framing is what keeps
  this offer clear of the scrivener line; do not soften it into case-evaluation language.
- Note for a future session: the base.njk footer still reads "Writ Large does not currently
  employ attorneys directly." Attorney oversight was confirmed for .blog on 2026-08-22, so an
  oversight line may now be addable — but that sentence is a legal disclaimer and was NOT
  touched here. Chris/counsel decide its wording, not a drafting session.
- Verified: build clean 45 files; page renders; no `$` figures in output; sitemap includes it.

---

## 2026-08-22 · chat · c9e219a — host Google Search Console verification file
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
