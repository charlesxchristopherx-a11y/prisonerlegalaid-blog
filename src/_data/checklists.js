/**
 * Filing checklists (P1.14).
 *
 * These are ORIGINAL checklists about how to use the official forms. They are
 * not forms, and nothing here reproduces, reformats, or paraphrases the
 * content of a government form -- that is a standing repo rule. Where a form
 * applies, the checklist links the official unmodified PDF already served
 * from /forms/ and the issuing authority's page.
 *
 * Everything factual below was verified against primary sources before it was
 * written, in the same session that wrote it:
 *   - Rules Governing Section 2255 Proceedings, Rules 2, 3, 4, 5, 6, 8
 *   - Rules Governing Section 2254 Cases, Rules 2, 3
 *   - 28 U.S.C. 1914(a): $350 civil fee; $5 on application for habeas corpus
 *   - 18 U.S.C. 3582(c)(1)(A): exhaustion clause read in full
 *   - 28 C.F.R. 542.13-.18 (govinfo): BP-9/10/11 deadlines and response times
 *   - PACER Electronic Public Access Fee Schedule and pacer.uscourts.gov
 *
 * Adding a checklist means adding an entry here. No template change.
 */
module.exports = [
  {
    slug: "2255-filing",
    modified: "2026-09-04",
    label: "§ 2255 motion",
    title: "§ 2255 Filing Checklist — What Goes In, and Where It Goes",
    description:
      "A step-by-step checklist for filing a 28 U.S.C. § 2255 motion: the one-year clock, what Rule 2 requires the motion to contain, how many copies the clerk needs, and what happens after it is docketed.",
    intro:
      "A § 2255 motion is filed as a motion in your existing federal criminal case, not as a new lawsuit. That single fact drives most of what follows — including why there is no filing fee.",
    form: { label: "Official § 2255 form (AO 243)", href: "/forms/AO_243.pdf" },
    sections: [
      {
        heading: "Before you draft anything",
        items: [
          "Confirm you were convicted in <strong>federal</strong> court. If you are in custody on a state judgment, § 2254 is your route, not § 2255.",
          "Work out your one-year deadline under § 2255(f), which runs from the latest of four trigger dates — most often the date the judgment became final.",
          "Check whether this would be a <strong>second or successive</strong> motion. If so, you need authorization from the court of appeals first under § 2255(h); filing in the district court without it wastes the filing.",
          "Decide whether your claim had to be raised on direct appeal. Claims that could have been raised and were not are generally defaulted absent cause and prejudice, or actual innocence."
        ]
      },
      {
        heading: "What Rule 2 requires the motion to contain",
        items: [
          "<strong>Every</strong> ground for relief you have. Rule 2(b)(1) requires you to specify all grounds available to you — holding one back for later collides with the second-or-successive bar.",
          "The facts supporting each ground, separately. Not conclusions — facts.",
          "A statement of the relief you are asking the court to grant.",
          "Printed, typewritten, or legibly handwritten, and <strong>signed under penalty of perjury</strong> by you or someone authorized to sign for you.",
          "Rule 2(c) requires the motion to substantially follow the standard form. Use the official AO 243 rather than drafting from scratch."
        ]
      },
      {
        heading: "Filing mechanics",
        items: [
          "Rule 3(a): an <strong>original and two copies</strong> go to the clerk.",
          "There is no filing fee. Under 28 U.S.C. § 1914 the $350 civil fee attaches to civil actions and a $5 fee applies to habeas applications; a § 2255 motion is filed in the existing criminal case, so neither applies.",
          "Rule 3(b): the clerk dockets it in the criminal case in which the challenged judgment was entered, and serves the United States Attorney.",
          "Rule 3(d) is the inmate-filing rule. A paper is timely if deposited in the institution's internal mail system by the deadline — the principle the Supreme Court set out in <em>Houston v. Lack</em>. Use the legal mail system and keep proof."
        ]
      },
      {
        heading: "What happens next",
        items: [
          "Rule 4: the judge examines the motion promptly and may dismiss it summarily if it plainly appears you are not entitled to relief. Many motions end here.",
          "Rule 5(a): the government is <strong>not required to answer</strong> unless the judge orders it to. Silence is not agreement.",
          "Rule 6(a): discovery requires leave of court for good cause. There is no automatic right to it.",
          "Rule 8: the judge decides on the record whether an evidentiary hearing is warranted.",
          "To appeal a denial you need a certificate of appealability under 28 U.S.C. § 2253(c). The notice of appeal alone is not enough."
        ]
      }
    ],
    authorities: [
      { cite: "28 U.S.C. § 2255 (and the Rules Governing § 2255 Proceedings)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2255&num=0&edition=prelim" },
      { cite: "28 U.S.C. § 1914 (filing fees)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section1914&num=0&edition=prelim" },
      { cite: "28 U.S.C. § 2253(c) (certificate of appealability)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2253&num=0&edition=prelim" },
      { cite: "Houston v. Lack, 487 U.S. 266 (1988)", url: "https://www.courtlistener.com/opinion/112126/houston-v-lack/" }
    ]
  },

  {
    slug: "2241-filing",
    modified: "2026-09-04",
    label: "§ 2241 petition",
    title: "§ 2241 Filing Checklist — Exhaustion, Venue, and the $5 Fee",
    description:
      "A checklist for a 28 U.S.C. § 2241 habeas petition challenging how the Bureau of Prisons is carrying out a sentence: the administrative remedy deadlines you must clear first, which district to file in, and who to name.",
    intro:
      "A § 2241 petition challenges the <em>execution</em> of a sentence — time credits, computation, discipline — rather than whether the conviction is valid. Two things sink most of them before the merits: skipping the administrative remedy process, and filing in the wrong district.",
    form: { label: "Official § 2241 form (AO 242)", href: "/forms/AO_242.pdf" },
    sections: [
      {
        heading: "Exhaust the BOP administrative remedy process first",
        items: [
          "Attempt informal resolution with staff (28 C.F.R. § 542.13), unless an exception applies.",
          "<strong>BP-9</strong> to the Warden: the deadline for completing informal resolution and submitting the formal written request is <strong>20 calendar days</strong> from the date the basis for the request occurred (§ 542.14(a)).",
          "<strong>BP-10</strong> to the Regional Director: within <strong>20 calendar days</strong> of the date the Warden signed the response (§ 542.15(a)).",
          "<strong>BP-11</strong> to the General Counsel: within <strong>30 calendar days</strong> of the date the Regional Director signed. This is the final administrative appeal (§ 542.15(a)).",
          "Response times are 20 days from the Warden, 30 from the Regional Director, 40 from the General Counsel (§ 542.18). Keep dated copies of everything you send and receive."
        ]
      },
      {
        heading: "Where to file, and against whom",
        items: [
          "File in the district where you are <strong>confined</strong> — not the district that sentenced you.",
          "Name your immediate custodian, ordinarily the warden of your facility, as respondent. This is the immediate-custodian rule the Supreme Court applied in <em>Rumsfeld v. Padilla</em>.",
          "If you transfer facilities mid-case, tell the court promptly. Venue and the proper respondent can both change."
        ]
      },
      {
        heading: "Fee or in forma pauperis",
        items: [
          "The filing fee on an application for a writ of habeas corpus is <strong>$5</strong> under 28 U.S.C. § 1914(a) — not the $350 civil fee.",
          "If you cannot pay it, file an in forma pauperis application with a certificate from the institution showing your account balance."
        ]
      },
      {
        heading: "Know the limit of § 2241",
        items: [
          "§ 2241 is not a workaround for a § 2255 problem. In <em>Jones v. Hendrix</em>, the Supreme Court held the saving clause does not let a prisoner use § 2241 to raise a claim that § 2255's second-or-successive restrictions bar.",
          "If your argument is that the conviction or sentence is unlawful, that is a § 2255 argument even if § 2255 is now closed to you."
        ]
      }
    ],
    authorities: [
      { cite: "28 U.S.C. § 2241", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2241&num=0&edition=prelim" },
      { cite: "28 U.S.C. § 1914 (filing fees)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section1914&num=0&edition=prelim" },
      { cite: "28 C.F.R. §§ 542.13–542.18 (BOP Administrative Remedy Program)", url: "https://www.govinfo.gov/content/pkg/CFR-2024-title28-vol2/pdf/CFR-2024-title28-vol2-part542.pdf" },
      { cite: "Rumsfeld v. Padilla, 542 U.S. 426 (2004)", url: "https://www.courtlistener.com/opinion/136999/rumsfeld-v-padilla/" },
      { cite: "Jones v. Hendrix, 599 U.S. 465 (2023)", url: "https://www.courtlistener.com/opinion/10049669/jones-v-hendrix/" }
    ]
  },

  {
    slug: "2254-filing",
    modified: "2026-09-04",
    label: "§ 2254 petition",
    title: "§ 2254 Filing Checklist — State Judgments in Federal Court",
    description:
      "A checklist for a 28 U.S.C. § 2254 habeas petition: naming the right respondent, the fee or trust-account certificate the rules require, the one-year clock, and the deference standard waiting on the other side.",
    intro:
      "§ 2254 is for someone in custody under a <strong>state</strong> court judgment seeking federal review. It is the most procedurally unforgiving of the three routes, and the deference standard means being right is not by itself enough.",
    form: { label: "Official § 2254 form (AO 241)", href: "/forms/AO_241.pdf" },
    sections: [
      {
        heading: "Naming the respondent",
        items: [
          "Rule 2(a): if you are currently in custody under the state judgment, name the <strong>state officer who has custody</strong>.",
          "Rule 2(b): if you are not yet in custody but may be under the judgment you are contesting, name <strong>both</strong> the officer with current custody and the state attorney general, and ask for relief from the judgment being contested."
        ]
      },
      {
        heading: "Filing mechanics",
        items: [
          "Rule 3(a): an original and two copies to the clerk, accompanied by either the filing fee <strong>or</strong> a motion for leave to proceed in forma pauperis.",
          "If you proceed in forma pauperis, Rule 3(a)(2) requires the § 1915 affidavit <strong>and</strong> a certificate from the warden or other appropriate officer showing the amount in your institutional account.",
          "The habeas filing fee is $5 under 28 U.S.C. § 1914(a).",
          "Rule 3(d) is the inmate-filing rule — timely on deposit in the institution's internal mail system."
        ]
      },
      {
        heading: "Timing and exhaustion",
        items: [
          "Rule 3(c): the time to file is governed by 28 U.S.C. § 2244(d) — the one-year AEDPA clock.",
          "A properly filed state post-conviction application tolls that clock while it is pending. An improperly filed one does not.",
          "Exhaust your state remedies first: give the state's highest available court a fair opportunity to rule on each claim before bringing it here."
        ]
      },
      {
        heading: "The standard you will be held to",
        items: [
          "Under § 2254(d), relief on a claim adjudicated on the merits in state court requires showing the decision was contrary to, or an unreasonable application of, clearly established Supreme Court law, or based on an unreasonable determination of the facts.",
          "A state court being <em>wrong</em> is not the test. The test is whether it was unreasonable — a materially higher bar.",
          "To appeal a denial you need a certificate of appealability under § 2253(c)."
        ]
      }
    ],
    authorities: [
      { cite: "28 U.S.C. § 2254 (and the Rules Governing § 2254 Cases)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2254&num=0&edition=prelim" },
      { cite: "28 U.S.C. § 2244(d) (one-year limitation)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2244&num=0&edition=prelim" },
      { cite: "28 U.S.C. § 1914 (filing fees)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section1914&num=0&edition=prelim" },
      { cite: "28 U.S.C. § 2253(c) (certificate of appealability)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2253&num=0&edition=prelim" }
    ]
  },

  {
    slug: "compassionate-release",
    modified: "2026-09-04",
    label: "Compassionate release",
    title: "Compassionate Release Preparation Checklist (§ 3582(c)(1)(A))",
    description:
      "What to gather and clear before filing a compassionate-release motion under 18 U.S.C. § 3582(c)(1)(A), including the exhaustion requirement and the two arguments the Supreme Court closed off in 2026.",
    intro:
      "There is no official court form for compassionate release. It is a motion filed in your criminal case. The statute has a hard gate in front of it, and two of the arguments people most often reached for are now foreclosed.",
    form: null,
    sections: [
      {
        heading: "Clear the exhaustion gate",
        items: [
          "Submit a request to the <strong>warden</strong> of your facility asking the Bureau of Prisons to file a motion on your behalf. Date it and keep a copy.",
          "You may then file your own motion once you have <strong>either</strong> fully exhausted all administrative rights to appeal the BOP's failure to bring a motion, <strong>or</strong> 30 days have lapsed from the warden's receipt of your request — whichever is earlier.",
          "That 30-day path is the shorter one in most cases. Track the receipt date carefully; it is what the clock runs from."
        ]
      },
      {
        heading: "Two arguments that no longer work",
        items: [
          "<strong>Do not argue your conviction is invalid.</strong> In <em>Fernandez v. United States</em> (May 28, 2026), the Court held that the supposed invalidity of a conviction is not among the extraordinary and compelling reasons justifying compassionate release; a prisoner attacking the conviction must proceed under § 2255.",
          "<strong>Do not rest on a nonretroactive change in sentencing law.</strong> In <em>Rutherford v. United States</em> (same day), the Court held that a disparity created by a nonretroactive change — by itself or combined with other factors — cannot make a prisoner eligible, and that the Sentencing Commission's policy statement is invalid to the extent it says otherwise.",
          "Both decisions are about the <em>type</em> of argument, not the severity of your circumstances. A genuine, personal extraordinary-and-compelling reason is still a live claim."
        ]
      },
      {
        heading: "Build the record",
        items: [
          "Gather documentation for the reason you are actually asserting — medical records, provider statements, family circumstance documentation — rather than describing it in the motion alone.",
          "Address the § 3553(a) factors directly. The court must consider them, and a motion that ignores them leaves the government's strongest response unanswered.",
          "Include a concrete release plan: where you would live, who you would live with, what you would do.",
          "Attach your exhaustion proof — the dated request to the warden and any response."
        ]
      }
    ],
    authorities: [
      { cite: "18 U.S.C. § 3582(c)(1)(A)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section3582&num=0&edition=prelim" },
      { cite: "18 U.S.C. § 3553(a) (sentencing factors)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section3553&num=0&edition=prelim" },
      { cite: "Fernandez v. United States, No. 24-556 (U.S. May 28, 2026)", url: "https://www.supremecourt.gov/opinions/25pdf/24-556_8m58.pdf" },
      { cite: "Rutherford v. United States, No. 24-820 (U.S. May 28, 2026)", url: "https://www.supremecourt.gov/opinions/25pdf/24-820_97be.pdf" }
    ]
  },

  {
    slug: "fsa-time-credits",
    modified: "2026-09-04",
    label: "FSA time credits",
    title: "First Step Act Time Credit Dispute Checklist",
    description:
      "How to challenge a Bureau of Prisons First Step Act time-credit calculation: confirming what you should be earning, working the administrative remedy process, and when the dispute becomes a § 2241 petition.",
    intro:
      "Time-credit disputes are the most common § 2241 issue, and the most commonly mishandled. The calculation is the BOP's to make in the first instance — which is why the administrative record you build matters more than the argument you eventually write.",
    form: { label: "Official § 2241 form (AO 242)", href: "/forms/AO_242.pdf" },
    sections: [
      {
        heading: "Establish what the statute says you should have",
        items: [
          "Credits are earned for successful participation in evidence-based recidivism reduction programming or productive activities under 18 U.S.C. § 3632(d)(4).",
          "§ 3632(d)(4)(D) lists the offenses that make a prisoner <strong>ineligible</strong> to apply earned credits. Read the list against your own offense of conviction rather than relying on what staff tell you.",
          "§ 3624(g) governs how eligible credits are actually applied toward prerelease custody or supervised release.",
          "Distinguish clearly between <em>earning</em> credits, being <em>eligible to apply</em> them, and the BOP's arithmetic. These fail in different ways and need different arguments."
        ]
      },
      {
        heading: "Build the paper record",
        items: [
          "Request your individualized needs plan, program review reports, and sentence computation. Ask in writing.",
          "Identify the specific discrepancy — days, dates, and which programs are unaccounted for. A general complaint that the number is wrong will not survive.",
          "Keep every dated copy. The administrative record is what a district court will look at."
        ]
      },
      {
        heading: "Work the administrative remedy process",
        items: [
          "Informal resolution, then <strong>BP-9</strong> to the Warden within 20 calendar days of the basis for the request.",
          "<strong>BP-10</strong> to the Regional Director within 20 calendar days of the Warden's signed response.",
          "<strong>BP-11</strong> to the General Counsel within 30 calendar days of the Regional Director's signed response — the final administrative appeal.",
          "If a level does not respond within its time (20 / 30 / 40 days), note that in writing and proceed. Do not simply wait."
        ]
      },
      {
        heading: "Going to court",
        items: [
          "Once exhausted, the vehicle is a § 2241 petition filed in the district where you are confined, naming the warden.",
          "Attach the full administrative chain as exhibits. The absence of exhaustion proof is a common early dismissal.",
          "The $5 habeas fee under § 1914(a) applies, or file in forma pauperis."
        ]
      }
    ],
    authorities: [
      { cite: "18 U.S.C. § 3632(d)(4) (earning time credits)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section3632&num=0&edition=prelim" },
      { cite: "18 U.S.C. § 3624(g) (prerelease custody)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section3624&num=0&edition=prelim" },
      { cite: "28 C.F.R. §§ 542.13–542.18 (BOP Administrative Remedy Program)", url: "https://www.govinfo.gov/content/pkg/CFR-2024-title28-vol2/pdf/CFR-2024-title28-vol2-part542.pdf" },
      { cite: "28 U.S.C. § 2241", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section2241&num=0&edition=prelim" }
    ]
  },

  {
    slug: "pacer-records",
    modified: "2026-09-04",
    label: "Getting court records",
    title: "How to Pull Federal Court Records (PACER) Without Running Up a Bill",
    description:
      "A practical guide to retrieving federal docket sheets and filed documents through PACER: what it costs, the quarterly waiver that makes most use free, and what is free regardless.",
    intro:
      "Post-conviction work runs on the record. This guide is written for the person on the outside doing the retrieving — PACER is a public website, and it is not reachable from inside a facility.",
    form: null,
    sections: [
      {
        heading: "What it costs",
        items: [
          "$0.10 per page for electronic access to case documents, docket sheets, and case-specific reports.",
          "Most documents are <strong>capped at $3.00</strong> — the equivalent of 30 pages — no matter how long the document is.",
          "The cap does <strong>not</strong> apply to name-search results, reports that are not case-specific, or transcripts.",
          "For PDFs, one PDF page is one billable page. For HTML, billing is computed by size, at 4,320 bytes per billable page.",
          "Audio files of hearings are $2.40 per file."
        ]
      },
      {
        heading: "The quarterly waiver — this is the important one",
        items: [
          "If your account accrues <strong>$30 or less in a quarterly billing cycle, the fees are waived entirely</strong> for that quarter.",
          "By the judiciary's own figures, most PACER users pay nothing in a given quarter. Ordinary case-file retrieval usually lands inside the waiver.",
          "Practical consequence: pulling one case's docket and its key filings will typically cost nothing. Broad name searching is what generates real bills, because search results are billed per results page with no cap."
        ]
      },
      {
        heading: "What is free regardless",
        items: [
          "Written judicial <strong>opinions</strong> are free — no fee is charged for access to them.",
          "Viewing case information or documents at a courthouse public-access terminal is free.",
          "Parties in a case, <strong>including pro se litigants</strong>, receive one free electronic copy of documents filed electronically in their own case via the notice of electronic filing.",
          "Courts may exempt individuals or classes from fees — including indigent persons — on application."
        ]
      },
      {
        heading: "Retrieving efficiently",
        items: [
          "Search by <strong>case number</strong> rather than by name where you can. Name searches are billed per results page and are not capped.",
          "Limit a docket report by date range instead of pulling every entry, since the docket report itself is billed by length.",
          "Read the docket first, then pull only the specific document numbers you actually need.",
          "Note the exact case number, district, and document numbers before you start, so you are not browsing on the clock."
        ]
      }
    ],
    authorities: [
      { cite: "Electronic Public Access Fee Schedule (U.S. Courts)", url: "https://www.uscourts.gov/court-programs/fees/electronic-public-access-fee-schedule" },
      { cite: "28 U.S.C. § 1914 (district court fees)", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title28-section1914&num=0&edition=prelim" }
    ]
  }
];
