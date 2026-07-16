"use client";

import { PROFILE_SUB_TABS, PROFILE_SUB_TAB_LABELS, ProfileSubTab } from "@/lib/profile-tabs";
import { cn } from "@/lib/utils";

type ProfileTabBarProps = {
  activeTab: ProfileSubTab;
  onTabChange: (tab: ProfileSubTab) => void;
};

export function ProfileTabBar({ activeTab, onTabChange }: ProfileTabBarProps) {
  return (
    <div className="grid shrink-0 grid-cols-3 gap-1 rounded-2xl border border-border/80 bg-muted/30 p-1">
      {PROFILE_SUB_TABS.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "rounded-xl px-2 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {PROFILE_SUB_TAB_LABELS[tab]}
          </button>
        );
      })}
    </div>
  );
}
