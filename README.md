# Prisoner Legal Aid — Website & Writ Large Blog

Static site built with Eleventy. Every blog post is a Markdown file — publishing means committing a file.

## Structure
- `src/index.njk` — homepage (pulls the 3 newest posts + videos automatically)
- `src/blog.njk` — blog index at /blog/
- `src/posts/*.md` — blog posts (this is where Claude automations commit new posts)
- `src/_data/videos.json` — YouTube video + Shorts IDs shown on the homepage
- `src/_includes/` — base layout and post layout
- `src/css/style.css` — the "pleading paper" design system

## Publish a new blog post
Add a file to `src/posts/` named like `my-post-slug.md`:

```markdown
---
title: "Post Title"
description: "One-sentence summary shown on cards and in search results."
date: 2026-08-01
category: "Civil Rights · § 1983"
---
Post body in Markdown...
```

Commit → the site rebuilds and the post appears at /blog/my-post-slug/ and on the homepage. The standard call-to-action (phone, email, zero upfront fees) is appended to every post automatically by the layout.

## Update videos
Edit `src/_data/videos.json` — put the YouTube video ID (the part after `watch?v=` or `/shorts/`) into `featured.id` and the three `shorts` entries, and set `channelUrl` to the real channel.

## Local build
```
npm install
npm run build     # output in _site/
```

## Deploy on Cloudflare Pages (one-time, ~5 minutes, works from a phone)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** → choose **GitLab** and authorize.
2. Select this repository.
3. Build command: `npx @11ty/eleventy` — Output directory: `_site`
4. Deploy, then add custom domains `prisonerlegalaid.com` and `prisonerlegalaid.blog` under the project's Custom Domains tab.

After that, every commit (including commits Claude makes) publishes automatically in about a minute.

## Contact anchors used across the site
Phone 786-408-5073 · info@prisonerlegalaid.com · Mon–Fri 9–6, Sat 10–2 EST
