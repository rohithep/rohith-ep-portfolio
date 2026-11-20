import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0C",
          color: "#F5F4F0",
          fontSize: 36,
          fontWeight: 800,
          borderRadius: 14,
        }}
      >
        <span>R</span>
        <span style={{ color: "#FF4D29" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
