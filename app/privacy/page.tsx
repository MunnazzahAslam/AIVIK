export default function Privacy() {
  return (
    <main className="min-h-screen px-6 py-24" style={{ backgroundColor: "var(--section-dark)" }}>
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="font-mono text-xs link-on-dark mb-12 inline-block tracking-widest uppercase"
        >
          ← Back
        </a>

        <h1 className="font-heading text-3xl font-bold mb-10" style={{ color: "var(--section-dark-text)" }}>
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-6">
          <div className="aivik-section-divider pt-6">
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              This website is operated by AIVIK, registered in Germany.
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              Data collection
            </p>
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              This website does not collect personal data beyond what you
              voluntarily submit via contact forms or email.
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              Cookies
            </p>
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              This website does not use tracking cookies.
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              Contact
            </p>
            <a
              href="mailto:info@aivik.eu"
              className="font-body text-sm link-on-dark"
            >
              info@aivik.eu
            </a>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-body text-xs text-on-dark-muted leading-relaxed">
              For a full GDPR-compliant privacy policy, generate one at{" "}
              e-recht24.de and replace this page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
