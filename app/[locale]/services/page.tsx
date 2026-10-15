import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { SERVICE_ARTIFACTS } from "@/app/components/services/artifacts";
import { SERVICES, SERVICES_BASE, servicePath } from "@/data/services";
import { siteUrl } from "@/data/use-cases";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicePages" });
  const url = siteUrl(locale, SERVICES_BASE[locale]);

  return {
    title: t("index.metaTitle"),
    description: t("index.metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        en: siteUrl("en", SERVICES_BASE.en),
        de: siteUrl("de", SERVICES_BASE.de),
        "x-default": siteUrl("en", SERVICES_BASE.en),
      },
    },
    openGraph: { type: "website", url, siteName: "AIVIK", title: `${t("index.metaTitle")} | AIVIK`, description: t("index.metaDescription"), locale: locale === "de" ? "de_DE" : "en_EU", images: ["/opengraph-image"] },
  };
}

export default async function ServicesIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ServicePages");

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
          <div className="svc-index">
            {SERVICES.map((s) => {
              const Artifact = SERVICE_ARTIFACTS[s.id];
              return (
                <Link key={s.id} href={servicePath(locale, s)} className="uc-card">
                  <div className="p-4 pb-0">
                    <div className="svc-box">
                      <Artifact />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-heading font-bold" style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.2, letterSpacing: "-0.5px", color: "var(--section-dark-text)" }}>
                      {s.title[locale]}
                    </h2>
                    <p className="font-body text-[15px] leading-relaxed mt-3 text-on-dark-muted">{s.tagline[locale]}</p>
                    <p className="font-body text-sm font-semibold mt-auto pt-6" style={{ color: "var(--section-dark-text)" }}>
                      {t("index.view")}{" "}
                      <span className="uc-card-arrow inline-block" aria-hidden="true">
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
