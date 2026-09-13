# PROJECT_STATE — prisonerlegalaid-blog

_Updated: 2026-09-12 by a claude.ai chat session, homepage hero photo added_

## Status
CLAIM-008 homepage case-review heading rename is live on main in merge commit `7250fafc4701e1f48dff48c6d9b3845e11b61701`. Local build and exact output checks passed 2026-09-09. The requested cross-repository `claude/00-IN-FLIGHT.md` ledger is not present locally or in the related repository's `origin/main` history.

## Active work
- (none claimed on this repo right now)

**CROSS-ACTOR CLAIM BOARD — READ BEFORE STARTING ANYTHING.** It is now committed
to the prisonerlegalaid-com repository at `claude/00-IN-FLIGHT.md`, not only in
Chris's Claude Project. A prior run of this repo recorded that it went looking for
that file in git and could not find it; that gap is closed. It carries the full
2026-09-12 change log for BOTH repos, the standing rules on the cases-won pages,
the stock-photo constraint on the hero, and the open items handed to Chris.

## Recently completed (last 7 days)
- Homepage hero photo band ADDED — 2026-09-12, direct to main at Chris's express instruction
  (branch+PR step waived by him for this change). New files `src/img/hero-team-{wide,portrait}.{jpg,webp}`;
  `src/index.njk` gained a `.hero-photo-band` figure after the hero CTA row; `src/css/style.css` gained the
  matching styles (16:9 wide, 3:2 on mobile portrait so no one in the group shot is cropped out).
  Same photo is in use on prisonerlegalaid.com. Verified with a local Eleventy build (76 files, no errors)
  before pushing, then live-verified. NOTE: the hero photo is STOCK IMAGERY, not Writ Large or PLA
  personnel — do not add any caption or alt text identifying these people as staff, leadership, or
  attorneys. PLA has no attorneys.
- CLAIM-008 homepage case-review heading rename — one content file updated exactly per payload;
  merged into main in merge commit `7250fafc4701e1f48dff48c6d9b3845e11b61701` on 2026-09-09.
- PR #3 merged into main in merge commit `c153dd7d804ff456c44c60aec35911006442a748` on 2026-09-09; the Weekly Video Bot workflow claim guard is live on main and stops before rendering when another session's claim is active.
- CLAIM-006 llms.txt + custom 404 page — implementation commit ff8c18ced42f781bcd88c92d403634b0ee4ccd1d; live-verified 2026-09-09 04:03 UTC (llms.txt 200 text/plain; missing path 404 with non-empty custom page).
- CLAIM-005 homepage pricing-copy fix — this commit; final commit SHA reported in the job completion.
- Credential + attorney-claim correction — PR #2, merge commit b364328 — deployed
  2026-09-08 00:18 UTC, live-verified (author credential "Paralegal" not "Certified
  Paralegal"; attorney-oversight framing corrected; homepage "Experienced paralegal team")
- 301 redirects + GA4 conversion events for 15 dead WordPress-era URLs — commit 26b45bc —
  2026-09-07
- Primary-source citation standard enforced at build time via tools/authority-audit.js —
  commit a78adec
- Filing checklists for the five post-conviction routes plus a PACER guide — commit 388f80a

## Blockers
- (none)

## Decisions in force
- Byline credential is "Paralegal," not "Certified Paralegal" — decided 2026-09-06, live
  2026-09-08. Only one of the two paralegals holds a NALA certificate; a colleague's
  credential cannot attach to a named byline.
- .blog does not compete for section-1983 search intent; prisonerlegalaid.com owns that
  lane — decided 2026-09-04. Existing 1983 posts on .blog stay untouched.
- "Under the oversight of a licensed attorney" is the authorized framing for document-prep
  oversight. Do not restate as "attorney-reviewed," "in-house counsel," or "all content is
  reviewed" — those claims were removed 2026-09-08 because they overstated attorney
  involvement.

## Claimed by another session
- (none active as of 2026-09-09)

## Next action
No repo-specific action queued.

---
This file is the current-state snapshot for THIS REPO ONLY. Detailed history belongs in
git log, commit messages, and worklogs — not here. When a line above stops being true,
delete it; do not append a correction below it. Read this file, including the Claimed
section, before starting any job on this repo — and update it as part of the same commit
when you finish substantive work here.
