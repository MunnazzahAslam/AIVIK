import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const path = locale === routing.defaultLocale ? "/privacy" : `/${locale}/privacy`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://aivik.eu${path}`,
    },
  };
}

export default async function Privacy({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return (
    <main className="min-h-screen px-6 py-24" style={{ backgroundColor: "var(--section-dark)" }}>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="font-mono text-xs link-on-dark mb-12 inline-block tracking-widest uppercase"
        >
          ← {t("back")}
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-10" style={{ color: "var(--section-dark-text)" }}>
          {t("title")}
        </h1>

        <div className="flex flex-col gap-6">
          <div className="aivik-section-divider pt-6">
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              {t("intro")}
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              {t("dataCollectionHeading")}
            </p>
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              {t("dataCollectionBody")}
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              {t("cookiesHeading")}
            </p>
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              {t("cookiesBody")}
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              {t("contactHeading")}
            </p>
            <a
              href="mailto:info@aivik.eu"
              className="font-body text-sm link-on-dark"
            >
              info@aivik.eu
            </a>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-body text-xs text-on-dark-muted leading-relaxed">
              {t("disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
