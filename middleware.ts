import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match every path except API routes, Next internals, and files with an
  // extension (favicon, images, sitemap.xml, robots.txt, etc.) — those are
  // never localized.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
