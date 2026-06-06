import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://www.bobob.app/tools/iframe-viewer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
