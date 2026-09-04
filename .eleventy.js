module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/forms": "forms" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
  // IndexNow ownership key. Must be reachable at the site root or IndexNow
  // rejects every submission. Named by the key value itself, per the spec.
  eleventyConfig.addPassthroughCopy({ "src/bc10900418a84a23a3fb1da926b6ed98.txt": "bc10900418a84a23a3fb1da926b6ed98.txt" });

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

  // Newest published post date — used as <lastmod> for the index pages so the
  // sitemap reflects real freshness instead of the build timestamp.
  eleventyConfig.addFilter("newestPostDate", (posts) => {
    if (!posts || !posts.length) return new Date().toISOString().slice(0, 10);
    const newest = posts.reduce((a, p) => (p.date > a ? p.date : a), posts[0].date);
    return new Date(newest).toISOString().slice(0, 10);
  });

  return { dir: { input: "src", includes: "_includes", output: "_site" } };
};
