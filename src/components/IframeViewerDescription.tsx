'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function IframeViewerDescription() {
  const { language, t } = useTranslation();

  // 언어별 SEO 설명 데이터
  const seoContent = {
    en: {
      title: "🖼️ Iframe Viewer Tool",
      subtitle: "Free Website Preview Tool for Developers",
      description: "Free online iframe viewer and website preview tool for developers, designers, and anyone building responsive websites. Test your website's appearance across different device sizes including iPhone, iPad, Android phones, tablets, laptop screens, desktop monitors, and custom dimensions. Generate iframe code instantly with responsive options.",
      mobileTitle: "📱 Mobile Device Testing",
      desktopTitle: "💻 Desktop & Features",
      footer: "Perfect for web developers testing responsive designs, UI/UX designers checking layouts, and content creators previewing websites across multiple device viewports."
    },
    ko: {
      title: "🖼️ Iframe Viewer Tool",
      subtitle: "개발자를 위한 무료 웹사이트 미리보기 도구",
      description: "개발자, 디자이너 및 반응형 웹사이트를 구축하는 모든 사용자를 위한 무료 온라인 iframe 뷰어 및 웹사이트 미리보기 도구입니다. iPhone, iPad, 안드로이드 폰, 태블릿, 노트북 화면, 데스크톱 모니터 및 사용자 정의 크기를 포함한 다양한 디바이스 크기에서 웹사이트 모양을 테스트하세요. 반응형 옵션으로 iframe 코드를 즉시 생성할 수 있습니다.",
      mobileTitle: "📱 모바일 디바이스 테스트",
      desktopTitle: "💻 데스크톱 및 기능",
      footer: "반응형 디자인을 테스트하는 웹 개발자, 레이아웃을 확인하는 UI/UX 디자이너, 여러 디바이스 뷰포트에서 웹사이트를 미리보는 콘텐츠 제작자에게 완벽합니다."
    },
    zh: {
      title: "🖼️ Iframe Viewer Tool",
      subtitle: "免费网站预览工具，专为开发者设计",
      description: "免费在线iframe查看器和网站预览工具，适用于开发者、设计师和所有构建响应式网站的用户。在不同设备尺寸下测试您的网站外观，包括iPhone、iPad、Android手机、平板电脑、笔记本屏幕、桌面显示器和自定义尺寸。实时生成响应式iframe代码。",
      mobileTitle: "📱 移动设备测试", 
      desktopTitle: "💻 桌面和功能",
      footer: "完美适用于测试响应式设计的Web开发者、检查布局的UI/UX设计师，以及在多个设备视口预览网站的内容创作者。"
    },
    ja: {
      title: "🖼️ Iframe Viewer Tool",
      subtitle: "開発者向け無料ウェブサイトプレビューツール",
      description: "開発者、デザイナー、レスポンシブWebサイトを構築するすべての方のための無料オンラインiframeビューアおよびWebサイトプレビューツールです。iPhone、iPad、Androidフォン、タブレット、ラップトップ画面、デスクトップモニター、カスタムサイズなど、さまざまなデバイスサイズでWebサイトの外観をテストできます。レスポンシブオプション付きのiframeコードを即座に生成できます。",
      mobileTitle: "📱 モバイルデバイステスト",
      desktopTitle: "💻 デスクトップと機能",
      footer: "レスポンシブデザインをテス트するWeb開発者、レイアウトをチェックするUI/UXデザイナー、複数のデバイスビューポートでWebサイトをプレビューするコンテンツクリエイターに最適です。"
    },
    vi: {
      title: "🖼️ Iframe Viewer Tool",
      subtitle: "Công cụ xem trước trang web miễn phí cho nhà phát triển",
      description: "Công cụ xem iframe trực tuyến miễn phí và xem trước trang web dành cho nhà phát triển, nhà thiết kế và bất kỳ ai xây dựng trang web responsive. Kiểm tra giao diện trang web của bạn trên các kích thước thiết bị khác nhau bao gồm iPhone, iPad, điện thoại Android, máy tính bảng, màn hình laptop, màn hình desktop và kích thước tùy chỉnh. Tạo mã iframe ngay lập tức với các tùy chọn responsive.",
      mobileTitle: "📱 Kiểm tra thiết bị di động",
      desktopTitle: "💻 Desktop và tính năng",
      footer: "Hoàn hảo cho các nhà phát triển web kiểm tra thiết kế responsive, nhà thiết kế UI/UX kiểm tra bố cục và người tạo nội dung xem trước trang web trên nhiều khung nhìn thiết bị."
    }
  };

  const content = seoContent[language];

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {content.title}
      </h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">{content.subtitle}</h2>
        <p className="text-gray-700 mb-4">
          {content.description}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{content.mobileTitle}</h3>
          <ul className="space-y-1">
            <li>• iPhone 15, iPhone SE dimensions</li>
            <li>• Samsung Galaxy S24 preview</li>
            <li>• iPad and iPad Pro sizes</li>
            <li>• Custom mobile dimensions</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{content.desktopTitle}</h3>
          <ul className="space-y-1">
            <li>• Laptop, Desktop, 4K screen sizes</li>
            <li>• Real-time iframe code generation</li>
            <li>• Responsive and styled iframe options</li>
            <li>• Zoom controls and auto-scaling</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        {content.footer}
      </div>
    </>
  );
} 