import { NextRequest, NextResponse } from "next/server";

/** ARCO rights endpoint — Ley 8968 (Costa Rica)
 *  Allows data subjects to submit Access, Rectification, Cancellation,
 *  Opposition and Portability requests.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_RIGHTS = [
  "acceso",
  "rectificacion",
  "cancelacion",
  "oposicion",
  "portabilidad",
] as const;

type ArcoRight = (typeof VALID_RIGHTS)[number];

// Simple in-memory rate limiter (3 requests / IP / 10 min)
const RL_MAP = new Map<string, { count: number; resetAt: number }>();
const RL_LIMIT  = 3;
const RL_WINDOW = 10 * 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RL_MAP.get(ip);
  if (RL_MAP.size > 200) {
    for (const [k, v] of RL_MAP) { if (now > v.resetAt) RL_MAP.delete(k); }
  }
  if (!entry || now > entry.resetAt) {
    RL_MAP.set(ip, { count: 1, resetAt: now + RL_WINDOW });
    return true;
  }
  if (entry.count >= RL_LIMIT) return false;
  entry.count++;
  return true;
}

function escapeHtml(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
           ?? req.headers.get("x-real-ip")
           ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  let body: { name?: string; email?: string; right?: string; details?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name    = (body.name    ?? "").trim();
  const email   = (body.email   ?? "").trim().toLowerCase();
  const right   = (body.right   ?? "").trim().toLowerCase() as ArcoRight;
  const details = (body.details ?? "").trim().slice(0, 1000);

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "name is required" }, { status: 422 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "valid email is required" }, { status: 422 });
  }
  if (!(VALID_RIGHTS as readonly string[]).includes(right)) {
    return NextResponse.json(
      { ok: false, error: `right must be one of: ${VALID_RIGHTS.join(", ")}` },
      { status: 422 }
    );
  }

  const ticketId  = `ARCO-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // Notify privacy officer via Resend
  const resendKey   = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.PRIVACY_NOTIFY_EMAIL ?? process.env.LEAD_NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nova <leads@novaseguros.cr>",
        to: [notifyEmail],
        subject: `[ARCO] Solicitud de ${right} — ${ticketId}`,
        html: `<h2>Solicitud de derecho ARCO — Ley 8968</h2>
<table>
  <tr><td><b>Ticket:</b></td><td>${escapeHtml(ticketId)}</td></tr>
  <tr><td><b>Derecho solicitado:</b></td><td>${escapeHtml(right)}</td></tr>
  <tr><td><b>Nombre:</b></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><b>Correo:</b></td><td>${escapeHtml(email)}</td></tr>
  <tr><td><b>Detalles:</b></td><td>${escapeHtml(details) || "—"}</td></tr>
  <tr><td><b>Fecha:</b></td><td>${new Date(timestamp).toLocaleString("es-CR", { timeZone: "America/Costa_Rica" })}</td></tr>
  <tr><td><b>IP:</b></td><td>${escapeHtml(ip)}</td></tr>
</table>
<p><em>Plazo legal de respuesta: 10 días hábiles (Ley 8968).</em></p>`,
      }),
      signal: AbortSignal.timeout(8_000),
    }).catch(err => console.error("[arco] email notification failed:", err));
  }

  // Also forward to webhook if configured
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "arco_request",
        ticketId,
        right,
        name,
        email,
        details,
        timestamp,
        ip,
      }),
      signal: AbortSignal.timeout(6_000),
    }).catch(err => console.error("[arco] webhook failed:", err));
  }

  return NextResponse.json({ ok: true, ticketId });
}
