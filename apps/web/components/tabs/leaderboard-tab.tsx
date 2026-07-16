"use client";

import { Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaderboardTab() {
  return (
    <div className="iqlify-grid-bg px-4 py-6">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold iqlify-accent-text">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top performers — deferred until post-MVP.
          </p>
        </div>
        <Card className="iqlify-card border-accent/20">
          <CardHeader className="items-center">
            <Trophy className="mb-2 size-8 text-accent" />
            <CardTitle className="iqlify-accent-text">Coming soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Rankings will appear here after interview rewards go live.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
