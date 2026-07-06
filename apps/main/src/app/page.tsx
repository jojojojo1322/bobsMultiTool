import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gamepad2, Network, Newspaper, SearchCheck, ShieldCheck, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getIndexableBlogPosts } from "@/features/content/blog";
import { homeContentKeywords } from "@/features/content/discovery";
import { getPlayContents } from "@/features/content/play";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import { readSearchQuery } from "@/features/tools/tool-directory";
import { ToolSearchPanel } from "@/features/tools/tool-search-panel";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";
import { operationalToolSlugs } from "@/features/tools/operational-surface";

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const pillarBlogSlugs = ["content-indexing-checklist-before-resubmission", "why-bobob-shifted-to-content-lab", "static-micro-games-architecture"];
const contentLocale = "ko";
const homeKeywords = [
  ...homeContentKeywords(getIndexableBlogPosts(), getPlayContents()),
  "URL 상태 점검",
  "redirect chain checker",
  "security headers checker",
  "sitemap health check",
  "robots.txt generator",
  "DNS deployment checker",
  "canonical URL check",
].slice(0, 30);
const homeShareTitle = "URL, 헤더, 사이트맵을 한 번에 점검하는 bobob.app";
const homeShareImage = openGraphImage({ kind: "home", title: homeShareTitle });

const operationWorkflows = [
  {
    label: "URL health",
    title: "리다이렉트와 응답 헤더부터 확인",
    description: "브라우저 주소창, DevTools Network, 터미널 curl로 흩어져 보던 status, 최종 URL, 보안 헤더, CSP 초안을 한 흐름으로 점검합니다.",
    href: "/tools/http-status-checker",
    toolSlugs: ["http-status-checker", "url-parser", "dns-lookup"],
  },
  {
    label: "Discovery",
    title: "sitemap, robots, canonical 제출 전 점검",
    description: "검색 콘솔에 넣기 전에 제출 URL, robots 규칙, canonical/page host, Open Graph 신호를 같이 확인해서 얇은 제출을 줄입니다.",
    href: "/tools/sitemap-generator",
    toolSlugs: ["sitemap-generator", "robots-txt-generator", "meta-tag-generator"],
  },
  {
    label: "API debug",
    title: "토큰과 API 응답을 보고서처럼 정리",
    description: "JWT 시간/claim, JSON 구조, 경로 추출을 복사 가능한 진단 형태로 남겨서 IDE나 DevTools만으로 끝나지 않는 공유 기록을 만듭니다.",
    href: "/tools/jwt-decoder",
    toolSlugs: ["jwt-decoder", "json-formatter", "url-parser"],
  },
];

export const metadata: Metadata = {
  title: "bobob.app - URL, 헤더, 사이트맵 웹 운영 점검",
  description: "리다이렉트, 응답 헤더, DNS, canonical, sitemap, robots, JWT/API 응답을 한 흐름으로 확인하고 Blog/Play 운영 기록까지 이어보는 웹 운영 워크벤치입니다.",
  keywords: homeKeywords,
  alternates: {
    canonical: "https://www.bobob.app/",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/",
    siteName: "bobob.app",
    title: "bobob.app - URL, 헤더, 사이트맵 웹 운영 점검",
    description: "리다이렉트, 응답 헤더, DNS, canonical, sitemap, robots, JWT/API 응답을 한 흐름으로 확인합니다.",
    images: [homeShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "bobob.app - URL, 헤더, 사이트맵 웹 운영 점검",
    description: "DevTools와 터미널에 흩어진 웹 운영 확인을 한 화면 흐름으로 묶습니다.",
    images: [shareImageUrl({ kind: "home", title: homeShareTitle })],
  },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const dictionary = getClientDictionary(contentLocale);
  const indexablePosts = getIndexableBlogPosts();
  const pillarPosts = indexablePosts
    .filter((post) => pillarBlogSlugs.includes(post.slug))
    .sort((left, right) => pillarBlogSlugs.indexOf(left.slug) - pillarBlogSlugs.indexOf(right.slug));
  const pillarPostSlugs = new Set(pillarPosts.map((post) => post.slug));
  const posts = indexablePosts.filter((post) => !pillarPostSlugs.has(post.slug)).slice(0, 5);
  const playContents = getPlayContents();
  const localizedTools = getLocalizedTools(contentLocale);
  const operationTools = operationalToolSlugs
    .map((slug) => localizedTools.find((tool) => tool.slug === slug))
    .filter(Boolean);
  const workflowCards = operationWorkflows.map((workflow) => ({
    ...workflow,
    tools: workflow.toolSlugs.map((slug) => localizedTools.find((tool) => tool.slug === slug)).filter(Boolean),
  }));
  const initialQuery = readSearchQuery(await searchParams);

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <Badge>Web operations</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              URL과 사이트맵, 헤더를 한 번에 점검하는 웹 운영 워크벤치
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              개발자가 이미 DevTools와 터미널로 할 수 있는 단일 기능을 다시 포장하지 않습니다. 배포 직후 실제로 확인해야 하는 redirect chain, DNS,
              canonical, robots, sitemap, 보안 헤더, JWT/API 응답을 한 흐름으로 묶고, 결과를 복사 가능한 점검 기록처럼 남깁니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tools/http-status-checker"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
              >
                URL 점검 시작 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tools/sitemap-generator"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                sitemap 점검
              </Link>
            </div>
          </div>
          <form action="/tools/http-status-checker" className="rounded-lg border bg-background p-4 shadow-sm" data-home-url-check>
            <div className="flex items-center gap-2">
              <SearchCheck className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">공개 URL 바로 점검</p>
            </div>
            <label className="mt-4 block space-y-2">
              <span className="text-xs font-medium text-muted-foreground">검사할 공개 URL</span>
              <Input name="url" type="url" inputMode="url" placeholder="https://www.bobob.app/" aria-label="검사할 공개 URL" />
            </label>
            <Button type="submit" className="mt-3 w-full">
              URL 상태 확인 <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="mt-4 space-y-2 border-t pt-3 text-xs leading-5 text-muted-foreground">
              <p>status, redirect chain, 최종 응답 header, CSP 점검으로 먼저 들어갑니다.</p>
              <p>다음 단계는 DNS, sitemap, robots, canonical/meta 점검으로 이어집니다.</p>
            </div>
          </form>
        </div>
      </section>

      <section className="border-b" data-ops-workflows>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Operational workflows</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">DevTools 밖에서 남기는 점검 흐름</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                단일 변환 도구가 아니라 배포, 검색 노출, API 확인 때 실제로 같이 보게 되는 도구들을 순서 있는 작업으로 묶었습니다.
              </p>
            </div>
            <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              도구 전체 보기
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {workflowCards.map((workflow, index) => (
              <Link key={workflow.label} href={workflow.href} className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{workflow.label}</Badge>
                  {index === 0 ? (
                    <Network className="h-4 w-4 text-muted-foreground" />
                  ) : index === 1 ? (
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{workflow.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{workflow.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {workflow.tools.map((tool) =>
                    tool ? (
                      <Badge key={tool.slug}>{tool.shortTitle}</Badge>
                    ) : null,
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b" data-pillar-blog>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Operating notes</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">운영 판단을 남긴 글</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Blog는 버리지 않습니다. 다만 첫 화면의 목적은 점검 도구이고, 글은 색인, 정적 운영, 제품 판단을 설명하는 근거로 이어집니다.
              </p>
            </div>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              운영 글 전체
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {pillarPosts.map((post) => (
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
                  <CardContent className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                    <Newspaper className="h-4 w-4" />
                    {post.date}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b" data-featured-play>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured Play</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">체류 실험으로 살려두는 Play</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                점검 도구만으로 끝내지 않고, 짧게 눌러볼 수 있는 Play를 남겨 사이트의 손맛과 체류 실험을 계속 확인합니다.
              </p>
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
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">최근 운영 기록과 개발 메모</h2>
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
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Workbench tools</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal">점검에 바로 쓰는 도구</h2>
            <p className="mt-1 text-sm text-muted-foreground">URL 상태, DNS, sitemap, robots, meta, JWT/API 응답을 확인하는 대표 도구입니다.</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            도구 전체 보기
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {operationTools.map((tool) =>
              tool ? (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-md border bg-background p-3 transition-colors hover:bg-muted">
                  <p className="text-sm font-semibold">{tool.shortTitle}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
                </Link>
              ) : null,
            )}
          </div>
          <div className="rounded-lg border bg-card p-3">
            <ToolSearchPanel locale={contentLocale} dictionary={dictionary} initialQuery={initialQuery} />
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-muted-foreground">
          <span>bobob.app web operations + Blog + Play</span>
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
              Tools
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
