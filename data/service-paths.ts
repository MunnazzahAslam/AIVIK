import type { Locale } from "@/i18n/routing";
import { pathInLocale as useCasePathInLocale, type Localised } from "@/data/use-cases";

/**
 * The service pages' addresses, apart from their texts (data/services.ts) so
 * the nav, which runs in the browser, doesn't have to load all the copy.
 */

/** Paths under a locale, as passed to the locale-aware Link. */
export const SERVICES_BASE: Localised = { en: "/services", de: "/leistungen" };

export const SERVICE_SLUGS = {
  software: { en: "custom-software-development", de: "individuelle-softwareentwicklung" },
  ai: { en: "ai-workflow-automation", de: "ki-automatisierung" },
  cloud: { en: "cloud-infrastructure", de: "cloud-infrastruktur" },
  data: { en: "data-analysis", de: "datenanalyse" },
  marketing: { en: "digital-marketing", de: "digitales-marketing" },
} satisfies Record<string, Localised>;

/**
 * The same page in the other language, for the nav's language switch. Service
 * and use-case paths differ per language, so the path can't just be reused.
 */
export function pathInLocale(pathname: string, from: Locale, to: Locale) {
  // On the server a German page reports the route file's path (/services/…),
  // not the address in the browser (/leistungen/…), so both are recognised.
  const base = [SERVICES_BASE[from], SERVICES_BASE.en].find((b) => pathname === b || pathname.startsWith(`${b}/`));
  if (!base) return useCasePathInLocale(pathname, from, to);
  const slug = pathname.slice(base.length + 1).replace(/\/$/, "");
  const match = Object.values(SERVICE_SLUGS).find((s) => s[from] === slug);
  return match ? `${SERVICES_BASE[to]}/${match[to]}` : SERVICES_BASE[to];
}
