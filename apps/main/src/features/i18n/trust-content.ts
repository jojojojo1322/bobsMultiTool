import { defaultLocale, type Locale } from "@/features/i18n/config";

export type TrustPageKind = "about" | "contact";

type TrustSection = {
  heading: string;
  body: string;
};

export type TrustPageContent = {
  title: string;
  description: string;
  lastUpdated: string;
  backToTools: string;
  sections: TrustSection[];
  primaryLink: {
    label: string;
    href: string;
  };
};

const english: Record<TrustPageKind, TrustPageContent> = {
  about: {
    title: "About Bob's Multi Tool",
    description: "A focused developer utility workbench for formatting, decoding, validation, generation, SEO, and network checks.",
    lastUpdated: "Last updated: June 11, 2026",
    backToTools: "Back to tools",
    sections: [
      {
        heading: "What this site provides",
        body: "Bob's Multi Tool is a practical collection of browser-first developer utilities. It is built for quick tasks such as formatting JSON, checking JWT payloads, generating UUIDs, testing regex patterns, creating QR codes, and debugging public DNS or HTTP behavior.",
      },
      {
        heading: "Local-first workflow",
        body: "Most tools run directly in your browser so input can stay on your device. Tools that require public network checks, such as DNS lookup and HTTP status checks, use small server routes and reject private or local hosts.",
      },
      {
        heading: "Content and maintenance",
        body: "Each tool is paired with examples, failure cases, copy checks, FAQs, and related next tools so visitors can complete a real workflow instead of reading generic filler content.",
      },
      {
        heading: "How tools are selected",
        body: "New utilities are prioritized when they solve repeat developer tasks with deterministic output, clear review steps, and low privacy risk. Formatters, validators, generators, conversion helpers, SEO checks, and public network checks fit the site because users can verify the result immediately.",
      },
      {
        heading: "Core utility coverage",
        body: "The current workbench focuses on high-demand task clusters: JSON and data cleanup, regex and text review, JWT and token inspection, Base64 and encoding, cron and time conversion, UUID and password generation, hash and HMAC checks, QR payload building, DNS and HTTP diagnostics, color contrast, SEO metadata, sitemap and robots review, plus SQL, CSS, and JavaScript formatting.",
      },
      {
        heading: "How pages stay useful",
        body: "Tool pages are maintained as working surfaces first. The input and output area appears before reference material, while examples, diagnostics, failure cases, copy checklists, guides, and related tools explain how to review the result before using it elsewhere.",
      },
      {
        heading: "Accessibility and navigation",
        body: "The site keeps keyboard-reachable controls, localized route paths, sitemap coverage, trust links, and predictable navigation so users can move from a search query to a tool, then continue into the next related task without landing on empty or unfinished pages.",
      },
      {
        heading: "International coverage",
        body: "Default English pages stay unprefixed, while localized routes provide translated tool titles, descriptions, examples, FAQ, guide leads, trust pages, legal pages, and sitemap entries. Locale support is checked so non-English visitors are not sent to a page made only from raw English registry text.",
      },
      {
        heading: "Review workflow before copying",
        body: "Formatter, validator, generator, network, and SEO pages are written around a review loop: paste or enter a safe example, inspect diagnostics and warnings, compare the result with the target runtime or platform, then copy only the part that still fits the task.",
      },
      {
        heading: "Public trust surface",
        body: "The site keeps crawlable about, contact, privacy, terms, tool directory, tool detail, guide, and localized pages in the sitemap. Canonical routes, locale alternates, redirects, and public verification files are maintained so crawlers and visitors can reach complete pages instead of dead ends.",
      },
    ],
    primaryLink: {
      label: "Open the tool index",
      href: "/tools",
    },
  },
  contact: {
    title: "Contact",
    description: "Contact Bob's Multi Tool for site questions, tool issues, content corrections, and policy requests.",
    lastUpdated: "Last updated: June 11, 2026",
    backToTools: "Back to tools",
    sections: [
      {
        heading: "Email",
        body: "For site questions, tool issues, content corrections, or policy requests, email bobob935@gmail.com. Include the page URL, input type, browser, and expected result when reporting a tool problem.",
      },
      {
        heading: "Responsible use",
        body: "Do not send passwords, private keys, live access tokens, customer data, or confidential internal hostnames. Redact sensitive values before sending examples.",
      },
      {
        heading: "Site operation",
        body: "The site is maintained as a free developer utility workbench. Feedback that improves accuracy, navigation, accessibility, localization, or practical workflow coverage is prioritized.",
      },
      {
        heading: "Useful issue reports",
        body: "The most useful reports include the exact page URL, the browser or device, a small redacted input sample, the output you expected, and the output you received. This makes it possible to reproduce formatter, parser, validation, or layout problems without exposing private data.",
      },
      {
        heading: "Before sending a report",
        body: "If the issue is about a public URL, check whether the target URL itself returns a final response and whether redirects, DNS, robots rules, or security headers explain the result. If the issue is about generated text or code, include the runtime, parser, scheduler, browser, or platform where the copied output will be used.",
      },
      {
        heading: "Content corrections",
        body: "Corrections are welcome for inaccurate examples, unclear warnings, outdated browser behavior, localization mistakes, broken guide links, and places where a tool needs a stronger review checklist before output is copied into a project.",
      },
      {
        heading: "Response priorities",
        body: "Reports that affect core tool accuracy, privacy expectations, public crawlability, accessibility, localization quality, broken navigation, or misleading output are handled before cosmetic requests. Reproducible examples are more useful than screenshots alone because they can be tested against the same tool surface.",
      },
      {
        heading: "Safety boundaries",
        body: "Requests that would require handling live secrets, private network targets, customer records, account recovery data, or unlawful activity are not suitable for this public utility site. Use redacted examples and run private checks inside your own environment.",
      },
      {
        heading: "What to include in content feedback",
        body: "For guide or tool copy feedback, include the exact page, the sentence or label that is confusing, the language route if localization is involved, and the safer wording or source behavior you expected. This keeps corrections tied to visible user impact.",
      },
      {
        heading: "Requests this inbox cannot handle",
        body: "This contact channel cannot recover accounts, inspect private infrastructure, receive live credentials, provide legal decisions, or replace a production security review. Reports should use safe public examples and stay focused on site quality or tool behavior.",
      },
    ],
    primaryLink: {
      label: "Email bobob935@gmail.com",
      href: "mailto:bobob935@gmail.com",
    },
  },
};

const localized: Record<Exclude<Locale, "en">, Record<TrustPageKind, TrustPageContent>> = {
  ko: {
    about: {
      title: "Bob's Multi Tool 소개",
      description: "포맷, 디코딩, 검증, 생성, SEO, 네트워크 확인을 위한 개발자 유틸리티 워크벤치입니다.",
      lastUpdated: "최종 업데이트: 2026년 6월 11일",
      backToTools: "도구로 돌아가기",
      sections: [
        { heading: "사이트가 제공하는 것", body: "Bob's Multi Tool은 브라우저 우선 개발자 유틸리티 모음입니다. JSON 포맷, JWT 확인, UUID 생성, regex 테스트, QR 코드 생성, 공개 DNS 또는 HTTP 동작 확인처럼 빠르게 끝내야 하는 작업을 위해 만들었습니다." },
        { heading: "로컬 우선 작업 방식", body: "대부분의 도구는 브라우저에서 직접 실행되어 입력값이 기기에 남을 수 있습니다. DNS 조회와 HTTP 상태 확인처럼 공개 네트워크 검사가 필요한 도구만 작은 서버 route를 사용하며, 비공개 또는 로컬 호스트는 거부합니다." },
        { heading: "콘텐츠와 유지관리", body: "각 도구에는 예제, 실패 사례, 복사 전 확인, FAQ, 관련 다음 도구를 함께 두어 일반적인 설명이 아니라 실제 작업 흐름을 끝낼 수 있게 합니다." },
      ],
      primaryLink: { label: "도구 목록 열기", href: "/tools" },
    },
    contact: {
      title: "문의",
      description: "사이트 질문, 도구 문제, 콘텐츠 수정, 정책 요청을 Bob's Multi Tool에 보낼 수 있습니다.",
      lastUpdated: "최종 업데이트: 2026년 6월 11일",
      backToTools: "도구로 돌아가기",
      sections: [
        { heading: "이메일", body: "사이트 질문, 도구 문제, 콘텐츠 수정, 정책 요청은 bobob935@gmail.com 으로 보내세요. 도구 문제를 보낼 때는 페이지 URL, 입력 유형, 브라우저, 기대한 결과를 함께 적어 주세요." },
        { heading: "안전한 공유", body: "비밀번호, 개인 키, 실제 access token, 고객 데이터, 비공개 내부 호스트명은 보내지 마세요. 예제를 보낼 때는 민감한 값을 제거한 뒤 공유하세요." },
        { heading: "사이트 운영", body: "이 사이트는 무료 개발자 유틸리티 워크벤치로 운영됩니다. 정확도, 탐색, 접근성, 번역 품질, 실제 작업 흐름을 개선하는 피드백을 우선합니다." },
      ],
      primaryLink: { label: "bobob935@gmail.com으로 이메일 보내기", href: "mailto:bobob935@gmail.com" },
    },
  },
  ja: {
    about: {
      title: "Bob's Multi Tool について",
      description: "整形、デコード、検証、生成、SEO、ネットワーク確認を、ブラウザ中心の例と確認手順付きで扱う開発者ユーティリティワークベンチです。",
      lastUpdated: "最終更新日: 2026年6月11日",
      backToTools: "ツールへ戻る",
      sections: [
        { heading: "このサイトが提供するもの", body: "Bob's Multi Tool はブラウザ優先の開発者ユーティリティ集です。JSON 整形、JWT 確認、UUID 生成、regex テスト、QR コード生成、公開 DNS や HTTP の確認など、短時間で終えたい作業向けに作られています。" },
        { heading: "ローカル優先の流れ", body: "ほとんどのツールはブラウザ内で直接実行されるため、入力を端末側に保てます。DNS lookup や HTTP status のような公開ネットワーク確認だけは小さな server route を使い、非公開またはローカル host は拒否します。" },
        { heading: "コンテンツと保守", body: "各ツールには例、失敗ケース、コピー前チェック、FAQ、関連する次のツールを置き、一般論ではなく実際の作業フローを完了できるようにしています。" },
      ],
      primaryLink: { label: "ツール一覧を開く", href: "/tools" },
    },
    contact: {
      title: "問い合わせ",
      description: "サイトの質問、ツールの問題、内容修正、ポリシー依頼を Bob's Multi Tool に送れます。",
      lastUpdated: "最終更新日: 2026年6月11日",
      backToTools: "ツールへ戻る",
      sections: [
        { heading: "メール", body: "サイトの質問、ツールの問題、内容修正、ポリシー依頼は bobob935@gmail.com へ送ってください。問題報告ではページ URL、入力の種類、ブラウザ、期待した結果を含めてください。" },
        { heading: "安全な共有", body: "パスワード、秘密鍵、本番 access token、顧客データ、非公開の内部 host 名は送らないでください。例を共有する前に機密値を削除してください。" },
        { heading: "サイト運営", body: "このサイトは無料の開発者ユーティリティワークベンチとして保守されています。正確性、ナビゲーション、アクセシビリティ、翻訳品質、実用的なワークフローを改善するフィードバックを優先します。" },
      ],
      primaryLink: { label: "bobob935@gmail.com にメール", href: "mailto:bobob935@gmail.com" },
    },
  },
  "zh-CN": {
    about: {
      title: "关于 Bob's Multi Tool",
      description: "用于格式化、解码、验证、生成、SEO 和网络检查的开发者工具工作台，强调浏览器本地处理、示例、检查项和相关工具路径。",
      lastUpdated: "最后更新: 2026年6月11日",
      backToTools: "返回工具",
      sections: [
        { heading: "本站提供什么", body: "Bob's Multi Tool 是一组浏览器优先的开发者工具。它面向 JSON 格式化、JWT 检查、UUID 生成、regex 测试、QR 码生成，以及公开 DNS 或 HTTP 调试等快速任务。" },
        { heading: "本地优先流程", body: "大多数工具直接在浏览器中运行，让输入尽量留在你的设备上。DNS lookup 和 HTTP status 等需要公开网络检查的工具会使用小型 server route，并拒绝私有或本地主机。" },
        { heading: "内容和维护", body: "每个工具都配有示例、失败场景、复制前检查、FAQ 和相关下一步工具，帮助访客完成真实工作流，而不是阅读泛泛内容。" },
      ],
      primaryLink: { label: "打开工具索引", href: "/tools" },
    },
    contact: {
      title: "联系",
      description: "向 Bob's Multi Tool 发送网站问题、工具问题、内容修正和政策请求，并了解报告工具错误时应提供的页面、输入、浏览器和预期结果。",
      lastUpdated: "最后更新: 2026年6月11日",
      backToTools: "返回工具",
      sections: [
        { heading: "邮箱", body: "网站问题、工具问题、内容修正或政策请求可发送到 bobob935@gmail.com。报告工具问题时请包含页面 URL、输入类型、浏览器和预期结果。" },
        { heading: "负责任地共享", body: "请不要发送密码、私钥、真实 access token、客户数据或机密内部主机名。发送示例前请先移除敏感值。" },
        { heading: "网站运营", body: "本站作为免费的开发者工具工作台维护。能改进准确性、导航、可访问性、本地化和实际工作流覆盖的反馈会被优先处理。" },
      ],
      primaryLink: { label: "发送邮件到 bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  "zh-TW": {
    about: {
      title: "關於 Bob's Multi Tool",
      description: "用於格式化、解碼、驗證、產生、SEO 與網路檢查的開發者工具工作台，強調瀏覽器本機處理、範例、檢查項與相關工具路徑。",
      lastUpdated: "最後更新: 2026年6月11日",
      backToTools: "返回工具",
      sections: [
        { heading: "本站提供什麼", body: "Bob's Multi Tool 是一組瀏覽器優先的開發者工具。它面向 JSON 格式化、JWT 檢查、UUID 產生、regex 測試、QR 碼產生，以及公開 DNS 或 HTTP 除錯等快速任務。" },
        { heading: "本機優先流程", body: "大多數工具直接在瀏覽器中執行，讓輸入盡量留在你的裝置上。DNS lookup 和 HTTP status 等需要公開網路檢查的工具會使用小型 server route，並拒絕私有或本機主機。" },
        { heading: "內容與維護", body: "每個工具都配有範例、失敗情境、複製前檢查、FAQ 與相關下一步工具，協助訪客完成真實工作流程，而不是閱讀泛泛內容。" },
      ],
      primaryLink: { label: "開啟工具索引", href: "/tools" },
    },
    contact: {
      title: "聯絡",
      description: "向 Bob's Multi Tool 傳送網站問題、工具問題、內容修正與政策請求，並了解回報工具錯誤時應提供的頁面、輸入、瀏覽器與預期結果。",
      lastUpdated: "最後更新: 2026年6月11日",
      backToTools: "返回工具",
      sections: [
        { heading: "電子郵件", body: "網站問題、工具問題、內容修正或政策請求可寄到 bobob935@gmail.com。回報工具問題時請包含頁面 URL、輸入類型、瀏覽器與預期結果。" },
        { heading: "負責任地分享", body: "請不要寄送密碼、私鑰、真實 access token、客戶資料或機密內部主機名稱。傳送範例前請先移除敏感值。" },
        { heading: "網站營運", body: "本站作為免費的開發者工具工作台維護。能改善準確性、導覽、可及性、本地化與實際工作流程覆蓋的回饋會優先處理。" },
      ],
      primaryLink: { label: "寄信到 bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  es: {
    about: {
      title: "Acerca de Bob's Multi Tool",
      description: "Un banco de utilidades para desarrolladores dedicado a formato, decodificacion, validacion, generacion, SEO y red.",
      lastUpdated: "Ultima actualizacion: 11 de junio de 2026",
      backToTools: "Volver a herramientas",
      sections: [
        { heading: "Que ofrece el sitio", body: "Bob's Multi Tool es una coleccion de utilidades para desarrolladores que priorizan el navegador. Sirve para tareas rapidas como formatear JSON, revisar JWT, generar UUID, probar regex, crear codigos QR y depurar DNS o HTTP publicos." },
        { heading: "Flujo local primero", body: "La mayoria de herramientas se ejecuta directamente en el navegador para que la entrada pueda quedarse en tu dispositivo. Las herramientas que necesitan red publica, como DNS lookup y HTTP status, usan rutas de servidor pequenas y rechazan hosts privados o locales." },
        { heading: "Contenido y mantenimiento", body: "Cada herramienta incluye ejemplos, fallos comunes, comprobaciones antes de copiar, FAQ y siguientes herramientas relacionadas para completar un flujo real, no contenido generico." },
      ],
      primaryLink: { label: "Abrir indice de herramientas", href: "/tools" },
    },
    contact: {
      title: "Contacto",
      description: "Contacta con Bob's Multi Tool para preguntas del sitio, errores de herramientas, correcciones de contenido y solicitudes de politica.",
      lastUpdated: "Ultima actualizacion: 11 de junio de 2026",
      backToTools: "Volver a herramientas",
      sections: [
        { heading: "Email", body: "Para preguntas del sitio, errores de herramientas, correcciones de contenido o solicitudes de politica, escribe a bobob935@gmail.com. Incluye la URL, tipo de entrada, navegador y resultado esperado al reportar un problema." },
        { heading: "Uso responsable", body: "No envies contrasenas, claves privadas, access tokens reales, datos de clientes ni hostnames internos confidenciales. Redacta valores sensibles antes de enviar ejemplos." },
        { heading: "Operacion del sitio", body: "El sitio se mantiene como un banco gratuito de utilidades para desarrolladores. Se prioriza el feedback que mejore precision, navegacion, accesibilidad, localizacion o cobertura de flujos practicos." },
      ],
      primaryLink: { label: "Enviar email a bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  "pt-BR": {
    about: {
      title: "Sobre o Bob's Multi Tool",
      description: "Um ambiente de utilidades para desenvolvedores focado em formatacao, decodificacao, validacao, geracao, SEO e rede.",
      lastUpdated: "Ultima atualizacao: 11 de junho de 2026",
      backToTools: "Voltar para ferramentas",
      sections: [
        { heading: "O que o site oferece", body: "Bob's Multi Tool e uma colecao de utilitarios de desenvolvedor com prioridade para o navegador. Ele ajuda em tarefas rapidas como formatar JSON, revisar JWT, gerar UUID, testar regex, criar QR codes e depurar DNS ou HTTP publicos." },
        { heading: "Fluxo local primeiro", body: "A maioria das ferramentas roda diretamente no navegador para que a entrada possa ficar no seu dispositivo. Ferramentas que precisam de rede publica, como DNS lookup e HTTP status, usam pequenas rotas de servidor e rejeitam hosts privados ou locais." },
        { heading: "Conteudo e manutencao", body: "Cada ferramenta tem exemplos, falhas comuns, checagens antes de copiar, FAQ e proximas ferramentas relacionadas para concluir um fluxo real, nao conteudo generico." },
      ],
      primaryLink: { label: "Abrir indice de ferramentas", href: "/tools" },
    },
    contact: {
      title: "Contato",
      description: "Fale com o Bob's Multi Tool sobre perguntas do site, problemas nas ferramentas, correcoes de conteudo e pedidos de politica.",
      lastUpdated: "Ultima atualizacao: 11 de junho de 2026",
      backToTools: "Voltar para ferramentas",
      sections: [
        { heading: "Email", body: "Para perguntas do site, problemas nas ferramentas, correcoes de conteudo ou pedidos de politica, envie email para bobob935@gmail.com. Ao relatar um problema, inclua URL da pagina, tipo de entrada, navegador e resultado esperado." },
        { heading: "Uso responsavel", body: "Nao envie senhas, chaves privadas, access tokens reais, dados de clientes ou hostnames internos confidenciais. Remova valores sensiveis antes de enviar exemplos." },
        { heading: "Operacao do site", body: "O site e mantido como um ambiente gratuito de utilidades para desenvolvedores. Feedback que melhore precisao, navegacao, acessibilidade, localizacao ou fluxos praticos tem prioridade." },
      ],
      primaryLink: { label: "Enviar email para bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  de: {
    about: {
      title: "Ueber Bob's Multi Tool",
      description: "Ein fokussierter Entwickler-Arbeitsplatz fuer Formatierung, Decoding, Validierung, Generierung, SEO und Netzwerkchecks.",
      lastUpdated: "Zuletzt aktualisiert: 11. Juni 2026",
      backToTools: "Zurueck zu Tools",
      sections: [
        { heading: "Was diese Seite bietet", body: "Bob's Multi Tool ist eine browserorientierte Sammlung praktischer Entwickler-Utilities. Sie hilft bei schnellen Aufgaben wie JSON formatieren, JWT pruefen, UUIDs erzeugen, regex testen, QR-Codes erstellen und oeffentliches DNS- oder HTTP-Verhalten debuggen." },
        { heading: "Lokal zuerst", body: "Die meisten Tools laufen direkt im Browser, damit Eingaben auf deinem Geraet bleiben koennen. Tools fuer oeffentliche Netzwerkchecks wie DNS lookup und HTTP status nutzen kleine Serverrouten und lehnen private oder lokale Hosts ab." },
        { heading: "Inhalte und Pflege", body: "Jedes Tool enthaelt Beispiele, Fehlerfaelle, Kopierchecks, FAQ und verwandte naechste Tools, damit Besucher echte Workflows abschliessen koennen statt generische Inhalte zu lesen." },
      ],
      primaryLink: { label: "Werkzeugindex oeffnen", href: "/tools" },
    },
    contact: {
      title: "Kontakt",
      description: "Kontaktiere Bob's Multi Tool fuer Fragen zur Seite, Tool-Probleme, Inhaltskorrekturen und Richtlinienanfragen.",
      lastUpdated: "Zuletzt aktualisiert: 11. Juni 2026",
      backToTools: "Zurueck zu Tools",
      sections: [
        { heading: "E-Mail", body: "Fragen zur Seite, Tool-Probleme, Inhaltskorrekturen oder Richtlinienanfragen bitte an bobob935@gmail.com senden. Bei Tool-Problemen bitte Seiten-URL, Eingabetyp, Browser und erwartetes Ergebnis angeben." },
        { heading: "Verantwortliche Nutzung", body: "Sende keine Passwoerter, privaten Schluessel, echten access tokens, Kundendaten oder vertraulichen internen Hostnamen. Entferne sensible Werte, bevor du Beispiele sendest." },
        { heading: "Betrieb der Seite", body: "Die Seite wird als kostenloser Entwickler-Arbeitsplatz gepflegt. Feedback zu Genauigkeit, Navigation, Barrierefreiheit, Lokalisierung und praktischen Workflows hat Prioritaet." },
      ],
      primaryLink: { label: "E-Mail an bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  fr: {
    about: {
      title: "A propos de Bob's Multi Tool",
      description: "Un atelier d'utilitaires developpeur pour formatage, decodage, validation, generation, SEO et reseau.",
      lastUpdated: "Derniere mise a jour: 11 juin 2026",
      backToTools: "Retour aux outils",
      sections: [
        { heading: "Ce que le site fournit", body: "Bob's Multi Tool est une collection d'utilitaires developpeur orientes navigateur. Il aide aux taches rapides comme formater JSON, inspecter JWT, generer UUID, tester regex, creer des QR codes et deboguer DNS ou HTTP publics." },
        { heading: "Flux local d'abord", body: "La plupart des outils tournent directement dans le navigateur afin que l'entree puisse rester sur votre appareil. Les outils qui exigent des controles reseau publics, comme DNS lookup et HTTP status, utilisent de petites routes serveur et rejettent les hosts prives ou locaux." },
        { heading: "Contenu et maintenance", body: "Chaque outil contient exemples, cas d'echec, controles avant copie, FAQ et outils suivants lies pour terminer un vrai flux de travail plutot que lire du contenu generique." },
      ],
      primaryLink: { label: "Ouvrir l'index des outils", href: "/tools" },
    },
    contact: {
      title: "Contact Bob's Multi Tool",
      description: "Contactez Bob's Multi Tool pour questions du site, problemes d'outils, corrections de contenu et demandes de politique.",
      lastUpdated: "Derniere mise a jour: 11 juin 2026",
      backToTools: "Retour aux outils",
      sections: [
        { heading: "Email", body: "Pour les questions du site, problemes d'outils, corrections de contenu ou demandes de politique, ecrivez a bobob935@gmail.com. Pour un probleme d'outil, incluez l'URL, le type d'entree, le navigateur et le resultat attendu." },
        { heading: "Usage responsable", body: "N'envoyez pas de mots de passe, cles privees, access tokens reels, donnees client ou hostnames internes confidentiels. Supprimez les valeurs sensibles avant d'envoyer des exemples." },
        { heading: "Exploitation du site", body: "Le site est maintenu comme atelier gratuit d'utilitaires developpeur. Les retours qui ameliorent precision, navigation, accessibilite, localisation ou couverture de flux pratiques sont prioritaires." },
      ],
      primaryLink: { label: "Envoyer un email a bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  hi: {
    about: {
      title: "Bob's Multi Tool के बारे में",
      description: "formatting, decoding, validation, generation, SEO और network checks के लिए developer utility workbench.",
      lastUpdated: "अंतिम अपडेट: 11 जून 2026",
      backToTools: "टूल पर वापस",
      sections: [
        { heading: "यह साइट क्या देती है", body: "Bob's Multi Tool browser-first developer utilities का practical संग्रह है. यह JSON format करने, JWT देखने, UUID बनाने, regex test करने, QR code बनाने और public DNS या HTTP behavior debug करने जैसे तेज कामों के लिए बनाया गया है." },
        { heading: "Local-first workflow", body: "अधिकतर tools सीधे browser में चलते हैं ताकि input आपके device पर रह सके. DNS lookup और HTTP status जैसे public network checks के लिए छोटे server routes इस्तेमाल होते हैं और private या local hosts reject होते हैं." },
        { heading: "Content और maintenance", body: "हर tool में examples, failure cases, copy checks, FAQ और related next tools हैं ताकि visitor generic content पढ़ने के बजाय असली workflow पूरा कर सके." },
      ],
      primaryLink: { label: "Tool index खोलें", href: "/tools" },
    },
    contact: {
      title: "संपर्क",
      description: "Site questions, tool issues, content corrections और policy requests के लिए Bob's Multi Tool से संपर्क करें.",
      lastUpdated: "अंतिम अपडेट: 11 जून 2026",
      backToTools: "टूल पर वापस",
      sections: [
        { heading: "Email", body: "Site questions, tool issues, content corrections या policy requests के लिए bobob935@gmail.com पर email करें. Tool problem report करते समय page URL, input type, browser और expected result शामिल करें." },
        { heading: "Responsible use", body: "Passwords, private keys, live access tokens, customer data या confidential internal hostnames न भेजें. Examples भेजने से पहले sensitive values हटाएं." },
        { heading: "Site operation", body: "यह site free developer utility workbench के रूप में maintain होती है. Accuracy, navigation, accessibility, localization या practical workflow coverage सुधारने वाला feedback priority है." },
      ],
      primaryLink: { label: "bobob935@gmail.com पर email करें", href: "mailto:bobob935@gmail.com" },
    },
  },
  id: {
    about: {
      title: "Tentang Bob's Multi Tool",
      description: "Workbench utilitas developer untuk format, decoding, validasi, pembuatan, SEO, dan pemeriksaan jaringan.",
      lastUpdated: "Terakhir diperbarui: 11 Juni 2026",
      backToTools: "Kembali ke alat",
      sections: [
        { heading: "Apa yang disediakan situs ini", body: "Bob's Multi Tool adalah kumpulan utilitas developer yang mengutamakan browser. Alat ini dibuat untuk tugas cepat seperti memformat JSON, memeriksa JWT, membuat UUID, menguji regex, membuat QR code, dan men-debug DNS atau HTTP publik." },
        { heading: "Alur lokal lebih dulu", body: "Sebagian besar alat berjalan langsung di browser agar masukan dapat tetap berada di perangkat Anda. Alat yang membutuhkan pemeriksaan jaringan publik, seperti DNS lookup dan HTTP status, memakai route server kecil dan menolak host privat atau lokal." },
        { heading: "Konten dan pemeliharaan", body: "Setiap alat dilengkapi contoh, kasus kegagalan, pengecekan sebelum menyalin, FAQ, dan alat lanjutan terkait agar pengunjung bisa menyelesaikan alur kerja nyata." },
      ],
      primaryLink: { label: "Buka indeks alat", href: "/tools" },
    },
    contact: {
      title: "Kontak",
      description: "Hubungi Bob's Multi Tool untuk pertanyaan situs, masalah alat, koreksi konten, dan permintaan kebijakan.",
      lastUpdated: "Terakhir diperbarui: 11 Juni 2026",
      backToTools: "Kembali ke alat",
      sections: [
        { heading: "Email", body: "Untuk pertanyaan situs, masalah alat, koreksi konten, atau permintaan kebijakan, kirim email ke bobob935@gmail.com. Sertakan URL halaman, jenis masukan, browser, dan hasil yang diharapkan saat melaporkan masalah alat." },
        { heading: "Penggunaan bertanggung jawab", body: "Jangan kirim password, private key, access token aktif, data pelanggan, atau hostname internal rahasia. Hapus nilai sensitif sebelum mengirim contoh." },
        { heading: "Operasi situs", body: "Situs ini dipelihara sebagai workbench utilitas developer gratis. Feedback yang meningkatkan akurasi, navigasi, aksesibilitas, lokalisasi, atau cakupan alur praktis diprioritaskan." },
      ],
      primaryLink: { label: "Email bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  vi: {
    about: {
      title: "Giới thiệu Bob's Multi Tool",
      description: "Bàn công cụ lập trình cho định dạng, giải mã, kiểm tra, tạo dữ liệu, SEO và kiểm tra mạng.",
      lastUpdated: "Cập nhật lần cuối: 11 tháng 6, 2026",
      backToTools: "Quay lại công cụ",
      sections: [
        { heading: "Trang này cung cấp gì", body: "Bob's Multi Tool là bộ tiện ích lập trình ưu tiên trình duyệt. Nó phục vụ các tác vụ nhanh như định dạng JSON, kiểm tra JWT, tạo UUID, thử regex, tạo QR code và gỡ lỗi DNS hoặc HTTP công khai." },
        { heading: "Quy trình ưu tiên cục bộ", body: "Hầu hết công cụ chạy trực tiếp trong trình duyệt để dữ liệu nhập có thể ở lại trên thiết bị của bạn. Công cụ cần kiểm tra mạng công khai, như DNS lookup và HTTP status, dùng route server nhỏ và từ chối host riêng tư hoặc cục bộ." },
        { heading: "Nội dung và bảo trì", body: "Mỗi công cụ có ví dụ, lỗi thường gặp, kiểm tra trước khi sao chép, FAQ và công cụ liên quan để người dùng hoàn thành quy trình thật thay vì đọc nội dung chung chung." },
      ],
      primaryLink: { label: "Mở danh mục công cụ", href: "/tools" },
    },
    contact: {
      title: "Liên hệ",
      description: "Liên hệ Bob's Multi Tool về câu hỏi trang, lỗi công cụ, sửa nội dung và yêu cầu chính sách.",
      lastUpdated: "Cập nhật lần cuối: 11 tháng 6, 2026",
      backToTools: "Quay lại công cụ",
      sections: [
        { heading: "Email", body: "Với câu hỏi trang, lỗi công cụ, sửa nội dung hoặc yêu cầu chính sách, gửi email tới bobob935@gmail.com. Khi báo lỗi công cụ, hãy kèm URL trang, loại dữ liệu nhập, trình duyệt và kết quả mong đợi." },
        { heading: "Sử dụng có trách nhiệm", body: "Không gửi mật khẩu, private key, access token thật, dữ liệu khách hàng hoặc hostname nội bộ bí mật. Hãy xóa giá trị nhạy cảm trước khi gửi ví dụ." },
        { heading: "Vận hành trang", body: "Trang được duy trì như bàn công cụ lập trình miễn phí. Phản hồi cải thiện độ chính xác, điều hướng, khả năng truy cập, bản địa hóa hoặc quy trình thực tế được ưu tiên." },
      ],
      primaryLink: { label: "Gửi email tới bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  th: {
    about: {
      title: "เกี่ยวกับ Bob's Multi Tool",
      description: "พื้นที่เครื่องมือนักพัฒนาสำหรับจัดรูปแบบ ถอดรหัส ตรวจสอบ สร้างข้อมูล SEO และตรวจเครือข่าย",
      lastUpdated: "อัปเดตล่าสุด: 11 มิถุนายน 2026",
      backToTools: "กลับไปเครื่องมือ",
      sections: [
        { heading: "ไซต์นี้มีอะไร", body: "Bob's Multi Tool คือชุดเครื่องมือนักพัฒนาที่ให้เบราว์เซอร์เป็นหลัก ใช้กับงานเร็ว ๆ เช่นจัดรูปแบบ JSON ตรวจ JWT สร้าง UUID ทดสอบ regex สร้าง QR code และตรวจ DNS หรือ HTTP สาธารณะ" },
        { heading: "ทำงานในเครื่องก่อน", body: "เครื่องมือส่วนใหญ่ทำงานในเบราว์เซอร์โดยตรงเพื่อให้ข้อมูลอยู่บนอุปกรณ์ของคุณ เครื่องมือที่ต้องตรวจเครือข่ายสาธารณะ เช่น DNS lookup และ HTTP status ใช้ route server ขนาดเล็กและปฏิเสธ host ส่วนตัวหรือ local" },
        { heading: "เนื้อหาและการดูแล", body: "แต่ละเครื่องมือมีตัวอย่าง กรณีผิดพลาด จุดตรวจก่อนคัดลอก FAQ และเครื่องมือถัดไปที่เกี่ยวข้อง เพื่อให้ผู้ใช้จบ workflow จริงได้ ไม่ใช่อ่านเนื้อหาทั่วไป" },
      ],
      primaryLink: { label: "เปิดดัชนีเครื่องมือ", href: "/tools" },
    },
    contact: {
      title: "ติดต่อ",
      description: "ติดต่อ Bob's Multi Tool สำหรับคำถามเกี่ยวกับไซต์ ปัญหาเครื่องมือ การแก้เนื้อหา และคำขอนโยบาย",
      lastUpdated: "อัปเดตล่าสุด: 11 มิถุนายน 2026",
      backToTools: "กลับไปเครื่องมือ",
      sections: [
        { heading: "อีเมล", body: "สำหรับคำถามเกี่ยวกับไซต์ ปัญหาเครื่องมือ การแก้เนื้อหา หรือคำขอนโยบาย ส่งอีเมลไปที่ bobob935@gmail.com เมื่อรายงานปัญหาเครื่องมือ ให้ใส่ URL หน้า ประเภท input เบราว์เซอร์ และผลลัพธ์ที่คาดหวัง" },
        { heading: "ใช้งานอย่างรับผิดชอบ", body: "อย่าส่งรหัสผ่าน private key, access token จริง ข้อมูลลูกค้า หรือ hostname ภายในที่เป็นความลับ กรุณาลบค่าที่อ่อนไหวก่อนส่งตัวอย่าง" },
        { heading: "การดำเนินงานไซต์", body: "ไซต์นี้ดูแลเป็นพื้นที่เครื่องมือนักพัฒนาฟรี feedback ที่ช่วยเรื่องความถูกต้อง การนำทาง การเข้าถึง การแปล หรือ workflow ที่ใช้งานจริงจะถูกให้ความสำคัญ" },
      ],
      primaryLink: { label: "ส่งอีเมลถึง bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  ar: {
    about: {
      title: "حول Bob's Multi Tool",
      description: "منضدة أدوات مطور للتنسيق وفك الترميز والتحقق والإنشاء وSEO وفحوص الشبكة.",
      lastUpdated: "آخر تحديث: 11 يونيو 2026",
      backToTools: "العودة إلى الأدوات",
      sections: [
        { heading: "ما الذي يقدمه الموقع", body: "Bob's Multi Tool مجموعة أدوات مطور عملية تعمل في المتصفح أولا. صممت لمهام سريعة مثل تنسيق JSON، فحص JWT، إنشاء UUID، اختبار regex، إنشاء QR code، وتصحيح سلوك DNS أو HTTP العام." },
        { heading: "سير عمل محلي أولا", body: "تعمل معظم الأدوات مباشرة في المتصفح حتى تبقى المدخلات على جهازك. الأدوات التي تحتاج فحوص شبكة عامة مثل DNS lookup وHTTP status تستخدم routes خادم صغيرة وترفض المضيفات الخاصة أو المحلية." },
        { heading: "المحتوى والصيانة", body: "كل أداة مرفقة بأمثلة وحالات فشل وفحوص قبل النسخ وأسئلة شائعة وأدوات تالية مرتبطة حتى يكمل الزائر سير عمل حقيقيا بدلا من قراءة محتوى عام." },
      ],
      primaryLink: { label: "فتح فهرس الأدوات", href: "/tools" },
    },
    contact: {
      title: "اتصال",
      description: "تواصل مع Bob's Multi Tool لأسئلة الموقع ومشكلات الأدوات وتصحيحات المحتوى وطلبات السياسة.",
      lastUpdated: "آخر تحديث: 11 يونيو 2026",
      backToTools: "العودة إلى الأدوات",
      sections: [
        { heading: "البريد الإلكتروني", body: "لأسئلة الموقع أو مشكلات الأدوات أو تصحيحات المحتوى أو طلبات السياسة، راسل bobob935@gmail.com. عند الإبلاغ عن مشكلة أداة، أرفق رابط الصفحة ونوع الإدخال والمتصفح والنتيجة المتوقعة." },
        { heading: "الاستخدام المسؤول", body: "لا ترسل كلمات مرور أو مفاتيح خاصة أو access tokens حقيقية أو بيانات عملاء أو أسماء مضيفين داخلية سرية. احذف القيم الحساسة قبل إرسال الأمثلة." },
        { heading: "تشغيل الموقع", body: "تتم صيانة الموقع كمنضدة أدوات مطور مجانية. تعطى الأولوية للملاحظات التي تحسن الدقة أو التنقل أو الوصول أو الترجمة أو تغطية سير العمل العملي." },
      ],
      primaryLink: { label: "إرسال بريد إلى bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
};

const trustUpdatedAt: Record<Locale, string> = {
  en: "Last updated: June 22, 2026",
  ko: "최종 업데이트: 2026년 6월 22일",
  ja: "最終更新日: 2026年6月22日",
  "zh-CN": "最后更新: 2026年6月22日",
  "zh-TW": "最後更新: 2026年6月22日",
  es: "Ultima actualizacion: 22 de junio de 2026",
  "pt-BR": "Ultima atualizacao: 22 de junho de 2026",
  de: "Zuletzt aktualisiert: 22. Juni 2026",
  fr: "Derniere mise a jour: 22 juin 2026",
  hi: "अंतिम अपडेट: 22 जून 2026",
  id: "Terakhir diperbarui: 22 Juni 2026",
  vi: "Cập nhật lần cuối: 22 tháng 6, 2026",
  th: "อัปเดตล่าสุด: 22 มิถุนายน 2026",
  ar: "آخر تحديث: 22 يونيو 2026",
};

const localizedTrustExpansionSections: Record<Exclude<Locale, "en">, Record<TrustPageKind, TrustSection[]>> = {
  ko: {
    about: [
      { heading: "복사 전 검토 흐름", body: "도구 페이지는 안전한 예시 입력, 진단, 경고, 결과 확인, 관련 다음 작업으로 이어지도록 구성됩니다. 결과는 초안이므로 대상 런타임, 스케줄러, 파서, 크롤러 또는 배포 환경과 비교한 뒤 필요한 부분만 복사해야 합니다." },
      { heading: "공개 신뢰 경로", body: "소개, 문의, 개인정보처리방침, 이용약관, 도구 목록, 가이드, locale 페이지는 sitemap에 포함되어 크롤러와 사용자가 완성된 페이지로 이동할 수 있게 합니다. canonical URL, locale alternate, redirect, 공개 검증 파일도 함께 관리합니다." },
    ],
    contact: [
      { heading: "재현 가능한 보고", body: "문제를 보낼 때는 페이지 URL, 브라우저, 안전하게 바꾼 입력 예시, 기대한 결과, 실제 결과, 화면에 보인 경고를 함께 적어 주세요. 그래야 민감정보 없이 같은 흐름을 다시 확인할 수 있습니다." },
      { heading: "처리할 수 없는 요청", body: "이 연락 채널은 계정 복구, 비공개 인프라 조사, 실제 인증정보 처리, 법률 판단, 운영 보안 검토를 대신하지 않습니다. 공개 가능한 예시와 사이트 품질 또는 도구 동작에 관한 내용으로 제한해 주세요." },
    ],
  },
  ja: {
    about: [
      { heading: "コピー前の確認フロー", body: "各ツールページは、安全な入力例、診断、警告、結果確認、関連する次の作業へ進める形で構成されています。出力は下書きなので、対象 runtime、scheduler、parser、crawler、deployment 環境と照合してから必要な部分だけコピーしてください。" },
      { heading: "公開された信頼経路", body: "about、contact、privacy、terms、ツール一覧、ガイド、locale ページは sitemap に含め、crawler と利用者が完了したページへ到達できるようにしています。canonical URL、locale alternate、redirect、公開 verification file も合わせて管理します。" },
    ],
    contact: [
      { heading: "再現できる報告", body: "問題を送るときは、ページ URL、ブラウザ、安全な入力例、期待した結果、実際の結果、表示された警告を含めてください。機密情報を出さずに同じ流れを確認しやすくなります。" },
      { heading: "対応できない依頼", body: "この連絡先では、アカウント復旧、非公開インフラ調査、実際の認証情報の処理、法的判断、本番セキュリティレビューの代行はできません。公開可能な例とサイト品質またはツール動作に関する内容に限定してください。" },
    ],
  },
  "zh-CN": {
    about: [
      { heading: "复制前的复核流程", body: "工具页面围绕安全样例输入、诊断、警告、结果检查和相关下一步组织。输出只是草稿，应先与目标 runtime、scheduler、parser、crawler 或部署环境比对，再复制仍适合任务的部分。" },
      { heading: "公开信任路径", body: "关于、联系、隐私、条款、工具目录、指南和本地化页面都会进入 sitemap，让爬虫和访问者能到达完整页面。canonical URL、locale alternate、redirect 和公开验证文件也会一起维护。" },
    ],
    contact: [
      { heading: "可复现的问题报告", body: "报告问题时，请提供页面 URL、浏览器、安全替换后的输入样例、预期结果、实际结果和页面显示的警告。这样可以在不暴露敏感数据的情况下复查同一流程。" },
      { heading: "无法处理的请求", body: "此联系渠道不能处理账号恢复、私有基础设施调查、真实凭证、法律判断或生产安全审查。请使用可公开分享的样例，并聚焦站点质量或工具行为。" },
    ],
  },
  "zh-TW": {
    about: [
      { heading: "複製前的複核流程", body: "工具頁面圍繞安全範例輸入、診斷、警告、結果檢查與相關下一步組織。輸出只是草稿，應先與目標 runtime、scheduler、parser、crawler 或部署環境比對，再複製仍適合任務的部分。" },
      { heading: "公開信任路徑", body: "關於、聯絡、隱私、條款、工具目錄、指南與在地化頁面都會進入 sitemap，讓爬蟲與訪客能到達完整頁面。canonical URL、locale alternate、redirect 和公開驗證檔也會一起維護。" },
    ],
    contact: [
      { heading: "可重現的問題回報", body: "回報問題時，請提供頁面 URL、瀏覽器、安全替換後的輸入範例、預期結果、實際結果和頁面顯示的警告。這樣可以在不暴露敏感資料的情況下複查同一流程。" },
      { heading: "無法處理的請求", body: "此聯絡管道不能處理帳號復原、私有基礎設施調查、真實憑證、法律判斷或正式安全審查。請使用可公開分享的範例，並聚焦站點品質或工具行為。" },
    ],
  },
  es: {
    about: [
      { heading: "Revision antes de copiar", body: "Las paginas de herramientas se organizan alrededor de ejemplo seguro, diagnosticos, avisos, revision del resultado y siguiente paso relacionado. El resultado es un borrador: comparalo con el runtime, scheduler, parser, crawler o entorno de despliegue antes de copiar solo lo que encaja." },
      { heading: "Superficie publica de confianza", body: "About, contact, privacy, terms, indice de herramientas, guias y paginas localizadas estan en el sitemap para que crawlers y visitantes lleguen a paginas completas. Tambien se cuidan canonical URL, locale alternates, redirects y archivos publicos de verificacion." },
    ],
    contact: [
      { heading: "Reporte reproducible", body: "Incluye URL de pagina, navegador, ejemplo seguro, resultado esperado, resultado obtenido y aviso visible. Asi se puede repetir el flujo sin exponer datos sensibles." },
      { heading: "Solicitudes fuera de alcance", body: "Este contacto no recupera cuentas, no investiga infraestructura privada, no recibe credenciales reales, no emite decisiones legales y no reemplaza una revision de seguridad. Usa ejemplos publicos y enfoca el reporte en calidad del sitio o comportamiento de la herramienta." },
    ],
  },
  "pt-BR": {
    about: [
      { heading: "Revisao antes de copiar", body: "As paginas de ferramentas seguem um fluxo de exemplo seguro, diagnosticos, avisos, revisao do resultado e proxima etapa relacionada. O resultado e um rascunho: compare com runtime, scheduler, parser, crawler ou ambiente de deploy antes de copiar apenas o que serve." },
      { heading: "Superficie publica de confianca", body: "About, contact, privacy, terms, indice de ferramentas, guias e paginas localizadas entram no sitemap para que crawlers e visitantes alcancem paginas completas. Canonical URL, locale alternates, redirects e arquivos publicos de verificacao tambem sao mantidos." },
    ],
    contact: [
      { heading: "Relato reproduzivel", body: "Inclua URL da pagina, navegador, exemplo seguro, resultado esperado, resultado obtido e aviso visivel. Assim o fluxo pode ser repetido sem expor dados sensiveis." },
      { heading: "Pedidos fora de escopo", body: "Este contato nao recupera contas, nao investiga infraestrutura privada, nao recebe credenciais reais, nao emite decisoes legais e nao substitui revisao de seguranca. Use exemplos publicos e foque em qualidade do site ou comportamento da ferramenta." },
    ],
  },
  de: {
    about: [
      { heading: "Pruefung vor dem Kopieren", body: "Tool-Seiten folgen einem Ablauf aus sicherem Beispiel, Diagnosen, Warnungen, Ergebnispruefung und verwandtem naechsten Schritt. Das Ergebnis ist ein Entwurf: Vergleiche es mit Runtime, Scheduler, Parser, Crawler oder Deployment-Umgebung, bevor du nur den passenden Teil kopierst." },
      { heading: "Oeffentliche Vertrauensflaeche", body: "About, Contact, Privacy, Terms, Tool-Index, Guides und lokalisierte Seiten stehen in der Sitemap, damit Crawler und Besucher vollstaendige Seiten erreichen. Canonical URLs, Locale Alternates, Redirects und oeffentliche Verifikationsdateien werden ebenfalls gepflegt." },
    ],
    contact: [
      { heading: "Reproduzierbarer Bericht", body: "Nenne Seiten-URL, Browser, sicheres Beispiel, erwartetes Ergebnis, erhaltenes Ergebnis und sichtbare Warnung. So laesst sich der Ablauf pruefen, ohne sensible Daten offenzulegen." },
      { heading: "Anfragen ausserhalb des Umfangs", body: "Dieser Kontakt stellt keine Konten wieder her, untersucht keine private Infrastruktur, nimmt keine echten Zugangsdaten an, trifft keine Rechtsentscheidungen und ersetzt keine Sicherheitspruefung. Nutze oeffentliche Beispiele und fokussiere Site-Qualitaet oder Tool-Verhalten." },
    ],
  },
  fr: {
    about: [
      { heading: "Verification avant copie", body: "Les pages d'outils suivent un flux avec exemple sur, diagnostics, alertes, verification du resultat et etape liee. Le resultat est un brouillon: comparez-le avec le runtime, scheduler, parser, crawler ou environnement de deploiement avant de copier seulement la partie utile." },
      { heading: "Surface publique de confiance", body: "About, contact, privacy, terms, index des outils, guides et pages localisees sont dans le sitemap pour que crawlers et visiteurs atteignent des pages completes. Canonical URL, locale alternates, redirects et fichiers publics de verification sont aussi maintenus." },
    ],
    contact: [
      { heading: "Rapport reproductible", body: "Incluez URL de page, navigateur, exemple sur, resultat attendu, resultat obtenu et alerte visible. Le flux peut alors etre reproduit sans exposer de donnees sensibles." },
      { heading: "Demandes hors perimetre", body: "Ce contact ne recupere pas de comptes, n'analyse pas d'infrastructure privee, ne recoit pas d'identifiants reels, ne rend pas d'avis juridique et ne remplace pas une revue securite. Utilisez des exemples publics et restez sur la qualite du site ou le comportement de l'outil." },
    ],
  },
  hi: {
    about: [
      { heading: "कॉपी से पहले जांच", body: "Tool pages सुरक्षित example, diagnostics, warnings, result review और related next step के flow पर बने हैं. Result एक draft है; copy करने से पहले उसे target runtime, scheduler, parser, crawler या deploy environment से मिलाकर देखें." },
      { heading: "सार्वजनिक trust surface", body: "About, contact, privacy, terms, tool index, guides और localized pages sitemap में रहते हैं ताकि crawler और visitor complete pages तक पहुंच सकें. Canonical URL, locale alternates, redirects और public verification files भी maintain होते हैं." },
    ],
    contact: [
      { heading: "दोहराया जा सकने वाला report", body: "Page URL, browser, सुरक्षित example, expected result, actual result और visible warning शामिल करें. इससे sensitive data दिए बिना वही flow दोबारा जांचा जा सकता है." },
      { heading: "इस संपर्क से बाहर अनुरोध", body: "यह channel account recovery, private infrastructure जांच, real credentials, legal decision या production security review नहीं संभालता. Public examples इस्तेमाल करें और site quality या tool behavior पर report रखें." },
    ],
  },
  id: {
    about: [
      { heading: "Pemeriksaan sebelum menyalin", body: "Halaman alat disusun dengan contoh aman, diagnostik, peringatan, pemeriksaan hasil, dan langkah terkait berikutnya. Hasil adalah draft; bandingkan dengan runtime, scheduler, parser, crawler, atau lingkungan deploy sebelum menyalin bagian yang tepat." },
      { heading: "Permukaan kepercayaan publik", body: "About, contact, privacy, terms, indeks alat, panduan, dan halaman lokal masuk ke sitemap agar crawler dan pengunjung mencapai halaman lengkap. Canonical URL, locale alternates, redirect, dan file verifikasi publik juga dipelihara." },
    ],
    contact: [
      { heading: "Laporan yang bisa direproduksi", body: "Sertakan URL halaman, browser, contoh aman, hasil yang diharapkan, hasil yang didapat, dan peringatan yang terlihat. Dengan begitu alur bisa dicek ulang tanpa membuka data sensitif." },
      { heading: "Permintaan di luar cakupan", body: "Kontak ini tidak memulihkan akun, tidak memeriksa infrastruktur privat, tidak menerima kredensial asli, tidak memberi keputusan hukum, dan tidak menggantikan review keamanan. Gunakan contoh publik dan fokus pada kualitas situs atau perilaku alat." },
    ],
  },
  vi: {
    about: [
      { heading: "Kiểm tra trước khi sao chép", body: "Trang công cụ được xây theo luồng ví dụ an toàn, chẩn đoán, cảnh báo, kiểm tra kết quả và bước tiếp theo liên quan. Kết quả là bản nháp; hãy so với runtime, scheduler, parser, crawler hoặc môi trường triển khai trước khi chỉ sao chép phần phù hợp." },
      { heading: "Bề mặt tin cậy công khai", body: "About, contact, privacy, terms, danh mục công cụ, hướng dẫn và trang bản địa hóa nằm trong sitemap để crawler và người dùng tới được trang đầy đủ. Canonical URL, locale alternates, redirect và file xác minh công khai cũng được duy trì." },
    ],
    contact: [
      { heading: "Báo cáo có thể tái hiện", body: "Hãy kèm URL trang, trình duyệt, ví dụ an toàn, kết quả mong đợi, kết quả nhận được và cảnh báo hiển thị. Nhờ vậy có thể kiểm tra lại luồng mà không lộ dữ liệu nhạy cảm." },
      { heading: "Yêu cầu ngoài phạm vi", body: "Kênh liên hệ này không khôi phục tài khoản, không điều tra hạ tầng riêng, không nhận thông tin đăng nhập thật, không đưa ra quyết định pháp lý và không thay thế review bảo mật. Hãy dùng ví dụ công khai và tập trung vào chất lượng site hoặc hành vi công cụ." },
    ],
  },
  th: {
    about: [
      { heading: "ตรวจทานก่อนคัดลอก", body: "หน้าเครื่องมือจัดตามลำดับตัวอย่างที่ปลอดภัย การวินิจฉัย คำเตือน การตรวจผลลัพธ์ และขั้นตอนถัดไปที่เกี่ยวข้อง ผลลัพธ์เป็นฉบับร่าง ควรเทียบกับ runtime, scheduler, parser, crawler หรือสภาพแวดล้อม deploy ก่อนคัดลอกเฉพาะส่วนที่เหมาะสม" },
      { heading: "พื้นผิวความน่าเชื่อถือสาธารณะ", body: "About, contact, privacy, terms, ดัชนีเครื่องมือ คู่มือ และหน้า localized อยู่ใน sitemap เพื่อให้ crawler และผู้ใช้เข้าถึงหน้าที่สมบูรณ์ได้ Canonical URL, locale alternates, redirect และไฟล์ยืนยันสาธารณะก็ได้รับการดูแลด้วย" },
    ],
    contact: [
      { heading: "รายงานที่ทำซ้ำได้", body: "โปรดใส่ URL หน้า เบราว์เซอร์ ตัวอย่างที่ปลอดภัย ผลที่คาดหวัง ผลที่ได้รับ และคำเตือนที่เห็น เพื่อให้ตรวจซ้ำได้โดยไม่เปิดเผยข้อมูลอ่อนไหว" },
      { heading: "คำขอนอกขอบเขต", body: "ช่องทางนี้ไม่กู้บัญชี ไม่ตรวจโครงสร้างพื้นฐานส่วนตัว ไม่รับข้อมูลเข้าสู่ระบบจริง ไม่ให้คำตัดสินทางกฎหมาย และไม่แทนที่การ review ความปลอดภัย โปรดใช้ตัวอย่างสาธารณะและเน้นคุณภาพไซต์หรือพฤติกรรมเครื่องมือ" },
    ],
  },
  ar: {
    about: [
      { heading: "المراجعة قبل النسخ", body: "صفحات الأدوات مبنية حول مثال آمن وتشخيصات وتحذيرات ومراجعة للنتيجة وخطوة تالية مرتبطة. النتيجة مسودة؛ قارنها مع runtime أو scheduler أو parser أو crawler أو بيئة النشر قبل نسخ الجزء المناسب فقط." },
      { heading: "سطح الثقة العام", body: "صفحات about وcontact وprivacy وterms وفهرس الأدوات والأدلة والصفحات المترجمة تدخل في sitemap حتى يصل crawler والزائر إلى صفحات كاملة. تتم صيانة canonical URL وlocale alternates وredirects وملفات التحقق العامة كذلك." },
    ],
    contact: [
      { heading: "بلاغ قابل للإعادة", body: "أرسل رابط الصفحة والمتصفح ومثالا آمنا والنتيجة المتوقعة والنتيجة الفعلية والتحذير الظاهر. بذلك يمكن إعادة فحص المسار دون كشف بيانات حساسة." },
      { heading: "طلبات خارج النطاق", body: "قناة التواصل هذه لا تستعيد الحسابات ولا تفحص بنية خاصة ولا تستقبل credentials حقيقية ولا تصدر قرارات قانونية ولا تستبدل review أمني. استخدم أمثلة عامة وركز على جودة الموقع أو سلوك الأداة." },
    ],
  },
};

const localizedTrustDepthSections: Partial<Record<Exclude<Locale, "en">, Record<TrustPageKind, TrustSection[]>>> = {
  ko: {
    about: [
      { heading: "도구별 실제 콘텐츠", body: "주요 도구는 단순 입력창만 제공하지 않습니다. JSON, Regex, JWT, Base64, Cron, DNS, HTTP, SEO, SQL, CSS, JavaScript 같은 핵심 흐름에는 예시 입력, 구조화된 결과, 실패 사례, 복사 전 점검, 관련 가이드와 다음 도구 링크가 함께 제공됩니다." },
      { heading: "언어별 페이지 완성도", body: "locale 페이지는 제목과 메뉴만 번역한 얇은 route가 되지 않도록 설명, FAQ, 예제, guide lead, 법적 안내, trust 문구를 함께 관리합니다. 사용자는 자신의 언어에서 도구 목적, 입력 범위, 결과 검토 방법을 바로 확인할 수 있어야 합니다." },
      { heading: "서버 도구의 경계", body: "DNS 조회와 HTTP 상태 확인처럼 서버가 필요한 도구는 공개 대상 확인에 한정됩니다. private host, localhost, 예약 주소, 인증이 필요한 내부 URL은 공용 유틸리티의 대상이 아니며, 그런 점검은 조직 내부 환경에서 수행해야 합니다." },
    ],
    contact: [
      { heading: "콘텐츠 수정 요청", body: "문구가 부정확하거나 오래된 경우에는 route, 언어, 문제가 되는 문장, 더 안전한 표현을 함께 보내 주세요. 단순히 '틀림'이라고만 적는 것보다 어느 도구나 가이드에서 사용자가 오해할 수 있는지 알려 주는 보고가 더 빨리 반영됩니다." },
      { heading: "도구 동작 보고", body: "formatter, parser, generator, network check 문제가 있다면 입력의 구조, 선택한 옵션, 표시된 경고, 결과를 사용할 대상 환경을 함께 적어 주세요. 공개 URL 검사 문제라면 redirect, DNS, header, robots, canonical 같은 관련 신호도 함께 확인하면 재현이 쉬워집니다." },
      { heading: "민감정보 제거 기준", body: "문제 재현에 실제 값이 필요해 보이더라도 토큰, 비밀번호, 개인 키, 고객 식별자, 내부 host, 일회용 링크는 보내지 마세요. 같은 길이와 구조를 가진 테스트 값으로 바꾸고, 원본 값이 무엇을 의미하는지만 짧게 설명하는 방식이 안전합니다." },
    ],
  },
  ja: {
    about: [
      { heading: "ツールごとの実用コンテンツ", body: "主要ツールは入力欄だけではありません。JSON、Regex、JWT、Base64、Cron、DNS、HTTP、SEO、SQL、CSS、JavaScript の流れには、入力例、構造化された結果、失敗ケース、コピー前チェック、関連ガイド、次のツールへの導線を組み合わせています。" },
      { heading: "言語別ページの完成度", body: "locale ページはタイトルやメニューだけを翻訳した薄い route にしません。説明、FAQ、例、guide lead、法的説明、trust 文言を一緒に管理し、利用者が自分の言語でツールの目的、入力範囲、結果の確認方法を理解できるようにします。" },
      { heading: "サーバーツールの境界", body: "DNS lookup や HTTP status のように server が必要なツールは、公開対象の確認に限定されます。private host、localhost、reserved address、認証が必要な内部 URL は公開ユーティリティの対象ではなく、組織内の環境で確認してください。" },
    ],
    contact: [
      { heading: "コンテンツ修正依頼", body: "文言が不正確または古い場合は、route、言語、問題の文、より安全な表現を送ってください。単に間違いと書くより、どのツールやガイドで利用者が誤解しやすいかが分かる報告のほうが反映しやすくなります。" },
      { heading: "ツール動作の報告", body: "formatter、parser、generator、network check の問題では、入力の構造、選択した option、表示された警告、結果を使う対象環境を含めてください。公開 URL の検査なら redirect、DNS、header、robots、canonical などの信号もあると再現しやすくなります。" },
      { heading: "機密情報の削除基準", body: "再現に実際の値が必要に見えても、token、password、private key、customer identifier、internal host、one-time link は送らないでください。同じ長さや構造を持つテスト値に置き換え、元の値が何を表すかだけを短く説明してください。" },
      { heading: "対応優先度", body: "結果の正確性、公開ページの到達性、localization の欠落、keyboard 操作、mobile 表示、誤解を招く警告に関する報告は優先して確認します。見た目だけの好みより、作業を完了できない具体的な理由を添えてください。" },
    ],
  },
  "zh-CN": {
    about: [
      { heading: "每个工具的实际内容", body: "核心工具不只是输入框。JSON、Regex、JWT、Base64、Cron、DNS、HTTP、SEO、SQL、CSS、JavaScript 等流程会结合输入示例、结构化结果、失败场景、复制前检查、相关指南和下一步工具链接，帮助用户完成真实任务。" },
      { heading: "语言页面完整性", body: "locale 页面不会只翻译标题和菜单。说明、FAQ、示例、guide lead、法律说明和信任页面文案会一起维护，让用户在自己的语言中理解工具目的、输入范围、隐私边界和结果复核方法。" },
      { heading: "服务器工具边界", body: "DNS lookup 和 HTTP status 这类需要服务器的工具只适合检查公开目标。private host、localhost、保留地址、需要登录的内部 URL 不属于公共工具的检查对象，应在组织自己的可信环境中处理。" },
      { heading: "避免薄内容的维护方式", body: "页面更新时会优先补充可操作的内容，而不是堆叠空泛段落。新增或调整工具时，应该同时提供真实示例、限制说明、错误提示、复制风险、相关下一步和可索引的 guide 入口，让搜索访客进入页面后能直接完成任务。" },
      { heading: "变更后的可检查性", body: "公开页面变更会通过构建、路由、可视化、内容字符数和本地化检查来验证。这样可以减少空白页面、错误重定向、locale 混杂、横向溢出、未完成 route 或只剩英文模板的情况。" },
      { heading: "从搜索到下一步", body: "访问者从搜索结果进入某个工具后，应能看到当前任务、输入限制、结果含义、常见失败原因和后续工具，而不是被迫返回搜索结果重新判断。这个连续工作流是页面质量维护的核心。" },
    ],
    contact: [
      { heading: "内容修正请求", body: "如果页面文案不准确或已经过时，请提供 route、语言、具体句子和建议的安全表达。只写“错误”很难定位；说明哪个工具或指南会让用户误解，修正会更容易评估和处理。" },
      { heading: "工具行为报告", body: "报告 formatter、parser、generator 或 network check 问题时，请提供输入结构、所选选项、页面警告和结果将用于哪个目标环境。公开 URL 检查问题最好同时说明 redirect、DNS、header、robots、canonical 等可观察信号。" },
      { heading: "敏感信息移除标准", body: "即使复现问题似乎需要真实值，也不要发送 token、密码、私钥、客户标识、内部主机或一次性链接。请换成长度和结构相似的测试值，并简短说明原值代表的类型。" },
      { heading: "优先处理的信息", body: "会优先查看影响结果准确性、公开页面可访问性、本地化质量、移动布局、键盘操作、错误警告或工具无法完成核心任务的报告。只描述个人偏好通常不够，请说明它阻止了哪个实际工作流。" },
      { heading: "报告后的处理方式", body: "可复现的问题会先对照相同页面和安全样例验证，再决定是修正文案、调整工具逻辑、补充警告、改进 guide，还是更新相关下一步链接。无法安全复现的问题会要求去除敏感值后再提交。" },
      { heading: "不适合邮件发送的内容", body: "请不要把完整日志、账号恢复截图、客户数据导出、内部监控 URL、一次性下载链接或未遮罩的配置文件作为附件发送。如果必须说明结构，请提取最小片段并替换所有真实标识，同时说明哪些字段只是示例占位，哪些值已被安全替换。" },
    ],
  },
  "zh-TW": {
    about: [
      { heading: "每個工具的實際內容", body: "核心工具不只是輸入框。JSON、Regex、JWT、Base64、Cron、DNS、HTTP、SEO、SQL、CSS、JavaScript 等流程會結合輸入範例、結構化結果、失敗情境、複製前檢查、相關指南和下一步工具連結，協助使用者完成真實任務。" },
      { heading: "語言頁面完整性", body: "locale 頁面不會只翻譯標題和選單。說明、FAQ、範例、guide lead、法律說明和信任頁面文案會一起維護，讓使用者在自己的語言中理解工具目的、輸入範圍、隱私邊界和結果複核方法。" },
      { heading: "伺服器工具邊界", body: "DNS lookup 和 HTTP status 這類需要伺服器的工具只適合檢查公開目標。private host、localhost、保留位址、需要登入的內部 URL 不屬於公共工具的檢查對象，應在組織自己的可信環境中處理。" },
      { heading: "避免薄內容的維護方式", body: "頁面更新時會優先補充可操作內容，而不是堆疊空泛段落。新增或調整工具時，應同時提供真實範例、限制說明、錯誤提示、複製風險、相關下一步和可索引的 guide 入口，讓搜尋訪客進入頁面後能直接完成任務。" },
      { heading: "變更後的可檢查性", body: "公開頁面變更會透過建置、路由、視覺、內容字數和在地化檢查來驗證。這能減少空白頁、錯誤重定向、locale 混雜、橫向溢出、未完成 route 或只剩英文模板的情況。" },
      { heading: "從搜尋到下一步", body: "訪客從搜尋結果進入某個工具後，應能看到目前任務、輸入限制、結果含義、常見失敗原因和後續工具，而不是被迫回到搜尋結果重新判斷。這個連續工作流是頁面品質維護的核心。" },
    ],
    contact: [
      { heading: "內容修正請求", body: "如果頁面文案不準確或已經過時，請提供 route、語言、具體句子和建議的安全表達。只寫「錯誤」很難定位；說明哪個工具或指南會讓使用者誤解，修正會更容易評估和處理。" },
      { heading: "工具行為回報", body: "回報 formatter、parser、generator 或 network check 問題時，請提供輸入結構、所選選項、頁面警告和結果將用於哪個目標環境。公開 URL 檢查問題最好同時說明 redirect、DNS、header、robots、canonical 等可觀察訊號。" },
      { heading: "敏感資訊移除標準", body: "即使重現問題似乎需要真實值，也不要傳送 token、密碼、私鑰、客戶識別、內部主機或一次性連結。請換成長度和結構相似的測試值，並簡短說明原值代表的類型。" },
      { heading: "優先處理的資訊", body: "會優先查看影響結果準確性、公開頁面可訪問性、在地化品質、行動版排版、鍵盤操作、錯誤警告或工具無法完成核心任務的回報。只描述個人偏好通常不夠，請說明它阻止了哪個實際工作流。" },
      { heading: "回報後的處理方式", body: "可重現的問題會先對照相同頁面和安全範例驗證，再決定是修正文案、調整工具邏輯、補充警告、改進 guide，還是更新相關下一步連結。無法安全重現的問題會要求移除敏感值後再提交。" },
      { heading: "不適合郵件傳送的內容", body: "請不要把完整日誌、帳號復原截圖、客戶資料匯出、內部監控 URL、一次性下載連結或未遮罩的設定檔作為附件傳送。如果必須說明結構，請擷取最小片段並替換所有真實識別，同時說明哪些欄位只是範例佔位，哪些值已被安全替換。" },
    ],
  },
  ar: {
    about: [
      { heading: "محتوى عملي لكل أداة", body: "الأدوات الأساسية ليست مجرد مربع إدخال. مسارات JSON وRegex وJWT وBase64 وCron وDNS وHTTP وSEO وSQL وCSS وJavaScript تجمع أمثلة إدخال ونتائج منظمة وحالات فشل وفحوصا قبل النسخ وروابط إلى أدلة وأدوات تالية حتى ينجز المستخدم مهمة حقيقية." },
      { heading: "اكتمال صفحات اللغة", body: "صفحات locale لا تترجم العنوان والقائمة فقط. تتم صيانة الوصف وFAQ والأمثلة ومقدمة الدليل والنصوص القانونية ونصوص الثقة معا حتى يفهم المستخدم بلغته هدف الأداة ونطاق الإدخال وحدود الخصوصية وطريقة مراجعة النتيجة." },
      { heading: "حدود أدوات الخادم", body: "أدوات مثل DNS lookup وHTTP status التي تحتاج خادما مخصصة للأهداف العامة فقط. private host وlocalhost والعناوين المحجوزة وURL الداخلي الذي يحتاج تسجيل دخول ليست هدفا مناسبا لأداة عامة، ويجب فحصها داخل بيئة موثوقة خاصة بالمؤسسة." },
    ],
    contact: [
      { heading: "طلب تصحيح محتوى", body: "إذا كان النص غير دقيق أو قديما، أرسل route واللغة والجملة المحددة والصياغة الأكثر أمانا التي تقترحها. تقرير يوضح أين قد يسيء المستخدم فهم أداة أو دليل يكون أسهل في المراجعة من رسالة عامة تقول إن الصفحة خاطئة فقط." },
      { heading: "تقرير سلوك الأداة", body: "عند الإبلاغ عن مشكلة formatter أو parser أو generator أو network check، أرفق شكل الإدخال والخيارات المختارة والتحذير الظاهر والبيئة التي ستستخدم فيها النتيجة. لمشكلة URL عام، تساعد إشارات مثل redirect وDNS وheader وrobots وcanonical في إعادة الفحص." },
      { heading: "إزالة المعلومات الحساسة", body: "حتى إذا بدا أن إعادة المشكلة تحتاج قيمة حقيقية، لا ترسل token أو password أو private key أو معرف عميل أو host داخلي أو رابطا يستخدم مرة واحدة. استبدلها بقيمة اختبار لها الطول والبنية نفسها واشرح باختصار نوع القيمة الأصلية." },
    ],
  },
};

export function getLocalizedTrustContent(locale: Locale = defaultLocale, kind: TrustPageKind) {
  const content = locale === defaultLocale ? english[kind] : localized[locale][kind];
  const expansionSections = locale === defaultLocale ? [] : localizedTrustExpansionSections[locale][kind];
  const depthSections = locale === defaultLocale ? [] : (localizedTrustDepthSections[locale]?.[kind] ?? []);

  return {
    ...content,
    lastUpdated: trustUpdatedAt[locale],
    sections: [...content.sections, ...expansionSections, ...depthSections],
  };
}
