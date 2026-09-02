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
        style={{ width: "100%", height: CURVE_HEIGHT, display: "block" }}
      >
        <path d={PATHS[direction]} fill={fill} />
      </svg>
    </div>
  );
}
