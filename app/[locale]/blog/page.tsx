import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import PostCard from "@/app/components/blog/PostCard";
import PreviewBar from "@/app/components/blog/PreviewBar";
import { siteUrl } from "@/data/use-cases";
import { BLOG_BASE, getPosts } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const url = siteUrl(locale, BLOG_BASE);

  return {
    title: t("index.metaTitle"),
    description: t("index.metaDescription"),
    alternates: {
      canonical: url,
      languages: { en: siteUrl("en", BLOG_BASE), de: siteUrl("de", BLOG_BASE), "x-default": siteUrl("en", BLOG_BASE) },
    },
    openGraph: { type: "website", url, siteName: "AIVIK", title: `${t("index.metaTitle")} | AIVIK`, description: t("index.metaDescription"), locale: locale === "de" ? "de_DE" : "en_EU", images: ["/opengraph-image"] },
  };
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");
  const preview = draftMode().isEnabled;
  const posts = await getPosts(locale, { preview });

  return (
    <main>
      <Nav />
      {preview && <PreviewBar />}
      {/* White with dark cards, like the home page's use-cases section. */}
      <section style={{ backgroundColor: "var(--section-light)" }} className="px-6 pt-[150px] pb-28">
        <div className="max-w-6xl mx-auto">
          {/* The nav takes its colours from this block, not the whole section: it
              stays in view as a whole however long the list of articles gets. */}
          <div data-theme="light">
            <h1 className="font-heading font-black mb-12" style={{ fontSize: "clamp(44px, 6vw, 72px)", letterSpacing: "-2px", lineHeight: 1, color: "var(--section-light-text)" }}>
              {t("index.heading")}
            </h1>
          </div>
          {posts.length === 0 ? (
            <p className="font-body" style={{ color: "var(--section-light-muted)" }}>{t("index.empty")}</p>
          ) : (
            <div className="uc-grid">
              {posts.map((post, i) => (
                // Only the first row can be above the fold.
                <PostCard key={post.slug} post={post} readLabel={t("card.read")} minutesLabel={t("minutes", { minutes: post.minutes })} priority={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
