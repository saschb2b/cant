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
          fontSize: 88,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        TS
      </div>
      {/* Type cursor */}
      <div
        style={{
          position: "absolute",
          right: 30,
          bottom: 36,
          width: 6,
          height: 40,
          background: "#6EA8DE",
          borderRadius: 3,
        }}
      />
    </div>,
    { ...size },
  );
}
