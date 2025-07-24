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
    default: "Cron Expression Generator & Visualizer | Cron 표현식 생성기 | Bob's Multi Tool",
    template: "%s | Cron Generator"
  },
  description: "무료 크론 표현식 생성기! 실시간 스케줄링 미리보기로 cron job을 쉽게 생성하고 검증하세요. 개발자와 시스템 관리자를 위한 필수 온라인 크론탭 도구입니다. Unix/Linux 서버 작업 스케줄링이 간편해집니다.",
  keywords: [
    // English keywords
    "cron generator", "cron expression", "cron validator", "cron scheduler", "cron job", "cron syntax",
    "crontab", "cron maker", "cron builder", "schedule generator", "unix cron", "linux cron",
    "cron visualizer", "cron parser", "cron online", "free cron tool", "cron schedule",
    
    // Korean keywords  
    "크론 생성기", "크론 표현식", "크론 스케줄러", "크론 작업", "크론탭", "크론 생성",
    "크론 시각화", "스케줄 생성기", "크론 도구", "크론 온라인", "무료 크론",
    
    // Chinese keywords
    "cron生成器", "cron表达式", "cron调度器", "cron任务", "定时任务", "计划任务",
    
    // Japanese keywords
    "cronジェネレーター", "cron式", "cronスケジューラー", "cronジョブ", "スケジュール生成",
    
    // Vietnamese keywords
    "tạo cron", "biểu thức cron", "lập lịch cron", "công cụ cron", "cron trực tuyến"
  ],
  authors: [{ name: "Bob's Multi Tool Team" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",

  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    url: 'https://cron.bobob.app',
    siteName: "Cron Expression Generator & Visualizer",
    title: "Cron Expression Generator & Visualizer | Free Online Cron Tool",
    description: "Free online cron expression generator and visualizer. Create and validate cron jobs with real-time scheduling preview. Perfect for developers and system administrators.",
    images: [
      {
        url: 'https://cron.bobob.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "Cron Expression Generator & Visualizer",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cron Expression Generator & Visualizer | Free Online Cron Tool",
    description: "Create and validate cron jobs with real-time scheduling preview. Perfect for developers, system administrators, and sharing on X (formerly Twitter).",
    images: ['https://cron.bobob.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://cron.bobob.app',
    languages: {
      'en-US': 'https://cron.bobob.app?lang=en',
      'ko-KR': 'https://cron.bobob.app?lang=ko',
      'zh-CN': 'https://cron.bobob.app?lang=zh',
      'ja-JP': 'https://cron.bobob.app?lang=ja',
      'vi-VN': 'https://cron.bobob.app?lang=vi',
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
      'naver-site-verification': 'f15442a32b31aaee5a69ce6d567c1f0ef7645207',
      'msvalidate.01': 'B686D7507360E4F71A5FB51889F3D858',
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
    "name": "Cron Expression Generator & Visualizer",
    "alternateName": ["Cron Generator", "크론 생성기", "Cron表达式生成器", "Cronジェネレーター", "Tạo biểu thức Cron"],
    "url": "https://cron.bobob.app",
    "description": "Free online cron expression generator and visualizer. Create and validate cron jobs with real-time scheduling preview. Perfect for developers and system administrators.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "featureList": [
      "Cron Expression Generation",
      "Real-time Schedule Preview", 
      "Cron Validation",
      "Common Pattern Library",
      "Multi-language Support",
      "Copy-to-clipboard Functionality"
    ],
    "keywords": "cron generator, cron expression, cron validator, cron scheduler, cron job, crontab, schedule generator",
    "inLanguage": ["en", "ko", "zh", "ja", "vi"],
    "isPartOf": {
      "@type": "WebSite",
      "name": "Bob's Multi Tool",
      "url": "https://bobob.app"
    },
    "creator": {
      "@type": "Organization",
      "name": "Bob's Multi Tool Team"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <GoogleAdsense />
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
} 