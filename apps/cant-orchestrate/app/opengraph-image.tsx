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
        background: "#0F1219",
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
            border: "2px solid #2A4060",
            background: "#181D27",
          }}
        />
        {/* Pod */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            border: "2px solid #2A4060",
            background: "#181D27",
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
              background: "#326CE5",
            }}
          />
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "#326CE5",
            }}
          />
        </div>
        {/* Cluster */}
        <div
          style={{
            width: 100,
            height: 80,
            borderRadius: 8,
            border: "2px solid #6BA3FF",
            background: "#181D27",
          }}
        />
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#E1E8F0",
          marginBottom: 16,
        }}
      >
        {"Can't Orchestrate"}
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#8A9BBB",
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
