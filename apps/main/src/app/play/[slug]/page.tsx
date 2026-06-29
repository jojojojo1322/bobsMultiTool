import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPostBySlug } from "@/features/content/blog";
import { playContentKeywords } from "@/features/content/discovery";
import { getPlayContentBySlug, getPlayContents } from "@/features/content/play";
import { playDetailStructuredData } from "@/features/content/structured-data";
import { SurvivalPlayEngine } from "@/features/play/survival-engine";
import { TapGameEngine } from "@/features/play/tap-game-engine";
import { SortMatchEngine } from "@/features/play/sort-match-engine";
import { ArcadeGameEngine } from "@/features/play/arcade-game-engine";
import type { ArcadeGameContent, PlayContent } from "@/features/content/types";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPlayContents().map((content) => ({ slug: content.slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getPlayContentBySlug(slug);
  if (!content) return {};
  const url = `https://www.bobob.app/play/${content.slug}`;
  const image = openGraphImage({ kind: "play", title: content.title });
  const relatedBlogs = content.relatedBlogSlugs.flatMap((blogSlug) => {
    const post = getBlogPostBySlug(blogSlug);
    return post ? [post] : [];
  });

  return {
    title: `${content.title} - bobob.app Play`,
    description: content.description,
    keywords: playContentKeywords(content, relatedBlogs),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "bobob.app",
      title: `${content.title} - bobob.app Play`,
      description: content.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.title} - bobob.app Play`,
      description: content.description,
      images: [shareImageUrl({ kind: "play", title: content.title })],
    },
  };
}

export default async function PlayDetailPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const content = getPlayContentBySlug(slug);
  if (!content) notFound();
  const dictionary = getClientDictionary(contentLocale);
  const relatedBlogs = content.relatedBlogSlugs.flatMap((blogSlug) => {
    const post = getBlogPostBySlug(blogSlug);
    return post ? [post] : [];
  });
  const relatedBlogLinks = content.relatedBlogSlugs.flatMap((blogSlug) => {
    const post = getBlogPostBySlug(blogSlug);
    return post ? [{ slug: post.slug, title: post.title, description: post.description }] : [];
  });
  const relatedPlayLinks = content.relatedPlaySlugs.flatMap((playSlug) => {
    const play = getPlayContentBySlug(playSlug);
    return play ? [{ slug: play.slug, title: play.title, description: play.description }] : [];
  });
  const jsonLd = playDetailStructuredData({ content, relatedBlogs });
  const detailMaxWidth =
    content.type === "arcade-game" && content.arcade.variant === "growth"
      ? "max-w-[1500px]"
      : content.type === "arcade-game"
        ? "max-w-7xl"
        : "max-w-6xl";
  const detailSpacingClassName =
    content.type === "arcade-game" && content.arcade.variant === "growth"
      ? "px-2 py-5 sm:px-4 sm:py-8"
      : "px-4 py-8";

  return (
    <main
      className="min-h-screen bg-background"
      lang={contentLocale}
      dir={dictionary.dir}
      data-play-mode={content.planningBrief.gameMode}
      data-play-visual-metaphor={content.planningBrief.initialVisualDirection.metaphor}
      data-play-primary-surface={content.planningBrief.initialVisualDirection.primarySurface}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-2">
            <Badge>Play</Badge>
            <Badge>{content.durationLabel}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">{content.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{content.description}</p>
        </div>
      </section>
      <section className={`mx-auto ${detailMaxWidth} ${detailSpacingClassName}`}>
        {content.type === "micro-sim" ? (
          <SurvivalPlayEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : content.type === "tap-game" ? (
          <TapGameEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : content.type === "arcade-game" ? (
          <ArcadeGameEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : (
          <SortMatchEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        )}
        <PlayContext content={content} relatedBlogLinks={relatedBlogLinks} />
      </section>
    </main>
  );
}
const contentLocale = "ko";

type PlayContextGuide = {
  kicker: string;
  title: string;
  firstLook: string;
  firstMove: string;
  pacingText: string;
  recordText: string;
};

const arcadeContextGuides = {
  runner: {
    title: "빈틈과 장애물을 먼저 보는 달리기 판",
    firstLook: "출발하자마자 다음 빈틈, 장애물 높이, 착지 지점을 먼저 봅니다.",
    firstMove: "첫 움직임은 점프입니다. 빨리 누르기보다 지나갈 틈이 열릴 때만 누릅니다.",
    pacingText: "한 판은 짧은 시간 달리고 끝납니다. 결과는 오래 버틴 시간보다 장애물을 읽은 흐름으로 남습니다.",
    recordText: "기록은 다음 점프 위치를 떠올리게 하는 흔적입니다. 더 달리고 싶으면 바로 다시 시작하고, 감이 안 오면 다른 카드로 넘어가도 됩니다.",
  },
  shooter: {
    title: "표적과 소음을 나누는 방어 판",
    firstLook: "표적 표시가 붙은 것, 그냥 흘려보낼 소음, 방어선까지 남은 거리를 먼저 봅니다.",
    firstMove: "첫 움직임은 조준입니다. 보이는 것을 전부 쏘지 말고 맞출 표적에만 선을 맞춥니다.",
    pacingText: "한 판은 1분 안팎으로 갑니다. 결과는 발사량보다 진짜 신호와 소음을 나눈 흐름으로 남습니다.",
    recordText: "기록은 공격력 표가 아니라 방어 흐름입니다. 표적을 잘 골랐으면 한 번 더, 소음에 흔들렸으면 다른 판으로 쉬어가도 됩니다.",
  },
  conveyor: {
    title: "잡을 것과 보낼 것을 나누는 흐름 판",
    firstLook: "지금 지나가는 항목의 라벨과 놓치면 안 되는 신호를 먼저 봅니다.",
    firstMove: "첫 움직임은 붙잡기나 넘기기입니다. 전부 처리하지 않고 기준에 맞는 것만 고릅니다.",
    pacingText: "한 판은 짧게 흐르고 끝납니다. 결과는 처리량보다 기준을 지킨 흐름으로 남습니다.",
    recordText: "기록은 다음 분류 기준을 조정하기 위한 메모입니다. 애매하면 다시 해보고, 기준이 잡히면 다음 카드로 넘어가도 됩니다.",
  },
  "sum-box": {
    title: "합 10 후보를 묶는 퍼즐 판",
    firstLook: "숫자 조각, 현재 합계, 바로 닫을 수 있는 10 후보를 먼저 봅니다.",
    firstMove: "첫 움직임은 드래그입니다. 두 개만 보지 말고 세 개 이상 묶을 수 있는 길도 봅니다.",
    pacingText: "한 판은 1분 동안 갑니다. 결과는 점수 경쟁보다 합 10 후보를 얼마나 빨리 읽었는지로 남습니다.",
    recordText: "기록은 다음 묶음을 더 빨리 찾기 위한 흔적입니다. 손이 급해졌다면 한 판 쉬고, 후보가 보이면 바로 다시 해도 됩니다.",
  },
  lottery: {
    title: "은박 9칸을 긁고 결과 전표를 보는 복권 판",
    firstLook: "현재 장 이름, 은박 9칸 복권지, 결과 전표가 어디에 남는지 먼저 봅니다.",
    firstMove: "첫 움직임은 긁기입니다. 한 장을 다 보면 바로 다음 장보다 같은 그림 줄, 즉석 표식, 결과 전표를 먼저 읽습니다.",
    pacingText: "이 판은 끝나는 순위판이 아니라 계속 이어지는 은박 복권지입니다. 더 긁고 싶으면 다음 장으로 가고, 멈추고 싶으면 그 자리에서 멈춥니다.",
    recordText: "현재 공개 버전은 실제 돈, 결제, 현금화가 없습니다. 기록은 한 장의 전표와 로그만 남기고 손실 만회 문구로 밀어붙이지 않습니다.",
  },
  "lottery-economy": {
    title: "지갑과 빚을 같이 보는 복권 장부",
    firstLook: "지갑, 빚, 10금화/25금화/55금화 복권의 손실률을 먼저 봅니다.",
    firstMove: "첫 움직임은 10금화 복권을 사서 은박을 긁는 것입니다. 결과가 열리면 바로 다음 장보다 지갑과 빚을 먼저 봅니다.",
    pacingText: "복권은 한 장씩 갑니다. 손실이 커지면 10금화로 낮아지고, 부족하면 한 번만 재기할 수 있습니다.",
    recordText: "실제 돈, 결제, 현금화는 없습니다. 기록은 당첨 자랑보다 비용, 지급, 빚, 멈춤 선택을 남깁니다.",
  },
  "match-three": {
    title: "문장 조각 역할을 맞추는 판",
    firstLook: "목적, 맥락, 제약 같은 조각 라벨과 점선 힌트를 먼저 봅니다.",
    firstMove: "첫 움직임은 옆 칸 교환입니다. 눈에 띄는 조각보다 같은 역할 셋이 되는 한 수를 고릅니다.",
    pacingText: "한 판은 짧게 이어집니다. 결과는 큰 연출보다 다음 한 수를 읽은 흔적으로 남습니다.",
    recordText: "기록은 초안 조각 흐름을 다시 보기 위한 메모입니다. 막히면 힌트를 보고 바로 다른 한 수를 시도합니다.",
  },
  memory: {
    title: "배포 램프 순서를 남기는 기억 콘솔",
    firstLook: "처음 켜진 배포 램프, 이어지는 순서, 다시 보기 버튼을 먼저 봅니다.",
    firstMove: "첫 움직임은 입력이 아니라 보기입니다. 램프 순서가 끝난 뒤 같은 순서로 누릅니다.",
    pacingText: "한 판은 짧은 배포 순서를 조금씩 늘리며 갑니다. 결과는 점수보다 기억 길이와 첫 실수 위치로 남습니다.",
    recordText: "기록은 다음에 어떤 램프에서 흔들렸는지 알려주는 콘솔 로그입니다. 헷갈리면 다시 보기를 먼저 누릅니다.",
  },
  flight: {
    title: "파란 환풍구와 붉은 케이블을 먼저 보는 원버튼 비행판",
    firstLook: "점검 드론, 오른쪽에서 오는 파란 환풍구 틈, 붉은 케이블 뭉치, 누름/뗌 큐를 먼저 봅니다.",
    firstMove: "첫 움직임은 계속 누르기가 아니라 짧게 눌러 띄우고 손을 떼어 가라앉히는 것입니다. 환풍구 앞에서 높이를 맞춥니다.",
    pacingText: "한 판은 1분 환풍 덕트 비행으로 갑니다. 결과는 점수보다 누르고 떼는 길이와 환풍구 통과로 남습니다.",
    recordText: "기록은 다음 환풍구 높이선을 더 빨리 읽기 위한 흔적입니다. 팬 바람을 과하게 타지 않고 붉은 케이블을 피하는 감각만 남기면 됩니다.",
  },
  "brick-breaker": {
    title: "버그 벽돌보다 공 착지선을 먼저 보는 판",
    firstLook: "공이 내려올 자리, 패치 패들 위치, 꼭 깨야 할 버그 벽돌을 먼저 봅니다.",
    firstMove: "첫 움직임은 패치 패들 이동입니다. 벽돌을 직접 쫓지 말고 공이 돌아올 자리를 잡습니다.",
    pacingText: "한 판은 짧은 버그 벽돌깨기 흐름입니다. 결과는 깬 수보다 착지 예측과 받은 위치로 남습니다.",
    recordText: "기록은 다음 반사 각도를 떠올리기 위한 흔적입니다. 공을 놓쳤다면 패치 자리를 먼저 잡는 쪽으로 다시 봅니다.",
  },
  snake: {
    title: "꼬리가 막기 전에 회전 공간을 남기는 릴리스 큐",
    firstLook: "큐 머리, 꼬리, 릴리스 조각, 노란 다음 칸 예고를 먼저 봅니다.",
    firstMove: "첫 움직임은 방향 전환입니다. 조각만 따라가지 말고 바로 앞 칸이 벽인지 꼬리인지 보고 꺾습니다.",
    pacingText: "한 판은 1분 큐 경로 판단으로 갑니다. 결과는 붙인 조각보다 막힌 길과 살아난 회전 공간으로 남습니다.",
    recordText: "기록은 다음 판에서 더 일찍 꺾을 위치를 찾기 위한 단서입니다. 꼬리에 막혔다면 직선으로 달린 순간을 봅니다.",
  },
  password: {
    title: "힌트로 후보를 지우는 금고 추리판",
    firstLook: "세 자리 금고, 후보 장부, 지난 힌트, 자리별 살아 있는 숫자를 먼저 봅니다.",
    firstMove: "첫 움직임은 찍기가 아니라 실험 번호 고르기입니다. 자리와 숫자 힌트를 겹쳐 후보를 지웁니다.",
    pacingText: "한 판은 1분 추리로 갑니다. 결과는 맞힌 운보다 어떤 힌트로 후보가 줄었는지로 남습니다.",
    recordText: "기록은 틀린 번호를 버리는 자료가 아니라 다음 후보를 지우는 수사 메모입니다. 막히면 추천 후보를 답이 아니라 다음 실험으로 봅니다.",
  },
  crossing: {
    title: "위로 달리기보다 빈 차선을 기다리는 건너기 판",
    firstLook: "노란 릴리스 표식, 바로 앞 차선, 초록/노랑/빨강 다음 칸, 위쪽 도착선을 먼저 봅니다.",
    firstMove: "첫 움직임은 전진보다 판단입니다. 다음 칸이 위험하면 멈추고, 빈 차선이 열리면 한 칸 건넙니다.",
    pacingText: "한 판은 1분 차선 건너기입니다. 결과는 빨리 간 정도보다 기다린 타이밍과 빈틈 판단으로 남습니다.",
    recordText: "기록은 다음 차선을 더 차분히 읽기 위한 흔적입니다. 부딪혔다면 전진보다 대기를 먼저 봅니다.",
  },
  minesweeper: {
    title: "배포 위험 숫자와 연필 깃발을 맞추는 지도",
    firstLook: "열린 숫자, 연필 깃발, 아직 닫힌 주변 구역을 먼저 봅니다.",
    firstMove: "첫 움직임은 안전해 보이는 구역 열기입니다. 위험해 보이면 깃발로 보류합니다.",
    pacingText: "한 판은 1분 위험 지도입니다. 결과는 많이 연 구역보다 숫자와 깃발 수를 맞춘 판단으로 남습니다.",
    recordText: "기록은 다음 깃발 위치를 조정하기 위한 흔적입니다. 사고가 났다면 바로 연 이유를 다시 봅니다.",
  },
  mole: {
    title: "긴급 알림과 소음 알림을 나누는 두더지판",
    firstLook: "긴급 알림, 소음 알림, 잡기/두기 배지, 남은 시간 링을 먼저 봅니다.",
    firstMove: "첫 움직임은 잡기입니다. 소음 알림은 일부러 보내고 긴급 알림만 누릅니다.",
    pacingText: "한 판은 1분 알림 정리입니다. 결과는 많이 친 수보다 지금 볼 것만 골랐는지로 남습니다.",
    recordText: "기록은 다음 알림 기준을 줄이기 위한 흔적입니다. 전부 잡으려 했다면 손을 늦추는 쪽으로 다시 봅니다.",
  },
  stacker: {
    title: "릴리스 층과 잘릴 폭을 보는 적재판",
    firstLook: "움직이는 릴리스층, 아래 기준층, 중앙선, 잘릴 폭을 먼저 봅니다.",
    firstMove: "첫 움직임은 멈추기입니다. 중앙선에 가까워 남을 폭이 넓을 때 적재합니다.",
    pacingText: "한 판은 짧은 릴리스 적재입니다. 결과는 층수보다 정렬권과 절단된 폭으로 남습니다.",
    recordText: "기록은 다음 멈춤 타이밍을 잡기 위한 흔적입니다. 무너졌다면 손이 먼저 나간 순간과 이미 좁아진 층 폭을 다시 봅니다.",
  },
  growth: {
    title: "부품, 납품 상자, 설비 장부가 이어지는 성장판",
    firstLook: "왼쪽 제작대, 아래 납품 라인, 오른쪽 설비 장부, 열 게이지를 먼저 봅니다.",
    firstMove: "첫 움직임은 제작대입니다. 부품을 만들어 상자를 채우고, 출고 보너스로 힘이나 냉각 설비를 올립니다.",
    pacingText: "이 판은 자동으로 결과 화면으로 넘어가지 않습니다. 납품 흐름과 열 병목을 보며 같은 작업장을 계속 키웁니다.",
    recordText: "기록은 납품 흐름, 상자 진행도, 설비 선택만 남깁니다. 조작은 제작대, 설비 장부, 작업 방향처럼 화면 안 표면에서 끝납니다.",
  },
} satisfies Record<ArcadeGameContent["arcade"]["variant"], Omit<PlayContextGuide, "kicker">>;

function playContextGuide(content: PlayContent): PlayContextGuide {
  if (content.type === "arcade-game") {
    const arcadeContextGuideOverrides: Partial<Record<string, Omit<PlayContextGuide, "kicker">>> = {
      "ten-box-rush": {
        title: "숫자 사과를 쓸어 합 10길을 비우는 과일상자",
        firstLook: "과일상자 격자, 숫자 사과, 현재 합계, 노란 10길 힌트를 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 1+9 짝만 집지 말고 세 개 이상 이어지는 10길도 훑습니다.",
        pacingText: "한 판은 1분 과일상자 정리입니다. 결과는 숫자 보상보다 어떤 길을 보고 상자를 비웠는지로 남습니다.",
        recordText: "기록은 산수 점검표가 아니라 다음 10길을 더 빨리 찾기 위한 손길 메모입니다. 넘쳤다면 손을 되돌릴 지점을 다시 봅니다.",
      },
      "bug-clicker": {
        title: "버그 티켓과 소문 티켓을 나누는 접수 방패판",
        firstLook: "위에서 내려오는 종이 버그 티켓, 재현/로그/환경 라벨, 하단 접수선, 붉은 소문 티켓을 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 접수 방패 조준입니다. 눈에 띄는 느낌 티켓까지 다 받지 말고 재현 단서가 있는 티켓에만 선을 맞춥니다.",
        pacingText: "한 판은 1분 버그 접수 방어입니다. 결과는 발사량보다 접수할 티켓과 흘릴 티켓을 나눈 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 트리아지 메모입니다. 소문 티켓에 흔들렸다면 다음 판에서는 접수 방패를 더 늦게 움직입니다.",
      },
      "bug-bubble-shooter": {
        title: "하단 발사대로 단서 버블만 겨냥하는 디버그 조준판",
        firstLook: "위쪽 버그 버블판, 재현/로그/원인 표식 버블, 흐릿한 소문 버블, 하단 디버그 발사대와 바닥 경고선을 먼저 봅니다.",
        firstMove: "첫 움직임은 발사대 조준입니다. 보이는 버블을 전부 터뜨리지 말고 바닥선 가까운 단서 표식 버블에만 점선 조준선을 맞춥니다.",
        pacingText: "한 판은 1분 버그 버블 판별입니다. 결과는 발사량보다 단서 버블을 고르고 소문 버블을 흘린 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 트리아지 메모입니다. 소문 버블에 흔들렸다면 다음 판에서는 조준선을 더 늦게 옮기고 표식부터 읽습니다.",
      },
      "bug-brick-breaker": {
        title: "하단 패치 패들로 공 착지선을 보고 받는 버그벽돌판",
        firstLook: "상단 재현·로그·원인 벽돌, 중앙 공, 하단 패치 패들, 흰 착지선을 먼저 봅니다.",
        firstMove: "첫 움직임은 벽돌 선택이 아니라 패들 이동입니다. 공이 떨어질 흰 선으로 패들 중심을 먼저 맞춥니다.",
        pacingText: "한 판은 1분 패들 반사입니다. 결과는 많이 깬 정도보다 착지선을 읽고 단서 벽돌을 먼저 깬 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 패치 착지 메모입니다. 소문 벽돌을 따라가다 놓쳤다면 다음 판에서는 하단 착지선부터 봅니다.",
      },
      "deploy-10-box": {
        title: "진행중 마감표를 10묶음으로 접어 닫는 판",
        firstLook: "진행중 상자, 숫자 마감표, 현재 합계, 노란 10 후보, 넘친 새 일 경고를 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 많이 담기보다 지금 접어 닫을 수 있는 전표 묶음부터 쓸어냅니다.",
        pacingText: "한 판은 1분 마감 정리입니다. 결과는 점수 경쟁보다 진행중 상자를 비운 묶음과 넘친 새 일 기록으로 남습니다.",
        recordText: "기록은 다음 묶음을 더 차분히 닫기 위한 마감 메모입니다. 넘쳤다면 새 일을 더 담으려던 순간을 다시 봅니다.",
      },
      "prompt-sum-box": {
        title: "질문 종이 조각을 쓸어 합 10길로 지우는 판",
        firstLook: "찢은 질문 종이 조각, 굵은 합계 배지, 노란 10길 힌트, 연필 되돌림 흔적을 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 목적·맥락·제약 조각을 작은 길로 쓸고, 넘치면 지나온 조각 쪽으로 되돌립니다.",
        pacingText: "한 판은 1분 초안 정리입니다. 결과는 점수보다 어떤 질문 재료를 묶고 어떤 장황한 종이를 덜어냈는지로 남습니다.",
        recordText: "기록은 산수표가 아니라 질문 초안 메모입니다. 한 덩어리로 밀어 넘쳤다면 다음 판에서는 더 짧은 10길부터 봅니다.",
      },
      "prompt-gem-swap": {
        title: "질문 초안을 역할 칩 셋으로 정리하는 보드",
        firstLook: "목적, 맥락, 예시, 형식 종이칩과 점선 한 수, 왼쪽 초안 메모 패널을 먼저 봅니다.",
        firstMove: "첫 움직임은 옆 칸 교환입니다. 색보다 역할 라벨을 보고 같은 역할 3칸이 되는 칩만 끌어 놓습니다.",
        pacingText: "한 판은 1분 질문 초안 정리입니다. 결과는 보석 연출보다 역할칩 셋과 장황한 칩을 덜 건드린 기록으로 남습니다.",
        recordText: "기록은 다음 프롬프트를 더 또렷하게 쓰기 위한 초안 메모입니다. 막혔다면 점선 한 수를 보고 라벨부터 다시 읽습니다.",
      },
      "deploy-invaders": {
        title: "릴리스 게이트선으로 내려오는 확인 표식만 막는 방어포",
        firstLook: "위에서 내려오는 네모 침입자 줄, 확인 표식, 주황 미끼 경고, 하단 릴리스 게이트선을 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 방어포 조준입니다. 주황 미끼를 따라가지 말고 게이트선 가까운 확인 표식에만 선을 맞춥니다.",
        pacingText: "한 판은 1분 릴리스 게이트 방어입니다. 결과는 발사량보다 표식 행렬을 골라 차단한 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 게이트선 메모입니다. 미끼에 흔들렸다면 다음 판에서는 방어포를 더 늦게 움직입니다.",
      },
      "deploy-missile-defense": {
        title: "충돌점이 가까운 미사일부터 막는 도시 방어판",
        firstLook: "위에서 내려오는 미사일 궤적, 하단 도시 방어선, 조준점, 방어선까지 남은 거리를 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 요격포 조준입니다. 화면 위의 먼 미사일보다 방어선 가까운 충돌점에 선을 맞춥니다.",
        pacingText: "한 판은 1분 도시 방어선 요격입니다. 결과는 발사량보다 도시 방어선에 닿을 표적을 먼저 지운 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 방어선 메모입니다. 미끼에 흔들렸다면 다음 판에서는 하단 충돌점부터 훑습니다.",
      },
    };
    const guide = arcadeContextGuideOverrides[content.slug] ?? arcadeContextGuides[content.arcade.variant];
    return {
      kicker: "첫 5초 안내",
      ...guide,
    };
  }

  if (content.type === "tap-game") {
    if (content.slug === "ai-review-tap") {
      return {
        kicker: "첫 5초 안내",
        title: "근거 없는 AI 문장에 보류 도장을 찍는 검수판",
        firstLook: "AI 답변 전표, 근거 줄, 보류 도장, 통과 도장을 먼저 봅니다.",
        firstMove: "첫 움직임은 도장입니다. 파일·명령·출처·의존성 근거가 비면 보류, 실제 확인 근거가 있으면 통과를 찍습니다.",
        pacingText: `${content.durationLabel} 동안 빠르게 맞히기보다 근거가 있는 말과 매끈한 단정을 나눕니다.`,
        recordText: "기록은 숫자 결과보다 검수 전표에 가깝습니다. 도장을 잘못 찍었다면 다음 문장에서 무엇을 먼저 열어볼지 다시 봅니다.",
      };
    }
    if (content.slug === "indexing-waiting-room") {
      return {
        kicker: "첫 5초 안내",
        title: "지금 확인할 색인 대기표와 기다릴 행동을 나누는 체크판",
        firstLook: "색인 대기표, 확인 도장, 대기 도장, sitemap/canonical 체크줄을 먼저 봅니다.",
        firstMove: "첫 움직임은 도장입니다. 라이브 200, sitemap 읽힘, canonical, URL 검사는 확인하고 새로고침이나 재제출 충동은 대기로 넘깁니다.",
        pacingText: `${content.durationLabel} 동안 제출 보장 같은 환상을 걷어내고 지금 확인 가능한 운영 신호만 고릅니다.`,
        recordText: "기록은 검색 순위 상상이 아니라 어떤 대기표를 확인했는지 남기는 운영 메모입니다.",
      };
    }
    if (content.slug === "meeting-escape") {
      return {
        kicker: "첫 5초 안내",
        title: "회의 발언을 결정 도장과 넘김 도장으로 닫는 화이트보드",
        firstLook: "회의 발언 전표, 결정 도장, 넘김 도장, owner/deadline/next action 체크줄을 먼저 봅니다.",
        firstMove: "첫 움직임은 도장입니다. 담당자·마감·다음 행동·범위 축소가 보이면 결정, 싱크·느낌·다음 회의는 넘김입니다.",
        pacingText: `${content.durationLabel} 동안 회의를 빨리 끊는 것이 아니라 실행으로 넘어갈 발언만 골라 닫습니다.`,
        recordText: "기록은 숫자 결과보다 어떤 발언을 닫았는지 남기는 회의 화이트보드 메모입니다.",
      };
    }

    return {
      kicker: "첫 5초 안내",
      title: `${content.targetLabel}와 ${content.decoyLabel}를 가르는 판`,
      firstLook: `큰 문장 카드에서 ${content.targetLabel} 기준과 ${content.decoyLabel} 기준을 먼저 봅니다.`,
      firstMove: "첫 움직임은 판단입니다. 위험하거나 핵심이면 왼쪽 기준으로, 넘길 수 있으면 오른쪽 기준으로 누릅니다.",
      pacingText: `한 판은 ${content.durationLabel} 안에 끝납니다. 결과는 빠른 손보다 기준을 흔들리지 않고 적용한 흐름으로 남습니다.`,
      recordText: "기록은 다음 문장을 더 차분히 보기 위한 검수 메모입니다. 애매한 문장은 빨리 넘기기보다 기준을 다시 봅니다.",
    };
  }

  if (content.type === "sort-match-game") {
    if (content.slug === "prompt-cleanup") {
      return {
        kicker: "첫 5초 안내",
        title: "AI 요청서를 다섯 재료 칸으로 찢어 붙이는 작업대",
        firstLook: "현재 메모, 할 일/배경/예시/출력 형식/금지·제약 칸, 오른쪽 요청서 붙임 기록을 먼저 봅니다.",
        firstMove: "첫 움직임은 메모 붙이기입니다. 문장이 AI가 할 일인지, 배경인지, 예시인지, 답의 형식인지, 하지 말라는 제약인지 고릅니다.",
        pacingText: `${content.durationLabel} 동안 빠르게 맞히기보다 요청이 어디서 뭉쳤는지 분리합니다. 예시와 출력 형식은 금지 문구와 따로 봅니다.`,
        recordText: "기록은 결과 자랑판이 아니라 다음 프롬프트를 쓰기 위한 요청서 메모입니다. 헷갈린 문장은 한 문장에 역할이 둘 이상 섞였는지 다시 봅니다.",
      };
    }
    if (content.slug === "priority-sorter") {
      return {
        kicker: "첫 5초 안내",
        title: "지금 막는 일, 시간 잡기, WIP 밖을 가르는 병목판",
        firstLook: "현재 일감 카드, 세 칸의 기준, 그리고 오늘 판에서 빼야 할 카드를 먼저 봅니다.",
        firstMove: "첫 움직임은 바쁜 카드를 누르는 것이 아니라, 지금 흐름을 실제로 막는지 먼저 판단하는 것입니다.",
        pacingText: `${content.durationLabel} 동안 오늘 판을 가볍게 만듭니다. 결과는 맞춘 수보다 WIP를 줄인 기준이 남습니다.`,
        recordText: "기록은 다음 일감 카드를 더 차분히 보내기 위한 칸반 메모입니다. 모든 일이 중요해 보였다면 WIP 밖 칸을 먼저 봅니다.",
      };
    }
    const categoryLabels = content.categories.map((category) => category.label).join(" / ");
    return {
      kicker: "첫 5초 안내",
      title: `${categoryLabels} 기준으로 나누는 판`,
      firstLook: `현재 카드와 ${categoryLabels} 세 칸의 기준을 먼저 봅니다.`,
      firstMove: "첫 움직임은 분류입니다. 카드가 지금 막는 일인지, 시간을 잡을 일인지, 버릴 일인지 먼저 가릅니다.",
      pacingText: `한 판은 ${content.durationLabel} 정도로 짧게 갑니다. 결과는 맞춘 수보다 분류 기준이 선명해졌는지로 남습니다.`,
      recordText: "기록은 다음 카드 기준을 조정하기 위한 메모입니다. 헷갈린 카드는 모든 일이 중요해 보였는지부터 다시 봅니다.",
    };
  }

  if (content.slug === "office-survival") {
    return {
      kicker: "첫 5초 안내",
      title: "요구를 낮추고 자원을 지키는 퇴근 관제판",
      firstLook: "근무 시각, 흔들리는 자원, 체력·멘탈·업무량·신뢰 막대, 현재 전표를 먼저 봅니다.",
      firstMove: "첫 움직임은 가장 좋아 보이는 답을 고르는 것이 아니라, 요구를 낮출지 통제를 되찾을지 지원을 요청할지 판단하는 것입니다.",
      pacingText: `${content.durationLabel} 동안 하루 전표를 처리합니다. 결과는 빠른 탈출보다 어떤 자원을 방치했고 어떤 요구를 줄였는지로 남습니다.`,
      recordText: "기록은 결과 자랑판이 아니라 퇴근 기록지입니다. 업무량만 낮추려다 체력, 멘탈, 신뢰 중 무엇을 태웠는지 다음 판에서 다시 봅니다.",
    };
  }

  const statLabels = content.stats.map((stat) => stat.label).join(" / ");
  return {
    kicker: "첫 5초 안내",
    title: `${statLabels}를 조절하는 운영판`,
    firstLook: `사건 문장보다 먼저 ${statLabels} 상태줄에서 위험한 자원을 확인합니다.`,
    firstMove: "첫 움직임은 선택지 비교입니다. 좋아 보이는 답보다 어떤 자원이 오르고 내리는지 먼저 봅니다.",
    pacingText: `한 판은 ${content.durationLabel} 정도로 이어집니다. 결과는 선택 횟수가 아니라 하루 끝의 자원 상태와 엔딩으로 남습니다.`,
    recordText: "기록은 다음 선택에서 회복할 자원과 줄일 위험을 정하는 메모입니다. 한 선택이 좋았는지보다 누적 흐름을 봅니다.",
  };
}

function PlayContext({
  content,
  relatedBlogLinks,
}: {
  content: PlayContent;
  relatedBlogLinks: Array<{ slug: string; title: string; description?: string }>;
}) {
  const guide = playContextGuide(content);
  const firstBlog = relatedBlogLinks[0];
  const visual = content.planningBrief.initialVisualDirection;

  return (
    <section className="mt-6 rounded-md border bg-muted/20 p-4" data-play-context>
      <p className="text-xs font-medium text-muted-foreground">{guide.kicker}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-normal">{guide.title}</h2>
      <div className="mt-4 divide-y divide-border rounded-sm border bg-background text-sm">
        {[
          ["처음 볼 것", guide.firstLook],
          ["첫 움직임", guide.firstMove],
          ["화면 성격", `${visual.metaphor}. ${visual.primarySurface}`],
        ].map(([label, body]) => (
          <div key={label} className="grid gap-1 px-3 py-3 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-3">
            <p className="font-medium text-foreground">{label}</p>
            <p className="leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
        <p>{guide.pacingText}</p>
        <p>{guide.recordText}</p>
      </div>
      {firstBlog ? (
        <div className="mt-4 rounded-sm border bg-background p-3 text-sm">
          <p className="font-medium">이어지는 기록</p>
          <Link href={`/blog/${firstBlog.slug}`} className="mt-1 inline-flex text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {firstBlog.title}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
