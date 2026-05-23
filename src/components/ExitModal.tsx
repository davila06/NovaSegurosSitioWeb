"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ArrowRight, Copy, Check as CheckIcon, Tag, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/wa";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "nova_exit_seen";
const COUPON = "NOVA30";

const COPY = {
  es: {
    title:   "Antes de que te vayas…",
    body:    "Usa este código exclusivo y obtén hasta un 30% en tu primera póliza. Válido por 48 horas.",
    coupon:  "Tu código de descuento",
    cta:     "Usar código y cotizar →",
    waCta:   "O escríbenos por WhatsApp",
    dismiss: "No, gracias",
    copied:  "¡Copiado!",
  },
  en: {
    title:   "Before you go…",
    body:    "Use this exclusive code and get up to 30% off your first policy. Valid for 48 hours.",
    coupon:  "Your discount code",
    cta:     "Use code & get quote →",
    waCta:   "Or chat with us on WhatsApp",
    dismiss: "No thanks",
    copied:  "Copied!",
  },
};

export default function ExitModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lang } = useLang();
  const copy = COPY[lang as "es" | "en"] ?? COPY.es;
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, open);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 4) {
        setOpen(true);
        trackEvent("exit_modal_shown");
      }
    };

    const id = setTimeout(() => {
      document.addEventListener("mouseleave", onMouseLeave);
    }, 4000);

    return () => {
      clearTimeout(id);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const close = () => setOpen(false);

  const copyCoupon = async () => {
    try { await navigator.clipboard.writeText(COUPON); } catch { return; }
    trackEvent("coupon_copied", { coupon: COUPON });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 20  }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            className="fixed inset-x-4 bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       z-[201] w-full sm:max-w-md
                       bg-gradient-to-br from-slate to-navy-deep
                       border border-gold/30 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Gold top bar */}
            <div className="h-1 bg-linear-to-r from-gold-dark via-gold to-gold-light" />

            <div className="p-8">
              <button
                onClick={close}
                aria-label="Cerrar"
                className="absolute top-5 right-5 text-silver/40 hover:text-silver transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                  <Shield size={22} className="text-gold" />
                </div>
                <h2 className="font-display text-2xl text-cream font-semibold leading-tight">
                  {copy.title}
                </h2>
              </div>

              <p className="text-silver text-sm leading-relaxed mb-5">{copy.body}</p>

              {/* Coupon code box */}
              <div className="mb-6 rounded-xl border border-gold/30 bg-gold/5 px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={12} className="text-gold" />
                  <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold">{copy.coupon}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-bold text-gold-gradient tracking-[0.25em]">
                    {COUPON}
                  </span>
                  <button
                    onClick={copyCoupon}
                    className="flex items-center gap-1.5 text-[11px] text-gold border border-gold/30 hover:border-gold/60 hover:bg-gold/10 rounded-full px-3 py-1.5 transition-all duration-200"
                  >
                    {copied ? <CheckIcon size={11} /> : <Copy size={11} />}
                    {copied ? copy.copied : "Copiar"}
                  </button>
                </div>
              </div>

              <a
                href="#quote"
                onClick={close}
                className="group flex items-center justify-center gap-3 w-full
                           bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold
                           py-3.5 rounded-sm transition-all duration-300
                           hover:shadow-[0_0_25px_rgba(201,168,76,0.45)] mb-2"
              >
                {copy.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={waLink(lang as "es" | "en", "exit")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="group flex items-center justify-center gap-2 w-full
                           border border-[#25D366]/40 hover:border-[#25D366]/70 hover:bg-[#25D366]/8
                           text-[#25D366] text-sm font-medium
                           py-3 rounded-sm transition-all duration-300 mb-3"
              >
                <MessageCircle size={15} />
                {copy.waCta}
              </a>

              <button
                onClick={close}
                className="w-full text-silver/40 hover:text-silver text-xs text-center transition-colors py-1"
              >
                {copy.dismiss}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
