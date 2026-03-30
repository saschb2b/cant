import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Test - Testing Patterns";
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
        background: "#0F1A17",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Test result icons */}
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
            background: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "#FFFFFF",
          }}
        >
          ✓
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
          it()
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            background: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "#FFFFFF",
          }}
        >
          ✗
        </div>
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#F1F5F3",
          marginBottom: 16,
        }}
      >
        Can&apos;t Test
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#94B8A8",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Assert better. Ship confident. Learn testing the right way.
      </div>
    </div>,
    { ...size },
  );
}
