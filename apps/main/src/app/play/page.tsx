import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getPlayContents } from "@/features/content/play";
import { playIndexStructuredData } from "@/features/content/structured-data";

export const metadata: Metadata = {
  title: "Play - bobob.app",
  description: "클릭, 분류, 짧은 선택으로 바로 끝나는 bobob.app의 가벼운 웹 게임과 실험 목록입니다.",
  alternates: {
    canonical: "https://www.bobob.app/play",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/play",
    siteName: "bobob.app",
    title: "Play - bobob.app",
    description: "바로 클릭하고 결과를 공유하는 가벼운 웹 게임과 실험 목록.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play - bobob.app",
    description: "바로 클릭하고 결과를 공유하는 Play 콘텐츠 목록.",
  },
};

export default function PlayIndexPage() {
  const dictionary = getClientDictionary(contentLocale);
  const playContents = getPlayContents();
  const jsonLd = playIndexStructuredData(playContents);

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Play</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">플래시게임처럼 가볍게 시작하는 Play</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            단일 규칙, 단일 조작, 짧은 결과를 기준으로 클릭 게임과 분류 게임, 짧은 시뮬레이터를 실험합니다.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {playContents.map((content) => (
            <Link key={content.slug} href={`/play/${content.slug}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <Gamepad2 className="mb-3 h-5 w-5 text-muted-foreground" />
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>{content.durationLabel}</Badge>
                  <Badge>{content.type === "micro-sim" ? `${content.turns.length}턴` : content.type === "tap-game" ? `${content.targets.length}개 판단` : `${content.items.length}개 분류`}</Badge>
                  <Badge>{content.type === "tap-game" ? "탭 게임" : content.type === "sort-match-game" ? "분류 게임" : "짧은 시뮬레이션"}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
const contentLocale = "ko";
