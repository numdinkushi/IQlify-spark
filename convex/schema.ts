import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const skillLevelValidator = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
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
});
