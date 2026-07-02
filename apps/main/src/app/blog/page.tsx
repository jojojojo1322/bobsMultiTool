import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { blogCategoryDefinitions, blogCategoryPath, getBlogCategoryByLabel } from "@/features/content/blog-categories";
import { getIndexableBlogPosts } from "@/features/content/blog";
import { blogIndexKeywords } from "@/features/content/discovery";
import { getPlayContentBySlug } from "@/features/content/play";
import { blogIndexStructuredData } from "@/features/content/structured-data";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

const postsForMetadata = getIndexableBlogPosts();
const blogShareTitle = "막히면 적고, 좀 알겠으면 다시 적는 글";
const blogShareImage = openGraphImage({ kind: "blog", title: blogShareTitle });

export const metadata: Metadata = {
  title: "Blog - bobob.app",
  description: "개발, AI, 작은 웹서비스를 만들면서 막힌 것과 다시 고친 것을 적어두는 bobob.app 글 목록입니다.",
  keywords: blogIndexKeywords(postsForMetadata),
  alternates: {
    canonical: "https://www.bobob.app/blog",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/blog",
    siteName: "bobob.app",
    title: "Blog - bobob.app",
    description: "개발/AI 작업을 하다 막힌 지점과 가끔 작은 Play로 이어지는 bobob.app 글 목록.",
    images: [blogShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - bobob.app",
    description: "막히고 고친 기록을 짧게 남기는 글 목록.",
    images: [shareImageUrl({ kind: "blog", title: blogShareTitle })],
  },
};

export default function BlogIndexPage() {
  const dictionary = getClientDictionary(contentLocale);
  const posts = getIndexableBlogPosts();
  const jsonLd = blogIndexStructuredData(posts);
  const categories = blogCategoryDefinitions
    .map((category) => ({
      ...category,
      posts: posts.filter((post) => post.category === category.label),
    }))
    .filter((group) => group.posts.length);

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Blog</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">막히면 적고, 좀 알겠으면 다시 적는 글</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            검색어만 맞춘 글은 재미가 없습니다. 여기에는 개발, AI 도구, 사이드프로젝트 운영을 하다가 실제로 헷갈렸던 것 중 대표로 남길 만한 글만 앞에 둡니다.
            짧은 제작 메모는 Play별 제작 로그로 묶고, 먼저 읽어도 사이트 방향이 보이는 글을 이 목록에 남깁니다.
          </p>
        </div>
      </section>
      <section className="border-b" data-blog-categories>
        <div className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">글 탭</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((group) => (
              <Link
                key={group.slug}
                href={blogCategoryPath(group.slug)}
                className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                {group.label}
                <Badge>{group.posts.length}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-10">
          {categories.map((group) => (
            <section key={group.slug} id={`blog-category-${group.slug}`} data-blog-category={group.label}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">분류</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-normal">{group.label}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{group.description}</p>
                </div>
                <Link href={blogCategoryPath(group.slug)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  이 분류만 보기
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {group.posts.map((post) => {
                  const relatedPlay = post.relatedPlaySlugs[0] ? getPlayContentBySlug(post.relatedPlaySlugs[0]) : undefined;
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardHeader>
                          <div className="mb-2 flex flex-wrap gap-2">
                            <Badge>{getBlogCategoryByLabel(post.category)?.label ?? post.category}</Badge>
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
          ))}
        </div>
      </section>
    </main>
  );
}
const contentLocale = "ko";
