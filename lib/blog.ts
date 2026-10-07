import { escapeHTML, toHTML, uriLooksSafe } from "@portabletext/to-html";
import { routing, type Locale } from "@/i18n/routing";
import { SANITY_DATASET, SANITY_PROJECT_ID, sanityFetch } from "@/lib/sanity";

/**
 * The blog's articles are written in the Sanity Studio (see /studio). One
 * document holds an article in both languages; everything else (the index, the
 * article pages, the sitemap, metadata and structured data) is generated from
 * those documents, so a new article needs no change here.
 *
 * The article's address is the same in both languages: /blog/<slug> and
 * /de/blog/<slug>. Pages are static; publishing in the Studio refreshes them
 * through app/api/revalidate.
 */

export const BLOG_BASE = "/blog";
export const blogPath = (slug: string) => `${BLOG_BASE}/${slug}`;

/** An article as the cards and the sitemap need it. */
export type PostSummary = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  /** ISO dates (YYYY-MM-DD). */
  date: string;
  updated: string | null;
  category: string | null;
  tags: string[];
  /** Reading time, from the word count. */
  minutes: number;
  /** The cover image: the article's own, or the shared default. */
  cover: string;
  /** Where the subject of an uploaded cover sits, as a CSS object-position. */
  coverFocus: string | null;
  /** Listed first on the blog page. */
  featured: boolean;
  /** Kept out of search engines and the sitemap. */
  noindex: boolean;
  /** The languages this article exists in, for hreflang. */
  locales: Locale[];
};

/** An article with its text, for its own page. */
export type Post = PostSummary & {
  html: string;
  /** Title and description for search engines, where they differ from the visible ones. */
  seoTitle: string | null;
  seoDescription: string | null;
  /** The original's address, for an article first published elsewhere. */
  canonical: string | null;
  author: { name: string; role: string | null } | null;
};

type Options = {
  /** Include unpublished changes and future dates: an editor previewing from the Studio. */
  preview?: boolean;
};

const WORDS_PER_MINUTE = 200;

const DEFAULT_COVER = `${BLOG_BASE}/default-cover.svg`;
// The first three articles have a cover drawn for them in public/blog/<slug>.
const DRAWN_COVERS = new Set(["ai-adoption-germany-2026", "ai-trends-2027", "eu-ai-act-german-smes"]);
const IMAGE_CDN = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/`;

type Hotspot = { x?: number; y?: number } | null;

function coverFor(slug: string, cover: { url?: string | null; hotspot?: Hotspot } | null) {
  const percent = (n: number | undefined) => `${Math.round((n ?? 0.5) * 100)}%`;
  if (cover?.url?.startsWith(IMAGE_CDN)) {
    return {
      cover: `${cover.url}?w=1920&fit=max&auto=format`,
      coverFocus: cover.hotspot ? `${percent(cover.hotspot.x)} ${percent(cover.hotspot.y)}` : null,
    };
  }
  return { cover: DRAWN_COVERS.has(slug) ? `${BLOG_BASE}/${slug}/cover.svg` : DEFAULT_COVER, coverFocus: null };
}

// Articles are dated in German time: one dated today is out from midnight in Berlin.
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());

const SUFFIX = { en: "En", de: "De" } as const;

/**
 * The fields every listing needs, for one language. `locale` is one of ours, never visitor input.
 * Words are counted in Sanity so listings don't download every article's text; the text
 * joins paragraphs without a space, so one word is added back per paragraph.
 */
const summaryFields = (locale: Locale) => `
  "slug": slug.current,
  "title": ${locale}.title,
  "description": ${locale}.description,
  date,
  updated,
  "category": coalesce(category->title${SUFFIX[locale]}, category->titleEn),
  "tags": tags[]->{ "title": coalesce(title${SUFFIX[locale]}, titleEn) }.title,
  "words": count(string::split(pt::text(${locale}.body), " ")) + count(${locale}.body[_type == "block"]),
  "cover": cover{ "url": asset->url, hotspot },
  featured,
  noindex,
  "locales": [${routing.locales.map((l) => `select(defined(${l}.title) => "${l}")`).join(", ")}]`;

// An article is listed in a language once it has a headline there, and from its date on.
const listed = (locale: Locale, preview: boolean) =>
  `_type == "post" && defined(slug.current) && defined(${locale}.title)${preview ? "" : " && date <= $today"}`;

type SummaryRow = {
  slug: string;
  title: string;
  description: string | null;
  date: string | null;
  updated: string | null;
  category: string | null;
  tags: (string | null)[] | null;
  words: number | null;
  cover: { url: string | null; hotspot: Hotspot } | null;
  featured: boolean | null;
  noindex: boolean | null;
  locales: (Locale | null)[];
};

function toSummary(row: SummaryRow, locale: Locale): PostSummary {
  return {
    slug: row.slug,
    locale,
    title: row.title,
    description: row.description ?? "",
    date: row.date ?? today(),
    updated: row.updated,
    category: row.category,
    tags: (row.tags ?? []).filter((tag): tag is string => Boolean(tag)),
    minutes: Math.max(1, Math.round((row.words ?? 0) / WORDS_PER_MINUTE)),
    ...coverFor(row.slug, row.cover),
    featured: Boolean(row.featured),
    noindex: Boolean(row.noindex),
    locales: row.locales.filter((l): l is Locale => Boolean(l)),
  };
}

/** Every article in a language: featured ones first, then newest first. */
export async function getPosts(locale: Locale, { preview = false }: Options = {}): Promise<PostSummary[]> {
  const rows = await sanityFetch<SummaryRow[]>(
    `*[${listed(locale, preview)}]{${summaryFields(locale)}}`,
    preview ? {} : { today: today() },
    { preview },
  );
  return rows
    .map((row) => toSummary(row, locale))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

type PostRow = SummaryRow & {
  body: unknown[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonical: string | null;
  author: { name: string | null; role: string | null } | null;
};

export async function getPost(locale: Locale, slug: string, { preview = false }: Options = {}): Promise<Post | null> {
  const row = await sanityFetch<PostRow | null>(
    `*[${listed(locale, preview)} && slug.current == $slug][0]{${summaryFields(locale)},
      "body": ${locale}.body[]{ ..., _type == "figure" => { ..., "url": asset->url, "size": asset->metadata.dimensions } },
      "seoTitle": ${locale}.seoTitle,
      "seoDescription": ${locale}.seoDescription,
      canonical,
      "author": author->{ name, "role": coalesce(role${SUFFIX[locale]}, roleEn) }
    }`,
    preview ? { slug } : { slug, today: today() },
    { preview },
  );
  if (!row) return null;

  return {
    ...toSummary(row, locale),
    html: bodyToHtml(row.body ?? []),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    canonical: row.canonical,
    author: row.author?.name ? { name: row.author.name, role: row.author.role } : null,
  };
}

// ─── The article text ────────────────────────────────────────────────────
// Sanity stores it as structured blocks. They become plain HTML here, styled
// by .blog-prose in globals.css.

// Images in the text go through the site's own image optimiser, like every other image.
const IMAGE_WIDTHS = [640, 828, 1200, 1920];
const optimised = (url: string, width: number) => `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;

type Figure = { url?: string; alt?: string; caption?: string; size?: { width?: number; height?: number } };
type Table = { rows?: { cells?: string[] }[] };

function figureHtml({ url, alt, caption, size }: Figure) {
  if (!url?.startsWith(IMAGE_CDN)) return "";
  const dimensions = size?.width && size?.height ? ` width="${size.width}" height="${size.height}"` : "";
  const img = `<img src="${optimised(url, 1200)}" srcset="${IMAGE_WIDTHS.map((w) => `${optimised(url, w)} ${w}w`).join(", ")}" sizes="(max-width: 1200px) 100vw, 900px" alt="${escapeHTML(alt ?? "")}"${dimensions} loading="lazy" decoding="async">`;
  return caption ? `<figure>${img}<figcaption>${escapeHTML(caption)}</figcaption></figure>` : `<figure>${img}</figure>`;
}

// The first row of a table is its heading.
function tableHtml({ rows = [] }: Table) {
  const [head, ...body] = rows;
  if (!head) return "";
  const row = (cells: string[] = [], tag: "th" | "td") => `<tr>${cells.map((cell) => `<${tag}>${escapeHTML(cell ?? "")}</${tag}>`).join("")}</tr>`;
  return `<table><thead>${row(head.cells, "th")}</thead><tbody>${body.map((r) => row(r.cells, "td")).join("")}</tbody></table>`;
}

function bodyToHtml(body: unknown[]) {
  return toHTML(body as Parameters<typeof toHTML>[0], {
    // A block the site doesn't know is left out instead of breaking the page.
    onMissingComponent: false,
    components: {
      block: {
        blockquote: ({ children }) => `<blockquote><p>${children}</p></blockquote>`,
      },
      marks: {
        link: ({ children, value }) => {
          const href: string = value?.href ?? "";
          if (!uriLooksSafe(href)) return children;
          // Links to other sites open in a new tab.
          const external = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
          return `<a${external} href="${escapeHTML(href)}">${children}</a>`;
        },
      },
      types: {
        figure: ({ value }) => figureHtml(value as Figure),
        table: ({ value }) => tableHtml(value as Table),
      },
      unknownType: () => "",
    },
  });
}

export const formatDate = (locale: Locale, date: string) =>
  new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
