"use client";

import { useLang } from "@/lib/i18n";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function FAQ() {
  const { t } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 lg:py-36 bg-navy-deep relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-14">
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

        {/* Accordion */}
        <div className="space-y-3">
          {f.items.map((item, i) => (
            <Reveal key={i} delay={i * 50} direction="up">
            <div
              key={i}
              className={`rounded-sm border transition-all duration-300 overflow-hidden ${
                open === i ? "border-gold/40 bg-gold/5" : "border-gold/10 bg-white/[0.02] hover:border-gold/20"
              }`}
            >
              <button
                className="w-full flex items-start justify-between gap-4 p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`text-sm font-medium leading-relaxed transition-colors ${open === i ? "text-cream" : "text-cream/80"}`}>
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-gold transition-transform duration-300 mt-0.5 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <AnimatePresence initial={false}>
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-silver text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            </Reveal>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-6 rounded-sm border border-gold/15 bg-gold/3">
          <p className="text-cream/70 text-sm mb-3">{f.moreQuestions}</p>
          <a
            href="https://wa.me/50689875225"
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
