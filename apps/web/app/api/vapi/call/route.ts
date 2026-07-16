import { NextRequest, NextResponse } from "next/server";

/**
 * Fetch a Vapi call by ID (server-side, uses private API key).
 */
export async function GET(req: NextRequest) {
  const callId = req.nextUrl.searchParams.get("callId");
  if (!callId) {
    return NextResponse.json({ error: "Missing callId" }, { status: 400 });
  }

  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing VAPI_API_KEY" }, { status: 500 });
  }

  const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: "Failed to fetch call", details: text },
      { status: response.status },
    );
  }

  const call = await response.json();
  return NextResponse.json(call);
}
