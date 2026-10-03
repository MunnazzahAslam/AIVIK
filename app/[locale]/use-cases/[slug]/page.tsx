import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import UseCasePage from "@/app/components/use-cases/UseCasePage";
import { USE_CASES, findUseCase, siteUrl, useCasePath } from "@/data/use-cases";

type Params = Promise<{ locale: Locale; slug: string }>;

// Each language has its own slugs (ai-receptionist / ki-rezeption).
export function generateStaticParams({ params: { locale } }: { params: { locale: Locale } }) {
  return USE_CASES.map((u) => ({ slug: u.slug[locale] }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const u = findUseCase(locale, slug);
  if (!u) return {};
  const t = await getTranslations({ locale, namespace: "UseCases" });
  const url = siteUrl(locale, useCasePath(locale, u));
  const title = `${u.headline[locale]} · ${t("titleSuffix")} · AIVIK`;
  const description = u.meta.description[locale];
  const image = { url: `https://aivik.eu${u.video.poster}`, width: 1920, height: 1080, alt: `${u.brand}: ${u.headline[locale]}` };

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: siteUrl("en", useCasePath("en", u)),
        de: siteUrl("de", useCasePath("de", u)),
        "x-default": siteUrl("en", useCasePath("en", u)),
      },
    },
    openGraph: { type: "article", url, siteName: "AIVIK", title, description, locale: locale === "de" ? "de_DE" : "en_EU", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default async function UseCaseRoute({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const u = findUseCase(locale, slug);
  if (!u) {
    // A slug from the other language (say /de/anwendungsfaelle/ai-receptionist) goes to its own.
    const other = routing.locales.map((l) => findUseCase(l, slug)).find(Boolean);
    if (other) permanentRedirect(`${locale === "de" ? "/de" : ""}${useCasePath(locale, other)}`);
    notFound();
  }

  return (
    <main>
      <Nav />
      <UseCasePage useCase={u} locale={locale} />
      <Footer />
    </main>
  );
}
