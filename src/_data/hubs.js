/**
 * Topic hub definitions.
 *
 * Hubs give the site a structure instead of a chronological pile of posts:
 * each core article belongs to exactly one hub via its `hub:` front matter,
 * every hub links its children, and every child links back. This is also what
 * makes breadcrumbs meaningful -- Home > Hub > Article.
 *
 * The memo's five core subjects. Adding a hub means adding an entry here and
 * setting `hub:` on the relevant posts; no template changes required.
 */
module.exports = [
  {
    key: "2255",
    modified: "2026-09-04",
    slug: "2255-motions",
    label: "§ 2255 Motions",
    crumb: "§ 2255",
    title: "Federal § 2255 Motions — Vacating or Correcting a Federal Sentence",
    description:
      "How a 28 U.S.C. § 2255 motion works: the one-year deadline, ineffective assistance, successive motions, certificates of appealability, and what actually gets filed.",
    intro:
      "A § 2255 motion is the main way someone convicted in federal court challenges whether that conviction or sentence is lawful. It is filed in the court that imposed the sentence, in the existing criminal case, and it is subject to a strict one-year deadline.",
    form: { name: "AO 243", href: "/forms/AO_243.pdf", label: "Official § 2255 form (AO 243)" }
  },
  {
    key: "2241",
    modified: "2026-09-04",
    slug: "2241-habeas",
    label: "§ 2241 Habeas",
    crumb: "§ 2241",
    title: "§ 2241 Habeas — Challenging How a Federal Sentence Is Carried Out",
    description:
      "When § 2241 applies instead of § 2255: sentence computation, First Step Act credits, disciplinary sanctions, and the narrow savings clause after Jones v. Hendrix.",
    intro:
      "A § 2241 petition challenges how a sentence is being executed rather than whether the conviction was valid. It is filed in the district where the person is confined, not where they were sentenced.",
    form: { name: "AO 242", href: "/forms/AO_242.pdf", label: "Official § 2241 form (AO 242)" }
  },
  {
    key: "2254",
    modified: "2026-09-04",
    slug: "2254-habeas",
    label: "§ 2254 Habeas",
    crumb: "§ 2254",
    title: "§ 2254 Habeas — Federal Review of a State Conviction",
    description:
      "AEDPA deference, the one-year clock, procedural default, Martinez v. Ryan, and the actual-innocence gateway for people in custody under a state judgment.",
    intro:
      "A § 2254 petition asks a federal court to review a state court judgment. AEDPA makes that review deliberately narrow: it is not enough that the state court was wrong.",
    form: { name: "AO 241", href: "/forms/AO_241.pdf", label: "Official § 2254 form (AO 241)" }
  },
  {
    key: "compassionate-release",
    modified: "2026-09-04",
    slug: "compassionate-release",
    label: "Compassionate Release",
    crumb: "Compassionate Release",
    title: "Compassionate Release Under 18 U.S.C. § 3582(c)(1)(A)",
    description:
      "What counts as an extraordinary and compelling reason, the requirement to ask the BOP first, and the 2026 Supreme Court decisions narrowing which arguments qualify.",
    intro:
      "Compassionate release asks the sentencing court to reduce a sentence for extraordinary and compelling reasons. It is about present circumstances, not whether the conviction was correct — a distinction the Supreme Court reinforced in 2026.",
    form: null
  },
  {
    key: "first-step-act",
    modified: "2026-09-04",
    slug: "first-step-act",
    label: "First Step Act & BOP",
    crumb: "First Step Act",
    title: "First Step Act Time Credits and BOP Sentence Execution",
    description:
      "How First Step Act time credits are earned and applied, which offenses are excluded, and what to do when the Bureau of Prisons miscalculates a release date.",
    intro:
      "First Step Act credits and BOP sentence computation determine when someone actually moves toward release. Disputes here are about the execution of a sentence, which generally makes them § 2241 territory rather than § 2255.",
    form: null
  }
];
