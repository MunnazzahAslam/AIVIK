interface SectionLabelProps {
  text: string;
  dark?: boolean;
  className?: string;
}

export default function SectionLabel({
  text,
  dark = true,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`font-mono text-[11px] tracking-[3px] uppercase mb-5 text-on-dark-muted ${className}`}
    >
      {text}
    </p>
  );
}
