"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAccount } from "wagmi";

import { STORAGE_KEYS, TabType } from "@/lib/constants";

interface AppContextValue {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  isConnected: boolean;
  address?: string;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<TabType>(TabType.HOME);
  const [isHydrated, setIsHydrated] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem(STORAGE_KEYS.currentTab) as TabType | null;
    if (saved && Object.values(TabType).includes(saved)) {
      setCurrentTab(saved);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.currentTab, currentTab);
  }, [currentTab, isHydrated]);

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        isConnected: isHydrated ? isConnected : false,
        address: isHydrated ? address : undefined,
        isHydrated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
