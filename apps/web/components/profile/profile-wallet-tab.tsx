"use client";

import { Copy, ShieldCheck, Unplug, Wallet } from "lucide-react";
import { useBalance, useDisconnect } from "wagmi";

import { ConnectButtonStyled } from "@/components/wallet/connect-button-styled";
import { MonadNetworkRow } from "@/components/wallet/monad-network-row";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useProfile } from "@/components/providers/profile-provider";
import { activeChain } from "@/lib/wagmi/chains";
import { shortWalletAddress } from "@/lib/utils/format";
import { useAccount } from "wagmi";

export function ProfileWalletTab() {
  const { address, isConnected, connector } = useAccount();
  const { user } = useProfile();
  const { disconnect } = useDisconnect();
  const { copied, copy } = useCopyToClipboard();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: activeChain.id,
  });

  const displayLabel =
    user?.displayName?.trim() || shortWalletAddress(address, 4);

  return (
    <div className="space-y-4">
      <Card className="iqlify-card border-accent/20">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-dusk/20 text-accent">
                <Wallet className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {isConnected ? displayLabel : "Not connected"}
                </p>
                {address ? (
                  <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                    {address}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Connect to get started
                  </p>
                )}
              </div>
            </div>
            {!isConnected ? <ConnectButtonStyled /> : null}
          </div>

          {isConnected ? (
            <div className="rounded-2xl border border-accent/20 bg-brand-dusk/10 p-4">
              <p className="text-xs text-muted-foreground">MON balance</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight iqlify-accent-text">
                {balanceLoading
                  ? "—"
                  : balance
                    ? `${Number(balance.formatted).toFixed(4)} MON`
                    : "0 MON"}
              </p>
            </div>
          ) : null}

          {isConnected ? (
            <div className="grid gap-3 rounded-2xl bg-muted/50 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Wallet app</span>
                <span className="font-medium">{connector?.name ?? "Unknown"}</span>
              </div>
              <MonadNetworkRow compact />
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Short address</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium">
                    {shortWalletAddress(address, 6)}
                  </span>
                  {address ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => void copy(address)}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Convex profile</span>
                <span className="font-medium">
                  {user === undefined
                    ? "Syncing…"
                    : user
                      ? "Synced"
                      : "Pending"}
                </span>
              </div>
              {copied ? (
                <p className="text-xs text-accent">Address copied</p>
              ) : null}
            </div>
          ) : null}

          {isConnected ? (
            <Button
              variant="outline"
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => disconnect()}
            >
              <Unplug className="size-4" />
              Disconnect wallet
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card className="iqlify-card border-dashed border-accent/20">
        <CardContent className="flex items-start gap-3 p-5 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-lavender" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">Reward distributor</p>
            <p>
              Interview rewards settle on {activeChain.name} via signed claims.
              Contract deployment lands in Phase 4.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
