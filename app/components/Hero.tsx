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

function DotGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 3px)",
        gap: "16px",
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => {
        const r = Math.floor(i / 5);
        const c = i % 5;
        return (
          <div
            key={i}
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "#1A1A1A",
              animation: "dotPulse 2s ease-in-out infinite",
              animationDelay: `${-((r + c) / 8) * 2000}ms`,
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
  const [labelVisible, setLabelVisible] = useState(false);

  useEffect(() => {
    const DURATION = 1200;
    const STAGGER = 300;
    const cleanups: (() => void)[] = [];

    if (word1Ref.current) {
      cleanups.push(scrambleText(word1Ref.current, "Build.", DURATION));
    }

    const t1 = setTimeout(() => {
      if (word2Ref.current) {
        cleanups.push(scrambleText(word2Ref.current, "Scale.", DURATION));
      }
    }, DURATION + STAGGER);
    cleanups.push(() => clearTimeout(t1));

    const t2 = setTimeout(() => {
      if (word3Ref.current) {
        cleanups.push(scrambleText(word3Ref.current, "Automate.", DURATION));
      }
    }, (DURATION + STAGGER) * 2);
    cleanups.push(() => clearTimeout(t2));

    const t3 = setTimeout(
      () => setLabelVisible(true),
      (DURATION + STAGGER) * 2 + DURATION + 100
    );
    cleanups.push(() => clearTimeout(t3));

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col bg-black pt-[72px]">
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
              className="animate-fade-in-up font-body text-lg text-[#888888] max-w-[420px] leading-[1.7]"
              style={{ animationDelay: "0.3s" }}
            >
               We turn complex business problems into intelligent technology solutions that scale with your ambition and grow with your vision. </p>

            <div
              className="animate-fade-in-up flex flex-col sm:flex-row gap-3 mt-10"
              style={{ animationDelay: "0.5s" }}
            >
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm font-semibold bg-white text-black px-7 py-[14px] hover:bg-[#F0F0F0] transition-colors duration-200 text-center"
              >
                Get a Quote
              </a>
              <a
                href="#services"
                className="font-body text-sm font-semibold bg-transparent border border-[#333333] text-white px-7 py-[14px] hover:border-white transition-colors duration-200 text-center"
              >
                See our work
              </a>
            </div>

            {/* Dot grid — desktop only, bottom-right of column */}
            <div className="hidden lg:block absolute bottom-0 right-0">
              <DotGrid />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-[#1A1A1A] py-8">
            <div className="text-center px-4 md:px-8">
              <div className="font-heading text-[28px] md:text-[48px] font-bold text-white leading-none mb-2">
                <CountUp to={5} suffix="+" />
              </div>
              <p className="font-body text-[11px] md:text-[13px] text-[#888888] leading-snug">
                Years of engineering excellence
              </p>
            </div>
            <div className="text-center px-4 md:px-8">
              <div className="font-heading text-[28px] md:text-[48px] font-bold text-white leading-none mb-2">
                <CountUp to={6} />
              </div>
              <p className="font-body text-[11px] md:text-[13px] text-[#888888] leading-snug">
                Industries transformed
              </p>
            </div>
            <div className="text-center px-4 md:px-8">
              <div className="font-heading text-[28px] md:text-[48px] font-bold text-white leading-none mb-2">
                <CountUp to={20} suffix="+" />
              </div>
              <p className="font-body text-[11px] md:text-[13px] text-[#888888] leading-snug">
                Solutions delivered to scale
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
