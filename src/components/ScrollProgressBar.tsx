"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Thin gold progress bar pinned to the very top of the viewport.
 * Tracks scroll depth (0% → 100%).
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent pointer-events-none">
      <motion.div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #A07840, #C8A96E, #E0C98A)",
          boxShadow: "0 0 8px rgba(200,169,110,0.6)",
        }}
        transition={{ ease: "linear", duration: 0.05 }}
      />
    </div>
  );
}
