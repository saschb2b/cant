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
        background: "linear-gradient(135deg, #247A6F, #1B5E56)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Screen frame */}
      <div
        style={{
          width: 18,
          height: 14,
          border: "2px solid #FFFFFF",
          borderRadius: 2,
          display: "flex",
        }}
      />
      {/* Resize handle */}
      <div
        style={{
          position: "absolute",
          right: 4,
          bottom: 4,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: 6,
            height: 1.5,
            background: "#D4A843",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 4,
            height: 1.5,
            background: "#D4A843",
            borderRadius: 1,
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
