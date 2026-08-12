# Writ Large (.blog) — Daily Post-Conviction Content Queue

This file is the source of truth for the daily blog-post automation that
publishes to `prisonerlegalaid.blog`. It lists post-conviction / federal
habeas topics not yet covered on the live site, in priority order.

**How the automation uses this file:** each firing scans the entries in
order, finds the first one marked `Status: Not Started`, researches it
using verified case law and statutory text (CourtListener / Descrybe Legal
Engine — no invented citations), writes a thoroughly sourced, newspaper-quality article—generally 800–1,500
words as the subject requires—in the voice of the existing posts in
`src/posts/`, commits it as a new file there following the front-matter
format in `README.md`, flips this entry's status to `Status: Published —
<filename> — <date>`, and pushes.

Scope note: this queue is for the **.blog / Writ Large / post-conviction**
content stream only. Writ Large covers federal post-conviction law —
§ 2255, § 2241, compassionate release, and First Step Act matters — **and
federal habeas review of state convictions under § 2254**. Note that § 2254
is not a "federal-prisoner" remedy: it is a federal habeas remedy for
persons in custody pursuant to a state-court judgment, and state procedure
varies significantly by jurisdiction. The services actually offered may be
narrower than the educational scope of these articles; do not write calls to
action that promise services the business does not provide.

Civil-litigation topics for prisonerlegalaid.com
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
8. Equitable Tolling: When Missing the Habeas Deadline Is Not Automatically Fatal — Status: Not Started
   (Holland's diligence/extraordinary-circumstance test is already introduced in post #7.
   Go deeper without repeating that overview. Use controlling circuit authority for mental
   impairment; do NOT cite Ryan v. Gonzales as the source of an AEDPA tolling rule — that
   case addressed staying proceedings for an incompetent petitioner, not tolling. Cover
   causal connection, evidentiary proof, attorney abandonment, restricted access, misconduct,
   extraordinary institutional barriers, and concrete examples of facts courts accept or reject.)
9. What Happens at an Evidentiary Hearing on a § 2255 Motion? — Status: Not Started
10. Career Offender Enhancements: Challenging a Guidelines Miscalculation — Status: Not Started
    (HIGH-RISK TOPIC. Separate advisory-Guidelines errors from statutory sentencing errors.
    Identify the procedural vehicle: direct appeal, initial § 2255, authorized successive motion,
    § 3582 proceeding, or another remedy. Use current circuit law on cognizability and
    retroactivity. Do NOT suggest Jones v. Hendrix permits a § 2241 workaround for an intervening
    statutory decision. Compare statutory elements exactly, not offense labels.)
11. Armed Career Criminal Act (ACCA) Enhancements: What Counts as a "Violent Felony"? — Status: Not Started
    (HIGH-RISK TOPIC. Same cautions as item 10: identify the procedural vehicle, apply the
    categorical/modified-categorical approach to statutory elements rather than conduct
    descriptions, use current circuit law on retroactivity, and do not present Jones v. Hendrix
    as opening a § 2241 route.)
12. Retroactivity Explained: Teague v. Lane and New Constitutional Rules — Status: Not Started
13. Clemency vs. Compassionate Release: Two Different Paths Out — Status: Not Started
14. What the First Step Act Actually Changed (Beyond Time Credits) — Status: Not Started
    (Cover distinct provisions: sentencing reforms, compassionate-release procedure, recidivism
    programming, prerelease custody, and retroactivity limitations. Do not imply every reform
    is retroactive.)
15. Rule 60(b) Motions: Reopening a Habeas Case After It's Been Decided — Status: Not Started
16. Brady Violations: When the Government Hides Evidence From the Defense — Status: Not Started
17. After a COA Denial: Renewing the Request, Framing the Issues, and Protecting the Appeal — Status: Not Started
    (Do not repeat the general § 2253(c)/Slack explanation from the August 12 COA article.
    Focus on the distinction between district-court and appellate COA requests, timely notice
    of appeal, issue-specific certification, motions to expand a COA, circuit-rule variation,
    and the limited role of Supreme Court review.)
18. Why § 2241 Usually Is Not the Right Tool for Prison-Conditions Claims — and Which Alternatives May Apply — Status: Not Started
    (Distinguish state/local defendants under § 1983 from federal defendants — § 1983 reaches
    persons acting under color of STATE law and does not apply to federal BOP officials. For
    federal prisoners, discuss the limited modern scope of Bivens after Ziglar v. Abbasi and
    Egbert v. Boule, possible prospective relief, the FTCA for qualifying tort claims,
    administrative exhaustion, sovereign-immunity limits, and why no single remedy
    automatically covers every prison-conditions claim.)
19. The Prison Mailbox Rule: How Houston v. Lack Protects Pro Se Filing Deadlines — Status: Not Started
20. Habeas Exhaustion for BOP Issues: Why You Usually Need to Try the BP-8/BP-9/BP-10/BP-11 Process First — Status: Not Started
    (Avoid repeating the basic exhaustion discussion in the existing FSA time-credit and § 2241
    posts. Focus on the judicially created nature of exhaustion in many § 2241 cases, recognized
    exceptions and circuit differences, issue preservation, deadlines and proof of submission,
    rejection/resubmission problems, sensitive remedies, and the difference between exhaustion
    and statutory or regulatory prerequisites.)
21. Sentencing Errors That Survive Appeal Waivers: What's Actually Still Open to Challenge — Status: Not Started

When this list runs out, a new batch needs to be researched and added —
the automation should say so plainly rather than repeat or invent a topic.
