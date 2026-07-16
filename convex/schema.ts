import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const skillLevelValidator = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
);

export const interviewTypeValidator = v.union(
  v.literal("technical"),
  v.literal("soft_skills"),
  v.literal("behavioral"),
  v.literal("system_design"),
);

export const interviewStatusValidator = v.union(
  v.literal("not_started"),
  v.literal("in_progress"),
  v.literal("grading"),
  v.literal("completed"),
  v.literal("failed"),
  v.literal("cancelled"),
);

export default defineSchema({
  users: defineTable({
    walletAddress: v.string(),
    displayName: v.optional(v.string()),
    skillLevel: v.optional(skillLevelValidator),
    preferredLanguage: v.optional(v.string()),
    totalEarnings: v.number(),
    currentStreak: v.number(),
    totalInterviews: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_wallet", ["walletAddress"]),

  interviews: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("mock"),
      v.literal("live"),
      v.literal("assessment"),
    ),
    skillLevel: v.optional(skillLevelValidator),
    interviewType: v.optional(interviewTypeValidator),
    skills: v.array(v.string()),
    status: interviewStatusValidator,
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    duration: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    earnings: v.optional(v.number()),
    claimed: v.optional(v.boolean()),
    claimedAt: v.optional(v.number()),
    claimTxHash: v.optional(v.string()),
    vapiCallId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_vapi_call", ["vapiCallId"]),
});
