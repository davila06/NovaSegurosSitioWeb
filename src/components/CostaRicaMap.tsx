"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

/**
 * Province paths derived from real OpenStreetMap/Nominatim GeoJSON data.
 * Simplified with Ramer-Douglas-Peucker (ε=3px). Projection: equirectangular.
 * Bounding box: lon [-86.18, -82.55], lat [8.03, 11.22] → viewBox 0 0 500 440
 */
const PROVINCES = [
  {
    id: "guanacaste",
    path: "M 19.5,63.5 L 36.3,140.4 L 46.2,164.1 L 67.3,194.8 L 108.7,220.4 L 146.7,191.3 L 147.2,182.6 L 134.1,174.7 L 135.5,169.7 L 148.2,167.6 L 152.6,160.1 L 143,152.7 L 144.1,149.2 L 166,146.4 L 166,141.5 L 179.7,152.4 L 178,147 L 185.3,143 L 190,126.1 L 199,123.4 L 198.2,106.1 L 171.4,93.3 L 166.1,82.7 L 153.8,80.7 L 151.2,76.2 L 134.3,75.9 L 113.1,56.3 L 124.7,42.2 L 136.2,44.7 L 140.4,38.6 L 98.5,21.2 L 92.2,20.1 L 80.5,38.6 L 60.9,40.8 L 39.1,34.9 L 23.5,50.7 Z",
    labelX: 109, labelY: 120,
    es: "Guanacaste", en: "Guanacaste",
    descEs: "Cobertura total · Oficina en Liberia",
    descEn: "Full coverage · Office in Liberia",
  },
  {
    id: "alajuela",
    path: "M 112.9,53.4 L 134.3,75.9 L 151.2,76.2 L 153.8,80.7 L 166.1,82.7 L 171.4,93.3 L 198.2,106.1 L 197.2,130.6 L 203.3,135.5 L 210.9,132.1 L 211.2,150.1 L 226,166 L 212.5,173.1 L 209.9,180.3 L 224.9,184.1 L 237.6,174.4 L 264.4,173.9 L 273,168.6 L 275.8,71.8 L 266.3,68.4 L 267.7,61.2 L 255.3,56 L 250.8,46.7 L 239.1,50.9 L 210,36.2 L 180.9,52.9 L 139.7,38.4 L 136.2,44.7 L 124.7,42.2 Z",
    labelX: 194, labelY: 110,
    es: "Alajuela", en: "Alajuela",
    descEs: "Cobertura total · Oficina central",
    descEn: "Full coverage · Central office",
  },
  {
    id: "heredia",
    path: "M 270.9,168.9 L 293.1,166.4 L 292.6,155.5 L 314.5,135.2 L 311.4,117.2 L 317.7,110.2 L 316.5,89 L 326.2,81.9 L 332.9,82.8 L 327.5,73.6 L 305,81.1 L 293.6,71 L 287.2,74.8 L 275.8,71.8 L 275.8,155.4 Z",
    labelX: 302, labelY: 120,
    es: "Heredia", en: "Heredia",
    descEs: "Cobertura total",
    descEn: "Full coverage",
  },
  {
    id: "san_jose",
    path: "M 221.1,195.9 L 229.6,216.1 L 242.4,217.9 L 246.8,208.4 L 277.3,209.5 L 280.5,218 L 287.2,216.5 L 285.1,223.7 L 316.4,243.6 L 314.3,249.9 L 320.4,257.2 L 333.6,257.6 L 337.9,266 L 350.9,274.2 L 358,275.5 L 363.1,270.2 L 361.9,261.1 L 356.4,259.3 L 368.6,240.7 L 361.1,226.8 L 342.4,215.2 L 327.6,217.8 L 326,212.5 L 315.2,210 L 314.6,204.5 L 303.5,201.1 L 297.2,191.1 L 285.1,192.9 L 296.3,181.1 L 291,177.6 L 295.2,172.5 L 314.1,168.6 L 304.9,155.3 L 304.7,143 L 292.6,155.5 L 294.9,162.3 L 289,169 L 233.1,175.9 L 222.4,186.5 L 228,191.9 Z",
    labelX: 295, labelY: 220,
    es: "San José", en: "San José",
    descEs: "Cobertura total · Sede principal",
    descEn: "Full coverage · Headquarters",
  },
  {
    id: "cartago",
    path: "M 285.1,192.8 L 297.2,191.1 L 303.5,201.1 L 314.6,204.5 L 315.2,210 L 326,212.5 L 327.6,217.8 L 342.4,215.2 L 361.1,226.8 L 358.2,213.2 L 380.4,186.4 L 378.3,172.8 L 383,167.5 L 346.3,167.5 L 302.9,147.8 L 314.1,168.6 L 295.2,172.5 L 291,177.6 L 296.3,181.1 Z",
    labelX: 340, labelY: 195,
    es: "Cartago", en: "Cartago",
    descEs: "Cobertura total",
    descEn: "Full coverage",
  },
  {
    id: "limon",
    path: "M 302.9,147.8 L 346.3,167.5 L 383,167.5 L 378.3,172.8 L 380.4,186.4 L 358.2,213.2 L 361.9,233.4 L 372.4,244.2 L 382,238.6 L 400.4,245.5 L 430.5,275.5 L 430.2,228.2 L 443.1,225.2 L 437.5,216.7 L 441.1,210.6 L 455.5,214.2 L 464.6,225.6 L 471.9,225 L 473.2,218.1 L 479.6,219.9 L 478.1,216.4 L 495.2,198.4 L 454.2,172.4 L 440.2,149.3 L 421.6,140.4 L 386,96.7 L 364.6,45.3 L 345.9,31.3 L 335,49.4 L 338.3,70 L 326.3,73.4 L 332.9,82.8 L 326.2,81.9 L 316.5,89 L 317.7,110.2 L 311.4,117.5 L 315.7,132.2 Z",
    labelX: 415, labelY: 180,
    es: "Limón", en: "Limón",
    descEs: "Cobertura total",
    descEn: "Full coverage",
  },
  {
    id: "puntarenas",
    path: "M 108.7,220.4 L 292.2,337.1 L 336.5,370.8 L 425.3,421 L 437.5,390.7 L 430.4,371.1 L 424.3,371.3 L 416.4,363.7 L 443.3,346.4 L 444.6,328 L 433.3,312.4 L 440.5,302 L 459.4,292.9 L 437.3,274 L 425.9,273.3 L 424,266 L 414.6,263.2 L 413.7,254.6 L 400.4,245.5 L 382.7,238.7 L 372.6,244.2 L 368.6,240.7 L 356.4,259.3 L 361.9,261.1 L 363.1,270.2 L 354.3,275.1 L 341,268.8 L 333.6,257.6 L 316.3,253.9 L 316.4,243.6 L 285.1,223.7 L 287.2,216.5 L 280.5,218 L 277.2,209.5 L 246.8,208.4 L 242.4,217.9 L 229.1,215.9 L 221.2,196.7 L 228,191.9 L 222.5,187.6 L 225.4,184.9 L 208.9,178.8 L 226.1,167 L 224.9,161.9 L 216.9,159.5 L 211.2,150.1 L 210.9,132.1 L 200.6,134.9 L 191.4,125.1 L 185.3,143 L 178,147 L 179.7,152.4 L 166,141.5 L 166,146.4 L 144.1,149.2 L 143,152.7 L 152.6,160.1 L 148.2,167.6 L 135.5,169.7 L 134.1,174.7 L 147.2,182.6 L 146.7,191.3 Z",
    labelX: 260, labelY: 340,
    es: "Puntarenas", en: "Puntarenas",
    descEs: "Cobertura total",
    descEn: "Full coverage",
  },
];

export default function CostaRicaMap() {
  const { lang } = useLang();
  const [hovered, setHovered] = useState<string | null>(null);

  const active = PROVINCES.find(p => p.id === hovered);

  return (
    <section className="py-20 lg:py-28 bg-navy-deep relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
              {lang === "es" ? "Cobertura nacional" : "National coverage"}
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-cream">
            {lang === "es" ? "Presentes en todo" : "Present throughout"}<br />
            <span className="text-gold-gradient font-semibold">
              {lang === "es" ? "Costa Rica" : "Costa Rica"}
            </span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-center">
          {/* Map */}
          <div className="relative">
            <svg
              viewBox="0 0 510 445"
              className="w-full max-w-2xl mx-auto drop-shadow-[0_0_40px_rgba(200,169,110,0.12)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {PROVINCES.map(p => (
                <g
                  key={p.id}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  <path
                    d={p.path}
                    fill={hovered === p.id ? "rgba(200,169,110,0.22)" : "rgba(200,169,110,0.06)"}
                    stroke={hovered === p.id ? "rgba(200,169,110,0.7)" : "rgba(200,169,110,0.25)"}
                    strokeWidth={hovered === p.id ? 1.5 : 1}
                    style={{ transition: "fill 0.2s, stroke 0.2s" }}
                  />
                  <text
                    x={p.labelX}
                    y={p.labelY}
                    textAnchor="middle"
                    fontSize={hovered === p.id ? 11 : 9}
                    fill={hovered === p.id ? "rgba(200,169,110,1)" : "rgba(240,237,232,0.45)"}
                    fontFamily="var(--font-dm-sans)"
                    fontWeight="600"
                    style={{ transition: "font-size 0.2s, fill 0.2s", userSelect: "none" }}
                    pointerEvents="none"
                  >
                    {lang === "en" ? p.en : p.es}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Info panel */}
          <div className="lg:border-l lg:border-gold/10 lg:pl-10">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{    opacity: 0, y: -5  }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">
                    {lang === "es" ? active.es : active.en}
                  </p>
                  <p className="text-cream font-display text-3xl font-light mb-3">
                    {lang === "es" ? active.descEs : active.descEn}
                  </p>
                  <a
                    href="#quote"
                    className="inline-flex items-center gap-2 text-gold text-sm hover:underline"
                  >
                    {lang === "es" ? "Cotizar en esta provincia →" : "Quote in this province →"}
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-silver/50 text-sm leading-relaxed"
                >
                  <p className="font-display text-2xl text-cream/60 font-light mb-3">
                    {lang === "es" ? "Cobertura en las 7 provincias" : "Coverage in all 7 provinces"}
                  </p>
                  <p>
                    {lang === "es"
                      ? "Pasa el cursor sobre cada provincia para ver nuestra cobertura y oficinas."
                      : "Hover each province to see coverage and office details."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Province count */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { v: "7",    l: lang === "es" ? "Provincias" : "Provinces" },
                { v: "100%", l: lang === "es" ? "Cobertura"  : "Coverage"  },
              ].map((s, i) => (
                <div key={i} className="text-center p-3 rounded-sm border border-gold/10 bg-white/[0.02]">
                  <p className="font-display text-3xl text-gold font-semibold">{s.v}</p>
                  <p className="text-silver/50 text-xs uppercase tracking-wide mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
