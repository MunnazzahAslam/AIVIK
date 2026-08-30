"use client";
import { useEffect, useRef, useState } from "react";
import { type AnimHandle, type AnimKind } from "../lib/cinematicScenes";
import { ANIM_MAP } from "./Services";

type CloserLookItem = {
  label: string;
  eyebrow: string;
  headline: string;
  description: string;
  caseStudyHref: string;
  animation: AnimKind;
};

const ITEMS: CloserLookItem[] = [
  {
    label: "Data",
    eyebrow: "01 — DATA",
    headline: "Turn scattered systems into a single source of truth.",
    description:
      "Most automation and AI initiatives fail before they start — the data feeding them is scattered, duplicated, and out of date. We rebuild the plumbing first, so pipelines update the moment something changes, not on an overnight batch job.",
    caseStudyHref: "/case-studies/data",
    animation: "data",
  },
  {
    label: "AI",
    eyebrow: "02 — AI",
    headline: "Automation that replaces work, not just adds a chatbot.",
    description:
      "We design agents around the tasks your team already does — the ones quietly eating hours every week. Trained on your own data, accountable to your own workflows, and built to hold up under the EU AI Act.",
    caseStudyHref: "/case-studies/ai",
    animation: "ai",
  },
  {
    label: "Cloud",
    eyebrow: "03 — CLOUD",
    headline: "Infrastructure built for industries that can't get it wrong.",
    description:
      "Hosted in the EU or UAE, architected to the compliance bar that healthcare, finance, and government actually enforce. Migrations, access control, and uptime monitoring that pages a real person when something breaks.",
    caseStudyHref: "/case-studies/cloud",
    animation: "cloud",
  },
  {
    label: "Marketing",
    eyebrow: "04 — MARKETING",
    headline: "Growth systems that learn who your customer is.",
    description:
      "Predictive lead scoring, personalisation that adapts per customer, and a CRM that sits at the center of the system instead of collecting dust. Built on the same data foundation as everything else we ship.",
    caseStudyHref: "/case-studies/marketing",
    animation: "marketing",
  },
];

const CROSSFADE_MS = 900;

export default function CloserLook() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState<"A" | "B">("A");

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  const handleARef = useRef<AnimHandle | null>(null);
  const handleBRef = useRef<AnimHandle | null>(null);
  const isSectionVisibleRef = useRef(true);
  const isFirstRef = useRef(true);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Pause both render loops when the section scrolls out of view — real WebGL scenes,
  // too expensive to leave running off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSectionVisibleRef.current = entry.isIntersecting;
        handleARef.current?.setActive(entry.isIntersecting);
        handleBRef.current?.setActive(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Crossfade the full-bleed background to a new scene whenever the selected item changes.
  useEffect(() => {
    if (reducedMotion) return;

    if (isFirstRef.current) {
      isFirstRef.current = false;
      const canvas = canvasARef.current;
      if (!canvas) return;
      handleARef.current = ANIM_MAP[ITEMS[activeIndex].animation](canvas);
      handleARef.current.setActive(isSectionVisibleRef.current);
      return;
    }

    const showingA = visible === "A";
    const hiddenCanvas = showingA ? canvasBRef.current : canvasARef.current;
    const hiddenHandleRef = showingA ? handleBRef : handleARef;
    const outgoingHandleRef = showingA ? handleARef : handleBRef;
    if (!hiddenCanvas) return;

    hiddenHandleRef.current?.stop();
    hiddenHandleRef.current = ANIM_MAP[ITEMS[activeIndex].animation](hiddenCanvas);
    hiddenHandleRef.current.setActive(isSectionVisibleRef.current);

    setVisible(showingA ? "B" : "A");

    const cleanup = setTimeout(() => {
      outgoingHandleRef.current?.stop();
      outgoingHandleRef.current = null;
    }, CROSSFADE_MS + 50);

    return () => clearTimeout(cleanup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    return () => {
      handleARef.current?.stop();
      handleBRef.current?.stop();
    };
  }, []);

  const active = ITEMS[activeIndex];

  return (
    <section
      id="closer-look"
      data-theme="dark"
      ref={sectionRef}
      style={{ position: "relative", overflow: "hidden", padding: "140px 0 120px", minHeight: 760, background: "#03060D" }}
    >
      <div className="closer-look-bg" aria-hidden="true">
        {reducedMotion ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 65% 35%, rgba(37,99,235,0.22), #03060D 65%)",
            }}
          />
        ) : (
          <>
            <canvas ref={canvasARef} style={{ opacity: visible === "A" ? 1 : 0 }} />
            <canvas ref={canvasBRef} style={{ opacity: visible === "B" ? 1 : 0 }} />
          </>
        )}
        <div className="closer-look-scrim" />
      </div>

      <div className="closer-look-content" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px" }}>
        <h2
          className="font-heading font-bold"
          style={{
            fontSize: "clamp(40px, 5.5vw, 72px)",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 56px",
          }}
        >
          Take a closer look.
        </h2>

        <div className="closer-look-row">
          <div className="closer-look-list">
            {ITEMS.map((item, i) => {
              const isOpen = i === activeIndex;
              return (
                <button
                  key={item.label}
                  className={`closer-look-pill${isOpen ? " active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                  aria-expanded={isOpen}
                >
                  <span className={`closer-look-icon${isOpen ? " open" : ""}`} aria-hidden="true">
                    +
                  </span>
                  <span className="font-body font-semibold" style={{ fontSize: 17, color: "#F5F5F7" }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="closer-look-detail">
            <p
              className="font-body font-semibold"
              style={{
                fontSize: 13,
                color: "#2563EB",
                letterSpacing: "0.06em",
                margin: "0 0 18px",
              }}
            >
              {active.eyebrow}
            </p>
            <h3
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(24px, 2.6vw, 34px)",
                color: "#F5F5F7",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                margin: "0 0 18px",
              }}
            >
              {active.headline}
            </h3>
            <p
              className="font-body"
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "#8499B8",
                margin: 0,
              }}
            >
              {active.description}
            </p>
            <a href={active.caseStudyHref} className="closer-look-cta">
              See case studies
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
