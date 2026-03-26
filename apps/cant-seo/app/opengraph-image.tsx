import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't SEO - Link Inspector";
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
        background: "#0F172A",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Preview card mockups */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 48,
        }}
      >
        {/* LinkedIn card */}
        <div
          style={{
            width: 140,
            height: 96,
            borderRadius: 8,
            border: "2px solid #0A66C2",
            background: "#1E293B",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, background: "#334155", display: "flex" }} />
          <div style={{ padding: 6, display: "flex" }}>
            <div
              style={{
                width: 80,
                height: 6,
                background: "#94A3B8",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
        {/* Twitter card */}
        <div
          style={{
            width: 160,
            height: 104,
            borderRadius: 12,
            border: "2px solid #1DA1F2",
            background: "#1E293B",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, background: "#334155", display: "flex" }} />
          <div style={{ padding: 8, display: "flex" }}>
            <div
              style={{
                width: 100,
                height: 6,
                background: "#94A3B8",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
        {/* Google result */}
        <div
          style={{
            width: 180,
            height: 80,
            borderRadius: 8,
            background: "#1E293B",
            display: "flex",
            flexDirection: "column",
            padding: 12,
            gap: 6,
          }}
        >
          <div
            style={{
              width: 60,
              height: 5,
              background: "#94A3B8",
              borderRadius: 3,
            }}
          />
          <div
            style={{
              width: 140,
              height: 8,
              background: "#60A5FA",
              borderRadius: 3,
            }}
          />
          <div
            style={{
              width: 160,
              height: 5,
              background: "#64748B",
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#F1F5F9",
          display: "flex",
        }}
      >
        Link Inspector
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#94A3B8",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
          display: "flex",
          marginTop: 16,
        }}
      >
        One link. Every platform. Instant previews.
      </div>
    </div>,
    { ...size },
  );
}
