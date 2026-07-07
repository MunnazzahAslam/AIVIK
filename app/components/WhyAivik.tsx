"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ─── wave geometry ─── */
const BASELINE  = 88;   // y of the flat signal line
const PEAK      = 18;   // y of each spike tip
const RISE_W    = 36;   // px run of the rising edge
const FALL_W    = 62;   // px run of the falling edge (asymmetric = more organic)
const SVG_H     = 120;  // wave canvas height
const CONN_Y2   = SVG_H + 28; // connector bottom (extends below SVG via overflow:visible)

/* fraction of total animation duration when each peak is reached —
   computed analytically for 6 evenly-spaced spikes with RISE_W/FALL_W geometry */
const PEAK_T = [0.09, 0.25, 0.42, 0.59, 0.75, 0.92] as const;
const ANIM_MS = 2800;

/* ─── build the horizontal EKG path ─── */
function makeWave(W: number): string {
  if (W <= 0) return "";
  const slot = W / 6;
  let d = `M 0 ${BASELINE}`;
  for (let i = 0; i < 6; i++) {
    const cx = (i + 0.5) * slot;
    d += ` L ${cx - RISE_W} ${BASELINE}`;   // flat approach
    d += ` L ${cx}          ${PEAK}`;        // sharp rise  ↑
    d += ` L ${cx + FALL_W} ${BASELINE}`;   // asymmetric fall  ↘
  }
  d += ` L ${W} ${BASELINE}`;               // trailing flat
  return d;
}

/* ─── data ─── */
const reasons = [
  {
    n: "01",
    title: "Senior engineers only",
    desc: "No juniors learning on your project. Every person has shipped production systems at scale.",
  },
  {
    n: "02",
    title: "Germany registered",
    desc: "GDPR compliant by default, built for clients who need a trustworthy EU partner.",
  },
  {
    n: "03",
    title: "Fixed price, always",
    desc: "Scope and cost agreed before we start. No retainers, no invoice surprises.",
  },
  {
    n: "04",
    title: "Full stack capability",
    desc: "Frontend, backend, AI, hardware. One team — no coordination overhead.",
  },
  {
    n: "05",
    title: "EU timezone aligned",
    desc: "We overlap with European hours. Async by default, present when it matters.",
  },
  {
    n: "06",
    title: "Fast to start",
    desc: "Most projects kick off within one week of signing. No months of discovery.",
  },
];

export default function WhyAivik() {
  const sectionRef   = useRef<HTMLElement>(null);
  const waveAreaRef  = useRef<HTMLDivElement>(null);
  const pathRef      = useRef<SVGPathElement>(null);
  const glowRef      = useRef<SVGPathElement>(null);

  const [containerW, setContainerW] = useState(0);
  const [wavePath,   setWavePath]   = useState("");
  const [visible,    setVisible]    = useState(false);
  const [revealed,   setRevealed]   = useState(Array(6).fill(false) as boolean[]);
  const animStarted  = useRef(false);

  /* measure container width → recompute path on resize */
  useLayoutEffect(() => {
    const measure = () => {
      const el = waveAreaRef.current;
      if (!el) return;
      const W = el.getBoundingClientRect().width;
      setContainerW(W);
      setWavePath(makeWave(W));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (waveAreaRef.current) ro.observe(waveAreaRef.current);
    return () => ro.disconnect();
  }, []);

  /* trigger on intersection */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* auto-play wave draw when visible */
  useEffect(() => {
    if (!visible || !wavePath || animStarted.current) return;
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!path) return;

    animStarted.current = true;

    // set up stroke-dasharray after one frame so path length is computed
    requestAnimationFrame(() => {
      const L = path.getTotalLength();
      path.style.strokeDasharray  = `${L}`;
      path.style.strokeDashoffset = `${L}`;
      if (glow) { glow.style.strokeDasharray = `${L}`; glow.style.strokeDashoffset = `${L}`; }

      let start: number | null = null;

      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min((now - start) / ANIM_MS, 1);

        const off = L * (1 - p);
        path.style.strokeDashoffset = `${off}`;
        if (glow) glow.style.strokeDashoffset = `${off}`;

        setRevealed(PEAK_T.map(t => p >= t));

        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  }, [visible, wavePath]);

  const slot = containerW / 6;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "var(--section-dark)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── header ── */}
        <div className="mb-12">
          <span
            className="block text-[10px] font-semibold tracking-[0.28em] uppercase mb-5"
            style={{ color: "var(--accent-primary)" }}
          >
            Why AIVIK
          </span>
          <h2
            className="font-heading font-black"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-2px",
              lineHeight: 1,
              color: "var(--section-dark-text)",
            }}
          >
            WHY COMPANIES<br />CHOOSE US
          </h2>
        </div>

        {/* ── desktop: horizontal wave + card grid ── */}
        <div ref={waveAreaRef} className="hidden md:block">

          {/* SVG wave */}
          <div style={{ position: "relative", height: SVG_H }}>
            {wavePath && (
              <svg
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: containerW, height: SVG_H,
                  overflow: "visible", pointerEvents: "none",
                }}
              >
                <defs>
                  <filter id="ekg-glow4">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="ekg-glow12">
                    <feGaussianBlur stdDeviation="12" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* glow halo behind the wave */}
                <path
                  ref={glowRef}
                  d={wavePath}
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth={18}
                  strokeLinecap="butt"
                  opacity={0.12}
                  filter="url(#ekg-glow12)"
                />

                {/* main signal trace */}
                <path
                  ref={pathRef}
                  d={wavePath}
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth={2}
                  strokeLinecap="square"
                  filter="url(#ekg-glow4)"
                />

                {/* per-spike: peak dot + vertical connector to card */}
                {slot > 0 && Array.from({ length: 6 }, (_, i) => {
                  const cx = (i + 0.5) * slot;
                  return (
                    <g key={i} style={{ opacity: revealed[i] ? 1 : 0, transition: "opacity 350ms ease" }}>
                      {/* peak glow ring */}
                      <circle cx={cx} cy={PEAK} r={10} fill="none" stroke="#00B4D8" strokeWidth={1} opacity={0.2} />
                      {/* peak dot */}
                      <circle cx={cx} cy={PEAK} r={3.5} fill="#00B4D8" filter="url(#ekg-glow4)" />
                      {/* connector — dashed vertical, extends into card area */}
                      <line
                        x1={cx} y1={PEAK + 7}
                        x2={cx} y2={CONN_Y2}
                        stroke="#00B4D8"
                        strokeWidth={1}
                        strokeDasharray="3 5"
                        opacity={0.35}
                      />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* cards grid — directly below wave, no absolute positioning */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0 10px",
              marginTop: 28,
            }}
          >
            {reasons.map((r, i) => (
              <div
                key={r.n}
                style={{
                  opacity:    revealed[i] ? 1 : 0,
                  transform:  revealed[i] ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <div
                  style={{
                    background: "var(--section-dark-surface)",
                    border: "1px solid var(--section-dark-border)",
                    padding: "16px 14px",
                    height: "100%",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      display: "block",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "var(--accent-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {r.n}
                  </span>
                  <h3
                    className="font-heading font-black"
                    style={{
                      fontSize: 13,
                      color: "var(--section-dark-text)",
                      lineHeight: 1.3,
                      letterSpacing: "-0.3px",
                      marginBottom: 8,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "var(--section-dark-muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── mobile: vertical stack ── */}
        <div className="block md:hidden space-y-4">
          {reasons.map((r, i) => (
            <div
              key={r.n}
              style={{
                background: "var(--section-dark-surface)",
                border: "1px solid var(--section-dark-border)",
                padding: "20px",
              }}
            >
              <span
                className="font-mono"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--accent-primary)",
                  marginBottom: 10,
                }}
              >
                {r.n}
              </span>
              <h3
                className="font-heading font-black"
                style={{
                  fontSize: 15,
                  color: "var(--section-dark-text)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.3px",
                  marginBottom: 8,
                }}
              >
                {r.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--section-dark-muted)", lineHeight: 1.7 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
