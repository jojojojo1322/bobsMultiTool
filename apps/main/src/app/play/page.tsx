import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { playIndexKeywords } from "@/features/content/discovery";
import { getPlayContents } from "@/features/content/play";
import { playIndexStructuredData } from "@/features/content/structured-data";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

const playContentsForMetadata = getPlayContents();
const playShareTitle = "바로 눌러보는 작은 게임";
const playShareImage = openGraphImage({ kind: "play", title: playShareTitle });

export const metadata: Metadata = {
  title: "Play - bobob.app",
  description: "카드 하나 골라 바로 해보는 bobob.app의 작은 웹게임 목록입니다. 마우스와 키보드로 짧게 한 판 하고 결과를 봅니다.",
  keywords: playIndexKeywords(playContentsForMetadata),
  alternates: {
    canonical: "https://www.bobob.app/play",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/play",
    siteName: "bobob.app",
    title: "Play - bobob.app",
    description: "긴 설명보다 바로 한 판 해보는 작은 웹게임 목록입니다. 별로면 닫고, 괜찮으면 한 번 더 하면 됩니다.",
    images: [playShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play - bobob.app",
    description: "카드 하나 골라 바로 해보는 작은 게임 목록입니다. 마우스와 키보드로 짧게 한 판씩 해봅니다.",
    images: [shareImageUrl({ kind: "play", title: playShareTitle })],
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
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">바로 눌러보는 작은 게임</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            긴 설명은 빼고 카드 하나 골라 한 판 해보면 됩니다. 마우스나 키보드로 움직이고, 별로면 그냥 닫아도 됩니다.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid gap-4 rounded-md border bg-muted/20 p-4 text-sm leading-7 text-muted-foreground md:grid-cols-3" data-play-format-note>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">조작 먼저</h2>
            <p className="mt-2">
              클릭하거나 방향키로 움직이는 게임을 늘리는 중입니다. 읽는 것보다 손이 먼저 가는 쪽이 좋습니다.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">한 판 짧게</h2>
            <p className="mt-2">
              대부분 1~3분 안에 끝납니다. 점수 보고 다시 할지 말지 고르면 됩니다. 오래 붙잡는 게임은 아닙니다.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">괜찮은 것만 남김</h2>
            <p className="mt-2">
              재미없으면 고치거나 뺍니다. 손이 가는 게임만 더 만들 생각입니다. 아직은 실험장에 가깝습니다.
            </p>
          </div>
        </div>
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
                  <Badge>
                    {content.type === "micro-sim"
                      ? `${content.turns.length}턴`
                      : content.type === "tap-game"
                        ? `${content.targets.length}개 판단`
                        : content.type === "arcade-game"
                          ? `${content.arcade.rounds}번 조작`
                          : `${content.items.length}개 분류`}
                  </Badge>
                  <Badge>{content.type === "arcade-game" ? "아케이드 게임" : content.type === "tap-game" ? "탭 게임" : content.type === "sort-match-game" ? "분류 게임" : "짧은 시뮬레이션"}</Badge>
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
