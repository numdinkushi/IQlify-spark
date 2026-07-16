import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@rainbow-me/rainbowkit",
      "wagmi",
    ],
  },
  transpilePackages: [
    "@iqlify-spark/config",
    "@iqlify-spark/domain",
    "@iqlify-spark/monad-rewards",
  ],
};

export default nextConfig;
