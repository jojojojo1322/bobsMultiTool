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
};

export const translations: Record<Language, Translation> = {
  en,
  ko,
  zh,
  ja,
  vi,
}; 