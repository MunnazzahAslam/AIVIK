import FadeIn from "./FadeIn";

export default function CTA() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="relative bg-[#111827] border border-[#1E2D4A] rounded-3xl p-12 md:p-20 overflow-hidden text-center">

            {/* Gradient orbs inside the card */}
            <div
              className="absolute -top-20 left-1/4 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
            />

            {/* Animated top border line */}
            <div className="cta-top-line absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 text-xs text-[#3B82F6] font-semibold tracking-widest uppercase bg-[#2563EB]/10 border border-[#2563EB]/20 px-4 py-1.5 rounded-full mb-8">
                Get started
              </span>

              <h2 className="text-3xl md:text-5xl font-extrabold text-[#F1F5F9] leading-tight mb-5">
                Let&apos;s talk about what{" "}
                <span className="gradient-text">you are building.</span>
              </h2>

              <p className="text-[#64748B] text-lg mb-10 leading-relaxed">
                Book a free 30 minute consultation. We will tell you honestly what we can do,
                what it will cost, and how long it will take. No jargon. No pressure.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-semibold px-9 py-4 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.03] text-sm"
                >
                  Book a free consultation
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              <p className="text-[#334155] text-sm mt-7">
                Or email us at{" "}
                <a
                  href="mailto:hello@aivik.eu"
                  className="text-[#475569] hover:text-[#94A3B8] transition-colors underline underline-offset-2"
                >
                  hello@aivik.eu
                </a>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
