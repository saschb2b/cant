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
        background: "linear-gradient(135deg, #EAB308, #A16207)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="4"
          width="16"
          height="14"
          rx="2"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="6"
          y1="8.5"
          x2="14"
          y2="8.5"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="11.5"
          x2="11"
          y2="11.5"
          stroke="#FFFFFF"
          strokeOpacity="0.7"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <polyline
          points="6,16 8,18 12,14"
          stroke="#FEF3C7"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>,
    { ...size },
  );
}
