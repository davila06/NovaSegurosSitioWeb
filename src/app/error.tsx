"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NovaSeguros]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-navy flex items-center justify-center px-6 relative"
      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
    >
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-400" />
        </div>

        <h1
          className="text-4xl font-light text-cream mb-3"
          style={{ fontFamily: "var(--font-cormorant, serif)" }}
        >
          Algo salió{" "}
          <span className="font-semibold italic text-gold">mal</span>
        </h1>

        <p className="text-silver/70 text-sm leading-relaxed mb-8">
          Ocurrió un error inesperado. Nuestro equipo ha sido notificado.
          {error.digest && (
            <span className="block mt-2 text-silver/40 text-xs font-mono">
              ref: {error.digest}
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light
                       text-navy-deep text-sm font-bold px-6 py-3 rounded-sm transition-colors duration-200"
          >
            <RefreshCcw size={15} />
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gold/30
                       hover:border-gold/60 text-cream text-sm font-medium px-6 py-3
                       rounded-sm transition-all duration-200 hover:bg-gold/5"
          >
            <Home size={15} className="text-gold" />
            Inicio
          </a>
        </div>
      </div>
    </div>
  );
}
