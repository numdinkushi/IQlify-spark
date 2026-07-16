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

export const updateProfileImage = mutation({
  args: {
    walletAddress: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    const walletAddress = normalizeWallet(args.walletAddress);
    const profileImage = args.profileImage.trim();

    if (!profileImage.startsWith("https://")) {
      throw new Error("Invalid profile image URL");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .unique();

    if (!existing) {
      throw new Error("Connect a wallet before updating your profile image");
    }

    await ctx.db.patch(existing._id, {
      profileImage,
      updatedAt: Date.now(),
    });

    return existing._id;
  },
});

export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 25, 50);
    const users = await ctx.db.query("users").collect();

    return users
      .filter((u) => u.totalEarnings > 0 || u.totalInterviews > 0)
      .sort((a, b) => {
        if (b.totalEarnings !== a.totalEarnings) {
          return b.totalEarnings - a.totalEarnings;
        }
        return b.totalInterviews - a.totalInterviews;
      })
      .slice(0, limit)
      .map((u, index) => ({
        rank: index + 1,
        _id: u._id,
        displayName: u.displayName,
        walletAddress: u.walletAddress,
        totalEarnings: u.totalEarnings,
        totalInterviews: u.totalInterviews,
        currentStreak: u.currentStreak,
        skillLevel: u.skillLevel,
      }));
  },
});

function roundMon(value: number): number {
  return Math.round(value * 100) / 100;
}

export const getRewardBreakdown = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("walletAddress", normalizeWallet(args.walletAddress)),
      )
      .unique();

    if (!user) {
      return { claimed: 0, unclaimed: 0, total: 0 };
    }

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let claimed = 0;
    let unclaimed = 0;

    for (const interview of interviews) {
      if (interview.status !== "completed") continue;
      const amount = interview.earnings ?? 0;
      if (amount <= 0) continue;
      if (interview.claimed) {
        claimed += amount;
      } else {
        unclaimed += amount;
      }
    }

    claimed = roundMon(claimed);
    unclaimed = roundMon(unclaimed);

    return {
      claimed,
      unclaimed,
      total: roundMon(claimed + unclaimed),
    };
  },
});
