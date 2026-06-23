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
      className={`font-mono text-[11px] tracking-[3px] uppercase mb-5 ${
        dark ? "text-[#888888]" : "text-[#666666]"
      } ${className}`}
    >
      {text}
    </p>
  );
}
