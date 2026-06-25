import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPosts } from "@/features/content/blog";
import { getPlayContentBySlug } from "@/features/content/play";
import { blogIndexStructuredData } from "@/features/content/structured-data";

export const metadata: Metadata = {
  title: "Blog - bobob.app",
  description: "검색 유입을 위한 짧은 글과 관련 Play 콘텐츠를 함께 묶어 실험하는 bobob.app 블로그입니다.",
  alternates: {
    canonical: "https://www.bobob.app/blog",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/blog",
    siteName: "bobob.app",
    title: "Blog - bobob.app",
    description: "짧게 읽고 바로 Play로 이어지는 bobob.app 콘텐츠 글 목록.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - bobob.app",
    description: "짧게 읽고 바로 Play로 이어지는 콘텐츠 글 목록.",
  },
};

export default function BlogIndexPage() {
  const dictionary = getClientDictionary(contentLocale);
  const posts = getBlogPosts();
  const jsonLd = blogIndexStructuredData(posts);

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Blog</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">짧게 읽고 바로 해보는 글</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            트렌드, 생활, 직장, 개발 이슈를 짧게 정리하고 관련 Play 콘텐츠로 자연스럽게 이어갑니다.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
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
                    ) : null}
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
const contentLocale = "ko";
