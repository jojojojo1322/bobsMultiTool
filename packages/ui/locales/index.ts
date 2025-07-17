export type Language = 'en' | 'ko' | 'zh' | 'ja' | 'vi';

export interface Translation {
  // Page Title and Description
  pageTitle: string;
  pageDescription: string;
  
  // Header
  toolTitle: string;
  toolSubtitle: string;
  
  // URL Input
  urlLabel: string;
  urlPlaceholder: string;
  loadButton: string;
  urlHint: string;
  
  // Device Categories
  mobileCategory: string;
  tabletCategory: string;
  desktopCategory: string;
  customCategory: string;
  
  // Device Names
  'device.iPhone_15': string;
  'device.iPhone_SE': string;
  'device.Galaxy_S24': string;
  'device.iPad': string;
  'device.iPad_Pro': string;
  'device.Laptop': string;
  'device.Desktop': string;
  'device.Desktop_4K': string;
  'device.Custom': string;
  
  // Current Settings
  currentSettings: string;
  
  // Code Export
  exportCodeButton: string;
  exportCodeTitle: string;
  exportCodeDescription: string;
  
  // Code Types
  basicIframe: string;
  responsiveIframe: string;
  styledIframe: string;
  cssClassIframe: string;
  
  // Code Descriptions
  responsiveDescription: string;
  styledDescription: string;
  cssClassDescription: string;
  
  // Buttons
  copyButton: string;
  closeButton: string;
  retryButton: string;
  
  // States
  loading: string;
  loadingFailed: string;
  loadingFailedMessage: string;
  corsMessage: string;
  
  // Messages
  copySuccess: string;
  copyFailed: string;
  
  // Zoom
  autoAdjusted: string;
  
  // Language Names
  'language.en': string;
  'language.ko': string;
  'language.zh': string;
  'language.ja': string;
  'language.vi': string;
  
  // Pro Tips Section
  proTipsTitle: string;
  testingBestPracticesTitle: string;
  testingBestPractice1: string;
  testingBestPractice2: string;
  testingBestPractice3: string;
  testingBestPractice4: string;
  commonIssuesTitle: string;
  commonIssue1: string;
  commonIssue2: string;
  commonIssue3: string;
  commonIssue4: string;

  // RegAx Tool
  regaxTitle: string;
  regaxSubtitle: string;
  regaxDescription: string;
  patternLabel: string;
  patternPlaceholder: string;
  flagsPlaceholder: string;
  testStringLabel: string;
  testStringPlaceholder: string;
  resultsLabel: string;
  noResultsText: string;
  usageInstructionsTitle: string;
  featuresTitle: string;
  backToHome: string;

  // Main Landing Page
  mainTitle: string;
  mainSubtitle: string;
  mainDescription: string;
  toolsTitle: string;
  iframeViewerTitle: string;
  iframeViewerDescription: string;
  regaxToolTitle: string;
  regaxToolDescription: string;
  moreToolsTitle: string;
  moreToolsDescription: string;
  moreToolsComingSoon: string;
  useToolButton: string;
  mainFeaturesTitle: string;
  fastAndEasyTitle: string;
  fastAndEasyDescription: string;
  completelyFreeTitle: string;
  completelyFreeDescription: string;
  developerFriendlyTitle: string;
  developerFriendlyDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaIframeButton: string;
  ctaRegaxButton: string;
  footerDescription: string;
  footerToolsTitle: string;
  footerInfoTitle: string;
  footerPrivacy: string;
  footerTerms: string;
  footerContact: string;
  footerCopyright: string;
}

export type TranslationKey = keyof Translation;

// English (default)
const en: Translation = {
  pageTitle: 'Iframe Viewer Tool - Website Preview Tool',
  pageDescription: 'A developer tool that allows you to preview websites in various device sizes. Provides real-time preview for iPhone, iPad, Desktop sizes.',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: 'Preview websites in various device sizes',
  
  urlLabel: 'Website URL',
  urlPlaceholder: 'https://www.example.com',
  loadButton: 'Load',
  urlHint: 'Smart URL completion: "example.com" → "https://www.example.com", "localhost:3000" → "http://localhost:3000"',
  
  mobileCategory: '📱 Mobile',
  tabletCategory: '📱 Tablet',
  desktopCategory: '💻 Desktop',
  customCategory: '⚙️ Custom',
  
  'device.iPhone_15': 'iPhone 15',
  'device.iPhone_SE': 'iPhone SE',
  'device.Galaxy_S24': 'Galaxy S24',
  'device.iPad': 'iPad',
  'device.iPad_Pro': 'iPad Pro',
  'device.Laptop': 'Laptop',
  'device.Desktop': 'Desktop',
  'device.Desktop_4K': '4K Desktop',
  'device.Custom': 'Custom',
  
  currentSettings: 'Current Settings:',
  
  exportCodeButton: '📋 Export iframe Code',
  exportCodeTitle: '📋 iframe Code Export',
  exportCodeDescription: 'Generate iframe codes in various formats based on current settings.',
  
  basicIframe: 'Basic iframe',
  responsiveIframe: 'Responsive iframe',
  styledIframe: 'Styled iframe',
  cssClassIframe: 'CSS Class iframe',
  
  responsiveDescription: 'Size automatically adjusts to fit the parent container.',
  styledDescription: 'iframe with border and shadow effects applied.',
  cssClassDescription: 'Styles can be managed in a separate CSS file.',
  
  copyButton: 'Copy',
  closeButton: 'Close',
  retryButton: 'Retry',
  
  loading: 'Loading...',
  loadingFailed: 'Loading Failed',
  loadingFailedMessage: 'Unable to load the website.',
  corsMessage: 'This may be due to CORS policy blocking or invalid URL.',
  
  copySuccess: 'Copied to clipboard!',
  copyFailed: 'Copy failed.',
  
  autoAdjusted: 'Auto-adjusted',
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  proTipsTitle: '💡 Pro Tips for Website Testing',
  testingBestPracticesTitle: '🎯 Testing Best Practices',
  testingBestPractice1: '• Test on actual device sizes first',
  testingBestPractice2: '• Check loading speed on mobile',
  testingBestPractice3: '• Verify touch targets are 44px+',
  testingBestPractice4: '• Test landscape and portrait modes',
  commonIssuesTitle: '🔧 Common Issues to Check',
  commonIssue1: '• Horizontal scrolling on mobile',
  commonIssue2: '• Text too small to read',
  commonIssue3: '• Buttons too close together',
  commonIssue4: '• Images not optimized for mobile',

  // RegAx Tool
  regaxTitle: 'RegAx',
  regaxSubtitle: 'A powerful tool for testing and validating regular expression patterns',
  regaxDescription: 'Test your regex patterns in real-time with powerful debugging features for developers.',
  patternLabel: 'Regular Expression Pattern',
  patternPlaceholder: '[a-zA-Z0-9]+',
  flagsPlaceholder: 'gim',
  testStringLabel: 'Test String',
  testStringPlaceholder: 'Enter your test string here...',
  resultsLabel: 'Match Results',
  noResultsText: 'Matching results will be displayed here when you enter a regular expression',
  usageInstructionsTitle: 'How to Use',
  featuresTitle: 'Features',
  backToHome: "Back to Bob's Multi Tool Home",

  // Main Landing Page
  mainTitle: "Bob's Multi Tool",
  mainSubtitle: 'Free Online Developer Tools Collection',
  mainDescription: 'Essential tools to make web development work easier and faster. All tools are provided for free and can be used immediately without registration.',
  toolsTitle: 'Available Tools',
  iframeViewerTitle: 'Iframe Viewer',
  iframeViewerDescription: 'A tool to preview websites in various device sizes. Check how your website looks in real device environments like iPhone, iPad, Desktop.',
  regaxToolTitle: 'RegAx',
  regaxToolDescription: 'A powerful tool for testing and validating regular expression patterns. Test regex patterns in real-time and complete your patterns.',
  moreToolsTitle: 'More Tools',
  moreToolsDescription: 'More useful developer tools will be added soon. Stay tuned for updates!',
  moreToolsComingSoon: 'Coming Soon...',
  useToolButton: 'Use Tool',
  mainFeaturesTitle: 'Key Features',
  fastAndEasyTitle: 'Fast and Simple',
  fastAndEasyDescription: 'Can be used immediately without registration. No complex installation or configuration required.',
  completelyFreeTitle: 'Completely Free',
  completelyFreeDescription: 'All tools are provided for free. No hidden costs or premium features.',
  developerFriendlyTitle: 'Developer Friendly',
  developerFriendlyDescription: 'Composed of features that developers actually need. Practical and efficient.',
  ctaTitle: 'Get Started Right Now',
  ctaDescription: 'Try tools that make development work more efficient for free. You can start right away without registration or installation.',
  ctaIframeButton: 'Use Iframe Viewer',
  ctaRegaxButton: 'Use RegAx',
  footerDescription: 'A free online developer tools collection. We provide tools that make web development work easier and faster.',
  footerToolsTitle: 'Tools',
  footerInfoTitle: 'Information',
  footerPrivacy: 'Privacy Policy',
  footerTerms: 'Terms of Service',
  footerContact: 'Contact',
  footerCopyright: '© 2024 Bob\'s Multi Tool. All rights reserved. Made with ❤️ for developers.',
};

// Korean
const ko: Translation = {
  pageTitle: 'Iframe Viewer Tool - 웹사이트 미리보기 도구',
  pageDescription: '다양한 디바이스 크기로 웹사이트를 미리보기할 수 있는 개발자 도구입니다. iPhone, iPad, Desktop 크기로 실시간 미리보기를 제공합니다.',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: '다양한 디바이스 크기로 웹사이트를 미리보기하세요',
  
  urlLabel: '웹사이트 URL',
  urlPlaceholder: 'https://www.example.com',
  loadButton: '로드',
  urlHint: '스마트 URL 자동완성: "example.com" → "https://www.example.com", "localhost:3000" → "http://localhost:3000"',
  
  mobileCategory: '📱 모바일',
  tabletCategory: '📱 태블릿',
  desktopCategory: '💻 데스크톱',
  customCategory: '⚙️ 커스텀',
  
  'device.iPhone_15': 'iPhone 15',
  'device.iPhone_SE': 'iPhone SE',
  'device.Galaxy_S24': 'Galaxy S24',
  'device.iPad': 'iPad',
  'device.iPad_Pro': 'iPad Pro',
  'device.Laptop': 'Laptop',
  'device.Desktop': 'Desktop',
  'device.Desktop_4K': '4K Desktop',
  'device.Custom': 'Custom',
  
  currentSettings: '현재 설정:',
  
  exportCodeButton: '📋 iframe 코드 추출',
  exportCodeTitle: '📋 iframe 코드 추출',
  exportCodeDescription: '현재 설정에 맞는 iframe 코드를 다양한 형태로 생성합니다.',
  
  basicIframe: '기본 iframe',
  responsiveIframe: '반응형 iframe',
  styledIframe: '스타일 적용 iframe',
  cssClassIframe: 'CSS 클래스 iframe',
  
  responsiveDescription: '부모 컨테이너에 맞춰 크기가 자동 조절됩니다.',
  styledDescription: '테두리와 그림자 효과가 적용된 iframe입니다.',
  cssClassDescription: 'CSS 파일에 스타일을 분리하여 관리할 수 있습니다.',
  
  copyButton: '복사',
  closeButton: '닫기',
  retryButton: '다시 시도',
  
  loading: '로딩 중...',
  loadingFailed: '로딩 실패',
  loadingFailedMessage: '웹사이트를 불러올 수 없습니다.',
  corsMessage: 'CORS 정책 차단이나 잘못된 URL일 수 있습니다.',
  
  copySuccess: '클립보드에 복사되었습니다!',
  copyFailed: '복사에 실패했습니다.',
  
  autoAdjusted: '자동 조정',
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  proTipsTitle: '💡 웹사이트 테스트 전문 팁',
  testingBestPracticesTitle: '🎯 테스트 모범 사례',
  testingBestPractice1: '• 실제 디바이스 크기로 먼저 테스트',
  testingBestPractice2: '• 모바일에서 로딩 속도 확인',
  testingBestPractice3: '• 터치 타겟이 44px 이상인지 확인',
  testingBestPractice4: '• 가로/세로 모드 모두 테스트',
  commonIssuesTitle: '🔧 확인해야 할 일반적인 문제',
  commonIssue1: '• 모바일에서 가로 스크롤 발생',
  commonIssue2: '• 텍스트가 너무 작아서 읽기 어려움',
  commonIssue3: '• 버튼들이 너무 가까이 있음',
  commonIssue4: '• 모바일용으로 최적화되지 않은 이미지',

  // RegAx Tool
  regaxTitle: 'RegAx',
  regaxSubtitle: '정규식 패턴을 테스트하고 검증할 수 있는 강력한 도구',
  regaxDescription: '개발자를 위한 강력한 디버깅 기능으로 정규식 패턴을 실시간으로 테스트하세요.',
  patternLabel: '정규식 패턴',
  patternPlaceholder: '[a-zA-Z0-9]+',
  flagsPlaceholder: 'gim',
  testStringLabel: '테스트할 문자열',
  testStringPlaceholder: '여기에 테스트할 문자열을 입력하세요...',
  resultsLabel: '매칭 결과',
  noResultsText: '정규식을 입력하면 매칭 결과가 여기에 표시됩니다',
  usageInstructionsTitle: '사용 방법',
  featuresTitle: '기능',
  backToHome: "Bob's Multi Tool 홈으로 돌아가기",

  // Main Landing Page
  mainTitle: "Bob's Multi Tool",
  mainSubtitle: '개발자를 위한 무료 온라인 도구 모음집',
  mainDescription: '웹 개발 작업을 더 쉽고 빠르게 만들어주는 필수 도구들을 한 곳에서 만나보세요. 모든 도구는 무료로 제공되며, 별도의 회원가입 없이 바로 사용할 수 있습니다.',
  toolsTitle: '제공하는 도구들',
  iframeViewerTitle: 'Iframe Viewer',
  iframeViewerDescription: '다양한 디바이스 크기로 웹사이트를 미리보기할 수 있는 도구입니다. iPhone, iPad, Desktop 등 실제 디바이스 환경에서 웹사이트가 어떻게 보이는지 확인하세요.',
  regaxToolTitle: 'RegAx',
  regaxToolDescription: '정규식 패턴을 테스트하고 검증할 수 있는 강력한 도구입니다. 실시간으로 정규표현식 매칭 결과를 확인하고 패턴을 완성하세요.',
  moreToolsTitle: '더 많은 도구',
  moreToolsDescription: '곧 더 많은 유용한 개발자 도구들이 추가될 예정입니다. 업데이트를 기다려 주세요!',
  moreToolsComingSoon: '준비 중...',
  useToolButton: '도구 사용하기',
  mainFeaturesTitle: '주요 특징',
  fastAndEasyTitle: '빠르고 간편',
  fastAndEasyDescription: '회원가입 없이 바로 사용할 수 있습니다. 복잡한 설치나 설정이 필요하지 않습니다.',
  completelyFreeTitle: '완전 무료',
  completelyFreeDescription: '모든 도구는 무료로 제공됩니다. 숨겨진 비용이나 프리미엄 기능이 없습니다.',
  developerFriendlyTitle: '개발자 친화적',
  developerFriendlyDescription: '개발자가 실제로 필요로 하는 기능들로 구성되어 있습니다. 실용적이고 효율적입니다.',
  ctaTitle: '지금 바로 시작하세요',
  ctaDescription: '개발 작업을 더 효율적으로 만들어주는 도구들을 무료로 사용해보세요. 회원가입이나 설치 없이 바로 시작할 수 있습니다.',
  ctaIframeButton: 'Iframe Viewer 사용하기',
  ctaRegaxButton: 'RegAx 사용하기',
  footerDescription: '개발자를 위한 무료 온라인 도구 모음집입니다. 웹 개발 작업을 더 쉽고 빠르게 만들어주는 도구들을 제공합니다.',
  footerToolsTitle: '도구들',
  footerInfoTitle: '정보',
  footerPrivacy: '개인정보처리방침',
  footerTerms: '이용약관',
  footerContact: '문의하기',
  footerCopyright: '© 2024 Bob\'s Multi Tool. 모든 권리 보유. Made with ❤️ for developers.',
};

// Chinese (Simplified)
const zh: Translation = {
  pageTitle: 'Iframe Viewer Tool - 网站预览工具',
  pageDescription: '一个开发者工具，可以在各种设备尺寸下预览网站。为iPhone、iPad、桌面尺寸提供实时预览。',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: '在各种设备尺寸下预览网站',
  
  urlLabel: '网站 URL',
  urlPlaceholder: 'https://www.example.com',
  loadButton: '加载',
  urlHint: '智能URL补全: "example.com" → "https://www.example.com", "localhost:3000" → "http://localhost:3000"',
  
  mobileCategory: '📱 手机',
  tabletCategory: '📱 平板',
  desktopCategory: '💻 桌面',
  customCategory: '⚙️ 自定义',
  
  'device.iPhone_15': 'iPhone 15',
  'device.iPhone_SE': 'iPhone SE',
  'device.Galaxy_S24': 'Galaxy S24',
  'device.iPad': 'iPad',
  'device.iPad_Pro': 'iPad Pro',
  'device.Laptop': '笔记本',
  'device.Desktop': '桌面',
  'device.Desktop_4K': '4K 桌面',
  'device.Custom': '自定义',
  
  currentSettings: '当前设置：',
  
  exportCodeButton: '📋 导出 iframe 代码',
  exportCodeTitle: '📋 iframe 代码导出',
  exportCodeDescription: '根据当前设置生成各种格式的 iframe 代码。',
  
  basicIframe: '基础 iframe',
  responsiveIframe: '响应式 iframe',
  styledIframe: '样式化 iframe',
  cssClassIframe: 'CSS 类 iframe',
  
  responsiveDescription: '大小会自动调整以适应父容器。',
  styledDescription: '应用了边框和阴影效果的 iframe。',
  cssClassDescription: '可以在单独的 CSS 文件中管理样式。',
  
  copyButton: '复制',
  closeButton: '关闭',
  retryButton: '重试',
  
  loading: '加载中...',
  loadingFailed: '加载失败',
  loadingFailedMessage: '无法加载网站。',
  corsMessage: '这可能是由于 CORS 策略阻止或无效的 URL。',
  
  copySuccess: '已复制到剪贴板！',
  copyFailed: '复制失败。',
  
  autoAdjusted: '自动调整',
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  proTipsTitle: '💡 网站测试专业技巧',
  testingBestPracticesTitle: '🎯 测试最佳实践',
  testingBestPractice1: '• 首先在实际设备尺寸上测试',
  testingBestPractice2: '• 检查移动端加载速度',
  testingBestPractice3: '• 验证触摸目标至少为44px',
  testingBestPractice4: '• 测试横屏和竖屏模式',
  commonIssuesTitle: '🔧 常见问题检查',
  commonIssue1: '• 移动端出现水平滚动',
  commonIssue2: '• 文字太小难以阅读',
  commonIssue3: '• 按钮间距太近',
  commonIssue4: '• 图片未针对移动端优化',

  // RegAx Tool
  regaxTitle: 'RegAx',
  regaxSubtitle: '用于测试和验证正则表达式模式的强大工具',
  regaxDescription: '为开发者提供强大的调试功能，实时测试正则表达式模式。',
  patternLabel: '正则表达式模式',
  patternPlaceholder: '[a-zA-Z0-9]+',
  flagsPlaceholder: 'gim',
  testStringLabel: '测试字符串',
  testStringPlaceholder: '在此输入您的测试字符串...',
  resultsLabel: '匹配结果',
  noResultsText: '输入正则表达式后，匹配结果将显示在这里',
  usageInstructionsTitle: '使用方法',
  featuresTitle: '功能',
  backToHome: '返回 Bob\'s Multi Tool 主页',

  // Main Landing Page
  mainTitle: "Bob's Multi Tool",
  mainSubtitle: '免费在线开发者工具集合',
  mainDescription: '让Web开发工作更轻松快捷的必备工具。所有工具都免费提供，无需注册即可立即使用。',
  toolsTitle: '可用工具',
  iframeViewerTitle: 'Iframe Viewer',
  iframeViewerDescription: '在各种设备尺寸下预览网站的工具。检查您的网站在iPhone、iPad、Desktop等真实设备环境中的显示效果。',
  regaxToolTitle: 'RegAx',
  regaxToolDescription: '测试和验证正则表达式模式的强大工具。实时测试正则表达式模式并完善您的模式。',
  moreToolsTitle: '更多工具',
  moreToolsDescription: '更多有用的开发者工具即将推出。敬请期待更新！',
  moreToolsComingSoon: '即将推出...',
  useToolButton: '使用工具',
  mainFeaturesTitle: '主要特性',
  fastAndEasyTitle: '快速简便',
  fastAndEasyDescription: '无需注册即可立即使用。不需要复杂的安装或配置。',
  completelyFreeTitle: '完全免费',
  completelyFreeDescription: '所有工具都免费提供。没有隐藏费用或高级功能。',
  developerFriendlyTitle: '开发者友好',
  developerFriendlyDescription: '由开发者真正需要的功能组成。实用且高效。',
  ctaTitle: '立即开始',
  ctaDescription: '免费试用让开发工作更高效的工具。无需注册或安装即可立即开始。',
  ctaIframeButton: '使用 Iframe Viewer',
  ctaRegaxButton: '使用 RegAx',
  footerDescription: '免费在线开发者工具集合。我们提供让Web开发工作更轻松快捷的工具。',
  footerToolsTitle: '工具',
  footerInfoTitle: '信息',
  footerPrivacy: '隐私政策',
  footerTerms: '服务条款',
  footerContact: '联系我们',
  footerCopyright: '© 2024 Bob\'s Multi Tool. 保留所有权利。用❤️为开发者制作。',
};

// Japanese
const ja: Translation = {
  pageTitle: 'Iframe Viewer Tool - ウェブサイトプレビューツール',
  pageDescription: '様々なデバイスサイズでウェブサイトをプレビューできる開発者ツールです。iPhone、iPad、デスクトップサイズでリアルタイムプレビューを提供します。',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: '様々なデバイスサイズでウェブサイトをプレビュー',
  
  urlLabel: 'ウェブサイト URL',
  urlPlaceholder: 'https://www.example.com',
  loadButton: '読み込み',
  urlHint: 'スマートURL補完: "example.com" → "https://www.example.com", "localhost:3000" → "http://localhost:3000"',
  
  mobileCategory: '📱 モバイル',
  tabletCategory: '📱 タブレット',
  desktopCategory: '💻 デスクトップ',
  customCategory: '⚙️ カスタム',
  
  'device.iPhone_15': 'iPhone 15',
  'device.iPhone_SE': 'iPhone SE',
  'device.Galaxy_S24': 'Galaxy S24',
  'device.iPad': 'iPad',
  'device.iPad_Pro': 'iPad Pro',
  'device.Laptop': 'ラップトップ',
  'device.Desktop': 'デスクトップ',
  'device.Desktop_4K': '4K デスクトップ',
  'device.Custom': 'カスタム',
  
  currentSettings: '現在の設定：',
  
  exportCodeButton: '📋 iframe コード出力',
  exportCodeTitle: '📋 iframe コード出力',
  exportCodeDescription: '現在の設定に基づいて様々な形式の iframe コードを生成します。',
  
  basicIframe: '基本 iframe',
  responsiveIframe: 'レスポンシブ iframe',
  styledIframe: 'スタイル付き iframe',
  cssClassIframe: 'CSS クラス iframe',
  
  responsiveDescription: '親コンテナに合わせてサイズが自動調整されます。',
  styledDescription: 'ボーダーとシャドウ効果が適用された iframe です。',
  cssClassDescription: '別の CSS ファイルでスタイルを管理できます。',
  
  copyButton: 'コピー',
  closeButton: '閉じる',
  retryButton: '再試行',
  
  loading: '読み込み中...',
  loadingFailed: '読み込み失敗',
  loadingFailedMessage: 'ウェブサイトを読み込めません。',
  corsMessage: 'CORS ポリシーブロックまたは無効な URL の可能性があります。',
  
  copySuccess: 'クリップボードにコピーしました！',
  copyFailed: 'コピーに失敗しました。',
  
  autoAdjusted: '自動調整',
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  proTipsTitle: '💡 ウェブサイトテストのプロのコツ',
  testingBestPracticesTitle: '🎯 テストのベストプラクティス',
  testingBestPractice1: '• まず実際のデバイスサイズでテスト',
  testingBestPractice2: '• モバイルでの読み込み速度を確認',
  testingBestPractice3: '• タッチターゲットが44px以上であることを確認',
  testingBestPractice4: '• 横向きと縦向きの両方をテスト',
  commonIssuesTitle: '🔧 チェックすべき一般的な問題',
  commonIssue1: '• モバイルでの横スクロール',
  commonIssue2: '• 読むには小さすぎるテキスト',
  commonIssue3: '• ボタンが近すぎる',
  commonIssue4: '• モバイル用に最適化されていない画像',

  // RegAx Tool
  regaxTitle: 'RegAx',
  regaxSubtitle: '正規表現パターンをテストおよび検証するための強力なツール',
  regaxDescription: '開発者向けの強力なデバッグ機能で正規表現パターンをリアルタイムでテストできます。',
  patternLabel: '正規表現パターン',
  patternPlaceholder: '[a-zA-Z0-9]+',
  flagsPlaceholder: 'gim',
  testStringLabel: 'テスト文字列',
  testStringPlaceholder: 'ここにテスト文字列を入力してください...',
  resultsLabel: 'マッチング結果',
  noResultsText: '正規表現を入力すると、マッチング結果がここに表示されます',
  usageInstructionsTitle: '使用方法',
  featuresTitle: '機能',
  backToHome: 'Bob\'s Multi Tool ホームに戻る',

  // Main Landing Page
  mainTitle: "Bob's Multi Tool",
  mainSubtitle: '無料オンライン開発者ツール集',
  mainDescription: 'ウェブ開発作業をより簡単で高速にする必須ツール。すべてのツールは無料で提供され、登録なしですぐに使用できます。',
  toolsTitle: '利用可能なツール',
  iframeViewerTitle: 'Iframe Viewer',
  iframeViewerDescription: '様々なデバイスサイズでウェブサイトをプレビューするツール。iPhone、iPad、Desktopなどの実際のデバイス環境でウェブサイトがどのように見えるかを確認できます。',
  regaxToolTitle: 'RegAx',
  regaxToolDescription: '正規表現パターンをテストおよび検証するための強力なツール。正規表現パターンをリアルタイムでテストし、パターンを完成させましょう。',
  moreToolsTitle: 'その他のツール',
  moreToolsDescription: 'より多くの有用な開発者ツールが間もなく追加される予定です。アップデートをお待ちください！',
  moreToolsComingSoon: '近日公開...',
  useToolButton: 'ツールを使用',
  mainFeaturesTitle: '主な機能',
  fastAndEasyTitle: '高速で簡単',
  fastAndEasyDescription: '登録なしですぐに使用できます。複雑なインストールや設定は必要ありません。',
  completelyFreeTitle: '完全無料',
  completelyFreeDescription: 'すべてのツールは無料で提供されます。隠れた費用やプレミアム機能はありません。',
  developerFriendlyTitle: '開発者フレンドリー',
  developerFriendlyDescription: '開発者が実際に必要とする機能で構成されています。実用的で効率的です。',
  ctaTitle: '今すぐ始めましょう',
  ctaDescription: '開発作業をより効率的にするツールを無料で試してください。登録やインストールなしですぐに開始できます。',
  ctaIframeButton: 'Iframe Viewer を使用',
  ctaRegaxButton: 'RegAx を使用',
  footerDescription: '無料オンライン開発者ツール集。ウェブ開発作業をより簡単で高速にするツールを提供します。',
  footerToolsTitle: 'ツール',
  footerInfoTitle: '情報',
  footerPrivacy: 'プライバシーポリシー',
  footerTerms: '利用規約',
  footerContact: 'お問い合わせ',
  footerCopyright: '© 2024 Bob\'s Multi Tool. すべての権利を保有。開発者のために❤️で作成。',
};

// Vietnamese
const vi: Translation = {
  pageTitle: 'Iframe Viewer Tool - Công cụ xem trước trang web',
  pageDescription: 'Một công cụ dành cho nhà phát triển cho phép bạn xem trước các trang web ở nhiều kích thước thiết bị khác nhau. Cung cấp xem trước thời gian thực cho kích thước iPhone, iPad, Desktop.',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: 'Xem trước trang web ở nhiều kích thước thiết bị',
  
  urlLabel: 'URL trang web',
  urlPlaceholder: 'https://www.example.com',
  loadButton: 'Tải',
  urlHint: 'Hoàn thành URL thông minh: "example.com" → "https://www.example.com", "localhost:3000" → "http://localhost:3000"',
  
  mobileCategory: '📱 Di động',
  tabletCategory: '📱 Máy tính bảng',
  desktopCategory: '💻 Máy tính để bàn',
  customCategory: '⚙️ Tùy chỉnh',
  
  'device.iPhone_15': 'iPhone 15',
  'device.iPhone_SE': 'iPhone SE',
  'device.Galaxy_S24': 'Galaxy S24',
  'device.iPad': 'iPad',
  'device.iPad_Pro': 'iPad Pro',
  'device.Laptop': 'Laptop',
  'device.Desktop': 'Desktop',
  'device.Desktop_4K': '4K Desktop',
  'device.Custom': 'Tùy chỉnh',
  
  currentSettings: 'Cài đặt hiện tại:',
  
  exportCodeButton: '📋 Xuất mã iframe',
  exportCodeTitle: '📋 Xuất mã iframe',
  exportCodeDescription: 'Tạo mã iframe ở nhiều định dạng khác nhau dựa trên cài đặt hiện tại.',
  
  basicIframe: 'iframe cơ bản',
  responsiveIframe: 'iframe đáp ứng',
  styledIframe: 'iframe có style',
  cssClassIframe: 'iframe với CSS class',
  
  responsiveDescription: 'Kích thước tự động điều chỉnh để phù hợp với container cha.',
  styledDescription: 'iframe với hiệu ứng viền và bóng đổ được áp dụng.',
  cssClassDescription: 'Có thể quản lý style trong tệp CSS riêng biệt.',
  
  copyButton: 'Sao chép',
  closeButton: 'Đóng',
  retryButton: 'Thử lại',
  
  loading: 'Đang tải...',
  loadingFailed: 'Tải thất bại',
  loadingFailedMessage: 'Không thể tải trang web.',
  corsMessage: 'Điều này có thể do chính sách CORS chặn hoặc URL không hợp lệ.',
  
  copySuccess: 'Đã sao chép vào clipboard!',
  copyFailed: 'Sao chép thất bại.',
  
  autoAdjusted: 'Tự động điều chỉnh',
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
  
  proTipsTitle: '💡 Mẹo chuyên nghiệp cho việc kiểm tra trang web',
  testingBestPracticesTitle: '🎯 Thực hành tốt nhất cho việc kiểm tra',
  testingBestPractice1: '• Kiểm tra trên kích thước thiết bị thực tế trước',
  testingBestPractice2: '• Kiểm tra tốc độ tải trên di động',
  testingBestPractice3: '• Xác minh mục tiêu chạm có ít nhất 44px',
  testingBestPractice4: '• Kiểm tra cả chế độ ngang và dọc',
  commonIssuesTitle: '🔧 Vấn đề thường gặp cần kiểm tra',
  commonIssue1: '• Cuộn ngang trên di động',
  commonIssue2: '• Văn bản quá nhỏ để đọc',
  commonIssue3: '• Các nút quá gần nhau',
  commonIssue4: '• Hình ảnh không được tối ưu hóa cho di động',

  // RegAx Tool
  regaxTitle: 'RegAx',
  regaxSubtitle: 'Công cụ mạnh mẽ để test và xác thực các mẫu biểu thức chính quy',
  regaxDescription: 'Test các mẫu regex của bạn trong thời gian thực với các tính năng debug mạnh mẽ cho các nhà phát triển.',
  patternLabel: 'Mẫu biểu thức chính quy',
  patternPlaceholder: '[a-zA-Z0-9]+',
  flagsPlaceholder: 'gim',
  testStringLabel: 'Chuỗi test',
  testStringPlaceholder: 'Nhập chuỗi test của bạn tại đây...',
  resultsLabel: 'Kết quả khớp',
  noResultsText: 'Kết quả khớp sẽ được hiển thị ở đây khi bạn nhập biểu thức chính quy',
  usageInstructionsTitle: 'Cách sử dụng',
  featuresTitle: 'Tính năng',
  backToHome: 'Quay lại trang chủ Bob\'s Multi Tool',

  // Main Landing Page
  mainTitle: "Bob's Multi Tool",
  mainSubtitle: 'Bộ sưu tập công cụ phát triển trực tuyến miễn phí',
  mainDescription: 'Các công cụ thiết yếu để làm cho công việc phát triển web dễ dàng và nhanh chóng hơn. Tất cả các công cụ được cung cấp miễn phí và có thể sử dụng ngay lập tức mà không cần đăng ký.',
  toolsTitle: 'Các công cụ có sẵn',
  iframeViewerTitle: 'Iframe Viewer',
  iframeViewerDescription: 'Công cụ để xem trước trang web ở nhiều kích thước thiết bị khác nhau. Kiểm tra cách trang web của bạn trông như thế nào trong môi trường thiết bị thực như iPhone, iPad, Desktop.',
  regaxToolTitle: 'RegAx',
  regaxToolDescription: 'Công cụ mạnh mẽ để test và xác thực các mẫu biểu thức chính quy. Test các mẫu regex trong thời gian thực và hoàn thiện các mẫu của bạn.',
  moreToolsTitle: 'Thêm công cụ',
  moreToolsDescription: 'Nhiều công cụ phát triển hữu ích hơn sẽ được thêm vào sớm. Hãy theo dõi các cập nhật!',
  moreToolsComingSoon: 'Sắp ra mắt...',
  useToolButton: 'Sử dụng công cụ',
  mainFeaturesTitle: 'Tính năng chính',
  fastAndEasyTitle: 'Nhanh và đơn giản',
  fastAndEasyDescription: 'Có thể sử dụng ngay lập tức mà không cần đăng ký. Không cần cài đặt hoặc cấu hình phức tạp.',
  completelyFreeTitle: 'Hoàn toàn miễn phí',
  completelyFreeDescription: 'Tất cả các công cụ được cung cấp miễn phí. Không có chi phí ẩn hoặc tính năng cao cấp.',
  developerFriendlyTitle: 'Thân thiện với nhà phát triển',
  developerFriendlyDescription: 'Bao gồm các tính năng mà nhà phát triển thực sự cần. Thực tế và hiệu quả.',
  ctaTitle: 'Bắt đầu ngay bây giờ',
  ctaDescription: 'Hãy thử các công cụ giúp công việc phát triển hiệu quả hơn miễn phí. Bạn có thể bắt đầu ngay lập tức mà không cần đăng ký hoặc cài đặt.',
  ctaIframeButton: 'Sử dụng Iframe Viewer',
  ctaRegaxButton: 'Sử dụng RegAx',
  footerDescription: 'Bộ sưu tập công cụ phát triển trực tuyến miễn phí. Chúng tôi cung cấp các công cụ làm cho công việc phát triển web dễ dàng và nhanh chóng hơn.',
  footerToolsTitle: 'Công cụ',
  footerInfoTitle: 'Thông tin',
  footerPrivacy: 'Chính sách bảo mật',
  footerTerms: 'Điều khoản dịch vụ',
  footerContact: 'Liên hệ',
  footerCopyright: '© 2024 Bob\'s Multi Tool. Tất cả quyền được bảo lưu. Được tạo với ❤️ cho các nhà phát triển.',
};

export const translations: Record<Language, Translation> = {
  en,
  ko,
  zh,
  ja,
  vi,
}; 