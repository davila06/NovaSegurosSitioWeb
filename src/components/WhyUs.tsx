"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { Zap, UserCheck, Star, RefreshCw, Users, TrendingUp, X, Check } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, UserCheck, Star, RefreshCw, Users, TrendingUp,
};

export default function WhyUs() {
  const { t } = useLang();
  const w = t.whyUs;

  return (
    <section id="why-us" className="py-28 lg:py-36 bg-navy-deep relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/4 blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-0 w-[400px] h-[400px] rounded-full bg-navy-light/30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: headline + comparison ── */}
          <Reveal className="lg:sticky lg:top-32" direction="left">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{w.eyebrow}</span>
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight mb-10 whitespace-pre-line">
              {w.headline.split("\n")[0]}
              <br />
              <span className="italic text-gold-gradient font-normal">{w.headline.split("\n")[1]}</span>
            </h2>

            {/* Comparison cards */}
            <div className="relative grid grid-cols-2 gap-3">
              {/* VS badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                              w-9 h-9 rounded-full bg-navy-deep border border-gold/30
                              flex items-center justify-center shadow-lg">
                <span className="text-gold/80 text-[10px] font-bold tracking-wider">VS</span>
              </div>

              {/* Los demás */}
              <div className="rounded-2xl bg-red-950/20 border border-red-900/20 p-5">
                <p className="text-red-400/60 text-[10px] tracking-[0.2em] uppercase mb-4 font-semibold">
                  {w.comparison.othersLabel}
                </p>
                <ul className="space-y-3">
                  {w.comparison.others.map((x) => (
                    <li key={x} className="flex items-center gap-2.5 text-silver/50 text-xs">
                      <span className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0">
                        <X size={10} className="text-red-400/70" />
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              {/* NovaSeguros */}
              <div className="rounded-2xl bg-gold/5 border border-gold/25 p-5
                              shadow-[inset_0_1px_0_rgba(201,168,76,0.1)]">
                <p className="text-gold text-[10px] tracking-[0.2em] uppercase mb-4 font-semibold">
                  {w.comparison.novaLabel}
                </p>
                <ul className="space-y-3">
                  {w.comparison.nova.map((x) => (
                    <li key={x} className="flex items-center gap-2.5 text-cream text-xs font-medium">
                      <span className="w-5 h-5 rounded-full bg-gold/15 border border-gold/35 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-gold" />
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* ── Right: pillar cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {w.pillars.map((pillar, i) => {
              const Icon = ICON_MAP[pillar.icon] ?? Star;
              const num = String(i + 1).padStart(2, "0");
              return (
                <Reveal key={pillar.title} delay={i * 70} direction="right">
                  <div className="relative group overflow-hidden rounded-2xl
                                  border border-white/[0.06] bg-gradient-to-br from-slate/60 to-navy-deep/80
                                  p-6 transition-all duration-300
                                  hover:-translate-y-1 hover:border-gold/30
                                  hover:shadow-[0_12px_40px_rgba(201,168,76,0.08)]">

                    {/* Ghost number */}
                    <span className="absolute -top-3 -right-1 font-display text-[80px] font-bold
                                     leading-none text-white/[0.025] select-none pointer-events-none">
                      {num}
                    </span>

                    {/* Icon */}
                    <div className="mb-5 w-12 h-12 rounded-xl
                                    bg-gradient-to-br from-gold/15 to-gold/5
                                    border border-gold/20
                                    flex items-center justify-center
                                    group-hover:from-gold/25 group-hover:to-gold/10
                                    group-hover:border-gold/40
                                    group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]
                                    transition-all duration-300">
                      <Icon size={20} className="text-gold" />
                    </div>

                    <h3 className="text-cream font-semibold text-sm mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-silver/65 text-xs leading-relaxed">
                      {pillar.desc}
                    </p>

                    {/* Sliding bottom accent */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0
                                    bg-gradient-to-r from-gold/70 via-gold/40 to-transparent
                                    group-hover:w-full transition-all duration-500 ease-out" />
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
