import type { Metadata } from "next";
import { defaultLocale, languageAlternates, openGraphLocales } from "@/features/i18n/config";
import { getClientDictionary, getDictionary } from "@/features/i18n/dictionaries";
import { readSearchQuery, ToolDirectory } from "@/features/tools/tool-directory";

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
  };
}

export default async function ToolsIndexPage({ searchParams }: ToolsIndexPageProps) {
  const dictionary = getClientDictionary(defaultLocale);
  const initialQuery = readSearchQuery(await searchParams);
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bob's Multi Tool developer tools directory",
    url: "https://www.bobob.app/tools",
    description: dictionary.home.toolIndexDescription,
    isPartOf: {
      "@type": "WebSite",
      name: "Bob's Multi Tool",
      url: "https://www.bobob.app",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <ToolDirectory locale={defaultLocale} dictionary={dictionary} initialQuery={initialQuery} compactHero />
    </>
  );
}
