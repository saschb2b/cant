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
        background: "#1A1A1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Desktop */}
      <div
        style={{
          position: "absolute",
          left: 5,
          top: 7,
          width: 18,
          height: 12,
          border: "1.5px solid #FAFAFA",
          borderRadius: 2,
        }}
      />
      {/* Tablet */}
      <div
        style={{
          position: "absolute",
          right: 3,
          top: 11,
          width: 8,
          height: 12,
          border: "1.5px solid rgba(250,250,250,0.7)",
          borderRadius: 1.5,
        }}
      />
      {/* Phone */}
      <div
        style={{
          position: "absolute",
          left: 4,
          bottom: 4,
          width: 6,
          height: 9,
          border: "1.5px solid rgba(250,250,250,0.5)",
          borderRadius: 1.5,
        }}
      />
    </div>,
    { ...size },
  );
}
