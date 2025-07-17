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
    default: "Iframe Viewer - Free Website Preview Tool",
    template: "%s | Iframe Viewer"
  },
  description: "Free online iframe viewer and website preview tool for developers and designers. Test website responsiveness across iPhone, iPad, Desktop, and custom device sizes instantly.",
  keywords: [
    "iframe viewer", "website preview", "responsive testing", "mobile preview", "device simulator", "web development tool", "iframe generator", "responsive design", "mobile testing", "device testing"
  ],
  authors: [{ name: "Iframe Viewer Team" }],
  creator: "Iframe Viewer",
  publisher: "Iframe Viewer",
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
    canonical: 'https://iframe.bobob.app',
    languages: {
      'en': 'https://iframe.bobob.app/?lang=en',
      'ko': 'https://iframe.bobob.app/?lang=ko', 
      'zh': 'https://iframe.bobob.app/?lang=zh',
      'ja': 'https://iframe.bobob.app/?lang=ja',
      'vi': 'https://iframe.bobob.app/?lang=vi',
    },
  },
  openGraph: {
    title: "Iframe Viewer - Free Website Preview Tool",
    description: "Test website responsiveness across different device sizes. Perfect for developers and designers testing responsive designs.",
    url: 'https://iframe.bobob.app',
    siteName: 'Iframe Viewer',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Iframe Viewer Tool Preview',
      },
    ],
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Iframe Viewer - Free Website Preview Tool",
    description: "Test website responsiveness across different device sizes instantly.",
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
        <link rel="alternate" hrefLang="en" href="https://iframe.bobob.app/?lang=en" />
        <link rel="alternate" hrefLang="ko" href="https://iframe.bobob.app/?lang=ko" />
        <link rel="alternate" hrefLang="zh" href="https://iframe.bobob.app/?lang=zh" />
        <link rel="alternate" hrefLang="ja" href="https://iframe.bobob.app/?lang=ja" />
        <link rel="alternate" hrefLang="vi" href="https://iframe.bobob.app/?lang=vi" />
        <link rel="alternate" hrefLang="x-default" href="https://iframe.bobob.app/" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Iframe Viewer",
              "description": "Free online iframe viewer and website preview tool for testing responsive designs across different device sizes.",
              "url": "https://iframe.bobob.app",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Website preview in iframe",
                "Responsive design testing",
                "Multiple device size simulation",
                "Mobile and desktop preview"
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
