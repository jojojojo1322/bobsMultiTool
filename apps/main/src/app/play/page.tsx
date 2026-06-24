import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getPlayContents } from "@/features/content/play";

export const metadata: Metadata = {
  title: "Play - bobob.app",
  description: "미니게임, 성향 테스트, 밸런스 게임, 퀴즈를 빠르게 실험하는 bobob.app Play 콘텐츠 목록입니다.",
  alternates: {
    canonical: "https://www.bobob.app/play",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/play",
    siteName: "bobob.app",
    title: "Play - bobob.app",
    description: "직접 클릭하고 결과를 공유하는 bobob.app Play 콘텐츠 목록.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play - bobob.app",
    description: "직접 클릭하고 결과를 공유하는 Play 콘텐츠 목록.",
  },
};

export default function PlayIndexPage() {
  const dictionary = getClientDictionary(contentLocale);
  const playContents = getPlayContents();

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Play</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">바로 클릭하고 결과를 공유하는 콘텐츠</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            생존 시뮬레이터, 성향 테스트, 밸런스 게임, 퀴즈를 같은 데이터 구조로 빠르게 실험합니다.
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
                  <Badge>{content.turns.length}턴</Badge>
                  <Badge>{content.endings.length}엔딩</Badge>
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
