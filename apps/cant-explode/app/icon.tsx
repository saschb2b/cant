import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Ex
    </div>,
    size,
  );
}
