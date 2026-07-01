import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pointInRect, pseudoRandom, type CanvasPoint, type CanvasRect } from "@/features/play/arcade-engine-utils";

export const lotteryLedgerInitialGold = 120;
const lotteryLedgerRecoveryGold = 35;
const lotteryLedgerRecoveryDebt = 42;
const lotteryLedgerMaxLoans = 1;

const tierX = 42;
const tierY = 94;
const tierWidth = 138;
const tierHeight = 58;
const tierGap = 12;
const ticketX = 76;
const ticketY = 224;
const ticketCellWidth = 356;
const ticketCellHeight = 154;
const ledgerPanelX = 500;
const ledgerPanelY = 166;
const ledgerPanelWidth = 172;
const ledgerPanelHeight = 226;
const scratchRevealThreshold = 1;

export const lotteryLedgerTicketRect: CanvasRect = { x: ticketX, y: ticketY, width: ticketCellWidth, height: ticketCellHeight };
export const lotteryLedgerStopRect: CanvasRect = { x: 500, y: 402, width: 82, height: 54 };
export const lotteryLedgerLoanRect: CanvasRect = { x: 590, y: 402, width: 82, height: 54 };
export const lotteryLedgerMainRect: CanvasRect = { x: 500, y: 94, width: 172, height: 58 };

export type LotteryLedgerStatus = "idle" | "scratching" | "settled" | "bankrupt" | "stopped";

export type LotteryLedgerOutcome = {
  id: string;
  label: string;
  detail: string;
  probability: number;
  payout: number;
};

export type LotteryLedgerTier = {
  id: string;
  title: string;
  subtitle: string;
  cost: number;
  unlockGold: number;
  outcomes: LotteryLedgerOutcome[];
};

export type LotteryLedgerCell = {
  id: number;
  x: number;
  y: number;
  label: string;
  detail: string;
  revealed: boolean;
  scratch: number;
  scratchMarks: CanvasPoint[];
  kind: "result";
};

export type LotteryLedgerTicket = {
  id: number;
  tierIndex: number;
  cost: number;
  outcome: LotteryLedgerOutcome;
  cells: LotteryLedgerCell[];
  settled: boolean;
};

type LotteryLedgerHistoryState = {
  history: Array<{ label: string; detail: string; score: number }>;
};

export type LotteryLedgerPlayState = LotteryLedgerHistoryState & {
  finished: boolean;
  score: number;
  playTick: number;
  focus: number;
  lotteryLedgerGold: number;
  lotteryLedgerDebt: number;
  lotteryLedgerSelectedTier: number;
  lotteryLedgerDraws: number;
  lotteryLedgerTicket: LotteryLedgerTicket | null;
  lotteryLedgerStatus: LotteryLedgerStatus;
  lotteryLedgerLossStreak: number;
  lotteryLedgerLoans: number;
  lotteryLedgerLastNet: number;
  lotteryLedgerMessage: string;
};

export const lotteryLedgerTiers: LotteryLedgerTier[] = [
  {
    id: "level-one",
    title: "1단계 10금화",
    subtitle: "손실 낮음",
    cost: 10,
    unlockGold: 0,
    outcomes: [
      { id: "blank", label: "꽝", detail: "그냥 손실", probability: 0.25, payout: 0 },
      { id: "small-return", label: "조금 회수", detail: "일부 회수", probability: 0.2, payout: 6 },
      { id: "even", label: "본전", detail: "비용 회수", probability: 0.3, payout: 10 },
      { id: "small-win", label: "이익", detail: "조금 남김", probability: 0.2, payout: 15 },
      { id: "good-win", label: "큰 회수", detail: "한 번 크게 회수", probability: 0.05, payout: 30 },
    ],
  },
  {
    id: "level-two",
    title: "2단계 25금화",
    subtitle: "지갑 130 해금",
    cost: 25,
    unlockGold: 130,
    outcomes: [
      { id: "blank", label: "꽝", detail: "비용 손실", probability: 0.35, payout: 0 },
      { id: "partial", label: "조금 회수", detail: "손실 축소", probability: 0.25, payout: 14 },
      { id: "even", label: "본전", detail: "비용 회수", probability: 0.18, payout: 25 },
      { id: "medium-win", label: "이익", detail: "비용보다 남김", probability: 0.17, payout: 42 },
      { id: "good-win", label: "큰 회수", detail: "지갑 회복", probability: 0.05, payout: 95 },
    ],
  },
  {
    id: "level-three",
    title: "3단계 55금화",
    subtitle: "지갑 190 해금",
    cost: 55,
    unlockGold: 190,
    outcomes: [
      { id: "blank", label: "꽝", detail: "큰 손실", probability: 0.44, payout: 0 },
      { id: "partial", label: "조금 회수", detail: "일부 회수", probability: 0.26, payout: 28 },
      { id: "even", label: "본전", detail: "비용 회수", probability: 0.14, payout: 55 },
      { id: "large-win", label: "이익", detail: "빚도 줄이는 이익", probability: 0.13, payout: 105 },
      { id: "rare-win", label: "큰 회수", detail: "확률표 끝", probability: 0.03, payout: 320 },
    ],
  },
];

export function lotteryLedgerTierAt(index: number) {
  return lotteryLedgerTiers[clamp(index, 0, lotteryLedgerTiers.length - 1)] ?? lotteryLedgerTiers[0];
}

export function lotteryLedgerTierRectAt(index: number): CanvasRect {
  return {
    x: tierX + index * (tierWidth + tierGap),
    y: tierY,
    width: tierWidth,
    height: tierHeight,
  };
}

export function lotteryLedgerExpectedPayout(tier: LotteryLedgerTier) {
  return tier.outcomes.reduce((sum, outcome) => sum + outcome.probability * outcome.payout, 0);
}

export function lotteryLedgerExpectedNet(tier: LotteryLedgerTier) {
  return lotteryLedgerExpectedPayout(tier) - tier.cost;
}

export function lotteryLedgerLossChance(tier: LotteryLedgerTier) {
  return tier.outcomes.filter((outcome) => outcome.payout < tier.cost).reduce((sum, outcome) => sum + outcome.probability, 0);
}

export function shortLotteryLedgerTierTitle(tier: LotteryLedgerTier) {
  return tier.title;
}

type LotteryLedgerViewState = Pick<LotteryLedgerPlayState, "lotteryLedgerStatus" | "lotteryLedgerLoans" | "lotteryLedgerLossStreak"> & {
  lotteryLedgerTicket?: LotteryLedgerTicket | null;
  lotteryLedgerTicketActive?: boolean;
};

type LotteryLedgerGateState = Pick<LotteryLedgerPlayState, "lotteryLedgerGold" | "lotteryLedgerDebt" | "lotteryLedgerLossStreak">;

export function lotteryLedgerTierGateReason(state: LotteryLedgerGateState, index: number) {
  if (index <= 0) return "";
  const tier = lotteryLedgerTierAt(index);
  if (state.lotteryLedgerDebt > 0) return "빚 있으면 1단계만";
  if (state.lotteryLedgerLossStreak >= 2) return "손실 2장 뒤 1단계";
  if (state.lotteryLedgerGold < tier.unlockGold) return `지갑 ${tier.unlockGold}금화부터`;
  return "";
}

export function lotteryLedgerTierAvailable(state: LotteryLedgerGateState, index: number) {
  return lotteryLedgerTierGateReason(state, index) === "";
}

export function lotteryLedgerStatusText(state: LotteryLedgerViewState) {
  if (state.lotteryLedgerStatus === "stopped") return "멈춤";
  if (state.lotteryLedgerStatus === "bankrupt") return state.lotteryLedgerLoans < lotteryLedgerMaxLoans ? "재기자금 가능" : "파산 기록";
  if ((state.lotteryLedgerTicket && !state.lotteryLedgerTicket.settled) || state.lotteryLedgerTicketActive) return "은박 긁는 중";
  if (state.lotteryLedgerLossStreak >= 2) return "위험 단계 차단";
  return "확률표 확인";
}

export function lotteryLedgerActiveTicketComplete(state: LotteryLedgerPlayState) {
  return Boolean(state.lotteryLedgerTicket?.cells.every((cell) => cell.revealed));
}

export function lotteryLedgerRevealedCount(state: LotteryLedgerPlayState) {
  return state.lotteryLedgerTicket?.cells.filter((cell) => cell.revealed).length ?? 0;
}

export function lotteryLedgerMainActionLabel(
  state: Pick<LotteryLedgerPlayState, "lotteryLedgerStatus" | "lotteryLedgerLoans"> & {
    lotteryLedgerTicket?: LotteryLedgerTicket | null;
    lotteryLedgerTicketActive?: boolean;
  },
) {
  if (state.lotteryLedgerStatus === "bankrupt") return state.lotteryLedgerLoans < lotteryLedgerMaxLoans ? "재기자금" : "장부 닫기";
  if (state.lotteryLedgerStatus === "stopped") return "새 장부";
  if ((state.lotteryLedgerTicket && !state.lotteryLedgerTicket.settled) || state.lotteryLedgerTicketActive) return "긁기";
  return "한 장 사기";
}

export function moveLotteryLedgerTier(state: LotteryLedgerPlayState, delta: number) {
  selectLotteryLedgerTier(state, state.lotteryLedgerSelectedTier + delta);
}

export function selectLotteryLedgerTier(state: LotteryLedgerPlayState, index: number) {
  const nextIndex = clamp(index, 0, lotteryLedgerTiers.length - 1);
  const tier = lotteryLedgerTierAt(nextIndex);
  const gateReason = lotteryLedgerTierGateReason(state, nextIndex);
  if (gateReason) {
    state.lotteryLedgerMessage = `${shortLotteryLedgerTierTitle(tier)} 잠김 · ${gateReason}`;
    state.playTick += 1;
    return;
  }
  state.lotteryLedgerSelectedTier = nextIndex;
  state.lotteryLedgerMessage = `${shortLotteryLedgerTierTitle(tier)} 선택 · 비용 ${tier.cost} · 평균손익 ${formatSigned(lotteryLedgerExpectedNet(tier))} · 손실 ${percent(lotteryLedgerLossChance(tier))}`;
  state.playTick += 1;
}

export function lotteryLedgerCellIndexAt(state: LotteryLedgerPlayState, point: CanvasPoint) {
  return (
    state.lotteryLedgerTicket?.cells.findIndex(
      (cell) => point.x >= cell.x && point.x <= cell.x + ticketCellWidth && point.y >= cell.y && point.y <= cell.y + ticketCellHeight,
    ) ?? -1
  );
}

export function lotteryLedgerTierIndexAt(point: CanvasPoint) {
  return lotteryLedgerTiers.findIndex((_, index) => pointInRect(point, lotteryLedgerTierRectAt(index)));
}

export function lotteryLedgerPointAction(point: CanvasPoint) {
  if (pointInRect(point, lotteryLedgerMainRect)) return "main";
  if (pointInRect(point, lotteryLedgerStopRect)) return "stop";
  if (pointInRect(point, lotteryLedgerLoanRect)) return "loan";
  return null;
}

export function pressLotteryLedgerMain(content: ArcadeGameContent, state: LotteryLedgerPlayState) {
  if (state.lotteryLedgerStatus === "stopped") {
    resetLotteryLedgerSession(state);
    return;
  }
  if (state.lotteryLedgerStatus === "bankrupt") {
    takeLotteryLedgerRecovery(state);
    return;
  }
  if (state.lotteryLedgerTicket && !state.lotteryLedgerTicket.settled) {
    scratchNextLotteryLedgerCell(content, state);
    return;
  }
  buyLotteryLedgerTicket(content, state);
}

export function stopLotteryLedgerSession(state: LotteryLedgerPlayState) {
  state.lotteryLedgerStatus = "stopped";
  state.playTick += 1;
  state.score = state.lotteryLedgerGold - state.lotteryLedgerDebt - lotteryLedgerInitialGold;
  state.lotteryLedgerMessage =
    state.lotteryLedgerDebt > 0
      ? `멈춤 · 지갑 ${state.lotteryLedgerGold}, 빚 ${state.lotteryLedgerDebt}`
      : `멈춤 · 지갑 ${state.lotteryLedgerGold}`;
  rememberLotteryLedgerHistory(state, {
    label: "멈춤",
    detail: state.lotteryLedgerMessage,
    score: 0,
  });
  state.finished = true;
}

export function takeLotteryLedgerRecovery(state: LotteryLedgerPlayState) {
  if (state.lotteryLedgerStatus !== "bankrupt") {
    state.lotteryLedgerMessage = "재기자금은 금화가 부족해진 뒤에만 열립니다.";
    state.playTick += 1;
    rememberLotteryLedgerHistory(state, {
      label: "재기자금 보류",
      detail: state.lotteryLedgerMessage,
      score: 0,
    });
    return;
  }
  if (state.lotteryLedgerLoans >= lotteryLedgerMaxLoans) {
    state.lotteryLedgerStatus = "stopped";
    state.finished = true;
    state.lotteryLedgerMessage = "재기자금은 이미 사용했습니다. 장부를 닫습니다.";
    return;
  }
  state.playTick += 1;
  state.lotteryLedgerLoans += 1;
  state.lotteryLedgerGold += lotteryLedgerRecoveryGold;
  state.lotteryLedgerDebt += lotteryLedgerRecoveryDebt;
  state.lotteryLedgerSelectedTier = 0;
  state.lotteryLedgerLossStreak = 0;
  state.lotteryLedgerStatus = "idle";
  state.lotteryLedgerMessage = `재기자금 ${lotteryLedgerRecoveryGold}금화 · 빚 ${lotteryLedgerRecoveryDebt} · 10금화 복권만`;
  state.score = state.lotteryLedgerGold - state.lotteryLedgerDebt - lotteryLedgerInitialGold;
  rememberLotteryLedgerHistory(state, {
    label: "재기자금",
    detail: state.lotteryLedgerMessage,
    score: 0,
  });
}

export function revealLotteryLedgerCell(content: ArcadeGameContent, state: LotteryLedgerPlayState, index?: number) {
  const ticket = state.lotteryLedgerTicket;
  if (!ticket || ticket.settled) return;
  const targetIndex = index ?? ticket.cells.findIndex((cell) => !cell.revealed);
  const cell = ticket.cells[targetIndex];
  if (!cell || cell.revealed) return;
  cell.scratch = scratchRevealThreshold;
  cell.revealed = true;
  state.playTick += 1;
  state.focus = 100;
  state.lotteryLedgerMessage = `${cell.label} 열림 · ${cell.detail}`;
  if (lotteryLedgerActiveTicketComplete(state)) settleLotteryLedgerTicket(state);
}

export function scratchLotteryLedgerAt(content: ArcadeGameContent, state: LotteryLedgerPlayState, point: CanvasPoint) {
  const ticket = state.lotteryLedgerTicket;
  if (!ticket || ticket.settled) return false;
  const index = lotteryLedgerCellIndexAt(state, point);
  const cell = ticket.cells[index];
  if (!cell || cell.revealed) return false;
  cell.scratchMarks ??= [];
  cell.scratch ??= 0;
  const previousPoint = cell.scratchMarks[cell.scratchMarks.length - 1];
  const distance = previousPoint ? Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) : 0;
  const amount = previousPoint ? clamp(distance / 92, 0.04, 0.18) : 0.08;
  return scratchLotteryLedgerCell(content, state, index, amount, point);
}

function scratchNextLotteryLedgerCell(content: ArcadeGameContent, state: LotteryLedgerPlayState) {
  const ticket = state.lotteryLedgerTicket;
  if (!ticket || ticket.settled) return;
  const index = ticket.cells.findIndex((cell) => !cell.revealed);
  if (index < 0) return;
  scratchLotteryLedgerCell(content, state, index, 0.52);
}

function scratchLotteryLedgerCell(
  content: ArcadeGameContent,
  state: LotteryLedgerPlayState,
  index: number,
  amount: number,
  point?: CanvasPoint,
) {
  const ticket = state.lotteryLedgerTicket;
  const cell = ticket?.cells[index];
  if (!ticket || ticket.settled || !cell || cell.revealed) return false;
  cell.scratchMarks ??= [];
  cell.scratch ??= 0;
  if (point) {
    cell.scratchMarks = [...cell.scratchMarks.slice(-18), point];
  }
  cell.scratch = clamp(cell.scratch + amount, 0, scratchRevealThreshold);
  state.playTick += 1;
  state.focus = 100;
  state.lotteryLedgerStatus = "scratching";
  if (cell.scratch >= scratchRevealThreshold) {
    revealLotteryLedgerCell(content, state, index);
  } else {
    state.lotteryLedgerMessage = cell.scratch >= 0.6 ? "은박이 많이 벗겨졌습니다. 조금 더 긁으세요." : "은박을 문질러 긁으세요.";
  }
  return true;
}

export function drawLotteryLedger(content: ArcadeGameContent, state: LotteryLedgerPlayState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const selectedTier = lotteryLedgerTierAt(state.lotteryLedgerSelectedTier);
  const expectedNet = lotteryLedgerExpectedNet(selectedTier);
  const lossChance = lotteryLedgerLossChance(selectedTier);
  const ledgerNet = state.lotteryLedgerGold - state.lotteryLedgerDebt - lotteryLedgerInitialGold;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 720, 520);
  drawPaper(ctx, 28, 26, 664, 468, "#f5eddc", "#5b4634", 12);

  ctx.fillStyle = "#2f2419";
  ctx.font = "900 24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("금화 복권 손익장부", 48, 60);
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#6f5a44";
  ctx.fillText("확률표 먼저 보고 한 장씩 긁기", 48, 80);

  drawWalletStamp(ctx, 404, 38, "지갑", `${state.lotteryLedgerGold}`, primary);
  drawWalletStamp(ctx, 504, 38, "빚", `${state.lotteryLedgerDebt}`, state.lotteryLedgerDebt > 0 ? danger : "#70604c");
  drawWalletStamp(ctx, 604, 38, "손익", formatSigned(ledgerNet), ledgerNet >= 0 ? "#2f7d4f" : danger);

  lotteryLedgerTiers.forEach((tier, index) => drawTierSlip(ctx, tier, index, index === state.lotteryLedgerSelectedTier, state));

  drawTicketDesk(ctx, state);
  drawLedgerPanel(ctx, selectedTier, state, accent, danger, expectedNet, lossChance);
  drawLedgerButtons(ctx, state);

  ctx.fillStyle = "#2f2419";
  ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.lotteryLedgerMessage || "전표 선택 → 한 장 사기 → 은박 긁기", 360, 478, 616);
}

function buyLotteryLedgerTicket(content: ArcadeGameContent, state: LotteryLedgerPlayState) {
  const tier = lotteryLedgerTierAt(state.lotteryLedgerSelectedTier);
  const gateReason = lotteryLedgerTierGateReason(state, state.lotteryLedgerSelectedTier);
  if (gateReason) {
    state.lotteryLedgerSelectedTier = 0;
    state.lotteryLedgerMessage = `${shortLotteryLedgerTierTitle(tier)} 보류 · ${gateReason}`;
    state.playTick += 1;
    rememberLotteryLedgerHistory(state, { label: "단계 보류", detail: state.lotteryLedgerMessage, score: 0 });
    return;
  }
  if (state.lotteryLedgerGold < tier.cost) {
    state.lotteryLedgerStatus = "bankrupt";
    state.lotteryLedgerMessage =
      state.lotteryLedgerLoans < lotteryLedgerMaxLoans ? "금화 부족 · 재기자금은 한 번만 열립니다." : "금화 부족 · 장부를 닫아야 합니다.";
    state.playTick += 1;
    rememberLotteryLedgerHistory(state, { label: "파산선", detail: state.lotteryLedgerMessage, score: 0 });
    state.score = state.lotteryLedgerGold - state.lotteryLedgerDebt - lotteryLedgerInitialGold;
    return;
  }

  state.playTick += 1;
  state.lotteryLedgerGold -= tier.cost;
  state.lotteryLedgerDraws += 1;
  state.lotteryLedgerTicket = makeLotteryLedgerTicket(content, state, tier, state.lotteryLedgerSelectedTier);
  state.lotteryLedgerStatus = "scratching";
  state.lotteryLedgerMessage = `${shortLotteryLedgerTierTitle(tier)} · 은박을 긁으세요.`;
  state.score = state.lotteryLedgerGold - state.lotteryLedgerDebt - lotteryLedgerInitialGold;
  rememberLotteryLedgerHistory(state, {
    label: "한 장 삼",
    detail: `${shortLotteryLedgerTierTitle(tier)} · 비용 ${tier.cost} · 평균손익 ${formatSigned(lotteryLedgerExpectedNet(tier))} · 손실 ${percent(lotteryLedgerLossChance(tier))}`,
    score: -tier.cost,
  });
}

function settleLotteryLedgerTicket(state: LotteryLedgerPlayState) {
  const ticket = state.lotteryLedgerTicket;
  if (!ticket || ticket.settled) return;
  ticket.settled = true;
  const grossPayout = ticket.outcome.payout;
  const debtPayment = state.lotteryLedgerDebt > 0 ? Math.min(state.lotteryLedgerDebt, Math.floor(grossPayout * 0.4)) : 0;
  const walletPayout = grossPayout - debtPayment;
  state.lotteryLedgerDebt -= debtPayment;
  state.lotteryLedgerGold += walletPayout;
  const net = grossPayout - ticket.cost;
  state.lotteryLedgerLastNet = net;
  state.lotteryLedgerLossStreak = net < 0 ? state.lotteryLedgerLossStreak + 1 : 0;
  state.lotteryLedgerStatus = state.lotteryLedgerGold < lotteryLedgerTiers[0].cost ? "bankrupt" : "settled";
  if (!lotteryLedgerTierAvailable(state, state.lotteryLedgerSelectedTier)) state.lotteryLedgerSelectedTier = 0;
  state.lotteryLedgerMessage =
    debtPayment > 0
      ? `${ticket.outcome.label} · ${debtPayment}금화 빚 상환`
      : `${ticket.outcome.label} · 지급 ${grossPayout} · ${formatSigned(net)}`;
  state.score = state.lotteryLedgerGold - state.lotteryLedgerDebt - lotteryLedgerInitialGold;
  rememberLotteryLedgerHistory(state, {
    label: ticket.outcome.label,
    detail:
      debtPayment > 0
        ? `${ticket.outcome.detail} · 빚 상환 ${debtPayment} · 지갑 ${state.lotteryLedgerGold}`
        : `${ticket.outcome.detail} · 지갑 ${state.lotteryLedgerGold}`,
    score: net,
  });
}

function makeLotteryLedgerTicket(
  content: ArcadeGameContent,
  state: LotteryLedgerPlayState,
  tier: LotteryLedgerTier,
  tierIndex: number,
): LotteryLedgerTicket {
  const seed = content.slug.length * 911 + state.lotteryLedgerDraws * 177 + state.lotteryLedgerGold * 13 + state.lotteryLedgerDebt * 7;
  const roll = pseudoRandom(seed);
  let cumulative = 0;
  let outcome = tier.outcomes[tier.outcomes.length - 1] ?? tier.outcomes[0];
  for (const candidate of tier.outcomes) {
    cumulative += candidate.probability;
    if (roll <= cumulative) {
      outcome = candidate;
      break;
    }
  }

  const cells = [
    {
      id: 0,
      label: outcome.label,
      detail: `지급 ${outcome.payout} · 손익 ${formatSigned(outcome.payout - tier.cost)}`,
      kind: "result",
      revealed: false,
      scratch: 0,
      scratchMarks: [],
      x: ticketX,
      y: ticketY,
    },
  ] satisfies LotteryLedgerCell[];

  return {
    id: state.lotteryLedgerDraws,
    tierIndex,
    cost: tier.cost,
    outcome,
    cells,
    settled: false,
  };
}

function resetLotteryLedgerSession(state: LotteryLedgerPlayState) {
  state.playTick += 1;
  state.score = 0;
  state.focus = 100;
  state.lotteryLedgerGold = lotteryLedgerInitialGold;
  state.lotteryLedgerDebt = 0;
  state.lotteryLedgerSelectedTier = 0;
  state.lotteryLedgerDraws = 0;
  state.lotteryLedgerTicket = null;
  state.lotteryLedgerStatus = "idle";
  state.lotteryLedgerLossStreak = 0;
  state.lotteryLedgerLoans = 0;
  state.lotteryLedgerLastNet = 0;
  state.lotteryLedgerMessage = "새 손익장부 · 1단계 10금화부터 시작합니다.";
  state.finished = false;
  state.history = [];
}

function rememberLotteryLedgerHistory(state: LotteryLedgerHistoryState, item: { label: string; detail: string; score: number }) {
  state.history = [item, ...state.history].slice(0, 8);
}

function drawTierSlip(ctx: CanvasRenderingContext2D, tier: LotteryLedgerTier, index: number, selected: boolean, state: LotteryLedgerPlayState) {
  const rect = lotteryLedgerTierRectAt(index);
  const gateReason = lotteryLedgerTierGateReason(state, index);
  const disabled = Boolean(gateReason);
  drawPaper(ctx, rect.x, rect.y, rect.width, rect.height, selected ? "#fff6d8" : "#eadcc4", selected ? "#332518" : "#8a745d", 8);
  ctx.fillStyle = disabled ? "rgba(47,36,25,0.36)" : "#2f2419";
  ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(shortLotteryLedgerTierTitle(tier), rect.x + 12, tierY + 22, tierWidth - 24);
  ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = disabled ? "rgba(47,36,25,0.34)" : "#6f5a44";
  ctx.fillText(disabled ? gateReason : `비용 ${tier.cost} · 손실 ${percent(lotteryLedgerLossChance(tier))}`, rect.x + 12, tierY + 42, tierWidth - 24);
  if (selected) {
    ctx.strokeStyle = "#2f2419";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, tierY + 4, tierWidth - 8, tierHeight - 8, 6);
    ctx.stroke();
  }
}

function drawTicketDesk(ctx: CanvasRenderingContext2D, state: LotteryLedgerPlayState) {
  const ticket = state.lotteryLedgerTicket;
  drawPaper(ctx, 42, 166, 438, 282, "#fbf3df", "#7a6047", 10);
  ctx.fillStyle = "#2f2419";
  ctx.font = "900 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(ticket ? shortLotteryLedgerTierTitle(lotteryLedgerTierAt(ticket.tierIndex)) : "복권지", 58, 192);
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#7a6047";
  ctx.fillText(ticket ? `NO.${String(ticket.id).padStart(3, "0")}` : "복권 없음", 386, 192);

  if (!ticket) {
    ctx.fillStyle = "rgba(47,36,25,0.08)";
    ctx.beginPath();
    ctx.roundRect(70, 222, 356, 154, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(47,36,25,0.22)";
    ctx.setLineDash([7, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#5a432f";
    ctx.font = "900 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("한 장 사면 복권지가 여기 놓입니다.", 248, 286, 320);
    ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#7a6047";
    ctx.fillText("오른쪽 확률표를 먼저 보고 사세요.", 248, 316, 320);
    return;
  }

  for (const cell of ticket.cells) {
    ctx.fillStyle = "rgba(47,36,25,0.16)";
    ctx.beginPath();
    ctx.roundRect(cell.x + 3, cell.y + 5, ticketCellWidth, ticketCellHeight, 6);
    ctx.fill();

    ctx.fillStyle = "#fff9e7";
    ctx.beginPath();
    ctx.roundRect(cell.x, cell.y, ticketCellWidth, ticketCellHeight, 6);
    ctx.fill();
    ctx.strokeStyle = cell.revealed ? "#6d5238" : "#8c7b66";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (!cell.revealed) {
      ctx.fillStyle = "#b9aa92";
      ctx.beginPath();
      ctx.roundRect(cell.x, cell.y, ticketCellWidth, ticketCellHeight, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 2;
      for (let offset = -ticketCellWidth; offset < ticketCellWidth; offset += 16) {
        ctx.beginPath();
        ctx.moveTo(cell.x + offset, cell.y + ticketCellHeight);
        ctx.lineTo(cell.x + offset + ticketCellWidth, cell.y);
        ctx.stroke();
      }
      drawScratchMarks(ctx, cell);
      ctx.fillStyle = "rgba(255,249,231,0.75)";
      ctx.beginPath();
      const scratchProgress = cell.scratch ?? 0;
      ctx.roundRect(cell.x + 11, cell.y + ticketCellHeight - 15, (ticketCellWidth - 22) * scratchProgress, 7, 4);
      ctx.fill();
      ctx.fillStyle = "#3a3027";
      ctx.font = "900 20px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(scratchProgress >= 0.55 ? "조금 더 긁기" : "은박 긁기", cell.x + ticketCellWidth / 2, cell.y + 70);
      ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#5a432f";
      ctx.fillText("이 한 장에서 결과가 열립니다.", cell.x + ticketCellWidth / 2, cell.y + 96);
      continue;
    }

    ctx.fillStyle = "#2f2419";
    ctx.font = "900 38px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(cell.label, cell.x + ticketCellWidth / 2, cell.y + 68, ticketCellWidth - 24);
    ctx.font = "900 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#80664e";
    ctx.fillText(cell.detail, cell.x + ticketCellWidth / 2, cell.y + 106, ticketCellWidth - 24);
  }
}

function drawScratchMarks(ctx: CanvasRenderingContext2D, cell: LotteryLedgerCell) {
  const marks = cell.scratchMarks ?? [];
  if (!marks.length) return;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cell.x, cell.y, ticketCellWidth, ticketCellHeight, 6);
  ctx.clip();
  ctx.strokeStyle = "rgba(255,249,231,0.7)";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  for (const point of marks) {
    ctx.beginPath();
    ctx.moveTo(point.x - 18, point.y + 4);
    ctx.lineTo(point.x + 18, point.y - 4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLedgerPanel(
  ctx: CanvasRenderingContext2D,
  tier: LotteryLedgerTier,
  state: LotteryLedgerPlayState,
  accent: string,
  danger: string,
  expectedNet: number,
  lossChance: number,
) {
  drawPaper(ctx, ledgerPanelX, ledgerPanelY, ledgerPanelWidth, ledgerPanelHeight, "#efe2ca", "#7a6047", 8);
  ctx.fillStyle = "#2f2419";
  ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("확률표 먼저", ledgerPanelX + 14, ledgerPanelY + 26);
  ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#6f5a44";
  ctx.fillText(`${shortLotteryLedgerTierTitle(tier)} · ${tier.cost}금화`, ledgerPanelX + 14, ledgerPanelY + 46, ledgerPanelWidth - 28);
  ctx.fillText(`평균손익 ${formatSigned(expectedNet)} · 손실 ${percent(lossChance)}`, ledgerPanelX + 14, ledgerPanelY + 64, ledgerPanelWidth - 28);

  tier.outcomes.forEach((outcome, index) => {
    const y = ledgerPanelY + 88 + index * 22;
    const width = Math.max(6, Math.round(outcome.probability * 82));
    ctx.fillStyle = outcome.payout >= tier.cost ? accent : "rgba(116,84,56,0.35)";
    ctx.fillRect(ledgerPanelX + 14, y + 3, width, 7);
    ctx.fillStyle = "#2f2419";
    ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${outcome.label} ${percent(outcome.probability)}`, ledgerPanelX + 14, y, 92);
    ctx.textAlign = "right";
    ctx.fillText(`${outcome.payout}`, ledgerPanelX + ledgerPanelWidth - 14, y, 48);
    ctx.textAlign = "left";
  });

  if (state.lotteryLedgerTicket?.settled) {
    const ticket = state.lotteryLedgerTicket;
    ctx.fillStyle = ticket.outcome.payout >= ticket.cost ? "#2f7d4f" : danger;
    ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`결과 ${ticket.outcome.label} · ${formatSigned(ticket.outcome.payout - ticket.cost)}`, ledgerPanelX + 14, ledgerPanelY + ledgerPanelHeight - 36, ledgerPanelWidth - 28);
  }

  const warning =
    state.lotteryLedgerDebt > 0
      ? "빚 있으면 1단계만"
      : state.lotteryLedgerLossStreak >= 2
        ? "손실 2장 뒤 1단계"
        : "위험하면 멈춤";
  ctx.fillStyle = state.lotteryLedgerDebt > 0 || state.lotteryLedgerLossStreak >= 2 ? danger : "#6f5a44";
  ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(warning, ledgerPanelX + 14, ledgerPanelY + ledgerPanelHeight - 16, ledgerPanelWidth - 28);
}

function drawLedgerButtons(ctx: CanvasRenderingContext2D, state: LotteryLedgerPlayState) {
  drawPaper(ctx, lotteryLedgerMainRect.x, lotteryLedgerMainRect.y, lotteryLedgerMainRect.width, lotteryLedgerMainRect.height, "#fff6d8", "#7a6047", 8);
  drawPaper(ctx, lotteryLedgerStopRect.x, lotteryLedgerStopRect.y, lotteryLedgerStopRect.width, lotteryLedgerStopRect.height, "#eadcc4", "#7a6047", 7);
  drawPaper(
    ctx,
    lotteryLedgerLoanRect.x,
    lotteryLedgerLoanRect.y,
    lotteryLedgerLoanRect.width,
    lotteryLedgerLoanRect.height,
    state.lotteryLedgerLoans < lotteryLedgerMaxLoans && state.lotteryLedgerStatus === "bankrupt" ? "#fff0c2" : "#e2d5be",
    "#7a6047",
    7,
  );
  ctx.fillStyle = "#2f2419";
  ctx.font = "900 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  const mainLabel = lotteryLedgerMainActionLabel(state);
  ctx.fillText(mainLabel === "긁기" ? "은박 긁기" : mainLabel, lotteryLedgerMainRect.x + lotteryLedgerMainRect.width / 2, lotteryLedgerMainRect.y + 34);
  ctx.fillStyle = "#6f5a44";
  ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(shortLotteryLedgerTierTitle(lotteryLedgerTierAt(state.lotteryLedgerSelectedTier)), lotteryLedgerMainRect.x + lotteryLedgerMainRect.width / 2, lotteryLedgerMainRect.y + 50);
  ctx.fillStyle = "#2f2419";
  ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("멈춤", lotteryLedgerStopRect.x + lotteryLedgerStopRect.width / 2, lotteryLedgerStopRect.y + 32);
  ctx.fillText("재기자금", lotteryLedgerLoanRect.x + lotteryLedgerLoanRect.width / 2, lotteryLedgerLoanRect.y + 32);
}

function drawWalletStamp(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, value: string, color: string) {
  drawPaper(ctx, x, y, 88, 44, "#eadcc4", "#7a6047", 7);
  ctx.fillStyle = "#6f5a44";
  ctx.font = "700 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(label, x + 9, y + 16);
  ctx.fillStyle = color;
  ctx.font = "900 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(value, x + 9, y + 33, 70);
}

function drawPaper(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill: string, stroke: string, radius: number) {
  ctx.fillStyle = "rgba(47,36,25,0.16)";
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 4, width, height, radius);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function percent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function formatSigned(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}
