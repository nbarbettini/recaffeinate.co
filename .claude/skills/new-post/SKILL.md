---
name: new-post
description: Use this skill when the user asks to draft, write, or add a new blog post for recaffeinate.co. Handles file location, frontmatter, the home-page excerpt cutoff, and link conventions.
---

# Writing a new recaffeinate.co post

## File location

Create a new file at `src/content/post/<kebab-slug>.md`. The slug becomes the URL (`/post/<slug>/`).

## Frontmatter

Required fields (match the style of recent posts like `introducing-mcp-debugger.md`):

```yaml
---
title: "Post Title"
description: "One-sentence summary used for meta description and previews."
date: 2026-05-20T12:00:00-08:00
tags: ["tag1", "tag2"]
---
```

- `date` is an ISO timestamp with timezone offset. Use today's date unless the user says otherwise.
- Title casing: the user tends to prefer sentence case ("Two million views"), not title case. If unsure, ask or mirror nearby posts.
- Quote-escape any double quotes inside `description` (`\"`).

## Home-page excerpt: `<!--more-->` is required

`src/pages/index.astro` builds each home-page preview by:

1. Looking for `<!--more-->` and slicing everything before it.
2. Falling back to the first `## ` heading.
3. If neither exists, **the entire post body is rendered on the home page**.

The user wants posts to show only a teaser before the jump. Posts without level-2 headings (like personal/reflective ones) **must** include an explicit `<!--more-->` marker after the first paragraph or two. Place it on its own line with blank lines around it:

```markdown
First paragraph that hooks the reader.

<!--more-->

Rest of the post...
```

When `<!--more-->` is present (or a `##` cuts the preview), the home page shows a "keep reading..." link with the reading time.

## Links

Use inline markdown links, not footnote-style reference links (`[text][1]` … `[1]: url`). The user has explicitly asked for inline links.

```markdown
My talk [**Title in bold**](https://youtube.com/...) crossed two million views.
```

Bold inside the link text is fine.

## Images

Images live under `public/img/post/<slug>/`. Reference them with `<img src="/img/post/<slug>/file.png" ...>` (raw HTML is used in existing posts, e.g. `introducing-mcp-debugger.md`). Don't invent image paths — only add `<img>` tags if the user has provided or asked for an image.

## Tone

The user writes in first person, conversational, with short paragraphs. Don't add boilerplate sections (no "Conclusion", no "TL;DR" unless asked). Don't add a closing CTA unless the source draft has one.

## After writing

- Don't run the dev server unless asked.
- Don't commit unless asked.
- In the summary, mention the file path and any notable structural choices (e.g. "added `<!--more-->` after the first paragraph").

## Common mistakes to avoid

- Forgetting `<!--more-->` on posts without `##` headings → whole post leaks onto the home page.
- Using reference-style links — convert to inline.
- Title-casing the title when nearby posts use sentence case.
- Inventing an `image:` or `postimage:` frontmatter field — only add it if the user supplies an image.
