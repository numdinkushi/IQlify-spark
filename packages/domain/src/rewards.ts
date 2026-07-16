import type { SkillLevel } from "./index";

/** Duration presets in minutes */
export const DURATION_MINUTES = {
  quick: 5,
  standard: 10,
  extended: 15,
} as const;

const SKILL_MULTIPLIER: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 1.5,
  advanced: 2,
};

/** Base MON reward before skill/score bonuses */
const BASE_REWARD_MON = 0.2;

/**
 * Calculate MON earnings from score (0–100) and skill level.
 * Very low scores (empty / non-interviews) earn nothing.
 */
export function calculateEarningsMon(
  score: number,
  skillLevel: SkillLevel = "intermediate",
): number {
  const clamped = Math.max(0, Math.min(100, score));
  if (clamped < 20) return 0;

  let bonus = 0;
  if (clamped >= 90) bonus = 0.3;
  else if (clamped >= 80) bonus = 0.2;
  else if (clamped >= 70) bonus = 0.1;

  const amount =
    BASE_REWARD_MON * SKILL_MULTIPLIER[skillLevel] + bonus;
  return Math.round(amount * 10000) / 10000;
}
