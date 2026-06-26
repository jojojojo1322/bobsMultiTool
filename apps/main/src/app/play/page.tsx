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
const playShareTitle = "심심하면 한 판";
const playShareImage = openGraphImage({ kind: "play", title: playShareTitle });

export const metadata: Metadata = {
  title: "Play - bobob.app",
  description: "카드 하나 골라 바로 시작하는 bobob.app의 웹게임 목록입니다. 마우스로 쓸고, 방향키로 움직이고, 짧게 점수와 결과를 봅니다.",
  keywords: playIndexKeywords(playContentsForMetadata),
  alternates: {
    canonical: "https://www.bobob.app/play",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/play",
    siteName: "bobob.app",
    title: "Play - bobob.app",
    description: "카드 하나 골라 바로 시작합니다. 마우스로 쓸고, 방향키로 움직이고, 끝나면 점수와 짧은 결과를 봅니다.",
    images: [playShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play - bobob.app",
    description: "카드 하나 골라 바로 시작합니다. 마우스와 키보드로 짧게 한 판씩 합니다.",
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
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">심심하면 한 판</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            카드 하나 누르면 바로 시작합니다. 마우스로 쓸고, 방향키로 움직이고, 한 판이 끝나면 점수와 짧은 결과만 확인합니다.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid gap-4 rounded-md border bg-muted/20 p-4 text-sm leading-7 text-muted-foreground md:grid-cols-3" data-play-format-note>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">누르면 바로</h2>
            <p className="mt-2">
              대부분 첫 화면에서 규칙을 확인하고 곧바로 시작합니다.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">손으로 하기</h2>
            <p className="mt-2">
              마우스로 쓸거나 키보드로 움직입니다. 읽는 것보다 손이 먼저 가는 쪽입니다.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">점수만 보기</h2>
            <p className="mt-2">
              끝나면 점수와 한 줄 결과만 봅니다. 성향 분석이나 가입 단계는 없습니다.
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
                          ? "바로 플레이"
                          : `${content.items.length}개 분류`}
                  </Badge>
                  <Badge>{content.type === "arcade-game" ? "손으로 하는 게임" : content.type === "tap-game" ? "누르는 게임" : content.type === "sort-match-game" ? "분류 게임" : "짧은 선택"}</Badge>
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
