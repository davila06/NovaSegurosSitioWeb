"use client";

import { useState } from "react";
import { ShieldCheck, Send } from "lucide-react";

const RIGHTS = [
  { value: "acceso",        label: "Acceso — Ver mis datos" },
  { value: "rectificacion", label: "Rectificación — Corregir mis datos" },
  { value: "cancelacion",   label: "Cancelación — Eliminar mis datos" },
  { value: "oposicion",     label: "Oposición — Oponerme al tratamiento" },
  { value: "portabilidad",  label: "Portabilidad — Recibir copia de mis datos" },
] as const;

export default function ArcoForm() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [right,   setRight]   = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ ok: boolean; ticketId?: string } | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !right) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/arco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, right, details }),
      });
      const data = await res.json() as { ok: boolean; ticketId?: string; error?: string };
      if (res.ok && data.ok) {
        setResult({ ok: true, ticketId: data.ticketId });
      } else {
        setError(data.error ?? "Error al enviar la solicitud. Intente de nuevo.");
      }
    } catch {
      setError("No se pudo conectar. Verifique su conexión e intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-14" id="arco">
      <div className="border-t border-gold/15 pt-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={18} className="text-gold shrink-0" />
          <h2 className="text-cream font-semibold text-base">
            Ejercer mis derechos (ARCO)
          </h2>
        </div>
        <p className="text-silver/60 text-sm mb-7 leading-relaxed">
          Complete el formulario para enviar una solicitud formal. Atendemos en un plazo
          máximo de <strong className="text-cream">10 días hábiles</strong>, conforme a la
          Ley N.° 8968.
        </p>

        {result?.ok ? (
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <p className="text-emerald-400 font-semibold text-sm mb-1">
              Solicitud recibida correctamente
            </p>
            <p className="text-silver/70 text-xs">
              Número de ticket: <span className="font-mono text-cream">{result.ticketId}</span>
            </p>
            <p className="text-silver/50 text-xs mt-1">
              Le responderemos a <span className="text-cream">{email}</span> en un plazo máximo de 10 días hábiles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="arco-name" className="block text-[10px] tracking-[0.15em] uppercase text-silver/50 mb-1.5">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                id="arco-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60
                           text-cream text-sm px-4 py-2.5 rounded-sm outline-none transition-colors
                           placeholder:text-silver/30"
                placeholder="Su nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="arco-email" className="block text-[10px] tracking-[0.15em] uppercase text-silver/50 mb-1.5">
                Correo electrónico <span className="text-red-400">*</span>
              </label>
              <input
                id="arco-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60
                           text-cream text-sm px-4 py-2.5 rounded-sm outline-none transition-colors
                           placeholder:text-silver/30"
                placeholder="su@correo.com"
              />
            </div>

            {/* Right */}
            <div>
              <label htmlFor="arco-right" className="block text-[10px] tracking-[0.15em] uppercase text-silver/50 mb-1.5">
                Derecho que desea ejercer <span className="text-red-400">*</span>
              </label>
              <select
                id="arco-right"
                value={right}
                onChange={e => setRight(e.target.value)}
                required
                className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60
                           text-cream text-sm px-4 py-2.5 rounded-sm outline-none transition-colors"
              >
                <option value="" disabled>Seleccione un derecho…</option>
                {RIGHTS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Details */}
            <div>
              <label htmlFor="arco-details" className="block text-[10px] tracking-[0.15em] uppercase text-silver/50 mb-1.5">
                Detalles adicionales (opcional)
              </label>
              <textarea
                id="arco-details"
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                maxLength={1000}
                className="w-full bg-navy/60 border border-gold/20 focus:border-gold/60
                           text-cream text-sm px-4 py-2.5 rounded-sm outline-none transition-colors resize-none
                           placeholder:text-silver/30"
                placeholder="Describa su solicitud con más detalle…"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-deep
                         text-sm font-bold px-6 py-3 rounded-sm transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                : <Send size={14} />}
              {loading ? "Enviando…" : "Enviar solicitud"}
            </button>

            <p className="text-silver/40 text-[10px]">
              Sus datos serán utilizados únicamente para atender esta solicitud y no serán compartidos con terceros.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
