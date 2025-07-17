import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/contexts/TranslationContext";
import GoogleAdsense from "@/components/GoogleAdsense";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RegAx - Regular Expression Tester | Bob's Multi Tool",
    template: "%s | RegAx"
  },
  description: "Free online regular expression tester and validator. Test regex patterns with real-time matching, syntax highlighting, and detailed explanations. Perfect for developers and programmers.",
  keywords: [
    "regex tester", "regular expression", "regex validator", "pattern matching", "regex tool", "regex testing", "RegAx", "Bob's Multi Tool", "regex debugger", "pattern validator"
  ],
  authors: [{ name: "Bob's Multi Tool Team" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  alternates: {
    canonical: 'https://regax.bobob.app',
    languages: {
      'en': 'https://regax.bobob.app/?lang=en',
      'ko': 'https://regax.bobob.app/?lang=ko', 
      'zh': 'https://regax.bobob.app/?lang=zh',
      'ja': 'https://regax.bobob.app/?lang=ja',
      'vi': 'https://regax.bobob.app/?lang=vi',
    },
  },
  openGraph: {
    title: "RegAx - Regular Expression Tester",
    description: "Test regex patterns with real-time matching and syntax highlighting. Free online regex tool for developers.",
    url: 'https://regax.bobob.app',
    siteName: 'RegAx - Bob\'s Multi Tool',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RegAx - Regular Expression Tester',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "RegAx - Regular Expression Tester",
    description: "Test regex patterns with real-time matching and syntax highlighting.",
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Favicon 설정 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 다국어 SEO를 위한 hreflang 설정 */}
        <link rel="alternate" hrefLang="en" href="https://regax.bobob.app/?lang=en" />
        <link rel="alternate" hrefLang="ko" href="https://regax.bobob.app/?lang=ko" />
        <link rel="alternate" hrefLang="zh" href="https://regax.bobob.app/?lang=zh" />
        <link rel="alternate" hrefLang="ja" href="https://regax.bobob.app/?lang=ja" />
        <link rel="alternate" hrefLang="vi" href="https://regax.bobob.app/?lang=vi" />
        <link rel="alternate" hrefLang="x-default" href="https://regax.bobob.app/" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "RegAx - Regular Expression Tester",
              "description": "Free online regular expression tester and validator with real-time matching and syntax highlighting.",
              "url": "https://regax.bobob.app",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Real-time regex testing",
                "Syntax highlighting",
                "Pattern matching visualization",
                "Regex explanation and debugging"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* Google AdSense */}
        <GoogleAdsense />
        
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
