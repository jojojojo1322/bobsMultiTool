import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPostBySlug, getBlogPosts } from "@/features/content/blog";
import { blogPostKeywords } from "@/features/content/discovery";
import { getPlayContentBySlug } from "@/features/content/play";
import { blogPostStructuredData } from "@/features/content/structured-data";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";
import type { ReactNode } from "react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const inlineMarkdownLinkPattern = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;

function renderInlineText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlineMarkdownLinkPattern)) {
    const [raw, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

    try {
      const url = new URL(href);
      if (url.protocol !== "https:") throw new Error("Only https links are rendered");
      nodes.push(
        <a key={`${href}-${index}`} href={url.toString()} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground">
          {label}
        </a>,
      );
    } catch {
      nodes.push(raw);
    }

    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const url = `https://www.bobob.app/blog/${post.slug}`;
  const image = openGraphImage({ kind: "blog", title: post.title });
  const relatedPlays = post.relatedPlaySlugs.flatMap((playSlug) => {
    const content = getPlayContentBySlug(playSlug);
    return content ? [content] : [];
  });

  return {
    title: `${post.title} - bobob.app`,
    description: post.description,
    keywords: blogPostKeywords(post, relatedPlays),
    alternates: {
      canonical: url,
    },
    robots: post.indexPolicy === "noindex" ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      siteName: "bobob.app",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [shareImageUrl({ kind: "blog", title: post.title })],
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
          {post.indexPolicy === "noindex" ? <Badge>제작 메모 보관</Badge> : null}
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
                    <li key={item}>- {renderInlineText(item)}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "table") {
              return (
                <div key={`table-${index}`} className="overflow-x-auto rounded-md border bg-background">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead className="bg-muted/50 text-foreground">
                      <tr>
                        {block.headers.map((header) => (
                          <th key={header} scope="col" className="border-b px-4 py-3 font-semibold">
                            {renderInlineText(header)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {block.rows.map((row, rowIndex) => (
                        <tr key={`${row.join("-")}-${rowIndex}`} className="align-top">
                          {block.headers.map((_, cellIndex) => (
                            <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 leading-6 text-muted-foreground">
                              {renderInlineText(row[cellIndex] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return (
              <p key={`${block.text}-${index}`} className="text-base leading-8 text-muted-foreground">
                {renderInlineText(block.text)}
              </p>
            );
          })}
        </div>
        {relatedPlays.length ? (
          <section className="mt-12 border-t pt-8" data-blog-related-play-bottom>
            <p className="text-sm font-semibold">읽고 나서 해볼 것</p>
            <div className="mt-4 grid gap-3">
              {relatedPlays.map((play) => (
                <Link key={play.slug} href={`/play/${play.slug}`} className="group rounded-md border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted">
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-medium leading-6">{play.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">{play.description}</span>
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
