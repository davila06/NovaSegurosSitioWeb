"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { Car, Heart, Home, Building2, Plane, PawPrint, Activity } from "lucide-react";

const ACTIVITIES_ES = [
  { Icon: Car,       name: "Ana M.",     city: "San José",   type: "Seguro Auto"     },
  { Icon: Heart,     name: "Carlos R.",  city: "Heredia",    type: "Seguro Vida"     },
  { Icon: Home,      name: "Sofía V.",   city: "Cartago",    type: "Seguro Hogar"    },
  { Icon: Building2, name: "Rafael B.",  city: "Alajuela",   type: "Plan PYMES"      },
  { Icon: Plane,     name: "María L.",   city: "Liberia",    type: "Seguro Viaje"    },
  { Icon: PawPrint,  name: "Diego S.",   city: "Escazú",     type: "Seguro Mascotas" },
  { Icon: Activity,  name: "Valeria T.", city: "Pérez Zeledón", type: "Salud Familiar" },
];

const ACTIVITIES_EN = [
  { Icon: Car,       name: "Ana M.",     city: "San José",   type: "Auto Insurance"   },
  { Icon: Heart,     name: "Carlos R.",  city: "Heredia",    type: "Life Insurance"   },
  { Icon: Home,      name: "Sofía V.",   city: "Cartago",    type: "Home Insurance"   },
  { Icon: Building2, name: "Rafael B.",  city: "Alajuela",   type: "Business Plan"    },
  { Icon: Plane,     name: "María L.",   city: "Liberia",    type: "Travel Insurance" },
  { Icon: PawPrint,  name: "Diego S.",   city: "Escazú",     type: "Pet Insurance"    },
  { Icon: Activity,  name: "Valeria T.", city: "Pérez Zeledón", type: "Family Health" },
];

const TIMES_ES = ["hace 1 min", "hace 2 min", "hace 4 min", "hace 5 min", "hace 8 min"];
const TIMES_EN = ["1 min ago",  "2 min ago",  "4 min ago",  "5 min ago",  "8 min ago"];

function useCounter(base = 4) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const tick = () => {
      const delta = Math.random() < 0.35 ? (Math.random() < 0.5 ? 1 : -1) : 0;
      setCount(c => Math.max(2, Math.min(12, c + delta)));
    };
    const id = setInterval(tick, 4500 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);
  return count;
}

export default function LiveProof() {
  const { lang } = useLang();
  const count = useCounter(5);
  const activities = lang === "es" ? ACTIVITIES_ES : ACTIVITIES_EN;
  const times = lang === "es" ? TIMES_ES : TIMES_EN;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % activities.length), 3500);
    return () => clearInterval(id);
  }, [activities.length]);

  const act = activities[idx];

  const viewingText =
    lang === "es"
      ? `${count} personas cotizando ahora`
      : `${count} people quoting now`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Viewing counter */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y:  4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-silver/60 tabular-nums"
          >
            {viewingText}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Separator */}
      <div className="hidden sm:block w-px h-4 bg-gold/15" />

      {/* Rotating activity pill */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0  }}
          exit={{    opacity: 0, x: -14 }}
          transition={{ duration: 0.22 }}
          className="flex items-center gap-2 bg-navy-light/50 border border-gold/10 rounded-full px-3 py-1.5"
        >
          <act.Icon size={11} className="text-gold/70 shrink-0" />
          <span className="text-silver/60 text-[11px]">
            <span className="text-cream/70 font-medium">{act.name}</span>
            {" · "}{act.city} — {act.type}
          </span>
          <span className="text-silver/35 text-[10px] shrink-0">{times[idx % times.length]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
