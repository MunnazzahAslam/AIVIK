import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match every path except API routes, Next internals, and files with an
  // extension (favicon, images, sitemap.xml, robots.txt, etc.) — those are
  // never localized. The generated icon and share images have no extension
  // (/icon, /apple-icon, /opengraph-image, /twitter-image), so they are named
  // here; without that they were treated as pages and returned 404.
  matcher: ["/((?!api|_next|icon|apple-icon|opengraph-image|twitter-image|.*\\..*).*)"],
};
