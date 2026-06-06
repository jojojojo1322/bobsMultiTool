import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "bobob.app" }],
        destination: "https://www.bobob.app/:path*",
        permanent: true,
      },
      {
        source: "/iframe-viewer",
        destination: "/tools/iframe-viewer",
        permanent: true,
      },
      {
        source: "/regax",
        destination: "/tools/regex-tester",
        permanent: true,
      },
      {
        source: "/cron-generator",
        destination: "/tools/cron-generator",
        permanent: true,
      },
      {
        source: "/meta-generator",
        destination: "/tools/meta-tag-generator",
        permanent: true,
      },
      {
        source: "/lorem-generator",
        destination: "/tools/lorem-ipsum-generator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
