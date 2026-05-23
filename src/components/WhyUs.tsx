"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { useState, useEffect, useRef } from "react";
import { Zap, UserCheck, Star, RefreshCw, Users, TrendingUp, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, UserCheck, Star, RefreshCw, Users, TrendingUp,
};

export default function WhyUs() {
  const { t } = useLang();
  const w = t.whyUs;
  const TOTAL = w.pillars.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);

  const go = (delta: number) => {
    activeRef.current = (activeRef.current + delta + TOTAL) % TOTAL;
    setActive(activeRef.current);
  };

  const goToCard = (i: number) => {
    activeRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 3800);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return (
    <section id="why-us" className="py-28 lg:py-36 bg-navy-deep relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-gold/4 blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-0 w-100 h-100 rounded-full bg-navy-light/30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: headline + comparison ── */}
          <Reveal className="lg:sticky lg:top-32" direction="left">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{w.eyebrow}</span>
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight mb-10">
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

          {/* ── Right: coverflow carousel ── */}
          <div
            className="flex flex-col gap-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
          {/* Stage — perspective without preserve-3d, overflow:hidden is safe here */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: 210, perspective: 800 }}
          >
            {w.pillars.map((pillar, i) => {
              const Icon = ICON_MAP[pillar.icon] ?? Star;
              const isActive = i === active;

              // Wrapped offset from active: range -TOTAL/2 .. +TOTAL/2
              const raw    = (i - active + TOTAL) % TOTAL;
              const offset = raw > TOTAL / 2 ? raw - TOTAL : raw;
              const abs    = Math.abs(offset);
              if (abs > 2) return null;

              const xShift = offset * 150;
              const scaleV = abs === 0 ? 1 : abs === 1 ? 0.8 : 0.64;
              const rotY   = offset * 22;
              const opac   = abs === 0 ? 1 : abs === 1 ? 0.6 : 0.25;
              const zIdx   = 20 - abs * 6;

              return (
                <motion.div
                  key={i}
                  className="absolute cursor-pointer"
                  style={{
                    width: 160, height: 180,
                    left: "50%", top: "50%",
                    marginLeft: -80, marginTop: -90,
                    zIndex: zIdx,
                  }}
                  animate={{ x: xShift, scale: scaleV, rotateY: rotY, opacity: opac }}
                  transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
                  onClick={() => goToCard(i)}
                >
                  <div className={`h-full rounded-2xl flex flex-col items-center justify-center gap-3 p-5
                    border relative overflow-hidden
                    ${isActive
                      ? "border-gold/50 bg-linear-to-br from-slate/90 to-navy-deep shadow-[0_0_32px_rgba(200,169,110,0.2)]"
                      : "border-white/8 bg-slate/50"
                    }`}>
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0
                      transition-all duration-500
                      ${isActive
                        ? "bg-gold/20 border-gold/45 shadow-[0_0_18px_rgba(200,169,110,0.28)]"
                        : "bg-white/5 border-white/10"
                      }`}
                      whileHover={{ rotate: 8, scale: 1.18 }}
                      transition={{ type: "spring", stiffness: 320, damping: 14 }}
                    >
                      <Icon size={20} className={isActive ? "text-gold" : "text-silver/40"} />
                    </motion.div>
                    <p className={`text-xs font-semibold leading-tight text-center px-1
                      transition-colors duration-500
                      ${isActive ? "text-cream" : "text-silver/30"}`}>
                      {pillar.title}
                    </p>
                    {isActive && (
                      <motion.div
                        key={`acc-${i}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="absolute bottom-0 left-4 right-4 h-0.5 origin-left rounded-full"
                        style={{ background: "linear-gradient(to right, rgba(200,169,110,0.8), transparent)" }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            {(() => {
              const pillar = w.pillars[active];
              const Icon   = ICON_MAP[pillar.icon] ?? Star;
              return (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  className="rounded-2xl border border-gold/20 bg-linear-to-br from-slate/60 to-navy-deep/80 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/35 flex items-center
                                    justify-center shrink-0 shadow-[0_0_18px_rgba(200,169,110,0.15)]">
                      <Icon size={19} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="text-cream font-semibold text-sm leading-snug">{pillar.title}</h3>
                        {"metric" in pillar && pillar.metric && (
                          <motion.span
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                            className="ml-auto shrink-0 text-[11px] font-bold text-navy-deep bg-gold px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(200,169,110,0.5)] tabular-nums"
                          >
                            {(pillar as { metric: string }).metric}
                          </motion.span>
                        )}
                      </div>
                      <p className="text-silver/65 text-xs leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-4 h-px origin-left rounded-full"
                    style={{ background: "linear-gradient(to right, rgba(200,169,110,0.4), transparent)" }}
                  />
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {w.pillars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToCard(i)}
                  aria-label={`Tarjeta ${i + 1}`}
                  className={`relative overflow-hidden rounded-full transition-all duration-300 h-2 ${
                    i === active ? "w-10 bg-gold/20" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                >
                  {i === active && !paused && (
                    <motion.div
                      key={active}
                      className="absolute inset-y-0 left-0 bg-gold rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.8, ease: "linear" }}
                    />
                  )}
                  {i === active && paused && (
                    <div className="absolute inset-y-0 left-0 bg-gold rounded-full w-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                aria-label="Anterior"
                className="w-9 h-9 rounded-full border border-white/10 hover:border-gold/40
                           bg-white/5 hover:bg-gold/10 flex items-center justify-center
                           text-silver hover:text-gold transition-all duration-200"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Siguiente"
                className="w-9 h-9 rounded-full border border-white/10 hover:border-gold/40
                           bg-white/5 hover:bg-gold/10 flex items-center justify-center
                           text-silver hover:text-gold transition-all duration-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-px w-full bg-white/5 rounded-full overflow-hidden">
            {!paused && (
              <motion.div
                key={`bar-${active}`}
                className="h-full bg-gold/50 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.8, ease: "linear" }}
              />
            )}
          </div>
          </div>

        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-[#141414] pointer-events-none z-10" />
    </section>
  );
}
