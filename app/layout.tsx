import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "AIVIK — Software Engineering & AI Automation",
  description:
    "We build software and AI systems for companies ready to move faster. Custom web applications, AI automation, and digital products. Registered in Germany.",
  keywords: [
    "software development",
    "AI automation",
    "web applications",
    "Germany",
    "Europe",
    "startup",
    "Next.js",
    "React",
  ],
  openGraph: {
    title: "AIVIK — Software Engineering & AI Automation",
    description:
      "Custom software and AI automation for European startups. Registered in Germany.",
    url: "https://aivik.eu",
    siteName: "AIVIK",
    locale: "en_EU",
    type: "website",
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
      <body className="font-body">{children}</body>
    </html>
  );
}
