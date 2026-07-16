"use client";

import { Home, Mic, Trophy, UserRound } from "lucide-react";

import { TAB_CONFIGS } from "@/lib/constants";
import { useAppState } from "@/hooks/use-app-state";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  Mic,
  Trophy,
  UserRound,
} as const;

export function BottomTabs() {
  const { currentTab, setCurrentTab } = useAppState();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-accent/25 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {TAB_CONFIGS.map((tab) => {
          const Icon = iconMap[tab.icon];
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className="flex flex-col items-center gap-1"
            >
              <Icon
                size={24}
                className={cn(isActive ? "text-accent" : "text-foreground/70")}
              />
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-accent" : "text-foreground/70",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
