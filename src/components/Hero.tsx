"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/wa";
import { trackCalendly } from "@/lib/analytics";
import { ArrowRight, MessageCircle, ShieldCheck, Car, Heart, Home, Building2, Plane, PawPrint, ChevronDown, Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextScramble from "@/components/TextScramble";
import MagneticButton from "@/components/MagneticButton";
import BenefitRotator from "@/components/BenefitRotator";
import { createRipple } from "@/lib/ripple";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

// ─── Social proof ticker — labels only; timestamps computed per session ───────
const TICKER_BASE: Record<"es" | "en", { Icon: React.ElementType; label: string }[]> = {
  es: [
    { Icon: Car,       label: "Ana · San José — Seguro Auto"       },
    { Icon: Heart,     label: "Carlos · Heredia — Salud Familiar"  },
    { Icon: Home,      label: "Sofía · Cartago — Seguro Hogar"     },
    { Icon: Building2, label: "Rafael · Alajuela — Plan PYMES"     },
    { Icon: Plane,     label: "María · Liberia — Seguro Viaje"     },
    { Icon: PawPrint,  label: "Diego · Escazú — Seguro Mascotas"   },
  ],
  en: [
    { Icon: Car,       label: "Ana · San José — Auto Insurance"     },
    { Icon: Heart,     label: "Carlos · Heredia — Family Health"    },
    { Icon: Home,      label: "Sofía · Cartago — Home Insurance"   },
    { Icon: Building2, label: "Rafael · Alajuela — Business Plan"   },
    { Icon: Plane,     label: "María · Liberia — Travel Insurance" },
    { Icon: PawPrint,  label: "Diego · Escazú — Pet Insurance"     },
  ],
};

// ─── Per-session random minute offsets for the activity ticker ────────────────
function useTickerMinutes(count: number): number[] {
  const [mins, setMins] = useState<number[]>([]);
  useEffect(() => {
    const KEY = "nova_ticker_mins";
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      setMins(JSON.parse(stored) as number[]);
    } else {
      const generated = Array.from({ length: count }, (_, i) =>
        Math.floor(Math.random() * 4 + 1) + i * (Math.floor(Math.random() * 2) + 1)
      );
      sessionStorage.setItem(KEY, JSON.stringify(generated));
      setMins(generated);
    }
  }, [count]);
  return mins;
}

// ─── Mini quiz data ───────────────────────────────────────────────────────────
const QUIZ_DATA: Record<"es" | "en", {
  label: string; q: string;
  opts: { icon: string; label: string; type: string; rec: string }[];
  cta: string; reset: string; quoteLabel: string;
}> = {
  es: {
    label: "Quiz rápido",
    q: "¿Qué quieres proteger?",
    opts: [
      { icon: "🚗", label: "Mi carro",   type: "Auto",    rec: "Seguro de Auto"      },
      { icon: "❤️", label: "Mi familia",  type: "Vida",    rec: "Seguro de Vida"      },
      { icon: "🏢", label: "Mi negocio",  type: "Empresa", rec: "Plan Empresarial"    },
      { icon: "🏠", label: "Mi hogar",    type: "Hogar",   rec: "Seguro de Hogar"     },
    ],
    cta: "Ver cotización →",
    reset: "Elegir otro",
    quoteLabel: "Lista en 15 min · sin compromiso",
  },
  en: {
    label: "Quick quiz",
    q: "What do you want to protect?",
    opts: [
      { icon: "🚗", label: "My car",      type: "Auto",     rec: "Auto Insurance"    },
      { icon: "❤️", label: "My family",   type: "Life",     rec: "Life Insurance"    },
      { icon: "🏢", label: "My business", type: "Business", rec: "Business Plan"     },
      { icon: "🏠", label: "My home",     type: "Home",     rec: "Home Insurance"    },
    ],
    cta: "See quote →",
    reset: "Choose another",
    quoteLabel: "Ready in 15 min · no commitment",
  },
};

export default function Hero() {
  const { t, lang } = useLang();
  const h = t.hero;
  const quiz = QUIZ_DATA[lang];
  const tickers = TICKER_BASE[lang];
  const tickerMins = useTickerMinutes(tickers.length);

  const [mounted, setMounted] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [quizStep, setQuizStep] = useState<"idle" | "result">("idle");
  const [quizType, setQuizType] = useState("");
  const [quizRec, setQuizRec] = useState("");

  // FOMO counter — simulates people currently browsing quotes
  const [fomoCount, setFomoCount] = useState(8);
  const fomoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    fomoRef.current = setInterval(() => {
      setFomoCount(c => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        return Math.max(5, Math.min(18, c + delta));
      });
    }, 5000);
    return () => clearInterval(fomoRef.current!);
  }, []);

  // Parallax
  const { scrollY } = useScroll();
  const gridY  = useTransform(scrollY, [0, 600], [0, -100]);
  const glow1Y = useTransform(scrollY, [0, 600], [0,  -55]);
  const glow2Y = useTransform(scrollY, [0, 600], [0,   60]);
  const logoY  = useTransform(scrollY, [0, 600], [0,   45]);

  // Set mounted flag after first paint — prevents countdown hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  // Rotate ticker every 4 s with fade
  useEffect(() => {
    const id = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % tickers.length);
        setTickerVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, [tickers.length]);

  const handleQuizSelect = (type: string, rec: string) => {
    setQuizType(type);
    setQuizRec(rec);
    setQuizStep("result");
    // Notify QuoteForm to prefill the insurance type
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nova:quiz-select", { detail: { type } }));
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Geometric background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[
          { w: 4,  h: 4,  top: "15%", left: "12%",  delay: "0s",    dur: "9s"  },
          { w: 3,  h: 3,  top: "35%", left: "7%",   delay: "1.5s",  dur: "12s" },
          { w: 5,  h: 5,  top: "60%", left: "20%",  delay: "3s",    dur: "8s"  },
          { w: 3,  h: 3,  top: "75%", left: "45%",  delay: "2s",    dur: "11s" },
          { w: 4,  h: 4,  top: "20%", left: "70%",  delay: "0.5s",  dur: "10s" },
          { w: 6,  h: 6,  top: "50%", left: "85%",  delay: "4s",    dur: "7s"  },
          { w: 3,  h: 3,  top: "80%", left: "60%",  delay: "1s",    dur: "13s" },
          { w: 4,  h: 4,  top: "10%", left: "50%",  delay: "2.5s",  dur: "9s"  },
        ].map((p, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="absolute rounded-full bg-gold/20 pointer-events-none"
            style={{
              width: p.w, height: p.h, top: p.top, left: p.left,
              animation: `float ${p.dur} ease-in-out ${p.delay} infinite`,
              opacity: 0.3 + (i % 3) * 0.1,
            }}
          />
        ))}

        {/* Large radial glow top-right */}
        <motion.div style={{ y: glow1Y }} className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gold/5 blur-[120px]" />
        {/* Subtle glow bottom-left */}
        <motion.div style={{ y: glow2Y }} className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-navy-light/60 blur-[80px]" />

        {/* Grid pattern */}
        <motion.div
          style={{
            y: gridY,
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          className="absolute inset-0 opacity-[0.04]"
        />

        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" style={{ right: "30%" }} />

        {/* Animated gradient mesh blobs */}
        <div
          aria-hidden="true"
          className="absolute left-[10%] top-[20%] w-[55vw] h-[55vw] rounded-full
                     bg-gold/[0.035] blur-[110px] animate-mesh pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute right-[5%] bottom-[10%] w-[40vw] h-[40vw] rounded-full
                     bg-gold/[0.028] blur-[90px] animate-mesh-slow pointer-events-none"
        />

        {/* Slowly drifting ambient orbs — more visible atmosphere */}
        {[
          { size: "520px", top: "8%",   left: "3%",   dur: "20s", delay: "0s",  color: "rgba(200,169,110,0.055)" },
          { size: "380px", top: "45%",  right: "4%",  dur: "26s", delay: "4s",  color: "rgba(200,169,110,0.04)"  },
          { size: "280px", bottom: "6%", left: "38%", dur: "18s", delay: "8s",  color: "rgba(224,201,138,0.05)"  },
        ].map((orb, i) => (
          <div
            key={`orb-${i}`}
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orb.size, height: orb.size,
              top: "top" in orb ? orb.top : undefined,
              bottom: "bottom" in orb ? (orb as { bottom: string }).bottom : undefined,
              left: "left" in orb ? orb.left : undefined,
              right: "right" in orb ? (orb as { right: string }).right : undefined,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
              animation: `float ${orb.dur} ease-in-out ${orb.delay} infinite`,
              filter: "blur(2px)",
            }}
          />
        ))}

        {/* Large decorative logo watermark */}
        <motion.div style={{ y: logoY }} className="absolute -bottom-16 -right-16 w-[580px] h-[580px] opacity-[0.05] select-none pointer-events-none">
          <Image src="/imagenOficial.png" alt="" fill className="object-contain" unoptimized />
        </motion.div>
      </div>

      {/* Mini quiz widget — replaces static floating logo */}
      <div className="absolute top-1/4 right-8 lg:right-16 hidden lg:block animate-float">
        <div className="bg-navy-deep/95 backdrop-blur-sm rounded-2xl border border-gold/30 shadow-2xl w-[230px] overflow-hidden">
          {/* Header */}
          <div className="bg-gold/10 border-b border-gold/20 px-4 py-2.5 flex items-center gap-2">
            <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold">{quiz.label}</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-gold animate-pulse" />
          </div>

          <div className="p-4">
            {quizStep === "idle" ? (
              <>
                <p className="text-cream text-sm font-medium text-center mb-4 leading-snug">{quiz.q}</p>
                <div className="grid grid-cols-2 gap-2">
                  {quiz.opts.map(opt => (
                    <button
                      key={opt.type}
                      onClick={() => handleQuizSelect(opt.type, opt.rec)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gold/15 hover:border-gold/50 hover:bg-gold/10 transition-all duration-200 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{opt.icon}</span>
                      <span className="text-cream text-[11px] font-medium leading-tight text-center">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{quiz.opts.find(o => o.type === quizType)?.icon}</span>
                  <div>
                    <p className="text-cream text-xs font-semibold leading-snug">{quizRec}</p>
                    <p className="text-gold/70 text-[10px] mt-0.5">{quiz.quoteLabel}</p>
                  </div>
                </div>
                {/* Price estimate pill */}
                {(() => {
                  const priceText = (() => {
                    const map: Record<string, string> = {
                      car:     lang === "es" ? "Desde ₡22,000/mes" : "From ₡22,000/mo",
                      family:  lang === "es" ? "Desde ₡8,500/mes"  : "From ₡8,500/mo",
                      business:lang === "es" ? "Desde ₡80,000/mes" : "From ₡80,000/mo",
                      home:    lang === "es" ? "Desde ₡12,000/mes" : "From ₡12,000/mo",
                    };
                    return map[quizType] ?? null;
                  })();
                  return priceText ? (
                    <div className="flex items-center justify-between bg-gold/8 border border-gold/20 rounded-lg px-3 py-1.5 mb-3 text-[10px]">
                      <span className="text-silver/70">{lang === "es" ? "Estimado" : "Estimate"}</span>
                      <span className="text-gold font-bold">{priceText}</span>
                    </div>
                  ) : null;
                })()}
                <a
                  href="#quote"
                  className="flex items-center justify-center gap-1.5 w-full bg-gold hover:bg-gold-light text-navy-deep text-xs font-bold py-2.5 rounded-xl transition-colors mb-2"
                >
                  {quiz.cta}
                </a>
                <button
                  onClick={() => setQuizStep("idle")}
                  className="w-full text-silver/60 text-[11px] hover:text-silver transition-colors"
                >
                  {quiz.reset}
                </button>
              </>
            )}
          </div>

          {/* Accent line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 lg:pt-40">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{h.eyebrow}</span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] text-cream mb-8 animate-fade-up whitespace-pre-line"
            style={{ animationDelay: "0.2s" }}
          >
            {h.headline.split("\n")[0]}
            <br />
            <em className="font-semibold not-italic text-gold-gradient">
              <TextScramble text={h.headline.split("\n")[1]} delay={450} duration={950} />
            </em>
          </h1>

          {/* Subheadline */}
          <p
            className="text-silver text-lg lg:text-xl leading-relaxed max-w-xl mb-12 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {h.sub}
          </p>

          {/* CTA row */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <MagneticButton>
              <a
                href="#quote"
                onClick={createRipple}
                className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold px-8 py-4 rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:scale-[1.02] relative overflow-hidden"
              >
                {h.cta1}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </MagneticButton>
            <MagneticButton strength={0.18}>
              <a
                href={waLink(lang, "hero")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-gold/30 hover:border-gold/60 text-cream text-sm font-medium px-8 py-4 rounded-sm transition-all duration-300 hover:bg-gold/5"
              >
                <MessageCircle size={16} className="text-gold" />
                {h.cta2}
              </a>
            </MagneticButton>
            {CALENDLY_URL && (
              <MagneticButton strength={0.18}>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackCalendly}
                  className="inline-flex items-center gap-3 border border-gold/15 hover:border-gold/40 text-silver hover:text-cream text-sm font-medium px-6 py-4 rounded-sm transition-all duration-300 hover:bg-gold/3"
                >
                  <Calendar size={15} className="text-gold/70" />
                  {lang === "es" ? "Agenda una llamada" : "Schedule a call"}
                </a>
              </MagneticButton>
            )}
          </div>

          {/* FOMO social-proof counter */}
          {mounted && (
            <div className="mb-6 animate-fade-up" style={{ animationDelay: "0.35s" }}>
              <div className="inline-flex items-center gap-2 bg-navy-light/60 border border-gold/12 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span>
                <span className="text-silver/70 text-[11px]">
                  <span aria-live="polite" aria-atomic="true" className="text-cream font-semibold tabular-nums">{fomoCount}</span>
                  {" "}{lang === "es" ? "personas cotizando ahora mismo" : "people getting quotes right now"}
                </span>
              </div>
            </div>
          )}

          {/* Benefit rotator */}
          <div className="mb-10 animate-fade-up" style={{ animationDelay: "0.45s" }}>
            <BenefitRotator />
          </div>

          {/* Trust badge */}
          <div
            className="flex items-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <ShieldCheck size={18} className="text-gold flex-shrink-0" />
            <span className="text-silver text-sm">{h.badge}</span>
            <div className="flex -space-x-2">
              {[
                { init: "AJ", name: "Ana Jiménez",    city: "San José",  since: "2022", ins: "Vida & Salud"  },
                { init: "CM", name: "Carlos Mora",     city: "Heredia",   since: "2021", ins: "Auto & Hogar"  },
                { init: "SV", name: "Sofía Vargas",    city: "Cartago",   since: "2023", ins: "Salud Familiar"},
                { init: "RB", name: "Rafael Brenes",   city: "Alajuela",  since: "2020", ins: "Empresarial"   },
              ].map((c, i) => (
                <div key={i} className="relative group z-10 hover:z-20">
                  <div className="w-8 h-8 rounded-full bg-navy-deep border-2 border-gold/30 group-hover:border-gold/70 flex items-center justify-center text-[10px] font-semibold text-gold transition-all duration-200 cursor-default select-none">
                    {c.init}
                  </div>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-44">
                    <div className="bg-navy-deep border border-gold/25 rounded-xl px-3 py-2.5 shadow-xl text-left">
                      <p className="text-cream text-xs font-semibold leading-tight">{c.name}</p>
                      <p className="text-silver text-[10px] mt-0.5">{c.city} · desde {c.since}</p>
                      <div className="mt-1.5 pt-1.5 border-t border-gold/15">
                        <p className="text-gold text-[10px] font-medium">{c.ins}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className="w-2.5 h-2.5 text-gold fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          ))}
                          <span className="text-silver text-[10px] ml-0.5">5.0</span>
                        </div>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="w-2.5 h-2.5 bg-navy-deep border-r border-b border-gold/25 rotate-45 mx-auto -mt-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof ticker */}
          <div
            className="mt-4 flex items-center gap-2.5 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
            <span
              className="flex items-center gap-1.5 text-silver/70 text-xs"
              style={{ opacity: tickerVisible ? 1 : 0, transition: "opacity 0.4s ease" }}
            >
              {(() => {
                const { Icon, label } = tickers[tickerIdx];
                const mins = tickerMins[tickerIdx];
                const timeStr = mins > 0
                  ? (lang === "es" ? ` · hace ${mins} min` : ` · ${mins} min ago`)
                  : "";
                return (
                  <>
                    <Icon size={11} className="text-gold/70 flex-shrink-0" />
                    {label + timeStr}
                  </>
                );
              })()}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <a
        href="#services"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 group"
      >
        <span className="text-silver/30 text-[9px] tracking-[0.3em] uppercase font-medium group-hover:text-silver/60 transition-colors duration-300">
          {lang === "es" ? "explorar" : "explore"}
        </span>
        <div className="flex flex-col items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-px bg-gold/50 group-hover:bg-gold rounded-full"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, delay: i * 0.22, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: i === 1 ? 14 : 8 }}
            />
          ))}
        </div>
        <motion.div
          className="w-4 h-4 flex items-center justify-center text-gold/50 group-hover:text-gold transition-colors duration-300"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </a>
    </section>
  );
}
