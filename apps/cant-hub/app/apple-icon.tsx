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
        background: "linear-gradient(135deg, #475569, #1E293B)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Compass: outer ring */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid rgba(255,255,255,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* North needle */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            marginLeft: -12,
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "38px solid #E9C46A",
          }}
        />
        {/* South needle */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            marginLeft: -12,
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "38px solid rgba(255,255,255,0.4)",
          }}
        />
        {/* Center dot */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#FFFFFF",
            zIndex: 1,
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
