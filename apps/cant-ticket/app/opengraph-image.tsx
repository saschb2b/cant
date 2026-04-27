import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Ticket - Agile Ticket Craft";
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
        background: "#0A0A0A",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Side-by-side comparison icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 48,
        }}
      >
        {/* Bad side */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 12,
            border: "3px solid #EF4444",
            background: "#171717",
            display: "flex",
            flexDirection: "column",
            padding: 16,
            gap: 8,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 12,
              background: "#333",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: "70%",
              height: 8,
              background: "#333",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: "85%",
              height: 8,
              background: "#333",
              borderRadius: 4,
            }}
          />
        </div>
        {/* VS */}
        <div style={{ fontSize: 28, color: "#666", fontWeight: 700 }}>vs</div>
        {/* Good side */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 12,
            border: "3px solid #22C55E",
            background: "#171717",
            display: "flex",
            flexDirection: "column",
            padding: 16,
            gap: 12,
          }}
        >
          <div
            style={{
              width: "80%",
              height: 14,
              background: "#A16207",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: "60%",
              height: 8,
              background: "#555",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: "90%",
              height: 8,
              background: "#444",
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#FAFAFA",
          marginBottom: 16,
        }}
      >
        {"Can't Ticket"}
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#A3A3A3",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Stories, not braindumps. Train your ticket-writing eye.
      </div>
    </div>,
    { ...size },
  );
}
