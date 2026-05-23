"use client";

import { useEffect } from "react";

const SECTION_IDS = [
  "services",
  "why-us",
  "how-it-works",
  "membership",
  "testimonials",
  "faq",
  "quote",
];

/**
 * Silently updates the URL hash as sections scroll into view.
 * Resets to bare URL when back at the top.
 * No visible output — runs purely as a side-effect.
 */
export default function SectionDeepLink() {
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 200) {
        // Back at top — clear the hash
        history.replaceState(null, "", window.location.pathname);
        return;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            history.replaceState(null, "", `#${id}`);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}
