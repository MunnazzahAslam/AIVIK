import { getTranslations } from "next-intl/server";
import FadeIn from "./FadeIn";
import SectionCurve from "./SectionCurve";
import ServiceCard from "./services/ServiceCard";
import SoftwareArtifact from "./services/SoftwareArtifact";
import WorkflowArtifact from "./services/WorkflowArtifact";
import CloudArtifact from "./services/CloudArtifact";
import DataArtifact from "./services/DataArtifact";
import MarketingArtifact from "./services/MarketingArtifact";

const ARTIFACTS = [
  SoftwareArtifact,
  WorkflowArtifact,
  CloudArtifact,
  DataArtifact,
  MarketingArtifact,
];

type ServiceEntry = { title: string; description: string; items: string[] };

export default async function Services() {
  const t = await getTranslations("Services");
  const services = t.raw("list") as ServiceEntry[];

  return (
    <section
      id="services"
      data-theme="light"
      // Extra bottom padding accounts for the SectionCurve overlapping this
      // section's own last 110px — without it, that curve visually eats
      // into the padding and the gap before the next section reads smaller
      // than the (curve-free) gap at the top.
      className="pt-[120px] pb-[230px] px-6 services-dot-bg"
      style={{ position: "relative", zIndex: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
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
            const Artifact = ARTIFACTS[index];
            return (
              <ServiceCard key={title} title={title} description={description} items={items} index={index}>
                <Artifact />
              </ServiceCard>
            );
          })}
        </div>
      </div>
      <SectionCurve fill="var(--section-dark)" direction="rise" />
    </section>
  );
}
