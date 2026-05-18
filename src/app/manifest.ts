import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NovaSeguros",
    short_name: "NovaSeguros",
    description: "Seguros personales y empresariales con asesoría experta, atención VIP y cobertura premium en Costa Rica.",
    start_url: "/",
    display: "standalone",
    background_color: "#060F20",
    theme_color: "#0B1C3A",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/app-icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
