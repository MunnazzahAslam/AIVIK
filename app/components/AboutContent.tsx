"use client";
import { useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn";
import SectionCurve, { CURVE_HEIGHT } from "./SectionCurve";

const PRINCIPLES = [
  {
    title: "You talk to the person building it",
    desc: "No account managers relaying messages. The engineer who writes the code is who you email.",
  },
  {
    title: "You own what you pay for",
    desc: "Source code, documentation, and IP transfer to you on day one. Nothing held back, nothing licensed back to you.",
  },
  {
    title: "German-registered, GDPR-native",
    desc: "Not a compliance checklist added later. Data handling is built into how we architect systems from the first line of code.",
  },
  {
    title: "Small enough to move, structured enough to trust",
    desc: "A focused team, not a bench of juniors rotating through your project. Every engagement gets senior attention throughout.",
  },
];

const SPOTLIGHT_BG = (x: string, y: string) =>
  `radial-gradient(circle 500px at ${x}% ${y}%, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0.15) 50%, transparent 75%)`;

const spotlightGradientFromRect = (r: DOMRect, clientX: number, clientY: number) => {
  const x = ((clientX - r.left) / r.width * 100).toFixed(2);
  const y = ((clientY - r.top) / r.height * 100).toFixed(2);
  return SPOTLIGHT_BG(x, y);
};

// Plain ambient spotlight for sections with no cards to zoom (Intro, Trust) —
// each section owns its overlay so it renders above that section's own
// opaque background, not behind it (an outer/shared overlay would sit behind
// every section's background fill and never be visible).
function useSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.opacity = "1";
    el.style.background = spotlightGradientFromRect(el.getBoundingClientRect(), e.clientX, e.clientY);
  };
  const handleLeave = () => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  };
  return { overlayRef, handleMove, handleLeave };
}

// Fades the glow out near the section's own top/bottom edge instead of letting
// it hard-cut at the section boundary — softens the handoff between sections
// (and into the footer) since each section owns an independent overlay.
const EDGE_FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 120px, black calc(100% - 120px), transparent 100%)";

function SpotlightOverlay({ overlayRef }: { overlayRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0,
        transition: "opacity 400ms ease",
        maskImage: EDGE_FADE_MASK,
        WebkitMaskImage: EDGE_FADE_MASK,
      }}
    />
  );
}

// The section above paints a SectionCurve in THIS section's own color
// across its last CURVE_HEIGHT px (a curved entry instead of a flat seam),
// so that strip is visually part of this section but structurally belongs
// to the one above. Spread onto a section that is preceded by such a curve:
// pulls this section's own box up by CURVE_HEIGHT (and pads it back down by
// the same amount, so its content position is unchanged) so the section's
// real hit-box and its single overlay extend over that strip — the glow and
// mouse tracking reach all the way into it with no seam between separate
// layers. zIndex:0 gives the section its own stacking context so it
// reliably paints above the (also isolated) curve instead of the two
// competing via a shared z-index pool.
function curveEntryStyle(paddingTop: number, paddingBottom: number) {
  return {
    position: "relative" as const,
    zIndex: 0,
    marginTop: -CURVE_HEIGHT,
    paddingTop: paddingTop + CURVE_HEIGHT,
    paddingBottom,
  };
}

// Paints the section's real background starting right where the curve
// above ends, leaving the extended zone transparent so that curve shows
// through untouched until the glow lights up on hover.
function CurveEntryBackground({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", top: CURVE_HEIGHT, left: 0, right: 0, bottom: 0, backgroundColor: color, zIndex: -1 }}
    />
  );
}

export default function AboutContent() {
  const intro = useSpotlight();
  const trust = useSpotlight();

  const principlesOverlayRef = useRef<HTMLDivElement>(null);
  const principlesGridRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [principlesVisible, setPrinciplesVisible] = useState(false);

  // Scroll-triggered fade + slide-up reveal for the principle cards, staggered
  // per card — replays each time the grid (re-)enters view, same as
  // Services and WhyAivik's grids.
  useEffect(() => {
    const el = principlesGridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPrinciplesVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Disable hover scale/spotlight on touch devices (no real hover capability) —
  // tapping a card triggers the same effect instead, see handleCardTap below.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setIsTouch(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handlePrinciplesMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const el = principlesOverlayRef.current;
    if (!el) return;
    el.style.opacity = "1";
    el.style.background = spotlightGradientFromRect(el.getBoundingClientRect(), e.clientX, e.clientY);
  };

  const handlePrinciplesLeave = () => {
    if (principlesOverlayRef.current) principlesOverlayRef.current.style.opacity = "0";
  };

  // Touch devices have no hover state — tapping a principle card toggles the
  // same zoom + spotlight glow instead, centered on the tapped card rather
  // than a cursor position that doesn't exist on touch.
  const handleCardTap = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    if (!isTouch) return;
    // Read the rect synchronously — e.currentTarget gets cleared once this
    // handler returns, so it can't be read lazily inside the state updater.
    const cardRect = e.currentTarget.getBoundingClientRect();
    setHoveredIndex((prev) => {
      const next = prev === i ? null : i;
      const overlay = principlesOverlayRef.current;
      if (overlay) {
        if (next === null) {
          overlay.style.opacity = "0";
        } else {
          const sectionRect = overlay.getBoundingClientRect();
          const cx = cardRect.left + cardRect.width / 2 - sectionRect.left;
          const cy = cardRect.top + cardRect.height / 2 - sectionRect.top;
          const x = ((cx / sectionRect.width) * 100).toFixed(2);
          const y = ((cy / sectionRect.height) * 100).toFixed(2);
          overlay.style.opacity = "1";
          overlay.style.background = SPOTLIGHT_BG(x, y);
        }
      }
      return next;
    });
  };

  return (
    <>
      {/* Intro */}
      <section
        data-theme="dark"
        // pb gets +CURVE_HEIGHT since this section's own SectionCurve
        // overlaps its last 110px — otherwise the clean gap before that
        // curve reads much smaller than the clean gap at the top.
        className="pt-[152px] pb-[210px] px-6"
        style={{ backgroundColor: "var(--section-dark)", position: "relative", zIndex: 0 }}
        onMouseMove={intro.handleMove}
        onMouseLeave={intro.handleLeave}
      >
        <SpotlightOverlay overlayRef={intro.overlayRef} />
        <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <FadeIn>
            <h1
              className="font-heading font-black mb-8"
              style={{
                color: "var(--section-dark-text)",
                fontSize: "clamp(40px, 6vw, 64px)",
                letterSpacing: "-2px",
                lineHeight: 1.05,
                maxWidth: 820,
              }}
            >
              A small team building software the way we&apos;d want it built for us.
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p
              className="font-body text-base leading-relaxed"
              style={{ color: "var(--section-dark-muted)", maxWidth: 640 }}
            >
              AIVIK is a software engineering and AI automation company, registered
              in Germany. We build custom software, automate workflows with AI, and
              set up the cloud infrastructure and data systems underneath, for
              founders and teams who want a direct line to the people doing the work,
              not a chain of account managers between them and their own product.
            </p>
          </FadeIn>
        </div>
        <SectionCurve fill="var(--section-light)" direction="dip" />
      </section>

      {/* How we work */}
      <section
        id="about-principles"
        data-theme="light"
        className="px-6"
        // Preceded by Intro's dip curve; pb also gets +CURVE_HEIGHT for its
        // own rise curve below — see curveEntryStyle/CurveEntryBackground.
        style={curveEntryStyle(100, 100 + CURVE_HEIGHT)}
        onMouseMove={handlePrinciplesMove}
        onMouseLeave={handlePrinciplesLeave}
      >
        <CurveEntryBackground color="var(--section-light)" />
        <SpotlightOverlay overlayRef={principlesOverlayRef} />
        <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <FadeIn>
            <h2
              className="font-heading font-black mb-16"
              style={{
                fontSize: "clamp(32px, 4.5vw, 48px)",
                letterSpacing: "-1.5px",
                lineHeight: 1,
                color: "var(--section-light-text)",
              }}
            >
              How we work
            </h2>
          </FadeIn>

          <div ref={principlesGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12" style={{ overflow: "visible" }}>
            {PRINCIPLES.map((p, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={p.title}
                  onMouseEnter={() => !isTouch && setHoveredIndex(i)}
                  onMouseLeave={() => !isTouch && setHoveredIndex(null)}
                  onClick={(e) => handleCardTap(e, i)}
                  style={{
                    position: "relative",
                    opacity: principlesVisible ? 1 : 0,
                    transform: principlesVisible ? "translateY(0)" : "translateY(40px)",
                    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
                  }}
                >
                  <div
                    style={{
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                      transition: "transform 300ms ease",
                      transformOrigin: "top left",
                    }}
                  >
                    <h3
                      className="font-heading font-bold mb-3"
                      style={{ fontSize: 19, color: "var(--section-light-text)", letterSpacing: "-0.3px" }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{ color: "var(--section-light-muted)" }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <SectionCurve fill="var(--section-dark)" direction="rise" />
      </section>

      {/* Trust + CTA */}
      <section
        data-theme="dark"
        className="px-6 pb-[100px]"
        // Preceded by Principles' rise curve; no curve of its own below
        // (last section before the footer), so bottom padding is unchanged.
        style={curveEntryStyle(100, 100)}
        onMouseMove={trust.handleMove}
        onMouseLeave={trust.handleLeave}
      >
        <CurveEntryBackground color="var(--section-dark)" />
        <SpotlightOverlay overlayRef={trust.overlayRef} />
        <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-12 items-start">
            <FadeIn>
              <div>
                <h2
                  className="font-heading font-black mb-5"
                  style={{
                    fontSize: "clamp(28px, 3.5vw, 38px)",
                    letterSpacing: "-1px",
                    lineHeight: 1.15,
                    color: "var(--section-dark-text)",
                  }}
                >
                  Registered, accountable, and easy to check.
                </h2>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "var(--section-dark-muted)", maxWidth: 480 }}
                >
                  AIVIK is a registered German business. The full legal details are
                  public on our{" "}
                  <a href="/impressum" className="link-on-dark underline">
                    Impressum
                  </a>
                  . We&apos;d rather you verify that yourself than take our word for it.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
                <a
                  href="/#contact"
                  className="font-body text-sm font-semibold bg-white text-black px-7 py-[14px] hover:bg-[#F0F0F0] transition-colors duration-200 text-center"
                >
                  Get in touch
                </a>
                <a
                  href="mailto:info@aivik.eu"
                  className="font-body text-sm link-on-dark px-7 py-[14px] text-center"
                >
                  info@aivik.eu
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
