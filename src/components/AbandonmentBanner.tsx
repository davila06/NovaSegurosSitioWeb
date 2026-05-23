"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

const DRAFT_KEY  = "nova_quote_draft";
const BANNER_KEY = "nova_abandon_seen";
const BANNER_TTL = 48 * 60 * 60 * 1000; // 48 h

interface Draft {
  name?:    string;
  phone?:   string;
  type?:    string;
  savedAt?: number;
}

/**
 * Shows a sticky recovery banner when the user has a partial quote draft
 * in localStorage (has name + phone, saved within last 48 h).
 * Dismissed state is stored in sessionStorage so it resets per tab.
 */
export default function AbandonmentBanner() {
  const { lang } = useLang();
  const [draft,   setDraft]   = useState<Draft | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(BANNER_KEY)) return;

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      const d: Draft = JSON.parse(raw);
      if (!d.name?.trim() || !d.phone?.trim()) return;

      const savedAt = d.savedAt ?? Date.now();
      if (Date.now() - savedAt > BANNER_TTL) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }

      setDraft(d);
      setTimeout(() => setVisible(true), 1500);
    } catch { /* ignore */ }
  }, []);

  const resume = () => {
    setVisible(false);
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  };

  const dismiss = () => {
    sessionStorage.setItem(BANNER_KEY, "1");
    setVisible(false);
  };

  if (!visible || !draft) return null;

  const firstName = draft.name?.split(" ")[0] ?? "";

  return (
    <div
      role="dialog"
      aria-label={lang === "es" ? "Retomar cotización" : "Resume quote"}
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-[9996]
                 bg-navy-deep border border-gold/30 rounded-xl p-4
                 shadow-[0_8px_32px_rgba(0,0,0,0.45)]
                 flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
        <FileText size={15} className="text-gold" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-cream text-xs font-semibold mb-0.5">
          {lang === "es"
            ? `${firstName ? `${firstName}, r` : "R"}etoma tu cotización`
            : `${firstName ? `${firstName}, c` : "C"}ontinue your quote`}
        </p>
        {draft.type && (
          <p className="text-gold/70 text-[10px] mb-2">
            {lang === "es" ? `Seguro de ${draft.type}` : `${draft.type} Insurance`}
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={resume}
            className="flex-1 bg-gold hover:bg-gold-light text-navy-deep text-[10px]
                       font-bold py-1.5 rounded-full transition-colors duration-200"
          >
            {lang === "es" ? "Continuar →" : "Resume →"}
          </button>
          <button
            onClick={dismiss}
            className="text-[10px] text-silver/40 hover:text-silver px-2 py-1.5 transition-colors"
          >
            {lang === "es" ? "Descartar" : "Dismiss"}
          </button>
        </div>
      </div>

      <button
        onClick={dismiss}
        aria-label="Cerrar"
        className="text-silver/30 hover:text-silver transition-colors shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  );
}
