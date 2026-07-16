export enum ProfileSubTab {
  Details = "details",
  Wallet = "wallet",
  Interviews = "interviews",
}

export const PROFILE_SUB_TABS = [
  ProfileSubTab.Details,
  ProfileSubTab.Wallet,
  ProfileSubTab.Interviews,
] as const;

export const PROFILE_SUB_TAB_LABELS: Record<ProfileSubTab, string> = {
  [ProfileSubTab.Details]: "Details",
  [ProfileSubTab.Wallet]: "Wallet",
  [ProfileSubTab.Interviews]: "Interviews",
};
