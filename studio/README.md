# AIVIK Studio

The editor for the blog on aivik.eu, built with [Sanity Studio](https://www.sanity.io/docs/studio).
It is its own app with its own dependencies: the website never imports from this
folder, and the website's build and type-check skip it (`tsconfig.json`,
`.vercelignore`).

```bash
cd studio
npm install
npm run dev        # http://localhost:3333
npm run typecheck
npm run deploy     # publishes the editor to https://aivik.sanity.studio
```

- Project `qs3r3e0a`, dataset `production` (`sanity.config.ts`, `sanity.cli.ts`).
- The content model is in `schemaTypes/`. `post.ts` is the article: one document
  with an English and a German version that share the address, date, category and tags.
- Changing the model means changing the code that reads it in `lib/blog.ts`, in the same PR.

## How publishing reaches the website

- The website reads published articles from Sanity on the server and caches the
  pages (`lib/sanity.ts`, `lib/blog.ts`).
- A Sanity webhook calls `https://aivik.eu/api/revalidate` on every change to an
  article, category, tag or author; the pages are rebuilt on their next visit.
  Without the webhook they catch up within an hour.
- An article with a future date appears on that day (German time), within the hour.
- "Open preview" in an article's ⋯ menu shows unpublished changes on the website
  for that editor only (`app/api/draft`).

## For editors

1. **Articles → +**. Write the English tab, the Deutsch tab, or both. A language
   left empty is simply not listed in that language.
2. **Details**: the address is filled in from the headline (Generate) and can't
   change after publishing. Pick a category, up to three tags and a date.
3. **⋯ → Open preview** to see the page before it is public.
4. **Publish**. The article is on the website within a few seconds.

To take an article down, use **⋯ → Unpublish**.
