import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CursorEffect from "./components/CursorEffect";
import { Analytics } from "@vercel/analytics/next";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://aivik.eu"),
  title: {
    default: "AIVIK — Software Engineering & AI Automation",
    template: "%s | AIVIK",
  },
  description:
    "AIVIK is a Germany-registered tech consultancy delivering custom software development, AI automation, cloud infrastructure, and data analysis for European startups and growing companies.",
  keywords: [
    "software engineering Germany",
    "AI automation Europe",
    "custom software development",
    "tech consultancy Munich",
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
    locale: "en_EU",
    url: "https://aivik.eu",
    siteName: "AIVIK",
    title: "AIVIK — Software Engineering & AI Automation",
    description:
      "Custom software, AI automation, and cloud infrastructure for companies ready to move faster. Germany registered. GDPR compliant.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AIVIK — Software Engineering & AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIVIK — Software Engineering & AI Automation",
    description:
      "Custom software, AI automation, and cloud infrastructure for European companies.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://aivik.eu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-body">
        <CursorEffect />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
