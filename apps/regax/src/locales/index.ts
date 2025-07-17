export type Language = 'en' | 'ko' | 'zh' | 'ja' | 'vi';

export interface Translation {
  // Page Meta
  pageTitle: string;
  pageDescription: string;
  
  // Header
  mainTitle: string;
  mainSubtitle: string;
  partOfText: string;
  
  // Form Labels
  patternLabel: string;
  patternPlaceholder: string;
  flagPlaceholder: string;
  testStringLabel: string;
  testStringPlaceholder: string;
  resultsLabel: string;
  resultsPlaceholder: string;
  
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
  exampleTitle: string;
  exampleDescription: string;
  
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
}

export type TranslationKey = keyof Translation;

// English (default)
const en: Translation = {
  pageTitle: "RegAx - Regular Expression Tester",
  pageDescription: "A powerful tool for testing and validating regular expressions. Part of Bob's Multi Tool collection.",
  
  mainTitle: "RegAx - Regular Expression Tester",
  mainSubtitle: "A powerful tool for testing and validating regular expressions",
  partOfText: "Part of Bob's Multi Tool",
  
  patternLabel: "Regular Expression Pattern",
  patternPlaceholder: "Enter your regex pattern (e.g., [a-zA-Z0-9]+)",
  flagPlaceholder: "Flags",
  testStringLabel: "Test String",
  testStringPlaceholder: "Enter the string to test your regex against",
  resultsLabel: "Results",
  resultsPlaceholder: "Results will be displayed here",
  
  featuresTitle: "Key Features",
  feature1Title: "Real-time Testing",
  feature1Description: "See regex matching results as you type",
  feature2Title: "Syntax Highlighting",
  feature2Description: "Visual distinction between regex patterns and matched parts",
  feature3Title: "Pattern Explanation",
  feature3Description: "Detailed explanation of complex regex patterns",
  
  howToUseTitle: "How to Use",
  howToUseSubtitle: "🔍 How to Use RegAx",
  step1: "Enter Regex Pattern: Input the regex you want to test (e.g., [a-zA-Z0-9]+)",
  step2: "Set Flags: Configure necessary flags (g: global search, i: case insensitive, m: multiline)",
  step3: "Enter Test String: Input the string to test your regex against",
  step4: "Check Results: View real-time matching results and capture groups",
  exampleTitle: "💡 Example",
  exampleDescription: "Email regex: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  
  backToHome: "Back to Home",
  
  footerTitle: "🔍 Bob's Multi Tool - RegAx",
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
};

// Korean
const ko: Translation = {
  pageTitle: "RegAx - 정규 표현식 테스터",
  pageDescription: "정규 표현식을 테스트하고 검증할 수 있는 강력한 도구입니다. Bob's Multi Tool의 일부입니다.",
  
  mainTitle: "RegAx - 정규 표현식 테스터",
  mainSubtitle: "정규식 패턴을 테스트하고 검증할 수 있는 강력한 도구입니다",
  partOfText: "Part of Bob's Multi Tool",
  
  patternLabel: "정규식 패턴",
  patternPlaceholder: "정규식 패턴을 입력하세요 (예: [a-zA-Z0-9]+)",
  flagPlaceholder: "플래그",
  testStringLabel: "테스트 문자열",
  testStringPlaceholder: "정규식을 테스트할 문자열을 입력하세요",
  resultsLabel: "결과",
  resultsPlaceholder: "결과가 여기에 표시됩니다",
  
  featuresTitle: "주요 기능",
  feature1Title: "실시간 테스트",
  feature1Description: "입력과 동시에 정규식 매칭 결과를 확인할 수 있습니다",
  feature2Title: "문법 하이라이팅",
  feature2Description: "정규식 패턴과 매칭된 부분을 시각적으로 구분합니다",
  feature3Title: "패턴 설명",
  feature3Description: "복잡한 정규식 패턴의 의미를 자세히 설명합니다",
  
  howToUseTitle: "사용 방법",
  howToUseSubtitle: "🔍 RegAx 사용법",
  step1: "정규식 패턴 입력: 테스트하고 싶은 정규식을 입력하세요 (예: [a-zA-Z0-9]+)",
  step2: "플래그 설정: 필요한 플래그를 설정하세요 (g: 전역 검색, i: 대소문자 무시, m: 다중행)",
  step3: "테스트 문자열 입력: 정규식을 테스트할 문자열을 입력하세요",
  step4: "결과 확인: 실시간으로 매칭 결과와 캡처 그룹을 확인하세요",
  exampleTitle: "💡 예시",
  exampleDescription: "이메일 주소를 찾는 정규식: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  
  backToHome: "홈으로 돌아가기",
  
  footerTitle: "🔍 Bob's Multi Tool - RegAx",
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
};

// Chinese (Simplified)
const zh: Translation = {
  pageTitle: "RegAx - 正则表达式测试器",
  pageDescription: "用于测试和验证正则表达式的强大工具。Bob's Multi Tool 的一部分。",
  
  mainTitle: "RegAx - 正则表达式测试器",
  mainSubtitle: "用于测试和验证正则表达式的强大工具",
  partOfText: "Part of Bob's Multi Tool",
  
  patternLabel: "正则表达式模式",
  patternPlaceholder: "输入您的正则表达式模式（例如：[a-zA-Z0-9]+）",
  flagPlaceholder: "标志",
  testStringLabel: "测试字符串",
  testStringPlaceholder: "输入要测试正则表达式的字符串",
  resultsLabel: "结果",
  resultsPlaceholder: "结果将在此处显示",
  
  featuresTitle: "主要特性",
  feature1Title: "实时测试",
  feature1Description: "输入时即可看到正则表达式匹配结果",
  feature2Title: "语法高亮",
  feature2Description: "正则表达式模式和匹配部分的视觉区分",
  feature3Title: "模式解释",
  feature3Description: "复杂正则表达式模式的详细解释",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "🔍 如何使用 RegAx",
  step1: "输入正则表达式模式：输入要测试的正则表达式（例如：[a-zA-Z0-9]+）",
  step2: "设置标志：配置必要的标志（g：全局搜索，i：不区分大小写，m：多行）",
  step3: "输入测试字符串：输入要测试正则表达式的字符串",
  step4: "查看结果：查看实时匹配结果和捕获组",
  exampleTitle: "💡 示例",
  exampleDescription: "电子邮件正则表达式：[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  
  backToHome: "返回首页",
  
  footerTitle: "🔍 Bob's Multi Tool - RegAx",
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
};

// Japanese
const ja: Translation = {
  pageTitle: "RegAx - 正規表現テスター",
  pageDescription: "正規表現をテストして検証するための強力なツールです。Bob's Multi Tool の一部です。",
  
  mainTitle: "RegAx - 正規表現テスター",
  mainSubtitle: "正規表現をテストして検証するための強力なツールです",
  partOfText: "Part of Bob's Multi Tool",
  
  patternLabel: "正規表現パターン",
  patternPlaceholder: "正規表現パターンを入力してください（例：[a-zA-Z0-9]+）",
  flagPlaceholder: "フラグ",
  testStringLabel: "テスト文字列",
  testStringPlaceholder: "正規表現をテストする文字列を入力してください",
  resultsLabel: "結果",
  resultsPlaceholder: "結果がここに表示されます",
  
  featuresTitle: "主要機能",
  feature1Title: "リアルタイムテスト",
  feature1Description: "入力と同時に正規表現のマッチング結果を確認できます",
  feature2Title: "構文ハイライト",
  feature2Description: "正規表現パターンとマッチした部分を視覚的に区別します",
  feature3Title: "パターン説明",
  feature3Description: "複雑な正規表現パターンの意味を詳しく説明します",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "🔍 RegAx の使用方法",
  step1: "正規表現パターンを入力：テストしたい正規表現を入力してください（例：[a-zA-Z0-9]+）",
  step2: "フラグを設定：必要なフラグを設定してください（g：グローバル検索、i：大文字小文字を無視、m：複数行）",
  step3: "テスト文字列を入力：正規表現をテストする文字列を入力してください",
  step4: "結果を確認：リアルタイムでマッチング結果とキャプチャグループを確認してください",
  exampleTitle: "💡 例",
  exampleDescription: "メールアドレスの正規表現：[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  
  backToHome: "ホームに戻る",
  
  footerTitle: "🔍 Bob's Multi Tool - RegAx",
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
};

// Vietnamese
const vi: Translation = {
  pageTitle: "RegAx - Trình kiểm tra biểu thức chính quy",
  pageDescription: "Công cụ mạnh mẽ để kiểm tra và xác thực biểu thức chính quy. Một phần của Bob's Multi Tool.",
  
  mainTitle: "RegAx - Trình kiểm tra biểu thức chính quy",
  mainSubtitle: "Công cụ mạnh mẽ để kiểm tra và xác thực biểu thức chính quy",
  partOfText: "Part of Bob's Multi Tool",
  
  patternLabel: "Mẫu biểu thức chính quy",
  patternPlaceholder: "Nhập mẫu regex của bạn (ví dụ: [a-zA-Z0-9]+)",
  flagPlaceholder: "Cờ",
  testStringLabel: "Chuỗi kiểm tra",
  testStringPlaceholder: "Nhập chuỗi để kiểm tra regex của bạn",
  resultsLabel: "Kết quả",
  resultsPlaceholder: "Kết quả sẽ được hiển thị ở đây",
  
  featuresTitle: "Tính năng chính",
  feature1Title: "Kiểm tra thời gian thực",
  feature1Description: "Xem kết quả khớp regex khi bạn gõ",
  feature2Title: "Tô sáng cú pháp",
  feature2Description: "Phân biệt trực quan giữa mẫu regex và các phần khớp",
  feature3Title: "Giải thích mẫu",
  feature3Description: "Giải thích chi tiết về các mẫu regex phức tạp",
  
  howToUseTitle: "Cách sử dụng",
  howToUseSubtitle: "🔍 Cách sử dụng RegAx",
  step1: "Nhập mẫu Regex: Nhập regex bạn muốn kiểm tra (ví dụ: [a-zA-Z0-9]+)",
  step2: "Đặt cờ: Cấu hình các cờ cần thiết (g: tìm kiếm toàn cục, i: không phân biệt chữ hoa thường, m: đa dòng)",
  step3: "Nhập chuỗi kiểm tra: Nhập chuỗi để kiểm tra regex của bạn",
  step4: "Kiểm tra kết quả: Xem kết quả khớp và nhóm bắt theo thời gian thực",
  exampleTitle: "💡 Ví dụ",
  exampleDescription: "Regex email: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  
  backToHome: "Quay về trang chủ",
  
  footerTitle: "🔍 Bob's Multi Tool - RegAx",
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
};

export const translations: Record<Language, Translation> = {
  en,
  ko,
  zh,
  ja,
  vi,
}; 