import { withLocale, type Locale } from "@/features/i18n/config";
import type { ToolDefinition } from "./types";

type ToolDirectoryStructuredDataInput = {
  tools: ToolDefinition[];
  locale: Locale;
  url: string;
  title: string;
  description: string;
  toolsLabel: string;
};

export function toolDirectoryStructuredData({
  tools,
  locale,
  url,
  title,
  description,
  toolsLabel,
}: ToolDirectoryStructuredDataInput) {
  const itemList = {
    "@type": "ItemList",
    name: title,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => {
      const toolUrl = `https://www.bobob.app${withLocale(`/tools/${tool.slug}`, locale)}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        url: toolUrl,
        item: {
          "@type": "SoftwareApplication",
          name: tool.title,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web Browser",
          url: toolUrl,
          description: tool.seo.description,
          inLanguage: locale,
          isAccessibleForFree: true,
        },
      };
    }),
  };

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url,
    description,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Bob's Multi Tool",
      url: "https://www.bobob.app",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    mainEntity: itemList,
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
        item: url,
      },
    ],
  };

  return [collectionPage, breadcrumbList];
}

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
