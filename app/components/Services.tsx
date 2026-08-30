"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AnimHandle,
  type AnimKind,
  createAIScene,
  createCloudScene,
  createDataScene,
  createMarketingScene,
} from "../lib/cinematicScenes";

export type { AnimKind };

type Service = {
  label: string;
  headline: string;
  animation: AnimKind;
};

const SERVICES: Service[] = [
  {
    label: "DATA",
    headline: "The foundation\neverything runs on.",
    animation: "data",
  },
  {
    label: "AI",
    headline: "Intelligence\nthat earns its keep.",
    animation: "ai",
  },
  {
    label: "CLOUD",
    headline: "Secure, sovereign,\nalways on.",
    animation: "cloud",
  },
  {
    label: "MARKETING",
    headline: "Growth,\ndriven by data.",
    animation: "marketing",
  },
  {
    number: "05",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    title: "Digital Marketing",
    description: "Reach and convert the right audience",
    items: [
      "SEO and Content Strategy",
      "Paid Advertising Campaigns",
      "Social Media Management",
      "Marketing Analytics and Reporting",
    ],
  },
];


export const ANIM_MAP: Record<AnimKind, (canvas: HTMLCanvasElement) => AnimHandle> = {
  data: createDataScene,
  ai: createAIScene,
  cloud: createCloudScene,
  marketing: createMarketingScene,
};

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const handlesRef = useRef<Record<number, AnimHandle>>({});
  const initializedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const initCard = useCallback(
    (index: number) => {
      if (initializedRef.current.has(index) || reducedMotion) return;
      const canvas = canvasRefs.current[index];
      if (!canvas) return;
      initializedRef.current.add(index);
      handlesRef.current[index] = ANIM_MAP[SERVICES[index].animation](canvas);
    },
    [reducedMotion]
  );

  // The scroll-snap track drives which card counts as "active" (dot nav, lazy WebGL init) —
  // covers dot clicks, keyboard nav, and manual swipe/trackpad scroll through one mechanism.
  // It also pauses/resumes each card's render loop as it leaves/enters the viewport — these are
  // real WebGL scenes with bloom now, too expensive to leave running off-screen.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.findIndex((el) => el === entry.target);
          if (index === -1) return;
          handlesRef.current[index]?.setActive(entry.isIntersecting);
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActiveIndex(index);
            initCard(index);
          }
        });
      },
      { root: viewport, threshold: [0, 0.6] }
    );
    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [initCard]);

  useEffect(() => {
    const handles = handlesRef.current;
    return () => {
      Object.values(handles).forEach((handle) => handle.stop());
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, SERVICES.length - 1));
      cardRefs.current[clamped]?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        inline: "start",
        block: "nearest",
      });
    },
    [reducedMotion]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo]);

  return (
    <section id="services" data-theme="dark" style={{ background: "#03060D", padding: "120px 0 80px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 48px 56px" }}>
        <h2
          className="font-heading font-bold"
          style={{
            fontSize: "clamp(40px, 5.5vw, 72px)",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          What we build.
        </h2>
      </div>

      <div className="services-viewport" ref={viewportRef}>
        {SERVICES.map((service, i) => (
          <div
            key={service.label}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="services-card"
          >
            <div className="services-text">
              <p
                className="font-body font-semibold"
                style={{
                  fontSize: 13,
                  color: "#86868B",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                0{i + 1} — {service.label}
              </p>

              <h3
                className="font-heading font-bold"
                style={{
                  fontSize: "clamp(30px, 3.6vw, 46px)",
                  color: "#F5F5F7",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                  margin: 0,
                  maxWidth: 620,
                  whiteSpace: "pre-line",
                }}
              >
                {service.headline}
              </h3>
            </div>

            <div className="services-visual">
              {reducedMotion ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.28), transparent 60%)",
                  }}
                />
              ) : (
                <canvas
                  ref={(el) => {
                    canvasRefs.current[i] = el;
                  }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32 }}>
        {SERVICES.map((service, i) => (
          <button
            key={service.label}
            onClick={() => goTo(i)}
            aria-label={`Go to ${service.label}`}
            style={{
              width: i === activeIndex ? 24 : 6,
              height: 6,
              borderRadius: 99,
              background: i === activeIndex ? "#FFFFFF" : "rgba(255,255,255,0.25)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
