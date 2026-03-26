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
        background: "linear-gradient(135deg, #3178C6, #265FA0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
          letterSpacing: -0.5,
        }}
      >
        TS
      </div>
      {/* Type cursor */}
      <div
        style={{
          position: "absolute",
          right: 5,
          bottom: 6,
          width: 2,
          height: 8,
          background: "#6EA8DE",
          borderRadius: 1,
        }}
      />
    </div>,
    { ...size },
  );
}
