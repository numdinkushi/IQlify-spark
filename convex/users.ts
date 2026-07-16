import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { skillLevelValidator } from "./schema";

function normalizeWallet(address: string): string {
  return address.trim().toLowerCase();
}

export const getByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("walletAddress", normalizeWallet(args.walletAddress)),
      )
      .unique();
  },
});

export const ensureUser = mutation({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: now });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      walletAddress,
      totalEarnings: 0,
      currentStreak: 0,
      totalInterviews: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProfile = mutation({
  args: {
    walletAddress: v.string(),
    displayName: v.string(),
    skillLevel: skillLevelValidator,
  },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const displayName = args.displayName.trim();

    if (!displayName) {
      throw new Error("Display name is required");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();

    if (!existing) {
      throw new Error("Connect a wallet before updating your profile");
    }

    await ctx.db.patch(existing._id, {
      displayName,
      skillLevel: args.skillLevel,
      updatedAt: Date.now(),
    });

    return existing._id;
  },
});
