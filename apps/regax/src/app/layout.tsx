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
    default: "RegAx - Regular Expression Tester | 정규식 테스터 | Bob's Multi Tool",
    template: "%s | RegAx"
  },
  description: "Free online regular expression tester and validator. Test regex patterns with real-time matching, syntax highlighting, and detailed explanations. Perfect for developers and programmers. 무료 온라인 정규식 테스터로 실시간 패턴 매칭 테스트를 해보세요.",
  keywords: [
    // English keywords
    "regex tester", "regular expression", "regex validator", "pattern matching", "regex tool", "regex testing", 
    "RegAx", "Bob's Multi Tool", "regex debugger", "pattern validator", "regex online", "regex editor",
    "regular expression tester", "regex pattern", "regex match", "regex syntax", "regex builder",
    "regex generator", "regex analyzer", "regex checker", "regex parser", "regex engine",
    
    // 한국어 키워드
    "정규식 테스터", "정규표현식", "regex 테스터", "패턴 매칭", "정규식 도구", "정규식 테스트",
    "RegAx", "Bob's Multi Tool", "정규식 디버거", "패턴 검증기", "온라인 정규식", "정규식 에디터",
    "정규표현식 테스터", "정규식 패턴", "정규식 매치", "정규식 문법", "정규식 빌더",
    "정규식 생성기", "정규식 분석기", "정규식 체커", "정규식 파서", "정규식 엔진",
    "regex 온라인", "정규식 검증", "패턴 테스트", "문자열 매칭", "정규식 문법 검사",
    
    // 中文关键词
    "正则表达式测试", "正则表达式", "正则验证器", "模式匹配", "正则工具", "正则测试",
    "正则表达式调试", "模式验证器", "在线正则", "正则编辑器", "正则表达式测试器",
    "正则模式", "正则匹配", "正则语法", "正则构建器", "正则生成器",
    
    // 日本語キーワード
    "正規表現テスター", "正規表現", "正規表現バリデーター", "パターンマッチング", "正規表現ツール", "正規表現テスト",
    "正規表現デバッガー", "パターンバリデーター", "オンライン正規表現", "正規表現エディター",
    "正規表現テスター", "正規表現パターン", "正規表現マッチ", "正規表現構文", "正規表現ビルダー",
    
    // Tiếng Việt từ khóa
    "regex tester", "biểu thức chính quy", "regex validator", "khớp mẫu", "công cụ regex", "test regex",
    "regex debugger", "trình xác thực mẫu", "regex online", "trình chỉnh sửa regex", "kiểm tra regex"
  ],
  authors: [{ name: "Bob's Multi Tool Team" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",

  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    url: 'https://regax.bobob.app',
    siteName: "RegAx - Regular Expression Tester",
    title: "RegAx - Regular Expression Tester | Free Online Regex Tool",
    description: "Free online regular expression tester and validator. Test regex patterns with real-time matching, syntax highlighting, and detailed explanations.",
    images: [
      {
        url: 'https://regax.bobob.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "RegAx - Regular Expression Tester",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "RegAx - Regular Expression Tester | Free Online Regex Tool",
    description: "Test regex patterns with real-time matching, syntax highlighting, and detailed explanations. Perfect for developers.",
    images: ['https://regax.bobob.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://regax.bobob.app',
    languages: {
      'en-US': 'https://regax.bobob.app?lang=en',
      'ko-KR': 'https://regax.bobob.app?lang=ko',
      'zh-CN': 'https://regax.bobob.app?lang=zh',
      'ja-JP': 'https://regax.bobob.app?lang=ja',
      'vi-VN': 'https://regax.bobob.app?lang=vi',
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
    "@type": "SoftwareApplication",
    "name": "RegAx",
    "alternateName": [
      "Regular Expression Tester",
      "정규식 테스터",
      "정규표현식 테스터",
      "正则表达式测试",
      "正規表現テスター",
      "Regex Tester"
    ],
    "url": "https://regax.bobob.app",
    "description": "Free online regular expression tester and validator. Test regex patterns with real-time matching, syntax highlighting, and detailed explanations. Perfect for developers and programmers.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": ["en", "ko", "zh", "ja", "vi"],
    "browserRequirements": "JavaScript required, HTML5 support",
    "featureList": [
      "Real-time regex pattern testing",
      "Syntax highlighting",
      "Pattern explanation and debugging",
      "Multiple test string support",
      "Regex flags support (g, i, m)",
      "Match results highlighting",
      "Pattern validation"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "Bob's Multi Tool Team"
    },
    "provider": {
      "@type": "Organization",
      "name": "Bob's Multi Tool",
      "url": "https://bobob.app"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Bob's Multi Tool",
      "url": "https://bobob.app"
    },
    "keywords": [
      "regex tester", "regular expression", "regex validator", "pattern matching", "regex tool",
      "정규식 테스터", "정규표현식", "패턴 매칭", "정규식 도구", "정규식 테스트",
      "正则表达式测试", "正则表达式", "正则验证器", "模式匹配", "正则工具",
      "正規表現テスター", "正規表現", "正規表現バリデーター", "パターンマッチング", "正規表現ツール",
      "regex debugger", "pattern validator", "regex online", "regex editor"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": [
        "Developers",
        "Programmers", 
        "Web Developers",
        "Software Engineers",
        "Data Scientists"
      ]
    }
  };

  return (
    <html lang="en">
      <head>
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
