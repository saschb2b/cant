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
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Magnifying glass */}
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 7,
          width: 13,
          height: 13,
          borderRadius: "50%",
          border: "2px solid #60A5FA",
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 18,
          width: 8,
          height: 2.5,
          background: "#60A5FA",
          borderRadius: 1,
          transform: "rotate(45deg)",
        }}
      />
      {/* Meta tag bracket */}
      <div
        style={{
          position: "absolute",
          left: 9,
          top: 11,
          fontSize: 7,
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
