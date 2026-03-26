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
          width: 96,
          height: 72,
          border: "6px solid #FFFFFF",
          borderRadius: 10,
          display: "flex",
        }}
      />
      {/* Resize handle */}
      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: 28,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: 32,
            height: 5,
            background: "#D4A843",
            borderRadius: 3,
          }}
        />
        <div
          style={{
            width: 20,
            height: 5,
            background: "#D4A843",
            borderRadius: 3,
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
