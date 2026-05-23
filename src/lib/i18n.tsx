"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "es" | "en";

const translations = {
  es: {
    nav: {
      services: "Servicios",
      whyUs: "Por qué nosotros",
      howItWorks: "Cómo funciona",
      membership: "Membresía Elite",
      faq: "Preguntas",
      contact: "Cotizar",
      lang: "EN",
      openChat: "Abrir chat",
      closeChat: "Cerrar chat",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    hero: {
      eyebrow: "Seguros Premium · Costa Rica",
      headline: "Protegemos lo que\nmás valoras.",
      sub: "Asesoría experta, atención VIP y cobertura premium para personas, familias y empresas en Costa Rica.",
      cta1: "Cotiza ahora — gratis",
      cta2: "WhatsApp directo",
      badge: "Más de 500 familias protegidas",
    },
    services: {
      eyebrow: "Nuestros servicios",
      headline: "Cobertura para cada\naspecto de tu vida",
      personal: {
        tag: "Personal",
        items: [
          { icon: "Car", name: "Auto", desc: "Protección total para tu vehículo con cobertura amplia y asistencia 24/7.", coverage: ["Colisión y choque", "Robo total y parcial", "Daños por fenómenos naturales", "Responsabilidad civil", "Asistencia en ruta 24/7", "Gastos médicos para ocupantes"] },
          { icon: "Heart", name: "Vida", desc: "Asegura el futuro de quienes más quieres con planes a tu medida.", coverage: ["Muerte por cualquier causa", "Invalidez total y permanente", "Enfermedades graves (20+ condiciones)", "Beneficio de muerte anticipada", "Doble indemnización por accidente", "Asistencia funeraria incluida"] },
          { icon: "Shield", name: "Salud", desc: "Cobertura médica premium sin límites para ti y tu familia.", coverage: ["Hospitalización sin sublímites", "Cirugías y anestesia", "Medicamentos recetados", "Consultas con especialistas", "Maternidad y atención neonatal", "Emergencias médicas internacionales"] },
          { icon: "Home", name: "Hogar", desc: "Tu propiedad protegida contra todo riesgo, incluyendo desastres naturales.", coverage: ["Incendio y explosión", "Robo y hurto con fuerza", "Daños por desastres naturales", "Responsabilidad civil familiar", "Hotel temporal mientras reparas", "Rotura de cristales y espejos"] },
          { icon: "Plane", name: "Viaje", desc: "Viaja tranquilo con cobertura internacional y asistencia en el exterior.", coverage: ["Asistencia médica en el exterior", "Cancelación o interrupción de viaje", "Pérdida y demora de equipaje", "Retraso de vuelo (+4 horas)", "Muerte accidental en viaje", "Central de emergencias 24/7"] },
          { icon: "PawPrint", name: "Mascotas", desc: "Cuida la salud de tus mascotas con planes veterinarios accesibles.", coverage: ["Consultas veterinarias ilimitadas", "Cirugías y hospitalizaciones", "Vacunas y desparasitaciones", "Accidentes y enfermedades cubiertas", "Urgencias fuera de horario", "Eutanasia asistida digna"] },
        ],
      },
      business: {
        tag: "Empresarial",
        items: [
          { icon: "Building2", name: "PYMES", desc: "Protección integral para tu negocio, activos y operaciones comerciales.", coverage: ["Incendio y daños materiales", "Robo, vandalismo y sabotaje", "Responsabilidad civil comercial", "Interrupción del negocio", "Equipos y maquinaria", "Responsabilidad patronal"] },
          { icon: "Truck", name: "Flotillas", desc: "Gestión eficiente de seguros para toda tu flota vehicular.", coverage: ["Colisión, volcadura y choque", "Robo total de unidades", "Daños por fenómenos naturales", "Responsabilidad civil a terceros", "Asistencia mecánica 24/7", "Vehículo sustituto incluido"] },
          { icon: "HardHat", name: "Riesgos Laborales", desc: "Cumple la ley y protege a tu equipo con pólizas de accidentes de trabajo.", coverage: ["Accidentes en jornada laboral", "Enfermedades profesionales", "Gastos médicos y farmacéuticos", "Incapacidad temporal remunerada", "Incapacidad permanente", "Muerte por accidente laboral"] },
          { icon: "Scale", name: "Responsabilidad Civil", desc: "Cobertura frente a reclamaciones de terceros por daños o perjuicios.", coverage: ["Daños materiales a terceros", "Lesiones corporales a terceros", "Defensa jurídica incluida", "RC patronal", "Contaminación accidental", "RC de productos y servicios"] },
          { icon: "Lock", name: "Cybersecurity", desc: "Protege tus datos y operaciones digitales ante ataques informáticos.", coverage: ["Filtración y robo de datos", "Ataques de ransomware", "Pérdida de ingresos por ciberataque", "Defensa legal y regulatoria", "Notificación a clientes afectados", "Restauración de sistemas"] },
          { icon: "Monitor", name: "Equipo Electrónico", desc: "Resguardo para la tecnología y maquinaria que hace funcionar tu empresa.", coverage: ["Robo con violencia o fractura", "Daños eléctricos y cortocircuito", "Rotura accidental", "Portátiles, servidores y redes", "Costos de reinstalación y datos", "Equipos en tránsito"] },
        ],
      },
      viewCoverage: "Ver cobertura →",
    },
    whyUs: {
      eyebrow: "La diferencia NovaSeguros",
      headline: "No vendemos pólizas.\nVendemos tranquilidad.",
      comparison: {
        othersLabel: "Los demás",
        novaLabel: "NovaSeguros",
        others: ["Lentos", "Procesos pesados", "Atención genérica", "Sin seguimiento"],
        nova: ["Rápido", "100% digital", "Atención VIP", "Seguimiento total"],
      },
      pillars: [
        { icon: "Zap",        title: "Respuesta en 15 minutos", desc: "Tu cotización lista en menos tiempo del que tarda un café.",               metric: "15 min" },
        { icon: "UserCheck",  title: "Asesor personal dedicado", desc: "Un experto que te conoce, conoce tu vida y tus riesgos.",               metric: "1:1" },
        { icon: "Star",       title: "Atención VIP siempre",    desc: "WhatsApp prioritario, sin filas, sin bots, sin esperas.",              metric: "24/7" },
        { icon: "RefreshCw",  title: "Revisión anual incluida", desc: "Ajustamos tu cobertura cada año sin que tengas que pedir.",            metric: "100%" },
        { icon: "Users",      title: "Red de aliados premium",  desc: "Acceso a clínicas, talleres y servicios de primer nivel.",            metric: "50+" },
        { icon: "TrendingUp", title: "Tecnología inteligente",  desc: "Portal digital para ver tus pólizas, pagos y reclamos.",              metric: "App" },
      ],
    },
    howItWorks: {
      eyebrow: "Así de fácil",
      headline: "Protegerte toma\nsolo 3 pasos",
      steps: [
        { num: "01", title: "Cuéntanos qué necesitas", desc: "Completa nuestro diagnóstico gratuito en menos de 2 minutos." },
        { num: "02", title: "Recibe tu propuesta", desc: "Un asesor te contacta con opciones a tu medida en 15 minutos." },
        { num: "03", title: "Firma y queda protegido", desc: "Contratación 100% digital. Sin papeleo, sin complicaciones." },
      ],
      stats: [
        { value: "15 min", label: "Cotización lista" },
        { value: "500+",   label: "Clientes activos" },
        { value: "98%",    label: "Satisfacción"     },
        { value: "24/7",   label: "Soporte VIP"      },
      ],
    },
    membership: {
      eyebrow: "Membresía Elite",
      headline: "Seguros convertidos\nen estatus",
      sub: "La membresía que te da más que protección — te da prioridad, acceso y tranquilidad absoluta.",
      benefits: [
        "Asesor personal exclusivo",
        "Revisión anual de todas tus coberturas",
        "Gestión completa de reclamos",
        "Cotizaciones en menos de 15 minutos",
        "WhatsApp VIP con respuesta inmediata",
        "Alertas automáticas de renovación",
        "Beneficios con aliados premium",
        "Prioridad de atención 24/7",
      ],
      cta: "Unirme a Elite",
      badge: "Solo 50 membresías disponibles",
    },
    testimonials: {
      eyebrow: "Lo que dicen nuestros clientes",
      headline: "La confianza\nhabla por sí sola",
      items: [
        {
          quote: "En menos de 20 minutos tenía mi cotización de auto lista. Nunca había tenido un seguro tan fácil de contratar.",
          name: "Andrea Jiménez",
          role: "Empresaria, San José",
          initials: "AJ",
        },
        {
          quote: "Mi asesor me ayudó a reducir lo que pagaba un 30% mejorando mi cobertura. Eso no lo hace nadie más.",
          name: "Carlos Mora",
          role: "Arquitecto, Escazú",
          initials: "CM",
        },
        {
          quote: "Cuando tuve el accidente, NovaSeguros me guió en todo. Sin estrés, con rapidez y total transparencia.",
          name: "Sofía Vargas",
          role: "Médica, Heredia",
          initials: "SV",
        },
        {
          quote: "Cubrimos toda nuestra empresa — flotilla, empleados y local — con un solo asesor. Excelente servicio.",
          name: "Rodrigo Blanco",
          role: "CEO, Constructora RB",
          initials: "RB",
        },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      headline: "Todo lo que\nquieres saber",
      items: [
        {
          q: "¿Trabajan con todas las aseguradoras de Costa Rica?",
          a: "Sí. Somos corredores independientes con acceso a todas las compañías aseguradoras del mercado costarricense, lo que nos permite ofrecerte la mejor opción para tu perfil.",
        },
        {
          q: "¿Cuánto cuesta el diagnóstico de protección?",
          a: "Es completamente gratuito y sin compromiso. Revisamos tus seguros actuales, identificamos riesgos ocultos y te presentamos un plan personalizado.",
        },
        {
          q: "¿Puedo contratar mis seguros de forma 100% digital?",
          a: "Absolutamente. Todo el proceso — cotización, revisión, firma y pago — se realiza en línea o por WhatsApp. Sin necesidad de visitas físicas.",
        },
        {
          q: "¿Qué pasa si necesito hacer un reclamo?",
          a: "Nosotros gestionamos el reclamo por ti. Tu asesor personal te acompaña en todo el proceso con la aseguradora hasta que quede resuelto.",
        },
        {
          q: "¿La membresía Elite tiene un costo adicional?",
          a: "La membresía Elite tiene un costo mensual muy accesible que incluye todos los beneficios VIP. En la mayoría de los casos, el ahorro en tus pólizas lo compensa con creces.",
        },
      ],
      moreQuestions: "¿Tienes más preguntas?",
      whatsappCta: "Escríbenos por WhatsApp →",
    },
    quote: {
      eyebrow: "Diagnóstico gratuito",
      headline: "¿Listo para estar\nbien protegido?",
      sub: "Completa este formulario y un asesor te contacta en 15 minutos.",
      fields: {
        name: "Tu nombre completo",
        phone: "Teléfono / WhatsApp",
        email: "Correo electrónico",
        type: "¿Qué necesitas asegurar?",
        typeOptions: ["Auto", "Vida", "Salud", "Hogar", "Viaje", "Mascotas", "Mi empresa", "Otro"],
        message: "Cuéntanos más (opcional)",
        submit: "Quiero mi diagnóstico gratis",
        privacy: "Tus datos son 100% privados. Nunca los compartimos.",
        consentLabel: "He leído y acepto el tratamiento de mis datos conforme a la ",
        consentLabelLink: "Política de Privacidad",
        consentRequired: "Debes aceptar la política de privacidad para continuar.",
        privacyNotice: "Sus datos serán utilizados exclusivamente para atender su solicitud de cotización. Responsable: NovaSeguros. Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición escribiendo a privacidad@novaseguros.cr.",
      },
      features: [
        "Sin compromisos, 100% gratuito",
        "Respuesta en menos de 15 minutos",
        "Asesor personal asignado",
        "Proceso 100% digital",
      ],
    },
    footer: {
      tagline: "Protegemos lo que más valoras.",
      services: "Servicios",
      serviceList: ["Seguro de Auto", "Seguro de Vida", "Seguro de Salud", "Seguro de Hogar", "Seguros Empresariales", "Membresía Elite"],
      company: "Empresa",
      companyList: ["Nosotros", "Blog", "Alianzas", "Contacto"],
      legal: "Legal",
      legalList: ["Política de Privacidad", "Términos de Uso"],
      rights: "© 2026 NovaSeguros. Todos los derechos reservados.",
      regulated: "Corredor de Seguros registrado ante la SUGESE, Costa Rica.",
    },
  },
  en: {
    nav: {
      services: "Services",
      whyUs: "Why us",
      howItWorks: "How it works",
      membership: "Elite Membership",
      faq: "FAQ",
      contact: "Get a Quote",
      lang: "ES",
      openChat: "Open chat",
      closeChat: "Close chat",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Premium Insurance · Costa Rica",
      headline: "We protect what\nyou value most.",
      sub: "Expert advisory, VIP service and premium coverage for individuals, families and businesses in Costa Rica.",
      cta1: "Get a free quote",
      cta2: "WhatsApp us now",
      badge: "500+ families protected",
    },
    services: {
      eyebrow: "Our services",
      headline: "Coverage for every\naspect of your life",
      personal: {
        tag: "Personal",
        items: [
          { icon: "Car", name: "Auto", desc: "Comprehensive vehicle protection with broad coverage and 24/7 assistance.", coverage: ["Collision & crash", "Total & partial theft", "Natural disaster damage", "Third-party liability", "24/7 roadside assistance", "Medical expenses for passengers"] },
          { icon: "Heart", name: "Life", desc: "Secure the future of those you love with plans tailored to you.", coverage: ["Death from any cause", "Total & permanent disability", "Critical illness (20+ conditions)", "Early death benefit", "Double indemnity for accidents", "Funeral assistance included"] },
          { icon: "Shield", name: "Health", desc: "Premium medical coverage with no limits for you and your family.", coverage: ["Unlimited hospitalization", "Surgery & anesthesia", "Prescription drugs", "Specialist consultations", "Maternity & neonatal care", "International medical emergencies"] },
          { icon: "Home", name: "Home", desc: "Your property protected against all risks, including natural disasters.", coverage: ["Fire & explosion", "Forced-entry theft", "Natural disaster damage", "Family liability", "Temporary hotel while repairs", "Glass & mirror breakage"] },
          { icon: "Plane", name: "Travel", desc: "Travel worry-free with international coverage and overseas assistance.", coverage: ["Medical assistance abroad", "Trip cancellation or interruption", "Lost & delayed baggage", "Flight delay (+4 hours)", "Accidental death during travel", "24/7 emergency hotline"] },
          { icon: "PawPrint", name: "Pets", desc: "Care for your pets' health with affordable veterinary plans.", coverage: ["Unlimited vet consultations", "Surgery & hospitalization", "Vaccines & deworming", "Accidents & illness coverage", "After-hours emergency care", "Assisted euthanasia"] },
        ],
      },
      business: {
        tag: "Business",
        items: [
          { icon: "Building2", name: "SMEs", desc: "Comprehensive protection for your business, assets and operations.", coverage: ["Fire & material damage", "Theft, vandalism & sabotage", "Commercial liability", "Business interruption", "Equipment & machinery", "Employer liability"] },
          { icon: "Truck", name: "Fleets", desc: "Efficient insurance management for your entire vehicle fleet.", coverage: ["Collision, rollover & crash", "Total vehicle theft", "Natural disaster damage", "Third-party liability", "24/7 mechanical assistance", "Replacement vehicle included"] },
          { icon: "HardHat", name: "Workers' Comp", desc: "Comply with the law and protect your team with accident policies.", coverage: ["On-the-job accidents", "Occupational diseases", "Medical & pharmaceutical costs", "Temporary paid disability", "Permanent disability", "Accidental death at work"] },
          { icon: "Scale", name: "Civil Liability", desc: "Coverage against third-party claims for damages or losses.", coverage: ["Third-party property damage", "Bodily injury to third parties", "Legal defense included", "Employer liability", "Accidental pollution", "Product & service liability"] },
          { icon: "Lock", name: "Cybersecurity", desc: "Protect your data and digital operations against cyber attacks.", coverage: ["Data breach & theft", "Ransomware attacks", "Lost revenue from cyberattack", "Legal & regulatory defense", "Client notification costs", "System restoration"] },
          { icon: "Monitor", name: "Electronic Equipment", desc: "Safeguard the technology that keeps your company running.", coverage: ["Violent or forced-entry theft", "Electrical damage & short-circuit", "Accidental breakage", "Laptops, servers & networks", "Reinstallation & data costs", "Equipment in transit"] },
        ],
      },
      viewCoverage: "View coverage →",
    },
    whyUs: {
      eyebrow: "The NovaSeguros difference",
      headline: "We don't sell policies.\nWe sell peace of mind.",
      comparison: {
        othersLabel: "The others",
        novaLabel: "NovaSeguros",
        others: ["Slow", "Heavy processes", "Generic service", "No follow-up"],
        nova: ["Fast", "100% digital", "VIP service", "Full follow-up"],
      },
      pillars: [
        { icon: "Zap",        title: "Quote in 15 minutes",         desc: "Your quote ready faster than it takes to finish a coffee.",         metric: "15 min" },
        { icon: "UserCheck",  title: "Dedicated personal advisor",  desc: "An expert who knows you, your life and your risks.",                metric: "1:1"    },
        { icon: "Star",       title: "VIP service always",          desc: "Priority WhatsApp, no queues, no bots, no waiting.",               metric: "24/7"   },
        { icon: "RefreshCw",  title: "Annual review included",      desc: "We adjust your coverage every year without you having to ask.",    metric: "100%"   },
        { icon: "Users",      title: "Premium partner network",     desc: "Access to top-tier clinics, workshops and services.",              metric: "50+"    },
        { icon: "TrendingUp", title: "Smart technology",            desc: "Digital portal to view your policies, payments and claims.",       metric: "App"    },
      ],
    },
    howItWorks: {
      eyebrow: "That simple",
      headline: "Getting protected takes\nonly 3 steps",
      steps: [
        { num: "01", title: "Tell us what you need", desc: "Complete our free diagnostic in less than 2 minutes." },
        { num: "02", title: "Receive your proposal", desc: "An advisor contacts you with tailored options in 15 minutes." },
        { num: "03", title: "Sign and stay protected", desc: "100% digital process. No paperwork, no hassle." },
      ],
      stats: [
        { value: "15 min", label: "Quote ready"    },
        { value: "500+",   label: "Active clients"  },
        { value: "98%",    label: "Satisfaction"    },
        { value: "24/7",   label: "VIP support"     },
      ],
    },
    membership: {
      eyebrow: "Elite Membership",
      headline: "Insurance elevated\nto status",
      sub: "The membership that gives you more than protection — it gives you priority, access and absolute peace of mind.",
      benefits: [
        "Exclusive personal advisor",
        "Annual review of all your coverages",
        "Full claims management",
        "Quotes in under 15 minutes",
        "VIP WhatsApp with immediate response",
        "Automatic renewal alerts",
        "Premium partner benefits",
        "24/7 priority service",
      ],
      cta: "Join Elite",
      badge: "Only 50 memberships available",
    },
    testimonials: {
      eyebrow: "What our clients say",
      headline: "Trust speaks\nfor itself",
      items: [
        {
          quote: "In less than 20 minutes I had my auto quote ready. I've never had insurance this easy to get.",
          name: "Andrea Jiménez",
          role: "Businesswoman, San José",
          initials: "AJ",
        },
        {
          quote: "My advisor helped me cut what I was paying by 30% while improving my coverage. Nobody else does that.",
          name: "Carlos Mora",
          role: "Architect, Escazú",
          initials: "CM",
        },
        {
          quote: "When I had the accident, NovaSeguros guided me through everything. Stress-free, fast and transparent.",
          name: "Sofía Vargas",
          role: "Doctor, Heredia",
          initials: "SV",
        },
        {
          quote: "We covered our entire company — fleet, employees and premises — with one advisor. Excellent service.",
          name: "Rodrigo Blanco",
          role: "CEO, Constructora RB",
          initials: "RB",
        },
      ],
    },
    faq: {
      eyebrow: "Frequently asked questions",
      headline: "Everything you\nwant to know",
      items: [
        {
          q: "Do you work with all insurance companies in Costa Rica?",
          a: "Yes. We are independent brokers with access to all insurance companies in the Costa Rican market, allowing us to offer you the best option for your profile.",
        },
        {
          q: "How much does the protection diagnostic cost?",
          a: "It's completely free and no-commitment. We review your current policies, identify hidden risks, and present a personalized plan.",
        },
        {
          q: "Can I purchase insurance 100% digitally?",
          a: "Absolutely. The entire process — quote, review, signature and payment — happens online or via WhatsApp. No physical visits required.",
        },
        {
          q: "What happens if I need to file a claim?",
          a: "We manage the claim for you. Your personal advisor guides you through the entire process with the insurer until it's fully resolved.",
        },
        {
          q: "Does the Elite membership have an additional cost?",
          a: "The Elite membership has a very accessible monthly fee that includes all VIP benefits. In most cases, the savings on your policies more than compensate for it.",
        },
      ],
      moreQuestions: "Still have questions?",
      whatsappCta: "Chat with us on WhatsApp →",
    },
    quote: {
      eyebrow: "Free diagnostic",
      headline: "Ready to be\nproperly protected?",
      sub: "Fill out this form and an advisor will contact you within 15 minutes.",
      fields: {
        name: "Your full name",
        phone: "Phone / WhatsApp",
        email: "Email address",
        type: "What do you need to insure?",
        typeOptions: ["Auto", "Life", "Health", "Home", "Travel", "Pets", "My business", "Other"],
        message: "Tell us more (optional)",
        submit: "Get my free diagnostic",
        privacy: "Your data is 100% private. We never share it.",
        consentLabel: "I have read and accept the processing of my data in accordance with the ",
        consentLabelLink: "Privacy Policy",
        consentRequired: "You must accept the privacy policy to continue.",
        privacyNotice: "Your data will be used exclusively to attend your quote request. Controller: NovaSeguros. You may exercise your access, rectification, cancellation and objection rights by writing to privacidad@novaseguros.cr.",
      },
      features: [
        "No commitment, 100% free",
        "Response in under 15 minutes",
        "Dedicated personal advisor",
        "100% digital process",
      ],
    },
    footer: {
      tagline: "We protect what you value most.",
      services: "Services",
      serviceList: ["Auto Insurance", "Life Insurance", "Health Insurance", "Home Insurance", "Business Insurance", "Elite Membership"],
      company: "Company",
      companyList: ["About us", "Blog", "Partners", "Contact"],
      legal: "Legal",
      legalList: ["Privacy Policy", "Terms of Use"],
      rights: "© 2026 NovaSeguros. All rights reserved.",
      regulated: "Insurance broker registered with SUGESE, Costa Rica.",
    },
  },
} as const;

type Translations = typeof translations.es;

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const toggle = () => setLang((l) => (l === "es" ? "en" : "es"));
  const t = translations[lang] as Translations;
  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
