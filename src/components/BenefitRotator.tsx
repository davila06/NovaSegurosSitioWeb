"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

const BENEFITS = {
  es: [
    "Rápido · Cotización en 15 minutos",
    "Sin papeleos · 100% digital",
    "Asesor personal dedicado",
    "Sin compromiso · Gratis",
  ],
  en: [
    "Fast · Quote in 15 minutes",
    "No paperwork · 100% digital",
    "Dedicated personal advisor",
    "No commitment · Free",
  ],
};

export default function BenefitRotator({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const benefits = BENEFITS[lang as "es" | "en"] ?? BENEFITS.es;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % benefits.length), 2800);
    return () => clearInterval(id);
  }, [benefits.length]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-px h-4 bg-gold/40 shrink-0" />
      <div className="relative h-5 overflow-hidden min-w-[220px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{    y: -12, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0 text-xs text-silver/60 font-medium tracking-wide"
          >
            {benefits[idx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
