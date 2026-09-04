/**
 * Internal link audit (memo section 8).
 *
 * Reports orphan pages, thinly-linked pages, and broken internal links so
 * linking problems surface as data instead of being noticed by accident.
 * Run against the built site: `node tools/link-audit.js`
 */
const fs = require("fs");
const path = require("path");

const SITE = "_site";
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") pages.push(p);
  }
})(SITE);

const urlOf = (f) => "/" + path.relative(SITE, path.dirname(f)).split(path.sep).join("/") + "/";
const known = new Set(pages.map(urlOf).map((u) => (u === "//" ? "/" : u)));

const inbound = new Map([...known].map((u) => [u, new Set()]));
const broken = [];

for (const f of pages) {
  const from = urlOf(f) === "//" ? "/" : urlOf(f);
  const html = fs.readFileSync(f, "utf8");
  // strip nav/footer so sitewide chrome does not mask real orphans
  const body = html.replace(/<nav[\s\S]*?<\/nav>/gi, "").replace(/<footer[\s\S]*?<\/footer>/gi, "");
  for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) {
    let href = m[1];
    if (/\.(pdf|xml|txt|png|jpe?g|css|js|webmanifest|ico|mp4)$/i.test(href)) continue;
    if (!href.endsWith("/")) href += "/";
    if (known.has(href)) {
      if (href !== from) inbound.get(href).add(from);
    } else {
      broken.push({ from, href });
    }
  }
}

const orphans = [...inbound].filter(([u, s]) => s.size === 0 && u !== "/");
const thin = [...inbound].filter(([u, s]) => s.size > 0 && s.size < 2 && u !== "/");

console.log(`pages: ${pages.length}`);
console.log(`\nORPHANS (no contextual inbound link, chrome excluded): ${orphans.length}`);
orphans.forEach(([u]) => console.log("   " + u));
console.log(`\nTHINLY LINKED (exactly 1 inbound): ${thin.length}`);
thin.forEach(([u, s]) => console.log(`   ${u}  <- ${[...s][0]}`));
console.log(`\nBROKEN INTERNAL LINKS: ${broken.length}`);
broken.slice(0, 20).forEach((b) => console.log(`   ${b.from} -> ${b.href}`));

process.exitCode = broken.length > 0 ? 1 : 0;
