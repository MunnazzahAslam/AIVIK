import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import ServicePage from "@/app/components/services/ServicePage";
import { SERVICES, findService, servicePath } from "@/data/services";
import { siteUrl } from "@/data/use-cases";

type Params = Promise<{ locale: Locale; slug: string }>;

// Each language has its own slugs (ai-workflow-automation / ki-automatisierung).
export function generateStaticParams({ params: { locale } }: { params: { locale: Locale } }) {
  return SERVICES.map((s) => ({ slug: s.slug[locale] }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = findService(locale, slug);
  if (!s) return {};
  const t = await getTranslations({ locale, namespace: "ServicePages" });
  const url = siteUrl(locale, servicePath(locale, s));
  const title = `${s.title[locale]} · ${t("titleSuffix")} · AIVIK`;
  const description = s.meta.description[locale];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: siteUrl("en", servicePath("en", s)),
        de: siteUrl("de", servicePath("de", s)),
        "x-default": siteUrl("en", servicePath("en", s)),
      },
    },
    openGraph: { type: "website", url, siteName: "AIVIK", title, description, locale: locale === "de" ? "de_DE" : "en_EU", images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title, description, images: ["/twitter-image"] },
  };
}

export default async function ServiceRoute({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const s = findService(locale, slug);
  if (!s) {
    // A slug from the other language (say /de/leistungen/data-analysis) goes to its own.
    const other = routing.locales.map((l) => findService(l, slug)).find(Boolean);
    if (other) permanentRedirect(`${locale === "de" ? "/de" : ""}${servicePath(locale, other)}`);
    notFound();
  }

  return (
    <main>
      <Nav />
      <ServicePage service={s} locale={locale} />
      <Footer />
    </main>
  );
}
