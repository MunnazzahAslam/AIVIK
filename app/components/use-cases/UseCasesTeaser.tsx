import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { USE_CASES_BASE } from "@/data/use-cases";
import FadeIn from "../FadeIn";
import SectionCurve from "../SectionCurve";
import UseCaseCards from "./UseCaseCards";

/**
 * The home page's use-cases section, after Services: the four cards and a link
 * to the index. Plain white with dark cards, set off from the dotted Services
 * surface by a curve and by a faint line grid in the same grey as the Services
 * dots, which fades in and out on every side. The Services dots carry on past
 * the curve and thin out until only the ones on the grid's crossings are left,
 * which is what joins the two sections. The same happens in reverse at the
 * bottom: the grid gives way to dots that close up towards the curve into Process.
 */
export default async function UseCasesTeaser() {
  const t = await getTranslations("UseCases");
  const locale = (await getLocale()) as Locale;

  return (
    <section
      id="use-cases"
      data-theme="light"
      // Bottom padding leaves room for the curve into the dark Process section.
      className="px-6 pt-[50px] pb-[230px]"
      style={{ backgroundColor: "var(--section-light)", position: "relative", zIndex: 0 }}
    >
      <div className="work-dots" aria-hidden="true">
        <div className="work-dots-fine" />
        <div className="work-dots-mid" />
      </div>
      <div className="work-grid-bg" aria-hidden="true" />
      <div className="work-dots-end" aria-hidden="true">
        <div className="work-dots-end-mid" />
        <div className="work-dots-end-fine" />
      </div>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-12">
          <h2
            className="font-heading font-black"
            // Capped by the viewport width so the German "ANWENDUNGSFÄLLE" fits on one line on phones.
            style={{ fontSize: "min(clamp(40px, 6vw, 72px), 9.4vw)", letterSpacing: "-2px", lineHeight: 1, color: "var(--section-light-text)" }}
          >
            {t("teaser.heading")}
          </h2>
        </FadeIn>
        <UseCaseCards as="h3" />
        <div className="mt-10">
          <Link href={USE_CASES_BASE[locale]} className="uc-btn uc-btn-dark">
            {t("teaser.all")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <SectionCurve fill="var(--section-dark)" direction="rise" />
    </section>
  );
}
