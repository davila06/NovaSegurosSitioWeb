"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Vertical shift range in px — positive = moves up as you scroll down */
  shift?: number;
}

/**
 * Lightweight parallax wrapper for section headings.
 * Translates the heading slightly as the element scrolls through the viewport.
 */
export default function ParallaxHeading({ children, className = "", shift = 22 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
