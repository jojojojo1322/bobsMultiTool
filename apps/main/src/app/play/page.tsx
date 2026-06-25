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
const playShareTitle = "규칙 하나만 보고 바로 눌러보는 작은 Play";
const playShareImage = openGraphImage({ kind: "play", title: playShareTitle });

export const metadata: Metadata = {
  title: "Play - bobob.app",
  description: "규칙 하나만 보고 바로 눌러보는 bobob.app의 작은 웹 놀이 목록입니다. 30초에서 3분 사이에 끝나는 정적 Play를 모읍니다.",
  keywords: playIndexKeywords(playContentsForMetadata),
  alternates: {
    canonical: "https://www.bobob.app/play",
  },
  openGraph: {
    type: "website",
    url: "https://www.bobob.app/play",
    siteName: "bobob.app",
    title: "Play - bobob.app",
    description: "대단하진 않아도 바로 눌러보고 결과를 보는 작은 웹 놀이 목록입니다. 짧은 규칙과 한 가지 조작으로 끝납니다.",
    images: [playShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play - bobob.app",
    description: "규칙 하나, 조작 하나, 결과 하나로 끝나는 Play 목록입니다. 모바일에서도 바로 해볼 수 있게 작게 만들었습니다.",
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
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">일단 눌러보면 감이 오는 작은 Play</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            설명서를 길게 읽는 게임은 지금 안 만듭니다. 한 가지 규칙만 보고, 엄지로 눌러보고, 결과 보고 “아... 이 느낌이네” 하면 충분합니다.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid gap-4 rounded-md border bg-muted/20 p-4 text-sm leading-7 text-muted-foreground md:grid-cols-3" data-play-format-note>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">가볍게 만든다</h2>
            <p className="mt-2">
              여기 있는 Play는 큰 게임이 아닙니다. 예전 플래시게임처럼 바로 들어가서 한 번 눌러보고, 별로면 바로 닫아도 되는 정도의 작은 웹 놀이를 목표로 둡니다.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">설명을 줄인다</h2>
            <p className="mt-2">
              규칙은 하나만 먼저 보이게 둡니다. 선택하거나, 누르거나, 분류하고 결과를 보는 흐름이면 충분합니다. 긴 튜토리얼보다 첫 반응이 더 중요하다고 봅니다.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-normal text-foreground">계속 바꿔본다</h2>
            <p className="mt-2">
              반응이 있으면 비슷한 실험을 더 만들고, 재미없으면 과감하게 접습니다. 완성된 서비스라기보다 “뭐라도 해보는” 쪽에 가까운 목록입니다. 그래서 결과도 너무
              심각하게 만들지 않고, 다음에 다시 눌러볼 여지만 남겨둡니다.
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
