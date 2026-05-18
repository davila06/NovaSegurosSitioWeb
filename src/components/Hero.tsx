"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

// ─── Social proof ticker ──────────────────────────────────────────────────────
const TICKER_DATA: Record<"es" | "en", string[]> = {
  es: [
    "🚗 Ana · San José cotizó Auto hace 2 min",
    "🏥 Carlos · Heredia activó Salud familiar",
    "🏠 Sofía · Cartago cotizó Hogar hace 5 min",
    "🏢 Rafael · Alajuela contrató Plan PYMES",
    "✈️ María · Liberia cotizó Viaje hace 8 min",
    "🐾 Diego · Escazú aseguró a su mascota",
  ],
  en: [
    "🚗 Ana · San José just quoted Auto insurance",
    "🏥 Carlos · Heredia activated Family Health",
    "🏠 Sofía · Cartago quoted Home insurance",
    "🏢 Rafael · Alajuela got a Business plan",
    "✈️ María · Liberia quoted Travel insurance",
    "🐾 Diego · Escazú insured his pet",
  ],
};

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
  const tickers = TICKER_DATA[lang];

  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [quizStep, setQuizStep] = useState<"idle" | "result">("idle");
  const [quizType, setQuizType] = useState("");
  const [quizRec, setQuizRec] = useState("");

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
        {/* Large radial glow top-right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gold/5 blur-[120px]" />
        {/* Subtle glow bottom-left */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-navy-light/60 blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" style={{ right: "30%" }} />

        {/* Large decorative logo watermark */}
        <div className="absolute -bottom-16 -right-16 w-[580px] h-[580px] opacity-[0.05] select-none pointer-events-none">
          <Image src="/logo-oficial.png" alt="" fill className="object-contain" unoptimized />
        </div>
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
            <em className="font-semibold not-italic text-gold-gradient">{h.headline.split("\n")[1]}</em>
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
            <a
              href="#quote"
              className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold px-8 py-4 rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:scale-[1.02]"
            >
              {h.cta1}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="https://wa.me/50689875225"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-gold/30 hover:border-gold/60 text-cream text-sm font-medium px-8 py-4 rounded-sm transition-all duration-300 hover:bg-gold/5"
            >
              <MessageCircle size={16} className="text-gold" />
              {h.cta2}
            </a>
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
              className="text-silver/70 text-xs"
              style={{ opacity: tickerVisible ? 1 : 0, transition: "opacity 0.4s ease" }}
            >
              {tickers[tickerIdx]}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
    </section>
  );
}
