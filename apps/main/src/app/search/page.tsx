import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gamepad2, Newspaper, Search, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { readContentSearchQuery, searchContentLab } from "@/features/content/search";
import { searchPageStructuredData } from "@/features/content/structured-data";

interface SearchPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const contentLocale = "ko";

export const metadata: Metadata = {
  title: "Search - bobob.app",
  description: "bobob.app의 개발/AI 글, 가벼운 Play, 보관된 개발자 도구를 함께 찾는 검색 페이지입니다.",
  alternates: {
    canonical: "https://www.bobob.app/search",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/search",
    siteName: "bobob.app",
    title: "Search - bobob.app",
    description: "개발/AI 글, Play, 보관 Tools를 한 번에 찾는 bobob.app 검색.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search - bobob.app",
    description: "개발/AI 글, Play, 보관 Tools를 한 번에 찾습니다.",
  },
};

function signalBadges(signals: string[]) {
  return signals.length ? (
    <div className="mt-3 flex flex-wrap gap-1" data-content-search-signals>
      {signals.map((signal) => (
        <Badge key={signal} className="max-w-[16rem] truncate text-[11px] font-normal">
          {signal}
        </Badge>
      ))}
    </div>
  ) : null;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const dictionary = getClientDictionary(contentLocale);
  const query = readContentSearchQuery(await searchParams);
  const results = searchContentLab(query);
  const resultCount = results.blogResults.length + results.playResults.length + results.toolResults.length;
  const jsonLd = searchPageStructuredData({
    query: results.query,
    blogResults: results.blogResults.map((result) => result.item),
    playResults: results.playResults.map((result) => result.item),
    toolResults: results.toolResults.map((result) => result.item),
  });

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Search</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">글, Play, 보관 도구를 함께 찾기</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            개발/AI 기록과 바로 해볼 수 있는 Play를 먼저 보여주고, 필요한 경우 기존 개발자 도구 보관소 결과까지 이어줍니다.
          </p>
          <form action="/search" className="mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row" data-content-search-form>
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input name="q" defaultValue={results.query} placeholder="AI, 프롬프트, 회의, sitemap, JSON..." className="pl-8" />
            </label>
            <Button type="submit">검색</Button>
          </form>
          <p className="mt-3 text-sm text-muted-foreground" data-content-search-count>
            {results.query ? `"${results.query}" 검색 결과 ${resultCount}개` : "검색어를 입력하거나 아래 시작점을 열어보세요."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section data-content-search-play>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Play</p>
                <h2 className="text-2xl font-semibold tracking-normal">바로 해보는 결과</h2>
              </div>
              <Badge>{results.playResults.length}</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {results.playResults.map(({ item, signals }) => (
                <Link key={item.slug} href={`/play/${item.slug}`} className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/40">
                  <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{item.durationLabel}</Badge>
                    <Badge>{item.type === "tap-game" ? "탭 게임" : item.type === "sort-match-game" ? "분류 게임" : "짧은 시뮬레이션"}</Badge>
                  </div>
                  {signalBadges(signals)}
                </Link>
              ))}
            </div>
          </section>

          <section data-content-search-blog>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blog</p>
                <h2 className="text-2xl font-semibold tracking-normal">읽고 이어가기</h2>
              </div>
              <Badge>{results.blogResults.length}</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {results.blogResults.map(({ item, signals }) => (
                <Link key={item.slug} href={`/blog/${item.slug}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge>{item.category}</Badge>
                        <Badge>{item.readingMinutes}분 읽기</Badge>
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Newspaper className="h-4 w-4" />
                        {item.date}
                      </span>
                      {signalBadges(signals)}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-3" data-content-search-tools>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Tools archive</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              검색어가 개발 도구 작업에 가까우면 기존 `/tools` 보관소로 이어집니다.
            </p>
          </div>
          <div className="grid gap-2">
            {results.toolResults.map(({ item, signals }) => (
              <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-md border bg-background p-3 text-sm transition-colors hover:bg-muted">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{item.shortTitle}</span>
                    <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</span>
                  </span>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                </span>
                {signalBadges(signals)}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
