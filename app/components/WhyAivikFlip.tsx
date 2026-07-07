"use client";
import { useEffect, useRef, useState } from "react";

const FLIP_CHARS   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FLIP_HALF    = 50;
const FLIP_GAP     = 15;
const FLIP_RANDS   = 5;
const CHAR_STAGGER = 38;
const ROW_STAGGER  = 800;

function FlipChar({
  char,
  charDelay,
  triggered,
}: {
  char: string;
  charDelay: number;
  triggered: boolean;
}) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("·");
  const started  = useRef(false);
  const isSpace  = char === " ";

  useEffect(() => {
    if (isSpace || !triggered || started.current) return;
    started.current = true;
    let done = 0;

    const doFlip = (next: string) => {
      const el = innerRef.current;
      if (!el) return;
      el.style.transition = `transform ${FLIP_HALF}ms ease-in`;
      el.style.transform  = "rotateX(-90deg)";
      setTimeout(() => {
        setDisplay(next);
        el.style.transition = "none";
        el.style.transform  = "rotateX(90deg)";
        void el.offsetHeight;
        el.style.transition = `transform ${FLIP_HALF}ms ease-out`;
        el.style.transform  = "rotateX(0deg)";
        done++;
        if (done <= FLIP_RANDS) {
          setTimeout(() => {
            doFlip(done === FLIP_RANDS
              ? char
              : FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)]);
          }, FLIP_HALF + FLIP_GAP);
        }
      }, FLIP_HALF);
    };

    setTimeout(() => {
      doFlip(FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)]);
    }, charDelay);
  }, [isSpace, triggered, char, charDelay]);

  if (isSpace) return <span style={{ display: "inline-block", width: "0.4em" }} />;

  return (
    <span style={{ display: "inline-block", perspective: "500px" }}>
      <span
        ref={innerRef}
        style={{
          display: "inline-block",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden" as React.CSSProperties["backfaceVisibility"],
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "3px",
          margin: "0 1.5px",
          padding: "1px 3px",
          minWidth: "0.62em",
          textAlign: "center",
        }}
      >
        {display}
      </span>
    </span>
  );
}

function FlipTitle({ title, triggered }: { title: string; triggered: boolean }) {
  const words = title.split(" ");
  let pos = 0;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 6px", alignItems: "flex-end" }}>
      {words.map((word, wi) => {
        const wordStart = pos;
        pos += word.length + 1;
        return (
          <span key={wi} style={{ display: "inline-flex" }}>
            {word.split("").map((ch, ci) => (
              <FlipChar
                key={ci}
                char={ch}
                charDelay={(wordStart + ci) * CHAR_STAGGER}
                triggered={triggered}
              />
            ))}
          </span>
        );
      })}
    </div>
  );
}

const reasons = [
  {
    n: "01",
    title: "SENIOR ENGINEERS ONLY",
    desc: "No juniors learning on your project. Every person on your work has shipped production systems at scale.",
  },
  {
    n: "02",
    title: "GERMANY REGISTERED",
    desc: "AIVIK is a registered German company. GDPR compliant by default, built for clients who care about compliance.",
  },
  {
    n: "03",
    title: "FIXED PRICE, ALWAYS",
    desc: "We agree the scope and the number before we start. No open-ended retainers, no invoice surprises.",
  },
  {
    n: "04",
    title: "FULL STACK CAPABILITY",
    desc: "Frontend, backend, AI, hardware. One team for the whole scope — no coordination overhead between agencies.",
  },
  {
    n: "05",
    title: "EU TIMEZONE ALIGNED",
    desc: "We overlap with European business hours without friction. Async by default, present when it matters.",
  },
  {
    n: "06",
    title: "FAST TO START",
    desc: "Most projects kick off within one week of signing. No months of discovery before code gets written.",
  },
];

export default function WhyAivikFlip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(Array(reasons.length).fill(false) as boolean[]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        reasons.forEach((_, i) => {
          setTimeout(() => {
            setTriggered(prev => { const n = [...prev]; n[i] = true; return n; });
          }, i * ROW_STAGGER);
        });
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 px-6"
      style={{ backgroundColor: "var(--section-dark)", borderTop: "1px solid var(--section-dark-border)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* label */}
        <div style={{ marginBottom: 56 }}>
          <span
            className="block text-[10px] font-semibold tracking-[0.28em] uppercase mb-6"
            style={{ color: "var(--section-dark-subtle)" }}
          >
            Reference — Departure Board variant
          </span>
          <h2
            className="font-heading font-black"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-2px",
              lineHeight: 1,
              color: "var(--section-dark-text)",
            }}
          >
            Why companies<br />choose us.
          </h2>
        </div>

        {/* rows */}
        <div>
          {reasons.map(({ n, title, desc }, i) => {
            const descDelay = (title.length - 1) * CHAR_STAGGER
              + FLIP_RANDS * (FLIP_HALF * 2 + FLIP_GAP) + 100;

            return (
              <div key={n}>
                <div
                  style={{
                    height: "1px",
                    background: "var(--section-dark-border)",
                    transformOrigin: "left",
                    transform: triggered[i] ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div
                  className="flex items-start gap-6 md:gap-10 py-9 md:py-11"
                  style={{ opacity: triggered[i] ? 1 : 0, transition: "opacity 0.15s ease" }}
                >
                  <span
                    className="font-mono shrink-0"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      paddingTop: "clamp(14px, 1.5vw, 22px)",
                      color: "var(--accent-primary)",
                      width: 28,
                    }}
                  >
                    {n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-mono font-bold"
                      style={{
                        fontSize: "clamp(20px, 3.6vw, 44px)",
                        color: "var(--section-dark-text)",
                        lineHeight: 1.2,
                        marginBottom: 14,
                      }}
                    >
                      <FlipTitle title={title} triggered={triggered[i]} />
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        maxWidth: 520,
                        color: "var(--section-dark-muted)",
                        opacity: triggered[i] ? 1 : 0,
                        transition: `opacity 0.7s ${descDelay}ms ease`,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              height: "1px",
              background: "var(--section-dark-border)",
              transformOrigin: "left",
              transform: triggered[5] ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
          />
        </div>

      </div>
    </section>
  );
}
