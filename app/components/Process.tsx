"use client";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    step: "STEP 01",
    title: "Discovery and Alignment",
    description:
      "We begin with a structured discovery session to understand your business objectives, technical constraints, and success criteria. This ensures every decision we make is grounded in your goals, not assumptions.",
    dark: true,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="white"
        strokeWidth="1"
        aria-hidden="true"
      >
        <line x1="20" y1="100" x2="100" y2="20" />
        <line x1="40" y1="100" x2="100" y2="40" />
        <line x1="60" y1="100" x2="100" y2="60" />
        <line x1="80" y1="100" x2="100" y2="80" />
        <line x1="20" y1="80" x2="80" y2="20" />
        <rect x="30" y="30" width="60" height="60" strokeDasharray="4 4" />
      </svg>
    ),
  },
  {
    step: "STEP 02",
    title: "Solution Architecture",
    description:
      "Our engineers design a detailed technical blueprint covering system architecture, technology selection, timeline, and resource allocation. You receive full visibility into how we plan to deliver before a single line of code is written.",
    dark: false,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="black"
        strokeWidth="1"
        aria-hidden="true"
      >
        <rect x="20" y="20" width="80" height="80" />
        <rect x="35" y="35" width="50" height="50" />
        <rect x="50" y="50" width="20" height="20" />
        <line x1="20" y1="20" x2="50" y2="50" />
        <line x1="100" y1="20" x2="70" y2="50" />
        <line x1="20" y1="100" x2="50" y2="70" />
        <line x1="100" y1="100" x2="70" y2="70" />
      </svg>
    ),
  },
  {
    step: "STEP 03",
    title: "Agile Delivery",
    description:
      "We execute in focused sprints with regular delivery milestones. You have continuous visibility through live demos, progress updates, and direct access to the engineering team throughout the engagement.",
    dark: true,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="white"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="40" />
        <circle cx="60" cy="60" r="25" />
        <circle cx="60" cy="60" r="10" />
        <line x1="60" y1="20" x2="60" y2="35" />
        <line x1="60" y1="85" x2="60" y2="100" />
        <line x1="20" y1="60" x2="35" y2="60" />
        <line x1="85" y1="60" x2="100" y2="60" />
      </svg>
    ),
  },
  {
    step: "STEP 04",
    title: "Launch and Continuous Support",
    description:
      "Deployment is the beginning, not the end. We manage your go-live, monitor system performance, and remain your long-term engineering partner as your product scales and your requirements evolve.",
    dark: false,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="black"
        strokeWidth="1"
        aria-hidden="true"
      >
        <polyline points="20,90 45,60 65,75 100,30" />
        <polyline points="80,30 100,30 100,50" />
        <line x1="20" y1="100" x2="100" y2="100" />
        <line x1="20" y1="100" x2="20" y2="20" />
      </svg>
    ),
  },
];

// Sticky top values in px — 40px increments so 40px of each card peeks below the next
const STICKY_TOPS = [80, 120, 160, 200];

export default function Process() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setActiveIndex(-1);
      return;
    }

    const handleScroll = () => {
      // Find the highest-indexed card whose top has reached or passed its sticky threshold.
      // That card is the active/topmost stuck card; all cards below it index are collapsed.
      const newActive = cardRefs.current.reduce((max, card, i) => {
        if (!card) return max;
        const top = card.getBoundingClientRect().top;
        if (top <= STICKY_TOPS[i] + 2) return i;
        return max;
      }, -1);

      setActiveIndex(newActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  const topClasses = [
    "md:top-[80px]",
    "md:top-[120px]",
    "md:top-[160px]",
    "md:top-[200px]",
  ];
  const zClasses = ["md:z-10", "md:z-20", "md:z-30", "md:z-40"];

  return (
    <section
      id="process"
      data-theme="light"
      className="px-6"
      style={{ backgroundColor: "var(--section-light)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* HEADING — outside sticky container, scrolls normally */}
        <div className="pt-20 md:pt-[120px] pb-10">
          <h2
            className="font-heading font-black"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: "1",
              color: "var(--section-light-text)",
            }}
          >
            OUR PROCESS
          </h2>
        </div>

        {/* STICKY CARDS — only cards here, no heading */}
        <div className="flex flex-col gap-4 md:gap-0">
          {steps.map(({ step, title, description, dark, shape }, i) => {
            // isCollapsed: this card is stuck but another card is stacked above it
            const isCollapsed = isDesktop && activeIndex > i;

            return (
              <div
                key={step}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`md:sticky ${topClasses[i]} ${zClasses[i]} max-w-[900px] mx-auto w-full`}
                style={{
                  backgroundColor: dark ? "var(--section-dark)" : "var(--section-light)",
                  border: `1px solid ${dark ? "var(--section-dark-border)" : "var(--section-light-border)"}`,
                }}
              >
                {/* Collapsed indicator — 48px strip, only visible when this card is covered */}
                <div
                  style={{
                    height: 48,
                    paddingLeft: 40,
                    paddingRight: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    overflow: "hidden",
                    opacity: isCollapsed ? 1 : 0,
                    transition: "opacity 300ms ease",
                    // Always in the DOM so the 48px reserves space at the top of each card
                    // for the stacking peek effect
                    pointerEvents: isCollapsed ? "auto" : "none",
                  }}
                >
                  <span
                    className="font-mono text-[10px] tracking-[2px] uppercase"
                    style={{ color: "var(--section-dark-muted)" }}
                  >
                    {step}
                  </span>

                  {/* Vertical separator */}
                  <div
                    style={{
                      width: 1,
                      height: 16,
                      backgroundColor: dark ? "var(--section-dark-ghost)" : "#CCCCCC",
                      margin: "0 12px",
                      flexShrink: 0,
                    }}
                  />

                  <span
                    className="font-body text-[12px]"
                    style={{ color: "var(--section-light-muted)" }}
                  >
                    {title}
                  </span>
                </div>

                {/* Main card content — fades out when this card is collapsed */}
                <div
                  className="p-10 md:p-16"
                  style={{
                    opacity: isCollapsed ? 0 : 1,
                    transition: "opacity 300ms ease",
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16">
                    <div className="flex-1">
                      <p
                        className="font-mono text-[11px] tracking-[3px] uppercase mb-6"
                        style={{ color: dark ? "var(--section-dark-subtle)" : "var(--section-dark-muted)" }}
                      >
                        {step}
                      </p>
                      <h3
                        className="font-heading text-3xl md:text-[36px] font-bold mb-5"
                        style={{ color: dark ? "var(--section-dark-text)" : "var(--section-light-text)" }}
                      >
                        {title}
                      </h3>
                      <p
                        className="font-body text-base leading-[1.7] max-w-[480px]"
                        style={{ color: dark ? "var(--section-dark-muted)" : "var(--section-light-muted)" }}
                      >
                        {description}
                      </p>
                    </div>

                    <div className="shrink-0 opacity-60">{shape}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom spacer */}
        <div className="hidden md:block h-[80px]" aria-hidden="true" />
        <div
          className="h-px mt-10 max-w-[900px] mx-auto mb-20 md:mb-[60px]"
          style={{ backgroundColor: "var(--section-light-border)" }}
        />
      </div>
    </section>
  );
}
