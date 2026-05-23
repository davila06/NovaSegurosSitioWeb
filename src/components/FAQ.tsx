"use client";

import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/wa";
import { trackEvent } from "@/lib/analytics";
import { useState, useMemo } from "react";
import Reveal from "@/components/Reveal";
import { ChevronDown, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function FAQ() {
  const { t, lang } = useLang();
  const f = t.faq;
  const [open,  setOpen]  = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return f.items.map((item, i) => ({ ...item, i }));
    return f.items
      .map((item, i) => ({ ...item, i }))
      .filter(item =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
  }, [query, f.items]);

  return (
    <section id="faq" className="py-28 lg:py-36 bg-navy-deep relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">{f.eyebrow}</span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight whitespace-pre-line">
            {f.headline.split("\n")[0]}
            <br />
            <span className="text-gold-gradient font-semibold">{f.headline.split("\n")[1]}</span>
          </h2>
        </div>

        {/* Search input */}
        <div className="relative mb-8">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(null); }}
            placeholder={lang === "es" ? "Buscar pregunta…" : "Search questions…"}
            className="w-full bg-navy/60 border border-gold/15 focus:border-gold/40
                       text-cream text-sm pl-10 pr-10 py-3.5 rounded-sm outline-none
                       placeholder:text-silver/30 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-silver/40 hover:text-silver transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Accordion */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-silver/50 text-sm py-10"
            >
              {lang === "es" ? "No se encontraron resultados." : "No results found."}
            </motion.p>
          ) : (
            <motion.div key="list" layout className="space-y-3">
              {filtered.map(({ q, a, i }) => (
                <Reveal key={i} delay={0} direction="up">
                  <div
                    className={`rounded-sm border transition-all duration-300 overflow-hidden ${
                      open === i ? "border-gold/40 bg-gold/5" : "border-gold/10 bg-white/[0.02] hover:border-gold/20"
                    }`}
                  >
                    <button
                      id={`faq-btn-${i}`}
                      aria-expanded={open === i}
                      aria-controls={`faq-panel-${i}`}
                      data-faq-btn
                      className="w-full flex items-start justify-between gap-4 p-6 text-left"
                      onClick={() => {
                        const isOpening = open !== i;
                        setOpen(open === i ? null : i);
                        if (isOpening) trackEvent("faq_open", { index: i });
                      }}
                      onKeyDown={(e) => {
                        const btns = Array.from(document.querySelectorAll<HTMLElement>("[data-faq-btn]"));
                        const idx = btns.findIndex(b => b === e.currentTarget);
                        if (e.key === "ArrowDown") { e.preventDefault(); btns[idx + 1]?.focus(); }
                        if (e.key === "ArrowUp")   { e.preventDefault(); btns[idx - 1]?.focus(); }
                        if (e.key === "Home")      { e.preventDefault(); btns[0]?.focus(); }
                        if (e.key === "End")       { e.preventDefault(); btns[btns.length - 1]?.focus(); }
                      }}
                    >
                      <span className={`text-sm font-medium leading-relaxed transition-colors ${open === i ? "text-cream" : "text-cream/80"}`}>
                        {q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-gold transition-transform duration-300 mt-0.5 ${open === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open === i && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-btn-${i}`}
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.26, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-silver text-sm leading-relaxed">{a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Still have questions */}
        <div className="mt-12 text-center p-6 rounded-sm border border-gold/15 bg-gold/3">
          <p className="text-cream/70 text-sm mb-3">{f.moreQuestions}</p>
          <a
            href={waLink(lang, "faq")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:underline"
          >
            {f.whatsappCta}
          </a>
        </div>
      </div>
    </section>
  );
}
