import type { RewardClaimDraft } from "@iqlify-spark/domain";

export interface RewardContractConfig {
  contractAddress: `0x${string}`;
  chainId: number;
}

/**
 * Client helpers for the on-chain reward distributor will live here.
 * Contracts are deployed from apps/contracts.
 */
export function isRewardContractConfigured(
  config: Partial<RewardContractConfig>,
): config is RewardContractConfig {
  return Boolean(
    config.contractAddress &&
      config.contractAddress !== "0x" &&
      config.chainId,
  );
}

export function formatRewardClaimLabel(claim: RewardClaimDraft): string {
  return `Claim ${claim.amountWei} wei for interview ${claim.interviewId}`;
}
