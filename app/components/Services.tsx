import FadeIn from "./FadeIn";
import SectionCurve from "./SectionCurve";
import ServiceCard from "./services/ServiceCard";
import SoftwareArtifact from "./services/SoftwareArtifact";
import WorkflowArtifact from "./services/WorkflowArtifact";
import CloudArtifact from "./services/CloudArtifact";
import DataArtifact from "./services/DataArtifact";
import MarketingArtifact from "./services/MarketingArtifact";

const services = [
  {
    title: "Custom Software Development",
    Artifact: SoftwareArtifact,
    description: "End-to-end web and application engineering",
    items: [
      "Mobile Application Development",
      "Website Development and Maintenance",
      "Legacy System Modernization",
    ],
  },
  {
    title: "AI Workflow Automation",
    Artifact: WorkflowArtifact,
    description: "Intelligent systems that work for you",
    items: [
      "Virtual Assistants and Chatbots",
      "Agentic Workflows",
      "Generative AI Solutions",
    ],
  },
  {
    title: "Cloud Infrastructure",
    Artifact: CloudArtifact,
    description: "Scalable, secure cloud foundations",
    items: [
      "Hosting and Deployment",
      "Database Management",
      "Cloud Migration",
    ],
  },
  {
    title: "Data Analysis",
    Artifact: DataArtifact,
    description: "Turn data into decisions",
    items: [
      "Predictive Analytics",
      "Data Infrastructure Setup",
      "Business Intelligence and Reporting",
    ],
  },
  {
    title: "Digital Marketing",
    Artifact: MarketingArtifact,
    description: "Reach and convert the right audience",
    items: [
      "SEO and Content Strategy",
      "Paid Advertising Campaigns",
      "Marketing Analytics and Reporting",
    ],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-theme="light"
      // Extra bottom padding accounts for the SectionCurve overlapping this
      // section's own last 110px — without it, that curve visually eats
      // into the padding and the gap before the next section reads smaller
      // than the (curve-free) gap at the top.
      className="pt-[120px] pb-[230px] px-6"
      style={{ backgroundColor: "var(--section-light)", position: "relative", zIndex: 0 }}
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
            OUR SERVICES
          </h2>
        </FadeIn>
      </div>

      {/* Full-bleed only applies at the desktop row layout (see
          .services-grid's 1024px media query in globals.css) — on mobile/
          tablet, where cards stack in a column, this sits in the section's
          normal px-6 margin like every other section on the site. */}
      <div className="services-grid">
        {services.map(({ title, Artifact, description, items }) => (
          <div key={title}>
            <ServiceCard title={title} description={description} items={items}>
              <Artifact />
            </ServiceCard>
          </div>
        ))}
      </div>
      <SectionCurve fill="var(--section-dark)" direction="rise" />
    </section>
  );
}
