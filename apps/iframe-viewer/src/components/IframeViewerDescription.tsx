'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function IframeViewerDescription() {
  const { language } = useTranslation();

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

  const faqData = {
    en: {
      faqTitle: "🤔 Frequently Asked Questions",
      faqs: [
        {
          question: "What is an iframe viewer and how does it work?",
          answer: "An iframe viewer is a tool that lets you preview websites inside a frame at different device sizes. Our tool embeds websites using HTML iframe elements, allowing you to test responsive designs across iPhone, iPad, Android, and desktop viewports without switching devices."
        },
        {
          question: "Can I use this iframe tool for responsive design testing?",
          answer: "Yes! This is perfect for responsive web design testing. You can quickly switch between mobile, tablet, and desktop sizes to see how your website adapts. It supports iPhone 15, Galaxy S24, iPad Pro, and custom dimensions for comprehensive testing."
        },
        {
          question: "Why do some websites show 'Loading Failed' in the iframe?",
          answer: "Some websites block iframe embedding due to CORS (Cross-Origin Resource Sharing) policies or X-Frame-Options headers. This is a security feature that prevents clickjacking attacks. Websites like Google, Facebook, and banking sites typically block iframe access."
        },
        {
          question: "How do I generate iframe code for my website?",
          answer: "After loading your website in the viewer, click the 'Export iframe Code' button. You'll get multiple code formats: basic iframe, responsive iframe with aspect ratio, styled iframe with CSS, and CSS class-based iframe code that you can copy and paste."
        },
        {
          question: "Is this iframe generator tool free to use?",
          answer: "Yes, our iframe viewer is completely free! You can test unlimited websites, generate iframe code, and use all device presets without any cost. Perfect for developers, designers, and anyone building responsive websites."
        }
      ]
    },
    ko: {
      faqTitle: "🤔 자주 묻는 질문",
      faqs: [
        {
          question: "iframe 뷰어란 무엇이고 어떻게 작동하나요?",
          answer: "iframe 뷰어는 다양한 디바이스 크기의 프레임 안에서 웹사이트를 미리볼 수 있는 도구입니다. HTML iframe 요소를 사용해서 웹사이트를 임베드하여, 디바이스를 바꾸지 않고도 iPhone, iPad, Android, 데스크톱 뷰포트에서 반응형 디자인을 테스트할 수 있어요."
        },
        {
          question: "이 iframe 도구를 반응형 디자인 테스트에 사용할 수 있나요?",
          answer: "네! 반응형 웹 디자인 테스트에 완벽해요. 모바일, 태블릿, 데스크톱 크기를 빠르게 전환해서 웹사이트가 어떻게 적응하는지 볼 수 있어요. iPhone 15, Galaxy S24, iPad Pro, 그리고 사용자 정의 크기까지 지원해서 종합적인 테스트가 가능합니다."
        },
        {
          question: "일부 웹사이트에서 '로딩 실패'가 표시되는 이유는 뭔가요?",
          answer: "일부 웹사이트는 CORS(Cross-Origin Resource Sharing) 정책이나 X-Frame-Options 헤더 때문에 iframe 임베딩을 차단해요. 이는 클릭재킹 공격을 방지하는 보안 기능이에요. 구글, 페이스북, 은행 사이트 같은 곳들이 일반적으로 iframe 접근을 막아놔요."
        },
        {
          question: "웹사이트용 iframe 코드를 어떻게 생성하나요?",
          answer: "뷰어에서 웹사이트를 로드한 후 '📋 iframe 코드 추출' 버튼을 클릭하세요. 여러 코드 형식을 제공해요: 기본 iframe, 종횡비가 있는 반응형 iframe, CSS가 적용된 스타일 iframe, 그리고 CSS 클래스 기반 iframe 코드를 복사해서 붙여넣을 수 있어요."
        },
        {
          question: "이 iframe 생성기 도구는 무료인가요?",
          answer: "네, 저희 iframe 뷰어는 완전 무료예요! 무제한으로 웹사이트를 테스트하고, iframe 코드를 생성하고, 모든 디바이스 프리셋을 비용 없이 사용할 수 있어요. 개발자, 디자이너, 반응형 웹사이트를 만드는 모든 분들에게 완벽해요."
        }
      ]
    },
    zh: {
      faqTitle: "🤔 常见问题",
      faqs: [
        {
          question: "什么是iframe查看器，它是如何工作的？",
          answer: "iframe查看器是一个让您在不同设备尺寸的框架内预览网站的工具。我们的工具使用HTML iframe元素嵌入网站，让您可以在iPhone、iPad、Android和桌面视口上测试响应式设计，无需切换设备。"
        },
        {
          question: "我可以使用这个iframe工具进行响应式设计测试吗？",
          answer: "当然可以！这非常适合响应式网页设计测试。您可以快速在移动端、平板和桌面尺寸之间切换，查看您的网站如何适应。它支持iPhone 15、Galaxy S24、iPad Pro和自定义尺寸，进行全面测试。"
        },
        {
          question: "为什么有些网站在iframe中显示'加载失败'？",
          answer: "有些网站由于CORS（跨源资源共享）策略或X-Frame-Options头部而阻止iframe嵌入。这是一个防止点击劫持攻击的安全功能。像Google、Facebook和银行网站通常会阻止iframe访问。"
        },
        {
          question: "如何为我的网站生成iframe代码？",
          answer: "在查看器中加载您的网站后，点击'📋 导出iframe代码'按钮。您将获得多种代码格式：基本iframe、带宽高比的响应式iframe、带CSS的样式化iframe，以及基于CSS类的iframe代码，可以复制粘贴。"
        },
        {
          question: "这个iframe生成器工具免费使用吗？",
          answer: "是的，我们的iframe查看器完全免费！您可以测试无限网站、生成iframe代码、使用所有设备预设，完全不收费。对开发者、设计师和任何构建响应式网站的人都很完美。"
        }
      ]
    },
    ja: {
      faqTitle: "🤔 よくある質問",
      faqs: [
        {
          question: "iframeビューアとは何ですか？どのように動作しますか？",
          answer: "iframeビューアは、異なるデバイスサイズのフレーム内でWebサイトをプレビューできるツールです。HTML iframe要素を使用してWebサイトを埋め込み、デバイスを切り替えることなく、iPhone、iPad、Android、デスクトップビューポートでレスポンシブデザインをテストできます。"
        },
        {
          question: "このiframeツールをレスポンシブデザインテストに使用できますか？",
          answer: "はい！レスポンシブWebデザインテストに最適です。モバイル、タブレット、デスクトップサイズを素早く切り替えて、Webサイトがどのように適応するかを確認できます。iPhone 15、Galaxy S24、iPad Pro、カスタムサイズをサポートして包括的なテストが可能です。"
        },
        {
          question: "一部のWebサイトでiframe内に「読み込み失敗」が表示されるのはなぜですか？",
          answer: "一部のWebサイトは、CORS（Cross-Origin Resource Sharing）ポリシーやX-Frame-Optionsヘッダーによりiframe埋め込みをブロックしています。これはクリックジャッキング攻撃を防ぐセキュリティ機能です。Google、Facebook、銀行サイトなどが通常iframe アクセスをブロックします。"
        },
        {
          question: "Webサイト用のiframeコードをどのように生成しますか？",
          answer: "ビューアでWebサイトを読み込んだ後、「📋 iframeコード出力」ボタンをクリックしてください。複数のコード形式が提供されます：基本iframe、アスペクト比付きレスポンシブiframe、CSSが適用されたスタイル付きiframe、CSSクラスベースのiframeコードをコピー&ペーストできます。"
        },
        {
          question: "このiframeジェネレータツールは無料で使用できますか？",
          answer: "はい、私たちのiframeビューアは完全に無料です！無制限にWebサイトをテストし、iframeコードを生成し、すべてのデバイスプリセットを費用なしで使用できます。開発者、デザイナー、レスポンシブWebサイトを構築する誰にでも最適です。"
        }
      ]
    },
    vi: {
      faqTitle: "🤔 Câu hỏi thường gặp",
      faqs: [
        {
          question: "Iframe viewer là gì và nó hoạt động như thế nào?",
          answer: "Iframe viewer là một công cụ cho phép bạn xem trước các trang web bên trong khung ở các kích thước thiết bị khác nhau. Công cụ của chúng tôi nhúng trang web bằng phần tử HTML iframe, cho phép bạn kiểm tra thiết kế responsive trên iPhone, iPad, Android và desktop viewport mà không cần chuyển đổi thiết bị."
        },
        {
          question: "Tôi có thể sử dụng công cụ iframe này để kiểm tra thiết kế responsive không?",
          answer: "Có! Điều này hoàn hảo cho việc kiểm tra thiết kế web responsive. Bạn có thể nhanh chóng chuyển đổi giữa kích thước mobile, tablet và desktop để xem trang web của bạn thích ứng như thế nào. Nó hỗ trợ iPhone 15, Galaxy S24, iPad Pro và kích thước tùy chỉnh để kiểm tra toàn diện."
        },
        {
          question: "Tại sao một số trang web hiển thị 'Tải thất bại' trong iframe?",
          answer: "Một số trang web chặn việc nhúng iframe do chính sách CORS (Cross-Origin Resource Sharing) hoặc header X-Frame-Options. Đây là tính năng bảo mật ngăn chặn các cuộc tấn công clickjacking. Các trang web như Google, Facebook và ngân hàng thường chặn truy cập iframe."
        },
        {
          question: "Làm thế nào để tạo mã iframe cho trang web của tôi?",
          answer: "Sau khi tải trang web của bạn trong viewer, nhấp vào nút '📋 Xuất mã iframe'. Bạn sẽ có nhiều định dạng mã: iframe cơ bản, iframe responsive với tỷ lệ khung hình, iframe có style với CSS, và mã iframe dựa trên CSS class mà bạn có thể sao chép và dán."
        },
        {
          question: "Công cụ tạo iframe này có miễn phí sử dụng không?",
          answer: "Có, iframe viewer của chúng tôi hoàn toàn miễn phí! Bạn có thể kiểm tra trang web không giới hạn, tạo mã iframe và sử dụng tất cả các preset thiết bị mà không mất phí. Hoàn hảo cho nhà phát triển, nhà thiết kế và bất kỳ ai xây dựng trang web responsive."
        }
      ]
    }
  };

  const faq = faqData[language];

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
      
      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 mb-8">
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

      {/* FAQ Section */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{faq.faqTitle}</h2>
        <div className="space-y-6">
          {faq.faqs.map((item, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        {content.footer}
      </div>

      {/* Related Tools Section */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'ko' ? '다른 유용한 개발자 도구들' : language === 'zh' ? '其他实用开发工具' : language === 'ja' ? 'その他の便利な開発ツール' : language === 'vi' ? 'Các công cụ phát triển hữu ích khác' : 'Other Useful Developer Tools'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <a href="https://regax.bobob.app" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-blue-900 mb-1">🔍 RegAx - Regular Expression Tester</h3>
            <p className="text-gray-600">
              {language === 'ko' ? '정규식 패턴을 테스트하고 검증하세요' : language === 'zh' ? '测试和验证正则表达式模式' : language === 'ja' ? '正規表現パターンをテストして検証' : language === 'vi' ? 'Kiểm tra và xác thực các mẫu biểu thức chính quy' : 'Test and validate regular expression patterns'}
            </p>
          </a>
          <a href="https://cron.bobob.app" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-blue-900 mb-1">⏰ Cron Expression Generator</h3>
            <p className="text-gray-600">
              {language === 'ko' ? '크론 표현식을 쉽게 생성하고 스케줄링하세요' : language === 'zh' ? '轻松生成和调度cron表达式' : language === 'ja' ? 'cron式を簡単に生成してスケジュール' : language === 'vi' ? 'Tạo và lên lịch biểu thức cron dễ dàng' : 'Generate and schedule cron expressions easily'}
            </p>
          </a>
          <a href="https://meta.bobob.app" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-blue-900 mb-1">🏷️ Meta Tag Generator</h3>
            <p className="text-gray-600">
              {language === 'ko' ? 'SEO 최적화를 위한 메타 태그를 생성하세요' : language === 'zh' ? '生成用于SEO优化的元标签' : language === 'ja' ? 'SEO最適化のためのメタタグを生成' : language === 'vi' ? 'Tạo thẻ meta để tối ưu hóa SEO' : 'Generate meta tags for SEO optimization'}
            </p>
          </a>
          <a href="https://lorem.bobob.app" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-blue-900 mb-1">📝 Lorem Ipsum Generator</h3>
            <p className="text-gray-600">
              {language === 'ko' ? '다국어 지원 더미 텍스트를 생성하세요' : language === 'zh' ? '生成多语言支持的虚拟文本' : language === 'ja' ? '多言語対応のダミーテキストを生成' : language === 'vi' ? 'Tạo văn bản giả hỗ trợ đa ngôn ngữ' : 'Generate multilingual dummy text'}
            </p>
          </a>
        </div>
        <div className="mt-4 text-center">
          <a href="https://bobob.app" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            {language === 'ko' ? '👨‍💻 Bob의 멀티 툴에서 더 많은 도구 보기' : language === 'zh' ? '👨‍💻 在Bob的多工具中查看更多工具' : language === 'ja' ? '👨‍💻 Bobのマルチツールでより多くのツールを見る' : language === 'vi' ? '👨‍💻 Xem thêm công cụ trong Bob Multi Tool' : '👨‍💻 See more tools in Bob\'s Multi Tool'} →
          </a>
        </div>
      </div>
    </>
  );
} 