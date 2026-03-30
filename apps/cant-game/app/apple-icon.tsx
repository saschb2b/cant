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
        background: "linear-gradient(135deg, #DC2626, #991B1B)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* D-pad */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 65,
          width: 50,
          height: 16,
          background: "#FFFFFF",
          borderRadius: 4,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 47,
          top: 48,
          width: 16,
          height: 50,
          background: "#FFFFFF",
          borderRadius: 4,
          display: "flex",
        }}
      />
      {/* Action buttons */}
      <div
        style={{
          position: "absolute",
          right: 35,
          top: 60,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: "#FCA5A5",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 55,
          top: 78,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: "#FCA5A5",
          display: "flex",
        }}
      />
      {/* Controller body outline */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 35,
          width: 110,
          height: 6,
          background: "#FCA5A5",
          borderRadius: 3,
          opacity: 0.5,
          display: "flex",
        }}
      />
    </div>,
    { ...size },
  );
}
