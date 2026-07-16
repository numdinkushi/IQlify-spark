"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClaimReward } from "@/hooks/use-claim-reward";
import type { Id } from "@/lib/convex";

export function ClaimRewardButton({
  interviewId,
}: {
  interviewId: Id<"interviews">;
}) {
  const { claim, state, error, configured, alreadyClaimed, earnings, txHash } =
    useClaimReward(interviewId);

  if (alreadyClaimed) {
    return (
      <p className="text-sm text-accent">
        Reward claimed
        {txHash ? (
          <>
            {" · "}
            <span className="font-mono text-xs">{txHash.slice(0, 10)}…</span>
          </>
        ) : null}
      </p>
    );
  }

  if (!configured) {
    return (
      <p className="text-xs text-muted-foreground">
        Reward contract not deployed yet. Set NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS
        after deploy.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        className="iqlify-button-primary h-11 w-full rounded-xl"
        disabled={state === "signing" || state === "confirming" || state === "pending" || earnings <= 0}
        onClick={() => void claim()}
      >
        {(state === "signing" ||
          state === "confirming" ||
          state === "pending") && (
          <Loader2 className="size-4 animate-spin" />
        )}
        {state === "idle" || state === "error"
          ? `Claim ${earnings} MON`
          : state === "signing"
            ? "Signing…"
            : state === "confirming"
              ? "Confirm in wallet…"
              : state === "pending"
                ? "Confirming…"
                : "Claimed"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
