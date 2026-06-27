"use client";

import * as React from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortMatchGameContent } from "@/features/content/types";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

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
  const [history, setHistory] = React.useState<Array<{ label: string; category: string; correct: boolean }>>([]);
  const [shareState, setShareState] = React.useState<"idle" | "copied" | "shared">("idle");
  const current = content.items[index];
  const isFinished = index >= content.items.length;
  const ending = [...content.endings].sort((a, b) => b.minScore - a.minScore).find((item) => score >= item.minScore) ?? content.endings[content.endings.length - 1];

  function choose(categoryId: string) {
    if (!current) return;
    const correct = current.categoryId === categoryId;
    setScore((value) => value + (correct ? 1 : 0));
    setHistory((items) => [...items, { label: current.label, category: categoryId, correct }]);
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
    const text = `${content.shareText}\n점수: ${score}`;
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
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sort Match</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2 text-right">
            <p className="text-xs text-muted-foreground">점수</p>
            <p className="text-sm font-semibold tabular-nums">{score}</p>
          </div>
        </div>
      </div>

      {isFinished ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-result>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Result</p>
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
          <SortHistory content={content} history={history} />
        </div>
      ) : current ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-state={current.id}>
          <div>
            <div className="rounded-lg border bg-background p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">지금 분류할 항목</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-normal">{current.label}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{current.detail}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {content.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  data-play-action="category"
                  data-play-category-id={category.id}
                  className="rounded-md border bg-background p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => choose(category.id)}
                >
                  <span className="block text-sm font-semibold">{category.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{category.description}</span>
                </button>
              ))}
            </div>
          </div>
          <SortHistory content={content} history={history} />
        </div>
      ) : null}
    </section>
  );
}

function SortHistory({
  content,
  history,
}: {
  content: SortMatchGameContent;
  history: Array<{ label: string; category: string; correct: boolean }>;
}) {
  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history>
      <p className="text-sm font-semibold">분류 로그</p>
      {history.length ? (
        <ol className="mt-3 space-y-2">
          {history.slice(-8).map((item, index) => {
            const category = content.categories.find((entry) => entry.id === item.category);
            return (
              <li key={`${item.label}-${index}`} className="rounded-sm border bg-background p-2.5">
                <p className="text-sm font-medium">{item.label}</p>
                <p className={item.correct ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-red-600"}>
                  {category?.label ?? item.category} / {item.correct ? "정답" : "오답"}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">항목을 분류하면 최근 선택이 여기에 남습니다.</p>
      )}
    </aside>
  );
}
