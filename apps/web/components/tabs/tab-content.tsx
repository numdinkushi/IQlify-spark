"use client";

import { AnimatePresence, motion } from "framer-motion";

import { HomeTab } from "@/components/tabs/home-tab";
import { InterviewTab } from "@/components/tabs/interview-tab";
import { LeaderboardTab } from "@/components/tabs/leaderboard-tab";
import { ProfileTabPage } from "@/components/tabs/profile-tab-page";
import { TabType } from "@/lib/constants";
import { useAppState } from "@/hooks/use-app-state";

const tabComponents = {
  [TabType.HOME]: HomeTab,
  [TabType.INTERVIEW]: InterviewTab,
  [TabType.LEADERBOARD]: LeaderboardTab,
  [TabType.PROFILE]: ProfileTabPage,
} as const;

export function TabContent() {
  const { currentTab } = useAppState();
  const CurrentComponent = tabComponents[currentTab];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <CurrentComponent />
      </motion.div>
    </AnimatePresence>
  );
}
