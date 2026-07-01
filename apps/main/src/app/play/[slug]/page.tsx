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
    title: "은박 복권 한 장을 긁고 결과 전표를 보는 판",
    firstLook: "현재 복권지 이름, 은박 9칸, 표식표, 결과 전표가 어디에 남는지 먼저 봅니다.",
    firstMove: "첫 움직임은 긁기입니다. 한 장을 다 보면 바로 다음 장보다 같은 그림 줄, 즉석 표식, 결과 전표를 먼저 읽습니다.",
    pacingText: "이 판은 끝나는 순위판이 아니라 한 장씩 이어지는 은박 복권지입니다. 더 긁고 싶으면 다음 장으로 가고, 멈추고 싶으면 그 자리에서 멈춥니다.",
    recordText: "현재 공개 버전은 실제 돈, 결제, 현금화가 없습니다. 기록은 한 장의 결과지와 로그만 남기고 손실 만회 문구로 밀어붙이지 않습니다.",
  },
  "lottery-economy": {
    title: "금화 복권 손익장부: 지갑, 빚, 확률표를 먼저 보는 판",
    firstLook: "위쪽 지갑·빚·손익 도장, 10/25/55금화 전표, 오른쪽 확률표를 먼저 봅니다.",
    firstMove: "첫 움직임은 10금화 전표 선택, 한 장 사기, 은박 긁기입니다. 결과가 열리면 바로 다음 장보다 지갑과 빚을 먼저 봅니다.",
    pacingText: "복권은 한 장씩 갑니다. 이전 결과가 다음 장을 보장하지 않고, 손실이 커지면 10금화로 낮아지며 부족하면 재기자금은 한 번만 열립니다.",
    recordText: "실제 돈, 결제, 현금화는 없습니다. 기록은 당첨 자랑보다 비용, 지급, 평균손익, 빚, 멈춤 선택을 남깁니다.",
  },
  "match-three": {
    title: "문장 조각 역할을 맞추는 판",
    firstLook: "목적, 맥락, 제약 같은 조각 라벨과 점선 힌트를 먼저 봅니다.",
    firstMove: "첫 움직임은 옆 칸 교환입니다. 눈에 띄는 조각보다 같은 역할 셋이 되는 한 수를 고릅니다.",
    pacingText: "한 판은 짧게 이어집니다. 결과는 큰 연출보다 다음 한 수를 읽은 흔적으로 남습니다.",
    recordText: "기록은 초안 조각 흐름을 다시 보기 위한 메모입니다. 막히면 힌트를 보고 바로 다른 한 수를 시도합니다.",
  },
  memory: {
    title: "보기 중에는 손을 멈추고, 누르기 대기에서 같은 램프를 누르는 판",
    firstLook: "보기 중/누르기 대기 상태 띠, 켜진 릴리스 램프, 아래 본 순서와 누른 순서 줄, 다시 보기 버튼을 먼저 봅니다.",
    firstMove: "첫 움직임은 기다리기입니다. 보기 중에는 누르지 말고 램프 순서만 본 뒤, 누르기 대기가 켜지면 같은 순서로 다시 누릅니다.",
    pacingText: "한 판은 짧은 릴리스 램프 순서를 조금씩 늘리며 갑니다. 결과는 점수보다 가장 긴 램프 순서, 3칸씩 끊긴 누른 순서, 첫 실수 위치로 남습니다.",
    recordText: "기록은 다음에 어떤 램프에서 흔들렸는지 알려주는 콘솔 로그입니다. 헷갈리면 다시 보기로 같은 램프 순서를 확인한 뒤 누르기 대기에서 이어 누릅니다.",
  },
  flight: {
    title: "파란 덕트 틈과 붉은 케이블 벽을 먼저 보는 한 손 통과판",
    firstLook: "점검 드론, 오른쪽에서 오는 파란 덕트 틈, 붉은 케이블 벽, 누름/뗌 큐를 먼저 봅니다.",
    firstMove: "첫 움직임은 계속 누르기가 아니라 짧게 눌러 띄우고 손을 떼어 가라앉히는 것입니다. 덕트 틈 앞에서 높이를 맞춥니다.",
    pacingText: "한 판은 1분 서버실 덕트 통과로 갑니다. 결과는 누르고 떼는 길이와 파란 덕트 틈 통과로 남습니다.",
    recordText: "복기는 다음 덕트 틈 높이선을 더 빨리 읽기 위한 흔적입니다. 팬 바람을 과하게 타지 않고 붉은 케이블 벽을 피하는 감각만 남기면 됩니다.",
  },
  "brick-breaker": {
    title: "벽돌보다 공 착지선을 먼저 보는 판",
    firstLook: "공이 내려올 자리, 패치 패들 위치, 꼭 깨야 할 단서 벽돌을 먼저 봅니다.",
    firstMove: "첫 움직임은 패치 패들 이동입니다. 벽돌을 직접 쫓지 말고 공이 돌아올 자리를 잡습니다.",
    pacingText: "한 판은 짧은 벽돌깨기 흐름입니다. 결과는 깬 수보다 착지 예측과 받은 위치로 남습니다.",
    recordText: "기록은 다음 반사 각도를 떠올리기 위한 흔적입니다. 공을 놓쳤다면 패치 자리를 먼저 잡는 쪽으로 다시 봅니다.",
  },
  snake: {
    title: "머리 앞 칸과 꼬리 끝 출구를 같이 보는 배포줄",
    firstLook: "배포줄 머리, 자기 몸통, 노란 배포 조각, 머리 앞 칸 예고, 꼬리 끝 출구를 먼저 봅니다.",
    firstMove: "첫 움직임은 방향 전환입니다. 노란 조각만 따라가지 말고 바로 앞 칸과 곧 비워질 꼬리 끝을 보고 꺾습니다.",
    pacingText: "한 판은 1분 배포줄 경로 판단으로 갑니다. 결과는 붙인 조각보다 막힌 길과 살아난 빈칸 출구로 남습니다.",
    recordText: "기록은 다음 판에서 더 일찍 꺾을 위치를 찾기 위한 단서입니다. 꼬리에 막혔다면 꼬리 끝 출구를 버리고 직선으로 달린 순간을 봅니다.",
  },
  password: {
    title: "숨은 비밀번호를 증거 꼬리표로 좁히는 금고판",
    firstLook: "세 자리 비밀번호 슬롯, 왼쪽 증거판, 오른쪽 자리맞음·숫자있음 기록, 자리별 살아 있는 숫자를 먼저 봅니다.",
    firstMove: "첫 움직임은 찍기가 아니라 확인 번호 고르기입니다. 자리맞음과 숫자있음 증거를 겹쳐 후보를 지웁니다.",
    pacingText: "한 판은 1분 추리로 갑니다. 결과는 맞힌 운보다 어떤 증거 꼬리표로 비밀번호 후보가 줄었는지로 남습니다.",
    recordText: "기록은 틀린 번호를 버리는 자료가 아니라 다음 후보를 지우는 증거 메모입니다. 막히면 추천 후보를 답이 아니라 다음 확인 번호로 봅니다.",
  },
  crossing: {
    title: "노란 배포표를 한 칸씩 옮겨 초록 게이트만 건너는 차선 보드",
    firstLook: "노란 배포표, 아래 대기선, 차선 번호, 앞 칸 게이트, 노랑 차단봉, 빨강 트럭, 위쪽 도착 게이트를 먼저 봅니다.",
    firstMove: "첫 움직임은 전진보다 게이트 확인입니다. 앞 칸이 빨강 멈춤이면 대기선에 머물고, 초록 통과가 열리면 한 칸만 건넙니다.",
    pacingText: "한 판은 1분 배포표 차선 건너기입니다. 복기는 빨리 간 정도보다 기다린 타이밍, 옆 칸 회피, 초록 게이트 판단으로 남습니다.",
    recordText: "기록은 다음 차선을 더 차분히 읽기 위한 흔적입니다. 부딪혔다면 위로 밀기보다 앞 칸 게이트와 트럭 방향을 먼저 봅니다.",
  },
  minesweeper: {
    title: "첫 안전 구역에서 숫자와 깃발 수를 맞춰 여는 릴리스 지뢰 지도",
    firstLook: "현재 커서의 안전 구역, 열린 숫자 칸, 주변 닫힌 칸, 꽂힌 깃발 수, 오른쪽 숫자-깃발 대조표를 먼저 봅니다.",
    firstMove: "첫 움직임은 커서가 놓인 안전 칸 열기입니다. 의심 칸은 바로 열지 말고 F, 우클릭, Shift+클릭으로 깃발을 꽂습니다.",
    pacingText: "한 판은 1분 지뢰 지도 추론입니다. 결과는 많이 연 정도보다 숫자와 깃발 수가 맞는 순간에 주변 칸을 열었는지로 남습니다.",
    recordText: "기록은 다음 깃발 위치를 조정하기 위한 흔적입니다. 지뢰칸을 열었다면 숫자보다 깃발이 부족했는지, 너무 많았는지 먼저 봅니다.",
  },
  mole: {
    title: "볼 알림과 꺼둘 알림을 나누는 9칸 선별판",
    firstLook: "볼 알림, 꺼둘 알림, 보기/꺼둠 배지, 남은 시간 링, 확인 커서를 먼저 봅니다.",
    firstMove: "첫 움직임은 확인입니다. 꺼둘 알림은 일부러 보내고 지금 볼 알림만 누릅니다.",
    pacingText: "한 판은 1분 알림 선별입니다. 결과는 많이 누른 수보다 지금 볼 알림만 확인했는지로 남습니다.",
    recordText: "기록은 다음 알림 기준을 줄이기 위한 흔적입니다. 전부 누르려 했다면 손을 늦추고 꺼둘 알림을 그냥 보내는 쪽으로 다시 봅니다.",
  },
  stacker: {
    title: "움직이는 릴리스 층을 착지 레일에 멈추는 판",
    firstLook: "움직이는 노란 층, 아래 착지 레일, 초록 남을 폭, 붉은 잘림 폭, 손 위치선을 먼저 봅니다.",
    firstMove: "첫 움직임은 층 멈추기입니다. 초록 남을 폭이 넓고 붉은 잘림 폭이 작을 때 캔버스를 놓거나 Space/Enter를 누릅니다.",
    pacingText: "한 판은 짧은 릴리스 착지입니다. 결과는 층수보다 착지 레일, 남을 폭, 잘림 폭, 다음 폭으로 남습니다.",
    recordText: "기록은 다음 멈춤 타이밍을 잡기 위한 흔적입니다. 무너졌다면 손이 먼저 나간 순간과 이미 좁아진 다음 폭을 다시 봅니다.",
  },
  growth: {
    title: "제작대, 납품 상자, 막힌 줄을 보며 키우는 공방 성장판",
    firstLook: "왼쪽 제작대, 아래 납품 상자, 오른쪽 업그레이드 줄, 상단 막힌 줄과 열 게이지를 먼저 봅니다.",
    firstMove: "첫 움직임은 제작대입니다. 부품을 만들어 상자를 채우고, 막힌 줄이 과열이면 냉각팬, 부품 부족이면 제작대를 먼저 봅니다.",
    pacingText: "이 판은 자동으로 결과 화면으로 넘어가지 않습니다. 출력·냉각·자동·상자틀 업그레이드 줄과 열 막힘을 보며 같은 작업장을 계속 키웁니다.",
    recordText: "기록은 납품 흐름, 상자 진행도, 막힌 줄, 업그레이드 선택만 남깁니다. 조작은 제작대, 업그레이드 줄, 작업 배분판처럼 화면 안 표면에서 끝납니다.",
  },
} satisfies Record<ArcadeGameContent["arcade"]["variant"], Omit<PlayContextGuide, "kicker">>;

function playContextGuide(content: PlayContent): PlayContextGuide {
  if (content.type === "arcade-game") {
    const arcadeContextGuideOverrides: Partial<Record<string, Omit<PlayContextGuide, "kicker">>> = {
      "ten-box-rush": {
        title: "숫자 사과를 이어 훑어 합 10이면 지우는 사과상자",
        firstLook: "사과상자 격자, 숫자 사과, 현재 합계, 노란 합 10 후보를 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 1+9 짝만 집지 말고 2+3+5처럼 세 개 이상 이어지는 합 10 묶음도 훑습니다.",
        pacingText: "한 판은 1분 사과상자 비우기입니다. 결과는 결과 숫자보다 어떤 합 10 묶음을 보고 빈칸을 열었는지로 남습니다.",
        recordText: "기록은 산수 점검표가 아니라 다음 합 10 후보를 더 빨리 찾기 위한 손길 메모입니다. 넘쳤다면 손을 되돌릴 지점을 다시 봅니다.",
      },
      "bug-clicker": {
        title: "초록 접수 도장과 붉은 반려 X를 나누는 버그 접수선",
        firstLook: "위에서 내려오는 종이 티켓, 초록 접수 도장, 붉은 반려 X, 하단 접수선을 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 접수 방패 조준입니다. 눈에 띄는 티켓을 다 받지 말고 접수선 가까운 초록 도장 티켓 하나에 맞춥니다.",
        pacingText: "한 판은 1분 버그 접수선 방어입니다. 결과는 발사량보다 접수한 증거 티켓과 비켜 보낸 반려 티켓의 흐름으로 남습니다.",
        recordText: "기록은 접수 메모입니다. 붉은 반려 티켓에 흔들렸다면 다음 판에서는 접수 방패를 더 늦게 움직입니다.",
      },
      "bug-bubble-shooter": {
        title: "하단 단서 발사대로 단서표 버블만 터뜨리는 디버그 버블판",
        firstLook: "위쪽 버그 버블판, 재현/로그/환경 단서표 버블, 흐릿한 소문지 버블, 하단 단서 발사대와 바닥 경고선을 먼저 봅니다.",
        firstMove: "첫 움직임은 발사대 조준입니다. 보이는 버블을 전부 터뜨리지 말고 바닥선 가까운 단서표 버블에만 조준선을 맞춥니다.",
        pacingText: "한 판은 1분 버그 버블 판별입니다. 결과는 발사량보다 단서표를 고르고 소문지를 흘린 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 트리아지 메모입니다. 소문지에 흔들렸다면 다음 판에서는 조준선을 더 늦게 옮기고 단서표부터 읽습니다.",
      },
      "bug-brick-breaker": {
        title: "하단 패치 패들로 공 착지선과 반사각을 읽는 벽돌판",
        firstLook: "상단 재현·로그·원인 단서 벽돌, 중앙 공, 하단 패치 패들, 흰 착지선, 패들 중심 표시를 먼저 봅니다.",
        firstMove: "첫 움직임은 벽돌 선택이 아니라 패들 이동입니다. 공이 떨어질 흰 선에 패들 중심을 맞추고, 끝에 맞으면 반사각이 꺾인다고 봅니다.",
        pacingText: "한 판은 1분 패들 반사입니다. 결과는 많이 깬 정도보다 착지선을 읽고 재현·로그·원인 단서 벽돌을 먼저 깬 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 패치 착지 메모입니다. 소문 벽돌을 따라가다 놓쳤다면 다음 판에서는 하단 착지선부터 봅니다.",
      },
      "deploy-10-box": {
        title: "마감 전표를 합 10으로 접어 상자를 비우는 판",
        firstLook: "전표 상자, 숫자 전표, 현재 합계, 노란 10 후보, 넘친 새 일 경고를 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 많이 담기보다 지금 접어 닫을 수 있는 전표 묶음부터 쓸어냅니다.",
        pacingText: "한 판은 1분 마감 정리입니다. 결과는 기록 숫자보다 전표 상자를 비운 묶음과 넘친 새 일 기록으로 남습니다.",
        recordText: "기록은 다음 묶음을 더 차분히 닫기 위한 마감 메모입니다. 넘쳤다면 새 일을 더 담으려던 순간을 다시 봅니다.",
      },
      "prompt-sum-box": {
        title: "AI 질문 종이 조각을 이어 훑어 합 10으로 지우는 판",
        firstLook: "찢은 질문 종이 조각, 굵은 현재 합계 배지, 노란 합 10 힌트, 연필 되돌림 흔적을 먼저 봅니다.",
        firstMove: "첫 움직임은 드래그입니다. 목적·맥락·제약 조각을 이어 훑고, 합이 10을 넘기면 지나온 조각 쪽으로 되돌립니다.",
        pacingText: "한 판은 1분 초안 정리입니다. 결과는 점수보다 어떤 질문 재료를 묶고 어떤 장황한 종이를 덜어냈는지로 남습니다.",
        recordText: "기록은 산수표가 아니라 질문 초안 메모입니다. 한 덩어리로 밀어 넘쳤다면 다음 판에서는 더 짧은 합 10 후보부터 봅니다.",
      },
      "prompt-gem-swap": {
        title: "AI 질문 초안을 목적·맥락·예시·답 모양 칩으로 맞추는 보드",
        firstLook: "목적, 맥락, 예시, 답모양 종이칩과 점선 한 수, 왼쪽 초안 메모 패널을 먼저 봅니다.",
        firstMove: "첫 움직임은 옆 칸 교환입니다. 색보다 칩 라벨을 보고 같은 질문 재료 3칸이 되는 칩만 끌어 놓습니다.",
        pacingText: "한 판은 1분 AI 질문 초안 정리입니다. 결과는 보석 연출보다 질문칩 3칸과 장황한 칩을 덜 건드린 기록으로 남습니다.",
        recordText: "기록은 다음 AI 질문을 더 또렷하게 쓰기 위한 초안 메모입니다. 막혔다면 점선 한 수를 보고 라벨부터 다시 읽습니다.",
      },
      "deploy-invaders": {
        title: "릴리스 게이트선으로 내려오는 확인 표식만 막는 방어포",
        firstLook: "위에서 내려오는 네모 침입자 줄, 확인 표식, 주황 미끼 경고, 하단 릴리스 게이트선을 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 방어포 조준입니다. 주황 미끼를 따라가지 말고 게이트선 가까운 확인 표식에만 선을 맞춥니다.",
        pacingText: "한 판은 1분 릴리스 게이트 방어입니다. 결과는 발사량보다 표식 행렬을 골라 차단한 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 게이트선 메모입니다. 미끼에 흔들렸다면 다음 판에서는 방어포를 더 늦게 움직입니다.",
      },
      "deploy-missile-defense": {
        title: "아래 릴리스 도시선에 먼저 닿을 충돌점부터 막는 방어판",
        firstLook: "위에서 내려오는 경고 궤적, 아래 릴리스 도시선, 조준점, 충돌점 핀을 먼저 봅니다.",
        firstMove: "첫 움직임은 하단 방어포 조준입니다. 화면 위의 먼 궤적보다 아래 도시선에 먼저 닿을 충돌점에 선을 맞춥니다.",
        pacingText: "한 판은 1분 릴리스 도시선 방어입니다. 결과는 발사량보다 도시선에 닿을 경고 궤적을 먼저 지운 흐름으로 남습니다.",
        recordText: "기록은 공격력 표가 아니라 도시선 관제 메모입니다. 미끼에 흔들렸다면 다음 판에서는 아래쪽 충돌점부터 훑습니다.",
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
        title: "AI 답변 전표에 다시 확인/근거 있음 도장을 찍는 검수판",
        firstLook: "AI 답변 전표, 경로 열림·명령 출력·원문 출처·한계 표시 체크줄, 다시 확인 도장, 근거 있음 도장을 먼저 봅니다.",
        firstMove: "첫 움직임은 도장입니다. 경로 열림·명령 출력·원문 출처·한계 표시가 비면 다시 확인, 실제 확인 흔적이 있으면 근거 있음을 찍습니다.",
        pacingText: `${content.durationLabel} 동안 빠르게 맞히기보다 확인 흔적이 있는 말과 매끈한 단정을 나눕니다.`,
        recordText: "복기는 숫자보다 검수 전표에 가깝습니다. 도장을 잘못 찍었다면 다음 문장에서 경로, 명령 출력, 원문, 한계 중 무엇을 먼저 열어볼지 다시 봅니다.",
      };
    }
    if (content.slug === "indexing-waiting-room") {
      return {
        kicker: "첫 5초 안내",
        title: "새 글 주소 대기표에 지금 확인과 기다림 도장을 나누는 판",
        firstLook: "주소 대기표, 지금 확인 도장, 기다림 도장, 주소 열림/사이트맵/대표 주소/검사 도구 체크줄을 먼저 봅니다.",
        firstMove: "첫 움직임은 도장입니다. 주소가 열리고 사이트맵에 보이고 대표 주소와 검사 도구가 맞으면 지금 확인, 새로고침이나 재제출 충동은 기다림으로 넘깁니다.",
        pacingText: `${content.durationLabel} 동안 제출 보장 같은 환상을 걷어내고 지금 손으로 확인할 신호와 며칠 두고 볼 행동을 나눕니다.`,
        recordText: "기록은 검색 순위 상상이 아니라 오늘 어떤 대기표를 확인했고 무엇을 기다릴지 남기는 운영 메모입니다.",
      };
    }
    if (content.slug === "meeting-escape") {
      return {
        kicker: "첫 5초 안내",
        title: "회의록 한 줄을 닫기 칸과 주차칸으로 나누는 전표판",
        firstLook: "회의록 한 줄, 닫기 도장, 주차칸, 담당자/기한/다음 행동 체크줄을 먼저 봅니다.",
        firstMove: "첫 움직임은 도장입니다. 담당자·기한·다음 행동·범위 축소가 보이면 닫기 도장, 더 맞춰보기·느낌 공유·다음 회의는 주차칸입니다.",
        pacingText: `${content.durationLabel} 동안 회의를 빨리 끊는 것이 아니라 실행으로 넘어갈 발언과 아직 닫히지 않은 발언을 가릅니다.`,
        recordText: "복기는 숫자보다 어떤 발언을 닫기 칸이나 주차칸에 뒀는지 남기는 회의록 전표입니다.",
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
        title: "AI 요청 메모를 다섯 서류함에 붙이는 분류대",
        firstLook: "분류할 요청 메모, 해야 할 일/상황·대상/예시/답 모양/지킬 선 칸, 오른쪽 붙인 기록을 먼저 봅니다.",
        firstMove: "첫 움직임은 메모 붙이기입니다. 문장이 AI가 처리할 일인지, 대상과 현재 상태인지, 샘플인지, 답의 모양인지, 지킬 기준인지 고릅니다.",
        pacingText: `${content.durationLabel} 동안 빠르게 맞히기보다 요청이 어디서 뭉쳤는지 분리합니다. 예시와 답 모양은 지킬 선 문구와 따로 봅니다.`,
        recordText: "기록은 결과 자랑판이 아니라 다음 AI 요청서를 쓰기 위한 붙인 기록입니다. 헷갈린 문장은 한 문장에 역할이 둘 이상 섞였는지 다시 봅니다.",
      };
    }
    if (content.slug === "priority-sorter") {
      return {
        kicker: "첫 5초 안내",
        title: "지금 막힘, 시간 잡기, 오늘은 안 함으로 보내는 일감 분류대",
        firstLook: "현재 일감 카드, 지금 막힘/시간 잡기/오늘은 안 함 세 칸, 그리고 오른쪽 카드 이동 기록을 먼저 봅니다.",
        firstMove: "첫 움직임은 바쁜 카드를 누르는 것이 아니라, 카드가 다른 일을 멈추는지, 시간을 따로 잡으면 되는지, 오늘은 안 해도 되는지 가르는 것입니다.",
        pacingText: `${content.durationLabel} 동안 오늘 보드를 가볍게 만듭니다. 결과는 맞춘 수보다 오늘 안에 넣을 일을 줄인 기준이 남습니다.`,
        recordText: "기록은 다음 일감 카드를 더 차분히 보내기 위한 이동 기록입니다. 모든 일이 중요해 보였다면 오늘은 안 함 칸을 먼저 봅니다.",
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
      title: "일더미를 줄이고 몸·마음·신뢰를 지키는 퇴근 전표판",
      firstLook: "근무 시각, 가장 흔들리는 자원, 몸 배터리·마음 여유·일더미·신뢰 잔고 막대, 줄일 것/지킬 것/빌릴 것 메모를 먼저 봅니다.",
      firstMove: "첫 움직임은 좋아 보이는 답을 고르는 것이 아니라, 지금 전표에서 범위를 줄일지, 시간을 지킬지, 도움을 빌릴지 판단하는 것입니다.",
      pacingText: `${content.durationLabel} 동안 하루 전표를 처리합니다. 결과는 빠른 탈출보다 어떤 자원을 방치했고 어떤 부탁을 줄였는지로 남습니다.`,
      recordText: "기록은 결과 자랑판이 아니라 퇴근 기록지입니다. 일더미만 낮추려다 몸 배터리, 마음 여유, 신뢰 잔고 중 무엇을 태웠는지 다음 판에서 다시 봅니다.",
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
