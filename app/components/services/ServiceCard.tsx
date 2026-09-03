"use client";
import { useInView } from "./useInView";

export default function ServiceCard({
  title,
  description,
  items,
  index,
  children,
}: {
  title: string;
  description: string;
  items: string[];
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
      <p className="svc-description">{description}</p>
      <div className="svc-divider" aria-hidden="true" />
      <ul className="svc-items">
        {items.map((item) => (
          <li key={item} className="svc-item">
            <span className="svc-item-arrow" aria-hidden="true">→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
