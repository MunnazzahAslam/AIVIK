type Props = {
  /** Background color of the section this curve transitions into. */
  fill: string;
  /** "dip" for dark-to-light (curve sags down), "rise" for light-to-dark (curve arches up). */
  direction: "dip" | "rise";
};

// Height of the curve strip and the z-index it paints at — exported so a
// section entered by a curve (e.g. a spotlight overlay needing to extend
// into the curve painted by the section above it) can match both exactly.
export const CURVE_HEIGHT = 110;
export const CURVE_Z_INDEX = 3;

const PATHS = {
  dip: "M0,90 C360,10 1080,10 1440,90 L1440,110 L0,110 Z",
  rise: "M0,20 C400,100 1040,100 1440,20 L1440,110 L0,110 Z",
} as const;

// Sits at the bottom edge of a section, overlapping ~100px into it, filled
// with the NEXT section's color — creates a curved handoff between sections
// instead of a flat line. Only needed where the color actually changes.
export default function SectionCurve({ fill, direction }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: -1,
        left: 0,
        width: "100%",
        lineHeight: 0,
        zIndex: CURVE_Z_INDEX,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox={`0 0 1440 ${CURVE_HEIGHT}`}
        preserveAspectRatio="none"
        // preserveAspectRatio="none" stretches the path to fill whatever
        // box it's given, independently per axis. With a fixed pixel
        // height, the curve's horizontal span shrinks on narrow viewports
        // while its vertical excursion doesn't — the same dip gets
        // compressed into a much narrower width, reading as a much
        // steeper curve on mobile. Scaling height down with viewport
        // width (clamped so it never disappears or exceeds the original
        // 110px) keeps the curve's visual proportions roughly consistent
        // across screen sizes. CURVE_HEIGHT itself stays the fixed
        // reference other components use to reserve layout space around
        // the curve — a shorter rendered curve just leaves a bit more of
        // that reserved space as flat color, which is harmless.
        style={{ width: "100%", height: `clamp(40px, 7.7vw, ${CURVE_HEIGHT}px)`, display: "block" }}
      >
        <path d={PATHS[direction]} fill={fill} />
      </svg>
    </div>
  );
}
