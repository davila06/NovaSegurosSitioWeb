"use client";

import { useLang } from "@/lib/i18n";
import { Check, ArrowRight, Crown } from "lucide-react";

// ─── Single plan data ─────────────────────────────────────────────────────────
const FEATURES: Record<"es" | "en", string[]> = {
  es: ["Asesor personal exclusivo", "Cotización en 15 minutos", "Gestión completa de reclamos", "Revisión anual de coberturas", "WhatsApp VIP con respuesta inmediata", "Alertas automáticas de renovación"],
  en: ["Exclusive personal advisor", "Quote in 15 minutes", "Full claims management", "Annual coverage review", "VIP WhatsApp instant response", "Automatic renewal alerts"],
};

export default function Membership() {
  const { t, lang } = useLang();
  const m = t.membership;

  return (
    <section id="membership" className="py-28 lg:py-36 bg-navy-deep relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Gold radial center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[600px] rounded-full bg-gold/4 blur-[130px]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Crown size={16} className="text-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{m.eyebrow}</span>
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight mb-6 whitespace-pre-line">
              {m.headline.split("\n")[0]}
              <br />
              <span className="text-gold-gradient font-semibold italic">{m.headline.split("\n")[1]}</span>
            </h2>
            <p className="text-silver text-base leading-relaxed mb-10">{m.sub}</p>

            <a
              href="#quote"
              className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold px-8 py-4 rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
            >
              {m.cta}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>

            <div className="mt-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold/70 text-xs tracking-wide">{m.badge}</span>
            </div>
          </div>

          {/* Right: single Elite VIP card */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-gold/10 rounded blur-[50px] scale-95 pointer-events-none" />

            <div className="relative bg-gradient-to-br from-slate to-navy-deep border border-gold/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.12)]">
              {/* Header strip */}
              <div className="bg-gold/10 border-b border-gold/20 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                    <Crown size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-cream font-semibold text-sm leading-none">Elite VIP</p>
                    <p className="text-gold text-[10px] tracking-[0.15em] uppercase mt-0.5">NovaSeguros</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gold font-display text-3xl font-semibold leading-none">₡5,000</p>
                  <p className="text-silver/60 text-[10px] mt-1 tracking-wide">
                    {lang === "es" ? "por mes" : "per month"}
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="px-8 py-6 space-y-4">
                {FEATURES[lang].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 group">
                    <span className="w-5 h-5 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold/25 transition-colors">
                      <Check size={11} className="text-gold" />
                    </span>
                    <span className="text-cream/80 text-sm group-hover:text-cream transition-colors">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Footer CTA */}
              <div className="px-8 pb-8">
                <a
                  href="#quote"
                  className="group flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
                >
                  {m.cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </a>
                <p className="text-center text-silver/40 text-[10px] mt-3 tracking-wide">
                  {lang === "es" ? "Sin permanencia · cancela cuando quieras" : "No commitment · cancel anytime"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
