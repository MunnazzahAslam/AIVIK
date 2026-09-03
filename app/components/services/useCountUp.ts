"use client";
import { useEffect, useState } from "react";

// Counts from 0 to target once `active` becomes true (paired with
// useInView so it fires on scroll-into-view), easing out. Under reduced
// motion it jumps straight to the target instead of animating.
export function useCountUp(
  target: number,
  active: boolean,
  { decimals = 0, duration = 1100, reduced = false }: { decimals?: number; duration?: number; reduced?: boolean } = {}
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, target, duration]);

  return value.toFixed(decimals);
}
