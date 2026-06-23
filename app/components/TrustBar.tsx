export default function TrustBar() {
  const items = [
    "Sophos Central",
    "LaunchGood",
    "NymCard",
    "Perspecta",
    "🇩🇪 Registered in Germany",
    "🔒 GDPR Compliant",
  ];

  const allItems = [...items, ...items];

  return (
    <section className="border-y border-[#1E2D4A] bg-[#111827] py-10 overflow-hidden">
      <p className="text-[#334155] text-xs tracking-widest uppercase text-center font-medium mb-8 px-6">
        Built by engineers who have shipped for
      </p>

      <div className="marquee-mask">
        <div className="animate-marquee flex items-center">
          {allItems.map((label, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="text-[#334155] hover:text-[#64748B] font-semibold text-sm tracking-wider whitespace-nowrap transition-colors duration-200 cursor-default">
                {label}
              </span>
              {/* Dot separator */}
              <span className="w-1 h-1 rounded-full bg-[#1E2D4A] shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
