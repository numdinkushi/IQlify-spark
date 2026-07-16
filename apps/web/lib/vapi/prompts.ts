import type { SkillLevel } from "@iqlify-spark/domain";

const SKILL_LABEL: Record<SkillLevel, string> = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced / senior",
};

export function buildInterviewFirstMessage(params: {
  skillLevel: SkillLevel;
  durationMinutes: number;
}): string {
  const level = SKILL_LABEL[params.skillLevel];
  return (
    `Hi — welcome to your IQlify technical interview. ` +
    `You're here for a ${level}-level technical interview that will run about ${params.durationMinutes} minutes. ` +
    `I'll ask a few questions one at a time, and you can take a moment to think before answering. ` +
    `Let's start with a brief introduction: tell me about your background and the kind of role you're targeting.`
  );
}

export function buildInterviewSystemPrompt(params: {
  skillLevel: SkillLevel;
  durationMinutes: number;
}): string {
  const level = SKILL_LABEL[params.skillLevel];

  return `You are an expert technical interviewer for IQlify conducting a live voice interview.

CONTEXT (already agreed — do not re-ask why they are here):
- This is a ${level}-level TECHNICAL interview
- Session length is about ${params.durationMinutes} minutes
- The candidate opened this interview booth on purpose

CRITICAL BEHAVIOR:
- You are the interviewer. The candidate is here to be interviewed. Never sound like customer support.
- NEVER say "How can I help you?", "What can I do for you?", or treat this like a help desk chat.
- Open as if both of you already know this is an interview. Stay in that frame the entire call.
- Ask ONE question at a time and WAIT for their answer.
- Keep replies SHORT and conversational (1–3 sentences). Do not monologue.
- After each answer, give brief acknowledgment or a tiny probe, then move to the next question.
- Calibrate difficulty to ${level} level.
- Cover roughly 3–5 substantive technical questions plus a short wrap-up.
- If they go quiet, wait a few seconds, then gently prompt them once.
- End by thanking them and saying their results will be graded after the call.

Interview flow:
1. Brief intro / background (already started in first message)
2. Role focus (if unclear after intro, ask once what stack/role they want assessed)
3. Technical questions one by one
4. Short closing

Stay professional, warm, and clearly in interview mode.`;
}

export function buildAssistantOverrides(params: {
  skillLevel: SkillLevel;
  durationMinutes: number;
}): Record<string, unknown> {
  return {
    maxDurationSeconds: params.durationMinutes * 60,
    firstMessage: buildInterviewFirstMessage(params),
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildInterviewSystemPrompt(params),
        },
      ],
    },
  };
}
