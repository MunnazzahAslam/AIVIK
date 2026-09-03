"use client";
import { useReducedMotion } from "./useReducedMotion";

const OUTPUTS = [
  { y: 32, label: "CRM" },
  { y: 78, label: "EMAIL" },
  { y: 124, label: "TEAM" },
];

// Continuous ambient node graph: a signal packet travels from the entry
// node to the AI core and out along each branch on a loop, the core
// pulses/ripples, and each destination's tick label blips periodically —
// all always running (nothing pauses on hover in this design). SMIL
// animateMotion drives the packets since the paths are simple straight
// lines and SMIL doesn't need any hover-pause hook here.
export default function WorkflowArtifact() {
  const reduced = useReducedMotion();

  return (
    <svg className="c2-svg" viewBox="0 0 300 160" aria-hidden="true">
      <path className="c2-edge" d="M 44 78 L 118 78" />
      {OUTPUTS.map((o) => (
        <path key={o.label} className="c2-edge" d={`M 118 78 L 214 ${o.y}`} />
      ))}

      {!reduced && <circle className="c2-ripple" cx={118} cy={78} r={16} />}
      <circle className="c2-node-out" cx={44} cy={78} r={9} />
      <circle className="c2-node-center" cx={118} cy={78} r={15} />
      {OUTPUTS.map((o) => (
        <circle key={o.label} className="c2-node-in" cx={214} cy={o.y} r={7} />
      ))}

      {!reduced && (
        <>
          <circle className="c2-packet" r={2.6}>
            <animateMotion dur="1.6s" repeatCount="indefinite" path="M 44 78 L 118 78" />
          </circle>
          {OUTPUTS.map((o, i) => (
            <circle key={o.label} className="c2-packet" r={2.6}>
              <animateMotion dur="1.9s" begin={`${0.35 + i * 0.25}s`} repeatCount="indefinite" path={`M 118 78 L 214 ${o.y}`} />
            </circle>
          ))}
        </>
      )}

      <text x={34} y={100} className="c2-label">LEAD</text>
      {OUTPUTS.map((o, i) => (
        <text
          key={o.label}
          x={228}
          y={o.y + 3}
          className="c2-tick"
          style={reduced ? undefined : { animationDelay: `${0.35 + i * 0.25}s` }}
        >
          {o.label} ✓
        </text>
      ))}
    </svg>
  );
}
