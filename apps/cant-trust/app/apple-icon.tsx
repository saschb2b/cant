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
        background: "linear-gradient(135deg, #C28A1A, #8B6914)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "#FFFFFF",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        ₿
      </span>
    </div>,
    { ...size },
  );
}
