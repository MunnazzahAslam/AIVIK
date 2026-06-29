type Props = {
  variant?: "dark" | "light";
  size?: "lg" | "md" | "sm";
  animate?: boolean;
  className?: string;
};

const sizes = {
  lg: { fontSize: 52, letterSpacing: "-1px", cursorWidth: 26, cursorHeight: 7,  cursorML: 9, cursorMB: 5 },
  md: { fontSize: 26, letterSpacing: "-0.5px", cursorWidth: 13, cursorHeight: 4, cursorML: 5, cursorMB: 2 },
  sm: { fontSize: 18, letterSpacing: "-0.3px", cursorWidth: 9,  cursorHeight: 3, cursorML: 3, cursorMB: 1 },
} as const;

const wordmarkColor = { dark: "#FFFFFF", light: "#0D1117" } as const;

export default function AIVIKLogo({
  variant = "dark",
  size = "md",
  animate = true,
  className,
}: Props) {
  const { fontSize, letterSpacing, cursorWidth, cursorHeight, cursorML, cursorMB } = sizes[size];

  return (
    <span
      className={`aivik-logo${className ? ` ${className}` : ""}`}
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        fontFamily: "var(--font-space-grotesk), sans-serif",
        fontSize,
        fontWeight: 700,
        letterSpacing,
        color: wordmarkColor[variant],
        lineHeight: 1,
        userSelect: "none",
        transition: "color 300ms ease",
      }}
      aria-label="AIVIK"
    >
      AIVIK
      <span
        className={animate ? "aivik-cursor" : undefined}
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: cursorWidth,
          height: cursorHeight,
          background: "#2563EB",
          marginLeft: cursorML,
          marginBottom: cursorMB,
          flexShrink: 0,
        }}
      />
    </span>
  );
}
