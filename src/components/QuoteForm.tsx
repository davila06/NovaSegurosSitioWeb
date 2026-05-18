"use client";

import { useLang } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { Send, ShieldCheck } from "lucide-react";

export default function QuoteForm() {
  const { t, lang } = useLang();
  const qf = t.quote;
  const fields = qf.fields;

  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Listen for quiz-select event from Hero to prefill insurance type
  useEffect(() => {
    const handler = (e: Event) => {
      const { type } = (e as CustomEvent<{ type: string }>).detail;
      setForm(f => ({ ...f, type }));
    };
    window.addEventListener("nova:quiz-select", handler);
    return () => window.removeEventListener("nova:quiz-select", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "form", lang, ...form }),
      });
    } catch {
      // proceed to success state regardless — don't block UX
    }
    setLoading(false);
    setSubmitted(true);
  };

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

            {/* Features */}
            <div className="space-y-4">
              {qf.features.map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-gold flex-shrink-0" />
                  <span className="text-silver text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-gradient-to-br from-slate/60 to-navy-deep border border-gold/20 rounded-sm p-8 lg:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mb-6">
                  <ShieldCheck size={28} className="text-gold" />
                </div>
                <h3 className="font-display text-3xl text-cream font-semibold mb-3">
                  {lang === "es" ? "¡Listo!" : "All set!"}
                </h3>
                <p className="text-silver text-sm leading-relaxed max-w-xs">
                  {lang === "es"
                    ? "Un asesor te contactará en menos de 15 minutos para presentarte las mejores opciones."
                    : "An advisor will contact you in less than 15 minutes with the best options for you."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label className="text-silver text-xs tracking-[0.12em] uppercase mb-2 block">{fields.name}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60 text-cream text-sm px-4 py-3 rounded-sm outline-none transition-colors placeholder:text-silver/30"
                    placeholder="Andrea Jiménez"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-silver text-xs tracking-[0.12em] uppercase mb-2 block">{fields.phone}</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60 text-cream text-sm px-4 py-3 rounded-sm outline-none transition-colors placeholder:text-silver/30"
                      placeholder="+506 8888 8888"
                    />
                  </div>
                  <div>
                    <label className="text-silver text-xs tracking-[0.12em] uppercase mb-2 block">{fields.email}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60 text-cream text-sm px-4 py-3 rounded-sm outline-none transition-colors placeholder:text-silver/30"
                      placeholder="andrea@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-silver text-xs tracking-[0.12em] uppercase mb-2 block">{fields.type}</label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60 text-cream text-sm px-4 py-3 rounded-sm outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>—</option>
                    {fields.typeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-silver text-xs tracking-[0.12em] uppercase mb-2 block">{fields.message}</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60 text-cream text-sm px-4 py-3 rounded-sm outline-none transition-colors resize-none placeholder:text-silver/30"
                    placeholder="Ej. Tengo un carro del 2023 y busco cobertura total..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold py-4 rounded-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? (lang === "es" ? "Enviando…" : "Sending…") : fields.submit}
                </button>

                <p className="text-silver/50 text-xs text-center">{fields.privacy}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
