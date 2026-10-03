import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { USE_CASES, useCasePath } from "@/data/use-cases";
import UseCaseCard from "./UseCaseCard";

/** The four use cases as a 2 × 2 grid of cards (one column on phones). */
export default async function UseCaseCards({ as, priority = false }: { as: "h2" | "h3"; priority?: boolean }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("UseCases");

  return (
    <div className="uc-grid">
      {USE_CASES.map((u, i) => (
        <UseCaseCard
          key={u.id}
          href={useCasePath(locale, u)}
          brand={u.brand}
          headline={u.headline[locale]}
          industry={u.industry[locale]}
          proves={u.proves[locale]}
          viewLabel={t("card.view")}
          poster={u.video.poster}
          teaser={u.video.teaser}
          as={as}
          // Only the first row can be above the fold.
          priority={priority && i < 2}
        />
      ))}
    </div>
  );
}
