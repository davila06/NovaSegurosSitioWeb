"use client";

export default function OfflinePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-navy text-cream px-6 text-center"
      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

      <div
        className="text-6xl mb-4 font-light"
        style={{ fontFamily: "var(--font-cormorant, serif)" }}
      >
        Sin conexión
      </div>
      <p className="text-silver text-sm max-w-xs leading-relaxed mb-8">
        Parece que no tienes conexión a internet. Revisa tu red y vuelve a intentarlo.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-gold hover:bg-gold-light text-navy-deep text-sm font-bold
                   px-7 py-3 rounded-sm transition-colors duration-200"
      >
        Reintentar
      </button>
    </div>
  );
}
