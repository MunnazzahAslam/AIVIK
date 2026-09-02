// Story: "Campaign A · LIVE" -> 4 funnel stages fill in sequence
// (Impressions -> Clicks -> Leads -> Conversions, each with an illustrative
// number) -> a brief "Optimizing..." moment -> one outcome metric
// (ROAS 4.2x). Replaces the old reach/clicks/convert + heart/share panel,
// which read as social-post engagement stats rather than a campaign
// result. Pure CSS keyframes, tagged .svc-anim throughout so the shared
// hover-pause rule covers it; animation-delay:3.2s is this card's stagger
// offset in the cross-card orchestration.
const STAGES = [
  { label: "Impressions", value: "124K" },
  { label: "Clicks", value: "8.4K" },
  { label: "Leads", value: "1,240" },
  { label: "Conversions", value: "318" },
];

export default function MarketingArtifact() {
  return (
    <div className="mkt-art" aria-hidden="true">
      <div className="mkt-cycle svc-anim">
        <div className="mkt-campaign svc-anim">
          <span className="mkt-live-dot svc-anim" />
          Campaign A · LIVE
        </div>

        <div className="mkt-funnel">
          {STAGES.map((s, i) => (
            <div className="mkt-funnel-row" key={s.label}>
              <span className="mkt-funnel-label">{s.label}</span>
              <div className="mkt-funnel-track">
                <div className={`mkt-funnel-bar svc-anim mkt-stage-${i}`} />
              </div>
              <span className={`mkt-funnel-value svc-anim mkt-value-${i}`}>{s.value}</span>
            </div>
          ))}
        </div>

        <span className="mkt-optimizing svc-anim">Optimizing...</span>
        <span className="mkt-outcome svc-anim">
          ROAS <span className="mkt-outcome-value">4.2×</span>
        </span>
      </div>
    </div>
  );
}
