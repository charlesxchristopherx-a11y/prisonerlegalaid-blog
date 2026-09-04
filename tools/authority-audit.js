#!/usr/bin/env node
/**
 * authority-audit.js -- enforces the P1.11 primary-source citation standard.
 *
 * Rule: every hub-assigned core article must carry at least one `authorities:`
 * entry, and every entry must have both a citation and a URL pointing at an
 * approved primary source.
 *
 * This exists because the standard is only worth having if it cannot quietly
 * rot. A new core article with no authority block, or one citing a blog post
 * instead of the statute, fails here rather than shipping.
 *
 * Approved hosts, in the order the editorial standards prefer them:
 *   uscode.house.gov    -- official U.S. Code (Office of the Law Revision Counsel)
 *   www.supremecourt.gov -- slip opinions with no U.S. Reports page yet
 *   www.courtlistener.com -- reported decisions
 *   www.ecfr.gov / www.govinfo.gov -- regulations and legislative material
 *
 * Usage: node tools/authority-audit.js
 * Exit 0 = pass, 1 = fail.
 */
const fs = require("fs");
const path = require("path");

const POSTS = path.join(__dirname, "..", "src", "posts");
const ALLOWED = [
  "uscode.house.gov",
  "www.supremecourt.gov",
  "www.courtlistener.com",
  "www.ecfr.gov",
  "www.govinfo.gov",
];

const problems = [];
let core = 0;
let entries = 0;

for (const file of fs.readdirSync(POSTS).filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(POSTS, file), "utf8");
  const fm = raw.split(/^---\s*$/m)[1];
  if (!fm || !/^hub:/m.test(fm)) continue; // only core articles are in scope
  core++;

  const slug = file.replace(/\.md$/, "");
  // Line-based rather than regex: the authorities: block runs to the next
  // line that starts in column 0, or to the end of the front matter. JS has
  // no \Z, so an "end of string" lookahead here is a trap.
  const lines = fm.split("\n");
  const start = lines.findIndex((l) => /^authorities:\s*$/.test(l));
  if (start === -1) {
    problems.push(`${slug}: no authorities: block`);
    continue;
  }
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    if (!/^\s/.test(lines[i])) break;
    body.push(lines[i]);
  }
  const blockText = body.join("\n");

  const cites = [...blockText.matchAll(/^\s*-\s*cite:\s*"(.+?)"\s*$/gm)].map((m) => m[1]);
  const urls = [...blockText.matchAll(/^\s*url:\s*"(.+?)"\s*$/gm)].map((m) => m[1]);

  if (cites.length === 0) {
    problems.push(`${slug}: authorities: block is empty`);
    continue;
  }
  if (cites.length !== urls.length) {
    problems.push(`${slug}: ${cites.length} cite(s) but ${urls.length} url(s) -- every cite needs a url`);
    continue;
  }

  cites.forEach((cite, i) => {
    entries++;
    const url = urls[i];
    let host;
    try {
      host = new URL(url).host;
    } catch {
      problems.push(`${slug}: malformed url for "${cite}"`);
      return;
    }
    if (!ALLOWED.includes(host)) {
      problems.push(`${slug}: "${cite}" points at ${host}, which is not an approved primary source`);
    }
  });
}

console.log(`core articles: ${core}`);
console.log(`authority entries: ${entries}`);

if (problems.length) {
  console.log(`\nFAILED: ${problems.length} problem(s)`);
  problems.forEach((p) => console.log("   " + p));
  process.exit(1);
}
console.log("\nPASS: every core article carries verified primary authority.");
