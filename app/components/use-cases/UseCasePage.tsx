import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { USE_CASES_BASE, nextUseCase, siteUrl, useCasePath, type UseCase } from "@/data/use-cases";
import UseCasePlayer from "./UseCasePlayer";
import UseCaseGallery from "./UseCaseGallery";
import UseCaseCard from "./UseCaseCard";
import AskAssistantButton from "./AskAssistantButton";

/** A labelled block of the case page: the label sits beside the content on wide screens, above it on narrow ones. */
function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 py-12 aivik-section-divider">
      <h2 className="uc-label pt-1.5">{label}</h2>
      <div>{children}</div>
    </section>
  );
}

/**
 * One use case, in the same ten parts for every case: hero, video, chapters,
 * the problem, what we built, under the hood, gallery, what it shows, call to
 * action, next use case.
 */
export default async function UseCasePage({ useCase: u, locale }: { useCase: UseCase; locale: Locale }) {
  const t = await getTranslations("UseCases");
  const next = nextUseCase(u);
  const headline = u.headline[locale];

  // Structured data: the case as a CreativeWork, with its video.
  const url = siteUrl(locale, useCasePath(locale, u));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: headline,
    headline,
    description: u.meta.description[locale],
    url,
    inLanguage: locale,
    genre: t("badge"),
    creator: { "@type": "Organization", name: "AIVIK", url: "https://aivik.eu" },
    image: `https://aivik.eu${u.video.poster}`,
    video: {
      "@type": "VideoObject",
      name: `${u.brand}: ${headline}`,
      description: u.videoSummary[locale],
      thumbnailUrl: `https://aivik.eu${u.video.poster}`,
      uploadDate: `${u.published}T00:00:00+00:00`,
      duration: `PT${u.video.seconds}S`,
      contentUrl: u.video.src1080,
      inLanguage: locale,
    },
  };

  const bodyText = "font-body leading-relaxed" as const;
  const bodyStyle = { fontSize: "clamp(16px, 1.3vw, 18px)", color: "var(--section-dark-muted)", maxWidth: "68ch" } as const;

  return (
    <article data-theme="dark" style={{ backgroundColor: "var(--section-dark)" }} className="px-6 pt-[120px] pb-24">
      {/* The poster is the largest element on first paint, so it is fetched early. */}
      <link rel="preload" as="image" href={u.video.posterWebp} fetchPriority="high" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="max-w-6xl mx-auto">
        {/* 1. Hero */}
        <header>
          <Link href={USE_CASES_BASE[locale]} className="font-body text-sm link-on-dark">
            ← {t("page.back")}
          </Link>
          <p className="uc-label mt-8">{u.brand}</p>
          <h1
            className="font-heading font-black mt-3"
            style={{ fontSize: "clamp(34px, 5.2vw, 64px)", letterSpacing: "-1.5px", lineHeight: 1.05, color: "var(--section-dark-text)", maxWidth: "20ch" }}
          >
            {headline}
          </h1>
          {/* Stacked on phones: side by side, the row could wrap differently once the label font loads and move the video. */}
          <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap">
            <span className="uc-badge">{u.industry[locale]}</span>
            <span className="uc-badge">{u.proves[locale]}</span>
          </div>
          <p className={`${bodyText} mt-6`} style={{ ...bodyStyle, fontSize: "clamp(17px, 1.5vw, 20px)" }}>
            {u.summary[locale]}
          </p>
        </header>

        {/* 2 + 3. Video and chapters */}
        <div className="mt-10">
          <UseCasePlayer
            src1080={u.video.src1080}
            src720={u.video.src720}
            poster={u.video.posterWebp}
            label={t("page.videoLabel", { headline })}
            chapters={u.chapters.map((c) => ({ at: c.at, label: c.label[locale] }))}
            chaptersLabel={t("page.chapters")}
            chaptersHint={t("page.chaptersHint")}
          />
        </div>

        <div className="mt-12">
          <Block label={t("page.whatHappens")}>
            <p className={bodyText} style={bodyStyle}>
              {u.videoSummary[locale]} {t("page.noSound")}
            </p>
            <p className="font-body text-sm mt-5 pl-4" style={{ color: "var(--section-dark-muted)", borderLeft: "2px solid #2563eb", maxWidth: "68ch" }}>
              {u.conceptNote[locale]}
            </p>
          </Block>

          {/* 4. The problem */}
          <Block label={t("page.problem")}>
            <p className={bodyText} style={{ ...bodyStyle, color: "var(--section-dark-text)" }}>
              {u.problem[locale]}
            </p>
          </Block>

          {/* 5. What we built */}
          <Block label={t("page.built")}>
            <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2" style={{ listStyle: "none" }}>
              {u.features.map((f) => (
                <li key={f.name.en}>
                  <h3 className="font-heading font-bold text-lg" style={{ color: "var(--section-dark-text)" }}>
                    {f.name[locale]}
                  </h3>
                  <p className="font-body text-[15px] leading-relaxed mt-1.5 text-on-dark-muted">{f.line[locale]}</p>
                </li>
              ))}
            </ul>
          </Block>

          {/* 6. Under the hood */}
          <Block label={t("page.hood")}>
            <ul className="flex flex-wrap gap-2" style={{ listStyle: "none" }}>
              {u.stack.map((s) => (
                <li key={s} className="uc-badge" style={{ color: "var(--section-dark-text)" }}>
                  {s}
                </li>
              ))}
            </ul>
            <p className={`${bodyText} mt-5`} style={bodyStyle}>
              {u.techNote[locale]}
            </p>
          </Block>

          {/* 7. Gallery */}
          <Block label={t("page.gallery")}>
            <UseCaseGallery
              items={u.gallery.map((g) => ({ src: g.src, width: g.width, height: g.height, alt: g.alt[locale] }))}
              openLabel={t.raw("page.galleryOpen") as string}
              closeLabel={t("page.galleryClose")}
              prevLabel={t("page.galleryPrev")}
              nextLabel={t("page.galleryNext")}
            />
          </Block>

          {/* 8. What it shows */}
          <Block label={t("page.shows")}>
            <ul className="flex flex-col gap-4" style={{ listStyle: "none" }}>
              {u.shows.map((s) => (
                <li key={s.en} className={`${bodyText} flex gap-3`} style={{ ...bodyStyle, color: "var(--section-dark-text)" }}>
                  <span aria-hidden="true" style={{ color: "#3b82f6" }}>
                    →
                  </span>
                  {s[locale]}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        {/* 9. Call to action */}
        <section
          className="mt-6 p-8 md:p-12"
          style={{ borderRadius: "var(--radius-card)", backgroundColor: "var(--section-dark-surface)", border: "1px solid var(--section-dark-border)" }}
        >
          <h2 className="font-heading font-black" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", letterSpacing: "-1px", lineHeight: 1.1, color: "var(--section-dark-text)" }}>
            {t("page.ctaHeading")}
          </h2>
          <p className={`${bodyText} mt-4`} style={bodyStyle}>
            {t("page.ctaText")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {/* The contact form reads ?service= and preselects the matching option. */}
            <Link href={`/?service=${u.service}#contact`} className="uc-btn uc-btn-primary">
              {t("page.ctaContact")}
            </Link>
            <AskAssistantButton label={t("page.ctaAsk")} message={t("page.ctaAskMessage", { brand: u.brand, headline })} />
          </div>
        </section>

        {/* 10. Next use case */}
        <section className="mt-16">
          <h2 className="uc-label mb-5">{t("page.next")}</h2>
          <div className="max-w-[560px]">
            <UseCaseCard
              href={useCasePath(locale, next)}
              brand={next.brand}
              headline={next.headline[locale]}
              industry={next.industry[locale]}
              proves={next.proves[locale]}
              viewLabel={t("card.view")}
              poster={next.video.poster}
              teaser={next.video.teaser}
              as="h3"
            />
          </div>
        </section>
      </div>
    </article>
  );
}
