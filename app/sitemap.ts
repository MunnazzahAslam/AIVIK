import { MetadataRoute } from "next";
import { USE_CASES, USE_CASES_BASE, siteUrl, useCasePath } from "@/data/use-cases";
import { routing } from "@/i18n/routing";
import { BLOG_BASE, blogPath, getPosts } from "@/lib/blog";

const paths = ["", "/about", "/impressum", "/privacy"];

// Built on each request instead of once at build time: a prebuilt sitemap did
// not pick up newly published articles. The blog data behind it is still cached.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `https://aivik.eu${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.3,
    alternates: {
      languages: {
        en: `https://aivik.eu${path}`,
        de: `https://aivik.eu/de${path}`,
      },
    },
  }));

  // Use cases: the index and one page per case. Their paths differ per language.
  const useCases: MetadataRoute.Sitemap = [
    { en: USE_CASES_BASE.en, de: USE_CASES_BASE.de, priority: 0.8 },
    ...USE_CASES.map((u) => ({ en: useCasePath("en", u), de: useCasePath("de", u), priority: 0.7 })),
  ].map(({ en, de, priority }) => ({
    url: siteUrl("en", en),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages: { en: siteUrl("en", en), de: siteUrl("de", de) } },
  }));

  // Blog: the index and one entry per article and language, read from Sanity.
  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: siteUrl("en", BLOG_BASE),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: { en: siteUrl("en", BLOG_BASE), de: siteUrl("de", BLOG_BASE) } },
    },
  ];
  const listed = await Promise.all(routing.locales.map((locale) => getPosts(locale)));
  const posts: MetadataRoute.Sitemap = listed.flatMap((inLocale) =>
    inLocale.filter((post) => !post.noindex).map((post) => ({
      url: siteUrl(post.locale, blogPath(post.slug)),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: { languages: Object.fromEntries(post.locales.map((l) => [l, siteUrl(l, blogPath(post.slug))])) },
    })),
  );

  return [...pages, ...useCases, ...blogIndex, ...posts];
}
