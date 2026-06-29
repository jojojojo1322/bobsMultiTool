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
  const detailMaxWidth = content.type === "arcade-game" ? "max-w-7xl" : "max-w-6xl";

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
      <section className={`mx-auto ${detailMaxWidth} px-4 py-8`}>
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
    pacingText: "한 판은 1분 안팎으로 갑니다. 결과는 많이 쏜 수보다 진짜 신호와 소음을 나눈 흐름으로 남습니다.",
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
  "match-three": {
    title: "문장 조각 역할을 맞추는 판",
    firstLook: "목적, 맥락, 제약 같은 조각 라벨과 점선 힌트를 먼저 봅니다.",
    firstMove: "첫 움직임은 옆 칸 교환입니다. 눈에 띄는 조각보다 같은 역할 셋이 되는 한 수를 고릅니다.",
    pacingText: "한 판은 짧게 이어집니다. 결과는 큰 연출보다 다음 한 수를 읽은 흔적으로 남습니다.",
    recordText: "기록은 초안 조각 흐름을 다시 보기 위한 메모입니다. 막히면 힌트를 보고 바로 다른 한 수를 시도합니다.",
  },
  memory: {
    title: "불빛 순서를 남기는 기억 판",
    firstLook: "처음 빛난 칸, 이어지는 순서, 다시 보기 버튼을 먼저 봅니다.",
    firstMove: "첫 움직임은 입력이 아니라 보기입니다. 순서가 끝난 뒤 같은 순서로 누릅니다.",
    pacingText: "한 판은 짧은 기억 길이를 늘리며 갑니다. 결과는 점수보다 기억 길이와 첫 실수 위치로 남습니다.",
    recordText: "기록은 다음에 어떤 위치에서 흔들렸는지 알려주는 흔적입니다. 헷갈리면 다시 보기를 먼저 누릅니다.",
  },
  flight: {
    title: "누르고 떼는 고도 조절 판",
    firstLook: "비행체, 다음 높이선, 지나갈 빈틈, 누름 상태를 먼저 봅니다.",
    firstMove: "첫 움직임은 길게 누르기가 아니라 짧게 눌렀다 떼기입니다. 높이선을 보고 리듬을 맞춥니다.",
    pacingText: "한 판은 1분 비행으로 갑니다. 결과는 점수보다 누르고 떼는 리듬과 빈틈 통과로 남습니다.",
    recordText: "기록은 다음 높이선을 더 빨리 읽기 위한 흔적입니다. 오래 누르면 뜨고, 놓으면 내려간다는 감각만 남기면 됩니다.",
  },
  "brick-breaker": {
    title: "공 착지선을 먼저 보는 벽돌깨기 판",
    firstLook: "공이 내려올 자리, 패들 위치, 꼭 깨야 할 벽돌을 먼저 봅니다.",
    firstMove: "첫 움직임은 패들 이동입니다. 벽돌을 직접 쫓지 말고 공이 돌아올 자리를 잡습니다.",
    pacingText: "한 판은 짧은 벽돌깨기 흐름입니다. 결과는 깬 수보다 착지 예측과 받은 위치로 남습니다.",
    recordText: "기록은 다음 반사 각도를 떠올리기 위한 흔적입니다. 공을 놓쳤다면 위치를 먼저 잡는 쪽으로 다시 봅니다.",
  },
  snake: {
    title: "다음 칸과 꼬리를 보는 경로 판",
    firstLook: "머리, 사과, 꼬리, 다음 칸 예고를 먼저 봅니다.",
    firstMove: "첫 움직임은 방향 전환입니다. 사과만 쫓지 말고 열린 길을 남기며 꺾습니다.",
    pacingText: "한 판은 1분 경로 판단으로 갑니다. 결과는 사과 수보다 욕심낸 길과 피한 꼬리로 남습니다.",
    recordText: "기록은 다음 꺾임을 조정하기 위한 흔적입니다. 길이 막히면 바로 다른 방향을 남기는 연습으로 봅니다.",
  },
  password: {
    title: "힌트로 후보를 줄이는 금고 판",
    firstLook: "세 자리 입력칸, 지난 힌트, 살아 있는 후보 숫자를 먼저 봅니다.",
    firstMove: "첫 움직임은 찍기가 아니라 실험입니다. 자리와 숫자 힌트를 겹쳐 다음 후보를 좁힙니다.",
    pacingText: "한 판은 1분 추론으로 갑니다. 결과는 맞힌 운보다 후보가 얼마나 줄었는지로 남습니다.",
    recordText: "기록은 틀린 번호를 버리는 자료입니다. 막히면 추천 후보를 답이 아니라 다음 실험으로 봅니다.",
  },
  crossing: {
    title: "다음 한 칸의 위험을 보는 건너기 판",
    firstLook: "차선, 다음 칸 표시, 빈 차선, 도착선을 먼저 봅니다.",
    firstMove: "첫 움직임은 위로 달리기가 아니라 한 칸 이동입니다. 위험한 칸이면 멈춥니다.",
    pacingText: "한 판은 1분 건너기 흐름입니다. 결과는 빨리 간 정도보다 멈춘 타이밍과 빈틈 판단으로 남습니다.",
    recordText: "기록은 다음 차선을 더 차분히 읽기 위한 흔적입니다. 부딪혔다면 속도보다 멈춤을 먼저 봅니다.",
  },
  minesweeper: {
    title: "숫자 주변을 읽는 지뢰 추론 판",
    firstLook: "열린 숫자, 표시한 칸, 아직 닫힌 주변 칸을 먼저 봅니다.",
    firstMove: "첫 움직임은 안전해 보이는 칸 열기입니다. 위험해 보이면 표시로 미뤄둡니다.",
    pacingText: "한 판은 1분 추론 퍼즐입니다. 결과는 많이 연 칸보다 숫자를 읽고 위험을 미룬 판단으로 남습니다.",
    recordText: "기록은 다음 표시 위치를 조정하기 위한 흔적입니다. 터졌다면 바로 누른 이유를 다시 봅니다.",
  },
  mole: {
    title: "잡을 알림과 보낼 소음을 나누는 판",
    firstLook: "초록 알림, 빨간 소음, 남은 시간 링을 먼저 봅니다.",
    firstMove: "첫 움직임은 잡기입니다. 빨간 소음은 일부러 보내고 초록 알림만 누릅니다.",
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
} satisfies Record<ArcadeGameContent["arcade"]["variant"], Omit<PlayContextGuide, "kicker">>;

function playContextGuide(content: PlayContent): PlayContextGuide {
  if (content.type === "arcade-game") {
    const guide = arcadeContextGuides[content.arcade.variant];
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
