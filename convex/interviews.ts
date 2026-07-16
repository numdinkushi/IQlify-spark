import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import {
  interviewStatusValidator,
  interviewTypeValidator,
  skillLevelValidator,
} from "./schema";

export const createInterview = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("mock"),
      v.literal("live"),
      v.literal("assessment"),
    ),
    skillLevel: v.optional(skillLevelValidator),
    interviewType: v.optional(interviewTypeValidator),
    duration: v.number(),
    vapiCallId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("interviews", {
      userId: args.userId,
      type: args.type,
      skillLevel: args.skillLevel,
      interviewType: args.interviewType,
      skills: [],
      status: "not_started",
      duration: args.duration,
      startedAt: Date.now(),
      vapiCallId: args.vapiCallId,
    });
  },
});

export const updateInterview = mutation({
  args: {
    interviewId: v.id("interviews"),
    status: v.optional(interviewStatusValidator),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    earnings: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    vapiCallId: v.optional(v.string()),
    claimed: v.optional(v.boolean()),
    claimedAt: v.optional(v.number()),
    claimTxHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { interviewId, ...updates } = args;
    const existing = await ctx.db.get(interviewId);
    if (!existing) throw new Error("Interview not found");

    const wasCompleted =
      existing.status === "completed" &&
      existing.score !== undefined &&
      existing.earnings !== undefined;

    const patch: Record<string, unknown> = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    if (
      args.status === "completed" &&
      !args.completedAt &&
      !existing.completedAt
    ) {
      patch.completedAt = Date.now();
    }

    await ctx.db.patch(interviewId, patch);

    const updated = await ctx.db.get(interviewId);
    if (!updated) throw new Error("Interview not found");

    if (
      args.status === "completed" &&
      !wasCompleted &&
      args.score !== undefined &&
      args.earnings !== undefined
    ) {
      const user = await ctx.db.get(updated.userId);
      if (user) {
        await ctx.db.patch(user._id, {
          totalInterviews: user.totalInterviews + 1,
          totalEarnings: user.totalEarnings + (args.earnings || 0),
          currentStreak: user.currentStreak + 1,
          updatedAt: Date.now(),
        });
      }
    }

    return updated;
  },
});

export const markInterviewClaimed = mutation({
  args: {
    interviewId: v.id("interviews"),
    txHash: v.string(),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) throw new Error("Interview not found");

    await ctx.db.patch(args.interviewId, {
      claimed: true,
      claimedAt: Date.now(),
      claimTxHash: args.txHash,
    });

    return await ctx.db.get(args.interviewId);
  },
});

export const getInterview = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interviewId);
  },
});

export const getByVapiCallId = query({
  args: { vapiCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_vapi_call", (q) => q.eq("vapiCallId", args.vapiCallId))
      .first();
  },
});

export const getUserInterviews = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 20);
  },
});
