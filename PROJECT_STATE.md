# PROJECT_STATE — prisonerlegalaid-blog

_Updated: 2026-09-08 by Zo, CLAIM-005 completion_

## Status
Source updated for CLAIM-005; deployment verification pending. No open incidents.

## Active work
- (none claimed on this repo right now — check claude/00-IN-FLIGHT.md in the
  Prisonerlegalaid.com Claude Project for cross-repo claims before starting anything)

## Recently completed (last 7 days)
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
- (none active as of 2026-09-08)

## Next action
None queued specifically for this repo. Check claude/00-IN-FLIGHT.md for the current
cross-repo backlog.

---
This file is the current-state snapshot for THIS REPO ONLY. Detailed history belongs in
git log, commit messages, and worklogs — not here. When a line above stops being true,
delete it; do not append a correction below it. Read this file, including the Claimed
section, before starting any job on this repo — and update it as part of the same commit
when you finish substantive work here.
