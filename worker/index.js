// Prisoner Legal Aid — Worker entry point
// Serves the static Eleventy build, plus one live API route that pulls
// the latest videos from the Prisoner Legal Aid YouTube channel at request time.
// No redeploy is ever needed for new videos to appear — the Worker fetches
// YouTube's channel feed server-side (no CORS restriction applies to
// server-to-server fetches) and caches the result at the edge for 15 minutes.

const CHANNEL_ID = "UC8OGpuULR69am3VVphh6lqw"; // @PrisonerLegalAidChannel — single consolidated house channel (2026-09-11)
const CHANNEL_URL = "https://www.youtube.com/@PrisonerLegalAidChannel";
const CACHE_SECONDS = 900; // 15 minutes

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Canonicalize: www.prisonerlegalaid.blog -> prisonerlegalaid.blog
    // Mirrors the .com worker. Note this only fires if a DNS record for the
    // www hostname exists and is proxied through Cloudflare — without one the
    // name is NXDOMAIN and the request never reaches this Worker at all.
    if (url.hostname === "www.prisonerlegalaid.blog") {
      url.hostname = "prisonerlegalaid.blog";
      return Response.redirect(url.toString(), 301);
    }

    // Legacy WordPress-era URLs (301).
    //
    // These paths do not exist in this repo and have been returning 404 since
    // the Eleventy rebuild. They are not obscure: Search Console shows they
    // carry 3,846 impressions and 7 clicks over the last eight months, which
    // is ~91% of all search visibility this domain has. Two of them still sit
    // at average position 9.0 and 9.2 -- Google is ranking pages that answer
    // with a 404. Every impression is wasted and the accumulated equity is
    // decaying.
    //
    // Each target below is the closest genuinely relevant live page. A 301 to
    // an unrelated page is treated as a soft 404 by Google and recovers
    // nothing, so relevance matters more than salvaging every last URL.
    //
    // /what-is-a-legal-brief/ -- REVERSED 2026-09-18 by brain-session decision.
    //
    // THE PRIOR REASONING, kept because it is evidence-based and may well be
    // right: it is the single largest source of impressions (1,372) and the
    // worst of them -- it ranks for "legal brief meaning", "legal brief
    // definition", "parts of a legal brief". That is law students, not families
    // of federal prisoners. One click in eight months. There is no relevant
    // live target, and pointing it at one imports the wrong topical signal into
    // a site trying to be unmistakably about federal post-conviction relief.
    // 404 is the honest answer for content that was removed, and Google treats
    // a 301 to an unrelated page as a soft 404 anyway -- so this recovers
    // little while muddying the topic.
    //
    // THE NEW REASONING: repeated 404s on indexed URLs depress crawl trust for
    // the whole domain, and /blog/ is a defensible generic target.
    //
    // If impressions for "legal brief meaning" start converting into /blog/
    // sessions that bounce, revert this line. The prior analysis is above so
    // the decision can be re-made on evidence rather than re-litigated blind.
    const LEGACY_REDIRECTS = {
      "/what-is-a-legal-brief/": "/blog/",
      "/confidentiality-legal-services-prisoners/": "/",
      "/confidentiality-in-legal-document-preparation-guide/": "/",
      "/legal-consultation-for-inmates/": "/",
      "/how-to-request-legal-consultation-case-planning/": "/",
      "/legal-document-preparer-us/": "/",
      "/benefits-of-legal-document-preparation-for-prisoners/": "/",
      "/document-preparation-for-incarcerated-guide/": "/forms/",
      "/strategies-for-litigation-planning-without-a-lawyer/": "/checklists/",
      "/legal-merit-court-assessment/": "/case-file/",
      "/advantages-of-affordable-legal-assistance-for-inmates/": "/pricing/",
      "/civil-rights-litigation-justice-prison/": "/litigation/",
      "/civil-rights-litigation-prisoners/": "/litigation/",
      "/state-court-litigation-basics-usa/": "/topics/2254-habeas/",
      "/hello-world/": "/",
      // Added 2026-10-22: two more WordPress-era paths still drawing Google
      // visits (GA4, Apr to Oct 2026) and answering 404.
      "/key-types-of-legal-documents-for-prisoners/": "/forms/",
      "/indigent-representation-us-courts/": "/blog/filing-a-2255-motion-costs-self-representation-and-challenges/"
    };
    {
      const p = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
      const target = LEGACY_REDIRECTS[p];
      if (target) {
        return Response.redirect(new URL(target, url.origin).toString(), 301);
      }
    }

    // Cloudflare injects a managed robots.txt that allows search crawling but
    // carries no Sitemap: directive, so nothing points a crawler at the sitemap.
    // Serving our own here adds that pointer. (Mirrors the .com worker.)
    // Google Search Console ownership verification.
    // Served from the Worker, NOT as a static asset: Cloudflare Assets strips
    // the .html extension and 307-redirects to the extensionless path, and
    // Google's file verification wants a clean 200 at the exact URL.
    // DO NOT REMOVE — deleting this un-verifies the Search Console property.
    if (url.pathname === "/google987f21ef8371cd2b.html") {
      return new Response("google-site-verification: google987f21ef8371cd2b.html\n", {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" },
      });
    }

    if (url.pathname === "/robots.txt") {
      return new Response(
        "User-agent: *\n" +
        "Allow: /\n\n" +
        "Sitemap: https://prisonerlegalaid.blog/sitemap.xml\n" +
        "Sitemap: https://prisonerlegalaid.blog/sitemap.rss\n",   // RSS 2.0 feed (Hands Brief 34 task 6)
        { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } }
      );
    }

    if (url.pathname === "/api/youtube-videos") {
      return getYouTubeVideos(env, ctx);
    }

    // AI-agent readiness (2026-10-16, is-agentic.com scan). Agents that ask for
    // Markdown (Accept: text/markdown) get Markdown; browsers get the same HTML as
    // before. Three cases: the homepage, the ?mode=agent view, and missing pages.
    const isHome = url.pathname === "/" || url.pathname === "/index.html";
    const agentMode = url.searchParams.get("mode") === "agent";
    const wantsMd = prefersMarkdown(request);

    if (isHome && (agentMode || wantsMd)) {
      const llms = await env.ASSETS.fetch(new Request(new URL("/llms.txt", url.origin)));
      let body = llms.ok ? await llms.text() : "# Writ Large\n\nSee https://prisonerlegalaid.blog/\n";
      if (agentMode) body = AGENT_VIEW + "\n---\n\n" + body;
      return markdown(body, 200);
    }

    const res = await env.ASSETS.fetch(request);

    if (wantsMd && res.status === 404) {
      return markdown(
        "# 404: page not found\n\n" +
        "There is no page at `" + url.pathname + "` on prisonerlegalaid.blog.\n\n" +
        "- Site overview for agents: https://prisonerlegalaid.blog/llms.txt\n" +
        "- Every page: https://prisonerlegalaid.blog/sitemap.xml\n" +
        "- Articles: https://prisonerlegalaid.blog/blog/\n",
        404
      );
    }

    // The homepage now varies by Accept, so caches must key on it.
    if (isHome) {
      const out = new Response(res.body, res);
      out.headers.append("Vary", "Accept");
      return out;
    }
    return res;
  },
};

// True when the client ranks text/markdown at least as high as text/html.
function prefersMarkdown(request) {
  const accept = (request.headers.get("accept") || "").toLowerCase();
  if (!accept.includes("text/markdown")) return false;
  const q = (type) => {
    for (const part of accept.split(",")) {
      const [t, ...params] = part.trim().split(";");
      if (t.trim() !== type) continue;
      const qp = params.find((p) => p.trim().startsWith("q="));
      return qp ? parseFloat(qp.trim().slice(2)) || 0 : 1;
    }
    return -1;
  };
  return q("text/markdown") >= q("text/html");
}

function markdown(body, status) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

const AGENT_VIEW = `# Writ Large: agent view

Machine-readable summary of what this site offers and how an agent can use it.
Operated by Prisoner Legal Aid LLC. Not a law firm; no attorney-client relationship.

## Capabilities

- Explain federal post-conviction options in plain English (28 U.S.C. 2255, 2241, 2254, compassionate release under 18 U.S.C. 3582(c)(1)(A), First Step Act time credits).
- Point a person to the official federal court forms: https://prisonerlegalaid.blog/forms/
- Filing checklists: https://prisonerlegalaid.blog/checklists/
- Free BOP closer-to-home transfer request generator (runs in the browser, no account): https://prisonerlegalaid.blog/transfer-request/
- Human help: free case review by phone or form (see Contact below). Agents should hand the person to a human for anything case-specific.

## Endpoints

| Endpoint | Method | Auth | Returns |
|---|---|---|---|
| / with Accept: text/markdown | GET | none | Site overview in Markdown |
| /llms.txt | GET | none | Site overview in Markdown |
| /sitemap.xml | GET | none | Every page (XML sitemap) |
| /sitemap.rss | GET | none | Latest 20 articles (RSS 2.0) |
| /api/youtube-videos | GET | none | Latest videos, JSON {videos:[{id,title}], channelUrl} |
| any missing path with Accept: text/markdown | GET | none | Markdown 404 with links |

## Authentication

None. Every page and endpoint above is public and read-only. There is no account system and no write API. Intake forms are for humans only; do not submit them on someone's behalf without that person's consent.

## Contact

- Phone: +1-786-408-5073 (Mon to Fri 9 AM to 6 PM, Sat 10 AM to 2 PM Eastern)
- Email: info@prisonerlegalaid.com
`;

// 2026-10-17: videos come from our permanent list (Cloudflare KV namespace
// PLA_VIDEO_LIST, shared with prisonerlegalaid.com and fed by the n8n publisher at
// upload time). YouTube's RSS feed only ADDS to it. Before this, a YouTube feed
// outage (10-03, 10-16) emptied the section, because the only fallback was a
// per-data-center cache.
//   feed OK            -> 200 {videos}  merged feed + saved list, saved back to KV
//   feed down, saved   -> 200 {videos, source:"saved-list"}  X-Video-Source: saved-list
//   feed down, nothing -> 502 {videos:[], error:{...}}  never cached (fail loudly)
async function getYouTubeVideos(env, ctx) {
  const cache = caches.default;
  const cacheKey = new Request("https://cache.internal/youtube-videos-v3");
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const saved = await readList(env);
  let feed = [], upstreamStatus = null, upstreamError = null;
  try {
    const feedRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; PrisonerLegalAidBot/1.0)" } }
    );
    upstreamStatus = feedRes.status;
    if (feedRes.ok) feed = parseFeed(await feedRes.text());
  } catch (err) {
    upstreamError = String(err && err.message ? err.message : err);
  }

  const json = (body, status, cacheControl, source) => new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
      "Access-Control-Allow-Origin": "*",
      ...(source ? { "X-Video-Source": source } : {}),
    },
  });

  if (feed.length) {
    const save = saveMerged(env, feed, "feed");
    if (ctx && ctx.waitUntil) ctx.waitUntil(save); else await save;
  }
  const merged = mergeEntries(feed, saved);
  const videos = merged.slice(0, 4).map((v) => ({ id: v.id, title: v.title || "Writ Large TV" }));

  if (!videos.length) {
    return json({
      videos: [],
      channelUrl: CHANNEL_URL,
      error: { code: "upstream_unavailable", message: "Could not read the YouTube channel feed and no saved list exists.", upstreamStatus, upstreamError },
    }, 502, "no-store");
  }

  if (!feed.length) {
    return json({ videos, channelUrl: CHANNEL_URL, source: "saved-list",
      notice: "YouTube's feed did not answer; showing our saved list of videos." }, 200, "public, max-age=300", "saved-list");
  }

  const response = json({ videos, channelUrl: CHANNEL_URL }, 200, `public, max-age=${CACHE_SECONDS}`, "feed+saved-list");
  await cache.put(cacheKey, response.clone());
  return response;
}

const LIST_KEY = "list";
const LIST_MAX = 200;

async function readList(env) {
  if (!env || !env.VIDEO_LIST) return [];
  try {
    const j = await env.VIDEO_LIST.get(LIST_KEY, "json");
    return (j && Array.isArray(j.entries)) ? j.entries : [];
  } catch (e) {
    return [];
  }
}

function mergeEntries(...lists) {
  const byId = new Map();
  for (const list of lists) for (const e of list || []) if (e && e.id && !byId.has(e.id)) byId.set(e.id, e);
  return [...byId.values()]
    .sort((a, b) => String(b.published || "").localeCompare(String(a.published || "")))
    .slice(0, LIST_MAX);
}

async function saveMerged(env, fresh, addedBy) {
  if (!env || !env.VIDEO_LIST || !fresh || !fresh.length) return;
  const saved = await readList(env);
  const merged = mergeEntries(fresh.map((e) => ({ ...e, addedBy: e.addedBy || addedBy })), saved);
  const sig = (l) => l.map((e) => e.id + "|" + e.title).join();
  if (sig(merged) === sig(saved)) return;
  await env.VIDEO_LIST.put(LIST_KEY, JSON.stringify({ updatedAt: new Date().toISOString(), entries: merged }));
}

function parseFeed(xml) {
  const entries = xml.split("<entry>").slice(1);
  const videos = [];
  for (const block of entries.slice(0, 15)) {
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch =
      block.match(/<media:title>([^<]+)<\/media:title>/) ||
      block.match(/<title>([^<]+)<\/title>/);
    const pubMatch = block.match(/<published>([^<]+)<\/published>/);
    const descMatch = block.match(/<media:description>([\s\S]*?)<\/media:description>/);
    if (idMatch) {
      videos.push({
        id: idMatch[1],
        title: titleMatch ? decodeXmlEntities(titleMatch[1]) : "Writ Large TV",
        published: pubMatch ? pubMatch[1] : "",
        description: descMatch ? decodeXmlEntities(descMatch[1]).slice(0, 500) : "",
      });
    }
  }
  return videos;
}

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
