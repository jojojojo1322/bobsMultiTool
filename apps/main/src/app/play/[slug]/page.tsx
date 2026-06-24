import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPostBySlug } from "@/features/content/blog";
import { getPlayContentBySlug, getPlayContents } from "@/features/content/play";
import { SurvivalPlayEngine } from "@/features/play/survival-engine";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPlayContents().map((content) => ({ slug: content.slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getPlayContentBySlug(slug);
  if (!content) return {};
  const url = `https://www.bobob.app/play/${content.slug}`;

  return {
    title: `${content.title} - bobob.app Play`,
    description: content.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "bobob.app",
      title: `${content.title} - bobob.app Play`,
      description: content.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.title} - bobob.app Play`,
      description: content.description,
    },
  };
}

export default async function PlayDetailPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const content = getPlayContentBySlug(slug);
  if (!content) notFound();
  const dictionary = getClientDictionary(contentLocale);
  const relatedBlog = content.relatedBlogSlugs[0] ? getBlogPostBySlug(content.relatedBlogSlugs[0]) : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: content.title,
    description: content.description,
    url: `https://www.bobob.app/play/${content.slug}`,
    inLanguage: "ko",
    numberOfPlayers: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 1,
    },
  };

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-2">
            <Badge>Play</Badge>
            <Badge>{content.durationLabel}</Badge>
            <Badge>{content.turns.length}턴</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">{content.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{content.description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <SurvivalPlayEngine content={content} relatedBlogTitle={relatedBlog?.title} />
      </section>
    </main>
  );
}
const contentLocale = "ko";
