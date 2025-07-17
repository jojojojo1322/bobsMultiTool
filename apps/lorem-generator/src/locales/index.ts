export type Language = 'en' | 'ko' | 'zh' | 'ja' | 'vi';

export interface Translation {
  // Page Meta
  pageTitle: string;
  pageDescription: string;
  
  // Header
  mainTitle: string;
  mainSubtitle: string;
  partOfText: string;
  
  // Controls
  languageLabel: string;
  typeLabel: string;
  countLabel: string;
  generateButton: string;
  
  // Types
  'type.words': string;
  'type.sentences': string;
  'type.paragraphs': string;
  
  // UI
  copyButton: string;
  copySuccess: string;
  copyFailed: string;
  generatedText: string;
  
  // Features Section
  featuresTitle: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  
  // How to Use Section
  howToUseTitle: string;
  howToUseSubtitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  proTipTitle: string;
  proTipDescription: string;
  
  // Back to Home
  backToHome: string;
  
  // Footer
  footerTitle: string;
  footerPrivacy: string;
  footerTerms: string;
  footerContact: string;
  footerBackHome: string;
  footerSupport: string;
  footerCopyright: string;
  
  // Language Names
  'language.en': string;
  'language.ko': string;
  'language.zh': string;
  'language.ja': string;
  'language.vi': string;
  
  // Lorem text samples for each language
  loremSample: string[];
}

export type TranslationKey = keyof Translation;

// English (default)
const en: Translation = {
  pageTitle: "Lorem Ipsum Generator - Multi-language Text Generator",
  pageDescription: "Generate placeholder text in multiple languages including Latin, Korean, Chinese, Japanese, and Vietnamese. Free online tool for designers and developers.",
  
  mainTitle: "Lorem Ipsum Generator",
  mainSubtitle: "Generate placeholder text in multiple languages",
  partOfText: "Part of Bob's Multi Tool",
  
  languageLabel: "Language",
  typeLabel: "Type",
  countLabel: "Count",
  generateButton: "Generate Text",
  
  'type.words': "Words",
  'type.sentences': "Sentences",
  'type.paragraphs': "Paragraphs",
  
  copyButton: "Copy",
  copySuccess: "Copied to clipboard!",
  copyFailed: "Copy failed.",
  generatedText: "Generated Text",
  
  featuresTitle: "Features",
  feature1Title: "Multi-language Support",
  feature1Description: "Generate text in Latin, Korean, Chinese, Japanese, and Vietnamese",
  feature2Title: "Flexible Generation",
  feature2Description: "Generate by words, sentences, or paragraphs with custom counts",
  feature3Title: "Easy Copy",
  feature3Description: "One-click copy to clipboard for immediate use in your projects",
  
  howToUseTitle: "How to Use",
  howToUseSubtitle: "Simple Steps",
  step1: "Choose your language from the dropdown selector",
  step2: "Select text type - words, sentences, or paragraphs",
  step3: "Set the count for how much text you need",
  step4: "Click Generate to create your Lorem Ipsum text",
  step5: "Copy with one click and paste into your project",
  proTipTitle: "💡 Pro Tip",
  proTipDescription: "Use different languages to test how your design handles various text lengths and character sets!",
  
  backToHome: "Back to Bob's Multi Tool",
  
  footerTitle: "📝 Bob's Multi Tool - Lorem Ipsum Generator",
  footerPrivacy: "Privacy Policy",
  footerTerms: "Terms of Service",
  footerContact: "Contact Us",
  footerBackHome: "← Back to Home",
  footerSupport: "For support or questions:",
  footerCopyright: "2024 Bob's Multi Tool. Free tools for web developers.",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  loremSample: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
    'Explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
  ],
};

// Korean
const ko: Translation = {
  pageTitle: "Lorem Ipsum 생성기 - 다국어 텍스트 생성기",
  pageDescription: "라틴어, 한국어, 중국어, 일본어, 베트남어로 더미 텍스트를 생성하는 무료 온라인 도구입니다. 디자이너와 개발자를 위한 도구입니다.",
  
  mainTitle: "Lorem Ipsum 생성기",
  mainSubtitle: "다국어 더미 텍스트를 생성하세요",
  partOfText: "Part of Bob's Multi Tool",
  
  languageLabel: "언어",
  typeLabel: "유형",
  countLabel: "개수",
  generateButton: "텍스트 생성",
  
  'type.words': "단어",
  'type.sentences': "문장",
  'type.paragraphs': "문단",
  
  copyButton: "복사",
  copySuccess: "클립보드에 복사되었습니다!",
  copyFailed: "복사에 실패했습니다.",
  generatedText: "생성된 텍스트",
  
  featuresTitle: "주요 기능",
  feature1Title: "다국어 지원",
  feature1Description: "라틴어, 한국어, 중국어, 일본어, 베트남어로 텍스트 생성",
  feature2Title: "유연한 생성",
  feature2Description: "단어, 문장, 문단 단위로 원하는 개수만큼 생성 가능",
  feature3Title: "간편한 복사",
  feature3Description: "원클릭으로 클립보드 복사하여 프로젝트에 바로 사용",
  
  howToUseTitle: "사용 방법",
  howToUseSubtitle: "간단한 단계",
  step1: "드롭다운에서 원하는 언어를 선택하세요",
  step2: "텍스트 유형을 선택하세요 - 단어, 문장, 또는 문단",
  step3: "필요한 텍스트의 개수를 설정하세요",
  step4: "생성 버튼을 클릭하여 Lorem Ipsum 텍스트를 만드세요",
  step5: "원클릭으로 복사하여 프로젝트에 붙여넣으세요",
  proTipTitle: "💡 팁",
  proTipDescription: "다양한 언어를 사용해서 디자인이 여러 텍스트 길이와 문자 세트를 어떻게 처리하는지 테스트해보세요!",
  
  backToHome: "Bob's Multi Tool로 돌아가기",
  
  footerTitle: "📝 Bob's Multi Tool - Lorem Ipsum 생성기",
  footerPrivacy: "개인정보처리방침",
  footerTerms: "이용약관",
  footerContact: "문의하기",
  footerBackHome: "← 홈으로 돌아가기",
  footerSupport: "지원 또는 문의사항:",
  footerCopyright: "2024 Bob's Multi Tool. 웹 개발자를 위한 무료 도구.",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  loremSample: [
    '웹 개발의 기본이 되는 HTML과 CSS는 모든 웹사이트의 뼈대를 구성하는 중요한 기술입니다.',
    '사용자 경험을 향상시키기 위해서는 직관적인 인터페이스 설계와 빠른 로딩 속도가 필수적입니다.',
    '반응형 웹 디자인을 통해 데스크톱부터 모바일까지 모든 기기에서 최적화된 환경을 제공할 수 있습니다.',
    '자바스크립트 프레임워크들은 복잡한 웹 애플리케이션 개발을 더욱 효율적으로 만들어줍니다.',
    '데이터베이스 설계와 백엔드 API 구축은 안정적인 서비스 운영의 핵심 요소입니다.',
    '코드 리뷰와 테스트 자동화를 통해 소프트웨어의 품질을 지속적으로 개선할 수 있습니다.',
    '클라우드 서비스를 활용하면 확장성과 안정성을 동시에 확보하면서 비용 효율성도 높일 수 있습니다.',
    '사용자 피드백을 적극적으로 수집하고 분석하여 제품을 지속적으로 발전시켜 나가는 것이 중요합니다.',
    '보안 취약점 점검과 정기적인 업데이트는 안전한 서비스 제공을 위한 필수 과정입니다.',
    '개발팀 간의 원활한 소통과 협업 도구 활용은 프로젝트 성공의 핵심 요소라고 할 수 있습니다.'
  ],
};

// Chinese (Simplified)
const zh: Translation = {
  pageTitle: "Lorem Ipsum 生成器 - 多语言文本生成器",
  pageDescription: "生成拉丁语、中文、韩语、日语和越南语的占位符文本。为设计师和开发者提供的免费在线工具。",
  
  mainTitle: "Lorem Ipsum 生成器",
  mainSubtitle: "生成多语言占位符文本",
  partOfText: "Part of Bob's Multi Tool",
  
  languageLabel: "语言",
  typeLabel: "类型",
  countLabel: "数量",
  generateButton: "生成文本",
  
  'type.words': "词语",
  'type.sentences': "句子",
  'type.paragraphs': "段落",
  
  copyButton: "复制",
  copySuccess: "已复制到剪贴板！",
  copyFailed: "复制失败。",
  generatedText: "生成的文本",
  
  featuresTitle: "主要功能",
  feature1Title: "多语言支持",
  feature1Description: "生成拉丁语、中文、韩语、日语和越南语文本",
  feature2Title: "灵活生成",
  feature2Description: "按词语、句子或段落生成，可自定义数量",
  feature3Title: "便捷复制",
  feature3Description: "一键复制到剪贴板，立即在项目中使用",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "简单步骤",
  step1: "从下拉菜单中选择您的语言",
  step2: "选择文本类型 - 词语、句子或段落",
  step3: "设置您需要的文本数量",
  step4: "点击生成按钮创建您的 Lorem Ipsum 文本",
  step5: "一键复制并粘贴到您的项目中",
  proTipTitle: "💡 专业提示",
  proTipDescription: "使用不同语言测试您的设计如何处理各种文本长度和字符集！",
  
  backToHome: "返回 Bob's Multi Tool",
  
  footerTitle: "📝 Bob's Multi Tool - Lorem Ipsum 生成器",
  footerPrivacy: "隐私政策",
  footerTerms: "服务条款",
  footerContact: "联系我们",
  footerBackHome: "← 返回首页",
  footerSupport: "支持或问题咨询：",
  footerCopyright: "2024 Bob's Multi Tool. 为网页开发者提供的免费工具。",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  loremSample: [
    '现代Web开发技术包括前端框架、后端服务以及数据库管理等多个方面的综合应用。',
    '用户界面设计需要考虑可用性、美观性和响应式布局以适应不同设备屏幕。',
    '云计算服务为企业提供了可扩展的基础设施和强大的数据处理能力。',
    '人工智能和机器学习正在改变软件开发的方式和用户体验的标准。',
    '移动应用开发需要关注性能优化、用户体验和跨平台兼容性等关键因素。',
    '数据安全和隐私保护在现代信息系统中占据着越来越重要的地位。',
    '敏捷开发方法论强调团队协作、持续集成和快速迭代的重要性。',
    '开源软件社区为全球开发者提供了丰富的工具和知识分享平台。',
    '自动化测试和持续部署流程大大提高了软件交付的质量和效率。',
    '前沿技术如区块链、物联网和边缘计算正在塑造未来的数字化世界。'
  ],
};

// Japanese
const ja: Translation = {
  pageTitle: "Lorem Ipsum ジェネレーター - 多言語テキスト生成器",
  pageDescription: "ラテン語、日本語、中国語、韓国語、ベトナム語でプレースホルダーテキストを生成。デザイナーと開発者のための無料オンラインツール。",
  
  mainTitle: "Lorem Ipsum ジェネレーター",
  mainSubtitle: "多言語プレースホルダーテキストを生成",
  partOfText: "Part of Bob's Multi Tool",
  
  languageLabel: "言語",
  typeLabel: "タイプ",
  countLabel: "数",
  generateButton: "テキスト生成",
  
  'type.words': "単語",
  'type.sentences': "文",
  'type.paragraphs': "段落",
  
  copyButton: "コピー",
  copySuccess: "クリップボードにコピーしました！",
  copyFailed: "コピーに失敗しました。",
  generatedText: "生成されたテキスト",
  
  featuresTitle: "主な機能",
  feature1Title: "多言語サポート",
  feature1Description: "ラテン語、日本語、中国語、韓国語、ベトナム語でテキスト生成",
  feature2Title: "柔軟な生成",
  feature2Description: "単語、文、段落単位でカスタム数量での生成",
  feature3Title: "簡単コピー",
  feature3Description: "ワンクリックでクリップボードにコピー、プロジェクトですぐに使用",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "簡単なステップ",
  step1: "ドロップダウンから言語を選択してください",
  step2: "テキストタイプを選択 - 単語、文、または段落",
  step3: "必要なテキストの数を設定してください",
  step4: "生成ボタンをクリックして Lorem Ipsum テキストを作成",
  step5: "ワンクリックでコピーしてプロジェクトに貼り付け",
  proTipTitle: "💡 プロのヒント",
  proTipDescription: "異なる言語を使用して、デザインが様々なテキスト長と文字セットをどう処理するかテストしましょう！",
  
  backToHome: "Bob's Multi Tool に戻る",
  
  footerTitle: "📝 Bob's Multi Tool - Lorem Ipsum ジェネレーター",
  footerPrivacy: "プライバシーポリシー",
  footerTerms: "利用規約",
  footerContact: "お問い合わせ",
  footerBackHome: "← ホームに戻る",
  footerSupport: "サポートまたはお問い合わせ：",
  footerCopyright: "2024 Bob's Multi Tool. ウェブ開発者のための無料ツール。",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  loremSample: [
    'モダンなウェブ開発では、フロントエンドフレームワークとバックエンドAPIの効果的な連携が重要です。',
    'ユーザーエクスペリエンスの向上には、直感的なインターフェースデザインと高速なレスポンス時間が不可欠です。',
    'レスポンシブウェブデザインにより、スマートフォンからデスクトップまで最適化された表示を実現できます。',
    'JavaScriptフレームワークは複雑なWebアプリケーション開発を効率化し、保守性を向上させます。',
    'データベース設計とAPI構築は、安定したサービス運用の基盤となる重要な技術要素です。',
    'コードレビューと自動テストにより、ソフトウェア品質の継続的な改善が可能になります。',
    'クラウドサービスの活用で、スケーラビリティと安定性を確保しながらコスト効率も向上させることができます。',
    'ユーザーフィードバックの積極的な収集と分析により、プロダクトの継続的な改善が実現されます。',
    'セキュリティ脆弱性の定期的なチェックとアップデートは、安全なサービス提供に欠かせません。',
    '開発チーム間の円滑なコミュニケーションと協業ツールの活用が、プロジェクト成功の鍵となります。'
  ],
};

// Vietnamese
const vi: Translation = {
  pageTitle: "Lorem Ipsum Generator - Công cụ tạo văn bản đa ngôn ngữ",
  pageDescription: "Tạo văn bản placeholder bằng tiếng Latin, Việt, Trung, Hàn và Nhật. Công cụ trực tuyến miễn phí cho nhà thiết kế và lập trình viên.",
  
  mainTitle: "Lorem Ipsum Generator",
  mainSubtitle: "Tạo văn bản placeholder đa ngôn ngữ",
  partOfText: "Part of Bob's Multi Tool",
  
  languageLabel: "Ngôn ngữ",
  typeLabel: "Loại",
  countLabel: "Số lượng",
  generateButton: "Tạo văn bản",
  
  'type.words': "Từ",
  'type.sentences': "Câu",
  'type.paragraphs': "Đoạn văn",
  
  copyButton: "Sao chép",
  copySuccess: "Đã sao chép vào clipboard!",
  copyFailed: "Sao chép thất bại.",
  generatedText: "Văn bản đã tạo",
  
  featuresTitle: "Tính năng chính",
  feature1Title: "Hỗ trợ đa ngôn ngữ",
  feature1Description: "Tạo văn bản bằng tiếng Latin, Việt, Trung, Hàn và Nhật",
  feature2Title: "Tạo linh hoạt",
  feature2Description: "Tạo theo từ, câu hoặc đoạn văn với số lượng tùy chỉnh",
  feature3Title: "Sao chép dễ dàng",
  feature3Description: "Sao chép một cú nhấp chuột để sử dụng ngay trong dự án",
  
  howToUseTitle: "Cách sử dụng",
  howToUseSubtitle: "Các bước đơn giản",
  step1: "Chọn ngôn ngữ của bạn từ menu thả xuống",
  step2: "Chọn loại văn bản - từ, câu hoặc đoạn văn",
  step3: "Đặt số lượng văn bản bạn cần",
  step4: "Nhấp Tạo để tạo văn bản Lorem Ipsum của bạn",
  step5: "Sao chép một cú nhấp chuột và dán vào dự án của bạn",
  proTipTitle: "💡 Mẹo chuyên nghiệp",
  proTipDescription: "Sử dụng các ngôn ngữ khác nhau để kiểm tra cách thiết kế của bạn xử lý các độ dài văn bản và bộ ký tự khác nhau!",
  
  backToHome: "Quay lại Bob's Multi Tool",
  
  footerTitle: "📝 Bob's Multi Tool - Lorem Ipsum Generator",
  footerPrivacy: "Chính sách bảo mật",
  footerTerms: "Điều khoản dịch vụ",
  footerContact: "Liên hệ",
  footerBackHome: "← Quay lại trang chủ",
  footerSupport: "Hỗ trợ hoặc câu hỏi:",
  footerCopyright: "2024 Bob's Multi Tool. Công cụ miễn phí cho nhà phát triển web.",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  loremSample: [
    'Phát triển web hiện đại đòi hỏi sự kết hợp hài hòa giữa frontend framework và backend API để tạo nên trải nghiệm người dùng tốt nhất.',
    'Thiết kế giao diện người dùng cần chú trọng đến tính khả dụng, thẩm mỹ và khả năng responsive để phù hợp với mọi thiết bị.',
    'Dịch vụ điện toán đám mây cung cấp cơ sở hạ tầng có thể mở rộng và khả năng xử lý dữ liệu mạnh mẽ cho doanh nghiệp.',
    'Trí tuệ nhân tạo và machine learning đang thay đổi cách phát triển phần mềm và tiêu chuẩn trải nghiệm người dùng.',
    'Phát triển ứng dụng di động cần quan tâm đến tối ưu hóa hiệu suất, trải nghiệm người dùng và tính tương thích đa nền tảng.',
    'Bảo mật dữ liệu và quyền riêng tư đang đóng vai trò ngày càng quan trọng trong các hệ thống thông tin hiện đại.',
    'Phương pháp phát triển Agile nhấn mạnh tầm quan trọng của hợp tác nhóm, tích hợp liên tục và lặp lại nhanh.',
    'Cộng đồng phần mềm mã nguồn mở cung cấp công cụ phong phú và nền tảng chia sẻ kiến thức cho các nhà phát triển toàn cầu.',
    'Quy trình kiểm thử tự động và triển khai liên tục đã cải thiện đáng kể chất lượng và hiệu quả giao hàng phần mềm.',
    'Các công nghệ tiên tiến như blockchain, IoT và edge computing đang định hình thế giới số hóa trong tương lai.'
  ],
};

export const translations: Record<Language, Translation> = {
  en,
  ko,
  zh,
  ja,
  vi,
}; 