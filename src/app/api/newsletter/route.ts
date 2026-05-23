import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Current consent-policy version — bump when Privacy Policy changes */
const CONSENT_VERSION = "2026-05-v1";

export async function POST(req: NextRequest) {
  let body: { email?: string; lang?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  }

  // Ley 8968 — explicit consent required for marketing communications
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Consent is required" }, { status: 422 });
  }

  const consentIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
                 ?? req.headers.get("x-real-ip")
                 ?? "unknown";

  const consentRecord = {
    consentGiven: true,
    consentVersion: CONSENT_VERSION,
    consentTimestamp: new Date().toISOString(),
    consentIp,
  };

  // ── Resend contacts list ──
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
        signal: AbortSignal.timeout(6_000),
      });
    } catch { /* non-blocking */ }
  }

  // ── Webhook fallback (Make / Zapier / n8n) ──
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter_signup",
          email,
          lang: body.lang ?? "es",
          timestamp: new Date().toISOString(),
          ...consentRecord,
        }),
        signal: AbortSignal.timeout(6_000),
      });
    } catch { /* non-blocking */ }
  }

  return NextResponse.json({ ok: true });
}
