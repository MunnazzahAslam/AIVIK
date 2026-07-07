"use client";
import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function scrambleText(el: HTMLElement, text: string, duration: number): () => void {
  let iter = 0;
  const total = duration / 40;
  const resolveRate = text.length / (total * 0.5);
  const id = setInterval(() => {
    el.textContent = text
      .split("")
      .map((ch, idx) => {
        if (ch === " ") return ch;
        if (idx < Math.floor(iter * resolveRate)) return text[idx];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    if (iter >= total) { el.textContent = text; clearInterval(id); }
    iter++;
  }, 40);
  return () => clearInterval(id);
}

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
    title: "Working Software in Week One",
    desc: "Discovery doesn't last months here. You see real deployed output within days of signing, not decks and promises.",
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
  const headingRef                        = useRef<HTMLHeadingElement>(null);
  const gridRef                           = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex]   = useState<number | null>(null);
  const [isVisible,    setIsVisible]      = useState(false);
  const [isTouch,      setIsTouch]        = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { obs.disconnect(); scrambleText(el, "WHY AIVIK", 1200); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
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

  return (
    <section
      id="why-aivik"
      data-theme="dark"
      className="py-[120px] px-6"
      style={{ backgroundColor: "var(--section-dark)" }}
    >
      <div className="max-w-6xl mx-auto">

        <div className="mb-16">
          <h2
            ref={headingRef}
            className="font-heading font-black"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: 1,
              color: "var(--section-dark-text)",
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
            const isHovered = !isTouch && hoveredIndex === i;

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
                style={{
                  display:  "flex",
                  position: "relative",
                  zIndex:   isHovered ? 1 : 0,
                  cursor:   "default",
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
                    borderColor:   "var(--section-dark-border)",
                    opacity:       isVisible ? 1 : 0,
                    transform:     isVisible ? "translateY(0)" : "translateY(40px)",
                    transition:    `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms,
                                    transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
                  }}
                >
                  {/* Content wrapper: scale lives here so borders never move */}
                  <div
                    style={{
                      transform:       isHovered ? "scale(1.04)" : "scale(1)",
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
                        color:         "var(--section-dark-text)",
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
                        color:      "var(--section-dark-muted)",
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
    </section>
  );
}
