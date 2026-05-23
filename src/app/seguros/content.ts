import type { Metadata } from "next";

export interface InsurancePage {
  slug: string;
  title: string;
  description: string;
  headline: string;
  sub: string;
  coverages: string[];
  price: string;
  schemaType: string;
}

export const INSURANCE_PAGES: InsurancePage[] = [
  {
    slug: "auto",
    title: "Seguro de Auto en Costa Rica — NovaSeguros",
    description: "Seguro de auto con cobertura amplia, asistencia en ruta 24/7 y cotización en 15 minutos. El mejor precio para tu vehículo en Costa Rica.",
    headline: "Seguro de Auto Premium",
    sub: "Protección total para tu vehículo con cobertura amplia, asistencia 24/7 y el respaldo de las mejores aseguradoras de Costa Rica.",
    coverages: ["Colisión y choque", "Robo total y parcial", "Daños por fenómenos naturales", "Responsabilidad civil", "Asistencia en ruta 24/7", "Gastos médicos para ocupantes"],
    price: "Desde ₡22,000/mes",
    schemaType: "AutoInsurance",
  },
  {
    slug: "vida",
    title: "Seguro de Vida en Costa Rica — NovaSeguros",
    description: "Seguro de vida con cobertura de muerte, invalidez y enfermedades graves. Protege a tu familia con los mejores planes en Costa Rica.",
    headline: "Seguro de Vida y Familia",
    sub: "Asegura el futuro de quienes más quieres con planes personalizados que se adaptan a tu presupuesto y estilo de vida.",
    coverages: ["Muerte por cualquier causa", "Invalidez total y permanente", "Enfermedades graves (20+ condiciones)", "Beneficio anticipado por enfermedad terminal", "Doble indemnización por accidente", "Asistencia funeraria incluida"],
    price: "Desde ₡8,500/mes",
    schemaType: "LifeInsurance",
  },
  {
    slug: "salud",
    title: "Seguro de Salud en Costa Rica — NovaSeguros",
    description: "Seguro médico premium con hospitalización, cirugías, especialistas y emergencias internacionales. Cotiza en 15 minutos.",
    headline: "Seguro de Salud Premium",
    sub: "Cobertura médica sin límites para ti y tu familia: hospitalización, cirugías, especialistas y emergencias internacionales incluidas.",
    coverages: ["Hospitalización sin sublímites", "Cirugías y anestesia", "Medicamentos recetados", "Consultas con especialistas", "Maternidad y atención neonatal", "Emergencias médicas internacionales"],
    price: "Desde ₡45,000/mes",
    schemaType: "HealthInsurance",
  },
  {
    slug: "hogar",
    title: "Seguro de Hogar en Costa Rica — NovaSeguros",
    description: "Seguro de hogar contra incendio, robo, desastres naturales y responsabilidad civil. Protege tu propiedad en Costa Rica.",
    headline: "Seguro de Hogar Integral",
    sub: "Tu propiedad protegida contra todo riesgo: incendio, robo, terremotos y más, con la mejor cobertura del mercado costarricense.",
    coverages: ["Incendio y explosión", "Robo y hurto con fuerza", "Terremotos y erupciones volcánicas", "Responsabilidad civil familiar", "Hotel temporal mientras reparas", "Rotura de cristales y espejos"],
    price: "Desde ₡12,000/mes",
    schemaType: "HomeInsurance",
  },
  {
    slug: "viaje",
    title: "Seguro de Viaje en Costa Rica — NovaSeguros",
    description: "Seguro de viaje con asistencia médica internacional, cancelación, pérdida de equipaje y emergencias 24/7.",
    headline: "Seguro de Viaje Internacional",
    sub: "Viaja tranquilo con cobertura médica internacional, asistencia de emergencias 24/7 y protección contra cancelaciones e imprevistos.",
    coverages: ["Asistencia médica en el exterior", "Cancelación o interrupción de viaje", "Pérdida y demora de equipaje", "Retraso de vuelo (+4 horas)", "Muerte accidental en viaje", "Central de emergencias 24/7"],
    price: "Desde ₡15,000/viaje",
    schemaType: "TravelInsurance",
  },
  {
    slug: "mascotas",
    title: "Seguro para Mascotas en Costa Rica — NovaSeguros",
    description: "Seguro veterinario para perros y gatos con consultas ilimitadas, cirugías y vacunas en Costa Rica.",
    headline: "Seguro para Mascotas",
    sub: "Cuida la salud de tus mascotas con cobertura veterinaria completa: consultas, cirugías, vacunas y urgencias incluidas.",
    coverages: ["Consultas veterinarias ilimitadas", "Cirugías y hospitalizaciones", "Vacunas y desparasitaciones", "Accidentes y enfermedades", "Urgencias fuera de horario", "Eutanasia asistida digna"],
    price: "Desde ₡6,500/mes",
    schemaType: "PetInsurance",
  },
  {
    slug: "empresas",
    title: "Seguros Empresariales en Costa Rica — NovaSeguros",
    description: "Seguros para PYMES, flotillas y responsabilidad civil en Costa Rica. Protege tu empresa con asesoría experta.",
    headline: "Seguros para Empresas y PYMES",
    sub: "Protección integral para tu negocio: activos, empleados, flotillas y responsabilidad civil, con un solo asesor dedicado.",
    coverages: ["Incendio y daños materiales", "Robo, vandalismo y sabotaje", "Responsabilidad civil comercial", "Interrupción del negocio", "Flotilla vehicular completa", "Riesgos laborales y accidentes"],
    price: "Desde ₡80,000/mes",
    schemaType: "BusinessInsurance",
  },
];

export function getInsurancePage(slug: string): InsurancePage | undefined {
  return INSURANCE_PAGES.find(p => p.slug === slug);
}

export function generateMetadata(slug: string): Metadata {
  const page = getInsurancePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://novaseguros.cr/seguros/${slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://novaseguros.cr/seguros/${slug}`,
    },
  };
}
