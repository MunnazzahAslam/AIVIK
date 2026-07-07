"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ─── puzzle geometry ─── */
const PW = 240;
const PH = 150;
const TR = 22;
const TK = TR * 0.5523;

type Edge = "S" | "T" | "B";

function makePiecePath(top: Edge, right: Edge, bottom: Edge, left: Edge): string {
  const W = PW, H = PH, r = TR, k = TK;
  let d = "M 0 0 ";
  if (top === "S") d += `L ${W} 0 `;
  else if (top === "T") d += `L ${W/2-r} 0 C ${W/2-r} ${-k},${W/2-k} ${-r},${W/2} ${-r} C ${W/2+k} ${-r},${W/2+r} ${-k},${W/2+r} 0 L ${W} 0 `;
  else               d += `L ${W/2-r} 0 C ${W/2-r} ${k},${W/2-k} ${r},${W/2} ${r} C ${W/2+k} ${r},${W/2+r} ${k},${W/2+r} 0 L ${W} 0 `;
  if (right === "S") d += `L ${W} ${H} `;
  else if (right === "T") d += `L ${W} ${H/2-r} C ${W+k} ${H/2-r},${W+r} ${H/2-k},${W+r} ${H/2} C ${W+r} ${H/2+k},${W+k} ${H/2+r},${W} ${H/2+r} L ${W} ${H} `;
  else                    d += `L ${W} ${H/2-r} C ${W-k} ${H/2-r},${W-r} ${H/2-k},${W-r} ${H/2} C ${W-r} ${H/2+k},${W-k} ${H/2+r},${W} ${H/2+r} L ${W} ${H} `;
  if (bottom === "S") d += `L 0 ${H} `;
  else if (bottom === "T") d += `L ${W/2+r} ${H} C ${W/2+r} ${H+k},${W/2+k} ${H+r},${W/2} ${H+r} C ${W/2-k} ${H+r},${W/2-r} ${H+k},${W/2-r} ${H} L 0 ${H} `;
  else                     d += `L ${W/2+r} ${H} C ${W/2+r} ${H-k},${W/2+k} ${H-r},${W/2} ${H-r} C ${W/2-k} ${H-r},${W/2-r} ${H-k},${W/2-r} ${H} L 0 ${H} `;
  if (left === "S") d += `L 0 0 `;
  else if (left === "T") d += `L 0 ${H/2+r} C ${-k} ${H/2+r},${-r} ${H/2+k},${-r} ${H/2} C ${-r} ${H/2-k},${-k} ${H/2-r},0 ${H/2-r} L 0 0 `;
  else                   d += `L 0 ${H/2+r} C ${k} ${H/2+r},${r} ${H/2+k},${r} ${H/2} C ${r} ${H/2-k},${k} ${H/2-r},0 ${H/2-r} L 0 0 `;
  return d + "Z";
}

/* ─── data ─── */
const PIECES = [
  {
    n: "01", lines: ["Senior Engineers", "Only"],
    fullTitle: "Senior Engineers Only",
    desc: "No juniors learning on your project. Every person has shipped production systems at scale. You get engineers who have seen failure modes you haven't imagined yet — and built past them.",
    top: "S" as Edge, right: "T" as Edge, bottom: "T" as Edge, left: "S" as Edge, col: 0, row: 0,
  },
  {
    n: "02", lines: ["Germany", "Registered"],
    fullTitle: "Germany Registered",
    desc: "AIVIK is a registered German company. GDPR compliant by default, built for clients who need a trustworthy EU partner with proper legal standing and full accountability.",
    top: "S" as Edge, right: "S" as Edge, bottom: "T" as Edge, left: "B" as Edge, col: 1, row: 0,
  },
  {
    n: "03", lines: ["Fixed Price,", "Always"],
    fullTitle: "Fixed Price, Always",
    desc: "We agree on the scope and the number before we start. No open-ended retainers, no invoice surprises. What we quote is what you pay — full stop.",
    top: "B" as Edge, right: "T" as Edge, bottom: "T" as Edge, left: "S" as Edge, col: 0, row: 1,
  },
  {
    n: "04", lines: ["Full Stack", "Capability"],
    fullTitle: "Full Stack Capability",
    desc: "Frontend, backend, AI integration, hardware. One team handles the whole scope — no coordination overhead between separate agencies, no gaps between disciplines.",
    top: "B" as Edge, right: "S" as Edge, bottom: "T" as Edge, left: "B" as Edge, col: 1, row: 1,
  },
  {
    n: "05", lines: ["EU Timezone", "Aligned"],
    fullTitle: "EU Timezone Aligned",
    desc: "We overlap with European business hours without friction. Async by default, but present for standups, reviews, and critical decisions exactly when your team needs it.",
    top: "B" as Edge, right: "T" as Edge, bottom: "S" as Edge, left: "S" as Edge, col: 0, row: 2,
  },
  {
    n: "06", lines: ["Fast", "To Start"],
    fullTitle: "Fast To Start",
    desc: "Most projects kick off within one week of signing. No months of discovery phases before code gets written. We scope fast, align fast, and ship fast.",
    top: "B" as Edge, right: "S" as Edge, bottom: "S" as Edge, left: "B" as Edge, col: 1, row: 2,
  },
];

const PATHS = PIECES.map(p => makePiecePath(p.top, p.right, p.bottom, p.left));

/* ─── layout ─── */
const SVG_H = 540;

const SCATTERED: [number, number, number][] = [
  [-360, -168, -7],
  [+228, -162, +6],
  [-400,   -8, +5],
  [+250,   -3, -8],
  [-362, +158, -4],
  [+228, +163, +9],
];

const ASSEMBLED: [number, number, number][] = PIECES.map(p => [
  p.col * PW - PW,
  p.row * PH - 1.5 * PH,
  0,
]);

const ORIGINS: [number, number, number][] = [
  [-820, -168, -15],
  [+820, -162, +15],
  [-820,   -8, +12],
  [+820,   -3, -12],
  [-820, +158, -10],
  [+820, +163, +14],
];

/* ─── timing ─── */
const APPEAR_AT   = [0.00, 0.10, 0.20, 0.30, 0.40, 0.50] as const;
const APPEAR_DUR  = 0.10;
const ASSEMBLE_AT = 0.70;
const ASSEMBLE_DUR = 0.15;
const TEXT_AT     = 0.87;

/* ─── helpers ─── */
const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp   = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO  = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

/* ─── component ─── */
export default function WhyAivikPuzzle() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cW, setCW]                 = useState(0);
  const [progress, setProgress]     = useState(0);
  const [hovered, setHovered]       = useState<number | null>(null);
  const [displayIdx, setDisplayIdx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current) setCW(containerRef.current.getBoundingClientRect().width);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      const sH   = section.offsetHeight;
      setProgress(clamp((winH * 0.55 - rect.top) / (sH - winH * 0.45), 0, 1));
    };
    window.addEventListener("scroll", tick, { passive: true });
    tick();
    return () => window.removeEventListener("scroll", tick);
  }, []);

  useEffect(() => {
    if (hovered !== null) setDisplayIdx(hovered);
  }, [hovered]);

  const cx = cW / 2;
  const cy = SVG_H / 2;
  const ta = easeIO(clamp((progress - ASSEMBLE_AT) / ASSEMBLE_DUR, 0, 1));
  const textOpacity = easeOut(clamp((progress - TEXT_AT) / 0.13, 0, 1));
  const isAssembled = ta > 0.92;

  const transforms = PIECES.map((_, i) => {
    const [ox, oy, or_] = ORIGINS[i];
    const [sx, sy, sr]  = SCATTERED[i];
    const [ax, ay]      = ASSEMBLED[i];
    const t1 = easeOut(clamp((progress - APPEAR_AT[i]) / APPEAR_DUR, 0, 1));
    return {
      x:   lerp(lerp(ox, sx, t1), ax, ta) + cx,
      y:   lerp(lerp(oy, sy, t1), ay, ta) + cy,
      rot: lerp(lerp(or_, sr, t1), 0,  ta),
      opacity: t1,
      show: t1 > 0.01,
    };
  });

  /* border transitions: subtle light grey → cyan on lock */
  const lockStroke  = ta > 0.85 ? "#00B4D8" : "#263858";
  const lockWidth   = ta > 0.85 ? 1.5 : 1;

  const panelVisible = hovered !== null && isAssembled;
  const piece        = displayIdx !== null ? PIECES[displayIdx] : null;

  return (
    <section
      ref={sectionRef}
      className="relative md:h-[580vh]"
      style={{ backgroundColor: "var(--section-dark)", borderTop: "1px solid var(--section-dark-border)" }}
    >
      <style>{`
        @keyframes pz-panel-in {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pz-num-in {
          from { opacity: 0; transform: translateY(6px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pz-line-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pz-text-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden flex flex-col justify-center px-6 py-16 md:py-0">
        <div ref={containerRef} className="max-w-6xl mx-auto w-full">

          {/* label */}
          <div style={{ marginBottom: 20 }}>
            <span
              className="block text-[10px] font-semibold tracking-[0.28em] uppercase mb-3"
              style={{ color: "var(--section-dark-subtle)" }}
            >
              Reference — Puzzle variant
            </span>
            <h2
              className="font-heading font-black"
              style={{ fontSize: "clamp(28px, 3.5vw, 46px)", letterSpacing: "-1.5px", lineHeight: 1, color: "var(--section-dark-text)" }}
            >
              WHY COMPANIES CHOOSE US
            </h2>
          </div>

          {/* ── desktop: SVG puzzle + hover panel ── */}
          {cW > 0 && (
            <div className="hidden md:block" style={{ position: "relative", height: SVG_H }}>

              <svg
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: cW, height: SVG_H,
                  overflow: "visible",
                }}
              >
                <defs>
                  <filter id="pz-hover-glow" x="-35%" y="-35%" width="170%" height="170%">
                    <feGaussianBlur stdDeviation="7" result="b" />
                    <feColorMatrix type="matrix"
                      values="0 0 0 0 0  0 0 0 0 0.71  0 0 0 0 0.85  0 0 0 1.1 0"
                      in="b" result="c" />
                    <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="pz-lock-glow" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feColorMatrix type="matrix"
                      values="0 0 0 0 0  0 0 0 0 0.71  0 0 0 0 0.85  0 0 0 0.8 0"
                      in="b" result="c" />
                    <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {PIECES.map((pz, i) => {
                  const { x, y, rot, opacity, show } = transforms[i];
                  if (!show) return null;

                  const isHov    = isAssembled && hovered === i;
                  const isDimmed = isAssembled && hovered !== null && hovered !== i;
                  const fill     = isHov ? "#243A60" : "#1C3050";
                  const stroke   = isHov ? "#00E4FF" : lockStroke;
                  const strokeW  = isHov ? 2 : lockWidth;
                  const filter   = isHov
                    ? "url(#pz-hover-glow)"
                    : ta > 0.85 ? "url(#pz-lock-glow)" : undefined;

                  return (
                    <g
                      key={i}
                      transform={`translate(${x},${y}) rotate(${rot},${PW/2},${PH/2})`}
                      style={{
                        opacity: isDimmed ? 0.35 : opacity,
                        cursor: isAssembled ? "pointer" : "default",
                        transition: "opacity 0.3s ease",
                      }}
                      onMouseEnter={() => { if (isAssembled) setHovered(i); }}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* deep shadow — makes pieces feel lifted off dark bg */}
                      <path
                        d={PATHS[i]}
                        fill="rgba(0,0,0,0.55)"
                        transform={`translate(${lerp(6, 3, ta)},${lerp(8, 4, ta)})`}
                        style={{ filter: "blur(4px)" }}
                      />

                      {/* inner group — scale on hover */}
                      <g style={{
                        transformOrigin: `${PW/2}px ${PH/2}px`,
                        transform: isHov ? "scale(1.04)" : "scale(1)",
                        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                      }}>

                        {/* piece body */}
                        <path
                          d={PATHS[i]}
                          style={{
                            fill,
                            stroke,
                            strokeWidth: strokeW,
                            filter,
                            transition: "fill 0.3s, stroke 0.4s, stroke-width 0.4s",
                          }}
                        />

                        {/* ghost number — large watermark bottom-right */}
                        <text
                          x={PW - 12} y={PH - 10}
                          textAnchor="end"
                          style={{
                            fill: "#253D65",
                            fontSize: 54,
                            fontFamily: "var(--font-space-grotesk), sans-serif",
                            fontWeight: 900,
                            letterSpacing: "-3px",
                            pointerEvents: "none",
                          } as React.CSSProperties}
                        >
                          {pz.n}
                        </text>

                        {/* number label — small, top-left */}
                        <text
                          x={14} y={20}
                          style={{
                            fill: "#7A9BBC",
                            fontSize: 9,
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontWeight: 600,
                            letterSpacing: "2.5px",
                            pointerEvents: "none",
                          } as React.CSSProperties}
                        >
                          {pz.n}
                        </text>

                        {/* title — uppercase, white, centered */}
                        <text
                          textAnchor="middle"
                          style={{
                            fill: "#FFFFFF",
                            fontSize: 18,
                            fontFamily: "var(--font-space-grotesk), sans-serif",
                            fontWeight: 900,
                            letterSpacing: "-0.4px",
                            pointerEvents: "none",
                          } as React.CSSProperties}
                        >
                          <tspan x={PW/2} y={PH/2 - 10}>{pz.lines[0].toUpperCase()}</tspan>
                          <tspan x={PW/2} dy={24}>{pz.lines[1].toUpperCase()}</tspan>
                        </text>

                      </g>
                    </g>
                  );
                })}

              </svg>

              {/* ── tagline ── */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: cy + 234,
                  textAlign: "center",
                  pointerEvents: "none",
                  opacity: textOpacity,
                  transform: `translateY(${(1 - textOpacity) * 12}px)`,
                }}
              >
                {/* accent line draws in from center */}
                <div style={{
                  width: 48,
                  height: 1,
                  background: "#00B4D8",
                  margin: "0 auto 14px",
                  transformOrigin: "center",
                  transform: `scaleX(${textOpacity})`,
                  opacity: 0.7,
                }} />
                <p
                  className="font-heading"
                  style={{
                    margin: 0,
                    fontSize: "clamp(22px, 2.4vw, 32px)",
                    fontWeight: 900,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>We put the </span>
                  <span style={{ color: "#00B4D8" }}>pieces together.</span>
                </p>
              </div>

              {/* ── hover detail panel ── */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: `translateY(-50%) translateX(${panelVisible ? 0 : 18}px)`,
                  width: "min(300px, 36%)",
                  opacity: panelVisible ? 1 : 0,
                  transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  pointerEvents: panelVisible ? "auto" : "none",
                  zIndex: 10,
                }}
              >
                {piece && (
                  <div
                    key={displayIdx ?? -1}
                    style={{
                      background: "rgba(8,14,26,0.95)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid #1A2B40",
                      borderLeft: "2px solid #00B4D8",
                      padding: "28px 24px",
                      animation: "pz-panel-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
                    }}
                  >
                    <div style={{
                      fontSize: 72,
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontWeight: 900,
                      letterSpacing: "-4px",
                      lineHeight: 1,
                      color: "#1C3050",
                      marginBottom: 14,
                      animation: "pz-num-in 0.5s 0.04s cubic-bezier(0.16,1,0.3,1) both",
                    }}>
                      {piece.n}
                    </div>

                    <div style={{
                      height: 2,
                      width: 40,
                      background: "#00B4D8",
                      marginBottom: 16,
                      transformOrigin: "left",
                      animation: "pz-line-draw 0.45s 0.1s cubic-bezier(0.16,1,0.3,1) both",
                    }} />

                    <h3 style={{
                      fontSize: 20,
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontWeight: 900,
                      letterSpacing: "-0.6px",
                      lineHeight: 1.2,
                      color: "white",
                      marginBottom: 14,
                      animation: "pz-text-in 0.5s 0.12s cubic-bezier(0.16,1,0.3,1) both",
                    }}>
                      {piece.fullTitle}
                    </h3>

                    <p style={{
                      fontSize: 13,
                      color: "var(--section-dark-muted)",
                      lineHeight: 1.75,
                      animation: "pz-text-in 0.5s 0.22s cubic-bezier(0.16,1,0.3,1) both",
                    }}>
                      {piece.desc}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── mobile: static assembled + descriptions ── */}
          <div className="block md:hidden">
            <svg
              viewBox={`${-TR} ${-TR} ${PW * 2 + TR * 2} ${PH * 3 + TR * 2}`}
              style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "block" }}
            >
              {PIECES.map((pz, i) => (
                <g key={i} transform={`translate(${pz.col * PW},${pz.row * PH})`}>
                  <path d={PATHS[i]} style={{ fill: "#1C3050", stroke: "#263858", strokeWidth: 1 }} />
                  <text x={12} y={18}
                    style={{ fill: "#7A9BBC", fontSize: 8, fontFamily: "monospace", fontWeight: 600, letterSpacing: "2px" } as React.CSSProperties}>
                    {pz.n}
                  </text>
                  <text textAnchor="middle"
                    style={{ fill: "#FFFFFF", fontSize: 15, fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 900, letterSpacing: "-0.3px" } as React.CSSProperties}>
                    <tspan x={PW/2} y={PH/2 - 8}>{pz.lines[0].toUpperCase()}</tspan>
                    <tspan x={PW/2} dy={20}>{pz.lines[1].toUpperCase()}</tspan>
                  </text>
                </g>
              ))}
            </svg>

            <p className="font-heading font-black text-center mt-5"
              style={{ fontSize: 17, color: "white", letterSpacing: "-0.5px" }}>
              We put the pieces together.
            </p>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              {PIECES.map(pz => (
                <div key={pz.n} style={{ borderLeft: "2px solid #00B4D8", paddingLeft: 16 }}>
                  <span style={{
                    display: "block", fontSize: 9, color: "#00B4D8",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontWeight: 700, letterSpacing: "2px", marginBottom: 4,
                  }}>
                    {pz.n}
                  </span>
                  <h3 style={{
                    fontSize: 14, fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 900, color: "white", letterSpacing: "-0.3px", marginBottom: 5,
                  }}>
                    {pz.fullTitle}
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--section-dark-muted)", lineHeight: 1.7 }}>
                    {pz.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
