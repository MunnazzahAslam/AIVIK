import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIVIK — Software Engineering & AI Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          AIVIK
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#888888",
            marginTop: 24,
            letterSpacing: "4px",
          }}
        >
          SOFTWARE ENGINEERING & AI AUTOMATION
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#444444",
            marginTop: 16,
            letterSpacing: "2px",
          }}
        >
          AIVIK.EU · MUNICH, GERMANY
        </div>
      </div>
    ),
    { ...size }
  );
}
