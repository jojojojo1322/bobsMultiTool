import type { NextConfig } from "next";

const retiredSitemapLocales = ["ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "bobob.app" }],
        destination: "https://www.bobob.app/:path*",
        permanent: true,
      },
      ...retiredSitemapLocales.map((locale) => ({
        source: `/sitemaps/${locale}`,
        destination: "https://www.bobob.app/sitemaps/en",
        permanent: true,
      })),
      {
        source: "/iframe-viewer",
        destination: "/tools/iframe-viewer",
        permanent: true,
      },
      {
        source: "/tools/base64-encoder-decoder",
        destination: "/tools/base64-tool",
        permanent: true,
      },
      {
        source: "/:locale/tools/base64-encoder-decoder",
        destination: "/:locale/tools/base64-tool",
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
