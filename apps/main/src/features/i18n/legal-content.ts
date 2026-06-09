import { defaultLocale, type Locale } from "@/features/i18n/config";

export type LegalPageKind = "privacy" | "terms";

type LegalSection = {
  heading: string;
  body: string;
};

type LegalPageContent = {
  title: string;
  description: string;
  lastUpdated: string;
  backToTools: string;
  sections: LegalSection[];
  contact: {
    heading: string;
    body: string;
  };
};

const english: Record<LegalPageKind, LegalPageContent> = {
  privacy: {
    title: "Privacy Policy",
    description: "Privacy policy for Bob's Multi Tool developer utilities.",
    lastUpdated: "Last updated: June 5, 2026",
    backToTools: "Back to tools",
    sections: [
      {
        heading: "Information processed by tools",
        body: "Bob's Multi Tool is designed around local browser utilities. Inputs used for formatting, encoding, decoding, generation, and conversion are processed in your browser where practical and are not stored by this site.",
      },
      {
        heading: "Server route checks",
        body: "HTTP status and DNS tools require a small server route because browsers cannot perform those checks directly. Do not submit private internal hostnames or confidential data.",
      },
      {
        heading: "Analytics and advertising",
        body: "The site may use Google Analytics and Google AdSense. These third-party services may use cookies or similar technologies according to their own policies.",
      },
    ],
    contact: {
      heading: "Contact",
      body: "Questions about this policy can be sent to",
    },
  },
  terms: {
    title: "Terms of Service",
    description: "Terms of service for Bob's Multi Tool developer utilities.",
    lastUpdated: "Last updated: June 5, 2026",
    backToTools: "Back to tools",
    sections: [
      {
        heading: "Use of the service",
        body: "Bob's Multi Tool provides free browser-based utilities for development workflows. Tool output should be verified before relying on it in production systems.",
      },
      {
        heading: "Acceptable use",
        body: "You agree not to disrupt the service, automate abusive traffic, use the tools for unlawful activity, or submit private data you are not allowed to process in a browser utility.",
      },
      {
        heading: "Third-party content",
        body: "Some tools may use third-party services or server routes. Bob's Multi Tool does not control third-party websites, DNS providers, or remote endpoints.",
      },
      {
        heading: "Advertising",
        body: "The site may display ads through Google AdSense after approval. Advertisement content is served by third-party networks and may be personalized according to their policies.",
      },
    ],
    contact: {
      heading: "Contact",
      body: "Questions about these terms can be sent to",
    },
  },
};

const localized: Record<Exclude<Locale, "en">, Record<LegalPageKind, LegalPageContent>> = {
  ko: {
    privacy: {
      title: "개인정보 처리방침",
      description: "Bob's Multi Tool 개발자 유틸리티의 개인정보 처리방침입니다.",
      lastUpdated: "최종 업데이트: 2026년 6월 5일",
      backToTools: "도구로 돌아가기",
      sections: [
        { heading: "도구에서 처리하는 정보", body: "Bob's Multi Tool은 브라우저 기반 로컬 유틸리티를 중심으로 설계되었습니다. 포맷, 인코딩, 디코딩, 생성, 변환에 쓰는 입력값은 가능한 경우 브라우저에서 처리되며 이 사이트에 저장되지 않습니다." },
        { heading: "서버 route 확인", body: "HTTP status와 DNS 도구는 브라우저만으로 직접 확인할 수 없기 때문에 작은 서버 route를 사용합니다. 비공개 내부 호스트명이나 기밀 데이터는 제출하지 마세요." },
        { heading: "분석과 광고", body: "이 사이트는 Google Analytics와 Google AdSense를 사용할 수 있습니다. 이러한 제3자 서비스는 각자의 정책에 따라 쿠키 또는 유사 기술을 사용할 수 있습니다." },
      ],
      contact: { heading: "문의", body: "이 정책에 대한 질문은 다음 주소로 보낼 수 있습니다" },
    },
    terms: {
      title: "서비스 약관",
      description: "Bob's Multi Tool 개발자 유틸리티의 서비스 약관입니다.",
      lastUpdated: "최종 업데이트: 2026년 6월 5일",
      backToTools: "도구로 돌아가기",
      sections: [
        { heading: "서비스 이용", body: "Bob's Multi Tool은 개발 작업 흐름을 위한 무료 브라우저 기반 유틸리티를 제공합니다. 운영 시스템에서 결과에 의존하기 전에 반드시 직접 검증해야 합니다." },
        { heading: "허용되는 이용", body: "서비스를 방해하거나, 남용 트래픽을 자동화하거나, 불법 활동에 사용하거나, 브라우저 유틸리티에서 처리할 권한이 없는 비공개 데이터를 제출해서는 안 됩니다." },
        { heading: "제3자 콘텐츠", body: "일부 도구는 제3자 서비스나 서버 route를 사용할 수 있습니다. Bob's Multi Tool은 제3자 웹사이트, DNS 제공자, 원격 endpoint를 제어하지 않습니다." },
        { heading: "광고", body: "승인 후 이 사이트는 Google AdSense 광고를 표시할 수 있습니다. 광고 콘텐츠는 제3자 네트워크에서 제공되며 해당 정책에 따라 개인화될 수 있습니다." },
      ],
      contact: { heading: "문의", body: "이 약관에 대한 질문은 다음 주소로 보낼 수 있습니다" },
    },
  },
  ja: {
    privacy: {
      title: "プライバシーポリシー",
      description: "Bob's Multi Tool 開発者ユーティリティのプライバシーポリシーです。",
      lastUpdated: "最終更新日: 2026年6月5日",
      backToTools: "ツールへ戻る",
      sections: [
        { heading: "ツールで処理される情報", body: "Bob's Multi Tool はブラウザ内で動くローカルユーティリティを中心に設計されています。整形、エンコード、デコード、生成、変換に使う入力は、可能な場合ブラウザ内で処理され、このサイトには保存されません。" },
        { heading: "サーバー route の確認", body: "HTTP status と DNS ツールはブラウザだけでは直接確認できないため、小さなサーバー route を使います。非公開の内部ホスト名や機密データは送信しないでください。" },
        { heading: "分析と広告", body: "このサイトは Google Analytics と Google AdSense を使用する場合があります。これらの第三者サービスは、それぞれのポリシーに従って cookie または類似技術を使用することがあります。" },
      ],
      contact: { heading: "問い合わせ", body: "このポリシーに関する質問は次の宛先へ送信できます" },
    },
    terms: {
      title: "利用規約",
      description: "Bob's Multi Tool 開発者ユーティリティの利用規約です。",
      lastUpdated: "最終更新日: 2026年6月5日",
      backToTools: "ツールへ戻る",
      sections: [
        { heading: "サービスの利用", body: "Bob's Multi Tool は開発ワークフロー向けの無料ブラウザユーティリティを提供します。出力を本番システムで利用する前に必ず検証してください。" },
        { heading: "許容される利用", body: "サービスの妨害、不正な自動トラフィック、違法行為への利用、または第三者のブラウザユーティリティで処理する権限のない非公開データの送信は禁止されています。" },
        { heading: "第三者コンテンツ", body: "一部のツールは第三者サービスまたはサーバー route を使用する場合があります。Bob's Multi Tool は第三者サイト、DNS provider、remote endpoint を管理しません。" },
        { heading: "広告", body: "承認後、このサイトは Google AdSense 広告を表示する場合があります。広告コンテンツは第三者ネットワークから配信され、そのポリシーに従ってパーソナライズされることがあります。" },
      ],
      contact: { heading: "問い合わせ", body: "この規約に関する質問は次の宛先へ送信できます" },
    },
  },
  "zh-CN": {
    privacy: {
      title: "隐私政策",
      description: "Bob's Multi Tool 开发者工具的隐私政策。",
      lastUpdated: "最后更新: 2026年6月5日",
      backToTools: "返回工具",
      sections: [
        { heading: "工具处理的信息", body: "Bob's Multi Tool 围绕本地浏览器工具设计。用于格式化、编码、解码、生成和转换的输入会在可行时于浏览器中处理，并且不会被本站存储。" },
        { heading: "服务器 route 检查", body: "HTTP status 和 DNS 工具需要小型服务器 route，因为浏览器无法直接执行这些检查。请不要提交私有内部主机名或机密数据。" },
        { heading: "分析与广告", body: "本站可能使用 Google Analytics 和 Google AdSense。此类第三方服务可能根据其自身政策使用 cookie 或类似技术。" },
      ],
      contact: { heading: "联系", body: "关于此政策的问题可以发送至" },
    },
    terms: {
      title: "服务条款",
      description: "Bob's Multi Tool 开发者工具的服务条款。",
      lastUpdated: "最后更新: 2026年6月5日",
      backToTools: "返回工具",
      sections: [
        { heading: "服务使用", body: "Bob's Multi Tool 提供免费的浏览器开发工具。将工具输出用于生产系统前，应自行验证。" },
        { heading: "可接受使用", body: "你不得干扰服务、自动化滥用流量、将工具用于违法活动，或提交你无权在浏览器工具中处理的私有数据。" },
        { heading: "第三方内容", body: "部分工具可能使用第三方服务或服务器 route。Bob's Multi Tool 不控制第三方网站、DNS 提供商或远程 endpoint。" },
        { heading: "广告", body: "获得批准后，本站可能展示 Google AdSense 广告。广告内容由第三方网络提供，并可能依据其政策进行个性化。" },
      ],
      contact: { heading: "联系", body: "关于这些条款的问题可以发送至" },
    },
  },
  "zh-TW": {
    privacy: {
      title: "隱私權政策",
      description: "Bob's Multi Tool 開發者工具的隱私權政策。",
      lastUpdated: "最後更新: 2026年6月5日",
      backToTools: "返回工具",
      sections: [
        { heading: "工具處理的資訊", body: "Bob's Multi Tool 以本機瀏覽器工具為核心設計。用於格式化、編碼、解碼、產生與轉換的輸入會在可行時於瀏覽器中處理，本站不會儲存。" },
        { heading: "伺服器 route 檢查", body: "HTTP status 與 DNS 工具需要小型伺服器 route，因為瀏覽器無法直接執行這些檢查。請不要提交私有內部主機名稱或機密資料。" },
        { heading: "分析與廣告", body: "本站可能使用 Google Analytics 與 Google AdSense。這些第三方服務可能依其政策使用 cookie 或類似技術。" },
      ],
      contact: { heading: "聯絡", body: "關於此政策的問題可以寄到" },
    },
    terms: {
      title: "服務條款",
      description: "Bob's Multi Tool 開發者工具的服務條款。",
      lastUpdated: "最後更新: 2026年6月5日",
      backToTools: "返回工具",
      sections: [
        { heading: "服務使用", body: "Bob's Multi Tool 提供免費的瀏覽器開發工具。將工具輸出用於正式系統前，應自行驗證。" },
        { heading: "可接受使用", body: "你不得干擾服務、自動化濫用流量、將工具用於違法活動，或提交你無權在瀏覽器工具中處理的私有資料。" },
        { heading: "第三方內容", body: "部分工具可能使用第三方服務或伺服器 route。Bob's Multi Tool 不控制第三方網站、DNS 提供者或遠端 endpoint。" },
        { heading: "廣告", body: "核准後，本站可能顯示 Google AdSense 廣告。廣告內容由第三方網路提供，並可能依其政策個人化。" },
      ],
      contact: { heading: "聯絡", body: "關於這些條款的問題可以寄到" },
    },
  },
  es: {
    privacy: {
      title: "Politica de privacidad",
      description: "Politica de privacidad de las utilidades para desarrolladores de Bob's Multi Tool.",
      lastUpdated: "Ultima actualizacion: 5 de junio de 2026",
      backToTools: "Volver a herramientas",
      sections: [
        { heading: "Informacion procesada por las herramientas", body: "Bob's Multi Tool esta pensado como un conjunto de utilidades locales en el navegador. Las entradas usadas para formatear, codificar, decodificar, generar y convertir se procesan en el navegador cuando es posible y este sitio no las almacena." },
        { heading: "Comprobaciones con route de servidor", body: "Las herramientas de HTTP status y DNS usan una pequena route de servidor porque el navegador no puede realizar esas comprobaciones directamente. No envies hostnames internos privados ni datos confidenciales." },
        { heading: "Analitica y publicidad", body: "El sitio puede usar Google Analytics y Google AdSense. Estos servicios de terceros pueden usar cookies o tecnologias similares segun sus propias politicas." },
      ],
      contact: { heading: "Contacto", body: "Las preguntas sobre esta politica pueden enviarse a" },
    },
    terms: {
      title: "Terminos del servicio",
      description: "Terminos del servicio de las utilidades para desarrolladores de Bob's Multi Tool.",
      lastUpdated: "Ultima actualizacion: 5 de junio de 2026",
      backToTools: "Volver a herramientas",
      sections: [
        { heading: "Uso del servicio", body: "Bob's Multi Tool ofrece utilidades gratuitas basadas en navegador para flujos de desarrollo. Verifica la salida antes de usarla en sistemas de produccion." },
        { heading: "Uso aceptable", body: "Aceptas no interrumpir el servicio, automatizar trafico abusivo, usar las herramientas para actividades ilegales ni enviar datos privados que no puedes procesar en una utilidad de navegador." },
        { heading: "Contenido de terceros", body: "Algunas herramientas pueden usar servicios de terceros o routes de servidor. Bob's Multi Tool no controla sitios de terceros, proveedores DNS ni endpoints remotos." },
        { heading: "Publicidad", body: "Tras la aprobacion, el sitio puede mostrar anuncios de Google AdSense. El contenido publicitario lo sirven redes de terceros y puede personalizarse segun sus politicas." },
      ],
      contact: { heading: "Contacto", body: "Las preguntas sobre estos terminos pueden enviarse a" },
    },
  },
  "pt-BR": {
    privacy: {
      title: "Politica de privacidade",
      description: "Politica de privacidade das utilidades para desenvolvedores do Bob's Multi Tool.",
      lastUpdated: "Ultima atualizacao: 5 de junho de 2026",
      backToTools: "Voltar para ferramentas",
      sections: [
        { heading: "Informacoes processadas pelas ferramentas", body: "Bob's Multi Tool e pensado como um conjunto de utilitarios locais no navegador. Entradas usadas para formatar, codificar, decodificar, gerar e converter sao processadas no navegador quando possivel e nao sao armazenadas por este site." },
        { heading: "Checagens com route de servidor", body: "As ferramentas de HTTP status e DNS usam uma pequena route de servidor porque o navegador nao consegue fazer essas checagens diretamente. Nao envie hostnames internos privados nem dados confidenciais." },
        { heading: "Analise e publicidade", body: "O site pode usar Google Analytics e Google AdSense. Esses servicos de terceiros podem usar cookies ou tecnologias semelhantes conforme suas proprias politicas." },
      ],
      contact: { heading: "Contato", body: "Perguntas sobre esta politica podem ser enviadas para" },
    },
    terms: {
      title: "Termos de servico",
      description: "Termos de servico das utilidades para desenvolvedores do Bob's Multi Tool.",
      lastUpdated: "Ultima atualizacao: 5 de junho de 2026",
      backToTools: "Voltar para ferramentas",
      sections: [
        { heading: "Uso do servico", body: "Bob's Multi Tool oferece utilitarios gratuitos baseados em navegador para fluxos de desenvolvimento. Verifique a saida antes de confiar nela em sistemas de producao." },
        { heading: "Uso aceitavel", body: "Voce concorda em nao interromper o servico, automatizar trafego abusivo, usar as ferramentas para atividades ilegais ou enviar dados privados que nao pode processar em uma utilidade de navegador." },
        { heading: "Conteudo de terceiros", body: "Algumas ferramentas podem usar servicos de terceiros ou routes de servidor. Bob's Multi Tool nao controla sites de terceiros, provedores DNS ou endpoints remotos." },
        { heading: "Publicidade", body: "Apos aprovacao, o site pode exibir anuncios do Google AdSense. O conteudo publicitario e servido por redes de terceiros e pode ser personalizado conforme suas politicas." },
      ],
      contact: { heading: "Contato", body: "Perguntas sobre estes termos podem ser enviadas para" },
    },
  },
  de: {
    privacy: {
      title: "Datenschutzerklaerung",
      description: "Datenschutzerklaerung fuer die Entwicklertools von Bob's Multi Tool.",
      lastUpdated: "Zuletzt aktualisiert: 5. Juni 2026",
      backToTools: "Zurueck zu Tools",
      sections: [
        { heading: "Von Tools verarbeitete Informationen", body: "Bob's Multi Tool ist auf lokale Browser-Utilities ausgelegt. Eingaben fuer Formatierung, Encoding, Decoding, Generierung und Konvertierung werden nach Moeglichkeit im Browser verarbeitet und von dieser Seite nicht gespeichert." },
        { heading: "Pruefungen ueber Serverroute", body: "HTTP-Status- und DNS-Tools verwenden eine kleine Serverroute, weil Browser diese Pruefungen nicht direkt ausfuehren koennen. Sende keine privaten internen Hostnamen oder vertraulichen Daten." },
        { heading: "Analyse und Werbung", body: "Die Seite kann Google Analytics und Google AdSense verwenden. Diese Drittanbieter koennen Cookies oder aehnliche Technologien gemaess ihren eigenen Richtlinien einsetzen." },
      ],
      contact: { heading: "Kontakt", body: "Fragen zu dieser Richtlinie koennen gesendet werden an" },
    },
    terms: {
      title: "Nutzungsbedingungen",
      description: "Nutzungsbedingungen fuer die Entwicklertools von Bob's Multi Tool.",
      lastUpdated: "Zuletzt aktualisiert: 5. Juni 2026",
      backToTools: "Zurueck zu Tools",
      sections: [
        { heading: "Nutzung des Dienstes", body: "Bob's Multi Tool bietet kostenlose browserbasierte Utilities fuer Entwicklungsworkflows. Tool-Ausgaben sollten geprueft werden, bevor sie in Produktionssystemen verwendet werden." },
        { heading: "Zulaessige Nutzung", body: "Du verpflichtest dich, den Dienst nicht zu stoeren, missbraeuchlichen Traffic nicht zu automatisieren, die Tools nicht fuer rechtswidrige Aktivitaeten zu nutzen und keine privaten Daten zu senden, die du nicht in einer Browser-Utility verarbeiten darfst." },
        { heading: "Drittanbieterinhalte", body: "Einige Tools koennen Drittanbieterdienste oder Serverrouten verwenden. Bob's Multi Tool kontrolliert keine Drittanbieter-Websites, DNS-Anbieter oder Remote-Endpunkte." },
        { heading: "Werbung", body: "Nach Genehmigung kann die Seite Google-AdSense-Anzeigen anzeigen. Werbeinhalte werden von Drittanbietern ausgeliefert und koennen gemaess deren Richtlinien personalisiert werden." },
      ],
      contact: { heading: "Kontakt", body: "Fragen zu diesen Bedingungen koennen gesendet werden an" },
    },
  },
  fr: {
    privacy: {
      title: "Politique de confidentialite",
      description: "Politique de confidentialite des utilitaires developpeur de Bob's Multi Tool.",
      lastUpdated: "Derniere mise a jour : 5 juin 2026",
      backToTools: "Retour aux outils",
      sections: [
        { heading: "Informations traitees par les outils", body: "Bob's Multi Tool est concu autour d'utilitaires locaux dans le navigateur. Les entrees utilisees pour formatter, encoder, decoder, generer et convertir sont traitees dans le navigateur quand c'est possible et ne sont pas stockees par ce site." },
        { heading: "Controles via route serveur", body: "Les outils HTTP status et DNS utilisent une petite route serveur car le navigateur ne peut pas faire ces controles directement. N'envoyez pas de noms d'hotes internes prives ni de donnees confidentielles." },
        { heading: "Analyse et publicite", body: "Le site peut utiliser Google Analytics et Google AdSense. Ces services tiers peuvent utiliser des cookies ou technologies similaires selon leurs propres politiques." },
      ],
      contact: { heading: "Contact", body: "Les questions sur cette politique peuvent etre envoyees a" },
    },
    terms: {
      title: "Conditions d'utilisation",
      description: "Conditions d'utilisation des utilitaires developpeur de Bob's Multi Tool.",
      lastUpdated: "Derniere mise a jour : 5 juin 2026",
      backToTools: "Retour aux outils",
      sections: [
        { heading: "Utilisation du service", body: "Bob's Multi Tool fournit des utilitaires gratuits bases sur le navigateur pour les workflows de developpement. Verifiez les sorties avant de les utiliser dans des systemes de production." },
        { heading: "Utilisation acceptable", body: "Vous acceptez de ne pas perturber le service, automatiser du trafic abusif, utiliser les outils pour des activites illegales ou envoyer des donnees privees que vous n'etes pas autorise a traiter dans un utilitaire navigateur." },
        { heading: "Contenu tiers", body: "Certains outils peuvent utiliser des services tiers ou des routes serveur. Bob's Multi Tool ne controle pas les sites tiers, fournisseurs DNS ou endpoints distants." },
        { heading: "Publicite", body: "Apres approbation, le site peut afficher des annonces Google AdSense. Le contenu publicitaire est servi par des reseaux tiers et peut etre personnalise selon leurs politiques." },
      ],
      contact: { heading: "Contact", body: "Les questions sur ces conditions peuvent etre envoyees a" },
    },
  },
  hi: {
    privacy: {
      title: "गोपनीयता नीति",
      description: "Bob's Multi Tool developer utilities की गोपनीयता नीति.",
      lastUpdated: "अंतिम अपडेट: 5 जून 2026",
      backToTools: "टूल पर वापस",
      sections: [
        { heading: "टूल में process होने वाली जानकारी", body: "Bob's Multi Tool local browser utilities के लिए बनाया गया है. Formatting, encoding, decoding, generation और conversion के input जहां संभव हो browser में process होते हैं और यह site उन्हें store नहीं करती." },
        { heading: "Server route checks", body: "HTTP status और DNS tools छोटी server route का उपयोग करते हैं क्योंकि browser ये checks सीधे नहीं कर सकता. Private internal hostnames या confidential data submit न करें." },
        { heading: "Analytics और advertising", body: "Site Google Analytics और Google AdSense use कर सकती है. ये third-party services अपनी policies के अनुसार cookies या similar technologies use कर सकती हैं." },
      ],
      contact: { heading: "संपर्क", body: "इस policy के बारे में सवाल यहां भेजे जा सकते हैं" },
    },
    terms: {
      title: "सेवा शर्तें",
      description: "Bob's Multi Tool developer utilities की सेवा शर्तें.",
      lastUpdated: "अंतिम अपडेट: 5 जून 2026",
      backToTools: "टूल पर वापस",
      sections: [
        { heading: "सेवा का उपयोग", body: "Bob's Multi Tool development workflows के लिए free browser-based utilities देता है. Production systems में उपयोग करने से पहले tool output verify करें." },
        { heading: "स्वीकार्य उपयोग", body: "Service disrupt न करें, abusive traffic automate न करें, tools को unlawful activity में use न करें, और ऐसा private data submit न करें जिसे browser utility में process करने की अनुमति नहीं है." },
        { heading: "Third-party content", body: "कुछ tools third-party services या server routes use कर सकते हैं. Bob's Multi Tool third-party websites, DNS providers या remote endpoints को control नहीं करता." },
        { heading: "Advertising", body: "Approval के बाद site Google AdSense ads दिखा सकती है. Advertisement content third-party networks से serve होता है और उनकी policies के अनुसार personalize हो सकता है." },
      ],
      contact: { heading: "संपर्क", body: "इन terms के बारे में सवाल यहां भेजे जा सकते हैं" },
    },
  },
  id: {
    privacy: {
      title: "Kebijakan privasi",
      description: "Kebijakan privasi untuk utilitas developer Bob's Multi Tool.",
      lastUpdated: "Terakhir diperbarui: 5 Juni 2026",
      backToTools: "Kembali ke tool",
      sections: [
        { heading: "Informasi yang diproses tool", body: "Bob's Multi Tool dirancang sebagai utilitas lokal di browser. Input untuk format, encoding, decoding, generation, dan conversion diproses di browser jika memungkinkan dan tidak disimpan oleh situs ini." },
        { heading: "Pemeriksaan route server", body: "Tool HTTP status dan DNS memakai route server kecil karena browser tidak bisa melakukan pemeriksaan itu secara langsung. Jangan kirim hostname internal privat atau data rahasia." },
        { heading: "Analitik dan iklan", body: "Situs dapat memakai Google Analytics dan Google AdSense. Layanan pihak ketiga ini dapat memakai cookie atau teknologi serupa sesuai kebijakan mereka." },
      ],
      contact: { heading: "Kontak", body: "Pertanyaan tentang kebijakan ini dapat dikirim ke" },
    },
    terms: {
      title: "Ketentuan layanan",
      description: "Ketentuan layanan untuk utilitas developer Bob's Multi Tool.",
      lastUpdated: "Terakhir diperbarui: 5 Juni 2026",
      backToTools: "Kembali ke tool",
      sections: [
        { heading: "Penggunaan layanan", body: "Bob's Multi Tool menyediakan utilitas browser gratis untuk workflow development. Output tool harus diverifikasi sebelum dipakai di sistem produksi." },
        { heading: "Penggunaan yang diterima", body: "Anda setuju untuk tidak mengganggu layanan, mengotomasi traffic abusif, memakai tool untuk aktivitas ilegal, atau mengirim data privat yang tidak boleh diproses di utilitas browser." },
        { heading: "Konten pihak ketiga", body: "Beberapa tool dapat memakai layanan pihak ketiga atau route server. Bob's Multi Tool tidak mengontrol website pihak ketiga, provider DNS, atau endpoint remote." },
        { heading: "Iklan", body: "Setelah disetujui, situs dapat menampilkan iklan Google AdSense. Konten iklan disajikan oleh jaringan pihak ketiga dan dapat dipersonalisasi sesuai kebijakan mereka." },
      ],
      contact: { heading: "Kontak", body: "Pertanyaan tentang ketentuan ini dapat dikirim ke" },
    },
  },
  vi: {
    privacy: {
      title: "Chinh sach rieng tu",
      description: "Chinh sach rieng tu cho tien ich lap trinh Bob's Multi Tool.",
      lastUpdated: "Cap nhat lan cuoi: 5 thang 6, 2026",
      backToTools: "Quay lai cong cu",
      sections: [
        { heading: "Thong tin duoc cong cu xu ly", body: "Bob's Multi Tool duoc thiet ke quanh cac tien ich cuc bo tren trinh duyet. Dau vao dung cho dinh dang, ma hoa, giai ma, tao va chuyen doi duoc xu ly trong trinh duyet khi co the va khong duoc site nay luu tru." },
        { heading: "Kiem tra bang route server", body: "Cong cu HTTP status va DNS can route server nho vi trinh duyet khong the tu thuc hien truc tiep. Khong gui hostname noi bo rieng tu hoac du lieu bao mat." },
        { heading: "Phan tich va quang cao", body: "Site co the dung Google Analytics va Google AdSense. Cac dich vu ben thu ba nay co the dung cookie hoac cong nghe tuong tu theo chinh sach rieng cua ho." },
      ],
      contact: { heading: "Lien he", body: "Cau hoi ve chinh sach nay co the gui toi" },
    },
    terms: {
      title: "Dieu khoan dich vu",
      description: "Dieu khoan dich vu cho tien ich lap trinh Bob's Multi Tool.",
      lastUpdated: "Cap nhat lan cuoi: 5 thang 6, 2026",
      backToTools: "Quay lai cong cu",
      sections: [
        { heading: "Su dung dich vu", body: "Bob's Multi Tool cung cap tien ich mien phi tren trinh duyet cho workflow lap trinh. Can kiem tra output truoc khi dua vao he thong production." },
        { heading: "Su dung chap nhan duoc", body: "Ban dong y khong lam gian doan dich vu, khong tu dong hoa traffic lam dung, khong dung cong cu cho hoat dong bat hop phap, va khong gui du lieu rieng tu ma ban khong duoc phep xu ly trong tien ich trinh duyet." },
        { heading: "Noi dung ben thu ba", body: "Mot so cong cu co the dung dich vu ben thu ba hoac route server. Bob's Multi Tool khong kiem soat website ben thu ba, nha cung cap DNS hoac endpoint tu xa." },
        { heading: "Quang cao", body: "Sau khi duoc chap thuan, site co the hien thi quang cao Google AdSense. Noi dung quang cao do mang ben thu ba phuc vu va co the duoc ca nhan hoa theo chinh sach cua ho." },
      ],
      contact: { heading: "Lien he", body: "Cau hoi ve dieu khoan nay co the gui toi" },
    },
  },
  th: {
    privacy: {
      title: "นโยบายความเป็นส่วนตัว",
      description: "นโยบายความเป็นส่วนตัวสำหรับเครื่องมือ developer ของ Bob's Multi Tool",
      lastUpdated: "อัปเดตล่าสุด: 5 มิถุนายน 2026",
      backToTools: "กลับไปเครื่องมือ",
      sections: [
        { heading: "ข้อมูลที่เครื่องมือประมวลผล", body: "Bob's Multi Tool ออกแบบให้เป็นยูทิลิตี้ในเบราว์เซอร์เป็นหลัก อินพุตสำหรับ formatting, encoding, decoding, generation และ conversion จะประมวลผลในเบราว์เซอร์เมื่อทำได้ และเว็บไซต์นี้ไม่จัดเก็บข้อมูลเหล่านั้น" },
        { heading: "การตรวจผ่าน route server", body: "เครื่องมือ HTTP status และ DNS ใช้ route server ขนาดเล็ก เพราะเบราว์เซอร์ไม่สามารถตรวจสิ่งเหล่านี้ได้โดยตรง ห้ามส่ง hostname ภายในหรือข้อมูลลับ" },
        { heading: "Analytics และโฆษณา", body: "เว็บไซต์อาจใช้ Google Analytics และ Google AdSense บริการภายนอกเหล่านี้อาจใช้ cookie หรือเทคโนโลยีใกล้เคียงตามนโยบายของตนเอง" },
      ],
      contact: { heading: "ติดต่อ", body: "คำถามเกี่ยวกับนโยบายนี้ส่งได้ที่" },
    },
    terms: {
      title: "ข้อกำหนดการใช้บริการ",
      description: "ข้อกำหนดการใช้บริการสำหรับเครื่องมือ developer ของ Bob's Multi Tool",
      lastUpdated: "อัปเดตล่าสุด: 5 มิถุนายน 2026",
      backToTools: "กลับไปเครื่องมือ",
      sections: [
        { heading: "การใช้บริการ", body: "Bob's Multi Tool ให้บริการยูทิลิตี้บนเบราว์เซอร์ฟรีสำหรับ workflow นักพัฒนา ควรตรวจ output ก่อนนำไปใช้กับระบบ production" },
        { heading: "การใช้งานที่ยอมรับได้", body: "คุณตกลงว่าจะไม่รบกวนบริการ ไม่ทำ traffic อัตโนมัติแบบละเมิด ไม่ใช้เครื่องมือเพื่อกิจกรรมผิดกฎหมาย และไม่ส่งข้อมูลส่วนตัวที่คุณไม่มีสิทธิ์ประมวลผลในเครื่องมือเบราว์เซอร์" },
        { heading: "เนื้อหาจากภายนอก", body: "บางเครื่องมืออาจใช้บริการภายนอกหรือ route server Bob's Multi Tool ไม่ควบคุมเว็บไซต์ภายนอก ผู้ให้บริการ DNS หรือ endpoint ระยะไกล" },
        { heading: "โฆษณา", body: "หลังได้รับอนุมัติ เว็บไซต์อาจแสดงโฆษณา Google AdSense เนื้อหาโฆษณามาจาก network ภายนอกและอาจถูกปรับให้เหมาะตามนโยบายของบริการนั้น" },
      ],
      contact: { heading: "ติดต่อ", body: "คำถามเกี่ยวกับข้อกำหนดนี้ส่งได้ที่" },
    },
  },
  ar: {
    privacy: {
      title: "سياسة الخصوصية",
      description: "سياسة الخصوصية لأدوات المطور في Bob's Multi Tool.",
      lastUpdated: "آخر تحديث: 5 يونيو 2026",
      backToTools: "العودة إلى الأدوات",
      sections: [
        { heading: "المعلومات التي تعالجها الأدوات", body: "تم تصميم Bob's Multi Tool حول أدوات محلية داخل المتصفح. تتم معالجة الإدخالات المستخدمة في التنسيق والترميز وفك الترميز والإنشاء والتحويل داخل المتصفح عندما يكون ذلك ممكنا، ولا يخزنها هذا الموقع." },
        { heading: "فحوصات route الخادم", body: "تحتاج أدوات HTTP status وDNS إلى route خادم صغير لأن المتصفح لا يستطيع تنفيذ هذه الفحوصات مباشرة. لا ترسل أسماء مضيفين داخلية خاصة أو بيانات سرية." },
        { heading: "التحليلات والإعلانات", body: "قد يستخدم الموقع Google Analytics وGoogle AdSense. قد تستخدم هذه الخدمات الخارجية cookies أو تقنيات مشابهة وفقا لسياساتها." },
      ],
      contact: { heading: "التواصل", body: "يمكن إرسال الأسئلة حول هذه السياسة إلى" },
    },
    terms: {
      title: "شروط الخدمة",
      description: "شروط الخدمة لأدوات المطور في Bob's Multi Tool.",
      lastUpdated: "آخر تحديث: 5 يونيو 2026",
      backToTools: "العودة إلى الأدوات",
      sections: [
        { heading: "استخدام الخدمة", body: "يوفر Bob's Multi Tool أدوات مجانية داخل المتصفح لسير عمل التطوير. يجب التحقق من مخرجات الأدوات قبل الاعتماد عليها في أنظمة الإنتاج." },
        { heading: "الاستخدام المقبول", body: "توافق على عدم تعطيل الخدمة أو أتمتة حركة مسيئة أو استخدام الأدوات في نشاط غير قانوني أو إرسال بيانات خاصة لا يسمح لك بمعالجتها في أداة متصفح." },
        { heading: "محتوى الطرف الثالث", body: "قد تستخدم بعض الأدوات خدمات خارجية أو routes خادم. لا يتحكم Bob's Multi Tool في مواقع الطرف الثالث أو مزودي DNS أو endpoints البعيدة." },
        { heading: "الإعلانات", body: "بعد الموافقة، قد يعرض الموقع إعلانات Google AdSense. يتم تقديم محتوى الإعلانات عبر شبكات خارجية وقد يتم تخصيصه وفقا لسياساتها." },
      ],
      contact: { heading: "التواصل", body: "يمكن إرسال الأسئلة حول هذه الشروط إلى" },
    },
  },
};

export function getLocalizedLegalContent(locale: Locale, kind: LegalPageKind) {
  if (locale === defaultLocale) return english[kind];
  return localized[locale][kind];
}
