"use client";

import { useLang } from "@/lib/i18n";
import { ShieldCheck, Clock, Lock, Award } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BADGES = [
  {
    Icon: ShieldCheck,
    es: "Regulado por SUGESE",     en: "SUGESE Regulated",
    detailEs: "Supervisados por la Superintendencia General de Seguros de Costa Rica.",
    detailEn: "Supervised by Costa Rica's General Insurance Superintendency.",
  },
  {
    Icon: Clock,
    es: "Cotización en 15 min",    en: "Quote in 15 min",
    detailEs: "Recibe una cotización personalizada en menos de 15 minutos hábiles.",
    detailEn: "Get a personalized quote in less than 15 business minutes.",
  },
  {
    Icon: Lock,
    es: "Datos 100% protegidos",   en: "100% Secure data",
    detailEs: "Cifrado SSL de extremo a extremo. Tus datos nunca se venden a terceros.",
    detailEn: "End-to-end SSL encryption. Your data is never sold to third parties.",
  },
  {
    Icon: Award,
    es: "15+ años de experiencia", en: "15+ years experience",
    detailEs: "Más de 15 años asesorando a familias y empresas en Costa Rica.",
    detailEn: "Over 15 years advising families and businesses across Costa Rica.",
  },
];

export default function TrustBadges() {
  const { lang } = useLang();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-5">
      {BADGES.map(({ Icon, es, en, detailEs, detailEn }, i) => (
        <div
          key={i}
          className="relative"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center gap-2 px-4 py-2
                          bg-white/[0.025] border border-gold/12 rounded-full
                          hover:border-gold/35 hover:bg-white/[0.05] transition-all duration-200 cursor-default">
            <Icon size={13} className="text-gold shrink-0" />
            <span className="text-silver/70 text-xs font-medium whitespace-nowrap">
              {lang === "en" ? en : es}
            </span>
          </div>
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{    opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-20
                           w-56 bg-navy-deep/98 border border-gold/25 rounded-xl
                           px-3.5 py-2.5 shadow-xl pointer-events-none"
              >
                <p className="text-cream/85 text-[11px] leading-relaxed text-center">
                  {lang === "en" ? detailEn : detailEs}
                </p>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                                border-l-4 border-r-4 border-t-4
                                border-l-transparent border-r-transparent border-t-gold/25" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
