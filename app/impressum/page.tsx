export default function Impressum() {
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
          Impressum
        </h1>

        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs text-on-dark-muted tracking-widest uppercase">
            Angaben gemäß § 5 TMG
          </p>

          <div className="aivik-section-divider pt-6">
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              AIVIK
              <br />
              [Your registered address in Germany]
              <br />
              Germany
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              Contact
            </p>
            <p className="font-body text-sm text-on-dark-muted leading-relaxed">
              Email: info@aivik.eu
              <br />
              Website: aivik.eu
            </p>
          </div>

          <div className="aivik-section-divider pt-6">
            <p className="font-mono text-xs text-on-dark-muted uppercase tracking-widest mb-3">
              Responsible for content
            </p>
            <p className="font-body text-sm text-on-dark-muted">
              Munnazzah Aslam
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
