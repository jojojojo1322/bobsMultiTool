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
  
  // Language Names
  'language.en': string;
  'language.ko': string;
  'language.zh': string;
  'language.ja': string;
  'language.vi': string;
}

export type TranslationKey = keyof Translation;

// English (default)
const en: Translation = {
  pageTitle: 'Iframe Viewer Tool - Website Preview Tool',
  pageDescription: 'A developer tool that allows you to preview websites in various device sizes. Provides real-time preview for iPhone, iPad, Desktop sizes.',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: 'Preview websites in various device sizes',
  
  urlLabel: 'Website URL',
  urlPlaceholder: 'https://example.com',
  loadButton: 'Load',
  urlHint: 'http:// will be automatically added if you omit http:// or https://',
  
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
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Korean
const ko: Translation = {
  pageTitle: 'Iframe Viewer Tool - 웹사이트 미리보기 도구',
  pageDescription: '다양한 디바이스 크기로 웹사이트를 미리보기할 수 있는 개발자 도구입니다. iPhone, iPad, Desktop 크기로 실시간 미리보기를 제공합니다.',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: '다양한 디바이스 크기로 웹사이트를 미리보기하세요',
  
  urlLabel: '웹사이트 URL',
  urlPlaceholder: 'https://example.com',
  loadButton: '로드',
  urlHint: 'http:// 또는 https://를 생략하면 자동으로 http://가 추가됩니다',
  
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
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Chinese (Simplified)
const zh: Translation = {
  pageTitle: 'Iframe Viewer Tool - 网站预览工具',
  pageDescription: '一个开发者工具，可以在各种设备尺寸下预览网站。为iPhone、iPad、桌面尺寸提供实时预览。',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: '在各种设备尺寸下预览网站',
  
  urlLabel: '网站 URL',
  urlPlaceholder: 'https://example.com',
  loadButton: '加载',
  urlHint: '如果省略 http:// 或 https://，将自动添加 http://',
  
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
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Japanese
const ja: Translation = {
  pageTitle: 'Iframe Viewer Tool - ウェブサイトプレビューツール',
  pageDescription: '様々なデバイスサイズでウェブサイトをプレビューできる開発者ツールです。iPhone、iPad、デスクトップサイズでリアルタイムプレビューを提供します。',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: '様々なデバイスサイズでウェブサイトをプレビュー',
  
  urlLabel: 'ウェブサイト URL',
  urlPlaceholder: 'https://example.com',
  loadButton: '読み込み',
  urlHint: 'http:// または https:// を省略すると、自動的に http:// が追加されます',
  
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
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Vietnamese
const vi: Translation = {
  pageTitle: 'Iframe Viewer Tool - Công cụ xem trước trang web',
  pageDescription: 'Một công cụ dành cho nhà phát triển cho phép bạn xem trước các trang web ở nhiều kích thước thiết bị khác nhau. Cung cấp xem trước thời gian thực cho kích thước iPhone, iPad, Desktop.',
  
  toolTitle: '📱 Iframe Viewer Tool',
  toolSubtitle: 'Xem trước trang web ở nhiều kích thước thiết bị',
  
  urlLabel: 'URL trang web',
  urlPlaceholder: 'https://example.com',
  loadButton: 'Tải',
  urlHint: 'http:// sẽ được tự động thêm nếu bạn bỏ qua http:// hoặc https://',
  
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
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

export const translations: Record<Language, Translation> = {
  en,
  ko,
  zh,
  ja,
  vi,
}; 