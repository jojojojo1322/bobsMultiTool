import type { NextConfig } from "next";

const retiredSitemapLocales = ["ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"] as const;
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.googlesyndication.com https://*.googleadservices.com https://*.g.doubleclick.net https://*.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.googlesyndication.com https://*.googleadservices.com https://*.g.doubleclick.net https://*.google.com https://*.adtrafficquality.google",
  "frame-src 'self' https://*.googlesyndication.com https://*.g.doubleclick.net https://*.google.com https://*.adtrafficquality.google",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' data: blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
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
