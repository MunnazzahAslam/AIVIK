"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { scrambleFrame } from "@/lib/scrambleText";
import SectionCurve from "./SectionCurve";

// Three.js is heavy and purely decorative (aria-hidden) — code-split it out
// of the initial Hero bundle instead of loading it on every page view.
const GlobeBackground = dynamic(() => import("./GlobeBackground"), {
  ssr: false,
});

function scrambleText(el: HTMLElement, finalText: string, duration: number): Promise<void> {
  return new Promise((resolve) => {
    let iteration = 0;
    const totalIterations = duration / 40;
    const resolvePerIteration = finalText.length / (totalIterations * 0.5);

    const interval = setInterval(() => {
      el.innerText = scrambleFrame(
        finalText,
        Math.floor(iteration * resolvePerIteration),
        " ."
      );

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
      className="relative flex flex-col pt-[72px]"
      style={{ backgroundColor: "var(--section-dark)", minHeight: "calc(100vh + 110px)", zIndex: 0 }}
    >
      <GlobeBackground />

      {/* Fixed to the first viewport (minus nav padding) so the curve at the
          section's bottom stays below the fold instead of poking into view
          on first load — only appears once the user scrolls past 100vh. */}
      <div
        className="relative z-10 flex items-center px-6"
        style={{ height: "calc(100vh - 72px)" }}
      >
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
              We design intelligent software, AI solutions, and digital platforms that help businesses automate operations, accelerate growth, and stay ahead in a rapidly evolving world.</p>

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

          </div>
        </div>
      </div>
      <SectionCurve fill="#f7f7f7" direction="dip" />
    </section>
  );
}
