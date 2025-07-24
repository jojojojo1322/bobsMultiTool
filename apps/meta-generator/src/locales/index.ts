export interface Translation {
  // Page Meta
  pageTitle: string;
  pageDescription: string;
  
  // Header
  mainTitle: string;
  mainSubtitle: string;
  partOfText: string;
  
  // Tabs
  basicTab: string;
  socialTab: string;
  advancedTab: string;
  
  // Basic Meta Tags
  basicMetaTitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  titleHint: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionHint: string;
  keywordsLabel: string;
  keywordsPlaceholder: string;
  keywordsHint: string;
  authorLabel: string;
  authorPlaceholder: string;
  canonicalUrlLabel: string;
  canonicalUrlPlaceholder: string;
  languageLabel: string;
  charsetLabel: string;
  
  // Social Media
  socialMetaTitle: string;
  ogTitleLabel: string;
  ogDescriptionLabel: string;
  ogImageLabel: string;
  ogImagePlaceholder: string;
  ogUrlLabel: string;
  ogTypeLabel: string;
  ogTypeLabelWebsite: string;
  ogTypeLabelArticle: string;
  ogTypeLabelProduct: string;
  fbAppIdLabel: string;
  fbAppIdPlaceholder: string;
  
  // Twitter
  twitterSectionTitle: string;
  twitterCardLabel: string;
  twitterCardSummary: string;
  twitterCardLargeImage: string;
  twitterTitleLabel: string;
  twitterDescriptionLabel: string;
  twitterImageLabel: string;
  twitterSiteLabel: string;
  twitterSitePlaceholder: string;
  twitterCreatorLabel: string;
  twitterCreatorPlaceholder: string;
  
  // Advanced/Robots
  advancedMetaTitle: string;
  robotsTitle: string;
  
  // Multilingual SEO
  multilingualSeoTitle: string;
  hreflangLabel: string;
  hreflangDescription: string;
  enableHreflangLabel: string;
  robotsIndexLabel: string;
  robotsFollowLabel: string;
  robotsArchiveLabel: string;
  robotsSnippetLabel: string;
  robotsImageIndexLabel: string;
  robotsTranslateLabel: string;
  robotsMaxSnippetLabel: string;
  robotsMaxImagePreviewLabel: string;
  robotsMaxVideoPreviewLabel: string;
  robotsUnavailableAfterLabel: string;
  
  // Preview
  previewTitle: string;
  searchPreviewTitle: string;
  socialPreviewTitle: string;
  
  // Sample Templates
  sampleTemplatesTitle: string;
  sampleTemplatesDescription: string;
  applySampleButton: string;
  sampleWebsiteName: string;
  sampleBlogName: string;
  sampleProductName: string;
  
  // Generated Code
  generatedCodeTitle: string;
  copyCodeButton: string;
  copySuccess: string;
  copyFailed: string;
  
  // Features
  featuresTitle: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  
  // How to Use
  howToUseTitle: string;
  howToUseSubtitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  exampleTitle: string;
  exampleDescription: string;
  
  // Common
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
  'language.ko': string;
  'language.en': string;
  'language.zh': string;
  'language.ja': string;
  'language.vi': string;
}

// English (default)
const en: Translation = {
  pageTitle: "Meta Tag Generator - SEO Meta Tags Generator",
  pageDescription: "Generate HTML meta tags for SEO optimization. Create title, description, Open Graph, Twitter cards, and robots meta tags for better search engine ranking.",
  
  mainTitle: "Meta Tag Generator",
  mainSubtitle: "Generate HTML meta tags for SEO optimization",
  partOfText: "Part of Bob's Multi Tool",
  
  basicTab: "Basic Meta",
  socialTab: "Social Media",
  advancedTab: "Advanced",
  
  basicMetaTitle: "Basic Meta Tags",
  titleLabel: "Page Title",
  titlePlaceholder: "Enter your page title (50-60 characters recommended)",
  titleHint: "Keep it under 60 characters for optimal display in search results",
  descriptionLabel: "Meta Description",
  descriptionPlaceholder: "Enter a compelling description of your page (150-160 characters)",
  descriptionHint: "Keep it between 150-160 characters for best SEO results",
  keywordsLabel: "Keywords",
  keywordsPlaceholder: "keyword1, keyword2, keyword3",
  keywordsHint: "Separate keywords with commas. Focus on 3-5 main keywords",
  authorLabel: "Author",
  authorPlaceholder: "Author name",
  canonicalUrlLabel: "Canonical URL",
  canonicalUrlPlaceholder: "https://example.com/page",
  languageLabel: "Language",
  charsetLabel: "Character Set",
  
  socialMetaTitle: "Social Media Meta Tags",
  ogTitleLabel: "Open Graph Title",
  ogDescriptionLabel: "Open Graph Description",
  ogImageLabel: "Open Graph Image URL",
  ogImagePlaceholder: "https://example.com/image.jpg (1200x630px recommended)",
  ogUrlLabel: "Open Graph URL",
  ogTypeLabel: "Open Graph Type",
  ogTypeLabelWebsite: "Website",
  ogTypeLabelArticle: "Article",
  ogTypeLabelProduct: "Product",
  fbAppIdLabel: "Facebook App ID",
  fbAppIdPlaceholder: "Your Facebook App ID",
  
  twitterSectionTitle: "Twitter Card",
  twitterCardLabel: "Twitter Card Type",
  twitterCardSummary: "Summary",
  twitterCardLargeImage: "Summary Large Image",
  twitterTitleLabel: "Twitter Title",
  twitterDescriptionLabel: "Twitter Description",
  twitterImageLabel: "Twitter Image URL",
  twitterSiteLabel: "Twitter Site",
  twitterSitePlaceholder: "@yoursite",
  twitterCreatorLabel: "Twitter Creator",
  twitterCreatorPlaceholder: "@yourcreator",
  
  advancedMetaTitle: "Advanced Meta Tags",
  robotsTitle: "Robots Directives",
  
  multilingualSeoTitle: "Multilingual SEO",
  hreflangLabel: "Language-specific URLs",
  hreflangDescription: "Add hreflang attributes for multilingual websites",
  enableHreflangLabel: "Enable hreflang tags",
  robotsIndexLabel: "Allow indexing",
  robotsFollowLabel: "Follow links",
  robotsArchiveLabel: "Allow archiving",
  robotsSnippetLabel: "Show snippet",
  robotsImageIndexLabel: "Index images",
  robotsTranslateLabel: "Allow translation",
  robotsMaxSnippetLabel: "Max snippet length",
  robotsMaxImagePreviewLabel: "Max image preview",
  robotsMaxVideoPreviewLabel: "Max video preview",
  robotsUnavailableAfterLabel: "Unavailable after",
  
  previewTitle: "Preview",
  searchPreviewTitle: "Search Engine Preview",
  socialPreviewTitle: "Social Media Preview",
  
  sampleTemplatesTitle: "Sample Templates",
  sampleTemplatesDescription: "Choose from commonly used meta tag templates to get started quickly.",
  applySampleButton: "Apply this template →",
  sampleWebsiteName: "General Website",
  sampleBlogName: "Blog Post",
  sampleProductName: "Product Page",
  
  generatedCodeTitle: "Generated Meta Tags",
  copyCodeButton: "Copy to Clipboard",
  copySuccess: "Copied to clipboard!",
  copyFailed: "Copy failed",
  
  featuresTitle: "Key Features",
  feature1Title: "Complete Meta Tags",
  feature1Description: "Generate all essential meta tags including SEO, Open Graph, and Twitter cards",
  feature2Title: "Live Preview",
  feature2Description: "See how your content will appear in search engines and social media",
  feature3Title: "Copy & Paste Ready",
  feature3Description: "Generated HTML code is ready to copy and paste into your website",
  
  howToUseTitle: "How to Use",
  howToUseSubtitle: "🏷️ How to Use Meta Tag Generator",
  step1: "Fill Basic Info: Enter your page title, description, and keywords",
  step2: "Social Media: Configure Open Graph and Twitter card settings",
  step3: "Advanced Settings: Set robots directives and other advanced options",
  step4: "Copy Code: Copy the generated HTML meta tags to your website",
  exampleTitle: "💡 Example",
  exampleDescription: "Title: 'Best Pizza in NYC - Tony's Pizza' (55 characters), Description: 'Discover authentic New York style pizza at Tony's. Fresh ingredients, wood-fired oven, delivery available.' (105 characters)",
  
  backToHome: "Back to Bob's Multi Tool",
  
  footerTitle: "Meta Tag Generator",
  footerPrivacy: "Privacy Policy",
  footerTerms: "Terms of Service",
  footerContact: "Contact",
  footerBackHome: "Back to Home",
  footerSupport: "Support:",
  footerCopyright: "2025 Bob's Multi Tool. All rights reserved.",
  
  'language.ko': '한국어',
  'language.en': 'English',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Korean
const ko: Translation = {
  pageTitle: "메타 태그 생성기 - SEO 메타 태그 생성 도구",
  pageDescription: "SEO 최적화를 위한 HTML 메타 태그를 생성해보세요. 타이틀, 설명, 오픈 그래프, 트위터 카드, 로봇 메타 태그를 만들어서 검색 엔진 순위를 높여보세요.",
  
  mainTitle: "메타 태그 생성기",
  mainSubtitle: "SEO 최적화를 위한 HTML 메타 태그 생성 도구",
  partOfText: "Bob's Multi Tool의 일부",
  
  basicTab: "기본 메타",
  socialTab: "소셜 미디어",
  advancedTab: "고급 설정",
  
  basicMetaTitle: "기본 메타 태그",
  titleLabel: "페이지 제목",
  titlePlaceholder: "페이지 제목을 입력하세요 (50-60자 권장)",
  titleHint: "검색 결과에서 최적 표시를 위해 60자 이내로 작성하세요",
  descriptionLabel: "메타 설명",
  descriptionPlaceholder: "페이지에 대한 매력적인 설명을 입력하세요 (150-160자)",
  descriptionHint: "최적의 SEO 효과를 위해 150-160자 사이로 작성하세요",
  keywordsLabel: "키워드",
  keywordsPlaceholder: "키워드1, 키워드2, 키워드3",
  keywordsHint: "쉼표로 키워드를 구분하세요. 3-5개 주요 키워드에 집중하세요",
  authorLabel: "작성자",
  authorPlaceholder: "작성자 이름",
  canonicalUrlLabel: "표준 URL",
  canonicalUrlPlaceholder: "https://example.com/page",
  languageLabel: "언어",
  charsetLabel: "문자 인코딩",
  
  socialMetaTitle: "소셜 미디어 메타 태그",
  ogTitleLabel: "오픈 그래프 제목",
  ogDescriptionLabel: "오픈 그래프 설명",
  ogImageLabel: "오픈 그래프 이미지 URL",
  ogImagePlaceholder: "https://example.com/image.jpg (1200x630px 권장)",
  ogUrlLabel: "오픈 그래프 URL",
  ogTypeLabel: "오픈 그래프 타입",
  ogTypeLabelWebsite: "웹사이트",
  ogTypeLabelArticle: "기사",
  ogTypeLabelProduct: "제품",
  fbAppIdLabel: "페이스북 앱 ID",
  fbAppIdPlaceholder: "페이스북 앱 ID",
  
  twitterSectionTitle: "트위터 카드",
  twitterCardLabel: "트위터 카드 타입",
  twitterCardSummary: "요약",
  twitterCardLargeImage: "큰 이미지 요약",
  twitterTitleLabel: "트위터 제목",
  twitterDescriptionLabel: "트위터 설명",
  twitterImageLabel: "트위터 이미지 URL",
  twitterSiteLabel: "트위터 사이트",
  twitterSitePlaceholder: "@yoursite",
  twitterCreatorLabel: "트위터 작성자",
  twitterCreatorPlaceholder: "@yourcreator",
  
  advancedMetaTitle: "고급 메타 태그",
  robotsTitle: "로봇 지시문",
  
  multilingualSeoTitle: "다국어 SEO",
  hreflangLabel: "언어별 URL",
  hreflangDescription: "다국어 웹사이트를 위한 hreflang 속성 추가",
  enableHreflangLabel: "Hreflang 태그 활성화",
  robotsIndexLabel: "인덱싱 허용",
  robotsFollowLabel: "링크 따라가기",
  robotsArchiveLabel: "아카이빙 허용",
  robotsSnippetLabel: "스니펫 표시",
  robotsImageIndexLabel: "이미지 인덱싱",
  robotsTranslateLabel: "번역 허용",
  robotsMaxSnippetLabel: "최대 스니펫 길이",
  robotsMaxImagePreviewLabel: "최대 이미지 미리보기",
  robotsMaxVideoPreviewLabel: "최대 비디오 미리보기",
  robotsUnavailableAfterLabel: "사용 불가 날짜",
  
  previewTitle: "미리보기",
  searchPreviewTitle: "검색 엔진 미리보기",
  socialPreviewTitle: "소셜 미디어 미리보기",
  
  sampleTemplatesTitle: "샘플 템플릿",
  sampleTemplatesDescription: "자주 사용되는 메타 태그 템플릿을 선택해서 빠르게 시작해보세요.",
  applySampleButton: "이 템플릿 적용하기 →",
  sampleWebsiteName: "일반 웹사이트",
  sampleBlogName: "블로그 포스트",
  sampleProductName: "제품 페이지",
  
  generatedCodeTitle: "생성된 메타 태그",
  copyCodeButton: "클립보드에 복사",
  copySuccess: "클립보드에 복사되었습니다!",
  copyFailed: "복사에 실패했습니다",
  
  featuresTitle: "주요 기능",
  feature1Title: "완전한 메타 태그",
  feature1Description: "SEO, 오픈 그래프, 트위터 카드를 포함한 모든 필수 메타 태그를 생성합니다",
  feature2Title: "실시간 미리보기",
  feature2Description: "검색 엔진과 소셜 미디어에서 콘텐츠가 어떻게 표시될지 미리 확인할 수 있습니다",
  feature3Title: "복사해서 바로 사용",
  feature3Description: "생성된 HTML 코드를 복사해서 웹사이트에 바로 붙여넣을 수 있습니다",
  
  howToUseTitle: "사용 방법",
  howToUseSubtitle: "🏷️ 메타 태그 생성기 사용법",
  step1: "기본 정보 입력: 페이지 제목, 설명, 키워드를 입력하세요",
  step2: "소셜 미디어: 오픈 그래프와 트위터 카드 설정을 구성하세요",
  step3: "고급 설정: 로봇 지시문과 기타 고급 옵션을 설정하세요",
  step4: "코드 복사: 생성된 HTML 메타 태그를 웹사이트에 복사하세요",
  exampleTitle: "💡 예시",
  exampleDescription: "제목: '서울 최고의 피자 - 토니 피자' (25자), 설명: '토니 피자에서 정통 이탈리아 피자를 만나보세요. 신선한 재료, 장작 오븐, 배달 가능.' (55자)",
  
  backToHome: "Bob's Multi Tool 홈으로 돌아가기",
  
  footerTitle: "메타 태그 생성기",
  footerPrivacy: "개인정보처리방침",
  footerTerms: "이용약관",
  footerContact: "문의하기",
  footerBackHome: "홈으로",
  footerSupport: "문의:",
  footerCopyright: "2025 Bob's Multi Tool. All rights reserved.",
  
  'language.ko': '한국어',
  'language.en': 'English',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Chinese (简体中文)
const zh: Translation = {
  pageTitle: "元标签生成器 - SEO元标签生成工具",
  pageDescription: "为SEO优化生成HTML元标签。创建标题、描述、Open Graph、Twitter卡片和robots元标签，提高搜索引擎排名。",
  
  mainTitle: "元标签生成器",
  mainSubtitle: "为SEO优化生成HTML元标签",
  partOfText: "Bob's Multi Tool的一部分",
  
  basicTab: "基础元标签",
  socialTab: "社交媒体",
  advancedTab: "高级设置",
  
  basicMetaTitle: "基础元标签",
  titleLabel: "页面标题",
  titlePlaceholder: "输入页面标题（建议50-60字符）",
  titleHint: "保持在60字符以内以在搜索结果中最佳显示",
  descriptionLabel: "元描述",
  descriptionPlaceholder: "输入页面的吸引人描述（150-160字符）",
  descriptionHint: "保持在150-160字符之间以获得最佳SEO效果",
  keywordsLabel: "关键词",
  keywordsPlaceholder: "关键词1, 关键词2, 关键词3",
  keywordsHint: "用逗号分隔关键词。专注于3-5个主要关键词",
  authorLabel: "作者",
  authorPlaceholder: "作者姓名",
  canonicalUrlLabel: "规范URL",
  canonicalUrlPlaceholder: "https://example.com/page",
  languageLabel: "语言",
  charsetLabel: "字符集",
  
  socialMetaTitle: "社交媒体元标签",
  ogTitleLabel: "Open Graph标题",
  ogDescriptionLabel: "Open Graph描述",
  ogImageLabel: "Open Graph图片URL",
  ogImagePlaceholder: "https://example.com/image.jpg（推荐1200x630px）",
  ogUrlLabel: "Open Graph URL",
  ogTypeLabel: "Open Graph类型",
  ogTypeLabelWebsite: "网站",
  ogTypeLabelArticle: "文章",
  ogTypeLabelProduct: "产品",
  fbAppIdLabel: "Facebook应用ID",
  fbAppIdPlaceholder: "您的Facebook应用ID",
  
  twitterSectionTitle: "Twitter卡片",
  twitterCardLabel: "Twitter卡片类型",
  twitterCardSummary: "摘要",
  twitterCardLargeImage: "大图摘要",
  twitterTitleLabel: "Twitter标题",
  twitterDescriptionLabel: "Twitter描述",
  twitterImageLabel: "Twitter图片URL",
  twitterSiteLabel: "Twitter网站",
  twitterSitePlaceholder: "@yoursite",
  twitterCreatorLabel: "Twitter创建者",
  twitterCreatorPlaceholder: "@yourcreator",
  
  advancedMetaTitle: "高级元标签",
  robotsTitle: "机器人指令",
  
  multilingualSeoTitle: "多语言SEO",
  hreflangLabel: "语言特定URL",
  hreflangDescription: "为多语言网站添加hreflang属性",
  enableHreflangLabel: "启用hreflang标签",
  robotsIndexLabel: "允许索引",
  robotsFollowLabel: "跟随链接",
  robotsArchiveLabel: "允许归档",
  robotsSnippetLabel: "显示摘要",
  robotsImageIndexLabel: "索引图片",
  robotsTranslateLabel: "允许翻译",
  robotsMaxSnippetLabel: "最大摘要长度",
  robotsMaxImagePreviewLabel: "最大图片预览",
  robotsMaxVideoPreviewLabel: "最大视频预览",
  robotsUnavailableAfterLabel: "不可用日期",
  
  previewTitle: "预览",
  searchPreviewTitle: "搜索引擎预览",
  socialPreviewTitle: "社交媒体预览",
  
  sampleTemplatesTitle: "示例模板",
  sampleTemplatesDescription: "选择常用的元标签模板快速开始。",
  applySampleButton: "应用此模板 →",
  sampleWebsiteName: "通用网站",
  sampleBlogName: "博客文章",
  sampleProductName: "产品页面",
  
  generatedCodeTitle: "生成的元标签",
  copyCodeButton: "复制到剪贴板",
  copySuccess: "已复制到剪贴板！",
  copyFailed: "复制失败",
  
  featuresTitle: "主要功能",
  feature1Title: "完整的元标签",
  feature1Description: "生成包括SEO、Open Graph和Twitter卡片在内的所有必需元标签",
  feature2Title: "实时预览",
  feature2Description: "查看您的内容在搜索引擎和社交媒体中的显示效果",
  feature3Title: "即复即用",
  feature3Description: "生成的HTML代码可直接复制粘贴到您的网站",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "🏷️ 如何使用元标签生成器",
  step1: "填写基本信息：输入页面标题、描述和关键词",
  step2: "社交媒体：配置Open Graph和Twitter卡片设置",
  step3: "高级设置：设置机器人指令和其他高级选项",
  step4: "复制代码：将生成的HTML元标签复制到您的网站",
  exampleTitle: "💡 示例",
  exampleDescription: "标题：'北京最佳披萨 - 托尼披萨'（15字符），描述：'在托尼披萨品尝正宗意大利披萨。新鲜食材，木柴炉烘烤，提供外送服务。'（40字符）",
  
  backToHome: "返回Bob's Multi Tool",
  
  footerTitle: "元标签生成器",
  footerPrivacy: "隐私政策",
  footerTerms: "服务条款",
  footerContact: "联系我们",
  footerBackHome: "返回首页",
  footerSupport: "支持：",
  footerCopyright: "2025 Bob's Multi Tool. 保留所有权利。",
  
  'language.ko': '한국어',
  'language.en': 'English',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Japanese
const ja: Translation = {
  pageTitle: "メタタグジェネレーター - SEOメタタグ生成ツール",
  pageDescription: "SEO最適化のためのHTMLメタタグを生成します。タイトル、説明、Open Graph、Twitterカード、robotsメタタグを作成して検索エンジンランキングを向上させましょう。",
  
  mainTitle: "メタタグジェネレーター",
  mainSubtitle: "SEO最適化のためのHTMLメタタグ生成ツール",
  partOfText: "Bob's Multi Toolの一部",
  
  basicTab: "基本メタ",
  socialTab: "ソーシャルメディア",
  advancedTab: "詳細設定",
  
  basicMetaTitle: "基本メタタグ",
  titleLabel: "ページタイトル",
  titlePlaceholder: "ページタイトルを入力してください（50-60文字推奨）",
  titleHint: "検索結果で最適に表示するため60文字以内にしてください",
  descriptionLabel: "メタ説明",
  descriptionPlaceholder: "ページの魅力的な説明を入力してください（150-160文字）",
  descriptionHint: "最適なSEO効果のため150-160文字にしてください",
  keywordsLabel: "キーワード",
  keywordsPlaceholder: "キーワード1, キーワード2, キーワード3",
  keywordsHint: "キーワードをカンマで区切ってください。3-5個の主要キーワードに焦点を当ててください",
  authorLabel: "著者",
  authorPlaceholder: "著者名",
  canonicalUrlLabel: "正規URL",
  canonicalUrlPlaceholder: "https://example.com/page",
  languageLabel: "言語",
  charsetLabel: "文字セット",
  
  socialMetaTitle: "ソーシャルメディアメタタグ",
  ogTitleLabel: "Open Graphタイトル",
  ogDescriptionLabel: "Open Graph説明",
  ogImageLabel: "Open Graph画像URL",
  ogImagePlaceholder: "https://example.com/image.jpg（1200x630px推奨）",
  ogUrlLabel: "Open Graph URL",
  ogTypeLabel: "Open Graphタイプ",
  ogTypeLabelWebsite: "ウェブサイト",
  ogTypeLabelArticle: "記事",
  ogTypeLabelProduct: "製品",
  fbAppIdLabel: "FacebookアプリID",
  fbAppIdPlaceholder: "FacebookアプリID",
  
  twitterSectionTitle: "Twitterカード",
  twitterCardLabel: "Twitterカードタイプ",
  twitterCardSummary: "要約",
  twitterCardLargeImage: "大画像要約",
  twitterTitleLabel: "Twitterタイトル",
  twitterDescriptionLabel: "Twitter説明",
  twitterImageLabel: "Twitter画像URL",
  twitterSiteLabel: "Twitterサイト",
  twitterSitePlaceholder: "@yoursite",
  twitterCreatorLabel: "Twitter作成者",
  twitterCreatorPlaceholder: "@yourcreator",
  
  advancedMetaTitle: "詳細メタタグ",
  robotsTitle: "ロボット指示",
  
  multilingualSeoTitle: "多言語SEO",
  hreflangLabel: "言語固有URL",
  hreflangDescription: "多言語ウェブサイト用のhreflang属性を追加",
  enableHreflangLabel: "hreflangタグを有効化",
  robotsIndexLabel: "インデックス許可",
  robotsFollowLabel: "リンクフォロー",
  robotsArchiveLabel: "アーカイブ許可",
  robotsSnippetLabel: "スニペット表示",
  robotsImageIndexLabel: "画像インデックス",
  robotsTranslateLabel: "翻訳許可",
  robotsMaxSnippetLabel: "最大スニペット長",
  robotsMaxImagePreviewLabel: "最大画像プレビュー",
  robotsMaxVideoPreviewLabel: "最大動画プレビュー",
  robotsUnavailableAfterLabel: "利用不可日",
  
  previewTitle: "プレビュー",
  searchPreviewTitle: "検索エンジンプレビュー",
  socialPreviewTitle: "ソーシャルメディアプレビュー",
  
  sampleTemplatesTitle: "サンプルテンプレート",
  sampleTemplatesDescription: "よく使用されるメタタグテンプレートを選択して素早く開始できます。",
  applySampleButton: "このテンプレートを適用 →",
  sampleWebsiteName: "一般ウェブサイト",
  sampleBlogName: "ブログ記事",
  sampleProductName: "商品ページ",
  
  generatedCodeTitle: "生成されたメタタグ",
  copyCodeButton: "クリップボードにコピー",
  copySuccess: "クリップボードにコピーしました！",
  copyFailed: "コピーに失敗しました",
  
  featuresTitle: "主な機能",
  feature1Title: "完全なメタタグ",
  feature1Description: "SEO、Open Graph、Twitterカードを含むすべての必要なメタタグを生成",
  feature2Title: "ライブプレビュー",
  feature2Description: "検索エンジンとソーシャルメディアでのコンテンツ表示を確認",
  feature3Title: "コピー&ペースト対応",
  feature3Description: "生成されたHTMLコードをすぐにウェブサイトにコピー&ペースト",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "🏷️ メタタグジェネレーターの使い方",
  step1: "基本情報入力：ページタイトル、説明、キーワードを入力",
  step2: "ソーシャルメディア：Open GraphとTwitterカード設定を構成",
  step3: "詳細設定：ロボット指示とその他の詳細オプションを設定",
  step4: "コードコピー：生成されたHTMLメタタグをウェブサイトにコピー",
  exampleTitle: "💡 例",
  exampleDescription: "タイトル：'東京最高のピザ - トニーズピザ'（20文字）、説明：'トニーズピザで本格的なニューヨークスタイルピザを発見。新鮮な食材、薪窯、配達可能。'（50文字）",
  
  backToHome: "Bob's Multi Toolに戻る",
  
  footerTitle: "メタタグジェネレーター",
  footerPrivacy: "プライバシーポリシー",
  footerTerms: "利用規約",
  footerContact: "お問い合わせ",
  footerBackHome: "ホームに戻る",
  footerSupport: "サポート：",
  footerCopyright: "2025 Bob's Multi Tool. 全著作権所有。",
  
  'language.ko': '한국어',
  'language.en': 'English',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Vietnamese
const vi: Translation = {
  pageTitle: "Trình Tạo Meta Tag - Công Cụ Tạo Meta Tag SEO",
  pageDescription: "Tạo meta tag HTML cho tối ưu hóa SEO. Tạo title, description, Open Graph, Twitter card và robots meta tag để cải thiện thứ hạng công cụ tìm kiếm.",
  
  mainTitle: "Trình Tạo Meta Tag",
  mainSubtitle: "Tạo meta tag HTML cho tối ưu hóa SEO",
  partOfText: "Một phần của Bob's Multi Tool",
  
  basicTab: "Meta Cơ Bản",
  socialTab: "Mạng Xã Hội",
  advancedTab: "Nâng Cao",
  
  basicMetaTitle: "Meta Tag Cơ Bản",
  titleLabel: "Tiêu Đề Trang",
  titlePlaceholder: "Nhập tiêu đề trang (khuyến nghị 50-60 ký tự)",
  titleHint: "Giữ dưới 60 ký tự để hiển thị tối ưu trong kết quả tìm kiếm",
  descriptionLabel: "Meta Description",
  descriptionPlaceholder: "Nhập mô tả hấp dẫn cho trang (150-160 ký tự)",
  descriptionHint: "Giữ từ 150-160 ký tự để có hiệu quả SEO tốt nhất",
  keywordsLabel: "Từ Khóa",
  keywordsPlaceholder: "từ khóa1, từ khóa2, từ khóa3",
  keywordsHint: "Phân tách từ khóa bằng dấu phẩy. Tập trung vào 3-5 từ khóa chính",
  authorLabel: "Tác Giả",
  authorPlaceholder: "Tên tác giả",
  canonicalUrlLabel: "URL Canonical",
  canonicalUrlPlaceholder: "https://example.com/page",
  languageLabel: "Ngôn Ngữ",
  charsetLabel: "Bộ Ký Tự",
  
  socialMetaTitle: "Meta Tag Mạng Xã Hội",
  ogTitleLabel: "Tiêu Đề Open Graph",
  ogDescriptionLabel: "Mô Tả Open Graph",
  ogImageLabel: "URL Hình Ảnh Open Graph",
  ogImagePlaceholder: "https://example.com/image.jpg (khuyến nghị 1200x630px)",
  ogUrlLabel: "URL Open Graph",
  ogTypeLabel: "Loại Open Graph",
  ogTypeLabelWebsite: "Website",
  ogTypeLabelArticle: "Bài Viết",
  ogTypeLabelProduct: "Sản Phẩm",
  fbAppIdLabel: "Facebook App ID",
  fbAppIdPlaceholder: "Facebook App ID của bạn",
  
  twitterSectionTitle: "Twitter Card",
  twitterCardLabel: "Loại Twitter Card",
  twitterCardSummary: "Tóm Tắt",
  twitterCardLargeImage: "Tóm Tắt Hình Lớn",
  twitterTitleLabel: "Tiêu Đề Twitter",
  twitterDescriptionLabel: "Mô Tả Twitter",
  twitterImageLabel: "URL Hình Ảnh Twitter",
  twitterSiteLabel: "Twitter Site",
  twitterSitePlaceholder: "@yoursite",
  twitterCreatorLabel: "Twitter Creator",
  twitterCreatorPlaceholder: "@yourcreator",
  
  advancedMetaTitle: "Meta Tag Nâng Cao",
  robotsTitle: "Chỉ Thị Robot",
  
  multilingualSeoTitle: "SEO Đa Ngôn Ngữ",
  hreflangLabel: "URL Theo Ngôn Ngữ",
  hreflangDescription: "Thêm thuộc tính hreflang cho website đa ngôn ngữ",
  enableHreflangLabel: "Kích hoạt thẻ hreflang",
  robotsIndexLabel: "Cho phép lập chỉ mục",
  robotsFollowLabel: "Theo dõi liên kết",
  robotsArchiveLabel: "Cho phép lưu trữ",
  robotsSnippetLabel: "Hiển thị đoạn trích",
  robotsImageIndexLabel: "Lập chỉ mục hình ảnh",
  robotsTranslateLabel: "Cho phép dịch",
  robotsMaxSnippetLabel: "Độ dài đoạn trích tối đa",
  robotsMaxImagePreviewLabel: "Xem trước hình ảnh tối đa",
  robotsMaxVideoPreviewLabel: "Xem trước video tối đa",
  robotsUnavailableAfterLabel: "Không khả dụng sau",
  
  previewTitle: "Xem Trước",
  searchPreviewTitle: "Xem Trước Công Cụ Tìm Kiếm",
  socialPreviewTitle: "Xem Trước Mạng Xã Hội",
  
  sampleTemplatesTitle: "Mẫu Template",
  sampleTemplatesDescription: "Chọn từ các mẫu meta tag thông dụng để bắt đầu nhanh chóng.",
  applySampleButton: "Áp dụng mẫu này →",
  sampleWebsiteName: "Website Tổng Quát",
  sampleBlogName: "Bài Blog",
  sampleProductName: "Trang Sản Phẩm",
  
  generatedCodeTitle: "Meta Tag Đã Tạo",
  copyCodeButton: "Sao Chép Vào Clipboard",
  copySuccess: "Đã sao chép vào clipboard!",
  copyFailed: "Sao chép thất bại",
  
  featuresTitle: "Tính Năng Chính",
  feature1Title: "Meta Tag Hoàn Chỉnh",
  feature1Description: "Tạo tất cả meta tag cần thiết bao gồm SEO, Open Graph và Twitter card",
  feature2Title: "Xem Trước Trực Tiếp",
  feature2Description: "Xem nội dung sẽ hiển thị như thế nào trên công cụ tìm kiếm và mạng xã hội",
  feature3Title: "Sẵn Sàng Sao Chép & Dán",
  feature3Description: "Mã HTML được tạo sẵn sàng để sao chép và dán vào website",
  
  howToUseTitle: "Cách Sử Dụng",
  howToUseSubtitle: "🏷️ Cách Sử Dụng Trình Tạo Meta Tag",
  step1: "Điền Thông Tin Cơ Bản: Nhập tiêu đề trang, mô tả và từ khóa",
  step2: "Mạng Xã Hội: Cấu hình cài đặt Open Graph và Twitter card",
  step3: "Cài Đặt Nâng Cao: Thiết lập chỉ thị robot và các tùy chọn nâng cao khác",
  step4: "Sao Chép Mã: Sao chép meta tag HTML đã tạo vào website",
  exampleTitle: "💡 Ví Dụ",
  exampleDescription: "Tiêu đề: 'Pizza Ngon Nhất Sài Gòn - Tony's Pizza' (35 ký tự), Mô tả: 'Khám phá pizza kiểu Ý chính thống tại Tony's. Nguyên liệu tươi, lò nướng củi, có giao hàng.' (90 ký tự)",
  
  backToHome: "Quay Về Bob's Multi Tool",
  
  footerTitle: "Trình Tạo Meta Tag",
  footerPrivacy: "Chính Sách Bảo Mật",
  footerTerms: "Điều Khoản Dịch Vụ",
  footerContact: "Liên Hệ",
  footerBackHome: "Về Trang Chủ",
  footerSupport: "Hỗ Trợ:",
  footerCopyright: "2025 Bob's Multi Tool. Bảo lưu mọi quyền.",
  
  'language.ko': '한국어',
  'language.en': 'English',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

export const translations = {
  en,
  ko,
  zh,
  ja,
  vi,
} as const;

export type SupportedLanguage = keyof typeof translations;
export type TranslationKey = keyof Translation; 