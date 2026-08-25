# WORKLOG — running session log (append-only)

**Every Claude session (chat or Cowork) that touches this repo appends one
entry here, newest first, in the same commit as its final push. Same protocol
and entry template as `prisonerlegalaid-com/WORKLOG.md` — read that file's
header if this is your first session. If a session touches both sites, log in
both repos and say so in each entry.**

---

## 2026-08-25 · chat · (this commit) — RULE VIOLATION FIXED: stop reproducing the BP-A0148 government form

- **STANDING RULE (Chris, this session): NEVER reproduce, recreate, or reformat a government
  form.** Obtain the official fillable PDF and fill it as-is. Applies to BP-A0148, AO-242,
  BP-9/10/11, IFP applications, everything. If an official fillable copy can't be found, say so
  and STOP — do not substitute a look-alike.
- **The violation:** `src/js/transfer-request.js` drew a from-scratch imitation of BP-A0148 with
  jsPDF — its own "INMATE REQUEST TO STAFF" masthead, "Federal Bureau of Prisons" line, and
  header grid. The file header literally said "Generates a BP-A0148-style Inmate Request to
  Staff." That is exactly what the rule forbids.
- **The fix:** downloaded the genuine form from `https://www.bop.gov/policy/forms/BP_A0148.pdf`
  (439 KB, 10 real AcroForm fields), now served at `/forms/BP_A0148.pdf` via a new `src/forms`
  passthrough. Generator rewritten from **jsPDF to pdf-lib** (CDN swap in `transfer-request.njk`)
  — it now loads the official PDF and populates its existing fields. Zero jsPDF references remain.
- **STAFF-ONLY FIELDS deliberately left blank — do not "helpfully" populate these:**
  `Disposition`, `Signature Staff Member`, `Date` (capital D). Those belong to BOP staff. The
  inmate's own date field is `DATE` (all caps). Field names are quirky and exact —
  `TOName and Title of Staff Member`, `REGISTER NO` (no period), body is `Text1`.
- Body text is wrapped by measuring against the real embedded font, sized to the actual `Text1`
  rect `[35.3, 346.9, 575.5, 544.8]`. Overflow goes to a **plain continuation sheet** — NOT a
  second form page — which the form itself contemplates ("Continue on back, if necessary").
  Output is flattened so it prints identically everywhere.
- **Verified by execution, not inspection:** ran the exact fill logic headlessly in Node against
  the real PDF with a full sample record, rendered both pages to PNG, and confirmed visually —
  header fields correct, DISPOSITION and staff signature block blank, continuation page clean.
  23 wrapped lines, 17 fit, 7 overflowed to page 2 as designed.
- Base64-to-webhook behavior from `6dbb49e` preserved; `run()` reworked to be promise-safe since
  pdf-lib is async. Lead still posts even if PDF generation fails.
- Backup of the old jsPDF version was kept only in the session sandbox, not committed — the
  reproduction should not live on in the repo.


## 2026-08-24 · chat · (this commit) — MAJOR FINDING: transfer-request PDF never reached n8n; fixed (6dbb49e)

- **Root finding: "email the PDF" was never architecturally possible with the shipped code.**
  `jsPDF`'s `doc.save(...)` triggers a browser-local download only. The webhook payload sent to
  `pla-transfer-lead` (`src/js/transfer-request.js`) contained text fields ONLY — name, reg #,
  facility, email — **zero PDF bytes, ever.** The Gmail App Password blocker documented
  elsewhere was necessary but not sufficient; there was nothing to attach even with working SMTP.
- **Fix, in commit `6dbb49e`: `generate(d)` now returns `{filename, base64}`** via
  `doc.output('datauristring')`, split on the (single, verified) comma to isolate the base64
  payload. `doc.save(...)` is UNCHANGED and still fires first — the local download behavior is
  untouched, this is additive only. `pdf_filename` and `pdf_base64` added to the existing
  webhook JSON body.
- **Verified, not assumed:** ran the actual extraction line
  (`doc.output('datauristring').split(',')[1]`) against a real jsPDF-generated document in
  Node, decoded the resulting base64, and confirmed a valid `%PDF-1.3` file header. End-to-end
  round-trip test of the exact shipped code, not a syntax check.
- Build verified clean; `_site/js/transfer-request.js` confirmed to contain the new fields.
- **n8n side (workflow `CR8TaNM0kdTpldY9`) still needs:** a node to convert `body.pdf_base64`
  from JSON to binary (Move Binary Data, mode `jsonToBinary`), an Email Send node with the
  binary attached, and an SMTP credential. **Credential creation blocked on Chris rotating the
  Gmail App Password** he pasted into chat by mistake this session — treat any App Password
  from before 2026-08-24 ~1:30pm as compromised; do not use it if found anywhere.
- **Also this session: Chris provided a live n8n API key in-chat** (accepted deliberately,
  unlike the Gmail password — the key is instantly revocable from n8n Settings -> API with no
  downstream account risk, unlike an inbox credential). Used via `bash_tool` + `curl` against
  `https://prisonerlegalaid.app.n8n.cloud/api/v1/...`. **Chris should rotate this key once the
  n8n-side work this session is complete**, same as the Gmail password.

## 2026-08-24 · chat · (this commit) — Enrich Labs decision FINAL: cancelled, fully in-house

- Docs only. Companion to `.com` commit cf094e3.
- Chris decided against keeping Enrich Labs' free tier: **"I say we just do everything
  ourselves."** Both vendors now cancelled, final. `HANDOFF.md` updated to remove the
  "undecided" framing.

## 2026-08-24 · chat · (this commit) — Terms of Service + Refund Policy added

- **Reason: Stripe onboarding.** Chris found `.blog` had a privacy page but no Terms of
  Service and no refund policy at all, while taking live payment for a $149 flat product,
  quoted document-prep engagements, and 4-month payment plans. That's a real gap for a
  payments-account underwriting review, not just a nice-to-have.
- New `/terms/` — same UPL-safe pattern as `.com`'s terms.njk (no attorney-client relationship,
  no guaranteed outcome, "under the oversight of a licensed attorney" phrasing, client remains
  responsible for filing/deadlines). Adds a payment/engagement section specific to `.blog`
  services and links out to the new refund policy.
- New `/refund-policy/` — full refund pre-drafting, partial refund for unearned work once
  drafting has begun, completed+delivered documents are non-refundable, payment-plan
  cancellation stops future installments with no cancellation fee, explicit "a refund is not
  available because a court ruled against you" clause. Numbers used ($149 Case File, 60-day
  credit window, 4 monthly payments) are pulled directly from the live `/pricing/` page —
  nothing invented.
- **Chris said he will review/edit both after this session** — treat current text as a working
  draft, not final-approved copy, until he confirms.
- Both wired into the footer nav (`_includes/base.njk`) next to the existing Privacy link.
- Verified: clean build, both routes present in `_site`, footer links resolve.

## 2026-08-24 · chat · (this commit) — Brand identity shipped here for the first time

- Companion to `.com` commit `272d20a`. Read that repo's WORKLOG entry for the full rationale.
- **This site had NO favicon, NO icon tag, NO `src/img` directory, NO canonical tag, and NO
  Open Graph or Twitter tags.** Every Writ Large link shared on social or by text rendered
  with no title card and no image. All of it added.
- Added: `favicon.ico`, `icon-{48,96,144,180,192,512}.png`, `logo-square.png`,
  `og-card.jpg` (1200x630 Writ Large card), `/site.webmanifest`. New `src/img` and
  `site.webmanifest` passthrough copies in `.eleventy.js`.
- Added `Organization` JSON-LD: name "Writ Large", legalName "Prisoner Legal Aid LLC", phone,
  principal-office address, `sameAs` -> `.com`. **Type is `Organization` on purpose — not
  `LegalService`, not `Attorney`. Do not change it.**
- **Header brandmark changed from the `§` glyph to the PLA logo image.** New `.brandmark-img`
  class in `style.css`; the original `.brandmark` glyph rule is left intact.
  **Revert = restore `<span class="brandmark">§</span>` in `src/_includes/base.njk`.**
- **Cross-brand rule clarified by Chris:** separation is about funnel and practice area, not
  visual identity. Shared logo across both brands is approved. See `.com` HANDOFF §2.
- Verified: clean build, JSON-LD machine-parsed, all assets present in `_site`, 49/49 pages.

## NOTE — ordering: the 2026-08-22 entry below sits out of sequence (it predates the
## 2026-08-24 entries that follow it). Left in place rather than silently reordered history.

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

## 2026-08-24 · chat · (this commit) — CORRECTION: Enrich Labs is NOT cancelled

- Docs only. Companion to `.com` commit f8e7bca.
- The pickup block added in 315aab2 said both marketing vendors were cancelled. **Wrong about
  Enrich Labs** — Chris had not cancelled it and was still evaluating it (one more trial day,
  then cancel or keep for a month). **Juno remains cancelled.**
- `HANDOFF.md` fact 2 rewritten to say status is undecided and to instruct future sessions to
  ASK Chris rather than assume. The LEGAL QA HOLD on the 4 TikTok + 6 Instagram scripts stands
  either way.

## 2026-08-24 · chat · (this commit) — HANDOFF pickup block appended

- Docs only; no site output changed. Companion to `.com` commit d7343af.
- **CORRECTION to this entry's first push (c84a9c1): that commit claimed a HANDOFF block was
  appended, but this repo had NO `HANDOFF.md` and the script silently failed. `HANDOFF.md` has
  now been CREATED here. Treat c84a9c1's description as inaccurate.**
- Created `HANDOFF.md` for this repo, with a "SESSION PICKUP (2026-08-24)" block pointing at the canonical
  pickup doc (`claude/START-HERE-next-session.md` in the `.com` repo) and restating the two
  facts that bite on this site specifically: analytics only began collecting 2026-08-24
  (pre-that traffic came from a retired WordPress install, not this build), and both external
  marketing vendors are cancelled with their scripts still under LEGAL QA HOLD.
- Also records what shipped here today (42635c2, b105c15, 136a8f3), the unfinished
  PDF-by-email work and exactly what it needs, and the footer/attorney-oversight tension
  that is reserved for Chris and counsel.

## 2026-08-24 · chat · (this commit) — ANALYTICS WERE DEAD. GA4 tag added to every page + /privacy/ created

- **Root-cause finding, and it invalidates recent traffic reasoning.** Ran the first in-house
  marketing audit against GA4 directly (Zapier connection authorized this session). GA4
  property 520455352 returned **zero rows for Aug 1-23 and zero for the trailing 28 days.**
  Monthly sessions 2026: Jan 58, Feb 35, Mar 7, Apr 7, May 1, Jun 3, Jul 19, **Aug 0**.
- **Cause: neither live site had any analytics tag at all.** Verified by grepping the Eleventy
  source AND fetching both live homepages — no `gtag`, no `googletagmanager` on
  prisonerlegalaid.blog or prisonerlegalaid.com.
- **Where the old data came from:** all 130 historical sessions are on hostname
  `prisonerlegalaid.blog`, and the GA property carries custom dimensions `wp_user_id`,
  `post_type`, `is_affiliate_link`. The data stream was named
  *"MonsterInsights - https://cyan-crane-673969.hostingersite.com"*. **That is a WordPress
  site on Hostinger that the current Eleventy build replaced.** The Eleventy templates were
  never given a tag, so collection stopped when the WordPress site went away. Nobody noticed
  because nobody was reading GA.
- **Consequence worth remembering: any traffic-based claim made in the Juno/Enrich Labs era
  rests on a dataset that had stopped collecting.** Platform-native social numbers (e.g.
  TikTok's 689-view figure) are unaffected — those come from the platforms, not GA.
- **Fix shipped (Chris chose Option 1: one shared property, segment by hostName).** GA4
  `G-RBTXF3H1RX` added to `<head>` in `src/_includes/base.njk` here and in the `.com` repo's
  base.njk (separate commit, same session). `anonymize_ip: true` set. Verified **49/49 blog
  pages** carry the tag; on `.com`, 49/51 — the two exceptions are `/team/automation-setup/`
  and `/team/followups/`, internal tool pages on a different layout, deliberately untracked.
- **Stale GA config corrected via Admin API:** data stream 13326171998 renamed from the
  MonsterInsights/Hostinger string to "Prisoner Legal Aid — .com + .blog (Eleventy)" and its
  defaultUri re-pointed from the hostingersite.com staging URL to https://prisonerlegalaid.com.
- **Privacy work done as part of the same change, not deferred.** Adding cookie-setting
  analytics to a site serving families of incarcerated people obliges disclosure:
  · NEW `/privacy/` page on `.blog` (this repo had none) — states plainly that the
    transfer-request tool runs client-side, that **only the optional email field is
    transmitted**, that form input is never sent to GA, and restates the not-a-law-firm /
    monitored-facility-communications limits.
  · `.com` already had `/privacy-policy/` but it **did not mention analytics or cookies at
    all** — a "Website analytics and cookies" section was added there and the Last-updated
    date moved to August 2026.
  · Footer "Privacy" link added on `.blog`; `/privacy/` added to sitemap (49 urls, XML valid).
- **Three stale key events exist in GA** (`qualify_lead`, `purchase`, `close_convert_lead`) —
  WordPress-era leftovers that will never fire on the current sites. Left in place, flagged;
  real conversion events should be defined once traffic data exists again.
- **Deliberately NOT built this session: the recurring weekly audit workflow.** It would have
  faithfully reported zeros. Standing it up is pointless until this tag has collected data —
  revisit after ~1 week of live collection. Architecture Chris chose: hybrid ("Option C") —
  n8n keeps lead capture + drip posting; recurring *reporting* runs as a Cowork scheduled
  task against the Zapier connections, because n8n's YouTube credential is tied to a Google
  Cloud project (922902152529) with the YouTube Analytics API disabled, n8n has no GA4
  credential, and n8n has no Meta credential for Instagram.
- **Platform connection status after this session (Zapier):** Instagram ✅ (authorized under
  jamellhumphrey8@gmail.com — the Meta Business admin account, confirmed intentional),
  LinkedIn ✅ (post-only; no analytics read actions exist), YouTube ✅ **both** channels
  (verified by API: UCWGrdHP_8NanRsuV_BwR19A = @prisonerlegal/.blog,
  UC8OGpuULR69am3VVphh6lqw = @PrisonerLegalAidChannel/.com), GA4 ✅.
  **No route available for TikTok** (Zapier offers only Ads/Lead-Gen, not content analytics),
  **Twitter/X** (absent from Zapier's catalog), or **Search Console** (absent from catalog).
- Verified before push: build clean (49 files); single `</head>` per page; sitemap parses;
  no banned terms on the new page; gtag config carries no user-supplied values.

## 2026-08-24 · chat · (this commit) — Transfer-request lead capture LIVE via n8n

- **Closed the last named open item from 2026-08-23: the n8n webhook for `/transfer-request/`
  lead capture.** Chris supplied an n8n API key this session (used only in-session, not
  committed to the repo or logged anywhere in plaintext in this file).
- New n8n workflow **"PLA Transfer-Request Lead Capture"** (id `CR8TaNM0kdTpldY9`), active,
  webhook path `pla-transfer-lead`. Mirrors the existing "PLA Lead Nurture (guide downloads)"
  workflow's pattern: webhook → `ntfy.sh` push to the same topic Chris already has on his
  phone (`pla-watch-493b29d9`), no email/SMTP credential required. Alert includes requester
  name/email/phone, inmate name/reg#/facility, home location and computed driving miles, and
  a suggested same-day opener specific to this offer (distinct from the guide-download
  opener already in the Lead Nurture workflow).
- `src/js/transfer-request.js` `LEAD_ENDPOINT` updated from `''` to
  `https://prisonerlegalaid.app.n8n.cloud/webhook/pla-transfer-lead`. **Only fires when the
  optional email field is filled in** — this is existing behavior in the file, unchanged.
- **Verified end-to-end before and after deploy:** posted a POST directly to the production
  webhook URL with the requester name prefixed `[TEST - ignore]` so it's unmistakable if
  Chris sees it on his phone; got `{"message":"Workflow was started"}` back. Confirmed the
  built `_site/js/transfer-request.js` contains the new endpoint string post-build.
- **What this does NOT do yet: it does not email the PDF to the requester.** The current
  payload (unchanged, pre-existing) never included the PDF bytes — only lead metadata — so
  there was nothing to email even if a send-email step existed. n8n has no Gmail/SMTP
  credential configured on this account (checked via API: only GitHub, Telegram, two Google
  Drive, YouTube, OpenAI/OpenRouter, Buffer). **To build PDF-by-email:** (1) capture the
  jsPDF output as base64 in `transfer-request.js` and add it to the POST body, (2) add a
  Gmail or SMTP credential to n8n (a Gmail **App Password** is the fastest path — Google
  Account → Security → App Passwords, no OAuth browser flow needed, works from a phone) and
  a Send Email node with an attachment. Neither done this session; flagged to Chris.
- No site copy, pricing, or legal-position language touched this session beyond the one
  JS constant. Build verified clean before push.

## 2026-08-24 · chat · (this commit) — /pricing/, /free-tools/, /case-file-checklist/ shipped; sitemap gaps closed

- **Context: both Juno and Enrich Labs ("Helena," a marketing-automation SaaS Chris trialed
  Aug 23-26) are discontinued/being canceled.** Chris directed marketing execution move fully
  in-house: "do their would-be work. Build a funnel and implement." Helena never delivered the
  funnel-architecture doc her assignment asked for (per-app automation-idea emails and 4
  TikTok + 6 IG Reel drafts only — those drafts remain under Chris's LEGAL QA HOLD, unpublished).
- **Closed three named open items from the 2026-08-23 entries: `/pricing/`, `/free-tools/`,
  Case File Checklist.**
- `/pricing/` — publishes the $149 flat retrieval fee with the live public Stripe link
  (`buy.stripe.com/aFa8wI4Wo4lYenw7qsaAw00`), plus the $1,499/$399-mo and $1,199/$319-mo
  **typical ranges** for post-conviction and compassionate-release preparation with a
  call-for-quote CTA. **Deliberately does NOT embed the private Stripe payment links**
  (`.com` HANDOFF §4b marks those `private`; publishing the URL makes it de facto public,
  which would undo the recorded reasoning — quoting collateral work sight-unseen invites
  undercutting and converts worse than a call). **$99 FSA packet excluded entirely** — still
  on HOLD, no live page exists for it, verified absent from build output.
- `/free-tools/` — hub linking free case review, `/transfer-request/`, and the new checklist.
- `/case-file-checklist/` — new static page: plain-language list of what's public on a federal
  docket (docket sheet, indictment/information, judgment & commitment, plea agreement,
  sentencing transcript, appellate record) vs. what's typically sealed (PSR). No case
  citations, no case-evaluation language — describes document types only, consistent with
  the site's clerical positioning. Cross-links to `/case-file/`.
- Nav: added "Pricing" to desktop + mobile nav (3 places in `base.njk`); added "Pricing" and
  "Free Tools" to footer Navigate column. Case File Checklist intentionally NOT in main nav
  (reached via `/free-tools/` and `/case-file/`), matching the .com SM6/SM7 precedent of
  cross-links over nav bloat for secondary pages.
- **Sitemap gap found and fixed:** `/transfer-request/` was never in `sitemap.xml`'s static
  URL block (pre-existing gap, unrelated to this session's new pages). Added it along with
  the three new pages. Verified: sitemap parses as valid XML, all four new URLs present,
  `collections.posts`-only iteration for blog posts preserved (drip-exclusion behavior
  untouched).
- Verified before push: build clean (48 files); scanned all three new pages' rendered HTML
  for banned terms (`referral`, `in-house counsel`, `Certified Peer Legal`) — none found;
  scanned for the $99/FSA payment-link string — none found; only the public $149 link appears
  on `/pricing/`; phone number consistently 786-408-5073.
- **Did NOT touch:** the footer's "Writ Large does not currently employ attorneys directly"
  sentence (a legal disclaimer previously flagged as Chris/counsel's call, not a drafting
  session's) — new pages avoid asserting attorney-oversight language that could conflict
  with it.
- **Open, blocking further automation:** n8n API key not available to this session — cannot
  wire the `/transfer-request/` lead-capture webhook (`LEAD_ENDPOINT` still empty in
  `transfer-request.js`) or build any n8n-based recurring audit/distribution workflow to
  replace what Helena/Juno were doing. Asked Chris for the key or for him to build the
  webhook + Gmail-send workflow in the n8n UI using the payload shape already documented in
  that file.
- Content-drafting side (what Juno used to do) is unaffected by any of this — the .blog
  `CONTENT_QUEUE.md` drip-publishing pipeline is separate and continues on its own cadence.

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
