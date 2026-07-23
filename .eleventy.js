module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

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

  return { dir: { input: "src", includes: "_includes", output: "_site" } };
};
