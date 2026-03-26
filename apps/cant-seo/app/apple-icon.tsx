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
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Magnifying glass circle */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 70,
          height: 70,
          borderRadius: "50%",
          border: "6px solid #60A5FA",
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 100,
          width: 40,
          height: 8,
          background: "#60A5FA",
          borderRadius: 4,
          transform: "rotate(45deg)",
        }}
      />
      {/* Meta tag bracket */}
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 58,
          fontSize: 32,
          color: "#FBBF24",
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        &lt;/&gt;
      </div>
    </div>,
    { ...size },
  );
}
