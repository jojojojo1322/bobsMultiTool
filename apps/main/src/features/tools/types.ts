import type { Locale } from "@/features/i18n/config";

export type ToolCategory = "Text" | "Code" | "Web" | "Data" | "Time" | "Security" | "Color" | "SEO" | "Network";

export type DemandTier = "core" | "growth" | "long-tail";

export type MonetizationTier = "core" | "growth" | "long-tail";

export type PrivacyMode = "local" | "server";

export type ToolComponentKey =
  | "regex"
  | "cron"
  | "meta"
  | "iframe"
  | "lorem"
  | "json"
  | "jsonEscape"
  | "jwt"
  | "url"
  | "base64"
  | "timestamp"
  | "uuid"
  | "hash"
  | "diff"
  | "yamlJson"
  | "yamlValidator"
  | "sqlFormatter"
  | "xmlFormatter"
  | "csvJson"
  | "htmlEntity"
  | "colorConverter"
  | "passwordGenerator"
  | "qrCode"
  | "randomToken"
  | "caseConverter"
  | "slugGenerator"
  | "jsonToTypescript"
  | "jsonSchema"
  | "jsonPath"
  | "htmlFormatter"
  | "cssFormatter"
  | "cssMinifier"
  | "javascriptFormatter"
  | "javascriptMinifier"
  | "markdownPreview"
  | "textSortDedupe"
  | "wordCounter"
  | "urlParser"
  | "mimeLookup"
  | "ulid"
  | "robotsGenerator"
  | "sitemapGenerator"
  | "openGraphPreview"
  | "faviconGenerator"
  | "httpStatus"
  | "dnsLookup"
  | "userAgentParser"
  | "timezoneConverter"
  | "cssUnitConverter"
  | "cssClampGenerator";

export interface ToolExample {
  label: string;
  value: string;
  note: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolGuideLink {
  title: string;
  href: string;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  category: ToolCategory;
  description: string;
  component: ToolComponentKey;
  demandTier: DemandTier;
  searchIntents: string[];
  aliases: string[];
  useCases: string[];
  inputExamples: string[];
  failureCases?: string[];
  preCopyChecklist?: string[];
  contentCluster: string;
  monetizationTier: MonetizationTier;
  supportedLocales: Locale[];
  privacyMode: PrivacyMode;
  requiresServer: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  accent: string;
  examples: ToolExample[];
  faqs: ToolFaq[];
  guides: ToolGuideLink[];
  relatedTools: string[];
}
