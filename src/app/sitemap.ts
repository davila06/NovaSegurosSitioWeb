import type { MetadataRoute } from "next";
import { INSURANCE_PAGES } from "./seguros/content";

const BASE = "https://novaseguros.cr";

export default function sitemap(): MetadataRoute.Sitemap {
  const insurancePages: MetadataRoute.Sitemap = INSURANCE_PAGES.map(p => ({
    url: `${BASE}/seguros/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...insurancePages,
  ];
}
