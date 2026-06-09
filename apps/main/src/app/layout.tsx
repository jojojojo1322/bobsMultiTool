import type { Metadata } from "next";
import { headers } from "next/headers";
import GoogleAdsense from "@/components/GoogleAdsense";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, languageAlternates, normalizeLocale, openGraphLocales } from "@/features/i18n/config";
import { getDictionary } from "@/features/i18n/dictionaries";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bobob.app"),
  title: {
    default: "Bob's Multi Tool - Practical Developer Utilities",
    template: "%s | Bob's Multi Tool",
  },
  description:
    "A focused workbench of free developer tools for regex testing, cron expressions, meta tags, JSON formatting, JWT decoding, URL encoding, Base64, timestamps, UUIDs, iframe previews, and placeholder text.",
  authors: [{ name: "Bob" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",
  alternates: {
    canonical: "https://www.bobob.app",
    languages: languageAlternates("/"),
  },
  openGraph: {
    type: "website",
    locale: openGraphLocales.en,
    url: "https://www.bobob.app",
    siteName: "Bob's Multi Tool",
    title: "Bob's Multi Tool - Practical Developer Utilities",
    description:
      "A practical developer workbench with fast utilities, clear examples, and search-friendly guides.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bob's Multi Tool - Practical Developer Utilities",
    description: "Free online tools for everyday developer workflows.",
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
    name: "Bob's Multi Tool",
    alternateName: "Bobob Developer Utilities",
    url: "https://www.bobob.app",
    description: dictionary.siteDescription,
    inLanguage: locale,
    creator: {
      "@type": "Person",
      name: "Bob",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.bobob.app/tools?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} dir={dictionary.dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <meta name="google-adsense-account" content="ca-pub-2620992505263949" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <GoogleAnalytics />
          <GoogleAdsense publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
