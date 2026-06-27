import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pseudoRandom, type CanvasPoint } from "@/features/play/arcade-engine-utils";

const lotteryCanvasWidth = 720;

export const lotteryColumns = 3;
export const lotteryRows = 3;
export const lotteryCellSize = 104;
export const lotteryCellGap = 14;
export const lotteryBoardWidth = lotteryColumns * lotteryCellSize + (lotteryColumns - 1) * lotteryCellGap;
export const lotteryBoardHeight = lotteryRows * lotteryCellSize + (lotteryRows - 1) * lotteryCellGap;
export const lotteryBoardX = (lotteryCanvasWidth - lotteryBoardWidth) / 2;
export const lotteryBoardY = 126;

const lotteryLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type LotteryCell = {
  id: number;
  x: number;
  y: number;
  symbol: string;
  revealed: boolean;
};

export type LotteryStage = {
  id: string;
  title: string;
  detail: string;
  symbols: string[];
  instantSymbol: string;
  instantPrize: number;
  linePrize: number;
};

export const lotteryStages: LotteryStage[] = [
  {
    id: "paper",
    title: "1단계 종이 복권",
    detail: "같은 그림 한 줄이면 작은 당첨",
    symbols: ["별", "달", "잎", "종"],
    instantSymbol: "별",
    instantPrize: 1,
    linePrize: 5,
  },
  {
    id: "silver",
    title: "2단계 은색 칸",
    detail: "줄 당첨과 보너스 그림을 같이 본다",
    symbols: ["별", "왕관", "열쇠", "7"],
    instantSymbol: "7",
    instantPrize: 3,
    linePrize: 9,
  },
  {
    id: "gold",
    title: "3단계 금색 카드",
    detail: "가운데 줄과 대각선 보상이 커진다",
    symbols: ["왕관", "보석", "7", "종"],
    instantSymbol: "보석",
    instantPrize: 5,
    linePrize: 14,
  },
  {
    id: "neon",
    title: "4단계 네온 찬스",
    detail: "당첨 줄이 나오면 다음 장으로 바로 넘어간다",
    symbols: ["보석", "번개", "7", "별"],
    instantSymbol: "번개",
    instantPrize: 7,
    linePrize: 20,
  },
  {
    id: "jackpot",
    title: "5단계 잭팟 줄",
    detail: "세 칸이 맞으면 가장 큰 보상",
    symbols: ["잭팟", "보석", "왕관", "7"],
    instantSymbol: "잭팟",
    instantPrize: 10,
    linePrize: 35,
  },
];

type LotteryHistoryState = {
  history: Array<{ label: string; detail: string; score: number }>;
};

export type LotteryPlayState = LotteryHistoryState & {
  score: number;
  actions: number;
  focus: number;
  lotteryCells: LotteryCell[];
  lotteryCursor: number;
  lotteryStage: number;
  lotteryDraws: number;
  lotteryLastPrize: number;
  lotteryTotalPrize: number;
  lotteryDragTrail: CanvasPoint[];
};

export function lotteryStageAt(index: number) {
  return lotteryStages[clamp(index, 0, lotteryStages.length - 1)] ?? lotteryStages[0];
}

export function makeLotteryCells(content: ArcadeGameContent, stageIndex = 0, draw = 0): LotteryCell[] {
  const stage = lotteryStageAt(stageIndex);
  const seedBase = content.slug.length * 71 + stageIndex * 43 + draw * 131;
  const cells = Array.from({ length: lotteryColumns * lotteryRows }, (_, index) => {
    const column = index % lotteryColumns;
    const row = Math.floor(index / lotteryColumns);
    const symbolIndex = Math.floor(pseudoRandom(seedBase + index * 19) * stage.symbols.length) % stage.symbols.length;
    return {
      id: index,
      x: lotteryBoardX + column * (lotteryCellSize + lotteryCellGap),
      y: lotteryBoardY + row * (lotteryCellSize + lotteryCellGap),
      symbol: stage.symbols[symbolIndex] ?? stage.symbols[0] ?? "별",
      revealed: false,
    };
  });

  if (draw % 3 === 1) {
    const line = lotteryLines[Math.floor(pseudoRandom(seedBase + 991) * lotteryLines.length) % lotteryLines.length] ?? lotteryLines[0];
    const symbol = stage.symbols[Math.floor(pseudoRandom(seedBase + 997) * stage.symbols.length) % stage.symbols.length] ?? stage.instantSymbol;
    for (const index of line) {
      if (cells[index]) cells[index].symbol = symbol;
    }
  }

  if (draw % 5 === 4) {
    const index = Math.floor(pseudoRandom(seedBase + 313) * cells.length) % cells.length;
    if (cells[index]) cells[index].symbol = stage.instantSymbol;
  }

  return cells;
}

export function lotteryCellIndexAt(state: { lotteryCells: LotteryCell[] }, point: CanvasPoint) {
  return state.lotteryCells.findIndex(
    (cell) =>
      point.x >= cell.x &&
      point.x <= cell.x + lotteryCellSize &&
      point.y >= cell.y &&
      point.y <= cell.y + lotteryCellSize,
  );
}

export function moveLotteryCursor(state: Pick<LotteryPlayState, "lotteryCells" | "lotteryCursor">, delta: number) {
  const count = state.lotteryCells.length;
  if (!count) return;
  state.lotteryCursor = (state.lotteryCursor + delta + count * Math.abs(delta || 1)) % count;
}

export function clearLotteryDragTrail(state: Pick<LotteryPlayState, "lotteryDragTrail">) {
  state.lotteryDragTrail = [];
}

export function rememberLotteryDragPoint(state: Pick<LotteryPlayState, "lotteryDragTrail">, point: CanvasPoint) {
  const previous = state.lotteryDragTrail[0];
  if (previous && Math.hypot(previous.x - point.x, previous.y - point.y) < 8) return;
  state.lotteryDragTrail = [point, ...state.lotteryDragTrail].slice(0, 18);
}

export function scratchLotteryAt(content: ArcadeGameContent, state: LotteryPlayState, point: CanvasPoint) {
  const index = lotteryCellIndexAt(state, point);
  const cell = state.lotteryCells[index];
  if (!cell || lotteryTicketComplete(state)) return false;
  state.lotteryCursor = index;
  rememberLotteryDragPoint(state, point);
  if (cell.revealed) return false;
  revealLotteryCell(content, state, index, { advanceWhenComplete: false });
  return true;
}

export function revealLotteryCell(
  content: ArcadeGameContent,
  state: LotteryPlayState,
  index = state.lotteryCursor,
  options: { advanceWhenComplete?: boolean } = {},
) {
  const cell = state.lotteryCells[index];
  if (!cell) return;
  if (lotteryTicketComplete(state)) {
    if (options.advanceWhenComplete !== false) nextLotteryTicket(content, state);
    return;
  }
  if (cell.revealed) {
    moveLotteryCursor(state, 1);
    return;
  }

  const stage = lotteryStageAt(state.lotteryStage);
  cell.revealed = true;
  state.actions += 1;
  state.focus = 100;
  if (cell.symbol === stage.instantSymbol) {
    state.lotteryLastPrize += stage.instantPrize;
    state.lotteryTotalPrize += stage.instantPrize;
    state.score = state.lotteryTotalPrize;
    rememberLotteryHistory(state, {
      label: `${cell.symbol} 즉석`,
      detail: `${stage.title} +${stage.instantPrize}`,
      score: stage.instantPrize,
    });
  }

  if (lotteryTicketComplete(state)) {
    settleLotteryTicket(state);
    return;
  }

  moveLotteryCursor(state, 1);
}

export function lotteryTicketComplete(state: Pick<LotteryPlayState, "lotteryCells">) {
  return state.lotteryCells.length > 0 && state.lotteryCells.every((cell) => cell.revealed);
}

export function nextLotteryTicket(content: ArcadeGameContent, state: LotteryPlayState) {
  const previousStage = lotteryStageAt(state.lotteryStage);
  const nextStage = (state.lotteryStage + 1) % lotteryStages.length;
  state.lotteryDraws += 1;
  state.lotteryStage = nextStage;
  state.lotteryCursor = 0;
  state.lotteryLastPrize = 0;
  state.lotteryDragTrail = [];
  state.lotteryCells = makeLotteryCells(content, nextStage, state.lotteryDraws);
  rememberLotteryHistory(state, {
    label: lotteryStageAt(nextStage).title,
    detail: `${previousStage.title} 다음 장`,
    score: 0,
  });
}

export function lotteryRevealedCount(state: Pick<LotteryPlayState, "lotteryCells">) {
  return state.lotteryCells.filter((cell) => cell.revealed).length;
}

export function lotteryWinningLines(state: Pick<LotteryPlayState, "lotteryCells">) {
  return lotteryLines.filter((line) => {
    const cells = line.map((index) => state.lotteryCells[index]);
    if (!cells.every((cell) => cell?.revealed)) return false;
    const symbols = cells.map((cell) => cell?.symbol);
    return symbols.every(Boolean) && symbols.every((symbol) => symbol === symbols[0]);
  });
}

export function drawLottery(content: ArcadeGameContent, state: LotteryPlayState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const stage = lotteryStageAt(state.lotteryStage);
  const revealed = lotteryRevealedCount(state);
  const complete = lotteryTicketComplete(state);
  const winningLines = lotteryWinningLines(state);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, lotteryCanvasWidth, 520);

  const glow = ctx.createRadialGradient(lotteryCanvasWidth / 2, 230, 40, lotteryCanvasWidth / 2, 230, 380);
  glow.addColorStop(0, "rgba(255,255,255,0.12)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, lotteryCanvasWidth, 520);

  ctx.fillStyle = "rgba(15,23,42,0.42)";
  ctx.beginPath();
  ctx.roundRect(34, 22, lotteryCanvasWidth - 68, 74, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(stage.title, 56, 55);
  ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(248,250,252,0.68)";
  ctx.fillText(stage.detail, 56, 78);

  ctx.textAlign = "right";
  ctx.fillStyle = accent;
  ctx.font = "900 18px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(`${state.lotteryTotalPrize}`, lotteryCanvasWidth - 58, 55);
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(248,250,252,0.62)";
  ctx.fillText("누적 당첨", lotteryCanvasWidth - 58, 77);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(lotteryBoardX - 18, lotteryBoardY - 18, lotteryBoardWidth + 36, lotteryBoardHeight + 36, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();

  for (const line of winningLines) {
    const first = state.lotteryCells[line[0]];
    const last = state.lotteryCells[line[line.length - 1]];
    if (!first || !last) continue;
    ctx.strokeStyle = "rgba(250,204,21,0.74)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(first.x + lotteryCellSize / 2, first.y + lotteryCellSize / 2);
    ctx.lineTo(last.x + lotteryCellSize / 2, last.y + lotteryCellSize / 2);
    ctx.stroke();
    ctx.lineCap = "butt";
  }

  for (const cell of state.lotteryCells) {
    const isCursor = cell.id === state.lotteryCursor;
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.beginPath();
    ctx.roundRect(cell.x + 5, cell.y + 7, lotteryCellSize, lotteryCellSize, 20);
    ctx.fill();

    const cardGradient = ctx.createLinearGradient(cell.x, cell.y, cell.x, cell.y + lotteryCellSize);
    if (cell.revealed) {
      cardGradient.addColorStop(0, "rgba(254,243,199,0.96)");
      cardGradient.addColorStop(1, "rgba(251,191,36,0.62)");
    } else {
      cardGradient.addColorStop(0, "rgba(226,232,240,0.9)");
      cardGradient.addColorStop(0.52, "rgba(148,163,184,0.72)");
      cardGradient.addColorStop(1, "rgba(71,85,105,0.82)");
    }
    ctx.fillStyle = cardGradient;
    ctx.beginPath();
    ctx.roundRect(cell.x, cell.y, lotteryCellSize, lotteryCellSize, 20);
    ctx.fill();

    ctx.strokeStyle = cell.revealed ? "rgba(254,240,138,0.9)" : "rgba(255,255,255,0.34)";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isCursor) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cell.x - 6, cell.y - 6, lotteryCellSize + 12, lotteryCellSize + 12, 24);
      ctx.stroke();
    }

    if (cell.revealed) {
      ctx.fillStyle = "#111827";
      ctx.font = "900 26px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cell.symbol.slice(0, 3), cell.x + lotteryCellSize / 2, cell.y + 58);
      ctx.fillStyle = cell.symbol === stage.instantSymbol ? danger : "rgba(17,24,39,0.58)";
      ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(cell.symbol === stage.instantSymbol ? `즉석 +${stage.instantPrize}` : "공개", cell.x + lotteryCellSize / 2, cell.y + 82);
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      for (let offset = -lotteryCellSize; offset < lotteryCellSize; offset += 18) {
        ctx.beginPath();
        ctx.moveTo(cell.x + offset, cell.y + lotteryCellSize);
        ctx.lineTo(cell.x + offset + lotteryCellSize, cell.y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(15,23,42,0.82)";
      ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("긁기", cell.x + lotteryCellSize / 2, cell.y + 58);
    }
  }

  if (state.lotteryDragTrail.length > 1) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(56,189,248,0.58)";
    ctx.lineWidth = 16;
    ctx.beginPath();
    const newest = state.lotteryDragTrail[0];
    ctx.moveTo(newest.x, newest.y);
    for (const point of state.lotteryDragTrail.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(248,250,252,0.72)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(newest.x, newest.y);
    for (const point of state.lotteryDragTrail.slice(1)) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = "rgba(15,23,42,0.56)";
  ctx.beginPath();
  ctx.roundRect(42, 468, lotteryCanvasWidth - 84, 34, 17);
  ctx.fill();
  ctx.fillStyle = "rgba(248,250,252,0.82)";
  ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  const status = complete
    ? `이번 장 ${state.lotteryLastPrize} 당첨 · Space 또는 가운데 버튼으로 다음 복권`
    : `${revealed}/${state.lotteryCells.length}칸 공개 · 시간이나 목표 점수 없이 계속`;
  ctx.fillText(status, lotteryCanvasWidth / 2, 490);
}

function settleLotteryTicket(state: LotteryPlayState) {
  const stage = lotteryStageAt(state.lotteryStage);
  const winningLines = lotteryWinningLines(state);
  const linePrize = winningLines.length * stage.linePrize;
  if (linePrize > 0) {
    state.lotteryLastPrize += linePrize;
    state.lotteryTotalPrize += linePrize;
    state.score = state.lotteryTotalPrize;
    rememberLotteryHistory(state, {
      label: `${winningLines.length}줄 당첨`,
      detail: `${stage.title} +${linePrize}`,
      score: linePrize,
    });
    return;
  }

  rememberLotteryHistory(state, {
    label: "꽝",
    detail: "다음 장으로",
    score: 0,
  });
}

function rememberLotteryHistory(state: LotteryHistoryState, item: { label: string; detail: string; score: number }) {
  state.history = [item, ...state.history].slice(0, 8);
}
