import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Orchestrate - Container Orchestration Challenge Game";
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
        background: "#110D1B",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Container icons */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 24,
          marginBottom: 48,
        }}
      >
        {/* Container */}
        <div
          style={{
            width: 56,
            height: 48,
            borderRadius: 6,
            border: "2px solid #3D2A60",
            background: "#1A1525",
          }}
        />
        {/* Pod */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            border: "2px solid #3D2A60",
            background: "#1A1525",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "#7C3AED",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "#7C3AED",
            }}
          />
        </div>
        {/* Cluster */}
        <div
          style={{
            width: 100,
            height: 80,
            borderRadius: 8,
            border: "2px solid #A78BFA",
            background: "#1A1525",
          }}
        />
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#E8E1F0",
          marginBottom: 16,
        }}
      >
        {"Can't Orchestrate"}
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#9B8ABB",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Pick the better orchestration pattern. {String(69)} challenges across 16
        categories.
      </div>
    </div>,
    { ...size },
  );
}
