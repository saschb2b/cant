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
        background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Magnifying glass circle */}
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: "50%",
          border: "8px solid #FFFFFF",
          position: "absolute",
          left: 34,
          top: 34,
          display: "flex",
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: 28,
          width: 40,
          height: 12,
          background: "#FFFFFF",
          borderRadius: 6,
          transform: "rotate(45deg)",
        }}
      />
      {/* Sparkle on lens */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 50,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#F59E0B",
        }}
      />
    </div>,
    { ...size },
  );
}
