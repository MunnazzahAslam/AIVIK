"use client";
import { useRef, useState } from "react";
import Image from "next/image";

type Item = { src: string; width: number; height: number; alt: string };

type Props = {
  items: Item[];
  /** "Open image {n} full size", with {n} still in place. */
  openLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
};

/** The project's still images. Each opens full size in a dialog (Esc or the Close button leaves it). */
export default function UseCaseGallery({ items, openLabel, closeLabel, prevLabel, nextLabel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);

  const open = (i: number) => {
    setIndex(i);
    setShown(true);
    dialog.current?.showModal();
  };
  const step = (by: number) => setIndex((i) => (i + by + items.length) % items.length);
  const item = items[index];

  return (
    <>
      <ul className="uc-gallery" style={{ listStyle: "none" }}>
        {items.map((it, i) => (
          <li key={it.src}>
            <button type="button" className="uc-thumb w-full" onClick={() => open(i)} aria-label={openLabel.replace("{n}", String(i + 1))}>
              <Image src={it.src} alt={it.alt} fill sizes="(max-width: 760px) 100vw, 380px" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="uc-lightbox"
        aria-label={item.alt}
        onClose={() => setShown(false)}
        onClick={(e) => {
          // A click on the dark area around the image closes it.
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {shown && (
          <div className="uc-lightbox-inner">
            <div className="flex items-center justify-between gap-3">
              <p className="uc-label">
                {index + 1} / {items.length}
              </p>
              <button type="button" onClick={() => dialog.current?.close()} autoFocus>
                {closeLabel}
              </button>
            </div>
            <div className="uc-lightbox-stage">
              <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => step(-1)}>
                ← {prevLabel}
              </button>
              <p className="font-body text-sm text-on-dark-muted text-center hidden sm:block">{item.alt}</p>
              <button type="button" onClick={() => step(1)}>
                {nextLabel} →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
