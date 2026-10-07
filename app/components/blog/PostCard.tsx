import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { blogPath, formatDate, type PostSummary } from "@/lib/blog";

type Props = {
  post: PostSummary;
  readLabel: string;
  minutesLabel: string;
  /** Heading level of the title: h2 on the index page, h3 under an article. */
  as?: "h2" | "h3";
  /** Load the cover eagerly when the card is above the fold. */
  priority?: boolean;
};

/** An article as a card, the same dark card as a use case: cover, date and reading time, title, summary and tags. */
export default function PostCard({ post, readLabel, minutesLabel, as: Heading = "h2", priority }: Props) {
  return (
    <Link href={blogPath(post.slug)} className="uc-card">
      <div className="uc-card-media">
        {/* SVG covers are served as they are; photos go through the image optimiser. */}
        <Image src={post.cover} alt="" fill sizes="(max-width: 760px) 100vw, 560px" priority={priority} unoptimized={post.cover.endsWith(".svg")} style={post.coverFocus ? { objectPosition: post.coverFocus } : undefined} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="uc-label">
          <time dateTime={post.date}>{formatDate(post.locale, post.date)}</time> · {minutesLabel}
        </p>
        <Heading className="font-heading font-bold mt-2" style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.2, letterSpacing: "-0.5px", color: "var(--section-dark-text)" }}>
          {post.title}
        </Heading>
        <p className="font-body text-[15px] leading-relaxed mt-3 text-on-dark-muted">{post.description}</p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="uc-badge">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="font-body text-sm font-semibold mt-auto pt-6" style={{ color: "var(--section-dark-text)" }}>
          {readLabel}{" "}
          <span className="uc-card-arrow inline-block" aria-hidden="true">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
