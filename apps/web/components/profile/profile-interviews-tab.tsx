"use client";

import { useQuery } from "convex/react";
import { Check, ExternalLink, Mic } from "lucide-react";

import { ClaimRewardButton } from "@/components/interview/claim-reward-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/components/providers/profile-provider";
import { api, type Id } from "@/lib/convex";
import { cn } from "@/lib/utils";
import { formatMonAmount } from "@/lib/utils/format";
import { activeChain } from "@/lib/wagmi/chains";

const explorerUrl = activeChain.blockExplorers?.default.url;

function getTransactionUrl(txHash: string | undefined): string | undefined {
  if (!txHash || !explorerUrl) return undefined;
  return `${explorerUrl.replace(/\/$/, "")}/tx/${txHash}`;
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

function statusPillClass(status: string): string {
  switch (status) {
    case "failed":
      return "bg-red-500/15 text-red-300 ring-red-400/30";
    case "in_progress":
      return "bg-orange-500/15 text-orange-300 ring-orange-400/30";
    case "grading":
      return "bg-amber-500/15 text-amber-200 ring-amber-400/30";
    case "cancelled":
      return "bg-zinc-500/15 text-zinc-300 ring-zinc-400/25";
    case "not_started":
      return "bg-sky-500/15 text-sky-300 ring-sky-400/30";
    case "completed":
      return "bg-muted/60 text-muted-foreground ring-border/60";
    default:
      return "bg-muted/60 text-muted-foreground ring-border/60";
  }
}

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
            Claim MON from completed sessions, or review past results.
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
            interviews.map((item) => {
              const canClaim =
                item.status === "completed" &&
                !item.claimed &&
                (item.earnings ?? 0) > 0;
              const transactionUrl = getTransactionUrl(item.claimTxHash);
              const statusLabel =
                item.status === "completed" && !item.claimed && !canClaim
                  ? "No reward"
                  : formatStatusLabel(item.status);

              return (
                <div
                  key={item._id}
                  className="flex items-start justify-between gap-3 border-b border-border/50 py-3 last:border-0"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium capitalize">
                      {item.interviewType?.replace(/_/g, " ") ?? "Interview"} ·{" "}
                      {item.skillLevel ?? "—"}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {formatStatusLabel(item.status)}
                      {item.score != null ? ` · Score ${item.score}` : ""}
                      {item.earnings != null
                        ? ` · ${formatMonAmount(item.earnings)} MON`
                        : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {canClaim ? (
                      <ClaimRewardButton
                        interviewId={item._id}
                        compact
                      />
                    ) : item.claimed ? (
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                          <Check className="size-3 stroke-[2.5]" />
                          Claimed
                        </span>
                        {transactionUrl ? (
                          <a
                            href={transactionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[11px] text-brand-mist ring-1 ring-border/60 transition-colors hover:bg-accent/10 hover:text-accent"
                          >
                            View tx
                            <ExternalLink className="size-3" />
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1",
                          statusPillClass(item.status),
                        )}
                      >
                        {statusLabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
