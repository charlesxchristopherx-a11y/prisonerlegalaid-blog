# Writ Large (.blog) — Daily Post-Conviction Content Queue

This file is the source of truth for the daily blog-post automation that
publishes to `prisonerlegalaid.blog`. It lists post-conviction / federal
habeas topics not yet covered on the live site, in priority order.

**How the automation uses this file:** each firing scans the entries in
order, finds the first one marked `Status: Not Started`, researches it
using verified case law and statutory text (CourtListener / Descrybe Legal
Engine — no invented citations), writes a long-form (1,000+ word),
newspaper-quality article in the voice of the existing posts in
`src/posts/`, commits it as a new file there following the front-matter
format in `README.md`, flips this entry's status to `Status: Published —
<filename> — <date>`, and pushes.

Scope note: this queue is for the **.blog / Writ Large / post-conviction**
content stream only. Civil-litigation topics for prisonerlegalaid.com
(excessive force, medical malpractice, § 1983 lawsuits, wrongful death)
belong in a separate queue once that site has its own distinct deployment —
see the note Chris and Claude left in the .com repo about that split.

---

1. What Is a § 2241 Habeas Petition? — Status: Published — what-is-a-2241-habeas-petition.md — 2026-08-09
2. Ineffective Assistance of Counsel: The Strickland Standard Explained — Status: Published — ineffective-assistance-of-counsel-strickland-standard.md — 2026-08-10
3. What Is "Procedural Default" and How Does It Sink Post-Conviction Claims? — Status: Published — what-is-procedural-default.md — 2026-08-11
4. The Certificate of Appealability: Why You Need One to Appeal a Denied § 2255 or § 2254 — Status: Published — the-certificate-of-appealability-explained.md — 2026-08-12
5. Actual Innocence Gateway Claims: Schlup v. Delo and How It Works — Status: Published — actual-innocence-gateway-claims-schlup-v-delo.md — 2026-08-13
6. Second or Successive Motions: Why You (Usually) Only Get One Shot — Status: Published — second-or-successive-motions-one-shot.md — 2026-08-14
7. The One-Year Clock: AEDPA's Statute of Limitations for State Habeas (§ 2254) — Status: Published — the-one-year-clock-2254-habeas-deadline.md — 2026-08-15
8. Equitable Tolling: When Missing the Habeas Deadline Isn't Automatically Fatal — Status: Not Started
   (Note: Holland v. Florida and the diligence/extraordinary-circumstance basics are already
   covered in post #7's closing section — when this one is written, go deeper: the mental-
   incompetency angle from Ryan v. Gonzales, what actually counts as "extraordinary" beyond
   attorney abandonment, and concrete fact patterns, rather than re-explaining the test itself.)
9. What Happens at an Evidentiary Hearing on a § 2255 Motion? — Status: Not Started
10. Career Offender Enhancements: Challenging a Guidelines Miscalculation — Status: Not Started
11. Armed Career Criminal Act (ACCA) Enhancements: What Counts as a "Violent Felony"? — Status: Not Started
12. Retroactivity Explained: Teague v. Lane and New Constitutional Rules — Status: Not Started
13. Clemency vs. Compassionate Release: Two Different Paths Out — Status: Not Started
14. What the First Step Act Actually Changed (Beyond Time Credits) — Status: Not Started
15. Rule 60(b) Motions: Reopening a Habeas Case After It's Been Decided — Status: Not Started
16. Brady Violations: When the Government Hides Evidence From the Defense — Status: Not Started
17. What Is a COA Denial, and What Can You Do About It? — Status: Not Started
18. Why § 2241 Isn't the Right Tool for Prison Conditions Claims (and § 1983 Usually Is) — Status: Not Started
19. The Prison Mailbox Rule: How Houston v. Lack Protects Pro Se Filing Deadlines — Status: Not Started
20. Habeas Exhaustion for BOP Issues: Why You Usually Need to Try the BP-8/BP-9/BP-10/BP-11 Process First — Status: Not Started
21. Sentencing Errors That Survive Appeal Waivers: What's Actually Still Open to Challenge — Status: Not Started

When this list runs out, a new batch needs to be researched and added —
the automation should say so plainly rather than repeat or invent a topic.
