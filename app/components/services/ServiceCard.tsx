"use client";
import { useInView } from "./useInView";

export default function ServiceCard({
  title,
  index,
  children,
}: {
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`svc-card${inView ? " svc-in-view" : ""}`}
      style={{ transitionDelay: `${index * 80 + 20}ms` }}
    >
      <div className="svc-box">{children}</div>
      <div className="svc-title font-heading font-bold">{title}</div>
    </div>
  );
}
