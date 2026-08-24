# HANDOFF — `prisonerlegalaid.blog` ("Writ Large")

State doc for this repo. `WORKLOG.md` is the chronological trail; this is
current state. Neither replaces the other.

**The canonical cross-repo pickup doc lives in the `.com` repo:**
`claude/START-HERE-next-session.md`, plus that repo's `HANDOFF.md` §4 (Analytics)
and §7 (vendors). Read those too — they cover both sites.

---

## SESSION PICKUP (2026-08-24)

Two facts that bite on this site specifically:

1. **Site analytics only began collecting 2026-08-24.** Before that there was no
   tracking tag on this site at all. GA4's historical sessions on
   `prisonerlegalaid.blog` came from a retired WordPress/MonsterInsights install
   on `cyan-crane-673969.hostingersite.com` — not from this Eleventy build. **Do
   not cite pre-2026-08-24 traffic as a baseline.** Platform-native social numbers
   (TikTok, YouTube views) are unaffected.
2. **Juno is cancelled. Enrich Labs / "Helena" is NOT — status was undecided as
   of 2026-08-24.** Chris was trialling it one more day and would then cancel or
   keep it a month; his read is that driving the **web app directly** is much
   better than its emailed output. **Ask Chris for current status; do not record
   it as cancelled until he says so.** Marketing execution is in-house by default
   either way. Full detail in the `.com` repo's `HANDOFF.md` §7. The 4 TikTok
   scripts and 6 Instagram Reel scripts it produced remain under Chris's
   **"LEGAL QA HOLD — do not publish"** email of 2026-08-23 and are unpublished —
   that holds whether or not the vendor is kept.

## Shipped 2026-08-24

| What | Commit |
|---|---|
| `/pricing/`, `/free-tools/`, `/case-file-checklist/`; nav + footer + sitemap | `42635c2` |
| Transfer-request lead capture wired to n8n | `b105c15` |
| GA4 tag site-wide + new `/privacy/` page | `136a8f3` |

**Pricing page, deliberate choices:** $149 flat retrieval uses the PUBLIC Stripe
link `https://buy.stripe.com/aFa8wI4Wo4lYenw7qsaAw00`. The $1,499/$399-mo and
$1,199/$319-mo tiers are shown as **typical ranges with a call-for-quote CTA** —
the private Stripe links are deliberately NOT embedded, because publishing a
private link makes it de facto public. **The $99 FSA packet is excluded**; it is
still on HOLD and was verified absent from the build.

**Lead capture:** n8n workflow `CR8TaNM0kdTpldY9` ("PLA Transfer-Request Lead
Capture"), ACTIVE, webhook path `pla-transfer-lead`, pushes to ntfy topic
`pla-watch-493b29d9`. `src/js/transfer-request.js` posts to
`https://prisonerlegalaid.app.n8n.cloud/webhook/pla-transfer-lead`. **It only
fires when the optional email field is filled.** Tested end to end.

**Analytics:** GA4 `G-RBTXF3H1RX` in `src/_includes/base.njk`, `anonymize_ip: true`.
One shared property with `.com`, segmented by `hostName`. 49/49 pages tagged.

## Unfinished

**PDF-by-email on the transfer-request tool.** The payload never included PDF
bytes, and n8n has no Gmail/SMTP credential. Needs: (a) the jsPDF output captured
as base64 into the POST body, (b) a **Gmail App Password** added to n8n plus a
Send Email node with attachment. Chris approved the feature but never supplied the
password. **Do not substitute a workaround that emails him raw form data instead.**

## Open judgment call — NOT for a drafting session

The footer says *"Writ Large does not currently employ attorneys directly"* while
`/pricing/` and the Pro Se material lean on attorney oversight. Those two
statements are in tension. Flagged 2026-08-24, **deliberately untouched** —
this is Chris + counsel's call, not a drafting decision.

## Standing rules that apply here

- This site MAY publish prices. `.com` may not. Keep the brands separate.
- Banned from user-facing copy: the word **"referral"**, and **"in-house counsel"**
  (correct framing: "under the oversight of a licensed attorney").
- `/case-file/` language scoping the offer to document retrieval and organization
  with **no case evaluation or course-of-action recommendation** is a legal
  position. Do not soften it.
- Drip scheduling uses a future-date filter; the sitemap iterates `collections.posts`
  only, which is what keeps undripped posts out. Preserve that.
- Videos here require a manual `<iframe>` with `youtube-nocookie.com/embed/[ID]`.
  (`.com` supports `video:` front matter and auto-generates its CTA footer — this
  site does not.)
- Chris is **mobile-only on Android, voice-to-text, no computer.** He cannot run
  commands; every deliverable must open on a phone.
