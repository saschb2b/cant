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
        background: "linear-gradient(135deg, #DB2777, #BE185D)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <line
          x1="40"
          y1="10"
          x2="40"
          y2="90"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="40" cy="22" r="8" fill="#FFFFFF" />
        <circle cx="40" cy="50" r="8" fill="#FFFFFF" />
        <circle cx="40" cy="78" r="8" fill="#FFFFFF" />
        <circle cx="70" cy="38" r="8" fill="#FBCFE8" />
        <line
          x1="40"
          y1="35"
          x2="70"
          y2="38"
          stroke="#FBCFE8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="70"
          y1="38"
          x2="40"
          y2="46"
          stroke="#FBCFE8"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
