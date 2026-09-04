# PLA .blog SEO Implementation — Handoff
**Session ended:** September 4, 2026
**Repo:** `charlesxchristopherx-a11y/prisonerlegalaid-blog`
**Directive:** `PLA_BLOG_SEO_CLAUDE_HANDOFF_2026-09-03.md` (Chris has the file)

---

## Start here

1. Read the SEO memo in full.
2. `git pull` the blog repo. Read `HANDOFF.md` and `WORKLOG.md`.
3. **Read the commit messages from Sept 4.** Every change this session was
   committed with problem / files / rationale / validation / unresolved. They
   are the most accurate record of what happened and why.
4. Verify live state yourself before trusting this document.

---

## Completed and verified live

### P0 — 6 of 8

| # | Item | What was done |
|---|---|---|
| 1 | `dateModified` | Optional `modified:` front matter; falls back to publish date. Visible "Last reviewed" only when set. |
| 2 | Sitemap `lastmod` | Every page carries its own `pageModified`, seeded from real git history. |
| 3 | Address | Normalized to `7901 4th St N # 35356` on **both** .blog and .com. |
| 6 | Crawler access | Already correct. Googlebot / bingbot / OAI-SearchBot all 200. |
| 7 | OAI-SearchBot | Already correct, never blocked. |
| 8 | IndexNow | Key file live, workflow verifies reachability before submitting. |

### P1 — 4 of 8

| # | Item | What was done |
|---|---|---|
| 9 | Author architecture | `/about-the-author/`, Person schema, byline on every article. |
| 10 | Editorial standards | `/editorial-standards/` with source hierarchy and corrections policy. |
| 12 | Topic hubs | 5 hubs at `/topics/<slug>/`, all 19 core posts assigned. |
| 13 | Internal linking | Breadcrumbs, sibling blocks, `tools/link-audit.js`. |

---

## Blocked — needs Chris, not code

**P0.4 (GA4 reporting) and P0.5 (Search Console dashboard).**

Zapier has been out of tasks since Aug 27. The clean fix is a Google Cloud
service account with Search Console API access, added as a Restricted user on
both properties. Zo was asked and hit a sign-in wall — creating a service
account needs an authenticated human browser session and cannot be automated.

**Do not work around this by guessing at data.** Chris and I agreed to defer
it deliberately: the site has ~78 impressions in 28 days, which is not enough
for a dashboard to inform anything. Revisit when traffic justifies it.

---

## Remaining work, in the order I would do it

### P1.16 — Search-intent titles (highest value, do first)

The one page with search impressions ranks for **document intent**:

| Position | Query |
|---|---|
| 28 | `1983 form` |
| 34 | `1983 civil rights complaint` |
| 38 | `42 usc 1983 complaint` |
| 41 | `section 1983 complaint` |

Current titles are written lawyer-to-lawyer ("AEDPA Deference: Why the State
Court Being Wrong Isn't Enough"). Nobody searches that. Rewrite titles as the
question a family member actually types, keeping the legal substance intact.

`CONTENT-DIRECTION-2026-09.md` (with Chris) has the full analysis and a
proposed title mapping. **Preserve URLs** — this is a title change, not a
slug change. The memo prohibits bulk URL changes.

### P1.11 — Primary-source citation standard

Sources are already cited in prose and every claim was verified before
writing. What is missing is a consistent presentation pattern and a check
that every core article carries at least one primary authority. The
`/editorial-standards/` page already documents the intended method; this is
about enforcing it uniformly.

### P1.14 — Forms/tools expansion

`/forms/` exists with 7 official fillable PDFs and a 91-district court finder.
The memo's next-tier asks: § 2255 / § 2241 / § 2254 filing checklists,
compassionate-release preparation checklist, PACER retrieval guide, FSA credit
dispute checklist.

**Hard rule: never recreate a government form.** Serve official PDFs
unmodified and link the issuing authority. This is a standing repo rule, not
just a memo preference.

### P1.15 — Content-refresh queue

**Genuinely blocked on Search Console data.** The memo says to prioritize by
impressions, CTR and position. Without that, any refresh order is a guess.
Do P1.16 first.

### P2 — Not started

Video/article integration, backlink outreach, rapid legal-update workflow,
gradual off-topic migration, CRO testing.

---

## Things that will bite you if you do not know them

**The site does not deploy on push.** It deploys via the `daily-publish`
GitHub Action. To see a change live, dispatch that workflow and wait ~2–3
minutes. I briefly misread a stale deploy as a regression because of this.

**The repo rebuilds daily.** Any freshness signal derived from build time or
file mtime will mark all 47 posts as updated every morning. That is why
`modified:` and `pageModified:` are opt-in front-matter fields. Do not
"improve" this by automating it.

**Future-dated posts are live but unlisted.** `.eleventy.js` filters them out
of `collections.posts` for drip publishing, but Eleventy still writes them to
disk. They are excluded from the sitemap and from hubs until their date.
Three such posts (Sep 5–7) appear as orphans in the link audit. That is
correct, not a defect.

**Nunjucks `set` inside a `for` loop does not reliably escape the loop on
paginated pages.** This produced empty `<lastmod>` on 4 of 5 hubs. Hubs now
carry explicit dates in `src/_data/hubs.js`. Static pages still use the
`lastmodFor` macro, where it works.

**Do not add `reviewedBy` to Article schema.** Attorney review does occur
before publication, but reviewing attorneys are deliberately never named —
naming one alongside legal information can imply representation that does not
exist. The review is stated in visible prose instead. Populating a schema
field with a placeholder entity would be fabricated authority.

**Author attribution is exactly `C. Christopher, Certified Paralegal`,
employed by (not owner of) Prisoner Legal Aid LLC.** I got the ownership wrong
this session and had to correct it live. Do not embellish credentials.

---

## Standing constraints — do not violate

- Never recreate, reformat, or reproduce a government form.
- No pricing figures on `.com`; call-for-quote on both sites.
- `786-408-5073` is the only publishable phone number.
- No cross-brand CTAs. `.blog` must not link to `.com` funnels; the Agent OS
  verifier enforces this and will block content that does.
- Every legal citation verified against primary authority **before** writing.
- Never promise or imply an outcome.
- Do not replace Eleventy. Do not bulk-change URLs. Do not move the 28
  secondary posts wholesale without Search Console data.
- Do not mass-publish content.

---

## Live automation this touches

| When | What |
|---|---|
| Mon 09:00 ET | Agent OS writes, verifies, publishes an article |
| Mon 10:00 ET | Article links emailed to Chris |
| Mon 10:40 ET | Video rendered on GitHub Actions |
| Mon 11:00 ET | Video scripts emailed |
| Mon 11:15 ET | Video posted to Instagram, TikTok, Facebook |
| Daily 05:00 ET | Site rebuild and deploy |
| Daily 09:30 UTC | IndexNow submission |

**The Agent OS publishes to `.blog` only.** `.com` is locked out three ways:
`ENABLED_FUNNELS`, the publisher's repo allowlist, and the scheduled trigger.
Zo publishes `.com`. Do not point the agent at it — two writers on one repo is
how the Aug 31 duplicate happened.

---

## Verification commands

```bash
# link audit: orphans, thin pages, broken links
node tools/link-audit.js

# sitemap validity
curl -s https://prisonerlegalaid.blog/sitemap.xml | \
  grep -oP '(?<=<lastmod>)[^<]+' | grep -vP '^\d{4}-\d{2}-\d{2}$'
# (empty output = all valid)

# structured data across the built site
python3 - <<'PY'
import re,json,glob
n=v=0
for f in glob.glob('_site/**/index.html', recursive=True):
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>',
                        open(f,encoding='utf-8').read(), re.S):
        n+=1
        try: json.loads(b); v+=1
        except Exception as e: print('INVALID', f, e)
print(f'{v}/{n} valid')
PY
```

Current baseline: **66 pages, 0 broken links, 161/161 JSON-LD valid, 61
sitemap URLs, 0 malformed lastmod.**

---

## Open question for Chris

Nothing blocking. The only decision outstanding is whether to pursue the
Google service account for Search Console access, which unblocks P0.4, P0.5
and P1.15. My recommendation was to wait until there is enough traffic to
analyze.
