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
    default: "Meta Tag Generator - SEO Meta Tags Generator | Bob's Multi Tool",
    template: "%s | Meta Tag Generator"
  },
  description: "무료 메타태그 생성기! SEO 최적화를 위한 HTML 메타태그를 쉽게 생성하세요. title, description, Open Graph, X 카드, robots 메타태그까지 한번에 만들어 구글 검색 순위를 높이세요. 개발자와 마케터 필수 도구입니다.",
  keywords: [
    // English keywords
    "meta tag generator", "SEO meta tags", "HTML meta generator", "Open Graph generator", "X card generator", "Twitter card generator", 
    "meta description generator", "robots meta tag", "canonical URL generator", "SEO optimization tool", "free meta tag tool",
    "website meta tags", "search engine optimization", "social media meta tags", "Facebook Open Graph", "X cards", "Twitter cards",
    
    // 한국어 키워드
    "메타 태그 생성기", "SEO 메타 태그", "HTML 메타 생성기", "오픈 그래프 생성기", "X 카드 생성기", "트위터 카드 생성기",
    "메타 설명 생성기", "로봇 메타 태그", "정규 URL 생성기", "SEO 최적화 도구", "무료 메타 태그 도구",
    "웹사이트 메타 태그", "검색 엔진 최적화", "소셜 미디어 메타 태그", "페이스북 오픈 그래프", "X 카드", "트위터 카드",
    
    // 中文关键词
    "元标签生成器", "SEO元标签", "HTML元生成器", "Open Graph生成器", "X卡片生成器", "Twitter卡片生成器",
    "元描述生成器", "机器人元标签", "规范URL生成器", "SEO优化工具", "免费元标签工具",
    
    // 日本語キーワード
    "メタタグジェネレーター", "SEOメタタグ", "HTMLメタ生成器", "Open Graphジェネレーター", "Xカードジェネレーター", "Twitterカードジェネレーター",
    "メタ説明ジェネレーター", "ロボットメタタグ", "正規URLジェネレーター", "SEO最適化ツール", "無料メタタグツール",
    
    // Tiếng Việt từ khóa
    "trình tạo meta tag", "SEO meta tag", "tạo meta HTML", "Open Graph generator", "X card generator", "Twitter card generator",
    "tạo meta description", "robots meta tag", "canonical URL generator", "công cụ SEO"
  ],
  authors: [{ name: "Bob's Multi Tool Team" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",

  alternates: {
    canonical: 'https://meta.bobob.app',
    languages: {
      'ko-KR': 'https://meta.bobob.app?lang=ko',
      'en-US': 'https://meta.bobob.app?lang=en',
      'zh-CN': 'https://meta.bobob.app?lang=zh',
      'ja-JP': 'https://meta.bobob.app?lang=ja',
      'vi-VN': 'https://meta.bobob.app?lang=vi',
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    url: 'https://meta.bobob.app',
    siteName: "Meta Tag Generator",
    title: "Meta Tag Generator - SEO Meta Tags Generator",
    description: "Generate HTML meta tags for SEO optimization. Create title, description, Open Graph, Twitter cards, and robots meta tags for better search engine ranking.",
    images: [
      {
        url: 'https://meta.bobob.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "Meta Tag Generator - SEO Meta Tags Generator",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Meta Tag Generator - SEO Meta Tags Generator",
    description: "Generate HTML meta tags for SEO optimization. Create title, description, Open Graph, X cards (formerly Twitter), and robots meta tags.",
    images: ['https://meta.bobob.app/og-image.png'],
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
    google: 'NtDt2jnqkwLbHi1k1NXyUCVEeIlUXhnwF82bf_3bgbY',
    other: {
      'naver-site-verification': 'naver-webmaster-verification',
      'msvalidate.01': 'bing-webmaster-verification',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Meta Tag Generator",
    "alternateName": ["SEO Meta Tags Generator", "X Card Generator", "메타 태그 생성기", "元标签生成器", "メタタグジェネレーター"],
    "url": "https://meta.bobob.app",
    "description": "Generate HTML meta tags for SEO optimization. Create title, description, Open Graph, Twitter cards, and robots meta tags for better search engine ranking.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "permissions": "browser",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Bob's Multi Tool",
      "url": "https://bobob.app"
    },
    "creator": {
      "@type": "Organization",
      "name": "Bob's Multi Tool Team"
    },
    "featureList": [
      "Basic Meta Tags Generation",
      "Open Graph Tags for Social Media", 
      "X Card Generation (formerly Twitter)",
      "Twitter Card Generation",
      "Robots Meta Tags",
      "SEO Optimization Tools",
      "Multi-language Support"
    ],
    "keywords": "meta tag generator, SEO meta tags, HTML meta generator, Open Graph generator, X card generator, Twitter card generator, 메타 태그 생성기, 元标签生成器, メタタグジェネレーター",
    "inLanguage": ["ko", "en", "zh", "ja", "vi"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "128"
    },
    "screenshot": "https://meta.bobob.app/screenshot.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2025-07-24",
    "dateModified": "2025-07-24",
    "audience": {
      "@type": "Audience",
      "audienceType": ["Web Developers", "SEO Specialists", "Digital Marketers", "Content Creators"]
    },
    "provider": {
      "@type": "Organization",
      "name": "Bob's Multi Tool",
      "url": "https://bobob.app",
      "logo": "https://bobob.app/logo.png"
    }
  };

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider>
          <GoogleAnalytics />
          <GoogleAdsense />
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
} 