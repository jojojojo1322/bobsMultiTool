import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGuideBySlug, guides } from "@/features/guides/registry";
import { defaultLocale, isLocale, languageAlternates, locales, openGraphLocales, withLocale, type Locale } from "@/features/i18n/config";
import { getDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedGuide, getLocalizedRelatedTools } from "@/features/i18n/localized-content";

interface LocalizedGuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) => guides.map((guide) => ({ locale, slug: guide.slug })));
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/guides");
  return value;
}

export async function generateMetadata({ params }: LocalizedGuidePageProps): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = validLocale(value);
  const baseGuide = getGuideBySlug(slug);
  if (!baseGuide) return {};
  const guide = getLocalizedGuide(baseGuide, locale);
  const pathname = `/guides/${guide.slug}`;
  const url = `https://www.bobob.app${withLocale(pathname, locale)}`;
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
      locale: openGraphLocales[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function LocalizedGuidePage({ params }: LocalizedGuidePageProps) {
  const { locale: value, slug } = await params;
  const locale = validLocale(value);
  const baseGuide = getGuideBySlug(slug);
  if (!baseGuide) notFound();
  const guide = getLocalizedGuide(baseGuide, locale);
  const relatedTools = getLocalizedRelatedTools(guide.relatedTools, locale);
  const dictionary = getDictionary(locale);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10" lang={locale} dir={dictionary.dir}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link href={withLocale("/", locale)} className="font-semibold text-foreground hover:text-muted-foreground">
          Bob&apos;s Multi Tool
        </Link>
        <Link href={withLocale("/guides", locale)} className="text-muted-foreground hover:text-foreground">
          {dictionary.guides.back}
        </Link>
      </div>
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
            <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, locale)} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
              {tool.title}
            </Link>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
