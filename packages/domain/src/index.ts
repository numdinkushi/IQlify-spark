export type LanguageCode =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "de"
  | "it"
  | "zh"
  | "ja"
  | "ko"
  | "ar";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type InterviewType =
  | "technical"
  | "soft_skills"
  | "behavioral"
  | "system_design";

export type InterviewDuration = "quick" | "standard" | "extended";

export type InterviewStatus =
  | "not_started"
  | "in_progress"
  | "grading"
  | "completed"
  | "failed"
  | "cancelled";

export type RewardClaimStatus = "pending" | "signed" | "claimed" | "expired";

export interface InterviewSessionDraft {
  skillLevel: SkillLevel;
  interviewType: InterviewType;
  duration: InterviewDuration;
  language: LanguageCode;
  walletAddress: string;
}

export interface InterviewScore {
  overall: number;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  feedback: string;
  recommendation: "strong_hire" | "hire" | "maybe" | "no_hire";
}

export interface RewardClaimDraft {
  walletAddress: string;
  amountWei: string;
  interviewId: string;
  nonce: number;
  deadline: number;
}

export { calculateEarningsMon, DURATION_MINUTES } from "./rewards";
