import { withLocale, type Locale } from "@/features/i18n/config";
import type { ToolDefinition } from "./types";

export function toolStructuredData({
  tool,
  locale,
  url,
  toolsLabel,
}: {
  tool: ToolDefinition;
  locale: Locale;
  url: string;
  toolsLabel: string;
}) {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    url,
    description: tool.seo.description,
    inLanguage: locale,
    isAccessibleForFree: true,
    keywords: tool.seo.keywords.join(", "),
    featureList: tool.useCases,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Bob's Multi Tool",
      url: "https://www.bobob.app",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Bob's Multi Tool",
        item: "https://www.bobob.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: toolsLabel,
        item: `https://www.bobob.app${withLocale("/tools", locale)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: url,
      },
    ],
  };

  return [softwareApplication, faqPage, breadcrumbList];
}
