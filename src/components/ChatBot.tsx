"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Send, Loader2, ArrowLeft, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "bot" | "user";
type Step =
  | "welcome"
  | "faq_menu"
  | "faq_answer"
  | "quote_type"
  | "quote_name"
  | "quote_phone"
  | "quote_email"
  | "quote_done";

interface Option {
  label: string;
  value: string;
}
interface Message {
  role: Role;
  text: string;
  options?: Option[];
  input?: "text" | "email" | "tel";
  inputPlaceholder?: string;
  stars?: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const FAQ: Record<"es" | "en", { q: string; a: string }[]> = {
  es: [
    { q: "¿Qué seguros ofrecen?", a: "Seguros de **Auto, Vida, Salud, Hogar, Viaje y Mascotas** para personas, y para empresas: PYMES, Flotillas, Riesgos Laborales, RC, Ciberseguridad y Equipo Electrónico." },
    { q: "¿Cuánto tarda una cotización?", a: "En **menos de 15 minutos** te brindamos una cotización personalizada. Solo necesitamos algunos datos básicos." },
    { q: "¿En cuánto tiempo me contactan?", a: "Nuestros asesores te contactan en **menos de 2 horas hábiles** después de recibir tu solicitud." },
    { q: "¿Están regulados por la SUGESE?", a: "Sí. NovaSeguros opera bajo supervisión de la **SUGESE** (Superintendencia General de Seguros de Costa Rica), garantizando la seguridad de tu póliza." },
    { q: "¿Puedo asegurar a toda mi familia?", a: "¡Claro! Tenemos planes familiares que cubren a todos los miembros del hogar con **una sola póliza** y beneficios preferenciales." },
    { q: "¿Qué diferencia a NovaSeguros?", a: "Asesoría personalizada, respuesta en 15 min, **500+ clientes**, calificación **4.9/5** y servicio **24/7**. No somos solo una póliza — somos tu aliado." },
  ],
  en: [
    { q: "What insurance do you offer?", a: "We offer **Auto, Life, Health, Home, Travel and Pet** insurance for individuals, and for businesses: SME, Fleet, Workers' Comp, Liability, Cybersecurity and Electronic Equipment." },
    { q: "How long does a quote take?", a: "We provide a personalized quote in **under 15 minutes**. We just need a few basic details." },
    { q: "How soon will someone contact me?", a: "Our advisors reach out within **2 business hours** of receiving your request." },
    { q: "Are you regulated by SUGESE?", a: "Yes. NovaSeguros operates under **SUGESE** supervision (Costa Rica's General Insurance Superintendency), guaranteeing your policy's security." },
    { q: "Can I insure my whole family?", a: "Absolutely! We offer family plans covering all household members under **one policy** with preferential benefits." },
    { q: "What makes NovaSeguros different?", a: "Personalized advice, 15-min response, **500+ clients**, **4.9/5** rating and **24/7** service. We're not just a policy — we're your partner." },
  ],
};

const INS_TYPES: Record<"es" | "en", string[]> = {
  es: ["Auto", "Vida", "Salud", "Hogar", "Viaje", "Mascotas", "Empresa", "Otro"],
  en: ["Auto", "Life", "Health", "Home", "Travel", "Pets", "Business", "Other"],
};

// ─── Translations ──────────────────────────────────────────────────────────────
function useT(lang: "es" | "en") {
  const es = lang === "es";
  return {
    greeting: es
      ? "Soy **Nova**, tu asistente de NovaSeguros. 😊\n¿En qué te puedo ayudar hoy?"
      : "I'm **Nova**, your NovaSeguros assistant. 😊\nHow can I help you today?",
    rateUs:      es ? "¿Cómo calificarías tu experiencia con Nova? ⭐" : "How would you rate your experience with Nova? ⭐",
    ratedThanks: es ? "¡Muchas gracias! 🙏 Tu opinión nos ayuda a mejorar cada día." : "Thank you so much! 🙏 Your feedback helps us improve every day.",
    optFaq:     es ? "💬 Tengo una pregunta"       : "💬 I have a question",
    optQuote:   es ? "📋 Quiero cotizar"            : "📋 I want a quote",
    optAdvisor: es ? "🧑‍💼 Hablar con un asesor"     : "🧑‍💼 Talk to an advisor",
    faqTitle:   es ? "¿Sobre qué tema tienes dudas?" : "What topic do you have questions about?",
    moreFaq:    es ? "Ver otra pregunta"             : "See another question",
    contactAdv: es ? "📞 Contactar asesor"           : "📞 Contact advisor",
    backMenu:   es ? "← Volver al menú"              : "← Back to menu",
    quoteTypeQ: es ? "¿Qué tipo de seguro te interesa?" : "What type of insurance are you interested in?",
    quoteName:  es ? "¿Cuál es tu nombre completo?"  : "What's your full name?",
    quoteNamePH: es ? "Ana García"                   : "Jane Smith",
    quotePhone: es ? "¿Y tu número de teléfono?"     : "What's your phone number?",
    quotePhonePH: es ? "8888-8888"                   : "555-1234",
    quoteEmail: es ? "Tu correo electrónico (opcional, pero lo recomendamos)" : "Your email (optional but recommended)",
    quoteEmailPH: es ? "ana@ejemplo.com"             : "jane@example.com",
    skipEmail:  es ? "Omitir"                        : "Skip",
    sending:    es ? "Enviando tu solicitud…"        : "Sending your request…",
    doneTitle:  es ? "✅ ¡Solicitud enviada!"        : "✅ Request sent!",
    doneBody:   es
      ? "Un asesor de NovaSeguros te contactará en **menos de 2 horas hábiles**. ¡Que tengas un excelente día! 🎉"
      : "A NovaSeguros advisor will contact you within **2 business hours**. Have a great day! 🎉",
    openChat:   es ? "Abrir chat"                    : "Open chat",
    closeChat:  es ? "Cerrar chat"                   : "Close chat",
    restart:    es ? "Hacer otra consulta"           : "New inquiry",
    backStep:   es ? "← Volver"                      : "← Back",
    advisorMsg: es
      ? "¡Perfecto! Contáctanos directamente por WhatsApp o llámanos:"
      : "Great! Reach us directly via WhatsApp or phone:",
    whatsapp:   es ? "📲 Abrir WhatsApp"             : "📲 Open WhatsApp",
    whatsappSent: es
      ? "✅ ¡Te abrimos WhatsApp! Si prefieres, también puedes volver al menú."
      : "✅ WhatsApp opened! You can also go back to the main menu.",
    bubble:     es ? "¡Hola! ¿En qué te ayudo?"     : "Hi! How can I help?",
    online:     es ? "En línea"                      : "Online",
    placeholder: es ? "Escribe aquí…"               : "Type here…",
    send:       es ? "Enviar"                        : "Send",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderText(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

// ─── Extra helpers ────────────────────────────────────────────────────────────
function getTimeGreeting(es: boolean): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return es ? "¡Buenos días! ☀️" : "Good morning! ☀️";
  if (h >= 12 && h < 18) return es ? "¡Buenas tardes! 👋" : "Good afternoon! 👋";
  return es ? "¡Buenas noches! 🌙" : "Good evening! 🌙";
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const INS_ICONS: Record<string, string> = {
  Auto: "🚗", Vida: "❤️", Life: "❤️", Salud: "🏥", Health: "🏥",
  Hogar: "🏠", Home: "🏠", Viaje: "✈️", Travel: "✈️",
  Mascotas: "🐾", Pets: "🐾", Empresa: "🏢", Business: "🏢",
  Otro: "✳️", Other: "✳️",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const { lang } = useLang();
  const t = useT(lang);
  const faq = FAQ[lang];
  const insTypes = INS_TYPES[lang];

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [leadData, setLeadData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [botTyping, setBotTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [starRating, setStarRating] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auto-scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Init on open ──
  useEffect(() => {
    if (open && messages.length === 0) showWelcome();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Escape key closes drawer ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Live clock (client-only to avoid hydration mismatch) ──
  useEffect(() => {
    setCurrentTime(formatTime());
    const id = setInterval(() => setCurrentTime(formatTime()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Session persistence — restore ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nova_chat");
      if (!raw) return;
      const { messages: m, step: s, leadData: l, starRating: sr, ts } = JSON.parse(raw) as {
        messages: Message[]; step: Step; leadData: Record<string, string>; starRating: number | null; ts: number;
      };
      if (Date.now() - ts < 24 * 60 * 60_000) {
        setMessages(m);
        setStep(s);
        setLeadData(l ?? {});
        setStarRating(sr ?? null);
        setHasUnread(false);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Session persistence — save ──
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      localStorage.setItem("nova_chat", JSON.stringify({ messages, step, leadData, starRating, ts: Date.now() }));
    } catch { /* ignore */ }
  }, [messages, step, leadData, starRating]);

  // ── Helpers ──
  const push = useCallback((msg: Omit<Message, "role">) => {
    setMessages(prev => [...prev, { role: "bot", ...msg }]);
  }, []);

  // ── Async bot response with typing indicator ──
  const botSay = useCallback(async (msg: Omit<Message, "role">, delay = 700) => {
    setBotTyping(true);
    await new Promise<void>(r => setTimeout(r, delay));
    setBotTyping(false);
    setMessages(prev => [...prev, { role: "bot", ...msg }]);
  }, []);

  const pushUser = (text: string) => {
    setMessages(prev => [...prev, { role: "user", text }]);
  };

  const clearLastOptions = () => {
    setMessages(prev => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last) copy[copy.length - 1] = { ...last, options: undefined, input: undefined };
      return copy;
    });
  };

  const showWelcome = async (delay = 350) => {
    setStep("welcome");
    setLeadData({});
    setInput("");
    setStarRating(null);
    const timeHello = getTimeGreeting(lang === "es");
    await botSay({
      text: `${timeHello}\n\n${t.greeting}`,
      options: [
        { label: t.optFaq, value: "faq" },
        { label: t.optQuote, value: "quote" },
        { label: t.optAdvisor, value: "advisor" },
      ],
    }, delay);
  };

  const goBack = useCallback(async () => {
    setInput("");
    clearLastOptions();
    if (step === "quote_name") {
      setStep("quote_type");
      await botSay({
        text: t.quoteTypeQ,
        options: [
          ...insTypes.map(tp => ({ label: tp, value: `type_${tp}` })),
          { label: t.backMenu, value: "back" },
        ],
      }, 400);
    } else if (step === "quote_phone") {
      setLeadData(prev => { const { name: _, ...rest } = prev; return rest; });
      setStep("quote_name");
      await botSay({ text: t.quoteName, input: "text", inputPlaceholder: t.quoteNamePH }, 400);
      focusInput();
    } else if (step === "quote_email") {
      setLeadData(prev => { const { phone: _, ...rest } = prev; return rest; });
      setStep("quote_phone");
      await botSay({ text: t.quotePhone, input: "tel", inputPlaceholder: t.quotePhonePH }, 400);
      focusInput();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, t, insTypes, botSay]);

  const showFaqMenu = async (delay = 600) => {
    setStep("faq_menu");
    await botSay({
      text: t.faqTitle,
      options: [
        ...faq.map((item, i) => ({ label: item.q, value: `faq_${i}` })),
        { label: t.backMenu, value: "back" },
      ],
    }, delay);
  };

  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 80);

  // ── Submit lead ──
  const submitLead = async (data: Record<string, string>) => {
    setStep("quote_done");
    clearLastOptions();
    setSubmitting(true);
    push({ text: t.sending });

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "chatbot", lang, ...data }),
      });
    } catch {
      // silently continue — don't block UX
    }

    setSubmitting(false);
    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { role: "bot", text: `${t.doneTitle}\n\n${t.doneBody}` };
      return copy;
    });
    push({ text: t.rateUs, stars: true });
    push({ text: "", options: [{ label: t.restart, value: "restart" }] });
  };

  // ── Option handler ──
  const handleOption = async (value: string, label: string) => {
    if (botTyping) return;
    clearLastOptions();
    pushUser(label);

    // Universal handlers
    if (value === "back" || value === "restart") { await showWelcome(); return; }
    if (value === "back_faq") { await showFaqMenu(); return; }
    if (value === "whatsapp") {
      window.open("https://wa.me/50689875225", "_blank");
      await botSay({ text: t.whatsappSent, options: [{ label: t.backMenu, value: "back" }] });
      return;
    }
    if (value === "skip_email") { submitLead({ ...leadData }); return; }

    // Step-specific
    if (step === "welcome") {
      if (value === "faq") { await showFaqMenu(); }
      else if (value === "quote") {
        setStep("quote_type");
        await botSay({
          text: t.quoteTypeQ,
          options: [
            ...insTypes.map(tp => ({ label: tp, value: `type_${tp}` })),
            { label: t.backMenu, value: "back" },
          ],
        });
      } else if (value === "advisor") {
        await botSay({
          text: t.advisorMsg,
          options: [{ label: t.whatsapp, value: "whatsapp" }, { label: t.backMenu, value: "back" }],
        });
      }
    } else if (step === "faq_menu" || step === "faq_answer") {
      if (value.startsWith("faq_")) {
        const idx = parseInt(value.replace("faq_", ""), 10);
        setStep("faq_answer");
        await botSay({
          text: faq[idx].a,
          options: [
            { label: t.moreFaq, value: "back_faq" },
            { label: t.contactAdv, value: "advisor_from_faq" },
            { label: t.backMenu, value: "back" },
          ],
        });
      } else if (value === "advisor_from_faq") {
        await botSay({
          text: t.advisorMsg,
          options: [{ label: t.whatsapp, value: "whatsapp" }, { label: t.backMenu, value: "back" }],
        });
      }
    } else if (step === "quote_type") {
      if (value.startsWith("type_")) {
        const insType = value.replace("type_", "");
        setLeadData({ type: insType });
        setStep("quote_name");
        await botSay({ text: t.quoteName, input: "text", inputPlaceholder: t.quoteNamePH });
        focusInput();
      }
    }

  };

  // ── Text input handler ──
  const handleSend = async () => {
    const val = input.trim();
    if (!val || botTyping) return;
    setInput("");
    clearLastOptions();
    pushUser(val);

    if (step === "quote_name") {
      setLeadData(prev => ({ ...prev, name: val }));
      setStep("quote_phone");
      await botSay({ text: t.quotePhone, input: "tel", inputPlaceholder: t.quotePhonePH });
      focusInput();
    } else if (step === "quote_phone") {
      setLeadData(prev => ({ ...prev, phone: val }));
      setStep("quote_email");
      await botSay({
        text: t.quoteEmail,
        input: "email",
        inputPlaceholder: t.quoteEmailPH,
        options: [{ label: t.skipEmail, value: "skip_email" }],
      });
      focusInput();
    } else if (step === "quote_email") {
      submitLead({ ...leadData, email: val });
    }
  };

  const lastMsg = messages[messages.length - 1];
  const showInput = lastMsg?.input != null && !botTyping;
  const canGoBack = showInput && (step === "quote_name" || step === "quote_phone" || step === "quote_email");
  const quoteStep = ({ quote_type: 1, quote_name: 2, quote_phone: 3, quote_email: 4, quote_done: 4 } as Record<string, number>)[step] ?? 0;
  const inQuote = quoteStep > 0;

  const handleStarClick = async (rating: number) => {
    if (starRating !== null) return;
    setStarRating(rating);
    setMessages(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].stars) { copy[i] = { ...copy[i], stars: false }; break; }
      }
      return copy;
    });
    pushUser("⭐".repeat(rating));
    await botSay({ text: t.ratedThanks }, 500);
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Floating trigger button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!open && hasUnread && (
          <div className="relative bg-navy-deep border border-gold/30 text-cream text-xs px-3 py-2 rounded-xl shadow-lg animate-fade-up max-w-[200px] text-right">
            {t.bubble}
            <span className="absolute -bottom-1.5 right-5 block w-3 h-3 bg-navy-deep border-r border-b border-gold/30 rotate-45" />
          </div>
        )}
        <div className="relative">
          {/* Pulse ring */}
          {hasUnread && !open && (
            <span className="absolute inset-0 rounded-full bg-gold opacity-40 animate-ping" />
          )}
          <button
            onClick={() => { setOpen(o => !o); if (!open) setHasUnread(false); }}
            className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden ${open ? "bg-gold" : "bg-white"}`}
            aria-label={open ? t.closeChat : t.openChat}
          >
            {open
              ? <X size={22} className="text-navy-deep relative z-10" />
              : <Image src="/logo-icon.svg" alt="NovaSeguros" fill className="object-contain p-2" unoptimized />}
            {hasUnread && !open && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">1</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Drawer panel ── */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-[420px] bg-navy border-l border-gold/20 shadow-2xl transition-transform duration-300 ease-in-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-navy-deep border-b border-gold/10 px-5 py-3.5 flex flex-col shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg w-10 h-10 overflow-hidden shrink-0">
              <Image src="/logo-oficial.png" alt="Nova" width={40} height={40} className="w-full h-full object-contain" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream text-sm font-semibold">Nova</p>
              <p className="text-gold text-[10px] tracking-wide uppercase">
                NovaSeguros · {t.online} · {currentTime}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-silver hover:text-cream transition-colors p-2 rounded-lg hover:bg-gold/10 shrink-0"
              aria-label={t.closeChat}
            >
              <X size={20} />
            </button>
          </div>
          {/* Quote progress bar */}
          {inQuote && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-silver/60 mb-1">
                <span>{lang === "es" ? "Cotización" : "Quote"}</span>
                <span>{lang === "es" ? `Paso ${quoteStep} de 4` : `Step ${quoteStep} of 4`}</span>
              </div>
              <div className="h-1 bg-navy-light/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${(quoteStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 nova-msg-in ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Bot avatar */}
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-[11px] font-bold shrink-0 mt-1">
                  N
                </div>
              )}
              <div className={`flex flex-col gap-2 min-w-0 flex-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                {msg.text && (
                  <div
                    className={`max-w-[88%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gold text-navy-deep rounded-tr-sm font-medium"
                        : "bg-navy-light/40 text-cream border border-gold/10 rounded-tl-sm"
                    }`}
                    {...(msg.role === "bot"
                      ? { dangerouslySetInnerHTML: { __html: renderText(msg.text) } }
                      : { children: msg.text }
                    )}
                  />
                )}
                {/* Star rating widget */}
                {msg.stars && (
                  <div className="flex gap-1.5 mt-0.5 ml-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        disabled={starRating !== null}
                        className={`transition-transform hover:scale-125 disabled:cursor-default ${
                          star <= (starRating ?? 0) ? "text-gold" : "text-silver/30 hover:text-gold/60"
                        }`}
                        aria-label={`${star} ${lang === "es" ? "estrellas" : "stars"}`}
                      >
                        <Star size={24} fill={star <= (starRating ?? 0) ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                )}
                {/* Options — chips for insurance types, regular buttons for others */}
                {msg.options && (
                  <div className="flex flex-col gap-2 w-full">
                    {msg.options.some(o => o.value.startsWith("type_")) && (
                      <div className="grid grid-cols-2 gap-2">
                        {msg.options.filter(o => o.value.startsWith("type_")).map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleOption(opt.value, opt.label)}
                            disabled={botTyping}
                            className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl border border-gold/25 text-cream bg-navy-light/20 hover:bg-gold/15 hover:border-gold/50 transition-all disabled:opacity-40"
                          >
                            <span className="text-lg leading-none">{INS_ICONS[opt.label] ?? "🔹"}</span>
                            <span className="truncate">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.options.filter(o => !o.value.startsWith("type_")).map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleOption(opt.value, opt.label)}
                        disabled={botTyping}
                        className="text-left text-sm px-4 py-2.5 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-all disabled:opacity-40"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {botTyping && (
            <div className="flex gap-2.5 items-center nova-msg-in">
              <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-[11px] font-bold shrink-0">
                N
              </div>
              <div className="bg-navy-light/40 border border-gold/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-gold/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gold/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gold/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          {submitting && !botTyping && (
            <div className="flex gap-2.5 items-center nova-msg-in">
              <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-[11px] font-bold shrink-0">
                N
              </div>
              <div className="bg-navy-light/40 border border-gold/10 rounded-2xl rounded-tl-sm px-4 py-2.5">
                <Loader2 size={16} className="text-gold animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Text input */}
        {showInput && (
          <div className="border-t border-gold/10 px-4 py-4 flex gap-2 shrink-0">
            {canGoBack && (
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-xl border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors shrink-0"
                aria-label={t.backStep}
                title={t.backStep}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <input
              ref={inputRef}
              type={lastMsg.input ?? "text"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={lastMsg.inputPlaceholder ?? t.placeholder}
              className="flex-1 bg-navy-light/30 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-cream placeholder:text-silver/40 outline-none focus:border-gold/50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || botTyping}
              className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center disabled:opacity-40 hover:bg-gold/90 transition-colors shrink-0"
              aria-label={t.send}
            >
              <Send size={16} className="text-navy-deep" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
