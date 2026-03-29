import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 37,
        background: "linear-gradient(135deg, #E84D31, #C2410C)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="50" cy="22" r="8" fill="#FFFFFF" />
        <circle cx="50" cy="78" r="8" fill="#FFFFFF" />
        <circle cx="78" cy="45" r="8" fill="#F9A825" />
        <line
          x1="50"
          y1="40"
          x2="78"
          y2="45"
          stroke="#F9A825"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="78"
          y1="45"
          x2="50"
          y2="55"
          stroke="#F9A825"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
