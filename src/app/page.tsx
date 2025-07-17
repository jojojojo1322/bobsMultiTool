import Link from 'next/link';
import { Metadata } from 'next';
import AdContainer from '@/components/AdContainer';
import IframeViewer from '@/components/IframeViewer';
import IframeViewerDescription from '@/components/IframeViewerDescription';
import ProTipsContent from '@/components/ProTipsContent';

// 동적 메타데이터 생성
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang || 'en';
  
  const metaContent = {
    en: {
      title: "Iframe Viewer - Free Website Preview Tool",
      description: "Free online iframe viewer and website preview tool for developers and designers. Test website responsiveness across iPhone, iPad, Desktop, and custom device sizes instantly.",
      keywords: ["iframe viewer", "website preview", "responsive testing", "mobile preview", "device simulator", "web development tool"]
    },
    ko: {
      title: "Iframe Viewer - 무료 웹사이트 미리보기 도구",
      description: "개발자와 디자이너를 위한 무료 온라인 iframe 뷰어 및 웹사이트 미리보기 도구입니다. iPhone, iPad, Desktop 및 사용자 정의 디바이스 크기에서 웹사이트 반응성을 즉시 테스트하세요.",
      keywords: ["iframe 뷰어", "웹사이트 미리보기", "반응형 테스트", "모바일 미리보기", "디바이스 시뮬레이터", "웹 개발 도구"]
    },
    zh: {
      title: "Iframe Viewer - 免费网站预览工具",
      description: "为开发者和设计师提供的免费在线iframe查看器和网站预览工具。即时测试您的网站在iPhone、iPad、桌面和自定义设备尺寸下的响应性。",
      keywords: ["iframe查看器", "网站预览", "响应式测试", "移动预览", "设备模拟器", "网站开发工具"]
    },
    ja: {
      title: "Iframe Viewer - 無料ウェブサイトプレビューツール",
      description: "開発者とデザイナーのための無料オンラインiframeビューアおよびWebサイトプレビューツールです。iPhone、iPad、デスクトップ、カスタムデバイスサイズでWebサイトの応答性を即座にテストできます。",
      keywords: ["iframe ビューア", "ウェブサイトプレビュー", "レスポンシブテスト", "モバイルプレビュー", "デバイスシミュレータ", "ウェブ開発ツール"]
    },
    vi: {
      title: "Iframe Viewer - Công cụ xem trước trang web miễn phí",
      description: "Công cụ xem iframe trực tuyến miễn phí và xem trước trang web cho nhà phát triển và nhà thiết kế. Kiểm tra tính responsive của trang web trên iPhone, iPad, Desktop và kích thước thiết bị tùy chỉnh ngay lập tức.",
      keywords: ["iframe viewer", "xem trước trang web", "kiểm tra responsive", "xem trước mobile", "mô phỏng thiết bị", "công cụ phát triển web"]
    }
  };

  const currentLang = lang as keyof typeof metaContent;
  const content = metaContent[currentLang] || metaContent.en;

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: `/?lang=${currentLang}`,
      languages: {
        'en': '/?lang=en',
        'ko': '/?lang=ko', 
        'zh': '/?lang=zh',
        'ja': '/?lang=ja',
        'vi': '/?lang=vi',
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `/?lang=${currentLang}`,
      siteName: 'Iframe Viewer',
      locale: currentLang === 'en' ? 'en_US' : 
              currentLang === 'ko' ? 'ko_KR' :
              currentLang === 'zh' ? 'zh_CN' :
              currentLang === 'ja' ? 'ja_JP' : 'vi_VN',
      type: 'website',
    },
  };
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 작은 상단 배너 - 주석처리됨 */}
      {/* <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-2 flex justify-center">
          <AdContainer size="banner" slot="top-banner" isPreview={true} />
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* 메인 도구 영역 - 광고 방해 없이 */}
        <div className="mb-8">
          <IframeViewer />
        </div>
        
        {/* SEO용 도구 설명 - 현재 언어만 표시 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <IframeViewerDescription />
        </div>
        
        {/* 광고는 도구 사용이 끝난 후 하단에만 배치 */}
        <div className="flex justify-center mb-8">
          <AdContainer size="large-rectangle" slot="bottom-content" isPreview={true} />
        </div>

        {/* 추가 콘텐츠 영역 (수익 최적화) - 다국어 지원 */}
        <ProTipsContent />

        {/* 중간 광고 (콘텐츠 사이) */}
        <div className="flex justify-center mb-8">
          <AdContainer size="banner" slot="middle-banner" isPreview={true} />
        </div>

        {/* 하단 광고 */}
        <div className="mb-6 flex justify-center">
          <AdContainer size="large-rectangle" slot="bottom-rectangle" isPreview={true} />
        </div>
      </div>

      {/* 간단한 Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">🖼️ Iframe Viewer</h3>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <p className="text-sm text-gray-400">&copy; 2024 Iframe Viewer. Free tool for web developers.</p>
        </div>
      </footer>
    </div>
  );
}
