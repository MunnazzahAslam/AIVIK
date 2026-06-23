export default function Footer() {
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
            <a href="/" className="block mb-4">
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                AIVIK
              </span>
            </a>
            <p className="font-mono text-[11px] text-[#888888] mb-4">
              Think it. Build it. AIVIK.
            </p>
            <p className="font-mono text-[10px] text-[#444444] leading-relaxed">
              Registered in Germany · GDPR Compliant
            </p>
          </div>

          {/* Column 2 — Services */}
          <div>
            <p className="font-body text-xs text-[#444444] uppercase tracking-widest mb-5">
              Services
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Custom Software Development",
                "AI and Automation",
                "Cloud Infrastructure",
                "Data Analysis",
              ].map((label) => (
                <a
                  key={label}
                  href="#services"
                  className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 — Company */}
          <div>
            <p className="font-body text-xs text-[#444444] uppercase tracking-widest mb-5">
              Company
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="#about"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#process"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                Process
              </a>
              <a
                href="#contact"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
              <a
                href="/impressum"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                Impressum
              </a>
              <a
                href="/privacy"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <p className="font-body text-xs text-[#444444] uppercase tracking-widest mb-5">
              Get in touch
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:info@aivik.eu"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                info@aivik.eu
              </a>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                Book a call
              </a>
              <a
                href="https://linkedin.com/company/aivik"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
              >
                linkedin.com/company/aivik
              </a>
              <p className="font-body text-sm text-[#888888]">
                Munich, Germany
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--section-dark-border)" }}
        >
          <p className="font-body text-xs text-[#444444]">
            © 2026 AIVIK. All rights reserved.
          </p>
          <p className="font-body text-xs text-[#444444]">
            Built by engineers. Delivered with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
