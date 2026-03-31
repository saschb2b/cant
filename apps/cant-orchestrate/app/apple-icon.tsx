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
        background: "linear-gradient(135deg, #7C3AED, #6025C0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Helm wheel */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: "7px solid #FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#A78BFA",
          }}
        />
      </div>
      {/* Spoke top */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 82,
          width: 16,
          height: 26,
          background: "#FFFFFF",
          borderRadius: 8,
        }}
      />
      {/* Spoke bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 82,
          width: 16,
          height: 26,
          background: "#FFFFFF",
          borderRadius: 8,
        }}
      />
      {/* Spoke left */}
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 82,
          width: 26,
          height: 16,
          background: "#FFFFFF",
          borderRadius: 8,
        }}
      />
      {/* Spoke right */}
      <div
        style={{
          position: "absolute",
          right: 22,
          top: 82,
          width: 26,
          height: 16,
          background: "#FFFFFF",
          borderRadius: 8,
        }}
      />
    </div>,
    { ...size },
  );
}
