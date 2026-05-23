"use client";

import { useLang } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPriceEstimate } from "@/lib/priceRanges";
import { trackEvent, trackLead } from "@/lib/analytics";
import { getUTM } from "@/lib/utm";
import {
  Send, ShieldCheck, ArrowRight, ArrowLeft, Clock,
  Car, Heart, Activity, Home, Plane, PawPrint, Building2, HelpCircle, Check,
} from "lucide-react";

// ─── Type icon map ─────────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, React.ElementType> = {
  Auto: Car, "Auto Insurance": Car,
  Vida: Heart, "Life": Heart,
  Salud: Activity, "Health": Activity,
  Hogar: Home, "Home": Home,
  Viaje: Plane, "Travel": Plane,
  Mascotas: PawPrint, "Pets": PawPrint,
  "Mi empresa": Building2, "My business": Building2,
  Otro: HelpCircle, "Other": HelpCircle,
};

// ─── Step header data ──────────────────────────────────────────────────────────
const STEPS = {
  es: ["¿Qué asegurar?", "Tus datos", "Detalles"],
  en: ["What to insure?", "Your details", "More info"],
};

// ─── Slide variants ────────────────────────────────────────────────────────────
const slideVariants = (dir: number) => ({
  initial: { x: dir * 28, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  exit:    { x: dir * -28, opacity: 0, transition: { duration: 0.18 } },
});

// ─── Floating label input ─────────────────────────────────────────────────────
function FloatInput({
  id, type = "text", value, onChange, onBlur, label, error, valid, autoComplete, inputMode,
}: {
  id: string; type?: string; value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  label: string;
  error?: string | null;
  valid?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="relative">
      <input
        id={id} type={type} placeholder=" "
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`peer w-full bg-navy/60 border text-cream text-sm px-4 pt-5 pb-2 pr-9 rounded-sm outline-none transition-all duration-300 ${
          error
            ? "border-red-500/60 focus:border-red-400"
            : valid
              ? "border-emerald-500/50 focus:border-emerald-400"
              : "border-gold/20 focus:border-gold/60"
        }`}
      />
      <label
        htmlFor={id}
        className="absolute left-4 text-[10px] tracking-[0.12em] uppercase pointer-events-none transition-all duration-200
                   top-3 text-silver/50
                   peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-silver/50
                   peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gold
                   peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-gold/70"
      >
        {label}
      </label>
      {/* Valid checkmark */}
      <AnimatePresence>
        {valid && !error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
          >
            <Check size={10} className="text-emerald-400" />
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p className="text-[10px] text-red-400 mt-0.5 pl-1">{error}</p>
      )}
    </div>
  );
}

export default function QuoteForm() {
  const { t, lang } = useLang();
  const qf     = t.quote;
  const fields  = qf.fields;

  const [step,      setStep]      = useState(0);
  const [dir,       setDir]       = useState(1);          // slide direction
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [hp,        setHp]        = useState(""); // honeypot — must stay empty
  const [consent,   setConsent]   = useState(false);
  const [consentTouched, setConsentTouched] = useState(false);
  const [quoteStarted, setQuoteStarted] = useState(false);

  // ── 15-min advisor countdown (starts on success) ──
  const [countdown,   setCountdown]   = useState(15 * 60);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!submitted) return;
    setCountdown(15 * 60);
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(countdownRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current!);
  }, [submitted]);

  // ── localStorage autosave ──
  const [form, setForm] = useState<{ name: string; phone: string; email: string; type: string; message: string }>(() => {
    if (typeof window === "undefined") return { name: "", phone: "", email: "", type: "", message: "" };
    try {
      const saved = localStorage.getItem("nova_quote_draft");
      return saved ? JSON.parse(saved) : { name: "", phone: "", email: "", type: "", message: "" };
    } catch { return { name: "", phone: "", email: "", type: "", message: "" }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("nova_quote_draft", JSON.stringify({ ...form, savedAt: Date.now() }));
    } catch {}
  }, [form]);

  // ── Field touched + inline validation ──
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched(t => ({ ...t, [field]: true }));

  const validate = {
    name:  (v: string) => v.trim().length < 2 ? (lang === "es" ? "Nombre muy corto" : "Name too short") : null,
    phone: (v: string) => /^[\d\s+\-()]{7,}$/.test(v) ? null : (lang === "es" ? "Teléfono inválido" : "Invalid phone"),
    email: (v: string) => v && !/^[^@]+@[^@]+\.[^@]+$/.test(v) ? (lang === "es" ? "Email inválido" : "Invalid email") : null,
  };

  const err = {
    name:  touched.name  ? validate.name(form.name)   : null,
    phone: touched.phone ? validate.phone(form.phone) : null,
    email: touched.email ? validate.email(form.email) : null,
  };

  // Listen for quiz-select event from Hero to prefill insurance type
  useEffect(() => {
    const handler = (e: Event) => {
      const { type } = (e as CustomEvent<{ type: string }>).detail;
      setForm(f => ({ ...f, type }));
      // Jump past the type-selection step
      setDir(1);
      setStep(1);
    };
    window.addEventListener("nova:quiz-select", handler);
    return () => window.removeEventListener("nova:quiz-select", handler);
  }, []);

  const goNext = () => {
    setDir(1);
    setStep(s => {
      const next = s + 1;
      if (next === 2) trackEvent("quote_step_2");
      return next;
    });
  };
  const goPrev = () => { setDir(-1); setStep(s => s - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "form", lang, _hp: hp, consent: true, ...form, ...getUTM() }),
      });
    } catch {
      // show success regardless to avoid blocking UX
    }
    try { localStorage.removeItem("nova_quote_draft"); } catch {}
    trackEvent("quote_submitted", { insurance_type: form.type });
    trackLead({ type: form.type, source: "form" });
    setLoading(false);
    setSubmitted(true);
  };

  const steps = STEPS[lang as "es" | "en"] ?? STEPS.es;

  return (
    <section id="quote" className="py-28 lg:py-36 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Radial bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-gold/4 blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{qf.eyebrow}</span>
            </div>
            <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight mb-6 whitespace-pre-line">
              {qf.headline.split("\n")[0]}
              <br />
              <span className="text-gold-gradient font-semibold">{qf.headline.split("\n")[1]}</span>
            </h2>
            <p className="text-silver leading-relaxed mb-10">{qf.sub}</p>

            <div className="space-y-4">
              {qf.features.map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-gold shrink-0" />
                  <span className="text-silver text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: multi-step form card */}
          <div className="bg-gradient-to-br from-slate/60 to-navy-deep border border-gold/20 rounded-sm p-8 lg:p-10 overflow-hidden">

            {submitted ? (
              /* ── Success + Confetti ── */
              <div role="status" aria-live="polite" aria-atomic="true">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center justify-center py-10 text-center overflow-hidden"
              >
                {/* Confetti particles */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle  = (i / 24) * 360;
                  const dist   = 60 + (i % 5) * 22;
                  const colors = ["#C8A96E","#E0C98A","#F0EDE8","#A07840","#C8A96E"];
                  const color  = colors[i % colors.length];
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full pointer-events-none"
                      style={{ width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2, background: color, top: "50%", left: "50%" }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((angle * Math.PI) / 180) * dist,
                        y: Math.sin((angle * Math.PI) / 180) * dist,
                        opacity: 0,
                        scale: 0.5,
                      }}
                      transition={{ duration: 0.8 + (i % 4) * 0.15, ease: "easeOut", delay: i * 0.02 }}
                    />
                  );
                })}
                <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-6 relative z-10">
                  <ShieldCheck size={28} className="text-gold" />
                </div>
                <h3 className="font-display text-3xl text-cream font-semibold mb-3 relative z-10">
                  {lang === "es" ? "¡Listo!" : "All set!"}
                </h3>
                <p className="text-silver text-sm leading-relaxed max-w-xs relative z-10 mb-6">
                  {lang === "es"
                    ? "Un asesor te contactará pronto con las mejores opciones para ti."
                    : "An advisor will contact you soon with the best options for you."}
                </p>

                {/* Countdown timer */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-5 py-2.5">
                    <Clock size={13} className="text-gold shrink-0" />
                    <span className="text-gold/80 text-xs">
                      {lang === "es" ? "Tu asesor llega en" : "Advisor arrives in"}
                    </span>
                    <span className="font-mono text-gold font-bold text-sm tabular-nums">
                      {countdown > 0
                        ? `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
                        : lang === "es" ? "En camino…" : "On the way…"
                      }
                    </span>
                  </div>
                  <p className="text-silver/40 text-[10px]">
                    {lang === "es" ? "Revisa también tu WhatsApp o email" : "Check your WhatsApp or email too"}
                  </p>
                </div>
              </motion.div>
              </div>
            ) : (
              <>
                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-3">
                  {steps.map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all duration-300
                                       ${i < step ? "bg-gold text-navy-deep" : i === step ? "bg-gold/20 border border-gold text-gold" : "bg-navy/60 border border-gold/15 text-silver/40"}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] tracking-[0.1em] uppercase hidden sm:inline transition-colors duration-300
                                         ${i === step ? "text-cream" : "text-silver/40"}`}>
                        {label}
                      </span>
                      {i < steps.length - 1 && (
                        <div className={`w-6 h-px mx-1 transition-all duration-300 ${i < step ? "bg-gold/50" : "bg-gold/15"}`} />
                      )}
                    </div>
                  ))}
                </div>
                {/* Progress % text */}
                <div className="flex items-center gap-2 mb-7">
                  <div className="flex-1 h-0.5 rounded-full bg-gold/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-gold-dark to-gold"
                      animate={{ width: `${Math.round((step / (steps.length - 1)) * 100)}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[10px] text-silver/50 tabular-nums shrink-0">
                    {Math.round((step / (steps.length - 1)) * 100)}%
                  </span>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* ARIA live region — announces current step to screen readers */}
                  <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {steps[step]}
                  </div>
                  {/* Honeypot — invisible to humans; bots fill it in */}
          <input
            aria-hidden="true"
            tabIndex={-1}
            type="text"
            name="_hp"
            value={hp}
            onChange={e => setHp(e.target.value)}
            style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
            autoComplete="off"
          />
          <AnimatePresence mode="wait" custom={dir}>
                    {/* ── Step 0: Insurance type cards ── */}
                    {step === 0 && (
                      <motion.div key="step0" variants={slideVariants(dir)} initial="initial" animate="animate" exit="exit">
                        <p className="text-cream text-sm font-medium mb-5">
                          {lang === "es" ? "¿Qué quieres asegurar?" : "What would you like to insure?"}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                          {fields.typeOptions.map((opt) => {
                            const Icon = TYPE_ICONS[opt] ?? HelpCircle;
                            return (
                              <button
                                key={opt} type="button"
                                onClick={() => {
                                  setForm(f => ({ ...f, type: opt }));
                                  trackEvent("quote_start", { insurance_type: opt });
                                  goNext();
                                }}
                                className={`flex flex-col items-center gap-2 p-3.5 rounded-sm border transition-all duration-200 group
                                            ${form.type === opt
                                              ? "border-gold/60 bg-gold/10 text-gold"
                                              : "border-gold/15 hover:border-gold/40 hover:bg-gold/5 text-silver/60 hover:text-cream"}`}
                              >
                                <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                                <span className="text-[10px] font-medium text-center leading-tight">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* ── Step 1: Personal data ── */}
                    {step === 1 && (
                      <motion.div key="step1" variants={slideVariants(dir)} initial="initial" animate="animate" exit="exit" className="space-y-4 mb-6">
                        {/* Price estimate badge */}
                        {form.type && getPriceEstimate(form.type, lang as "es" | "en") && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between bg-gold/8 border border-gold/20 rounded-sm px-4 py-2.5 mb-2"
                          >
                            <span className="text-silver/70 text-xs">{lang === "es" ? "Estimado para tu plan" : "Estimated for your plan"}</span>
                            <span className="text-gold font-semibold text-sm">{getPriceEstimate(form.type, lang as "es" | "en")}</span>
                          </motion.div>
                        )}
                        <FloatInput id="f-name"  label={fields.name}  value={form.name}  onChange={v => {
                          if (!quoteStarted && v.trim()) { setQuoteStarted(true); trackEvent("quote_started"); }
                          setForm(f => ({ ...f, name: v }));
                        }}  onBlur={() => touch("name")}  error={err.name}  valid={touched.name  && !err.name  && form.name.trim().length >= 2} autoComplete="name" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FloatInput id="f-phone" type="tel"   label={fields.phone} value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} onBlur={() => touch("phone")} error={err.phone} valid={touched.phone && !err.phone && form.phone.length >= 7} autoComplete="tel" inputMode="tel" />
                          {!touched.phone && !form.phone && (
                            <p className="text-[9px] text-silver/35 mt-0.5 pl-1">+506 XXXX-XXXX</p>
                          )}
                          <FloatInput id="f-email" type="email" label={fields.email} value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} onBlur={() => touch("email")} error={err.email} valid={touched.email && !err.email && form.email.includes("@")} autoComplete="email" />
                        </div>
                      </motion.div>
                    )}

                    {/* ── Step 2: Message + submit ── */}
                    {step === 2 && (
                      <motion.div key="step2" variants={slideVariants(dir)} initial="initial" animate="animate" exit="exit" className="mb-6">
                        <div className="relative">
                          <textarea
                            id="f-message" rows={4} placeholder=" " maxLength={500}
                            value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            className="peer w-full bg-navy/60 border border-gold/20 focus:border-gold/60
                                       text-cream text-sm px-4 pt-5 pb-2 rounded-sm outline-none transition-colors resize-none"
                          />
                          <label
                            htmlFor="f-message"
                            className="absolute left-4 text-[10px] tracking-[0.12em] uppercase pointer-events-none transition-all duration-200
                                       top-3 text-silver/50
                                       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs
                                       peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-gold
                                       peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-gold/70"
                          >
                            {fields.message}
                          </label>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className={`text-[10px] tabular-nums transition-colors ${500 - form.message.length < 50 ? "text-amber-400" : "text-silver/30"}`}>
                            {500 - form.message.length}
                          </span>
                        </div>

                        {/* Privacy notice (Ley 8968) */}
                        <div className="mt-5 p-3.5 rounded-sm border border-gold/15 bg-navy/40">
                          <p className="text-silver/60 text-[10px] leading-relaxed">
                            {fields.privacyNotice}
                          </p>
                        </div>

                        {/* Consent checkbox — required by Ley 8968 */}
                        <div className="mt-3">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={consent}
                              onChange={e => { setConsent(e.target.checked); setConsentTouched(true); }}
                              className="mt-0.5 w-4 h-4 shrink-0 accent-gold cursor-pointer"
                              aria-required="true"
                            />
                            <span className="text-[11px] text-silver/70 leading-relaxed group-hover:text-silver transition-colors">
                              {fields.consentLabel}
                              <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2">
                                {fields.consentLabelLink}
                              </a>
                            </span>
                          </label>
                          {consentTouched && !consent && (
                            <p className="text-[10px] text-red-400 mt-1 pl-7">{fields.consentRequired}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between gap-3 mt-2">
                    {step > 0 ? (
                      <button
                        type="button" onClick={goPrev}
                        className="flex items-center gap-2 text-silver/60 hover:text-cream text-sm transition-colors"
                      >
                        <ArrowLeft size={14} /> {lang === "es" ? "Atrás" : "Back"}
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={step === 0 ? !form.type : step === 1 ? !form.name.trim() || !form.phone.trim() : false}
                        className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold
                                   px-6 py-3 rounded-sm transition-all duration-300
                                   hover:shadow-[0_0_20px_rgba(201,168,76,0.35)]
                                   disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {lang === "es" ? "Continuar" : "Continue"} <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit" disabled={loading || !consent}
                        onClick={() => setConsentTouched(true)}
                        className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold
                                   px-6 py-3 rounded-sm transition-all duration-300
                                   hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]
                                   disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                          : <Send size={14} />}
                        {loading ? (lang === "es" ? "Enviando…" : "Sending…") : fields.submit}
                      </button>
                    )}
                  </div>

                  <p className="text-silver/50 text-xs text-center mt-5">{fields.privacy}</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
