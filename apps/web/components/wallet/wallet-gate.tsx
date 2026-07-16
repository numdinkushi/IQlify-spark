"use client";

import type { ReactNode } from "react";
import { Wallet2 } from "lucide-react";

import { ConnectButtonStyled } from "@/components/wallet/connect-button-styled";
import { Card, CardContent } from "@/components/ui/card";

type WalletGateProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function WalletGate({ title, description }: WalletGateProps) {
  return (
    <Card className="iqlify-card border-accent/20">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/15">
          <Wallet2 className="size-7 text-accent" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ConnectButtonStyled />
      </CardContent>
    </Card>
  );
}
