import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import FadeIn from "./FadeIn";
import SectionCurve from "./SectionCurve";
import ServiceCard from "./services/ServiceCard";
import { SERVICE_ARTIFACTS } from "./services/artifacts";
import { SERVICES, servicePath } from "@/data/services";

type ServiceEntry = { title: string; description: string; items: string[] };

export default async function Services() {
  const t = await getTranslations("Services");
  const tPages = await getTranslations("ServicePages");
  const locale = (await getLocale()) as Locale;
  const services = t.raw("list") as ServiceEntry[];

  return (
    <section
      id="services"
      data-theme="light"
      // Extra bottom padding accounts for the SectionCurve overlapping this
      // section's own last 110px.
      className="pt-[120px] pb-[230px] px-6 services-dot-bg"
      style={{ position: "relative", zIndex: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-10">
          <h2
            className="font-heading font-black"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: "1",
              color: "var(--section-light-text)",
            }}
          >
            {t("heading")}
          </h2>
        </FadeIn>

        <div className="svc-grid">
          {services.map(({ title, description, items }, index) => {
            // The cards and data/services.ts list the services in the same order.
            const service = SERVICES[index];
            const Artifact = SERVICE_ARTIFACTS[service.id];
            return (
              <ServiceCard key={title} title={title} description={description} items={items} index={index} more={{ label: tPages("cardLink"), href: servicePath(locale, service) }}>
                <Artifact />
              </ServiceCard>
            );
          })}
        </div>
      </div>
      {/* Dotted grey into the plain white of the use-cases section. */}
      <SectionCurve fill="var(--section-light)" direction="dip" />
    </section>
  );
}
