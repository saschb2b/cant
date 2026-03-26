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
        background: "linear-gradient(135deg, #2B4C7E, #1E3A5F)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <div
          style={{
            color: "#E8E0D4",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          &lt;
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#D4A843",
          }}
        />
        <div
          style={{
            color: "#E8E0D4",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          /&gt;
        </div>
      </div>
    </div>,
    { ...size },
  );
}
