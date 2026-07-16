"use client";

import type { ReactNode } from "react";

import { AppProvider } from "@/hooks/use-app-state";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ProfileProvider } from "@/components/providers/profile-provider";
import { Web3Provider } from "@/components/providers/web3-provider";
import { Toaster } from "@/components/ui/sonner";
import { WalletUserSync } from "@/components/wallet/wallet-user-sync";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <Web3Provider>
        <AppProvider>
          <ProfileProvider>
            <WalletUserSync />
            {children}
            <Toaster />
          </ProfileProvider>
        </AppProvider>
      </Web3Provider>
    </ConvexClientProvider>
  );
}
