import path from "node:path";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

// Load monorepo root .env so DEPLOYER_PRIVATE_KEY etc. are available
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONAD_TESTNET_RPC =
  process.env.MONAD_TESTNET_RPC_URL ?? "https://testnet-rpc.monad.xyz";
const MONAD_MAINNET_RPC =
  process.env.MONAD_MAINNET_RPC_URL ?? "https://rpc.monad.xyz";

const deployerAccounts = process.env.DEPLOYER_PRIVATE_KEY
  ? [process.env.DEPLOYER_PRIVATE_KEY]
  : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    monadTestnet: {
      url: MONAD_TESTNET_RPC,
      chainId: 10143,
      accounts: deployerAccounts,
    },
    monadMainnet: {
      url: MONAD_MAINNET_RPC,
      chainId: 143,
      accounts: deployerAccounts,
    },
  },
};

export default config;
