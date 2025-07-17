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
    default: "Bob's Multi Tool - 개발자를 위한 실용적인 온라인 도구들",
    template: "%s | Bob's Multi Tool"
  },
  description: "웹 개발하면서 자주 쓰는 도구들을 한 곳에 모았습니다. iframe 뷰어로 반응형 디자인 테스트하고, 정규식 테스터로 패턴 검증해보세요. 무료로 사용 가능합니다.",
  keywords: [
    "개발자 도구", "iframe 뷰어", "정규식 테스터", "온라인 도구", "웹 개발", "무료 도구", 
    "반응형 테스트", "모바일 미리보기", "개발 유틸리티", "Bob's Multi Tool"
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
    canonical: 'https://bobob.app',
    languages: {
      'ko': 'https://bobob.app/?lang=ko',
      'en': 'https://bobob.app/?lang=en',
      'zh': 'https://bobob.app/?lang=zh',
      'ja': 'https://bobob.app/?lang=ja',
      'vi': 'https://bobob.app/?lang=vi',
    },
  },
  openGraph: {
    title: "Bob's Multi Tool - 개발자를 위한 실용적인 온라인 도구들",
    description: "웹 개발하면서 자주 쓰는 iframe 뷰어, 정규식 테스터 등을 무료로 사용해보세요.",
    url: 'https://bobob.app',
    siteName: "Bob's Multi Tool",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Bob's Multi Tool - 개발자 도구 모음집",
      },
    ],
    locale: 'ko_KR',
    alternateLocale: ['en_US', 'zh_CN', 'ja_JP', 'vi_VN'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bob's Multi Tool - 개발자를 위한 실용적인 온라인 도구들",
    description: "웹 개발하면서 자주 쓰는 iframe 뷰어, 정규식 테스터 등을 무료로 사용해보세요.",
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 성능 최적화를 위한 프리커넥트 */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* 파비콘 설정 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 구조화된 데이터 - 검색엔진 최적화용 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Bob's Multi Tool",
              "description": "웹 개발자를 위한 실용적인 온라인 도구 모음집입니다. iframe 뷰어, 정규식 테스터 등 개발 작업에 필요한 도구들을 무료로 제공합니다.",
              "url": "https://bobob.app",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "browserRequirements": "JavaScript 필요, HTML5 지원",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "author": {
                "@type": "Organization",
                "name": "Bob's Multi Tool"
              },
              "provider": {
                "@type": "Organization",
                "name": "Bob's Multi Tool",
                "url": "https://bobob.app"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 구글 애널리틱스 */}
        <GoogleAnalytics />
        
        {/* 구글 애드센스 */}
        <GoogleAdsense />
        
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
