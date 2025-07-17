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
    default: "Iframe Viewer - Free Website Preview Tool | 무료 웹사이트 미리보기 도구",
    template: "%s | Iframe Viewer"
  },
  description: "Free online iframe viewer and website preview tool for developers and designers. Test website responsiveness across iPhone, iPad, Desktop, and custom device sizes instantly. 무료 온라인 iframe 뷰어로 다양한 디바이스에서 웹사이트를 미리보기하세요.",
  keywords: [
    // English keywords
    "iframe viewer", "website preview", "responsive testing", "mobile preview", "device simulator", 
    "web development tool", "iframe generator", "responsive design", "mobile testing", "device testing",
    "online iframe viewer", "website preview tool", "mobile simulator", "tablet simulator", "desktop preview",
    "web design testing", "frontend testing", "ui testing", "cross-device testing", "browser testing",
    
    // 한국어 키워드
    "iframe 뷰어", "아이프레임 뷰어", "웹사이트 미리보기", "반응형 테스트", "모바일 미리보기", "디바이스 시뮬레이터",
    "웹 개발 도구", "아이프레임 생성기", "반응형 디자인", "모바일 테스트", "디바이스 테스트",
    "온라인 iframe 뷰어", "웹사이트 프리뷰", "모바일 시뮬레이터", "태블릿 시뮬레이터", "데스크톱 미리보기",
    "웹 디자인 테스트", "프론트엔드 테스트", "UI 테스트", "크로스 디바이스 테스트", "브라우저 테스트",
    "레스폰시브 웹", "모바일 호환성", "웹사이트 반응형", "디바이스 호환성",
    
    // 中文关键词
    "iframe查看器", "网站预览", "响应式测试", "移动预览", "设备模拟器", "网页开发工具",
    "iframe生成器", "响应式设计", "移动测试", "设备测试", "在线iframe查看器",
    "网站预览工具", "移动模拟器", "平板模拟器", "桌面预览", "网页设计测试",
    
    // 日本語キーワード
    "iframeビューア", "ウェブサイトプレビュー", "レスポンシブテスト", "モバイルプレビュー", "デバイスシミュレーター",
    "ウェブ開発ツール", "iframe生成器", "レスポンシブデザイン", "モバイルテスト", "デバイステスト",
    "オンラインiframeビューア", "ウェブサイトプレビューツール", "モバイルシミュレーター",
    
    // Tiếng Việt từ khóa
    "iframe viewer", "xem trước website", "kiểm tra responsive", "xem trước mobile", "mô phỏng thiết bị",
    "công cụ phát triển web", "trình tạo iframe", "thiết kế responsive", "test mobile", "test thiết bị"
  ],
  authors: [{ name: "Iframe Viewer Team" }],
  creator: "Iframe Viewer",
  publisher: "Iframe Viewer",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    url: 'https://iframe.bobob.app',
    siteName: "Iframe Viewer",
    title: "Iframe Viewer - Free Website Preview Tool",
    description: "Free online iframe viewer and website preview tool. Test website responsiveness across iPhone, iPad, Desktop, and custom device sizes instantly.",
    images: [
      {
        url: 'https://iframe.bobob.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "Iframe Viewer - Free Website Preview Tool",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Iframe Viewer - Free Website Preview Tool",
    description: "Test website responsiveness across iPhone, iPad, Desktop, and custom device sizes instantly.",
    images: ['https://iframe.bobob.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://iframe.bobob.app',
    languages: {
      'en-US': 'https://iframe.bobob.app?lang=en',
      'ko-KR': 'https://iframe.bobob.app?lang=ko', 
      'zh-CN': 'https://iframe.bobob.app?lang=zh',
      'ja-JP': 'https://iframe.bobob.app?lang=ja',
      'vi-VN': 'https://iframe.bobob.app?lang=vi',
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
    google: 'your-google-site-verification',
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
    "name": "Iframe Viewer",
    "alternateName": [
      "Free Website Preview Tool",
      "iframe 뷰어",
      "웹사이트 미리보기 도구",
      "iframe查看器",
      "iframeビューア"
    ],
    "url": "https://iframe.bobob.app",
    "description": "Free online iframe viewer and website preview tool for developers and designers. Test website responsiveness across iPhone, iPad, Desktop, and custom device sizes instantly.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": ["en", "ko", "zh", "ja", "vi"],
    "browserRequirements": "JavaScript required, HTML5 support",
    "featureList": [
      "Mobile device simulation (iPhone, iPad, Galaxy)",
      "Desktop preview (Laptop, 4K Desktop)",
      "Custom device size testing",
      "Real-time responsive testing",
      "iframe code generation",
      "Cross-device compatibility testing"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "Iframe Viewer Team"
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
      "iframe viewer", "website preview", "responsive testing", "mobile preview", "device simulator",
      "iframe 뷰어", "웹사이트 미리보기", "반응형 테스트", "모바일 미리보기", "디바이스 시뮬레이터",
      "iframe查看器", "网站预览", "响应式测试", "移动预览", "设备模拟器",
      "iframeビューア", "ウェブサイトプレビュー", "レスポンシブテスト", "モバイルプレビュー", "デバイスシミュレーター"
    ]
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
