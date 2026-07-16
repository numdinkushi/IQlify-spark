"use client";

import {
  Check,
  Copy,
  LogOut,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NetworkBadge } from "@/components/wallet/network-badge";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useProfile } from "@/components/providers/profile-provider";
import { shortWalletAddress } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function ConnectedWalletMenu() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { user } = useProfile();
  const { copied, copy } = useCopyToClipboard();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initials =
    user?.displayName?.slice(0, 2).toUpperCase() ??
    address?.slice(2, 4).toUpperCase() ??
    "U";

  const handleDisconnect = useCallback(() => {
    setOpen(false);
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!address) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Wallet menu"
        onClick={() => setOpen((current) => !current)}
        className="transition-opacity hover:opacity-80"
      >
        <Avatar
          className={cn(
            "size-8 ring-2 transition-all",
            open ? "ring-accent/60" : "ring-accent/25 hover:ring-accent/50",
          )}
        >
          <AvatarFallback className="bg-brand-gradient text-xs font-semibold text-brand-ink">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-50 min-w-56 rounded-xl border border-border/70 bg-card p-2 shadow-xl"
        >
          <div className="border-b border-border/60 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Connected wallet</p>
            <div className="mt-1 flex items-center gap-1.5">
              <p className="min-w-0 flex-1 font-mono text-sm text-foreground">
                {shortWalletAddress(address, 6)}
              </p>
              <button
                type="button"
                aria-label={copied ? "Address copied" : "Copy wallet address"}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => void copy(address)}
              >
                {copied ? (
                  <Check className="size-3.5 text-brand-lavender" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            {user?.displayName ? (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserRound className="size-3" />
                {user.displayName}
              </p>
            ) : null}
            {connector?.name ? (
              <p className="mt-1 text-xs text-muted-foreground">
                via {connector.name}
              </p>
            ) : null}
          </div>

          <div className="border-b border-border/60 px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Network</p>
              <NetworkBadge />
            </div>
          </div>

          <button
            type="button"
            role="menuitem"
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDisconnect}
          >
            <LogOut className="size-4" />
            Disconnect wallet
          </button>
        </div>
      ) : null}
    </div>
  );
}
