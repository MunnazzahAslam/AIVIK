import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link/useRouter/etc. — Link automatically prefixes hrefs with
// the current locale (or omits the prefix for the default locale), so
// internal navigation never has to know about routing.localePrefix itself.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
