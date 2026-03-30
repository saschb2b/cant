import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Query - API Endpoint Patterns";
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
      {/* API arrows icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            background: "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          GET
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            background: "#7C3AED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          GQL
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            background: "#15803D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          WS
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
        Can&apos;t Query
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
        GET better. POST results. Learn API design the right way.
      </div>
    </div>,
    { ...size },
  );
}
