import { monad, monadTestnet } from "wagmi/chains";

import { resolveMonadNetwork } from "@iqlify-spark/config";

const network = resolveMonadNetwork(process.env.NEXT_PUBLIC_MONAD_NETWORK);

export const activeChain = network === "mainnet" ? monad : monadTestnet;
