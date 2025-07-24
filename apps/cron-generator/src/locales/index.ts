export interface Translation {
  // Page Meta
  pageTitle: string;
  pageDescription: string;
  
  // Header
  mainTitle: string;
  mainSubtitle: string;
  partOfText: string;
  
  // Form Labels
  cronExpressionLabel: string;
  cronExpressionPlaceholder: string;
  descriptionLabel: string;
  nextExecutionsLabel: string;
  generatorTitle: string;
  
  // Generator Options
  minuteLabel: string;
  hourLabel: string;
  dayOfMonthLabel: string;
  monthLabel: string;
  dayOfWeekLabel: string;
  yearLabel: string;
  
  // Common Values
  everyMinute: string;
  everyHour: string;
  everyDay: string;
  everyWeek: string;
  everyMonth: string;
  everyYear: string;
  
  // Time Options
  specificMinute: string;
  specificHour: string;
  specificDay: string;
  
  // Cron Examples
  commonPatternsTitle: string;
  pattern1Name: string;
  pattern1Desc: string;
  pattern2Name: string;
  pattern2Desc: string;
  pattern3Name: string;
  pattern3Desc: string;
  pattern4Name: string;
  pattern4Desc: string;
  pattern5Name: string;
  pattern5Desc: string;
  pattern6Name: string;
  pattern6Desc: string;
  pattern7Name: string;
  pattern7Desc: string;
  pattern8Name: string;
  pattern8Desc: string;
  
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
  
  // Copy Functions
  copySuccess: string;
  copyFailed: string;
  copyText: string;
  
  // Validation
  invalidExpression: string;
  validExpression: string;
  
  // Time Display
  atTime: string;
  onDay: string;
  inMonth: string;
  
  // Footer
  footerTitle: string;
  footerPrivacy: string;
  footerTerms: string;
  footerContact: string;
  footerBackHome: string;
  footerSupport: string;
  footerCopyright: string;
  backToHome: string;
  
  // Language  
  // Privacy Policy
  privacyPolicy: string;
  privacySubtitle: string;
  privacyDataCollection: string;
  privacyDataCollectionDesc: string;
  privacyGoogleServices: string;
  privacyGoogleServicesDesc: string;
  privacyDataUsage: string;
  privacyDataUsageDesc: string;
  privacyContact: string;
  privacyContactDesc: string;
  
  // Terms of Service
  termsOfService: string;
  termsSubtitle: string;
  termsServiceUsage: string;
  termsServiceUsageDesc: string;
  termsLimitations: string;
  termsLimitationsDesc: string;
  termsDisclaimer: string;
  termsDisclaimerDesc: string;
  termsChanges: string;
  termsChangesDesc: string;
  
  'language.en': string;
  'language.ko': string;
  'language.zh': string;
  'language.ja': string;
  'language.vi': string;
}

export type Language = 'en' | 'ko' | 'zh' | 'ja' | 'vi';
export type TranslationKey = keyof Translation;

// English (default)
const en: Translation = {
  pageTitle: "Cron Expression Generator & Visualizer",
  pageDescription: "Free online cron expression generator and visualizer. Create and validate cron jobs with real-time scheduling preview. Perfect for developers and system administrators.",
  
  mainTitle: "Cron Expression Generator & Visualizer", 
  mainSubtitle: "Create and visualize cron expressions with real-time scheduling preview",
  partOfText: "Part of Bob's Multi Tool",
  
  cronExpressionLabel: "Cron Expression",
  cronExpressionPlaceholder: "Enter cron expression (e.g., 0 9 * * 1-5)",
  descriptionLabel: "Expression Description",
  nextExecutionsLabel: "Next Execution Times",
  generatorTitle: "Visual Cron Generator",
  
  minuteLabel: "Minute (0-59)",
  hourLabel: "Hour (0-23)", 
  dayOfMonthLabel: "Day of Month (1-31)",
  monthLabel: "Month (1-12)",
  dayOfWeekLabel: "Day of Week (0-6, Sun-Sat)",
  yearLabel: "Year",
  
  everyMinute: "Every minute",
  everyHour: "Every hour",
  everyDay: "Every day",
  everyWeek: "Every week",
  everyMonth: "Every month", 
  everyYear: "Every year",
  
  specificMinute: "Specific minute",
  specificHour: "Specific hour", 
  specificDay: "Specific day",
  
  commonPatternsTitle: "Common Cron Patterns",
  pattern1Name: "Every minute",
  pattern1Desc: "Runs every minute of every day",
  pattern2Name: "Every hour",
  pattern2Desc: "Runs at the beginning of every hour",
  pattern3Name: "Every day at midnight",
  pattern3Desc: "Runs once a day at 00:00",
  pattern4Name: "Every day at 9 AM",
  pattern4Desc: "Runs every day at 9:00 AM",
  pattern5Name: "Every weekday at 9 AM",
  pattern5Desc: "Runs Monday to Friday at 9:00 AM",
  pattern6Name: "Every Sunday at midnight",
  pattern6Desc: "Runs every Sunday at 00:00",
  pattern7Name: "Every 1st of month",
  pattern7Desc: "Runs on the first day of every month",
  pattern8Name: "Every 15 minutes",
  pattern8Desc: "Runs every 15 minutes",
  
  featuresTitle: "Key Features",
  feature1Title: "Real-time Preview",
  feature1Description: "See next execution times as you create expressions",
  feature2Title: "Visual Generator",
  feature2Description: "Build cron expressions using intuitive dropdowns",
  feature3Title: "Expression Validation",
  feature3Description: "Instant validation with detailed explanations",
  
  howToUseTitle: "How to Use",
  howToUseSubtitle: "🔧 How to Use Cron Generator",
  step1: "Input Expression: Enter a cron expression or use the visual generator below",
  step2: "Real-time Validation: See if your expression is valid and what it means",
  step3: "Preview Schedule: Check the next execution times to verify correctness", 
  step4: "Copy & Use: Copy the expression to use in your cron jobs",
  exampleTitle: "💡 Example",
  exampleDescription: "0 9 * * 1-5 means 'At 9:00 AM, Monday through Friday'",
  
  copySuccess: "Copied to clipboard!",
  copyFailed: "Copy failed.",
  copyText: "Copy",
  
  invalidExpression: "Invalid cron expression",
  validExpression: "Valid cron expression",
  
  atTime: "at",
  onDay: "on",
  inMonth: "in",
  
  footerTitle: "Cron Expression Generator",
  footerPrivacy: "Privacy Policy",
  footerTerms: "Terms of Service", 
  footerContact: "Contact",
  footerBackHome: "Bob's Multi Tool",
  footerSupport: "Support",
  footerCopyright: "2024 Bob's Multi Tool. Free tools for web developers.",
  backToHome: "Back to Multi Tool",
  
  // Privacy Policy
  privacyPolicy: "Privacy Policy",
  privacySubtitle: "Your privacy is important to us",
  privacyDataCollection: "Data Collection",
  privacyDataCollectionDesc: "We collect minimal data to improve your experience. We use Google Analytics for anonymous usage statistics and Google AdSense for advertising.",
  privacyGoogleServices: "Google Services",
  privacyGoogleServicesDesc: "This site uses Google Analytics and Google AdSense. These services may collect data according to their privacy policies.",
  privacyDataUsage: "Data Usage",
  privacyDataUsageDesc: "All data collected is used solely for service improvement and is never shared with third parties beyond Google's advertising network.",
  privacyContact: "Contact",
  privacyContactDesc: "If you have questions about this privacy policy, please contact us through Bob's Multi Tool.",
  
  // Terms of Service
  termsOfService: "Terms of Service",
  termsSubtitle: "Terms and conditions for using our service",
  termsServiceUsage: "Service Usage",
  termsServiceUsageDesc: "This service is provided free of charge for personal and commercial use. Please use responsibly.",
  termsLimitations: "Limitations",
  termsLimitationsDesc: "We provide this tool 'as is' without warranties. We are not responsible for any issues arising from your use of generated cron expressions.",
  termsDisclaimer: "Disclaimer",
  termsDisclaimerDesc: "Always test your cron expressions in a safe environment before deploying to production systems.",
  termsChanges: "Changes to Terms",
  termsChangesDesc: "We may update these terms occasionally. Continued use constitutes acceptance of any changes.",
  
  'language.en': 'English',
  'language.ko': '한국어', 
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Korean
const ko: Translation = {
  pageTitle: "Cron 표현식 생성기 & 시각화 도구",
  pageDescription: "무료 온라인 크론 표현식 생성기 및 시각화 도구입니다. 실시간 스케줄링 미리보기로 크론 작업을 생성하고 검증하세요. 개발자와 시스템 관리자에게 완벽한 도구입니다.",
  
  mainTitle: "Cron 표현식 생성기 & 시각화 도구",
  mainSubtitle: "실시간 스케줄링 미리보기로 크론 표현식을 생성하고 시각화하세요",
  partOfText: "Part of Bob's Multi Tool",
  
  cronExpressionLabel: "Cron 표현식",
  cronExpressionPlaceholder: "크론 표현식을 입력하세요 (예: 0 9 * * 1-5)",
  descriptionLabel: "표현식 설명",
  nextExecutionsLabel: "다음 실행 시간",
  generatorTitle: "시각적 Cron 생성기",
  
  minuteLabel: "분 (0-59)",
  hourLabel: "시 (0-23)",
  dayOfMonthLabel: "일 (1-31)",
  monthLabel: "월 (1-12)",
  dayOfWeekLabel: "요일 (0-6, 일-토)",
  yearLabel: "년",
  
  everyMinute: "매분",
  everyHour: "매시간",
  everyDay: "매일",
  everyWeek: "매주",
  everyMonth: "매월",
  everyYear: "매년",
  
  specificMinute: "특정 분",
  specificHour: "특정 시",
  specificDay: "특정 일",
  
  commonPatternsTitle: "일반적인 Cron 패턴",
  pattern1Name: "매분 실행",
  pattern1Desc: "매일 매분마다 실행됩니다",
  pattern2Name: "매시간 실행",
  pattern2Desc: "매시간 정각에 실행됩니다",
  pattern3Name: "매일 자정 실행",
  pattern3Desc: "매일 00:00에 실행됩니다",
  pattern4Name: "매일 오전 9시 실행",
  pattern4Desc: "매일 오전 9:00에 실행됩니다",
  pattern5Name: "평일 오전 9시 실행",
  pattern5Desc: "월요일부터 금요일까지 오전 9:00에 실행됩니다",
  pattern6Name: "매주 일요일 자정 실행",
  pattern6Desc: "매주 일요일 00:00에 실행됩니다",
  pattern7Name: "매월 1일 실행",
  pattern7Desc: "매월 첫째 날에 실행됩니다",
  pattern8Name: "15분마다 실행",
  pattern8Desc: "15분마다 실행됩니다",
  
  featuresTitle: "주요 기능",
  feature1Title: "실시간 미리보기",
  feature1Description: "표현식을 만들면서 다음 실행 시간을 바로 확인할 수 있어요",
  feature2Title: "시각적 생성기",
  feature2Description: "직관적인 드롭다운으로 크론 표현식을 쉽게 만들 수 있어요",
  feature3Title: "표현식 검증",
  feature3Description: "즉시 검증하고 자세한 설명을 제공해요",
  
  howToUseTitle: "사용 방법",
  howToUseSubtitle: "🔧 Cron 생성기 사용법",
  step1: "표현식 입력: 크론 표현식을 직접 입력하거나 아래 시각적 생성기를 사용하세요",
  step2: "실시간 검증: 표현식이 올바른지 확인하고 의미를 파악하세요",
  step3: "스케줄 미리보기: 다음 실행 시간을 확인해서 정확성을 검증하세요",
  step4: "복사 및 사용: 표현식을 복사해서 크론 작업에 사용하세요",
  exampleTitle: "💡 예시",
  exampleDescription: "0 9 * * 1-5는 '월요일부터 금요일까지 오전 9:00에 실행'을 의미해요",
  
  copySuccess: "클립보드에 복사되었습니다!",
  copyFailed: "복사에 실패했습니다.",
  copyText: "복사",
  
  invalidExpression: "잘못된 크론 표현식입니다",
  validExpression: "올바른 크론 표현식입니다",
  
  atTime: "",
  onDay: "",
  inMonth: "",
  
  footerTitle: "Cron 표현식 생성기",
  footerPrivacy: "개인정보처리방침",
  footerTerms: "이용약관",
  footerContact: "문의하기",
  footerBackHome: "Bob's Multi Tool",
  footerSupport: "지원",
  footerCopyright: "2024 Bob's Multi Tool. 웹 개발자를 위한 무료 도구모음.",
  backToHome: "멀티 툴로 돌아가기",
  
  // Privacy Policy
  privacyPolicy: "개인정보처리방침",
  privacySubtitle: "당신의 개인정보는 우리에게 중요합니다",
  privacyDataCollection: "데이터 수집",
  privacyDataCollectionDesc: "저희는 사용자 경험 개선을 위해 최소한의 데이터를 수집합니다. 익명 사용 통계를 위해 Google Analytics를, 광고를 위해 Google AdSense를 사용합니다.",
  privacyGoogleServices: "Google 서비스",
  privacyGoogleServicesDesc: "이 사이트는 Google Analytics와 Google AdSense를 사용합니다. 이러한 서비스는 각각의 개인정보 정책에 따라 데이터를 수집할 수 있습니다.",
  privacyDataUsage: "데이터 사용",
  privacyDataUsageDesc: "수집된 모든 데이터는 서비스 개선 목적으로만 사용되며, Google 광고 네트워크를 제외한 제3자와 절대 공유되지 않습니다.",
  privacyContact: "문의",
  privacyContactDesc: "이 개인정보처리방침에 대한 질문이 있으시면 Bob's Multi Tool을 통해 연락 주세요.",
  
  // Terms of Service
  termsOfService: "이용약관",
  termsSubtitle: "서비스 이용을 위한 약관 및 조건",
  termsServiceUsage: "서비스 이용",
  termsServiceUsageDesc: "이 서비스는 개인 및 상업적 용도로 무료로 제공됩니다. 책임감 있게 사용해 주세요.",
  termsLimitations: "제한사항",
  termsLimitationsDesc: "저희는 이 도구를 '있는 그대로' 보증 없이 제공합니다. 생성된 크론 표현식 사용으로 발생하는 문제에 대해서는 책임지지 않습니다.",
  termsDisclaimer: "면책조항",
  termsDisclaimerDesc: "프로덕션 시스템에 배포하기 전에 항상 안전한 환경에서 크론 표현식을 테스트하세요.",
  termsChanges: "약관 변경",
  termsChangesDesc: "저희는 가끔 이 약관을 업데이트할 수 있습니다. 계속 사용하시면 변경사항에 동의한 것으로 간주됩니다.",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日본語',
  'language.vi': 'Tiếng Việt',
};

// Chinese (Simplified)
const zh: Translation = {
  pageTitle: "Cron 表达式生成器和可视化工具",
  pageDescription: "免费在线 cron 表达式生成器和可视化工具。通过实时调度预览创建和验证 cron 任务。为开发者和系统管理员量身打造。",
  
  mainTitle: "Cron 表达式生成器和可视化工具",
  mainSubtitle: "通过实时调度预览创建和可视化 cron 表达式",
  partOfText: "Part of Bob's Multi Tool",
  
  cronExpressionLabel: "Cron 表达式",
  cronExpressionPlaceholder: "输入 cron 表达式（例如：0 9 * * 1-5）",
  descriptionLabel: "表达式描述",
  nextExecutionsLabel: "下次执行时间",
  generatorTitle: "可视化 Cron 生成器",
  
  minuteLabel: "分钟 (0-59)",
  hourLabel: "小时 (0-23)",
  dayOfMonthLabel: "日期 (1-31)",
  monthLabel: "月份 (1-12)",
  dayOfWeekLabel: "星期 (0-6, 日-六)",
  yearLabel: "年份",
  
  everyMinute: "每分钟",
  everyHour: "每小时",
  everyDay: "每天",
  everyWeek: "每周",
  everyMonth: "每月",
  everyYear: "每年",
  
  specificMinute: "特定分钟",
  specificHour: "特定小时",
  specificDay: "特定日期",
  
  commonPatternsTitle: "常用 Cron 模式",
  pattern1Name: "每分钟执行",
  pattern1Desc: "每天每分钟都执行",
  pattern2Name: "每小时执行",
  pattern2Desc: "每小时的开始执行",
  pattern3Name: "每天午夜执行",
  pattern3Desc: "每天 00:00 执行",
  pattern4Name: "每天上午 9 点执行",
  pattern4Desc: "每天上午 9:00 执行",
  pattern5Name: "工作日上午 9 点执行",
  pattern5Desc: "周一至周五上午 9:00 执行",
  pattern6Name: "每周日午夜执行",
  pattern6Desc: "每周日 00:00 执行",
  pattern7Name: "每月 1 号执行",
  pattern7Desc: "每月第一天执行",
  pattern8Name: "每 15 分钟执行",
  pattern8Desc: "每隔 15 分钟执行一次",
  
  featuresTitle: "主要特性",
  feature1Title: "实时预览",
  feature1Description: "创建表达式时即可看到下次执行时间",
  feature2Title: "可视化生成器",
  feature2Description: "使用直观的下拉菜单构建 cron 表达式",
  feature3Title: "表达式验证",
  feature3Description: "即时验证并提供详细说明",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "🔧 如何使用 Cron 生成器",
  step1: "输入表达式：输入 cron 表达式或使用下面的可视化生成器",
  step2: "实时验证：查看表达式是否有效及其含义",
  step3: "预览计划：检查下次执行时间以验证正确性",
  step4: "复制使用：复制表达式用于您的 cron 任务",
  exampleTitle: "💡 示例",
  exampleDescription: "0 9 * * 1-5 表示 '周一至周五上午 9:00 执行'",
  
  copySuccess: "已复制到剪贴板！",
  copyFailed: "复制失败。",
  copyText: "复制",
  
  invalidExpression: "无效的 cron 表达式",
  validExpression: "有效的 cron 表达式",
  
  atTime: "在",
  onDay: "在",
  inMonth: "在",
  
  footerTitle: "Cron 表达式生成器",
  footerPrivacy: "隐私政策",
  footerTerms: "服务条款",
  footerContact: "联系我们",
  footerBackHome: "Bob's Multi Tool",
  footerSupport: "支持",
  footerCopyright: "2024 Bob's Multi Tool. 为 Web 开发者提供的免费工具。",
  backToHome: "返回多工具",
  
  // Privacy Policy
  privacyPolicy: "隐私政策",
  privacySubtitle: "我们重视您的隐私保护",
  privacyDataCollection: "数据收集",
  privacyDataCollectionDesc: "我们收集最少的数据来改善您的体验。我们使用Google Analytics进行匿名使用统计，使用Google AdSense进行广告投放。",
  privacyGoogleServices: "Google服务",
  privacyGoogleServicesDesc: "本网站使用Google Analytics和Google AdSense。这些服务可能根据其隐私政策收集数据。",
  privacyDataUsage: "数据使用",
  privacyDataUsageDesc: "所有收集的数据仅用于服务改进，除Google广告网络外，绝不与第三方共享。",
  privacyContact: "联系",
  privacyContactDesc: "如对此隐私政策有疑问，请通过Bob's Multi Tool联系我们。",
  
  // Terms of Service
  termsOfService: "服务条款",
  termsSubtitle: "使用我们服务的条款和条件",
  termsServiceUsage: "服务使用",
  termsServiceUsageDesc: "此服务免费提供给个人和商业用途。请负责任地使用。",
  termsLimitations: "限制",
  termsLimitationsDesc: "我们\"按原样\"提供此工具，不提供任何保证。我们不对使用生成的cron表达式产生的任何问题负责。",
  termsDisclaimer: "免责声明",
  termsDisclaimerDesc: "在部署到生产系统之前，请始终在安全环境中测试您的cron表达式。",
  termsChanges: "条款变更",
  termsChangesDesc: "我们可能会偶尔更新这些条款。继续使用即表示接受任何更改。",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Japanese
const ja: Translation = {
  pageTitle: "Cron 式ジェネレーター＆可視化ツール",
  pageDescription: "無料オンライン cron 式ジェネレーターと可視化ツールです。リアルタイムスケジューリングプレビューで cron ジョブを作成・検証できます。開発者とシステム管理者に最適。",
  
  mainTitle: "Cron 式ジェネレーター＆可視化ツール",
  mainSubtitle: "リアルタイムスケジューリングプレビューで cron 式を作成・可視化",
  partOfText: "Part of Bob's Multi Tool",
  
  cronExpressionLabel: "Cron 式",
  cronExpressionPlaceholder: "cron 式を入力してください（例：0 9 * * 1-5）",
  descriptionLabel: "式の説明",
  nextExecutionsLabel: "次の実行時間",
  generatorTitle: "ビジュアル Cron ジェネレーター",
  
  minuteLabel: "分 (0-59)",
  hourLabel: "時 (0-23)",
  dayOfMonthLabel: "日 (1-31)",
  monthLabel: "月 (1-12)",
  dayOfWeekLabel: "曜日 (0-6, 日-土)",
  yearLabel: "年",
  
  everyMinute: "毎分",
  everyHour: "毎時",
  everyDay: "毎日",
  everyWeek: "毎週",
  everyMonth: "毎月",
  everyYear: "毎年",
  
  specificMinute: "特定の分",
  specificHour: "特定の時",
  specificDay: "特定の日",
  
  commonPatternsTitle: "一般的な Cron パターン",
  pattern1Name: "毎分実行",
  pattern1Desc: "毎日毎分実行されます",
  pattern2Name: "毎時実行",
  pattern2Desc: "毎時の開始時に実行されます",
  pattern3Name: "毎日深夜実行",
  pattern3Desc: "毎日 00:00 に実行されます",
  pattern4Name: "毎日午前 9 時実行",
  pattern4Desc: "毎日午前 9:00 に実行されます",
  pattern5Name: "平日午前 9 時実行",
  pattern5Desc: "月曜日から金曜日の午前 9:00 に実行されます",
  pattern6Name: "毎週日曜深夜実行",
  pattern6Desc: "毎週日曜日の 00:00 に実行されます",
  pattern7Name: "毎月 1 日実行",
  pattern7Desc: "毎月 1 日に実行されます",
  pattern8Name: "15 分毎実行",
  pattern8Desc: "15 分間隔で実行されます",
  
  featuresTitle: "主な機能",
  feature1Title: "リアルタイムプレビュー",
  feature1Description: "式を作成しながら次の実行時間を確認できます",
  feature2Title: "ビジュアルジェネレーター",
  feature2Description: "直感的なドロップダウンで cron 式を構築できます",
  feature3Title: "式の検証",
  feature3Description: "即座に検証し、詳細な説明を提供します",
  
  howToUseTitle: "使用方法",
  howToUseSubtitle: "🔧 Cron ジェネレーターの使い方",
  step1: "式の入力：cron 式を入力するか、下のビジュアルジェネレーターを使用してください",
  step2: "リアルタイム検証：式が有効かどうかとその意味を確認してください",
  step3: "スケジュールプレビュー：次の実行時間をチェックして正確性を確認してください",
  step4: "コピー＆使用：式をコピーして cron ジョブで使用してください",
  exampleTitle: "💡 例",
  exampleDescription: "0 9 * * 1-5 は「月曜日から金曜日の午前 9:00 に実行」を意味します",
  
  copySuccess: "クリップボードにコピーしました！",
  copyFailed: "コピーに失敗しました。",
  copyText: "コピー",
  
  invalidExpression: "無効な cron 式です",
  validExpression: "有効な cron 式です",
  
  atTime: "",
  onDay: "",
  inMonth: "",
  
  footerTitle: "Cron 式ジェネレーター",
  footerPrivacy: "プライバシーポリシー",
  footerTerms: "利用規約",
  footerContact: "お問い合わせ",
  footerBackHome: "Bob's Multi Tool",
  footerSupport: "サポート",
  footerCopyright: "2024 Bob's Multi Tool. Web 開発者向け無料ツール。",
  backToHome: "マルチツールに戻る",
  
  // Privacy Policy
  privacyPolicy: "プライバシーポリシー",
  privacySubtitle: "お客様のプライバシー保護が重要です",
  privacyDataCollection: "データ収集",
  privacyDataCollectionDesc: "ユーザーエクスペリエンスの向上のために最小限のデータを収集します。匿名使用統計のためのGoogle Analyticsと広告のためのGoogle AdSenseを使用しています。",
  privacyGoogleServices: "Googleサービス",
  privacyGoogleServicesDesc: "このサイトはGoogle AnalyticsとGoogle AdSenseを使用しています。これらのサービスは各自のプライバシーポリシーに従ってデータを収集する場合があります。",
  privacyDataUsage: "データ使用",
  privacyDataUsageDesc: "収集されたすべてのデータはサービス改善目的にのみ使用され、Google広告ネットワーク以外の第三者と共有されることはありません。",
  privacyContact: "お問い合わせ",
  privacyContactDesc: "このプライバシーポリシーについてご質問がございましたら、Bob's Multi Toolからお問い合わせください。",
  
  // Terms of Service
  termsOfService: "利用規約",
  termsSubtitle: "サービス利用のための規約と条件",
  termsServiceUsage: "サービス利用",
  termsServiceUsageDesc: "このサービスは個人および商用利用において無料で提供されます。責任を持ってご利用ください。",
  termsLimitations: "制限事項",
  termsLimitationsDesc: "このツールは「現状のまま」保証なしで提供されます。生成されたcron式の使用によって生じるいかなる問題についても当社は責任を負いません。",
  termsDisclaimer: "免責事項",
  termsDisclaimerDesc: "プロダクションシステムに展開する前に、必ず安全な環境でcron式をテストしてください。",
  termsChanges: "規約の変更",
  termsChangesDesc: "これらの規約を時々更新する場合があります。継続的な使用は変更への同意とみなされます。",
  
  'language.en': 'English',
  'language.ko': '한국어',
  'language.zh': '中文',
  'language.ja': '日本語',
  'language.vi': 'Tiếng Việt',
};

// Vietnamese
const vi: Translation = {
  pageTitle: "Trình tạo và trực quan hóa biểu thức Cron",
  pageDescription: "Công cụ tạo và trực quan hóa biểu thức cron trực tuyến miễn phí. Tạo và xác thực công việc cron với xem trước lịch trình thời gian thực. Hoàn hảo cho các nhà phát triển và quản trị viên hệ thống.",
  
  mainTitle: "Trình tạo và trực quan hóa biểu thức Cron",
  mainSubtitle: "Tạo và trực quan hóa biểu thức cron với xem trước lịch trình thời gian thực",
  partOfText: "Part of Bob's Multi Tool",
  
  cronExpressionLabel: "Biểu thức Cron",
  cronExpressionPlaceholder: "Nhập biểu thức cron (ví dụ: 0 9 * * 1-5)",
  descriptionLabel: "Mô tả biểu thức",
  nextExecutionsLabel: "Thời gian thực thi tiếp theo",
  generatorTitle: "Trình tạo Cron trực quan",
  
  minuteLabel: "Phút (0-59)",
  hourLabel: "Giờ (0-23)",
  dayOfMonthLabel: "Ngày (1-31)",
  monthLabel: "Tháng (1-12)",
  dayOfWeekLabel: "Thứ (0-6, CN-T7)",
  yearLabel: "Năm",
  
  everyMinute: "Mỗi phút",
  everyHour: "Mỗi giờ",
  everyDay: "Mỗi ngày",
  everyWeek: "Mỗi tuần",
  everyMonth: "Mỗi tháng",
  everyYear: "Mỗi năm",
  
  specificMinute: "Phút cụ thể",
  specificHour: "Giờ cụ thể",
  specificDay: "Ngày cụ thể",
  
  commonPatternsTitle: "Mẫu Cron phổ biến",
  pattern1Name: "Thực thi mỗi phút",
  pattern1Desc: "Chạy mỗi phút của mỗi ngày",
  pattern2Name: "Thực thi mỗi giờ",
  pattern2Desc: "Chạy vào đầu mỗi giờ",
  pattern3Name: "Thực thi mỗi ngày lúc nửa đêm",
  pattern3Desc: "Chạy một lần mỗi ngày lúc 00:00",
  pattern4Name: "Thực thi mỗi ngày lúc 9 giờ sáng",
  pattern4Desc: "Chạy mỗi ngày lúc 9:00 sáng",
  pattern5Name: "Thực thi ngày làm việc lúc 9 giờ sáng",
  pattern5Desc: "Chạy từ thứ Hai đến thứ Sáu lúc 9:00 sáng",
  pattern6Name: "Thực thi mỗi Chủ nhật lúc nửa đêm",
  pattern6Desc: "Chạy mỗi Chủ nhật lúc 00:00",
  pattern7Name: "Thực thi ngày đầu tháng",
  pattern7Desc: "Chạy vào ngày đầu tiên của mỗi tháng",
  pattern8Name: "Thực thi mỗi 15 phút",
  pattern8Desc: "Chạy mỗi 15 phút",
  
  featuresTitle: "Tính năng chính",
  feature1Title: "Xem trước thời gian thực",
  feature1Description: "Xem thời gian thực thi tiếp theo khi tạo biểu thức",
  feature2Title: "Trình tạo trực quan",
  feature2Description: "Xây dựng biểu thức cron bằng menu thả xuống trực quan",
  feature3Title: "Xác thực biểu thức",
  feature3Description: "Xác thực tức thì với giải thích chi tiết",
  
  howToUseTitle: "Cách sử dụng",
  howToUseSubtitle: "🔧 Cách sử dụng Trình tạo Cron",
  step1: "Nhập biểu thức: Nhập biểu thức cron hoặc sử dụng trình tạo trực quan bên dưới",
  step2: "Xác thực thời gian thực: Xem biểu thức có hợp lệ không và ý nghĩa của nó",
  step3: "Xem trước lịch trình: Kiểm tra thời gian thực thi tiếp theo để xác minh tính chính xác",
  step4: "Sao chép & Sử dụng: Sao chép biểu thức để sử dụng trong công việc cron của bạn",
  exampleTitle: "💡 Ví dụ",
  exampleDescription: "0 9 * * 1-5 có nghĩa là 'Lúc 9:00 sáng, từ thứ Hai đến thứ Sáu'",
  
  copySuccess: "Đã sao chép vào clipboard!",
  copyFailed: "Sao chép thất bại.",
  copyText: "Sao chép",
  
  invalidExpression: "Biểu thức cron không hợp lệ",
  validExpression: "Biểu thức cron hợp lệ",
  
  atTime: "lúc",
  onDay: "vào",
  inMonth: "trong",
  
  footerTitle: "Trình tạo biểu thức Cron",
  footerPrivacy: "Chính sách bảo mật",
  footerTerms: "Điều khoản dịch vụ",
  footerContact: "Liên hệ",
  footerBackHome: "Bob's Multi Tool",
  footerSupport: "Hỗ trợ",
  footerCopyright: "2024 Bob's Multi Tool. Công cụ miễn phí cho nhà phát triển web.",
  backToHome: "Trở về Multi Tool",
  
  // Privacy Policy
  privacyPolicy: "Chính sách Bảo mật",
  privacySubtitle: "Quyền riêng tư của bạn rất quan trọng với chúng tôi",
  privacyDataCollection: "Thu thập Dữ liệu",
  privacyDataCollectionDesc: "Chúng tôi thu thập dữ liệu tối thiểu để cải thiện trải nghiệm của bạn. Chúng tôi sử dụng Google Analytics cho thống kê sử dụng ẩn danh và Google AdSense cho quảng cáo.",
  privacyGoogleServices: "Dịch vụ Google",
  privacyGoogleServicesDesc: "Trang web này sử dụng Google Analytics và Google AdSense. Những dịch vụ này có thể thu thập dữ liệu theo chính sách bảo mật riêng của họ.",
  privacyDataUsage: "Sử dụng Dữ liệu",
  privacyDataUsageDesc: "Tất cả dữ liệu thu thập chỉ được sử dụng để cải thiện dịch vụ và không bao giờ được chia sẻ với bên thứ ba ngoài mạng quảng cáo Google.",
  privacyContact: "Liên hệ",
  privacyContactDesc: "Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua Bob's Multi Tool.",
  
  // Terms of Service
  termsOfService: "Điều khoản Dịch vụ",
  termsSubtitle: "Điều khoản và điều kiện sử dụng dịch vụ của chúng tôi",
  termsServiceUsage: "Sử dụng Dịch vụ",
  termsServiceUsageDesc: "Dịch vụ này được cung cấp miễn phí cho mục đích cá nhân và thương mại. Vui lòng sử dụng có trách nhiệm.",
  termsLimitations: "Hạn chế",
  termsLimitationsDesc: "Chúng tôi cung cấp công cụ này 'nguyên trạng' không có bảo hành. Chúng tôi không chịu trách nhiệm về bất kỳ vấn đề nào phát sinh từ việc sử dụng biểu thức cron được tạo.",
  termsDisclaimer: "Tuyên bố từ chối trách nhiệm",
  termsDisclaimerDesc: "Luôn kiểm tra biểu thức cron của bạn trong môi trường an toàn trước khi triển khai lên hệ thống sản xuất.",
  termsChanges: "Thay đổi Điều khoản",
  termsChangesDesc: "Chúng tôi có thể cập nhật những điều khoản này thỉnh thoảng. Việc tiếp tục sử dụng được coi là chấp nhận mọi thay đổi.",
  
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