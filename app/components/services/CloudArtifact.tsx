"use client";
import { useReducedMotion } from "./useReducedMotion";

const UNITS = [
  { y: 8, ledDur: 3.1, ledBegin: 0 },
  { y: 40, ledDur: 4.4, ledBegin: 0.6 },
  { y: 72, ledDur: 2.8, ledBegin: 1.1 },
  { y: 104, ledDur: 5.2, ledBegin: 1.8 },
];

export default function CloudArtifact() {
  const reduced = useReducedMotion();

  return (
    <svg viewBox="0 0 160 140" aria-hidden="true">
      {UNITS.map((u, i) => (
        <g key={i}>
          <rect x={16} y={u.y} width={128} height={22} rx={3} fill="rgba(255,255,255,0.04)" stroke="var(--section-dark-border)" />
          <circle cx={28} cy={u.y + 11} r={2.6} fill="var(--accent-cloud)">
            {!reduced && (
              <animate
                attributeName="opacity"
                values="1;1;0.15;1;1"
                keyTimes="0;0.4;0.5;0.6;1"
                dur={`${u.ledDur}s`}
                begin={`${u.ledBegin}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx={40} cy={u.y + 11} r={2.6} fill="var(--accent-cloud)" opacity={0.5}>
            {!reduced && (
              <animate
                attributeName="opacity"
                values="0.5;0.5;0.1;0.5;0.5"
                keyTimes="0;0.3;0.42;0.55;1"
                dur={`${u.ledDur * 0.8}s`}
                begin={`${u.ledBegin + 0.3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          {/* occasional brightness spike across the whole unit */}
          <rect x={16} y={u.y} width={128} height={22} rx={3} fill="var(--accent-cloud)" opacity={0}>
            {!reduced && (
              <animate
                attributeName="opacity"
                values="0;0;0.12;0;0;0;0"
                keyTimes="0;0.2;0.24;0.28;0.5;0.75;1"
                dur={`${6 + i}s`}
                begin={`${i * 1.4}s`}
                repeatCount="indefinite"
              />
            )}
          </rect>
        </g>
      ))}
      {/* data-flow line running through the stack */}
      <line x1={80} y1={4} x2={80} y2={132} stroke="var(--accent-cloud)" strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 6">
        {!reduced && (
          <animate attributeName="stroke-dashoffset" values="0;-40" dur="1.6s" repeatCount="indefinite" />
        )}
      </line>
    </svg>
  );
}
