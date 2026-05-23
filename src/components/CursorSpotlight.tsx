"use client";

import { useEffect, useRef } from "react";

/**
 * Paints a soft radial glow that follows the cursor across the entire page.
 * Purely CSS-custom-property driven — zero JS repaints, no RAF loops.
 * z-index 1 keeps it below content but above the base background.
 */
export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialise to centre so the glow isn't stuck at 0,0 before first move
    el.style.setProperty("--sx", "50%");
    el.style.setProperty("--sy", "50%");

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--sx", `${e.clientX}px`);
      el.style.setProperty("--sy", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        background:
          "radial-gradient(700px circle at var(--sx, 50%) var(--sy, 50%), rgba(200,169,110,0.05), transparent 65%)",
      }}
    />
  );
}
