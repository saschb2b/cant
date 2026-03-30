import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 7,
        background: "linear-gradient(135deg, #DC2626, #991B1B)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Game controller shape */}
      <div
        style={{
          fontSize: 18,
          display: "flex",
        }}
      >
        🎮
      </div>
    </div>,
    { ...size },
  );
}
