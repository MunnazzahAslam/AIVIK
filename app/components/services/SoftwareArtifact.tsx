"use client";
import { useInView } from "./useInView";
import { useCountUp } from "./useCountUp";
import { useReducedMotion } from "./useReducedMotion";

// Terminal-style dashboard: a URL bar with a blinking cursor, two stat
// boxes that count up once the card scrolls into view, and a pinging
// "active" status dot that keeps going continuously — unlike the previous
// design, nothing here pauses on hover, it just idles under the ring/
// spotlight hover chrome from ServiceCard.
export default function SoftwareArtifact() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const users = useCountUp(12.4, inView, { decimals: 1, reduced });
  const growth = useCountUp(24, inView, { reduced });

  return (
    <div ref={ref} className="c1-inner" aria-hidden="true">
      <div className="c1-url-row">
        <span className="c1-dots">
          <span className="c1-dot c1-dot-r" />
          <span className="c1-dot c1-dot-y" />
          <span className="c1-dot c1-dot-g" />
        </span>
        app.aivik.dev
        <span className="c1-cursor" />
      </div>

      <div className="c1-stats">
        <div className="c1-stat-box">
          <div className="c1-stat-label">Users</div>
          <div className="c1-stat-val">{users}K</div>
        </div>
        <div className="c1-stat-box">
          <div className="c1-stat-label">Growth</div>
          <div className="c1-stat-val c1-green">
            +{growth}%
            <svg width="10" height="10" viewBox="0 0 10 10" className="c1-arrow">
              <path d="M5 9V1M1 5l4-4 4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="c1-status-row">
        <span>STATUS: ACTIVE</span>
        <span className="c1-status-dot" />
      </div>
    </div>
  );
}
