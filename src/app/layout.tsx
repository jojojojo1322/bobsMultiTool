import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/contexts/TranslationContext";
import GoogleAdsense from "@/components/GoogleAdsense";

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
  // metadataBase: new URL('https://your-domain.com'), // 배포 시 실제 도메인으로 설정
  alternates: {
    canonical: '/',
    languages: {
      'en': '/?lang=en',
      'ko': '/?lang=ko', 
      'zh': '/?lang=zh',
      'ja': '/?lang=ja',
      'vi': '/?lang=vi',
    },
  },
  openGraph: {
    title: "Iframe Viewer - Free Website Preview Tool",
    description: "Test website responsiveness across different device sizes. Perfect for developers and designers testing responsive designs.",
    url: '/',
    siteName: 'Iframe Viewer',
    images: [
      {
        url: '/og-image.jpg', // 실제 OG 이미지 경로
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
    title: 'Iframe Viewer - Free Website Preview Tool',
    description: 'Test website responsiveness across different device sizes instantly',
    images: ['/og-image.jpg'], // 실제 Twitter 카드 이미지
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
    google: 'your-google-verification-code', // Google Search Console 인증
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'baidu-site-verification': 'your-baidu-verification-code', // 바이두 인증 (중국 SEO)
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
        {/* 다국어 SEO를 위한 hreflang 설정 */}
        <link rel="alternate" hrefLang="en" href="/?lang=en" />
        <link rel="alternate" hrefLang="ko" href="/?lang=ko" />
        <link rel="alternate" hrefLang="zh" href="/?lang=zh" />
        <link rel="alternate" hrefLang="ja" href="/?lang=ja" />
        <link rel="alternate" hrefLang="vi" href="/?lang=vi" />
        <link rel="alternate" hrefLang="x-default" href="/" />
        
        {/* 추가 검색엔진 메타태그 */}
        <meta name="naver-site-verification" content="your-naver-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAdsense publisherId="ca-pub-YOUR_PUBLISHER_ID" />
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
