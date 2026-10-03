import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import UseCaseCards from "@/app/components/use-cases/UseCaseCards";
import { USE_CASES_BASE, siteUrl } from "@/data/use-cases";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UseCases" });
  const url = siteUrl(locale, USE_CASES_BASE[locale]);

  return {
    title: t("index.metaTitle"),
    description: t("index.metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        en: siteUrl("en", USE_CASES_BASE.en),
        de: siteUrl("de", USE_CASES_BASE.de),
        "x-default": siteUrl("en", USE_CASES_BASE.en),
      },
    },
    openGraph: { type: "website", url, siteName: "AIVIK", title: `${t("index.metaTitle")} | AIVIK`, description: t("index.metaDescription"), locale: locale === "de" ? "de_DE" : "en_EU", images: ["/opengraph-image"] },
  };
}

export default async function UseCasesIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("UseCases");

  return (
    <main>
      <Nav />
      <section data-theme="dark" style={{ backgroundColor: "var(--section-dark)" }} className="px-6 pt-[150px] pb-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading font-black" style={{ fontSize: "clamp(44px, 6vw, 72px)", letterSpacing: "-2px", lineHeight: 1, color: "var(--section-dark-text)" }}>
            {t("index.heading")}
          </h1>
          <p className="font-body leading-relaxed mt-6 mb-12" style={{ fontSize: "clamp(16px, 1.4vw, 19px)", color: "var(--section-dark-muted)", maxWidth: "62ch" }}>
            {t("index.intro")}
          </p>
          <UseCaseCards as="h2" priority />
        </div>
      </section>
      <Footer />
    </main>
  );
}
