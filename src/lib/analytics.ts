/** Analytics helper — GA4 + Meta Pixel event wrappers */
type W = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?:  (...args: unknown[]) => void;
};

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window as W).gtag?.("event", name, params ?? {});
}

export function trackLead(opts?: { type?: string; source?: string }) {
  trackEvent("generate_lead", opts);
  if (typeof window !== "undefined") {
    (window as W).fbq?.("track", "Lead", opts ?? {});
  }
}

export function trackWhatsApp(source?: string) {
  trackEvent("whatsapp_click", { source });
  if (typeof window !== "undefined") {
    (window as W).fbq?.("track", "Contact", { source });
  }
}

export function trackCalendly() {
  trackEvent("calendly_opened");
}

/** Fire once-per-session scroll-depth milestones: 25 / 50 / 75 / 100 % */
export function initScrollDepth(): () => void {
  if (typeof window === "undefined") return () => {};
  const fired = new Set<number>();
  const milestones = [25, 50, 75, 100];
  const handler = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total    = document.documentElement.scrollHeight;
    const pct      = Math.round((scrolled / total) * 100);
    for (const m of milestones) {
      if (!fired.has(m) && pct >= m) {
        fired.add(m);
        trackEvent("scroll_depth", { percent: m });
      }
    }
  };
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}
