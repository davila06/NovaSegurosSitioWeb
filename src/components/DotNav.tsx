"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

const SECTIONS_ES = [
  { id: "services",     label: "Servicios"   },
  { id: "why-us",       label: "¿Por qué?"   },
  { id: "how-it-works", label: "Proceso"     },
  { id: "membership",   label: "Membresía"   },
  { id: "testimonials", label: "Testimonios" },
  { id: "faq",          label: "FAQ"         },
  { id: "quote",        label: "Cotizar"     },
];

const SECTIONS_EN = [
  { id: "services",     label: "Services"    },
  { id: "why-us",       label: "Why us?"     },
  { id: "how-it-works", label: "Process"     },
  { id: "membership",   label: "Membership"  },
  { id: "testimonials", label: "Reviews"     },
  { id: "faq",          label: "FAQ"         },
  { id: "quote",        label: "Get quote"   },
];

export default function DotNav() {
  const { lang } = useLang();
  const sections = lang === "en" ? SECTIONS_EN : SECTIONS_ES;

  const [active,  setActive]  = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show after scrolling past the fold
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [sections]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          aria-label="Navegación por secciones"
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3.5"
        >
          {sections.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <div
                key={id}
                className="relative flex items-center justify-end gap-3"
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Label tooltip */}
                <AnimatePresence>
                  {hovered === id && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.14 }}
                      className="text-[9px] font-medium tracking-[0.14em] uppercase text-cream/70
                                 bg-navy-deep/95 px-2.5 py-1 rounded-sm border border-gold/20
                                 whitespace-nowrap pointer-events-none shadow-lg"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Dot */}
                <button
                  onClick={() => scrollTo(id)}
                  aria-label={label}
                  className="relative flex items-center justify-center"
                >
                  <motion.div
                    animate={{
                      width:  isActive ? 12 : 7,
                      height: isActive ? 12 : 7,
                      backgroundColor: isActive ? "#C8A96E" : "rgba(138,138,138,0.35)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="rounded-full"
                  />
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gold"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
