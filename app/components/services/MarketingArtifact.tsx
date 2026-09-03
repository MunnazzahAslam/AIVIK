"use client";
import { useInView } from "./useInView";
import { useCountUp } from "./useCountUp";
import { useReducedMotion } from "./useReducedMotion";

const METRICS = [
  { label: "Impressions", target: 124, decimals: 0, suffix: "K", width: 85, delay: 0.15 },
  { label: "Clicks", target: 18.2, decimals: 1, suffix: "K", width: 62, delay: 0.3 },
  { label: "Conversions", target: 3.4, decimals: 1, suffix: "K", width: 40, delay: 0.45 },
];

// Campaign readout: a live-pulsing dot, then 3 metrics that count up and
// fill their bars once the card scrolls into view, each bar carrying a
// continuous shimmer sweep. All 3 bars share the marketing accent at
// different opacities rather than unrelated hues, keeping this card's own
// single color identity.
export default function MarketingArtifact() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  // METRICS has a fixed length (3) — called explicitly rather than inside
  // .map() so the number/order of hook calls never varies between renders.
  const values = [
    useCountUp(METRICS[0].target, inView, { decimals: METRICS[0].decimals, reduced }),
    useCountUp(METRICS[1].target, inView, { decimals: METRICS[1].decimals, reduced }),
    useCountUp(METRICS[2].target, inView, { decimals: METRICS[2].decimals, reduced }),
  ];

  return (
    <div ref={ref} className="c5-inner" aria-hidden="true">
      <div className="c5-top">
        <span>
          <span className="c5-live-dot" />
          Campaign A
        </span>
        <span className="c5-live-label">Live</span>
      </div>
      <div>
        {METRICS.map((m, i) => (
          <div className="c5-metric" key={m.label}>
            <div className="c5-metric-row">
              <span>{m.label}</span>
              <span className="c5-metric-val">
                {values[i]}
                {m.suffix}
              </span>
            </div>
            <div className="c5-track">
              <div
                className={`c5-fill c5-fill-${i}${inView ? " c5-in-view" : ""}`}
                style={{ ["--fill-width" as string]: `${m.width}%` }}
              >
                {!reduced && <div className="c5-shimmer" style={{ animationDelay: `${m.delay}s` }} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
