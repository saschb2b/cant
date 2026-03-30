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
        background: "linear-gradient(135deg, #059669, #047857)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Checkmark */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 55,
          width: 35,
          height: 60,
          borderRight: "12px solid #FFFFFF",
          borderBottom: "12px solid #FFFFFF",
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />
      {/* Cross */}
      <div
        style={{
          position: "absolute",
          right: 35,
          bottom: 45,
          fontSize: 48,
          fontWeight: 800,
          color: "#A7F3D0",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
        }}
      >
        x
      </div>
    </div>,
    { ...size },
  );
}
