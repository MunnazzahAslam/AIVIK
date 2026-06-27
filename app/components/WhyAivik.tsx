import FadeIn from "./FadeIn";
import SectionReveal from "./SectionReveal";

const reasons = [
  {
    iconBg: "from-[#2563EB]/20 to-[#1D4ED8]/5",
    iconColor: "#3B82F6",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Senior engineers only",
    desc: "No juniors learning on your project. Everyone on your work has shipped production systems at scale.",
  },
  {
    iconBg: "from-[#7C3AED]/20 to-[#5B21B6]/5",
    iconColor: "#8B5CF6",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
      </svg>
    ),
    title: "Germany registered",
    desc: "AIVIK is a registered German company. GDPR compliant by default. Built for clients who care about compliance.",
  },
  {
    iconBg: "from-[#2563EB]/20 to-[#7C3AED]/10",
    iconColor: "#60A5FA",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: "Fixed price always",
    desc: "We agree the price before we start. No open ended retainers, no invoice surprises at the end of the month.",
  },
  {
    iconBg: "from-[#7C3AED]/20 to-[#2563EB]/10",
    iconColor: "#A78BFA",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Full stack capability",
    desc: "Frontend, backend, AI, hardware. One team for the whole scope. No coordination overhead between agencies.",
  },
  {
    iconBg: "from-[#2563EB]/20 to-[#1D4ED8]/5",
    iconColor: "#93C5FD",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "EU timezone aligned",
    desc: "We work remotely and overlap with European business hours. Async by default, available when it matters.",
  },
  {
    iconBg: "from-[#7C3AED]/20 to-[#5B21B6]/5",
    iconColor: "#C4B5FD",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Fast to start",
    desc: "Most projects kick off within one week of signing. No months of discovery phases before a line of code is written.",
  },
];

export default function WhyAivik() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <span className="inline-flex items-center gap-2 text-xs text-[#3B82F6] font-semibold tracking-widest uppercase bg-[#2563EB]/10 border border-[#2563EB]/20 px-3.5 py-1.5 rounded-full mb-5">
            Why AIVIK
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F1F5F9] leading-tight mb-4">
            Why companies choose us
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl">
            We're built differently. Here's what that means in practice.
          </p>
        </FadeIn>

        <SectionReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map(({ iconBg, iconColor, icon, title, desc }) => (
            <div
              key={title}
              className="group card-hover rounded-2xl p-7 flex flex-col gap-5"
              style={{
                backgroundColor: "color-mix(in srgb, var(--section-dark-surface) 30%, transparent)",
                border: "1px solid var(--section-dark-border)",
              }}
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                style={{ color: iconColor, border: "1px solid var(--section-dark-border)" }}
              >
                {icon}
              </div>
              <div>
                <h3 className="text-[#F1F5F9] font-semibold mb-2 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
