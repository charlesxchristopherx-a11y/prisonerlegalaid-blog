// Worker behavior tests: `npm test` (run `npm run build` first so _site exists).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../worker/index.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const site = path.join(root, "_site");
globalThis.caches = { default: { match: async () => null, put: async () => {} } };
const ASSETS = {
  fetch: async (req) => {
    let p = new URL(req.url).pathname;
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(site, p);
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return new Response(fs.readFileSync(f), { headers: { "content-type": p.endsWith(".html") ? "text/html" : "text/plain" } });
    return new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
  },
};
const memKV = (initial) => {
  const m = new Map(initial ? [["list", JSON.stringify(initial)]] : []);
  return { get: async (k, t) => (m.has(k) ? (t === "json" ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => { m.set(k, v); }, raw: m };
};
const FEED = `<feed><entry><yt:videoId>AAAAAAAAAAA</yt:videoId><published>2026-10-16T18:00:00+00:00</published><media:title>Feed One</media:title></entry></feed>`;
const realFetch = globalThis.fetch;
const mockYT = (ok) => { globalThis.fetch = async (u) => String(u).includes("youtube.com/feeds") ? (ok ? new Response(FEED) : new Response("", { status: 404 })) : realFetch(u); };
const SAVED = { entries: [{ id: "SSSSSSSSSSS", title: "Saved Video", published: "2026-10-01T00:00:00Z" }] };
const call = (p, env, headers = {}) => worker.fetch(new Request("https://prisonerlegalaid.blog" + p, { headers }), { ASSETS, ...env }, { waitUntil: (x) => x });

test("homepage Markdown for agents, HTML for browsers", async () => {
  const md = await call("/", {}, { accept: "text/markdown" });
  assert.match(md.headers.get("content-type"), /^text\/markdown/);
  assert.match(md.headers.get("vary"), /Accept/);
  const html = await call("/", {}, { accept: "text/html" });
  assert.match(html.headers.get("content-type"), /text\/html/);
});

test("Markdown 404 for agents", async () => {
  const r = await call("/no-such-page/", {}, { accept: "text/markdown" });
  assert.equal(r.status, 404);
  assert.match(r.headers.get("content-type"), /^text\/markdown/);
});

test("videos: feed up merges with the saved list and saves it", async () => {
  mockYT(true);
  const kv = memKV(SAVED);
  const r = await call("/api/youtube-videos", { VIDEO_LIST: kv });
  assert.equal(r.status, 200);
  assert.deepEqual((await r.json()).videos.map((v) => v.id), ["AAAAAAAAAAA", "SSSSSSSSSSS"]);
  await new Promise((res) => setTimeout(res, 10));
  assert.equal(JSON.parse(kv.raw.get("list")).entries.length, 2);
  globalThis.fetch = realFetch;
});

test("videos: feed down serves the saved list with 200", async () => {
  mockYT(false);
  const r = await call("/api/youtube-videos", { VIDEO_LIST: memKV(SAVED) });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("x-video-source"), "saved-list");
  assert.equal((await r.json()).videos[0].id, "SSSSSSSSSSS");
  globalThis.fetch = realFetch;
});

test("videos: feed down and nothing saved fails loudly (502)", async () => {
  mockYT(false);
  const r = await call("/api/youtube-videos", { VIDEO_LIST: memKV(null) });
  assert.equal(r.status, 502);
  globalThis.fetch = realFetch;
});
