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
        background: "#7C3AED",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        O
      </div>
    </div>,
    { ...size },
  );
}
