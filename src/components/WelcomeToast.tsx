"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COPY = {
  es: {
    title: "¡Bienvenido a NovaSeguros!",
    body:  "Cotiza tu seguro en minutos. Cobertura ideal, precio justo.",
    cta:   "Ver planes",
  },
  en: {
    title: "Welcome to NovaSeguros!",
    body:  "Get a quote in minutes. Right coverage, right price.",
    cta:   "View plans",
  },
};

const STORAGE_KEY = "nova_toast_seen";

export default function WelcomeToast() {
  const [visible, setVisible] = useState(false);
  const { lang }  = useLang();
  const copy       = COPY[lang as "es" | "en"] ?? COPY.es;

  useEffect(() => {
    // Only show once per session, and only after splash animation finishes (~3 s)
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    const id = window.setTimeout(() => setVisible(true), 3600);
    return () => clearTimeout(id);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed bottom-7 left-7 z-50 max-w-xs w-full
                     glass-card rounded-lg px-5 py-4 shadow-2xl shadow-black/40"
        >
          {/* Gold top accent line */}
          <div className="absolute inset-x-0 top-0 h-px rounded-t-lg bg-linear-to-r from-transparent via-gold/50 to-transparent" />

          {/* Dismiss */}
          <button
            onClick={dismiss}
            aria-label="Cerrar"
            className="absolute top-3 right-3 text-silver/40 hover:text-silver transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
              <Shield size={16} className="text-gold" />
            </div>
            <div>
              <p className="text-cream text-sm font-semibold mb-0.5">{copy.title}</p>
              <p className="text-silver/70 text-xs leading-relaxed">{copy.body}</p>
              <a
                href="#quote"
                onClick={dismiss}
                className="mt-3 inline-flex items-center gap-1.5
                           text-xs font-medium text-gold hover:text-gold-light
                           border-b border-gold/30 hover:border-gold/70
                           transition-all duration-200 pb-px"
              >
                {copy.cta} →
              </a>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
