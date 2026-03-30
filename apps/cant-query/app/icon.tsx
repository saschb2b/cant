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
          left: 5,
          top: 12,
          width: 10,
          height: 2,
          background: "#FFFFFF",
          borderRadius: 1,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 10,
          width: 2,
          height: 6,
          background: "#FFFFFF",
          borderRadius: 1,
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />
      {/* Arrow left (response) */}
      <div
        style={{
          position: "absolute",
          right: 5,
          bottom: 12,
          width: 10,
          height: 2,
          background: "#CBD5E1",
          borderRadius: 1,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 10,
          width: 2,
          height: 6,
          background: "#CBD5E1",
          borderRadius: 1,
          transform: "rotate(45deg)",
          display: "flex",
        }}
      />
      {/* Center question mark */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          marginTop: -2,
        }}
      >
        ?
      </div>
    </div>,
    { ...size },
  );
}
