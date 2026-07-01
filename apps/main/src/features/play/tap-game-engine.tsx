"use client";

import * as React from "react";
import { RotateCcw, Share2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TapGameContent } from "@/features/content/types";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

type TapHistoryItem = {
  label: string;
  correct: boolean;
  points: number;
  action: "tap" | "skip";
  expectedAction: "tap" | "skip";
};

function tapProgressValue({
  slug,
  index,
  totalItems,
  isFinished,
}: {
  slug: string;
  index: number;
  totalItems: number;
  isFinished: boolean;
}) {
  if (slug === "ai-review-tap") return isFinished ? "검수 마감" : `SLIP-${String(index + 1).padStart(2, "0")}`;
  if (slug === "indexing-waiting-room") return isFinished ? "창구 정산" : `WAIT-${String(index + 1).padStart(2, "0")}`;
  if (slug === "meeting-escape") return isFinished ? "회의록 마감" : `LINE-${String(index + 1).padStart(2, "0")}`;
  return isFinished ? `${totalItems}/${totalItems}` : `${index + 1}/${totalItems}`;
}

function tapResultLabels(slug: string) {
  if (slug === "ai-review-tap") {
    return {
      kicker: "검수 정산",
      copied: "기록 복사됨",
      share: "근거 기록 공유",
      restart: "다시 검수",
      scorePrefix: "근거 도장",
    };
  }
  if (slug === "indexing-waiting-room") {
    return {
      kicker: "대기표 정산",
      copied: "기록 복사됨",
      share: "대기표 기록 공유",
      restart: "새 대기표 열기",
      scorePrefix: "정리 도장",
    };
  }
  if (slug === "meeting-escape") {
    return {
      kicker: "회의록 정산",
      copied: "기록 복사됨",
      share: "회의록 공유",
      restart: "다시 회의록 열기",
      scorePrefix: "닫은 발언",
    };
  }
  return {
    kicker: "기록",
    copied: "기록 복사됨",
    share: "기록 공유",
    restart: "다시 하기",
    scorePrefix: "판정 점수",
  };
}

export function TapGameEngine({
  content,
  relatedBlogLinks,
  relatedPlayLinks,
}: {
  content: TapGameContent;
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
}) {
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [history, setHistory] = React.useState<TapHistoryItem[]>([]);
  const [shareState, setShareState] = React.useState<"idle" | "copied" | "shared">("idle");
  const current = content.targets[index];
  const isFinished = index >= content.targets.length;
  const totalItems = content.targets.length;
  const isAiReviewStampboard = content.slug === "ai-review-tap";
  const isIndexingWaitingRoom = content.slug === "indexing-waiting-room";
  const isMeetingExitBoard = content.slug === "meeting-escape";
  const usesTicketSurface = isAiReviewStampboard || isIndexingWaitingRoom || isMeetingExitBoard;
  const ending = [...content.endings].sort((a, b) => b.minScore - a.minScore).find((item) => score >= item.minScore) ?? content.endings[content.endings.length - 1];
  const scoreLabel = isAiReviewStampboard ? "근거 도장" : isIndexingWaitingRoom ? "정리 도장" : isMeetingExitBoard ? "닫은 발언" : "판정 점수";
  const progressLabel = isAiReviewStampboard ? "전표" : isIndexingWaitingRoom ? "대기표" : isMeetingExitBoard ? "회의록" : "진행";
  const progressValue = tapProgressValue({ slug: content.slug, index, totalItems, isFinished });
  const resultLabels = tapResultLabels(content.slug);
  const frameKicker = isAiReviewStampboard ? "AI 답변 근거 도장판" : isIndexingWaitingRoom ? "주소 대기표 도장판" : isMeetingExitBoard ? "회의록 닫기 도장판" : "탭 판정";
  const aiReviewChecklist = ["경로 열림", "명령 출력", "원문 출처", "한계·비밀"];
  const indexingTicketChecklist = ["주소 열림", "사이트맵", "대표 주소", "검사 도구"];
  const meetingCloseChecklist = ["담당자", "기한", "다음 행동", "범위"];
  const playBodyClassName = usesTicketSurface
    ? "grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_270px]"
    : "grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]";

  function answer(action: "tap" | "skip") {
    if (!current) return;
    const shouldTap = current.kind === "target";
    const expectedAction = shouldTap ? "tap" : "skip";
    const correct = action === "tap" ? shouldTap : !shouldTap;
    const points = correct ? current.points + Math.min(streak, 4) : -2;
    setScore((value) => Math.max(0, value + points));
    setStreak((value) => (correct ? value + 1 : 0));
    setHistory((items) => [...items, { label: current.label, correct, points, action, expectedAction }]);
    setIndex((value) => value + 1);
    setShareState("idle");
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setHistory([]);
    setShareState("idle");
  }

  async function shareResult() {
    const title = `${content.title} - ${ending.title}`;
    const text = `${content.shareText}\n${resultLabels.scorePrefix}: ${score}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: window.location.href });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
      setShareState("copied");
    } catch {
      setShareState("idle");
    }
  }

  return (
    <section className="rounded-lg border bg-card shadow-sm" data-play-engine={content.slug}>
      <div className="border-b bg-muted/30 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{frameKicker}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="rounded-md border bg-background px-3 py-2">
              <p className="text-xs text-muted-foreground">{scoreLabel}</p>
              <p className="text-sm font-semibold tabular-nums">{score}</p>
            </div>
            <div className="rounded-md border bg-background px-3 py-2">
              <p className="text-xs text-muted-foreground">{progressLabel}</p>
              <p className="text-sm font-semibold tabular-nums">{progressValue}</p>
            </div>
          </div>
        </div>
      </div>

      {isFinished ? (
        <div className={playBodyClassName} data-play-result>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{resultLabels.kicker}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">{ending.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{ending.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={shareResult} data-play-share>
                <Share2 className="h-4 w-4" />
                {shareState === "copied" ? resultLabels.copied : shareState === "shared" ? "공유 완료" : resultLabels.share}
              </Button>
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                {resultLabels.restart}
              </Button>
            </div>
            <PlayResultLinks relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
          </div>
          <TapHistory content={content} history={history} />
        </div>
      ) : current ? (
        <div className={playBodyClassName} data-play-state={current.id}>
          <div>
            {isAiReviewStampboard ? (
              <div className="rounded-lg border bg-zinc-50 p-4 text-left shadow-inner ring-1 ring-inset ring-zinc-200/70 dark:bg-zinc-950/40 dark:ring-zinc-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed pb-3">
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">AI 답변 근거 전표</p>
                  <span className="rounded-sm border bg-background px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground">
                    SLIP-{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground sm:grid-cols-4">
                  {aiReviewChecklist.map((item) => (
                    <span key={item} className="rounded-sm border bg-background px-2 py-1">
                      [ ] {item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 border-l-4 border-zinc-500 bg-background p-4 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground">확인할 문장</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal">{current.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{current.detail}</p>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <div className="rounded-sm border bg-background px-3 py-2">
                    <p className="font-semibold text-foreground">{content.targetLabel}</p>
                    <p className="mt-1 leading-5">경로 열림, 명령 출력, 원문 출처, 한계 표시가 비면 여기 찍습니다.</p>
                  </div>
                  <div className="rounded-sm border bg-background px-3 py-2">
                    <p className="font-semibold text-foreground">{content.decoyLabel}</p>
                    <p className="mt-1 leading-5">확인 흔적, 원문 링크, 기준일, 못 본 범위가 있으면 여기 찍습니다.</p>
                  </div>
                </div>
              </div>
            ) : isIndexingWaitingRoom ? (
              <div className="rounded-lg border bg-stone-50 p-4 text-left shadow-inner dark:bg-stone-950/30">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed pb-3">
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">새 글 주소 대기표</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-sm border bg-background px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground">
                      WAIT-{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-sm border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">노출 보장 아님</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground sm:grid-cols-4">
                  {indexingTicketChecklist.map((item) => (
                    <span key={item} className="rounded-sm border bg-background px-2 py-1">
                      [ ] {item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 border-l-4 border-stone-500 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">대기표 항목</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal">{current.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{current.detail}</p>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <div className="rounded-sm border bg-background px-3 py-2">
                    <p className="font-semibold text-foreground">{content.targetLabel}</p>
                    <p className="mt-1 leading-5">주소 열림, 사이트맵, 대표 주소, 검사 도구처럼 오늘 바로 볼 수 있는 칸입니다.</p>
                  </div>
                  <div className="rounded-sm border bg-background px-3 py-2">
                    <p className="font-semibold text-foreground">{content.decoyLabel}</p>
                    <p className="mt-1 leading-5">새로고침, 재제출, 제목 재수정은 지금 처리하지 않고 며칠 둠 칸에 둡니다.</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-sm border bg-background px-2 py-1">오늘 볼 칸만 도장</span>
                  <span className="rounded-sm border bg-background px-2 py-1">다음 관찰은 며칠 뒤</span>
                  <span className="rounded-sm border bg-background px-2 py-1">제출 반복 금지</span>
                </div>
              </div>
            ) : isMeetingExitBoard ? (
              <div className="rounded-lg border bg-stone-50 p-4 text-left shadow-inner dark:bg-stone-950/30">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-zinc-300 pb-3 dark:border-zinc-700">
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">회의록 한 줄</p>
                  <span className="rounded-sm border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">닫기 / 주차칸</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground sm:grid-cols-4">
                  {meetingCloseChecklist.map((item) => (
                    <span key={item} className="rounded-sm border bg-background px-2 py-1">
                      [ ] {item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 border-l-4 border-zinc-800 bg-background p-4 shadow-sm dark:border-zinc-300">
                  <p className="text-xs font-medium text-muted-foreground">지금 회의록에 남을 발언</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal">{current.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{current.detail}</p>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <div className="rounded-sm border bg-background px-3 py-2 shadow-[inset_0_0_0_1px_rgba(39,39,42,0.04)]">
                    <p className="font-semibold text-foreground">닫기 칸: {content.targetLabel}</p>
                    <p className="mt-1 leading-5">담당자, 기한, 다음 행동, 범위 축소가 있으면 회의록에 남기고 닫습니다.</p>
                  </div>
                  <div className="rounded-sm border border-dashed bg-background px-3 py-2">
                    <p className="font-semibold text-foreground">주차칸: {content.decoyLabel}</p>
                    <p className="mt-1 leading-5">더 맞춰보기, 느낌 공유, 다음 회의, 한마디 더는 아직 주차합니다.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-background p-6 text-center">
                <Target className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-4 text-xs font-medium text-muted-foreground">현재 신호</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-normal">{current.label}</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{current.detail}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  기준: {content.targetLabel} / {content.decoyLabel}
                </p>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button className={usesTicketSurface ? "h-16 text-base" : "h-14 text-base"} onClick={() => answer("tap")} data-play-action="tap">
                {content.targetLabel}
              </Button>
              <Button className={usesTicketSurface ? "h-16 text-base" : "h-14 text-base"} variant="outline" onClick={() => answer("skip")} data-play-action="skip">
                {content.decoyLabel}
              </Button>
            </div>
          </div>
          <TapHistory content={content} history={history} />
        </div>
      ) : null}
    </section>
  );
}

function TapHistory({ content, history }: { content: TapGameContent; history: TapHistoryItem[] }) {
  const isAiReviewStampboard = content.slug === "ai-review-tap";
  const isIndexingWaitingRoom = content.slug === "indexing-waiting-room";
  const isMeetingExitBoard = content.slug === "meeting-escape";
  const title = isAiReviewStampboard ? "근거 도장 복기" : isIndexingWaitingRoom ? "대기표 기록" : isMeetingExitBoard ? "회의록 복기" : "선택 기준";

  function labelForAction(action: "tap" | "skip") {
    return action === "tap" ? content.targetLabel : content.decoyLabel;
  }

  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history>
      <p className="text-sm font-semibold">{title}</p>
      {history.length ? (
        <ol className="mt-3 space-y-2">
          {history.slice(-8).map((item, index) => (
            <li key={`${item.label}-${index}`} className="rounded-sm border bg-background p-2.5">
              <p className="text-sm font-medium">{item.label}</p>
              <p className={item.correct ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-red-600"}>
                {isAiReviewStampboard
                  ? item.correct
                    ? `도장: ${labelForAction(item.action)} / 근거칸 맞음 ${item.points > 0 ? `+${item.points}` : item.points}`
                    : `도장: ${labelForAction(item.action)} / 다시 찍을 도장: ${labelForAction(item.expectedAction)}`
                  : isIndexingWaitingRoom
                    ? item.correct
                      ? `도장: ${labelForAction(item.action)} / 분류 맞음 ${item.points > 0 ? `+${item.points}` : item.points}`
                      : `도장: ${labelForAction(item.action)} / 다시 볼 대기표: ${labelForAction(item.expectedAction)}`
                    : isMeetingExitBoard
                      ? item.correct
                        ? `도장: ${labelForAction(item.action)} / 회의록 칸 맞음 ${item.points > 0 ? `+${item.points}` : item.points}`
                        : `도장: ${labelForAction(item.action)} / 다시 볼 칸: ${labelForAction(item.expectedAction)}`
                  : item.correct
                    ? `선택: ${labelForAction(item.action)} / 맞음 ${item.points > 0 ? `+${item.points}` : item.points}`
                    : `선택: ${labelForAction(item.action)} / 기준: ${labelForAction(item.expectedAction)}`}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {isAiReviewStampboard
            ? "도장을 찍으면 문장과 다시 볼 근거칸이 여기에 남습니다."
            : isIndexingWaitingRoom
              ? "도장을 찍으면 확인한 대기표와 기준이 여기에 남습니다."
              : isMeetingExitBoard
                ? "도장을 찍으면 발언과 닫기/주차칸 기준이 여기에 남습니다."
              : "하나를 누르면 선택한 기준이 바로 남습니다."}
        </p>
      )}
    </aside>
  );
}
