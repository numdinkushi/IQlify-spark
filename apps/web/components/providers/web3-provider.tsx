"use client";

import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";

import { resolveMonadNetwork } from "@iqlify-spark/config";

import { activeChain } from "@/lib/wagmi/chains";

import "@rainbow-me/rainbowkit/styles.css";

const chains = [activeChain] as const;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "IQlify",
    projectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ||
      "00000000000000000000000000000000",
  },
);

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [activeChain.id]: http(),
  } as Record<(typeof chains)[number]["id"], ReturnType<typeof http>>,
  ssr: true,
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={activeChain} showRecentTransactions>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
