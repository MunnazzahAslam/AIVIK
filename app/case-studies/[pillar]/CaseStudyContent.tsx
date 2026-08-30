"use client";
import { useState } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import FadeIn from "../../components/FadeIn";
import DrawLine from "../../components/DrawLine";
import AmbientGlow from "../../components/AmbientGlow";
import type { PillarContent } from "../data";

export default function CaseStudyContent({ content }: { content: PillarContent }) {
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
            <a
              href="/#services"
              className="font-mono"
              style={{
                display: "inline-block",
                fontSize: 13,
                color: "var(--section-dark-muted)",
                textDecoration: "none",
                marginBottom: 32,
              }}
            >
              ← Services
            </a>
          </FadeIn>
          <FadeIn delay={60}>
            <p
              className="font-mono font-medium"
              style={{
                fontSize: 13,
                letterSpacing: "0.14em",
                color: "#2563EB",
                marginBottom: 28,
              }}
            >
              {content.label}
            </p>
          </FadeIn>
          <FadeIn delay={120}>
            <h1
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--section-dark-text)",
                marginBottom: 28,
              }}
            >
              {content.h1}
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p
              className="font-body"
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--section-dark-muted)",
                maxWidth: 560,
              }}
            >
              Evidence from across the industries we work in. The problems are
              documented. So are the returns.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section
        data-theme="light"
        style={{ background: "var(--section-light)", padding: "120px 24px 140px" }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeIn>
            <p
              className="font-body italic"
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: "var(--section-light-muted)",
                maxWidth: 560,
                margin: "0 auto 100px",
                textAlign: "center",
              }}
            >
              These are not Aivik case studies. They are documented outcomes
              from across the industry: the problems our clients face and the
              returns others have achieved solving them. Our own case studies
              will be published here as engagements complete.
            </p>
          </FadeIn>

          {content.entries.map((entry, i) => (
            <FadeIn key={entry.label}>
              <div style={{ marginBottom: i === content.entries.length - 1 ? 0 : 96 }}>
                <DrawLine />
                <p
                  className="font-mono font-semibold"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    color: "#2563EB",
                    marginBottom: 18,
                  }}
                >
                  {entry.label}
                </p>
                <h2
                  className="font-heading font-bold"
                  style={{
                    fontSize: "clamp(24px, 2.6vw, 28px)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    color: "var(--section-light-text)",
                    marginBottom: 20,
                  }}
                >
                  {entry.headline}
                </h2>
                <p
                  className="font-body"
                  style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "var(--section-light-muted)",
                    marginBottom: 22,
                  }}
                >
                  {entry.body}
                </p>
                <p
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.02em",
                    color: "var(--section-light-border)",
                  }}
                >
                  {entry.source}
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
              Seen enough?
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
