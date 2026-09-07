import { getTranslations } from "next-intl/server";
import AIVIKLogo from "./AIVIKLogo";
import { Link } from "@/i18n/navigation";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const services = (await getTranslations("Services")).raw("list") as { title: string }[];

  return (
    <footer
      data-theme="dark"
      className="border-t pt-20 pb-10 px-6"
      style={{
        backgroundColor: "var(--section-dark)",
        borderColor: "var(--section-dark-border)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="block mb-2">
              <AIVIKLogo size="sm" variant="dark" />
            </Link>
            <p className="font-mono text-[10px] text-on-dark-muted leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Column 2 — Services */}
          <div>
            <p className="font-body text-xs text-on-dark-muted uppercase tracking-widest mb-5">
              {t("servicesHeading")}
            </p>
            <div className="flex flex-col gap-2.5">
              {services.map(({ title }) => (
                <Link
                  key={title}
                  href="/#services"
                  className="font-body text-sm link-on-dark"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 — Company */}
          <div>
            <p className="font-body text-xs text-on-dark-muted uppercase tracking-widest mb-5">
              {t("companyHeading")}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="font-body text-sm link-on-dark">
                {t("companyLinks.about")}
              </Link>
              <Link href="/#process" className="font-body text-sm link-on-dark">
                {t("companyLinks.process")}
              </Link>
              <Link href="/#contact" className="font-body text-sm link-on-dark">
                {t("companyLinks.contact")}
              </Link>
              <Link href="/impressum" className="font-body text-sm link-on-dark">
                {t("companyLinks.impressum")}
              </Link>
              <Link href="/privacy" className="font-body text-sm link-on-dark">
                {t("companyLinks.privacy")}
              </Link>
            </div>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <p className="font-body text-xs text-on-dark-muted uppercase tracking-widest mb-5">
              {t("contactHeading")}
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:info@aivik.eu"
                className="font-body text-sm link-on-dark"
              >
                info@aivik.eu
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm link-on-dark"
              >
                {t("bookCall")}
              </a>
              <a
                href="https://linkedin.com/company/aivik"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm link-on-dark"
              >
                linkedin.com/company/aivik
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--section-dark-border)" }}
        >
          <p className="font-body text-xs text-on-dark-muted">
            © {new Date().getFullYear()} AIVIK. {t("copyright")}
          </p>
          <p className="font-body text-xs text-on-dark-muted">
            {t("tagline2")}
          </p>
        </div>
      </div>
    </footer>
  );
}
