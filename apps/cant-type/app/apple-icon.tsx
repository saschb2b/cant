import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 37,
        background: "#3178C6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
          marginTop: -6,
        }}
      >
        T
      </div>
      {/* Sparkle top-right */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          width: 16,
          height: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 3,
            borderRadius: 2,
            background: "#FFD866",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 3,
            height: 16,
            borderRadius: 2,
            background: "#FFD866",
          }}
        />
      </div>
      {/* Sparkle bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 30,
          width: 10,
          height: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 10,
            height: 2,
            borderRadius: 2,
            background: "rgba(255,216,102,0.75)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 2,
            height: 10,
            borderRadius: 2,
            background: "rgba(255,216,102,0.75)",
          }}
        />
      </div>
      {/* Dot accent */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 26,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(255,216,102,0.7)",
        }}
      />
    </div>,
    { ...size },
  );
}
