import type { Metadata } from 'next';
import './globals.css';
import { TranslationProvider } from '@/contexts/TranslationContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: {
    default: "Lorem Ipsum Generator - Multi-language Text Generator | 다국어 텍스트 생성기",
    template: "%s | Lorem Generator"
  },
  description: "Generate Lorem Ipsum placeholder text in multiple languages including Latin, Korean, Chinese, Japanese, and Vietnamese. Free online tool for designers and developers. 다국어 Lorem Ipsum 더미 텍스트를 생성하는 무료 온라인 도구입니다.",
  keywords: [
    // English keywords
    "lorem ipsum", "placeholder text", "dummy text", "text generator", "multilingual", "design tool",
    "lorem ipsum generator", "fake text", "sample text", "filler text", "random text", "mock text",
    "web design", "graphic design", "typography", "content placeholder", "lorem generator",
    
    // 한국어 키워드
    "로렘 입숨", "더미 텍스트", "가짜 텍스트", "텍스트 생성기", "다국어", "디자인 도구",
    "로렘 입숨 생성기", "샘플 텍스트", "채움 텍스트", "랜덤 텍스트", "목업 텍스트",
    "웹 디자인", "그래픽 디자인", "타이포그래피", "콘텐츠 플레이스홀더", "텍스트 생성",
    
    // 中文关键词
    "乱数假文", "占位文本", "虚拟文本", "文本生成器", "多语言", "设计工具",
    "Lorem生成器", "样本文本", "填充文本", "随机文本", "模拟文本", "网页设计",
    
    // 日本語キーワード
    "ロレムイプサム", "プレースホルダーテキスト", "ダミーテキスト", "テキストジェネレーター", "多言語", "デザインツール",
    "Lorem生成器", "サンプルテキスト", "フィルテキスト", "ランダムテキスト", "ウェブデザイン",
    
    // Tiếng Việt từ khóa
    "lorem ipsum", "văn bản giả", "văn bản mẫu", "trình tạo văn bản", "đa ngôn ngữ", "công cụ thiết kế"
  ],
  authors: [{ name: "Bob's Multi Tool Team" }],
  creator: "Bob's Multi Tool",
  publisher: "Bob's Multi Tool",

  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'zh_CN', 'ja_JP', 'vi_VN'],
    url: 'https://lorem.bobob.app',
    siteName: "Lorem Ipsum Generator",
    title: "Lorem Ipsum Generator - Multi-language Text Generator",
    description: "Generate Lorem Ipsum placeholder text in multiple languages. Free online tool for designers and developers.",
    images: [
      {
        url: 'https://lorem.bobob.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "Lorem Ipsum Generator - Multi-language Text Tool",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lorem Ipsum Generator - Multi-language Text Generator",
    description: "Generate Lorem Ipsum placeholder text in multiple languages. Perfect for designers and developers.",
    images: ['https://lorem.bobob.app/og-image.png'],
  },
  alternates: {
    canonical: 'https://lorem.bobob.app',
    languages: {
      'en-US': 'https://lorem.bobob.app?lang=en',
      'ko-KR': 'https://lorem.bobob.app?lang=ko',
      'zh-CN': 'https://lorem.bobob.app?lang=zh',
      'ja-JP': 'https://lorem.bobob.app?lang=ja',
      'vi-VN': 'https://lorem.bobob.app?lang=vi',
    },
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
    "name": "Lorem Ipsum Generator",
    "alternateName": [
      "Multi-language Text Generator",
      "로렘 입숨 생성기",
      "다국어 텍스트 생성기",
      "Lorem生成器",
      "ロレムイプサム生成器"
    ],
    "url": "https://lorem.bobob.app",
    "description": "Generate Lorem Ipsum placeholder text in multiple languages including Latin, Korean, Chinese, Japanese, and Vietnamese. Free online tool for designers and developers.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": ["en", "ko", "zh", "ja", "vi"],
    "browserRequirements": "JavaScript required, HTML5 support",
    "featureList": [
      "Multi-language Lorem Ipsum generation",
      "Latin text generation",
      "Korean placeholder text",
      "Chinese sample text",
      "Japanese dummy text",
      "Vietnamese filler text",
      "Customizable text length",
      "Copy to clipboard functionality"
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
      "lorem ipsum", "placeholder text", "dummy text", "text generator", "multilingual",
      "로렘 입숨", "더미 텍스트", "텍스트 생성기", "다국어",
      "乱数假文", "占位文本", "文本生成器", "多语言",
      "ロレムイプサム", "ダミーテキスト", "テキストジェネレーター", "多言語"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": [
        "Web Designers",
        "Graphic Designers",
        "Developers",
        "Content Creators",
        "UI/UX Designers"
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
      <body>
        <TranslationProvider>
          <GoogleAnalytics />
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
} 