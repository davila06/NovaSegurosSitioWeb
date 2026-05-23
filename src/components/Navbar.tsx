"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { Menu, X, Phone } from "lucide-react";
import { waLink } from "@/lib/wa";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function Navbar() {
  const { t, toggle, lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Scroll-spy via IntersectionObserver ──
  useEffect(() => {
    const sectionIds = ["services", "why-us", "how-it-works", "membership", "faq", "quote"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        // Fire when the section occupies the middle band of the viewport
        { rootMargin: "-35% 0px -60% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const navLinks = [
    { label: t.nav.services,   href: "#services"    },
    { label: t.nav.whyUs,      href: "#why-us"      },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.membership, href: "#membership"  },
    { label: t.nav.faq,        href: "#faq"         },
  ];

  const isActive = (href: string) => activeSection === href.slice(1);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy-deep/90 backdrop-blur-xl border-b border-gold/12 shadow-[0_8px_40px_rgba(0,0,0,0.55),0_1px_0_rgba(200,169,110,0.08)]"
          : "bg-transparent"
      }`}
    >
      <AnnouncementBar />
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
          style={{ width: `${scrollProgress}%`, transition: "width 0.1s linear" }}
        />
      </div>

      <div className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "h-14" : "h-20"}`}>
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className={`bg-white rounded-xl overflow-hidden shadow-md shrink-0 transition-all duration-500 ${scrolled ? "w-8 h-8" : "w-11 h-11"}`}>
            <Image
              src="/imagenOficial.png"
              alt="NovaSeguros"
              width={44}
              height={44}
              className="w-full h-full object-contain"
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-cream font-display text-xl font-semibold tracking-wide group-hover:text-gold transition-colors duration-300">
              Nova<span className="text-gold">Seguros</span>
            </span>
            <span className="text-silver text-[10px] tracking-[0.2em] uppercase mt-0.5">Premium Insurance</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors duration-200 relative group ${
                isActive(link.href) ? "text-gold" : "text-silver hover:text-cream"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 h-px bg-gold transition-all duration-500 ease-out ${
                  isActive(link.href) ? "left-0 right-0" : "left-1/2 right-1/2 group-hover:left-0 group-hover:right-0"
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggle}
            title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
            className="flex items-center gap-1.5 text-silver hover:text-gold text-xs tracking-[0.12em] uppercase transition-colors duration-200 px-2.5 py-1 border border-silver/20 hover:border-gold/40 rounded"
          >
            <span>{lang === "es" ? "🇺🇸" : "🇨🇷"}</span>
            <span>{lang === "es" ? "EN" : "ES"}</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            title="Ctrl+K — navegación rápida"
            className="hidden lg:flex items-center gap-1 text-silver/35 hover:text-silver text-[10px] border border-silver/10 hover:border-silver/25 px-2 py-1 rounded transition-all duration-200"
          >
            <kbd className="font-mono">⌃K</kbd>
          </button>
          <a
            href={waLink(lang, "float")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-deep text-sm font-semibold px-5 py-2.5 rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]"
          >
            <Phone size={14} />
            {t.nav.contact}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-cream p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-deep border-t border-gold/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-lg font-display font-medium transition-colors ${
                isActive(link.href) ? "text-gold" : "text-cream hover:text-gold"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-gold/10">
            <button onClick={toggle} className="flex items-center gap-1.5 text-silver text-sm border border-silver/20 px-3 py-1.5 rounded">
              <span>{lang === "es" ? "🇺🇸" : "🇨🇷"}</span>
              <span>{lang === "es" ? "EN" : "ES"}</span>
            </button>
            <a
              href={waLink(lang, "float")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex-1 text-center bg-gold text-navy-deep font-semibold py-2.5 rounded-sm text-sm"
            >
              {t.nav.contact}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

