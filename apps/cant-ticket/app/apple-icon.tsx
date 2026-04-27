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
        background: "linear-gradient(135deg, #EAB308, #A16207)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="38"
          y="46"
          width="104"
          height="80"
          rx="10"
          stroke="#FFFFFF"
          strokeWidth="6"
          fill="none"
        />
        <line
          x1="56"
          y1="68"
          x2="124"
          y2="68"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="56"
          y1="86"
          x2="108"
          y2="86"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="56"
          y1="104"
          x2="92"
          y2="104"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polyline
          points="58,142 70,154 96,128"
          stroke="#FEF3C7"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>,
    { ...size },
  );
}
