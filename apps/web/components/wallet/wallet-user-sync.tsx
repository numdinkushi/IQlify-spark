"use client";

import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";

import { api } from "@/lib/convex";

function WalletUserSyncInner() {
  const { address, isConnected } = useAccount();
  const ensureUser = useMutation(api.users.ensureUser);
  const lastSynced = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      lastSynced.current = null;
      return;
    }

    const normalized = address.toLowerCase();
    if (lastSynced.current === normalized) return;

    lastSynced.current = normalized;
    void ensureUser({ walletAddress: address }).catch(() => {
      lastSynced.current = null;
    });
  }, [address, ensureUser, isConnected]);

  return null;
}

export function WalletUserSync() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null;
  }

  return <WalletUserSyncInner />;
}
