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
          left: 8,
          top: 10,
          width: 8,
          height: 12,
          borderRight: "3px solid #FFFFFF",
          borderBottom: "3px solid #FFFFFF",
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />
      {/* Cross */}
      <div
        style={{
          position: "absolute",
          right: 7,
          top: 16,
          fontSize: 10,
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
