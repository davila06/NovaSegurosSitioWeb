"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

/**
 * Floating "Cotizar ahora" CTA that slides up after the user
 * scrolls past 80% of the viewport height.
 * Pulses after 8 seconds of no interaction to attract attention.
 */
export default function FloatingCTA() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [pulse,   setPulse]   = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Idle pulse: pulse every 8s to attract attention
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    }, 8000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1     }}
          exit={{    opacity: 0, y: 24, scale: 0.88  }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-7 right-7 z-40 hidden md:block"
        >
          {/* Idle pulse ring */}
          <AnimatePresence>
            {pulse && (
              <motion.div
                key="ring"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-gold/50 pointer-events-none"
              />
            )}
          </AnimatePresence>
          <a
            href="#quote"
            onClick={() => trackEvent("floating_cta_click")}
            className="group flex items-center gap-2.5
                       bg-gold hover:bg-gold-light text-navy-deep
                       text-sm font-bold px-6 py-3.5 rounded-full
                       shadow-[0_8px_32px_rgba(200,169,110,0.45)]
                       hover:shadow-[0_8px_44px_rgba(200,169,110,0.65)]
                       transition-all duration-300 hover:scale-[1.04]"
          >
            {t.hero.cta1}
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
