import { MetadataRoute } from "next";
import { USE_CASES, USE_CASES_BASE, siteUrl, useCasePath } from "@/data/use-cases";

const paths = ["", "/about", "/impressum", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...pages, ...useCases];
}
