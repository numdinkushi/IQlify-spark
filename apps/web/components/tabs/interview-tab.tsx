"use client";

import { Mic } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InterviewTab() {
  return (
    <div className="iqlify-grid-bg px-4 py-6">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold iqlify-accent-text">Interview</h1>
          <p className="text-sm text-muted-foreground">
            Voice AI practice booth — coming in Phase 2.
          </p>
        </div>
        <Card className="iqlify-card border-accent/20">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-accent/15">
              <Mic className="size-7 text-accent" />
            </div>
            <CardTitle className="iqlify-accent-text">Vapi booth</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Configure skill level, run equipment check, and complete a live
            technical interview session.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
