# Blog articles

Each article is a folder here with one Markdown file per language:

```
content/blog/
└── my-new-article/        ← the address: /blog/my-new-article and /de/blog/my-new-article
    ├── en.md
    └── de.md
```

To publish an article, add the folder, commit and push. The blog index, the
article page, the "More articles" cards, the sitemap, the page title and
description, the language links and the reading time are all generated from it.

## The top of each file

```md
---
title: "The headline"
description: "One or two sentences. Shown on the card, under the headline and in Google."
date: 2026-10-06
tags: ["EU AI Act", "Compliance"]
---

The article, in Markdown.
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | |
| `description` | yes | Aim for under 160 characters. |
| `date` | yes | `YYYY-MM-DD`. Newest articles are listed first. |
| `tags` | no | Up to three reads best. |
| `updated` | no | `YYYY-MM-DD`, when an article was revised. |
| `draft` | no | `draft: true` shows the article locally but not on the live site. |

The build stops with a message naming the file if a required field is missing.

## Images

- **Cover:** save it as `public/blog/<folder name>/cover.jpg` (or `.webp`, `.png`, `.svg`). It appears on the card and at the top of the article. Landscape, at least 1600 × 900, with the subject in the middle: the article page crops it to a wide strip. Without a cover the article gets the default one.
- **Inside an article:** put the file in the same folder and write `![What the image shows](/blog/<folder name>/chart.png)`.

## Writing

- Start sections with `##`. The headline itself comes from `title`, so don't repeat it as `#`.
- Links to other sites open in a new tab automatically.
- Link to our own pages with the full path for that language: `/use-cases/ai-receptionist` in `en.md`, `/de/anwendungsfaelle/ki-rezeption` in `de.md`.
- Use lowercase letters, numbers and hyphens for the folder name, and don't rename it after publishing: it is the article's address.
- An article can exist in one language only. It is then listed in that language only, and switching language on it leads to a "not found" page, so add both where possible.
