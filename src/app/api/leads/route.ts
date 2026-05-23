import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

/** Current consent-policy version — bump when Privacy Policy changes */
const CONSENT_VERSION = "2026-05-v1";

/** Prevent XSS in outgoing HTML emails by escaping all 5 special chars */
function escapeHtml(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

interface LeadPayload {
  source: "form" | "chatbot";
  name: string;
  phone: string;
  email?: string;
  type?: string;
  message?: string;
  lang?: string;
  consent?: boolean; // explicit consent — Ley 8968
  _hp?: string; // honeypot — must be empty
  // UTM attribution
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  utm_content?:  string;
  utm_term?:     string;
}

// ─── In-memory rate limiter (5 req / IP / 60 s) ──────────────────────────────
const RL_MAP = new Map<string, { count: number; resetAt: number }>();
const RL_LIMIT  = 5;
const RL_WINDOW = 60_000; // ms

/** Remove stale entries to prevent unbounded Map growth */
function pruneRateLimit(): void {
  const now = Date.now();
  for (const [ip, entry] of RL_MAP) {
    if (now > entry.resetAt) RL_MAP.delete(ip);
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now   = Date.now();
  // Prune stale entries every call (cheap O(n) but Map stays small)
  if (RL_MAP.size > 500) pruneRateLimit();
  const entry = RL_MAP.get(ip);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + RL_WINDOW;
    RL_MAP.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RL_LIMIT - 1, resetAt };
  }
  if (entry.count >= RL_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true, remaining: RL_LIMIT - entry.count, resetAt: entry.resetAt };
}

// ─── MindFlow helpers ─────────────────────────────────────────────────────────

function mindflowHeaders(tenantId: string, token?: string, idempotencyKey?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-Id": tenantId,
    "X-Correlation-Id": randomUUID(),
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function pushToMindFlow(body: LeadPayload): Promise<void> {
  const apiUrl  = process.env.MINDFLOW_API_URL;
  const tenant  = process.env.MINDFLOW_TENANT_ID;
  const token   = process.env.MINDFLOW_API_TOKEN;

  if (!apiUrl || !tenant) return;

  const base   = apiUrl.replace(/\/$/, "");
  const source = `novaseguros-${body.source}`;
  // MindFlow exige solo dígitos en phone (8–15)
  const phoneDigits = body.phone.replace(/\D/g, "");

  // ① Lead intake primero — necesitamos el leadId para el contacto
  const leadKey = randomUUID();
  const leadRes = await fetch(`${base}/api/leads/intake`, {
    method: "POST",
    headers: mindflowHeaders(tenant, token, leadKey),
    body: JSON.stringify({
      phone: phoneDigits,
      ...(body.email ? { email: body.email } : {}),
      ...(body.type  ? { serviceInterest: body.type } : {}),
      source,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch((err) => { console.error("[mindflow] lead intake failed:", err); return null; });

  if (!leadRes) return;
  if (!leadRes.ok) {
    const text = await leadRes.text().catch(() => "");
    console.error(`[mindflow] lead intake returned ${leadRes.status}: ${text}`);
    return;
  }

  // Extraer leadId del body de respuesta (acepta { id } o { leadId })
  let leadId: string | undefined;
  try {
    const json = await leadRes.json() as Record<string, unknown>;
    leadId = (json.id ?? json.leadId) as string | undefined;
  } catch { /* sin body JSON — seguimos sin leadId si el servidor no lo exige */ }

  // ② Crear contacto con fullName, phoneDigits y leadId
  const contactRes = await fetch(`${base}/api/contacts`, {
    method: "POST",
    headers: mindflowHeaders(tenant, token),
    body: JSON.stringify({
      fullName: body.name.trim(),
      phone: phoneDigits,
      ...(body.email   ? { email:  body.email  } : {}),
      ...(leadId       ? { leadId              } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch((err) => { console.error("[mindflow] contact create failed:", err); return null; });

  if (!contactRes) return;
  if (!contactRes.ok && contactRes.status !== 409) {
    const text = await contactRes.text().catch(() => "");
    console.error(`[mindflow] contact create returned ${contactRes.status}: ${text}`);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // CSRF: reject requests from non-site origins (browser cross-site POSTs)
  const origin  = req.headers.get("origin")  ?? "";
  const referer = req.headers.get("referer") ?? "";
  const allowed = process.env.NEXT_PUBLIC_SITE_URL ?? "https://novaseguros.cr";
  const isValidOrigin =
    origin.startsWith(allowed) ||
    referer.startsWith(allowed) ||
    origin === "" || // server-side / curl without Origin
    process.env.NODE_ENV !== "production";
  if (!isValidOrigin) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone } = body;
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { ok: false, error: "name and phone are required" },
      { status: 422 }
    );
  }

  // Ley 8968 — explicit consent is mandatory for data treatment
  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Consent is required" },
      { status: 422 }
    );
  }

  // Consent audit record (Ley 8968 compliance)
  const consentRecord = {
    consentGiven: true,
    consentVersion: CONSENT_VERSION,
    consentTimestamp: new Date().toISOString(),
    consentIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
              ?? req.headers.get("x-real-ip")
              ?? "unknown",
  };

  // Honeypot — bots fill this field; humans leave it empty
  if (body._hp) {
    return NextResponse.json({ ok: true }); // silent fake success
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
           ?? req.headers.get("x-real-ip")
           ?? "unknown";
  const rl = checkRateLimit(ip);
  const rlHeaders = {
    "X-RateLimit-Limit":     String(RL_LIMIT),
    "X-RateLimit-Remaining": String(rl.remaining),
    "X-RateLimit-Reset":     String(Math.ceil(rl.resetAt / 1000)),
  };
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { ...rlHeaders, "Retry-After": "60" } }
    );
  }

  // Run all delivery channels in parallel — none blocks the user response
  await Promise.allSettled([

    // ── MindFlow CRM (lead + contact) ──────────────────────────────────────
    pushToMindFlow(body),

    // ── Generic webhook (Make / Zapier / n8n / HubSpot…) ──────────────────
    (async () => {
      const webhookUrl = process.env.LEAD_WEBHOOK_URL;
      if (!webhookUrl) return;
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          timestamp: new Date().toISOString(),
          source_app: "novaseguros-web",
          ...consentRecord,
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) console.error("[leads] webhook returned", res.status);
    })(),

    // ── Email notification via Resend ──────────────────────────────────────
    (async () => {
      const resendKey    = process.env.RESEND_API_KEY;
      const notifyEmail  = process.env.LEAD_NOTIFY_EMAIL;
      if (!resendKey || !notifyEmail) return;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Nova <leads@novaseguros.cr>",
          to: [notifyEmail],
          subject: `Nuevo lead — ${body.type ?? "General"} (${body.source})`,
          html: `<h2>Nuevo lead NovaSeguros</h2>
<table>
  <tr><td><b>Fuente:</b></td><td>${escapeHtml(body.source)}</td></tr>
  <tr><td><b>Nombre:</b></td><td>${escapeHtml(body.name)}</td></tr>
  <tr><td><b>Teléfono:</b></td><td>${escapeHtml(body.phone)}</td></tr>
  <tr><td><b>Email:</b></td><td>${escapeHtml(body.email) || "—"}</td></tr>
  <tr><td><b>Tipo de seguro:</b></td><td>${escapeHtml(body.type) || "—"}</td></tr>
  <tr><td><b>Mensaje:</b></td><td>${escapeHtml(body.message) || "—"}</td></tr>
  <tr><td><b>Idioma:</b></td><td>${escapeHtml(body.lang) || "es"}</td></tr>
  <tr><td><b>UTM Source:</b></td><td>${escapeHtml(body.utm_source) || "—"}</td></tr>
  <tr><td><b>UTM Medium:</b></td><td>${escapeHtml(body.utm_medium) || "—"}</td></tr>
  <tr><td><b>UTM Campaign:</b></td><td>${escapeHtml(body.utm_campaign) || "—"}</td></tr>
  <tr><td><b>Fecha:</b></td><td>${new Date().toLocaleString("es-CR", { timeZone: "America/Costa_Rica" })}</td></tr>
  <tr><td><b>Consentimiento:</b></td><td>Sí — versión ${escapeHtml(consentRecord.consentVersion)} — IP ${escapeHtml(consentRecord.consentIp)}</td></tr>
</table>`,
        }),
        signal: AbortSignal.timeout(8_000),
      });
    })(),

    // ── WhatsApp advisor notification via Twilio ────────────────────────────────────────────
    (async () => {
      const sid  = process.env.TWILIO_ACCOUNT_SID;
      const auth = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_WA_FROM; // e.g. whatsapp:+14155238886
      const to   = process.env.TWILIO_WA_TO;   // e.g. whatsapp:+50689875225
      if (!sid || !auth || !from || !to) return;

      const text = [
        `📋 *Nuevo lead NovaSeguros*`,
        `Nombre: ${body.name}`,
        `Teléfono: ${body.phone}`,
        `Email: ${body.email || "—"}`,
        `Seguro: ${body.type || "—"}`,
        `Fuente: ${body.source}`,
        `Mensaje: ${body.message || "—"}`,
        ...(body.utm_source ? [`UTM: ${body.utm_source}/${body.utm_medium || "?"}/${body.utm_campaign || "?"}`] : []),
      ].join("\n");

      const params = new URLSearchParams({ From: from, To: to, Body: text });
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${auth}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
          signal: AbortSignal.timeout(8_000),
        }
      ).catch(err => console.error("[twilio] WA notification failed:", err));
    })(),

  ]);

  return NextResponse.json({ ok: true });
}

