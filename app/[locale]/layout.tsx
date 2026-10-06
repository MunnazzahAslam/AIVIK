import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import ChatWidget from "../components/ChatWidget";
import CookieConsent from "../components/CookieConsent";
import { GTM_HEAD_SCRIPT, GTM_ID } from "@/lib/gtm";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const path = locale === routing.defaultLocale ? "" : `/${locale}`;

  return {
    metadataBase: new URL("https://aivik.eu"),
    title: {
      default: t("titleDefault"),
      template: "%s | AIVIK",
    },
    description: t("description"),
    keywords: [
      "software engineering Germany",
      "AI automation Europe",
      "custom software development",
      "web application development",
      "AI workflow automation",
      "cloud infrastructure",
      "data analysis",
      "GDPR compliant software",
      "software agency Germany",
    ],
    authors: [{ name: "AIVIK", url: "https://aivik.eu" }],
    creator: "AIVIK",
    publisher: "AIVIK",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_EU",
      url: `https://aivik.eu${path}`,
      siteName: "AIVIK",
      title: t("titleDefault"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("titleDefault"),
      description: t("twitterDescription"),
    },
    alternates: {
      canonical: `https://aivik.eu${path}`,
      languages: {
        en: "https://aivik.eu",
        de: "https://aivik.eu/de",
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale's pages (next-intl needs the
  // locale set explicitly in Server Components when using generateStaticParams).
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "AIVIK",
    url: "https://aivik.eu",
    email: "info@aivik.eu",
    description: t("description"),
    areaServed: "Europe",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DE",
    },
    serviceType: [
      "Custom Software Development",
      "AI and Automation",
      "Cloud Infrastructure",
      "Data Analysis",
    ],
  };

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: GTM_HEAD_SCRIPT }} />
      </head>
      <body className="font-body">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider>
          {children}
          <ChatWidget />
          <CookieConsent />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
