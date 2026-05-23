"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Only activate for fine-pointer devices (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mx = -200, my = -200, rx = -200, ry = -200;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setHovered(
        !!el.closest("a, button, [role=button], input, textarea, select, label, [data-cursor-hover]"),
      );
    };

    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (dotRef.current)  dotRef.current.style.translate  = `${mx}px ${my}px`;
      if (ringRef.current) ringRef.current.style.translate = `${rx}px ${ry}px`;
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove",  onMove, { passive: true });
    document.addEventListener("mouseover",  onOver, { passive: true });
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: visible ? 1 : 0 }}
        data-hovered={hovered}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: visible ? 1 : 0 }}
        data-hovered={hovered}
        aria-hidden="true"
      />
    </>
  );
}
