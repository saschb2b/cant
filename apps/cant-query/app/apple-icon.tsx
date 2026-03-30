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
        background: "linear-gradient(135deg, #475569, #334155)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Arrow right (request) */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 65,
          width: 50,
          height: 6,
          background: "#FFFFFF",
          borderRadius: 3,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 65,
          top: 55,
          width: 6,
          height: 26,
          background: "#FFFFFF",
          borderRadius: 3,
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />
      {/* Arrow left (response) */}
      <div
        style={{
          position: "absolute",
          right: 30,
          bottom: 65,
          width: 50,
          height: 6,
          background: "#CBD5E1",
          borderRadius: 3,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 65,
          bottom: 55,
          width: 6,
          height: 26,
          background: "#CBD5E1",
          borderRadius: 3,
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />
      {/* Center question mark */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
        }}
      >
        ?
      </div>
    </div>,
    { ...size },
  );
}
