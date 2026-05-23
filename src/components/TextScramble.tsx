"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@&$%0123456789";

interface TextScrambleProps {
  text: string;
  className?: string;
  /** Delay in ms before the effect starts */
  delay?: number;
  /** Duration of the scramble animation in ms */
  duration?: number;
}

/**
 * Renders text with a premium "decode" scramble effect on mount.
 * Characters randomly resolve left-to-right to the final text.
 */
export default function TextScramble({
  text,
  className,
  delay = 0,
  duration = 900,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, CHARS[0]));
  const rafRef   = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const revealed = Math.floor(progress * text.length);

        const scrambled = text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char;
            if (i < revealed) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplay(scrambled);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (rafRef.current)  cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, duration]);

  return <span className={className}>{display}</span>;
}
