import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentNav } from "@/features/content/content-nav";
import { blogCategoryDefinitions, blogCategoryPath, getBlogCategoryBySlug } from "@/features/content/blog-categories";
import { getBlogPosts } from "@/features/content/blog";
import { blogIndexKeywords } from "@/features/content/discovery";
import { getPlayContentBySlug } from "@/features/content/play";
import { blogCategoryStructuredData } from "@/features/content/structured-data";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

const contentLocale = "ko";

type BlogCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  const posts = getBlogPosts();

  return blogCategoryDefinitions
    .filter((category) => posts.some((post) => post.category === category.label))
    .map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);
  if (!category) return {};

  const url = `https://www.bobob.app${blogCategoryPath(category.slug)}`;
  const posts = getBlogPosts().filter((post) => post.category === category.label);
  const image = openGraphImage({ kind: "category", title: `${category.label} 글 모음` });
  return {
    title: `${category.label} - bobob.app Blog`,
    description: category.description,
    keywords: blogIndexKeywords(posts),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "bobob.app",
      title: `${category.label} - bobob.app Blog`,
      description: category.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.label} - bobob.app Blog`,
      description: category.description,
      images: [shareImageUrl({ kind: "category", title: `${category.label} 글 모음` })],
    },
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);
  if (!category) notFound();

  const posts = getBlogPosts().filter((post) => post.category === category.label);
  if (!posts.length) notFound();

  const dictionary = getClientDictionary(contentLocale);
  const jsonLd = blogCategoryStructuredData({ category, posts });

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Blog category</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">{category.label}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{category.description}</p>
          <div className="mt-5 max-w-3xl rounded-md border bg-background p-4 text-sm leading-7 text-muted-foreground" data-blog-category-context>
            <h2 className="text-base font-semibold tracking-normal text-foreground">이 분류에서 보는 것</h2>
            <p className="mt-2">
              이 페이지는 같은 결의 기록을 한곳에 모아둔 작은 묶음입니다. 글이 아주 반듯한 정답이라기보다, 만들다가 막힌 순간, 방향을 바꾼 이유, 다음에 다시 확인할 기준을 남기는 쪽에
              가깝습니다. 그래서 글마다 길이와 온도는 조금씩 다릅니다. 그날 손이 어디에서 멈췄는지를 보려고 남겨둔 분류입니다.
            </p>
          </div>
          <Link href="/blog" className="mt-6 inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            전체 글 보기
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8" data-blog-category-page={category.slug}>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => {
            const relatedPlay = post.relatedPlaySlugs[0] ? getPlayContentBySlug(post.relatedPlaySlugs[0]) : undefined;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge>{post.category}</Badge>
                      <Badge>{post.readingMinutes}분 읽기</Badge>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p className="inline-flex items-center gap-2">
                      <Newspaper className="h-4 w-4" />
                      {post.date}
                    </p>
                    {relatedPlay ? (
                      <p className="inline-flex items-center gap-2 text-foreground">
                        관련 Play: {relatedPlay.title}
                        <ArrowRight className="h-4 w-4" />
                      </p>
                    ) : (
                      <p>그냥 글만 남긴 기록입니다. 억지로 Play를 붙이진 않았습니다.</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
