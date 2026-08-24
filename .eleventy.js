module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

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

  eleventyConfig.addFilter("dateDisplay", (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("dateISO", (d) => new Date(d).toISOString().slice(0, 10));

  // Newest published post date — used as <lastmod> for the index pages so the
  // sitemap reflects real freshness instead of the build timestamp.
  eleventyConfig.addFilter("newestPostDate", (posts) => {
    if (!posts || !posts.length) return new Date().toISOString().slice(0, 10);
    const newest = posts.reduce((a, p) => (p.date > a ? p.date : a), posts[0].date);
    return new Date(newest).toISOString().slice(0, 10);
  });

  return { dir: { input: "src", includes: "_includes", output: "_site" } };
};
