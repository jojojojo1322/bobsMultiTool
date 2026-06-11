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
      description: "整形、デコード、検証、生成、SEO、ネットワーク確認のための開発者ユーティリティワークベンチです。",
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
      description: "用于格式化、解码、验证、生成、SEO 和网络检查的开发者工具工作台。",
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
      description: "向 Bob's Multi Tool 发送网站问题、工具问题、内容修正和政策请求。",
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
      description: "用於格式化、解碼、驗證、產生、SEO 與網路檢查的開發者工具工作台。",
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
      description: "向 Bob's Multi Tool 傳送網站問題、工具問題、內容修正與政策請求。",
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
      title: "Contact",
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

export function getLocalizedTrustContent(locale: Locale = defaultLocale, kind: TrustPageKind) {
  if (locale === defaultLocale) return english[kind];
  return localized[locale][kind];
}
