import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can't Explode - Chemistry Challenges";
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
        background: "#0D1B0F",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Molecule icon */}
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
            width: 48,
            height: 48,
            borderRadius: 24,
            border: "4px solid #4CAF50",
            background: "transparent",
          }}
        />
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            border: "4px solid #81C784",
            background: "transparent",
          }}
        />
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            border: "4px solid #81C784",
            background: "transparent",
          }}
        />
      </div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#E0EDE2",
          marginBottom: 16,
        }}
      >
        Chemistry Challenges
      </div>

      <div
        style={{
          fontSize: 26,
          color: "#8FAF93",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Two molecules. One survives. Test your chemistry instincts.
      </div>
    </div>,
    { ...size },
  );
}
