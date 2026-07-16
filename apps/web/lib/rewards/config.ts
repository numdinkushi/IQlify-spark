import {
  getMonadNetworkConfig,
  resolveMonadNetwork,
  resolveRewardContractAddress,
} from "@iqlify-spark/config";

/**
 * Single source of truth for the active Monad network + reward contract.
 * Works on both server (API routes) and client (NEXT_PUBLIC_ vars are inlined).
 */
export function getActiveRewardConfig() {
  const network = resolveMonadNetwork(process.env.NEXT_PUBLIC_MONAD_NETWORK);
  const networkConfig = getMonadNetworkConfig(network);

  const contractAddress = resolveRewardContractAddress(network, {
    testnet: process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS_TESTNET,
    mainnet: process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS_MAINNET,
    fallback: process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS,
  }) as `0x${string}` | undefined;

  return {
    network,
    chainId: networkConfig.chainId,
    explorerUrl: networkConfig.explorerUrl,
    contractAddress,
  };
}
