import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gamepad2, Newspaper, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPosts } from "@/features/content/blog";
import { getPlayContents } from "@/features/content/play";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import { readSearchQuery } from "@/features/tools/tool-directory";
import { ToolSearchPanel } from "@/features/tools/tool-search-panel";

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const popularToolSlugs = ["json-formatter", "regex-tester", "jwt-decoder", "base64-tool", "cron-generator", "dns-lookup"];
const contentLocale = "ko";

export const metadata: Metadata = {
  title: "bobob.app - Blog and Play Lab",
  description: "짧게 읽고 바로 해보고 결과를 공유하는 Blog + Play 기반의 가벼운 웹 콘텐츠 실험장입니다.",
  alternates: {
    canonical: "https://www.bobob.app/",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/",
    siteName: "bobob.app",
    title: "bobob.app - Blog and Play Lab",
    description: "짧은 글과 바로 해보는 Play 콘텐츠를 함께 실험하는 가벼운 웹 콘텐츠 랩.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bobob.app - Blog and Play Lab",
    description: "짧게 읽고 바로 해보고 결과를 공유하는 웹 콘텐츠 실험장.",
  },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const dictionary = getClientDictionary(contentLocale);
  const posts = getBlogPosts().slice(0, 5);
  const playContents = getPlayContents();
  const featuredPlay = playContents[0];
  const localizedTools = getLocalizedTools("en");
  const popularTools = popularToolSlugs
    .map((slug) => localizedTools.find((tool) => tool.slug === slug))
    .filter(Boolean);
  const initialQuery = readSearchQuery(await searchParams);

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <Badge>Blog + Play Lab</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              짧게 읽고 바로 해보고 결과를 공유하는 가벼운 웹 콘텐츠 실험장
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              bobob.app은 개발자 도구를 보관하되, 이제 개발과 AI 기록을 읽고 플래시게임처럼 가벼운 Play를 바로 해보는 콘텐츠를 실험합니다.
              첫 라인업은 퇴근 생존기, 프롬프트 정리, 회의 탈출, 우선순위 분류, 버그 잡기입니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={featuredPlay ? `/play/${featuredPlay.slug}` : "/play"}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
              >
                첫 Play 시작 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                최근 글 보기
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">콘텐츠 하네스</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>content metadata -&gt; blog page -&gt; play page -&gt; result/share -&gt; SEO metadata -&gt; smoke test</p>
              <p>글 하나는 관점과 경험을 담고, 관련 Play는 단일 규칙과 단일 조작으로 바로 끝나게 만듭니다.</p>
              <p>초기에는 로그인, 랭킹, 댓글 없이 정적 콘텐츠와 브라우저 상호작용만으로 반응을 확인합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b" data-featured-play>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured Play</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">바로 해보는 콘텐츠</h2>
            </div>
            <Link href="/play" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              전체 Play 보기
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {playContents.slice(0, 5).map((content, index) => (
              <Link key={content.slug} href={`/play/${content.slug}`} className={index === 0 ? "rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40 md:col-span-2" : "rounded-lg border bg-background p-4 transition-colors hover:bg-muted/40"}>
                <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-semibold">{content.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{content.durationLabel}</Badge>
                  <Badge>{content.type === "tap-game" ? "탭 게임" : content.type === "sort-match-game" ? "분류 게임" : "짧은 시뮬레이션"}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/20" data-latest-blog>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Latest Blog</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">최근 글</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              블로그 목록
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {posts.map((post) => (
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
                  <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Newspaper className="h-4 w-4" />
                    {post.date}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8" data-popular-tools>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Popular Tools</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal">보관된 개발자 도구</h2>
            <p className="mt-1 text-sm text-muted-foreground">기존 도구는 삭제하지 않고 `/tools` 아래에서 계속 사용할 수 있습니다.</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            도구 전체 보기
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {popularTools.map((tool) =>
              tool ? (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-md border bg-background p-3 transition-colors hover:bg-muted">
                  <p className="text-sm font-semibold">{tool.shortTitle}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
                </Link>
              ) : null,
            )}
          </div>
          <div className="rounded-lg border bg-card p-3">
            <ToolSearchPanel locale="en" dictionary={getClientDictionary("en")} initialQuery={initialQuery} />
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-muted-foreground">
          <span>bobob.app content lab</span>
          <div className="flex gap-3">
            <Link href="/about" className="hover:text-foreground">
              소개
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              문의
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              개인정보
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              약관
            </Link>
            <Link href="/tools" className="hover:text-foreground">
              Tools archive
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
