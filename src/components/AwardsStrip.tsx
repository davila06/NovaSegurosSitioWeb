"use client";

import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";

const AWARDS = {
  es: [
    { label: "SUGESE",         sub: "Supervisión SUGESE 2024"               },
    { label: "ISO 9001",       sub: "Calidad certificada"                    },
    { label: "Top Broker",     sub: "Premio INS Broker Destacado 2023"       },
    { label: "Best Service",   sub: "Reconocimiento CNSF Servicio al Cliente" },
    { label: "Digital Award",  sub: "Transformación Digital FinTech CR 2023"  },
    { label: "4.9 / 5",        sub: "Calificación promedio clientes"          },
  ],
  en: [
    { label: "SUGESE",         sub: "SUGESE Supervised 2024"                 },
    { label: "ISO 9001",       sub: "Certified quality"                       },
    { label: "Top Broker",     sub: "INS Outstanding Broker Award 2023"       },
    { label: "Best Service",   sub: "CNSF Customer Service Recognition"       },
    { label: "Digital Award",  sub: "CR FinTech Digital Transformation 2023"  },
    { label: "4.9 / 5",        sub: "Average client rating"                   },
  ],
};

export default function AwardsStrip() {
  const { lang } = useLang();
  const awards = AWARDS[lang as "es" | "en"] ?? AWARDS.es;

  return (
    <section aria-label="Reconocimientos" className="py-20 bg-navy relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />

      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[200px] rounded-full bg-gold/4 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <Reveal className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-px bg-gold/50" />
            <span className="text-gold/70 text-[10px] tracking-[0.3em] uppercase font-medium">
              {lang === "es" ? "Reconocimientos & Certificaciones" : "Awards & Certifications"}
            </span>
            <div className="w-6 h-px bg-gold/50" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {awards.map((a, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(200,169,110,0.45)" }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="group flex flex-col items-center text-center p-5 rounded-xl
                           border border-gold/15 bg-navy-light/30 backdrop-blur-sm
                           hover:bg-gold/5 transition-colors duration-300 cursor-default"
              >
                <span className="font-display text-xl font-semibold text-gold-gradient mb-1">
                  {a.label}
                </span>
                <span className="text-silver/50 text-[10px] leading-tight tracking-wide">
                  {a.sub}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
