import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Branch — Git Best Practices Game";
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
        background: "#1C0F16",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Git branch icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 48,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 180 180" fill="none">
          <line
            x1="72"
            y1="20"
            x2="72"
            y2="160"
            stroke="#DB2777"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="72" cy="40" r="14" fill="#DB2777" />
          <circle cx="72" cy="140" r="14" fill="#DB2777" />
          <circle cx="130" cy="80" r="14" fill="#FBCFE8" />
          <line
            x1="72"
            y1="70"
            x2="130"
            y2="80"
            stroke="#FBCFE8"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1="130"
            y1="80"
            x2="72"
            y2="100"
            stroke="#FBCFE8"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#F5E0EC",
          marginBottom: 16,
        }}
      >
        {"Can't Branch"}
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#B88EA0",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Can you spot the better git workflow?
      </div>

      {/* Code preview strip */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "rgba(185,28,28,0.15)",
            border: "1px solid rgba(185,28,28,0.3)",
          }}
        >
          <span style={{ color: "#EF4444", fontSize: 22, fontWeight: 600 }}>
            git commit -m &quot;stuff&quot;
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#6B4458",
            fontSize: 22,
          }}
        >
          vs
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            background: "rgba(21,128,61,0.15)",
            border: "1px solid rgba(21,128,61,0.3)",
          }}
        >
          <span style={{ color: "#22C55E", fontSize: 22, fontWeight: 600 }}>
            git commit -m &quot;fix: auth null check&quot;
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
