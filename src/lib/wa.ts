/** Centralised WhatsApp configuration for NovaSeguros */
export const WA_NUMBER = "50689875225";

const BASE = `https://wa.me/${WA_NUMBER}`;

const MESSAGES = {
  es: {
    hero:    "Hola, me interesa obtener información sobre los seguros de NovaSeguros.",
    faq:     "Hola, tengo una pregunta sobre los seguros de NovaSeguros.",
    footer:  "Hola, me interesa obtener información sobre NovaSeguros.",
    chatbot: "Hola, me contacto desde el chat de NovaSeguros y quisiera hablar con un asesor.",
    exit:    "Hola, vi la oferta de NovaSeguros y me interesa cotizar un seguro.",
    float:   "Hola, me interesa cotizar un seguro con NovaSeguros.",
  },
  en: {
    hero:    "Hello, I'm interested in learning more about NovaSeguros insurance.",
    faq:     "Hello, I have a question about NovaSeguros insurance.",
    footer:  "Hello, I'm interested in learning more about NovaSeguros.",
    chatbot: "Hello, I'm reaching out from the NovaSeguros chat and would like to speak with an advisor.",
    exit:    "Hello, I saw the NovaSeguros offer and I'm interested in getting an insurance quote.",
    float:   "Hello, I'd like to get an insurance quote from NovaSeguros.",
  },
} as const;

export type WaSource = keyof typeof MESSAGES.es;

export function waLink(lang: "es" | "en", source: WaSource): string {
  const msg = MESSAGES[lang][source];
  return `${BASE}?text=${encodeURIComponent(msg)}`;
}
