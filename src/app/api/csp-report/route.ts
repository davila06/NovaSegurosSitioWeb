import { NextRequest, NextResponse } from "next/server";

/** Receives CSP violation reports from the browser and logs them server-side. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    console.warn("[CSP Violation]", JSON.stringify(body, null, 2));
  } catch {
    // Malformed report — ignore
  }
  return new NextResponse(null, { status: 204 });
}
