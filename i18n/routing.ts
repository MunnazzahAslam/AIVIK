import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  // Default locale (English) stays unprefixed at "/", German lives under
  // "/de" — keeps every existing English URL unchanged.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
