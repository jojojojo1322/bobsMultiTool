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
    title: "About bobob.app",
    description: "A small Blog + Play workshop about shipping tiny web experiments, writing the decisions down, and keeping practical browser tools available.",
    lastUpdated: "Last updated: June 11, 2026",
    backToTools: "Back to home",
    sections: [
      {
        heading: "What this site is now",
        body: "bobob.app is a small Blog + Play workshop. The main surface is original writing about building, operating, and revising small web projects, paired with browser-playable experiments that show the work instead of only describing it.",
      },
      {
        heading: "Representative writing",
        body: "The public blog intentionally shows a smaller representative set: complete posts with paragraphs, tables, checklists, build logs, production notes, and clear dates when the topic depends on current information. Short notes stay reachable as archive pages, but they are not promoted in the public blog list, feed, or submitted sitemap.",
      },
      {
        heading: "Play experiments",
        body: "The Play section contains small static games and interactive experiments built for direct use in the browser. Each public entry is meant to have a playable surface, result or sharing path, related reading when it fits, and enough surrounding context to explain why the experiment exists.",
      },
      {
        heading: "Archived practical tools",
        body: "The older developer utilities remain available under /tools because they still solve real browser-side tasks. They are maintained as a supporting archive rather than the front-page identity of the site, with local-first behavior, examples, diagnostics, and related next steps preserved for users who need them.",
      },
      {
        heading: "How pages stay useful",
        body: "New public pages should help a visitor decide or do something concrete. A post should add original judgment, a build record, a comparison, a checklist, or a useful mistake report. A Play page should expose the game surface quickly. A tool page should show the working input and output before reference material.",
      },
      {
        heading: "Local-first workflow",
        body: "Most archived tools run directly in your browser so input can stay on your device. Tools that require public network checks, such as DNS lookup and HTTP status checks, use small server routes and reject private or local hosts.",
      },
      {
        heading: "Accessibility and navigation",
        body: "The site keeps keyboard-reachable controls, predictable navigation, search, Blog and Play indexes, trust links, and archived tool routes so visitors can move from the home page or a search result to complete pages instead of empty or unfinished routes.",
      },
      {
        heading: "International coverage",
        body: "Default English pages stay unprefixed. Localized routes keep translated trust pages, legal pages, tool labels, examples, FAQ, and guide leads where those surfaces are published, so visitors are not sent to pages made only from raw English registry text.",
      },
      {
        heading: "Public discovery surface",
        body: "The submitted discovery surface is kept intentionally narrow: home, global search, Blog index, representative Blog posts, Blog category hubs, Play index, Play pages, trust pages, and selected archived tools. Canonical routes, feeds, sitemap entries, redirects, and public verification files are maintained so crawlers and visitors can reach complete pages.",
      },
      {
        heading: "Review workflow before copying",
        body: "Formatter, validator, generator, network, and SEO tool pages are still written around a review loop: paste or enter a safe example, inspect diagnostics and warnings, compare the result with the target runtime or platform, then copy only the part that still fits the task.",
      },
    ],
    primaryLink: {
      label: "Read the blog",
      href: "/blog",
    },
  },
  contact: {
    title: "Contact",
    description: "Contact bobob.app for Blog, Play, archived tool, content correction, and policy questions.",
    lastUpdated: "Last updated: June 11, 2026",
    backToTools: "Back to home",
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
        body: "The site is maintained as a Blog + Play workshop with an archived utility surface. Feedback that improves original writing, playable experiments, accuracy, navigation, accessibility, localization, or practical workflow coverage is prioritized.",
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
      title: "bobob.app 소개",
      description: "작은 웹 실험을 만들고, 그 판단을 글로 남기고, 필요한 브라우저 도구는 계속 사용할 수 있게 유지하는 Blog + Play 작업장입니다.",
      lastUpdated: "최종 업데이트: 2026년 6월 11일",
      backToTools: "홈으로 돌아가기",
      sections: [
        { heading: "지금 이 사이트가 하는 일", body: "bobob.app은 작은 Blog + Play 작업장입니다. 중심 표면은 작은 웹 프로젝트를 만들고 운영하고 다시 고치는 과정을 직접 쓴 글이며, 그 글과 이어지는 브라우저 플레이 실험은 말로만 설명하지 않고 실제로 만져 볼 수 있게 둡니다." },
        { heading: "대표 글만 보여 주는 방식", body: "공개 블로그에는 문장과 단락이 충분하고, 필요한 경우 표, 체크리스트, 제작 기록, 운영 판단, 기준일이 들어간 대표 글만 올립니다. 짧은 메모는 archive 상세로는 남겨도 공개 블로그 목록, feed, 제출 sitemap에는 넣지 않습니다." },
        { heading: "Play 실험", body: "Play 섹션은 브라우저에서 바로 실행되는 작은 게임과 상호작용 실험을 담습니다. 각 공개 항목은 빠르게 열리는 게임 표면, 결과 또는 공유 흐름, 자연스러운 관련 글, 왜 만든 실험인지 알 수 있는 주변 맥락을 갖추는 것을 목표로 합니다." },
        { heading: "보존된 실용 도구", body: "이전 개발자 유틸리티는 여전히 실제 작업에 쓸 수 있기 때문에 /tools 아래에 보존합니다. 다만 사이트의 첫인상은 도구 모음이 아니라 Blog + Play이며, 도구는 로컬 우선 동작, 예제, 진단, 다음 작업 링크를 갖춘 보조 archive로 유지합니다." },
        { heading: "페이지를 유용하게 유지하는 기준", body: "새 공개 페이지는 방문자가 판단하거나 실행할 수 있는 내용을 가져야 합니다. 글은 원래 판단, 제작 기록, 비교, 체크리스트, 실패에서 배운 점을 담고, Play 페이지는 게임 표면을 빠르게 보여 주며, 도구 페이지는 참고 문서보다 입력과 결과를 먼저 보여 줍니다." },
      ],
      primaryLink: { label: "블로그 읽기", href: "/blog" },
    },
    contact: {
      title: "문의",
      description: "Blog, Play, 보존된 도구, 콘텐츠 수정, 정책 요청을 bobob.app에 보낼 수 있습니다.",
      lastUpdated: "최종 업데이트: 2026년 6월 11일",
      backToTools: "홈으로 돌아가기",
      sections: [
        { heading: "이메일", body: "사이트 질문, 도구 문제, 콘텐츠 수정, 정책 요청은 bobob935@gmail.com 으로 보내세요. 도구 문제를 보낼 때는 페이지 URL, 입력 유형, 브라우저, 기대한 결과를 함께 적어 주세요." },
        { heading: "안전한 공유", body: "비밀번호, 개인 키, 실제 access token, 고객 데이터, 비공개 내부 호스트명은 보내지 마세요. 예제를 보낼 때는 민감한 값을 제거한 뒤 공유하세요." },
        { heading: "사이트 운영", body: "이 사이트는 Blog + Play 작업장과 보존된 도구 표면으로 운영됩니다. 직접 쓴 글, 플레이 가능한 실험, 정확도, 탐색, 접근성, 번역 품질, 실제 작업 흐름을 개선하는 피드백을 우선합니다." },
      ],
      primaryLink: { label: "bobob935@gmail.com으로 이메일 보내기", href: "mailto:bobob935@gmail.com" },
    },
  },
  ja: {
    about: {
      title: "bobob.app について",
      description: "小さな Web 実験を作り、その判断を書き残し、必要なブラウザツールも保守する Blog + Play の作業場です。",
      lastUpdated: "最終更新日: 2026年6月11日",
      backToTools: "ホームへ戻る",
      sections: [
        { heading: "いまのサイトの役割", body: "bobob.app は小さな Blog + Play の作業場です。中心にあるのは、小さな Web プロジェクトを作り、運用し、直した判断を書いた記事と、それに続くブラウザで遊べる実験です。" },
        { heading: "代表記事の出し方", body: "公開ブログでは、十分な本文、表、チェックリスト、制作ログ、運用判断、必要な日付を持つ代表記事を前に出します。短いメモはアーカイブとして残しても、ブログ一覧、feed、提出 sitemap には広げません。" },
        { heading: "Play 実験", body: "Play には、ブラウザで直接触れる小さなゲームとインタラクションを置きます。各ページはすぐ遊べる面、結果や共有の流れ、自然な関連読み物、なぜ作ったかが分かる文脈を持つことを目指します。" },
        { heading: "保守している実用ツール", body: "以前の開発者ユーティリティは、実作業でまだ役立つため /tools に残しています。ただしサイトの第一印象はツール集ではなく Blog + Play であり、ツールはローカル優先の補助アーカイブとして保守します。" },
        { heading: "ページを有用に保つ基準", body: "新しい公開ページは、訪問者が判断するか何かを実行できる内容を持つべきです。記事は独自の判断や制作記録を残し、Play は素早く触れる面を示し、ツールは参照文より先に入力と結果を見せます。" },
      ],
      primaryLink: { label: "ブログを読む", href: "/blog" },
    },
    contact: {
      title: "問い合わせ",
      description: "Blog、Play、保守ツール、内容修正、ポリシー依頼について bobob.app に連絡できます。",
      lastUpdated: "最終更新日: 2026年6月11日",
      backToTools: "ホームへ戻る",
      sections: [
        { heading: "メール", body: "サイトの質問、ツールの問題、内容修正、ポリシー依頼は bobob935@gmail.com へ送ってください。問題報告ではページ URL、入力の種類、ブラウザ、期待した結果を含めてください。" },
        { heading: "安全な共有", body: "パスワード、秘密鍵、本番 access token、顧客データ、非公開の内部 host 名は送らないでください。例を共有する前に機密値を削除してください。" },
        { heading: "サイト運営", body: "このサイトは Blog + Play の作業場と保守ツールの面として運営されています。独自記事、遊べる実験、正確性、ナビゲーション、アクセシビリティ、翻訳品質、実用的な流れを改善するフィードバックを優先します。" },
      ],
      primaryLink: { label: "bobob935@gmail.com にメール", href: "mailto:bobob935@gmail.com" },
    },
  },
  "zh-CN": {
    about: {
      title: "关于 bobob.app",
      description: "bobob.app 是一个 Blog + Play 工作室，记录小型网页实验、制作判断、可玩项目和仍有用的浏览器工具维护。",
      lastUpdated: "最后更新: 2026年6月11日",
      backToTools: "返回首页",
      sections: [
        { heading: "本站现在做什么", body: "bobob.app 是一个小型 Blog + Play 工作室。主要内容是关于制作、运营和修改小型网页项目的原创记录，并配上可以在浏览器中直接操作的 Play 实验。" },
        { heading: "代表文章", body: "公开博客会优先展示较小的代表集：有足够正文、表格、检查清单、制作日志、运营判断，以及需要时明确日期的完整文章。短笔记可以保留为归档页，但不会进入公开博客列表、feed 或提交 sitemap。" },
        { heading: "Play 实验", body: "Play 区包含静态小型游戏和交互实验。每个公开条目都应该快速打开可玩的表面，提供结果或分享路径，并在适合时连接相关文章，说明这个实验为什么存在。" },
        { heading: "保留的实用工具", body: "旧的开发者工具仍在 /tools 下保留，因为它们还能解决真实任务。但它们是辅助归档，不再定义首页身份；页面会继续保留本地优先处理、示例、诊断和相关下一步。" },
        { heading: "页面保持有用的标准", body: "新的公开页面必须帮助访问者做判断或完成动作。文章需要提供原创判断、制作记录、比较或检查清单；Play 页面要快速露出游戏表面；工具页面要先展示输入和输出。" },
      ],
      primaryLink: { label: "阅读博客", href: "/blog" },
    },
    contact: {
      title: "联系",
      description: "联系 bobob.app 处理 Blog、Play、保留工具、内容修正、可访问性、本地化和政策相关问题。",
      lastUpdated: "最后更新: 2026年6月11日",
      backToTools: "返回首页",
      sections: [
        { heading: "邮箱", body: "网站问题、工具问题、内容修正或政策请求可发送到 bobob935@gmail.com。报告工具问题时请包含页面 URL、输入类型、浏览器和预期结果。" },
        { heading: "负责任地共享", body: "请不要发送密码、私钥、真实 access token、客户数据或机密内部主机名。发送示例前请先移除敏感值。" },
        { heading: "网站运营", body: "本站作为 Blog + Play 工作室和保留工具表面维护。能改进原创文章、可玩实验、准确性、导航、可访问性、本地化和实际工作流的反馈会被优先处理。" },
      ],
      primaryLink: { label: "发送邮件到 bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  "zh-TW": {
    about: {
      title: "關於 bobob.app",
      description: "bobob.app 是一個 Blog + Play 工作室，記錄小型網頁實驗、製作判斷、可玩項目和仍有用的瀏覽器工具維護。",
      lastUpdated: "最後更新: 2026年6月11日",
      backToTools: "返回首頁",
      sections: [
        { heading: "本站現在做什麼", body: "bobob.app 是一個小型 Blog + Play 工作室。主要內容是製作、營運和修改小型網頁專案的原創記錄，並搭配可在瀏覽器中直接操作的 Play 實驗。" },
        { heading: "代表文章", body: "公開部落格會優先展示較小的代表集：有足夠正文、表格、檢查清單、製作日誌、營運判斷，以及需要時明確日期的完整文章。短筆記可以保留為歸檔頁，但不會進入公開列表、feed 或提交 sitemap。" },
        { heading: "Play 實驗", body: "Play 區包含靜態小型遊戲和互動實驗。每個公開項目都應該快速打開可玩的表面，提供結果或分享路徑，並在適合時連到相關文章，說明這個實驗為什麼存在。" },
        { heading: "保留的實用工具", body: "舊的開發者工具仍在 /tools 下保留，因為它們還能解決真實任務。但它們是輔助歸檔，不再定義首頁身份；頁面會繼續保留本機優先處理、範例、診斷和相關下一步。" },
        { heading: "頁面保持有用的標準", body: "新的公開頁面必須幫助訪客做判斷或完成動作。文章需要提供原創判斷、製作記錄、比較或檢查清單；Play 頁面要快速露出遊戲表面；工具頁面要先展示輸入和輸出。" },
      ],
      primaryLink: { label: "閱讀部落格", href: "/blog" },
    },
    contact: {
      title: "聯絡",
      description: "聯絡 bobob.app 處理 Blog、Play、保留工具、內容修正、可訪問性、本地化和政策相關問題。",
      lastUpdated: "最後更新: 2026年6月11日",
      backToTools: "返回首頁",
      sections: [
        { heading: "電子郵件", body: "網站問題、工具問題、內容修正或政策請求可寄到 bobob935@gmail.com。回報工具問題時請包含頁面 URL、輸入類型、瀏覽器與預期結果。" },
        { heading: "負責任地分享", body: "請不要寄送密碼、私鑰、真實 access token、客戶資料或機密內部主機名稱。傳送範例前請先移除敏感值。" },
        { heading: "網站營運", body: "本站作為 Blog + Play 工作室和保留工具表面維護。能改善原創文章、可玩實驗、準確性、導覽、可及性、本地化與實際工作流程的回饋會優先處理。" },
      ],
      primaryLink: { label: "寄信到 bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  es: {
    about: {
      title: "Acerca de bobob.app",
      description: "Un taller Blog + Play para crear pequenos experimentos web, escribir las decisiones y mantener herramientas utiles del navegador.",
      lastUpdated: "Ultima actualizacion: 11 de junio de 2026",
      backToTools: "Volver al inicio",
      sections: [
        { heading: "Que es ahora este sitio", body: "bobob.app es un pequeno taller Blog + Play. La superficie principal son escritos originales sobre construir, operar y revisar proyectos web pequenos, junto con experimentos jugables en el navegador que muestran el trabajo." },
        { heading: "Escritura representativa", body: "El blog publico muestra una seleccion reducida de articulos completos: texto suficiente, tablas, listas de revision, bitacoras de construccion, decisiones de produccion y fechas claras cuando el tema depende de informacion actual." },
        { heading: "Experimentos Play", body: "La seccion Play contiene juegos pequenos y experimentos interactivos estaticos. Cada entrada publica debe abrir rapido, mostrar una superficie jugable, ofrecer resultado o ruta para compartir y enlazar lectura relacionada cuando tenga sentido." },
        { heading: "Herramientas practicas archivadas", body: "Las utilidades antiguas siguen bajo /tools porque aun resuelven tareas reales. Funcionan como archivo de apoyo, no como identidad principal de la portada, y conservan comportamiento local, ejemplos, diagnosticos y siguientes pasos." },
        { heading: "Como se mantiene util cada pagina", body: "Una pagina publica nueva debe ayudar a decidir o hacer algo concreto. Un articulo aporta juicio original, registro de construccion, comparacion o checklist; Play muestra pronto el juego; una herramienta enseña entrada y salida antes del material de referencia." },
      ],
      primaryLink: { label: "Leer el blog", href: "/blog" },
    },
    contact: {
      title: "Contacto",
      description: "Contacta con bobob.app sobre Blog, Play, herramientas archivadas, correcciones de contenido y solicitudes de politica.",
      lastUpdated: "Ultima actualizacion: 11 de junio de 2026",
      backToTools: "Volver al inicio",
      sections: [
        { heading: "Email", body: "Para preguntas del sitio, errores de herramientas, correcciones de contenido o solicitudes de politica, escribe a bobob935@gmail.com. Incluye la URL, tipo de entrada, navegador y resultado esperado al reportar un problema." },
        { heading: "Uso responsable", body: "No envies contrasenas, claves privadas, access tokens reales, datos de clientes ni hostnames internos confidenciales. Redacta valores sensibles antes de enviar ejemplos." },
        { heading: "Operacion del sitio", body: "El sitio se mantiene como taller Blog + Play con una superficie de herramientas archivadas. Se prioriza el feedback que mejore escritura original, experimentos jugables, precision, navegacion, accesibilidad, localizacion o flujos practicos." },
      ],
      primaryLink: { label: "Enviar email a bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  "pt-BR": {
    about: {
      title: "Sobre o bobob.app",
      description: "Um atelie Blog + Play para criar pequenos experimentos web, registrar decisoes e manter ferramentas uteis de navegador.",
      lastUpdated: "Ultima atualizacao: 11 de junho de 2026",
      backToTools: "Voltar para o inicio",
      sections: [
        { heading: "O que este site e agora", body: "bobob.app e um pequeno atelie Blog + Play. A superficie principal traz textos originais sobre construir, operar e revisar pequenos projetos web, junto com experimentos jogaveis no navegador que mostram o trabalho." },
        { heading: "Escrita representativa", body: "O blog publico mostra um conjunto menor de artigos completos: texto suficiente, tabelas, checklists, logs de construcao, decisoes de producao e datas claras quando o assunto depende de informacao atual." },
        { heading: "Experimentos Play", body: "A secao Play contem pequenos jogos estaticos e experimentos interativos. Cada entrada publica deve abrir rapido, mostrar uma superficie jogavel, oferecer resultado ou compartilhamento e ligar leituras relacionadas quando fizer sentido." },
        { heading: "Ferramentas praticas arquivadas", body: "As utilidades antigas continuam em /tools porque ainda resolvem tarefas reais. Elas sao um arquivo de apoio, nao a identidade principal da pagina inicial, com comportamento local, exemplos, diagnosticos e proximos passos." },
        { heading: "Como cada pagina fica util", body: "Uma nova pagina publica deve ajudar o visitante a decidir ou fazer algo concreto. Um artigo traz julgamento proprio, registro de construcao, comparacao ou checklist; Play mostra logo o jogo; uma ferramenta mostra entrada e saida antes da referencia." },
      ],
      primaryLink: { label: "Ler o blog", href: "/blog" },
    },
    contact: {
      title: "Contato",
      description: "Fale com o bobob.app sobre Blog, Play, ferramentas arquivadas, correcoes de conteudo e pedidos de politica.",
      lastUpdated: "Ultima atualizacao: 11 de junho de 2026",
      backToTools: "Voltar para o inicio",
      sections: [
        { heading: "Email", body: "Para perguntas do site, problemas nas ferramentas, correcoes de conteudo ou pedidos de politica, envie email para bobob935@gmail.com. Ao relatar um problema, inclua URL da pagina, tipo de entrada, navegador e resultado esperado." },
        { heading: "Uso responsavel", body: "Nao envie senhas, chaves privadas, access tokens reais, dados de clientes ou hostnames internos confidenciais. Remova valores sensiveis antes de enviar exemplos." },
        { heading: "Operacao do site", body: "O site e mantido como atelie Blog + Play com uma superficie de ferramentas arquivadas. Feedback que melhore escrita original, experimentos jogaveis, precisao, navegacao, acessibilidade, localizacao ou fluxos praticos tem prioridade." },
      ],
      primaryLink: { label: "Enviar email para bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  de: {
    about: {
      title: "Ueber bobob.app",
      description: "Eine Blog + Play Werkstatt fuer kleine Webexperimente, geschriebene Entscheidungen und gepflegte Browser-Tools.",
      lastUpdated: "Zuletzt aktualisiert: 11. Juni 2026",
      backToTools: "Zurueck zur Startseite",
      sections: [
        { heading: "Was diese Seite jetzt ist", body: "bobob.app ist eine kleine Blog + Play Werkstatt. Im Mittelpunkt stehen eigene Texte ueber Bau, Betrieb und Korrektur kleiner Webprojekte sowie direkt im Browser spielbare Experimente, die die Arbeit sichtbar machen." },
        { heading: "Repraesentative Artikel", body: "Der oeffentliche Blog zeigt bewusst eine kleinere Auswahl vollstaendiger Beitraege: genug Text, Tabellen, Checklisten, Build-Logs, Produktionsentscheidungen und klare Daten, wenn ein Thema von aktueller Information abhaengt." },
        { heading: "Play Experimente", body: "Der Play-Bereich enthaelt kleine statische Spiele und interaktive Experimente. Jeder oeffentliche Eintrag soll schnell nutzbar sein, eine spielbare Flaeche, Ergebnis oder Teilen-Pfad und passende weiterfuehrende Lektuere bieten." },
        { heading: "Archivierte praktische Tools", body: "Die alten Entwickler-Utilities bleiben unter /tools, weil sie reale Aufgaben loesen. Sie sind eine unterstuetzende Archivflaeche, nicht mehr die Startseiten-Identitaet, und behalten lokales Verhalten, Beispiele, Diagnosen und naechste Schritte." },
        { heading: "Wie Seiten nuetzlich bleiben", body: "Eine neue oeffentliche Seite soll beim Entscheiden oder Handeln helfen. Ein Artikel bringt eigenes Urteil, Bauprotokoll, Vergleich oder Checkliste; Play zeigt schnell die Spielflaeche; ein Tool zeigt Eingabe und Ergebnis vor Referenzmaterial." },
      ],
      primaryLink: { label: "Blog lesen", href: "/blog" },
    },
    contact: {
      title: "Kontakt",
      description: "Kontaktiere bobob.app zu Blog, Play, archivierten Tools, Inhaltskorrekturen und Richtlinienfragen.",
      lastUpdated: "Zuletzt aktualisiert: 11. Juni 2026",
      backToTools: "Zurueck zur Startseite",
      sections: [
        { heading: "E-Mail", body: "Fragen zur Seite, Tool-Probleme, Inhaltskorrekturen oder Richtlinienanfragen bitte an bobob935@gmail.com senden. Bei Tool-Problemen bitte Seiten-URL, Eingabetyp, Browser und erwartetes Ergebnis angeben." },
        { heading: "Verantwortliche Nutzung", body: "Sende keine Passwoerter, privaten Schluessel, echten access tokens, Kundendaten oder vertraulichen internen Hostnamen. Entferne sensible Werte, bevor du Beispiele sendest." },
        { heading: "Betrieb der Seite", body: "Die Seite wird als Blog + Play Werkstatt mit archivierter Tool-Flaeche gepflegt. Feedback zu eigenen Texten, spielbaren Experimenten, Genauigkeit, Navigation, Barrierefreiheit, Lokalisierung und praktischen Workflows hat Prioritaet." },
      ],
      primaryLink: { label: "E-Mail an bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  fr: {
    about: {
      title: "A propos de bobob.app",
      description: "Un atelier Blog + Play pour creer de petites experiences web, ecrire les decisions et garder des outils navigateur utiles.",
      lastUpdated: "Derniere mise a jour: 11 juin 2026",
      backToTools: "Retour a l'accueil",
      sections: [
        { heading: "Ce que le site est maintenant", body: "bobob.app est un petit atelier Blog + Play. La surface principale rassemble des textes originaux sur la construction, l'exploitation et la revision de petits projets web, avec des experiences jouables dans le navigateur." },
        { heading: "Articles representatifs", body: "Le blog public met en avant une selection plus petite d'articles complets: texte suffisant, tableaux, checklists, journaux de construction, decisions de production et dates claires lorsque le sujet depend d'informations actuelles." },
        { heading: "Experiences Play", body: "La section Play contient de petits jeux statiques et des experiences interactives. Chaque entree publique doit s'ouvrir vite, montrer une surface jouable, offrir un resultat ou un partage et relier une lecture pertinente quand cela aide." },
        { heading: "Outils pratiques archives", body: "Les anciens utilitaires restent sous /tools car ils servent encore a de vraies taches. Ils sont une surface d'archive de soutien, non l'identite de l'accueil, avec traitement local, exemples, diagnostics et etapes suivantes." },
        { heading: "Comment les pages restent utiles", body: "Une nouvelle page publique doit aider a decider ou faire quelque chose de concret. Un article apporte un jugement original, un journal de construction, une comparaison ou une checklist; Play montre vite le jeu; un outil montre entree et sortie avant la reference." },
      ],
      primaryLink: { label: "Lire le blog", href: "/blog" },
    },
    contact: {
      title: "Contact bobob.app",
      description: "Contactez bobob.app pour Blog, Play, outils archives, corrections de contenu et demandes de politique.",
      lastUpdated: "Derniere mise a jour: 11 juin 2026",
      backToTools: "Retour a l'accueil",
      sections: [
        { heading: "Email", body: "Pour les questions du site, problemes d'outils, corrections de contenu ou demandes de politique, ecrivez a bobob935@gmail.com. Pour un probleme d'outil, incluez l'URL, le type d'entree, le navigateur et le resultat attendu." },
        { heading: "Usage responsable", body: "N'envoyez pas de mots de passe, cles privees, access tokens reels, donnees client ou hostnames internes confidentiels. Supprimez les valeurs sensibles avant d'envoyer des exemples." },
        { heading: "Exploitation du site", body: "Le site est maintenu comme atelier Blog + Play avec une surface d'outils archives. Les retours qui ameliorent textes originaux, experiences jouables, precision, navigation, accessibilite, localisation ou flux pratiques sont prioritaires." },
      ],
      primaryLink: { label: "Envoyer un email a bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  hi: {
    about: {
      title: "bobob.app के बारे में",
      description: "छोटे web प्रयोग बनाने, फैसले लिखने और जरूरी browser tools संभालने वाला Blog + Play कार्यक्षेत्र.",
      lastUpdated: "अंतिम अपडेट: 11 जून 2026",
      backToTools: "होम पर वापस",
      sections: [
        { heading: "यह साइट अब क्या है", body: "bobob.app एक छोटा Blog + Play कार्यक्षेत्र है. मुख्य सतह छोटे web projects बनाने, चलाने और सुधारने पर लिखे original notes और उनसे जुड़े browser-play experiments हैं." },
        { heading: "प्रतिनिधि लेख", body: "Public blog जानबूझकर छोटा representative set दिखाता है: पर्याप्त text, tables, checklists, build logs, production decisions और date-sensitive topics में साफ तारीख. Short notes archive में रह सकते हैं, लेकिन blog list, feed या submitted sitemap में आगे नहीं रखे जाते." },
        { heading: "Play experiments", body: "Play section में छोटे static games और interactive experiments हैं. हर public entry जल्दी खुलनी चाहिए, playable surface दिखाना चाहिए, result या share path देना चाहिए, और जहां उपयोगी हो वहां related reading से जुड़ना चाहिए." },
        { heading: "Archived practical tools", body: "पुराने developer tools /tools में बने रहते हैं क्योंकि वे अभी भी real tasks हल करते हैं. वे support archive हैं, homepage identity नहीं; उनमें local-first behavior, examples, diagnostics और next steps बने रहते हैं." },
        { heading: "Pages उपयोगी कैसे रहती हैं", body: "नई public page visitor को कोई decision लेने या action करने में मदद करे. Article original judgment, build record, comparison या checklist दे; Play game surface जल्दी दिखाए; tool reference से पहले input और output दिखाए." },
      ],
      primaryLink: { label: "Blog पढ़ें", href: "/blog" },
    },
    contact: {
      title: "संपर्क",
      description: "Blog, Play, archived tools, content corrections और policy questions के लिए bobob.app से संपर्क करें.",
      lastUpdated: "अंतिम अपडेट: 11 जून 2026",
      backToTools: "होम पर वापस",
      sections: [
        { heading: "Email", body: "Site questions, tool issues, content corrections या policy requests के लिए bobob935@gmail.com पर email करें. Tool problem report करते समय page URL, input type, browser और expected result शामिल करें." },
        { heading: "Responsible use", body: "Passwords, private keys, live access tokens, customer data या confidential internal hostnames न भेजें. Examples भेजने से पहले sensitive values हटाएं." },
        { heading: "Site operation", body: "यह site Blog + Play workspace और archived tools surface के रूप में maintain होती है. Original writing, playable experiments, accuracy, navigation, accessibility, localization और practical workflow सुधारने वाला feedback priority है." },
      ],
      primaryLink: { label: "bobob935@gmail.com पर email करें", href: "mailto:bobob935@gmail.com" },
    },
  },
  id: {
    about: {
      title: "Tentang bobob.app",
      description: "Ruang kerja Blog + Play untuk membuat eksperimen web kecil, menulis keputusan, dan menjaga alat browser yang tetap berguna.",
      lastUpdated: "Terakhir diperbarui: 11 Juni 2026",
      backToTools: "Kembali ke beranda",
      sections: [
        { heading: "Peran situs saat ini", body: "bobob.app adalah ruang kerja Blog + Play kecil. Permukaan utamanya berisi tulisan asli tentang membuat, mengoperasikan, dan memperbaiki proyek web kecil, bersama eksperimen yang bisa dimainkan langsung di browser." },
        { heading: "Tulisan representatif", body: "Blog publik sengaja menampilkan set representatif yang lebih kecil: artikel lengkap dengan teks cukup, tabel, checklist, log pembuatan, keputusan produksi, dan tanggal jelas ketika topiknya bergantung pada informasi terbaru." },
        { heading: "Eksperimen Play", body: "Bagian Play berisi game statis kecil dan eksperimen interaktif. Setiap entri publik sebaiknya cepat dibuka, memiliki permukaan yang bisa dimainkan, alur hasil atau berbagi, dan bacaan terkait ketika memang membantu." },
        { heading: "Alat praktis yang diarsipkan", body: "Utilitas lama tetap ada di /tools karena masih menyelesaikan tugas nyata. Alat itu menjadi arsip pendukung, bukan identitas utama beranda, dengan perilaku lokal, contoh, diagnosis, dan langkah berikut." },
        { heading: "Cara halaman tetap berguna", body: "Halaman publik baru harus membantu pengunjung memutuskan atau melakukan sesuatu yang konkret. Artikel membawa penilaian asli, catatan pembuatan, perbandingan, atau checklist; Play cepat menampilkan game; alat menunjukkan input dan output sebelum referensi." },
      ],
      primaryLink: { label: "Baca blog", href: "/blog" },
    },
    contact: {
      title: "Kontak",
      description: "Hubungi bobob.app tentang Blog, Play, alat arsip, koreksi konten, dan pertanyaan kebijakan.",
      lastUpdated: "Terakhir diperbarui: 11 Juni 2026",
      backToTools: "Kembali ke beranda",
      sections: [
        { heading: "Email", body: "Untuk pertanyaan situs, masalah alat, koreksi konten, atau permintaan kebijakan, kirim email ke bobob935@gmail.com. Sertakan URL halaman, jenis masukan, browser, dan hasil yang diharapkan saat melaporkan masalah alat." },
        { heading: "Penggunaan bertanggung jawab", body: "Jangan kirim password, private key, access token aktif, data pelanggan, atau hostname internal rahasia. Hapus nilai sensitif sebelum mengirim contoh." },
        { heading: "Operasi situs", body: "Situs ini dipelihara sebagai ruang kerja Blog + Play dengan permukaan alat arsip. Feedback yang meningkatkan tulisan asli, eksperimen yang bisa dimainkan, akurasi, navigasi, aksesibilitas, lokalisasi, atau alur praktis diprioritaskan." },
      ],
      primaryLink: { label: "Email bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  vi: {
    about: {
      title: "Giới thiệu bobob.app",
      description: "Một xưởng Blog + Play để làm thử nghiệm web nhỏ, ghi lại quyết định và giữ các công cụ trình duyệt còn hữu ích.",
      lastUpdated: "Cập nhật lần cuối: 11 tháng 6, 2026",
      backToTools: "Quay lại trang chủ",
      sections: [
        { heading: "Trang này hiện là gì", body: "bobob.app là một xưởng Blog + Play nhỏ. Bề mặt chính là bài viết gốc về việc xây, vận hành và sửa các dự án web nhỏ, đi cùng những thử nghiệm có thể chơi trực tiếp trong trình duyệt." },
        { heading: "Bài viết đại diện", body: "Blog công khai chỉ đẩy lên một nhóm đại diện nhỏ: bài có đủ nội dung, bảng, checklist, nhật ký xây dựng, quyết định sản phẩm và ngày rõ ràng khi chủ đề phụ thuộc vào thông tin hiện tại." },
        { heading: "Thử nghiệm Play", body: "Mục Play chứa game tĩnh nhỏ và thử nghiệm tương tác. Mỗi mục công khai nên mở nhanh, có bề mặt chơi được, có kết quả hoặc đường chia sẻ và nối tới bài liên quan khi thật sự hữu ích." },
        { heading: "Công cụ thực dụng được lưu giữ", body: "Các tiện ích cũ vẫn ở /tools vì chúng còn giải quyết việc thật. Chúng là bề mặt lưu trữ hỗ trợ, không phải danh tính chính của trang đầu, và vẫn giữ xử lý cục bộ, ví dụ, chẩn đoán và bước tiếp theo." },
        { heading: "Cách giữ trang hữu ích", body: "Trang công khai mới phải giúp người xem quyết định hoặc làm một việc cụ thể. Bài viết đưa ra nhận định riêng, ghi chép xây dựng, so sánh hoặc checklist; Play nhanh chóng cho thấy game; công cụ hiển thị đầu vào và đầu ra trước phần tham khảo." },
      ],
      primaryLink: { label: "Đọc blog", href: "/blog" },
    },
    contact: {
      title: "Liên hệ",
      description: "Liên hệ bobob.app về Blog, Play, công cụ lưu trữ, sửa nội dung và câu hỏi chính sách.",
      lastUpdated: "Cập nhật lần cuối: 11 tháng 6, 2026",
      backToTools: "Quay lại trang chủ",
      sections: [
        { heading: "Email", body: "Với câu hỏi trang, lỗi công cụ, sửa nội dung hoặc yêu cầu chính sách, gửi email tới bobob935@gmail.com. Khi báo lỗi công cụ, hãy kèm URL trang, loại dữ liệu nhập, trình duyệt và kết quả mong đợi." },
        { heading: "Sử dụng có trách nhiệm", body: "Không gửi mật khẩu, private key, access token thật, dữ liệu khách hàng hoặc hostname nội bộ bí mật. Hãy xóa giá trị nhạy cảm trước khi gửi ví dụ." },
        { heading: "Vận hành trang", body: "Trang được duy trì như xưởng Blog + Play cùng một bề mặt công cụ lưu trữ. Phản hồi cải thiện bài viết gốc, thử nghiệm có thể chơi, độ chính xác, điều hướng, khả năng truy cập, bản địa hóa hoặc quy trình thực tế được ưu tiên." },
      ],
      primaryLink: { label: "Gửi email tới bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  th: {
    about: {
      title: "เกี่ยวกับ bobob.app",
      description: "พื้นที่ Blog + Play สำหรับทำเว็บทดลองเล็ก ๆ เขียนบันทึกการตัดสินใจ และดูแลเครื่องมือเบราว์เซอร์ที่ยังมีประโยชน์",
      lastUpdated: "อัปเดตล่าสุด: 11 มิถุนายน 2026",
      backToTools: "กลับหน้าแรก",
      sections: [
        { heading: "ตอนนี้ไซต์นี้คืออะไร", body: "bobob.app คือพื้นที่ Blog + Play ขนาดเล็ก เนื้อหาหลักคือบันทึกต้นฉบับเกี่ยวกับการสร้าง ดูแล และแก้เว็บโปรเจกต์เล็ก ๆ พร้อมการทดลองที่เล่นได้ในเบราว์เซอร์" },
        { heading: "บทความตัวแทน", body: "บล็อกสาธารณะจะแสดงชุดบทความตัวแทนที่เล็กลง มีเนื้อหาพอจริง ตาราง checklist บันทึกการสร้าง การตัดสินใจ และวันที่ชัดเจนเมื่อเรื่องนั้นขึ้นกับข้อมูลปัจจุบัน" },
        { heading: "การทดลอง Play", body: "ส่วน Play มีเกม static เล็ก ๆ และการทดลองแบบโต้ตอบ แต่ละหน้า public ควรเปิดเร็ว มีพื้นที่ให้เล่นจริง มีผลลัพธ์หรือทางแชร์ และเชื่อมบทความที่เกี่ยวข้องเมื่อช่วยให้เข้าใจมากขึ้น" },
        { heading: "เครื่องมือปฏิบัติที่เก็บไว้", body: "เครื่องมือเดิมยังอยู่ใน /tools เพราะยังช่วยงานจริงได้ แต่เป็น archive สนับสนุน ไม่ใช่ตัวตนหลักของหน้าแรก และยังคงการทำงานในเครื่อง ตัวอย่าง การวินิจฉัย และขั้นตอนถัดไป" },
        { heading: "ทำให้หน้าใช้งานได้จริง", body: "หน้า public ใหม่ควรช่วยให้ผู้เข้าชมตัดสินใจหรือทำบางอย่างได้ บทความควรมีมุมมองจริง บันทึกการสร้าง การเปรียบเทียบ หรือ checklist; Play ควรโชว์เกมเร็ว; tool ควรโชว์ input และ output ก่อนเอกสารอ้างอิง" },
      ],
      primaryLink: { label: "อ่านบล็อก", href: "/blog" },
    },
    contact: {
      title: "ติดต่อ",
      description: "ติดต่อ bobob.app เรื่อง Blog, Play, เครื่องมือที่เก็บไว้ การแก้เนื้อหา และคำถามนโยบาย",
      lastUpdated: "อัปเดตล่าสุด: 11 มิถุนายน 2026",
      backToTools: "กลับหน้าแรก",
      sections: [
        { heading: "อีเมล", body: "สำหรับคำถามเกี่ยวกับไซต์ ปัญหาเครื่องมือ การแก้เนื้อหา หรือคำขอนโยบาย ส่งอีเมลไปที่ bobob935@gmail.com เมื่อรายงานปัญหาเครื่องมือ ให้ใส่ URL หน้า ประเภท input เบราว์เซอร์ และผลลัพธ์ที่คาดหวัง" },
        { heading: "ใช้งานอย่างรับผิดชอบ", body: "อย่าส่งรหัสผ่าน private key, access token จริง ข้อมูลลูกค้า หรือ hostname ภายในที่เป็นความลับ กรุณาลบค่าที่อ่อนไหวก่อนส่งตัวอย่าง" },
        { heading: "การดำเนินงานไซต์", body: "ไซต์นี้ดูแลเป็นพื้นที่ Blog + Play พร้อมพื้นผิวเครื่องมือที่เก็บไว้ feedback ที่ช่วยบทความต้นฉบับ การทดลองที่เล่นได้ ความถูกต้อง การนำทาง การเข้าถึง การแปล หรือ workflow ที่ใช้งานจริงจะถูกให้ความสำคัญ" },
      ],
      primaryLink: { label: "ส่งอีเมลถึง bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
  ar: {
    about: {
      title: "حول bobob.app",
      description: "ورشة Blog + Play لصنع تجارب ويب صغيرة وكتابة القرارات والحفاظ على أدوات متصفح مفيدة.",
      lastUpdated: "آخر تحديث: 11 يونيو 2026",
      backToTools: "العودة إلى الصفحة الرئيسية",
      sections: [
        { heading: "ما هو هذا الموقع الآن", body: "bobob.app ورشة صغيرة من Blog + Play. السطح الرئيسي هو كتابة أصلية عن بناء مشاريع ويب صغيرة وتشغيلها ومراجعتها، مع تجارب قابلة للعب داخل المتصفح تظهر العمل بدلا من وصفه فقط." },
        { heading: "كتابة ممثلة", body: "يعرض blog العام مجموعة أصغر من المقالات المكتملة: نص كاف وجداول وقوائم فحص وسجلات بناء وقرارات تشغيل وتواريخ واضحة عندما يعتمد الموضوع على معلومات حالية." },
        { heading: "تجارب Play", body: "قسم Play يحتوي ألعابا صغيرة ثابتة وتجارب تفاعلية. كل صفحة عامة يجب أن تفتح بسرعة وتعرض سطحا قابلا للعب ومسارا للنتيجة أو المشاركة وقراءة مرتبطة عندما يكون ذلك مفيدا." },
        { heading: "أدوات عملية مؤرشفة", body: "تبقى الأدوات القديمة تحت /tools لأنها ما زالت تحل مهاما حقيقية. لكنها سطح أرشيف داعم وليست هوية الصفحة الرئيسية، مع سلوك محلي وأمثلة وتشخيصات وخطوات تالية." },
        { heading: "كيف تبقى الصفحات مفيدة", body: "أي صفحة عامة جديدة يجب أن تساعد الزائر على اتخاذ قرار أو فعل شيء محدد. المقال يقدم حكما أصليا أو سجل بناء أو مقارنة أو checklist؛ وPlay يعرض اللعبة بسرعة؛ والأداة تعرض الإدخال والنتيجة قبل المادة المرجعية." },
      ],
      primaryLink: { label: "قراءة المدونة", href: "/blog" },
    },
    contact: {
      title: "اتصال",
      description: "تواصل مع bobob.app بخصوص Blog وPlay والأدوات المؤرشفة وتصحيحات المحتوى وأسئلة السياسة.",
      lastUpdated: "آخر تحديث: 11 يونيو 2026",
      backToTools: "العودة إلى الصفحة الرئيسية",
      sections: [
        { heading: "البريد الإلكتروني", body: "لأسئلة الموقع أو مشكلات الأدوات أو تصحيحات المحتوى أو طلبات السياسة، راسل bobob935@gmail.com. عند الإبلاغ عن مشكلة أداة، أرفق رابط الصفحة ونوع الإدخال والمتصفح والنتيجة المتوقعة." },
        { heading: "الاستخدام المسؤول", body: "لا ترسل كلمات مرور أو مفاتيح خاصة أو access tokens حقيقية أو بيانات عملاء أو أسماء مضيفين داخلية سرية. احذف القيم الحساسة قبل إرسال الأمثلة." },
        { heading: "تشغيل الموقع", body: "تتم صيانة الموقع كورشة Blog + Play مع سطح أدوات مؤرشفة. تعطى الأولوية للملاحظات التي تحسن الكتابة الأصلية أو التجارب القابلة للعب أو الدقة أو التنقل أو الوصول أو الترجمة أو سير العمل العملي." },
      ],
      primaryLink: { label: "إرسال بريد إلى bobob935@gmail.com", href: "mailto:bobob935@gmail.com" },
    },
  },
};

const trustUpdatedAt: Record<Locale, string> = {
  en: "Last updated: July 3, 2026",
  ko: "최종 업데이트: 2026년 7월 3일",
  ja: "最終更新日: 2026年7月3日",
  "zh-CN": "最后更新: 2026年7月3日",
  "zh-TW": "最後更新: 2026年7月3日",
  es: "Ultima actualizacion: 3 de julio de 2026",
  "pt-BR": "Ultima atualizacao: 3 de julho de 2026",
  de: "Zuletzt aktualisiert: 3. Juli 2026",
  fr: "Derniere mise a jour: 3 juillet 2026",
  hi: "अंतिम अपडेट: 3 जुलाई 2026",
  id: "Terakhir diperbarui: 3 Juli 2026",
  vi: "Cập nhật lần cuối: 3 tháng 7, 2026",
  th: "อัปเดตล่าสุด: 3 กรกฎาคม 2026",
  ar: "آخر تحديث: 3 يوليو 2026",
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

const localizedTrustQualitySections: Record<Exclude<Locale, "en">, Record<TrustPageKind, TrustSection[]>> = {
  ko: {
    about: [
      { heading: "작업 흐름 중심의 페이지 구성", body: "각 도구는 검색 방문자가 바로 작업을 시작할 수 있도록 입력 예시, 옵션, 결과 요약, 경고, 복사 전 확인을 한 화면 흐름으로 배치합니다. 단순 설명 문단보다 실제로 값을 붙여 넣고 결과를 판단하는 과정이 먼저 보이도록 유지합니다." },
      { heading: "검증 가능한 결과", body: "formatter, validator, generator, parser 결과에는 입력 크기, 구조, 감지된 위험, 제한 사항, 다음 확인 지점을 함께 표시합니다. 사용자는 결과를 그대로 신뢰하는 대신 대상 런타임, 문서, 배포 환경과 비교할 수 있습니다." },
      { heading: "검색 방문자를 위한 다음 단계", body: "한 도구에서 끝나지 않는 작업은 관련 도구와 가이드로 이어집니다. API 응답 정리, token 확인, redirect 점검, DNS 배포 확인, 보안 header 검토처럼 실제 개발 흐름을 연결해 빈 페이지 이동을 줄입니다." },
      { heading: "품질 점검 기준", body: "공개 페이지는 제목, 설명, h1, 본문량, locale alternate, canonical, sitemap 포함 여부, 모바일 표시, 금지된 placeholder 노출 여부를 함께 확인합니다. 새 콘텐츠는 검색엔진만 위한 반복 문장이 아니라 사용자가 판단에 쓸 수 있는 기준을 담아야 합니다." },
    ],
    contact: [
      { heading: "수정 요청에 포함할 맥락", body: "문구 수정이나 번역 오류를 보낼 때는 페이지 경로, 언어, 문제가 되는 문장, 실제 사용자가 오해할 수 있는 이유, 제안 표현을 함께 적어 주세요. 이렇게 보내면 단순 철자 수정인지, 도구 결과 해석에 영향을 주는 문제인지 빠르게 분리할 수 있습니다." },
      { heading: "네트워크와 SEO 점검 보고", body: "DNS, HTTP, robots, sitemap, meta, Open Graph 관련 문제는 공개 URL, 확인한 시간, 예상 상태, 실제 상태, redirect chain, response header, canonical 신호를 같이 적으면 좋습니다. 내부 관리자 주소나 인증이 필요한 URL은 공개 메일로 보내지 마세요." },
      { heading: "입력 예시를 안전하게 만드는 방법", body: "실제 token, cookie, customer id, 내부 host, 일회성 링크가 들어간 예시는 같은 구조의 테스트 값으로 바꿔 주세요. 필드 이름과 길이, 인코딩 방식, 줄바꿈 구조는 남겨도 되지만 식별 가능한 값은 제거해야 합니다." },
      { heading: "우선 확인하는 문제", body: "결과가 틀리게 계산되는 경우, 복사가 잘못되는 경우, locale 페이지에 영어 placeholder가 남은 경우, 모바일에서 입력 영역이 가려지는 경우, 공개 route가 404 또는 redirect loop를 만드는 경우를 우선 확인합니다." },
    ],
  },
  ja: {
    about: [
      { heading: "作業フロー中心のページ構成", body: "各ツールは、検索から来た利用者がすぐ作業を始められるよう、入力例、option、結果 summary、警告、コピー前確認を一つの流れで配置します。説明文だけを増やすのではなく、値を貼り付けて判断する手順が先に見える状態を保ちます。" },
      { heading: "検証できる結果", body: "formatter、validator、generator、parser の結果には、入力サイズ、構造、検出したリスク、制限、次に確認すべき点を合わせて表示します。利用者は出力をそのまま信じるのではなく、対象 runtime、文書、deploy 環境と照合できます。" },
      { heading: "検索訪問者の次の一手", body: "一つのツールで終わらない作業は、関連ツールとガイドへつながります。API 応答の整形、token 確認、redirect 調査、DNS deploy 確認、security header review のような実際の開発フローをつなげ、空の移動を減らします。" },
      { heading: "品質確認の基準", body: "公開ページは title、description、h1、本文量、locale alternate、canonical、sitemap 収録、mobile 表示、placeholder 露出をまとめて確認します。新しい文章は検索エンジン向けの繰り返しではなく、利用者が判断に使える基準を含める必要があります。" },
    ],
    contact: [
      { heading: "修正依頼に含める文脈", body: "文言や翻訳の修正を送る場合は、ページ path、言語、問題の文、利用者が誤解しそうな理由、提案表現を含めてください。単なる表記揺れか、ツール結果の理解に影響する問題かを分けやすくなります。" },
      { heading: "ネットワークと SEO の報告", body: "DNS、HTTP、robots、sitemap、meta、Open Graph の問題では、公開 URL、確認時刻、期待した状態、実際の状態、redirect chain、response header、canonical signal を添えると確認しやすくなります。内部管理 URL や認証が必要な URL は送らないでください。" },
      { heading: "入力例を安全にする方法", body: "実際の token、cookie、customer id、internal host、一回限りの link が入る例は、同じ構造のテスト値へ置き換えてください。field 名、長さ、encoding、改行構造は残せますが、識別できる値は削除する必要があります。" },
      { heading: "優先して確認する問題", body: "結果が誤って計算される場合、コピー内容が壊れる場合、locale ページに英語 placeholder が残る場合、mobile で入力領域が隠れる場合、公開 route が 404 や redirect loop になる場合を優先して確認します。" },
      { heading: "確認後の反映方法", body: "再現できた問題は、同じ安全な入力例で確認したあと、文言修正、警告追加、tool logic 調整、guide 補足、関連リンク更新のどれが適切かを分けて対応します。再現できない場合は、機密値を除いた最小例の再送をお願いすることがあります。" },
    ],
  },
  "zh-CN": {
    about: [
      { heading: "围绕任务流程组织页面", body: "每个工具都会把输入示例、选项、结果摘要、警告和复制前检查放在同一个操作流程里，让来自搜索的用户可以直接开始处理数据。页面不会只堆说明文字，而是优先呈现粘贴、检查、判断和继续下一步的真实路径。" },
      { heading: "可验证的结果", body: "formatter、validator、generator、parser 的结果会同时展示输入大小、结构、检测到的风险、已知限制和下一步检查点。用户不需要盲目信任输出，而可以把结果带回目标运行环境、平台文档或部署配置中复核。" },
      { heading: "从搜索进入后的下一步", body: "很多开发任务不会停在单个工具。API 响应整理、token 检查、redirect 调试、DNS 部署确认、安全 header 复核等流程会链接到相关工具和指南，帮助用户继续完成任务，而不是跳到空洞的说明页。" },
      { heading: "页面质量检查标准", body: "公开页面会检查 title、description、h1、可见正文量、locale alternate、canonical、sitemap 覆盖、移动端展示和 placeholder 暴露。新增内容必须提供可操作判断标准，不能只是为了增加字数而重复相似句子。" },
      { heading: "内容更新后的维护", body: "当工具说明、指南或信任页面更新时，站点会同时关注用户能否完成任务、搜索爬虫能否看到完整正文、不同语言是否仍然保持同等信息量。这样可以避免某些 locale 只剩短介绍，而核心页面却承担过多解释的情况。" },
    ],
    contact: [
      { heading: "修正请求需要的上下文", body: "提交文案或翻译修正时，请写明页面路径、语言、具体句子、为什么会让用户误解，以及建议替换的表达。这样可以区分普通拼写问题和会影响工具结果理解的质量问题。" },
      { heading: "网络和 SEO 问题报告", body: "DNS、HTTP、robots、sitemap、meta、Open Graph 相关问题最好包含公开 URL、检查时间、预期状态、实际状态、redirect chain、response header 和 canonical 信号。请不要通过邮件发送内部管理地址或需要登录的 URL。" },
      { heading: "安全准备输入示例", body: "如果示例里包含真实 token、cookie、customer id、内部 host 或一次性链接，请先替换成相同结构的测试值。字段名、长度、编码方式和换行结构可以保留，但任何能识别项目或个人的值都应该删除。" },
      { heading: "优先核查的问题类型", body: "会优先核查计算结果明显错误、复制结果损坏、locale 页面残留英文 placeholder、移动端输入区域被遮挡、公开 route 返回 404 或形成 redirect loop 的问题。这些问题会直接阻止用户完成核心任务。" },
      { heading: "核查后的处理方式", body: "可复现的问题会先用同一个安全输入重新确认，再判断应该修改文案、补充警告、调整工具逻辑、扩展指南，还是更新相关下一步链接。无法安全复现的报告会要求去除真实值后再提交最小示例。" },
      { heading: "不适合公开联系渠道的内容", body: "请不要发送完整生产日志、未遮罩的配置文件、客户资料导出、内部监控截图或账号恢复资料。若这些信息与问题有关，请只提取最小结构，替换所有真实标识，并说明哪些字段是示例占位。" },
    ],
  },
  "zh-TW": {
    about: [
      { heading: "圍繞任務流程組織頁面", body: "每個工具都會把輸入範例、選項、結果摘要、警告和複製前檢查放在同一個操作流程裡，讓來自搜尋的使用者可以直接開始處理資料。頁面不會只堆說明文字，而是優先呈現貼上、檢查、判斷和繼續下一步的真實路徑。" },
      { heading: "可驗證的結果", body: "formatter、validator、generator、parser 的結果會同時展示輸入大小、結構、偵測到的風險、已知限制和下一步檢查點。使用者不需要盲目信任輸出，而可以把結果帶回目標執行環境、平台文件或部署設定中複核。" },
      { heading: "從搜尋進入後的下一步", body: "很多開發任務不會停在單個工具。API 回應整理、token 檢查、redirect 調試、DNS 部署確認、安全 header 複核等流程會連結到相關工具和指南，協助使用者繼續完成任務，而不是跳到空洞的說明頁。" },
      { heading: "頁面品質檢查標準", body: "公開頁面會檢查 title、description、h1、可見正文量、locale alternate、canonical、sitemap 覆蓋、行動端顯示和 placeholder 暴露。新增內容必須提供可操作判斷標準，不能只是為了增加字數而重複相似句子。" },
      { heading: "內容更新後的維護", body: "當工具說明、指南或信任頁面更新時，站點會同時關注使用者能否完成任務、搜尋爬蟲能否看到完整正文、不同語言是否仍保持同等資訊量。這樣可以避免某些 locale 只剩短介紹，而核心頁面卻承擔過多解釋的情況。" },
    ],
    contact: [
      { heading: "修正請求需要的上下文", body: "提交文案或翻譯修正時，請寫明頁面路徑、語言、具體句子、為什麼會讓使用者誤解，以及建議替換的表達。這樣可以區分普通拼寫問題和會影響工具結果理解的品質問題。" },
      { heading: "網路和 SEO 問題回報", body: "DNS、HTTP、robots、sitemap、meta、Open Graph 相關問題最好包含公開 URL、檢查時間、預期狀態、實際狀態、redirect chain、response header 和 canonical 信號。請不要透過郵件傳送內部管理位址或需要登入的 URL。" },
      { heading: "安全準備輸入範例", body: "如果範例裡包含真實 token、cookie、customer id、內部 host 或一次性連結，請先替換成相同結構的測試值。欄位名、長度、編碼方式和換行結構可以保留，但任何能識別專案或個人的值都應該刪除。" },
      { heading: "優先核查的問題類型", body: "會優先核查計算結果明顯錯誤、複製結果損壞、locale 頁面殘留英文 placeholder、行動端輸入區域被遮擋、公開 route 回傳 404 或形成 redirect loop 的問題。這些問題會直接阻止使用者完成核心任務。" },
      { heading: "核查後的處理方式", body: "可重現的問題會先用同一個安全輸入重新確認，再判斷應該修改文案、補充警告、調整工具邏輯、擴展指南，還是更新相關下一步連結。無法安全重現的回報會要求移除真實值後再提交最小範例。" },
      { heading: "不適合公開聯絡管道的內容", body: "請不要傳送完整正式環境記錄、未遮罩的設定檔、客戶資料匯出、內部監控截圖或帳號復原資料。若這些資訊與問題有關，請只擷取最小結構，替換所有真實識別，並說明哪些欄位是範例佔位。" },
    ],
  },
  es: {
    about: [
      { heading: "Paginas orientadas al flujo de trabajo", body: "Cada herramienta coloca ejemplos de entrada, opciones, resumen del resultado, avisos y revision antes de copiar dentro de un mismo flujo. La prioridad no es llenar la pagina con texto general, sino mostrar como pegar un valor seguro, leer el diagnostico, decidir si sirve y continuar con la siguiente tarea." },
      { heading: "Resultados que se pueden comprobar", body: "Los resultados de formatter, validator, generator y parser muestran tamano de entrada, estructura, riesgos detectados, limites conocidos y puntos de revision. Asi el usuario puede comparar la salida con el runtime, la documentacion de la plataforma o el despliegue real antes de usarla." },
      { heading: "Siguiente paso desde la busqueda", body: "Muchas tareas no terminan en una sola utilidad. Formatear una respuesta API, revisar un token, depurar redirects, comprobar DNS de despliegue o revisar security headers enlaza con herramientas y guias relacionadas para mantener una ruta de trabajo completa." },
      { heading: "Criterios de calidad publica", body: "Las paginas publicas se revisan por title, description, h1, texto visible, locale alternate, canonical, sitemap, lectura movil y ausencia de placeholders. El contenido nuevo debe aportar criterios utiles de decision, no frases repetidas solo para aumentar longitud." },
    ],
    contact: [
      { heading: "Contexto para pedir correcciones", body: "Para corregir texto o traduccion, incluye ruta de la pagina, idioma, frase concreta, motivo por el que puede confundir al usuario y propuesta de reemplazo. Eso ayuda a separar un detalle de redaccion de un problema que afecta la interpretacion del resultado." },
      { heading: "Reportes de red y SEO", body: "Para DNS, HTTP, robots, sitemap, meta u Open Graph, indica URL publica, hora de comprobacion, estado esperado, estado real, redirect chain, response headers y senales canonical cuando existan. No envies URLs internas de administracion ni recursos que requieran login." },
      { heading: "Como preparar ejemplos seguros", body: "Si un ejemplo contiene token real, cookie, customer id, host interno o enlace de un solo uso, cambialo por un valor de prueba con la misma estructura. Puedes conservar nombres de campos, longitud, encoding y saltos de linea, pero elimina cualquier valor identificable." },
      { heading: "Problemas que se revisan primero", body: "Se priorizan calculos incorrectos, copias rotas, placeholders en ingles dentro de paginas localizadas, entrada tapada en movil, rutas publicas con 404 y redirect loops. Son fallos que impiden completar la tarea principal del usuario." },
    ],
  },
  "pt-BR": {
    about: [
      { heading: "Paginas orientadas ao fluxo de trabalho", body: "Cada ferramenta coloca exemplos de entrada, opcoes, resumo do resultado, avisos e revisao antes de copiar dentro de um fluxo unico. A prioridade nao e encher a pagina com texto generico, mas mostrar como colar um valor seguro, ler o diagnostico, decidir se serve e seguir para a proxima tarefa." },
      { heading: "Resultados que podem ser conferidos", body: "Resultados de formatter, validator, generator e parser mostram tamanho da entrada, estrutura, riscos detectados, limites conhecidos e pontos de revisao. Assim o usuario compara a saida com runtime, documentacao da plataforma ou deploy real antes de usar." },
      { heading: "Proximo passo a partir da busca", body: "Muitas tarefas nao terminam em uma unica utilidade. Formatar resposta de API, revisar token, depurar redirects, conferir DNS de deploy ou revisar security headers conecta ferramentas e guias relacionados para manter uma rota de trabalho completa." },
      { heading: "Criterios de qualidade publica", body: "Paginas publicas sao revisadas por title, description, h1, texto visivel, locale alternate, canonical, sitemap, leitura mobile e ausencia de placeholders. Conteudo novo deve trazer criterios uteis de decisao, nao frases repetidas apenas para aumentar tamanho." },
    ],
    contact: [
      { heading: "Contexto para pedir correcoes", body: "Para corrigir texto ou traducao, inclua rota da pagina, idioma, frase exata, motivo de possivel confusao e proposta de substituicao. Isso ajuda a separar um ajuste de redacao de um problema que afeta a leitura do resultado." },
      { heading: "Relatos de rede e SEO", body: "Para DNS, HTTP, robots, sitemap, meta ou Open Graph, informe URL publica, horario da verificacao, estado esperado, estado real, redirect chain, response headers e sinais canonical quando existirem. Nao envie URLs internas de administracao nem recursos que exigem login." },
      { heading: "Como preparar exemplos seguros", body: "Se um exemplo contem token real, cookie, customer id, host interno ou link de uso unico, troque por valor de teste com a mesma estrutura. Voce pode manter nomes de campos, comprimento, encoding e quebras de linha, mas remova qualquer valor identificavel." },
      { heading: "Problemas revisados primeiro", body: "Sao priorizados calculos incorretos, copia quebrada, placeholders em ingles dentro de paginas localizadas, entrada escondida no mobile, rotas publicas com 404 e redirect loops. Esses problemas impedem o usuario de concluir a tarefa principal." },
    ],
  },
  de: {
    about: [
      { heading: "Seiten nach Arbeitsablauf", body: "Jedes Tool ordnet Beispieleingabe, Optionen, Ergebniszusammenfassung, Warnungen und Pruefung vor dem Kopieren in einem Ablauf an. Es geht nicht darum, allgemeine Texte zu stapeln, sondern zu zeigen, wie ein sicherer Wert eingefuegt, die Diagnose gelesen, das Ergebnis bewertet und der naechste Schritt gewaehlt wird." },
      { heading: "Pruefbare Ergebnisse", body: "Ergebnisse von Formatter, Validator, Generator und Parser zeigen Eingabegroesse, Struktur, erkannte Risiken, bekannte Grenzen und naechste Pruefpunkte. So kann der Nutzer die Ausgabe mit Runtime, Plattformdokumentation oder echtem Deployment vergleichen, bevor sie verwendet wird." },
      { heading: "Naechster Schritt nach der Suche", body: "Viele Aufgaben enden nicht in einem einzelnen Utility. API-Antworten formatieren, Token pruefen, Redirects debuggen, DNS-Deployment bestaetigen oder Security Headers reviewen verbindet verwandte Tools und Guides zu einem vollstaendigen Arbeitsweg." },
      { heading: "Kriterien fuer oeffentliche Qualitaet", body: "Oeffentliche Seiten werden nach title, description, h1, sichtbarem Text, locale alternate, canonical, sitemap, mobiler Lesbarkeit und fehlenden Placeholders geprueft. Neuer Inhalt muss brauchbare Entscheidungskriterien liefern, nicht nur wiederholte Saetze fuer mehr Laenge." },
    ],
    contact: [
      { heading: "Kontext fuer Korrekturen", body: "Bei Text- oder Uebersetzungsfehlern nenne Seitenroute, Sprache, genauen Satz, moegliche Nutzerverwirrung und einen Ersatzvorschlag. So laesst sich ein Schreibdetail von einem Problem trennen, das das Verstaendnis des Tool-Ergebnisses beeinflusst." },
      { heading: "Berichte zu Netzwerk und SEO", body: "Bei DNS, HTTP, robots, sitemap, meta oder Open Graph helfen oeffentliche URL, Pruefzeit, erwarteter Status, tatsaechlicher Status, redirect chain, response headers und canonical Signale. Interne Admin-URLs oder Ressourcen mit Login gehoeren nicht in die Mail." },
      { heading: "Sichere Beispiele vorbereiten", body: "Enthaelt ein Beispiel echtes Token, Cookie, customer id, internen Host oder Einmal-Link, ersetze es durch einen Testwert mit gleicher Struktur. Feldnamen, Laenge, Encoding und Zeilenumbrueche koennen bleiben, identifizierbare Werte muessen entfernt werden." },
      { heading: "Zuerst gepruefte Probleme", body: "Prioritaet haben falsche Berechnungen, defekte Kopien, englische Placeholder in lokalisierten Seiten, verdeckte Eingaben auf Mobilgeraeten, oeffentliche Routen mit 404 und redirect loops. Solche Fehler blockieren den Kernablauf des Nutzers." },
    ],
  },
  fr: {
    about: [
      { heading: "Pages organisees par flux de travail", body: "Chaque outil place exemple d'entree, options, resume du resultat, alertes et controle avant copie dans un meme flux. L'objectif n'est pas d'ajouter du texte general, mais de montrer comment coller une valeur sure, lire le diagnostic, juger le resultat et continuer vers la prochaine etape." },
      { heading: "Resultats verifiables", body: "Les resultats de formatter, validator, generator et parser indiquent taille d'entree, structure, risques detectes, limites connues et points de verification. L'utilisateur peut ainsi comparer la sortie avec le runtime, la documentation plateforme ou le deploiement reel avant utilisation." },
      { heading: "Etape suivante depuis la recherche", body: "Beaucoup de taches ne finissent pas dans un seul outil. Formater une reponse API, verifier un token, debugger des redirects, controler un DNS de deploiement ou relire des security headers relie outils et guides pour garder un parcours complet." },
      { heading: "Criteres de qualite publique", body: "Les pages publiques sont verifiees par title, description, h1, texte visible, locale alternate, canonical, sitemap, lecture mobile et absence de placeholders. Un nouveau contenu doit apporter des criteres de decision utiles, pas des phrases repetees pour allonger la page." },
    ],
    contact: [
      { heading: "Contexte pour demander une correction", body: "Pour corriger un texte ou une traduction, indiquez route de page, langue, phrase exacte, raison de confusion possible et proposition de remplacement. Cela separe une simple formulation d'un probleme qui change l'interpretation du resultat." },
      { heading: "Signalements reseau et SEO", body: "Pour DNS, HTTP, robots, sitemap, meta ou Open Graph, fournissez URL publique, heure de verification, etat attendu, etat observe, redirect chain, response headers et signaux canonical. N'envoyez pas d'URL d'administration interne ni de ressource demandant une connexion." },
      { heading: "Preparer des exemples surs", body: "Si un exemple contient token reel, cookie, customer id, host interne ou lien a usage unique, remplacez-le par une valeur de test de meme structure. Vous pouvez garder noms de champs, longueur, encoding et retours ligne, mais supprimez toute valeur identifiable." },
      { heading: "Problemes examines en priorite", body: "Sont prioritaires les calculs faux, copies cassees, placeholders anglais dans pages localisees, zones d'entree masquees sur mobile, routes publiques en 404 et redirect loops. Ces defauts empechent l'utilisateur de terminer sa tache principale." },
    ],
  },
  hi: {
    about: [
      { heading: "कार्य प्रवाह पर बने पेज", body: "हर टूल में सुरक्षित इनपुट उदाहरण, विकल्प, परिणाम सारांश, चेतावनी और कॉपी से पहले जांच एक ही क्रम में रखी जाती है। उद्देश्य सामान्य वाक्य बढ़ाना नहीं, बल्कि यह दिखाना है कि उपयोगकर्ता मान कैसे चिपकाए, निदान कैसे पढ़े, परिणाम कैसे परखे और अगला कदम कैसे चुने।" },
      { heading: "जांचे जा सकने वाले परिणाम", body: "formatter, validator, generator और parser के परिणाम में इनपुट आकार, संरचना, मिली हुई जोखिम सूचना, ज्ञात सीमा और अगले जांच बिंदु दिखते हैं। उपयोगकर्ता output को सीधे मानने के बजाय उसे अपने runtime, platform दस्तावेज़ या deploy setup से मिला सकता है।" },
      { heading: "खोज से आने वाले उपयोगकर्ता का अगला कदम", body: "कई developer काम एक ही tool पर समाप्त नहीं होते। API response साफ करना, token जांचना, redirect समस्या देखना, DNS deployment पुष्टि करना और security header review करना संबंधित tools और guides से जुड़ता है, ताकि user workflow अधूरा न रहे।" },
      { heading: "सार्वजनिक गुणवत्ता जांच", body: "Public pages में title, description, h1, visible text, locale alternate, canonical, sitemap coverage, mobile reading और placeholder exposure जांचे जाते हैं। नया content केवल लंबाई बढ़ाने के लिए दोहराया नहीं जाना चाहिए; उसमें निर्णय लेने योग्य जांच बिंदु होने चाहिए।" },
    ],
    contact: [
      { heading: "सुधार अनुरोध का संदर्भ", body: "Text या translation सुधार भेजते समय page path, language, exact sentence, user confusion का कारण और suggested replacement लिखें। इससे spelling issue और result समझने पर असर डालने वाली quality issue अलग करना आसान होता है।" },
      { heading: "Network और SEO report", body: "DNS, HTTP, robots, sitemap, meta या Open Graph समस्या के लिए public URL, check time, expected state, actual state, redirect chain, response headers और canonical संकेत दें। Internal admin URL या login वाली resource ईमेल में न भेजें।" },
      { heading: "सुरक्षित input example बनाना", body: "अगर example में real token, cookie, customer id, internal host या one-time link है, तो उसे समान structure वाले test value से बदलें। Field names, length, encoding और line breaks रखे जा सकते हैं, लेकिन पहचान योग्य values हटानी चाहिए।" },
      { heading: "पहले देखी जाने वाली समस्याएं", body: "गलत calculation, टूटे copy result, localized page में English placeholder, mobile पर ढका input area, public route का 404 और redirect loop पहले जांचे जाते हैं। ये issues user को core task पूरा करने से रोकते हैं।" },
    ],
  },
  id: {
    about: [
      { heading: "Halaman berbasis alur kerja", body: "Setiap alat menempatkan contoh masukan, opsi, ringkasan hasil, peringatan, dan pemeriksaan sebelum salin dalam satu alur. Tujuannya bukan menambah teks umum, tetapi menunjukkan cara menempel nilai aman, membaca diagnosis, menilai hasil, lalu melanjutkan ke langkah berikutnya." },
      { heading: "Hasil yang bisa diperiksa", body: "Hasil formatter, validator, generator, dan parser menampilkan ukuran masukan, struktur, risiko yang terdeteksi, batas yang diketahui, dan titik pemeriksaan berikutnya. Pengguna bisa membandingkan keluaran dengan runtime, dokumentasi platform, atau deploy sebenarnya sebelum dipakai." },
      { heading: "Langkah berikut dari pencarian", body: "Banyak tugas developer tidak selesai di satu utilitas. Merapikan respons API, memeriksa token, menelusuri redirect, memastikan DNS deploy, atau meninjau security header dihubungkan ke alat dan panduan terkait agar alur kerja tetap lengkap." },
      { heading: "Kriteria kualitas publik", body: "Halaman publik diperiksa lewat title, description, h1, teks terlihat, locale alternate, canonical, sitemap, keterbacaan mobile, dan tidak adanya placeholder. Konten baru harus memberi kriteria keputusan yang berguna, bukan pengulangan kalimat untuk menambah panjang." },
    ],
    contact: [
      { heading: "Konteks untuk koreksi", body: "Saat mengirim koreksi teks atau terjemahan, sertakan path halaman, bahasa, kalimat persis, alasan pengguna bisa salah paham, dan usulan pengganti. Ini membantu memisahkan masalah ejaan dari masalah kualitas yang memengaruhi pemahaman hasil." },
      { heading: "Laporan jaringan dan SEO", body: "Untuk DNS, HTTP, robots, sitemap, meta, atau Open Graph, sertakan URL publik, waktu pengecekan, status yang diharapkan, status aktual, redirect chain, response headers, dan sinyal canonical. Jangan kirim URL admin internal atau resource yang butuh login." },
      { heading: "Menyiapkan contoh aman", body: "Jika contoh memuat token nyata, cookie, customer id, host internal, atau tautan sekali pakai, ganti dengan nilai uji yang strukturnya sama. Nama field, panjang, encoding, dan baris baru boleh dipertahankan, tetapi nilai yang bisa mengidentifikasi harus dihapus." },
      { heading: "Masalah yang dicek lebih dulu", body: "Prioritas diberikan pada perhitungan salah, hasil salin rusak, placeholder Inggris di halaman lokal, area masukan tertutup di mobile, route publik 404, dan redirect loop. Masalah seperti ini langsung menghalangi tugas utama pengguna." },
    ],
  },
  vi: {
    about: [
      { heading: "Trang theo luồng công việc", body: "Mỗi công cụ đặt ví dụ đầu vào, tùy chọn, tóm tắt kết quả, cảnh báo và kiểm tra trước khi sao chép trong cùng một luồng. Mục tiêu không phải thêm đoạn chung chung, mà là cho thấy cách dán giá trị an toàn, đọc chẩn đoán, đánh giá kết quả và đi tiếp." },
      { heading: "Kết quả có thể kiểm chứng", body: "Kết quả formatter, validator, generator và parser hiển thị kích thước đầu vào, cấu trúc, rủi ro phát hiện, giới hạn đã biết và điểm cần kiểm tra tiếp. Người dùng có thể so sánh đầu ra với runtime, tài liệu nền tảng hoặc môi trường triển khai thật trước khi dùng." },
      { heading: "Bước tiếp theo từ tìm kiếm", body: "Nhiều việc của lập trình viên không kết thúc ở một tiện ích. Làm sạch phản hồi API, kiểm tra token, gỡ redirect, xác nhận DNS triển khai hoặc rà security header được nối với công cụ và hướng dẫn liên quan để giữ luồng làm việc đầy đủ." },
      { heading: "Tiêu chí chất lượng công khai", body: "Trang công khai được kiểm tra title, description, h1, chữ hiển thị, locale alternate, canonical, sitemap, đọc trên mobile và placeholder. Nội dung mới phải đưa ra tiêu chí quyết định hữu ích, không lặp câu giống nhau chỉ để tăng độ dài." },
    ],
    contact: [
      { heading: "Bối cảnh cho yêu cầu sửa", body: "Khi gửi sửa văn bản hoặc bản dịch, hãy kèm path trang, ngôn ngữ, câu chính xác, lý do người dùng có thể hiểu sai và đề xuất thay thế. Điều này giúp tách lỗi chính tả khỏi vấn đề chất lượng ảnh hưởng đến cách hiểu kết quả." },
      { heading: "Báo cáo mạng và SEO", body: "Với DNS, HTTP, robots, sitemap, meta hoặc Open Graph, hãy gửi URL công khai, thời điểm kiểm tra, trạng thái mong đợi, trạng thái thực tế, redirect chain, response headers và tín hiệu canonical. Không gửi URL quản trị nội bộ hay tài nguyên cần đăng nhập." },
      { heading: "Chuẩn bị ví dụ an toàn", body: "Nếu ví dụ có token thật, cookie, customer id, host nội bộ hoặc link dùng một lần, hãy đổi sang giá trị thử nghiệm cùng cấu trúc. Có thể giữ tên field, độ dài, encoding và xuống dòng, nhưng mọi giá trị nhận diện được phải xóa." },
      { heading: "Vấn đề được kiểm tra trước", body: "Ưu tiên gồm tính toán sai, nội dung copy bị hỏng, placeholder tiếng Anh trong trang bản địa hóa, vùng nhập bị che trên mobile, route công khai trả 404 và redirect loop. Các lỗi này trực tiếp chặn tác vụ chính của người dùng." },
    ],
  },
  th: {
    about: [
      { heading: "หน้าที่จัดตามลำดับงาน", body: "แต่ละเครื่องมือวางตัวอย่างข้อมูล ตัวเลือก สรุปผล คำเตือน และการตรวจทานก่อนคัดลอกไว้ในลำดับเดียว เป้าหมายไม่ใช่การเพิ่มข้อความทั่วไป แต่คือการแสดงวิธีวางค่าที่ปลอดภัย อ่านการวินิจฉัย ตัดสินผลลัพธ์ และไปต่อยังขั้นตอนถัดไป" },
      { heading: "ผลลัพธ์ที่ตรวจซ้ำได้", body: "ผลจาก formatter, validator, generator และ parser จะแสดงขนาด input โครงสร้าง ความเสี่ยงที่พบ ข้อจำกัดที่รู้ และจุดตรวจถัดไป ผู้ใช้จึงเทียบ output กับ runtime เอกสาร platform หรือสภาพแวดล้อม deploy จริงก่อนใช้งานได้" },
      { heading: "ขั้นตอนถัดไปจากการค้นหา", body: "งานของนักพัฒนาหลายอย่างไม่จบที่เครื่องมือเดียว เช่น การจัดรูป API response การตรวจ token การ debug redirect การยืนยัน DNS deploy หรือการ review security header จะเชื่อมไปยังเครื่องมือและคู่มือที่เกี่ยวข้องเพื่อให้ workflow สมบูรณ์" },
      { heading: "เกณฑ์คุณภาพของหน้าสาธารณะ", body: "หน้าสาธารณะตรวจ title, description, h1, ข้อความที่มองเห็น, locale alternate, canonical, sitemap, การอ่านบน mobile และ placeholder ที่หลงเหลือ เนื้อหาใหม่ต้องให้เกณฑ์ตัดสินที่ใช้ได้จริง ไม่ใช่ประโยคซ้ำเพื่อเพิ่มความยาวเท่านั้น" },
    ],
    contact: [
      { heading: "บริบทสำหรับคำขอแก้ไข", body: "เมื่อส่งการแก้ข้อความหรือคำแปล โปรดใส่ path ของหน้า ภาษา ประโยคที่ต้องแก้ เหตุผลที่ผู้ใช้อาจเข้าใจผิด และคำแทนที่ที่แนะนำ วิธีนี้ช่วยแยกปัญหาสะกดคำออกจากปัญหาคุณภาพที่มีผลต่อการเข้าใจผลลัพธ์" },
      { heading: "รายงาน network และ SEO", body: "สำหรับ DNS, HTTP, robots, sitemap, meta หรือ Open Graph ให้ใส่ URL สาธารณะ เวลาที่ตรวจ สถานะที่คาดหวัง สถานะจริง redirect chain, response headers และสัญญาณ canonical ห้ามส่ง URL ผู้ดูแลภายในหรือ resource ที่ต้อง login" },
      { heading: "เตรียมตัวอย่างที่ปลอดภัย", body: "ถ้าตัวอย่างมี token จริง cookie, customer id, host ภายใน หรือลิงก์ใช้ครั้งเดียว ให้เปลี่ยนเป็นค่าทดสอบที่มีโครงสร้างเดียวกัน ชื่อ field ความยาว encoding และการขึ้นบรรทัดใหม่คงไว้ได้ แต่ค่าที่ระบุตัวตนต้องถูกลบ" },
      { heading: "ปัญหาที่ตรวจเป็นลำดับแรก", body: "จะให้ความสำคัญกับการคำนวณผิด ผล copy เสีย placeholder ภาษาอังกฤษในหน้าท้องถิ่น พื้นที่ input ถูกบังบน mobile, route สาธารณะเป็น 404 และ redirect loop เพราะปัญหาเหล่านี้ขัดขวางงานหลักของผู้ใช้โดยตรง" },
    ],
  },
  ar: {
    about: [
      { heading: "صفحات مبنية حول سير العمل", body: "كل أداة تضع مثال الإدخال والخيارات وملخص النتيجة والتحذيرات وفحص ما قبل النسخ في مسار واحد. الهدف ليس زيادة نص عام، بل توضيح كيف يلصق المستخدم قيمة آمنة، يقرأ التشخيص، يقيم النتيجة، ثم ينتقل إلى الخطوة التالية." },
      { heading: "نتائج قابلة للتحقق", body: "نتائج formatter وvalidator وgenerator وparser تعرض حجم الإدخال والبنية والمخاطر المكتشفة والحدود المعروفة ونقاط الفحص التالية. يستطيع المستخدم مقارنة المخرجات مع runtime أو وثائق المنصة أو بيئة النشر الفعلية قبل استخدامها." },
      { heading: "الخطوة التالية من البحث", body: "كثير من مهام المطور لا ينتهي في أداة واحدة. تنسيق API response وفحص token وتتبع redirect وتأكيد DNS deploy ومراجعة security header ترتبط بأدوات وأدلة قريبة حتى يبقى سير العمل كاملا." },
      { heading: "معايير جودة الصفحة العامة", body: "تراجع الصفحات العامة من خلال title وdescription وh1 والنص المرئي وlocale alternate وcanonical وsitemap والقراءة على mobile وغياب placeholder. المحتوى الجديد يجب أن يقدم معايير قرار مفيدة، لا جملا مكررة لزيادة الطول فقط." },
    ],
    contact: [
      { heading: "السياق المطلوب للتصحيح", body: "عند إرسال تصحيح نص أو ترجمة، اذكر path الصفحة واللغة والجملة المحددة وسبب الالتباس المحتمل واقتراح الاستبدال. يساعد ذلك على فصل خطأ الكتابة عن مشكلة جودة تؤثر في فهم نتيجة الأداة." },
      { heading: "بلاغات الشبكة وSEO", body: "لمشكلات DNS أو HTTP أو robots أو sitemap أو meta أو Open Graph، أرسل URL عاما ووقت الفحص والحالة المتوقعة والحالة الفعلية وredirect chain وresponse headers وإشارات canonical. لا ترسل URL إداريا داخليا أو موردا يحتاج login." },
      { heading: "إعداد أمثلة آمنة", body: "إذا احتوى المثال على token حقيقي أو cookie أو customer id أو host داخلي أو رابط يستخدم مرة واحدة، فاستبدله بقيمة اختبار لها البنية نفسها. يمكن إبقاء أسماء الحقول والطول وencoding وفواصل الأسطر، لكن يجب حذف أي قيمة يمكن التعرف منها على مشروع أو شخص." },
      { heading: "المشكلات ذات الأولوية", body: "تراجع أولا الحسابات الخاطئة، ونسخ النتائج المعطوب، ووجود placeholder إنجليزي في صفحة مترجمة، وحجب منطقة الإدخال على mobile، وroute عام يعيد 404 أو redirect loop. هذه الأخطاء تمنع المستخدم من إنهاء المهمة الأساسية." },
    ],
  },
};

export function getLocalizedTrustContent(locale: Locale = defaultLocale, kind: TrustPageKind) {
  const content = locale === defaultLocale ? english[kind] : localized[locale][kind];
  const expansionSections = locale === defaultLocale ? [] : localizedTrustExpansionSections[locale][kind];
  const depthSections = locale === defaultLocale ? [] : (localizedTrustDepthSections[locale]?.[kind] ?? []);
  const qualitySections = locale === defaultLocale ? [] : localizedTrustQualitySections[locale][kind];

  return {
    ...content,
    lastUpdated: trustUpdatedAt[locale],
    sections: [...content.sections, ...expansionSections, ...depthSections, ...qualitySections],
  };
}
