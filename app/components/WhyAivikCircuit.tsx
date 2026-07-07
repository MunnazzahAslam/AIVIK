"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ─── brand tokens — matched to the site's existing dark-section palette ─── */
const CYAN    = "#00B4D8"; // var(--accent-primary)
const GRAY    = "#8499B8"; // var(--section-dark-muted)
const WHITE   = "#FFFFFF"; // var(--section-dark-text)
const SURFACE = "#080E1A"; // var(--section-dark-surface)
const BORDER  = "#121D30"; // var(--section-dark-border)

/* ─── trace geometry (fixed viewBox coordinate space — independent of rendered size) ─── */
const VB_W_D = 1200, VB_H_D = 320;
const VB_W_M = 320,  VB_H_M = 1200;

const PATH_D = "M 30,235 C 210,235 250,105 430,105 C 610,105 650,275 830,275 C 970,275 1010,165 1170,165";
const PATH_M = "M 90,40 C 90,230 40,270 40,450 C 40,630 140,670 140,850 C 140,990 70,1030 70,1170";

const NODE_FRACTIONS = [0.18, 0.5, 0.82];
const TAIL_FRACTION = 0.1;
const HOLD_WINDOW = 0.02;

const STAGES = [
  {
    eyebrow: "WE GO DEEP",
    title: "We embed, not observe",
    body: "Our engineers sit inside your codebase and your team. No handoff decks, no black box — just people building alongside you.",
  },
  {
    eyebrow: "WE SHIP IN THE OPEN",
    title: "We build in public, to you",
    body: "Every sprint ends in something running, not a slide. You see the system take shape in real time, not at the reveal.",
  },
  {
    eyebrow: "WE STAY ACCOUNTABLE",
    title: "We stay past launch",
    body: "Outcomes compound. We're still watching the dashboards, still on call, long after the contract says we don't have to be.",
  },
] as const;

const DESKTOP_ANCHOR: Array<{ left: string; align: "left" | "center" | "right" }> = [
  { left: "-4%", align: "left" },
  { left: "-50%", align: "center" },
  { left: "-96%", align: "right" },
];

type NodeState = "future" | "active" | "passed";
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function WhyAivikCircuit() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const dPathRef = useRef<SVGPathElement>(null);
  const dTailRef = useRef<SVGPathElement>(null);
  const dGlowRef = useRef<SVGPathElement>(null);
  const dPulseRef = useRef<SVGGElement>(null);
  const dPulseCoreRef = useRef<SVGCircleElement>(null);
  const dGradRef = useRef<SVGLinearGradientElement>(null);
  const dNodeRefs = useRef<Array<SVGGElement | null>>([null, null, null]);
  const dRippleRefs = useRef<Array<SVGCircleElement | null>>([null, null, null]);
  const dContentRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);

  const mPathRef = useRef<SVGPathElement>(null);
  const mTailRef = useRef<SVGPathElement>(null);
  const mGlowRef = useRef<SVGPathElement>(null);
  const mPulseRef = useRef<SVGGElement>(null);
  const mPulseCoreRef = useRef<SVGCircleElement>(null);
  const mGradRef = useRef<SVGLinearGradientElement>(null);
  const mNodeRefs = useRef<Array<SVGGElement | null>>([null, null, null]);
  const mRippleRefs = useRef<Array<SVGCircleElement | null>>([null, null, null]);
  const mContentRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);

  const dLenRef = useRef(0);
  const mLenRef = useRef(0);
  const stateRef = useRef<NodeState[]>(["future", "future", "future"]);
  const lastProgressRef = useRef(0);

  /* compute node positions once — viewBox coords are size-independent */
  useLayoutEffect(() => {
    if (dPathRef.current) {
      dLenRef.current = dPathRef.current.getTotalLength();
      NODE_FRACTIONS.forEach((f, i) => {
        const p = dPathRef.current!.getPointAtLength(f * dLenRef.current);
        dNodeRefs.current[i]?.setAttribute("transform", `translate(${p.x} ${p.y})`);
        const el = dContentRefs.current[i];
        if (el) {
          el.style.left = `${(p.x / VB_W_D) * 100}%`;
          el.style.top = `${(p.y / VB_H_D) * 100}%`;
        }
      });
    }
    if (mPathRef.current) {
      mLenRef.current = mPathRef.current.getTotalLength();
      NODE_FRACTIONS.forEach((f, i) => {
        const p = mPathRef.current!.getPointAtLength(f * mLenRef.current);
        mNodeRefs.current[i]?.setAttribute("transform", `translate(${p.x} ${p.y})`);
        const el = mContentRefs.current[i];
        if (el) {
          el.style.left = `calc(${(p.x / VB_W_M) * 100}% + 30px)`;
          el.style.top = `${(p.y / VB_H_M) * 100}%`;
        }
      });
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const updateTrack = (
      progress: number,
      path: SVGPathElement | null,
      totalLen: number,
      tail: SVGPathElement | null,
      glow: SVGPathElement | null,
      pulse: SVGGElement | null,
      pulseCore: SVGCircleElement | null,
      grad: SVGLinearGradientElement | null,
      nodes: Array<SVGGElement | null>,
      ripples: Array<SVGCircleElement | null>,
      contents: Array<HTMLDivElement | null>,
      speed: number
    ) => {
      if (!path || !totalLen) return;
      const currentLen = progress * totalLen;
      const pt = path.getPointAtLength(currentLen);

      /* hold/brighten near a node arrival */
      const nearestDist = Math.min(...NODE_FRACTIONS.map((f) => Math.abs(progress - f)));
      const holdBoost = nearestDist < HOLD_WINDOW ? 1 + ((HOLD_WINDOW - nearestDist) / HOLD_WINDOW) * 0.7 : 1;

      if (pulse) pulse.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      if (pulseCore) {
        pulseCore.setAttribute("r", String(5 * holdBoost));
        pulseCore.style.filter = `blur(${clamp(speed * 3, 0, 2.4)}px)`;
      }

      /* dim persistent "already powered" glow — reveal from start to current point */
      if (glow) {
        glow.style.strokeDasharray = `${totalLen}`;
        glow.style.strokeDashoffset = `${totalLen - currentLen}`;
      }

      /* hot fading tail behind the pulse */
      const tailLen = totalLen * TAIL_FRACTION;
      if (tail) {
        tail.style.strokeDasharray = `${tailLen} ${totalLen}`;
        tail.style.strokeDashoffset = `${-currentLen}`;
        tail.style.strokeWidth = String(3 + clamp(speed * 6, 0, 3));
      }
      if (grad) {
        const backPt = path.getPointAtLength(Math.max(currentLen - tailLen, 0));
        grad.setAttribute("x1", String(pt.x));
        grad.setAttribute("y1", String(pt.y));
        grad.setAttribute("x2", String(backPt.x));
        grad.setAttribute("y2", String(backPt.y));
      }

      /* node + content state */
      const revealed = NODE_FRACTIONS.map((f) => progress >= f);
      let lastRevealed = -1;
      revealed.forEach((r, i) => { if (r) lastRevealed = i; });

      NODE_FRACTIONS.forEach((_, i) => {
        const next: NodeState = !revealed[i] ? "future" : i === lastRevealed ? "active" : "passed";
        const prev = stateRef.current[i];
        const node = nodes[i];
        const content = contents[i];

        if (node) node.dataset.state = next;
        if (content) content.classList.toggle("wac-content-visible", revealed[i]);

        if (prev !== "active" && next === "active") {
          const ripple = ripples[i];
          if (ripple) {
            gsap.fromTo(
              ripple,
              { attr: { r: 6 }, opacity: 0.55 },
              { attr: { r: 46 }, opacity: 0, duration: 0.9, ease: "power2.out" }
            );
          }
        }
        stateRef.current[i] = next;
      });
    };

    const ctx = gsap.context(() => {
      const applyProgress = (progress: number) => {
        const speed = Math.abs(progress - lastProgressRef.current) * 60;
        lastProgressRef.current = progress;

        updateTrack(
          progress, dPathRef.current, dLenRef.current, dTailRef.current, dGlowRef.current,
          dPulseRef.current, dPulseCoreRef.current, dGradRef.current,
          dNodeRefs.current, dRippleRefs.current, dContentRefs.current, speed
        );
        updateTrack(
          progress, mPathRef.current, mLenRef.current, mTailRef.current, mGlowRef.current,
          mPulseRef.current, mPulseCoreRef.current, mGradRef.current,
          mNodeRefs.current, mRippleRefs.current, mContentRefs.current, speed
        );
      };

      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: pinRef.current,
        anticipatePin: 1,
        onUpdate: (self) => applyProgress(self.progress),
      });

      applyProgress(st.progress);

      return () => st.kill();
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      className="relative"
      style={{
        backgroundColor: "var(--section-dark)",
        borderTop: "1px solid var(--section-dark-border)",
        height: "380vh",
      }}
    >
      <style>{`
        @keyframes wac-flicker {
          0%, 100% { opacity: 1; }
          46% { opacity: 0.86; }
          52% { opacity: 0.97; }
          79% { opacity: 0.82; }
          85% { opacity: 1; }
        }
        .wac-pulse-flicker { animation: wac-flicker 2.4s ease-in-out infinite; }

        .wac-content {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .wac-content-visible { opacity: 1; transform: translateY(0); }

        .wac-node-inner {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .wac-hex {
          transition: fill 0.5s ease, stroke 0.5s ease, opacity 0.5s ease, filter 0.5s ease;
        }
        .wac-core {
          transition: fill 0.5s ease, opacity 0.5s ease, filter 0.5s ease;
        }

        g[data-state=future] .wac-node-inner { transform: scale(1); }
        g[data-state=future] .wac-hex { fill: ${SURFACE}; stroke: ${BORDER}; opacity: 0.85; filter: none; }
        g[data-state=future] .wac-core { fill: ${BORDER}; opacity: 0.6; filter: none; }

        g[data-state=active] .wac-node-inner { transform: scale(1.18); }
        g[data-state=active] .wac-hex { fill: ${SURFACE}; stroke: ${CYAN}; opacity: 1; filter: url(#wac-bloom-strong); }
        g[data-state=active] .wac-core { fill: ${CYAN}; opacity: 1; filter: url(#wac-bloom-strong); }

        g[data-state=passed] .wac-node-inner { transform: scale(1); }
        g[data-state=passed] .wac-hex { fill: ${SURFACE}; stroke: ${CYAN}; opacity: 0.4; filter: url(#wac-bloom-soft); }
        g[data-state=passed] .wac-core { fill: ${CYAN}; opacity: 0.4; filter: url(#wac-bloom-soft); }
      `}</style>

      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* ── ambient background: near-black -> faint cyan glow near trace, grid + scanlines ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 78%, rgba(0,180,216,0.12), rgba(0,180,216,0.03) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,180,216,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.6) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, transparent 1px, transparent 3px)",
          }}
        />

        {/* ── heading ── */}
        <div className="relative z-10 text-center pt-20 md:pt-24 px-6">
          <h2
            className="font-heading font-black"
            style={{ fontSize: "clamp(28px, 4vw, 46px)", letterSpacing: "-1.5px", lineHeight: 1, color: WHITE }}
          >
            Why teams choose Aivik
          </h2>
          <p
            className="font-mono"
            style={{
              marginTop: 16,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: CYAN,
            }}
          >
            Signal, not noise.
          </p>
        </div>

        {/* ── desktop circuit ── */}
        <div
          className="hidden md:block absolute left-0 right-0"
          style={{ bottom: "6%", width: "100%" }}
        >
          <div className="relative mx-auto" style={{ width: "92%", maxWidth: 1200, aspectRatio: `${VB_W_D} / ${VB_H_D}` }}>
            <svg viewBox={`0 0 ${VB_W_D} ${VB_H_D}`} style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
              <defs>
                <filter id="wac-bloom-strong" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="7" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="wac-bloom-soft" x="-90%" y="-90%" width="280%" height="280%">
                  <feGaussianBlur stdDeviation="3.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient ref={dGradRef} id="wac-tail-grad-d" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={CYAN} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* etched base trace */}
              <path d={PATH_D} fill="none" stroke={SURFACE} strokeWidth={5} strokeLinecap="round" />
              <path d={PATH_D} fill="none" stroke={BORDER} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="1 9" />

              {/* dim persistent "already powered" glow */}
              <path ref={dGlowRef} d={PATH_D} fill="none" stroke={CYAN} strokeOpacity={0.22} strokeWidth={2.5} strokeLinecap="round" />

              {/* hot fading tail */}
              <path ref={dTailRef} d={PATH_D} fill="none" stroke="url(#wac-tail-grad-d)" strokeWidth={3.5} strokeLinecap="round" filter="url(#wac-bloom-soft)" />

              <path ref={dPathRef} d={PATH_D} fill="none" stroke="transparent" />

              {/* pulse */}
              <g ref={dPulseRef} className="wac-pulse-flicker">
                <circle r={13} fill={CYAN} opacity={0.18} filter="url(#wac-bloom-strong)" />
                <circle ref={dPulseCoreRef} r={5} fill={WHITE} filter="url(#wac-bloom-strong)" />
              </g>

              {/* nodes */}
              {STAGES.map((_, i) => (
                <g key={i} ref={(el) => { dNodeRefs.current[i] = el; }} data-state="future">
                  <circle ref={(el) => { dRippleRefs.current[i] = el; }} r={6} fill="none" stroke={CYAN} strokeWidth={2} opacity={0} />
                  <g className="wac-node-inner">
                    <polygon
                      className="wac-hex"
                      points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
                      strokeWidth={1.5}
                    />
                    <circle className="wac-core" r={5} />
                  </g>
                  <text
                    textAnchor="middle"
                    y={38}
                    className="font-mono"
                    style={{ fill: GRAY, fontSize: 10, letterSpacing: "2px" }}
                  >
                    {`0${i + 1}`}
                  </text>
                </g>
              ))}
            </svg>

            {/* content reveals */}
            {STAGES.map((stage, i) => (
              <div
                key={i}
                ref={(el) => { dContentRefs.current[i] = el; }}
                className="wac-content absolute"
                style={{
                  transform: `translate(${DESKTOP_ANCHOR[i].left}, calc(-100% - 34px))`,
                  width: 225,
                  textAlign: DESKTOP_ANCHOR[i].align,
                }}
              >
                <span
                  className="font-mono block"
                  style={{ fontSize: 11, letterSpacing: "0.2em", color: CYAN, marginBottom: 8 }}
                >
                  {stage.eyebrow}
                </span>
                <h3
                  className="font-heading font-black"
                  style={{ fontSize: 20, color: WHITE, marginBottom: 8, letterSpacing: "-0.3px" }}
                >
                  {stage.title}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: GRAY }}>{stage.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── mobile circuit (vertical) ── */}
        <div className="block md:hidden absolute inset-x-0 top-[26%] bottom-0 px-5">
          <div className="relative mx-auto h-full" style={{ width: "100%", maxWidth: 420, aspectRatio: `${VB_W_M} / ${VB_H_M}` }}>
            <svg viewBox={`0 0 ${VB_W_M} ${VB_H_M}`} style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
              <defs>
                <filter id="wac-bloom-strong-m" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient ref={mGradRef} id="wac-tail-grad-m" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={CYAN} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={PATH_M} fill="none" stroke={SURFACE} strokeWidth={5} strokeLinecap="round" />
              <path ref={mGlowRef} d={PATH_M} fill="none" stroke={CYAN} strokeOpacity={0.22} strokeWidth={2.5} strokeLinecap="round" />
              <path ref={mTailRef} d={PATH_M} fill="none" stroke="url(#wac-tail-grad-m)" strokeWidth={3.5} strokeLinecap="round" filter="url(#wac-bloom-strong-m)" />
              <path ref={mPathRef} d={PATH_M} fill="none" stroke="transparent" />

              <g ref={mPulseRef} className="wac-pulse-flicker">
                <circle r={12} fill={CYAN} opacity={0.18} filter="url(#wac-bloom-strong-m)" />
                <circle ref={mPulseCoreRef} r={5} fill={WHITE} filter="url(#wac-bloom-strong-m)" />
              </g>

              {STAGES.map((_, i) => (
                <g key={i} ref={(el) => { mNodeRefs.current[i] = el; }} data-state="future">
                  <circle ref={(el) => { mRippleRefs.current[i] = el; }} r={6} fill="none" stroke={CYAN} strokeWidth={2} opacity={0} />
                  <g className="wac-node-inner">
                    <polygon
                      className="wac-hex"
                      points="0,-18 15,-9 15,9 0,18 -15,9 -15,-9"
                      strokeWidth={1.5}
                    />
                    <circle className="wac-core" r={4.5} />
                  </g>
                </g>
              ))}
            </svg>

            {STAGES.map((stage, i) => (
              <div
                key={i}
                ref={(el) => { mContentRefs.current[i] = el; }}
                className="wac-content absolute"
                style={{ transform: "translateY(-50%)", right: 4 }}
              >
                <span
                  className="font-mono block"
                  style={{ fontSize: 10, letterSpacing: "0.18em", color: CYAN, marginBottom: 6 }}
                >
                  {stage.eyebrow}
                </span>
                <h3
                  className="font-heading font-black"
                  style={{ fontSize: 16, color: WHITE, marginBottom: 6, letterSpacing: "-0.2px" }}
                >
                  {stage.title}
                </h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.65, color: GRAY }}>{stage.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
