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
  const supplementalContext =
    category.slug === "info"
      ? "정보 글은 가격, 할인율, 제품 라인업처럼 시간이 지나면 바로 달라지는 내용을 다룹니다. 그래서 글 제목과 본문에 기준일을 남기고, 원문 확인 경로와 함께 적습니다. 추천을 단정하기보다 지금 비교할 때 어디부터 보면 좋은지, 실제 결제나 가입 전에 무엇을 다시 눌러봐야 하는지를 남기는 분류입니다. 숫자는 출발점이고 마지막 확인은 늘 공식 페이지와 실제 계산 화면에서 해야 합니다."
      : undefined;

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
            {supplementalContext ? <p className="mt-2">{supplementalContext}</p> : null}
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
                  <CardContent className="border-t pt-4 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="inline-flex items-center gap-2">
                        <Newspaper className="h-4 w-4" />
                        {post.date}
                      </p>
                      {relatedPlay ? (
                        <span className="inline-flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-foreground">
                          바로 해보기: {relatedPlay.title}
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </span>
                      ) : null}
                    </div>
                    {!relatedPlay ? <p className="mt-3 leading-6">글만 남긴 기록입니다.</p> : null}
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
