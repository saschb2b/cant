import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Resize - Multi-Device Preview";
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
      {/* Device icons */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 24,
          marginBottom: 48,
        }}
      >
        {/* Phone */}
        <div
          style={{
            width: 48,
            height: 80,
            borderRadius: 8,
            border: "2px solid #333",
            background: "#171717",
          }}
        />
        {/* Tablet */}
        <div
          style={{
            width: 72,
            height: 96,
            borderRadius: 8,
            border: "2px solid #333",
            background: "#171717",
          }}
        />
        {/* Desktop */}
        <div
          style={{
            width: 120,
            height: 76,
            borderRadius: 8,
            border: "2px solid #FAFAFA",
            background: "#171717",
          }}
        />
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#FAFAFA",
          marginBottom: 16,
        }}
      >
        Responsive Viewer
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
        One site. Every screen. Synced in real time.
      </div>
    </div>,
    { ...size },
  );
}
