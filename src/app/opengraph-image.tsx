import { ImageResponse } from "next/og";

export const alt = "NovaSeguros — Protección Premium en Costa Rica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0B1C3A 0%, #060F20 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          padding: "60px",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#C9A84C",
            marginBottom: "32px",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#F9F5EE",
            letterSpacing: "-1px",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          Nova
          <span style={{ color: "#C9A84C" }}>Seguros</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: "#C9A84C",
            textAlign: "center",
            marginBottom: "20px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Protección Premium en Costa Rica
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 20,
            color: "#8A9BB5",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Asesoría experta · Atención VIP · Cobertura premium
        </div>

        {/* Bottom badge */}
        <div
          style={{
            marginTop: "48px",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "4px",
            padding: "10px 28px",
            color: "#8A9BB5",
            fontSize: "14px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Regulado por SUGESE · Costa Rica
        </div>
      </div>
    ),
    { ...size },
  );
}
