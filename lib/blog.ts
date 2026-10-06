import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { routing, type Locale } from "@/i18n/routing";

/**
 * The blog is a folder of Markdown files: content/blog/<slug>/en.md and de.md.
 * Everything else (the index, the article pages, the sitemap, metadata and
 * structured data) is generated from those files, so a new article is one new
 * folder. See content/blog/README.md for the fields.
 *
 * The folder name is the address in both languages: /blog/<slug> and
 * /de/blog/<slug>. Files are only read at build time; every page is static.
 */

const DIR = path.join(process.cwd(), "content", "blog");

export const BLOG_BASE = "/blog";
export const blogPath = (slug: string) => `${BLOG_BASE}/${slug}`;

export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  /** ISO dates (YYYY-MM-DD). */
  date: string;
  updated: string | null;
  tags: string[];
  /** Reading time, from the word count. */
  minutes: number;
  html: string;
  /** Site path of the cover image: the article's own, or the shared default. */
  cover: string;
  /** The languages this article exists in, for hreflang. */
  locales: Locale[];
};

const WORDS_PER_MINUTE = 200;

// An article's cover is public/blog/<slug>/cover.<ext>; without one it gets the default.
const COVER_TYPES = ["webp", "jpg", "jpeg", "png", "svg"];
const DEFAULT_COVER = `${BLOG_BASE}/default-cover.svg`;

function coverFor(slug: string) {
  const type = COVER_TYPES.find((ext) => fs.existsSync(path.join(process.cwd(), "public", "blog", slug, `cover.${ext}`)));
  return type ? `${BLOG_BASE}/${slug}/cover.${type}` : DEFAULT_COVER;
}

// YAML turns an unquoted 2026-10-06 into a Date; keep dates as plain strings.
const isoDate = (value: unknown) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" ? value : "";

const fileFor = (slug: string, locale: Locale) => path.join(DIR, slug, `${locale}.md`);

const slugs = () =>
  fs.existsSync(DIR)
    ? fs.readdirSync(DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];

function readPost(slug: string, locale: Locale): Post | null {
  const file = fileFor(slug, locale);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  // Drafts show up while developing, never on the live site.
  if (data.draft && process.env.NODE_ENV === "production") return null;

  const date = isoDate(data.date);
  for (const [field, value] of [["title", data.title], ["description", data.description], ["date", date]]) {
    // A clear build error beats a half-empty article page.
    if (!value) throw new Error(`Blog: "${field}" is missing in content/blog/${slug}/${locale}.md`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Blog: "date" must be YYYY-MM-DD in content/blog/${slug}/${locale}.md`);
  }

  const html = (marked.parse(content, { async: false }) as string)
    // Links to other sites open in a new tab.
    .replace(/<a href="(https?:\/\/)/g, '<a target="_blank" rel="noopener noreferrer" href="$1');

  return {
    slug,
    locale,
    title: String(data.title),
    description: String(data.description),
    date,
    updated: isoDate(data.updated) || null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    minutes: Math.max(1, Math.round(content.trim().split(/\s+/).length / WORDS_PER_MINUTE)),
    html,
    cover: coverFor(slug),
    locales: routing.locales.filter((l) => fs.existsSync(fileFor(slug, l))),
  };
}

/** Every article in a language, newest first. */
export function getPosts(locale: Locale): Post[] {
  return slugs()
    .map((slug) => readPost(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export const getPost = (locale: Locale, slug: string) => (slugs().includes(slug) ? readPost(slug, locale) : null);

export const formatDate = (locale: Locale, date: string) =>
  new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
