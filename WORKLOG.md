# WORKLOG — running session log (append-only)

**Every Claude session (chat or Cowork) that touches this repo appends one
entry here, newest first, in the same commit as its final push. Same protocol
and entry template as `prisonerlegalaid-com/WORKLOG.md` — read that file's
header if this is your first session. If a session touches both sites, log in
both repos and say so in each entry.**

---

## 2026-08-22 · chat · (this commit) — /case-file/ pay CTA redesign
- **Superseded same session:** the hand-drawn SVG arrow was replaced at Chris's request with a
  pointing-hand emoji that slowly fades in and out. SVG `.scrawl` styles and markup removed
  entirely — do not leave both. Fade is a 7.2s cycle (3.6s alternate), opacity .12 -> 1,
  measured live at .14 -> .98. `prefers-reduced-motion` holds it at full opacity.
  Emoji is `aria-hidden` — decorative only.
- Chris asked for the Stripe link to be "more apparent" with a hand-drawn red arrow.
- **Root issue was hierarchy, not the missing arrow:** the pay link used `btn-ghost` (the
  lowest-weight button style) directly beneath a solid red `btn-primary`, so the paid action
  read as less important than the free one. Arrow alone would not have fixed that.
- Changes: new `.btn-pay` (solid navy, larger, subtle drop shadow) — deliberately NOT red, so
  it does not compete with the free-review primary, which remains the intended first path.
  Added inline SVG `.scrawl` hand-drawn arrow in `--stamp` red, extending the existing
  `.stamp` annotation motif rather than importing a new visual language. Added
  "SECURE CHECKOUT · STRIPE" microcopy in the mono face.
- Arrow animates via `stroke-dashoffset` draw-on (shaft, then head). Guarded by
  `prefers-reduced-motion`. `aria-hidden` + `focusable=false` — decorative, not announced.
- **Direction was wrong on the first pass** (arrow pointed down into empty space while the
  button sat right). Caught by screenshotting at 412px and 1280px before pushing, not after.
  Keep verifying rendered output visually — a valid SVG path can still point nowhere.
- Stripe payment link live on the page: `buy.stripe.com/aFa8wI4Wo4lYenw7qsaAw00`.

---

## 2026-08-24 · chat · (this commit) — CORRECTION: OIG figure was wrong. Source docs now linked.
- **Chris set a standing rule: any document cited on the site must be linked so the reader can
  download the original.** Applying that rule to `/transfer-request/` immediately caught a
  factual error in copy shipped hours earlier.
- **The error.** The page said *"the OIG reported that 33 percent were not placed within 500
  driving miles."* Pulling OIG Report 25-083 shows **33 percent is the BOP's own straight-line
  number, which the OIG's Finding 1 exists specifically to criticize.** The OIG's own figure,
  measured in driving miles as the statute requires, is **approximately 41 percent.** Attaching
  "driving miles" to the 33 percent was precisely the mistake the audit was about.
- Corrected to 41 percent, and the straight-line vs driving-miles story is now told on the page —
  it is stronger material than the bare statistic was.
- Added, all verified in the report text: undercount affected 8,600+ inmates and the same error
  reached the reports to Congress; **26 of 100 sampled placements could not be justified** by BOP
  (Finding 2, Table 2); 69% of Native American inmates and 51% of women housed 500+ miles out.
- Added a **Sources** section and inline links. Both URLs HEAD-checked 200:
  · 18 U.S.C. § 3621(b) — uscode.house.gov (Office of the Law Revision Counsel)
  · DOJ OIG Report 25-083 PDF — oig.justice.gov
  Linked to the official government hosts rather than rehosting, so no one can claim the copy
  was altered.
- **Process lesson worth keeping:** the statute was verified before drafting, but the OIG figure
  came from a search snippet and was not. Snippet-sourced numbers get treated like unverified
  citations from now on — pull the document. Chris's "show me the source" rule is now the
  standing check for every statistic and every case cited on either site.
- Also: two Python asserts failed on entity-vs-literal mismatches (`&sect;` vs `§`) and correctly
  aborted before writing. Anchors are now taken from `grep` output rather than retyped.

## 2026-08-23 · chat · (this commit) — FREE closer-to-home transfer request tool shipped
- New page `/transfer-request/` + `src/js/transfer-request.js`. Nav link added (3 places).
  `.eleventy.js` now passes through `src/js` → `/js`.
- **What it does:** family fills a form; jsPDF builds a BP-A0148-style *Inmate Request to Staff*
  (cop-out) with a § 3621(b) argument and a continuation page, and downloads it. **100% client
  side** — no backend, no data leaves the device unless an email is given.
- **Statute verified before writing any of the copy.** FSA § 601 amended 18 U.S.C. § 3621(b):
  place "as close as practicable" to primary residence and "to the extent practicable" within
  500 driving miles — **subject to** bed availability, security designation, programmatic needs,
  medical/mental health needs, faith-based requests, sentencing court recommendations, and other
  BOP security concerns. Page and PDF both state the request is subject to those factors and that
  the decision rests with BOP. **No transfer is promised anywhere.**
- **Key positioning Chris called correctly:** this is NOT an FSA earned-time-credit benefit. It is
  a placement provision and applies to people excluded from earning ETCs. Page says so explicitly
  — that is the whole marketing wedge.
- Supporting fact used on the page: DOJ OIG audit 25-083 (Sept 2025) found 33% of evaluated
  inmates were not placed within 500 driving miles.
- **Workflow stated plainly on the page:** the inmate submits the cop-out, not the family and not
  Writ Large. Family prints → mails in → he signs/dates → hands to Unit Team.
- Tested headlessly (jsdom + jsPDF + pypdf), not assumed:
  · empty submit blocked, 4 required fields flagged
  · full-input PDF: 1 page, 2,423 chars extracted, all required strings present
  · minimal-input PDF: 1 page, 1,700 chars, still valid (optional paragraphs drop cleanly)
  · caught a real bug: form placeholders were third-person ("His mother is 71") but a cop-out is
    first-person and signed by the inmate — PDF read wrong. Placeholders + hints rewritten to
    first person and a bold instruction added to the section.
  · guarded `scrollIntoView` (absent in some in-app browsers).
- **Lead capture is built but DORMANT.** `LEAD_ENDPOINT` in the JS is an empty string, so no lead
  is posted. Wire it to an n8n webhook — the payload shape is already defined in the file
  (tool, email, requester, phone, inmate_name, reg_no, facility, home, miles, source, referrer, utm).
  **Until that endpoint is set, this tool captures zero leads** — it's a pure giveaway.
- Email delivery of the PDF is NOT built. Currently download-only. Needs the same n8n workflow.
- Pricing: **$449 tier cancelled by Chris.** Transfer request becomes a free top-of-funnel offer
  instead of a paid line item. Ladder is now: free review → free transfer request → $149 records
  → $1,199/$1,499 preparation.
- Open: n8n webhook URL for lead capture + PDF email; `/pricing/` page; Case File Checklist;
  `/free-tools/` hub.

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
