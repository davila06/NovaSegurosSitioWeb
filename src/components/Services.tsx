"use client";

import { useLang } from "@/lib/i18n";
import { useState, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import ParallaxHeading from "@/components/ParallaxHeading";
import Reveal from "@/components/Reveal";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { trackEvent } from "@/lib/analytics";
import { X, Check, ArrowRight,
  Car, Heart, Shield, Home, Plane, PawPrint,
  Building2, Truck, HardHat, Scale, Lock, Monitor,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Car, Heart, Shield, Home, Plane, PawPrint,
  Building2, Truck, HardHat, Scale, Lock, Monitor,
};

// ─── 3-D tilt wrapper ────────────────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-0.5, 0.5], [ 5, -5]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-5,  5]);
  const glare   = useTransform(mx, [-0.5, 0.5], ["rgba(200,169,110,0)", "rgba(200,169,110,0.05)"]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width  - 0.5);
        my.set((e.clientY - r.top)  / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className={`h-full ${className ?? ""}`}
    >
      {/* Glare overlay */}
      <motion.div
        style={{ background: glare }}
        className="absolute inset-0 rounded-sm pointer-events-none z-10"
      />
      {children}
    </motion.div>
  );
}

interface ServiceItem {
  icon: string;
  name: string;
  desc: string;
  coverage?: readonly string[];
}

type TabKey = "all" | "personal" | "business";

export default function Services() {
  const { t, lang } = useLang();
  const s = t.services;
  const [tab, setTab] = useState<TabKey>("personal");
  const [modal, setModal] = useState<ServiceItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, !!modal);

  const allItems = [...s.personal.items, ...s.business.items];
  const activeItems =
    tab === "all"      ? allItems :
    tab === "personal" ? s.personal.items :
    s.business.items;

  return (
    <section id="services" className="py-28 lg:py-36 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <Reveal className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{s.eyebrow}</span>
          </div>
          <ParallaxHeading>
            <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight whitespace-pre-line">
              {s.headline.split("\n")[0]}
              <br />
              <span className="text-gold-gradient font-semibold">{s.headline.split("\n")[1]}</span>
            </h2>
          </ParallaxHeading>
        </Reveal>

        {/* Tabs */}
        <div className="flex gap-1 mb-12 bg-navy-deep/60 border border-gold/10 rounded-sm p-1 w-fit">
          {([["all", lang === "es" ? "Todos" : "All"], ["personal", s.personal.tag], ["business", s.business.tag]] as const).map(([tabKey, label]) => (
            <button
              key={tabKey}
              onClick={() => { setTab(tabKey as TabKey); trackEvent("services_tab", { tab: tabKey }); }}
              className={`relative px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 rounded-sm ${
                tab === tabKey
                  ? "bg-gold text-navy-deep shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                  : "text-silver hover:text-cream"
              }`}
            >
              {label}
              {tabKey === "all" && (
                <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full
                                  ${tab === "all" ? "bg-navy-deep/30 text-navy-deep" : "bg-gold/15 text-gold/70"}`}>
                  {allItems.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards grid — animated on tab change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {activeItems.map((item, i) => {
              const IconComp = ICON_MAP[item.icon] ?? Shield;
              return (
                <Reveal key={item.name} delay={i * 60} direction="up">
                  <TiltCard>
                  <div
                    className="glass-card rounded-sm p-7 group hover:border-gold/40 transition-all duration-300 hover:bg-white/[0.06] cursor-pointer h-full flex flex-col relative overflow-hidden"
                    onClick={() => setModal(item)}
                  >
                    {/* Shimmer sweep on hover */}
                    <div className="shimmer-hover rounded-sm" aria-hidden="true" />
                    <motion.div
                      className="w-12 h-12 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors duration-300"
                      whileHover={{ rotate: 10, scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 320, damping: 14 }}
                    >
                      <IconComp size={22} className="text-gold" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-semibold text-cream mb-2">{item.name}</h3>
                    <p className="text-silver text-sm leading-relaxed flex-1">{item.desc}</p>
                    <div className="mt-5 flex items-center gap-2 text-gold text-xs font-medium tracking-wide group-hover:gap-3 transition-all duration-300">
                      <span>{s.viewCoverage}</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#quote"
            className="inline-flex items-center gap-3 border border-gold/30 hover:border-gold text-cream text-sm font-medium px-8 py-3.5 rounded-sm transition-all duration-300 hover:bg-gold/5"
          >
            {lang === "es" ? "Ver todos los servicios →" : "View all services →"}
          </a>
        </div>
      </div>

      {/* ── Coverage modal ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />
          {/* Grain on backdrop */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
          />

          {/* Panel */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-md bg-gradient-to-br from-slate to-navy-deep
                        border border-gold/25 rounded-2xl overflow-hidden
                        shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-gold/10">
              {(() => {
                const Icon = ICON_MAP[modal.icon] ?? Shield;
                return (
                  <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-gold" />
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <h3 className="text-cream font-display text-xl font-semibold">{modal.name}</h3>
                <p className="text-silver text-xs mt-0.5 leading-snug">{modal.desc}</p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-silver hover:text-cream transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Coverage list */}
            <div className="px-6 py-5">
              <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold mb-4">
                {lang === "es" ? "Coberturas incluidas" : "Included coverages"}
              </p>
              <ul className="space-y-3">
                {(modal.coverage ?? []).map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-gold" />
                    </span>
                    <span className="text-cream text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer CTA */}
            <div className="px-6 pb-6">
              <a
                href="#quote"
                onClick={() => setModal(null)}
                className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold/90
                           text-navy-deep text-sm font-bold py-3 rounded-xl transition-colors"
              >
                {lang === "es" ? "Cotizar este seguro" : "Get a quote"}
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Section-to-section fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0A0A0A] pointer-events-none z-10" />
    </section>
  );
}
