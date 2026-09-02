// Tiny working product interface, not an icon: a browser-chrome frame whose
// dashboard visibly gets BUILT — boot tag, then structure, then metrics,
// then a chart, then a deploy ping — one continuous CSS-keyframe story per
// element (see the swBootTag/swDashShell/... rules in globals.css). All
// motion is opacity/transform only, everything is tagged .svc-anim so
// ServiceCard's hover rule can pause it uniformly, and reduced-motion
// freezes on the finished "Deployed" state via the shared media query.
const BARS = [0, 1, 2, 3, 4];

export default function SoftwareArtifact() {
  return (
    <div className="sw-art" aria-hidden="true">
      <div className="sw-frame">
        <div className="sw-frame-bar">
          <span className="sw-frame-dot" style={{ background: "#F87171" }} />
          <span className="sw-frame-dot" style={{ background: "#FBBF24" }} />
          <span className="sw-frame-dot" style={{ background: "#4ADE80" }} />
          <span className="sw-frame-url">app.aivik.dev</span>
        </div>

        <div className="sw-frame-body svc-anim">
          <span className="sw-boot-tag svc-anim">&lt;Component /&gt;</span>

          <div className="sw-dash-nav svc-anim" />

          <div className="sw-dash-cards">
            <div className="sw-metric svc-anim sw-metric-shell">
              <span className="sw-metric-value svc-anim sw-metric-1">12.4K</span>
              <span className="sw-metric-label">Users</span>
            </div>
            <div className="sw-metric svc-anim sw-metric-shell">
              <span className="sw-metric-value sw-metric-up svc-anim sw-metric-2">+24%</span>
              <span className="sw-metric-label">Growth</span>
            </div>
          </div>

          <div className="sw-chart">
            {BARS.map((i) => (
              <span key={i} className={`sw-chart-bar svc-anim sw-chart-bar-${i}`} />
            ))}
          </div>

          <div className="sw-status svc-anim sw-status-connecting">
            <span className="svc-status-dot" style={{ background: "var(--accent-code)" }} />
            API connected
          </div>
          <div className="sw-status svc-anim sw-status-deployed">
            <span className="svc-check">✓</span> Deployed
          </div>
        </div>
      </div>
    </div>
  );
}
