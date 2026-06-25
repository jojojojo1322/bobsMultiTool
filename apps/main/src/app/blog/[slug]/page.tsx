import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPostBySlug, getBlogPosts } from "@/features/content/blog";
import { getPlayContentBySlug } from "@/features/content/play";
import { blogPostStructuredData } from "@/features/content/structured-data";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const url = `https://www.bobob.app/blog/${post.slug}`;

  return {
    title: `${post.title} - bobob.app`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      siteName: "bobob.app",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  const dictionary = getClientDictionary(contentLocale);
  const relatedPlays = post.relatedPlaySlugs.flatMap((playSlug) => {
    const content = getPlayContentBySlug(playSlug);
    return content ? [content] : [];
  });
  const primaryRelatedPlay = relatedPlays[0];
  const jsonLd = blogPostStructuredData({ post, relatedPlays });

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          <Badge>{post.category}</Badge>
          <Badge>{post.date}</Badge>
          <Badge>{post.readingMinutes}분 읽기</Badge>
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-normal">{post.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{post.description}</p>
        {primaryRelatedPlay ? (
          <Link href={`/play/${primaryRelatedPlay.slug}`} className="mt-6 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200">
            {primaryRelatedPlay.title} 바로 하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
        <div className="mt-10 space-y-6">
          {post.body.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2 key={`${block.text}-${index}`} className="pt-2 text-2xl font-semibold tracking-normal">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={`list-${index}`} className="space-y-2 rounded-md border bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                  {block.items.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={`${block.text}-${index}`} className="text-base leading-8 text-muted-foreground">
                {block.text}
              </p>
            );
          })}
        </div>
        {relatedPlays.length ? (
          <section className="mt-10 border-t pt-6" data-blog-related-play-bottom>
            <p className="text-sm font-semibold">읽은 뒤 바로 해보기</p>
            <div className="mt-3 grid gap-2">
              {relatedPlays.map((play) => (
                <Link key={play.slug} href={`/play/${play.slug}`} className="group rounded-md border bg-background p-4 text-sm transition-colors hover:bg-muted">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium">{play.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">{play.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
const contentLocale = "ko";
