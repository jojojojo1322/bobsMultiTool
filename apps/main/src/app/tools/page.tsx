import type { Metadata } from "next";
import { defaultLocale, languageAlternates, openGraphLocales } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { readSearchQuery, ToolDirectory } from "@/features/tools/tool-directory";
import { tools } from "@/features/tools/registry";
import { orderToolsWithOperationalFirst } from "@/features/tools/operational-surface";
import { toolDirectoryStructuredData } from "@/features/tools/structured-data";

interface ToolsIndexPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Web Operations Tool Index";
  const description = "Check public URL status, redirect chains, response headers, DNS, sitemap, robots, canonical metadata, and developer payload utilities from one workbench.";

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
  const description = dictionary.home.toolIndexDescription;
  const jsonLd = toolDirectoryStructuredData({
    tools: orderToolsWithOperationalFirst(tools),
    locale: defaultLocale,
    url: "https://www.bobob.app/tools",
    title: dictionary.home.toolIndexTitle,
    description,
    toolsLabel: dictionary.nav.tools,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolDirectory locale={defaultLocale} dictionary={dictionary} initialQuery={initialQuery} compactHero />
    </>
  );
}
