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

const legalUpdatedAt: Record<Locale, string> = {
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

const advertisingSections: Record<Locale, Record<LegalPageKind, LegalSection>> = {
  en: {
    privacy: {
      heading: "Advertising, cookies, and Google services",
      body: "The site may use Google advertising services and other third-party services to keep the utilities available for free. These services may use cookies, device identifiers, or similar technologies to serve ads, measure performance, prevent abuse, and comply with their policies.",
    },
    terms: {
      heading: "Advertising and service providers",
      body: "The site may display advertising or include third-party scripts from service providers. You agree not to interfere with these systems, manipulate traffic quality, or attempt to bypass abuse prevention and measurement features.",
    },
  },
  ko: {
    privacy: { heading: "광고, 쿠키, Google 서비스", body: "이 사이트는 무료 유틸리티를 유지하기 위해 Google 광고 서비스와 기타 제3자 서비스를 사용할 수 있습니다. 이러한 서비스는 광고 제공, 성과 측정, 남용 방지, 정책 준수를 위해 쿠키, 기기 식별자 또는 유사 기술을 사용할 수 있습니다." },
    terms: { heading: "광고와 서비스 제공자", body: "이 사이트는 광고를 표시하거나 서비스 제공자의 제3자 스크립트를 포함할 수 있습니다. 사용자는 이러한 시스템을 방해하거나 트래픽 품질을 조작하거나 남용 방지 및 측정 기능을 우회하려고 해서는 안 됩니다." },
  },
  ja: {
    privacy: { heading: "広告、Cookie、Google サービス", body: "このサイトは無料ユーティリティを維持するため、Google 広告サービスやその他の第三者サービスを使用する場合があります。これらのサービスは広告配信、効果測定、不正防止、ポリシー遵守のために cookie、端末識別子、または類似技術を使用することがあります。" },
    terms: { heading: "広告とサービス提供者", body: "このサイトは広告を表示したり、サービス提供者の第三者スクリプトを含む場合があります。これらの仕組みを妨害したり、トラフィック品質を操作したり、不正防止や測定機能を回避しようとしてはいけません。" },
  },
  "zh-CN": {
    privacy: { heading: "广告、Cookie 和 Google 服务", body: "本站可能使用 Google 广告服务和其他第三方服务来维持免费工具体验。这些服务可能使用 cookie、设备标识符或类似技术来投放广告、衡量效果、防止滥用并遵守其政策。" },
    terms: { heading: "广告和服务提供方", body: "本站可能展示广告，或包含服务提供方的第三方脚本。你不得干扰这些系统、操纵流量质量，或尝试绕过防滥用和衡量功能。" },
  },
  "zh-TW": {
    privacy: { heading: "廣告、Cookie 與 Google 服務", body: "本站可能使用 Google 廣告服務與其他第三方服務來維持免費工具體驗。這些服務可能使用 cookie、裝置識別碼或類似技術來投放廣告、衡量成效、防止濫用並遵守其政策。" },
    terms: { heading: "廣告與服務提供者", body: "本站可能顯示廣告，或包含服務提供者的第三方腳本。你不得干擾這些系統、操縱流量品質，或嘗試繞過防濫用與衡量功能。" },
  },
  es: {
    privacy: { heading: "Publicidad, cookies y servicios de Google", body: "El sitio puede usar servicios publicitarios de Google y otros servicios de terceros para mantener gratuitas las utilidades. Estos servicios pueden usar cookies, identificadores de dispositivo o tecnologias similares para servir anuncios, medir rendimiento, prevenir abuso y cumplir sus politicas." },
    terms: { heading: "Publicidad y proveedores de servicio", body: "El sitio puede mostrar publicidad o incluir scripts de terceros de proveedores de servicio. Aceptas no interferir con estos sistemas, manipular la calidad del trafico ni intentar evitar funciones de prevencion de abuso y medicion." },
  },
  "pt-BR": {
    privacy: { heading: "Publicidade, cookies e servicos do Google", body: "O site pode usar servicos de publicidade do Google e outros servicos de terceiros para manter os utilitarios gratuitos. Esses servicos podem usar cookies, identificadores de dispositivo ou tecnologias semelhantes para veicular anuncios, medir desempenho, prevenir abuso e cumprir suas politicas." },
    terms: { heading: "Publicidade e provedores de servico", body: "O site pode exibir publicidade ou incluir scripts de terceiros de provedores de servico. Voce concorda em nao interferir nesses sistemas, manipular a qualidade do trafego ou tentar contornar recursos de prevencao de abuso e medicao." },
  },
  de: {
    privacy: { heading: "Werbung, Cookies und Google-Dienste", body: "Die Seite kann Google-Werbedienste und andere Drittanbieter-Dienste nutzen, um die Utilities kostenlos bereitzustellen. Diese Dienste koennen Cookies, Geraetekennungen oder aehnliche Technologien verwenden, um Anzeigen auszuliefern, Leistung zu messen, Missbrauch zu verhindern und ihre Richtlinien einzuhalten." },
    terms: { heading: "Werbung und Dienstanbieter", body: "Die Seite kann Werbung anzeigen oder Drittanbieter-Skripte von Dienstanbietern enthalten. Du darfst diese Systeme nicht stoeren, die Traffic-Qualitaet nicht manipulieren und keine Missbrauchs- oder Messfunktionen umgehen." },
  },
  fr: {
    privacy: { heading: "Publicite, cookies et services Google", body: "Le site peut utiliser des services publicitaires Google et d'autres services tiers afin de garder les utilitaires gratuits. Ces services peuvent utiliser cookies, identifiants d'appareil ou technologies similaires pour diffuser des annonces, mesurer la performance, prevenir les abus et respecter leurs politiques." },
    terms: { heading: "Publicite et fournisseurs de service", body: "Le site peut afficher de la publicite ou inclure des scripts tiers de fournisseurs de service. Vous acceptez de ne pas perturber ces systemes, manipuler la qualite du trafic ou tenter de contourner les fonctions de prevention des abus et de mesure." },
  },
  hi: {
    privacy: { heading: "विज्ञापन, cookies और Google सेवाएं", body: "Utilities को free रखने के लिए site Google advertising services और अन्य third-party services इस्तेमाल कर सकती है. ये services ads दिखाने, performance मापने, abuse रोकने और अपनी policies का पालन करने के लिए cookies, device identifiers या मिलती-जुलती technologies इस्तेमाल कर सकती हैं." },
    terms: { heading: "विज्ञापन और service providers", body: "Site advertising दिखा सकती है या service providers की third-party scripts शामिल कर सकती है. आप इन systems में बाधा नहीं डालेंगे, traffic quality manipulate नहीं करेंगे, और abuse-prevention या measurement features bypass करने की कोशिश नहीं करेंगे." },
  },
  id: {
    privacy: { heading: "Iklan, cookie, dan layanan Google", body: "Situs dapat memakai layanan iklan Google dan layanan pihak ketiga lain agar utilitas tetap gratis. Layanan ini dapat memakai cookie, pengenal perangkat, atau teknologi serupa untuk menayangkan iklan, mengukur performa, mencegah penyalahgunaan, dan mematuhi kebijakan mereka." },
    terms: { heading: "Iklan dan penyedia layanan", body: "Situs dapat menampilkan iklan atau menyertakan skrip pihak ketiga dari penyedia layanan. Anda setuju untuk tidak mengganggu sistem ini, memanipulasi kualitas trafik, atau mencoba melewati fitur pencegahan penyalahgunaan dan pengukuran." },
  },
  vi: {
    privacy: { heading: "Quảng cáo, cookie và dịch vụ Google", body: "Site có thể dùng dịch vụ quảng cáo Google và dịch vụ bên thứ ba khác để duy trì tiện ích miễn phí. Các dịch vụ này có thể dùng cookie, mã nhận dạng thiết bị hoặc công nghệ tương tự để phân phát quảng cáo, đo hiệu suất, ngăn lạm dụng và tuân thủ chính sách của họ." },
    terms: { heading: "Quảng cáo và nhà cung cấp dịch vụ", body: "Site có thể hiển thị quảng cáo hoặc bao gồm script bên thứ ba từ nhà cung cấp dịch vụ. Bạn đồng ý không can thiệp vào các hệ thống này, thao túng chất lượng lưu lượng hoặc cố vượt qua tính năng chống lạm dụng và đo lường." },
  },
  th: {
    privacy: { heading: "โฆษณา คุกกี้ และบริการของ Google", body: "เว็บไซต์อาจใช้บริการโฆษณาของ Google และบริการภายนอกอื่นเพื่อให้เครื่องมือใช้งานได้ฟรี บริการเหล่านี้อาจใช้คุกกี้ ตัวระบุอุปกรณ์ หรือเทคโนโลยีใกล้เคียงเพื่อแสดงโฆษณา วัดประสิทธิภาพ ป้องกันการละเมิด และทำตามนโยบายของตน" },
    terms: { heading: "โฆษณาและผู้ให้บริการ", body: "เว็บไซต์อาจแสดงโฆษณาหรือรวมสคริปต์ภายนอกจากผู้ให้บริการ คุณตกลงว่าจะไม่รบกวนระบบเหล่านี้ ไม่บิดเบือนคุณภาพทราฟฟิก และไม่พยายามข้ามฟีเจอร์ป้องกันการละเมิดหรือการวัดผล" },
  },
  ar: {
    privacy: { heading: "الإعلانات وcookies وخدمات Google", body: "قد يستخدم الموقع خدمات إعلانية من Google وخدمات خارجية أخرى للحفاظ على الأدوات مجانية. قد تستخدم هذه الخدمات cookies أو معرفات الجهاز أو تقنيات مشابهة لعرض الإعلانات وقياس الأداء ومنع الإساءة والالتزام بسياساتها." },
    terms: { heading: "الإعلانات ومزودو الخدمة", body: "قد يعرض الموقع إعلانات أو يتضمن scripts خارجية من مزودي خدمة. توافق على عدم تعطيل هذه الأنظمة أو التلاعب بجودة الحركة أو محاولة تجاوز ميزات منع الإساءة والقياس." },
  },
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
        heading: "Analytics and third-party services",
        body: "The site may use privacy-conscious analytics and third-party services to understand usage patterns and support the free utility experience. These services may use cookies or similar technologies according to their own policies.",
      },
      {
        heading: "Local utility inputs",
        body: "Browser-local tools are intended for temporary transformation and review. Inputs for JSON formatting, Base64 conversion, JWT inspection, hashing, password generation, color conversion, text cleanup, and similar utilities should be reviewed before pasting, and sensitive production values should be redacted or replaced with safe samples.",
      },
      {
        heading: "Public network checks",
        body: "DNS lookup and HTTP status checks are designed for public hostnames and public URLs. The server route rejects private, reserved, localhost, and unsafe targets, but users should still avoid submitting internal names, secret query parameters, private headers, or URLs that should not be requested by a public service.",
      },
      {
        heading: "Generated output",
        body: "Generated or transformed output is shown so you can inspect, copy, and use it in your own workflow. The site does not guarantee that output is appropriate for every runtime, scheduler, parser, browser, deployment provider, or security policy, so review warnings and examples before using the result.",
      },
      {
        heading: "Browser storage",
        body: "Favorite tools, recent tools, and optional tool-session restore behavior are kept in local browser storage so repeat visitors can continue work without creating an account. You can clear local history from the interface or through your browser storage controls.",
      },
      {
        heading: "Data not suitable for this site",
        body: "Do not paste passwords you actively use, private keys, unredacted access tokens, confidential customer records, private network addresses, account recovery data, or regulated personal information. Use representative test data when a tool result needs to be shared with another person.",
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
        heading: "Third-party services",
        body: "The site may include third-party services that help operate and support the free utility experience. Third-party content is governed by the policies of the providers that serve it.",
      },
      {
        heading: "Verification before use",
        body: "Tool output is provided for developer review, not as a substitute for project-specific testing. You are responsible for checking generated regex patterns, cron schedules, hashes, formatted code, DNS results, HTTP headers, SEO tags, and configuration snippets in the environment where they will be used.",
      },
      {
        heading: "Network and security boundaries",
        body: "Do not use public route tools to probe private infrastructure, bypass access controls, test targets you do not control, or send secrets in URLs or headers. Public network utilities are limited to ordinary diagnostic checks for publicly reachable hosts and pages.",
      },
      {
        heading: "Content accuracy",
        body: "Guides, examples, FAQs, and checklist items are maintained to make the tools easier to review, but web standards, browser behavior, hosted schedulers, and platform rules can change. Treat guide content as practical reference material and verify critical decisions against the official system you are configuring.",
      },
      {
        heading: "No account or professional service",
        body: "The site does not create user accounts, store project workspaces, provide managed monitoring, or act as a legal, financial, security, or compliance advisor. The tools are lightweight developer utilities that help you inspect and prepare data for your own review.",
      },
      {
        heading: "Changes to the service",
        body: "Tools, examples, guide pages, localization coverage, route behavior, and third-party service integrations may change as the site is improved. Updated pages should keep the same goal: clear input, useful diagnostics, reviewable output, and safe navigation to the next related utility.",
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
        { heading: "서버 확인", body: "HTTP status와 DNS 도구는 브라우저만으로 직접 확인할 수 없기 때문에 작은 서버 엔드포인트를 사용합니다. 비공개 내부 호스트명이나 기밀 데이터는 제출하지 마세요." },
        { heading: "분석과 제3자 서비스", body: "이 사이트는 사용 흐름을 이해하고 무료 유틸리티 경험을 유지하기 위해 개인정보를 고려한 분석 및 제3자 서비스를 사용할 수 있습니다. 이러한 서비스는 각자의 정책에 따라 쿠키 또는 유사 기술을 사용할 수 있습니다." },
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
        { heading: "제3자 콘텐츠", body: "일부 도구는 제3자 서비스나 서버 엔드포인트를 사용할 수 있습니다. Bob's Multi Tool은 제3자 웹사이트, DNS 제공자, 원격 endpoint를 제어하지 않습니다." },
        { heading: "제3자 서비스", body: "이 사이트는 무료 유틸리티 경험의 운영과 유지를 돕는 제3자 서비스를 포함할 수 있습니다. 제3자 콘텐츠는 이를 제공하는 서비스의 정책을 따릅니다." },
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
        { heading: "サーバー確認", body: "HTTP status と DNS ツールはブラウザだけでは直接確認できないため、小さなサーバーエンドポイントを使います。非公開の内部ホスト名や機密データは送信しないでください。" },
        { heading: "分析と第三者サービス", body: "このサイトは利用状況を把握し、無料ユーティリティ体験を維持するために、プライバシーに配慮した分析と第三者サービスを使用する場合があります。これらのサービスは、それぞれのポリシーに従って cookie または類似技術を使用することがあります。" },
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
        { heading: "第三者コンテンツ", body: "一部のツールは第三者サービスまたはサーバーエンドポイントを使用する場合があります。Bob's Multi Tool は第三者サイト、DNS provider、remote endpoint を管理しません。" },
        { heading: "第三者サービス", body: "このサイトは、無料ユーティリティ体験の運営と維持を支援する第三者サービスを含む場合があります。第三者コンテンツは、それを提供する各サービスのポリシーに従います。" },
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
        { heading: "服务器检查", body: "HTTP status 和 DNS 工具需要小型服务器端点，因为浏览器无法直接执行这些检查。请不要提交私有内部主机名或机密数据。" },
        { heading: "分析与第三方服务", body: "本站可能使用注重隐私的分析和第三方服务，以了解使用情况并支持免费的工具体验。此类服务可能根据其自身政策使用 cookie 或类似技术。" },
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
        { heading: "第三方内容", body: "部分工具可能使用第三方服务或服务器端点。Bob's Multi Tool 不控制第三方网站、DNS 提供商或远程 endpoint。" },
        { heading: "第三方服务", body: "本站可能包含用于运营和支持免费工具体验的第三方服务。第三方内容受提供方自身政策约束。" },
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
        { heading: "伺服器檢查", body: "HTTP status 與 DNS 工具需要小型伺服器端點，因為瀏覽器無法直接執行這些檢查。請不要提交私有內部主機名稱或機密資料。" },
        { heading: "分析與第三方服務", body: "本站可能使用重視隱私的分析與第三方服務，以了解使用情況並支援免費工具體驗。這些服務可能依其政策使用 cookie 或類似技術。" },
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
        { heading: "第三方內容", body: "部分工具可能使用第三方服務或伺服器端點。Bob's Multi Tool 不控制第三方網站、DNS 提供者或遠端 endpoint。" },
        { heading: "第三方服務", body: "本站可能包含用於營運與支援免費工具體驗的第三方服務。第三方內容受提供方自身政策約束。" },
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
        { heading: "Comprobaciones con servidor", body: "Las herramientas de HTTP status y DNS usan un endpoint de servidor pequeno porque el navegador no puede realizar esas comprobaciones directamente. No envies hostnames internos privados ni datos confidenciales." },
        { heading: "Analitica y servicios de terceros", body: "El sitio puede usar analitica con enfoque de privacidad y servicios de terceros para entender patrones de uso y sostener la experiencia gratuita. Estos servicios pueden usar cookies o tecnologias similares segun sus propias politicas." },
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
        { heading: "Servicios de terceros", body: "El sitio puede incluir servicios de terceros que ayudan a operar y sostener la experiencia gratuita. El contenido de terceros se rige por las politicas de los proveedores que lo sirven." },
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
        { heading: "Checagens via servidor", body: "As ferramentas de HTTP status e DNS usam um endpoint de servidor pequeno porque o navegador nao consegue fazer essas checagens diretamente. Nao envie hostnames internos privados nem dados confidenciais." },
        { heading: "Analise e servicos de terceiros", body: "O site pode usar analise com foco em privacidade e servicos de terceiros para entender padroes de uso e sustentar a experiencia gratuita. Esses servicos podem usar cookies ou tecnologias semelhantes conforme suas proprias politicas." },
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
        { heading: "Servicos de terceiros", body: "O site pode incluir servicos de terceiros que ajudam a operar e sustentar a experiencia gratuita. Conteudo de terceiros segue as politicas dos provedores que o servem." },
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
        { heading: "Analyse und Drittanbieter-Dienste", body: "Die Seite kann datenschutzbewusste Analyse und Drittanbieter-Dienste nutzen, um Nutzungsmuster zu verstehen und das kostenlose Werkzeugerlebnis zu unterstuetzen. Diese Dienste koennen Cookies oder aehnliche Technologien gemaess ihren eigenen Richtlinien einsetzen." },
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
        { heading: "Drittanbieter-Dienste", body: "Die Seite kann Drittanbieter-Dienste enthalten, die Betrieb und Unterstuetzung des kostenlosen Werkzeugerlebnisses ermoeglichen. Drittanbieter-Inhalte unterliegen den Richtlinien der jeweiligen Anbieter." },
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
        { heading: "Analyse et services tiers", body: "Le site peut utiliser une analyse respectueuse de la confidentialite et des services tiers pour comprendre les usages et soutenir l'experience gratuite. Ces services peuvent utiliser des cookies ou technologies similaires selon leurs propres politiques." },
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
        { heading: "Services tiers", body: "Le site peut inclure des services tiers qui aident a exploiter et soutenir l'experience gratuite. Le contenu tiers est regi par les politiques des fournisseurs qui le servent." },
      ],
      contact: { heading: "Contact", body: "Les questions sur ces conditions peuvent etre envoyees a" },
    },
  },
  hi: {
    privacy: {
      title: "गोपनीयता नीति",
      description: "Bob's Multi Tool डेवलपर उपयोगिताओं की गोपनीयता नीति.",
      lastUpdated: "अंतिम अपडेट: 5 जून 2026",
      backToTools: "साधनों पर वापस",
      sections: [
        { heading: "साधनों में संसाधित जानकारी", body: "Bob's Multi Tool स्थानीय ब्राउज़र उपयोगिताओं के लिए बनाया गया है. फॉर्मैट, एन्कोड, डिकोड, जनरेशन और कन्वर्जन के इनपुट जहां संभव हो ब्राउज़र में संसाधित होते हैं और यह साइट उन्हें सहेजती नहीं है." },
        { heading: "सर्वर जांच", body: "HTTP स्थिति और DNS साधन छोटे सर्वर जांच मार्ग का उपयोग करते हैं क्योंकि ब्राउज़र ये जांच सीधे नहीं कर सकता. निजी आंतरिक होस्ट नाम या गोपनीय डेटा न भेजें." },
        { heading: "विश्लेषण और तृतीय-पक्ष सेवाएं", body: "साइट उपयोग पैटर्न समझने और मुफ्त उपयोगिता अनुभव को बनाए रखने के लिए गोपनीयता-सचेत विश्लेषण और तृतीय-पक्ष सेवाओं का उपयोग कर सकती है. ये सेवाएं अपनी नीतियों के अनुसार कुकी या मिलती-जुलती तकनीकें इस्तेमाल कर सकती हैं." },
      ],
      contact: { heading: "संपर्क", body: "इस policy के बारे में सवाल यहां भेजे जा सकते हैं" },
    },
    terms: {
      title: "सेवा शर्तें",
      description: "Bob's Multi Tool डेवलपर उपयोगिताओं की सेवा शर्तें.",
      lastUpdated: "अंतिम अपडेट: 5 जून 2026",
      backToTools: "साधनों पर वापस",
      sections: [
        { heading: "सेवा का उपयोग", body: "Bob's Multi Tool विकास कार्यों के लिए मुफ्त ब्राउज़र आधारित उपयोगिताएं देता है. उत्पादन प्रणालियों में उपयोग करने से पहले साधन का नतीजा जांचें." },
        { heading: "स्वीकार्य उपयोग", body: "सेवा में बाधा न डालें, दुरुपयोग वाला ट्रैफिक स्वचालित न करें, साधनों को गैरकानूनी गतिविधि में इस्तेमाल न करें, और ऐसा निजी डेटा न भेजें जिसे ब्राउज़र उपयोगिता में संसाधित करने की अनुमति नहीं है." },
        { heading: "तृतीय-पक्ष सामग्री", body: "कुछ साधन तृतीय-पक्ष सेवाएं या सर्वर जांच मार्ग इस्तेमाल कर सकते हैं. Bob's Multi Tool तृतीय-पक्ष वेबसाइटों, DNS प्रदाताओं या दूरस्थ जांच मार्गों को नियंत्रित नहीं करता." },
        { heading: "तृतीय-पक्ष सेवाएं", body: "साइट मुफ्त उपयोगिता अनुभव चलाने और बनाए रखने में मदद करने वाली तृतीय-पक्ष सेवाएं शामिल कर सकती है. तृतीय-पक्ष सामग्री उसे देने वाले प्रदाताओं की नीतियों के अधीन होती है." },
      ],
      contact: { heading: "संपर्क", body: "इन terms के बारे में सवाल यहां भेजे जा सकते हैं" },
    },
  },
  id: {
    privacy: {
      title: "Kebijakan privasi",
      description: "Kebijakan privasi untuk utilitas pengembang Bob's Multi Tool.",
      lastUpdated: "Terakhir diperbarui: 5 Juni 2026",
      backToTools: "Kembali ke alat",
      sections: [
        { heading: "Informasi yang diproses alat", body: "Bob's Multi Tool dirancang sebagai utilitas lokal di browser. Masukan untuk format, pengodean, pembacaan kode, pembuatan, dan konversi diproses di browser jika memungkinkan dan tidak disimpan oleh situs ini." },
        { heading: "Pemeriksaan lewat server", body: "Alat HTTP status dan DNS memakai jalur server kecil karena browser tidak bisa melakukan pemeriksaan itu secara langsung. Jangan kirim nama host internal privat atau data rahasia." },
        { heading: "Analitik dan layanan pihak ketiga", body: "Situs dapat memakai analitik yang memperhatikan privasi dan layanan pihak ketiga untuk memahami pola penggunaan serta mendukung pengalaman utilitas gratis. Layanan ini dapat memakai cookie atau teknologi serupa sesuai kebijakan mereka." },
      ],
      contact: { heading: "Kontak", body: "Pertanyaan tentang kebijakan ini dapat dikirim ke" },
    },
    terms: {
      title: "Ketentuan layanan",
      description: "Ketentuan layanan untuk utilitas pengembang Bob's Multi Tool.",
      lastUpdated: "Terakhir diperbarui: 5 Juni 2026",
      backToTools: "Kembali ke alat",
      sections: [
        { heading: "Penggunaan layanan", body: "Bob's Multi Tool menyediakan utilitas browser gratis untuk alur kerja pengembangan. Hasil alat harus diverifikasi sebelum dipakai di sistem produksi." },
        { heading: "Penggunaan yang diterima", body: "Anda setuju untuk tidak mengganggu layanan, mengotomasi lalu lintas penyalahgunaan, memakai alat untuk aktivitas ilegal, atau mengirim data privat yang tidak boleh diproses di utilitas browser." },
        { heading: "Konten pihak ketiga", body: "Beberapa alat dapat memakai layanan pihak ketiga atau jalur server. Bob's Multi Tool tidak mengontrol situs pihak ketiga, penyedia DNS, atau jalur jarak jauh." },
        { heading: "Layanan pihak ketiga", body: "Situs dapat menyertakan layanan pihak ketiga yang membantu mengoperasikan dan mendukung pengalaman utilitas gratis. Konten pihak ketiga mengikuti kebijakan penyedia yang menyajikannya." },
      ],
      contact: { heading: "Kontak", body: "Pertanyaan tentang ketentuan ini dapat dikirim ke" },
    },
  },
  vi: {
    privacy: {
      title: "Chính sách riêng tư",
      description: "Chính sách riêng tư cho tiện ích lập trình Bob's Multi Tool.",
      lastUpdated: "Cập nhật lần cuối: 5 tháng 6, 2026",
      backToTools: "Quay lại công cụ",
      sections: [
        { heading: "Thông tin được công cụ xử lý", body: "Bob's Multi Tool được thiết kế quanh các tiện ích cục bộ trên trình duyệt. Đầu vào dùng cho định dạng, mã hóa, giải mã, tạo và chuyển đổi được xử lý trong trình duyệt khi có thể và không được site này lưu trữ." },
        { heading: "Kiểm tra qua server", body: "Công cụ HTTP status và DNS cần tuyến kiểm tra server nhỏ vì trình duyệt không thể tự thực hiện trực tiếp. Không gửi tên host nội bộ riêng tư hoặc dữ liệu bảo mật." },
        { heading: "Phân tích và dịch vụ bên thứ ba", body: "Site có thể dùng phân tích chú trọng quyền riêng tư và dịch vụ bên thứ ba để hiểu cách sử dụng và duy trì trải nghiệm tiện ích miễn phí. Các dịch vụ này có thể dùng cookie hoặc công nghệ tương tự theo chính sách riêng của họ." },
      ],
      contact: { heading: "Liên hệ", body: "Câu hỏi về chính sách này có thể gửi tới" },
    },
    terms: {
      title: "Điều khoản dịch vụ",
      description: "Điều khoản dịch vụ cho tiện ích lập trình Bob's Multi Tool.",
      lastUpdated: "Cập nhật lần cuối: 5 tháng 6, 2026",
      backToTools: "Quay lại công cụ",
      sections: [
        { heading: "Sử dụng dịch vụ", body: "Bob's Multi Tool cung cấp tiện ích miễn phí trên trình duyệt cho quy trình lập trình. Cần kiểm tra kết quả trước khi đưa vào hệ thống sản xuất." },
        { heading: "Sử dụng chấp nhận được", body: "Bạn đồng ý không làm gián đoạn dịch vụ, không tự động hóa lưu lượng lạm dụng, không dùng công cụ cho hoạt động bất hợp pháp, và không gửi dữ liệu riêng tư mà bạn không được phép xử lý trong tiện ích trình duyệt." },
        { heading: "Nội dung bên thứ ba", body: "Một số công cụ có thể dùng dịch vụ bên thứ ba hoặc tuyến server. Bob's Multi Tool không kiểm soát website bên thứ ba, nhà cung cấp DNS hoặc tuyến từ xa." },
        { heading: "Dịch vụ bên thứ ba", body: "Site có thể bao gồm dịch vụ bên thứ ba giúp vận hành và duy trì trải nghiệm tiện ích miễn phí. Nội dung bên thứ ba tuân theo chính sách của nhà cung cấp phục vụ nội dung đó." },
      ],
      contact: { heading: "Liên hệ", body: "Câu hỏi về điều khoản này có thể gửi tới" },
    },
  },
  th: {
    privacy: {
      title: "นโยบายความเป็นส่วนตัว",
      description: "นโยบายความเป็นส่วนตัวสำหรับเครื่องมือนักพัฒนาของ Bob's Multi Tool",
      lastUpdated: "อัปเดตล่าสุด: 5 มิถุนายน 2026",
      backToTools: "กลับไปเครื่องมือ",
      sections: [
        { heading: "ข้อมูลที่เครื่องมือประมวลผล", body: "Bob's Multi Tool ออกแบบให้เป็นยูทิลิตี้ในเบราว์เซอร์เป็นหลัก อินพุตสำหรับจัดรูปแบบ เข้ารหัส ถอดรหัส สร้าง และแปลง จะประมวลผลในเบราว์เซอร์เมื่อทำได้ และเว็บไซต์นี้ไม่จัดเก็บข้อมูลเหล่านั้น" },
        { heading: "การตรวจผ่านเซิร์ฟเวอร์", body: "เครื่องมือสถานะ HTTP และ DNS ใช้เส้นทางตรวจสอบบนเซิร์ฟเวอร์ขนาดเล็ก เพราะเบราว์เซอร์ไม่สามารถตรวจสิ่งเหล่านี้ได้โดยตรง ห้ามส่งชื่อโฮสต์ภายในหรือข้อมูลลับ" },
        { heading: "การวิเคราะห์และบริการภายนอก", body: "เว็บไซต์อาจใช้การวิเคราะห์ที่คำนึงถึงความเป็นส่วนตัวและบริการภายนอกเพื่อเข้าใจรูปแบบการใช้งานและสนับสนุนประสบการณ์เครื่องมือฟรี บริการเหล่านี้อาจใช้คุกกี้หรือเทคโนโลยีใกล้เคียงตามนโยบายของตนเอง" },
      ],
      contact: { heading: "ติดต่อ", body: "คำถามเกี่ยวกับนโยบายนี้ส่งได้ที่" },
    },
    terms: {
      title: "ข้อกำหนดการใช้บริการ",
      description: "ข้อกำหนดการใช้บริการสำหรับเครื่องมือนักพัฒนาของ Bob's Multi Tool",
      lastUpdated: "อัปเดตล่าสุด: 5 มิถุนายน 2026",
      backToTools: "กลับไปเครื่องมือ",
      sections: [
        { heading: "การใช้บริการ", body: "Bob's Multi Tool ให้บริการยูทิลิตี้บนเบราว์เซอร์ฟรีสำหรับขั้นตอนงานนักพัฒนา ควรตรวจผลลัพธ์ก่อนนำไปใช้กับระบบจริง" },
        { heading: "การใช้งานที่ยอมรับได้", body: "คุณตกลงว่าจะไม่รบกวนบริการ ไม่ทำทราฟฟิกอัตโนมัติแบบละเมิด ไม่ใช้เครื่องมือเพื่อกิจกรรมผิดกฎหมาย และไม่ส่งข้อมูลส่วนตัวที่คุณไม่มีสิทธิ์ประมวลผลในเครื่องมือเบราว์เซอร์" },
        { heading: "เนื้อหาจากภายนอก", body: "บางเครื่องมืออาจใช้บริการภายนอกหรือเส้นทางบนเซิร์ฟเวอร์ Bob's Multi Tool ไม่ควบคุมเว็บไซต์ภายนอก ผู้ให้บริการ DNS หรือเส้นทางระยะไกล" },
        { heading: "บริการภายนอก", body: "เว็บไซต์อาจรวมบริการภายนอกที่ช่วยดำเนินงานและสนับสนุนประสบการณ์เครื่องมือฟรี เนื้อหาจากภายนอกอยู่ภายใต้นโยบายของผู้ให้บริการนั้น" },
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
        { heading: "فحوصات عبر الخادم", body: "تحتاج أدوات HTTP status وDNS إلى مسار خادم صغير لأن المتصفح لا يستطيع تنفيذ هذه الفحوصات مباشرة. لا ترسل أسماء مضيفين داخلية خاصة أو بيانات سرية." },
        { heading: "التحليلات والخدمات الخارجية", body: "قد يستخدم الموقع تحليلات تراعي الخصوصية وخدمات خارجية لفهم أنماط الاستخدام ودعم تجربة الأدوات المجانية. قد تستخدم هذه الخدمات cookies أو تقنيات مشابهة وفقا لسياساتها." },
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
        { heading: "محتوى الطرف الثالث", body: "قد تستخدم بعض الأدوات خدمات خارجية أو مسار خادم. لا يتحكم Bob's Multi Tool في مواقع الطرف الثالث أو مزودي DNS أو المسارات البعيدة." },
        { heading: "الخدمات الخارجية", body: "قد يتضمن الموقع خدمات خارجية تساعد في تشغيل تجربة الأدوات المجانية ودعمها. يخضع محتوى الطرف الثالث لسياسات المزودين الذين يقدمونه." },
      ],
      contact: { heading: "التواصل", body: "يمكن إرسال الأسئلة حول هذه الشروط إلى" },
    },
  },
};

const localizedLegalExpansionSections: Record<Exclude<Locale, "en">, Record<LegalPageKind, LegalSection[]>> = {
  ko: {
    privacy: [
      { heading: "입력값 검토와 삭제", body: "도구에 붙여 넣는 값은 사용자가 직접 관리합니다. 운영 비밀값, 고객 정보, 내부 주소는 예시값으로 바꾸고, 결과를 공유하기 전에 브라우저 로컬 기록과 복사한 텍스트를 함께 확인하세요." },
      { heading: "공개 네트워크 확인 범위", body: "DNS와 HTTP 확인은 공개 도메인과 공개 URL을 대상으로 합니다. 비공개 시스템 점검, 접근 권한 확인, 내부 장애 분석은 조직 내부 도구에서 처리해야 합니다." },
      { heading: "브라우저 로컬 저장", body: "즐겨찾기, 최근 사용 도구, 마지막 작업 복원 상태는 이 브라우저의 로컬 저장소에만 남습니다. 계정 프로필이나 서버 작업공간으로 전송되지 않으며, 사용자는 인터페이스의 로컬 기록 삭제 또는 브라우저 저장소 설정으로 지울 수 있습니다." },
      { heading: "붙여 넣지 말아야 할 데이터", body: "실제로 사용하는 비밀번호, 개인 키, 삭제되지 않은 access token, 고객 원본 기록, 내부 네트워크 주소, 규제 대상 개인정보는 이 사이트에 붙여 넣지 마세요. 문제 재현이 필요하면 같은 구조를 가진 테스트 값으로 바꾸는 것이 안전합니다." },
      { heading: "복사 결과의 처리", body: "복사 버튼은 화면에 표시된 결과를 사용자의 브라우저 클립보드로 전달합니다. 이 사이트는 복사한 결과를 공개 공유 링크로 만들거나 서버 기록으로 저장하지 않으므로, 공유할 때는 사용자가 직접 대상과 내용을 확인해야 합니다." },
      { heading: "가이드와 예시의 역할", body: "가이드, FAQ, 예시, 체크리스트는 도구 결과를 이해하고 검토하는 데 도움을 주기 위한 설명입니다. 공식 플랫폼 문서나 조직 내부 보안 기준을 대체하지 않으며, 중요한 설정은 실제로 배포되는 환경의 기준으로 다시 확인해야 합니다." },
    ],
    terms: [
      { heading: "결과 검증 책임", body: "포맷, 변환, 생성, 진단 결과는 작업을 돕는 초안입니다. 실제 배포, 문서, 보안 설정, 스케줄러, 데이터 처리에 쓰기 전에는 대상 환경에서 다시 검증해야 합니다." },
      { heading: "보안 경계", body: "공개 도구를 이용해 사설 인프라를 조회하거나 접근 제어를 우회하거나 권한 없는 대상을 점검해서는 안 됩니다. 공유 가능한 예시와 공개적으로 확인 가능한 대상만 사용하세요." },
      { heading: "공유 전 확인", body: "결과를 이슈, pull request, 운영 문서, 설계 노트에 붙여 넣기 전에는 입력 조건, 대상 런타임, 경고 메시지, 민감정보 제거 여부를 함께 남겨야 합니다. 결과만 복사하면 다음 사용자가 맥락을 오해할 수 있습니다." },
      { heading: "계정 없는 경량 서비스", body: "이 사이트는 사용자 계정을 만들거나 프로젝트 작업공간을 보관하거나 지속 모니터링을 제공하지 않습니다. 사용자가 입력한 예시를 즉시 확인하는 경량 개발자 유틸리티이며, 전문 법률·보안·준법 자문을 제공하지 않습니다." },
      { heading: "서비스 변경", body: "도구, 예시, 가이드, locale 지원, 네트워크 route, 제3자 서비스는 사이트 개선 과정에서 바뀔 수 있습니다. 변경 후에도 명확한 입력, 유용한 진단, 검토 가능한 출력, 관련 도구로 이어지는 안전한 흐름을 유지하는 것을 기준으로 합니다." },
      { heading: "콘텐츠 우선 원칙", body: "도구 페이지는 먼저 사용 가능한 입력, 진단, 출력과 관련 설명을 제공해야 합니다. 제3자 스크립트나 부가 서비스가 핵심 작업 흐름을 가리거나 제품 동작처럼 보이게 만들 수 없습니다." },
    ],
  },
  ja: {
    privacy: [
      { heading: "入力値の確認と削除", body: "ツールに貼り付ける値は利用者が管理します。本番の秘密情報、顧客情報、内部アドレスは安全なサンプルに置き換え、共有前にブラウザ内の履歴とコピーした文字列を確認してください。" },
      { heading: "公開ネットワーク確認の範囲", body: "DNS と HTTP の確認は公開ドメインと公開 URL を対象にしています。非公開システムの調査、権限確認、内部障害分析は組織内の信頼できるツールで行ってください。" },
      { heading: "ブラウザ内のローカル保存", body: "お気に入り、最近使ったツール、任意の作業復元状態は、このブラウザのローカルストレージに保存されます。アカウント情報やサーバー上の作業スペースには送信されず、画面の削除操作またはブラウザ設定から消去できます。" },
      { heading: "貼り付けに適さないデータ", body: "現在使っているパスワード、秘密鍵、未編集の access token、顧客レコード、内部ネットワークアドレス、規制対象の個人情報は貼り付けないでください。問題を再現する場合は、同じ構造を持つ安全なテスト値に置き換えてください。" },
      { heading: "コピー結果の扱い", body: "コピー操作は、画面に表示された結果を利用者のブラウザクリップボードへ渡します。このサイトはコピーした結果を公開共有リンクにしたり、サーバー側履歴として保存したりしません。共有前に宛先と内容を利用者自身で確認してください。" },
      { heading: "ガイドと例の役割", body: "ガイド、FAQ、例、チェックリストは、ツール出力を理解して確認するための補助説明です。公式プラットフォーム文書や組織内のセキュリティ基準を置き換えるものではないため、重要な設定は実際に使う環境の基準で再確認してください。" },
    ],
    terms: [
      { heading: "結果を検証する責任", body: "整形、変換、生成、診断の結果は作業を助ける下書きです。デプロイ、文書、セキュリティ設定、スケジューラ、データ処理で使う前に、対象環境で再確認してください。" },
      { heading: "セキュリティ境界", body: "公開ツールで private infrastructure を調査したり、アクセス制御を回避したり、権限のない対象を確認したりしてはいけません。共有可能なサンプルと公開対象だけを使用してください。" },
      { heading: "共有前の確認", body: "コピーした出力を issue、pull request、設計資料、運用メモに貼る前に、入力条件、対象 runtime、警告、redaction の有無を短く残してください。結果だけを貼ると、後から正しい使い方だったか判断しにくくなります。" },
      { heading: "サービス変更", body: "ツール、例、ガイド、対応 locale、network route、第三者サービスは改善のために変更されることがあります。変更後も、明確な入力、有用な診断、確認可能な出力、関連ツールへの安全な導線を維持します。" },
      { heading: "アカウントを持たない軽量サービス", body: "このサイトはユーザーアカウントを作成せず、プロジェクトワークスペースを保存せず、継続的な監視も提供しません。入力したサンプルをその場で確認する軽量な開発者ユーティリティであり、法務、セキュリティ、コンプライアンスの専門助言ではありません。" },
      { heading: "コンテンツ優先の原則", body: "ツールページは、まず利用できる入力、診断、出力、関連説明を提供する必要があります。第三者スクリプトや補助サービスが主要な作業フローを覆ったり、製品操作のように見えたりしてはいけません。" },
    ],
  },
  "zh-CN": {
    privacy: [
      { heading: "输入检查与删除", body: "你负责管理粘贴到工具中的内容。生产密钥、客户信息和内部地址应替换为安全样例；共享结果前，也要检查浏览器本地记录和已复制的文本。" },
      { heading: "公开网络检查范围", body: "DNS 和 HTTP 检查面向公开域名和公开 URL。私有系统排查、权限验证和内部故障分析应在组织自己的受信任工具中完成。" },
      { heading: "本地存储与重复使用", body: "收藏、最近使用和可选的会话恢复保存在浏览器本地存储中，用来帮助你再次打开常用工具。它们不是账号资料，也不会把项目内容上传为服务器端工作区。" },
      { heading: "不适合粘贴的数据", body: "请不要粘贴正在使用的密码、私钥、未脱敏 token、客户记录、内部网络地址或受监管的个人信息。需要复现问题时，使用结构相同但可公开分享的样例数据。" },
      { heading: "结果复制与浏览器行为", body: "复制按钮只把当前页面显示的结果交给你的浏览器剪贴板。站点不会创建可供他人访问的共享链接，也不会把格式化后的项目内容保存为服务器端历史记录。" },
      { heading: "内容与服务说明", body: "指南、示例、FAQ 和检查清单用于帮助你理解工具输出，但它们不会替代官方平台文档或项目内部规则。重要配置应以你实际使用的系统说明为准。" },
      { heading: "工具输入的边界", body: "本地格式化、编码、解码、生成和文本清理适合使用经过脱敏的短样例。网络诊断只适合公开目标；如果一个 URL、header 或主机名不应被公共服务请求，就不应提交到这里。" },
      { heading: "第三方服务透明度", body: "站点可能包含用于运行、保护和支持免费工具体验的第三方服务。这些服务不应伪装成工具结果，也不应阻挡主要输入输出流程；相关数据处理受其自身政策约束。" },
      { heading: "页面使用信号", body: "工具页面会展示示例、诊断、警告和相关下一步链接，帮助你判断结果是否适合复制。站点不会要求登录才能查看这些说明，也不会把最近使用记录与广告、账号或服务器端个人资料合并。" },
      { heading: "公共检查的限制", body: "当服务器路由检查公共 URL 或 DNS 记录时，结果只反映请求时可观察到的公开网络状态。缓存、地域、运营商、CDN 和安全策略可能让你的内部环境看到不同结果，所以关键变更仍需在自己的监控和部署系统中确认。" },
      { heading: "用户控制的共享", body: "你可以把结果复制到自己的 issue、文档或聊天工具中，但共享行为由你控制。建议在分享前删除真实 token、客户标识、内部主机、一次性链接和任何不应公开的查询参数。" },
      { heading: "安全样例优先", body: "如果只是想测试格式、字段结构、编码方式或错误提示，请优先使用短小、可公开、可重复的样例。这样既能保留问题形状，也能降低把真实项目数据带入公共网页的风险。" },
    ],
    terms: [
      { heading: "结果验证责任", body: "格式化、转换、生成和诊断结果只是帮助工作的草稿。用于部署、文档、安全设置、调度器或数据处理前，必须在目标环境中重新验证。" },
      { heading: "安全边界", body: "不得使用公开工具探测私有基础设施、绕过访问控制或检查无权处理的目标。请只使用可共享样例和公开可访问的对象。" },
      { heading: "共享前检查", body: "将输出粘贴到 issue、pull request、文档或运维记录前，请保留输入条件、目标运行环境、重要警告和脱敏说明。只有结果而没有上下文，其他人很难判断是否适合使用。" },
      { heading: "服务变更", body: "工具、示例、指南、本地化内容、网络路由和第三方服务可能会随着站点改进而调整。更新后的页面仍应保持清晰输入、可用诊断、可检查输出和安全的下一步工具链接。" },
      { heading: "不提供托管工作区", body: "本站不创建账号、不保存项目工作区、不提供持续监控，也不代表你执行安全、合规或法律判断。它提供的是可立即检查的轻量开发者工具。" },
      { heading: "页面内容优先", body: "工具页面应先提供可用的输入、诊断和输出，再展示参考内容或广告服务。任何第三方脚本都不得掩盖主要工具流程或伪装成产品操作。" },
      { heading: "禁止滥用流量", body: "不得自动化高频请求、制造误导性流量、反复请求无关目标，或使用工具干扰其他服务。服务器检查路线只用于普通公开诊断，不用于压力测试、扫描或权限绕过。" },
      { heading: "使用者决策责任", body: "工具可以帮助发现格式、语法、header、DNS、时间、编码和安全提示，但最终是否复制、部署或分享由使用者决定。请在目标平台、代码库或运维流程中再次验证。" },
      { heading: "示例和指南的使用", body: "示例、FAQ、指南和检查清单用于解释常见开发工作流，不保证覆盖每个框架、云服务、浏览器、调度器或安全产品。遇到关键生产决策时，应结合官方文档、团队评审和目标环境测试。" },
      { heading: "第三方内容边界", body: "如果页面包含第三方脚本、广告服务或外部链接，它们用于支持站点运行或补充说明，不代表 Bob's Multi Tool 控制这些外部服务。访问外部资源时，应查看该服务自己的条款和隐私说明。" },
      { heading: "本地状态不等于备份", body: "浏览器本地保存的收藏、最近工具和工作恢复只是方便再次访问，不是可靠备份或项目存储。重要结果应保存到你自己的代码库、文档系统或安全的内部记录中。" },
      { heading: "报告问题的方式", body: "如果某个工具输出异常，请提供可公开复现的输入样例、使用的浏览器、目标工具路径和预期结果。不要在问题报告中附带真实密钥、客户数据、内部 URL 或账号恢复信息。" },
    ],
  },
  "zh-TW": {
    privacy: [
      { heading: "輸入檢查與刪除", body: "貼到工具中的內容由使用者自行管理。正式密鑰、客戶資訊與內部位址應替換為安全範例；分享結果前，也要檢查瀏覽器本機記錄與已複製文字。" },
      { heading: "公開網路檢查範圍", body: "DNS 與 HTTP 檢查面向公開網域與公開 URL。私有系統排查、權限驗證與內部故障分析應在組織自己的可信工具中完成。" },
      { heading: "本機儲存與重複使用", body: "收藏、最近使用與選用的工作階段恢復會保存在瀏覽器本機儲存中，用來協助再次開啟常用工具。它們不是帳號資料，也不會把專案內容上傳為伺服器端工作區。" },
      { heading: "不適合貼上的資料", body: "請不要貼上正在使用的密碼、私鑰、未遮罩 token、客戶紀錄、內部網路位址或受管制的個人資訊。需要重現問題時，使用結構相同但可公開分享的範例資料。" },
      { heading: "結果複製與瀏覽器行為", body: "複製按鈕只會把目前頁面顯示的結果交給你的瀏覽器剪貼簿。本站不會建立可供他人存取的分享連結，也不會把格式化後的專案內容保存為伺服器端歷史紀錄。" },
      { heading: "內容與服務說明", body: "指南、範例、FAQ 與檢查清單用來協助理解工具輸出，但不會取代官方平台文件或專案內部規則。重要設定應以你實際使用的系統說明為準。" },
      { heading: "工具輸入的邊界", body: "本機格式化、編碼、解碼、產生與文字整理適合使用已遮罩的短範例。網路診斷只適合公開目標；如果某個 URL、header 或主機名稱不應被公共服務請求，就不應提交到這裡。" },
      { heading: "第三方服務透明度", body: "站點可能包含用於運行、保護與支援免費工具體驗的第三方服務。這些服務不應偽裝成工具結果，也不應遮住主要輸入輸出流程；相關資料處理受其自身政策約束。" },
      { heading: "頁面使用信號", body: "工具頁面會顯示範例、診斷、警告與相關下一步連結，協助判斷結果是否適合複製。站點不會要求登入才能查看這些說明，也不會把最近使用紀錄與廣告、帳號或伺服器端個人資料合併。" },
      { heading: "公共檢查的限制", body: "當伺服器路由檢查公開 URL 或 DNS 紀錄時，結果只反映請求當下可觀察到的公開網路狀態。快取、地域、電信商、CDN 與安全策略可能讓你的內部環境看到不同結果，所以關鍵變更仍需在自己的監控與部署系統中確認。" },
      { heading: "使用者控制的分享", body: "你可以把結果複製到自己的 issue、文件或聊天工具中，但分享行為由你控制。建議在分享前移除真實 token、客戶識別、內部主機、一次性連結與任何不應公開的查詢參數。" },
      { heading: "安全範例優先", body: "如果只是想測試格式、欄位結構、編碼方式或錯誤提示，請優先使用短小、可公開、可重複的範例。這樣既能保留問題形狀，也能降低把真實專案資料帶入公共網頁的風險。" },
    ],
    terms: [
      { heading: "結果驗證責任", body: "格式化、轉換、產生與診斷結果只是協助工作的草稿。用於部署、文件、安全設定、排程器或資料處理前，必須在目標環境重新驗證。" },
      { heading: "安全邊界", body: "不得使用公開工具探測私有基礎設施、繞過存取控制或檢查無權處理的目標。請只使用可分享範例與公開可存取的對象。" },
      { heading: "分享前檢查", body: "將輸出貼到 issue、pull request、文件或維運紀錄前，請保留輸入條件、目標執行環境、重要警告與遮罩說明。只有結果而沒有脈絡時，其他人很難判斷是否適合使用。" },
      { heading: "服務變更", body: "工具、範例、指南、本地化內容、網路路由與第三方服務可能會隨站點改善而調整。更新後的頁面仍應保持清楚輸入、可用診斷、可檢查輸出與安全的下一步工具連結。" },
      { heading: "不提供託管工作區", body: "本站不建立帳號、不保存專案工作區、不提供持續監控，也不代表你執行安全、合規或法律判斷。它提供的是可立即檢查的輕量開發者工具。" },
      { heading: "頁面內容優先", body: "工具頁面應先提供可用的輸入、診斷與輸出，再顯示參考內容或廣告服務。任何第三方腳本都不得遮住主要工具流程或偽裝成產品操作。" },
      { heading: "禁止濫用流量", body: "不得自動化高頻請求、製造誤導性流量、反覆請求無關目標，或使用工具干擾其他服務。伺服器檢查路線只用於普通公開診斷，不用於壓力測試、掃描或權限繞過。" },
      { heading: "使用者決策責任", body: "工具可以協助發現格式、語法、header、DNS、時間、編碼與安全提示，但最終是否複製、部署或分享由使用者決定。請在目標平台、程式碼庫或維運流程中再次驗證。" },
      { heading: "範例和指南的使用", body: "範例、FAQ、指南與檢查清單用於解釋常見開發工作流，不保證涵蓋每個框架、雲端服務、瀏覽器、排程器或安全產品。遇到關鍵正式決策時，應結合官方文件、團隊審查與目標環境測試。" },
      { heading: "第三方內容邊界", body: "如果頁面包含第三方腳本、廣告服務或外部連結，它們用於支援站點運行或補充說明，不代表 Bob's Multi Tool 控制這些外部服務。存取外部資源時，應查看該服務自己的條款與隱私說明。" },
      { heading: "本機狀態不等於備份", body: "瀏覽器本機保存的收藏、最近工具與工作恢復只是方便再次存取，不是可靠備份或專案儲存。重要結果應保存到你自己的程式碼庫、文件系統或安全的內部紀錄中。" },
      { heading: "回報問題的方式", body: "如果某個工具輸出異常，請提供可公開重現的輸入範例、使用的瀏覽器、目標工具路徑與預期結果。不要在問題回報中附帶真實密鑰、客戶資料、內部 URL 或帳號恢復資訊。" },
    ],
  },
  es: {
    privacy: [
      { heading: "Revision y eliminacion de entradas", body: "Tu controlas los valores que pegas en las herramientas. Sustituye secretos de produccion, datos de clientes y direcciones internas por ejemplos seguros; antes de compartir, revisa tambien el historial local del navegador y el texto copiado." },
      { heading: "Alcance de las comprobaciones publicas", body: "Las comprobaciones DNS y HTTP estan pensadas para dominios publicos y URL publicas. La revision de sistemas privados, permisos o incidentes internos debe hacerse con herramientas confiables de tu organizacion." },
    ],
    terms: [
      { heading: "Responsabilidad de verificar resultados", body: "Los resultados de formato, conversion, generacion y diagnostico son borradores de trabajo. Antes de usarlos en despliegues, documentacion, seguridad, planificadores o datos, verificalos en el entorno final." },
      { heading: "Limites de seguridad", body: "No uses herramientas publicas para sondear infraestructura privada, evitar controles de acceso o comprobar objetivos sin permiso. Usa solo ejemplos compartibles y destinos publicamente accesibles." },
    ],
  },
  "pt-BR": {
    privacy: [
      { heading: "Revisao e remocao de entradas", body: "Voce controla os valores colados nas ferramentas. Troque segredos de producao, dados de clientes e enderecos internos por exemplos seguros; antes de compartilhar, confira tambem o historico local do navegador e o texto copiado." },
      { heading: "Escopo das checagens publicas", body: "As checagens de DNS e HTTP sao feitas para dominios publicos e URLs publicas. Revisao de sistemas privados, permissoes ou incidentes internos deve ocorrer nas ferramentas confiaveis da sua organizacao." },
    ],
    terms: [
      { heading: "Responsabilidade de verificar resultados", body: "Resultados de formatacao, conversao, geracao e diagnostico sao rascunhos de trabalho. Antes de usar em deploy, documentacao, seguranca, agendadores ou dados, valide no ambiente final." },
      { heading: "Limites de seguranca", body: "Nao use ferramentas publicas para sondar infraestrutura privada, contornar controle de acesso ou verificar alvos sem permissao. Use apenas exemplos compartilhaveis e destinos publicamente acessiveis." },
    ],
  },
  de: {
    privacy: [
      { heading: "Eingaben pruefen und entfernen", body: "Du kontrollierst die Werte, die du in die Tools einfuegst. Ersetze Produktionsgeheimnisse, Kundendaten und interne Adressen durch sichere Beispiele und pruefe vor dem Teilen auch den lokalen Browserverlauf und den kopierten Text." },
      { heading: "Umfang oeffentlicher Netzwerkpruefungen", body: "DNS- und HTTP-Pruefungen sind fuer oeffentliche Domains und oeffentliche URLs gedacht. Private Systeme, Berechtigungen und interne Stoerungen sollten mit vertrauenswuerdigen Werkzeugen deiner Organisation geprueft werden." },
    ],
    terms: [
      { heading: "Verantwortung fuer Ergebnispruefung", body: "Formatierungs-, Konvertierungs-, Generator- und Diagnoseergebnisse sind Arbeitsentwuerfe. Vor Nutzung in Deployment, Dokumentation, Sicherheitseinstellungen, Zeitplaenen oder Daten muessen sie in der Zielumgebung geprueft werden." },
      { heading: "Sicherheitsgrenzen", body: "Nutze oeffentliche Tools nicht, um private Infrastruktur zu sondieren, Zugriffskontrollen zu umgehen oder Ziele ohne Berechtigung zu pruefen. Verwende nur teilbare Beispiele und oeffentlich erreichbare Ziele." },
    ],
  },
  fr: {
    privacy: [
      { heading: "Verifier et supprimer les entrees", body: "Vous gardez le controle des valeurs collees dans les outils. Remplacez secrets de production, donnees client et adresses internes par des exemples surs; avant partage, verifiez aussi l'historique local du navigateur et le texte copie." },
      { heading: "Perimetre des controles publics", body: "Les controles DNS et HTTP sont destines aux domaines publics et aux URL publiques. Les systemes prives, permissions et incidents internes doivent etre verifies avec les outils de confiance de votre organisation." },
    ],
    terms: [
      { heading: "Responsabilite de verification", body: "Les resultats de formatage, conversion, generation et diagnostic sont des brouillons de travail. Avant usage en deploiement, documentation, securite, planification ou traitement de donnees, verifiez-les dans l'environnement cible." },
      { heading: "Limites de securite", body: "N'utilisez pas les outils publics pour sonder une infrastructure privee, contourner des controles d'acces ou verifier des cibles sans autorisation. Utilisez seulement des exemples partageables et des destinations publiques." },
    ],
  },
  hi: {
    privacy: [
      { heading: "इनपुट की जांच और हटाना", body: "टूल में चिपकाए गए मान आपके नियंत्रण में रहते हैं. उत्पादन secrets, ग्राहक डेटा और आंतरिक addresses को सुरक्षित उदाहरणों से बदलें; साझा करने से पहले browser की local history और copied text भी जांचें." },
      { heading: "सार्वजनिक network जांच की सीमा", body: "DNS और HTTP जांच सार्वजनिक domains और public URLs के लिए हैं. private systems, permissions या internal incidents की जांच अपनी organization के trusted tools में करें." },
    ],
    terms: [
      { heading: "नतीजे जांचने की जिम्मेदारी", body: "format, conversion, generation और diagnostic results काम के drafts हैं. deployment, documentation, security settings, schedulers या data processing में इस्तेमाल से पहले target environment में दोबारा जांचें." },
      { heading: "सुरक्षा सीमा", body: "public tools से private infrastructure probe करना, access controls bypass करना या बिना अनुमति targets जांचना मना है. केवल share करने योग्य examples और public targets इस्तेमाल करें." },
    ],
  },
  id: {
    privacy: [
      { heading: "Memeriksa dan menghapus masukan", body: "Anda mengontrol nilai yang ditempel ke alat. Ganti rahasia produksi, data pelanggan, dan alamat internal dengan contoh aman; sebelum berbagi, periksa juga riwayat lokal browser dan teks yang disalin." },
      { heading: "Cakupan pemeriksaan jaringan publik", body: "Pemeriksaan DNS dan HTTP ditujukan untuk domain publik dan URL publik. Sistem privat, izin akses, dan insiden internal harus diperiksa dengan alat tepercaya milik organisasi Anda." },
    ],
    terms: [
      { heading: "Tanggung jawab memverifikasi hasil", body: "Hasil format, konversi, pembuatan, dan diagnosis adalah draf kerja. Sebelum dipakai untuk deploy, dokumentasi, pengaturan keamanan, penjadwal, atau data, verifikasi lagi di lingkungan tujuan." },
      { heading: "Batas keamanan", body: "Jangan memakai alat publik untuk menyelidiki infrastruktur privat, melewati kontrol akses, atau memeriksa target tanpa izin. Gunakan hanya contoh yang dapat dibagikan dan tujuan yang dapat diakses publik." },
    ],
  },
  vi: {
    privacy: [
      { heading: "Kiểm tra và xóa đầu vào", body: "Bạn kiểm soát giá trị được dán vào công cụ. Hãy thay bí mật sản xuất, dữ liệu khách hàng và địa chỉ nội bộ bằng ví dụ an toàn; trước khi chia sẻ, kiểm tra cả lịch sử cục bộ của trình duyệt và văn bản đã sao chép." },
      { heading: "Phạm vi kiểm tra mạng công khai", body: "Kiểm tra DNS và HTTP dành cho miền công khai và URL công khai. Hệ thống riêng, quyền truy cập và sự cố nội bộ nên được kiểm tra bằng công cụ tin cậy của tổ chức bạn." },
    ],
    terms: [
      { heading: "Trách nhiệm xác minh kết quả", body: "Kết quả định dạng, chuyển đổi, tạo và chẩn đoán là bản nháp hỗ trợ công việc. Trước khi dùng cho triển khai, tài liệu, bảo mật, lịch chạy hoặc dữ liệu, hãy xác minh trong môi trường đích." },
      { heading: "Ranh giới bảo mật", body: "Không dùng công cụ công khai để dò hạ tầng riêng, vượt kiểm soát truy cập hoặc kiểm tra mục tiêu không có quyền. Chỉ dùng ví dụ có thể chia sẻ và đích truy cập công khai." },
    ],
  },
  th: {
    privacy: [
      { heading: "ตรวจและลบอินพุต", body: "คุณเป็นผู้ควบคุมค่าที่วางลงในเครื่องมือ เปลี่ยนความลับของระบบจริง ข้อมูลลูกค้า และที่อยู่ภายในเป็นตัวอย่างที่ปลอดภัย และก่อนแชร์ให้ตรวจประวัติในเบราว์เซอร์กับข้อความที่คัดลอกด้วย" },
      { heading: "ขอบเขตการตรวจเครือข่ายสาธารณะ", body: "การตรวจ DNS และ HTTP ใช้กับโดเมนสาธารณะและ URL สาธารณะ ระบบส่วนตัว สิทธิ์เข้าถึง และเหตุขัดข้องภายในควรตรวจด้วยเครื่องมือที่องค์กรของคุณเชื่อถือ" },
    ],
    terms: [
      { heading: "ความรับผิดชอบในการตรวจผลลัพธ์", body: "ผลจากการจัดรูปแบบ แปลง สร้าง และวินิจฉัยเป็นร่างสำหรับช่วยทำงาน ก่อนใช้กับการ deploy เอกสาร การตั้งค่าความปลอดภัย ตัวตั้งเวลา หรือข้อมูล ต้องตรวจซ้ำในสภาพแวดล้อมปลายทาง" },
      { heading: "ขอบเขตความปลอดภัย", body: "ห้ามใช้เครื่องมือสาธารณะตรวจโครงสร้างพื้นฐานส่วนตัว เลี่ยงการควบคุมสิทธิ์ หรือทดสอบเป้าหมายที่ไม่มีสิทธิ์ ใช้เฉพาะตัวอย่างที่แชร์ได้และปลายทางสาธารณะเท่านั้น" },
    ],
  },
  ar: {
    privacy: [
      { heading: "مراجعة المدخلات وحذفها", body: "أنت تتحكم في القيم التي تلصقها داخل الأدوات. استبدل أسرار الإنتاج وبيانات العملاء والعناوين الداخلية بأمثلة آمنة، وراجع سجل المتصفح المحلي والنص المنسوخ قبل المشاركة." },
      { heading: "نطاق فحوصات الشبكة العامة", body: "فحوصات DNS وHTTP مخصصة للنطاقات العامة والروابط العامة. يجب فحص الأنظمة الخاصة والصلاحيات والحوادث الداخلية باستخدام أدوات موثوقة داخل مؤسستك." },
    ],
    terms: [
      { heading: "مسؤولية التحقق من النتائج", body: "نتائج التنسيق والتحويل والإنشاء والتشخيص مسودات تساعد على العمل. قبل استخدامها في النشر أو التوثيق أو إعدادات الأمان أو الجداول أو البيانات، تحقق منها في البيئة المقصودة." },
      { heading: "حدود الأمان", body: "لا تستخدم الأدوات العامة لاستطلاع بنية خاصة أو تجاوز ضوابط الوصول أو فحص أهداف لا تملك إذنا بها. استخدم فقط أمثلة قابلة للمشاركة وأهدافا متاحة للعامة." },
    ],
  },
};

const localizedLegalDepthSections: Partial<Record<Exclude<Locale, "en">, Record<LegalPageKind, LegalSection[]>>> = {
  ko: {
    privacy: [
      { heading: "로컬 처리와 서버 확인 구분", body: "JSON, Regex, Base64, JWT, Hash, Password, Color, CSV, Markdown 같은 대부분의 작업은 브라우저에서 즉시 처리됩니다. DNS 조회와 HTTP 상태 확인처럼 공개 네트워크 응답을 확인해야 하는 기능만 제한된 서버 경로를 사용하며, 이 경우에도 공개 URL 또는 공개 호스트 이름만 입력해야 합니다." },
      { heading: "최근 사용 기록 관리", body: "즐겨찾기와 최근 도구 기록은 사용자가 같은 브라우저에서 작업 흐름을 이어가기 위한 편의 기능입니다. 이 기록은 계정 프로필로 합쳐지지 않고, 다른 기기와 동기화되는 서비스 기록으로 취급되지 않으며, 사용자가 직접 삭제할 수 있습니다." },
      { heading: "공유 전 마스킹 기준", body: "도구 결과를 이슈, 문서, 채팅, 코드 리뷰에 붙여 넣기 전에는 token, cookie, 고객 식별자, 내부 host, 비공개 URL, 일회성 링크를 제거해야 합니다. 구조가 필요한 경우에는 같은 필드 이름을 가진 테스트 값이나 짧은 샘플을 사용하세요." },
      { heading: "제3자 서비스와 도구 결과", body: "제3자 서비스는 사이트 운영, 보안, 성능 이해 또는 무료 도구 제공을 돕기 위해 포함될 수 있습니다. 이러한 서비스는 도구가 생성한 결과처럼 표시되어서는 안 되며, 사용자는 실제 입력과 출력 영역을 기준으로 결과를 검토해야 합니다." },
    ],
    terms: [
      { heading: "결과 검증 범위", body: "이 사이트의 출력은 개발자가 빠르게 확인할 수 있는 초안입니다. Regex, cron, DNS, HTTP header, SEO tag, SQL, CSS, JavaScript, YAML, ENV 결과를 운영 환경에 반영하기 전에는 대상 시스템의 공식 문서와 실제 런타임에서 다시 확인해야 합니다." },
      { heading: "공용 네트워크 도구 제한", body: "DNS와 HTTP 상태 확인은 공개 도메인, 공개 URL, 공개 배포 상태를 진단하기 위한 기능입니다. 사설망, 사내 관리자 페이지, 인증이 필요한 리소스, 권한 없는 대상의 상태를 확인하거나 스캔하는 용도로 사용할 수 없습니다." },
      { heading: "자동화와 남용 금지", body: "반복 요청을 자동화해 서비스 품질을 떨어뜨리거나, 오해를 유발하는 트래픽을 만들거나, 원격 서비스를 방해하는 방식으로 도구를 사용할 수 없습니다. 서버 경로가 있는 기능은 일반적인 수동 진단을 전제로 설계되어 있습니다." },
      { heading: "문제 신고 시 필요한 정보", body: "도구 결과가 예상과 다르면 실제 비밀값을 보내지 말고, 재현 가능한 공개 샘플, 사용한 도구 경로, 브라우저, 기대한 결과, 표시된 경고를 함께 알려주세요. 이렇게 해야 입력 구조를 보존하면서도 민감한 정보를 보호할 수 있습니다." },
    ],
  },
  ja: {
    privacy: [
      { heading: "ローカル処理とサーバー確認の区別", body: "JSON、Regex、Base64、JWT、Hash、Password、Color、CSV、Markdown など多くの作業はブラウザ内で処理されます。DNS 検索や HTTP 状態確認のように公開ネットワークの応答が必要な機能だけ、制限されたサーバー経路を使います。その場合も公開 URL または公開ホスト名だけを入力してください。" },
      { heading: "最近の利用履歴の管理", body: "お気に入りと最近使ったツールは、同じブラウザで作業を続けやすくするための機能です。この履歴はアカウントプロフィールに統合されず、別端末と同期されるサービス履歴として扱われず、利用者が画面またはブラウザ設定から削除できます。" },
      { heading: "共有前のマスキング基準", body: "結果を issue、文書、チャット、コードレビューに貼る前に、token、cookie、顧客識別子、内部 host、非公開 URL、一回限りの link を削除してください。構造が必要な場合は、同じ field 名を持つテスト値や短いサンプルを使います。" },
      { heading: "第三者サービスとツール結果", body: "第三者サービスはサイト運営、保護、性能理解、無料ツール提供を支える目的で含まれることがあります。これらのサービスはツールが生成した結果のように表示されるべきではなく、利用者は実際の入力と出力の領域を基準に結果を確認してください。" },
    ],
    terms: [
      { heading: "結果検証の範囲", body: "このサイトの出力は、開発者が素早く確認するための下書きです。Regex、cron、DNS、HTTP header、SEO tag、SQL、CSS、JavaScript、YAML、ENV の結果を本番環境へ反映する前に、対象システムの公式文書と実際の runtime で再確認してください。" },
      { heading: "公開ネットワークツールの制限", body: "DNS と HTTP 状態確認は、公開ドメイン、公開 URL、公開デプロイ状態を診断するための機能です。私有ネットワーク、社内管理画面、認証が必要な resource、権限のない対象の確認や scan には使用できません。" },
      { heading: "自動化と乱用の禁止", body: "繰り返しリクエストを自動化してサービス品質を下げたり、誤解を招く traffic を作ったり、遠隔サービスを妨害したりする形でツールを使うことはできません。サーバー経路を持つ機能は、通常の手動診断を前提にしています。" },
      { heading: "問題報告に必要な情報", body: "結果が期待と異なる場合は、本物の秘密情報を送らず、再現できる公開サンプル、使用したツール path、ブラウザ、期待した結果、表示された警告を共有してください。これにより入力構造を保ちながら機密情報を守れます。" },
    ],
  },
  "zh-CN": {
    privacy: [
      { heading: "区分本地处理和服务器检查", body: "JSON、Regex、Base64、JWT、Hash、Password、Color、CSV、Markdown 等大多数操作在浏览器内完成。只有 DNS 查询和 HTTP 状态检查这类需要观察公开网络响应的功能，会使用受限服务器路径；即使如此，也只应提交公开 URL 或公开主机名。" },
      { heading: "管理最近使用记录", body: "收藏和最近工具记录只是为了让你在同一浏览器继续工作。它们不会合并成账号资料，也不会作为跨设备同步的服务历史处理。你可以从界面或浏览器存储设置中清除这些本地记录。" },
      { heading: "分享前的脱敏标准", body: "把结果贴到 issue、文档、聊天或代码评审前，请删除 token、cookie、客户标识、内部 host、非公开 URL 和一次性链接。如果需要保留结构，请使用字段相同但可公开的测试值或短样例。" },
      { heading: "第三方服务与工具结果", body: "第三方服务可能用于运行站点、保护服务、理解性能或支持免费工具体验。这些服务不应伪装成工具生成的结果；判断输出是否可用时，应以页面中的实际输入、诊断和输出区域为准。" },
    ],
    terms: [
      { heading: "结果验证范围", body: "本站输出是帮助开发者快速检查的草稿。Regex、cron、DNS、HTTP header、SEO tag、SQL、CSS、JavaScript、YAML、ENV 等结果在进入生产环境前，都应结合目标系统官方说明和真实运行环境再次验证。" },
      { heading: "公开网络工具限制", body: "DNS 和 HTTP 状态检查用于诊断公开域名、公开 URL 和公开部署状态。不得用于检查私有网络、公司内部管理页面、需要认证的资源，或你没有权限处理的目标。" },
      { heading: "禁止自动化和滥用", body: "不得通过自动化重复请求降低服务质量、制造误导性流量，或以影响远程服务的方式使用工具。带服务器路径的功能只面向普通手动诊断，不适合作为扫描、压测或权限绕过工具。" },
      { heading: "报告问题所需信息", body: "如果结果不符合预期，请不要发送真实密钥。请提供可公开复现的样例、工具路径、浏览器、期望结果和页面显示的警告。这样可以保留输入结构，同时保护敏感信息。" },
    ],
  },
  "zh-TW": {
    privacy: [
      { heading: "區分本機處理和伺服器檢查", body: "JSON、Regex、Base64、JWT、Hash、Password、Color、CSV、Markdown 等多數操作在瀏覽器內完成。只有 DNS 查詢和 HTTP 狀態檢查這類需要觀察公開網路回應的功能，會使用受限伺服器路徑；即使如此，也只應提交公開 URL 或公開主機名稱。" },
      { heading: "管理最近使用紀錄", body: "收藏與最近工具紀錄只是為了讓你在同一瀏覽器繼續工作。它們不會合併成帳號資料，也不會作為跨裝置同步的服務歷史處理。你可以從介面或瀏覽器儲存設定中清除這些本機紀錄。" },
      { heading: "分享前的遮罩標準", body: "把結果貼到 issue、文件、聊天或程式碼審查前，請刪除 token、cookie、客戶識別、內部 host、非公開 URL 和一次性連結。如果需要保留結構，請使用欄位相同但可公開的測試值或短範例。" },
      { heading: "第三方服務與工具結果", body: "第三方服務可能用於運行站點、保護服務、理解效能或支援免費工具體驗。這些服務不應偽裝成工具產生的結果；判斷輸出是否可用時，應以頁面中的實際輸入、診斷和輸出區域為準。" },
    ],
    terms: [
      { heading: "結果驗證範圍", body: "本站輸出是協助開發者快速檢查的草稿。Regex、cron、DNS、HTTP header、SEO tag、SQL、CSS、JavaScript、YAML、ENV 等結果在進入正式環境前，都應結合目標系統官方說明和真實執行環境再次驗證。" },
      { heading: "公開網路工具限制", body: "DNS 與 HTTP 狀態檢查用於診斷公開網域、公開 URL 與公開部署狀態。不得用於檢查私有網路、公司內部管理頁面、需要認證的資源，或你沒有權限處理的目標。" },
      { heading: "禁止自動化和濫用", body: "不得透過自動化重複請求降低服務品質、製造誤導性流量，或以影響遠端服務的方式使用工具。帶伺服器路徑的功能只面向一般手動診斷，不適合作為掃描、壓測或權限繞過工具。" },
      { heading: "回報問題所需資訊", body: "如果結果不符合預期，請不要傳送真實密鑰。請提供可公開重現的範例、工具路徑、瀏覽器、預期結果和頁面顯示的警告。這樣可以保留輸入結構，同時保護敏感資訊。" },
    ],
  },
  th: {
    privacy: [
      { heading: "แยกงานในเบราว์เซอร์กับการตรวจผ่านเซิร์ฟเวอร์", body: "งานส่วนใหญ่ เช่น JSON, Regex, Base64, JWT, Hash, Password, Color, CSV และ Markdown จะประมวลผลในเบราว์เซอร์ทันที เฉพาะ DNS lookup และ HTTP status ที่ต้องดูคำตอบจากเครือข่ายสาธารณะเท่านั้นที่ใช้เส้นทางเซิร์ฟเวอร์แบบจำกัด และควรใส่เฉพาะ URL หรือชื่อ host สาธารณะ" },
      { heading: "การจัดการประวัติการใช้ล่าสุด", body: "รายการโปรดและเครื่องมือที่ใช้ล่าสุดมีไว้เพื่อให้กลับมาทำงานต่อในเบราว์เซอร์เดิมได้ง่าย ข้อมูลนี้ไม่รวมเป็นโปรไฟล์บัญชี ไม่ถือเป็นประวัติบริการที่ sync ข้ามเครื่อง และผู้ใช้สามารถลบจากหน้าจอหรือการตั้งค่า storage ของเบราว์เซอร์ได้" },
      { heading: "เกณฑ์ลบข้อมูลก่อนแชร์", body: "ก่อนนำผลลัพธ์ไปวางใน issue เอกสาร แชท หรือ code review ให้ลบ token, cookie, รหัสลูกค้า, host ภายใน, URL ที่ไม่สาธารณะ และลิงก์ใช้ครั้งเดียว หากต้องการคงโครงสร้าง ให้ใช้ค่าทดสอบที่มีชื่อ field เดียวกันแทน" },
      { heading: "บริการภายนอกกับผลลัพธ์ของเครื่องมือ", body: "บริการภายนอกอาจถูกใช้เพื่อช่วยให้เว็บไซต์ทำงาน ป้องกันการละเมิด เข้าใจประสิทธิภาพ หรือสนับสนุนเครื่องมือฟรี บริการเหล่านี้ไม่ควรถูกแสดงเหมือนเป็นผลลัพธ์จากเครื่องมือ ผู้ใช้ควรตรวจจากพื้นที่ input, diagnostic และ output จริงบนหน้า" },
    ],
    terms: [
      { heading: "ขอบเขตการตรวจผลลัพธ์", body: "ผลลัพธ์ของเว็บไซต์นี้เป็นร่างสำหรับช่วยนักพัฒนาตรวจเร็ว ก่อนนำ Regex, cron, DNS, HTTP header, SEO tag, SQL, CSS, JavaScript, YAML หรือ ENV ไปใช้กับระบบจริง ต้องตรวจซ้ำกับเอกสารทางการของระบบปลายทางและ runtime จริง" },
      { heading: "ข้อจำกัดของเครื่องมือเครือข่ายสาธารณะ", body: "การตรวจ DNS และ HTTP status ใช้สำหรับโดเมนสาธารณะ URL สาธารณะ และสถานะ deployment ที่เปิดเผยเท่านั้น ห้ามใช้ตรวจ private network หน้า admin ภายใน resource ที่ต้อง login หรือเป้าหมายที่คุณไม่มีสิทธิ์จัดการ" },
      { heading: "ห้าม automation และการใช้งานเกินขอบเขต", body: "ห้ามทำคำขอซ้ำอัตโนมัติจนกระทบคุณภาพบริการ สร้าง traffic ที่ทำให้เข้าใจผิด หรือใช้เครื่องมือไปรบกวนบริการอื่น ฟีเจอร์ที่มีเส้นทางเซิร์ฟเวอร์ออกแบบมาเพื่อการวินิจฉัยด้วยมือ ไม่ใช่การ scan, load test หรือ bypass สิทธิ์" },
      { heading: "ข้อมูลที่ควรมีเมื่อรายงานปัญหา", body: "หากผลลัพธ์ไม่ตรงที่คาด อย่าส่ง secret จริง ให้ส่งตัวอย่างที่เปิดเผยได้ path ของเครื่องมือ browser ที่ใช้ ผลลัพธ์ที่คาดหวัง และคำเตือนที่เห็นบนหน้า วิธีนี้ช่วยรักษารูปร่างของ input โดยไม่เปิดเผยข้อมูลอ่อนไหว" },
    ],
  },
  ar: {
    privacy: [
      { heading: "الفصل بين المعالجة المحلية وفحص الخادم", body: "معظم أعمال JSON وRegex وBase64 وJWT وHash وPassword وColor وCSV وMarkdown تتم داخل المتصفح. تستخدم وظائف مثل DNS lookup وHTTP status مسار خادم محدودا فقط لأنها تحتاج إلى قراءة استجابة شبكة عامة، وفي هذه الحالة يجب إدخال URL عام أو host عام فقط." },
      { heading: "إدارة سجل الاستخدام الأخير", body: "المفضلات والأدوات الأخيرة تساعدك على متابعة العمل في المتصفح نفسه. لا تتحول هذه القيم إلى ملف حساب، ولا تعامل كتاريخ خدمة متزامن بين الأجهزة، ويمكن حذفها من الواجهة أو من إعدادات تخزين المتصفح." },
      { heading: "معايير الإخفاء قبل المشاركة", body: "قبل لصق النتيجة في issue أو وثيقة أو محادثة أو code review، احذف token وcookie ومعرفات العملاء وhosts الداخلية وURLs غير العامة والروابط أحادية الاستخدام. إذا كانت البنية مهمة، استخدم قيما اختبارية بنفس أسماء الحقول." },
      { heading: "الخدمات الخارجية ونتائج الأدوات", body: "قد تستخدم خدمات خارجية لتشغيل الموقع وحمايته وفهم الأداء ودعم الأدوات المجانية. يجب ألا تظهر هذه الخدمات وكأنها نتيجة أداة، وعلى المستخدم مراجعة مناطق الإدخال والتشخيص والإخراج الفعلية عند الحكم على النتيجة." },
    ],
    terms: [
      { heading: "نطاق التحقق من النتائج", body: "مخرجات الموقع مسودات تساعد المطور على الفحص السريع. قبل استخدام نتائج Regex أو cron أو DNS أو HTTP header أو SEO tag أو SQL أو CSS أو JavaScript أو YAML أو ENV في الإنتاج، تحقق منها مع وثائق النظام المقصود وبيئة التشغيل الفعلية." },
      { heading: "حدود أدوات الشبكة العامة", body: "فحوصات DNS وHTTP status مخصصة للنطاقات العامة وURLs العامة وحالة النشر العامة. لا يجوز استخدامها لفحص شبكات خاصة أو صفحات إدارة داخلية أو موارد تحتاج مصادقة أو أهداف لا تملك صلاحية التعامل معها." },
      { heading: "منع الأتمتة والإساءة", body: "لا يجوز أتمتة الطلبات المتكررة بما يخفض جودة الخدمة أو يصنع traffic مضللا أو يزعج خدمات بعيدة. الوظائف التي تستخدم مسار خادم مصممة للتشخيص اليدوي العادي، وليست للمسح أو اختبار الضغط أو تجاوز الصلاحيات." },
      { heading: "معلومات بلاغات المشاكل", body: "إذا لم تكن النتيجة كما توقعت، لا ترسل أسرارا حقيقية. أرسل عينة عامة قابلة لإعادة الإنتاج، ومسار الأداة، والمتصفح، والنتيجة المتوقعة، والتحذير الظاهر في الصفحة. هكذا تبقى بنية الإدخال واضحة مع حماية البيانات الحساسة." },
    ],
  },
};

const localizedLegalAuditSections: Partial<Record<Exclude<Locale, "en">, Record<LegalPageKind, LegalSection[]>>> = {
  ko: {
    privacy: [
      { heading: "사용자가 통제하는 값", body: "이 사이트는 계정 기반 편집 공간이 아니라 즉시 실행하는 개발자 유틸리티 모음입니다. 사용자는 어떤 값을 붙여 넣고, 어떤 결과를 복사하며, 어떤 로컬 기록을 남길지 직접 결정합니다. 민감한 값은 입력 전에 줄이거나 바꾸는 방식으로 관리해야 합니다." },
      { heading: "공개 페이지 품질 유지", body: "도구, 가이드, FAQ, 법적 안내는 사용자가 결과를 이해하고 다음 작업을 고르도록 돕기 위해 계속 보강됩니다. 페이지가 단순한 링크 모음이나 빈 생성기처럼 보이지 않도록 실제 예시, 경고, 체크리스트, 관련 도구 흐름을 함께 제공합니다." },
    ],
    terms: [
      { heading: "사용자 판단의 책임", body: "도구는 형식 오류, 시간대 차이, encoding 문제, header 누락, DNS 상태처럼 검토 지점을 빠르게 드러냅니다. 그러나 최종 복사, 배포, 공유 여부는 사용자의 판단이며, 중요한 변경은 코드 리뷰, 운영 로그, 플랫폼 문서와 함께 확인해야 합니다." },
      { heading: "품질 유지와 변경 기준", body: "새 도구나 가이드가 추가될 때는 실제 입력, 구조화된 결과, 실패 사례, 복사 전 점검, 관련 다음 단계가 함께 제공되어야 합니다. 단순 placeholder, 빈 페이지, 사용하지 않는 legacy route는 공용 서비스 품질을 떨어뜨리므로 유지하지 않습니다." },
    ],
  },
  ja: {
    privacy: [
      { heading: "利用者が管理する値", body: "このサイトはアカウント型の編集スペースではなく、すぐ使える開発者ユーティリティ集です。利用者は何を貼り付け、どの結果をコピーし、どのローカル履歴を残すかを自分で決めます。機密値は入力前に短くするか、安全な値へ置き換えてください。" },
      { heading: "公開ページ品質の維持", body: "ツール、ガイド、FAQ、法的説明は、結果の意味と次の作業を判断しやすくするために更新されます。単なるリンク集や空の生成器に見えないよう、実例、警告、チェックリスト、関連ツールへの流れを一緒に提供します。" },
    ],
    terms: [
      { heading: "利用者判断の責任", body: "ツールは形式エラー、タイムゾーン差、encoding 問題、header 不足、DNS 状態などの確認点を素早く示します。ただし最終的にコピー、デプロイ、共有するかは利用者の判断であり、重要な変更は code review、運用 log、platform 文書と合わせて確認してください。" },
      { heading: "品質維持と変更基準", body: "新しいツールやガイドを追加する場合は、実際の入力、構造化された結果、失敗例、コピー前チェック、関連する次の手順を一緒に提供する必要があります。placeholder、空ページ、使わない legacy route は公開サービスの品質を下げるため維持しません。" },
    ],
  },
  "zh-CN": {
    privacy: [
      { heading: "由用户控制的值", body: "本站不是账号式编辑空间，而是一组可立即使用的开发者工具。你决定粘贴什么、复制什么结果、保留哪些本地历史。敏感值应在输入前缩短、替换或脱敏，避免把真实项目资料带入公开网页。" },
      { heading: "维护公开页面质量", body: "工具、指南、FAQ 和法律说明会持续补充，帮助用户理解结果并选择下一步。页面不应只是链接集合或空生成器，而应提供真实示例、警告、检查清单和相关工具流程。" },
    ],
    terms: [
      { heading: "用户判断责任", body: "工具可以快速暴露格式错误、时区差异、encoding 问题、header 缺失和 DNS 状态等复核点。但最终是否复制、部署或分享由用户决定，重要变更应结合代码评审、运维日志和平台文档确认。" },
      { heading: "质量维护和变更标准", body: "新增工具或指南时，应同时提供真实输入、结构化结果、失败案例、复制前检查和相关下一步。placeholder、空页面和不用的 legacy route 会降低公共服务质量，因此不应保留。" },
      { heading: "普通工具使用范围", body: "本站不提供托管监控、账号审计、合规认证或替代专业评审的服务。它的作用是帮助你把公开样例、配置片段和可分享结果整理清楚，再带回自己的项目环境继续验证。" },
    ],
  },
  "zh-TW": {
    privacy: [
      { heading: "由使用者控制的值", body: "本站不是帳號式編輯空間，而是一組可立即使用的開發者工具。你決定貼上什麼、複製什麼結果、保留哪些本機歷史。敏感值應在輸入前縮短、替換或遮罩，避免把真實專案資料帶入公開網頁。" },
      { heading: "維護公開頁面品質", body: "工具、指南、FAQ 與法律說明會持續補充，協助使用者理解結果並選擇下一步。頁面不應只是連結集合或空產生器，而應提供真實範例、警告、檢查清單與相關工具流程。" },
    ],
    terms: [
      { heading: "使用者判斷責任", body: "工具可以快速暴露格式錯誤、時區差異、encoding 問題、header 缺失和 DNS 狀態等複核點。但最終是否複製、部署或分享由使用者決定，重要變更應結合程式碼審查、維運記錄和平台文件確認。" },
      { heading: "品質維護和變更標準", body: "新增工具或指南時，應同時提供真實輸入、結構化結果、失敗案例、複製前檢查和相關下一步。placeholder、空頁面和不用的 legacy route 會降低公共服務品質，因此不應保留。" },
      { heading: "一般工具使用範圍", body: "本站不提供託管監控、帳號稽核、合規認證或取代專業審查的服務。它的作用是協助你把公開範例、設定片段和可分享結果整理清楚，再帶回自己的專案環境繼續驗證。" },
    ],
  },
  es: {
    privacy: [
      { heading: "Valores controlados por el usuario", body: "Este sitio no es un espacio de edicion con cuenta, sino una coleccion de utilidades que se ejecutan al momento. Tu decides que pegar, que resultado copiar y que historial local conservar. Los valores sensibles deben reducirse, reemplazarse o anonimizarse antes de entrar a una pagina publica." },
      { heading: "Calidad de paginas publicas", body: "Las herramientas, guias, FAQ y textos legales se amplian para que el usuario entienda el resultado y elija el siguiente paso. Una pagina util no debe ser solo una lista de enlaces o un generador vacio; debe incluir ejemplos, avisos, checklist y flujo hacia herramientas relacionadas." },
    ],
    terms: [
      { heading: "Responsabilidad de decision del usuario", body: "Las herramientas revelan rapido errores de formato, diferencias de zona horaria, problemas de encoding, headers faltantes o estado DNS. La decision final de copiar, desplegar o compartir sigue siendo del usuario y los cambios importantes deben revisarse con codigo, logs y documentacion de la plataforma." },
      { heading: "Criterio de calidad y cambios", body: "Cada herramienta o guia nueva debe traer entradas reales, resultados estructurados, casos de fallo, revision antes de copiar y un siguiente paso relacionado. Placeholder, paginas vacias o rutas legacy sin uso reducen la calidad del servicio publico y no deben mantenerse." },
    ],
  },
  "pt-BR": {
    privacy: [
      { heading: "Valores controlados pelo usuario", body: "Este site nao e um espaco de edicao com conta, mas uma colecao de utilitarios executados no momento. Voce decide o que colar, qual resultado copiar e que historico local manter. Valores sensiveis devem ser reduzidos, trocados ou mascarados antes de entrar em uma pagina publica." },
      { heading: "Qualidade das paginas publicas", body: "Ferramentas, guias, FAQ e textos legais sao ampliados para que o usuario entenda o resultado e escolha a proxima etapa. Uma pagina util nao deve ser apenas lista de links ou gerador vazio; precisa de exemplos, avisos, checklist e fluxo para ferramentas relacionadas." },
    ],
    terms: [
      { heading: "Responsabilidade de decisao do usuario", body: "As ferramentas revelam rapidamente erros de formato, diferencas de fuso, problemas de encoding, headers ausentes ou estado DNS. A decisao final de copiar, publicar ou compartilhar continua sendo do usuario, e mudancas importantes devem ser revistas com codigo, logs e documentacao da plataforma." },
      { heading: "Criterio de qualidade e mudancas", body: "Cada ferramenta ou guia novo deve trazer entradas reais, resultados estruturados, casos de falha, revisao antes de copiar e um proximo passo relacionado. Placeholder, paginas vazias ou rotas legacy sem uso reduzem a qualidade do servico publico e nao devem ser mantidos." },
    ],
  },
  de: {
    privacy: [
      { heading: "Vom Nutzer kontrollierte Werte", body: "Diese Seite ist kein kontobasierter Editor, sondern eine Sammlung sofort nutzbarer Entwickler-Utilities. Du entscheidest, welche Werte eingefuegt, welche Ergebnisse kopiert und welche lokalen Verlaeufe behalten werden. Sensible Werte sollten vor der Eingabe gekuerzt, ersetzt oder maskiert werden." },
      { heading: "Qualitaet oeffentlicher Seiten", body: "Tools, Guides, FAQ und rechtliche Hinweise werden erweitert, damit Nutzer Ergebnisse verstehen und den naechsten Schritt waehlen koennen. Eine nuetzliche Seite ist nicht nur Linkliste oder leerer Generator, sondern enthaelt Beispiele, Warnungen, Checklisten und verwandte Tool-Flows." },
    ],
    terms: [
      { heading: "Verantwortung der Nutzerentscheidung", body: "Die Tools zeigen schnell Formatfehler, Zeitzonenunterschiede, Encoding-Probleme, fehlende Header oder DNS-Zustaende. Die Entscheidung zum Kopieren, Deployen oder Teilen bleibt beim Nutzer; wichtige Aenderungen sollten mit Code Review, Betriebslogs und Plattformdokumentation geprueft werden." },
      { heading: "Qualitaets- und Aenderungskriterien", body: "Neue Tools oder Guides brauchen reale Eingaben, strukturierte Ergebnisse, Fehlerfaelle, Pruefung vor dem Kopieren und einen verwandten naechsten Schritt. Placeholder, leere Seiten oder ungenutzte Legacy-Routen senken die Qualitaet des oeffentlichen Dienstes und werden nicht gepflegt." },
    ],
  },
  fr: {
    privacy: [
      { heading: "Valeurs controlees par l'utilisateur", body: "Ce site n'est pas un espace d'edition avec compte, mais une collection d'utilitaires executables immediatement. Vous decidez quoi coller, quel resultat copier et quel historique local garder. Les valeurs sensibles doivent etre reduites, remplacees ou masquees avant d'entrer dans une page publique." },
      { heading: "Qualite des pages publiques", body: "Les outils, guides, FAQ et textes legaux sont enrichis pour aider a comprendre le resultat et choisir l'etape suivante. Une page utile ne doit pas etre une simple liste de liens ou un generateur vide; elle doit fournir exemples, alertes, checklist et flux vers les outils lies." },
    ],
    terms: [
      { heading: "Responsabilite de decision utilisateur", body: "Les outils montrent vite erreurs de format, decalages de fuseau, problemes d'encoding, headers manquants ou etat DNS. La decision finale de copier, deployer ou partager reste a l'utilisateur; les changements importants doivent etre verifies avec code review, logs et documentation plateforme." },
      { heading: "Critere de qualite et changements", body: "Chaque nouvel outil ou guide doit fournir entrees reelles, resultats structures, cas d'echec, controle avant copie et etape suivante liee. Placeholder, pages vides ou routes legacy inutilisees reduisent la qualite du service public et ne doivent pas etre conserves." },
    ],
  },
  hi: {
    privacy: [
      { heading: "उपयोगकर्ता के नियंत्रण वाले मान", body: "यह साइट account based editing space नहीं है, बल्कि तुरंत चलने वाले developer utilities का समूह है. आप तय करते हैं कि क्या paste करना है, कौन सा result copy करना है और कौन सा local history रखना है. Sensitive values को public page में डालने से पहले छोटा, replace या mask करना चाहिए." },
      { heading: "सार्वजनिक पेज की गुणवत्ता", body: "Tools, guides, FAQ और legal notes को इसलिए बढ़ाया जाता है ताकि user result समझ सके और अगला step चुन सके. उपयोगी पेज सिर्फ links या खाली generator नहीं होना चाहिए; उसमें real examples, warnings, checklist और related tools का flow होना चाहिए." },
    ],
    terms: [
      { heading: "User decision की जिम्मेदारी", body: "Tools format error, time zone difference, encoding issue, missing header और DNS status जैसे review points जल्दी दिखाते हैं. Copy, deploy या share करने का अंतिम निर्णय user का है; critical change को code review, operations log और platform docs के साथ दोबारा जांचना चाहिए." },
      { heading: "Quality और change criteria", body: "हर नए tool या guide में real input, structured result, failure cases, copy से पहले review और related next step होना चाहिए. Placeholder, empty pages या unused legacy routes public service की quality घटाते हैं, इसलिए उन्हें बनाए नहीं रखा जाता." },
    ],
  },
  id: {
    privacy: [
      { heading: "Nilai yang dikendalikan pengguna", body: "Situs ini bukan ruang edit berbasis akun, melainkan kumpulan utilitas developer yang langsung berjalan. Anda menentukan nilai apa yang ditempel, hasil apa yang disalin, dan riwayat lokal apa yang disimpan. Nilai sensitif perlu dipersingkat, diganti, atau dimasker sebelum masuk ke halaman publik." },
      { heading: "Menjaga kualitas halaman publik", body: "Alat, panduan, FAQ, dan teks legal diperluas agar pengguna memahami hasil dan memilih langkah berikutnya. Halaman yang berguna tidak cukup berupa daftar tautan atau generator kosong; perlu contoh nyata, peringatan, checklist, dan alur ke alat terkait." },
    ],
    terms: [
      { heading: "Tanggung jawab keputusan pengguna", body: "Alat membantu menemukan error format, perbedaan zona waktu, masalah encoding, header yang hilang, atau status DNS dengan cepat. Keputusan akhir untuk menyalin, menerapkan, atau berbagi tetap ada pada pengguna dan perubahan penting harus dicek dengan review kode, log operasi, serta dokumentasi platform." },
      { heading: "Kriteria kualitas dan perubahan", body: "Setiap alat atau panduan baru harus membawa input nyata, hasil terstruktur, kasus gagal, pemeriksaan sebelum salin, dan langkah terkait berikutnya. Placeholder, halaman kosong, atau route legacy yang tidak dipakai menurunkan kualitas layanan publik dan tidak dipertahankan." },
    ],
  },
  vi: {
    privacy: [
      { heading: "Giá trị do người dùng kiểm soát", body: "Site này không phải không gian chỉnh sửa theo tài khoản, mà là tập hợp tiện ích lập trình chạy ngay. Bạn quyết định dán gì, sao chép kết quả nào và giữ lịch sử cục bộ nào. Giá trị nhạy cảm nên được rút gọn, thay thế hoặc che trước khi đưa vào trang công khai." },
      { heading: "Duy trì chất lượng trang công khai", body: "Công cụ, hướng dẫn, FAQ và ghi chú pháp lý được mở rộng để người dùng hiểu kết quả và chọn bước tiếp theo. Một trang hữu ích không chỉ là danh sách link hay bộ tạo rỗng; cần ví dụ thật, cảnh báo, checklist và luồng sang công cụ liên quan." },
    ],
    terms: [
      { heading: "Trách nhiệm quyết định của người dùng", body: "Công cụ giúp lộ nhanh lỗi định dạng, lệch múi giờ, vấn đề encoding, thiếu header hoặc trạng thái DNS. Quyết định cuối cùng về sao chép, triển khai hoặc chia sẻ vẫn thuộc về người dùng; thay đổi quan trọng nên được kiểm tra với review mã, log vận hành và tài liệu nền tảng." },
      { heading: "Tiêu chí chất lượng và thay đổi", body: "Mỗi công cụ hoặc hướng dẫn mới cần có đầu vào thật, kết quả có cấu trúc, trường hợp lỗi, kiểm tra trước khi sao chép và bước tiếp theo liên quan. Placeholder, trang rỗng hoặc route legacy không dùng làm giảm chất lượng dịch vụ công khai và không được giữ lại." },
    ],
  },
};

export function getLocalizedLegalContent(locale: Locale, kind: LegalPageKind) {
  const content = locale === defaultLocale ? english[kind] : localized[locale][kind];
  const advertisingSection = advertisingSections[locale][kind];
  const expansionSections = locale === defaultLocale ? [] : localizedLegalExpansionSections[locale][kind];
  const depthSections = locale === defaultLocale ? [] : (localizedLegalDepthSections[locale]?.[kind] ?? []);
  const auditSections = locale === defaultLocale ? [] : (localizedLegalAuditSections[locale]?.[kind] ?? []);
  const alreadyIncluded = content.sections.some((section) => section.heading === advertisingSection.heading);

  return {
    ...content,
    lastUpdated: legalUpdatedAt[locale],
    sections: alreadyIncluded
      ? [...content.sections, ...expansionSections, ...depthSections, ...auditSections]
      : [...content.sections, ...expansionSections, ...depthSections, ...auditSections, advertisingSection],
  };
}
