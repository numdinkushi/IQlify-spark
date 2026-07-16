"use client";

import { useCallback, useEffect, useState } from "react";

import { ProfileSubTab } from "@/lib/profile-tabs";

const STORAGE_KEY = "iqlify_profile_sub_tab";

export function useProfileSubTab(
  defaultTab: ProfileSubTab = ProfileSubTab.Details,
) {
  const [activeTab, setActiveTabState] = useState(defaultTab);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ProfileSubTab | null;
    if (saved && Object.values(ProfileSubTab).includes(saved)) {
      setActiveTabState(saved);
    }
    setHydrated(true);
  }, []);

  const setActiveTab = useCallback((tab: ProfileSubTab) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEY, tab);
  }, []);

  return {
    activeTab: hydrated ? activeTab : defaultTab,
    setActiveTab,
    hydrated,
  };
}
