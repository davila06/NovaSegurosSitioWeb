"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

const ROWS = {
  es: [
    { feature: "Tiempo de cotización",         nova: "15 minutos",  other: "3 – 5 días"       },
    { feature: "Asesor personal dedicado",      nova: "✓",           other: "✗"                },
    { feature: "Aseguradoras comparadas",       nova: "12+",         other: "1 – 2"            },
    { feature: "Gestión completa de reclamos",  nova: "✓",           other: "Parcial"          },
    { feature: "Atención WhatsApp VIP",         nova: "✓",           other: "✗"                },
    { feature: "Proceso 100% digital",          nova: "✓",           other: "✗"                },
    { feature: "Sin costo adicional",           nova: "✓",           other: "Comisiones extra" },
    { feature: "Revisión anual de cobertura",   nova: "✓",           other: "✗"                },
  ],
  en: [
    { feature: "Quote turnaround",              nova: "15 minutes",  other: "3 – 5 days"       },
    { feature: "Dedicated personal advisor",    nova: "✓",           other: "✗"                },
    { feature: "Insurers compared",             nova: "12+",         other: "1 – 2"            },
    { feature: "Full claims management",        nova: "✓",           other: "Partial"          },
    { feature: "WhatsApp VIP support",          nova: "✓",           other: "✗"                },
    { feature: "100% digital process",          nova: "✓",           other: "✗"                },
    { feature: "No hidden fees",                nova: "✓",           other: "Extra commissions"},
    { feature: "Annual coverage review",        nova: "✓",           other: "✗"                },
  ],
};

function Cell({ value, variant }: { value: string; variant: "nova" | "other" }) {
  const isCheckMark = value === "✓";
  const isCross     = value === "✗";

  return (
    <td className={`px-5 py-4 text-center text-sm ${variant === "nova" ? "bg-gold/5" : ""}`}>
      {isCheckMark ? (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 border border-gold/30">
          <Check size={12} className="text-gold" />
        </span>
      ) : isCross ? (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10">
          <X size={12} className="text-silver/30" />
        </span>
      ) : (
        <span className={variant === "nova" ? "text-gold font-semibold" : "text-silver/50"}>
          {value}
        </span>
      )}
    </td>
  );
}

export default function ComparisonTable() {
  const { lang } = useLang();
  const rows = ROWS[lang as "es" | "en"] ?? ROWS.es;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="py-24 lg:py-32 bg-navy-deep relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />

      {/* Bg glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] rounded-full bg-gold/3 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <Reveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
              {lang === "es" ? "¿Por qué elegirnos?" : "Why choose us?"}
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <motion.h2 style={{ y }} className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight">
            {lang === "es" ? "La diferencia" : "The difference"}<br />
            <span className="text-gold-gradient font-semibold">
              {lang === "es" ? "es notoria" : "is clear"}
            </span>
          </motion.h2>
        </Reveal>

        {/* Table */}
        <Reveal direction="up">
          <div className="overflow-hidden rounded-sm border border-gold/20 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            <table className="w-full border-collapse">
              {/* Head — sticky */}
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gold/20">
                  <th className="px-5 py-4 text-left text-xs tracking-[0.15em] uppercase text-silver/50 font-medium w-1/2 bg-navy-deep/95 backdrop-blur-sm">
                    {lang === "es" ? "Característica" : "Feature"}
                  </th>
                  <th className="px-5 py-4 text-center text-xs tracking-[0.15em] uppercase font-bold text-gold bg-gold/[0.08] w-1/4 backdrop-blur-sm">
                    NovaSeguros
                  </th>
                  <th className="px-5 py-4 text-center text-xs tracking-[0.15em] uppercase text-silver/40 font-medium w-1/4 bg-navy-deep/95 backdrop-blur-sm">
                    {lang === "es" ? "Los demás" : "Others"}
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gold/[0.06] last:border-0 group transition-colors duration-200
                      hover:bg-gold/[0.04] hover:border-gold/20 ${
                      i % 2 === 0 ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    <td className="px-5 py-4 text-sm text-cream/80 group-hover:text-cream transition-colors duration-200">{row.feature}</td>
                    <Cell value={row.nova}  variant="nova"  />
                    <Cell value={row.other} variant="other" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="#quote"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-deep
                       text-sm font-bold px-8 py-3.5 rounded-sm transition-all duration-300
                       hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
          >
            {lang === "es" ? "Empezar ahora — es gratis" : "Start now — it's free"}
          </a>
        </div>
      </div>
    </section>
  );
}
