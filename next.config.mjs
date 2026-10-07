import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Images uploaded in the Sanity Studio (blog covers and images in articles)
  // are resized and served by the site's own image optimiser.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/qs3r3e0a/production/**" }],
  },
  // The use-case pages have German addresses (/de/anwendungsfaelle/ki-rezeption)
  // but one set of route files (app/[locale]/use-cases). The German paths are
  // rewritten onto those files, and the English-named paths under /de redirect
  // to the German ones so each page has a single address per language.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/de/anwendungsfaelle", destination: "/de/use-cases" },
        { source: "/de/anwendungsfaelle/:slug", destination: "/de/use-cases/:slug" },
      ],
    };
  },
  async redirects() {
    return [
      { source: "/de/use-cases", destination: "/de/anwendungsfaelle", permanent: true },
      { source: "/de/use-cases/:slug", destination: "/de/anwendungsfaelle/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default withNextIntl(nextConfig);
