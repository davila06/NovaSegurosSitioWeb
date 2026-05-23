"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("nova_splash");
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem("nova_splash", "1");
      const timer = setTimeout(() => setVisible(false), 2800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-deep"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-5 rounded-3xl border border-gold/25"
            />
            <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden shadow-[0_0_60px_rgba(200,169,110,0.2)] border border-gold/20 relative z-10">
              <Image
                src="/imagenOficial.png"
                alt="NovaSeguros"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <p className="font-display text-4xl font-light text-cream tracking-widest">
              Nova<span className="text-gold font-semibold">Seguros</span>
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.45 }}
              className="text-silver/50 text-xs tracking-[0.35em] uppercase mt-3"
            >
              Protección Premium · Costa Rica
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-14 w-36 h-px bg-white/8 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 1.8, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, #A07840, #C8A96E, #E0C98A)" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
