import { MetadataRoute } from "next";

const paths = ["", "/about", "/impressum", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
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
}
