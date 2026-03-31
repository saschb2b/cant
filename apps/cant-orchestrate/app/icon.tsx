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
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "2px solid #FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#A78BFA",
          }}
        />
      </div>
      {/* Spoke top */}
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 14.5,
          width: 3,
          height: 5,
          background: "#FFFFFF",
          borderRadius: 1,
        }}
      />
      {/* Spoke bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 14.5,
          width: 3,
          height: 5,
          background: "#FFFFFF",
          borderRadius: 1,
        }}
      />
      {/* Spoke left */}
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 14.5,
          width: 5,
          height: 3,
          background: "#FFFFFF",
          borderRadius: 1,
        }}
      />
      {/* Spoke right */}
      <div
        style={{
          position: "absolute",
          right: 4,
          top: 14.5,
          width: 5,
          height: 3,
          background: "#FFFFFF",
          borderRadius: 1,
        }}
      />
    </div>,
    { ...size },
  );
}
