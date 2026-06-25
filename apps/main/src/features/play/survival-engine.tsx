"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withLocale } from "@/features/i18n/config";
import type { MicroSimPlayContent, PlayEnding, PlayStatKey } from "@/features/content/types";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

type Stats = Record<PlayStatKey, number>;

type HistoryItem = {
  turnTitle: string;
  choiceLabel: string;
  effects: Partial<Record<PlayStatKey, number>>;
};

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

function initialStats(content: MicroSimPlayContent): Stats {
  return Object.fromEntries(content.stats.map((stat) => [stat.key, stat.initial])) as Stats;
}

function applyEffects(stats: Stats, effects: Partial<Record<PlayStatKey, number>>): Stats {
  return {
    stamina: clampStat(stats.stamina + (effects.stamina ?? 0)),
    mental: clampStat(stats.mental + (effects.mental ?? 0)),
    workload: clampStat(stats.workload + (effects.workload ?? 0)),
    reputation: clampStat(stats.reputation + (effects.reputation ?? 0)),
  };
}

function ruleMatches(stats: Stats, rule: PlayEnding["conditions"][number]) {
  const value = stats[rule.stat];
  return rule.op === "<=" ? value <= rule.value : value >= rule.value;
}

function pickEnding(content: MicroSimPlayContent, stats: Stats) {
  return content.endings.find((ending) => ending.conditions.every((rule) => ruleMatches(stats, rule))) ?? content.endings[content.endings.length - 1];
}

function formatEffect(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function statTone(key: PlayStatKey, value: number) {
  if (key === "workload") {
    if (value >= 72) return "bg-red-500";
    if (value >= 52) return "bg-amber-500";
    return "bg-emerald-500";
  }
  if (value <= 22) return "bg-red-500";
  if (value <= 42) return "bg-amber-500";
  return "bg-emerald-500";
}

export function SurvivalPlayEngine({
  content,
  relatedBlogLinks,
  relatedPlayLinks,
}: {
  content: MicroSimPlayContent;
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
}) {
  const [turnIndex, setTurnIndex] = React.useState(0);
  const [stats, setStats] = React.useState<Stats>(() => initialStats(content));
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [shareState, setShareState] = React.useState<"idle" | "copied" | "shared">("idle");
  const isFinished = turnIndex >= content.turns.length;
  const ending = isFinished ? pickEnding(content, stats) : null;
  const currentTurn = content.turns[turnIndex];

  function choose(choiceIndex: number) {
    if (!currentTurn) return;
    const choice = currentTurn.choices[choiceIndex];
    if (!choice) return;

    setStats((currentStats) => applyEffects(currentStats, choice.effects));
    setHistory((items) => [
      ...items,
      {
        turnTitle: currentTurn.title,
        choiceLabel: choice.label,
        effects: choice.effects,
      },
    ]);
    setTurnIndex((index) => index + 1);
    setShareState("idle");
  }

  function restart() {
    setTurnIndex(0);
    setStats(initialStats(content));
    setHistory([]);
    setShareState("idle");
  }

  async function shareResult() {
    const title = ending ? `${content.title} - ${ending.title}` : content.title;
    const text = ending ? `${content.shareText}\n결과: ${ending.title}` : content.shareText;
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
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
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Micro Sim</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2 text-right">
            <p className="text-xs text-muted-foreground">진행</p>
            <p className="text-sm font-semibold">
              {Math.min(turnIndex, content.turns.length)} / {content.turns.length}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-play-stats>
          {content.stats.map((stat) => (
            <div key={stat.key} className="rounded-md border bg-background p-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium">{stat.label}</span>
                <span className="tabular-nums text-muted-foreground">{stats[stat.key]}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className={statTone(stat.key, stats[stat.key])} style={{ width: `${stats[stat.key]}%`, height: "100%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {ending ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]" data-play-result>
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
            <div className="mt-3">
              <Link href={withLocale("/tools", "en")} className="inline-flex rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted">
                보관된 개발자 도구 열기
              </Link>
            </div>
          </div>
          <HistoryPanel content={content} history={history} />
        </div>
      ) : currentTurn ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]" data-play-turn={currentTurn.id}>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Turn {turnIndex + 1}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">{currentTurn.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{currentTurn.situation}</p>
            <div className="mt-5 grid gap-3">
              {currentTurn.choices.map((choice, choiceIndex) => (
                <button
                  key={choice.label}
                  type="button"
                  data-play-action="choice"
                  data-play-choice-index={choiceIndex}
                  className="rounded-md border bg-background p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => choose(choiceIndex)}
                >
                  <span className="block text-sm font-semibold">{choice.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">{choice.detail}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {content.stats.map((stat) => {
                      const effect = choice.effects[stat.key] ?? 0;
                      if (!effect) return null;
                      return (
                        <span key={stat.key} className="rounded-sm border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                          {stat.label} {formatEffect(effect)}
                        </span>
                      );
                    })}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <HistoryPanel content={content} history={history} />
        </div>
      ) : null}
    </section>
  );
}

function HistoryPanel({ content, history }: { content: MicroSimPlayContent; history: HistoryItem[] }) {
  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history>
      <p className="text-sm font-semibold">오늘의 선택 로그</p>
      {history.length ? (
        <ol className="mt-3 space-y-3">
          {history.map((item, index) => (
            <li key={`${item.turnTitle}-${index}`} className="rounded-sm border bg-background p-2.5">
              <p className="text-xs text-muted-foreground">{item.turnTitle}</p>
              <p className="mt-1 text-sm font-medium">{item.choiceLabel}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {content.stats.map((stat) => {
                  const effect = item.effects[stat.key] ?? 0;
                  if (!effect) return null;
                  return (
                    <span key={stat.key} className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {stat.label} {formatEffect(effect)}
                    </span>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">선택을 시작하면 이곳에 하루의 경로가 쌓입니다.</p>
      )}
    </aside>
  );
}
