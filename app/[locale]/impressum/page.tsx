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
  const t = await getTranslations({ locale, namespace: "Impressum" });
  const path = locale === routing.defaultLocale ? "/impressum" : `/${locale}/impressum`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://aivik.eu${path}`,
    },
  };
}

export default async function Impressum({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Impressum" });

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
          <p className="font-mono text-xs text-on-dark-muted tracking-widest uppercase">
            {t("sectionLabel")}
          </p>

          <div className="aivik-section-divider pt-6">
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              {t("addressLine1")}
              <br />
              {t("addressLine2")}
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              {t("contactHeading")}
            </p>
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              {t("emailLine")}
              <br />
              {t("websiteLine")}
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              {t("responsibleHeading")}
            </p>
            <p className="font-body text-sm text-on-dark-muted">
              {t("responsibleName")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
