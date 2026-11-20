import { ImageResponse } from "next/og";

export const alt = "Rohith EP — Software Engineer & AI Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          color: "#F5F4F0",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#8A8A93",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>Software Engineer &amp; AI Developer</span>
          <span>BSc CS · MCA 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            <span>ROHITH&nbsp;</span>
            <span style={{ color: "#FF4D29" }}>EP</span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#8A8A93",
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            Building AI applications, full-stack Next.js platforms, and custom
            e-commerce systems.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(245,244,240,0.14)",
            paddingTop: 28,
            fontSize: 20,
            color: "#8A8A93",
          }}
        >
          <span>Kerala, India · Remote &amp; Relocatable</span>
          <span style={{ color: "#F5F4F0" }}>Portfolio 2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
