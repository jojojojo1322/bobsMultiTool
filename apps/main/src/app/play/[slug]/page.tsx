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
    title: "한 장 로그를 보고 다음 장으로 넘기는 복권 판",
    firstLook: "현재 단계, 9칸 복권지, 이번 장 결과 로그가 어디에 남는지 먼저 봅니다.",
    firstMove: "첫 움직임은 긁기입니다. 한 장을 다 보면 당첨 여부보다 결과 로그와 다음 단계를 먼저 읽습니다.",
    pacingText: "이 판은 끝나는 점수판이 아니라 계속 이어지는 복권 장부입니다. 더 긁고 싶으면 다음 장으로 가고, 멈추고 싶으면 그 자리에서 멈춥니다.",
    recordText: "현재 공개 버전은 실제 돈, 결제, 현금화가 없습니다. 기록은 단계와 로그만 남기고 손실 만회 문구로 밀어붙이지 않습니다.",
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
    title: "통풍구와 배선을 먼저 보는 고도 조절 판",
    firstLook: "점검 드론, 다음 통풍구 높이선, 피할 배선 벽, 누름 상태를 먼저 봅니다.",
    firstMove: "첫 움직임은 길게 누르기가 아니라 짧게 눌렀다 떼기입니다. 통풍구 높이선을 보고 리듬을 맞춥니다.",
    pacingText: "한 판은 1분 서버실 통풍구 비행으로 갑니다. 결과는 점수보다 누르고 떼는 리듬과 빈틈 통과로 남습니다.",
    recordText: "기록은 다음 통풍구 높이선을 더 빨리 읽기 위한 흔적입니다. 팬 바람을 과하게 타지 않고 배선을 피하는 감각만 남기면 됩니다.",
  },
  "brick-breaker": {
    title: "버그 벽돌보다 공 착지선을 먼저 보는 판",
    firstLook: "공이 내려올 자리, 패치 패들 위치, 꼭 깨야 할 버그 벽돌을 먼저 봅니다.",
    firstMove: "첫 움직임은 패치 패들 이동입니다. 벽돌을 직접 쫓지 말고 공이 돌아올 자리를 잡습니다.",
    pacingText: "한 판은 짧은 버그 벽돌깨기 흐름입니다. 결과는 깬 수보다 착지 예측과 받은 위치로 남습니다.",
    recordText: "기록은 다음 반사 각도를 떠올리기 위한 흔적입니다. 공을 놓쳤다면 패치 자리를 먼저 잡는 쪽으로 다시 봅니다.",
  },
  snake: {
    title: "몸통이 막기 전에 골목을 남기는 스네이크 판",
    firstLook: "초록 머리, 몸통, 사과, 노란 다음 칸 예고를 먼저 봅니다.",
    firstMove: "첫 움직임은 방향 전환입니다. 사과만 따라가지 말고 바로 앞 칸이 벽인지 몸통인지 보고 꺾습니다.",
    pacingText: "한 판은 1분 골목 판단으로 갑니다. 결과는 먹은 사과보다 막힌 길과 살아난 회전 공간으로 남습니다.",
    recordText: "기록은 다음 판에서 더 일찍 꺾을 위치를 찾기 위한 단서입니다. 몸통에 막혔다면 직선으로 달린 순간을 봅니다.",
  },
  password: {
    title: "힌트로 후보를 줄이는 금고 판",
    firstLook: "세 자리 입력칸, 지난 힌트, 살아 있는 후보 숫자를 먼저 봅니다.",
    firstMove: "첫 움직임은 찍기가 아니라 실험입니다. 자리와 숫자 힌트를 겹쳐 다음 후보를 좁힙니다.",
    pacingText: "한 판은 1분 추론으로 갑니다. 결과는 맞힌 운보다 후보가 얼마나 줄었는지로 남습니다.",
    recordText: "기록은 틀린 번호를 버리는 자료입니다. 막히면 추천 후보를 답이 아니라 다음 실험으로 봅니다.",
  },
  crossing: {
    title: "위로 달리기보다 빈 차선을 기다리는 횡단 판",
    firstLook: "노란 표식, 바로 앞 차선, 초록/노랑/빨강 다음 칸, 위쪽 릴리스선을 먼저 봅니다.",
    firstMove: "첫 움직임은 전진보다 판단입니다. 다음 칸이 위험하면 멈추고, 빈 차선이 열리면 한 칸 건넙니다.",
    pacingText: "한 판은 1분 배포 횡단입니다. 결과는 빨리 간 정도보다 기다린 타이밍과 빈칸 판단으로 남습니다.",
    recordText: "기록은 다음 차선을 더 차분히 읽기 위한 흔적입니다. 부딪혔다면 전진보다 대기를 먼저 봅니다.",
  },
  minesweeper: {
    title: "숫자와 깃발 수를 맞추는 작은 지뢰찾기 판",
    firstLook: "열린 숫자, 깃발 칸, 아직 닫힌 주변 칸을 먼저 봅니다.",
    firstMove: "첫 움직임은 안전해 보이는 칸 열기입니다. 위험해 보이면 깃발로 미뤄둡니다.",
    pacingText: "한 판은 1분 지뢰찾기입니다. 결과는 많이 연 칸보다 숫자와 깃발 수를 맞춘 판단으로 남습니다.",
    recordText: "기록은 다음 깃발 위치를 조정하기 위한 흔적입니다. 터졌다면 바로 누른 이유를 다시 봅니다.",
  },
  mole: {
    title: "긴급 알림과 소음 알림을 나누는 두더지판",
    firstLook: "긴급 알림, 소음 알림, 잡기/두기 배지, 남은 시간 링을 먼저 봅니다.",
    firstMove: "첫 움직임은 잡기입니다. 소음 알림은 일부러 보내고 긴급 알림만 누릅니다.",
    pacingText: "한 판은 1분 알림 정리입니다. 결과는 많이 친 수보다 지금 볼 것만 골랐는지로 남습니다.",
    recordText: "기록은 다음 알림 기준을 줄이기 위한 흔적입니다. 전부 잡으려 했다면 손을 늦추는 쪽으로 다시 봅니다.",
  },
  stacker: {
    title: "손 위치선과 남을 폭을 보는 쌓기 판",
    firstLook: "움직이는 블록, 아래층, 정렬권, 잘릴 폭을 먼저 봅니다.",
    firstMove: "첫 움직임은 멈추기입니다. 가운데를 보고 남을 폭이 넓을 때만 쌓습니다.",
    pacingText: "한 판은 짧은 타이밍 쌓기입니다. 결과는 층수보다 정렬권과 잘린 폭으로 남습니다.",
    recordText: "기록은 다음 멈춤 타이밍을 잡기 위한 흔적입니다. 무너졌다면 손이 먼저 나간 순간을 다시 봅니다.",
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
      "bug-clicker": {
        title: "버그 단서와 소문을 나누는 방패 판",
        firstLook: "위에서 내려오는 버그 신호 카드, 표식이 붙은 단서, 하단 방패선, 소문 라벨을 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 방패선 조준입니다. 눈에 띄는 소문까지 다 막지 말고 재현 단서에만 선을 맞춥니다.",
        pacingText: "한 판은 1분 버그 단서 방패막기입니다. 결과는 발사량보다 단서와 소문을 나눈 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 트리아지 메모입니다. 소문에 흔들렸다면 다음 판에서는 방패를 더 늦게 움직입니다.",
      },
      "bug-bubble-shooter": {
        title: "버그 단서 버블과 소문 버블을 나누는 조준판",
        firstLook: "재현, 증거, 로그처럼 표식이 붙은 버그 단서 버블, 흐릿한 소문 버블, 하단 디버그 발사대를 먼저 봅니다.",
        firstMove: "첫 움직임은 조준선 맞추기입니다. 보이는 버블을 전부 터뜨리지 말고 단서 표식이 붙은 버블에만 선을 맞춥니다.",
        pacingText: "한 판은 1분 버그 버블 판별입니다. 결과는 발사량보다 단서와 소문을 나눈 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 트리아지 메모입니다. 소문 버블에 흔들렸다면 다음 판에서는 조준선을 더 늦게 옮깁니다.",
      },
      "deploy-10-box": {
        title: "숫자 마감표를 10으로 묶어 상자를 닫는 판",
        firstLook: "마감표 숫자, 현재 합계, 노란 10 후보, 넘친 새 일 경고를 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 많이 담기보다 지금 닫을 수 있는 마감표 묶음부터 쓸어냅니다.",
        pacingText: "한 판은 1분 마감 정리입니다. 결과는 점수 경쟁보다 상자를 닫은 묶음과 넘친 새 일 기록으로 남습니다.",
        recordText: "기록은 다음 묶음을 더 차분히 닫기 위한 마감 메모입니다. 넘쳤다면 새 일을 더 담으려던 순간을 다시 봅니다.",
      },
      "deploy-invaders": {
        title: "표식 침입자와 미끼 경고를 나누는 배포 게이트",
        firstLook: "위에서 내려오는 침입자 줄, 표식이 붙은 목표, 하단 방어포, 방어선까지 남은 거리를 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 방어포 조준입니다. 미끼 경고를 따라가지 말고 표식 침입자에만 선을 맞춥니다.",
        pacingText: "한 판은 1분 배포 게이트 방어입니다. 결과는 발사량보다 표식 침입자를 골라 차단한 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 방어선 메모입니다. 미끼에 흔들렸다면 다음 판에서는 방어포를 더 늦게 움직입니다.",
      },
      "deploy-missile-defense": {
        title: "충돌점이 가까운 미사일부터 막는 옥상 방어 판",
        firstLook: "위에서 내려오는 미사일 궤적, 하단 도시 방어선, 조준점, 방어선까지 남은 거리를 먼저 봅니다.",
        firstMove: "첫 움직임은 옥상 요격포 조준입니다. 화면 위의 먼 미사일보다 방어선 가까운 충돌점에 선을 맞춥니다.",
        pacingText: "한 판은 1분 옥상 미사일 방어입니다. 결과는 발사량보다 도시 방어선에 닿을 표적을 먼저 지운 흐름으로 남습니다.",
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
