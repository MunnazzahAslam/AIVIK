export default function Impressum() {
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
          Impressum
        </h1>

        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs text-[#888888] tracking-widest uppercase">
            Angaben gemäß § 5 TMG
          </p>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-body text-sm text-[#888888] leading-relaxed">
              AIVIK
              <br />
              [Your registered address in Germany]
              <br />
              Germany
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-mono text-xs text-[#444444] uppercase tracking-widest mb-3">
              Contact
            </p>
            <p className="font-body text-sm text-[#888888] leading-relaxed">
              Email: info@aivik.eu
              <br />
              Website: aivik.eu
            </p>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6">
            <p className="font-mono text-xs text-[#444444] uppercase tracking-widest mb-3">
              Responsible for content
            </p>
            <p className="font-body text-sm text-[#888888]">
              Munnazzah Aslam
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
