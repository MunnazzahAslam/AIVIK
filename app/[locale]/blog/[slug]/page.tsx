import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import PostCard from "@/app/components/blog/PostCard";
import PreviewBar from "@/app/components/blog/PreviewBar";
import { siteUrl } from "@/data/use-cases";
import { BLOG_BASE, blogPath, formatDate, getPost, getPosts } from "@/lib/blog";

type Params = Promise<{ locale: Locale; slug: string }>;

// The articles known at build time are built then. One published later is built
// the first time someone opens it, so a new article needs no deploy.
export async function generateStaticParams({ params: { locale } }: { params: { locale: Locale } }) {
  return (await getPosts(locale)).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug, { preview: draftMode().isEnabled });
  if (!post) return {};
  const url = siteUrl(locale, blogPath(slug));
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description;
  const languages = Object.fromEntries(post.locales.map((l) => [l, siteUrl(l, blogPath(slug))]));

  return {
    title,
    description,
    ...(post.noindex && { robots: { index: false, follow: true } }),
    alternates: {
      // An article first published elsewhere points search engines at the original.
      canonical: post.canonical || url,
      languages: { ...languages, "x-default": siteUrl(post.locales.includes(routing.defaultLocale) ? routing.defaultLocale : locale, blogPath(slug)) },
    },
    openGraph: {
      type: "article",
      url,
      siteName: "AIVIK",
      title,
      description,
      locale: locale === "de" ? "de_DE" : "en_EU",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      // Social networks don't take SVG, so drawn covers fall back to the site's share image.
      images: [post.cover.endsWith(".svg") ? "/opengraph-image" : post.cover],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const preview = draftMode().isEnabled;
  // Both questions go to Sanity at once, not one after the other.
  const [post, posts] = await Promise.all([getPost(locale, slug, { preview }), getPosts(locale, { preview })]);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const more = posts.filter((p) => p.slug !== slug).slice(0, 2);
  const url = siteUrl(locale, blogPath(slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags.join(", "),
    ...(post.category && { articleSection: post.category }),
    author: post.author
      ? { "@type": "Person", name: post.author.name, ...(post.author.role && { jobTitle: post.author.role }) }
      : { "@type": "Organization", name: "AIVIK", url: "https://aivik.eu" },
    publisher: { "@type": "Organization", name: "AIVIK", url: "https://aivik.eu" },
  };

  return (
    <main>
      <Nav />
      {preview && <PreviewBar />}
      <article style={{ backgroundColor: "var(--section-light)" }} className="px-6 pt-[120px] pb-28">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

        <div className="max-w-6xl mx-auto">
          {/* The nav takes its colours from the header: the article is too long to ever be mostly in view. */}
          <header data-theme="light">
            <Link href={BLOG_BASE} className="font-body text-sm link-on-light">
              ← {t("page.back")}
            </Link>
            <h1
              className="font-heading font-black mt-8"
              style={{ fontSize: "clamp(32px, 4.6vw, 56px)", letterSpacing: "-1.5px", lineHeight: 1.08, color: "var(--section-light-text)", maxWidth: "24ch" }}
            >
              {post.title}
            </h1>
            <p className="font-body leading-relaxed mt-6" style={{ fontSize: "clamp(17px, 1.5vw, 20px)", color: "var(--section-light-muted)", maxWidth: "68ch" }}>
              {post.description}
            </p>
          </header>

          <div className="blog-cover mt-10">
            <Image src={post.cover} alt="" fill priority sizes="(max-width: 1200px) 100vw, 1152px" unoptimized={post.cover.endsWith(".svg")} style={post.coverFocus ? { objectPosition: post.coverFocus } : undefined} />
          </div>

          {/* Details beside the text on wide screens, above it on narrow ones. */}
          <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 mt-12">
            <aside className="md:sticky md:top-[104px] md:self-start flex flex-col gap-6">
              <div>
                <p className="uc-label on-light">{t("page.published")}</p>
                <p className="font-body text-sm mt-2" style={{ color: "var(--section-light-text)" }}>
                  <time dateTime={post.date}>{formatDate(locale, post.date)}</time>
                  <br />
                  {t("minutes", { minutes: post.minutes })}
                </p>
                {post.updated && post.updated !== post.date && (
                  <p className="font-body text-sm mt-1" style={{ color: "var(--section-light-muted)" }}>
                    {t("page.updated", { date: formatDate(locale, post.updated) })}
                  </p>
                )}
              </div>
              {post.author && (
                <div>
                  <p className="uc-label on-light">{t("page.author")}</p>
                  <p className="font-body text-sm mt-2" style={{ color: "var(--section-light-text)" }}>
                    {post.author.name}
                  </p>
                  {post.author.role && (
                    <p className="font-body text-sm mt-1" style={{ color: "var(--section-light-muted)" }}>
                      {post.author.role}
                    </p>
                  )}
                </div>
              )}
              {post.tags.length > 0 && (
                <div>
                  <p className="uc-label on-light">{t("page.topics")}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="uc-badge on-light">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* The article itself, as HTML built from its blocks in Sanity (lib/blog.ts). */}
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          <section
            className="mt-16 p-8 md:p-12"
            style={{ borderRadius: "var(--radius-card)", backgroundColor: "var(--section-dark-surface)", border: "1px solid var(--section-dark-border)" }}
          >
            <h2 className="font-heading font-black" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", letterSpacing: "-1px", lineHeight: 1.1, color: "var(--section-dark-text)" }}>
              {t("page.ctaHeading")}
            </h2>
            <p className="font-body leading-relaxed mt-4" style={{ fontSize: "clamp(16px, 1.3vw, 18px)", color: "var(--section-dark-muted)", maxWidth: "68ch" }}>
              {t("page.ctaText")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#contact" className="uc-btn uc-btn-primary">
                {t("page.ctaContact")}
              </Link>
            </div>
          </section>

          {more.length > 0 && (
            <section className="mt-16">
              <h2 className="uc-label on-light mb-5">{t("page.more")}</h2>
              <div className="uc-grid">
                {more.map((p) => (
                  <PostCard key={p.slug} post={p} readLabel={t("card.read")} minutesLabel={t("minutes", { minutes: p.minutes })} as="h3" />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
}
