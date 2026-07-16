import { NextRequest, NextResponse } from "next/server";

/**
 * Vapi webhook — end-of-call reports land here.
 * For MVP we acknowledge and let the client drive grading via /api/vapi/call + analyze.
 * Persist callId correlation can be expanded once Convex HTTP actions are wired.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const message = payload?.message ?? payload;
    const type = message?.type ?? payload?.type;

    console.log("[vapi webhook]", type, message?.call?.id ?? message?.callId);

    if (type === "end-of-call-report" || type === "hang") {
      return NextResponse.json({ ok: true, handled: type });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
