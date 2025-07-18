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
    // 한국어 키워드
    "개발자 도구", "iframe 뷰어", "정규식 테스터", "온라인 도구", "웹 개발", "무료 도구", 
    "반응형 테스트", "모바일 미리보기", "개발 유틸리티", "Bob's Multi Tool", "아이프레임 뷰어",
    "웹사이트 미리보기", "디바이스 테스트", "정규표현식", "regex 테스터", "개발자 툴",
    "프론트엔드 도구", "웹 디자인 도구", "레스폰시브 테스트", "모바일 호환성",
    
    // English keywords
    "developer tools", "iframe viewer", "regex tester", "online tools", "web development", "free tools", 
    "responsive testing", "mobile preview", "development utility", "website preview", "device simulator",
    "regular expression", "frontend tools", "web design tools", "mobile compatibility",
    
    // 中文关键词
    "开发者工具", "iframe查看器", "正则表达式测试", "在线工具", "网站开发", "免费工具",
    "响应式测试", "移动预览", "网站预览工具", "设备模拟器", "前端工具",
    
    // 日本語キーワード
    "開発者ツール", "iframeビューア", "正規表現テスター", "オンラインツール", "ウェブ開発", "無料ツール",
    "レスポンシブテスト", "モバイルプレビュー", "ウェブサイトプレビュー", "デバイスシミュレーター",
    
    // Tiếng Việt từ khóa
    "công cụ developer", "iframe viewer", "regex tester", "công cụ online", "phát triển web", "công cụ miễn phí",
    "kiểm tra responsive", "xem trước mobile", "công cụ phát triển web"
  ],
  authors: [{ name: "Bob's Multi Tool Team" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US', 'zh_CN', 'ja_JP', 'vi_VN'],
    url: 'https://bobob.app',
    siteName: "Bob's Multi Tool",
    title: "Bob's Multi Tool - 개발자를 위한 실용적인 온라인 도구들",
    description: "웹 개발하면서 자주 쓰는 도구들을 한 곳에 모았습니다. iframe 뷰어로 반응형 디자인 테스트하고, 정규식 테스터로 패턴 검증해보세요.",
    images: [
      {
        url: 'https://bobob.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "Bob's Multi Tool - Developer Tools Collection",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bob's Multi Tool - 개발자를 위한 실용적인 온라인 도구들",
    description: "iframe 뷰어, 정규식 테스터 등 웹 개발 필수 도구들을 무료로 제공합니다.",
    images: ['https://bobob.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://bobob.app',
    languages: {
      'ko-KR': 'https://bobob.app?lang=ko',
      'en-US': 'https://bobob.app?lang=en',
      'zh-CN': 'https://bobob.app?lang=zh',
      'ja-JP': 'https://bobob.app?lang=ja',
      'vi-VN': 'https://bobob.app?lang=vi',
    },
  },
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
    google: 'NtDt2jnqkwLbHi1k1NXyUCVEeIlUXhnwF82bf_3bgbY',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
      'msvalidate.01': 'your-bing-verification-code',
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
    "@type": "WebSite",
    "name": "Bob's Multi Tool",
    "alternateName": "Bob's Multi Tool - 개발자 도구 모음집",
    "url": "https://bobob.app",
    "description": "웹 개발하면서 자주 쓰는 도구들을 한 곳에 모았습니다. iframe 뷰어로 반응형 디자인 테스트하고, 정규식 테스터로 패턴 검증해보세요.",
    "inLanguage": ["ko", "en", "zh", "ja", "vi"],
    "creator": {
      "@type": "Organization",
      "name": "Bob's Multi Tool Team"
    },
    "mainEntity": [
      {
        "@type": "SoftwareApplication",
        "name": "Iframe Viewer",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "description": "다양한 디바이스 크기로 웹사이트를 미리보기할 수 있는 개발자 도구",
        "url": "https://iframe.bobob.app",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "SoftwareApplication", 
        "name": "RegAx - Regular Expression Tester",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "description": "정규식 패턴을 테스트하고 검증할 수 있는 강력한 도구",
        "url": "https://regax.bobob.app",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bobob.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
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
