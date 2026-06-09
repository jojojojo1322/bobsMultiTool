import { guides, type GuideDefinition } from "@/features/guides/registry";
import { defaultLocale, type Locale } from "@/features/i18n/config";
import { getDictionary } from "@/features/i18n/dictionaries";
import { searchTools, tools } from "@/features/tools/registry";
import type { ToolDefinition } from "@/features/tools/types";

type TextPack = {
  titleTerms: Record<string, string>;
  guideTopics: Record<string, string>;
  localChip: string;
  serverChip: string;
  coreChip: string;
  growthChip: string;
  longTailChip: string;
  description: (title: string, category: string, privacy: string) => string;
  seoTitle: (title: string, category: string) => string;
  seoDescription: (title: string, category: string, privacy: string) => string;
  useCases: (title: string, category: string, privacy: string) => string[];
  exampleLabels: [string, string, string];
  exampleNote: (title: string) => string;
  sanityNote: string;
  localFaqQuestion: (title: string) => string;
  localFaqAnswer: string;
  serverFaqQuestion: (title: string) => string;
  serverFaqAnswer: string;
  secretQuestion: string;
  secretAnswer: string;
  guideDescription: (topic: string) => string;
  guideSections: (topic: string) => Array<{ heading: string; body: string }>;
};

const guideTopicEn: Record<string, string> = {
  "regex-cheat-sheet": "Regex practice",
  "cron-expression-examples": "Cron schedules",
  "seo-meta-tags": "SEO meta tags",
  "iframe-preview-limitations": "Iframe previews",
  "placeholder-text-for-design": "Placeholder text",
  "developer-utility-workflow": "Browser utility workflow",
  "hash-generator-security": "Hash generator notes",
  "text-diff-for-developers": "Text diff workflow",
  "json-yaml-csv-conversion": "Data conversion workflow",
  "sql-formatting-workflow": "SQL formatting workflow",
  "color-contrast-checking": "Color and contrast checks",
  "secure-generator-workflow": "Secure generator workflow",
  "web-seo-utilities": "Web and SEO utilities",
  "network-debugging-tools": "Network debugging workflow",
  "css-utility-workflow": "CSS utility workflow",
  "text-cleanup-workflow": "Text cleanup workflow",
};

const localizedGuideTopics: Record<Exclude<Locale, "en">, Record<string, string>> = {
  ko: {
    "regex-cheat-sheet": "Regex 실전 패턴",
    "cron-expression-examples": "Cron 스케줄 예제",
    "seo-meta-tags": "SEO 메타 태그",
    "iframe-preview-limitations": "Iframe 미리보기 제한",
    "placeholder-text-for-design": "디자인용 플레이스홀더 텍스트",
    "developer-utility-workflow": "브라우저 유틸리티 작업 흐름",
    "hash-generator-security": "Hash 생성 보안 메모",
    "text-diff-for-developers": "개발자용 텍스트 diff 흐름",
    "json-yaml-csv-conversion": "데이터 변환 흐름",
    "sql-formatting-workflow": "SQL 포맷 작업 흐름",
    "color-contrast-checking": "색상 대비 확인",
    "secure-generator-workflow": "보안 랜덤 생성 흐름",
    "web-seo-utilities": "Web 및 SEO 유틸리티",
    "network-debugging-tools": "네트워크 디버깅 흐름",
    "css-utility-workflow": "CSS 유틸리티 흐름",
    "text-cleanup-workflow": "텍스트 정리 흐름",
  },
  ja: {
    "regex-cheat-sheet": "Regex 実践パターン",
    "cron-expression-examples": "Cron スケジュール例",
    "seo-meta-tags": "SEO メタタグ",
    "iframe-preview-limitations": "Iframe プレビューの制限",
    "placeholder-text-for-design": "デザイン用プレースホルダーテキスト",
    "developer-utility-workflow": "ブラウザユーティリティの作業フロー",
    "hash-generator-security": "Hash 生成の安全メモ",
    "text-diff-for-developers": "開発者向けテキスト diff フロー",
    "json-yaml-csv-conversion": "データ変換フロー",
    "sql-formatting-workflow": "SQL 整形フロー",
    "color-contrast-checking": "色とコントラスト確認",
    "secure-generator-workflow": "安全なランダム生成フロー",
    "web-seo-utilities": "Web と SEO ユーティリティ",
    "network-debugging-tools": "ネットワークデバッグフロー",
    "css-utility-workflow": "CSS ユーティリティフロー",
    "text-cleanup-workflow": "テキスト整理フロー",
  },
  "zh-CN": {
    "regex-cheat-sheet": "Regex 实用模式",
    "cron-expression-examples": "Cron 日程示例",
    "seo-meta-tags": "SEO 元标签",
    "iframe-preview-limitations": "Iframe 预览限制",
    "placeholder-text-for-design": "设计占位文本",
    "developer-utility-workflow": "浏览器工具工作流",
    "hash-generator-security": "Hash 生成安全说明",
    "text-diff-for-developers": "开发者文本 diff 工作流",
    "json-yaml-csv-conversion": "数据转换工作流",
    "sql-formatting-workflow": "SQL 格式化工作流",
    "color-contrast-checking": "颜色与对比度检查",
    "secure-generator-workflow": "安全随机生成工作流",
    "web-seo-utilities": "Web 与 SEO 工具",
    "network-debugging-tools": "网络调试工作流",
    "css-utility-workflow": "CSS 工具工作流",
    "text-cleanup-workflow": "文本清理工作流",
  },
  "zh-TW": {
    "regex-cheat-sheet": "Regex 實用模式",
    "cron-expression-examples": "Cron 排程範例",
    "seo-meta-tags": "SEO 中繼標籤",
    "iframe-preview-limitations": "Iframe 預覽限制",
    "placeholder-text-for-design": "設計佔位文字",
    "developer-utility-workflow": "瀏覽器工具工作流程",
    "hash-generator-security": "Hash 產生安全說明",
    "text-diff-for-developers": "開發者文字 diff 工作流程",
    "json-yaml-csv-conversion": "資料轉換工作流程",
    "sql-formatting-workflow": "SQL 格式化工作流程",
    "color-contrast-checking": "色彩與對比檢查",
    "secure-generator-workflow": "安全隨機產生工作流程",
    "web-seo-utilities": "Web 與 SEO 工具",
    "network-debugging-tools": "網路除錯工作流程",
    "css-utility-workflow": "CSS 工具工作流程",
    "text-cleanup-workflow": "文字清理工作流程",
  },
  es: {
    "regex-cheat-sheet": "Patrones practicos de Regex",
    "cron-expression-examples": "Ejemplos de horarios Cron",
    "seo-meta-tags": "Meta tags SEO",
    "iframe-preview-limitations": "Limitaciones de preview iframe",
    "placeholder-text-for-design": "Texto placeholder para diseno",
    "developer-utility-workflow": "Flujo de utilidades en navegador",
    "hash-generator-security": "Notas de seguridad para Hash",
    "text-diff-for-developers": "Flujo de diff de texto para desarrolladores",
    "json-yaml-csv-conversion": "Flujo de conversion de datos",
    "sql-formatting-workflow": "Flujo de formateo SQL",
    "color-contrast-checking": "Chequeo de color y contraste",
    "secure-generator-workflow": "Flujo seguro de generadores",
    "web-seo-utilities": "Utilidades Web y SEO",
    "network-debugging-tools": "Flujo de depuracion de red",
    "css-utility-workflow": "Flujo de utilidades CSS",
    "text-cleanup-workflow": "Flujo de limpieza de texto",
  },
  "pt-BR": {
    "regex-cheat-sheet": "Padroes praticos de Regex",
    "cron-expression-examples": "Exemplos de agendas Cron",
    "seo-meta-tags": "Meta tags SEO",
    "iframe-preview-limitations": "Limitacoes de preview iframe",
    "placeholder-text-for-design": "Texto placeholder para design",
    "developer-utility-workflow": "Fluxo de utilitarios no navegador",
    "hash-generator-security": "Notas de seguranca para Hash",
    "text-diff-for-developers": "Fluxo de diff de texto para devs",
    "json-yaml-csv-conversion": "Fluxo de conversao de dados",
    "sql-formatting-workflow": "Fluxo de formatacao SQL",
    "color-contrast-checking": "Checagem de cor e contraste",
    "secure-generator-workflow": "Fluxo seguro de geradores",
    "web-seo-utilities": "Utilitarios Web e SEO",
    "network-debugging-tools": "Fluxo de debug de rede",
    "css-utility-workflow": "Fluxo de utilitarios CSS",
    "text-cleanup-workflow": "Fluxo de limpeza de texto",
  },
  de: {
    "regex-cheat-sheet": "Praktische Regex-Muster",
    "cron-expression-examples": "Cron-Zeitplanbeispiele",
    "seo-meta-tags": "SEO-Meta-Tags",
    "iframe-preview-limitations": "Grenzen von Iframe-Vorschauen",
    "placeholder-text-for-design": "Platzhaltertext fuer Design",
    "developer-utility-workflow": "Browser-Utility-Workflow",
    "hash-generator-security": "Sicherheitshinweise fuer Hashes",
    "text-diff-for-developers": "Text-Diff-Workflow fuer Entwickler",
    "json-yaml-csv-conversion": "Datenkonvertierungs-Workflow",
    "sql-formatting-workflow": "SQL-Formatierungs-Workflow",
    "color-contrast-checking": "Farb- und Kontrastpruefung",
    "secure-generator-workflow": "Sicherer Generator-Workflow",
    "web-seo-utilities": "Web- und SEO-Utilities",
    "network-debugging-tools": "Netzwerk-Debugging-Workflow",
    "css-utility-workflow": "CSS-Utility-Workflow",
    "text-cleanup-workflow": "Textbereinigungs-Workflow",
  },
  fr: {
    "regex-cheat-sheet": "Modeles Regex pratiques",
    "cron-expression-examples": "Exemples de planning Cron",
    "seo-meta-tags": "Balises meta SEO",
    "iframe-preview-limitations": "Limites des apercus iframe",
    "placeholder-text-for-design": "Texte placeholder pour design",
    "developer-utility-workflow": "Flux d'utilitaires navigateur",
    "hash-generator-security": "Notes de securite Hash",
    "text-diff-for-developers": "Flux de diff texte pour developpeurs",
    "json-yaml-csv-conversion": "Flux de conversion de donnees",
    "sql-formatting-workflow": "Flux de formatage SQL",
    "color-contrast-checking": "Verification couleur et contraste",
    "secure-generator-workflow": "Flux securise de generation",
    "web-seo-utilities": "Utilitaires Web et SEO",
    "network-debugging-tools": "Flux de debogage reseau",
    "css-utility-workflow": "Flux d'utilitaires CSS",
    "text-cleanup-workflow": "Flux de nettoyage texte",
  },
  hi: {
    "regex-cheat-sheet": "Regex ka vyavaharik pattern",
    "cron-expression-examples": "Cron schedule ke udaharan",
    "seo-meta-tags": "SEO meta tag",
    "iframe-preview-limitations": "Iframe preview ki seemaen",
    "placeholder-text-for-design": "Design ke liye placeholder text",
    "developer-utility-workflow": "Browser utility workflow",
    "hash-generator-security": "Hash generator suraksha notes",
    "text-diff-for-developers": "Developers ke liye text diff workflow",
    "json-yaml-csv-conversion": "Data conversion workflow",
    "sql-formatting-workflow": "SQL formatting workflow",
    "color-contrast-checking": "Color aur contrast check",
    "secure-generator-workflow": "Surakshit generator workflow",
    "web-seo-utilities": "Web aur SEO utilities",
    "network-debugging-tools": "Network debugging workflow",
    "css-utility-workflow": "CSS utility workflow",
    "text-cleanup-workflow": "Text cleanup workflow",
  },
  id: {
    "regex-cheat-sheet": "Pola Regex praktis",
    "cron-expression-examples": "Contoh jadwal Cron",
    "seo-meta-tags": "Meta tag SEO",
    "iframe-preview-limitations": "Batasan preview iframe",
    "placeholder-text-for-design": "Teks placeholder untuk desain",
    "developer-utility-workflow": "Workflow utilitas browser",
    "hash-generator-security": "Catatan keamanan Hash",
    "text-diff-for-developers": "Workflow text diff untuk developer",
    "json-yaml-csv-conversion": "Workflow konversi data",
    "sql-formatting-workflow": "Workflow formatting SQL",
    "color-contrast-checking": "Pemeriksaan warna dan kontras",
    "secure-generator-workflow": "Workflow generator aman",
    "web-seo-utilities": "Utilitas Web dan SEO",
    "network-debugging-tools": "Workflow debugging jaringan",
    "css-utility-workflow": "Workflow utilitas CSS",
    "text-cleanup-workflow": "Workflow pembersihan teks",
  },
  vi: {
    "regex-cheat-sheet": "Mau Regex thuc dung",
    "cron-expression-examples": "Vi du lich Cron",
    "seo-meta-tags": "The meta SEO",
    "iframe-preview-limitations": "Gioi han preview iframe",
    "placeholder-text-for-design": "Van ban placeholder cho thiet ke",
    "developer-utility-workflow": "Workflow tien ich trinh duyet",
    "hash-generator-security": "Ghi chu bao mat Hash",
    "text-diff-for-developers": "Workflow diff van ban cho lap trinh vien",
    "json-yaml-csv-conversion": "Workflow chuyen doi du lieu",
    "sql-formatting-workflow": "Workflow dinh dang SQL",
    "color-contrast-checking": "Kiem tra mau va tuong phan",
    "secure-generator-workflow": "Workflow tao gia tri an toan",
    "web-seo-utilities": "Tien ich Web va SEO",
    "network-debugging-tools": "Workflow debug mang",
    "css-utility-workflow": "Workflow tien ich CSS",
    "text-cleanup-workflow": "Workflow lam sach van ban",
  },
  th: {
    "regex-cheat-sheet": "แพตเทิร์น Regex สำหรับใช้งานจริง",
    "cron-expression-examples": "ตัวอย่างตาราง Cron",
    "seo-meta-tags": "เมตาแท็ก SEO",
    "iframe-preview-limitations": "ข้อจำกัดของ iframe preview",
    "placeholder-text-for-design": "ข้อความ placeholder สำหรับงานออกแบบ",
    "developer-utility-workflow": "workflow เครื่องมือบนเบราว์เซอร์",
    "hash-generator-security": "หมายเหตุความปลอดภัยของ Hash",
    "text-diff-for-developers": "workflow text diff สำหรับนักพัฒนา",
    "json-yaml-csv-conversion": "workflow แปลงข้อมูล",
    "sql-formatting-workflow": "workflow จัดรูปแบบ SQL",
    "color-contrast-checking": "ตรวจสีและ contrast",
    "secure-generator-workflow": "workflow generator ที่ปลอดภัย",
    "web-seo-utilities": "เครื่องมือ Web และ SEO",
    "network-debugging-tools": "workflow debug เครือข่าย",
    "css-utility-workflow": "workflow เครื่องมือ CSS",
    "text-cleanup-workflow": "workflow ทำความสะอาดข้อความ",
  },
  ar: {
    "regex-cheat-sheet": "أنماط Regex عملية",
    "cron-expression-examples": "أمثلة جداول Cron",
    "seo-meta-tags": "وسوم SEO meta",
    "iframe-preview-limitations": "قيود معاينة iframe",
    "placeholder-text-for-design": "نص placeholder للتصميم",
    "developer-utility-workflow": "سير عمل أدوات المتصفح",
    "hash-generator-security": "ملاحظات أمان Hash",
    "text-diff-for-developers": "سير عمل text diff للمطورين",
    "json-yaml-csv-conversion": "سير عمل تحويل البيانات",
    "sql-formatting-workflow": "سير عمل تنسيق SQL",
    "color-contrast-checking": "فحص اللون والتباين",
    "secure-generator-workflow": "سير عمل generator آمن",
    "web-seo-utilities": "أدوات Web و SEO",
    "network-debugging-tools": "سير عمل debug للشبكة",
    "css-utility-workflow": "سير عمل أدوات CSS",
    "text-cleanup-workflow": "سير عمل تنظيف النص",
  },
};

const localizedToolTitleOverrides: Record<Exclude<Locale, "en">, Record<string, string>> = {
  ko: {
    "UUID Generator": "UUID 생성기",
    "ULID Generator": "ULID 생성기",
    "Password Generator": "비밀번호 생성기",
    "Random Token Generator": "랜덤 토큰 생성기",
  },
  ja: {
    "UUID Generator": "UUID 生成ツール",
    "ULID Generator": "ULID 生成ツール",
    "Password Generator": "Password 生成ツール",
    "Random Token Generator": "Random Token 生成ツール",
  },
  "zh-CN": {
    "UUID Generator": "UUID 生成器",
    "ULID Generator": "ULID 生成器",
    "Password Generator": "密码生成器",
    "Random Token Generator": "随机令牌生成器",
  },
  "zh-TW": {
    "UUID Generator": "UUID 產生器",
    "ULID Generator": "ULID 產生器",
    "Password Generator": "密碼產生器",
    "Random Token Generator": "隨機權杖產生器",
  },
  es: {
    "UUID Generator": "Generador UUID",
    "ULID Generator": "Generador ULID",
    "Password Generator": "Generador de contrasenas",
    "Random Token Generator": "Generador de tokens aleatorios",
  },
  "pt-BR": {
    "UUID Generator": "Gerador UUID",
    "ULID Generator": "Gerador ULID",
    "Password Generator": "Gerador de senhas",
    "Random Token Generator": "Gerador de tokens aleatorios",
  },
  de: {
    "UUID Generator": "UUID-Generator",
    "ULID Generator": "ULID-Generator",
    "Password Generator": "Passwort-Generator",
    "Random Token Generator": "Zufallstoken-Generator",
  },
  fr: {
    "UUID Generator": "Generateur UUID",
    "ULID Generator": "Generateur ULID",
    "Password Generator": "Generateur de mots de passe",
    "Random Token Generator": "Generateur de tokens aleatoires",
  },
  hi: {
    "UUID Generator": "UUID generator",
    "ULID Generator": "ULID generator",
    "Password Generator": "Password generator",
    "Random Token Generator": "Random token generator",
  },
  id: {
    "UUID Generator": "Generator UUID",
    "ULID Generator": "Generator ULID",
    "Password Generator": "Generator password",
    "Random Token Generator": "Generator token acak",
  },
  vi: {
    "UUID Generator": "Trinh tao UUID",
    "ULID Generator": "Trinh tao ULID",
    "Password Generator": "Trinh tao mat khau",
    "Random Token Generator": "Trinh tao token ngau nhien",
  },
  th: {
    "UUID Generator": "ตัวสร้าง UUID",
    "ULID Generator": "ตัวสร้าง ULID",
    "Password Generator": "ตัวสร้างรหัสผ่าน",
    "Random Token Generator": "ตัวสร้าง token สุ่ม",
  },
  ar: {
    "UUID Generator": "مولد UUID",
    "ULID Generator": "مولد ULID",
    "Password Generator": "مولد كلمات المرور",
    "Random Token Generator": "مولد token عشوائي",
  },
};

const packs: Record<Exclude<Locale, "en">, TextPack> = {
  ko: {
    titleTerms: { Tester: "테스터", Generator: "생성기", Formatter: "포매터", Converter: "변환기", Decoder: "디코더", Encoder: "인코더", Viewer: "뷰어", Preview: "미리보기", Parser: "파서", Checker: "체커", Lookup: "조회", Minifier: "압축기", Validator: "검증기", Counter: "카운터" },
    guideTopics: { ...guideTopicEn, "secure-generator-workflow": "보안 랜덤 생성 흐름", "developer-utility-workflow": "브라우저 유틸리티 작업 흐름", "json-yaml-csv-conversion": "데이터 변환 흐름" },
    localChip: "브라우저 로컬",
    serverChip: "서버 확인",
    coreChip: "핵심 수요",
    growthChip: "성장 수요",
    longTailChip: "롱테일",
    description: (title, category, privacy) => `${title}로 ${category} 작업을 빠르게 처리하세요. ${privacy} 방식으로 입력을 다루고, 예제와 FAQ로 결과를 확인할 수 있습니다.`,
    seoTitle: (title, category) => `${title} - 무료 온라인 ${category} 도구`,
    seoDescription: (title, category, privacy) => `${title}는 ${category} 작업을 위한 무료 온라인 도구입니다. ${privacy} 처리, 예제, FAQ, 관련 도구를 함께 제공합니다.`,
    useCases: (title, category, privacy) => [`${category} 작업에서 ${title}를 빠르게 실행합니다.`, `${privacy} 방식으로 입력과 결과를 확인합니다.`, "복사하기 전에 예제와 FAQ로 결과를 검토합니다."],
    exampleLabels: ["일반 입력", "일반 출력", "추가 예제"],
    exampleNote: (title) => `${title}를 사용하기 전에 이 예제로 입력 흐름을 확인하세요.`,
    sanityNote: "복사하기 전에 결과 형태를 빠르게 확인하는 예제입니다.",
    localFaqQuestion: (title) => `${title}가 입력을 업로드하나요?`,
    localFaqAnswer: "아니요. 이 도구는 별도 서버 route가 필요하다고 표시되지 않는 한 브라우저에서 실행됩니다.",
    serverFaqQuestion: (title) => `${title}가 서버 route를 쓰는 이유는 무엇인가요?`,
    serverFaqAnswer: "브라우저만으로 안정적으로 확인하기 어려운 작업이라 입력한 공개 URL 또는 호스트만 작은 서버 route로 확인합니다.",
    secretQuestion: "운영 비밀값을 넣어도 되나요?",
    secretAnswer: "운영 비밀값, 고객 데이터, 내부 호스트명은 넣지 마세요. 테스트 데이터나 마스킹된 값만 사용하세요.",
    guideDescription: (topic) => `${topic}을 실무에서 안전하게 쓰기 위한 짧은 가이드입니다.`,
    guideSections: (topic) => [
      { heading: "작고 신뢰 가능한 입력으로 시작", body: `${topic}은 짧은 실제 샘플로 먼저 확인하세요. 작은 입력은 문법, 인코딩, 포맷 문제를 더 빨리 드러냅니다.` },
      { heading: "민감한 데이터는 제외", body: "브라우저 도구는 빠르지만 운영 비밀값, 개인 정보, 내부 호스트명은 항상 제거하거나 마스킹해야 합니다." },
      { heading: "복사 전 결과 확인", body: "생성된 출력은 대상 런타임, 문법 변형, 플랫폼 동작을 확인하기 전까지 초안으로 다루세요." },
    ],
  },
  ja: {
    titleTerms: { Tester: "テスター", Generator: "生成ツール", Formatter: "フォーマッター", Converter: "変換ツール", Decoder: "デコーダー", Encoder: "エンコーダー", Viewer: "ビューア", Preview: "プレビュー", Parser: "パーサー", Checker: "チェッカー", Lookup: "検索", Minifier: "圧縮ツール", Validator: "検証ツール", Counter: "カウンター" },
    guideTopics: { ...guideTopicEn, "secure-generator-workflow": "安全なランダム生成フロー", "developer-utility-workflow": "ブラウザユーティリティの作業フロー", "json-yaml-csv-conversion": "データ変換フロー" },
    localChip: "ブラウザ内処理",
    serverChip: "サーバー確認",
    coreChip: "主要ニーズ",
    growthChip: "成長ニーズ",
    longTailChip: "ロングテール",
    description: (title, category, privacy) => `${title} は ${category} 作業を素早く処理するためのツールです。${privacy}で入力を扱い、例とFAQで結果を確認できます。`,
    seoTitle: (title, category) => `${title} - 無料オンライン${category}ツール`,
    seoDescription: (title, category, privacy) => `${title} は ${category} 作業向けの無料オンラインツールです。${privacy}、例、FAQ、関連ツールをまとめて確認できます。`,
    useCases: (title, category, privacy) => [`${category} 作業で ${title} を素早く使えます。`, `${privacy}で入力と結果を確認できます。`, "コピー前に例とFAQで出力を確認します。"],
    exampleLabels: ["一般的な入力", "一般的な出力", "追加例"],
    exampleNote: (title) => `${title} の入力フローをこの例で確認できます。`,
    sanityNote: "コピー前に結果の形を素早く確認するための例です。",
    localFaqQuestion: (title) => `${title} は入力をアップロードしますか？`,
    localFaqAnswer: "いいえ。サーバーrouteが必要と表示されていない限り、このツールはブラウザ内で実行されます。",
    serverFaqQuestion: (title) => `${title} がサーバーrouteを使う理由は？`,
    serverFaqAnswer: "ブラウザだけでは安定して確認できないため、入力された公開URLまたはホストだけを小さなサーバーrouteで確認します。",
    secretQuestion: "本番の秘密情報を使えますか？",
    secretAnswer: "本番の秘密情報、顧客データ、内部ホスト名は入力しないでください。テスト値またはマスク済みの値を使ってください。",
    guideDescription: (topic) => `${topic} を安全かつ効率的に使うための短い実用ガイドです。`,
    guideSections: (topic) => [
      { heading: "小さく信頼できる入力から始める", body: `${topic} は短い実例で先に確認します。小さな入力は構文、エンコード、整形の問題を見つけやすくします。` },
      { heading: "機密データを入れない", body: "ブラウザツールは便利ですが、本番の秘密情報、個人情報、内部ホスト名は必ず削除またはマスクしてください。" },
      { heading: "コピー前に結果を確認", body: "生成された出力は、対象ランタイムや構文差、プラットフォーム挙動を確認するまでは下書きとして扱います。" },
    ],
  },
  "zh-CN": {
    titleTerms: { Tester: "测试器", Generator: "生成器", Formatter: "格式化器", Converter: "转换器", Decoder: "解码器", Encoder: "编码器", Viewer: "查看器", Preview: "预览", Parser: "解析器", Checker: "检查器", Lookup: "查询", Minifier: "压缩器", Validator: "验证器", Counter: "计数器" },
    guideTopics: guideTopicEn,
    localChip: "浏览器本地",
    serverChip: "服务器检查",
    coreChip: "核心需求",
    growthChip: "增长需求",
    longTailChip: "长尾",
    description: (title, category, privacy) => `${title} 可快速处理${category}工作流。输入按${privacy}方式处理，并可通过示例和 FAQ 检查结果。`,
    seoTitle: (title, category) => `${title} - 免费在线${category}工具`,
    seoDescription: (title, category, privacy) => `${title} 是面向${category}工作的免费在线工具，提供${privacy}、示例、FAQ 和相关工具。`,
    useCases: (title, category, privacy) => [`在${category}工作中快速使用 ${title}。`, `以${privacy}方式检查输入和输出。`, "复制前用示例和 FAQ 核对结果。"],
    exampleLabels: ["常见输入", "典型输出", "附加示例"],
    exampleNote: (title) => `用此示例检查 ${title} 的输入流程。`,
    sanityNote: "复制前快速确认结果格式。",
    localFaqQuestion: (title) => `${title} 会上传我的输入吗？`,
    localFaqAnswer: "不会。除非隐私标识说明需要服务器 route，否则此工具在浏览器中运行。",
    serverFaqQuestion: (title) => `${title} 为什么使用服务器 route？`,
    serverFaqAnswer: "浏览器无法可靠完成此检查，因此只把输入的公共 URL 或主机发送到小型服务器 route。",
    secretQuestion: "可以输入生产密钥吗？",
    secretAnswer: "不要输入生产密钥、客户数据或内部主机名。请使用测试数据或已脱敏的值。",
    guideDescription: (topic) => `关于安全高效使用${topic}的简短实践指南。`,
    guideSections: (topic) => [
      { heading: "从小而可靠的输入开始", body: `先用短小真实样例测试${topic}，更容易发现语法、编码和格式问题。` },
      { heading: "排除敏感数据", body: "浏览器工具很快，但生产密钥、客户数据和内部主机名仍应删除或脱敏。" },
      { heading: "复制前检查结果", body: "生成内容在确认目标运行时、语法变体或平台行为前都应视为草稿。" },
    ],
  },
  "zh-TW": {
    titleTerms: { Tester: "測試器", Generator: "產生器", Formatter: "格式化器", Converter: "轉換器", Decoder: "解碼器", Encoder: "編碼器", Viewer: "檢視器", Preview: "預覽", Parser: "解析器", Checker: "檢查器", Lookup: "查詢", Minifier: "壓縮器", Validator: "驗證器", Counter: "計數器" },
    guideTopics: guideTopicEn,
    localChip: "瀏覽器本機",
    serverChip: "伺服器檢查",
    coreChip: "核心需求",
    growthChip: "成長需求",
    longTailChip: "長尾",
    description: (title, category, privacy) => `${title} 可快速處理${category}工作流程。輸入以${privacy}方式處理，並可透過範例與 FAQ 檢查結果。`,
    seoTitle: (title, category) => `${title} - 免費線上${category}工具`,
    seoDescription: (title, category, privacy) => `${title} 是面向${category}工作的免費線上工具，提供${privacy}、範例、FAQ 與相關工具。`,
    useCases: (title, category, privacy) => [`在${category}工作中快速使用 ${title}。`, `以${privacy}方式檢查輸入與輸出。`, "複製前用範例與 FAQ 核對結果。"],
    exampleLabels: ["常見輸入", "典型輸出", "附加範例"],
    exampleNote: (title) => `用此範例檢查 ${title} 的輸入流程。`,
    sanityNote: "複製前快速確認結果格式。",
    localFaqQuestion: (title) => `${title} 會上傳我的輸入嗎？`,
    localFaqAnswer: "不會。除非隱私標籤明確表示需要伺服器 route，否則此工具在瀏覽器中執行。",
    serverFaqQuestion: (title) => `${title} 為什麼使用伺服器 route？`,
    serverFaqAnswer: "瀏覽器無法可靠完成此檢查，因此只會把輸入的公開 URL 或主機送到小型伺服器 route。",
    secretQuestion: "可以輸入正式環境密鑰嗎？",
    secretAnswer: "不要輸入正式環境密鑰、客戶資料或內部主機名。請使用測試資料或已遮罩的值。",
    guideDescription: (topic) => `安全高效使用${topic}的短篇實務指南。`,
    guideSections: (topic) => [
      { heading: "從小而可靠的輸入開始", body: `先用短小真實樣例測試${topic}，更容易發現語法、編碼和格式問題。` },
      { heading: "排除敏感資料", body: "瀏覽器工具很快，但正式密鑰、客戶資料和內部主機名仍應刪除或遮罩。" },
      { heading: "複製前檢查結果", body: "生成內容在確認目標 runtime、語法差異或平台行為前都應視為草稿。" },
    ],
  },
  es: {
    titleTerms: { Tester: "Tester", Generator: "Generador", Formatter: "Formateador", Converter: "Convertidor", Decoder: "Decodificador", Encoder: "Codificador", Viewer: "Visor", Preview: "Vista previa", Parser: "Analizador", Checker: "Verificador", Lookup: "Consulta", Minifier: "Minificador", Validator: "Validador", Counter: "Contador" },
    guideTopics: guideTopicEn,
    localChip: "Local en navegador",
    serverChip: "Ruta de servidor",
    coreChip: "Demanda alta",
    growthChip: "Crecimiento",
    longTailChip: "Long tail",
    description: (title, category, privacy) => `${title} ayuda a resolver flujos de ${category} con rapidez. Trata la entrada con modo ${privacy} e incluye ejemplos y FAQ para revisar el resultado.`,
    seoTitle: (title, category) => `${title} - herramienta ${category} gratis online`,
    seoDescription: (title, category, privacy) => `${title} es una herramienta gratis para tareas de ${category}, con ${privacy}, ejemplos, FAQ y herramientas relacionadas.`,
    useCases: (title, category, privacy) => [`Usa ${title} en flujos de ${category}.`, `Revisa entrada y salida con modo ${privacy}.`, "Comprueba el resultado con ejemplos y FAQ antes de copiar."],
    exampleLabels: ["Entrada comun", "Salida tipica", "Ejemplo adicional"],
    exampleNote: (title) => `Usa este ejemplo para revisar el flujo de entrada de ${title}.`,
    sanityNote: "Ejemplo rapido para comprobar la forma del resultado antes de copiar.",
    localFaqQuestion: (title) => `¿${title} sube mi entrada?`,
    localFaqAnswer: "No. La herramienta se ejecuta en el navegador salvo que el indicador de privacidad diga que requiere una ruta de servidor.",
    serverFaqQuestion: (title) => `¿Por que ${title} usa una ruta de servidor?`,
    serverFaqAnswer: "El navegador no puede hacer esta comprobacion de forma fiable, asi que solo se envia la URL publica o host indicado a una ruta pequena.",
    secretQuestion: "¿Puedo usar secretos de produccion?",
    secretAnswer: "No pegues secretos de produccion, datos de clientes ni hostnames internos. Usa datos de prueba o valores redactados.",
    guideDescription: (topic) => `Guia breve para usar ${topic} con seguridad y eficiencia.`,
    guideSections: (topic) => [
      { heading: "Empieza con una entrada pequena y fiable", body: `Prueba ${topic} con una muestra real corta antes de pegar datos grandes. Asi es mas facil detectar errores de sintaxis, encoding y formato.` },
      { heading: "Mantén fuera los datos sensibles", body: "Las utilidades del navegador son rapidas, pero los secretos, datos de clientes y hostnames internos deben redactarse." },
      { heading: "Revisa antes de copiar", body: "Trata la salida generada como borrador hasta confirmar runtime, variante de sintaxis o comportamiento de la plataforma." },
    ],
  },
  "pt-BR": {
    titleTerms: { Tester: "Testador", Generator: "Gerador", Formatter: "Formatador", Converter: "Conversor", Decoder: "Decodificador", Encoder: "Codificador", Viewer: "Visualizador", Preview: "Preview", Parser: "Parser", Checker: "Verificador", Lookup: "Consulta", Minifier: "Minificador", Validator: "Validador", Counter: "Contador" },
    guideTopics: guideTopicEn,
    localChip: "Local no navegador",
    serverChip: "Rota de servidor",
    coreChip: "Alta demanda",
    growthChip: "Crescimento",
    longTailChip: "Cauda longa",
    description: (title, category, privacy) => `${title} ajuda a resolver fluxos de ${category} rapidamente. A entrada usa modo ${privacy}, com exemplos e FAQ para revisar o resultado.`,
    seoTitle: (title, category) => `${title} - ferramenta ${category} online gratis`,
    seoDescription: (title, category, privacy) => `${title} e uma ferramenta gratis para tarefas de ${category}, com ${privacy}, exemplos, FAQ e ferramentas relacionadas.`,
    useCases: (title, category, privacy) => [`Use ${title} em fluxos de ${category}.`, `Revise entrada e saida com modo ${privacy}.`, "Confira exemplos e FAQ antes de copiar o resultado."],
    exampleLabels: ["Entrada comum", "Saida tipica", "Exemplo adicional"],
    exampleNote: (title) => `Use este exemplo para revisar o fluxo de entrada de ${title}.`,
    sanityNote: "Exemplo rapido para verificar o formato antes de copiar.",
    localFaqQuestion: (title) => `${title} envia minha entrada?`,
    localFaqAnswer: "Nao. A ferramenta roda no navegador salvo quando o selo de privacidade indica rota de servidor.",
    serverFaqQuestion: (title) => `Por que ${title} usa rota de servidor?`,
    serverFaqAnswer: "O navegador nao consegue fazer essa verificacao de forma confiavel, entao apenas a URL publica ou host informado vai para uma rota pequena.",
    secretQuestion: "Posso usar segredos de producao?",
    secretAnswer: "Nao cole segredos de producao, dados de clientes ou hostnames internos. Use dados de teste ou valores mascarados.",
    guideDescription: (topic) => `Guia breve para usar ${topic} com seguranca e eficiencia.`,
    guideSections: (topic) => [
      { heading: "Comece com uma entrada pequena e confiavel", body: `Teste ${topic} com uma amostra real curta antes de colar dados grandes. Isso facilita encontrar erros de sintaxe, codificacao e formato.` },
      { heading: "Mantenha dados sensiveis fora", body: "Utilitarios de navegador sao rapidos, mas segredos, dados de clientes e hostnames internos devem ser removidos ou mascarados." },
      { heading: "Revise antes de copiar", body: "Trate a saida gerada como rascunho ate confirmar runtime, variante de sintaxe ou comportamento da plataforma." },
    ],
  },
  de: {
    titleTerms: { Tester: "Tester", Generator: "Generator", Formatter: "Formatter", Converter: "Konverter", Decoder: "Decoder", Encoder: "Encoder", Viewer: "Viewer", Preview: "Vorschau", Parser: "Parser", Checker: "Pruefer", Lookup: "Lookup", Minifier: "Minifier", Validator: "Validator", Counter: "Zaehler" },
    guideTopics: guideTopicEn,
    localChip: "Lokal im Browser",
    serverChip: "Serverpruefung",
    coreChip: "Hohe Nachfrage",
    growthChip: "Wachstum",
    longTailChip: "Long Tail",
    description: (title, category, privacy) => `${title} unterstuetzt ${category}-Workflows schnell und klar. Eingaben werden per ${privacy} behandelt, mit Beispielen und FAQ zur Kontrolle der Ausgabe.`,
    seoTitle: (title, category) => `${title} - kostenloses Online-${category}-Tool`,
    seoDescription: (title, category, privacy) => `${title} ist ein kostenloses Online-Tool fuer ${category}-Aufgaben mit ${privacy}, Beispielen, FAQ und verwandten Tools.`,
    useCases: (title, category, privacy) => [`Nutze ${title} in ${category}-Workflows.`, `Pruefe Eingabe und Ausgabe mit ${privacy}.`, "Kontrolliere das Ergebnis mit Beispielen und FAQ vor dem Kopieren."],
    exampleLabels: ["Typische Eingabe", "Typische Ausgabe", "Weiteres Beispiel"],
    exampleNote: (title) => `Mit diesem Beispiel pruefst du den Eingabefluss von ${title}.`,
    sanityNote: "Schnelles Beispiel zur Kontrolle der Ausgabeform vor dem Kopieren.",
    localFaqQuestion: (title) => `Laedt ${title} meine Eingabe hoch?`,
    localFaqAnswer: "Nein. Das Tool laeuft im Browser, ausser der Datenschutz-Hinweis nennt ausdruecklich eine Serverroute.",
    serverFaqQuestion: (title) => `Warum nutzt ${title} eine Serverroute?`,
    serverFaqAnswer: "Der Browser kann diese Pruefung nicht zuverlaessig alleine ausfuehren. Nur die eingegebene oeffentliche URL oder der Host wird an eine kleine Route gesendet.",
    secretQuestion: "Kann ich Produktionsgeheimnisse verwenden?",
    secretAnswer: "Nein. Verwende keine Produktionsgeheimnisse, Kundendaten oder internen Hostnamen. Nutze Testdaten oder redigierte Werte.",
    guideDescription: (topic) => `Kurzer Praxisleitfaden fuer sicheres und effizientes Arbeiten mit ${topic}.`,
    guideSections: (topic) => [
      { heading: "Mit einer kleinen verlaesslichen Eingabe starten", body: `Teste ${topic} zuerst mit einem kurzen realen Beispiel. Kleine Eingaben machen Syntax-, Encoding- und Formatprobleme schneller sichtbar.` },
      { heading: "Sensible Daten ausschliessen", body: "Browser-Tools sind schnell, aber Produktionsgeheimnisse, Kundendaten und interne Hostnamen gehoeren nicht hinein." },
      { heading: "Vor dem Kopieren pruefen", body: "Behandle erzeugte Ausgabe als Entwurf, bis Runtime, Syntaxvariante oder Plattformverhalten bestaetigt sind." },
    ],
  },
  fr: {
    titleTerms: { Tester: "testeur", Generator: "generateur", Formatter: "formateur", Converter: "convertisseur", Decoder: "decodeur", Encoder: "encodeur", Viewer: "visualiseur", Preview: "apercu", Parser: "analyseur", Checker: "verificateur", Lookup: "recherche", Minifier: "minificateur", Validator: "validateur", Counter: "compteur" },
    guideTopics: guideTopicEn,
    localChip: "Local navigateur",
    serverChip: "Route serveur",
    coreChip: "Forte demande",
    growthChip: "Croissance",
    longTailChip: "Longue traine",
    description: (title, category, privacy) => `${title} aide a traiter les flux ${category} rapidement. L'entree est geree en mode ${privacy}, avec exemples et FAQ pour verifier la sortie.`,
    seoTitle: (title, category) => `${title} - outil ${category} gratuit en ligne`,
    seoDescription: (title, category, privacy) => `${title} est un outil gratuit pour les taches ${category}, avec ${privacy}, exemples, FAQ et outils lies.`,
    useCases: (title, category, privacy) => [`Utiliser ${title} dans les flux ${category}.`, `Verifier entree et sortie en mode ${privacy}.`, "Relire exemples et FAQ avant de copier le resultat."],
    exampleLabels: ["Entree courante", "Sortie typique", "Exemple supplementaire"],
    exampleNote: (title) => `Utilisez cet exemple pour verifier le flux d'entree de ${title}.`,
    sanityNote: "Exemple rapide pour verifier la forme de sortie avant copie.",
    localFaqQuestion: (title) => `${title} envoie-t-il mon entree ?`,
    localFaqAnswer: "Non. L'outil s'execute dans le navigateur sauf si le badge de confidentialite indique une route serveur.",
    serverFaqQuestion: (title) => `Pourquoi ${title} utilise une route serveur ?`,
    serverFaqAnswer: "Le navigateur ne peut pas faire cette verification de facon fiable. Seule l'URL publique ou l'hote saisi est envoye.",
    secretQuestion: "Puis-je utiliser des secrets de production ?",
    secretAnswer: "Non. Ne collez pas de secrets, donnees client ou hotes internes. Utilisez des valeurs de test ou masquees.",
    guideDescription: (topic) => `Guide court pour utiliser ${topic} de maniere sure et efficace.`,
    guideSections: (topic) => [
      { heading: "Commencer par une petite entree fiable", body: `Testez ${topic} avec un court exemple reel avant de coller un gros contenu. Cela revele plus vite les erreurs de syntaxe, encodage et format.` },
      { heading: "Garder les donnees sensibles hors du flux", body: "Les outils navigateur sont rapides, mais secrets, donnees client et hotes internes doivent etre masques." },
      { heading: "Verifier avant de copier", body: "Traitez la sortie comme un brouillon tant que le runtime, la variante de syntaxe ou le comportement plateforme n'est pas confirme." },
    ],
  },
  hi: {
    titleTerms: { Tester: "tester", Generator: "generator", Formatter: "formatter", Converter: "converter", Decoder: "decoder", Encoder: "encoder", Viewer: "viewer", Preview: "preview", Parser: "parser", Checker: "checker", Lookup: "lookup", Minifier: "minifier", Validator: "validator", Counter: "counter" },
    guideTopics: guideTopicEn,
    localChip: "Browser local",
    serverChip: "Server check",
    coreChip: "High demand",
    growthChip: "Growth",
    longTailChip: "Long tail",
    description: (title, category, privacy) => `${title} ${category} workflow ko tezi se handle karne me madad karta hai. Input ${privacy} mode me chalta hai, aur examples/FAQ se result check hota hai.`,
    seoTitle: (title, category) => `${title} - free online ${category} tool`,
    seoDescription: (title, category, privacy) => `${title} ${category} tasks ke liye free online tool hai, jisme ${privacy}, examples, FAQ aur related tools milte hain.`,
    useCases: (title, category, privacy) => [`${category} workflow me ${title} use karein.`, `${privacy} ke sath input aur output check karein.`, "Copy karne se pehle examples aur FAQ se result verify karein."],
    exampleLabels: ["Common input", "Typical output", "Extra example"],
    exampleNote: (title) => `${title} ka input flow check karne ke liye is example ka use karein.`,
    sanityNote: "Copy karne se pehle output shape check karne ka quick example.",
    localFaqQuestion: (title) => `Kya ${title} mera input upload karta hai?`,
    localFaqAnswer: "Nahi. Jab tak privacy badge server route na kahe, tool browser me chalta hai.",
    serverFaqQuestion: (title) => `${title} server route kyon use karta hai?`,
    serverFaqAnswer: "Browser ye check reliable tarike se akela nahi kar sakta, isliye sirf public URL ya host chhoti route ko bheja jata hai.",
    secretQuestion: "Kya production secrets use kar sakta hun?",
    secretAnswer: "Nahi. Production secrets, customer data, ya internal hostnames paste na karein. Test ya redacted values use karein.",
    guideDescription: (topic) => `${topic} ko safe aur efficient tarike se use karne ki chhoti practical guide.`,
    guideSections: (topic) => [
      { heading: "Chhote reliable input se shuru karein", body: `${topic} ko pehle short real sample se test karein. Chhote input syntax, encoding aur formatting issue jaldi dikhate hain.` },
      { heading: "Sensitive data bahar rakhein", body: "Browser tools fast hote hain, par production secrets, customer data aur internal hostnames redact hone chahiye." },
      { heading: "Copy se pehle result check karein", body: "Generated output ko draft samjhein jab tak runtime, syntax variant ya platform behavior confirm na ho." },
    ],
  },
  id: {
    titleTerms: { Tester: "tester", Generator: "generator", Formatter: "formatter", Converter: "konverter", Decoder: "decoder", Encoder: "encoder", Viewer: "viewer", Preview: "preview", Parser: "parser", Checker: "checker", Lookup: "lookup", Minifier: "minifier", Validator: "validator", Counter: "counter" },
    guideTopics: guideTopicEn,
    localChip: "Lokal browser",
    serverChip: "Cek server",
    coreChip: "Demand tinggi",
    growthChip: "Growth",
    longTailChip: "Long-tail",
    description: (title, category, privacy) => `${title} membantu workflow ${category} berjalan cepat. Input diproses dengan mode ${privacy}, dilengkapi contoh dan FAQ untuk mengecek hasil.`,
    seoTitle: (title, category) => `${title} - tool ${category} online gratis`,
    seoDescription: (title, category, privacy) => `${title} adalah tool gratis untuk tugas ${category}, dengan ${privacy}, contoh, FAQ, dan tool terkait.`,
    useCases: (title, category, privacy) => [`Gunakan ${title} untuk workflow ${category}.`, `Periksa input dan output dengan mode ${privacy}.`, "Cek contoh dan FAQ sebelum menyalin hasil."],
    exampleLabels: ["Input umum", "Output umum", "Contoh tambahan"],
    exampleNote: (title) => `Gunakan contoh ini untuk memeriksa alur input ${title}.`,
    sanityNote: "Contoh cepat untuk mengecek bentuk output sebelum disalin.",
    localFaqQuestion: (title) => `Apakah ${title} mengunggah input saya?`,
    localFaqAnswer: "Tidak. Tool berjalan di browser kecuali badge privasi menyebutkan route server.",
    serverFaqQuestion: (title) => `Mengapa ${title} memakai route server?`,
    serverFaqAnswer: "Browser tidak bisa melakukan cek ini secara andal sendiri, jadi hanya URL publik atau host yang dikirim ke route kecil.",
    secretQuestion: "Bolehkah memakai secret produksi?",
    secretAnswer: "Jangan tempel secret produksi, data pelanggan, atau hostname internal. Pakai data uji atau nilai yang disamarkan.",
    guideDescription: (topic) => `Panduan singkat untuk memakai ${topic} dengan aman dan efisien.`,
    guideSections: (topic) => [
      { heading: "Mulai dari input kecil yang tepercaya", body: `Coba ${topic} dengan sampel nyata singkat sebelum menempel payload besar. Input kecil lebih mudah menunjukkan masalah sintaks, encoding, dan format.` },
      { heading: "Jauhkan data sensitif", body: "Tool browser cepat, tetapi secret produksi, data pelanggan, dan hostname internal harus dihapus atau disamarkan." },
      { heading: "Periksa sebelum menyalin", body: "Anggap output sebagai draft sampai runtime, varian sintaks, atau perilaku platform sudah dikonfirmasi." },
    ],
  },
  vi: {
    titleTerms: { Tester: "tester", Generator: "generator", Formatter: "formatter", Converter: "converter", Decoder: "decoder", Encoder: "encoder", Viewer: "viewer", Preview: "preview", Parser: "parser", Checker: "checker", Lookup: "lookup", Minifier: "minifier", Validator: "validator", Counter: "counter" },
    guideTopics: guideTopicEn,
    localChip: "Cuc bo tren trinh duyet",
    serverChip: "Kiem tra server",
    coreChip: "Nhu cau cao",
    growthChip: "Tang truong",
    longTailChip: "Long-tail",
    description: (title, category, privacy) => `${title} giup xu ly workflow ${category} nhanh hon. Du lieu vao chay theo che do ${privacy}, kem vi du va FAQ de kiem tra ket qua.`,
    seoTitle: (title, category) => `${title} - cong cu ${category} online mien phi`,
    seoDescription: (title, category, privacy) => `${title} la cong cu mien phi cho tac vu ${category}, co ${privacy}, vi du, FAQ va cong cu lien quan.`,
    useCases: (title, category, privacy) => [`Dung ${title} trong workflow ${category}.`, `Kiem tra dau vao va dau ra voi che do ${privacy}.`, "Xem vi du va FAQ truoc khi sao chep ket qua."],
    exampleLabels: ["Dau vao thuong gap", "Dau ra thuong gap", "Vi du them"],
    exampleNote: (title) => `Dung vi du nay de kiem tra luong dau vao cua ${title}.`,
    sanityNote: "Vi du nhanh de kiem tra hinh dang dau ra truoc khi sao chep.",
    localFaqQuestion: (title) => `${title} co tai dau vao len khong?`,
    localFaqAnswer: "Khong. Cong cu chay trong trinh duyet tru khi huy hieu rieng tu noi can route server.",
    serverFaqQuestion: (title) => `Vi sao ${title} dung route server?`,
    serverFaqAnswer: "Trinh duyet khong the kiem tra on dinh mot minh, nen chi URL cong khai hoac host duoc gui toi route nho.",
    secretQuestion: "Co nen dung bi mat production khong?",
    secretAnswer: "Khong nhap secret production, du lieu khach hang hoac hostname noi bo. Hay dung du lieu test hoac da an.",
    guideDescription: (topic) => `Huong dan ngan de dung ${topic} an toan va hieu qua.`,
    guideSections: (topic) => [
      { heading: "Bat dau voi dau vao nho dang tin", body: `Thu ${topic} bang mau thuc ngan truoc khi dan payload lon. Dau vao nho giup thay loi cu phap, ma hoa va dinh dang nhanh hon.` },
      { heading: "Loai bo du lieu nhay cam", body: "Cong cu trinh duyet nhanh, nhung secret production, du lieu khach hang va hostname noi bo can duoc an hoac xoa." },
      { heading: "Kiem tra truoc khi sao chep", body: "Xem dau ra tao ra nhu ban nhap cho den khi runtime, bien the cu phap hoac hanh vi nen tang duoc xac nhan." },
    ],
  },
  th: {
    titleTerms: { Tester: "ตัวทดสอบ", Generator: "ตัวสร้าง", Formatter: "ตัวจัดรูปแบบ", Converter: "ตัวแปลง", Decoder: "ตัวถอดรหัส", Encoder: "ตัวเข้ารหัส", Viewer: "ตัวดู", Preview: "พรีวิว", Parser: "ตัวแยกวิเคราะห์", Checker: "ตัวตรวจสอบ", Lookup: "ค้นหา", Minifier: "ตัวย่อ", Validator: "ตัวตรวจความถูกต้อง", Counter: "ตัวนับ" },
    guideTopics: guideTopicEn,
    localChip: "ในเบราว์เซอร์",
    serverChip: "ตรวจผ่านเซิร์ฟเวอร์",
    coreChip: "ความต้องการสูง",
    growthChip: "เติบโต",
    longTailChip: "Long-tail",
    description: (title, category, privacy) => `${title} ช่วยจัดการงาน ${category} ได้รวดเร็ว อินพุตใช้โหมด ${privacy} พร้อมตัวอย่างและ FAQ เพื่อตรวจผลลัพธ์`,
    seoTitle: (title, category) => `${title} - เครื่องมือ ${category} ออนไลน์ฟรี`,
    seoDescription: (title, category, privacy) => `${title} เป็นเครื่องมือฟรีสำหรับงาน ${category} มี ${privacy} ตัวอย่าง FAQ และเครื่องมือที่เกี่ยวข้อง`,
    useCases: (title, category, privacy) => [`ใช้ ${title} ใน workflow ${category}`, `ตรวจอินพุตและเอาต์พุตด้วยโหมด ${privacy}`, "ดูตัวอย่างและ FAQ ก่อนคัดลอกผลลัพธ์"],
    exampleLabels: ["อินพุตทั่วไป", "เอาต์พุตทั่วไป", "ตัวอย่างเพิ่มเติม"],
    exampleNote: (title) => `ใช้ตัวอย่างนี้เพื่อตรวจ flow อินพุตของ ${title}`,
    sanityNote: "ตัวอย่างเร็วเพื่อตรวจรูปแบบผลลัพธ์ก่อนคัดลอก",
    localFaqQuestion: (title) => `${title} อัปโหลดอินพุตของฉันหรือไม่?`,
    localFaqAnswer: "ไม่ เครื่องมือทำงานในเบราว์เซอร์ เว้นแต่ป้าย privacy จะระบุว่าต้องใช้ route server",
    serverFaqQuestion: (title) => `ทำไม ${title} จึงใช้ route server?`,
    serverFaqAnswer: "เบราว์เซอร์ตรวจสิ่งนี้อย่างน่าเชื่อถือเองไม่ได้ จึงส่งเฉพาะ URL หรือ host สาธารณะไปยัง route ขนาดเล็ก",
    secretQuestion: "ใช้ secret production ได้ไหม?",
    secretAnswer: "อย่าใส่ secret production ข้อมูลลูกค้า หรือ hostname ภายใน ใช้ข้อมูลทดสอบหรือค่าที่ปิดบังแล้ว",
    guideDescription: (topic) => `คู่มือสั้นสำหรับใช้ ${topic} อย่างปลอดภัยและมีประสิทธิภาพ`,
    guideSections: (topic) => [
      { heading: "เริ่มจากอินพุตเล็กที่เชื่อถือได้", body: `ลอง ${topic} ด้วยตัวอย่างจริงขนาดสั้นก่อนวางข้อมูลขนาดใหญ่ อินพุตเล็กทำให้เห็นปัญหา syntax, encoding และ format ได้ง่ายขึ้น` },
      { heading: "กันข้อมูลอ่อนไหวออก", body: "เครื่องมือในเบราว์เซอร์เร็ว แต่ secret production ข้อมูลลูกค้า และ hostname ภายในควรถูกลบหรือปิดบัง" },
      { heading: "ตรวจผลก่อนคัดลอก", body: "ถือว่าผลลัพธ์เป็น draft จนกว่าจะยืนยัน runtime รูปแบบ syntax หรือพฤติกรรมแพลตฟอร์ม" },
    ],
  },
  ar: {
    titleTerms: { Tester: "اختبار", Generator: "مولد", Formatter: "منسق", Converter: "محول", Decoder: "فك ترميز", Encoder: "ترميز", Viewer: "عارض", Preview: "معاينة", Parser: "محلل", Checker: "فاحص", Lookup: "بحث", Minifier: "مصغر", Validator: "مدقق", Counter: "عداد" },
    guideTopics: guideTopicEn,
    localChip: "محلي في المتصفح",
    serverChip: "فحص عبر الخادم",
    coreChip: "طلب مرتفع",
    growthChip: "نمو",
    longTailChip: "ذيل طويل",
    description: (title, category, privacy) => `${title} يساعدك على إنجاز مهام ${category} بسرعة. تتم معالجة الإدخال بأسلوب ${privacy} مع أمثلة وFAQ لمراجعة النتيجة.`,
    seoTitle: (title, category) => `${title} - أداة ${category} مجانية على الويب`,
    seoDescription: (title, category, privacy) => `${title} أداة مجانية لمهام ${category} مع ${privacy} وأمثلة وFAQ وأدوات مرتبطة.`,
    useCases: (title, category, privacy) => [`استخدم ${title} في مهام ${category}.`, `راجع الإدخال والناتج بأسلوب ${privacy}.`, "تحقق من الأمثلة وFAQ قبل نسخ النتيجة."],
    exampleLabels: ["إدخال شائع", "ناتج شائع", "مثال إضافي"],
    exampleNote: (title) => `استخدم هذا المثال لفحص مسار الإدخال في ${title}.`,
    sanityNote: "مثال سريع لمراجعة شكل الناتج قبل النسخ.",
    localFaqQuestion: (title) => `هل يرفع ${title} الإدخال؟`,
    localFaqAnswer: "لا. تعمل الأداة في المتصفح ما لم يوضح شارة الخصوصية أنها تحتاج إلى route خادم.",
    serverFaqQuestion: (title) => `لماذا يستخدم ${title} route خادم؟`,
    serverFaqAnswer: "لا يستطيع المتصفح تنفيذ هذا الفحص بثبات وحده، لذلك يرسل فقط URL أو host العام إلى route صغير.",
    secretQuestion: "هل يمكن استخدام أسرار الإنتاج؟",
    secretAnswer: "لا تدخل أسرار الإنتاج أو بيانات العملاء أو أسماء المضيفين الداخلية. استخدم بيانات اختبار أو قيما مخفية.",
    guideDescription: (topic) => `دليل قصير لاستخدام ${topic} بأمان وكفاءة.`,
    guideSections: (topic) => [
      { heading: "ابدأ بإدخال صغير موثوق", body: `جرّب ${topic} بعينة حقيقية قصيرة قبل لصق حمولة كبيرة. الإدخال الصغير يكشف أخطاء الصياغة والترميز والتنسيق بسرعة أكبر.` },
      { heading: "أبعد البيانات الحساسة", body: "أدوات المتصفح سريعة، لكن أسرار الإنتاج وبيانات العملاء وأسماء المضيفين الداخلية يجب حذفها أو إخفاؤها." },
      { heading: "راجع النتيجة قبل النسخ", body: "تعامل مع الناتج كمسودة حتى تؤكد runtime أو اختلاف الصياغة أو سلوك المنصة." },
    ],
  },
};

function packFor(locale: Locale) {
  return locale === defaultLocale ? undefined : packs[locale];
}

function localizeTitle(title: string, locale: Locale, pack: TextPack) {
  if (locale !== defaultLocale && localizedToolTitleOverrides[locale][title]) {
    return localizedToolTitleOverrides[locale][title];
  }
  return Object.entries(pack.titleTerms).reduce((value, [source, replacement]) => value.replaceAll(source, replacement), title);
}

function privacyChip(tool: ToolDefinition, pack: TextPack) {
  return tool.requiresServer ? pack.serverChip : pack.localChip;
}

function localizedGuideTopic(slug: string, locale: Locale, pack: TextPack) {
  if (locale === defaultLocale) return guideTopicEn[slug] ?? slug;
  return localizedGuideTopics[locale][slug] ?? pack.guideTopics[slug] ?? guideTopicEn[slug] ?? slug;
}

function localizeGuideTitle(href: string, locale: Locale, pack: TextPack) {
  const slug = href.split("/").filter(Boolean).at(-1) ?? "";
  return localizedGuideTopic(slug, locale, pack);
}

function localizeTool(tool: ToolDefinition, locale: Locale): ToolDefinition {
  const pack = packFor(locale);
  if (!pack) return tool;
  const dictionary = getDictionary(locale);
  const title = localizeTitle(tool.title, locale, pack);
  const category = dictionary.categories[tool.category] ?? tool.category;
  const privacy = privacyChip(tool, pack);
  const description = pack.description(title, category, privacy);

  return {
    ...tool,
    title,
    shortTitle: localizeTitle(tool.shortTitle, locale, pack),
    description,
    contentCluster: category,
    searchIntents: [...tool.searchIntents, title, category],
    aliases: [...tool.aliases, title, category],
    useCases: pack.useCases(title, category, privacy),
    seo: {
      title: pack.seoTitle(title, category),
      description: pack.seoDescription(title, category, privacy),
      keywords: [title, category, privacy],
    },
    examples: tool.examples.map((example, index) => ({
      ...example,
      label: pack.exampleLabels[Math.min(index, 2)],
      note: index === 0 ? pack.exampleNote(title) : pack.sanityNote,
    })),
    faqs: tool.requiresServer
      ? [
          { question: pack.serverFaqQuestion(title), answer: pack.serverFaqAnswer },
          { question: pack.secretQuestion, answer: pack.secretAnswer },
        ]
      : [
          { question: pack.localFaqQuestion(title), answer: pack.localFaqAnswer },
          { question: pack.secretQuestion, answer: pack.secretAnswer },
        ],
    guides: tool.guides.map((guide) => ({ ...guide, title: localizeGuideTitle(guide.href, locale, pack) })),
  };
}

export function getLocalizedTool(tool: ToolDefinition, locale: Locale) {
  return localizeTool(tool, locale);
}

export function getLocalizedTools(locale: Locale) {
  return tools.map((tool) => getLocalizedTool(tool, locale));
}

export function getLocalizedRelatedTools(slugs: string[], locale: Locale) {
  const slugSet = new Set(slugs);
  return tools.filter((tool) => slugSet.has(tool.slug)).map((tool) => getLocalizedTool(tool, locale));
}

function localizedSearchText(tool: ToolDefinition) {
  return [
    tool.slug,
    tool.title,
    tool.shortTitle,
    tool.category,
    tool.description,
    tool.contentCluster,
    ...tool.aliases,
    ...tool.searchIntents,
    ...tool.useCases,
    ...tool.seo.keywords,
    tool.seo.title,
    tool.seo.description,
    ...tool.examples.flatMap((example) => [example.label, example.value, example.note]),
    ...tool.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...tool.guides.map((guide) => guide.title),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchLocalizedTools(query: string, locale: Locale) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return getLocalizedTools(locale);
  const englishRanked = searchTools(query);
  const seen = new Set(englishRanked.map((tool) => tool.slug));
  const localizedMatches = getLocalizedTools(locale).filter((tool) => localizedSearchText(tool).includes(trimmed) && !seen.has(tool.slug));
  return [...englishRanked.map((tool) => getLocalizedTool(tool, locale)), ...localizedMatches];
}

export function getLocalizedGuide(guide: GuideDefinition, locale: Locale): GuideDefinition {
  const pack = packFor(locale);
  if (!pack) return guide;
  const topic = localizedGuideTopic(guide.slug, locale, pack);
  return {
    ...guide,
    title: topic,
    description: pack.guideDescription(topic),
    sections: pack.guideSections(topic),
  };
}

export function getLocalizedGuides(locale: Locale) {
  return guides.map((guide) => getLocalizedGuide(guide, locale));
}
