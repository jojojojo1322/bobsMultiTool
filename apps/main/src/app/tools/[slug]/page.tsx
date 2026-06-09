import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultLocale, languageAlternates, openGraphLocales } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ToolWorkspace } from "@/features/tools/tool-workspace";
import { getToolBySlug, tools } from "@/features/tools/registry";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const pathname = `/tools/${tool.slug}`;

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: `https://www.bobob.app${pathname}`,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `https://www.bobob.app${pathname}`,
      siteName: "Bob's Multi Tool",
      type: "website",
      locale: openGraphLocales.en,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.title,
      description: tool.seo.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const dictionary = getClientDictionary(defaultLocale);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    url: `https://www.bobob.app/tools/${tool.slug}`,
    description: tool.seo.description,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <ToolWorkspace tool={tool} locale={defaultLocale} dictionary={dictionary} />
    </>
  );
}
