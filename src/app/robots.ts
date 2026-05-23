import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/offline"],
      },
    ],
    sitemap: "https://novaseguros.cr/sitemap.xml",
    host: "https://novaseguros.cr",
  };
}
