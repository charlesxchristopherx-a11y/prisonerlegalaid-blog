// Prisoner Legal Aid — Worker entry point
// Serves the static Eleventy build, plus one live API route that pulls
// the latest videos from the Writ Large TV YouTube channel at request time.
// No redeploy is ever needed for new videos to appear — the Worker fetches
// YouTube's channel feed server-side (no CORS restriction applies to
// server-to-server fetches) and caches the result at the edge for 15 minutes.

const CHANNEL_ID = "UCWGrdHP_8NanRsuV_BwR19A"; // @prisonerlegal — dedicated Writ Large channel
const CHANNEL_URL = "https://www.youtube.com/@prisonerlegal";
const CACHE_SECONDS = 900; // 15 minutes

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
