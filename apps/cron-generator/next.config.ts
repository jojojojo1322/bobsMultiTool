import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bobob/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://www.bobob.app/tools/cron-generator",
        permanent: true,
      },
    ];
  },
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
