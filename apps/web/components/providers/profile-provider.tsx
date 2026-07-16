"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { useAccount } from "wagmi";

import { useProfileSubTab } from "@/hooks/use-profile-sub-tab";
import { api } from "@/lib/convex";
import type { ProfileSubTab } from "@/lib/profile-tabs";

interface ProfileUser {
  _id: string;
  walletAddress: string;
  displayName?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  profileImage?: string;
  totalEarnings?: number;
  currentStreak?: number;
  totalInterviews?: number;
  createdAt?: number;
}

interface ProfileContextValue {
  user: ProfileUser | null | undefined;
  profileSubTab: ProfileSubTab;
  setProfileSubTab: (tab: ProfileSubTab) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { activeTab, setActiveTab } = useProfileSubTab();

  const user = useQuery(
    api.users.getByWallet,
    address && isConnected ? { walletAddress: address } : "skip",
  );

  return (
    <ProfileContext.Provider
      value={{
        user: user ?? undefined,
        profileSubTab: activeTab,
        setProfileSubTab: setActiveTab,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
