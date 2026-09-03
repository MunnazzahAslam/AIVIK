"use client";
import { useInView } from "./useInView";
import { useCountUp } from "./useCountUp";
import { useReducedMotion } from "./useReducedMotion";

const CURVE = "M 0 82 Q 60 62, 120 66 T 240 26 T 300 16";
const CURVE_AREA = `${CURVE} L 300 96 L 0 96 Z`;

// Header count-up + an area/line chart that draws itself in once the card
// scrolls into view, then a dot keeps tracing the curve on a continuous
// loop (SMIL animateMotion — the path is a real curve, not a straight
// line, so this is simpler and more reliable than hand-rolled keyframes).
export default function DataArtifact() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const pct = useCountUp(24.8, inView, { decimals: 1, reduced });

  return (
    <div ref={ref} className="c4-inner" aria-hidden="true">
      <div className="c4-top">
        <span>METRICS ANALYSIS</span>
        <span className="c4-pct">{pct}%</span>
      </div>
      <div className="c4-chart-wrap">
        <svg width="100%" height="100%" viewBox="0 0 300 96" preserveAspectRatio="none">
          <defs>
            <linearGradient id="c4-area-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-data)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent-data)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={`c4-fill-area${inView ? " c4-in-view" : ""}`} fill="url(#c4-area-fade)" d={CURVE_AREA} />
          <path className={`c4-line${inView ? " c4-in-view" : ""}`} fill="none" stroke="var(--accent-data)" strokeWidth={2.4} strokeLinecap="round" d={CURVE} />
          {inView && !reduced && (
            <circle className="c4-trace-dot" r={3.4}>
              <animateMotion dur="3s" begin="1.4s" repeatCount="indefinite" path={CURVE} />
            </circle>
          )}
        </svg>
      </div>
      <div className="c4-foot">UAE customers, highest conversion</div>
    </div>
  );
}
