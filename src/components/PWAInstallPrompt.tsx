"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_KEY = "nova_pwa_installed";

/** Intercepts the browser's PWA install prompt and renders a custom install banner. */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem(INSTALL_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner 3 s after the prompt is available
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(INSTALL_KEY, "1");
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar NovaSeguros"
      className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-72 z-[9997]
                 bg-navy-deep border border-gold/20 rounded-xl p-4
                 shadow-[0_8px_32px_rgba(0,0,0,0.45)]
                 flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
        <Download size={15} className="text-gold" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-cream text-xs font-semibold mb-0.5">Instalar NovaSeguros</p>
        <p className="text-silver/60 text-[10px] leading-relaxed mb-3">
          Accede más rápido desde tu pantalla de inicio, sin conexión.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 bg-gold hover:bg-gold-light text-navy-deep text-[10px]
                       font-bold py-1.5 rounded-full transition-colors duration-200"
          >
            Instalar
          </button>
          <button
            onClick={dismiss}
            className="text-[10px] text-silver/40 hover:text-silver px-2 py-1.5 transition-colors"
          >
            Ahora no
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
