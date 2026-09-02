"use client";
import { useEffect, useState } from "react";

// SVG SMIL animations (<animate>, <animateMotion>, <animateTransform>) aren't
// covered by the prefers-reduced-motion CSS media query, so components using
// them check this directly and skip rendering those elements when true.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
