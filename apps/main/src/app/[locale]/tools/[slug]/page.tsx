import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { defaultLocale, isLocale, languageAlternates, locales, openGraphLocales, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedTool } from "@/features/i18n/localized-content";
import { getToolBySlug, tools } from "@/features/tools/registry";
import { ToolWorkspace } from "@/features/tools/tool-workspace";

interface LocalizedToolPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) => tools.map((tool) => ({ locale, slug: tool.slug })));
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/");
  return value;
}

export async function generateMetadata({ params }: LocalizedToolPageProps): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = validLocale(value);
  const baseTool = getToolBySlug(slug);
  if (!baseTool) return {};
  const tool = getLocalizedTool(baseTool, locale);
  const pathname = `/tools/${tool.slug}`;
  const url = `https://www.bobob.app${withLocale(pathname, locale)}`;

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: url,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url,
      siteName: "Bob's Multi Tool",
      type: "website",
      locale: openGraphLocales[locale],
    },
  };
}

export default async function LocalizedToolPage({ params }: LocalizedToolPageProps) {
  const { locale: value, slug } = await params;
  const locale = validLocale(value);
  const baseTool = getToolBySlug(slug);
  if (!baseTool) notFound();
  const tool = getLocalizedTool(baseTool, locale);
  const dictionary = getClientDictionary(locale);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    url: `https://www.bobob.app${withLocale(`/tools/${tool.slug}`, locale)}`,
    description: tool.seo.description,
    inLanguage: locale,
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <ToolWorkspace tool={tool} locale={locale} dictionary={dictionary} />
    </>
  );
}
