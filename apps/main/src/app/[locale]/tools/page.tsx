import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { defaultLocale, isLocale, languageAlternates, locales, openGraphLocales, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary, getDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import { orderToolsWithOperationalFirst } from "@/features/tools/operational-surface";
import { toolDirectoryStructuredData } from "@/features/tools/structured-data";
import { readSearchQuery, ToolDirectory } from "@/features/tools/tool-directory";

interface LocalizedToolsIndexPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/tools");
  return value;
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalizedToolsIndexPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getDictionary(locale);
  const pathname = "/tools";
  const url = `https://www.bobob.app${withLocale(pathname, locale)}`;
  const title = `${dictionary.home.toolIndexTitle} | Bob's Multi Tool`;
  const description = dictionary.home.toolIndexDescription;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale],
      url,
      siteName: "Bob's Multi Tool",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocalizedToolsIndexPage({ params, searchParams }: LocalizedToolsIndexPageProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  const initialQuery = readSearchQuery(await searchParams);
  const localizedTools = getLocalizedTools(locale);
  const jsonLd = toolDirectoryStructuredData({
    tools: orderToolsWithOperationalFirst(localizedTools),
    locale,
    url: `https://www.bobob.app${withLocale("/tools", locale)}`,
    title: dictionary.home.toolIndexTitle,
    description: dictionary.home.toolIndexDescription,
    toolsLabel: dictionary.nav.tools,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolDirectory locale={locale} dictionary={dictionary} initialQuery={initialQuery} compactHero />
    </>
  );
}
