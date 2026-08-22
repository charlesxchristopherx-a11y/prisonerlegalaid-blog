module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  // Google Search Console ownership verification file. Passthrough (not a
  // template) so the bytes Google fetches match the bytes it issued exactly.
  // Google requires this file to STAY in place permanently — removing it
  // un-verifies the property. Do not delete.
  eleventyConfig.addPassthroughCopy({
    "src/static/google987f21ef8371cd2b.html": "google987f21ef8371cd2b.html",
  });
  // ...and stop Eleventy ALSO processing it as a template, which would emit a
  // stray duplicate at /static/<name>/index.html.
  eleventyConfig.ignores.add("src/static/**");

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
