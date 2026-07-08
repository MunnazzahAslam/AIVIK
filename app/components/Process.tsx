"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function ScrambleText({ text, triggered }: { text: string; triggered: boolean }) {
  const [display, setDisplay] = useState(text);
  const done = useRef(false);
  useEffect(() => {
    if (!triggered || done.current) return;
    done.current = true;
    let iter = 0;
    const total = 480 / 40;
    const resolve = text.length / (total * 0.55);
    const id = setInterval(() => {
      setDisplay(
        text.split("").map((ch, idx) => {
          if (" ,.-—".includes(ch)) return ch;
          if (idx < Math.floor(iter * resolve)) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (iter++ >= total) { setDisplay(text); clearInterval(id); }
    }, 40);
    return () => clearInterval(id);
  }, [triggered, text]);
  return <>{display}</>;
}

const steps = [
  {
    step: "STEP 01",
    title: "Discovery and Alignment",
    desc: "A structured session to map your business objectives, technical constraints, and success criteria — so every decision is grounded in your goals, not assumptions.",
    side: "left" as const,
  },
  {
    step: "STEP 02",
    title: "Solution Architecture",
    desc: "A detailed technical blueprint: system architecture, technology selection, timeline, and resource plan — full visibility before a single line of code is written.",
    side: "right" as const,
  },
  {
    step: "STEP 03",
    title: "Agile Delivery",
    desc: "Focused sprints with regular milestones. Continuous visibility through live demos, progress updates, and direct access to the engineering team throughout.",
    side: "left" as const,
  },
  {
    step: "STEP 04",
    title: "Launch and Continuous Support",
    desc: "Deployment is the beginning, not the end. We manage go-live, monitor performance, and remain your long-term engineering partner as your product scales.",
    side: "right" as const,
  },
];

const THRESHOLDS    = [0.12, 0.35, 0.58, 0.80];
const STEP          = 110;
const CONTAINER_H   = STEP * 3 + 220;
// Alternating x positions for mobile dots — gives makeSegment different start/end x
// values so the cubic bezier produces a genuine S-curve (same as desktop logic).
const MOBILE_DOT_XA = 10; // even-indexed dots (left)
const MOBILE_DOT_XB = 38; // odd-indexed dots (right)

// Smooth S-curve between two points — shared by desktop and mobile
function makeSegment(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
}

export default function Process() {

  // ── Desktop refs ──────────────────────────────────────────────────────────
  const desktopScrollRef = useRef<HTMLDivElement>(null); // the 380vh div
  const containerRef     = useRef<HTMLDivElement>(null); // staircase container
  const cardRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const segRefs          = useRef<(SVGPathElement | null)[]>([null, null, null]);
  const segGlowRefs      = useRef<(SVGPathElement | null)[]>([null, null, null]);
  const segLengths       = useRef<number[]>([]);

  const [waypoints, setWaypoints] = useState<{ x: number; y: number }[]>([]);
  const [svgDims,   setSvgDims]   = useState({ w: 1000, h: CONTAINER_H });
  const [revealed,  setRevealed]  = useState([false, false, false, false]);
  const [active,    setActive]    = useState([false, false, false, false]);

  // ── Mobile refs ───────────────────────────────────────────────────────────
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSegRefs      = useRef<(SVGPathElement | null)[]>([null, null, null]);
  const mobileSegGlowRefs  = useRef<(SVGPathElement | null)[]>([null, null, null]);
  const mobileSegLengths   = useRef<number[]>([]);

  const [mobileWaypoints, setMobileWaypoints] = useState<{ x: number; y: number }[]>([]);
  const [mobileSvgH,      setMobileSvgH]      = useState(900);
  const [mobileActive,    setMobileActive]    = useState([false, false, false, false]);

  // ── Desktop: measure card positions → waypoints ───────────────────────────
  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container || cardRefs.current.some(c => !c)) return;
      const cr = container.getBoundingClientRect();
      if (cr.height === 0) return; // hidden on mobile
      setSvgDims({ w: cr.width, h: cr.height });
      const pts = cardRefs.current.map((card, i) => {
        const r = card!.getBoundingClientRect();
        return {
          y: r.top  - cr.top  + r.height / 2,
          x: steps[i].side === "left"
            ? r.right - cr.left + 12
            : r.left  - cr.left - 12,
        };
      });
      setWaypoints(pts);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Desktop: scroll listener + segment init ───────────────────────────────
  useEffect(() => {
    if (waypoints.length < 4) return;
    const section = desktopScrollRef.current;
    if (!section) return;

    let removeScroll: (() => void) | undefined;

    const raf = requestAnimationFrame(() => {
      segRefs.current.forEach((seg, i) => {
        const glow = segGlowRefs.current[i];
        if (!seg) return;
        const L = seg.getTotalLength();
        segLengths.current[i] = L;
        seg.style.strokeDasharray  = `${L}`;
        seg.style.strokeDashoffset = `${L}`;
        if (glow) { glow.style.strokeDasharray = `${L}`; glow.style.strokeDashoffset = `${L}`; }
      });

      const tick = () => {
        const rect = section.getBoundingClientRect();
        const winH = window.innerHeight;
        const sH   = section.offsetHeight;
        const raw  = (winH * 0.55 - rect.top) / (sH - winH * 0.45);
        const p    = Math.max(0, Math.min(1, raw));
        setRevealed(THRESHOLDS.map(t => p >= t));
        setActive  (THRESHOLDS.map(t => p >= t));
      };

      window.addEventListener("scroll", tick, { passive: true });
      tick();
      removeScroll = () => window.removeEventListener("scroll", tick);
    });

    return () => { cancelAnimationFrame(raf); removeScroll?.(); };
  }, [waypoints]);

  // ── Desktop: animate segments when active changes ─────────────────────────
  useEffect(() => {
    segRefs.current.forEach((seg, i) => {
      const glow = segGlowRefs.current[i];
      const L    = segLengths.current[i];
      if (!seg || !L) return;
      const show = active[i] && active[i + 1];
      seg.style.strokeDashoffset  = show ? "0" : `${L}`;
      if (glow) glow.style.strokeDashoffset = show ? "0" : `${L}`;
    });
  }, [active]);

  // ── Mobile: measure card positions ────────────────────────────────────────
  useLayoutEffect(() => {
    const measure = () => {
      const container = mobileContainerRef.current;
      if (!container || mobileCardRefs.current.some(c => !c)) return;
      const cr = container.getBoundingClientRect();
      if (cr.height === 0) return; // hidden on desktop
      setMobileSvgH(cr.height);
      const pts = mobileCardRefs.current.map((card, i) => {
        const r = card!.getBoundingClientRect();
        return {
          x: i % 2 === 0 ? MOBILE_DOT_XA : MOBILE_DOT_XB,
          y: r.top - cr.top + r.height / 2,
        };
      });
      setMobileWaypoints(pts);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Mobile: init segment paths once waypoints are ready ───────────────────
  useEffect(() => {
    if (mobileWaypoints.length < 4) return;
    const raf = requestAnimationFrame(() => {
      mobileSegRefs.current.forEach((seg, i) => {
        const glow = mobileSegGlowRefs.current[i];
        if (!seg) return;
        const L = seg.getTotalLength();
        mobileSegLengths.current[i] = L;
        seg.style.strokeDasharray  = `${L}`;
        seg.style.strokeDashoffset = `${L}`;
        if (glow) { glow.style.strokeDasharray = `${L}`; glow.style.strokeDashoffset = `${L}`; }
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [mobileWaypoints]);

  // ── Mobile: IntersectionObserver — each card triggers its own dot ─────────
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    mobileCardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setMobileActive(prev => {
              if (prev[i]) return prev; // already active, skip
              const next = [...prev] as [boolean, boolean, boolean, boolean];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      obs.observe(card);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once — mobile cards are stable DOM nodes

  // ── Mobile: animate segments when mobileActive changes ───────────────────
  useEffect(() => {
    mobileSegRefs.current.forEach((seg, i) => {
      const glow = mobileSegGlowRefs.current[i];
      const L    = mobileSegLengths.current[i];
      if (!seg || !L) return;
      const show = mobileActive[i] && mobileActive[i + 1];
      seg.style.strokeDashoffset  = show ? "0" : `${L}`;
      if (glow) glow.style.strokeDashoffset = show ? "0" : `${L}`;
    });
  }, [mobileActive]);

  // ── Derived segment paths ─────────────────────────────────────────────────
  const segments = waypoints.length === 4
    ? [
        makeSegment(waypoints[0], waypoints[1]),
        makeSegment(waypoints[1], waypoints[2]),
        makeSegment(waypoints[2], waypoints[3]),
      ]
    : [];

  const mobileSegments = mobileWaypoints.length === 4
    ? [
        makeSegment(mobileWaypoints[0], mobileWaypoints[1]),
        makeSegment(mobileWaypoints[1], mobileWaypoints[2]),
        makeSegment(mobileWaypoints[2], mobileWaypoints[3]),
      ]
    : [];

  return (
    <section
      id="process"
      data-theme="light"
      style={{ backgroundColor: "var(--section-light)" }}
    >

      {/* ── DESKTOP (≥1024px): sticky scroll with zigzag ── */}
      <div
        ref={desktopScrollRef}
        className="hidden lg:block"
        style={{ height: "240vh", position: "relative" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 24px",
            overflow: "hidden",
          }}
        >
          <div className="max-w-6xl mx-auto w-full">

            <div style={{ marginBottom: 36 }}>
              <h2
                className="font-heading font-black"
                style={{ fontSize: "clamp(48px, 6vw, 72px)", letterSpacing: "-2px", lineHeight: 1, color: "var(--section-light-text)" }}
              >
                OUR PROCESS
              </h2>
            </div>

            <div
              ref={containerRef}
              className="relative"
              style={{ height: CONTAINER_H }}
            >
              {segments.length > 0 && (
                <svg
                  style={{ position: "absolute", top: 0, left: 0, width: svgDims.w, height: svgDims.h, overflow: "visible", pointerEvents: "none", zIndex: 1 }}
                >
                  <defs>
                    <filter id="d-lineGlow">
                      <feGaussianBlur stdDeviation="3" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="d-dotGlow">
                      <feGaussianBlur stdDeviation="5" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <style>{`
                    @keyframes dDotPulse {
                      0%   { r: 7;  opacity: 0.6; }
                      100% { r: 20; opacity: 0;   }
                    }
                    .d-dot-pulse { animation: dDotPulse 1.8s ease-out infinite; }
                  `}</style>

                  {segments.map((d, i) => (
                    <path key={`d-glow-${i}`} ref={el => { segGlowRefs.current[i] = el; }}
                      d={d} fill="none" stroke="#2563EB" strokeWidth="8" strokeLinecap="round"
                      opacity={0.18} filter="url(#d-lineGlow)"
                      style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)" }}
                    />
                  ))}
                  {segments.map((d, i) => (
                    <path key={`d-line-${i}`} ref={el => { segRefs.current[i] = el; }}
                      d={d} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)" }}
                    />
                  ))}
                  {waypoints.map((pt, i) => (
                    <g key={`d-dot-${i}`}>
                      <circle cx={pt.x} cy={pt.y} r={7} fill="none" stroke="#2563EB" strokeWidth="1.5"
                        opacity={active[i] ? 1 : 0}
                        className={active[i] ? "d-dot-pulse" : undefined}
                      />
                      <circle cx={pt.x} cy={pt.y} r={5} fill="#2563EB"
                        filter={active[i] ? "url(#d-dotGlow)" : undefined}
                        style={{
                          transformBox: "fill-box", transformOrigin: "center",
                          transform:  active[i] ? "scale(1)"  : "scale(0)",
                          opacity:    active[i] ? 1           : 0,
                          transition: "transform 500ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease",
                        }}
                      />
                    </g>
                  ))}
                </svg>
              )}

              {steps.map((s, i) => (
                <div
                  key={s.step}
                  style={{
                    position: "absolute",
                    top:   i * STEP,
                    left:  s.side === "left"  ? 0         : undefined,
                    right: s.side === "right" ? 0         : undefined,
                    width: "44%",
                    zIndex: 2,
                  }}
                >
                  <div
                    ref={el => { cardRefs.current[i] = el; }}
                    style={{
                      opacity:    revealed[i] ? 1 : 0,
                      transform:  revealed[i] ? "translateY(0)" : "translateY(18px)",
                      transition: "opacity 700ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)",
                      background: "var(--section-light-surface)",
                      border:     "1px solid var(--section-light-border)",
                      padding:    "20px 24px",
                    }}
                  >
                    <span className="font-heading font-black"
                      style={{ display: "block", fontSize: 38, lineHeight: 1, color: "var(--section-light-border)", marginBottom: 12, letterSpacing: "-2px" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading font-black"
                      style={{ fontSize: 17, color: "var(--section-light-text)", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 8 }}
                    >
                      <ScrambleText text={s.title} triggered={revealed[i]} />
                    </h3>
                    <p className="font-body"
                      style={{ fontSize: 13, color: "var(--section-light-muted)", lineHeight: 1.75 }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET (<1024px): single column with vertical line ── */}
      <div
        className="block lg:hidden"
        style={{ padding: "80px 24px" }}
      >
        <div className="max-w-2xl mx-auto">

          <div style={{ marginBottom: 48 }}>
            <h2
              className="font-heading font-black"
              style={{ fontSize: "clamp(36px, 8vw, 52px)", letterSpacing: "-1.5px", lineHeight: 1, color: "var(--section-light-text)" }}
            >
              OUR PROCESS
            </h2>
          </div>

          {/* Relative wrapper: SVG dot/line column lives here absolutely */}
          <div
            ref={mobileContainerRef}
            style={{ position: "relative", paddingLeft: 48 }}
          >
            {/* Vertical SVG line + dots */}
            {mobileSegments.length > 0 && (
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 48,
                  height: mobileSvgH,
                  overflow: "visible",
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <filter id="m-lineGlow">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="m-dotGlow">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <style>{`
                  @keyframes mDotPulse {
                    0%   { r: 7;  opacity: 0.6; }
                    100% { r: 18; opacity: 0;   }
                  }
                  .m-dot-pulse { animation: mDotPulse 1.8s ease-out infinite; }
                `}</style>

                {/* Glow halos */}
                {mobileSegments.map((d, i) => (
                  <path key={`m-glow-${i}`} ref={el => { mobileSegGlowRefs.current[i] = el; }}
                    d={d} fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round"
                    opacity={0.2} filter="url(#m-lineGlow)"
                    style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)" }}
                  />
                ))}
                {/* Draw lines */}
                {mobileSegments.map((d, i) => (
                  <path key={`m-line-${i}`} ref={el => { mobileSegRefs.current[i] = el; }}
                    d={d} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)" }}
                  />
                ))}
                {/* Dots */}
                {mobileWaypoints.map((pt, i) => (
                  <g key={`m-dot-${i}`}>
                    <circle cx={pt.x} cy={pt.y} r={7} fill="none" stroke="#2563EB" strokeWidth="1.5"
                      opacity={mobileActive[i] ? 1 : 0}
                      className={mobileActive[i] ? "m-dot-pulse" : undefined}
                    />
                    <circle cx={pt.x} cy={pt.y} r={5} fill="#2563EB"
                      filter={mobileActive[i] ? "url(#m-dotGlow)" : undefined}
                      style={{
                        transformBox: "fill-box", transformOrigin: "center",
                        transform:  mobileActive[i] ? "scale(1)"  : "scale(0)",
                        opacity:    mobileActive[i] ? 1           : 0,
                        transition: "transform 450ms cubic-bezier(0.16,1,0.3,1), opacity 350ms ease",
                      }}
                    />
                  </g>
                ))}
              </svg>
            )}

            {/* Stacked cards */}
            {steps.map((s, i) => (
              <div
                key={s.step}
                ref={el => { mobileCardRefs.current[i] = el; }}
                style={{ marginBottom: i < steps.length - 1 ? 32 : 0 }}
              >
                <div
                  style={{
                    background: "var(--section-light-surface)",
                    border:     "1px solid var(--section-light-border)",
                    padding:    "18px 20px",
                    opacity:    mobileActive[i] ? 1 : 0,
                    transform:  mobileActive[i] ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span className="font-heading font-black"
                    style={{ display: "block", fontSize: 28, lineHeight: 1, color: "var(--section-light-border)", marginBottom: 10, letterSpacing: "-1.5px" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading font-black"
                    style={{ fontSize: 16, color: "var(--section-light-text)", lineHeight: 1.25, letterSpacing: "-0.4px", marginBottom: 8 }}
                  >
                    <ScrambleText text={s.title} triggered={mobileActive[i]} />
                  </h3>
                  <p className="font-body"
                    style={{ fontSize: 13, color: "var(--section-light-muted)", lineHeight: 1.75 }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
