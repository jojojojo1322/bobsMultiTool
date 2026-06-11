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
  en: "Last updated: June 11, 2026",
  ko: "최종 업데이트: 2026년 6월 11일",
  ja: "最終更新日: 2026年6月11日",
  "zh-CN": "最后更新: 2026年6月11日",
  "zh-TW": "最後更新: 2026年6月11日",
  es: "Ultima actualizacion: 11 de junio de 2026",
  "pt-BR": "Ultima atualizacao: 11 de junho de 2026",
  de: "Zuletzt aktualisiert: 11. Juni 2026",
  fr: "Derniere mise a jour: 11 juin 2026",
  hi: "अंतिम अपडेट: 11 जून 2026",
  id: "Terakhir diperbarui: 11 Juni 2026",
  vi: "Cập nhật lần cuối: 11 tháng 6, 2026",
  th: "อัปเดตล่าสุด: 11 มิถุนายน 2026",
  ar: "آخر تحديث: 11 يونيو 2026",
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

export function getLocalizedLegalContent(locale: Locale, kind: LegalPageKind) {
  const content = locale === defaultLocale ? english[kind] : localized[locale][kind];
  const advertisingSection = advertisingSections[locale][kind];
  const alreadyIncluded = content.sections.some((section) => section.heading === advertisingSection.heading);

  return {
    ...content,
    lastUpdated: legalUpdatedAt[locale],
    sections: alreadyIncluded ? content.sections : [...content.sections, advertisingSection],
  };
}
