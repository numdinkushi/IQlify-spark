"use client";

import { Brain } from "lucide-react";
import { useAccount, useChainId } from "wagmi";

import { ConnectButtonStyled } from "@/components/wallet/connect-button-styled";
import { ConnectedWalletMenu } from "@/components/wallet/connected-wallet-menu";
import { activeChain } from "@/lib/wagmi/chains";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const onTarget = !isConnected || chainId === activeChain.id;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background/90 backdrop-blur-md">
      <div className="container flex h-12 max-w-screen-2xl items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-brand-gradient">
            <Brain className="size-3.5 text-brand-ink" />
          </div>
          <span className="text-base font-bold iqlify-accent-text iqlify-brand-font">
            IQlify
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && address && onTarget ? (
            <ConnectedWalletMenu />
          ) : (
            <ConnectButtonStyled />
          )}
        </div>
      </div>
    </header>
  );
}
