import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
        background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
        color: "#FFFFFF",
        fontSize: 72,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Ex
    </div>,
    size,
  );
}
