"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Check, ChevronDown, Lock, BarChart2, Megaphone } from "lucide-react";
import { useLang } from "@/lib/i18n";

const STORAGE_KEY = "nova_cookie_v2";

interface CookiePrefs { analytics: boolean; marketing: boolean; }

const COPY = {
  es: {
    title:    "Usamos cookies",
    body:     "Usamos cookies para mejorar tu experiencia y mostrarte contenido relevante.",
    policy:   "Política de Privacidad",
    acceptAll: "Aceptar todo",
    savePrefs: "Guardar preferencias",
    decline:   "Rechazar todo",
    manage:    "Gestionar preferencias",
    cats: {
      essential: { name: "Esenciales",  desc: "Necesarias para que el sitio funcione. No se pueden desactivar." },
      analytics: { name: "Analíticas",  desc: "Nos ayudan a entender cómo usas el sitio para mejorarlo." },
      marketing: { name: "Marketing",   desc: "Permiten mostrarte anuncios relevantes en otras plataformas." },
    },
  },
  en: {
    title:    "We use cookies",
    body:     "We use cookies to enhance your experience and show you relevant content.",
    policy:   "Privacy Policy",
    acceptAll: "Accept all",
    savePrefs: "Save preferences",
    decline:   "Reject all",
    manage:    "Manage preferences",
    cats: {
      essential: { name: "Essential",  desc: "Required for the site to work. Cannot be disabled." },
      analytics: { name: "Analytics",  desc: "Help us understand how you use the site to improve it." },
      marketing: { name: "Marketing",  desc: "Allow us to show you relevant ads on other platforms." },
    },
  },
} as const;

export default function CookieBanner() {
  const { lang } = useLang();
  const [visible,   setVisible]  = useState(false);
  const [expanded,  setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({ analytics: true, marketing: true });
  const copy = COPY[lang as "es" | "en"] ?? COPY.es;

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (consent: CookiePrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, ...consent }));
    window.dispatchEvent(new CustomEvent("nova:cookie-saved", { detail: { essential: true, ...consent } }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          role="dialog"
          aria-modal="true"
          aria-label={lang === "es" ? "Aviso de cookies" : "Cookie notice"}
          aria-describedby="cookie-banner-body"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9998]
                     w-[calc(100%-2rem)] max-w-lg
                     bg-navy-deep border border-gold/20 rounded-xl
                     shadow-[0_16px_48px_rgba(0,0,0,0.55)]
                     px-5 py-4"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <Cookie size={16} className="text-gold shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-cream text-xs font-semibold mb-0.5">{copy.title}</p>
              <p className="text-cream/60 text-[11px] leading-relaxed" id="cookie-banner-body">
                {copy.body}{" "}
                <a href="/privacidad" className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors">
                  {copy.policy}
                </a>.
              </p>
            </div>
            <button
              onClick={() => save({ analytics: false, marketing: false })}
              aria-label="Cerrar"
              className="text-silver/30 hover:text-silver transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Expandable category toggles */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{    height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mb-3 pt-1">
                  {/* Essential — locked on */}
                  <div className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-gold/10">
                    <div className="flex items-start gap-2.5">
                      <Lock size={12} className="text-gold/50 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-cream text-[11px] font-semibold">{copy.cats.essential.name}</p>
                        <p className="text-silver/50 text-[10px] leading-relaxed">{copy.cats.essential.desc}</p>
                      </div>
                    </div>
                    <div className="w-8 h-4 rounded-full bg-gold/30 flex items-center justify-end px-0.5 shrink-0 mt-0.5 cursor-not-allowed">
                      <div className="w-3 h-3 rounded-full bg-gold" />
                    </div>
                  </div>

                  {/* Analytics & Marketing toggles */}
                  {(["analytics", "marketing"] as const).map(cat => {
                    const Icon = cat === "analytics" ? BarChart2 : Megaphone;
                    return (
                      <div key={cat} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-gold/10">
                        <div className="flex items-start gap-2.5">
                          <Icon size={12} className="text-gold/50 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-cream text-[11px] font-semibold">{copy.cats[cat].name}</p>
                            <p className="text-silver/50 text-[10px] leading-relaxed">{copy.cats[cat].desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPrefs(p => ({ ...p, [cat]: !p[cat] }))}
                          aria-pressed={prefs[cat]}
                          aria-label={`${prefs[cat] ? "Desactivar" : "Activar"} ${copy.cats[cat].name}`}
                          role="switch"
                          className={`w-8 h-4 rounded-full flex items-center px-0.5 shrink-0 mt-0.5 transition-all duration-200
                            ${prefs[cat] ? "bg-gold justify-end" : "bg-white/10 justify-start"}`}
                        >
                          <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => save({ analytics: true, marketing: true })}
              className="flex items-center gap-1.5 bg-gold hover:bg-gold-light text-navy-deep
                         text-[11px] font-bold px-4 py-2 rounded-full transition-colors duration-200"
            >
              <Check size={11} />
              {copy.acceptAll}
            </button>

            {expanded ? (
              <button
                onClick={() => save(prefs)}
                className="text-gold border border-gold/30 hover:border-gold/60
                           text-[11px] font-medium px-4 py-2 rounded-full transition-colors duration-200"
              >
                {copy.savePrefs}
              </button>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className="flex items-center gap-1 text-silver/60 hover:text-cream text-[11px] px-2 py-2 transition-colors"
              >
                {copy.manage} <ChevronDown size={11} />
              </button>
            )}

            <button
              onClick={() => save({ analytics: false, marketing: false })}
              className="text-silver/40 hover:text-silver text-[11px] px-2 py-2 transition-colors ml-auto"
            >
              {copy.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
