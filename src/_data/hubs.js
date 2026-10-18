/**
 * Topic hub definitions.
 *
 * Hubs give the site a structure instead of a chronological pile of posts:
 * each core article belongs to exactly one hub via its `hub:` front matter,
 * every hub links its children, and every child links back. This is also what
 * makes breadcrumbs meaningful -- Home > Hub > Article.
 *
 * `hub:` on a post must equal one of the `key` values below (not the slug).
 * The build check in .eleventy.js warns when it does not.
 *
 * `title` gets " | Writ Large" appended, so keep it to 47 characters or fewer.
 * `description` is the Google snippet: 160 characters or fewer.
 * `intro` opens on the family's question; `body` is HTML rendered under it.
 *
 * Rewritten 2026-10-18 from the SEO audit of the same date: titles and
 * openings now answer the family's question first, and each hub carries the
 * deadline that applies and what to do this week.
 */
module.exports = [
  {
    key: "2255",
    modified: "2026-10-18",
    slug: "2255-motions",
    label: "§ 2255 Motions",
    crumb: "§ 2255",
    title: "§ 2255: Can He Still Challenge His Sentence?",
    description:
      "Convicted in federal court and told there is still something he can file? How a § 2255 motion works, the one-year deadline, and what to do this week.",
    intro:
      "If your husband or son was convicted in federal court and you have been told there is still something he can file, this is usually the thing people mean. It has a one-year deadline, and the clock has probably already started. Here is how to find out where he stands.",
    body: `
<h2>Who can file one</h2>
<p>A § 2255 motion is for someone serving a federal sentence who believes something went wrong in the case itself: the conviction, the sentence, or the way his lawyer handled it. It is filed with the same court that sentenced him, under his existing criminal case number. There is no filing fee, and the official form is AO 243.</p>

<h2>The one-year deadline</h2>
<p>In most cases he has one year from the day his conviction became final. If he did not appeal, that is usually 14 days after the judgment was entered. If he appealed and did not ask the Supreme Court to take the case, it is usually 90 days after the court of appeals ruled. If the Supreme Court turned the case down, the clock starts on the day it did.</p>
<p>The law allows a later start in three narrow situations: the government blocked him from filing, the Supreme Court recognized a new right and made it apply to older cases, or important facts came to light that could not have been found earlier with reasonable effort. Missing the deadline is the most common reason these motions are thrown out without a judge ever looking at what went wrong. If it has already passed, read <a href="/blog/equitable-tolling-prison-mail-delays-2255-deadline/">when a late filing can be excused</a>.</p>

<h2>What it can raise</h2>
<ul>
<li><strong>His lawyer failed him</strong> in a way that changed the outcome. This is the most common ground. See <a href="/blog/ineffective-assistance-of-counsel-strickland-standard/">what has to be proved</a>.</li>
<li><strong>The sentence was illegal</strong>, for example above the maximum the law allows.</li>
<li><strong>The conviction violated the Constitution</strong>, or the court had no authority to impose it.</li>
</ul>
<p>It is not a second appeal. Arguments the appeals court already decided generally cannot be raised again, and arguments that could have been raised on appeal but were not usually need a strong reason for the delay.</p>

<h2>He usually gets one</h2>
<p>He generally gets one § 2255 motion. A second one needs permission from the court of appeals first, and that permission is only available for strong new evidence of innocence or a new Supreme Court rule made to apply to older cases. That is why the first motion has to include every claim. More on <a href="/blog/second-or-successive-motions-one-shot/">second motions</a>.</p>

<h2>If the motion is denied</h2>
<p>He cannot appeal automatically. He first needs a <a href="/blog/the-certificate-of-appealability-explained/">certificate of appealability</a>, which is granted only when he makes a substantial showing that a constitutional right was denied.</p>

<h2>What you can do this week</h2>
<ol>
<li>Find the date his judgment was entered and whether he appealed. The docket sheet shows both. If you do not have it, we can <a href="/case-file/">pull his federal case file</a>.</li>
<li>Count forward to estimate his deadline, and treat it as earlier than you think.</li>
<li>Gather his lawyer's letters, the plea agreement, and anything showing what he was told and when.</li>
<li>Get a free case review well before the deadline, not in the last few weeks.</li>
</ol>`,
    form: { name: "AO 243", href: "/forms/AO_243.pdf", label: "Official § 2255 form (AO 243)" }
  },
  {
    key: "2241",
    modified: "2026-10-18",
    slug: "2241-habeas",
    label: "§ 2241 Habeas",
    crumb: "§ 2241",
    title: "§ 2241: When the BOP Gets His Time Wrong",
    description:
      "His release date is wrong, his jail time or First Step Act credits are missing, or he lost good time? How a § 2241 petition works and what to do first.",
    intro:
      "If the Bureau of Prisons has his release date wrong, is not counting time he already sat in jail, is not applying his First Step Act credits, or took good time away after a write-up, this is usually the tool. It is about how his sentence is being carried out, not whether the conviction was right.",
    body: `
<h2>What it covers</h2>
<ul>
<li><strong>How his sentence was calculated:</strong> when it started and which earlier jail time counts. See <a href="/blog/not-counting-his-county-jail-time/">when county jail time is not being counted</a>.</li>
<li><strong>First Step Act time credits</strong> that are missing or not being applied. See <a href="/blog/first-step-act-time-credits-explained/">how the credits work</a>.</li>
<li><strong>Good conduct time taken away</strong> at a disciplinary hearing that did not give him the process he was owed. See <a href="/blog/what-happens-at-a-disciplinary-hearing/">what that process is</a>.</li>
</ul>

<h2>Where to file, and who to name</h2>
<p>It is filed in the federal district where he is being held right now, not where he was sentenced. The person named on the other side is the warden of the prison holding him. The filing fee is $5, or he can ask to proceed without paying. The official form is AO 242.</p>

<h2>First, the BOP's own appeal process</h2>
<p>Courts almost always expect him to work through the Bureau of Prisons administrative remedy process before filing. After an informal attempt to resolve it with staff, the steps are usually:</p>
<ul>
<li><strong>BP-9</strong> to the warden, generally within 20 calendar days of what happened.</li>
<li><strong>BP-10</strong> to the Regional Director within 20 calendar days of the warden's answer.</li>
<li><strong>BP-11</strong> to the Central Office within 30 calendar days of the regional answer.</li>
</ul>
<p>If the BOP does not answer within its own time limit, he can treat the silence as a denial and move to the next step. Our guide to <a href="/blog/what-is-a-bp-9/">the BP-9</a> walks through each form.</p>

<h2>What it cannot do</h2>
<p>Since the Supreme Court's 2023 decision in Jones v. Hendrix, a § 2241 petition generally cannot be used to attack the conviction or sentence itself just because a § 2255 motion is too late or was already used. Read <a href="/blog/2255-savings-clause-when-2241-works-instead/">when § 2241 can stand in for § 2255</a>.</p>

<h2>What you can do this week</h2>
<ol>
<li>Ask him to request his sentence computation sheet and his First Step Act time credit assessment from his case manager.</li>
<li>Compare the dates against his judgment and the time he spent in custody before he was sentenced.</li>
<li>If something is wrong, he should file the BP-9 now, in writing, and keep a copy.</li>
<li>Write down the date he hands in every form and the date every answer comes back. Those dates decide what happens next.</li>
</ol>`,
    form: { name: "AO 242", href: "/forms/AO_242.pdf", label: "Official § 2241 form (AO 242)" }
  },
  {
    key: "2254",
    modified: "2026-10-18",
    slug: "2254-habeas",
    label: "§ 2254 Habeas",
    crumb: "§ 2254",
    title: "§ 2254: Can a Federal Judge Fix a State Case?",
    description:
      "The state court got it wrong and you want a federal judge to look. What has to be true, the one-year deadline, and what to gather this week.",
    intro:
      "The state court got it wrong and you want a federal judge to look at it. That is possible, and it is harder than it sounds, because being right is not by itself enough. Here is what has to be true, and the deadline that decides whether he gets the chance at all.",
    body: `
<h2>Who files one</h2>
<p>A § 2254 petition is for someone held under a state court conviction. It is filed in federal district court, and the person named on the other side is the official who has custody of him, usually the warden. The filing fee is $5, or he can ask to proceed without paying. The official form is AO 241.</p>

<h2>Every claim has to go through state court first</h2>
<p>Before a federal judge will hear a claim, he has to present it to the state courts, all the way up through the state's highest court that will hear it. A claim that was skipped in state court can be lost for good. This is called <a href="/blog/what-is-procedural-default/">procedural default</a>, and there are only narrow ways around it, including one for <a href="/blog/martinez-v-ryan-post-conviction-lawyer-mistakes-excuse-default/">mistakes by a post-conviction lawyer</a>.</p>

<h2>The one-year deadline</h2>
<p>He usually has one year from the day his state conviction became final on direct appeal. The clock pauses while a properly filed state post-conviction petition is pending. But any time that passed before that petition was filed stays used up, and families are often surprised that months spent looking for a lawyer counted against the year. More on <a href="/blog/the-one-year-clock-2254-habeas-deadline/">how the clock runs</a>.</p>

<h2>Why being right is not enough</h2>
<p>If the state court decided the claim on its merits, a federal judge can step in only if that decision was contrary to, or an unreasonable application of, clearly established Supreme Court law, or rested on an unreasonable reading of the facts. A decision can be wrong without being unreasonable under that test. This is the hardest part of every § 2254 case. See <a href="/blog/aedpa-deference-2254d-why-state-court-being-wrong-isnt-enough/">why federal courts rarely overturn a state conviction</a>.</p>

<h2>New evidence of innocence</h2>
<p>Strong, reliable new evidence that he did not do it can sometimes get a court to hear claims that would otherwise be barred. The bar is high. Read <a href="/blog/actual-innocence-gateway-claims-schlup-v-delo/">how the innocence gateway works</a>.</p>

<h2>What you can do this week</h2>
<ol>
<li>List every court that has ruled on his case and the date of each decision.</li>
<li>Find out whether a state post-conviction petition is pending right now.</li>
<li>Count the days between his conviction becoming final and the filing of any state petition.</li>
<li>Collect the state court opinions. The federal judge reviews what the state courts said, not only what happened at trial.</li>
</ol>`,
    form: { name: "AO 241", href: "/forms/AO_241.pdf", label: "Official § 2254 form (AO 241)" }
  },
  {
    key: "compassionate-release",
    modified: "2026-10-18",
    slug: "compassionate-release",
    label: "Compassionate Release",
    crumb: "Compassionate Release",
    title: "Compassionate Release: Can He Come Home Early?",
    description:
      "Seriously ill, aging, or needed at home? When a federal judge can reduce his sentence, the first step with the warden, and what to gather this week.",
    intro:
      "If he is seriously ill, aging and declining, or your family is facing a crisis only he can step into, the court that sentenced him can sometimes reduce his sentence. It is called compassionate release, and it is about his circumstances now, not whether the conviction was right.",
    body: `
<h2>Step one: a request to the warden</h2>
<p>He has to start with a written request to the warden. He can take it to court once the Bureau of Prisons denies it and he has finished appealing, or 30 days after the warden received the request, whichever comes first. Keep a copy of the request and proof of the date the warden got it.</p>

<h2>What can count</h2>
<p>The law requires "extraordinary and compelling reasons." The Sentencing Commission's policy statement lists the kinds of reasons courts look at, including:</p>
<ul>
<li><strong>Medical:</strong> a terminal illness, or a serious condition that limits his ability to care for himself, or that needs specialized care the prison is not providing.</li>
<li><strong>Age:</strong> 65 or older with serious decline from aging, after serving at least 10 years or 75 percent of the sentence, whichever is less.</li>
<li><strong>Family:</strong> the death or incapacity of the person caring for his minor child, or a spouse or parent who is incapacitated and has no one else to care for them.</li>
<li><strong>Abuse in custody:</strong> sexual abuse, or physical abuse causing serious injury, by prison staff.</li>
</ul>
<p>More on <a href="/blog/compassionate-release-3582/">who actually qualifies</a>.</p>

<h2>What no longer works</h2>
<p>In May 2026 the Supreme Court closed two arguments. A change in sentencing law that Congress did not make retroactive cannot be the reason, alone or combined with others. And an argument that the conviction or sentence was unlawful belongs in a <a href="/topics/2255-motions/">§ 2255 motion</a>, not here. See <a href="/blog/rutherford-fernandez-compassionate-release/">what changed</a>.</p>

<h2>The judge still decides</h2>
<p>Even with a qualifying reason, the judge weighs the ordinary sentencing factors, including the offense, how he has done in prison, and public safety, and can still say no. A clear release plan helps: where he will live, who will help him, and how his medical care will be covered.</p>

<h2>What you can do this week</h2>
<ol>
<li>Gather his medical records, or the records that show the family need, such as a death certificate or a doctor's letter about the caregiver.</li>
<li>Help him write a dated request to the warden, and keep a copy.</li>
<li>Mark the date 30 days after the warden received it.</li>
<li>Start the release plan: an address, who he will live with, doctors, and insurance.</li>
</ol>`,
    form: null
  },
  {
    key: "first-step-act",
    modified: "2026-09-04",
    slug: "first-step-act",
    label: "First Step Act & BOP",
    crumb: "First Step Act",
    title: "First Step Act Credits: Is His Date Right?",
    description:
      "How First Step Act time credits are earned and applied, which offenses are excluded, and what to do when the Bureau of Prisons miscalculates a release date.",
    intro:
      "First Step Act credits and BOP sentence computation determine when someone actually moves toward release. Disputes here are about the execution of a sentence, which generally makes them § 2241 territory rather than § 2255.",
    form: null
  }
];
