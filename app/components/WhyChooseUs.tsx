"use client";
import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function scrambleText(
  el: HTMLElement,
  finalText: string,
  duration: number
): () => void {
  let iteration = 0;
  const totalIterations = duration / 40;
  const resolvePerIteration = finalText.length / (totalIterations * 0.5);

  const interval = setInterval(() => {
    el.textContent = finalText
      .split("")
      .map((char, index) => {
        if (char === " " || char === ".") return char;
        if (index < Math.floor(iteration * resolvePerIteration)) {
          return finalText[index];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");

    if (iteration >= totalIterations) {
      el.textContent = finalText;
      clearInterval(interval);
    }
    iteration += 1;
  }, 40);

  return () => clearInterval(interval);
}

const cards = [
  {
    number: "01",
    title: "Germany Registered",
    description:
      "AIVIK is a registered German company. GDPR compliant by default. European clients get a European partner.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="12" />
        <path d="M16 4a12 12 0 010 24M16 4a12 12 0 000 24M4 16h24" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "EU Timezone Aligned",
    description:
      "We overlap with European business hours without friction. Async by default, available when it matters.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="12" />
        <path d="M16 8v8l5 3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Fast to Start",
    description:
      "Most projects start within one week of signing. No months of discovery before a line of code is written.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 4L7 18h10l-2 10 10-14H15z" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          scrambleText(heading, "WHY AIVIK", 1200);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setCardsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 md:py-[120px] px-6"
      style={{
        background:
          "linear-gradient(135deg, #000 0%, #0A0A0A 50%, #000 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientShift 8s ease alternate infinite",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2
            ref={headingRef}
            className="font-heading font-black text-white"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              letterSpacing: "-2px",
              lineHeight: "1",
            }}
          >
            WHY AIVIK
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A1A]">
          {cards.map(({ number, title, description, icon }, i) => {
            const isHovered = hoveredCard === i;
            return (
              <div
                key={number}
                className="bg-[#111111] p-10 flex flex-col gap-6 cursor-default"
                style={{
                  border: `1px solid ${isHovered ? "#FFFFFF" : "#1A1A1A"}`,
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms, border-color 200ms ease`,
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <span
                  className="font-mono text-[11px]"
                  style={{
                    color: isHovered ? "#888888" : "#444444",
                    transition: "color 200ms ease",
                  }}
                >
                  {number}
                </span>

                <div className="text-white">{icon}</div>

                <h3
                  className="font-heading text-xl font-bold text-white"
                  style={{
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                    transformOrigin: "left",
                    transition: "transform 200ms ease",
                  }}
                >
                  {title}
                </h3>

                <p className="font-body text-sm text-[#888888] leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
