"use client";

import { useQuery } from "convex/react";
import { Mic } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/components/providers/profile-provider";
import { api, type Id } from "@/lib/convex";

export function ProfileInterviewsTab() {
  const { user } = useProfile();
  const interviews = useQuery(
    api.interviews.getUserInterviews,
    user?._id ? { userId: user._id as Id<"users"> } : "skip",
  );

  return (
    <div className="space-y-4">
      <Card className="iqlify-card border-accent/20">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-base text-foreground">
            Your interviews
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent voice sessions, scores, and claim status.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {!interviews ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : interviews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent/15">
                <Mic className="size-6 text-accent" />
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                No interviews yet. Head to the Interview tab to complete your
                first voice session.
              </p>
            </div>
          ) : (
            interviews.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-3 border-b border-border/50 py-3 last:border-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium capitalize">
                    {item.interviewType?.replace("_", " ") ?? "Interview"} ·{" "}
                    {item.skillLevel ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.status}
                    {item.score != null ? ` · Score ${item.score}` : ""}
                    {item.earnings != null ? ` · ${item.earnings} MON` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.claimed
                    ? "Claimed"
                    : item.status === "completed"
                      ? "Ready"
                      : ""}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
