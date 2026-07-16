"use client";

import { useQuery } from "convex/react";
import { Trophy } from "lucide-react";
import { useAccount } from "wagmi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/convex";
import { formatMonAmount, shortWalletAddress } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function LeaderboardTab() {
  const { address } = useAccount();
  const rows = useQuery(api.users.getLeaderboard, { limit: 25 });
  const self = address?.toLowerCase();

  return (
    <div className="iqlify-grid-bg px-4 py-6">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold iqlify-accent-text">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Ranked by rewards earned from graded interviews.
          </p>
        </div>

        <Card className="iqlify-card border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-5 text-accent" />
              Top performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {!rows ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Trophy className="size-8 text-accent/50" />
                <p className="text-sm text-muted-foreground">
                  No ranked users yet. Complete an interview to appear here.
                </p>
              </div>
            ) : (
              rows.map((row) => {
                const isYou = self === row.walletAddress.toLowerCase();
                const label =
                  row.displayName?.trim() ||
                  shortWalletAddress(row.walletAddress);

                return (
                  <div
                    key={row._id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5",
                      isYou && "bg-accent/10 ring-1 ring-accent/30",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        row.rank <= 3
                          ? "bg-brand-gradient text-brand-ink"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {row.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {label}
                        {isYou ? (
                          <span className="ml-1.5 text-xs text-accent">you</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.totalInterviews} interview
                        {row.totalInterviews === 1 ? "" : "s"}
                        {row.currentStreak > 0
                          ? ` · ${row.currentStreak} streak`
                          : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatMonAmount(row.totalEarnings)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        MON
                      </span>
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
