"use client";

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

interface RevealProps {
  children: ReactNode;
  /** Extra Tailwind classes applied to the wrapper */
  className?: string;
  /** Delay in ms before the reveal transition starts */
  delay?: number;
  /** Direction from which the element enters */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Fraction of element visible before triggering (0–1) */
  threshold?: number;
}

const DIRECTION_STYLES: Record<NonNullable<RevealProps["direction"]>, CSSProperties> = {
  up:    { transform: "translateY(32px)" },
  down:  { transform: "translateY(-32px)" },
  left:  { transform: "translateX(-32px)" },
  right: { transform: "translateX(32px)" },
  none:  { transform: "none" },
};

/**
 * Wraps children with an IntersectionObserver-based fade/slide reveal.
 * Triggers once when the element enters the viewport.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hidden = DIRECTION_STYLES[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : hidden.transform,
        transition: `opacity 0.65s ease, transform 0.65s ease`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
