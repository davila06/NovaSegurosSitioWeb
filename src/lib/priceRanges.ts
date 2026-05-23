/** Price estimate ranges per insurance type (ES / EN) */
export const PRICE_RANGES: Record<string, { es: string; en: string }> = {
  // ES keys
  Auto:         { es: "Desde ₡22,000/mes", en: "From ₡22,000/mo" },
  Vida:         { es: "Desde ₡8,500/mes",  en: "From ₡8,500/mo"  },
  Salud:        { es: "Desde ₡45,000/mes", en: "From ₡45,000/mo" },
  Hogar:        { es: "Desde ₡12,000/mes", en: "From ₡12,000/mo" },
  Viaje:        { es: "Desde ₡15,000/viaje", en: "From ₡15,000/trip" },
  Mascotas:     { es: "Desde ₡6,500/mes",  en: "From ₡6,500/mo"  },
  "Mi empresa": { es: "Desde ₡80,000/mes", en: "From ₡80,000/mo" },
  Otro:         { es: "Cotización a medida", en: "Custom quote"   },
  // EN keys
  "Auto Insurance": { es: "Desde ₡22,000/mes", en: "From ₡22,000/mo" },
  Life:         { es: "Desde ₡8,500/mes",  en: "From ₡8,500/mo"  },
  Health:       { es: "Desde ₡45,000/mes", en: "From ₡45,000/mo" },
  Home:         { es: "Desde ₡12,000/mes", en: "From ₡12,000/mo" },
  Travel:       { es: "Desde ₡15,000/viaje", en: "From ₡15,000/trip" },
  Pets:         { es: "Desde ₡6,500/mes",  en: "From ₡6,500/mo"  },
  "My business":{ es: "Desde ₡80,000/mes", en: "From ₡80,000/mo" },
  Business:     { es: "Desde ₡80,000/mes", en: "From ₡80,000/mo" },
  Other:        { es: "Cotización a medida", en: "Custom quote"   },
};

export function getPriceEstimate(type: string, lang: "es" | "en"): string | null {
  return PRICE_RANGES[type]?.[lang] ?? null;
}
