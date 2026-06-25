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
    default: "bobob.app - Blog and Play Lab",
    template: "%s | Bob's Multi Tool",
  },
  description:
    "A lightweight Blog + Play content lab for development and AI notes, static web games, and archived developer tools.",
  authors: [{ name: "Bob" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",
  alternates: {
    canonical: "https://www.bobob.app",
    languages: languageAlternates("/"),
    types: {
      "application/rss+xml": "https://www.bobob.app/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: openGraphLocales.en,
    url: "https://www.bobob.app",
    siteName: "bobob.app",
    title: "bobob.app - Blog and Play Lab",
    description:
      "Short reads and interactive Play content, with the original developer tools kept as an archive.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bobob.app - Blog and Play Lab",
    description: "Short reads, interactive Play content, and archived developer tools.",
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
    alternateName: "Bobob Blog and Play Lab",
    url: "https://www.bobob.app",
    description: "A lightweight Blog + Play content lab for development and AI notes, static web games, and archived developer tools.",
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
