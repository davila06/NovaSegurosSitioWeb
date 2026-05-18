# Guía de Conexión — NovaSeguros Leads

Cada vez que alguien llena el formulario de cotización **o** interactúa con el chatbot, el sistema hace un `POST` a la URL que configures en `.env.local`. Esta guía explica cómo conectarlo con los CRMs y automatizadores más comunes.

---

## Estructura del payload

Todos los leads se envían con este formato JSON:

```json
{
  "source": "form",           // "form" | "chatbot"
  "name": "Ana García",
  "phone": "8888-8888",
  "email": "ana@ejemplo.com", // puede ser vacío ""
  "type": "Auto",             // tipo de seguro seleccionado
  "message": "Tengo un…",    // solo desde el formulario
  "lang": "es",               // "es" | "en"
  "timestamp": "2026-05-17T14:00:00.000Z",
  "source_app": "novaseguros-web"
}
```

---

## Configuración base

1. Copia `.env.example` a `.env.local` en la raíz del proyecto.
2. Rellena las variables según la plataforma que elijas (instrucciones abajo).
3. Reinicia el servidor de desarrollo: `npm run dev`

```env
# .env.local
LEAD_WEBHOOK_URL=https://...     ← URL que obtienes de cada plataforma
RESEND_API_KEY=re_xxxxx          ← Opcional: para recibir email por lead
LEAD_NOTIFY_EMAIL=ventas@novaseguros.cr
```

---

## 1. Make (Integromat) ⭐ Recomendado para empezar

Make es gratuito hasta 1,000 operaciones/mes y el más visual para no-técnicos.

### Pasos

1. Crea cuenta en [make.com](https://make.com)
2. Haz clic en **Create a new scenario**
3. Agrega el módulo **Webhooks → Custom webhook**
4. Haz clic en **Add** → pon nombre "NovaSeguros Leads" → **Save**
5. Make genera una URL tipo: `https://hook.eu2.make.com/xxxxxxxxxxxxxx`
6. Copia esa URL y pégala en `.env.local`:
   ```
   LEAD_WEBHOOK_URL=https://hook.eu2.make.com/xxxxxxxxxxxxxx
   ```
7. De regreso en Make, agrega el siguiente módulo según dónde quieres guardar el lead:

| Destino | Módulo a agregar |
|---|---|
| Google Sheets | Google Sheets → Add a Row |
| HubSpot CRM | HubSpot CRM → Create a Contact |
| Pipedrive | Pipedrive → Create a Person + Deal |
| WhatsApp (notif.) | WhatsApp Business → Send a Message |
| Email | Email → Send an Email |
| Airtable | Airtable → Create a Record |

8. Mapea los campos: `name`, `phone`, `email`, `type`, `source`, `timestamp`
9. Haz clic en el botón **Run once** y llena el formulario del sitio para probar
10. Si ves el lead en Make → guarda el scenario → actívalo con el toggle

---

## 2. Zapier

Plan gratuito: 100 tareas/mes.

### Pasos

1. Crea cuenta en [zapier.com](https://zapier.com)
2. Haz clic en **+ Create Zap**
3. **Trigger**: busca "Webhooks by Zapier" → selecciona **Catch Hook**
4. Copia la URL generada, tipo: `https://hooks.zapier.com/hooks/catch/xxxxxxx/yyyyyyy/`
5. Pégala en `.env.local`:
   ```
   LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxxxx/yyyyyyy/
   ```
6. Haz clic en **Test trigger** (llena el formulario del sitio para que Zapier reciba un ejemplo)
7. **Action**: elige la app donde quieres el lead (HubSpot, Pipedrive, Gmail, Google Sheets, etc.)
8. Mapea los campos de Zapier con los del payload
9. Activa el Zap

---

## 3. n8n (self-hosted o cloud)

Gratuito self-hosted. Cloud desde $24/mes.

### Pasos — n8n Cloud

1. Crea cuenta en [n8n.io](https://n8n.io)
2. Crea un **New workflow**
3. Agrega nodo **Webhook**
   - HTTP Method: `POST`
   - Path: `novaseguros-leads` (o cualquier nombre)
4. Activa el nodo → copia la URL de producción, tipo:
   `https://tu-instancia.n8n.cloud/webhook/novaseguros-leads`
5. Pégala en `.env.local`:
   ```
   LEAD_WEBHOOK_URL=https://tu-instancia.n8n.cloud/webhook/novaseguros-leads
   ```
6. Agrega los nodos siguientes según destino (HubSpot, Pipedrive, Postgres, etc.)
7. Accede a los datos del lead con: `{{ $json.name }}`, `{{ $json.phone }}`, etc.
8. Activa el workflow con el toggle

### Pasos — n8n Self-hosted (Docker)

```bash
docker run -it --rm \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  n8nio/n8n
```
Abre `http://localhost:5678` y sigue los mismos pasos de arriba.

---

## 4. HubSpot CRM (directo, sin intermediario)

HubSpot tiene su propio endpoint de formularios. No requiere Make/Zapier.

### Pasos

1. Inicia sesión en [app.hubspot.com](https://app.hubspot.com)
2. Ve a **Marketing → Forms → Create form** (o usa uno existente)
3. Obtén tu **Portal ID**: Settings → Account Setup → Account Information
4. En el formulario, copia el **Form GUID** (aparece en la URL al editar)
5. Construye la URL:
   ```
   https://api.hsforms.com/submissions/v3/integration/submit/<PORTAL_ID>/<FORM_GUID>
   ```
6. Pégala en `.env.local`:
   ```
   LEAD_WEBHOOK_URL=https://api.hsforms.com/submissions/v3/integration/submit/12345678/abc-def-123
   ```

> ⚠️ **Nota**: HubSpot usa un formato de payload diferente. Para usarlo directamente necesitas modificar el archivo `src/app/api/leads/route.ts` para transformar el payload al formato HubSpot. Abajo está el código.

**Adaptador para HubSpot** — agrega esto en `route.ts` antes del `fetch` al webhook:

```typescript
// Transforma el payload al formato HubSpot
const hubspotPayload = {
  fields: [
    { name: "firstname",  value: body.name },
    { name: "phone",      value: body.phone },
    { name: "email",      value: body.email ?? "" },
    { name: "message",    value: `[${body.type ?? "General"}] ${body.message ?? ""} (${body.source})` },
  ],
  context: {
    pageUri: "https://novaseguros.cr",
    pageName: "NovaSeguros Web",
  },
};
```

Luego cambia el `body: JSON.stringify({ ...body, ... })` por `body: JSON.stringify(hubspotPayload)`.

### Alternativa recomendada: HubSpot + Make

En lugar de integración directa, usa **Make → módulo HubSpot CRM** y recibe el webhook de NovaSeguros ahí. Más simple y sin modificar código.

---

## 5. Pipedrive (directo)

1. Ve a [pipedrive.com](https://pipedrive.com) → Settings → Personal preferences → API
2. Copia tu **API Token**
3. En Make/n8n/Zapier usa el módulo Pipedrive
   - O usa la REST API directamente: `https://api.pipedrive.com/v1/persons?api_token=TU_TOKEN`
4. Para integración directa similar a HubSpot, el payload correcto es:
   ```json
   {
     "name": "Ana García",
     "phone": [{ "value": "8888-8888", "primary": true }],
     "email": [{ "value": "ana@ejemplo.com", "primary": true }]
   }
   ```
5. **Recomendación**: usa Make con el módulo Pipedrive para evitar modificar código.

---

## 6. Salesforce

Para Salesforce se recomienda usar **Make** o **n8n** como intermediario porque la autenticación OAuth2 es compleja.

1. En Make: agrega módulo **Salesforce → Create a Record** → tipo "Lead"
2. Mapea:
   - `FirstName / LastName` ← divide `name`
   - `Phone` ← `phone`
   - `Email` ← `email`
   - `Description` ← `type` + `message`
   - `LeadSource` ← `"Web"`

---

## 7. Notificación por Email (Resend) — Opcional

Puedes recibir un correo cada vez que llegue un lead, **además** del webhook.

### Pasos

1. Crea cuenta en [resend.com](https://resend.com) (gratuito hasta 3,000 emails/mes)
2. Ve a **API Keys → Create API Key** → nombre "NovaSeguros"
3. Copia la key (empieza con `re_`)
4. En `.env.local`:
   ```
   RESEND_API_KEY=re_TuKeyAqui
   LEAD_NOTIFY_EMAIL=ventas@novaseguros.cr
   ```
5. Opcional: verifica tu dominio en Resend para que el `From` diga `leads@novaseguros.cr`
   - Ve a **Domains → Add Domain** → agrega los registros DNS que indica Resend

El email llegará con: nombre, teléfono, email, tipo de seguro, mensaje, fuente (form/chatbot) y fecha/hora en hora de Costa Rica.

---

## 8. Google Sheets (vía Make — el más simple)

Ideal para empezar sin CRM.

1. En Make, crea scenario: **Webhook → Google Sheets (Add a Row)**
2. Conecta tu cuenta de Google
3. Selecciona tu hoja de cálculo y pestaña
4. Mapea las columnas:

| Columna Google Sheet | Campo del webhook |
|---|---|
| Fecha | `timestamp` |
| Nombre | `name` |
| Teléfono | `phone` |
| Email | `email` |
| Tipo de seguro | `type` |
| Mensaje | `message` |
| Fuente | `source` |
| Idioma | `lang` |

5. Activa el scenario

---

## 9. WhatsApp Business — Notificación al asesor

Para que el asesor reciba un WhatsApp por cada lead nuevo.

### Opción A: WATI / Twilio (recomendado)

1. Crea cuenta en [wati.io](https://wati.io) o [twilio.com](https://twilio.com)
2. En Make: agrega módulo **HTTP → Make a Request**
3. Configura la llamada al API de WATI/Twilio con el mensaje:
   ```
   🔔 Nuevo lead NovaSeguros
   Nombre: {{name}}
   Tel: {{phone}}
   Seguro: {{type}}
   Fuente: {{source}}
   ```

### Opción B: WhatsApp directo (sin API)

El chatbot ya tiene un botón "Abrir WhatsApp" configurado. Para cambiar el número:

1. Abre `src/components/ChatBot.tsx`
2. Busca: `https://wa.me/50688888888`
3. Reemplaza `50688888888` con el número real del asesor (código de país sin `+`)
   - Costa Rica: `506` + número sin guiones
   - Ejemplo: `50688001234`

---

## Prueba de integración

Después de configurar cualquier plataforma:

1. Asegúrate de que el servidor esté corriendo: `npm run dev`
2. Ve a `http://localhost:3000`
3. Llena el formulario de cotización con datos de prueba
4. Verifica que el lead apareció en tu CRM/hoja/email
5. Abre el chatbot y completa el flujo de cotización
6. Verifica que ese lead también llegó (con `"source": "chatbot"`)

### Prueba manual con curl/PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/leads" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"source":"test","name":"Test Lead","phone":"8888-0000","email":"test@test.com","type":"Auto","message":"Prueba manual"}'
```

Respuesta esperada: `{ "ok": true }`

---

## Resumen de variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `LEAD_WEBHOOK_URL` | URL del CRM / Make / Zapier / n8n | Sí (para conectar CRM) |
| `RESEND_API_KEY` | API key de Resend para emails | No |
| `LEAD_NOTIFY_EMAIL` | Email del asesor que recibe los leads | Solo si usas Resend |

---

## ¿Cuál plataforma elegir?

| Situación | Recomendación |
|---|---|
| Empezar rápido sin CRM | **Google Sheets via Make** |
| Ya tienen HubSpot | **Make + módulo HubSpot** |
| Ya tienen Pipedrive | **Make + módulo Pipedrive** |
| Quieren automatización avanzada | **n8n self-hosted** |
| Solo quieren emails por ahora | **Resend** (sin webhook) |
| Equipo técnico, control total | **n8n self-hosted + Postgres** |
