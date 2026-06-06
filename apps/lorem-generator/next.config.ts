import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://www.bobob.app/tools/lorem-ipsum-generator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
