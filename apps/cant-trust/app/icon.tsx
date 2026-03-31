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
        background: "linear-gradient(135deg, #C28A1A, #8B6914)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "#FFFFFF",
          fontSize: 20,
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
