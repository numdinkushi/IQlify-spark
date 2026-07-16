import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@rainbow-me/rainbowkit",
      "wagmi",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: [
    "@iqlify-spark/config",
    "@iqlify-spark/domain",
    "@iqlify-spark/monad-rewards",
  ],
};

export default nextConfig;
