import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Type - TypeScript Challenge Game";
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
            border: "2px solid #2A4060",
            background: "#181D27",
          }}
        />
        {/* Tablet */}
        <div
          style={{
            width: 72,
            height: 96,
            borderRadius: 8,
            border: "2px solid #2A4060",
            background: "#181D27",
          }}
        />
        {/* Desktop */}
        <div
          style={{
            width: 120,
            height: 76,
            borderRadius: 8,
            border: "2px solid #6EA8DE",
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
        Can&apos;t Type
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
        Pick the better TypeScript pattern. 96 challenges across 16 categories.
      </div>
    </div>,
    { ...size },
  );
}
