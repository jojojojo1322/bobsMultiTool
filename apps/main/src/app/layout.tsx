import type { Metadata } from "next";
import { headers } from "next/headers";
import GoogleAdsense from "@/components/GoogleAdsense";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, languageAlternates, normalizeLocale, openGraphLocales } from "@/features/i18n/config";
import { getDictionary } from "@/features/i18n/dictionaries";
import "./globals.css";

const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "ca-pub-2620992505263949";
const adsenseEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE !== "false";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bobob.app"),
  title: {
    default: "bobob.app - 일단 해보는 Blog and Play",
    template: "%s | bobob.app",
  },
  description: "개발/AI 기록을 남기고, 짧게 눌러보는 Play를 하나씩 올리는 bobob.app입니다.",
  authors: [{ name: "Bob" }],
  creator: "bobob.app",
  publisher: "bobob.app",
  alternates: {
    canonical: "https://www.bobob.app",
    languages: languageAlternates("/"),
    types: {
      "application/rss+xml": "https://www.bobob.app/feed.xml",
      "application/atom+xml": "https://www.bobob.app/atom.xml",
      "application/feed+json": "https://www.bobob.app/feed.json",
      "application/opensearchdescription+xml": "https://www.bobob.app/opensearch.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: openGraphLocales.en,
    url: "https://www.bobob.app",
    siteName: "bobob.app",
    title: "bobob.app - 일단 해보는 Blog and Play",
    description: "막히면 적고, 떠오르면 만들고, 이상하면 다시 고치는 개발/AI 기록과 작은 Play.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bobob.app - 일단 해보는 Blog and Play",
    description: "개발/AI 기록과 짧게 눌러보는 작은 Play를 하나씩 올립니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "NtDt2jnqkwLbHi1k1NXyUCVEeIlUXhnwF82bf_3bgbY",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = normalizeLocale(headerList.get("x-bobob-locale") ?? undefined) ?? defaultLocale;
  const dictionary = getDictionary(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "bobob.app",
    alternateName: "일단 해보는 Blog and Play",
    url: "https://www.bobob.app",
    description: "개발/AI 기록을 남기고, 짧게 눌러보는 Play를 하나씩 올리는 bobob.app입니다.",
    inLanguage: locale,
    creator: {
      "@type": "Person",
      name: "Bob",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.bobob.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} dir={dictionary.dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="alternate" type="application/rss+xml" title="bobob.app Blog and Play Feed" href="https://www.bobob.app/feed.xml" />
        <link rel="alternate" type="application/atom+xml" title="bobob.app Blog and Play Atom Feed" href="https://www.bobob.app/atom.xml" />
        <link rel="alternate" type="application/feed+json" title="bobob.app Blog and Play JSON Feed" href="https://www.bobob.app/feed.json" />
        <link rel="search" type="application/opensearchdescription+xml" title="bobob.app Search" href="https://www.bobob.app/opensearch.xml" />
        <meta name="google-adsense-account" content="ca-pub-2620992505263949" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <GoogleAnalytics />
          <GoogleAdsense enabled={adsenseEnabled} publisherId={adsensePublisherId} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
