"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClaimReward } from "@/hooks/use-claim-reward";
import type { Id } from "@/lib/convex";
import { formatMonAmount } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function ClaimRewardButton({
  interviewId,
  compact = false,
}: {
  interviewId: Id<"interviews">;
  compact?: boolean;
}) {
  const { claim, state, error, configured, alreadyClaimed, earnings, txHash } =
    useClaimReward(interviewId);

  if (alreadyClaimed) {
    return (
      <p className={cn("text-accent", compact ? "text-xs" : "text-sm")}>
        Claimed
        {txHash ? (
          <>
            {" · "}
            <span className="font-mono text-[10px]">{txHash.slice(0, 10)}…</span>
          </>
        ) : null}
      </p>
    );
  }

  if (!configured) {
    return (
      <p className="text-xs text-muted-foreground">
        {compact ? "Contract not set" : "Reward contract not configured for this network yet."}
      </p>
    );
  }

  if (earnings <= 0) {
    return (
      <p className="text-xs text-muted-foreground">No claimable reward</p>
    );
  }

  return (
    <div className={cn("space-y-1", compact ? "w-auto" : "w-full")}>
      <Button
        className={cn(
          "iqlify-button-primary rounded-xl",
          compact ? "h-8 px-3 text-xs" : "h-11 w-full",
        )}
        disabled={
          state === "signing" ||
          state === "confirming" ||
          state === "pending"
        }
        onClick={() => void claim()}
      >
        {(state === "signing" ||
          state === "confirming" ||
          state === "pending") && (
          <Loader2 className="size-3.5 animate-spin" />
        )}
        {state === "idle" || state === "error"
          ? `Claim ${formatMonAmount(earnings)}`
          : state === "signing"
            ? "Signing…"
            : state === "confirming"
              ? "Confirm…"
              : state === "pending"
                ? "Pending…"
                : "Claimed"}
      </Button>
      {error ? (
        <p className={cn("text-destructive", compact ? "max-w-[10rem] text-[10px] leading-tight" : "text-sm")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
