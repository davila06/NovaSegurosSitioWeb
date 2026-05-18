# NovaSeguros — Sitio Web Corporativo

Landing page de alta conversión para **NovaSeguros**, correduría de seguros premium en Costa Rica. Construida con Next.js 16, React 19 y Tailwind CSS 4. Integra el CRM **MindFlow AI Sales Engine** para captura y gestión automática de leads.

---

## Tabla de Contenidos

1. [Stack tecnológico](#1-stack-tecnológico)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Configuración inicial](#3-configuración-inicial)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Comandos disponibles](#5-comandos-disponibles)
6. [Componentes](#6-componentes)
7. [Internacionalización (i18n)](#7-internacionalización-i18n)
8. [Integración MindFlow CRM](#8-integración-mindflow-crm)
9. [API Route — `/api/leads`](#9-api-route--apileads)
10. [SEO y Metadatos](#10-seo-y-metadatos)
11. [Animaciones (Reveal)](#11-animaciones-reveal)
12. [Despliegue](#12-despliegue)

---

## 1. Stack tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Estilos | Tailwind CSS | 4 |
| Animaciones | Framer Motion | 12 |
| Iconos | Lucide React | 1.16 |
| Tipografía | Cormorant Garamond + DM Sans | Google Fonts |
| Lenguaje | TypeScript | 5 |
| Linting | ESLint | 9 |

---

## 2. Estructura del proyecto

```
novaseguros/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, metadatos, JSON-LD, fuentes
│   │   ├── page.tsx                # Página principal (composición de secciones)
│   │   ├── globals.css             # Variables CSS, tokens de diseño, utilidades
│   │   ├── opengraph-image.tsx     # OG image dinámica (1200×630 px)
│   │   └── api/
│   │       └── leads/
│   │           └── route.ts        # API Route: captura leads → MindFlow + Webhook + Email
│   ├── components/
│   │   ├── Navbar.tsx              # Navegación con scroll-spy y menú móvil
│   │   ├── Hero.tsx                # Sección hero con quiz de tipo de seguro
│   │   ├── Services.tsx            # Catálogo de seguros (personal + empresarial)
│   │   ├── WhyUs.tsx               # Tabla comparativa + 6 pilares
│   │   ├── HowItWorks.tsx          # 3 pasos + stats
│   │   ├── Membership.tsx          # Membresía Elite
│   │   ├── Testimonials.tsx        # Reseñas de clientes
│   │   ├── FAQ.tsx                 # Preguntas frecuentes con acordeón
│   │   ├── QuoteForm.tsx           # Formulario de cotización (envía lead)
│   │   ├── ChatBot.tsx             # Asistente Nova (flujo conversacional)
│   │   ├── Footer.tsx              # Footer con links y redes sociales
│   │   ├── Reveal.tsx              # HOC de animación al scroll
│   │   └── LangHtmlSync.tsx        # Sincroniza <html lang> con el idioma activo
│   └── lib/
│       └── i18n.tsx                # Context + hook useLang, traducciones ES/EN
├── public/                         # Logos, imágenes estáticas
├── .env.local                      # Variables de entorno (NO versionar)
├── next.config.ts
├── tsconfig.json
├── tailwind.config (inline en globals.css)
└── package.json
```

---

## 3. Configuración inicial

### Requisitos

- Node.js **18+**
- npm **9+**

### Instalación

```bash
# Clonar el repositorio y entrar a la carpeta
cd novaseguros

# Instalar dependencias
npm install --legacy-peer-deps

# Crear archivo de entorno (ver sección 4)
cp .env.example .env.local   # o crearlo manualmente

# Levantar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 4. Variables de entorno

Crea el archivo `.env.local` en la raíz de `novaseguros/`. **Nunca** lo subas al repositorio.

```env
# ─── MindFlow CRM ─────────────────────────────────────────────────────────────
# URL base del backend MindFlow (sin barra final)
MINDFLOW_API_URL=http://localhost:5165

# Slug o UUID del tenant asignado a NovaSeguros
MINDFLOW_TENANT_ID=novaseguros

# Token JWT para autenticación (opcional en desarrollo, obligatorio en producción)
MINDFLOW_API_TOKEN=

# ─── Webhook genérico (Make / Zapier / n8n / HubSpot) ────────────────────────
# Si se define, cada lead se reenvía a esta URL como POST JSON
LEAD_WEBHOOK_URL=

# ─── Notificación por email (Resend) ─────────────────────────────────────────
# API key de Resend para enviar emails de notificación al equipo
RESEND_API_KEY=

# Email donde llegan las notificaciones de nuevos leads
LEAD_NOTIFY_EMAIL=ventas@novaseguros.cr
```

### Tabla de variables

| Variable | Requerida | Descripción |
|---|---|---|
| `MINDFLOW_API_URL` | Sí (para CRM) | URL del backend MindFlow |
| `MINDFLOW_TENANT_ID` | Sí (para CRM) | Identificador del tenant en MindFlow |
| `MINDFLOW_API_TOKEN` | No (dev) / Sí (prod) | Token JWT Bearer |
| `LEAD_WEBHOOK_URL` | No | Webhook externo (Make, Zapier, etc.) |
| `RESEND_API_KEY` | No | Activa notificaciones por email |
| `LEAD_NOTIFY_EMAIL` | No | Destino de las notificaciones |

> Si `MINDFLOW_API_URL` o `MINDFLOW_TENANT_ID` no están definidas, la integración con MindFlow se omite silenciosamente — el lead igual se intenta entregar por webhook y/o email.

---

## 5. Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo con hot reload (http://localhost:3000)
npm run build    # Build de producción optimizado
npm run start    # Sirve el build de producción (requiere build previo)
npm run lint     # Análisis de ESLint
npx tsc --noEmit # Verificación de tipos sin emitir archivos
```

---

## 6. Componentes

### `Navbar`
Barra de navegación fija con:
- **Scroll-spy** via `IntersectionObserver`: resalta el enlace de la sección visible en la franja central del viewport.
- Menú hamburguesa para móvil con `aria-expanded`.
- Botón de cambio de idioma (ES ↔ EN).
- Botón de apertura del ChatBot.

### `Hero`
Sección principal con:
- Quiz interactivo de 3 opciones (Personal / Familiar / Empresa) que emite el evento `nova:quiz-select` para prellenar el `QuoteForm`.
- CTA doble: "Cotiza ahora" (ancla a `#quote`) y "WhatsApp directo".

### `Services`
Grid de tarjetas de seguros con panel de cobertura expandible. Separado en dos tabs: **Personal** y **Empresarial**.

### `WhyUs`
Tabla comparativa (NovaSeguros vs. competencia) + 6 tarjetas de pilares de valor.

### `HowItWorks`
Timeline de 3 pasos + fila de 4 stats (15 min, 500+ clientes, 98% satisfacción, 24/7).

### `Membership`
Sección de membresía Elite con listado de beneficios y CTA.

### `Testimonials`
Carrusel de reseñas de clientes con calificación de estrellas.

### `FAQ`
Acordeón de preguntas frecuentes. Contiene CTA de WhatsApp al final.

### `QuoteForm`
Formulario de cotización con 5 campos: nombre, teléfono, email, tipo de seguro y mensaje. Al enviar:
1. Llama a `POST /api/leads` con `source: "form"`.
2. Muestra estado de éxito sin bloquear la UX si falla la red.
3. Escucha el evento `nova:quiz-select` del Hero para prellenar el tipo de seguro.

### `ChatBot`
Asistente conversacional **Nova** con flujo guiado:

```
Bienvenida
  ├── FAQ → lista de preguntas → respuesta → contactar asesor
  └── Cotizar
        ├── Tipo de seguro
        ├── Nombre
        ├── Teléfono
        ├── Email (opcional)
        └── Confirmación + calificación con estrellas
```

Al completar el flujo llama a `POST /api/leads` con `source: "chatbot"`.

### `Reveal`
Componente HOC que aplica una animación **fade + slide** al entrar al viewport. Se dispara una sola vez.

```tsx
<Reveal direction="up" delay={120} threshold={0.12}>
  <MiComponente />
</Reveal>
```

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `direction` | `"up" \| "down" \| "left" \| "right" \| "none"` | `"up"` | Dirección del slide de entrada |
| `delay` | `number` | `0` | Delay en ms (para efectos escalonados en grids) |
| `threshold` | `number` | `0.12` | Fracción del elemento visible antes de disparar |

### `LangHtmlSync`
Componente cliente sin render visual. Sincroniza el atributo `lang` del `<html>` raíz cuando el usuario cambia el idioma. Necesario para lectores de pantalla y motores de búsqueda.

---

## 7. Internacionalización (i18n)

El sistema de i18n es propio, sin dependencias externas. Vive en `src/lib/i18n.tsx`.

### Uso en componentes

```tsx
import { useLang } from "@/lib/i18n";

export default function MiComponente() {
  const { t, lang, setLang } = useLang();

  return (
    <>
      <h1>{t.hero.headline}</h1>
      <button onClick={() => setLang(lang === "es" ? "en" : "es")}>
        {t.nav.lang}
      </button>
    </>
  );
}
```

### Agregar una clave de traducción

1. Abre `src/lib/i18n.tsx`.
2. Agrega la clave en el objeto `es` con su texto en español.
3. Agrega la misma clave en el objeto `en` con su texto en inglés.
4. TypeScript inferirá el tipo automáticamente.

```tsx
// Ejemplo: agregar t.footer.legal
es: {
  footer: {
    legal: "Todos los derechos reservados",
  }
},
en: {
  footer: {
    legal: "All rights reserved",
  }
}
```

---

## 8. Integración MindFlow CRM

Cada lead capturado (formulario o chatbot) se envía al CRM MindFlow en paralelo con otras notificaciones.

### Flujo completo

```
QuoteForm  ──┐
             ├── POST /api/leads (Next.js Route Handler)
ChatBot    ──┘
                │
                ├── pushToMindFlow()
                │     ├── POST /api/leads/intake    →  crea el lead
                │     │     source: "novaseguros-form" | "novaseguros-chatbot"
                │     │     Idempotency-Key: UUID único (evita duplicados)
                │     │
                │     └── POST /api/contacts        →  crea el contacto
                │           firstName, lastName, phone, email
                │
                ├── Webhook genérico (LEAD_WEBHOOK_URL)
                │     payload completo + timestamp + source_app
                │
                └── Email via Resend (RESEND_API_KEY)
                      to: LEAD_NOTIFY_EMAIL
                      HTML escapado (XSS-safe)
```

### APIs de MindFlow consumidas

| Método | Endpoint | Cabeceras clave | Propósito |
|---|---|---|---|
| `POST` | `/api/leads/intake` | `X-Tenant-Id`, `Idempotency-Key` | Registrar el lead con score automático |
| `POST` | `/api/contacts` | `X-Tenant-Id` | Crear el contacto vinculado al lead |

Ambas peticiones:
- Se hacen en **paralelo** (`Promise.allSettled`).
- Tienen un timeout de **10 segundos** (`AbortSignal.timeout`).
- Los errores se loguean en consola pero **no bloquean** la respuesta al usuario.
- Un `409 Conflict` en `/api/contacts` se ignora (el contacto ya existe, no es un error).

### Dato `source` en MindFlow

| Origen | Valor enviado a MindFlow |
|---|---|
| Formulario de cotización | `novaseguros-form` |
| Chatbot Nova | `novaseguros-chatbot` |

Esto permite filtrar y segmentar leads por canal dentro del CRM.

---

## 9. API Route — `/api/leads`

**Archivo:** `src/app/api/leads/route.ts`

### Request

```http
POST /api/leads
Content-Type: application/json
```

```typescript
{
  source:   "form" | "chatbot",  // requerido
  name:     string,              // requerido
  phone:    string,              // requerido
  email?:   string,
  type?:    string,              // tipo de seguro (Auto, Vida, etc.)
  message?: string,
  lang?:    "es" | "en"
}
```

### Validación

- `name` y `phone` son obligatorios. Si faltan → `422 Unprocessable Entity`.
- JSON malformado → `400 Bad Request`.

### Response

```json
{ "ok": true }
```

### Seguridad — XSS en emails

Todos los campos de usuario pasan por `escapeHtml()` antes de interpolarse en el HTML del correo de notificación. Los 5 caracteres especiales HTML se escapan: `&`, `<`, `>`, `"`, `'`.

---

## 10. SEO y Metadatos

### Open Graph / Twitter Card

Definidos en `src/app/layout.tsx` usando la API de metadatos de Next.js.

| Tag | Valor |
|---|---|
| `og:title` | "NovaSeguros — Protección Premium en Costa Rica" |
| `og:image` | `/opengraph-image` (generada dinámicamente, 1200×630 px) |
| `twitter:card` | `summary_large_image` |

### OG Image dinámica

`src/app/opengraph-image.tsx` usa la API `ImageResponse` de Next.js para generar la imagen en el servidor. Muestra fondo navy con degradado, nombre de la marca en dorado y tagline.

### JSON-LD (Structured Data)

Bloque `<script type="application/ld+json">` incrustado en `layout.tsx` con schema `InsuranceAgency` de Schema.org:
- Nombre, descripción, URL, teléfono, email, logo
- Dirección (San José, Costa Rica)
- Horario de apertura
- `aggregateRating`: 4.9/5 con 500 reseñas

### `<html lang>` dinámico

El componente `LangHtmlSync` actualiza `document.documentElement.lang` a `"es"` o `"en"` según el idioma activo.

---

## 11. Animaciones (Reveal)

Las animaciones de entrada al scroll están implementadas con `IntersectionObserver` (sin dependencia externa) en `src/components/Reveal.tsx`.

Secciones con animaciones activas:
- **Services**: headers de sección + tarjetas individuales (delay escalonado: índice × 60 ms)
- **WhyUs**: pilares con delay escalonado
- **HowItWorks**: steps + stats
- **Testimonials**: tarjetas de reseñas
- **FAQ**: items del acordeón

---

## 12. Despliegue

### Vercel (recomendado)

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Configura las variables de entorno en **Settings → Environment Variables**.
3. El build y despliegue son automáticos en cada push a `main`.

### Docker / Servidor propio

```bash
npm run build
npm run start
# Sirve en el puerto 3000 por defecto
```

### Variables de entorno en producción

Asegúrate de definir en el servidor (o en el panel de Vercel):

```
MINDFLOW_API_URL=https://api.novamind.ai
MINDFLOW_TENANT_ID=novaseguros
MINDFLOW_API_TOKEN=<token-jwt-produccion>
RESEND_API_KEY=<resend-key>
LEAD_NOTIFY_EMAIL=ventas@novaseguros.cr
```

> **Seguridad:** Ninguna variable de entorno sin el prefijo `NEXT_PUBLIC_` se expone al navegador. Las credenciales de MindFlow y Resend solo son accesibles en el servidor.

---

## Checklist de verificación

- [ ] `.env.local` creado con `MINDFLOW_API_URL` y `MINDFLOW_TENANT_ID`
- [ ] `npx tsc --noEmit` sin errores
- [ ] `npm run build` exitoso
- [ ] Lead de prueba recibido en MindFlow (verificar en el CRM)
- [ ] OG image visible al compartir en redes (`/opengraph-image`)
- [ ] Navbar scroll-spy funcional en todas las secciones
- [ ] ChatBot completa el flujo y envía el lead
- [ ] Formulario de cotización envía lead con tipo prellenado desde el Hero
