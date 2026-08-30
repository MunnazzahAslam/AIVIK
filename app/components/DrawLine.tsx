"use client";
import { useEffect, useRef, useState } from "react";

export default function DrawLine() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        height: 1,
        background: "var(--section-light-border)",
        marginBottom: 44,
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform 1s cubic-bezier(0.16,1,0.3,1)",
      }}
    />
  );
}
