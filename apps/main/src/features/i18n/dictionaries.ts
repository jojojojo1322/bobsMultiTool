import { defaultLocale, locales, type Locale } from "./config";

export interface Dictionary {
  dir: "ltr" | "rtl";
  siteDescription: string;
  nav: {
    brand: string;
    searchPlaceholder: string;
    openNavigation: string;
    close: string;
    guides: string;
    tools: string;
    examples: string;
    faq: string;
    relatedTools: string;
    relatedToolsDescription: string;
    guideDescription: string;
    language: string;
    theme: string;
  };
  home: {
    badge: string;
    title: string;
    description: string;
    openTools: string;
    readGuides: string;
    toolIndexTitle: string;
    toolIndexDescription: string;
  };
  tool: {
    developerWorkbench: string;
    singleDomainTitle: string;
    singleDomainBody: string;
    localFirstTitle: string;
    localFirstBody: string;
    expandableRegistryTitle: string;
    expandableRegistryBody: string;
    examplesDescription: string;
    faqDescription: string;
    guidesDescription: string;
    useCases: string;
    failureCases: string;
    failureCasesDescription: string;
    failureCaseInputPrefix: string;
    failureCaseCategoryPrefix: string;
    failureCasePrivacyPrefix: string;
    preCopyChecklist: string;
    preCopyChecklistDescription: string;
    preCopyCheckSourcePrefix: string;
    preCopyCheckSecrets: string;
    preCopyCheckRelatedPrefix: string;
    nextActionPrefix: string;
    noOutput: string;
    copy: string;
    copied: string;
    privacy: string;
    serverRequired: string;
    localOnly: string;
  };
  toolUi: Record<string, string>;
  guides: {
    badge: string;
    title: string;
    description: string;
    back: string;
    relatedTitle: string;
    relatedDescription: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
  };
  metadata: {
    homeTitle: string;
    homeDescription: string;
    guidesTitle: string;
    guidesDescription: string;
    toolDescription: (title: string) => string;
    guideDescription: (title: string) => string;
  };
  categories: Record<string, string>;
}

export type ClientDictionary = Omit<Dictionary, "metadata">;

const categories = {
  Text: "Text",
  Code: "Code",
  Web: "Web",
  Data: "Data",
  Time: "Time",
  Security: "Security",
  Color: "Color",
  SEO: "SEO",
  Network: "Network",
};

const localizedCategories: Record<Locale, Record<string, string>> = {
  en: categories,
  ko: { Text: "텍스트", Code: "코드", Web: "웹", Data: "데이터", Time: "시간", Security: "보안", Color: "색상", SEO: "SEO", Network: "네트워크" },
  ja: { Text: "テキスト", Code: "コード", Web: "Web", Data: "データ", Time: "時間", Security: "セキュリティ", Color: "色", SEO: "SEO", Network: "ネットワーク" },
  "zh-CN": { Text: "文本", Code: "代码", Web: "网页", Data: "数据", Time: "时间", Security: "安全", Color: "颜色", SEO: "SEO", Network: "网络" },
  "zh-TW": { Text: "文字", Code: "程式碼", Web: "網頁", Data: "資料", Time: "時間", Security: "安全", Color: "色彩", SEO: "SEO", Network: "網路" },
  es: { Text: "Texto", Code: "Codigo", Web: "Web", Data: "Datos", Time: "Tiempo", Security: "Seguridad", Color: "Color", SEO: "SEO", Network: "Red" },
  "pt-BR": { Text: "Texto", Code: "Codigo", Web: "Web", Data: "Dados", Time: "Tempo", Security: "Seguranca", Color: "Cor", SEO: "SEO", Network: "Rede" },
  de: { Text: "Text", Code: "Code", Web: "Web", Data: "Daten", Time: "Zeit", Security: "Sicherheit", Color: "Farbe", SEO: "SEO", Network: "Netzwerk" },
  fr: { Text: "Texte", Code: "Code", Web: "Web", Data: "Donnees", Time: "Temps", Security: "Securite", Color: "Couleur", SEO: "SEO", Network: "Reseau" },
  hi: { Text: "टेक्स्ट", Code: "कोड", Web: "वेब", Data: "डेटा", Time: "समय", Security: "सुरक्षा", Color: "रंग", SEO: "SEO", Network: "नेटवर्क" },
  id: { Text: "Teks", Code: "Kode", Web: "Web", Data: "Data", Time: "Waktu", Security: "Keamanan", Color: "Warna", SEO: "SEO", Network: "Jaringan" },
  vi: { Text: "Văn bản", Code: "Mã", Web: "Web", Data: "Dữ liệu", Time: "Thời gian", Security: "Bảo mật", Color: "Màu sắc", SEO: "SEO", Network: "Mạng" },
  th: { Text: "ข้อความ", Code: "โค้ด", Web: "เว็บ", Data: "ข้อมูล", Time: "เวลา", Security: "ความปลอดภัย", Color: "สี", SEO: "SEO", Network: "เครือข่าย" },
  ar: { Text: "النص", Code: "الكود", Web: "الويب", Data: "البيانات", Time: "الوقت", Security: "الأمان", Color: "الألوان", SEO: "SEO", Network: "الشبكة" },
};

const enToolUi = {
  mode: "Mode",
  output: "Output",
  transformError: "Transform error",
  copyReadyOutput: "Copy-ready output",
  input: "Input",
  generate: "Generate",
  count: "Count",
  pattern: "Pattern",
  flags: "Flags",
  sampleText: "Sample text",
  syntaxError: "Syntax error",
  cronExpression: "Cron expression",
  fiveFieldInterpretation: "Five-field interpretation",
  title: "Title",
  canonicalUrl: "Canonical URL",
  description: "Description",
  openGraphImage: "Open Graph image",
  generatedMetaTags: "Generated meta tags",
  url: "URL",
  viewport: "Viewport",
  enterValidUrl: "Enter a valid URL.",
  iframeMarkup: "Iframe markup",
  frameLoadingNote: "Frame loading note",
  paragraphs: "Paragraphs",
  sentencesPerParagraph: "Sentences per paragraph",
  placeholderText: "Placeholder text",
  jsonInput: "JSON input",
  indent: "Indent",
  formattedJson: "Formatted JSON",
  invalidJson: "Invalid JSON",
  header: "Header",
  payload: "Payload",
  decodeError: "Decode error",
  textOrUrlComponent: "Text or URL component",
  encode: "Encode",
  decode: "Decode",
  textOrBase64: "Text or Base64",
  encodeBase64: "Encode UTF-8 to Base64",
  decodeBase64: "Decode Base64 to UTF-8",
  timestampOrDate: "Timestamp or date",
  now: "Now",
  convertedDate: "Converted date",
  uuidValues: "UUID v4 values",
  hashes: "Hashes",
  originalText: "Original text",
  changedText: "Changed text",
  lineDiff: "Line diff",
  wordDiff: "Word diff",
  diffResult: "Diff result",
  conversionError: "Conversion error",
  convertedOutput: "Converted output",
  validationResult: "Validation result",
  pathResult: "Path result",
  text: "Text",
  textMetrics: "Text metrics",
  characters: "Characters",
  charactersNoSpaces: "Characters without spaces",
  words: "Words",
  lines: "Lines",
  estimatedReadingTime: "Estimated reading time",
  minutes: "minute(s)",
  ulidValues: "ULID values",
  xmlSitemap: "XML sitemap",
  openGraphTags: "Open Graph tags",
  imageUrl: "Image URL",
  generatedFavicon: "Generated favicon",
  faviconMarkup: "Favicon markup",
  timeZones: "Time zones",
  convertedCssUnits: "Converted CSS units",
  cssClamp: "CSS clamp",
  prettyPrint: "Pretty print",
  minify: "Minify",
  commonInput: "Common input",
  typicalOutput: "Typical output",
  check: "Check",
  checking: "Checking",
  lookup: "Lookup",
  extensionOrMimeType: "Extension or MIME type",
  noCommonMimeTypeFound: "No common MIME type found.",
  httpStatus: "HTTP status",
  dnsRecords: "DNS records",
  dnsLookupFailed: "DNS lookup failed.",
  download: "Download",
  openPng: "Open PNG",
  dataUrl: "Data URL",
  password: "Password",
  randomToken: "Random token",
  bytes: "Bytes",
  length: "Length",
  symbols: "Symbols",
  foreground: "Foreground",
  background: "Background",
  contrastRatio: "Contrast ratio",
  aaNormalText: "AA normal text",
  aaLargeText: "AA large text",
  belowAa: "Below AA",
  contrastPreviewText: "Preview text for contrast checking.",
  colorValues: "Color values",
};

const localizedToolUi: Record<Locale, Record<string, string>> = {
  en: enToolUi,
  ko: { mode: "모드", output: "출력", transformError: "변환 오류", copyReadyOutput: "복사 가능한 출력", input: "입력", generate: "생성", count: "개수", pattern: "패턴", flags: "플래그", sampleText: "샘플 텍스트", syntaxError: "문법 오류", cronExpression: "Cron 표현식", fiveFieldInterpretation: "5필드 해석", title: "제목", canonicalUrl: "Canonical URL", description: "설명", openGraphImage: "Open Graph 이미지", generatedMetaTags: "생성된 메타 태그", url: "URL", viewport: "뷰포트", enterValidUrl: "올바른 URL을 입력하세요.", iframeMarkup: "iframe 마크업", frameLoadingNote: "프레임 로딩 참고", paragraphs: "문단 수", sentencesPerParagraph: "문단당 문장 수", placeholderText: "플레이스홀더 텍스트", jsonInput: "JSON 입력", indent: "들여쓰기", formattedJson: "정리된 JSON", invalidJson: "잘못된 JSON", header: "헤더", payload: "페이로드", decodeError: "디코딩 오류", textOrUrlComponent: "텍스트 또는 URL 구성요소", encode: "인코딩", decode: "디코딩", textOrBase64: "텍스트 또는 Base64", encodeBase64: "UTF-8을 Base64로 인코딩", decodeBase64: "Base64를 UTF-8로 디코딩", timestampOrDate: "타임스탬프 또는 날짜", now: "현재", convertedDate: "변환된 날짜", uuidValues: "UUID v4 값", hashes: "해시", originalText: "원본 텍스트", changedText: "변경 텍스트", diffResult: "비교 결과", conversionError: "변환 오류", convertedOutput: "변환 결과", prettyPrint: "보기 좋게 정리", minify: "압축", commonInput: "일반 입력", typicalOutput: "일반 출력", check: "확인", checking: "확인 중", lookup: "조회", download: "다운로드", openPng: "PNG 열기", dataUrl: "데이터 URL", password: "비밀번호", randomToken: "랜덤 토큰", bytes: "바이트", length: "길이", symbols: "기호", foreground: "전경색", background: "배경색" },
  ja: { mode: "モード", output: "出力", transformError: "変換エラー", copyReadyOutput: "コピー用の出力", input: "入力", generate: "生成", count: "件数", pattern: "パターン", flags: "フラグ", sampleText: "サンプルテキスト", syntaxError: "構文エラー", cronExpression: "Cron式", fiveFieldInterpretation: "5フィールドの解釈", title: "タイトル", canonicalUrl: "Canonical URL", description: "説明", openGraphImage: "Open Graph画像", generatedMetaTags: "生成されたメタタグ", url: "URL", viewport: "ビューポート", enterValidUrl: "有効なURLを入力してください。", iframeMarkup: "iframeマークアップ", frameLoadingNote: "フレーム読み込みメモ", paragraphs: "段落数", sentencesPerParagraph: "段落ごとの文数", placeholderText: "プレースホルダーテキスト", jsonInput: "JSON入力", indent: "インデント", formattedJson: "整形済みJSON", invalidJson: "無効なJSON", header: "ヘッダー", payload: "ペイロード", decodeError: "デコードエラー", textOrUrlComponent: "テキストまたはURL部品", encode: "エンコード", decode: "デコード", textOrBase64: "テキストまたはBase64", encodeBase64: "UTF-8をBase64へエンコード", decodeBase64: "Base64をUTF-8へデコード", timestampOrDate: "タイムスタンプまたは日付", now: "現在", convertedDate: "変換後の日付", uuidValues: "UUID v4値", hashes: "ハッシュ", originalText: "元のテキスト", changedText: "変更後のテキスト", diffResult: "差分結果", conversionError: "変換エラー", convertedOutput: "変換結果", prettyPrint: "見やすく整形", minify: "圧縮", commonInput: "一般的な入力", typicalOutput: "一般的な出力", check: "確認", checking: "確認中", lookup: "検索", download: "ダウンロード", openPng: "PNGを開く", dataUrl: "データURL", password: "パスワード", randomToken: "ランダムトークン", bytes: "バイト", length: "長さ", symbols: "記号", foreground: "前景色", background: "背景色" },
  "zh-CN": { mode: "模式", output: "输出", transformError: "转换错误", copyReadyOutput: "可复制输出", input: "输入", generate: "生成", count: "数量", pattern: "模式", flags: "标志", sampleText: "示例文本", syntaxError: "语法错误", cronExpression: "Cron 表达式", fiveFieldInterpretation: "五字段解释", title: "标题", canonicalUrl: "Canonical URL", description: "描述", openGraphImage: "Open Graph 图片", generatedMetaTags: "生成的 Meta 标签", url: "URL", viewport: "视口", enterValidUrl: "请输入有效 URL。", iframeMarkup: "iframe 标记", frameLoadingNote: "框架加载说明", paragraphs: "段落数", sentencesPerParagraph: "每段句数", placeholderText: "占位文本", jsonInput: "JSON 输入", indent: "缩进", formattedJson: "格式化 JSON", invalidJson: "无效 JSON", header: "头部", payload: "载荷", decodeError: "解码错误", textOrUrlComponent: "文本或 URL 组件", encode: "编码", decode: "解码", textOrBase64: "文本或 Base64", encodeBase64: "将 UTF-8 编码为 Base64", decodeBase64: "将 Base64 解码为 UTF-8", timestampOrDate: "时间戳或日期", now: "当前", convertedDate: "转换后的日期", uuidValues: "UUID v4 值", hashes: "哈希", originalText: "原文本", changedText: "变更文本", diffResult: "差异结果", conversionError: "转换错误", convertedOutput: "转换结果", prettyPrint: "美化", minify: "压缩", commonInput: "常见输入", typicalOutput: "典型输出", check: "检查", checking: "检查中", lookup: "查询", download: "下载", openPng: "打开 PNG", dataUrl: "数据 URL", password: "密码", randomToken: "随机令牌", bytes: "字节", length: "长度", symbols: "符号", foreground: "前景色", background: "背景色" },
  "zh-TW": { mode: "模式", output: "輸出", transformError: "轉換錯誤", copyReadyOutput: "可複製輸出", input: "輸入", generate: "產生", count: "數量", pattern: "模式", flags: "旗標", sampleText: "範例文字", syntaxError: "語法錯誤", cronExpression: "Cron 表達式", fiveFieldInterpretation: "五欄位解讀", title: "標題", canonicalUrl: "Canonical URL", description: "描述", openGraphImage: "Open Graph 圖片", generatedMetaTags: "產生的 Meta 標籤", url: "URL", viewport: "視窗尺寸", enterValidUrl: "請輸入有效 URL。", iframeMarkup: "iframe 標記", frameLoadingNote: "框架載入說明", paragraphs: "段落數", sentencesPerParagraph: "每段句數", placeholderText: "佔位文字", jsonInput: "JSON 輸入", indent: "縮排", formattedJson: "格式化 JSON", invalidJson: "無效 JSON", header: "標頭", payload: "酬載", decodeError: "解碼錯誤", textOrUrlComponent: "文字或 URL 元件", encode: "編碼", decode: "解碼", textOrBase64: "文字或 Base64", encodeBase64: "將 UTF-8 編碼為 Base64", decodeBase64: "將 Base64 解碼為 UTF-8", timestampOrDate: "時間戳或日期", now: "現在", convertedDate: "轉換後日期", uuidValues: "UUID v4 值", hashes: "雜湊", originalText: "原始文字", changedText: "變更文字", diffResult: "差異結果", conversionError: "轉換錯誤", convertedOutput: "轉換結果", prettyPrint: "美化", minify: "壓縮", commonInput: "常見輸入", typicalOutput: "典型輸出", check: "檢查", checking: "檢查中", lookup: "查詢", download: "下載", openPng: "開啟 PNG", dataUrl: "資料 URL", password: "密碼", randomToken: "隨機權杖", bytes: "位元組", length: "長度", symbols: "符號", foreground: "前景色", background: "背景色" },
  es: { mode: "Modo", output: "Salida", transformError: "Error de conversion", copyReadyOutput: "Salida lista para copiar", input: "Entrada", generate: "Generar", count: "Cantidad", pattern: "Patron", flags: "Flags", sampleText: "Texto de ejemplo", syntaxError: "Error de sintaxis", cronExpression: "Expresion cron", fiveFieldInterpretation: "Interpretacion de cinco campos", title: "Titulo", canonicalUrl: "URL canonica", description: "Descripcion", openGraphImage: "Imagen Open Graph", generatedMetaTags: "Meta tags generados", url: "URL", viewport: "Viewport", enterValidUrl: "Introduce una URL valida.", iframeMarkup: "Marcado iframe", frameLoadingNote: "Nota de carga del frame", paragraphs: "Parrafos", sentencesPerParagraph: "Frases por parrafo", placeholderText: "Texto de relleno", jsonInput: "Entrada JSON", indent: "Indentacion", formattedJson: "JSON formateado", invalidJson: "JSON invalido", header: "Cabecera", payload: "Payload", decodeError: "Error de decodificacion", textOrUrlComponent: "Texto o componente URL", encode: "Codificar", decode: "Decodificar", textOrBase64: "Texto o Base64", encodeBase64: "Codificar UTF-8 a Base64", decodeBase64: "Decodificar Base64 a UTF-8", timestampOrDate: "Timestamp o fecha", now: "Ahora", convertedDate: "Fecha convertida", uuidValues: "Valores UUID v4", hashes: "Hashes", originalText: "Texto original", changedText: "Texto cambiado", diffResult: "Resultado diff", conversionError: "Error de conversion", convertedOutput: "Salida convertida", prettyPrint: "Formatear", minify: "Minificar", commonInput: "Entrada comun", typicalOutput: "Salida tipica", check: "Comprobar", checking: "Comprobando", lookup: "Consultar", download: "Descargar", openPng: "Abrir PNG", dataUrl: "URL de datos", password: "Contrasena", randomToken: "Token aleatorio", bytes: "Bytes", length: "Longitud", symbols: "Simbolos", foreground: "Primer plano", background: "Fondo" },
  "pt-BR": { mode: "Modo", output: "Saida", transformError: "Erro de conversao", copyReadyOutput: "Saida pronta para copiar", input: "Entrada", generate: "Gerar", count: "Quantidade", pattern: "Padrao", flags: "Flags", sampleText: "Texto de exemplo", syntaxError: "Erro de sintaxe", cronExpression: "Expressao cron", fiveFieldInterpretation: "Interpretacao de cinco campos", title: "Titulo", canonicalUrl: "URL canonica", description: "Descricao", openGraphImage: "Imagem Open Graph", generatedMetaTags: "Meta tags geradas", url: "URL", viewport: "Viewport", enterValidUrl: "Informe uma URL valida.", iframeMarkup: "Marcacao iframe", frameLoadingNote: "Nota de carregamento do frame", paragraphs: "Paragrafos", sentencesPerParagraph: "Frases por paragrafo", placeholderText: "Texto de placeholder", jsonInput: "Entrada JSON", indent: "Indentacao", formattedJson: "JSON formatado", invalidJson: "JSON invalido", header: "Cabecalho", payload: "Payload", decodeError: "Erro de decodificacao", textOrUrlComponent: "Texto ou componente URL", encode: "Codificar", decode: "Decodificar", textOrBase64: "Texto ou Base64", encodeBase64: "Codificar UTF-8 para Base64", decodeBase64: "Decodificar Base64 para UTF-8", timestampOrDate: "Timestamp ou data", now: "Agora", convertedDate: "Data convertida", uuidValues: "Valores UUID v4", hashes: "Hashes", originalText: "Texto original", changedText: "Texto alterado", diffResult: "Resultado diff", conversionError: "Erro de conversao", convertedOutput: "Saida convertida", prettyPrint: "Formatar", minify: "Minificar", commonInput: "Entrada comum", typicalOutput: "Saida tipica", check: "Verificar", checking: "Verificando", lookup: "Consultar", download: "Baixar", openPng: "Abrir PNG", dataUrl: "URL de dados", password: "Senha", randomToken: "Token aleatorio", bytes: "Bytes", length: "Comprimento", symbols: "Simbolos", foreground: "Primeiro plano", background: "Fundo" },
  de: { mode: "Modus", output: "Ausgabe", transformError: "Umwandlungsfehler", copyReadyOutput: "Kopierfertige Ausgabe", input: "Eingabe", generate: "Erzeugen", count: "Anzahl", pattern: "Muster", flags: "Flags", sampleText: "Beispieltext", syntaxError: "Syntaxfehler", cronExpression: "Cron-Ausdruck", fiveFieldInterpretation: "Fuenf-Feld-Auswertung", title: "Titel", canonicalUrl: "Kanonische URL", description: "Beschreibung", openGraphImage: "Open-Graph-Bild", generatedMetaTags: "Erzeugte Meta-Tags", url: "URL", viewport: "Viewport", enterValidUrl: "Gib eine gueltige URL ein.", iframeMarkup: "iframe-Markup", frameLoadingNote: "Hinweis zum Frame-Laden", paragraphs: "Absaetze", sentencesPerParagraph: "Saetze pro Absatz", placeholderText: "Platzhaltertext", jsonInput: "JSON-Eingabe", indent: "Einrueckung", formattedJson: "Formatiertes JSON", invalidJson: "Ungueltiges JSON", header: "Header", payload: "Payload", decodeError: "Decodierungsfehler", textOrUrlComponent: "Text oder URL-Komponente", encode: "Encodieren", decode: "Decodieren", textOrBase64: "Text oder Base64", encodeBase64: "UTF-8 in Base64 encodieren", decodeBase64: "Base64 nach UTF-8 decodieren", timestampOrDate: "Timestamp oder Datum", now: "Jetzt", convertedDate: "Konvertiertes Datum", uuidValues: "UUID-v4-Werte", hashes: "Hashes", originalText: "Originaltext", changedText: "Geaenderter Text", diffResult: "Diff-Ergebnis", conversionError: "Konvertierungsfehler", convertedOutput: "Konvertierte Ausgabe", prettyPrint: "Formatieren", minify: "Minifizieren", commonInput: "Typische Eingabe", typicalOutput: "Typische Ausgabe", check: "Pruefen", checking: "Prueft", lookup: "Nachschlagen", download: "Download", openPng: "PNG oeffnen", dataUrl: "Daten-URL", password: "Passwort", randomToken: "Zufallstoken", bytes: "Bytes", length: "Laenge", symbols: "Symbole", foreground: "Vordergrund", background: "Hintergrund" },
  fr: { mode: "Mode", output: "Sortie", transformError: "Erreur de transformation", copyReadyOutput: "Sortie prete a copier", input: "Entree", generate: "Generer", count: "Nombre", pattern: "Motif", flags: "Flags", sampleText: "Texte exemple", syntaxError: "Erreur de syntaxe", cronExpression: "Expression cron", fiveFieldInterpretation: "Interpretation a cinq champs", title: "Titre", canonicalUrl: "URL canonique", description: "Description", openGraphImage: "Image Open Graph", generatedMetaTags: "Meta tags generes", url: "URL", viewport: "Viewport", enterValidUrl: "Saisissez une URL valide.", iframeMarkup: "Markup iframe", frameLoadingNote: "Note de chargement du frame", paragraphs: "Paragraphes", sentencesPerParagraph: "Phrases par paragraphe", placeholderText: "Texte de remplissage", jsonInput: "Entree JSON", indent: "Indentation", formattedJson: "JSON formate", invalidJson: "JSON invalide", header: "En-tete", payload: "Payload", decodeError: "Erreur de decodage", textOrUrlComponent: "Texte ou composant URL", encode: "Encoder", decode: "Decoder", textOrBase64: "Texte ou Base64", encodeBase64: "Encoder UTF-8 en Base64", decodeBase64: "Decoder Base64 en UTF-8", timestampOrDate: "Timestamp ou date", now: "Maintenant", convertedDate: "Date convertie", uuidValues: "Valeurs UUID v4", hashes: "Hashes", originalText: "Texte original", changedText: "Texte modifie", diffResult: "Resultat diff", conversionError: "Erreur de conversion", convertedOutput: "Sortie convertie", prettyPrint: "Formater", minify: "Minifier", commonInput: "Entree courante", typicalOutput: "Sortie typique", check: "Verifier", checking: "Verification", lookup: "Rechercher", download: "Telecharger", openPng: "Ouvrir PNG", dataUrl: "URL de donnees", password: "Mot de passe", randomToken: "Token aleatoire", bytes: "Octets", length: "Longueur", symbols: "Symboles", foreground: "Premier plan", background: "Arriere-plan" },
  hi: { mode: "मोड", output: "नतीजा", transformError: "बदलाव त्रुटि", copyReadyOutput: "कॉपी के लिए तैयार नतीजा", input: "इनपुट", generate: "बनाएं", count: "गिनती", pattern: "पैटर्न", flags: "फ्लैग", sampleText: "नमूना टेक्स्ट", syntaxError: "सिंटैक्स त्रुटि", cronExpression: "Cron expression", fiveFieldInterpretation: "पांच-field व्याख्या", title: "शीर्षक", canonicalUrl: "Canonical URL", description: "विवरण", openGraphImage: "Open Graph image", generatedMetaTags: "बने हुए meta tags", url: "URL", viewport: "Viewport", enterValidUrl: "मान्य URL डालें.", iframeMarkup: "iframe markup", frameLoadingNote: "फ्रेम लोडिंग नोट", paragraphs: "पैराग्राफ", sentencesPerParagraph: "प्रति पैराग्राफ वाक्य", placeholderText: "Placeholder text", jsonInput: "JSON इनपुट", indent: "इंडेंट", formattedJson: "फॉर्मैट किया JSON", invalidJson: "अमान्य JSON", header: "Header", payload: "Payload", decodeError: "Decode त्रुटि", textOrUrlComponent: "टेक्स्ट या URL component", encode: "Encode", decode: "Decode", textOrBase64: "टेक्स्ट या Base64", encodeBase64: "UTF-8 को Base64 में encode", decodeBase64: "Base64 को UTF-8 में decode", timestampOrDate: "Timestamp या तारीख", now: "अभी", convertedDate: "बदली हुई तारीख", uuidValues: "UUID v4 मान", hashes: "Hashes", originalText: "मूल टेक्स्ट", changedText: "बदला टेक्स्ट", diffResult: "Diff नतीजा", conversionError: "Conversion त्रुटि", convertedOutput: "बदला हुआ नतीजा", prettyPrint: "साफ फॉर्मैट", minify: "छोटा करें", commonInput: "आम इनपुट", typicalOutput: "आम नतीजा", check: "जांचें", checking: "जांच हो रही है", lookup: "खोजें", download: "डाउनलोड", openPng: "PNG खोलें", dataUrl: "Data URL", password: "पासवर्ड", randomToken: "रैंडम टोकन", bytes: "बाइट", length: "लंबाई", symbols: "चिह्न", foreground: "अग्रभूमि", background: "पृष्ठभूमि" },
  id: { mode: "Mode", output: "Hasil", transformError: "Error transformasi", copyReadyOutput: "Hasil siap disalin", input: "Masukan", generate: "Buat", count: "Jumlah", pattern: "Pola", flags: "Flags", sampleText: "Teks contoh", syntaxError: "Error sintaks", cronExpression: "Ekspresi cron", fiveFieldInterpretation: "Interpretasi lima field", title: "Judul", canonicalUrl: "URL kanonis", description: "Deskripsi", openGraphImage: "Gambar Open Graph", generatedMetaTags: "Meta tag dibuat", url: "URL", viewport: "Viewport", enterValidUrl: "Masukkan URL valid.", iframeMarkup: "Markup iframe", frameLoadingNote: "Catatan pemuatan frame", paragraphs: "Paragraf", sentencesPerParagraph: "Kalimat per paragraf", placeholderText: "Teks placeholder", jsonInput: "Masukan JSON", indent: "Indentasi", formattedJson: "JSON terformat", invalidJson: "JSON tidak valid", header: "Header", payload: "Payload", decodeError: "Error decode", textOrUrlComponent: "Teks atau komponen URL", encode: "Encode", decode: "Decode", textOrBase64: "Teks atau Base64", encodeBase64: "Encode UTF-8 ke Base64", decodeBase64: "Decode Base64 ke UTF-8", timestampOrDate: "Timestamp atau tanggal", now: "Sekarang", convertedDate: "Tanggal dikonversi", uuidValues: "Nilai UUID v4", hashes: "Hash", originalText: "Teks asli", changedText: "Teks berubah", diffResult: "Hasil diff", conversionError: "Error konversi", convertedOutput: "Hasil konversi", prettyPrint: "Rapikan", minify: "Minify", commonInput: "Masukan umum", typicalOutput: "Hasil umum", check: "Cek", checking: "Mengecek", lookup: "Cari", download: "Unduh", openPng: "Buka PNG", dataUrl: "Data URL", password: "Password", randomToken: "Token acak", bytes: "Byte", length: "Panjang", symbols: "Simbol", foreground: "Foreground", background: "Background" },
  vi: { mode: "Chế độ", output: "Kết quả", transformError: "Lỗi chuyển đổi", copyReadyOutput: "Kết quả sẵn sàng sao chép", input: "Nhập", generate: "Tạo", count: "Số lượng", pattern: "Mẫu", flags: "Flags", sampleText: "Văn bản mẫu", syntaxError: "Lỗi cú pháp", cronExpression: "Biểu thức cron", fiveFieldInterpretation: "Giải thích năm trường", title: "Tiêu đề", canonicalUrl: "URL chuẩn", description: "Mô tả", openGraphImage: "Ảnh Open Graph", generatedMetaTags: "Meta tag đã tạo", url: "URL", viewport: "Viewport", enterValidUrl: "Nhập URL hợp lệ.", iframeMarkup: "Mã iframe", frameLoadingNote: "Ghi chú tải frame", paragraphs: "Đoạn", sentencesPerParagraph: "Câu mỗi đoạn", placeholderText: "Văn bản giữ chỗ", jsonInput: "Nhập JSON", indent: "Thụt lề", formattedJson: "JSON đã định dạng", invalidJson: "JSON không hợp lệ", header: "Header", payload: "Payload", decodeError: "Lỗi giải mã", textOrUrlComponent: "Văn bản hoặc thành phần URL", encode: "Mã hóa", decode: "Giải mã", textOrBase64: "Văn bản hoặc Base64", encodeBase64: "Mã hóa UTF-8 sang Base64", decodeBase64: "Giải mã Base64 sang UTF-8", timestampOrDate: "Timestamp hoặc ngày", now: "Hiện tại", convertedDate: "Ngày đã chuyển đổi", uuidValues: "Giá trị UUID v4", hashes: "Hash", originalText: "Văn bản gốc", changedText: "Văn bản thay đổi", diffResult: "Kết quả diff", conversionError: "Lỗi chuyển đổi", convertedOutput: "Kết quả chuyển đổi", prettyPrint: "Định dạng đẹp", minify: "Nén", commonInput: "Đầu vào thường gặp", typicalOutput: "Đầu ra thường gặp", check: "Kiểm tra", checking: "Đang kiểm tra", lookup: "Tra cứu", download: "Tải xuống", openPng: "Mở PNG", dataUrl: "Data URL", password: "Mật khẩu", randomToken: "Token ngẫu nhiên", bytes: "Byte", length: "Độ dài", symbols: "Ký tự đặc biệt", foreground: "Màu chữ", background: "Nền" },
  th: { mode: "โหมด", output: "ผลลัพธ์", transformError: "ข้อผิดพลาดในการแปลง", copyReadyOutput: "ผลลัพธ์พร้อมคัดลอก", input: "อินพุต", generate: "สร้าง", count: "จำนวน", pattern: "แพตเทิร์น", flags: "แฟล็ก", sampleText: "ข้อความตัวอย่าง", syntaxError: "ข้อผิดพลาดไวยากรณ์", cronExpression: "นิพจน์ cron", fiveFieldInterpretation: "คำอธิบายห้าช่อง", title: "ชื่อ", canonicalUrl: "Canonical URL", description: "คำอธิบาย", openGraphImage: "รูป Open Graph", generatedMetaTags: "เมตาแท็กที่สร้าง", url: "URL", viewport: "วิวพอร์ต", enterValidUrl: "ป้อน URL ที่ถูกต้อง", iframeMarkup: "มาร์กอัป iframe", frameLoadingNote: "หมายเหตุการโหลดเฟรม", paragraphs: "ย่อหน้า", sentencesPerParagraph: "ประโยคต่อย่อหน้า", placeholderText: "ข้อความตัวอย่าง", jsonInput: "อินพุต JSON", indent: "ย่อหน้า", formattedJson: "JSON ที่จัดรูปแบบ", invalidJson: "JSON ไม่ถูกต้อง", header: "เฮดเดอร์", payload: "เพย์โหลด", decodeError: "ข้อผิดพลาดการถอดรหัส", textOrUrlComponent: "ข้อความหรือส่วน URL", encode: "เข้ารหัส", decode: "ถอดรหัส", textOrBase64: "ข้อความหรือ Base64", encodeBase64: "เข้ารหัส UTF-8 เป็น Base64", decodeBase64: "ถอดรหัส Base64 เป็น UTF-8", timestampOrDate: "เวลา Unix หรือวันที่", now: "ตอนนี้", convertedDate: "วันที่ที่แปลงแล้ว", uuidValues: "ค่า UUID v4", hashes: "แฮช", originalText: "ข้อความเดิม", changedText: "ข้อความที่เปลี่ยน", diffResult: "ผลต่าง", conversionError: "ข้อผิดพลาดการแปลง", convertedOutput: "ผลลัพธ์ที่แปลง", prettyPrint: "จัดรูปแบบ", minify: "ย่อ", commonInput: "อินพุตทั่วไป", typicalOutput: "ผลลัพธ์ทั่วไป", check: "ตรวจสอบ", checking: "กำลังตรวจสอบ", lookup: "ค้นหา", download: "ดาวน์โหลด", openPng: "เปิด PNG", dataUrl: "Data URL", password: "รหัสผ่าน", randomToken: "โทเค็นสุ่ม", bytes: "ไบต์", length: "ความยาว", symbols: "สัญลักษณ์", foreground: "สีหน้า", background: "สีพื้น" },
  ar: { mode: "الوضع", output: "الناتج", transformError: "خطأ في التحويل", copyReadyOutput: "ناتج جاهز للنسخ", input: "الإدخال", generate: "إنشاء", count: "العدد", pattern: "النمط", flags: "الخيارات", sampleText: "نص تجريبي", syntaxError: "خطأ في الصياغة", cronExpression: "تعبير Cron", fiveFieldInterpretation: "شرح الحقول الخمسة", title: "العنوان", canonicalUrl: "الرابط الأساسي", description: "الوصف", openGraphImage: "صورة Open Graph", generatedMetaTags: "وسوم meta المنشأة", url: "URL", viewport: "إطار العرض", enterValidUrl: "أدخل URL صالحا.", iframeMarkup: "وسم iframe", frameLoadingNote: "ملاحظة تحميل الإطار", paragraphs: "الفقرات", sentencesPerParagraph: "الجمل لكل فقرة", placeholderText: "نص مؤقت", jsonInput: "إدخال JSON", indent: "المسافة البادئة", formattedJson: "JSON منسق", invalidJson: "JSON غير صالح", header: "الرأس", payload: "الحمولة", decodeError: "خطأ فك الترميز", textOrUrlComponent: "نص أو جزء URL", encode: "ترميز", decode: "فك الترميز", textOrBase64: "نص أو Base64", encodeBase64: "ترميز UTF-8 إلى Base64", decodeBase64: "فك Base64 إلى UTF-8", timestampOrDate: "طابع زمني أو تاريخ", now: "الآن", convertedDate: "التاريخ المحول", uuidValues: "قيم UUID v4", hashes: "الهاش", originalText: "النص الأصلي", changedText: "النص المعدل", diffResult: "نتيجة الفرق", conversionError: "خطأ التحويل", convertedOutput: "الناتج المحول", prettyPrint: "تنسيق واضح", minify: "تصغير", commonInput: "إدخال شائع", typicalOutput: "ناتج شائع", check: "فحص", checking: "جار الفحص", lookup: "بحث", download: "تنزيل", openPng: "فتح PNG", dataUrl: "Data URL", password: "كلمة المرور", randomToken: "رمز عشوائي", bytes: "بايت", length: "الطول", symbols: "رموز", foreground: "المقدمة", background: "الخلفية" },
};

const localizedToolUiSupplement: Record<Locale, Record<string, string>> = {
  en: {},
  ko: { extensionOrMimeType: "확장자 또는 MIME 타입", noCommonMimeTypeFound: "일반적인 MIME 타입을 찾지 못했습니다.", httpStatus: "HTTP 상태", dnsRecords: "DNS 레코드", dnsLookupFailed: "DNS 조회에 실패했습니다.", contrastRatio: "대비율", aaNormalText: "AA 일반 텍스트", aaLargeText: "AA 큰 텍스트", belowAa: "AA 미달", contrastPreviewText: "대비 확인용 미리보기 텍스트.", colorValues: "색상 값" },
  ja: { extensionOrMimeType: "拡張子または MIME タイプ", noCommonMimeTypeFound: "一般的な MIME タイプが見つかりません。", httpStatus: "HTTP ステータス", dnsRecords: "DNS レコード", dnsLookupFailed: "DNS ルックアップに失敗しました。", contrastRatio: "コントラスト比", aaNormalText: "AA 通常テキスト", aaLargeText: "AA 大きいテキスト", belowAa: "AA 未満", contrastPreviewText: "コントラスト確認用のプレビューテキストです。", colorValues: "色の値" },
  "zh-CN": { extensionOrMimeType: "扩展名或 MIME 类型", noCommonMimeTypeFound: "未找到常见 MIME 类型。", httpStatus: "HTTP 状态", dnsRecords: "DNS 记录", dnsLookupFailed: "DNS 查询失败。", contrastRatio: "对比度", aaNormalText: "AA 正常文本", aaLargeText: "AA 大文本", belowAa: "低于 AA", contrastPreviewText: "用于检查对比度的预览文本。", colorValues: "颜色值" },
  "zh-TW": { extensionOrMimeType: "副檔名或 MIME 類型", noCommonMimeTypeFound: "找不到常見 MIME 類型。", httpStatus: "HTTP 狀態", dnsRecords: "DNS 記錄", dnsLookupFailed: "DNS 查詢失敗。", contrastRatio: "對比度", aaNormalText: "AA 一般文字", aaLargeText: "AA 大型文字", belowAa: "低於 AA", contrastPreviewText: "用於檢查對比度的預覽文字。", colorValues: "色彩值" },
  es: { extensionOrMimeType: "Extension o tipo MIME", noCommonMimeTypeFound: "No se encontro un tipo MIME comun.", httpStatus: "Estado HTTP", dnsRecords: "Registros DNS", dnsLookupFailed: "Fallo la consulta DNS.", contrastRatio: "Relacion de contraste", aaNormalText: "Texto normal AA", aaLargeText: "Texto grande AA", belowAa: "Por debajo de AA", contrastPreviewText: "Texto de vista previa para comprobar contraste.", colorValues: "Valores de color" },
  "pt-BR": { extensionOrMimeType: "Extensao ou tipo MIME", noCommonMimeTypeFound: "Nenhum tipo MIME comum encontrado.", httpStatus: "Status HTTP", dnsRecords: "Registros DNS", dnsLookupFailed: "Falha na consulta DNS.", contrastRatio: "Razao de contraste", aaNormalText: "Texto normal AA", aaLargeText: "Texto grande AA", belowAa: "Abaixo de AA", contrastPreviewText: "Texto de preview para checar contraste.", colorValues: "Valores de cor" },
  de: { extensionOrMimeType: "Erweiterung oder MIME-Typ", noCommonMimeTypeFound: "Kein gaengiger MIME-Typ gefunden.", httpStatus: "HTTP-Status", dnsRecords: "DNS-Eintraege", dnsLookupFailed: "DNS-Abfrage fehlgeschlagen.", contrastRatio: "Kontrastverhaeltnis", aaNormalText: "AA normaler Text", aaLargeText: "AA grosser Text", belowAa: "Unter AA", contrastPreviewText: "Vorschautext zur Kontrastpruefung.", colorValues: "Farbwerte" },
  fr: { extensionOrMimeType: "Extension ou type MIME", noCommonMimeTypeFound: "Aucun type MIME courant trouve.", httpStatus: "Statut HTTP", dnsRecords: "Enregistrements DNS", dnsLookupFailed: "Echec de la requete DNS.", contrastRatio: "Ratio de contraste", aaNormalText: "Texte normal AA", aaLargeText: "Grand texte AA", belowAa: "Sous AA", contrastPreviewText: "Texte de previsualisation pour verifier le contraste.", colorValues: "Valeurs de couleur" },
  hi: { extensionOrMimeType: "Extension या MIME type", noCommonMimeTypeFound: "आम MIME type नहीं मिला.", httpStatus: "HTTP स्थिति", dnsRecords: "DNS records", dnsLookupFailed: "DNS lookup विफल हुआ.", contrastRatio: "कॉन्ट्रास्ट अनुपात", aaNormalText: "AA सामान्य टेक्स्ट", aaLargeText: "AA बड़ा टेक्स्ट", belowAa: "AA से कम", contrastPreviewText: "कॉन्ट्रास्ट जांचने के लिए पूर्वावलोकन टेक्स्ट.", colorValues: "रंग मान" },
  id: { extensionOrMimeType: "Ekstensi atau tipe MIME", noCommonMimeTypeFound: "Tipe MIME umum tidak ditemukan.", httpStatus: "Status HTTP", dnsRecords: "Record DNS", dnsLookupFailed: "Lookup DNS gagal.", contrastRatio: "Rasio kontras", aaNormalText: "Teks normal AA", aaLargeText: "Teks besar AA", belowAa: "Di bawah AA", contrastPreviewText: "Teks pratinjau untuk mengecek kontras.", colorValues: "Nilai warna", foreground: "Warna depan", background: "Latar" },
  vi: { extensionOrMimeType: "Phần mở rộng hoặc MIME type", noCommonMimeTypeFound: "Không tìm thấy MIME type phổ biến.", httpStatus: "Trạng thái HTTP", dnsRecords: "Bản ghi DNS", dnsLookupFailed: "Tra cứu DNS thất bại.", contrastRatio: "Tỷ lệ tương phản", aaNormalText: "Văn bản thường AA", aaLargeText: "Văn bản lớn AA", belowAa: "Dưới AA", contrastPreviewText: "Văn bản xem trước để kiểm tra tương phản.", colorValues: "Giá trị màu" },
  th: { extensionOrMimeType: "นามสกุลหรือ MIME type", noCommonMimeTypeFound: "ไม่พบ MIME type ทั่วไป", httpStatus: "สถานะ HTTP", dnsRecords: "ระเบียน DNS", dnsLookupFailed: "ค้นหา DNS ไม่สำเร็จ", contrastRatio: "อัตราส่วน contrast", aaNormalText: "ข้อความปกติ AA", aaLargeText: "ข้อความขนาดใหญ่ AA", belowAa: "ต่ำกว่า AA", contrastPreviewText: "ข้อความพรีวิวสำหรับตรวจ contrast", colorValues: "ค่าสี" },
  ar: { extensionOrMimeType: "امتداد أو نوع MIME", noCommonMimeTypeFound: "لم يتم العثور على نوع MIME شائع.", httpStatus: "حالة HTTP", dnsRecords: "سجلات DNS", dnsLookupFailed: "فشل بحث DNS.", contrastRatio: "نسبة التباين", aaNormalText: "نص عادي AA", aaLargeText: "نص كبير AA", belowAa: "أقل من AA", contrastPreviewText: "نص معاينة لفحص التباين.", colorValues: "قيم الألوان" },
};

const localizedResultToolUi: Record<Locale, Record<string, string>> = {
  en: {},
  ko: { lineDiff: "줄 단위 비교", wordDiff: "단어 단위 비교", validationResult: "검증 결과", pathResult: "경로 결과", text: "텍스트", textMetrics: "텍스트 지표", characters: "문자", charactersNoSpaces: "공백 제외 문자", words: "단어", lines: "줄", estimatedReadingTime: "예상 읽기 시간", minutes: "분", ulidValues: "ULID 값", xmlSitemap: "XML 사이트맵", openGraphTags: "Open Graph 태그", imageUrl: "이미지 URL", generatedFavicon: "생성된 favicon", faviconMarkup: "Favicon 마크업", timeZones: "시간대", convertedCssUnits: "변환된 CSS 단위", cssClamp: "CSS clamp" },
  ja: { lineDiff: "行ごとの差分", wordDiff: "単語ごとの差分", validationResult: "検証結果", pathResult: "パス結果", text: "テキスト", textMetrics: "テキスト指標", characters: "文字数", charactersNoSpaces: "空白を除く文字数", words: "単語数", lines: "行数", estimatedReadingTime: "推定読了時間", minutes: "分", ulidValues: "ULID 値", xmlSitemap: "XML サイトマップ", openGraphTags: "Open Graph タグ", imageUrl: "画像 URL", generatedFavicon: "生成された favicon", faviconMarkup: "Favicon マークアップ", timeZones: "タイムゾーン", convertedCssUnits: "変換済み CSS 単位", cssClamp: "CSS clamp" },
  "zh-CN": { lineDiff: "按行比较", wordDiff: "按词比较", validationResult: "验证结果", pathResult: "路径结果", text: "文本", textMetrics: "文本指标", characters: "字符", charactersNoSpaces: "不含空格字符", words: "单词", lines: "行数", estimatedReadingTime: "预计阅读时间", minutes: "分钟", ulidValues: "ULID 值", xmlSitemap: "XML 站点地图", openGraphTags: "Open Graph 标签", imageUrl: "图片 URL", generatedFavicon: "生成的 favicon", faviconMarkup: "Favicon 标记", timeZones: "时区", convertedCssUnits: "已转换 CSS 单位", cssClamp: "CSS clamp" },
  "zh-TW": { lineDiff: "依行比較", wordDiff: "依單字比較", validationResult: "驗證結果", pathResult: "路徑結果", text: "文字", textMetrics: "文字指標", characters: "字元", charactersNoSpaces: "不含空白字元", words: "單字", lines: "行數", estimatedReadingTime: "預估閱讀時間", minutes: "分鐘", ulidValues: "ULID 值", xmlSitemap: "XML 網站地圖", openGraphTags: "Open Graph 標籤", imageUrl: "圖片 URL", generatedFavicon: "產生的 favicon", faviconMarkup: "Favicon 標記", timeZones: "時區", convertedCssUnits: "已轉換 CSS 單位", cssClamp: "CSS clamp" },
  es: { lineDiff: "Diff por lineas", wordDiff: "Diff por palabras", validationResult: "Resultado de validacion", pathResult: "Resultado de ruta", text: "Texto", textMetrics: "Metricas de texto", characters: "Caracteres", charactersNoSpaces: "Caracteres sin espacios", words: "Palabras", lines: "Lineas", estimatedReadingTime: "Tiempo estimado de lectura", minutes: "minuto(s)", ulidValues: "Valores ULID", xmlSitemap: "Sitemap XML", openGraphTags: "Tags Open Graph", imageUrl: "URL de imagen", generatedFavicon: "Favicon generado", faviconMarkup: "Markup de favicon", timeZones: "Zonas horarias", convertedCssUnits: "Unidades CSS convertidas", cssClamp: "CSS clamp" },
  "pt-BR": { lineDiff: "Diff por linhas", wordDiff: "Diff por palavras", validationResult: "Resultado de validacao", pathResult: "Resultado do caminho", text: "Texto", textMetrics: "Metricas de texto", characters: "Caracteres", charactersNoSpaces: "Caracteres sem espacos", words: "Palavras", lines: "Linhas", estimatedReadingTime: "Tempo estimado de leitura", minutes: "minuto(s)", ulidValues: "Valores ULID", xmlSitemap: "Sitemap XML", openGraphTags: "Tags Open Graph", imageUrl: "URL da imagem", generatedFavicon: "Favicon gerado", faviconMarkup: "Markup do favicon", timeZones: "Fusos horarios", convertedCssUnits: "Unidades CSS convertidas", cssClamp: "CSS clamp" },
  de: { lineDiff: "Zeilen-Diff", wordDiff: "Wort-Diff", validationResult: "Validierungsergebnis", pathResult: "Pfadergebnis", text: "Text", textMetrics: "Textmetriken", characters: "Zeichen", charactersNoSpaces: "Zeichen ohne Leerzeichen", words: "Woerter", lines: "Zeilen", estimatedReadingTime: "Geschaetzte Lesezeit", minutes: "Minute(n)", ulidValues: "ULID-Werte", xmlSitemap: "XML-Sitemap", openGraphTags: "Open-Graph-Tags", imageUrl: "Bild-URL", generatedFavicon: "Erzeugtes favicon", faviconMarkup: "Favicon-Markup", timeZones: "Zeitzonen", convertedCssUnits: "Konvertierte CSS-Einheiten", cssClamp: "CSS clamp" },
  fr: { lineDiff: "Diff par ligne", wordDiff: "Diff par mot", validationResult: "Resultat de validation", pathResult: "Resultat du chemin", text: "Texte", textMetrics: "Metriques du texte", characters: "Caracteres", charactersNoSpaces: "Caracteres sans espaces", words: "Mots", lines: "Lignes", estimatedReadingTime: "Temps de lecture estime", minutes: "minute(s)", ulidValues: "Valeurs ULID", xmlSitemap: "Sitemap XML", openGraphTags: "Tags Open Graph", imageUrl: "URL d'image", generatedFavicon: "Favicon genere", faviconMarkup: "Markup favicon", timeZones: "Fuseaux horaires", convertedCssUnits: "Unites CSS converties", cssClamp: "CSS clamp" },
  hi: { lineDiff: "पंक्ति diff", wordDiff: "शब्द diff", validationResult: "Validation नतीजा", pathResult: "Path नतीजा", text: "टेक्स्ट", textMetrics: "टेक्स्ट माप", characters: "अक्षर", charactersNoSpaces: "बिना space अक्षर", words: "शब्द", lines: "पंक्तियां", estimatedReadingTime: "अनुमानित पढ़ने का समय", minutes: "मिनट", ulidValues: "ULID मान", xmlSitemap: "XML sitemap", openGraphTags: "Open Graph tags", imageUrl: "Image URL", generatedFavicon: "बना हुआ favicon", faviconMarkup: "Favicon markup", timeZones: "समय क्षेत्र", convertedCssUnits: "बदली हुई CSS units", cssClamp: "CSS clamp" },
  id: { lineDiff: "Diff baris", wordDiff: "Diff kata", validationResult: "Hasil validasi", pathResult: "Hasil path", text: "Teks", textMetrics: "Metrik teks", characters: "Karakter", charactersNoSpaces: "Karakter tanpa spasi", words: "Kata", lines: "Baris", estimatedReadingTime: "Perkiraan waktu baca", minutes: "menit", ulidValues: "Nilai ULID", xmlSitemap: "Sitemap XML", openGraphTags: "Tag Open Graph", imageUrl: "URL gambar", generatedFavicon: "Favicon dibuat", faviconMarkup: "Markup favicon", timeZones: "Zona waktu", convertedCssUnits: "Unit CSS dikonversi", cssClamp: "CSS clamp" },
  vi: { lineDiff: "Diff theo dòng", wordDiff: "Diff theo từ", validationResult: "Kết quả xác thực", pathResult: "Kết quả path", text: "Văn bản", textMetrics: "Chỉ số văn bản", characters: "Ký tự", charactersNoSpaces: "Ký tự không có khoảng trắng", words: "Từ", lines: "Dòng", estimatedReadingTime: "Thời gian đọc ước tính", minutes: "phút", ulidValues: "Giá trị ULID", xmlSitemap: "Sitemap XML", openGraphTags: "Tag Open Graph", imageUrl: "URL hình ảnh", generatedFavicon: "Favicon đã tạo", faviconMarkup: "Markup favicon", timeZones: "Múi giờ", convertedCssUnits: "Đơn vị CSS đã chuyển đổi", cssClamp: "CSS clamp" },
  th: { lineDiff: "diff รายบรรทัด", wordDiff: "diff รายคำ", validationResult: "ผลการตรวจสอบ", pathResult: "ผลลัพธ์ path", text: "ข้อความ", textMetrics: "ค่าชี้วัดข้อความ", characters: "ตัวอักษร", charactersNoSpaces: "ตัวอักษรไม่รวมช่องว่าง", words: "คำ", lines: "บรรทัด", estimatedReadingTime: "เวลาอ่านโดยประมาณ", minutes: "นาที", ulidValues: "ค่า ULID", xmlSitemap: "Sitemap XML", openGraphTags: "แท็ก Open Graph", imageUrl: "URL รูปภาพ", generatedFavicon: "favicon ที่สร้าง", faviconMarkup: "มาร์กอัป favicon", timeZones: "เขตเวลา", convertedCssUnits: "หน่วย CSS ที่แปลงแล้ว", cssClamp: "CSS clamp" },
  ar: { lineDiff: "فرق حسب السطر", wordDiff: "فرق حسب الكلمة", validationResult: "نتيجة التحقق", pathResult: "نتيجة المسار", text: "النص", textMetrics: "مقاييس النص", characters: "الأحرف", charactersNoSpaces: "الأحرف دون مسافات", words: "الكلمات", lines: "الأسطر", estimatedReadingTime: "وقت القراءة المقدر", minutes: "دقيقة", ulidValues: "قيم ULID", xmlSitemap: "خريطة XML", openGraphTags: "وسوم Open Graph", imageUrl: "URL الصورة", generatedFavicon: "favicon منشأ", faviconMarkup: "وسم favicon", timeZones: "المناطق الزمنية", convertedCssUnits: "وحدات CSS المحولة", cssClamp: "CSS clamp" },
};

const localizedJsonEscapeToolUi: Record<Locale, Record<string, string>> = {
  en: { jsonStringInput: "JSON string input", escapeJsonString: "Escape JSON string", unescapeJsonString: "Unescape JSON string" },
  ko: { jsonStringInput: "JSON 문자열 입력", escapeJsonString: "JSON 문자열 이스케이프", unescapeJsonString: "JSON 문자열 이스케이프 해제" },
  ja: { jsonStringInput: "JSON文字列入力", escapeJsonString: "JSON文字列をエスケープ", unescapeJsonString: "JSON文字列をアンエスケープ" },
  "zh-CN": { jsonStringInput: "JSON 字符串输入", escapeJsonString: "转义 JSON 字符串", unescapeJsonString: "反转义 JSON 字符串" },
  "zh-TW": { jsonStringInput: "JSON 字串輸入", escapeJsonString: "跳脫 JSON 字串", unescapeJsonString: "還原 JSON 字串" },
  es: { jsonStringInput: "Entrada de cadena JSON", escapeJsonString: "Escapar cadena JSON", unescapeJsonString: "Desescapar cadena JSON" },
  "pt-BR": { jsonStringInput: "Entrada de string JSON", escapeJsonString: "Escapar string JSON", unescapeJsonString: "Desescapar string JSON" },
  de: { jsonStringInput: "JSON-String-Eingabe", escapeJsonString: "JSON-String escapen", unescapeJsonString: "JSON-String unescapen" },
  fr: { jsonStringInput: "Entree de chaine JSON", escapeJsonString: "Echapper la chaine JSON", unescapeJsonString: "Des-echapper la chaine JSON" },
  hi: { jsonStringInput: "JSON string इनपुट", escapeJsonString: "JSON string escape करें", unescapeJsonString: "JSON string unescape करें" },
  id: { jsonStringInput: "Masukan string JSON", escapeJsonString: "Escape string JSON", unescapeJsonString: "Unescape string JSON" },
  vi: { jsonStringInput: "Chuỗi JSON đầu vào", escapeJsonString: "Escape chuỗi JSON", unescapeJsonString: "Unescape chuỗi JSON" },
  th: { jsonStringInput: "อินพุต JSON string", escapeJsonString: "Escape JSON string", unescapeJsonString: "Unescape JSON string" },
  ar: { jsonStringInput: "إدخال سلسلة JSON", escapeJsonString: "تهريب سلسلة JSON", unescapeJsonString: "إلغاء تهريب سلسلة JSON" },
};

const localizedYamlValidatorToolUi: Record<Locale, Record<string, string>> = {
  en: { yamlInput: "YAML input", validYaml: "Valid YAML", parsedPreview: "Parsed preview", yamlValidationError: "YAML validation error" },
  ko: { yamlInput: "YAML 입력", validYaml: "유효한 YAML", parsedPreview: "파싱 미리보기", yamlValidationError: "YAML 검증 오류" },
  ja: { yamlInput: "YAML入力", validYaml: "有効なYAML", parsedPreview: "解析プレビュー", yamlValidationError: "YAML検証エラー" },
  "zh-CN": { yamlInput: "YAML 输入", validYaml: "有效 YAML", parsedPreview: "解析预览", yamlValidationError: "YAML 验证错误" },
  "zh-TW": { yamlInput: "YAML 輸入", validYaml: "有效 YAML", parsedPreview: "解析預覽", yamlValidationError: "YAML 驗證錯誤" },
  es: { yamlInput: "Entrada YAML", validYaml: "YAML valido", parsedPreview: "Vista previa parseada", yamlValidationError: "Error de validacion YAML" },
  "pt-BR": { yamlInput: "Entrada YAML", validYaml: "YAML valido", parsedPreview: "Previa analisada", yamlValidationError: "Erro de validacao YAML" },
  de: { yamlInput: "YAML-Eingabe", validYaml: "Gueltiges YAML", parsedPreview: "Geparste Vorschau", yamlValidationError: "YAML-Validierungsfehler" },
  fr: { yamlInput: "Entree YAML", validYaml: "YAML valide", parsedPreview: "Apercu analyse", yamlValidationError: "Erreur de validation YAML" },
  hi: { yamlInput: "YAML इनपुट", validYaml: "मान्य YAML", parsedPreview: "पार्स पूर्वावलोकन", yamlValidationError: "YAML जांच त्रुटि" },
  id: { yamlInput: "Masukan YAML", validYaml: "YAML valid", parsedPreview: "Pratinjau hasil parse", yamlValidationError: "Error validasi YAML" },
  vi: { yamlInput: "Nhập YAML", validYaml: "YAML hợp lệ", parsedPreview: "Xem trước đã phân tích", yamlValidationError: "Lỗi xác thực YAML" },
  th: { yamlInput: "อินพุต YAML", validYaml: "YAML ถูกต้อง", parsedPreview: "พรีวิวที่ parse แล้ว", yamlValidationError: "ข้อผิดพลาดตรวจ YAML" },
  ar: { yamlInput: "إدخال YAML", validYaml: "YAML صالح", parsedPreview: "معاينة التحليل", yamlValidationError: "خطأ تحقق YAML" },
};

const localizedEnvParserToolUi: Record<Locale, Record<string, string>> = {
  en: { envInput: "ENV input", envWarnings: "Warnings", parsedVariables: "Parsed variables", parsedJson: "Parsed JSON" },
  ko: { envInput: "ENV 입력", envWarnings: "경고", parsedVariables: "파싱된 변수", parsedJson: "파싱된 JSON" },
  ja: { envInput: "ENV入力", envWarnings: "警告", parsedVariables: "解析済み変数", parsedJson: "解析済みJSON" },
  "zh-CN": { envInput: "ENV 输入", envWarnings: "警告", parsedVariables: "已解析变量", parsedJson: "已解析 JSON" },
  "zh-TW": { envInput: "ENV 輸入", envWarnings: "警告", parsedVariables: "已解析變數", parsedJson: "已解析 JSON" },
  es: { envInput: "Entrada ENV", envWarnings: "Advertencias", parsedVariables: "Variables parseadas", parsedJson: "JSON parseado" },
  "pt-BR": { envInput: "Entrada ENV", envWarnings: "Avisos", parsedVariables: "Variaveis analisadas", parsedJson: "JSON analisado" },
  de: { envInput: "ENV-Eingabe", envWarnings: "Warnungen", parsedVariables: "Geparste Variablen", parsedJson: "Geparstes JSON" },
  fr: { envInput: "Entree ENV", envWarnings: "Avertissements", parsedVariables: "Variables analysees", parsedJson: "JSON analyse" },
  hi: { envInput: "ENV इनपुट", envWarnings: "चेतावनियां", parsedVariables: "पार्स किए चर", parsedJson: "पार्स किया JSON" },
  id: { envInput: "Masukan ENV", envWarnings: "Peringatan", parsedVariables: "Variabel hasil parse", parsedJson: "JSON hasil parse" },
  vi: { envInput: "Nhập ENV", envWarnings: "Cảnh báo", parsedVariables: "Biến đã phân tích", parsedJson: "JSON đã phân tích" },
  th: { envInput: "อินพุต ENV", envWarnings: "คำเตือน", parsedVariables: "ตัวแปรที่แยกวิเคราะห์แล้ว", parsedJson: "JSON ที่แยกวิเคราะห์แล้ว" },
  ar: { envInput: "إدخال ENV", envWarnings: "تحذيرات", parsedVariables: "متغيرات محللة", parsedJson: "JSON محلل" },
};

const localizedNoOutput: Record<Locale, string> = {
  en: "Output will appear here.",
  ko: "출력이 여기에 표시됩니다.",
  ja: "出力はここに表示されます。",
  "zh-CN": "输出会显示在这里。",
  "zh-TW": "輸出會顯示在這裡。",
  es: "La salida aparecera aqui.",
  "pt-BR": "A saida aparecera aqui.",
  de: "Die Ausgabe erscheint hier.",
  fr: "La sortie apparaitra ici.",
  hi: "नतीजा यहां दिखेगा.",
  id: "Hasil akan muncul di sini.",
  vi: "Kết quả sẽ hiển thị tại đây.",
  th: "ผลลัพธ์จะแสดงที่นี่",
  ar: "سيظهر الناتج هنا.",
};

type ToolDetailText = Pick<
  Dictionary["tool"],
  | "failureCases"
  | "failureCasesDescription"
  | "failureCaseInputPrefix"
  | "failureCaseCategoryPrefix"
  | "failureCasePrivacyPrefix"
  | "preCopyChecklist"
  | "preCopyChecklistDescription"
  | "preCopyCheckSourcePrefix"
  | "preCopyCheckSecrets"
  | "preCopyCheckRelatedPrefix"
  | "nextActionPrefix"
>;

const localizedToolDetailText: Record<Locale, ToolDetailText> = {
  en: {
    failureCases: "Common failure cases",
    failureCasesDescription: "Check these before trusting or sharing output",
    failureCaseInputPrefix: "Input shape to verify:",
    failureCaseCategoryPrefix: "Tool context to confirm:",
    failureCasePrivacyPrefix: "Processing mode to respect:",
    preCopyChecklist: "Before copying",
    preCopyChecklistDescription: "A short review loop for safer reuse",
    preCopyCheckSourcePrefix: "Compare output against the search intent:",
    preCopyCheckSecrets: "Remove secrets, private hosts, customer data, and one-off test values.",
    preCopyCheckRelatedPrefix: "If the result needs another step, continue with:",
    nextActionPrefix: "Next step:",
  },
  ko: {
    failureCases: "흔한 실패 사례",
    failureCasesDescription: "결과를 신뢰하거나 공유하기 전에 확인하세요",
    failureCaseInputPrefix: "확인할 입력 형태:",
    failureCaseCategoryPrefix: "확인할 도구 맥락:",
    failureCasePrivacyPrefix: "지켜야 할 처리 방식:",
    preCopyChecklist: "복사 전 확인",
    preCopyChecklistDescription: "안전하게 재사용하기 위한 짧은 검토 흐름",
    preCopyCheckSourcePrefix: "검색 의도와 결과를 비교:",
    preCopyCheckSecrets: "비밀값, 사설 호스트, 고객 데이터, 일회성 테스트 값을 제거하세요.",
    preCopyCheckRelatedPrefix: "다음 처리가 필요하면 이어서 사용:",
    nextActionPrefix: "다음 단계:",
  },
  ja: {
    failureCases: "よくある失敗例",
    failureCasesDescription: "出力を信頼または共有する前に確認します",
    failureCaseInputPrefix: "確認する入力形式:",
    failureCaseCategoryPrefix: "確認するツール文脈:",
    failureCasePrivacyPrefix: "守る処理方式:",
    preCopyChecklist: "コピー前の確認",
    preCopyChecklistDescription: "安全に再利用するための短い確認手順",
    preCopyCheckSourcePrefix: "検索意図と出力を比較:",
    preCopyCheckSecrets: "秘密値、内部ホスト、顧客データ、一時的なテスト値を削除してください。",
    preCopyCheckRelatedPrefix: "次の処理が必要なら続けて使用:",
    nextActionPrefix: "次の手順:",
  },
  "zh-CN": {
    failureCases: "常见失败情况",
    failureCasesDescription: "信任或分享输出前先检查这些点",
    failureCaseInputPrefix: "需要验证的输入形态:",
    failureCaseCategoryPrefix: "需要确认的工具上下文:",
    failureCasePrivacyPrefix: "需要遵守的处理方式:",
    preCopyChecklist: "复制前检查",
    preCopyChecklistDescription: "便于安全复用的简短检查流程",
    preCopyCheckSourcePrefix: "将输出与搜索意图对比:",
    preCopyCheckSecrets: "移除密钥、内部主机、客户数据和一次性测试值。",
    preCopyCheckRelatedPrefix: "如果结果还需要下一步, 继续使用:",
    nextActionPrefix: "下一步:",
  },
  "zh-TW": {
    failureCases: "常見失敗情況",
    failureCasesDescription: "信任或分享輸出前先檢查這些點",
    failureCaseInputPrefix: "需要驗證的輸入形態:",
    failureCaseCategoryPrefix: "需要確認的工具脈絡:",
    failureCasePrivacyPrefix: "需要遵守的處理方式:",
    preCopyChecklist: "複製前檢查",
    preCopyChecklistDescription: "便於安全重用的簡短檢查流程",
    preCopyCheckSourcePrefix: "將輸出與搜尋意圖對比:",
    preCopyCheckSecrets: "移除密鑰、內部主機、客戶資料與一次性測試值。",
    preCopyCheckRelatedPrefix: "如果結果還需要下一步, 繼續使用:",
    nextActionPrefix: "下一步:",
  },
  es: {
    failureCases: "Fallos comunes",
    failureCasesDescription: "Revisa esto antes de confiar en la salida o compartirla",
    failureCaseInputPrefix: "Forma de entrada a validar:",
    failureCaseCategoryPrefix: "Contexto de herramienta a confirmar:",
    failureCasePrivacyPrefix: "Modo de proceso a respetar:",
    preCopyChecklist: "Antes de copiar",
    preCopyChecklistDescription: "Revision corta para reutilizar con mas seguridad",
    preCopyCheckSourcePrefix: "Compara la salida con la intencion de busqueda:",
    preCopyCheckSecrets: "Elimina secretos, hosts privados, datos de clientes y valores de prueba puntuales.",
    preCopyCheckRelatedPrefix: "Si el resultado necesita otro paso, continua con:",
    nextActionPrefix: "Siguiente paso:",
  },
  "pt-BR": {
    failureCases: "Falhas comuns",
    failureCasesDescription: "Confira antes de confiar na saida ou compartilhar",
    failureCaseInputPrefix: "Formato de entrada a validar:",
    failureCaseCategoryPrefix: "Contexto da ferramenta a confirmar:",
    failureCasePrivacyPrefix: "Modo de processamento a respeitar:",
    preCopyChecklist: "Antes de copiar",
    preCopyChecklistDescription: "Revisao curta para reutilizar com mais seguranca",
    preCopyCheckSourcePrefix: "Compare a saida com a intencao de busca:",
    preCopyCheckSecrets: "Remova segredos, hosts privados, dados de clientes e valores de teste pontuais.",
    preCopyCheckRelatedPrefix: "Se o resultado precisa de outro passo, continue com:",
    nextActionPrefix: "Proximo passo:",
  },
  de: {
    failureCases: "Haeufige Fehlerfaelle",
    failureCasesDescription: "Vor Vertrauen oder Teilen der Ausgabe pruefen",
    failureCaseInputPrefix: "Zu pruefende Eingabeform:",
    failureCaseCategoryPrefix: "Zu bestaetigender Werkzeugkontext:",
    failureCasePrivacyPrefix: "Zu beachtender Verarbeitungsmodus:",
    preCopyChecklist: "Vor dem Kopieren",
    preCopyChecklistDescription: "Kurzer Pruefablauf fuer sichere Wiederverwendung",
    preCopyCheckSourcePrefix: "Ausgabe mit Suchabsicht vergleichen:",
    preCopyCheckSecrets: "Entferne Geheimnisse, private Hosts, Kundendaten und einmalige Testwerte.",
    preCopyCheckRelatedPrefix: "Wenn ein weiterer Schritt noetig ist, weiter mit:",
    nextActionPrefix: "Naechster Schritt:",
  },
  fr: {
    failureCases: "Erreurs frequentes",
    failureCasesDescription: "A verifier avant de faire confiance a la sortie ou de la partager",
    failureCaseInputPrefix: "Forme d'entree a verifier:",
    failureCaseCategoryPrefix: "Contexte d'outil a confirmer:",
    failureCasePrivacyPrefix: "Mode de traitement a respecter:",
    preCopyChecklist: "Avant de copier",
    preCopyChecklistDescription: "Verification courte pour une reutilisation plus sure",
    preCopyCheckSourcePrefix: "Comparer la sortie avec l'intention de recherche:",
    preCopyCheckSecrets: "Retirez secrets, hotes prives, donnees client et valeurs de test ponctuelles.",
    preCopyCheckRelatedPrefix: "Si le resultat demande une etape suivante, continuez avec:",
    nextActionPrefix: "Etape suivante:",
  },
  hi: {
    failureCases: "आम असफल स्थितियां",
    failureCasesDescription: "नतीजे पर भरोसा करने या साझा करने से पहले जांचें",
    failureCaseInputPrefix: "जांचने वाला इनपुट रूप:",
    failureCaseCategoryPrefix: "पुष्टि करने वाला साधन संदर्भ:",
    failureCasePrivacyPrefix: "पालन करने वाला प्रक्रिया तरीका:",
    preCopyChecklist: "कॉपी से पहले",
    preCopyChecklistDescription: "सुरक्षित दोबारा उपयोग के लिए छोटी जांच",
    preCopyCheckSourcePrefix: "नतीजे को खोज इरादे से मिलाएं:",
    preCopyCheckSecrets: "गुप्त मान, निजी होस्ट, ग्राहक डेटा और एक बार के टेस्ट मान हटाएं.",
    preCopyCheckRelatedPrefix: "अगर अगले कदम की जरूरत हो तो आगे इस्तेमाल करें:",
    nextActionPrefix: "अगला कदम:",
  },
  id: {
    failureCases: "Kegagalan umum",
    failureCasesDescription: "Periksa ini sebelum percaya atau membagikan hasil",
    failureCaseInputPrefix: "Bentuk masukan yang perlu dicek:",
    failureCaseCategoryPrefix: "Konteks alat yang perlu dipastikan:",
    failureCasePrivacyPrefix: "Cara pemrosesan yang perlu dijaga:",
    preCopyChecklist: "Sebelum menyalin",
    preCopyChecklistDescription: "Alur pemeriksaan singkat agar pemakaian ulang lebih aman",
    preCopyCheckSourcePrefix: "Bandingkan hasil dengan niat pencarian:",
    preCopyCheckSecrets: "Hapus nilai rahasia, host privat, data pelanggan, dan nilai uji sekali pakai.",
    preCopyCheckRelatedPrefix: "Jika hasil perlu langkah berikutnya, lanjutkan dengan:",
    nextActionPrefix: "Langkah berikutnya:",
  },
  vi: {
    failureCases: "Lỗi thường gặp",
    failureCasesDescription: "Kiểm tra trước khi tin tưởng hoặc chia sẻ kết quả",
    failureCaseInputPrefix: "Dạng đầu vào cần kiểm tra:",
    failureCaseCategoryPrefix: "Ngữ cảnh công cụ cần xác nhận:",
    failureCasePrivacyPrefix: "Cách xử lý cần tuân thủ:",
    preCopyChecklist: "Trước khi sao chép",
    preCopyChecklistDescription: "Vòng kiểm tra ngắn để tái sử dụng an toàn hơn",
    preCopyCheckSourcePrefix: "Đối chiếu kết quả với ý định tìm kiếm:",
    preCopyCheckSecrets: "Xóa khóa bí mật, host nội bộ, dữ liệu khách hàng và giá trị thử nghiệm dùng một lần.",
    preCopyCheckRelatedPrefix: "Nếu kết quả cần bước tiếp theo, tiếp tục với:",
    nextActionPrefix: "Bước tiếp theo:",
  },
  th: {
    failureCases: "กรณีผิดพลาดที่พบบ่อย",
    failureCasesDescription: "ตรวจสอบก่อนเชื่อผลลัพธ์หรือแชร์ต่อ",
    failureCaseInputPrefix: "รูปแบบข้อมูลที่ต้องตรวจ:",
    failureCaseCategoryPrefix: "บริบทเครื่องมือที่ต้องยืนยัน:",
    failureCasePrivacyPrefix: "วิธีประมวลผลที่ต้องรักษา:",
    preCopyChecklist: "ก่อนคัดลอก",
    preCopyChecklistDescription: "ขั้นตอนตรวจสั้น ๆ เพื่อใช้ซ้ำอย่างปลอดภัย",
    preCopyCheckSourcePrefix: "เทียบผลลัพธ์กับเจตนาการค้นหา:",
    preCopyCheckSecrets: "ลบค่าลับ โฮสต์ส่วนตัว ข้อมูลลูกค้า และค่าทดสอบใช้ครั้งเดียว",
    preCopyCheckRelatedPrefix: "ถ้าผลลัพธ์ต้องทำต่อ ให้ใช้:",
    nextActionPrefix: "ขั้นตอนถัดไป:",
  },
  ar: {
    failureCases: "حالات فشل شائعة",
    failureCasesDescription: "افحص هذه النقاط قبل الوثوق بالناتج أو مشاركته",
    failureCaseInputPrefix: "شكل الإدخال المطلوب فحصه:",
    failureCaseCategoryPrefix: "سياق الأداة المطلوب تأكيده:",
    failureCasePrivacyPrefix: "طريقة المعالجة المطلوب احترامها:",
    preCopyChecklist: "قبل النسخ",
    preCopyChecklistDescription: "دورة فحص قصيرة لإعادة استخدام أكثر أمانا",
    preCopyCheckSourcePrefix: "قارن الناتج مع نية البحث:",
    preCopyCheckSecrets: "أزل القيم السرية والمضيفين الخاصين وبيانات العملاء وقيم الاختبار المؤقتة.",
    preCopyCheckRelatedPrefix: "إذا احتاجت النتيجة خطوة أخرى فتابع مع:",
    nextActionPrefix: "الخطوة التالية:",
  },
};

const en: Dictionary = {
  dir: "ltr",
  siteDescription: "A focused workbench of free developer tools for formatting, encoding, testing, conversion, SEO, networking, color, time, and text workflows.",
  nav: {
    brand: "Bob's Multi Tool",
    searchPlaceholder: "Search tools",
    openNavigation: "Open navigation",
    close: "Close",
    guides: "Guides",
    tools: "Tools",
    examples: "Examples",
    faq: "FAQ",
    relatedTools: "Related tools",
    relatedToolsDescription: "Useful next steps",
    guideDescription: "Search-focused support content",
    language: "Language",
    theme: "Theme",
  },
  home: {
    badge: "Developer workbench",
    title: "Practical browser tools for everyday developer workflows.",
    description: "Format payloads, test patterns, inspect tokens, generate metadata, compare text, and convert values without leaving a single domain.",
    openTools: "Open tools",
    readGuides: "Read guides",
    toolIndexTitle: "Tool index",
    toolIndexDescription: "Registry-backed utilities with SEO, navigation, locale, and validation hooks.",
  },
  tool: {
    developerWorkbench: "Developer workbench",
    singleDomainTitle: "Single domain",
    singleDomainBody: "All tools live under www.bobob.app for cleaner AdSense review and stronger search authority.",
    localFirstTitle: "Local-first",
    localFirstBody: "Formatting, decoding, and generation run in the browser whenever practical.",
    expandableRegistryTitle: "Expandable registry",
    expandableRegistryBody: "New tools require metadata, locale support, examples, FAQs, guides, related links, and smoke checks.",
    examplesDescription: "Starting points for this utility",
    faqDescription: "Common implementation details",
    guidesDescription: "Workflow notes connected to this tool",
    useCases: "Use cases",
    ...localizedToolDetailText.en,
    noOutput: "Output will appear here.",
    copy: "Copy",
    copied: "Copied",
    privacy: "Privacy",
    serverRequired: "Server route",
    localOnly: "Browser local",
  },
  toolUi: enToolUi,
  guides: {
    badge: "Guides",
    title: "Practical guides for browser utilities",
    description: "Short support articles that explain the workflows behind the tools without turning the site into a generic blog.",
    back: "Back to guides",
    relatedTitle: "Related tools",
    relatedDescription: "Open the utility connected to this guide.",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  metadata: {
    homeTitle: "Bob's Multi Tool - Practical Developer Utilities",
    homeDescription: "Free online developer tools for JSON, regex, Base64, JWT, cron, timestamps, UUIDs, SEO, colors, network checks, and text conversion.",
    guidesTitle: "Developer Utility Guides",
    guidesDescription: "Practical support guides for Bob's Multi Tool utilities.",
    toolDescription: (title) => `${title} in Bob's Multi Tool. Use a fast developer utility with examples, FAQ, related tools, and local-first privacy where practical.`,
    guideDescription: (title) => `${title}. A practical guide for using browser-based developer utilities safely and efficiently.`,
  },
  categories,
};

type CommonLocaleOverride = {
  dir?: Dictionary["dir"];
  siteDescription?: string;
  nav?: Partial<Dictionary["nav"]>;
  home?: Partial<Dictionary["home"]>;
  tool?: Partial<Dictionary["tool"]>;
  guides?: Partial<Dictionary["guides"]>;
  theme?: Partial<Dictionary["theme"]>;
  metadata?: Partial<Dictionary["metadata"]>;
  categories?: Record<string, string>;
  toolUi?: Record<string, string>;
};

const commonText: Record<Locale, CommonLocaleOverride> = {
  en: {},
  ko: {
    nav: { searchPlaceholder: "도구 검색", openNavigation: "내비게이션 열기", close: "닫기", guides: "가이드", tools: "도구", examples: "예제", faq: "FAQ", relatedTools: "관련 도구", relatedToolsDescription: "다음에 쓰기 좋은 도구", guideDescription: "검색 의도를 보강하는 가이드", language: "언어", theme: "테마" },
    tool: { developerWorkbench: "개발자 워크벤치", singleDomainTitle: "단일 도메인", singleDomainBody: "모든 도구를 www.bobob.app 아래에 두어 AdSense 심사와 검색 권위를 정리합니다.", localFirstTitle: "로컬 우선", localFirstBody: "가능한 포맷, 디코딩, 생성 작업은 브라우저에서 실행합니다.", expandableRegistryTitle: "확장형 등록 구조", expandableRegistryBody: "새 도구는 메타데이터, 언어, 예제, FAQ, 가이드, 관련 링크, 기본 검증을 함께 가져야 합니다.", examplesDescription: "이 도구를 시작하기 좋은 입력값", faqDescription: "자주 확인하는 구현 세부사항", guidesDescription: "도구와 연결된 작업 흐름", useCases: "사용 사례", copy: "복사", copied: "복사됨", privacy: "개인정보", serverRequired: "서버 검사", localOnly: "브라우저 로컬" },
    guides: { badge: "가이드", title: "브라우저 유틸리티 실전 가이드", description: "일반 블로그가 아니라 도구 사용 맥락을 보강하는 짧은 가이드입니다.", back: "가이드로 돌아가기", relatedTitle: "관련 도구", relatedDescription: "이 가이드와 연결된 도구를 엽니다." },
    theme: { light: "라이트", dark: "다크", system: "시스템" },
  },
  ja: {
    nav: { searchPlaceholder: "ツールを検索", openNavigation: "ナビゲーションを開く", close: "閉じる", guides: "ガイド", tools: "ツール", examples: "例", faq: "FAQ", relatedTools: "関連ツール", relatedToolsDescription: "次に使いやすいツール", guideDescription: "検索意図を補足するガイド", language: "言語", theme: "テーマ" },
    home: { openTools: "ツールを開く", readGuides: "ガイドを読む", toolIndexTitle: "ツール一覧", toolIndexDescription: "SEO、ナビゲーション、locale、検証に接続されたユーティリティです。" },
    tool: { developerWorkbench: "開発者ワークベンチ", singleDomainTitle: "単一ドメイン", singleDomainBody: "すべてのツールを www.bobob.app 配下に置き、AdSense 審査と検索評価を整理します。", localFirstTitle: "ローカル優先", localFirstBody: "可能な整形、デコード、生成処理はブラウザ内で実行します。", expandableRegistryTitle: "拡張可能な登録構造", expandableRegistryBody: "新しいツールにはメタデータ、言語、例、FAQ、ガイド、関連リンク、簡易検証が必要です。", examplesDescription: "このツールを始めるための入力例", faqDescription: "よく確認する実装詳細", guidesDescription: "このツールに関連する作業フロー", useCases: "利用シーン", copy: "コピー", copied: "コピー済み", privacy: "プライバシー", serverRequired: "サーバー確認", localOnly: "ブラウザ内処理" },
    guides: { badge: "ガイド", title: "ブラウザユーティリティ実践ガイド", description: "一般的なブログではなく、ツール利用の文脈を補足する短いガイドです。", back: "ガイドへ戻る", relatedTitle: "関連ツール", relatedDescription: "このガイドに関連するツールを開きます。" },
    theme: { light: "ライト", dark: "ダーク", system: "システム" },
  },
  "zh-CN": {
    nav: { searchPlaceholder: "搜索工具", openNavigation: "打开导航", close: "关闭", guides: "指南", tools: "工具", examples: "示例", faq: "FAQ", relatedTools: "相关工具", relatedToolsDescription: "下一步可用工具", guideDescription: "补充搜索意图的指南", language: "语言", theme: "主题" },
    home: { badge: "开发者工作台", title: "面向日常开发流程的实用浏览器工具。", description: "在单一域名中格式化数据、测试模式、检查令牌、生成元数据、比较文本并转换值。", openTools: "打开工具", readGuides: "阅读指南", toolIndexTitle: "工具索引", toolIndexDescription: "由注册结构连接 SEO、导航、语言和验证的工具。" },
    tool: { developerWorkbench: "开发者工作台", singleDomainTitle: "单一域名", singleDomainBody: "所有工具位于 www.bobob.app 下，便于 AdSense 审核并集中搜索权重。", localFirstTitle: "本地优先", localFirstBody: "可行的格式化、解码和生成操作都在浏览器中执行。", expandableRegistryTitle: "可扩展注册结构", expandableRegistryBody: "新工具必须包含元数据、语言、示例、FAQ、指南、相关链接和基础验证。", examplesDescription: "此工具的起始示例", faqDescription: "常见实现细节", guidesDescription: "与此工具相关的工作流", useCases: "使用场景", copy: "复制", copied: "已复制", privacy: "隐私", serverRequired: "服务器检查", localOnly: "浏览器本地" },
    guides: { badge: "指南", title: "浏览器工具实践指南", description: "短篇支持内容，用于补充工具的使用场景，而不是泛泛的博客。", back: "返回指南", relatedTitle: "相关工具", relatedDescription: "打开与此指南相关的工具。" },
    theme: { light: "浅色", dark: "深色", system: "系统" },
  },
  "zh-TW": {
    nav: { searchPlaceholder: "搜尋工具", openNavigation: "開啟導覽", close: "關閉", guides: "指南", tools: "工具", examples: "範例", faq: "FAQ", relatedTools: "相關工具", relatedToolsDescription: "下一步可用工具", guideDescription: "補充搜尋意圖的指南", language: "語言", theme: "主題" },
    home: { badge: "開發者工作台", title: "面向日常開發流程的實用瀏覽器工具。", description: "在單一網域中格式化資料、測試模式、檢查權杖、產生中繼資料、比較文字並轉換數值。", openTools: "開啟工具", readGuides: "閱讀指南", toolIndexTitle: "工具索引", toolIndexDescription: "由註冊結構串接 SEO、導覽、語言與驗證的工具。" },
    tool: { developerWorkbench: "開發者工作台", singleDomainTitle: "單一網域", singleDomainBody: "所有工具位於 www.bobob.app 下，方便 AdSense 審核並集中搜尋權重。", localFirstTitle: "本機優先", localFirstBody: "可行的格式化、解碼與生成操作都在瀏覽器中執行。", expandableRegistryTitle: "可擴充註冊結構", expandableRegistryBody: "新工具必須包含中繼資料、語言、範例、FAQ、指南、相關連結與基礎驗證。", examplesDescription: "此工具的起始範例", faqDescription: "常見實作細節", guidesDescription: "與此工具相關的工作流程", useCases: "使用情境", copy: "複製", copied: "已複製", privacy: "隱私", serverRequired: "伺服器檢查", localOnly: "瀏覽器本機" },
    guides: { badge: "指南", title: "瀏覽器工具實務指南", description: "短篇支援內容，用來補充工具使用情境，而不是泛泛的部落格。", back: "返回指南", relatedTitle: "相關工具", relatedDescription: "開啟與此指南相關的工具。" },
    theme: { light: "淺色", dark: "深色", system: "系統" },
  },
  es: {
    nav: { searchPlaceholder: "Buscar herramientas", openNavigation: "Abrir navegacion", close: "Cerrar", guides: "Guias", tools: "Herramientas", examples: "Ejemplos", faq: "FAQ", relatedTools: "Herramientas relacionadas", relatedToolsDescription: "Siguientes pasos utiles", guideDescription: "Contenido que refuerza la busqueda", language: "Idioma", theme: "Tema" },
    home: { badge: "Mesa de trabajo", title: "Herramientas de navegador practicas para flujos diarios de desarrollo.", description: "Formatea datos, prueba patrones, inspecciona tokens, genera metadatos, compara texto y convierte valores en un solo dominio.", openTools: "Abrir herramientas", readGuides: "Leer guias", toolIndexTitle: "Indice de herramientas", toolIndexDescription: "Utilidades conectadas a SEO, navegacion, idioma y validacion." },
    tool: { developerWorkbench: "Mesa de trabajo", singleDomainTitle: "Dominio unico", singleDomainBody: "Todas las herramientas viven bajo www.bobob.app para una revision de AdSense mas clara y mejor autoridad de busqueda.", localFirstTitle: "Local primero", localFirstBody: "El formato, decodificacion y generacion se ejecutan en el navegador siempre que sea practico.", expandableRegistryTitle: "Registro ampliable", expandableRegistryBody: "Cada herramienta requiere metadatos, idioma, ejemplos, FAQ, guias, enlaces relacionados y verificaciones rapidas.", examplesDescription: "Puntos de partida para esta utilidad", faqDescription: "Detalles comunes de implementacion", guidesDescription: "Flujos conectados a esta herramienta", useCases: "Casos de uso", copy: "Copiar", copied: "Copiado", privacy: "Privacidad", serverRequired: "Ruta de servidor", localOnly: "Local en navegador" },
    guides: { badge: "Guias", title: "Guias practicas para utilidades de navegador", description: "Articulos breves que explican el flujo de trabajo detras de las herramientas.", back: "Volver a guias", relatedTitle: "Herramientas relacionadas", relatedDescription: "Abre la utilidad conectada a esta guia." },
    theme: { light: "Claro", dark: "Oscuro", system: "Sistema" },
  },
  "pt-BR": {
    nav: { searchPlaceholder: "Buscar ferramentas", openNavigation: "Abrir navegacao", close: "Fechar", guides: "Guias", tools: "Ferramentas", examples: "Exemplos", faq: "FAQ", relatedTools: "Ferramentas relacionadas", relatedToolsDescription: "Proximos passos uteis", guideDescription: "Conteudo de apoio para busca", language: "Idioma", theme: "Tema" },
    home: { badge: "Ambiente de desenvolvimento", title: "Ferramentas de navegador praticas para fluxos diarios de desenvolvimento.", description: "Formate payloads, teste padroes, inspecione tokens, gere metadados, compare texto e converta valores em um unico dominio.", openTools: "Abrir ferramentas", readGuides: "Ler guias", toolIndexTitle: "Indice de ferramentas", toolIndexDescription: "Utilidades conectadas a SEO, navegacao, idioma e validacao." },
    tool: { developerWorkbench: "Ambiente de desenvolvimento", singleDomainTitle: "Dominio unico", singleDomainBody: "Todas as ferramentas ficam em www.bobob.app para revisao do AdSense mais clara e autoridade de busca concentrada.", localFirstTitle: "Local primeiro", localFirstBody: "Formatacao, decodificacao e geracao rodam no navegador sempre que pratico.", expandableRegistryTitle: "Registro expansivel", expandableRegistryBody: "Cada ferramenta precisa de metadados, idioma, exemplos, FAQ, guias, links relacionados e verificacoes rapidas.", examplesDescription: "Pontos de partida para esta utilidade", faqDescription: "Detalhes comuns de implementacao", guidesDescription: "Fluxos conectados a esta ferramenta", useCases: "Casos de uso", copy: "Copiar", copied: "Copiado", privacy: "Privacidade", serverRequired: "Rota de servidor", localOnly: "Local no navegador" },
    guides: { badge: "Guias", title: "Guias praticos para utilitarios de navegador", description: "Artigos curtos que explicam os fluxos por tras das ferramentas.", back: "Voltar para guias", relatedTitle: "Ferramentas relacionadas", relatedDescription: "Abra a utilidade conectada a este guia." },
    theme: { light: "Claro", dark: "Escuro", system: "Sistema" },
  },
  de: {
    nav: { searchPlaceholder: "Werkzeuge suchen", openNavigation: "Navigation oeffnen", close: "Schliessen", guides: "Leitfaeden", tools: "Werkzeuge", examples: "Beispiele", faq: "FAQ", relatedTools: "Verwandte Werkzeuge", relatedToolsDescription: "Nuetzliche naechste Schritte", guideDescription: "Suchorientierte Begleitinhalte", language: "Sprache", theme: "Design" },
    home: { badge: "Entwickler-Arbeitsplatz", title: "Praktische Browser-Werkzeuge fuer taegliche Entwicklungsablaeufe.", description: "Formatiere Daten, teste Muster, pruefe Tokens, erzeuge Metadaten, vergleiche Text und konvertiere Werte auf einer Domain.", openTools: "Werkzeuge oeffnen", readGuides: "Leitfaeden lesen", toolIndexTitle: "Werkzeugindex", toolIndexDescription: "Verzeichnisbasierte Hilfen mit SEO, Navigation, Sprache und Validierung." },
    tool: { developerWorkbench: "Entwickler-Arbeitsplatz", singleDomainTitle: "Eine Domain", singleDomainBody: "Alle Werkzeuge liegen unter www.bobob.app fuer klarere AdSense-Pruefung und staerkere Suchautoritaet.", localFirstTitle: "Lokal zuerst", localFirstBody: "Formatierung, Decoding und Generierung laufen wenn moeglich im Browser.", expandableRegistryTitle: "Erweiterbares Verzeichnis", expandableRegistryBody: "Neue Werkzeuge benoetigen Metadaten, Sprachsupport, Beispiele, FAQ, Leitfaeden, verwandte Links und Schnelltests.", examplesDescription: "Startpunkte fuer dieses Werkzeug", faqDescription: "Haefige Implementierungsdetails", guidesDescription: "Ablaeufe zu diesem Werkzeug", useCases: "Anwendungsfaelle", copy: "Kopieren", copied: "Kopiert", privacy: "Datenschutz", serverRequired: "Serverpruefung", localOnly: "Lokal im Browser" },
    guides: { badge: "Leitfaeden", title: "Praxisleitfaeden fuer Browser-Hilfen", description: "Kurze Hilfsartikel, die die Ablaeufe hinter den Werkzeugen erklaeren.", back: "Zurueck zu Leitfaeden", relatedTitle: "Verwandte Werkzeuge", relatedDescription: "Oeffne das Werkzeug zu diesem Leitfaden." },
    theme: { light: "Hell", dark: "Dunkel", system: "System" },
  },
  fr: {
    nav: { searchPlaceholder: "Rechercher des outils", openNavigation: "Ouvrir la navigation", close: "Fermer", guides: "Guides", tools: "Outils", examples: "Exemples", faq: "FAQ", relatedTools: "Outils lies", relatedToolsDescription: "Etapes suivantes utiles", guideDescription: "Contenu de soutien pour la recherche", language: "Langue", theme: "Theme" },
    home: { badge: "Atelier developpeur", title: "Outils navigateur pratiques pour les flux developpeur quotidiens.", description: "Formatez des donnees, testez des motifs, inspectez des tokens, generez des metadonnees, comparez du texte et convertissez des valeurs sur un seul domaine.", openTools: "Ouvrir les outils", readGuides: "Lire les guides", toolIndexTitle: "Index des outils", toolIndexDescription: "Utilitaires relies au SEO, a la navigation, aux langues et aux validations." },
    tool: { developerWorkbench: "Atelier developpeur", singleDomainTitle: "Domaine unique", singleDomainBody: "Tous les outils vivent sous www.bobob.app pour une revue AdSense plus claire et une meilleure autorite de recherche.", localFirstTitle: "Local d'abord", localFirstBody: "Formatage, decodage et generation tournent dans le navigateur quand c'est possible.", expandableRegistryTitle: "Registre extensible", expandableRegistryBody: "Chaque outil demande metadonnees, langue, exemples, FAQ, guides, liens lies et tests rapides.", examplesDescription: "Points de depart pour cet outil", faqDescription: "Details d'implementation courants", guidesDescription: "Flux lies a cet outil", useCases: "Cas d'utilisation", copy: "Copier", copied: "Copie", privacy: "Confidentialite", serverRequired: "Controle serveur", localOnly: "Local navigateur" },
    guides: { badge: "Guides", title: "Guides pratiques pour utilitaires navigateur", description: "Articles courts qui expliquent les flux derriere les outils.", back: "Retour aux guides", relatedTitle: "Outils lies", relatedDescription: "Ouvrir l'utilitaire lie a ce guide." },
    theme: { light: "Clair", dark: "Sombre", system: "Systeme" },
  },
  hi: {
    nav: { searchPlaceholder: "टूल खोजें", openNavigation: "नेविगेशन खोलें", close: "बंद करें", guides: "गाइड", tools: "टूल", examples: "उदाहरण", faq: "FAQ", relatedTools: "संबंधित टूल", relatedToolsDescription: "अगले उपयोगी कदम", guideDescription: "खोज संदर्भ को मजबूत करने वाली गाइड", language: "भाषा", theme: "थीम" },
    home: { badge: "डेवलपर कार्यक्षेत्र", title: "रोजमर्रा के विकास कामों के लिए व्यावहारिक ब्राउज़र साधन.", description: "डेटा फॉर्मैट करें, पैटर्न जांचें, टोकन देखें, मेटाडेटा बनाएं, टेक्स्ट मिलाएं और मान बदलें.", openTools: "साधन खोलें", readGuides: "गाइड पढ़ें", toolIndexTitle: "साधन इंडेक्स", toolIndexDescription: "SEO, नेविगेशन, भाषा और जांच से जुड़ी उपयोगिताएं." },
    tool: { developerWorkbench: "डेवलपर कार्यक्षेत्र", singleDomainTitle: "एक डोमेन", singleDomainBody: "सारे साधन www.bobob.app के नीचे हैं ताकि AdSense समीक्षा और खोज भरोसा साफ रहे.", localFirstTitle: "लोकल पहले", localFirstBody: "फॉर्मैट, डिकोड और जनरेशन जहां व्यावहारिक हो ब्राउज़र में चलते हैं.", expandableRegistryTitle: "बढ़ने योग्य सूची", expandableRegistryBody: "नए साधन में मेटाडेटा, भाषा समर्थन, उदाहरण, FAQ, गाइड, संबंधित लिंक और तेज जांच जरूरी हैं.", examplesDescription: "इस उपयोगिता के शुरुआती उदाहरण", faqDescription: "आम implementation विवरण", guidesDescription: "इस साधन से जुड़े काम के प्रवाह", useCases: "उपयोग के मामले", copy: "कॉपी", copied: "कॉपी हो गया", privacy: "गोपनीयता", serverRequired: "सर्वर जांच", localOnly: "ब्राउज़र में लोकल" },
    guides: { badge: "गाइड", title: "ब्राउज़र उपयोगिता के व्यावहारिक गाइड", description: "छोटे लेख जो साधनों के काम करने का संदर्भ समझाते हैं.", back: "गाइड पर वापस", relatedTitle: "संबंधित साधन", relatedDescription: "इस गाइड से जुड़ी उपयोगिता खोलें." },
    theme: { light: "लाइट", dark: "डार्क", system: "सिस्टम" },
  },
  id: {
    nav: { searchPlaceholder: "Cari alat", openNavigation: "Buka navigasi", close: "Tutup", guides: "Panduan", tools: "Alat", examples: "Contoh", faq: "FAQ", relatedTools: "Alat terkait", relatedToolsDescription: "Langkah berikutnya", guideDescription: "Konten pendukung pencarian", language: "Bahasa", theme: "Tema" },
    home: { badge: "Meja kerja pengembang", title: "Alat browser praktis untuk kerja pengembang harian.", description: "Format data, uji pola, periksa token, buat metadata, bandingkan teks, dan konversi nilai dalam satu domain.", openTools: "Buka alat", readGuides: "Baca panduan", toolIndexTitle: "Indeks alat", toolIndexDescription: "Utilitas terdaftar dengan SEO, navigasi, bahasa, dan validasi." },
    tool: { developerWorkbench: "Meja kerja pengembang", singleDomainTitle: "Domain tunggal", singleDomainBody: "Semua alat berada di www.bobob.app agar review AdSense lebih jelas dan otoritas pencarian terkumpul.", localFirstTitle: "Lokal lebih dulu", localFirstBody: "Pemformatan, decoding, dan pembuatan berjalan di browser bila memungkinkan.", expandableRegistryTitle: "Daftar yang bisa diperluas", expandableRegistryBody: "Alat baru wajib punya metadata, bahasa, contoh, FAQ, panduan, link terkait, dan pemeriksaan cepat.", examplesDescription: "Titik awal untuk utilitas ini", faqDescription: "Detail implementasi umum", guidesDescription: "Alur kerja yang terhubung", useCases: "Kasus penggunaan", copy: "Salin", copied: "Tersalin", privacy: "Privasi", serverRequired: "Cek server", localOnly: "Lokal di browser" },
    guides: { badge: "Panduan", title: "Panduan praktis utilitas browser", description: "Artikel singkat yang menjelaskan alur kerja di balik alat.", back: "Kembali ke panduan", relatedTitle: "Alat terkait", relatedDescription: "Buka utilitas yang terkait dengan panduan ini." },
    theme: { light: "Terang", dark: "Gelap", system: "Sistem" },
  },
  vi: {
    nav: { searchPlaceholder: "Tìm công cụ", openNavigation: "Mở điều hướng", close: "Đóng", guides: "Hướng dẫn", tools: "Công cụ", examples: "Ví dụ", faq: "FAQ", relatedTools: "Công cụ liên quan", relatedToolsDescription: "Bước tiếp theo hữu ích", guideDescription: "Nội dung hỗ trợ tìm kiếm", language: "Ngôn ngữ", theme: "Giao diện" },
    home: { badge: "Bàn làm việc lập trình", title: "Công cụ trình duyệt thực dụng cho việc lập trình hằng ngày.", description: "Định dạng dữ liệu, thử mẫu, kiểm tra token, tạo siêu dữ liệu, so sánh văn bản và chuyển đổi giá trị trong một domain.", openTools: "Mở công cụ", readGuides: "Đọc hướng dẫn", toolIndexTitle: "Danh mục công cụ", toolIndexDescription: "Tiện ích đã đăng ký kết nối SEO, điều hướng, ngôn ngữ và kiểm thử." },
    tool: { developerWorkbench: "Bàn làm việc lập trình", singleDomainTitle: "Một domain", singleDomainBody: "Tất cả công cụ nằm dưới www.bobob.app để review AdSense rõ ràng hơn và tăng sức mạnh tìm kiếm.", localFirstTitle: "Ưu tiên cục bộ", localFirstBody: "Định dạng, giải mã và tạo dữ liệu chạy trong trình duyệt khi có thể.", expandableRegistryTitle: "Danh mục mở rộng", expandableRegistryBody: "Công cụ mới cần siêu dữ liệu, ngôn ngữ, ví dụ, FAQ, hướng dẫn, link liên quan và kiểm tra nhanh.", examplesDescription: "Điểm bắt đầu cho công cụ này", faqDescription: "Chi tiết triển khai thường gặp", guidesDescription: "Quy trình liên quan tới công cụ này", useCases: "Trường hợp dùng", copy: "Sao chép", copied: "Đã sao chép", privacy: "Riêng tư", serverRequired: "Kiểm tra server", localOnly: "Cục bộ trên trình duyệt" },
    guides: { badge: "Hướng dẫn", title: "Hướng dẫn thực tế cho tiện ích trình duyệt", description: "Bài viết ngắn giải thích quy trình phía sau công cụ.", back: "Quay lại hướng dẫn", relatedTitle: "Công cụ liên quan", relatedDescription: "Mở tiện ích liên kết với hướng dẫn này." },
    theme: { light: "Sáng", dark: "Tối", system: "Hệ thống" },
  },
  th: {
    nav: { searchPlaceholder: "ค้นหาเครื่องมือ", openNavigation: "เปิดเมนู", close: "ปิด", guides: "คู่มือ", tools: "เครื่องมือ", examples: "ตัวอย่าง", faq: "FAQ", relatedTools: "เครื่องมือที่เกี่ยวข้อง", relatedToolsDescription: "ขั้นตอนต่อไปที่มีประโยชน์", guideDescription: "เนื้อหาช่วยเสริมการค้นหา", language: "ภาษา", theme: "ธีม" },
    home: { badge: "พื้นที่ทำงานนักพัฒนา", title: "เครื่องมือเบราว์เซอร์สำหรับงานนักพัฒนาประจำวัน", description: "จัดรูปแบบข้อมูล ทดสอบแพตเทิร์น ตรวจ token สร้างเมทาดาต้า เปรียบเทียบข้อความ และแปลงค่าในโดเมนเดียว", openTools: "เปิดเครื่องมือ", readGuides: "อ่านคู่มือ", toolIndexTitle: "ดัชนีเครื่องมือ", toolIndexDescription: "ยูทิลิตี้ที่เชื่อม SEO การนำทาง ภาษา และการตรวจสอบ" },
    tool: { developerWorkbench: "พื้นที่ทำงานนักพัฒนา", singleDomainTitle: "โดเมนเดียว", singleDomainBody: "เครื่องมือทั้งหมดอยู่ใต้ www.bobob.app เพื่อให้ AdSense review ชัดขึ้นและรวมพลัง SEO", localFirstTitle: "ทำงานในเครื่องก่อน", localFirstBody: "การจัดรูปแบบ ถอดรหัส และสร้างข้อมูลจะทำในเบราว์เซอร์เมื่อทำได้", expandableRegistryTitle: "รายการที่ขยายได้", expandableRegistryBody: "เครื่องมือใหม่ต้องมีเมทาดาต้า ภาษา ตัวอย่าง FAQ คู่มือ ลิงก์เกี่ยวข้อง และการตรวจแบบเร็ว", examplesDescription: "จุดเริ่มต้นสำหรับเครื่องมือนี้", faqDescription: "รายละเอียดการใช้งานที่พบบ่อย", guidesDescription: "ขั้นตอนที่เชื่อมกับเครื่องมือนี้", useCases: "กรณีใช้งาน", copy: "คัดลอก", copied: "คัดลอกแล้ว", privacy: "ความเป็นส่วนตัว", serverRequired: "ตรวจผ่านเซิร์ฟเวอร์", localOnly: "ทำในเบราว์เซอร์" },
    guides: { badge: "คู่มือ", title: "คู่มือใช้งานยูทิลิตี้เบราว์เซอร์", description: "บทความสั้นที่อธิบายขั้นตอนใช้งานของเครื่องมือ", back: "กลับไปคู่มือ", relatedTitle: "เครื่องมือที่เกี่ยวข้อง", relatedDescription: "เปิดยูทิลิตี้ที่เกี่ยวข้องกับคู่มือนี้" },
    theme: { light: "สว่าง", dark: "มืด", system: "ระบบ" },
  },
  ar: {
    nav: { searchPlaceholder: "ابحث عن الأدوات", openNavigation: "افتح التنقل", close: "إغلاق", guides: "الأدلة", tools: "الأدوات", examples: "أمثلة", faq: "FAQ", relatedTools: "أدوات مرتبطة", relatedToolsDescription: "خطوات مفيدة تالية", guideDescription: "محتوى يدعم نية البحث", language: "اللغة", theme: "المظهر" },
    home: { badge: "منضدة المطور", title: "أدوات متصفح عملية لمهام المطور اليومية.", description: "نسق البيانات، اختبر الأنماط، افحص الرموز، أنشئ البيانات الوصفية، قارن النصوص وحول القيم ضمن نطاق واحد.", openTools: "افتح الأدوات", readGuides: "اقرأ الأدلة", toolIndexTitle: "فهرس الأدوات", toolIndexDescription: "أدوات مسجلة مرتبطة بـ SEO والتنقل واللغة والتحقق." },
    tool: { developerWorkbench: "منضدة المطور", singleDomainTitle: "نطاق واحد", singleDomainBody: "كل الأدوات تحت www.bobob.app لمراجعة AdSense أوضح وسلطة بحث أقوى.", localFirstTitle: "محلي أولا", localFirstBody: "التنسيق وفك الترميز والإنشاء تعمل في المتصفح كلما أمكن.", expandableRegistryTitle: "سجل قابل للتوسع", expandableRegistryBody: "كل أداة جديدة تحتاج بيانات وصفية ولغة وأمثلة وأسئلة شائعة وأدلة وروابط مرتبطة وفحوصا سريعة.", examplesDescription: "نقاط بداية لهذه الأداة", faqDescription: "تفاصيل تنفيذ شائعة", guidesDescription: "سير عمل مرتبط بهذه الأداة", useCases: "حالات الاستخدام", copy: "نسخ", copied: "تم النسخ", privacy: "الخصوصية", serverRequired: "فحص عبر الخادم", localOnly: "محلي في المتصفح" },
    guides: { badge: "الأدلة", title: "أدلة عملية لأدوات المتصفح", description: "مقالات قصيرة تشرح سير العمل خلف الأدوات.", back: "العودة إلى الأدلة", relatedTitle: "أدوات مرتبطة", relatedDescription: "افتح الأداة المرتبطة بهذا الدليل." },
    theme: { light: "فاتح", dark: "داكن", system: "النظام" },
  },
};

const commonLocaleOverrides = Object.fromEntries(
  locales.map((locale) => [
    locale,
    {
      ...commonText[locale],
      categories: localizedCategories[locale],
      toolUi: { ...enToolUi, ...localizedToolUi[locale], ...localizedToolUiSupplement[locale], ...localizedResultToolUi[locale], ...localizedJsonEscapeToolUi[locale], ...localizedYamlValidatorToolUi[locale], ...localizedEnvParserToolUi[locale] },
    },
  ]),
) as unknown as Record<Locale, CommonLocaleOverride>;

const dictionaryOverrides: Partial<Record<Locale, CommonLocaleOverride>> = {
  ko: {
    siteDescription: "포맷, 인코딩, 테스트, 변환, SEO, 네트워크, 색상, 시간, 텍스트 작업을 위한 무료 개발자 도구 모음.",
    nav: {
      searchPlaceholder: "도구 검색",
      guides: "가이드",
      tools: "도구",
      examples: "예제",
      faq: "FAQ",
      relatedTools: "관련 도구",
      relatedToolsDescription: "다음에 쓰기 좋은 도구",
      guideDescription: "검색 의도를 보강하는 가이드",
      language: "언어",
      theme: "테마",
    },
    home: {
      badge: "개발자 워크벤치",
      title: "매일 쓰는 개발 작업을 위한 실용적인 브라우저 도구.",
      description: "페이로드 포맷, 패턴 테스트, 토큰 확인, 메타데이터 생성, 텍스트 비교, 값 변환을 한 도메인에서 처리합니다.",
      openTools: "도구 열기",
      readGuides: "가이드 읽기",
      toolIndexTitle: "도구 목록",
      toolIndexDescription: "SEO, 내비게이션, 언어, 검증이 등록 구조로 연결된 유틸리티입니다.",
    },
    tool: {
      developerWorkbench: "개발자 워크벤치",
      singleDomainTitle: "단일 도메인",
      singleDomainBody: "모든 도구를 www.bobob.app 아래에 두어 AdSense 심사와 검색 권위를 정리합니다.",
      localFirstTitle: "로컬 우선",
      localFirstBody: "가능한 포맷, 디코딩, 생성 작업은 브라우저에서 실행합니다.",
      expandableRegistryTitle: "확장형 등록 구조",
      expandableRegistryBody: "새 도구는 메타데이터, 언어, 예제, FAQ, 가이드, 관련 링크, 기본 검증을 함께 가져야 합니다.",
      examplesDescription: "이 도구를 시작하기 좋은 입력값",
      guidesDescription: "도구와 연결된 작업 흐름",
      useCases: "사용 사례",
      copy: "복사",
      copied: "복사됨",
      privacy: "개인정보",
      serverRequired: "서버 검사",
      localOnly: "브라우저 로컬",
    },
    guides: {
      badge: "가이드",
      title: "브라우저 유틸리티 실전 가이드",
      description: "일반 블로그가 아니라 도구 사용 맥락을 보강하는 짧은 가이드입니다.",
      back: "가이드로 돌아가기",
      relatedTitle: "관련 도구",
      relatedDescription: "이 가이드와 연결된 도구를 엽니다.",
    },
    theme: {
      light: "라이트",
      dark: "다크",
      system: "시스템",
    },
    metadata: {
      homeTitle: "Bob's Multi Tool - 실용적인 개발자 유틸리티",
      homeDescription: "JSON, regex, Base64, JWT, cron, timestamp, UUID, SEO, color, network, text 변환을 위한 무료 온라인 개발자 도구.",
      guidesTitle: "개발자 유틸리티 가이드",
      guidesDescription: "Bob's Multi Tool 도구를 실무에서 쓰기 위한 짧은 가이드.",
      toolDescription: (title) => `${title}를 Bob's Multi Tool에서 빠르게 사용하세요. 예제, FAQ, 관련 도구, 로컬 우선 개인정보 처리를 함께 제공합니다.`,
      guideDescription: (title) => `${title}. 브라우저 기반 개발자 도구를 안전하고 효율적으로 쓰기 위한 실전 가이드입니다.`,
    },
  },
  ja: {
    siteDescription: "整形、エンコード、テスト、変換、SEO、ネットワーク、色、時間、テキスト作業のための無料開発者ツール集。",
    home: {
      badge: "開発者ワークベンチ",
      title: "日常の開発作業に使える実用的なブラウザツール。",
      description: "ペイロード整形、パターンテスト、トークン確認、メタデータ生成、テキスト比較、値変換を単一ドメインで行えます。",
    },
    metadata: {
      homeTitle: "Bob's Multi Tool - 実用的な開発者ユーティリティ",
      homeDescription: "JSON、regex、Base64、JWT、cron、timestamp、UUID、SEO、color、network、text 変換の無料オンライン開発者ツール。",
      toolDescription: (title) => `${title} を Bob's Multi Tool で使えます。例、FAQ、関連ツール、ローカル優先のプライバシーを備えています。`,
      guideDescription: (title) => `${title}。ブラウザベースの開発者ツールを安全かつ効率的に使うための実用ガイドです。`,
    },
  },
  es: {
    siteDescription: "Banco de herramientas gratis para formateo, codificacion, pruebas, conversion, SEO, red, color, tiempo y texto.",
    home: {
      badge: "Mesa de trabajo",
      title: "Herramientas de navegador practicas para flujos diarios de desarrollo.",
      description: "Formatea datos, prueba patrones, inspecciona tokens, genera metadatos, compara texto y convierte valores en un solo dominio.",
      openTools: "Abrir herramientas",
      readGuides: "Leer guias",
    },
    metadata: {
      homeTitle: "Bob's Multi Tool - Utilidades practicas para desarrolladores",
      homeDescription: "Herramientas gratis para JSON, regex, Base64, JWT, cron, timestamps, UUID, SEO, color, red y texto.",
      toolDescription: (title) => `${title} en Bob's Multi Tool. Usa una utilidad rapida con ejemplos, FAQ, herramientas relacionadas y privacidad local cuando sea posible.`,
      guideDescription: (title) => `${title}. Guia practica para usar utilidades de navegador de forma segura y eficiente.`,
    },
  },
  "pt-BR": {
    siteDescription: "Ferramentas gratis para formatar, codificar, testar, converter, SEO, rede, cor, tempo e texto.",
    home: {
      badge: "Ambiente de desenvolvimento",
      title: "Ferramentas de navegador praticas para fluxos diarios de desenvolvimento.",
      description: "Formate payloads, teste padroes, inspecione tokens, gere metadados, compare texto e converta valores em um unico dominio.",
    },
    metadata: {
      homeTitle: "Bob's Multi Tool - Utilitarios praticos para desenvolvedores",
      homeDescription: "Ferramentas gratis para JSON, regex, Base64, JWT, cron, timestamps, UUID, SEO, cor, rede e texto.",
      toolDescription: (title) => `${title} no Bob's Multi Tool. Use uma ferramenta rapida com exemplos, FAQ, ferramentas relacionadas e privacidade local quando possivel.`,
      guideDescription: (title) => `${title}. Guia pratica para usar utilitarios de navegador com seguranca e eficiencia.`,
    },
  },
  de: {
    siteDescription: "Kostenlose Entwicklertools fuer Formatierung, Encoding, Tests, Konvertierung, SEO, Netzwerk, Farbe, Zeit und Text.",
    metadata: {
      homeTitle: "Bob's Multi Tool - Praktische Entwicklerwerkzeuge",
      homeDescription: "Kostenlose Online-Tools fuer JSON, Regex, Base64, JWT, Cron, Zeitstempel, UUID, SEO, Farben, Netzwerk und Text.",
      toolDescription: (title) => `${title} in Bob's Multi Tool. Schnelle Entwicklerhilfe mit Beispielen, FAQ, verwandten Tools und lokaler Verarbeitung wenn moeglich.`,
      guideDescription: (title) => `${title}. Praktischer Leitfaden fuer sichere und effiziente Browser-Entwicklertools.`,
    },
  },
  fr: {
    siteDescription: "Outils developpeur gratuits pour formatage, encodage, tests, conversion, SEO, reseau, couleur, temps et texte.",
    metadata: {
      homeTitle: "Bob's Multi Tool - Utilitaires pratiques pour developpeurs",
      homeDescription: "Outils gratuits pour JSON, regex, Base64, JWT, cron, timestamps, UUID, SEO, couleur, reseau et texte.",
      toolDescription: (title) => `${title} dans Bob's Multi Tool. Utilitaire rapide avec exemples, FAQ, outils lies et traitement local quand possible.`,
      guideDescription: (title) => `${title}. Guide pratique pour utiliser les outils developpeur du navigateur de facon sure et efficace.`,
    },
  },
  hi: {
    siteDescription: "Data format, encoding, testing, conversion, SEO, network, color, time और text काम के लिए मुफ्त डेवलपर साधन.",
    metadata: {
      homeTitle: "Bob's Multi Tool - व्यावहारिक डेवलपर यूटिलिटी",
      homeDescription: "JSON, regex, Base64, JWT, cron, timestamp, UUID, SEO, color, network और text के लिए मुफ्त ऑनलाइन डेवलपर साधन.",
      toolDescription: (title) => `${title} Bob's Multi Tool पर. उदाहरण, FAQ, संबंधित साधन और जहां संभव हो ब्राउज़र-स्थानीय गोपनीयता के साथ तेज उपयोगिता.`,
      guideDescription: (title) => `${title}. ब्राउज़र आधारित डेवलपर साधनों को सुरक्षित और प्रभावी तरीके से इस्तेमाल करने की व्यवहारिक मार्गदर्शिका.`,
    },
  },
  id: {
    siteDescription: "Kumpulan alat developer gratis untuk format, encoding, testing, konversi, SEO, jaringan, warna, waktu, dan teks.",
    metadata: {
      homeTitle: "Bob's Multi Tool - Utilitas developer praktis",
      homeDescription: "Alat gratis untuk JSON, regex, Base64, JWT, cron, timestamp, UUID, SEO, warna, jaringan, dan teks.",
      toolDescription: (title) => `${title} di Bob's Multi Tool. Utilitas cepat dengan contoh, FAQ, alat terkait, dan privasi lokal bila memungkinkan.`,
      guideDescription: (title) => `${title}. Panduan praktis untuk memakai utilitas browser developer dengan aman dan efisien.`,
    },
  },
  vi: {
    siteDescription: "Bộ công cụ lập trình miễn phí cho định dạng, mã hóa, kiểm thử, chuyển đổi, SEO, mạng, màu sắc, thời gian và văn bản.",
    metadata: {
      homeTitle: "Bob's Multi Tool - Tiện ích lập trình thực dụng",
      homeDescription: "Công cụ miễn phí cho JSON, regex, Base64, JWT, cron, timestamp, UUID, SEO, màu sắc, mạng và văn bản.",
      toolDescription: (title) => `${title} trên Bob's Multi Tool. Công cụ nhanh với ví dụ, FAQ, công cụ liên quan và xử lý cục bộ khi có thể.`,
      guideDescription: (title) => `${title}. Hướng dẫn thực tế để dùng công cụ lập trình trên trình duyệt an toàn và hiệu quả.`,
    },
  },
  th: {
    siteDescription: "เครื่องมือนักพัฒนาฟรีสำหรับจัดรูปแบบ เข้ารหัส ทดสอบ แปลงค่า SEO เครือข่าย สี เวลา และข้อความ.",
    metadata: {
      homeTitle: "Bob's Multi Tool - เครื่องมือนักพัฒนาที่ใช้งานจริง",
      homeDescription: "เครื่องมือฟรีสำหรับ JSON, regex, Base64, JWT, cron, timestamp, UUID, SEO, สี, เครือข่าย และข้อความ.",
      toolDescription: (title) => `${title} ใน Bob's Multi Tool พร้อมตัวอย่าง FAQ เครื่องมือที่เกี่ยวข้อง และการประมวลผลในเบราว์เซอร์เมื่อทำได้.`,
      guideDescription: (title) => `${title}. คู่มือใช้งานเครื่องมือนักพัฒนาบนเบราว์เซอร์อย่างปลอดภัยและมีประสิทธิภาพ.`,
    },
  },
  ar: {
    dir: "rtl",
    siteDescription: "أدوات مطور مجانية للتنسيق والترميز والاختبار والتحويل وSEO والشبكات والألوان والوقت والنص.",
    metadata: {
      homeTitle: "Bob's Multi Tool - أدوات مطور عملية",
      homeDescription: "أدوات مجانية لـ JSON وregex وBase64 وJWT وcron وtimestamps وUUID وSEO والألوان والشبكات والنص.",
      toolDescription: (title) => `${title} في Bob's Multi Tool مع أمثلة وأسئلة شائعة وأدوات مرتبطة ومعالجة محلية في المتصفح عندما يكون ذلك ممكنا.`,
      guideDescription: (title) => `${title}. دليل عملي لاستخدام أدوات المطور في المتصفح بأمان وكفاءة.`,
    },
  },
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  const commonOverride = commonLocaleOverrides[locale];
  const localeOverride = dictionaryOverrides[locale];
  return {
    ...en,
    ...commonOverride,
    ...localeOverride,
    nav: { ...en.nav, ...commonOverride?.nav, ...localeOverride?.nav },
    home: { ...en.home, ...commonOverride?.home, ...localeOverride?.home },
    tool: { ...en.tool, ...localizedToolDetailText[locale], ...commonOverride?.tool, noOutput: localizedNoOutput[locale], ...localeOverride?.tool },
    toolUi: { ...en.toolUi, ...commonOverride?.toolUi, ...localeOverride?.toolUi },
    guides: { ...en.guides, ...commonOverride?.guides, ...localeOverride?.guides },
    theme: { ...en.theme, ...commonOverride?.theme, ...localeOverride?.theme },
    metadata: { ...en.metadata, ...commonOverride?.metadata, ...localeOverride?.metadata },
    categories: { ...en.categories, ...commonOverride?.categories, ...localeOverride?.categories },
  };
}

export function getClientDictionary(locale: Locale = defaultLocale): ClientDictionary {
  const dictionary = getDictionary(locale);
  return {
    dir: dictionary.dir,
    siteDescription: dictionary.siteDescription,
    nav: dictionary.nav,
    home: dictionary.home,
    tool: dictionary.tool,
    toolUi: dictionary.toolUi,
    guides: dictionary.guides,
    theme: dictionary.theme,
    categories: dictionary.categories,
  };
}
