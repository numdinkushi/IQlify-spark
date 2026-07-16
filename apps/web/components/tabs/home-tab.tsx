"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Coins,
  Sparkles,
  Target,
  Trophy,
  Wallet2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";

import { ConnectButtonStyled } from "@/components/wallet/connect-button-styled";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabType } from "@/lib/constants";
import { useAppState } from "@/hooks/use-app-state";
import { api } from "@/lib/convex";
import { activeChain } from "@/lib/wagmi/chains";

export function HomeTab() {
  const { isConnected, address, isHydrated } = useAppState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !isHydrated || !isConnected || !address) {
    return <WelcomeScreen />;
  }

  return <Dashboard address={address} />;
}

function WelcomeScreen() {
  return (
    <div className="relative overflow-hidden px-4 py-10">
      <div className="absolute inset-0 iqlify-grid-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background" />
        <motion.div
          className="absolute left-8 top-10 size-56 rounded-full bg-accent/15 blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-6 size-72 rounded-full bg-brand-dusk/25 blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 py-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30"
            />
            <div className="relative flex size-20 items-center justify-center rounded-full bg-brand-gradient shadow-[0_0_40px_rgba(159,134,192,0.4)]">
              <Brain className="size-9 text-brand-ink" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-3 text-center">
          <h1 className="text-4xl iqlify-brand-font iqlify-accent-text">
            IQlify
          </h1>
          <p className="text-muted-foreground">
            Practice voice interviews, get AI-graded feedback, and earn MON on{" "}
            {activeChain.name}.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Brain, label: "Practice" },
            { icon: Trophy, label: "Score" },
            { icon: Zap, label: "Earn" },
          ].map(({ icon: Icon, label }) => (
            <Card key={label} className="iqlify-card border-accent/15 py-3">
              <CardContent className="flex flex-col items-center gap-2 px-2">
                <Icon className="size-5 text-accent" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="iqlify-card border-accent/25 shadow-[0_0_30px_rgba(159,134,192,0.15)]">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent/15">
              <Wallet2 className="size-6 text-accent" />
            </div>
            <CardTitle className="iqlify-accent-text">
              Connect your wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Link a Monad wallet to start practicing and track your profile.
            </p>
            <ConnectButtonStyled />
            <div className="flex items-center gap-2 text-xs text-accent/80">
              <Sparkles className="size-3.5" />
              Built on Monad
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Dashboard({ address }: { address: string }) {
  const { setCurrentTab } = useAppState();
  const user = useQuery(api.users.getByWallet, { walletAddress: address });

  return (
    <div className="iqlify-grid-bg px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold iqlify-accent-text">
            Welcome{user?.displayName ? `, ${user.displayName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ready for your next interview?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="iqlify-card border-accent/20">
            <CardContent className="space-y-1 p-4">
              <Coins className="size-5 text-accent" />
              <p className="text-xs text-muted-foreground">Total earnings</p>
              <p className="text-xl font-semibold">
                {user?.totalEarnings ?? 0} MON
              </p>
            </CardContent>
          </Card>
          <Card className="iqlify-card border-accent/20">
            <CardContent className="space-y-1 p-4">
              <Target className="size-5 text-accent" />
              <p className="text-xs text-muted-foreground">Current streak</p>
              <p className="text-xl font-semibold">
                {user?.currentStreak ?? 0} days
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="iqlify-card border-accent/20">
          <CardContent className="space-y-3 p-4">
            <p className="text-sm text-muted-foreground">
              Complete a voice interview to get graded and claim rewards onchain.
            </p>
            <Button
              className="iqlify-button-primary h-11 w-full rounded-xl"
              onClick={() => setCurrentTab(TabType.INTERVIEW)}
            >
              Start interview
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="iqlify-card border-accent/15">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No interviews yet. Head to the Interview tab to begin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
