"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { useEffect, useRef, useState } from "react";

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
        <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight mb-20 whitespace-pre-line">
          {h.headline.split("\n")[0]}
          <br />
          <span className="text-gold-gradient font-semibold">{h.headline.split("\n")[1]}</span>
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-gold/30 pointer-events-none" />

          {h.steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 100} direction="up">
              <div className="relative flex flex-col items-center group">
              {/* Number circle */}
              <div className="relative mb-8">
                <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-navy group-hover:border-gold transition-colors duration-300 relative z-10">
                  <span className="font-display text-gold font-semibold text-lg">{step.num}</span>
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full border border-gold/20 scale-[1.4] group-hover:scale-[1.6] transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              </div>

              {/* Connector line (mobile) */}
              {i < h.steps.length - 1 && (
                <div className="md:hidden w-px h-8 bg-gradient-to-b from-gold/30 to-transparent mb-8 -mt-4" />
              )}

              <h3 className="font-display text-2xl font-semibold text-cream mb-3">{step.title}</h3>
              <p className="text-silver text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </Reveal>
          ))}
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
    </section>
  );
}
