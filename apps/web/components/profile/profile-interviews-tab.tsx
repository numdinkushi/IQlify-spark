"use client";

import { Mic } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/components/providers/profile-provider";

export function ProfileInterviewsTab() {
  const { user } = useProfile();
  const total = user?.totalInterviews ?? 0;

  return (
    <div className="space-y-4">
      <Card className="iqlify-card border-accent/20">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-base text-foreground">Your interviews</CardTitle>
          <p className="text-sm text-muted-foreground">
            Voice sessions, scores, and reward claims will appear here after Phase
            2.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {total > 0 ? (
            <p className="text-sm text-muted-foreground">
              {total} interview{total === 1 ? "" : "s"} completed.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent/15">
                <Mic className="size-6 text-accent" />
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                No interviews yet. Head to the Interview tab to complete your first
                voice session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
