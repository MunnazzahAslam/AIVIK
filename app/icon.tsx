import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The browser-tab icon: the "A" of the AIVIK wordmark with the logo's blue
// underscore, on the site's dark background.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#050B14",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 3L1.5 21h3.6l1.5-3.6h7.8l1.5 3.6h3.6L11.5 3h-2zm1 5.2l2.6 6.2H7.9l2.6-6.2z" fill="#FFFFFF" />
          <rect x="18" y="18" width="7" height="3" fill="#2563EB" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
