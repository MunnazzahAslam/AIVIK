// Story: a tiny raw-data table appears -> a scan-line sweeps down it while
// "Analyzing..." runs with a thin progress bar -> the table crossfades into
// a small trend chart -> a one-line insight lands. All opacity/transform,
// tagged .svc-anim so ServiceCard's hover rule pauses it; reduced motion
// freezes on the finished chart + insight (see globals.css).
const ROWS = [
  { id: "01", value: "12,420", region: "UAE" },
  { id: "02", value: "8,920", region: "DE" },
  { id: "03", value: "17,210", region: "UAE" },
  { id: "04", value: "6,430", region: "UK" },
];

const CHART_POINTS = "4,34 22,30 40,24 58,26 76,16 94,10";

export default function DataArtifact() {
  return (
    <div className="data-art" aria-hidden="true">
      <div className="data-stage">
        <table className="data-table svc-anim" aria-hidden="true">
          <thead>
            <tr>
              <th>ID</th>
              <th>Revenue</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.id} className={`data-row data-row-${i}`}>
                <td>{row.id}</td>
                <td>{row.value}</td>
                <td>{row.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="data-scanline svc-anim" />

        <div className="data-progress-wrap svc-anim">
          <span className="data-progress-label">Analyzing 24,891 rows...</span>
          <div className="data-progress-track">
            <div className="data-progress-bar svc-anim" />
          </div>
        </div>

        <svg className="data-chart svc-anim" viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            className="data-chart-line svc-anim"
            points={CHART_POINTS}
            fill="none"
            stroke="var(--accent-data)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="data-insight svc-anim">
        <span className="data-insight-trend">↗ +24.8%</span>
        <span className="svc-label">UAE customers, highest conversion</span>
      </div>
    </div>
  );
}
