"use client";

import { useAccount, useChainId } from "wagmi";

import { activeChain } from "@/lib/wagmi/chains";
import { cn } from "@/lib/utils";

export function NetworkBadge({ className }: { className?: string }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const onTarget = chainId === activeChain.id;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]",
        onTarget || !isConnected
          ? "border-accent/25 bg-card/60 text-muted-foreground"
          : "border-destructive/40 bg-destructive/10 text-destructive",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          !isConnected
            ? "bg-muted-foreground"
            : onTarget
              ? "bg-brand-lavender"
              : "bg-destructive",
        )}
      />
      <span>
        {isConnected
          ? onTarget
            ? activeChain.name
            : `Wrong network`
          : activeChain.name}
      </span>
    </div>
  );
}
