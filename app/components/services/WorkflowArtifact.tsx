// Story: a new event enters -> a signal travels to the AI node, which
// shows "Processing..." -> the flow branches to 3 destinations -> each
// checks off in sequence -> "Automated". Reuses the node/connection visual
// language from the previous version, but the intelligence now reads from
// the workflow completing itself rather than an abstract graph. Pure CSS
// (no SMIL) so the shared .svc-anim hover-pause rule covers it uniformly;
// animation-delay:0.8s is this card's stagger offset in the cross-card
// orchestration.
const BRANCHES = [
  { y: 32, label: "CRM" },
  { y: 70, label: "EMAIL" },
  { y: 108, label: "TEAM" },
];

export default function WorkflowArtifact() {
  return (
    <svg className="wf-art" viewBox="0 0 160 140" aria-hidden="true">
      <g className="wf-cycle svc-anim">
        {/* entry -> AI */}
        <line x1={26} y1={70} x2={72} y2={70} className="wf-line" />
        {/* AI -> branches */}
        {BRANCHES.map((b) => (
          <line key={b.label} x1={91} y1={70} x2={116} y2={b.y} className="wf-line" />
        ))}

        <circle cx={18} cy={70} r={8} className="wf-entry-node svc-anim" />
        <text x={18} y={54} textAnchor="middle" className="svc-label wf-svg-label wf-entry-label svc-anim">
          NEW LEAD
        </text>

        <circle cx={18} cy={70} r={3} className="wf-signal svc-anim" />

        <circle cx={80} cy={70} r={11} className="wf-ai-node svc-anim" />
        <text x={80} y={94} textAnchor="middle" className="svc-label wf-svg-label wf-processing svc-anim">
          PROCESSING
        </text>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={95 + i * 5} cy={94} r={1.3} className={`wf-dot wf-dot-${i} svc-anim`} />
        ))}

        {/* Checkmark sits at a fixed x (textAnchor="end") rather than one
            computed from label width — the previous version placed labels
            and checks past x=160, outside the viewBox, so they rendered
            clipped or overflowing the card since the svg allows overflow
            for legitimate small bleed (glow effects etc). Everything here
            now stays within the 0-160 viewBox with margin to spare. */}
        {BRANCHES.map((b, i) => (
          <g key={b.label}>
            <circle cx={116} cy={b.y} r={5} className="wf-branch-node svc-anim" />
            <text x={124} y={b.y + 2.5} textAnchor="start" className="svc-label wf-svg-label wf-branch-label svc-anim">
              {b.label}
            </text>
            <text
              x={156}
              y={b.y + 2.5}
              textAnchor="end"
              className={`svc-check wf-svg-check wf-check-${i} svc-anim`}
            >
              ✓
            </text>
          </g>
        ))}

        <text x={80} y={132} textAnchor="middle" className="svc-label wf-automated svc-anim">
          AUTOMATED <tspan className="svc-check">✓</tspan>
        </text>
      </g>
    </svg>
  );
}
