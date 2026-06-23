import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 2L1 18h3.5l1.6-3.2h7.8L15.5 18H19L10 2z"
            fill="white"
          />
          <path
            d="M7.6 12L10 7.2l2.4 4.8H7.6z"
            fill="black"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
