"use client";
import { useEffect, useRef, useState } from "react";
import SectionCurve, { CURVE_HEIGHT } from "./SectionCurve";

const REASONS = [
  {
    number: "01",
    title: "You Own Everything, Always",
    desc: "Full source code, documentation, and IP transferred on day one. No lock-in, no hostage situations, no surprises.",
  },
  {
    number: "02",
    title: "Germany Registered, GDPR Native",
    desc: "Not retrofitted compliance. Every system is built European-grade from the first line of code. Your data stays yours.",
  },
  {
    number: "03",
    title: "One Point of Contact, Full Accountability",
    desc: "No account managers playing telephone. The person you speak to is the person building your product.",
  },
  {
    number: "04",
    title: "Progress, Not Promises",
    desc: "Discovery doesn't last months here. You see real, deployed progress within days of signing — not decks and promises.",
  },
  {
    number: "05",
    title: "AI-Native by Default",
    desc: "We don't bolt AI on at the end. Automation, intelligence, and efficiency are designed into every system from the start.",
  },
  {
    number: "06",
    title: "We Stay After Launch",
    desc: "Monitoring, iterations, scaling. We treat launch as the beginning, not the finish line. Long-term partners, not project vendors.",
  },
];

// Per-card border classes for each breakpoint (1-col mobile → 2-col tablet → 3-col desktop).
// Static strings so Tailwind JIT includes them all.
// Logic: mobile i<5 gets bottom; tablet col=(i%2)!==1 gets right, i<4 gets bottom; desktop col=(i%3)!==2 gets right, i<3 gets bottom.
const BORDER_CLASSES = [
  "border-b md:border-r",                         // i=0: all bottom, md+ right
  "border-b lg:border-r",                         // i=1: all bottom, lg+ right
  "border-b md:border-r lg:border-r-0",           // i=2: all bottom, md right, lg removes right
  "border-b lg:border-r lg:border-b-0",           // i=3: mob+tablet bottom, lg right+no-bottom
  "border-b md:border-r md:border-b-0",           // i=4: mob bottom, md+ right+no-bottom
  "",                                              // i=5: no borders
] as const;

export default function WhyAivik() {
  const gridRef                           = useRef<HTMLDivElement>(null);
  const overlayRef                        = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex]   = useState<number | null>(null);
  const [isVisible,    setIsVisible]      = useState(false);
  const [isTouch,      setIsTouch]        = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Disable hover scale on touch devices (no real hover capability)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setIsTouch(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleSpotlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = overlayRef.current;
    if (!el || isTouch) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(2);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(2);
    el.style.opacity    = "1";
    el.style.background = `radial-gradient(circle 500px at ${x}% ${y}%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.08) 50%, transparent 75%)`;
  };

  const handleSpotlightLeave = () => {
    const el = overlayRef.current;
    if (el) el.style.opacity = "0";
  };

  // Touch devices have no hover state — tapping a card toggles the same
  // zoom + spotlight glow instead, centered on the tapped card rather than
  // a cursor position that doesn't exist on touch.
  const handleCardTap = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    if (!isTouch) return;
    // Read the rect synchronously — e.currentTarget gets cleared once this
    // handler returns, so it can't be read lazily inside the state updater.
    const cardRect = e.currentTarget.getBoundingClientRect();
    setHoveredIndex((prev) => {
      const next = prev === i ? null : i;
      const overlay = overlayRef.current;
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
          overlay.style.background = `radial-gradient(circle 500px at ${x}% ${y}%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.08) 50%, transparent 75%)`;
        }
      }
      return next;
    });
  };

  return (
    <section
      id="why-aivik"
      data-theme="light"
      className="px-6"
      // Process paints a curve in THIS section's light color across its own
      // last 110px (a curved entry instead of a flat seam) — so that strip
      // is visually part of this section but structurally belongs to the
      // one above it. Pulling this section's own box up by CURVE_HEIGHT
      // (and padding it back down by the same amount) extends the section's
      // real hit-box and overlay over that strip, so the hover glow and
      // mouse tracking reach all the way into it with a single overlay —
      // no seam between separate layers. z-index:0 gives this section its
      // own stacking context so it reliably paints above Process's curve
      // (also isolated) instead of the two competing via a shared z-index
      // pool. Bottom padding gets the same +CURVE_HEIGHT so the clean gap
      // before the next curve (this section's own, at its bottom) matches
      // the clean gap at the top.
      style={{
        backgroundColor: "transparent",
        position: "relative",
        zIndex: 0,
        marginTop: -CURVE_HEIGHT,
        paddingTop: 120 + CURVE_HEIGHT,
        paddingBottom: 120 + CURVE_HEIGHT,
      }}
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
    >
      {/* Real background starts right where Process's curve ends, leaving
          the extended zone above it transparent so that curve shows through
          untouched until the glow lights up on hover. */}
      <div
        aria-hidden="true"
        className="dot-grid-bg"
        style={{ position: "absolute", top: CURVE_HEIGHT, left: 0, right: 0, bottom: 0, zIndex: -1 }}
      />

      {/* Spotlight — covers the whole section including the extended strip above it */}
      <div
        ref={overlayRef}
        style={{
          position:      "absolute",
          inset:         0,
          pointerEvents: "none",
          zIndex:        0,
          opacity:       0,
          transition:    "opacity 400ms ease",
        }}
      />
      <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>

        <div className="mb-16">
          <h2
            className="font-heading font-black"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: 1,
              color: "var(--section-light-text)",
            }}
          >
            WHY AIVIK
          </h2>
        </div>

        {/* overflow:visible so scale(1.04) isn't clipped; items-stretch is CSS grid default but explicit here */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch"
          style={{ overflow: "visible" }}
        >
          {REASONS.map((reason, i) => {
            const isHovered = hoveredIndex === i;

            return (
              /* ── Outer: owns ONLY the hover scale transform.
                 display:flex passes the grid cell's full height down to the inner div.
                 CSS animation fill-mode conflict explained: keeping scale and the
                 scroll-reveal translateY on separate elements prevents the animation
                 from locking transform on the element receiving hover.              */
              <div
                key={reason.number}
                onMouseEnter={() => !isTouch && setHoveredIndex(i)}
                onMouseLeave={() => !isTouch && setHoveredIndex(null)}
                onClick={(e) => handleCardTap(e, i)}
                style={{
                  display:  "flex",
                  position: "relative",
                  zIndex:   isHovered ? 1 : 0,
                }}
              >
                {/* ── Inner: owns scroll-reveal + borders + padding.
                    Borders are NOT scaled — only the content inside scales. */}
                <div
                  className={`py-5 px-4 md:py-7 md:px-6 lg:py-9 lg:px-8 ${BORDER_CLASSES[i]}`}
                  style={{
                    flex:          1,
                    display:       "flex",
                    flexDirection: "column",
                    borderColor:   "var(--section-light-border)",
                    opacity:       isVisible ? 1 : 0,
                    transform:     isVisible ? "translateY(0)" : "translateY(40px)",
                    transition:    `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms,
                                    transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
                  }}
                >
                  {/* Content wrapper: scale lives here so borders never move */}
                  <div
                    style={{
                      transform:       isHovered ? "scale(1.08)" : "scale(1)",
                      transition:      "transform 300ms ease",
                      transformOrigin: "top left",
                    }}
                  >
                    {/* minHeight reserves space for 2 wrapped lines, equalising card heights */}
                    <h3
                      className="font-heading font-bold"
                      style={{
                        fontSize:      "clamp(14px, 2vw, 17px)",
                        lineHeight:    1.3,
                        letterSpacing: "-0.3px",
                        color:         "var(--section-light-text)",
                        marginBottom:  12,
                        minHeight:     "2.6em",
                      }}
                    >
                      {reason.title}
                    </h3>

                    <p
                      className="font-body"
                      style={{
                        fontSize:   13,
                        lineHeight: 1.75,
                        color:      "var(--section-light-muted)",
                      }}
                    >
                      {reason.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <SectionCurve fill="var(--section-dark)" direction="rise" />
    </section>
  );
}
