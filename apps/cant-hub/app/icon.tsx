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
        background: "linear-gradient(135deg, #475569, #1E293B)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Compass: outer ring */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.6)",
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
            top: 2,
            left: "50%",
            marginLeft: -2.5,
            width: 0,
            height: 0,
            borderLeft: "2.5px solid transparent",
            borderRight: "2.5px solid transparent",
            borderBottom: "7px solid #E9C46A",
          }}
        />
        {/* South needle */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: "50%",
            marginLeft: -2.5,
            width: 0,
            height: 0,
            borderLeft: "2.5px solid transparent",
            borderRight: "2.5px solid transparent",
            borderTop: "7px solid rgba(255,255,255,0.4)",
          }}
        />
        {/* Center dot */}
        <div
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#FFFFFF",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
