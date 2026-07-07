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

const THRESHOLDS = [0.12, 0.35, 0.58, 0.80];

/* step=110px so same-side cards (0→2, 1→3) clear each other's ~200px height */
const STEP = 110;
const CONTAINER_H = STEP * 3 + 220; /* ~550px */

/* Mobile cards are narrower (70% width) so text wraps taller — bigger step needed */
const MOBILE_STEP = 190;
const MOBILE_CONTAINER_H = MOBILE_STEP * 3 + 260; /* ~830px */

function makePath(pts: { x: number; y: number }[], W: number, _H: number): string {
  if (!pts.length) return "";
  const cx = W / 2;
  let d = `M ${cx} 0`;
  d += ` C ${cx} ${pts[0].y * 0.45}, ${pts[0].x} ${pts[0].y * 0.55}, ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const mid = (a.y + b.y) / 2;
    d += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
  }
  return d;
}

export default function Process() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef      = useRef<SVGPathElement>(null);
  const glowRef      = useRef<SVGPathElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  const [pathD,     setPathD]     = useState("");
  const [waypoints, setWaypoints] = useState<{ x: number; y: number }[]>([]);
  const [svgDims,   setSvgDims]   = useState({ w: 1000, h: CONTAINER_H });
  const [revealed,  setRevealed]  = useState([false, false, false, false]);
  const [active,    setActive]    = useState([false, false, false, false]);

  const [mobilePathD,     setMobilePathD]     = useState("");
  const [mobileWaypoints, setMobileWaypoints] = useState<{ x: number; y: number }[]>([]);
  const [mobileSvgDims,   setMobileSvgDims]   = useState({ w: 400, h: MOBILE_CONTAINER_H });

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (container && !cardRefs.current.some(c => !c)) {
        const cr = container.getBoundingClientRect();
        setSvgDims({ w: cr.width, h: cr.height });
        const pts = cardRefs.current.map((card, i) => {
          const r = card!.getBoundingClientRect();
          const y = r.top - cr.top + r.height / 2;
          const x = steps[i].side === "left"
            ? r.right - cr.left + 12
            : r.left  - cr.left - 12;
          return { x, y };
        });
        setWaypoints(pts);
        setPathD(makePath(pts, cr.width, cr.height));
      }

      const mContainer = mobileContainerRef.current;
      if (mContainer && !mobileCardRefs.current.some(c => !c)) {
        const cr = mContainer.getBoundingClientRect();
        setMobileSvgDims({ w: cr.width, h: cr.height });
        const pts = mobileCardRefs.current.map((card, i) => {
          const r = card!.getBoundingClientRect();
          const y = r.top - cr.top + r.height / 2;
          const x = steps[i].side === "left"
            ? r.right - cr.left + 10
            : r.left  - cr.left - 10;
          return { x, y };
        });
        setMobileWaypoints(pts);
        setMobilePathD(makePath(pts, cr.width, cr.height));
      }
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !pathD) return;
    const frame = requestAnimationFrame(() => {
      const path = pathRef.current;
      const glow = glowRef.current;
      if (!path) return;
      const L = path.getTotalLength();
      path.style.strokeDasharray  = `${L}`;
      path.style.strokeDashoffset = `${L}`;
      if (glow) { glow.style.strokeDasharray = `${L}`; glow.style.strokeDashoffset = `${L}`; }

      const tick = () => {
        const rect = section.getBoundingClientRect();
        const winH = window.innerHeight;
        const sH   = section.offsetHeight;
        const raw  = (winH * 0.55 - rect.top) / (sH - winH * 0.45);
        const p    = Math.max(0, Math.min(1, raw));
        // Draw completes exactly when last card is revealed (THRESHOLDS[3])
        const pDraw = Math.min(p / THRESHOLDS[3], 1);
        path.style.strokeDashoffset = `${L * (1 - pDraw)}`;
        if (glow) glow.style.strokeDashoffset = `${L * (1 - pDraw)}`;
        setRevealed(THRESHOLDS.map(t => p >= t));
        setActive  (THRESHOLDS.map(t => p >= t));
      };

      window.addEventListener("scroll", tick, { passive: true });
      tick();
      (section as any)._cleanup = () => window.removeEventListener("scroll", tick);
    });
    return () => { cancelAnimationFrame(frame); (section as any)._cleanup?.(); };
  }, [pathD]);

  return (
    <section
      id="process"
      ref={sectionRef}
      data-theme="light"
      className="relative md:h-[380vh]"
      style={{ backgroundColor: "var(--section-light)" }}
    >
      <div
        className="md:sticky md:top-0 md:h-screen md:overflow-hidden flex flex-col justify-center px-6 py-20 md:py-0"
      >
        <div className="max-w-6xl mx-auto w-full">

          <div style={{ marginBottom: 36 }}>
            <h2
              className="font-heading font-black"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-2px", lineHeight: 1, color: "var(--section-light-text)" }}
            >
              OUR PROCESS
            </h2>
          </div>

          {/* ── Desktop: staircase + SVG path ── */}
          <div
            ref={containerRef}
            className="relative hidden md:block"
            style={{ height: CONTAINER_H }}
          >
            {pathD && (
              <svg
                style={{ position: "absolute", top: 0, left: 0, width: svgDims.w, height: svgDims.h, overflow: "visible", pointerEvents: "none", zIndex: 1 }}
              >
                <defs>
                  <linearGradient id="pg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <filter id="glow4">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow8">
                    <feGaussianBlur stdDeviation="9" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Glow halo */}
                <path ref={glowRef} d={pathD} fill="none" stroke="url(#pg)" strokeWidth="12" strokeLinecap="round" opacity={0.2} filter="url(#glow8)" />
                {/* Animated draw line */}
                <path ref={pathRef} d={pathD} fill="none" stroke="url(#pg)" strokeWidth="2" strokeLinecap="round" filter="url(#glow4)" />
                {/* Waypoint dots — invisible until active */}
                {waypoints.map((pt, i) => (
                  <g key={i} style={{ opacity: active[i] ? 1 : 0, transition: "opacity 600ms ease" }}>
                    <circle cx={pt.x} cy={pt.y} r={20} fill="none" stroke="#3B82F6" strokeWidth="1" opacity={0.15} />
                    <circle cx={pt.x} cy={pt.y} r={10} fill="none" stroke="#60A5FA" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.y} r={5} fill="#2563EB" filter="url(#glow4)" />
                  </g>
                ))}
              </svg>
            )}

            {/* Staircase — each card steps 110px lower */}
            {steps.map((s, i) => (
              <div
                key={s.step}
                style={{
                  position: "absolute",
                  top: i * STEP,
                  left:  s.side === "left"  ? 0         : undefined,
                  right: s.side === "right" ? 0         : undefined,
                  width: "44%",
                  zIndex: 2,
                  backgroundColor: "var(--section-light)",
                }}
              >
                <div
                  ref={el => { cardRefs.current[i] = el; }}
                  style={{
                    opacity:   revealed[i] ? 1 : 0,
                    transform: revealed[i] ? "translateY(0)" : "translateY(18px)",
                    transition: "opacity 700ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)",
                    background: "#EEF2F7",
                    border: "1px solid #CBD5E1",
                    padding: "20px 24px",
                  }}
                >
                  <span
                    className="font-heading font-black"
                    style={{ display: "block", fontSize: 38, lineHeight: 1, color: "#B8C7D9", marginBottom: 12, letterSpacing: "-2px" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-heading font-black"
                    style={{ fontSize: 17, color: "var(--section-light-text)", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 8 }}
                  >
                    <ScrambleText text={s.title} triggered={revealed[i]} />
                  </h3>
                  <p className="font-body" style={{ fontSize: 13, color: "#64748B", lineHeight: 1.75 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Mobile: same staircase + path, fully visible immediately (no scroll reveal) ── */}
          <div
            ref={mobileContainerRef}
            className="relative block md:hidden"
            style={{ height: MOBILE_CONTAINER_H }}
          >
            {mobilePathD && (
              <svg
                style={{ position: "absolute", top: 0, left: 0, width: mobileSvgDims.w, height: mobileSvgDims.h, overflow: "visible", pointerEvents: "none", zIndex: 1 }}
              >
                <defs>
                  <filter id="glow4m">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow8m">
                    <feGaussianBlur stdDeviation="7" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* Glow halo — blue, fully drawn */}
                <path d={mobilePathD} fill="none" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round" opacity={0.18} filter="url(#glow8m)" />
                {/* Main line — blue */}
                <path d={mobilePathD} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" filter="url(#glow4m)" />
                {/* Waypoint dots — blue, final active state */}
                {mobileWaypoints.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r={14} fill="none" stroke="#3B82F6" strokeWidth="1" opacity={0.15} />
                    <circle cx={pt.x} cy={pt.y} r={7} fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.y} r={3.5} fill="#2563EB" filter="url(#glow4m)" />
                  </g>
                ))}
              </svg>
            )}

            {/* Staircase — same step pattern as desktop, fully visible */}
            {steps.map((s, i) => (
              <div
                key={s.step}
                style={{
                  position: "absolute",
                  top: i * MOBILE_STEP,
                  left:  s.side === "left"  ? 0 : undefined,
                  right: s.side === "right" ? 0 : undefined,
                  width: "70%",
                  zIndex: 2,
                }}
              >
                <div
                  ref={el => { mobileCardRefs.current[i] = el; }}
                  style={{
                    background: "#EEF2F7",
                    border: "1px solid #CBD5E1",
                    padding: "18px 20px",
                  }}
                >
                  <span
                    className="font-heading font-black"
                    style={{ display: "block", fontSize: 32, lineHeight: 1, color: "#B8C7D9", marginBottom: 12, letterSpacing: "-2px" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-heading font-black"
                    style={{ fontSize: 16, color: "var(--section-light-text)", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 8 }}
                  >
                    {s.title}
                  </h3>
                  <p className="font-body" style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.7 }}>
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
