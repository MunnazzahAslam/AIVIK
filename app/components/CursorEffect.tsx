"use client";
import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef  = useRef<number | null>(null);
  const target  = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top  = e.clientY + "px";
      if (!visible.current) {
        visible.current    = true;
        dot.style.opacity  = "1";
        ring.style.opacity = "1";
        ringPos.current    = { x: e.clientX, y: e.clientY };
      }
    };

    const onLeave = () => {
      visible.current    = false;
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
    };

    // Expand ring over interactive elements
    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement).closest("a, button, [data-cursor-expand]");
      ring.style.width       = interactive ? "46px" : "34px";
      ring.style.height      = interactive ? "46px" : "34px";
      ring.style.borderColor = interactive ? "rgba(37,99,235,0.7)" : "#2563EB";
    };

    const loop = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.13;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.13;
      ring.style.left = ringPos.current.x + "px";
      ring.style.top  = ringPos.current.y + "px";
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover",  onOver);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover",  onOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position:      "fixed",
          width:         7,
          height:        7,
          borderRadius:  "50%",
          background:    "#fff",
          transform:     "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity:       0,
          zIndex:        9999,
          transition:    "opacity 200ms",
          mixBlendMode:  "difference",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position:      "fixed",
          width:         34,
          height:        34,
          borderRadius:  "50%",
          border:        "1.5px solid #2563EB",
          transform:     "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity:       0,
          zIndex:        9998,
          transition:    "opacity 200ms, width 300ms cubic-bezier(0.16,1,0.3,1), height 300ms cubic-bezier(0.16,1,0.3,1), border-color 200ms",
        }}
      />
    </>
  );
}
