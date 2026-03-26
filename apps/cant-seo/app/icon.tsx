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
        background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Magnifying glass */}
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2.5px solid #FFFFFF",
          position: "absolute",
          left: 6,
          top: 6,
          display: "flex",
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          right: 5,
          bottom: 5,
          width: 8,
          height: 3,
          background: "#FFFFFF",
          borderRadius: 2,
          transform: "rotate(45deg)",
        }}
      />
      {/* Sparkle on lens */}
      <div
        style={{
          position: "absolute",
          left: 9,
          top: 9,
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "#F59E0B",
        }}
      />
    </div>,
    { ...size },
  );
}
