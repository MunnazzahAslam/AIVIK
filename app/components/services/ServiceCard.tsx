"use client";
import { Link } from "@/i18n/navigation";
import { useInView } from "./useInView";

export default function ServiceCard({
  title,
  description,
  items,
  index,
  more,
  children,
}: {
  title: string;
  description: string;
  items: string[];
  index: number;
  /** The service's own page. */
  more: { label: string; href: string };
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
      <div className="svc-reveal">
        <div className="svc-reveal-inner">
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
          <p className="svc-cases">
            <Link href={more.href} aria-label={`${more.label}: ${title}`}>
              {more.label} →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
