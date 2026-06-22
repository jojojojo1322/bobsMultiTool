import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleAdUnit } from "@/components/GoogleAdsense";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, languageAlternates, openGraphLocales, withLocale } from "@/features/i18n/config";
import { GuideReviewSections } from "@/features/guides/guide-review-sections";
import { getDictionary } from "@/features/i18n/dictionaries";
import { getGuideBySlug, guides } from "@/features/guides/registry";
import { getRelatedTools } from "@/features/tools/registry";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE !== "false";
const adsPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "ca-pub-2620992505263949";
const guideContentAdSlot = process.env.NEXT_PUBLIC_ADSENSE_GUIDE_CONTENT_SLOT;

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
  const guideAdIndex = Math.max(1, Math.ceil(guide.sections.length / 2));

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="relative mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href={withLocale("/", defaultLocale)} className="font-semibold text-foreground hover:text-muted-foreground">
            Bob&apos;s Multi Tool
          </Link>
          <Link href={withLocale("/guides", defaultLocale)} className="text-muted-foreground hover:text-foreground">
            {dictionary.guides.back}
          </Link>
        </div>
        <Badge className="mt-6 block w-fit">{dictionary.guides.badge}</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">{guide.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{guide.description}</p>
        <article className="mt-8 space-y-6">
          {guide.sections.map((section, index) => (
            <div key={section.heading} className="space-y-6">
              <section className="rounded-lg border bg-card p-5">
                <h2 className="text-lg font-semibold">{section.heading}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
                {section.bullets?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
              {index + 1 === guideAdIndex ? (
                <GoogleAdUnit
                  enabled={adsEnabled}
                  publisherId={adsPublisherId}
                  slot={guideContentAdSlot}
                  position="guide-content"
                  format="horizontal"
                  minHeight={120}
                  className="bobob-ad-anchor rounded-lg border bg-background p-3"
                />
              ) : null}
            </div>
          ))}
        </article>
        <GuideReviewSections dictionary={dictionary} locale={defaultLocale} tools={relatedTools} />
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{dictionary.guides.relatedTitle}</CardTitle>
            <CardDescription>{dictionary.guides.relatedDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {relatedTools.map((tool) => (
              <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, defaultLocale)} className="rounded-md border bg-background/60 p-3 text-sm hover:bg-muted">
                <span className="font-medium text-foreground">{tool.title}</span>
                <span className="mt-2 block leading-6 text-muted-foreground">{tool.description}</span>
                {tool.useCases.length ? (
                  <span className="mt-3 block text-xs uppercase tracking-normal text-muted-foreground">{tool.useCases.slice(0, 2).join(" · ")}</span>
                ) : null}
                {tool.examples[0] ? <span className="mt-3 block leading-6 text-muted-foreground">{tool.examples[0].note}</span> : null}
                {tool.faqs[0] ? <span className="mt-2 block leading-6 text-muted-foreground">{tool.faqs[0].answer}</span> : null}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
