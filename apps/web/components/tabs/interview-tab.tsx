"use client";

import { InterviewBooth } from "@/components/interview/interview-booth";

export function InterviewTab() {
  return (
    <div className="iqlify-grid-bg px-4 py-6">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold iqlify-accent-text">Interview</h1>
          <p className="text-sm text-muted-foreground">
            Practice a technical voice interview, get graded, claim MON.
          </p>
        </div>
        <InterviewBooth />
      </div>
    </div>
  );
}
