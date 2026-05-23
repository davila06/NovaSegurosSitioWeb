"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

/**
 * Fixed scroll-to-top button with a gold SVG progress ring.
 * Appears after 400 px of scroll. Hidden on mobile.
 */
export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p   = max > 0 ? window.scrollY / max : 0;
      setProgress(p);
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r            = 18;
  const circumference = 2 * Math.PI * r;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1    }}
          exit={{    opacity: 0, scale: 0.75 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          className="fixed bottom-7 left-7 z-40 w-12 h-12 hidden md:flex items-center justify-center"
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            width="48"
            height="48"
            aria-hidden="true"
          >
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke="rgba(200,169,110,0.15)"
              strokeWidth="2"
            />
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke="rgba(200,169,110,0.85)"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.08s linear" }}
            />
          </svg>

          {/* Button face */}
          <div className="relative z-10 w-9 h-9 rounded-full bg-navy-deep/90 border border-gold/25
                          flex items-center justify-center
                          hover:border-gold/60 hover:bg-gold/10 transition-all duration-200">
            <ChevronUp size={15} className="text-gold" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
