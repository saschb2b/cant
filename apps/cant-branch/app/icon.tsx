import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        background: "linear-gradient(135deg, #E84D31, #C2410C)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Git branch icon: vertical line with a branch off */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <line
          x1="10"
          y1="3"
          x2="10"
          y2="17"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="5" r="2" fill="#FFFFFF" />
        <circle cx="10" cy="15" r="2" fill="#FFFFFF" />
        <circle cx="16" cy="9" r="2" fill="#F9A825" />
        <line
          x1="10"
          y1="8"
          x2="16"
          y2="9"
          stroke="#F9A825"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
