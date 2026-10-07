/** Shown to an editor who opened the site from the Studio: unpublished changes are visible. */
export default function PreviewBar() {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-4 rounded-full px-5 py-2.5 font-body text-sm shadow-lg" style={{ backgroundColor: "#0A0F1E", color: "#F1F5F9", border: "1px solid #1E2D4A" }}>
      <span>Preview: unpublished changes are shown</span>
      {/* A plain link: this route clears the preview cookie and must not be prefetched. */}
      <a href="/api/draft/disable" className="font-semibold underline underline-offset-4">
        Exit
      </a>
    </div>
  );
}
