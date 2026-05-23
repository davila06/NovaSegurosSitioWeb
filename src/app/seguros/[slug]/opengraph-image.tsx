import { ImageResponse } from "next/og";
import { getInsurancePage } from "@/app/seguros/content";

export const runtime     = "edge";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getInsurancePage(slug);

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  const shortDesc =
    page.description.length > 110
      ? page.description.slice(0, 107) + "…"
      : page.description;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(140deg, #0E0E14 0%, #080810 60%, #101014 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold accent bar — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background:
              "linear-gradient(90deg, #7A5A28, #C8A96E 30%, #EDD898 50%, #C8A96E 70%, #7A5A28)",
          }}
        />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-5%",
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,169,110,0.13) 0%, transparent 68%)",
          }}
        />

        {/* Brand label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div style={{ width: 36, height: 2, background: "#C8A96E" }} />
          <span
            style={{
              color: "#C8A96E",
              fontSize: 13,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            NovaSeguros · Costa Rica
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 68,
            fontWeight: 300,
            color: "#EDE8DF",
            lineHeight: 1.08,
            margin: "0 0 18px 0",
            maxWidth: 820,
            fontFamily: "serif",
          }}
        >
          {page.headline}
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#7A7A7A",
            fontSize: 21,
            margin: "0 0 36px 0",
            maxWidth: 720,
            lineHeight: 1.4,
            fontFamily: "sans-serif",
          }}
        >
          {shortDesc}
        </p>

        {/* Price badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: "rgba(200,169,110,0.10)",
            border: "1px solid rgba(200,169,110,0.30)",
            borderRadius: 10,
            padding: "14px 28px",
          }}
        >
          <span
            style={{
              color: "#C8A96E",
              fontSize: 26,
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            {page.price}
          </span>
          <div style={{ width: 1, height: 24, background: "rgba(200,169,110,0.25)" }} />
          <span
            style={{
              color: "#6A6A6A",
              fontSize: 15,
              fontFamily: "sans-serif",
            }}
          >
            novaseguros.cr
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
