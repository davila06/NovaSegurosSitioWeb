"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { ExternalLink, Mail } from "lucide-react";

const TEAM = {
  es: [
    {
      initials: "VC",
      name: "Valeria Chacón",
      role: "Directora de Asesoría",
      bio: "10+ años guiando a familias y empresas costarricenses hacia la mejor cobertura posible. Experta en seguros de vida y salud.",
      years: "10+",
      specialty: "Vida & Salud",
    },
    {
      initials: "DR",
      name: "Diego Rodríguez",
      role: "Especialista Empresarial",
      bio: "Ex-gerente de riesgos corporativos con amplia trayectoria en seguros para PYMES y grandes empresas.",
      years: "8+",
      specialty: "Empresarial",
    },
    {
      initials: "SM",
      name: "Sofía Mora",
      role: "Asesora VIP Senior",
      bio: "Tu tranquilidad es mi especialidad. Apasionada por encontrar la cobertura perfecta a cada cliente.",
      years: "6+",
      specialty: "Auto & Hogar",
    },
    {
      initials: "AS",
      name: "Andrés Salas",
      role: "Gestor de Reclamos",
      bio: "Resuelvo lo que otros complican. Especialista en gestión de reclamos con tasa de resolución del 99%.",
      years: "7+",
      specialty: "Reclamos",
    },
  ],
  en: [
    {
      initials: "VC",
      name: "Valeria Chacón",
      role: "Head of Advisory",
      bio: "10+ years guiding Costa Rican families and businesses toward the best possible coverage. Expert in life & health.",
      years: "10+",
      specialty: "Life & Health",
    },
    {
      initials: "DR",
      name: "Diego Rodríguez",
      role: "Business Specialist",
      bio: "Former corporate risk manager with extensive experience in SME and enterprise insurance.",
      years: "8+",
      specialty: "Business",
    },
    {
      initials: "SM",
      name: "Sofía Mora",
      role: "Senior VIP Advisor",
      bio: "Your peace of mind is my specialty. Passionate about finding the perfect coverage for each client.",
      years: "6+",
      specialty: "Auto & Home",
    },
    {
      initials: "AS",
      name: "Andrés Salas",
      role: "Claims Manager",
      bio: "I solve what others complicate. Claims specialist with a 99% resolution rate.",
      years: "7+",
      specialty: "Claims",
    },
  ],
};

function FlipCard({ member }: { member: typeof TEAM.es[0] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-72 cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-card rounded-xl flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mb-4">
            <span className="font-display text-2xl font-bold text-gold">{member.initials}</span>
          </div>
          <h3 className="text-cream font-semibold text-base mb-1">{member.name}</h3>
          <p className="text-gold text-xs tracking-[0.12em] uppercase mb-3">{member.role}</p>
          <span className="text-silver/40 text-[10px] tracking-[0.1em] uppercase border border-gold/15 rounded-full px-3 py-1">
            {member.specialty}
          </span>
          <p className="text-silver/30 text-[10px] mt-4">Hover para ver más →</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gold/10 to-navy-deep border border-gold/40 rounded-xl flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-cream/80 text-sm leading-relaxed mb-4">{member.bio}</p>
          <div className="flex items-center gap-3 mb-5">
            <div className="text-center">
              <p className="font-display text-3xl text-gold font-semibold">{member.years}</p>
              <p className="text-silver/50 text-[10px] uppercase tracking-wide">años</p>
            </div>
            <div className="w-px h-10 bg-gold/20" />
            <div className="text-center">
              <p className="text-cream text-sm font-medium">{member.specialty}</p>
              <p className="text-silver/50 text-[10px] uppercase tracking-wide">especialidad</p>
            </div>
          </div>
          {/* Contact links */}
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${member.name.toLowerCase().replace(/\s+/g,".")}@novaseguros.cr`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[10px] text-gold/70 hover:text-gold border border-gold/20 hover:border-gold/50 rounded-full px-3 py-1.5 transition-colors duration-200"
            >
              <Mail size={10} /> Email
            </a>
            <a
              href="https://linkedin.com/company/novaseguros"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[10px] text-gold/70 hover:text-gold border border-gold/20 hover:border-gold/50 rounded-full px-3 py-1.5 transition-colors duration-200"
            >
              <ExternalLink size={10} /> LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TeamSection() {
  const { lang } = useLang();
  const team = TEAM[lang as "es" | "en"] ?? TEAM.es;

  return (
    <section id="team" className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
              {lang === "es" ? "Nuestro equipo" : "Our team"}
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-light text-cream leading-tight">
            {lang === "es" ? "Expertos que" : "Experts who"}<br />
            <span className="text-gold-gradient font-semibold">
              {lang === "es" ? "trabajan por ti" : "work for you"}
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <Reveal key={i} delay={i * 80} direction="up">
              <FlipCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
