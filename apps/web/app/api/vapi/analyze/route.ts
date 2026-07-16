import { NextRequest, NextResponse } from "next/server";

type AnalyzeBody = {
  transcript: string;
  skillLevel?: string;
  interviewType?: string;
};

/** Prefer models with free-tier headroom; 2.0-flash often hits 429. */
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.0-flash",
] as const;

async function generateWithGemini(
  apiKey: string,
  prompt: string,
): Promise<{ text: string; model: string }> {
  let lastError = "Gemini request failed";

  for (const model of GEMINI_MODELS) {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 },
        }),
      },
    );

    if (geminiRes.ok) {
      const data = await geminiRes.json();
      const text: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (text.trim()) return { text, model };
      lastError = `Empty response from ${model}`;
      continue;
    }

    const details = await geminiRes.text();
    lastError = `${model} → ${geminiRes.status}: ${details.slice(0, 280)}`;

    // Try next model on quota / not found; other errors still fall through.
    if (geminiRes.status === 429 || geminiRes.status === 404) continue;
    break;
  }

  throw new Error(lastError);
}

/**
 * Grade an interview transcript with Gemini.
 * Returns overall score 0–100 and feedback.
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as AnalyzeBody;
    if (!body.transcript?.trim()) {
      return NextResponse.json(
        { error: "Missing transcript" },
        { status: 400 },
      );
    }

    const skillLevel = body.skillLevel ?? "intermediate";
    const interviewType = body.interviewType ?? "technical";

    const prompt = `You are grading a ${skillLevel} ${interviewType} voice interview.

Transcript:
"""
${body.transcript.slice(0, 12000)}
"""

Respond with ONLY valid JSON (no markdown):
{
  "overall": <number 0-100>,
  "technicalSkills": <number 0-100>,
  "communication": <number 0-100>,
  "problemSolving": <number 0-100>,
  "feedback": "<2-4 sentence written feedback>",
  "recommendation": "strong_hire" | "hire" | "maybe" | "no_hire"
}`;

    const { text } = await generateWithGemini(apiKey, prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse grading response", raw: text },
        { status: 502 },
      );
    }

    const score = JSON.parse(jsonMatch[0]) as {
      overall: number;
      technicalSkills: number;
      communication: number;
      problemSolving: number;
      feedback: string;
      recommendation: string;
    };

    return NextResponse.json(score);
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
