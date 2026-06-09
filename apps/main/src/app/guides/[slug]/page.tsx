import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, languageAlternates, openGraphLocales, withLocale } from "@/features/i18n/config";
import { getDictionary } from "@/features/i18n/dictionaries";
import { getGuideBySlug, guides } from "@/features/guides/registry";
import { getRelatedTools } from "@/features/tools/registry";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  const pathname = `/guides/${guide.slug}`;
  const url = `https://www.bobob.app${pathname}`;

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: "Bob's Multi Tool",
      type: "article",
      locale: openGraphLocales[defaultLocale],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const relatedTools = getRelatedTools(guide.relatedTools);
  const dictionary = getDictionary(defaultLocale);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <Link href={withLocale("/guides", defaultLocale)} className="text-sm text-muted-foreground hover:text-foreground">
        {dictionary.guides.back}
      </Link>
      <Badge className="mt-6 block w-fit">{dictionary.guides.badge}</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal">{guide.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{guide.description}</p>
      <article className="mt-8 space-y-6">
        {guide.sections.map((section) => (
          <section key={section.heading} className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </article>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{dictionary.guides.relatedTitle}</CardTitle>
          <CardDescription>{dictionary.guides.relatedDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {relatedTools.map((tool) => (
            <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, defaultLocale)} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
              {tool.title}
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
