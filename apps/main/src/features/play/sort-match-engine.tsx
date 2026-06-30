"use client";

import * as React from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortMatchGameContent } from "@/features/content/types";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

type SortHistoryItem = {
  label: string;
  category: string;
  correctCategory: string;
  correct: boolean;
};

export function SortMatchEngine({
  content,
  relatedBlogLinks,
  relatedPlayLinks,
}: {
  content: SortMatchGameContent;
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
}) {
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [history, setHistory] = React.useState<SortHistoryItem[]>([]);
  const [shareState, setShareState] = React.useState<"idle" | "copied" | "shared">("idle");
  const current = content.items[index];
  const isFinished = index >= content.items.length;
  const totalItems = content.items.length;
  const ending = [...content.endings].sort((a, b) => b.minScore - a.minScore).find((item) => score >= item.minScore) ?? content.endings[content.endings.length - 1];
  const isPromptWorkbench = content.slug === "prompt-cleanup";
  const isPrioritySorter = content.slug === "priority-sorter";
  const engineCopy =
    isPromptWorkbench
      ? {
          boardLabel: "AI 요청서 분류대",
          scoreLabel: "붙인 메모",
          currentLabel: "분류할 요청 메모",
          historyTitle: "요청서 붙인 기록",
          emptyHistory: "메모를 한 장 붙이면 어느 요청서 칸으로 보냈는지 여기에 남습니다.",
        }
      : isPrioritySorter
      ? {
          boardLabel: "오늘 일감 분류대",
          scoreLabel: "보낸 카드",
          currentLabel: "분류할 일감 카드",
          historyTitle: "카드 이동 기록",
          emptyHistory: "카드를 한 장 보내면 지금 막힘, 시간 잡기, 오늘은 안 함 중 어디로 보냈는지 여기에 남습니다.",
        }
      : {
          boardLabel: "분류 보드",
          scoreLabel: "맞춘 항목",
          currentLabel: "현재 카드",
          historyTitle: "선택 기준",
          emptyHistory: "카드를 한 장 보내면 선택한 기준이 여기에 남습니다.",
        };

  function choose(categoryId: string) {
    if (!current) return;
    const correct = current.categoryId === categoryId;
    setScore((value) => value + (correct ? 1 : 0));
    setHistory((items) => [...items, { label: current.label, category: categoryId, correctCategory: current.categoryId, correct }]);
    setIndex((value) => value + 1);
    setShareState("idle");
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setHistory([]);
    setShareState("idle");
  }

  async function shareResult() {
    const title = `${content.title} - ${ending.title}`;
    const text = `${content.shareText}\n${engineCopy.scoreLabel}: ${score}/${totalItems}`;
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
    <section
      className={`rounded-lg border shadow-sm ${
        isPromptWorkbench
          ? "bg-[linear-gradient(180deg,hsl(var(--card)),hsl(var(--muted)/0.22))]"
          : isPrioritySorter
          ? "bg-[linear-gradient(180deg,hsl(var(--card)),hsl(var(--muted)/0.18))]"
          : "bg-card"
      }`}
      data-play-engine={content.slug}
    >
      <div className="border-b bg-muted/30 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{engineCopy.boardLabel}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2 text-right">
            <p className="text-xs text-muted-foreground">{engineCopy.scoreLabel}</p>
            <p className="text-sm font-semibold tabular-nums">
              {score}/{totalItems}
            </p>
          </div>
        </div>
      </div>

      {isFinished ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-result>
          <div>
            <p className="text-xs font-medium text-muted-foreground">결과</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">{ending.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{ending.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={shareResult} data-play-share>
                <Share2 className="h-4 w-4" />
                {shareState === "copied" ? "결과 복사됨" : shareState === "shared" ? "공유 완료" : "결과 공유"}
              </Button>
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                다시 하기
              </Button>
            </div>
            <PlayResultLinks relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
          </div>
          <SortHistory content={content} history={history} title={engineCopy.historyTitle} emptyText={engineCopy.emptyHistory} />
        </div>
      ) : current ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-state={current.id}>
          <div>
            <div
              className={`rounded-lg border p-5 ${
                isPromptWorkbench
                  ? "border-dashed bg-background shadow-[inset_0_0_0_1px_hsl(var(--muted))]"
                  : isPrioritySorter
                  ? "border-zinc-300/90 bg-zinc-50/80 shadow-[inset_0_0_0_1px_hsl(var(--background))] dark:border-zinc-700 dark:bg-zinc-950/30"
                  : "bg-background"
              }`}
            >
              <p className="text-xs font-medium text-muted-foreground">{engineCopy.currentLabel}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-normal">{current.label}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{current.detail}</p>
            </div>
            {isPromptWorkbench ? <PromptRequestDeskNote /> : null}
            {isPrioritySorter ? <PrioritySorterBoardNote /> : null}
            <div className={`mt-4 grid gap-3 ${isPromptWorkbench ? "sm:grid-cols-2 xl:grid-cols-5" : "sm:grid-cols-3"}`}>
              {content.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  data-play-action="category"
                  data-play-category-id={category.id}
                  className={`rounded-md border bg-background p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${categoryClassName(content.slug, category.id)}`}
                  onClick={() => choose(category.id)}
                >
                  <span className="block text-sm font-semibold">{category.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{category.description}</span>
                </button>
              ))}
            </div>
          </div>
          <SortHistory content={content} history={history} title={engineCopy.historyTitle} emptyText={engineCopy.emptyHistory} />
        </div>
      ) : null}
    </section>
  );
}

function PromptRequestDeskNote() {
  return (
    <div className="mt-3 grid gap-2 rounded-md border border-zinc-300/80 bg-zinc-50/80 p-3 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 sm:grid-cols-3">
      <div>
        <span className="block font-semibold text-slate-800 dark:text-slate-100">해야 할 일</span>
        <span className="mt-1 block leading-5">AI가 실제로 끝내야 할 동작을 붙입니다. 요청서의 첫 줄을 세우는 칸입니다.</span>
      </div>
      <div>
        <span className="block font-semibold text-sky-700 dark:text-sky-300">상황·예시</span>
        <span className="mt-1 block leading-5">대상, 현재 상태, 따라 할 샘플을 붙입니다. 답이 허공에서 나오지 않게 잡는 칸입니다.</span>
      </div>
      <div>
        <span className="block font-semibold text-rose-700 dark:text-rose-300">답 모양·지킬 선</span>
        <span className="mt-1 block leading-5">표, JSON, 길이, 제외 범위, 성공 기준을 붙입니다. 결과물의 모양과 경계를 닫는 칸입니다.</span>
      </div>
    </div>
  );
}

function PrioritySorterBoardNote() {
  return (
    <div className="mt-3 grid gap-2 rounded-md border border-zinc-300/80 bg-zinc-50/80 p-3 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 sm:grid-cols-3">
      <div>
        <span className="block font-semibold text-red-700 dark:text-red-300">차단 신호</span>
        <span className="mt-1 block leading-5">결제, 깨진 링크, 배포 키처럼 다른 카드까지 멈추면 지금 막힘입니다.</span>
      </div>
      <div>
        <span className="block font-semibold text-amber-700 dark:text-amber-300">예약 신호</span>
        <span className="mt-1 block leading-5">중요하지만 지금 끼우면 흐름이 깨지는 카드는 시간을 잡습니다.</span>
      </div>
      <div>
        <span className="block font-semibold text-zinc-800 dark:text-zinc-200">바깥 신호</span>
        <span className="mt-1 block leading-5">좋아 보여도 오늘 흐름을 안 막으면 오늘은 안 함으로 뺍니다.</span>
      </div>
    </div>
  );
}

function SortHistory({
  content,
  history,
  title,
  emptyText,
}: {
  content: SortMatchGameContent;
  history: SortHistoryItem[];
  title: string;
  emptyText: string;
}) {
  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history>
      <p className="text-sm font-semibold">{title}</p>
      {history.length ? (
        <ol className="mt-3 space-y-2">
          {history.slice(-8).map((item, index) => {
            const selectedCategory = content.categories.find((entry) => entry.id === item.category);
            const correctCategory = content.categories.find((entry) => entry.id === item.correctCategory);
            const actionLabel = content.slug === "priority-sorter" ? "보냄" : content.slug === "prompt-cleanup" ? "붙임" : "선택";
            return (
              <li key={`${item.label}-${index}`} className="rounded-sm border bg-background p-2.5">
                <p className="text-sm font-medium">{item.label}</p>
                <p className={item.correct ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-red-600"}>
                  {item.correct
                    ? `${actionLabel}: ${selectedCategory?.label ?? item.category} / 기준 맞음`
                    : `${actionLabel}: ${selectedCategory?.label ?? item.category} / 기준: ${correctCategory?.label ?? item.correctCategory}`}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{emptyText}</p>
      )}
    </aside>
  );
}

function categoryClassName(slug: string, categoryId: string) {
  if (slug === "prompt-cleanup") {
    if (categoryId === "task") return "border-slate-300/80 bg-slate-50/80 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/40";
    if (categoryId === "context") return "border-sky-300/80 bg-sky-50/70 hover:bg-sky-50 dark:border-sky-900/70 dark:bg-sky-950/20";
    if (categoryId === "example") return "border-emerald-300/80 bg-emerald-50/70 hover:bg-emerald-50 dark:border-emerald-900/70 dark:bg-emerald-950/20";
    if (categoryId === "format") return "border-amber-300/80 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-900/70 dark:bg-amber-950/20";
    if (categoryId === "constraint") return "border-rose-300/80 bg-rose-50/70 hover:bg-rose-50 dark:border-rose-900/70 dark:bg-rose-950/20";
  }
  if (slug !== "priority-sorter") return "";
  if (categoryId === "now") return "border-red-300/70 bg-red-50/70 hover:bg-red-50 dark:border-red-900/60 dark:bg-red-950/20";
  if (categoryId === "schedule") return "border-amber-300/70 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20";
  if (categoryId === "drop") return "border-zinc-300/80 bg-zinc-50/80 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/40";
  return "";
}
