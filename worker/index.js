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
  async fetch(request, env) {
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
    // Deliberately NOT redirected: /what-is-a-legal-brief/. It is the single
    // largest source of impressions (1,372) and the worst of them -- it ranks
    // for "legal brief meaning", "legal brief definition", "parts of a legal
    // brief". That is law students, not families of federal prisoners. One
    // click in eight months. There is no relevant live target, and pointing it
    // at one would import the wrong topical signal into a site trying to be
    // unmistakably about federal post-conviction relief. It stays 404, which
    // is the honest answer for content that was removed.
    const LEGACY_REDIRECTS = {
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
      "/hello-world/": "/"
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
        "Sitemap: https://prisonerlegalaid.blog/sitemap.xml\n",
        { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } }
      );
    }

    if (url.pathname === "/api/youtube-videos") {
      return getYouTubeVideos();
    }

    return env.ASSETS.fetch(request);
  },
};

async function getYouTubeVideos() {
  const cache = caches.default;
  const cacheKey = new Request("https://cache.internal/youtube-videos");
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let videos = [];
  try {
    const feedRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; PrisonerLegalAidBot/1.0)" } }
    );
    if (feedRes.ok) {
      const xml = await feedRes.text();
      videos = parseFeed(xml);
    }
  } catch (err) {
    // Network hiccup or feed unavailable — fall through with an empty list.
    // The homepage shows a graceful "coming soon" state in this case.
  }

  const body = JSON.stringify({ videos, channelUrl: CHANNEL_URL });
  const response = new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      "Access-Control-Allow-Origin": "*",
    },
  });

  // Cache a clone at the edge so we don't hit YouTube on every single visitor.
  await cache.put(cacheKey, response.clone());
  return response;
}

function parseFeed(xml) {
  const entries = xml.split("<entry>").slice(1);
  const videos = [];
  for (const block of entries.slice(0, 4)) {
    const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch =
      block.match(/<media:title>([^<]+)<\/media:title>/) ||
      block.match(/<title>([^<]+)<\/title>/);
    if (idMatch) {
      videos.push({
        id: idMatch[1],
        title: titleMatch ? decodeXmlEntities(titleMatch[1]) : "Writ Large TV",
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
