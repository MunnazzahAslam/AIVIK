"use client";
import { useEffect, useRef } from "react";

const ACCENT = "#2563EB";

function DocSvg() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <rect x="10" y="6" width="22" height="28" rx="2" stroke="#FFFFFF" strokeWidth={1} fill="none" />
      <line x1="14" y1="14" x2="28" y2="14" stroke="#FFFFFF" strokeWidth={1} />
      <line x1="14" y1="19" x2="28" y2="19" stroke="#FFFFFF" strokeWidth={1} />
      <line x1="14" y1="24" x2="22" y2="24" stroke="#FFFFFF" strokeWidth={1} />
      <path d="M20 31 Q23 28 26 31 Q29 34 32 30" stroke={ACCENT} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function NodeSvg() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="4" stroke="#FFFFFF" strokeWidth={1} fill="none" />
      <line x1="24" y1="20" x2="24" y2="8" stroke="#FFFFFF" strokeWidth={1} />
      <line x1="24" y1="28" x2="24" y2="40" stroke="#FFFFFF" strokeWidth={1} />
      <line x1="20" y1="24" x2="8" y2="24" stroke="#FFFFFF" strokeWidth={1} />
      <line x1="28" y1="24" x2="40" y2="24" stroke="#FFFFFF" strokeWidth={1} />
    </svg>
  );
}

function HexGridSvg() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <polygon points="24,8 32,13 32,23 24,28 16,23 16,13" stroke="#FFFFFF" strokeWidth={1} fill="none" />
      <polygon points="24,20 29,23 29,29 24,32 19,29 19,23" stroke="#FFFFFF" strokeWidth={0.7} fill="none" opacity={0.6} />
      <circle cx="24" cy="24" r="2" fill={ACCENT} />
      <line x1="24" y1="8" x2="24" y2="4" stroke="#FFFFFF" strokeWidth={0.7} opacity={0.4} />
      <line x1="32" y1="13" x2="36" y2="11" stroke="#FFFFFF" strokeWidth={0.7} opacity={0.4} />
      <line x1="16" y1="13" x2="12" y2="11" stroke="#FFFFFF" strokeWidth={0.7} opacity={0.4} />
    </svg>
  );
}

function MomentumSvg() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <polyline
        points="8,38 16,28 24,22 34,14 40,9"
        stroke="#FFFFFF"
        strokeWidth={1}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="9" r="3" fill={ACCENT} />
      <circle cx="40" cy="9" r="6" stroke={ACCENT} strokeWidth={0.7} fill="none" opacity={0.4} />
    </svg>
  );
}

function OrbitalSvg() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="14" stroke="#FFFFFF" strokeWidth={1} fill="none" />
      <circle cx="24" cy="24" r="8" stroke="#FFFFFF" strokeWidth={0.7} fill="none" opacity={0.5} />
      <circle cx="24" cy="24" r="3" fill={ACCENT} />
      <circle cx="38" cy="24" r="2" fill="#FFFFFF" opacity={0.7} />
    </svg>
  );
}

function LoopSvg() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <path
        d="M16,24 C16,17 22,13 28,16 C34,19 34,29 28,32 C22,35 16,31 16,24 Z"
        stroke="#FFFFFF"
        strokeWidth={1}
        fill="none"
      />
      <path
        d="M32,24 C32,31 26,35 20,32 C14,29 14,19 20,16 C26,13 32,17 32,24 Z"
        stroke="#FFFFFF"
        strokeWidth={0.6}
        fill="none"
        opacity={0.4}
      />
      <circle cx="28" cy="16" r="2.5" fill={ACCENT} />
    </svg>
  );
}

type CardData = {
  title: string;
  sub: string;
  Svg: () => JSX.Element;
};

const CARDS: CardData[] = [
  {
    title: "You own everything, always.",
    sub: "Full IP transfer on every engagement. No lock-in, no licence fees after handoff.",
    Svg: DocSvg,
  },
  {
    title: "One point of contact.",
    sub: "One person accountable for the whole engagement — not a rotating cast of account managers.",
    Svg: NodeSvg,
  },
  {
    title: "Germany registered. GDPR native.",
    sub: "Not retrofitted for compliance. Built inside it from the start.",
    Svg: HexGridSvg,
  },
  {
    title: "Working software, week one.",
    sub: "We ship something real in the first sprint. Not a discovery phase that lasts three months.",
    Svg: MomentumSvg,
  },
  {
    title: "AI-native by default.",
    sub: "Not a traditional agency that bolted on an AI practice. Built around intelligence from day one.",
    Svg: OrbitalSvg,
  },
  {
    title: "We stay after launch.",
    sub: "Ongoing support, monitoring and tuning as your operations change. We don't hand off and disappear.",
    Svg: LoopSvg,
  },
];

function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLS = 12;
    const ROWS = 8;
    const pts: { bx: number; by: number; ox: number; oy: number; vx: number; vy: number }[] = [];
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        pts.push({
          bx: c / COLS,
          by: r / ROWS,
          ox: 0,
          oy: 0,
          vx: (Math.random() - 0.5) * 0.0004,
          vy: (Math.random() - 0.5) * 0.0004,
        });
      }
    }

    let raf: number;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (!prefersReduced) {
        pts.forEach((p) => {
          p.ox += p.vx;
          p.oy += p.vy;
          if (Math.abs(p.ox) > 0.015) p.vx *= -1;
          if (Math.abs(p.oy) > 0.015) p.vy *= -1;
        });
      }

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const i = r * (COLS + 1) + c;
          const p = pts[i];
          const px = (p.bx + p.ox) * w;
          const py = (p.by + p.oy) * h;

          if (c < COLS) {
            const p2 = pts[i + 1];
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo((p2.bx + p2.ox) * w, (p2.by + p2.oy) * h);
            ctx.strokeStyle = "rgba(255,255,255,0.06)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          if (r < ROWS) {
            const p2 = pts[i + (COLS + 1)];
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo((p2.bx + p2.ox) * w, (p2.by + p2.oy) * h);
            ctx.strokeStyle = "rgba(255,255,255,0.06)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.fill();
        }
      }

      if (!prefersReduced) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

function WhyCard({ title, sub, Svg }: CardData) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 560 || reducedMotionRef.current) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateZ(8px)`;
    card.style.transition = "transform 0.08s ease-out";
  };

  const onEnter = () => {
    const card = cardRef.current;
    const dot = dotRef.current;
    const svg = svgRef.current;
    if (!card || !dot || !svg) return;
    card.style.borderColor = "rgba(37,99,235,0.45)";
    card.style.boxShadow = "0 0 0 1px rgba(37,99,235,0.12), 0 20px 60px rgba(37,99,235,0.08)";
    dot.style.transform = "scale(1.4)";
    dot.style.boxShadow = "0 0 12px 3px rgba(37,99,235,0.6)";
    svg.style.opacity = "0.18";
    svg.style.transform = "scale(1.06)";
  };

  const onLeave = () => {
    const card = cardRef.current;
    const dot = dotRef.current;
    const svg = svgRef.current;
    if (!card || !dot || !svg) return;
    card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    card.style.transition = "transform 0.45s ease-out, border-color 0.3s ease, box-shadow 0.3s ease";
    card.style.borderColor = "rgba(255,255,255,0.08)";
    card.style.boxShadow = "none";
    dot.style.transform = "scale(1)";
    dot.style.boxShadow = "none";
    svg.style.opacity = "0.07";
    svg.style.transform = "scale(1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="rounded-2xl p-8"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor: "default",
        willChange: "transform",
      }}
    >
      <div
        ref={dotRef}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: ACCENT,
          marginBottom: 20,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        aria-hidden="true"
      />

      <div
        ref={svgRef}
        style={{
          opacity: 0.07,
          transform: "scale(1)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          marginBottom: 24,
        }}
        aria-hidden="true"
      >
        <Svg />
      </div>

      <h3
        className="font-heading font-semibold"
        style={{
          fontSize: 18,
          color: "#FFFFFF",
          margin: "0 0 10px",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>

      <p
        className="font-body"
        style={{
          fontSize: 13.5,
          fontWeight: 400,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {sub}
      </p>
    </div>
  );
}

export default function WhyAivik() {
  return (
    <section
      id="why-aivik"
      data-theme="dark"
      className="relative overflow-hidden py-32"
      style={{ background: "var(--section-dark)" }}
    >
      <MeshBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <p
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: ACCENT,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          Why Aivik
        </p>

        <h2
          className="font-heading font-bold"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "#FFFFFF",
            marginBottom: 64,
            maxWidth: 560,
            lineHeight: 1.15,
          }}
        >
          Built different.
          <br />
          On purpose.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <WhyCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
