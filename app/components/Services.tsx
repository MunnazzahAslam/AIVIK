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
    description: "End-to-end web and application engineering",
    items: [
      "Mobile Application Development",
      "Website Development and Maintenance",
      "Legacy System Modernization",
      "CRM and ERP Platform Development",
    ],
    Artifact: SoftwareArtifact,
  },
  {
    title: "AI Workflow Automation",
    description: "Intelligent systems that work for you",
    items: [
      "Virtual Assistants and Chatbots",
      "Agentic Workflows",
      "Generative AI Solutions",
      "AI-Powered Customer Support",
    ],
    Artifact: WorkflowArtifact,
  },
  {
    title: "Cloud Infrastructure",
    description: "Scalable, secure cloud foundations",
    items: [
      "Hosting and Deployment",
      "Database Management",
      "Cloud Migration",
      "Cloud Security Management and Analysis",
    ],
    Artifact: CloudArtifact,
  },
  {
    title: "Data Analysis",
    description: "Turn data into decisions",
    items: [
      "Predictive Analytics",
      "Data Infrastructure Setup",
      "Data Governance and Access Control",
      "Business Intelligence and Reporting",
    ],
    Artifact: DataArtifact,
  },
  {
    title: "Digital Marketing",
    description: "Reach and convert the right audience",
    items: [
      "SEO and Content Strategy",
      "Paid Advertising Campaigns",
      "Social Media Management",
      "Marketing Analytics and Reporting",
    ],
    Artifact: MarketingArtifact,
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
      className="pt-[120px] pb-[230px] px-6 dot-grid-bg"
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
            OUR SERVICES
          </h2>
        </FadeIn>

        <div className="svc-grid">
          {services.map(({ title, description, items, Artifact }, index) => (
            <ServiceCard key={title} title={title} description={description} items={items} index={index}>
              <Artifact />
            </ServiceCard>
          ))}
        </div>
      </div>
      <SectionCurve fill="var(--section-dark)" direction="rise" />
    </section>
  );
}
