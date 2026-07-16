import type { SkillLevel } from "@iqlify-spark/domain";
import { calculateEarningsMon, DURATION_MINUTES } from "@iqlify-spark/domain";

export { calculateEarningsMon, DURATION_MINUTES };

export const SKILL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const DURATION_OPTIONS: {
  value: keyof typeof DURATION_MINUTES;
  label: string;
  minutes: number;
}[] = [
  { value: "quick", label: "Quick (5 min)", minutes: 5 },
  { value: "standard", label: "Standard (10 min)", minutes: 10 },
  { value: "extended", label: "Extended (15 min)", minutes: 15 },
];
