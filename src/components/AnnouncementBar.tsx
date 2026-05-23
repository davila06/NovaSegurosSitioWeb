"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

const STORAGE_KEY = "nova_announcement_dismissed";

const MESSAGES = {
  es: [
    "Hasta 30% de descuento en tu primera póliza · Oferta válida para nuevos clientes",
    "Cotización personalizada en menos de 15 minutos · Sin costo ni compromiso",
    "Regulados por SUGESE · 500+ clientes satisfechos · Calificación 4.9/5",
  ],
  en: [
    "Up to 30% off your first policy · Offer valid for new clients",
    "Personalized quote in under 15 minutes · Free & no commitment",
    "SUGESE regulated · 500+ happy clients · 4.9/5 rating",
  ],
} as const;

export default function AnnouncementBar() {
  const { lang } = useLang();
  const [visible,  setVisible]  = useState(false);
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [fadeIn,   setFadeIn]   = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  // Rotate messages every 6 s with fade transition
  useEffect(() => {
    if (!visible) return;
    const messages = MESSAGES[lang as "es" | "en"] ?? MESSAGES.es;
    const id = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % messages.length);
        setFadeIn(true);
      }, 300);
    }, 6000);
    return () => clearInterval(id);
  }, [visible, lang]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const messages = MESSAGES[lang as "es" | "en"] ?? MESSAGES.es;
  const text = messages[msgIdx];
  const cta  = lang === "es" ? "Cotizar ahora →" : "Get a quote →";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 overflow-hidden"
        >
          <div className="bg-gold/10 border-b border-gold/20 py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Zap size={13} className="text-gold shrink-0" />
                <p
                  className="text-gold/90 text-[11px] tracking-[0.08em] truncate transition-opacity duration-300"
                  style={{ opacity: fadeIn ? 1 : 0 }}
                >
                  {text}
                </p>
                <a
                  href="#quote"
                  onClick={dismiss}
                  className="shrink-0 text-[10px] font-bold text-navy-deep bg-gold hover:bg-gold-light
                             px-3 py-1 rounded-full transition-colors duration-200 hidden sm:block"
                >
                  {cta}
                </a>
              </div>
              <button
                onClick={dismiss}
                aria-label="Cerrar anuncio"
                className="shrink-0 text-silver/50 hover:text-gold transition-colors ml-2"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
