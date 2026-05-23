"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { Search, X, ChevronRight, Car, Shield, Zap, Star, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";

const LINKS = [
  { icon: Car,           href: "#services",     es: "Seguros & Servicios",   en: "Insurance & Services"  },
  { icon: Shield,        href: "#why-us",       es: "¿Por qué NovaSeguros?", en: "Why NovaSeguros?"      },
  { icon: Zap,           href: "#how-it-works", es: "Cómo funciona",         en: "How it works"          },
  { icon: Star,          href: "#membership",   es: "Membresía Premium",     en: "Premium Membership"    },
  { icon: MessageCircle, href: "#testimonials", es: "Testimonios",           en: "Testimonials"          },
  { icon: HelpCircle,    href: "#faq",          es: "Preguntas frecuentes",  en: "FAQ"                   },
  { icon: ArrowRight,    href: "#quote",        es: "Cotizar ahora →",       en: "Get a quote →",        featured: true },
];

export default function CommandPalette() {
  const { lang } = useLang();
  const [open,     setOpen]     = useState(false);
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = LINKS.filter(l => {
    const q = query.toLowerCase();
    return !q || l.es.toLowerCase().includes(q) || l.en.toLowerCase().includes(q) || l.href.includes(q);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => (s + 1) % filtered.length); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => (s - 1 + filtered.length) % filtered.length); }
    if (e.key === "Enter" && filtered[selected]) navigate(filtered[selected].href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0    }}
            exit={{    opacity: 0, scale: 0.95, y: -12   }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed left-1/2 top-[16%] -translate-x-1/2 z-[301] w-full max-w-lg px-4"
            onKeyDown={handleKey}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={lang === "es" ? "Navegación rápida" : "Quick navigation"}
              aria-activedescendant={filtered[selected] ? `cmd-item-${selected}` : undefined}
              className="bg-gradient-to-br from-slate to-navy-deep border border-gold/30
                            rounded-2xl overflow-hidden
                            shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(200,169,110,0.08)]">
              {/* Search row */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gold/12">
                <Search size={14} className="text-gold/50 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0); }}
                  placeholder={lang === "es" ? "Ir a sección…" : "Jump to section…"}
                  className="flex-1 bg-transparent text-cream text-sm outline-none placeholder:text-silver/30"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <kbd className="hidden sm:block text-[9px] text-silver/30 bg-white/[0.05] border border-white/[0.1] rounded px-1.5 py-0.5 font-mono">ESC</kbd>
                  <button onClick={() => setOpen(false)} aria-label="Cerrar">
                    <X size={14} className="text-silver/30 hover:text-silver transition-colors" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="py-1.5">
                {filtered.length === 0 ? (
                  <p className="text-center text-silver/40 text-sm py-6">
                    {lang === "es" ? "Sin resultados" : "No results"}
                  </p>
                ) : (
                  filtered.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.href}
                        id={`cmd-item-${i}`}
                        role="option"
                        aria-selected={i === selected}
                        onClick={() => navigate(link.href)}
                        onMouseEnter={() => setSelected(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-100 ${
                          i === selected ? "bg-gold/10" : "hover:bg-white/[0.03]"
                        } ${link.featured ? "text-gold font-medium" : i === selected ? "text-cream" : "text-silver/70"}`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          i === selected ? "bg-gold/15 border-gold/30" : "bg-white/[0.03] border-white/[0.07]"
                        }`}>
                          <Icon size={13} className={i === selected || link.featured ? "text-gold" : "text-silver/50"} />
                        </div>
                        <span className="text-sm flex-1 text-left">
                          {lang === "es" ? link.es : link.en}
                        </span>
                        {i === selected && <ChevronRight size={12} className="text-gold/40 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="border-t border-gold/[0.07] px-4 py-2 flex items-center gap-4 text-[10px] text-silver/25">
                <span>
                  <kbd className="font-mono bg-white/[0.04] border border-white/[0.1] rounded px-1">↑↓</kbd>
                  {" "}{lang === "es" ? "navegar" : "navigate"}
                </span>
                <span>
                  <kbd className="font-mono bg-white/[0.04] border border-white/[0.1] rounded px-1">↵</kbd>
                  {" "}{lang === "es" ? "ir" : "go"}
                </span>
                <span className="ml-auto text-silver/20">NovaSeguros</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
