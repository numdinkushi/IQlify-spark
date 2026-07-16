"use client";

import { useAccount, useChainId } from "wagmi";

import { NetworkBadge } from "@/components/wallet/network-badge";
import { activeChain } from "@/lib/wagmi/chains";

type MonadNetworkRowProps = {
  compact?: boolean;
};

export function MonadNetworkRow({ compact }: MonadNetworkRowProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const onTarget = chainId === activeChain.id;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Network</span>
        <NetworkBadge />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">Network</span>
      <span className="font-medium">
        {isConnected
          ? onTarget
            ? activeChain.name
            : `Wrong network · switch to ${activeChain.name}`
          : activeChain.name}
      </span>
    </div>
  );
}
