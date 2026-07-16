"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectButtonStyled() {
  return (
    <div className="rainbowkit-custom">
      <ConnectButton
        accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
        chainStatus="full"
        showBalance={false}
      />
    </div>
  );
}
