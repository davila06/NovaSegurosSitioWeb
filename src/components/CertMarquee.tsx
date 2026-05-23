"use client";

import { useLang } from "@/lib/i18n";

const CERTS = [
  { name: "SUGESE",            sub: "Regulado · Superintendencia de Seguros" },
  { name: "APSE",              sub: "Miembro activo"                          },
  { name: "ISO 9001:2015",     sub: "Gestión de calidad certificada"          },
  { name: "INS Premium",       sub: "Proveedor autorizado de primer nivel"    },
  { name: "MAPFRE Partner",    sub: "Aliado estratégico oficial"              },
  { name: "SURA Network",      sub: "Red de corredores certificados"         },
  { name: "Zurich Authorized", sub: "Corredor autorizado Zurich Latam"       },
  { name: "ASSA Oficial",      sub: "Distribuidor autorizado"                 },
];

const ITEMS = [...CERTS, ...CERTS, ...CERTS];

export default function CertMarquee() {
  const { lang } = useLang();
  const label =
    lang === "es"
      ? "Certificaciones y respaldo institucional"
      : "Certifications & institutional backing";

  return (
    <div className="relative bg-navy border-y border-gold/[0.06] overflow-hidden select-none group">
      {/* Side fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-navy to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy to-transparent z-10 pointer-events-none" />

      {/* Label */}
      <p className="relative z-20 text-center text-silver/25 text-[9px] tracking-[0.38em] uppercase pt-4 pb-2">
        {label}
      </p>

      {/* Scrolling strip — reversed direction */}
      <div className="overflow-hidden pb-4">
        <div
          className="flex items-center gap-14 will-change-transform group-hover:[animation-play-state:paused]"
          style={{ animation: "marqueeRev 40s linear infinite" }}
        >
          {ITEMS.map((c, i) => (
            <div key={i} className="flex items-center gap-3 flex-shrink-0">
              <span className="w-1 h-1 rounded-full bg-gold/20 flex-shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-base font-semibold text-cream/25 tracking-wider whitespace-nowrap hover:text-gold/60 transition-colors duration-300">
                  {c.name}
                </span>
                <span className="text-silver/15 text-[9px] tracking-[0.1em] uppercase mt-0.5 whitespace-nowrap">
                  {c.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
