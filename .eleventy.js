module.exports = function (eleventyConfig) {
  // Family Help Line (2026-10-17, Chris): families are routed to the Prisoner Legal Aid
  // Family Help Line, not to one person. Articles already staged before this date still
  // carry the old line; rewrite it at build time so nothing published says "ask for Charles
  // Christopher". Byline and About the Author pages are not touched.
  eleventyConfig.addTransform("family-help-line", function (content) {
    if (!(this.page && this.page.outputPath && this.page.outputPath.endsWith(".html"))) return content;
    const CALL = '<a href="tel:+17864085073">786-408-5073</a>';
    const TEXT = '<a href="sms:+17276350600">727-635-0600</a>';
    return content
      .replace(/call <strong>786-408-5073<\/strong> and ask for Charles Christopher/g,
        'call the Prisoner Legal Aid Family Help Line at <strong>' + CALL + '</strong>, or text <strong>' + TEXT + '</strong>')
      .replace(/call Charles Christopher at 786-408-5073/g,
        'call the Prisoner Legal Aid Family Help Line at ' + CALL + ' or text ' + TEXT);
  });

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/forms": "forms" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
  // IndexNow ownership key. Must be reachable at the site root or IndexNow
  // rejects every submission. Named by the key value itself, per the spec.
  eleventyConfig.addPassthroughCopy({ "src/bc10900418a84a23a3fb1da926b6ed98.txt": "bc10900418a84a23a3fb1da926b6ed98.txt" });

  // llms.txt (added 2026-09-09). A plain-text/Markdown overview of the site's
  // real sections for AI agents that fetch it on demand (coding assistants,
  // chat browsing). Has no effect on Google ranking or AI Overviews -- major
  // search crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot) read the
  // HTML directly and skip this file -- so treat it as a low-cost, low-risk
  // addition, not an SEO lever. Must stay accurate to the real nav/footer;
  // update it in the same commit as any nav/footer link change.
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });
  // IndexNow key for this host only (Hands Brief 33, 2026-10-05). One key per domain.
  eleventyConfig.addPassthroughCopy({ "src/0e3c8e6bf67f8dfe95bf35887933f851.txt": "0e3c8e6bf67f8dfe95bf35887933f851.txt" });

  // NOTE: the Google Search Console verification file is NOT served from here.
  // Cloudflare Workers Assets strips the .html extension and 307-redirects
  // /google<token>.html -> /google<token>, and Google's file verification wants
  // a clean 200 at the exact URL. It is served directly by worker/index.js.

  // Blog posts collection, newest first — future-dated posts are excluded
  // until their date arrives. This lets a batch of posts be written and
  // pushed at once, then drip-publish one per day automatically.
  eleventyConfig.addCollection("posts", (c) =>
    c
      .getFilteredByGlob("src/posts/*.md")
      .filter((p) => p.date <= new Date())
      .sort((a, b) => b.date - a.date)
  );

  // Track split (added 2026-09-02). Writ Large's core scope is federal
  // post-conviction relief; a large body of older posts covers prison
  // conditions / civil-rights topics that belong to the .com brand. Rather
  // than move those posts (which would break their live URLs), the blog
  // index presents them as two labelled sections so the post-conviction
  // focus reads clearly to both human readers and search/AI crawlers.
  // Nothing is hidden -- every post remains published at its existing URL
  // and in the sitemap. Same future-date drip filter applies to both.
  const publishedSorted = (c) =>
    c
      .getFilteredByGlob("src/posts/*.md")
      .filter((p) => p.date <= new Date())
      .sort((a, b) => b.date - a.date);

  eleventyConfig.addCollection("postsPostConviction", (c) =>
    publishedSorted(c).filter((p) => p.data.track === "post-conviction")
  );

  eleventyConfig.addCollection("postsInsideRights", (c) =>
    publishedSorted(c).filter((p) => p.data.track !== "post-conviction")
  );

  eleventyConfig.addFilter("dateDisplay", (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("dateISO", (d) => new Date(d).toISOString().slice(0, 10));
  // RFC-822 dates for /sitemap.rss (Hands Brief 33). Noon UTC so a date-only post never slips a day.
  eleventyConfig.addFilter("rssDate", (d) => { const x = new Date(d); if (!x.getUTCHours() && !x.getUTCMinutes()) x.setUTCHours(12); return x.toUTCString().replace("GMT", "+0000"); });
  eleventyConfig.addFilter("xmlEscape", (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"));

  // Newest published post date — used as <lastmod> for the index pages so the
  // sitemap reflects real freshness instead of the build timestamp.
  eleventyConfig.addFilter("newestPostDate", (posts) => {
    if (!posts || !posts.length) return new Date().toISOString().slice(0, 10);
    const newest = posts.reduce((a, p) => (p.date > a ? p.date : a), posts[0].date);
    return new Date(newest).toISOString().slice(0, 10);
  });


  // SEO check (added 2026-10-18 from the SEO audit). Warns, never fails the
  // build, so an unattended publish is never blocked. Grep the build log for
  // "SEO CHECK" to see problems. Limits: meta description 160 characters,
  // <title> 60 characters, no em or en dashes in either.
  eleventyConfig.addLinter("seo-check", function (content) {
    const out = this.page && this.page.outputPath;
    if (!out || !String(out).endsWith(".html") || String(out).includes("/team/")) return;
    const d = (content.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    const t = (content.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const un = (s) => String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    const where = this.page.inputPath;
    if (d !== undefined) {
      const dd = un(d);
      if (dd.length > 160) console.warn(`SEO CHECK: description is ${dd.length} chars (max 160) in ${where}`);
      if (/[\u2013\u2014]/.test(dd)) console.warn(`SEO CHECK: dash in description in ${where}`);
    }
    if (t !== undefined) {
      const tt = un(t);
      if (tt.length > 60) console.warn(`SEO CHECK: title is ${tt.length} chars (max 60, use seoTitle) in ${where}`);
      if (/[\u2013\u2014]/.test(tt)) console.warn(`SEO CHECK: dash in title in ${where}`);
    }
  });


  // Warn when a post's hub: value is not a key in src/_data/hubs.js. A wrong
  // key silently drops the post from its topic hub page (found 2026-10-18).
  eleventyConfig.on("eleventy.after", function () {
    const fs = require("fs"), path = require("path");
    const keys = new Set(require("./src/_data/hubs.js").map((h) => h.key));
    const dir = path.join(__dirname, "src", "posts");
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const m = fs.readFileSync(path.join(dir, f), "utf8").match(/^hub:\s*"?([^"\n]+)"?\s*$/m);
      if (m && !keys.has(m[1].trim())) console.warn(`SEO CHECK: unknown hub key "${m[1].trim()}" in src/posts/${f}`);
    }
  });

  return { dir: { input: "src", includes: "_includes", output: "_site" } };
};
