"use client";
import { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function scrambleText(el: HTMLElement, finalText: string, duration: number): Promise<void> {
  return new Promise((resolve) => {
    let iteration = 0;
    const totalIterations = duration / 40;
    const resolvePerIteration = finalText.length / (totalIterations * 0.5);

    const interval = setInterval(() => {
      el.innerText = finalText
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
        el.innerText = finalText;
        clearInterval(interval);
        resolve();
      }
      iteration += 1;
    }, 40);
  });
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const duration = 1500;
    let start: number | null = null;
    let rafId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.floor(eased * to)) + suffix;
            if (p < 1) rafId = requestAnimationFrame(step);
          };
          rafId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [to, suffix]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}

const GRID_SIZE = 6;

function DotGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, 4px)`,
        gap: "18px",
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const r = Math.floor(i / GRID_SIZE);
        const c = i % GRID_SIZE;
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "#1A1A1A",
              animation: "dotPulse 2s ease-in-out infinite",
              animationDelay: `${-((r + c) / 8) * 2000}ms`,
              transition: "background-color 200ms ease",
            }}
          />
        );
      })}
    </div>
  );
}

export default function Hero() {
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const w1 = word1Ref.current;
    const w2 = word2Ref.current;
    const w3 = word3Ref.current;
    if (!w1 || !w2 || !w3) return;

    let cancelled = false;

    scrambleText(w1, "Build.", 600)
      .then(() => { if (!cancelled) return scrambleText(w2, "Scale.", 600); })
      .then(() => { if (!cancelled) return scrambleText(w3, "Automate.", 600); });

    return () => { cancelled = true; };
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      data-theme="dark"
      className="relative min-h-screen flex flex-col pt-[72px]"
      style={{ backgroundColor: "var(--section-dark)" }}
    >
      {/* Two-column main content */}
      <div className="flex-1 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 py-16 lg:py-0">

          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-center">
            <h1
              className="font-heading font-bold text-white"
              style={{ letterSpacing: "-4px", lineHeight: "0.85" }}
            >
              <span
                ref={word1Ref}
                className="block text-[48px] md:text-[64px] lg:text-[96px]"
              >
                Build.
              </span>
              <span
                ref={word2Ref}
                className="block text-[48px] md:text-[64px] lg:text-[96px]"
              >
                Scale.
              </span>
              <span
                ref={word3Ref}
                className="block text-[48px] md:text-[64px] lg:text-[96px]"
              >
                Automate.
              </span>
            </h1>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative flex flex-col justify-center lg:pl-20">
            <p
              className="animate-fade-in-up font-body text-lg leading-[1.7]"
              style={{ color: "var(--section-dark-muted)", animationDelay: "0.3s", maxWidth: 420 }}
            >
              We turn complex business problems into intelligent technology
              solutions that scale with your ambition and grow with your vision.
            </p>

            <div
              className="animate-fade-in-up flex flex-col sm:flex-row gap-3 mt-10"
              style={{ animationDelay: "0.5s" }}
            >
              <button
                onClick={scrollToContact}
                className="font-body text-sm font-semibold bg-white text-black px-7 py-[14px] hover:bg-[#F0F0F0] transition-colors duration-200 text-center"
              >
                Get a Quote
              </button>
              <button
                onClick={scrollToServices}
                className="font-body text-sm font-semibold bg-transparent border border-[#333333] text-white px-7 py-[14px] hover:border-white transition-colors duration-200 text-center"
              >
                Explore our services
              </button>
            </div>

            {/* Wave dot grid — desktop only, subtle background element */}
            <div className="hidden lg:block absolute bottom-0 right-0">
              <DotGrid />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: "1px solid var(--section-dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 py-8">
            {[
              { to: 5, suffix: "+", label: "Years of engineering excellence" },
              { to: 6, suffix: "", label: "Industries transformed" },
              { to: 20, suffix: "+", label: "Solutions delivered to scale" },
            ].map(({ to, suffix, label }, i) => (
              <div
                key={label}
                className="text-center px-4 md:px-8"
                style={{
                  borderRight: i < 2 ? "1px solid var(--section-dark-border)" : "none",
                }}
              >
                <div className="font-heading text-[28px] md:text-[48px] font-bold text-white leading-none mb-2">
                  <CountUp to={to} suffix={suffix} />
                </div>
                <p
                  className="font-body text-[11px] md:text-[13px] leading-snug"
                  style={{ color: "var(--section-dark-muted)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
