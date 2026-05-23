import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad — NovaSeguros",
  description:
    "Conoce cómo NovaSeguros recopila, usa y protege tus datos personales conforme a la Ley N.° 8968 de Costa Rica.",
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    title: "1. Responsable del tratamiento",
    body: "NovaSeguros es el responsable del tratamiento de los datos personales recopilados a través de este sitio web (novaseguros.cr). Para consultas sobre privacidad, contáctenos en privacidad@novaseguros.cr o por teléfono al +506 8987-5225.",
  },
  {
    title: "2. Datos que recopilamos",
    body: "Recopilamos únicamente los datos que usted nos proporciona de forma voluntaria al completar el formulario de cotización o al comunicarse con nosotros: nombre completo, número de teléfono / WhatsApp, correo electrónico (opcional), tipo de seguro de interés y mensajes adicionales.",
  },
  {
    title: "3. Finalidad del tratamiento",
    body: "Usamos sus datos exclusivamente para: (a) contactarle con una cotización personalizada dentro de los 15 minutos siguientes, (b) brindar seguimiento de su solicitud de seguro, y (c) en caso de que lo autorice expresamente, enviarle comunicaciones comerciales relacionadas con nuestros servicios.",
  },
  {
    title: "4. Base legal",
    body: "El tratamiento se fundamenta en el consentimiento que usted brinda al enviar el formulario, conforme al artículo 5 de la Ley N.° 8968 — Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales de Costa Rica.",
  },
  {
    title: "5. Compartición de datos",
    body: "Sus datos no se venden ni se ceden a terceros con fines comerciales. Podemos compartirlos con proveedores de servicios tecnológicos que nos asistan en la gestión de leads (CRM, plataformas de correo) bajo estrictos acuerdos de confidencialidad y únicamente para las finalidades indicadas.",
  },
  {
    title: "6. Cookies",
    body: "Este sitio usa cookies esenciales para su funcionamiento, cookies analíticas (para entender cómo los usuarios navegan el sitio) y cookies de marketing (para mostrar publicidad relevante). Puede gestionar sus preferencias en el aviso de cookies que aparece al visitar el sitio por primera vez, o en cualquier momento borrando las cookies de su navegador.",
  },
  {
    title: "7. Conservación de datos",
    body: "Sus datos se conservan durante el tiempo necesario para atender su solicitud y cumplir obligaciones legales. Si no se formaliza ninguna relación contractual, los datos se eliminan en un plazo máximo de 24 meses desde la última interacción.",
  },
  {
    title: "8. Sus derechos (ARCOP)",
    body: "Conforme a la Ley N.° 8968, usted tiene derecho de Acceso, Rectificación, Cancelación, Oposición y Portabilidad de sus datos. Para ejercerlos, envíe una solicitud a privacidad@novaseguros.cr indicando su nombre completo y el derecho que desea ejercer. Atenderemos su solicitud en un plazo máximo de 10 días hábiles.",
  },
  {
    title: "9. Seguridad",
    body: "Aplicamos medidas técnicas y organizativas apropiadas para proteger sus datos frente a accesos no autorizados, pérdida, destrucción o divulgación, incluyendo cifrado TLS en tránsito y controles de acceso internos.",
  },
  {
    title: "10. Modificaciones",
    body: "Podemos actualizar esta política periódicamente. La versión vigente estará siempre disponible en esta página con la fecha de última actualización indicada abajo.",
  },
];

export default function PrivacidadPage() {
  return (
    <div
      className="min-h-screen bg-navy text-cream"
      style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}
    >
      {/* Top bar */}
      <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gold text-sm mb-10 hover:underline"
        >
          ← Volver al inicio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium mb-3">
            NovaSeguros
          </p>
          <h1
            className="text-4xl lg:text-5xl font-light leading-tight mb-4"
            style={{ fontFamily: "var(--font-cormorant, serif)" }}
          >
            Política de{" "}
            <span className="font-semibold italic">Privacidad</span>
          </h1>
          <p className="text-silver/70 text-sm">
            Última actualización: mayo 2026 · Aplica para residentes de Costa Rica.
          </p>
          <div className="mt-6 h-px bg-gold/15" />
        </div>

        {/* Intro */}
        <p className="text-silver leading-relaxed mb-10">
          En NovaSeguros valoramos y respetamos su privacidad. Esta política describe cómo
          tratamos los datos personales que nos confía cuando utiliza nuestro sitio web o
          servicios, en cumplimiento de la{" "}
          <strong className="text-cream">Ley N.° 8968</strong> — Ley de Protección de la
          Persona frente al Tratamiento de sus Datos Personales de la República de Costa Rica.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((sec) => (
            <div key={sec.title} className="border-l-2 border-gold/20 pl-5">
              <h2 className="text-cream font-semibold mb-2 text-base">{sec.title}</h2>
              <p className="text-silver/80 text-sm leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 p-6 rounded-xl border border-gold/20 bg-gold/4">
          <p className="text-cream font-semibold mb-1">¿Tiene alguna consulta?</p>
          <p className="text-silver/70 text-sm mb-3">
            Escríbanos a{" "}
            <a
              href="mailto:privacidad@novaseguros.cr"
              className="text-gold underline underline-offset-2"
            >
              privacidad@novaseguros.cr
            </a>{" "}
            o llámenos al{" "}
            <a href="tel:+50689875225" className="text-gold underline underline-offset-2">
              +506 8987-5225
            </a>
            .
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy-deep
                       text-xs font-bold px-5 py-2.5 rounded-sm transition-colors duration-200"
          >
            Volver al inicio →
          </Link>
        </div>

        <p className="text-silver/30 text-xs text-center mt-12">
          © {new Date().getFullYear()} NovaSeguros. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
