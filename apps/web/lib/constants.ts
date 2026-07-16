export enum TabType {
  HOME = "home",
  INTERVIEW = "interview",
  LEADERBOARD = "leaderboard",
  PROFILE = "profile",
}

export interface TabConfig {
  id: TabType;
  label: string;
  icon: "Home" | "Mic" | "Trophy" | "UserRound";
}

export const TAB_CONFIGS: TabConfig[] = [
  { id: TabType.HOME, label: "Home", icon: "Home" },
  { id: TabType.INTERVIEW, label: "Interview", icon: "Mic" },
  { id: TabType.LEADERBOARD, label: "Leaderboard", icon: "Trophy" },
  { id: TabType.PROFILE, label: "Profile", icon: "UserRound" },
];

export const STORAGE_KEYS = {
  currentTab: "iqlify_current_tab",
} as const;
