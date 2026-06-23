import FadeIn from "./FadeIn";
import SectionReveal from "./SectionReveal";

const team = [
  {
    name: "Munnazzah Aslam",
    role: "Founder and Lead Engineer",
    desc: "Five years building production systems in fintech, cybersecurity, and government platforms. Led engineering teams and shipped at scale across MENA and Europe. Specialises in frontend architecture, AI integration, and full stack delivery.",
    tags: ["React", "Angular", "Next.js", "AI Integration", "Team Leadership"],
    avatarFrom: "#2563EB",
    avatarTo: "#3B82F6",
    active: true,
  },
  {
    name: "Muneeb",
    role: "Hardware and Operations",
    desc: "Leads AIVIK's hardware and electronics capability alongside business operations. Specialises in embedded systems, IoT, and hardware sourcing for companies building physical and digital products together.",
    tags: ["IoT", "Embedded Systems", "Hardware", "Operations"],
    avatarFrom: "#7C3AED",
    avatarTo: "#8B5CF6",
    active: true,
  },
  {
    name: "Engineering Team",
    role: "Backend and AI",
    desc: "Our backend and AI engineers bring deep experience in systems architecture, machine learning, and production AI integration. Every project draws from the full team.",
    tags: ["Node.js", "NestJS", "ML", "AI Pipelines", "Systems"],
    avatarFrom: "#4F46E5",
    avatarTo: "#6366F1",
    active: true,
  },
];

export default function Team() {
  return (
    <section id="team" className="py-28 px-6 bg-[#111827] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E2D4A] to-transparent" />

      {/* Background orb */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn className="mb-16">
          <span className="inline-flex items-center gap-2 text-xs text-[#3B82F6] font-semibold tracking-widest uppercase bg-[#2563EB]/10 border border-[#2563EB]/20 px-3.5 py-1.5 rounded-full mb-5">
            Team
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#F1F5F9] leading-tight mb-4">
            The people behind the work
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl">
            A small team with a wide range of production experience.
            You work with engineers, not account managers.
          </p>
        </FadeIn>

        <SectionReveal className="grid md:grid-cols-3 gap-5">
          {team.map(({ name, role, desc, tags, avatarFrom, avatarTo, active }) => (
            <div key={name} className="group card-hover bg-[#0A0F1E] border border-[#1E2D4A] rounded-2xl p-8 flex flex-col gap-5">
              {/* Avatar with gradient ring */}
              <div className="relative w-14 h-14 shrink-0">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: `linear-gradient(135deg, ${avatarFrom}, ${avatarTo})`, boxShadow: `0 4px 20px -4px ${avatarFrom}66` }}
                >
                  {name[0]}
                </div>
                {active && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0F1E]" />
                )}
              </div>

              {/* Info */}
              <div>
                <h3 className="text-[#F1F5F9] font-semibold text-lg group-hover:text-white transition-colors">{name}</h3>
                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: avatarFrom === "#2563EB" ? "#60A5FA" : avatarFrom === "#7C3AED" ? "#A78BFA" : "#818CF8" }}
                >
                  {role}
                </p>
              </div>

              <p className="text-[#64748B] text-sm leading-relaxed flex-1">{desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.map(t => (
                  <span key={t} className="text-xs text-[#475569] border border-[#1E2D4A] group-hover:border-[#2563EB]/30 group-hover:text-[#64748B] px-2.5 py-1 rounded-full transition-all duration-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
