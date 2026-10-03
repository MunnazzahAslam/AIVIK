"use client";
import { useRef, useState } from "react";

type Chapter = { at: number; label: string };

type Props = {
  src1080: string;
  src720: string;
  poster: string;
  label: string;
  chapters: Chapter[];
  chaptersLabel: string;
  chaptersHint: string;
};

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * The case video with its chapters. A native player: muted (the videos have no
 * sound), no autoplay, and only the metadata is fetched until someone presses
 * play. Each chapter is a button that jumps the video to that step.
 */
export default function UseCasePlayer({ src1080, src720, poster, label, chapters, chaptersLabel, chaptersHint }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(-1);

  const onTime = () => {
    const t = video.current?.currentTime ?? 0;
    let index = -1;
    chapters.forEach((c, i) => {
      // A small tolerance, so a chapter lights up the moment it is jumped to.
      if (t + 0.25 >= c.at) index = i;
    });
    setCurrent(index);
  };

  const jump = (at: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = at;
    v.play().catch(() => {});
  };

  return (
    <div>
      <div className="uc-player">
        <video
          ref={video}
          controls
          muted
          playsInline
          preload="metadata"
          poster={poster}
          width={1920}
          height={1080}
          aria-label={label}
          onTimeUpdate={onTime}
          onSeeked={onTime}
        >
          {/* Phones get the 720p file; everything else the 1080p one. */}
          <source src={src720} type="video/mp4" media="(max-width: 820px)" />
          <source src={src1080} type="video/mp4" />
        </video>
      </div>

      <div className="mt-5">
        <p className="uc-label mb-3" id="uc-chapters-label">
          {chaptersLabel} <span style={{ textTransform: "none", letterSpacing: 0 }}>· {chaptersHint}</span>
        </p>
        <ol className="uc-chapters" aria-labelledby="uc-chapters-label">
          {chapters.map((c, i) => (
            <li key={c.at}>
              <button type="button" className="uc-chapter font-body" aria-current={i === current ? "true" : undefined} onClick={() => jump(c.at)}>
                <span className="uc-chapter-time">{clock(c.at)}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
