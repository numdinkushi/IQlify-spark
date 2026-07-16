export type MonadNetwork = "testnet" | "mainnet";

export interface MonadNetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currencySymbol: string;
}

export const MONAD_NETWORKS: Record<MonadNetwork, MonadNetworkConfig> = {
  testnet: {
    chainId: 10143,
    name: "Monad Testnet",
    rpcUrl: "https://testnet-rpc.monad.xyz",
    explorerUrl: "https://testnet.monadvision.com",
    currencySymbol: "MON",
  },
  mainnet: {
    chainId: 143,
    name: "Monad",
    rpcUrl: "https://rpc.monad.xyz",
    explorerUrl: "https://monadvision.com",
    currencySymbol: "MON",
  },
};

export const ACTIVE_MONAD_NETWORK_ENV_KEY = "NEXT_PUBLIC_MONAD_NETWORK";

export function resolveMonadNetwork(
  value: string | undefined,
): MonadNetwork {
  return value === "mainnet" ? "mainnet" : "testnet";
}

export function getMonadNetworkConfig(
  network: MonadNetwork,
): MonadNetworkConfig {
  return MONAD_NETWORKS[network];
}

export function resolveMonadRpcUrl(
  network: MonadNetwork,
  override?: string,
): string {
  return override?.trim() || MONAD_NETWORKS[network].rpcUrl;
}

export function resolveMonadChainId(
  network: MonadNetwork,
  override?: string,
): number {
  const parsed = Number(override);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : MONAD_NETWORKS[network].chainId;
}

/**
 * Pick the reward contract address for the active network.
 * Falls back to the legacy single-address var so old envs keep working.
 */
export function resolveRewardContractAddress(
  network: MonadNetwork,
  addresses: {
    testnet?: string;
    mainnet?: string;
    fallback?: string;
  },
): string | undefined {
  const preferred =
    network === "mainnet" ? addresses.mainnet : addresses.testnet;
  const value = preferred?.trim() || addresses.fallback?.trim();
  return value && value.startsWith("0x") && value.length === 42
    ? value
    : undefined;
}
