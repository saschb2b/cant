import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: "#7C3AED",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        O
      </div>
    </div>,
    { ...size },
  );
}
