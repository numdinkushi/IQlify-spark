/**
 * Extract a readable transcript from a Vapi call payload or live message stream.
 */

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function lineFromMessage(msg: Record<string, unknown>): string | null {
  const role = String(msg.role ?? msg.name ?? "speaker");
  const text = String(
    msg.message ??
      msg.content ??
      msg.text ??
      msg.transcript ??
      "",
  ).trim();
  if (!text) return null;
  return `${role}: ${text}`;
}

export function extractTranscriptFromCall(call: unknown): string {
  if (!call || typeof call !== "object") return "";
  const data = call as Record<string, unknown>;
  const artifact =
    data.artifact && typeof data.artifact === "object"
      ? (data.artifact as Record<string, unknown>)
      : null;

  if (typeof data.transcript === "string" && data.transcript.trim()) {
    return data.transcript.trim();
  }
  if (typeof artifact?.transcript === "string" && artifact.transcript.trim()) {
    return artifact.transcript.trim();
  }

  if (Array.isArray(data.transcript)) {
    return data.transcript
      .map((item) =>
        typeof item === "string"
          ? item
          : lineFromMessage(item as Record<string, unknown>),
      )
      .filter(Boolean)
      .join("\n");
  }

  const messageLists = [
    data.messages,
    artifact?.messages,
    artifact?.messagesOpenAIFormatted,
  ];

  for (const list of messageLists) {
    if (!Array.isArray(list) || list.length === 0) continue;
    const text = list
      .map((item) => lineFromMessage(item as Record<string, unknown>))
      .filter(Boolean)
      .join("\n");
    if (text.trim()) return text;
  }

  return "";
}

/** Pull final transcript chunks from live Vapi `message` events. */
export function appendLiveTranscript(
  current: string,
  message: unknown,
): string {
  if (!message || typeof message !== "object") return current;
  const msg = message as Record<string, unknown>;

  if (msg.type === "transcript") {
    const transcriptType = String(msg.transcriptType ?? "final");
    if (transcriptType !== "final") return current;
    const role = String(msg.role ?? "user");
    const text = String(msg.transcript ?? "").trim();
    if (!text) return current;
    const line = `${role}: ${text}`;
    if (current.endsWith(line)) return current;
    return current ? `${current}\n${line}` : line;
  }

  if (msg.type === "conversation-update") {
    const conversation = msg.conversation ?? msg.messages;
    if (Array.isArray(conversation)) {
      const text = conversation
        .map((item) => lineFromMessage(item as Record<string, unknown>))
        .filter(Boolean)
        .join("\n");
      if (text.trim().length > current.trim().length) return text;
    }
  }

  if (msg.call && typeof msg.call === "object") {
    const call = msg.call as { id?: string };
    void call;
  }

  return current;
}

export function extractCallIdFromMessage(message: unknown): string | null {
  if (!message || typeof message !== "object") return null;
  const msg = message as Record<string, unknown>;
  const candidates = [
    typeof msg.call === "object" && msg.call
      ? (msg.call as { id?: string }).id
      : undefined,
    typeof msg.callId === "string" ? msg.callId : undefined,
    typeof msg.id === "string" && msg.type === "call" ? msg.id : undefined,
  ];
  for (const id of candidates) {
    if (id && isUuid(id)) return id;
  }
  return null;
}

export async function fetchCallTranscript(
  callId: string,
  opts?: { attempts?: number; delayMs?: number },
): Promise<string> {
  const attempts = opts?.attempts ?? 5;
  const delayMs = opts?.delayMs ?? 1500;
  let best = "";

  for (let i = 0; i < attempts; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
    try {
      const res = await fetch(`/api/vapi/call?callId=${encodeURIComponent(callId)}`);
      if (!res.ok) continue;
      const call = await res.json();
      const text = extractTranscriptFromCall(call);
      if (text.trim().length > best.trim().length) best = text;
      // Enough content to grade — stop early
      if (best.split(/\s+/).filter(Boolean).length >= 20) break;
    } catch {
      // retry
    }
  }

  return best;
}

export function transcriptWordCount(transcript: string): number {
  return transcript.split(/\s+/).filter((w) => w.length > 0).length;
}
