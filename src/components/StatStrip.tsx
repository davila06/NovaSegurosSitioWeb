"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Record<string, Stat[]> = {
  es: [
    { value: 500,  suffix: "+",  label: "Clientes protegidos"   },
    { value: 98,   suffix: "%",  label: "Satisfacción"          },
    { value: 15,   suffix: "+",  label: "Años de experiencia"   },
    { value: 12,   suffix: "+",  label: "Aseguradoras aliadas"  },
  ],
  en: [
    { value: 500,  suffix: "+",  label: "Protected clients"     },
    { value: 98,   suffix: "%",  label: "Satisfaction rate"     },
    { value: 15,   suffix: "+",  label: "Years of experience"   },
    { value: 12,   suffix: "+",  label: "Partner insurers"      },
  ],
};

// Single flipping digit
function FlipDigit({ digit }: { digit: string }) {
  return (
    <span className="relative inline-flex items-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0,      opacity: 1 }}
          exit={{    y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.6 }}
          className="inline-block leading-none"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FlipNumber({ value, suffix, duration = 1500 }: Stat & { duration?: number }) {
  const [display, setDisplay] = useState(0);
  const triggered = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t     = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.floor(eased * value));
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  const digits = String(display).split("");

  return (
    <span ref={ref} className="inline-flex items-end tabular-nums">
      {digits.map((d, i) => (
        <FlipDigit key={i} digit={d} />
      ))}
      <FlipDigit key="suffix" digit={suffix} />
    </span>
  );
}

export default function StatStrip() {
  const { lang } = useLang();
  const stats     = STATS[lang] ?? STATS.es;

  return (
    <section aria-label="Estadísticas" className="relative overflow-hidden">
      {/* Hairline gold borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold/25 to-transparent" />

      {/* Subtle warm glow in centre */}
      <div className="absolute inset-0 bg-linear-to-r from-navy-deep via-slate/60 to-navy-deep pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <p className="font-display text-5xl lg:text-6xl font-semibold text-gold-gradient leading-none mb-2">
                <FlipNumber {...stat} duration={1400 + i * 150} />
              </p>
              <p className="text-silver/60 text-xs tracking-[0.15em] uppercase font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
