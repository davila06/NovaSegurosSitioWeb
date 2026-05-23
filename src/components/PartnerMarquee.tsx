"use client";

import { useLang } from "@/lib/i18n";
import { useState } from "react";

const PARTNERS = [
  { name: "INS",            sub: "Instituto Nacional de Seguros"          },
  { name: "MAPFRE",         sub: "MAPFRE Seguros Costa Rica"              },
  { name: "ASSA",           sub: "ASSA Compañía de Seguros S.A."          },
  { name: "Quálitas",       sub: "Quálitas Compañía de Seguros"           },
  { name: "Pan-American",   sub: "Pan-American Life Insurance de CR"      },
  { name: "AIG",            sub: "AIG Seguros Costa Rica"                 },
  { name: "ADISA",          sub: "Aseguradora del Istmo"                  },
  { name: "Oceánica",       sub: "Oceánica de Seguros"                    },
  { name: "Sagicor",        sub: "Sagicor Costa Rica"                     },
  { name: "CIS",            sub: "Compañía Internacional de Seguros"      },
];

// Tripled to ensure seamless loop at any viewport width
const ITEMS  = [...PARTNERS, ...PARTNERS, ...PARTNERS];
const ITEMS_R = [...PARTNERS].reverse();
const ITEMS_ROW2 = [...ITEMS_R, ...ITEMS_R, ...ITEMS_R];

export default function PartnerMarquee() {
  const { lang } = useLang();
  const [paused, setPaused] = useState(false);
  const label =
    lang === "es"
      ? "Trabajamos con las principales aseguradoras del país"
      : "We partner with leading insurance carriers";

  return (
    <div
      className="relative bg-navy-deep border-y border-gold/[0.07] overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Side fades — wider with subtle gold tint */}
      <div className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to right, #0A0A0A 55%, rgba(10,10,10,0.7) 80%, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-40 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to left, #0A0A0A 55%, rgba(10,10,10,0.7) 80%, transparent)" }} />

      {/* Label */}
      <p className="relative z-20 text-center text-silver/30 text-[9px] tracking-[0.38em] uppercase pt-5 pb-3">
        {label}
      </p>

      {/* Scrolling strip — row 1 */}
      <div className="overflow-hidden pb-3">
        <div
          className="flex items-center gap-16 will-change-transform"
          style={{ animation: `marquee 38s linear infinite`, animationPlayState: paused ? "paused" : "running" }}
        >
          {ITEMS.map((p, i) => (
            <PartnerItem key={i} p={p} />
          ))}
        </div>
      </div>

      {/* Row 2 — reversed direction */}
      <div className="overflow-hidden pb-5 opacity-40">
        <div
          className="flex items-center gap-16 will-change-transform"
          style={{ animation: `marquee-reverse 52s linear infinite`, animationPlayState: paused ? "paused" : "running" }}
        >
          {ITEMS_ROW2.map((p, i) => (
            <PartnerItem key={i} p={p} small />
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerItem({ p, small }: { p: { name: string; sub: string }; small?: boolean }) {
  return (
    <div className="relative group/partner flex items-center gap-3 flex-shrink-0">
      {/* Tooltip */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 pointer-events-none
                      opacity-0 group-hover/partner:opacity-100 transition-opacity duration-200">
        <div className="bg-navy-deep/95 border border-gold/25 px-2.5 py-1 rounded text-[10px] text-cream whitespace-nowrap shadow-lg">
          {p.sub}
        </div>
      </div>
      <span className="w-1 h-1 rounded-full bg-gold/25 flex-shrink-0 group-hover/partner:bg-gold/60 transition-colors duration-300" />
      <div className="flex flex-col leading-none">
        <span className={`font-display font-semibold text-cream/30 tracking-wider whitespace-nowrap group-hover/partner:text-cream/70 transition-colors duration-300 ${small ? "text-base" : "text-xl"}`}>
          {p.name}
        </span>
        {!small && (
          <span className="text-silver/20 text-[9px] tracking-[0.12em] uppercase mt-0.5 whitespace-nowrap">
            {p.sub}
          </span>
        )}
      </div>
    </div>
  );
}
