/**
 * Connects Services and "Our work" with evenly spaced dots,
 * ending in a small blue ring below the curved boundary.
 */

const WIDTH = 12;
const DOT_GAP = 16;
const RING_RADIUS = 4;

export const TRAIL_ABOVE = 150;

const RING_Y = TRAIL_ABOVE + 24;

export const TRAIL_HEIGHT = RING_Y + RING_RADIUS + 2;

const DOTS: number[] = [];

for (let y = 6; y <= RING_Y - DOT_GAP; y += DOT_GAP) {
  DOTS.push(y);
}

export default function DotsToLine() {
  return (
    <svg
      className="uc-trail"
      aria-hidden="true"
      width={WIDTH}
      height={TRAIL_HEIGHT}
      viewBox={`0 0 ${WIDTH} ${TRAIL_HEIGHT}`}
      style={{
        top: -TRAIL_ABOVE,
        pointerEvents: "none",
      }}
    >
      {DOTS.map((y, i) => {
        const progress = i / Math.max(1, DOTS.length - 1);

        return (
          <circle
            key={y}
            cx={WIDTH / 2}
            cy={y}
            r={1.4}
            fill="#94a3b8"
            opacity={0.4 + progress * 0.5}
          />
        );
      })}

      <circle
        cx={WIDTH / 2}
        cy={RING_Y}
        r={RING_RADIUS}
        fill="none"
        stroke="#2563eb"
        strokeWidth={1.5}
      />
    </svg>
  );
}