"use client";

import React, { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Shield, FileText, HelpCircle, MessageCircle, type LucideProps } from "lucide-react";

const TABS: Array<{
  icon: React.ComponentType<Partial<LucideProps>>;
  id: string;
  es: string;
  en: string;
  featured?: boolean;
}> = [
  { icon: Car,           id: "services",     es: "Seguros",   en: "Insurance"             },
  { icon: Shield,        id: "why-us",       es: "Nosotros",  en: "About"                 },
  { icon: FileText,      id: "quote",        es: "Cotizar",   en: "Quote",  featured: true },
  { icon: HelpCircle,    id: "faq",          es: "FAQ",       en: "FAQ"                   },
  { icon: MessageCircle, id: "testimonials", es: "Opiniones", en: "Reviews"               },
];

export default function MobileBottomNav() {
  const { lang } = useLang();
  const [active,  setActive]  = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 250);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = TABS.map(tab => {
      const el = document.getElementById(tab.id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(tab.id); },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean) as IntersectionObserver[];
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-[60] sm:hidden"
          aria-label="Navegación móvil"
        >
          {/* thin gold top line */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          <div className="bg-navy-deep/96 backdrop-blur-xl px-1 pt-2"
               style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
            <div className="flex items-end justify-around max-w-sm mx-auto">
              {TABS.map(({ icon: Icon, id, es, en, featured }) => {
                const isActive = active === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] ${
                      featured
                        ? "-mt-5 bg-gold text-navy-deep rounded-2xl px-4 py-2.5 shadow-[0_-4px_24px_rgba(200,169,110,0.45)]"
                        : isActive
                          ? "text-gold"
                          : "text-silver/40 hover:text-silver/70"
                    }`}
                  >
                    <Icon
                      size={featured ? 18 : 17}
                      strokeWidth={featured ? 2.5 : isActive ? 2 : 1.5}
                    />
                    <span className="text-[9px] font-medium tracking-wide leading-none">
                      {lang === "es" ? es : en}
                    </span>
                    {isActive && !featured && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="w-1 h-1 rounded-full bg-gold mt-0.5"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
