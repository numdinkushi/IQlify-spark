import type { RewardClaimDraft } from "@iqlify-spark/domain";

export interface RewardContractConfig {
  contractAddress: `0x${string}`;
  chainId: number;
}

export const REWARD_DISTRIBUTOR_ABI = [
  {
    type: "function",
    name: "claimWithSignature",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "referralTag", type: "bytes32" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getContractBalance",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "usedNonce",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "RewardClaimed",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "nonce", type: "uint256", indexed: false },
      { name: "referralTag", type: "bytes32", indexed: false },
    ],
  },
] as const;

export const EIP712_DOMAIN_NAME = "IQlifyRewardDistributor";
export const EIP712_DOMAIN_VERSION = "2";

export const CLAIM_TYPED_DATA = {
  Claim: [
    { name: "user", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "referralTag", type: "bytes32" },
  ],
};

export const ZERO_REFERRAL_TAG =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

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
