"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { useEffect, useRef, useState } from "react";
import ParallaxHeading from "@/components/ParallaxHeading";
import { motion } from "framer-motion";

// ─── Count-up stat ────────────────────────────────────────────────────────────
function CountUpStat({ value }: { value: string }) {
  const match = value.match(/^(\d+\.?\d*)(.*)/);
  if (!match) return <>{value}</>;

  const target = parseFloat(match[1]);
  const suffix = match[2];
  const isDecimal = match[1].includes(".");

  const [count, setCount] = useState(0);
  const triggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        const startTime = performance.now();
        const duration = 1600;
        const animate = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
          const current = eased * target;
          setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
          if (t < 1) requestAnimationFrame(animate);
          else setCount(target);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, isDecimal]);

  return (
    <div ref={ref}>
      {isDecimal ? count.toFixed(1) : count}{suffix}
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useLang();
  const h = t.howItWorks;

  // ── Animated connector line ────────────────────────────────────────────────
  const lineRef    = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFilled(true); },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-28 lg:py-36 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      {/* Center radial */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] rounded-full bg-gold/3 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-8 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{h.eyebrow}</span>
          <div className="w-8 h-px bg-gold" />
        </div>
        <ParallaxHeading className="mb-20">
          <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight whitespace-pre-line">
            {h.headline.split("\n")[0]}
            <br />
            <span className="text-gold-gradient font-semibold">{h.headline.split("\n")[1]}</span>
          </h2>
        </ParallaxHeading>

        {/* Steps */}
        <div ref={lineRef} className="relative">
          {/* Desktop: grid with connector line */}
          <div className="hidden md:grid grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) — animated fill on intersection */}
          <div className="hidden md:block absolute top-16 left-[calc(33%+28px)] right-[calc(33%+28px)] h-px bg-gold/10 pointer-events-none overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold/50 via-gold-light/60 to-gold/40"
              initial={{ scaleX: 0 }}
              animate={filled ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
              style={{ originX: 0 }}
            />
          </div>
          {/* Travel dot on the connector */}
          {filled && (
            <motion.div
              className="hidden md:block absolute top-[60px] w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(200,169,110,0.8)] pointer-events-none z-10"
              initial={{ left: "calc(33% + 28px)", opacity: 0 }}
              animate={{ left: "calc(67% - 28px)", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
              style={{ marginLeft: -4 }}
            />
          )}

          {h.steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 100} direction="up">
              <div className="relative flex flex-col items-center group">
              {/* Number circle */}
              <div className="relative mb-8">
                <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-navy group-hover:border-gold transition-colors duration-300 relative z-10">
                  <span className="font-display text-gold font-semibold text-lg">{step.num}</span>
                </div>
                {/* Pulse ring on scroll */}
                {filled && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-gold/30 pointer-events-none"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.4, ease: "easeOut" }}
                  />
                )}
                {/* Hover pulse ring */}
                <div className="absolute inset-0 rounded-full border border-gold/20 scale-[1.4] group-hover:scale-[1.6] transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              </div>

              <h3 className="font-display text-2xl font-semibold text-cream mb-3">{step.title}</h3>
              <p className="text-silver text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </Reveal>
          ))}
          </div>

          {/* Mobile: horizontal scroll snap carousel */}
          <div className="md:hidden flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
               style={{ scrollbarWidth: "none" }}>
            {h.steps.map((step, i) => (
              <div key={step.num}
                   className="snap-center shrink-0 w-[75vw] max-w-xs flex flex-col items-center text-center p-6
                              glass-card rounded-xl border border-gold/20">
                <div className="w-12 h-12 rounded-full border border-gold/40 bg-navy flex items-center justify-center mb-5">
                  <span className="font-display text-gold font-semibold text-lg">{step.num}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-cream mb-2">{step.title}</h3>
                <p className="text-silver text-sm leading-relaxed">{step.desc}</p>
                {/* Connector dot indicator */}
                <div className="flex gap-1.5 mt-5">
                  {h.steps.map((_, j) => (
                    <div key={j} className={`w-1.5 h-1.5 rounded-full transition-colors ${j === i ? "bg-gold" : "bg-gold/20"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-24 pt-10 border-t border-gold/10">
          {h.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-light text-gold-gradient mb-2">
                <CountUpStat value={stat.value} />
              </div>
              <div className="text-silver text-xs tracking-[0.15em] uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Section-to-section fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0A0A0A] pointer-events-none z-10" />
    </section>
  );
}
