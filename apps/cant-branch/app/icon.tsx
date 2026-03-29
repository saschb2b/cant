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
        background: "linear-gradient(135deg, #DB2777, #BE185D)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <line
          x1="8"
          y1="3"
          x2="8"
          y2="17"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="8" cy="5" r="2" fill="#FFFFFF" />
        <circle cx="8" cy="15" r="2" fill="#FFFFFF" />
        <circle cx="15" cy="9" r="2" fill="#FBCFE8" />
        <line
          x1="8"
          y1="8"
          x2="15"
          y2="9"
          stroke="#FBCFE8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="15"
          y1="9"
          x2="8"
          y2="11"
          stroke="#FBCFE8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
