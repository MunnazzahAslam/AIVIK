import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SERVICES, SERVICES_BASE, servicePath, type Service } from "@/data/services";
import { USE_CASES, siteUrl, useCasePath } from "@/data/use-cases";
import { getPosts, type PostSummary } from "@/lib/blog";
import UseCaseCard from "../use-cases/UseCaseCard";
import AskAssistantButton from "../use-cases/AskAssistantButton";
import PostCard from "../blog/PostCard";
import { SERVICE_ARTIFACTS } from "./artifacts";

/** A labelled block of the page: the label sits beside the content on wide screens, above it on narrow ones. */
function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 py-12 aivik-section-divider">
      <h2 className="uc-label pt-1.5">{label}</h2>
      <div>{children}</div>
    </section>
  );
}

/**
 * One service, in the same parts for every service: hero with its drawing,
 * what's included, how we work, use cases and articles where there are any,
 * questions, call to action, the other services.
 */
export default async function ServicePage({ service: s, locale }: { service: Service; locale: Locale }) {
  const t = await getTranslations("ServicePages");
  const tCases = await getTranslations("UseCases");
  const tBlog = await getTranslations("Blog");
  const Artifact = SERVICE_ARTIFACTS[s.id];
  const title = s.title[locale];
  const cases = USE_CASES.filter((u) => u.service === s.id);

  // Articles come from the CMS; the page still renders if it can't be reached.
  let posts: PostSummary[] = [];
  if (s.articles?.length) {
    try {
      const all = await getPosts(locale);
      posts = s.articles.flatMap((slug) => all.filter((p) => p.slug === slug)).slice(0, 2);
    } catch {
      posts = [];
    }
  }

  const url = siteUrl(locale, servicePath(locale, s));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      serviceType: title,
      description: s.meta.description[locale],
      url,
      areaServed: "Europe",
      provider: { "@type": "Organization", name: "AIVIK", url: "https://aivik.eu" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: title,
        itemListElement: s.items.map((item) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item.name[locale] } })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q[locale], acceptedAnswer: { "@type": "Answer", text: f.a[locale] } })),
    },
  ];

  const bodyText = "font-body leading-relaxed" as const;
  const bodyStyle = { fontSize: "clamp(16px, 1.3vw, 18px)", color: "var(--section-dark-muted)", maxWidth: "68ch" } as const;

  return (
    <article data-theme="dark" style={{ backgroundColor: "var(--section-dark)" }} className="px-6 pt-[120px] pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <Link href={SERVICES_BASE[locale]} className="font-body text-sm link-on-dark">
              ← {t("back")}
            </Link>
            <p className="uc-label mt-8">{t("label")}</p>
            <h1
              className="font-heading font-black mt-3"
              style={{ fontSize: "clamp(34px, 5.2vw, 64px)", letterSpacing: "-1.5px", lineHeight: 1.05, color: "var(--section-dark-text)", maxWidth: "16ch", hyphens: "auto" }}
            >
              {title}
            </h1>
            <p className={`${bodyText} mt-6`} style={{ ...bodyStyle, fontSize: "clamp(18px, 1.7vw, 22px)", color: "var(--section-dark-text)", maxWidth: "36ch" }}>
              {s.tagline[locale]}
            </p>
          </div>
          <div className="svc-page-art">
            <div className="svc-box">
              <Artifact />
            </div>
          </div>
        </header>

        <p className={`${bodyText} mt-10`} style={bodyStyle}>
          {s.intro[locale]}
        </p>

        <div className="mt-12">
          <Block label={t("included")}>
            <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2" style={{ listStyle: "none" }}>
              {s.items.map((item) => (
                <li key={item.name.en}>
                  <h3 className="font-heading font-bold text-lg" style={{ color: "var(--section-dark-text)" }}>
                    {item.name[locale]}
                  </h3>
                  <p className="font-body text-[15px] leading-relaxed mt-1.5 text-on-dark-muted">{item.text[locale]}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block label={t("approach")}>
            <ol className="flex flex-col gap-7" style={{ listStyle: "none" }}>
              {s.approach.map((step, i) => (
                <li key={step.name.en} className="flex gap-5">
                  <span className="uc-label pt-1.5" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-lg" style={{ color: "var(--section-dark-text)" }}>
                      {step.name[locale]}
                    </h3>
                    <p className={`${bodyText} mt-1.5`} style={{ ...bodyStyle, fontSize: 15 }}>
                      {step.text[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="font-body text-sm mt-8">
              <Link href="/#process" className="link-on-dark underline" style={{ textUnderlineOffset: 3 }}>
                {t("processLink")}
              </Link>
            </p>
          </Block>

          {cases.length > 0 && (
            <Block label={t("built")}>
              <div className="uc-grid">
                {cases.map((u) => (
                  <UseCaseCard
                    key={u.id}
                    href={useCasePath(locale, u)}
                    brand={u.brand}
                    headline={u.headline[locale]}
                    industry={u.industry[locale]}
                    proves={u.proves[locale]}
                    viewLabel={tCases("card.view")}
                    poster={u.video.poster}
                    teaser={u.video.teaser}
                    as="h3"
                  />
                ))}
              </div>
            </Block>
          )}

          <Block label={t("faq")}>
            <div className="flex flex-col">
              {s.faq.map((f) => (
                <details key={f.q.en} className="svc-faq">
                  <summary className="font-heading font-bold text-lg">{f.q[locale]}</summary>
                  <p className={`${bodyText} mt-3`} style={{ ...bodyStyle, fontSize: 16 }}>
                    {f.a[locale]}
                  </p>
                </details>
              ))}
            </div>
          </Block>

          {posts.length > 0 && (
            <Block label={t("articles")}>
              <div className="uc-grid">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} readLabel={tBlog("card.read")} minutesLabel={tBlog("minutes", { minutes: post.minutes })} as="h3" />
                ))}
              </div>
            </Block>
          )}
        </div>

        {/* Call to action */}
        <section
          className="mt-6 p-8 md:p-12"
          style={{ borderRadius: "var(--radius-card)", backgroundColor: "var(--section-dark-surface)", border: "1px solid var(--section-dark-border)" }}
        >
          <h2 className="font-heading font-black" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", letterSpacing: "-1px", lineHeight: 1.1, color: "var(--section-dark-text)" }}>
            {t("ctaHeading")}
          </h2>
          <p className={`${bodyText} mt-4`} style={bodyStyle}>
            {t("ctaText")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {/* The contact form reads ?service= and preselects the matching option. */}
            <Link href={s.formOption ? `/?service=${s.formOption}#contact` : "/#contact"} className="uc-btn uc-btn-primary">
              {t("ctaContact")}
            </Link>
            <AskAssistantButton label={t("ctaAsk")} message={t("ctaAskMessage", { service: title })} />
          </div>
        </section>

        {/* The other services */}
        <nav className="mt-16" aria-label={t("others")}>
          <h2 className="uc-label mb-5">{t("others")}</h2>
          <ul className="flex flex-wrap gap-3" style={{ listStyle: "none" }}>
            {SERVICES.filter((other) => other.id !== s.id).map((other) => (
              <li key={other.id}>
                <Link href={servicePath(locale, other)} className="uc-btn uc-btn-ghost">
                  {other.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
