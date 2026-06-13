import type { Metadata } from "next";
import { defaultLocale, languageAlternates, openGraphLocales } from "@/features/i18n/config";
import { getClientDictionary, getDictionary } from "@/features/i18n/dictionaries";
import { readSearchQuery, ToolDirectory } from "@/features/tools/tool-directory";
import { tools } from "@/features/tools/registry";
import { toolDirectoryStructuredData } from "@/features/tools/structured-data";

interface ToolsIndexPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(defaultLocale);
  const title = `${dictionary.home.toolIndexTitle} - Free Developer Tools Directory`;
  const description = dictionary.metadata.homeDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.bobob.app/tools",
      languages: languageAlternates("/tools"),
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales.en,
      url: "https://www.bobob.app/tools",
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

export default async function ToolsIndexPage({ searchParams }: ToolsIndexPageProps) {
  const dictionary = getClientDictionary(defaultLocale);
  const initialQuery = readSearchQuery(await searchParams);
  const jsonLd = toolDirectoryStructuredData({
    tools,
    locale: defaultLocale,
    url: "https://www.bobob.app/tools",
    title: dictionary.home.toolIndexTitle,
    description: dictionary.home.toolIndexDescription,
    toolsLabel: dictionary.nav.tools,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolDirectory locale={defaultLocale} dictionary={dictionary} initialQuery={initialQuery} compactHero />
    </>
  );
}
