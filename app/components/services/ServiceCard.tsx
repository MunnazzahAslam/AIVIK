export default function ServiceCard({
  title,
  description,
  items,
  children,
}: {
  title: string;
  description: string;
  items: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="service-card">
      <div className="service-card-art">
        {children}
        <div className="service-card-details">
          <p className="service-card-details-desc">{description}</p>
          <div className="service-card-details-divider" />
          <ul className="service-card-details-list">
            {items.map((item) => (
              <li key={item}>
                <span aria-hidden="true">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h3 className="service-card-title font-heading font-bold">{title}</h3>
    </div>
  );
}
