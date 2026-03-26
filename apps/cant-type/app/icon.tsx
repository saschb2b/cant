import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: "#3178C6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        T
      </div>
      {/* Sparkle dot */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#FFD866",
        }}
      />
    </div>,
    { ...size },
  );
}
