import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gamepad2, Newspaper, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPosts } from "@/features/content/blog";
import { homeContentKeywords } from "@/features/content/discovery";
import { getPlayContents } from "@/features/content/play";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import { readSearchQuery } from "@/features/tools/tool-directory";
import { ToolSearchPanel } from "@/features/tools/tool-search-panel";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const popularToolSlugs = ["json-formatter", "regex-tester", "jwt-decoder", "base64-tool", "cron-generator", "dns-lookup"];
const contentLocale = "ko";
const homeKeywords = homeContentKeywords(getBlogPosts(), getPlayContents());
const homeShareTitle = "짧게 읽고 바로 눌러보는 Blog + Play";
const homeShareImage = openGraphImage({ kind: "home", title: homeShareTitle });

export const metadata: Metadata = {
  title: "bobob.app - 개발/AI 기록과 짧은 Play",
  description: "개발/AI 작업 기록과 1분 안팎의 Play를 모은 bobob.app입니다. 글을 읽고, 마우스나 키보드로 한 판 해보고, 필요한 도구까지 이어갑니다.",
  keywords: homeKeywords,
  alternates: {
    canonical: "https://www.bobob.app/",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/",
    siteName: "bobob.app",
    title: "bobob.app - 개발/AI 기록과 짧은 Play",
    description: "개발/AI 작업 기록을 읽고, 짧은 Play를 마우스나 키보드로 바로 한 판 해봅니다.",
    images: [homeShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "bobob.app - 개발/AI 기록과 짧은 Play",
    description: "개발/AI 작업 기록과 브라우저에서 바로 해보는 짧은 Play를 모았습니다.",
    images: [shareImageUrl({ kind: "home", title: homeShareTitle })],
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
            <Badge>Blog + Play</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              짧게 읽고, 바로 눌러보는 Blog + Play
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              개발/AI 작업에서 막혔던 기록은 글로, 손으로 해보면 더 빨리 감이 오는 아이디어는 Play로 모았습니다. 로그인 없이 읽고 한 판 해본 뒤,
              필요하면 남겨둔 도구까지 이어가면 됩니다.
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
              <p className="text-sm font-semibold">바로 시작하는 방식</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>글은 날짜, 기준, 시행착오를 먼저 보여줍니다.</p>
              <p>Play는 한 가지 규칙과 한 가지 조작으로 시작합니다.</p>
              <p>로그인, 랭킹, 댓글 없이 한 판 결과만 보고 넘어갑니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b" data-featured-play>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured Play</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">바로 한 판 하는 Play</h2>
            </div>
            <Link href="/play" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              전체 Play 보기
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {playContents.map((content, index) => (
              <Link key={content.slug} href={`/play/${content.slug}`} className={index === 0 ? "rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40 md:col-span-2" : "rounded-lg border bg-background p-4 transition-colors hover:bg-muted/40"}>
                <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-semibold">{content.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{content.durationLabel}</Badge>
                  <Badge>{content.type === "arcade-game" ? "아케이드 게임" : content.type === "tap-game" ? "탭 게임" : content.type === "sort-match-game" ? "분류 게임" : "짧은 시뮬레이션"}</Badge>
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
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">막히면서 쓴 글</h2>
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
            <h2 className="mt-1 text-2xl font-semibold tracking-normal">필요할 때 쓰는 개발자 도구</h2>
            <p className="mt-1 text-sm text-muted-foreground">JSON, Regex, DNS 같은 도구는 /tools 아래에서 계속 씁니다.</p>
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
          <span>bobob.app Blog + Play</span>
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
