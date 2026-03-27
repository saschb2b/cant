import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Hub - The Complete Series";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0B1120",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Compass icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginBottom: 40,
        }}
      >
        {/* North needle */}
        <div
          style={{
            position: "absolute",
            top: 7,
            left: "50%",
            marginLeft: -8,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "26px solid #E9C46A",
          }}
        />
        {/* South needle */}
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: "50%",
            marginLeft: -8,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "26px solid rgba(255,255,255,0.35)",
          }}
        />
        {/* Center dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#FFFFFF",
            zIndex: 1,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#E2E8F0",
          marginBottom: 16,
        }}
      >
        {"Can't Hub"}
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#94A3B8",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        One game. Every topic. Find your direction.
      </div>
    </div>,
    { ...size },
  );
}
