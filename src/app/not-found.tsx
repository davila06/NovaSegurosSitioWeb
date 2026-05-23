import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada — NovaSeguros",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-navy text-cream relative overflow-hidden px-6"
      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 */}
        <p
          className="font-light leading-none mb-4 text-gold/20 select-none"
          style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontSize: "clamp(6rem, 20vw, 12rem)",
          }}
        >
          404
        </p>

        <h1
          className="text-3xl font-semibold text-cream mb-3"
          style={{ fontFamily: "var(--font-cormorant, serif)" }}
        >
          Página no encontrada
        </h1>
        <p className="text-silver text-sm leading-relaxed mb-10">
          La página que buscas no existe o fue movida.
          <br />
          Pero tu cobertura ideal sí existe — encuéntrala aquí.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/#quote"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light
                       text-navy-deep text-sm font-bold px-7 py-3.5 rounded-sm
                       transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
          >
            Cotizar ahora — gratis →
          </Link>
          <Link
            href="/"
            className="text-silver hover:text-cream text-sm transition-colors underline underline-offset-4"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-silver/50">
          {[
            { label: "Seguros Auto",    href: "/seguros/auto"     },
            { label: "Seguros Vida",    href: "/seguros/vida"     },
            { label: "Seguros Salud",   href: "/seguros/salud"    },
            { label: "Seguros Hogar",   href: "/seguros/hogar"    },
            { label: "Plan Empresarial",href: "/seguros/empresas" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-gold transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
