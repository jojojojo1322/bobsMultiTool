import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bobob/ui"],
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig; 