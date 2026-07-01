"use client";

import * as React from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function statGoal(key: PlayStatKey) {
  return key === "workload" ? "낮을수록 오늘 닫힘" : "높을수록 여유";
}

function statRiskScore(key: PlayStatKey, value: number) {
  return key === "workload" ? value : 100 - value;
}

function statRiskLabel(key: PlayStatKey, value: number) {
  const risk = statRiskScore(key, value);
  if (risk >= 72) return "위험";
  if (risk >= 52) return "주의";
  return key === "workload" ? "관리됨" : "버팀";
}

function effectMeaning(key: PlayStatKey, value: number) {
  if (key === "workload") return value > 0 ? "부담 증가" : "부담 감소";
  if (key === "reputation") return value > 0 ? "신뢰 잔고 증가" : "신뢰 잔고 손상";
  return value > 0 ? "회복" : "소모";
}

function effectTone(key: PlayStatKey, value: number) {
  const isGood = key === "workload" ? value < 0 : value > 0;
  return isGood
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
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

function workdayStageLabel(turnIndex: number, totalTurns: number, isFinished: boolean) {
  if (isFinished) return "마감 정산";
  const ratio = (turnIndex + 1) / totalTurns;
  if (ratio <= 0.3) return "오전 전표";
  if (ratio <= 0.6) return "오후 전표";
  if (ratio < 1) return "퇴근 전표";
  return "마감 전표";
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
  const totalTurns = content.turns.length;
  const progressLabel = workdayStageLabel(turnIndex, totalTurns, isFinished);
  const timeLabel = isFinished ? "18:10 마감" : (currentTurn?.title.split(",")[0] ?? "대기");
  const mostPressingStat = [...content.stats].sort((a, b) => statRiskScore(b.key, stats[b.key]) - statRiskScore(a.key, stats[a.key]))[0];
  const riskLabel = mostPressingStat ? `${mostPressingStat.label} ${statRiskLabel(mostPressingStat.key, stats[mostPressingStat.key])}` : "대기";

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
    const text = ending ? `${content.shareText}\n마감 기록: ${ending.title}` : content.shareText;
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
    <section className="rounded-md border border-zinc-300 bg-zinc-50/80 shadow-sm dark:border-zinc-700 dark:bg-zinc-950/40" data-play-engine={content.slug}>
      <div className="border-b border-zinc-300 bg-zinc-100/80 px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900/60 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">퇴근 전표판</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="rounded-sm border border-zinc-300 bg-white/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950/60">
              <p className="text-xs text-muted-foreground">근무 시각</p>
              <p className="text-sm font-semibold tabular-nums">{timeLabel}</p>
            </div>
            <div className="rounded-sm border border-zinc-300 bg-white/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950/60">
              <p className="text-xs text-muted-foreground">가장 흔들림</p>
              <p className="text-sm font-semibold">{isFinished ? "정산 완료" : riskLabel}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-play-stats>
          {content.stats.map((stat) => (
            <div key={stat.key} className="rounded-sm border border-zinc-300 bg-white/80 p-3 dark:border-zinc-700 dark:bg-zinc-950/60">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium">{stat.label}</span>
                <span className="tabular-nums text-muted-foreground">{stats[stat.key]}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span>{statGoal(stat.key)}</span>
                <span>{statRiskLabel(stat.key, stats[stat.key])}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className={statTone(stat.key, stats[stat.key])} style={{ width: `${stats[stat.key]}%`, height: "100%" }} />
              </div>
            </div>
          ))}
        </div>
        <ResourceLedgerNote />
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          일더미는 낮을수록 퇴근선이 가까워지고, 몸 배터리·마음 여유·신뢰 잔고는 높을수록 하루를 버틸 여지가 남습니다. 현재 구간: {progressLabel}
        </p>
      </div>

      {ending ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]" data-play-result>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">퇴근 정산</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">{ending.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{ending.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={shareResult} data-play-share>
                <Share2 className="h-4 w-4" />
                {shareState === "copied" ? "기록 복사됨" : shareState === "shared" ? "공유 완료" : "퇴근 기록 공유"}
              </Button>
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                다시 하루 열기
              </Button>
            </div>
            <PlayResultLinks relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
          </div>
          <HistoryPanel content={content} history={history} />
        </div>
      ) : currentTurn ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]" data-play-state={currentTurn.id}>
          <div>
            <p className="text-xs font-medium text-muted-foreground">지금 온 전표</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">{currentTurn.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{currentTurn.situation}</p>
            <div className="mt-5 grid gap-3">
              {currentTurn.choices.map((choice, choiceIndex) => (
                <button
                  key={choice.label}
                  type="button"
                  data-play-action="choice"
                  data-play-choice-index={choiceIndex}
                  className="rounded-sm border border-zinc-300 border-l-4 border-l-zinc-500 bg-white/90 p-4 text-left transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700 dark:border-l-zinc-400 dark:bg-zinc-950/70 dark:hover:bg-zinc-900"
                  onClick={() => choose(choiceIndex)}
                >
                  <span className="block text-sm font-semibold">{choice.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">{choice.detail}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-sm border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">손익 도장</span>
                    {content.stats.map((stat) => {
                      const effect = choice.effects[stat.key] ?? 0;
                      if (!effect) return null;
                      return (
                        <span key={stat.key} className={`rounded-sm border px-2 py-1 text-xs ${effectTone(stat.key, effect)}`}>
                          {stat.label} {formatEffect(effect)} · {effectMeaning(stat.key, effect)}
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

function ResourceLedgerNote() {
  return (
    <div className="mt-3 grid gap-2 rounded-md border border-zinc-300/80 bg-zinc-50/80 p-3 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 sm:grid-cols-3">
      <div>
        <span className="block font-semibold text-red-700 dark:text-red-300">줄일 것</span>
        <span className="mt-1 block leading-5">부탁 범위가 커질수록 일더미가 붙습니다. 범위 확인과 비동기로 낮춥니다.</span>
      </div>
      <div>
        <span className="block font-semibold text-emerald-700 dark:text-emerald-300">지킬 것</span>
        <span className="mt-1 block leading-5">몸 배터리와 마음 여유가 바닥나면 좋은 신뢰 잔고도 오래 못 갑니다.</span>
      </div>
      <div>
        <span className="block font-semibold text-sky-700 dark:text-sky-300">빌릴 것</span>
        <span className="mt-1 block leading-5">혼자 버티기보다 도움 요청, 기록, 담당 확인으로 신뢰 잔고를 씁니다.</span>
      </div>
    </div>
  );
}

function HistoryPanel({ content, history }: { content: MicroSimPlayContent; history: HistoryItem[] }) {
  return (
    <aside className="rounded-sm border border-zinc-300 bg-zinc-100/60 p-3 dark:border-zinc-700 dark:bg-zinc-950/40" data-play-history>
      <p className="text-sm font-semibold">퇴근 기록지</p>
      {history.length ? (
        <ol className="mt-3 space-y-3">
          {history.map((item, index) => (
            <li key={`${item.turnTitle}-${index}`} className="rounded-sm border border-zinc-300 bg-white/80 p-2.5 dark:border-zinc-700 dark:bg-zinc-950/60">
              <p className="text-xs text-muted-foreground">{item.turnTitle}</p>
              <p className="mt-1 text-sm font-medium">{item.choiceLabel}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {content.stats.map((stat) => {
                  const effect = item.effects[stat.key] ?? 0;
                  if (!effect) return null;
                  return (
                    <span key={stat.key} className={`rounded-sm border px-1.5 py-0.5 text-xs ${effectTone(stat.key, effect)}`}>
                      {stat.label} {formatEffect(effect)} · {effectMeaning(stat.key, effect)}
                    </span>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">첫 전표를 처리하면 줄인 부탁, 지킨 시간, 빌린 도움 판단이 여기에 남습니다.</p>
      )}
    </aside>
  );
}
