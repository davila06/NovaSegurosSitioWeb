import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

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

/** Splits "Ana García López" → { firstName: "Ana", lastName: "García López" } */
function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? full,
    lastName: parts.slice(1).join(" ") || "-",
  };
}

async function pushToMindFlow(body: LeadPayload): Promise<void> {
  const apiUrl  = process.env.MINDFLOW_API_URL;
  const tenant  = process.env.MINDFLOW_TENANT_ID;
  const token   = process.env.MINDFLOW_API_TOKEN; // optional in dev

  if (!apiUrl || !tenant) return; // not configured — skip silently

  const base = apiUrl.replace(/\/$/, "");
  const source = `novaseguros-${body.source}`; // "novaseguros-form" | "novaseguros-chatbot"
  const { firstName, lastName } = splitName(body.name);

  // ① Create lead (with idempotency key to avoid duplicates on retries)
  const leadKey = randomUUID();
  const [leadRes, contactRes] = await Promise.allSettled([
    fetch(`${base}/api/leads/intake`, {
      method: "POST",
      headers: mindflowHeaders(tenant, token, leadKey),
      body: JSON.stringify({
        phone: body.phone,
        ...(body.email ? { email: body.email } : {}),
        source,
      }),
      signal: AbortSignal.timeout(10_000),
    }),

    // ② Create contact (parallel)
    fetch(`${base}/api/contacts`, {
      method: "POST",
      headers: mindflowHeaders(tenant, token),
      body: JSON.stringify({
        firstName,
        lastName,
        phone: body.phone,
        ...(body.email ? { email: body.email } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    }),
  ]);

  if (leadRes.status === "fulfilled" && !leadRes.value.ok) {
    const text = await leadRes.value.text().catch(() => "");
    console.error(`[mindflow] lead intake returned ${leadRes.value.status}: ${text}`);
  }
  if (contactRes.status === "fulfilled" && !contactRes.value.ok) {
    // 409 Conflict = contact already exists → not an error
    if (contactRes.value.status !== 409) {
      const text = await contactRes.value.text().catch(() => "");
      console.error(`[mindflow] contact create returned ${contactRes.value.status}: ${text}`);
    }
  }
  if (leadRes.status === "rejected")    console.error("[mindflow] lead intake failed:", leadRes.reason);
  if (contactRes.status === "rejected") console.error("[mindflow] contact create failed:", contactRes.reason);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
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
  <tr><td><b>Fecha:</b></td><td>${new Date().toLocaleString("es-CR", { timeZone: "America/Costa_Rica" })}</td></tr>
</table>`,
        }),
        signal: AbortSignal.timeout(8_000),
      });
    })(),

  ]);

  return NextResponse.json({ ok: true });
}
