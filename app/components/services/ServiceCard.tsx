"use client";
import { Link } from "@/i18n/navigation";
import { useInView } from "./useInView";

export default function ServiceCard({
  title,
  description,
  items,
  index,
  cases,
  children,
}: {
  title: string;
  description: string;
  items: string[];
  index: number;
  /** Use cases that show this service built, linked under the list. */
  cases?: { label: string; links: { name: string; href: string }[] };
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
          {cases && (
            <p className="svc-cases">
              {cases.label}:{" "}
              {cases.links.map((c, i) => (
                <span key={c.href}>
                  {i > 0 && ", "}
                  <Link href={c.href}>{c.name}</Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
