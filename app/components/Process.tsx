import FadeIn from "./FadeIn";

const steps = [
  {
    step: "STEP 01",
    title: "Discovery and Alignment",
    description:
      "We begin with a structured discovery session to understand your business objectives, technical constraints, and success criteria. This ensures every decision we make is grounded in your goals, not assumptions.",
    dark: true,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="white"
        strokeWidth="1"
        aria-hidden="true"
      >
        <line x1="20" y1="100" x2="100" y2="20" />
        <line x1="40" y1="100" x2="100" y2="40" />
        <line x1="60" y1="100" x2="100" y2="60" />
        <line x1="80" y1="100" x2="100" y2="80" />
        <line x1="20" y1="80" x2="80" y2="20" />
        <rect x="30" y="30" width="60" height="60" strokeDasharray="4 4" />
      </svg>
    ),
  },
  {
    step: "STEP 02",
    title: "Solution Architecture",
    description:
      "Our engineers design a detailed technical blueprint covering system architecture, technology selection, timeline, and resource allocation. You receive full visibility into how we plan to deliver before a single line of code is written.",
    dark: false,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="black"
        strokeWidth="1"
        aria-hidden="true"
      >
        <rect x="20" y="20" width="80" height="80" />
        <rect x="35" y="35" width="50" height="50" />
        <rect x="50" y="50" width="20" height="20" />
        <line x1="20" y1="20" x2="50" y2="50" />
        <line x1="100" y1="20" x2="70" y2="50" />
        <line x1="20" y1="100" x2="50" y2="70" />
        <line x1="100" y1="100" x2="70" y2="70" />
      </svg>
    ),
  },
  {
    step: "STEP 03",
    title: "Agile Delivery",
    description:
      "We execute in focused sprints with regular delivery milestones. You have continuous visibility through live demos, progress updates, and direct access to the engineering team throughout the engagement.",
    dark: true,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="white"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="40" />
        <circle cx="60" cy="60" r="25" />
        <circle cx="60" cy="60" r="10" />
        <line x1="60" y1="20" x2="60" y2="35" />
        <line x1="60" y1="85" x2="60" y2="100" />
        <line x1="20" y1="60" x2="35" y2="60" />
        <line x1="85" y1="60" x2="100" y2="60" />
      </svg>
    ),
  },
  {
    step: "STEP 04",
    title: "Launch and Continuous Support",
    description:
      "Deployment is the beginning, not the end. We manage your go-live, monitor system performance, and remain your long-term engineering partner as your product scales and your requirements evolve.",
    dark: false,
    shape: (
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="black"
        strokeWidth="1"
        aria-hidden="true"
      >
        <polyline points="20,90 45,60 65,75 100,30" />
        <polyline points="80,30 100,30 100,50" />
        <line x1="20" y1="100" x2="100" y2="100" />
        <line x1="20" y1="100" x2="20" y2="20" />
      </svg>
    ),
  },
];

export default function Process() {
  return (
    <section id="process" className="bg-white pt-20 md:pt-[120px] pb-20 md:pb-[60px] px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <h2
            className="font-heading font-black text-black"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: "1",
            }}
          >
            OUR PROCESS
          </h2>
        </FadeIn>

        {/* Sticky stacked cards */}
        <div className="flex flex-col gap-4 md:gap-0">
          {steps.map(({ step, title, description, dark, shape }, i) => {
            const topValues = [
              "md:top-[80px]",
              "md:top-[120px]",
              "md:top-[160px]",
              "md:top-[200px]",
            ];
            const zValues = ["md:z-10", "md:z-20", "md:z-30", "md:z-40"];

            return (
              <div
                key={step}
                className={`md:sticky ${topValues[i]} ${zValues[i]} max-w-[900px] mx-auto w-full
                  ${dark ? "bg-black border border-[#1A1A1A]" : "bg-white border border-[#E5E5E5]"}
                  p-10 md:p-16`}
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16">
                  <div className="flex-1">
                    <p className="font-mono text-[11px] tracking-[3px] uppercase text-[#888888] mb-6">
                      {step}
                    </p>
                    <h3
                      className={`font-heading text-3xl md:text-[36px] font-bold mb-5 ${
                        dark ? "text-white" : "text-black"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`font-body text-base leading-[1.7] max-w-[480px] ${
                        dark ? "text-[#888888]" : "text-[#666666]"
                      }`}
                    >
                      {description}
                    </p>
                  </div>

                  <div className="shrink-0 opacity-60">{shape}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block h-[100px]" aria-hidden="true" />
        <div className="h-px bg-[#E5E5E5] mt-10 max-w-[900px] mx-auto" />
      </div>
    </section>
  );
}
