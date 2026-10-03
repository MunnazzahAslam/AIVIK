"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  href: string;
  brand: string;
  headline: string;
  industry: string;
  proves: string;
  viewLabel: string;
  poster: string;
  teaser: string;
  /** Heading level of the headline: h2 on the index page, h3 inside the home page's section. */
  as?: "h2" | "h3";
  /** Load the cover eagerly when the card is above the fold. */
  priority?: boolean;
};

/**
 * A use case as a card: cover, brand, headline and its industry and service. On a desktop with a
 * mouse the cover plays a short silent loop on hover; on phones, and for
 * visitors who prefer reduced motion, it stays a still image.
 */
export default function UseCaseCard({ href, brand, headline, industry, proves, viewLabel, poster, teaser, as: Heading = "h2", priority }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  // The loop is only fetched once the card is first hovered.
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);

  const canLoop = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const start = () => {
    if (!canLoop()) return;
    setLoop(true);
    video.current?.play().catch(() => {});
  };
  const stop = () => {
    setPlaying(false);
    const v = video.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <Link href={href} className="uc-card" onPointerEnter={start} onPointerLeave={stop}>
      <div className="uc-card-media">
        <Image src={poster} alt="" fill sizes="(max-width: 760px) 100vw, 560px" priority={priority} />
        {loop && (
          <video
            ref={video}
            src={teaser}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className={playing ? "is-playing" : ""}
            onPlaying={() => setPlaying(true)}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="uc-label">{brand}</p>
        <Heading className="font-heading font-bold mt-2" style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.2, letterSpacing: "-0.5px", color: "var(--section-dark-text)" }}>
          {headline}
        </Heading>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="uc-badge">{industry}</span>
          <span className="uc-badge">{proves}</span>
        </div>
        <p className="font-body text-sm font-semibold mt-auto pt-6" style={{ color: "var(--section-dark-text)" }}>
          {viewLabel}{" "}
          <span className="uc-card-arrow inline-block" aria-hidden="true">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
