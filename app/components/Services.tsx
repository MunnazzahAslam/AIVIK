"use client";
import { useState, useEffect } from "react";
import FadeIn from "./FadeIn";

const services = [
  {
    number: "01",
    title: "Custom Software Development",
    description: "End-to-end web and application engineering",
    items: [
      "Mobile Application Development",
      "Website Development and Maintenance",
      "Legacy System Modernization",
      "CRM and ERP Platform Development",
    ],
  },
  {
    number: "02",
    title: "Cloud Infrastructure",
    description: "Scalable, secure cloud foundations",
    items: [
      "Hosting and Deployment",
      "Database Management",
      "Cloud Migration",
      "Cloud Security Management and Analysis",
    ],
  },
  {
    number: "03",
    title: "AI Workflow Automation",
    description: "Intelligent systems that work for you",
    items: [
      "Virtual Assistants and Chatbots",
      "Agentic Workflows",
      "Generative AI Solutions",
      "AI-Powered Customer Support",
    ],
  },
  {
    number: "04",
    title: "Data Analysis",
    description: "Turn data into decisions",
    items: [
      "Predictive Analytics",
      "Data Infrastructure Setup",
      "Data Governance and Access Control",
      "Business Intelligence and Reporting",
    ],
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="services"
      data-theme="light"
      className="py-20 md:py-[120px] px-6"
      style={{ backgroundColor: "var(--section-light)" }}
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

        <div
          className="flex flex-col md:flex-row gap-px"
          style={{ minHeight: isDesktop ? 480 : "auto" }}
        >
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const anyHovered = hoveredIndex !== null;

            const desktopFlexGrow = anyHovered ? (isHovered ? 3 : 1) : 1;

            return (
              <div
                key={service.number}
                onMouseEnter={() => isDesktop && setHoveredIndex(index)}
                onMouseLeave={() => isDesktop && setHoveredIndex(null)}
                onClick={() =>
                  !isDesktop && setHoveredIndex(isHovered ? null : index)
                }
                style={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: isHovered
                    ? "#000000"
                    : anyHovered
                    ? "#FAFAFA"
                    : "#F5F5F5",
                  ...(isDesktop
                    ? {
                        flexGrow: desktopFlexGrow,
                        flexShrink: 1,
                        flexBasis: 0,
                        minWidth: 0,
                        transition:
                          "flex-grow 400ms cubic-bezier(0.16,1,0.3,1), background-color 400ms ease",
                      }
                    : {
                        width: "100%",
                        transition: "background-color 400ms ease",
                      }),
                }}
              >
                {/* Ghost number watermark */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: -20,
                    right: -10,
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 140,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: isHovered ? "#1A1A1A" : "#EEEEEE",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                    transition: "color 400ms ease",
                  }}
                >
                  {service.number}
                </span>

                {/* Card inner — flexbox layout, all layers anchored */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: 32,
                    height: "100%",
                  }}
                >
                  {/* Number area — fixed 40px */}
                  <div
                    style={{
                      height: 40,
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      className="font-mono text-[11px]"
                      style={{
                        color: isHovered ? "#888888" : "#CCCCCC",
                        transition: "color 400ms ease",
                      }}
                    >
                      {service.number}
                    </span>
                  </div>

                  {/* Title + subtitle area — fixed 140px, content anchored to bottom */}
                  <div
                    style={{
                      height: 140,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <h3
                      className="font-heading font-bold"
                      style={{
                        fontSize: isHovered ? 24 : 20,
                        color: isHovered ? "#FFFFFF" : "#000000",
                        lineHeight: 1.2,
                        transition: "font-size 300ms ease, color 400ms ease",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="font-body text-[13px]"
                      style={{
                        color: "#888888",
                        marginTop: 8,
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Divider — visible by default */}
                  <div
                    style={{
                      height: 1,
                      backgroundColor: isHovered
                        ? "rgba(255,255,255,0.15)"
                        : "#E5E5E5",
                      margin: "20px 0",
                      transition: "background-color 400ms ease",
                    }}
                  />

                  {/* Sub-services — hidden by default, shown on hover */}
                  <ul
                    style={{
                      flex: 1,
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {service.items.map((item, itemIdx) => (
                      <li
                        key={item}
                        className="font-body text-[13px] flex items-start gap-2"
                        style={{
                          color: "#888888",
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered
                            ? "translateY(0)"
                            : "translateY(12px)",
                          transition: `opacity 300ms ease ${150 + itemIdx * 50}ms, transform 300ms ease ${150 + itemIdx * 50}ms`,
                        }}
                      >
                        <span
                          style={{ color: "#FFFFFF", flexShrink: 0 }}
                          aria-hidden="true"
                        >
                          →
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
