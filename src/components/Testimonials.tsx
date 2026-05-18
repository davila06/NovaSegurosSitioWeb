"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const { t } = useLang();
  const te = t.testimonials;

  return (
    <section className="py-28 lg:py-36 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{te.eyebrow}</span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight whitespace-pre-line">
            {te.headline.split("\n")[0]}
            <br />
            <span className="text-gold-gradient font-semibold">{te.headline.split("\n")[1]}</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {te.items.map((item, i) => (
            <Reveal key={i} delay={i * 80} direction="up">
              <div
                className="glass-card rounded-sm p-8 hover:border-gold/30 transition-all duration-300 group relative"
              >
              <Quote size={28} className="text-gold/20 absolute top-6 right-6" />
              <p className="text-cream/80 text-base leading-relaxed mb-7 font-light italic relative z-10">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate to-navy-deep border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-semibold text-xs">{item.initials}</span>
                </div>
                <div>
                  <div className="text-cream font-semibold text-sm">{item.name}</div>
                  <div className="text-silver text-xs">{item.role}</div>
                </div>
                {/* Stars */}
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-gold text-sm">★</span>
                  ))}
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { value: "4.9/5", label: "Calificación promedio" },
            { value: "SUGESE", label: "Regulado por" },
            { value: "100%", label: "Datos protegidos" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 px-6 py-3 rounded-sm border border-gold/15 bg-gold/3">
              <span className="font-display text-2xl text-gold font-semibold">{badge.value}</span>
              <span className="text-silver text-xs tracking-wide">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
