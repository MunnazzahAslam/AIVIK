"use client";
import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";
import DrawLine from "../components/DrawLine";
import AmbientGlow from "../components/AmbientGlow";

const SECTIONS = [
  {
    number: "01",
    headline: "The pilot is not the product.",
    body: "Most AI projects succeed in demo and fail in production. The model works. The integration doesn't. The data isn't clean. Nobody owns it after launch. We've seen this pattern often enough to build our entire practice around preventing it. We don't sell pilots. We build systems that survive contact with real operations — and we stay until they do.",
  },
  {
    number: "02",
    headline: "Bad data makes bad AI.",
    body: "Every AI system is only as reliable as the data underneath it. Most businesses want to start with the intelligence layer — the chatbot, the automation, the prediction model. We always start with the data layer. Not because it's more interesting, but because automating a broken process just breaks it faster, at scale. Clean, connected, structured data is the only foundation that holds.",
  },
  {
    number: "03",
    headline: "Your biggest inefficiency isn't where you think it is.",
    body: "The hours lost to manual reporting, approval chains, and knowledge fragmentation are rarely visible on a balance sheet. They don't show up in a board presentation. They live in the gap between what your best people could be doing and what they spend their time on instead. That gap is where we work. It's also where the highest return on any AI investment lives — not in the technology, but in reclaiming that time.",
  },
  {
    number: "04",
    headline: "Sovereignty is not a feature. It's a requirement.",
    body: "For any business operating under GDPR, the EU AI Act, or UAE data residency law, where your data is processed and stored is not a preference — it's a compliance obligation. We build on infrastructure that meets those requirements by design, not by retrofit. If a vendor can't tell you exactly where your data lives, that's the answer.",
  },
  {
    number: "05",
    headline: "We tell you if we're not the right fit.",
    body: "Before any engagement, we run a structured diagnostic. If the numbers don't justify the investment, we say so. If the problem is better solved by a different approach, we say that too. We'd rather lose a project than deliver one that doesn't move the needle. This is not a common position in this industry. We think it should be.",
  },
] as const;

export default function ThinkingContent() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <main>
      <Nav />

      {/* Page header */}
      <section
        data-theme="dark"
        style={{
          background: "var(--section-dark)",
          position: "relative",
          overflow: "hidden",
          padding: "200px 24px 120px",
        }}
      >
        <AmbientGlow />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <p
              className="font-mono font-medium"
              style={{
                fontSize: 13,
                letterSpacing: "0.14em",
                color: "#2563EB",
                marginBottom: 28,
                textTransform: "uppercase",
              }}
            >
              How we think
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(40px, 5.5vw, 64px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                color: "var(--section-dark-text)",
                marginBottom: 28,
              }}
            >
              How we approach
              <br />
              the work.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p
              className="font-body"
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--section-dark-muted)",
                maxWidth: 560,
              }}
            >
              These are the things we believe strongly enough to turn down work
              that contradicts them.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section
        data-theme="light"
        style={{ background: "var(--section-light)", padding: "140px 24px" }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {SECTIONS.map((section, i) => (
            <FadeIn key={section.number}>
              <div style={{ marginBottom: i === SECTIONS.length - 1 ? 0 : 112 }}>
                <DrawLine />
                <p
                  className="font-mono font-semibold"
                  style={{
                    fontSize: 14,
                    letterSpacing: "0.04em",
                    color: "#2563EB",
                    marginBottom: 20,
                  }}
                >
                  {section.number}
                </p>
                <h2
                  className="font-heading font-bold"
                  style={{
                    fontSize: "clamp(26px, 3.2vw, 36px)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    color: "var(--section-light-text)",
                    marginBottom: 24,
                  }}
                >
                  {section.headline}
                </h2>
                <p
                  className="font-body"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    color: "var(--section-light-muted)",
                  }}
                >
                  {section.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section
        data-theme="dark"
        style={{
          background: "var(--section-dark)",
          position: "relative",
          overflow: "hidden",
          padding: "140px 24px",
          textAlign: "center",
        }}
      >
        <AmbientGlow />
        <div style={{ position: "relative" }}>
          <FadeIn>
            <p
              className="font-body"
              style={{ fontSize: 19, color: "var(--section-dark-muted)", marginBottom: 20 }}
            >
              If this is how you want to work:
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <a
              href="/#contact"
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              className="font-heading font-bold"
              style={{
                display: "inline-block",
                fontSize: "clamp(28px, 4.2vw, 46px)",
                letterSpacing: "-0.015em",
                color: "var(--section-dark-text)",
                textDecoration: "none",
                marginBottom: 22,
              }}
            >
              Book a free operations audit{" "}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  transition: "transform 250ms ease",
                  transform: ctaHovered ? "translateX(6px)" : "translateX(0)",
                }}
              >
                →
              </span>
            </a>
          </FadeIn>
          <FadeIn delay={200}>
            <p
              className="font-mono font-medium"
              style={{ fontSize: 13, letterSpacing: "0.1em", color: "#2563EB", textTransform: "uppercase" }}
            >
              Consider it done.
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
