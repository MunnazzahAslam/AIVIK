// 4 server rows, each with a heartbeat-pulsing LED pair and a load bar
// that continuously oscillates width, plus a soft scanline sweeping down
// through the stack — a living infrastructure readout rather than a
// static diagram. Pure CSS, always running (nothing pauses on hover in
// this design — reduced motion is handled globally in globals.css).
const SERVERS = [0, 1, 2, 3];

export default function CloudArtifact() {
  return (
    <div className="c3-inner" aria-hidden="true">
      <div className="c3-scanline" />
      {SERVERS.map((i) => (
        <div key={i} className={`c3-server c3-server-${i}`}>
          <div className="c3-lights">
            <span className="c3-led c3-led-cyan" />
            <span className="c3-led c3-led-teal" />
          </div>
          <div className="c3-load-track">
            <div className="c3-load-bar" />
          </div>
        </div>
      ))}
    </div>
  );
}
