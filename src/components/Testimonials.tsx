"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { trackEvent } from "@/lib/analytics";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const { t, lang } = useLang();
  const te = t.testimonials;
  const total = te.items.length;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  // Touch / pointer swipe state
  const dragStartX = useRef<number | null>(null);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + total) % total);
    trackEvent("testimonial_nav", { direction: dir === 1 ? "next" : "prev" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setPaused(true);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    dragStartX.current = null;
    setPaused(false);
  };

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, total]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { setPaused(true); setDirection(-1); setCurrent(p => (p - 1 + total) % total); }
      if (e.key === "ArrowRight") { setPaused(true); setDirection(1);  setCurrent(p => (p + 1 + total) % total); }
    };
    window.addEventListener("keydown", handler, { passive: true });
    return () => window.removeEventListener("keydown", handler);
  }, [total]);

  // Stack depths: 0 = active (front), 1 = behind, 2 = furthest back
  const getItem = (offset: number) => te.items[(current + offset + total) % total];

  const stackCards = [
    { offset: 2, rotate: 6,  translateY: 20, scale: 0.92, opacity: 0.4 },
    { offset: 1, rotate: -3, translateY: 10, scale: 0.96, opacity: 0.65 },
  ];

  return (
    <section id="testimonials" className="py-28 lg:py-36 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />
      <div className="absolute left-0 top-1/3 w-72 h-72 rounded-full bg-gold/3 blur-[100px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-72 h-72 rounded-full bg-navy-light/40 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <Reveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{te.eyebrow}</span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight">
            {te.headline.split("\n")[0]}
            <br />
            <span className="text-gold-gradient font-semibold">{te.headline.split("\n")[1]}</span>
          </h2>
        </Reveal>

        {/* Card stack */}
        <div
          className="flex flex-col items-center gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { dragStartX.current = null; setPaused(false); }}
          style={{ touchAction: "pan-y", userSelect: "none" }}
        >
          {/* Stack area */}
          <div className="relative w-full max-w-2xl mx-auto" style={{ height: 300 }}>
            {/* Background depth cards */}
            {stackCards.map(({ offset, rotate, translateY, scale, opacity }) => {
              const item = getItem(offset);
              return (
                <div
                  key={offset}
                  className="absolute inset-0 glass-card rounded-2xl p-8 pointer-events-none"
                  style={{
                    transform: `rotate(${rotate}deg) translateY(${translateY}px) scale(${scale})`,
                    opacity,
                    zIndex: 3 - offset,
                  }}
                >
                  <p className="text-cream/60 text-sm leading-relaxed font-light italic line-clamp-3">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              );
            })}

            {/* Active front card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80, rotate: direction * 6, scale: 0.95 }}
                animate={{ opacity: 1, x: 0,              rotate: 0,              scale: 1    }}
                exit={{    opacity: 0, x: -direction * 80, rotate: -direction * 6, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="absolute inset-0 z-10"
              >
                <div className="h-full rounded-2xl border border-gold/30 bg-gradient-to-br from-slate/80 to-navy-deep/90 p-8 flex flex-col justify-between shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  {/* Quote icon */}
                  <Quote size={32} className="text-gold/25 absolute top-6 right-6" />

                  {/* Quote text */}
                  <p className="text-cream/90 text-base leading-relaxed font-light italic relative z-10">
                    &ldquo;{te.items[current].quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-6">
                    {/* Avatar ring */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-navy-deep"
                           style={{ background: "linear-gradient(135deg, #C8A96E, #E0C98A)" }}>
                        {te.items[current].initials}
                      </div>
                      <div className="absolute -inset-0.5 rounded-full border border-gold/40 pointer-events-none" />
                    </div>
                    <div>
                      <div className="text-cream font-semibold text-sm">{te.items[current].name}</div>
                      <div className="text-silver/70 text-xs mt-0.5">{te.items[current].role}</div>
                    </div>
                    {/* Stars — animated fill */}
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <motion.span
                          key={j}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 + j * 0.07, type: "spring", stiffness: 300, damping: 18 }}
                          className="text-gold text-sm"
                        >★</motion.span>
                      ))}
                    </div>
                  </div>
                  {/* Verified badge */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-gold/10 border border-gold/25 rounded-full px-2 py-0.5">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="text-gold shrink-0">
                        <path d="M6 1L7.5 4H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4H4.5L6 1Z" fill="currentColor" opacity="0.9"/>
                      </svg>
                      <span className="text-gold text-[9px] font-semibold tracking-wide">
                        {lang === "en" ? "Verified" : "Verificado"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-8 right-8 h-px"
                       style={{ background: "linear-gradient(to right, transparent, rgba(200,169,110,0.4), transparent)" }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => go(-1)}
              aria-label="Anterior testimonio"
              className="w-10 h-10 rounded-full border border-white/10 hover:border-gold/40
                         bg-white/5 hover:bg-gold/10 flex items-center justify-center
                         text-silver hover:text-gold transition-all duration-200"
            >
              <ChevronLeft size={17} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {te.items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  aria-label={`Testimonio ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-5 h-2 bg-gold" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Siguiente testimonio"
              className="w-10 h-10 rounded-full border border-white/10 hover:border-gold/40
                         bg-white/5 hover:bg-gold/10 flex items-center justify-center
                         text-silver hover:text-gold transition-all duration-200"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <Reveal className="mt-16 flex flex-wrap items-center justify-center gap-6">
          {[
            { value: "4.9/5", label: "Calificación promedio" },
            { value: "SUGESE", label: "Regulado por" },
            { value: "100%", label: "Datos protegidos" },
          ].map((badge, i) => (
            <motion.div
              key={badge.label}
              whileHover={{ y: -3, borderColor: "rgba(200,169,110,0.4)" }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-gold/15 bg-gold/3 cursor-default"
            >
              <span className="font-display text-2xl text-gold font-semibold">{badge.value}</span>
              <span className="text-silver text-xs tracking-wide">{badge.label}</span>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
