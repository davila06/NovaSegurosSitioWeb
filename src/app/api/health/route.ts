import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status:    "ok",
    env:       process.env.NODE_ENV ?? "production",
    timestamp: new Date().toISOString(),
    services: {
      mindflow: !!process.env.MINDFLOW_API_URL,
      resend:   !!process.env.RESEND_API_KEY,
      twilio:   !!process.env.TWILIO_ACCOUNT_SID,
    },
  });
}
