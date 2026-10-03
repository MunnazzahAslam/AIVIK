import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The home-screen icon on iPhones and iPads: the same mark as the tab icon, larger.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, background: "#050B14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="132" height="132" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 3L1.5 21h3.6l1.5-3.6h7.8l1.5 3.6h3.6L11.5 3h-2zm1 5.2l2.6 6.2H7.9l2.6-6.2z" fill="#FFFFFF" />
          <rect x="18" y="18" width="7" height="3" fill="#2563EB" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
