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
        background: "#1A1A1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Desktop frame */}
      <div
        style={{
          position: "absolute",
          left: 38,
          top: 48,
          width: 104,
          height: 66,
          border: "4px solid #FAFAFA",
          borderRadius: 8,
        }}
      />
      {/* Desktop stand */}
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 114,
          width: 4,
          height: 12,
          background: "#FAFAFA",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 126,
          width: 36,
          height: 4,
          background: "#FAFAFA",
          borderRadius: 2,
        }}
      />
      {/* Tablet frame */}
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 72,
          width: 40,
          height: 56,
          border: "3.5px solid rgba(250,250,250,0.8)",
          borderRadius: 6,
          background: "rgba(250,250,250,0.08)",
        }}
      />
      {/* Phone frame */}
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 82,
          width: 28,
          height: 46,
          border: "3px solid rgba(250,250,250,0.6)",
          borderRadius: 6,
          background: "rgba(250,250,250,0.05)",
        }}
      />
    </div>,
    { ...size },
  );
}
