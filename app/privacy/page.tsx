export default function Privacy() {
  return (
    <main className="min-h-screen bg-black px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="font-mono text-xs text-[#888888] hover:text-white transition-colors duration-200 mb-12 inline-block tracking-widest uppercase"
        >
          ← Back
        </a>

        <h1 className="font-heading text-3xl font-bold text-white mb-10">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-6">
          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-body text-sm text-[#888888] leading-relaxed">
              This website is operated by AIVIK, registered in Germany.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-mono text-xs text-[#444444] uppercase tracking-widest mb-3">
              Data collection
            </p>
            <p className="font-body text-sm text-[#888888] leading-relaxed">
              This website does not collect personal data beyond what you
              voluntarily submit via contact forms or email.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-mono text-xs text-[#444444] uppercase tracking-widest mb-3">
              Cookies
            </p>
            <p className="font-body text-sm text-[#888888] leading-relaxed">
              This website does not use tracking cookies.
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-mono text-xs text-[#444444] uppercase tracking-widest mb-3">
              Contact
            </p>
            <a
              href="mailto:info@aivik.eu"
              className="font-body text-sm text-[#888888] hover:text-white transition-colors duration-200"
            >
              info@aivik.eu
            </a>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-body text-xs text-[#444444] leading-relaxed">
              For a full GDPR-compliant privacy policy, generate one at{" "}
              e-recht24.de and replace this page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
