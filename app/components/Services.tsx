"use client";
import { useState, useEffect } from "react";
import FadeIn from "./FadeIn";

const services = [
  {
    number: "01",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
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
    image: "/cloud-bg.jpeg",
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
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
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
                  backgroundColor: "var(--section-dark)",
                  ...(isDesktop
                    ? {
                        flexGrow: desktopFlexGrow,
                        flexShrink: 1,
                        flexBasis: 0,
                        minWidth: 0,
                        transition: "flex-grow 400ms cubic-bezier(0.16,1,0.3,1)",
                      }
                    : { width: "100%" }),
                }}
              >
                {/* Background image — fades out on hover */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${service.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: isHovered ? 0.35 : 1,
                    transition: "opacity 500ms ease",
                    zIndex: 0,
                  }}
                />
                {/* Subtle overall dark veil so image doesn't feel raw */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.25)",
                    zIndex: 0,
                  }}
                />

                {/* Text background panel — keeps content readable against the image */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "65%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, transparent 100%)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />

                {/* Card inner */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    padding: 32,
                    height: "100%",
                  }}
                >
                  {/* Top spacer: full flex centers title at rest; shrinks to minHeight on hover */}
                  <div style={{
                    flexGrow: isHovered ? 0 : 1,
                    flexShrink: 1,
                    flexBasis: "0px",
                    minHeight: isHovered ? 72 : 0,
                    transition: "flex-grow 420ms cubic-bezier(0.16,1,0.3,1), min-height 420ms cubic-bezier(0.16,1,0.3,1)",
                  }} />

                  {/* Title */}
                  <h3
                    className="font-heading font-bold"
                    style={{
                      fontSize: isHovered ? 26 : anyHovered ? 17 : 22,
                      color: "var(--section-dark-text)",
                      lineHeight: 1.25,
                      transition: "font-size 300ms ease",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Subtitle — collapses to 0 height when hidden so it doesn't affect layout */}
                  <div
                    style={{
                      maxHeight: isHovered ? 60 : 0,
                      overflow: "hidden",
                      transition: "max-height 400ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <p
                      className="font-body text-[14px]"
                      style={{
                        color: "rgba(255,255,255,0.65)",
                        marginTop: 8,
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 300ms ease 80ms",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Divider — collapses to 0 when hidden */}
                  <div
                    style={{
                      maxHeight: isHovered ? 41 : 0,
                      overflow: "hidden",
                      transition: "max-height 400ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <div
                      style={{
                        height: 1,
                        backgroundColor: "rgba(255,255,255,0.15)",
                        margin: "20px 0",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 300ms ease 80ms",
                      }}
                    />
                  </div>

                  {/* Sub-services — collapses to 0 when hidden */}
                  <div
                    style={{
                      maxHeight: isHovered ? 200 : 0,
                      overflow: "hidden",
                      transition: "max-height 400ms cubic-bezier(0.16,1,0.3,1) 50ms",
                    }}
                  >
                    <ul
                      style={{
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
                            color: "rgba(255,255,255,0.65)",
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered ? "translateY(0)" : "translateY(8px)",
                            transition: `opacity 280ms ease ${120 + itemIdx * 50}ms, transform 280ms ease ${120 + itemIdx * 50}ms`,
                          }}
                        >
                          <span style={{ color: "var(--section-dark-text)", flexShrink: 0 }} aria-hidden="true">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom spacer: always flex 1 — absorbs remaining space below content on hover */}
                  <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: "0px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
