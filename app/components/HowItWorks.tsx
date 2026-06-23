import FadeIn from "./FadeIn";
import SectionReveal from "./SectionReveal";

const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    desc: "30 minute call. No slides, no pitch. Just a real conversation about your problem and whether we are the right team to solve it.",
  },
  {
    n: "02",
    title: "We send a proposal",
    desc: "Clear scope, fixed price, and timeline. Within 48 hours of our call. No open ended estimates that grow after you sign.",
  },
  {
    n: "03",
    title: "We build and deliver",
    desc: "You stay in the loop. We handle execution. Regular updates, no surprises, and we don't disappear after launch.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 bg-[#111827] relative overflow-hidden">
      {/* Subtle top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E2D4A] to-transparent" />

      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-20">
          <span className="inline-flex items-center gap-2 text-xs text-[#3B82F6] font-semibold tracking-widest uppercase bg-[#2563EB]/10 border border-[#2563EB]/20 px-3.5 py-1.5 rounded-full mb-5">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F1F5F9] leading-tight mb-4">
            Simple from start to finish
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl">
            Three steps. No complexity theater. We keep it straightforward
            because our clients are busy.
          </p>
        </FadeIn>

        <SectionReveal className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Connecting line between circles — desktop only */}
          <div className="absolute top-6 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px hidden md:block"
            style={{ background: "linear-gradient(to right, #2563EB55, #7C3AED55)" }}
          />

          {steps.map(({ n, title, desc }, i) => (
            <div key={n} className="flex flex-col items-start md:items-center md:text-center">
              {/* Numbered circle */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full mb-6 shrink-0"
                style={{
                  background: i === 0
                    ? "linear-gradient(135deg, #2563EB22, #2563EB11)"
                    : i === 1
                    ? "linear-gradient(135deg, #4F46E522, #7C3AED11)"
                    : "linear-gradient(135deg, #7C3AED22, #7C3AED11)",
                  border: `1px solid ${i === 0 ? "#2563EB55" : i === 1 ? "#4F46E555" : "#7C3AED55"}`,
                  boxShadow: `0 0 20px -4px ${i === 0 ? "#2563EB44" : i === 1 ? "#4F46E544" : "#7C3AED44"}`,
                }}
              >
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: i === 0 ? "#3B82F6" : i === 1 ? "#818CF8" : "#8B5CF6" }}
                >
                  {n}
                </span>
              </div>

              <h3 className="text-[#F1F5F9] font-semibold text-lg mb-3">{title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
