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
    detail: "얇은 종이표에서 별 즉석 표식을 확인",
    symbols: ["별", "달", "잎", "종"],
    instantSymbol: "별",
    instantPrize: 1,
    linePrize: 5,
  },
  {
    id: "silver",
    title: "2단계 은박 칸",
    detail: "은박 칸에서 7 표식과 같은 그림 줄을 확인",
    symbols: ["별", "왕관", "열쇠", "7"],
    instantSymbol: "7",
    instantPrize: 3,
    linePrize: 9,
  },
  {
    id: "gold",
    title: "3단계 금박 전표",
    detail: "금박 전표에서 도장 표식과 줄 로그를 확인",
    symbols: ["왕관", "도장", "7", "종"],
    instantSymbol: "도장",
    instantPrize: 5,
    linePrize: 14,
  },
  {
    id: "stamp",
    title: "4단계 붉은 도장표",
    detail: "붉은 도장표에서 접힌 줄과 즉석 표식을 본다",
    symbols: ["도장", "열쇠", "7", "별"],
    instantSymbol: "도장",
    instantPrize: 7,
    linePrize: 20,
  },
  {
    id: "ledger-slip",
    title: "5단계 두꺼운 전표",
    detail: "두꺼운 전표에서 같은 그림 줄을 조용히 확인",
    symbols: ["금도장", "도장", "왕관", "7"],
    instantSymbol: "금도장",
    instantPrize: 10,
    linePrize: 35,
  },
];

type LotteryHistoryState = {
  history: Array<{ label: string; detail: string; score: number }>;
};

export type LotteryPlayState = LotteryHistoryState & {
  score: number;
  playTick: number;
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

export function lotteryShortStageTitle(title: string) {
  return title.replace(/^[0-9]단계\s*/, "");
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
  state.playTick += 1;
  state.focus = 100;
  if (cell.symbol === stage.instantSymbol) {
    state.lotteryLastPrize += stage.instantPrize;
    state.lotteryTotalPrize += stage.instantPrize;
    rememberLotteryHistory(state, {
      label: `${cell.symbol} 즉석`,
      detail: `${stage.title} 즉석 표식`,
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
  state.playTick += 1;
  state.lotteryStage = nextStage;
  state.lotteryCursor = 0;
  state.lotteryLastPrize = 0;
  state.focus = 100;
  state.lotteryDragTrail = [];
  state.lotteryCells = makeLotteryCells(content, nextStage, state.lotteryDraws);
  rememberLotteryHistory(state, {
    label: lotteryStageAt(nextStage).title,
    detail: `${previousStage.title}에서 이어짐`,
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
  const nextStage = lotteryStageAt((state.lotteryStage + 1) % lotteryStages.length);
  const stageShortTitle = lotteryShortStageTitle(stage.title);
  const nextStageShortTitle = lotteryShortStageTitle(nextStage.title);
  const stageIndexLabel = `${state.lotteryStage + 1}/${lotteryStages.length}`;
  const complete = lotteryTicketComplete(state);
  const winningLines = lotteryWinningLines(state);
  const winningCellIds = new Set(winningLines.flat());
  const revealedCount = lotteryRevealedCount(state);
  const progressHint =
    winningLines.length > 0
      ? `${winningLines.length}줄 보임 · 전표 먼저 확인`
      : `${stageShortTitle} 긁는 중 · 표식표 보고 결과 전표`;
  const completeLabel =
    winningLines.length > 0 ? `${winningLines.length}줄 확인` : state.lotteryLastPrize > 0 ? "이번 장 즉석 표식" : "이번 장 꽝";
  const newestScratch = state.lotteryDragTrail[0] ?? null;
  const activeScratchIndex = newestScratch ? lotteryCellIndexAt(state, newestScratch) : -1;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, lotteryCanvasWidth, 520);

  const paperTone = ctx.createRadialGradient(lotteryCanvasWidth / 2, 230, 40, lotteryCanvasWidth / 2, 230, 420);
  paperTone.addColorStop(0, "rgba(216,180,106,0.12)");
  paperTone.addColorStop(0.62, "rgba(106,160,168,0.06)");
  paperTone.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = paperTone;
  ctx.fillRect(0, 0, lotteryCanvasWidth, 520);

  ctx.fillStyle = "rgba(42,36,27,0.78)";
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

  const stageDotX = 56;
  const stageDotY = 91;
  for (let index = 0; index < lotteryStages.length; index += 1) {
    const x = stageDotX + index * 36;
    const isCurrent = index === state.lotteryStage;
    const isNext = index === (state.lotteryStage + 1) % lotteryStages.length;
    ctx.fillStyle = isCurrent ? accent : isNext ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.roundRect(x, stageDotY - 8, isCurrent ? 28 : 24, 16, 8);
    ctx.fill();
    ctx.fillStyle = isCurrent || isNext ? "#111827" : "rgba(248,250,252,0.7)";
    ctx.font = "900 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${index + 1}`, x + (isCurrent ? 14 : 12), stageDotY + 4);
  }

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.roundRect(250, 81, 286, 24, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(248,250,252,0.76)";
  ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`현재 ${stageIndexLabel} · 표식 ${stage.instantSymbol} · 결과 전표`, 264, 97, 254);

  ctx.textAlign = "right";
  ctx.fillStyle = accent;
  ctx.font = "900 18px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(`${revealedCount}/9`, lotteryCanvasWidth - 58, 55);
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(248,250,252,0.62)";
  ctx.fillText("열린 칸", lotteryCanvasWidth - 58, 77);

  ctx.fillStyle = "rgba(248,250,252,0.72)";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(progressHint, lotteryCanvasWidth / 2, 119);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(lotteryBoardX - 18, lotteryBoardY - 18, lotteryBoardWidth + 36, lotteryBoardHeight + 36, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();

  for (const cell of state.lotteryCells) {
    const isCursor = cell.id === state.lotteryCursor;
    const isFreshScratch = cell.id === activeScratchIndex;
    const isWinningCell = winningCellIds.has(cell.id);
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.beginPath();
    ctx.roundRect(cell.x + 5, cell.y + 7, lotteryCellSize, lotteryCellSize, 20);
    ctx.fill();

    const cardGradient = ctx.createLinearGradient(cell.x, cell.y, cell.x, cell.y + lotteryCellSize);
    if (cell.revealed) {
      cardGradient.addColorStop(0, "rgba(254,243,199,0.96)");
      cardGradient.addColorStop(1, "rgba(216,180,106,0.62)");
    } else {
      cardGradient.addColorStop(0, "rgba(235,229,213,0.94)");
      cardGradient.addColorStop(0.52, "rgba(174,166,150,0.78)");
      cardGradient.addColorStop(1, "rgba(92,84,72,0.82)");
    }
    ctx.fillStyle = cardGradient;
    ctx.beginPath();
    ctx.roundRect(cell.x, cell.y, lotteryCellSize, lotteryCellSize, 20);
    ctx.fill();

    ctx.strokeStyle = cell.revealed
      ? isWinningCell
        ? "rgba(250,204,21,0.98)"
        : isFreshScratch
          ? "rgba(56,189,248,0.95)"
          : "rgba(254,240,138,0.9)"
      : "rgba(255,255,255,0.34)";
    ctx.lineWidth = isWinningCell || isFreshScratch ? 3 : 2;
    ctx.stroke();

    if (isCursor) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(cell.x - 6, cell.y - 6, lotteryCellSize + 12, lotteryCellSize + 12, 24);
      ctx.stroke();
    }

    if (cell.revealed) {
      if (isFreshScratch) {
        ctx.fillStyle = "rgba(56,189,248,0.18)";
        ctx.beginPath();
        ctx.roundRect(cell.x + 8, cell.y + 8, lotteryCellSize - 16, lotteryCellSize - 16, 16);
        ctx.fill();
      }
      ctx.fillStyle = "#111827";
      ctx.font = "900 26px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cell.symbol.slice(0, 3), cell.x + lotteryCellSize / 2, cell.y + 58);
      ctx.fillStyle = cell.symbol === stage.instantSymbol ? danger : "rgba(17,24,39,0.58)";
      ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(isWinningCell ? "줄 확인" : cell.symbol === stage.instantSymbol ? "즉석 표식" : "열림", cell.x + lotteryCellSize / 2, cell.y + 82);
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
    ctx.fillStyle = "rgba(248,250,252,0.9)";
    state.lotteryDragTrail.slice(0, 8).forEach((point, index) => {
      const radius = Math.max(2, 6 - index * 0.45);
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    if (newestScratch) {
      ctx.fillStyle = "rgba(15,23,42,0.84)";
      ctx.beginPath();
      ctx.roundRect(clamp(newestScratch.x + 16, 36, lotteryCanvasWidth - 128), clamp(newestScratch.y + 16, 110, 430), 92, 28, 14);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("긁는 중", clamp(newestScratch.x + 62, 82, lotteryCanvasWidth - 82), clamp(newestScratch.y + 34, 128, 448));
    }
    ctx.restore();
  }

  for (const line of winningLines) {
    const first = state.lotteryCells[line[0]];
    const last = state.lotteryCells[line[line.length - 1]];
    if (!first || !last) continue;
    ctx.save();
    ctx.shadowColor = "rgba(250,204,21,0.8)";
    ctx.shadowBlur = 12;
    ctx.strokeStyle = "rgba(216,180,106,0.88)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(first.x + lotteryCellSize / 2, first.y + lotteryCellSize / 2);
    ctx.lineTo(last.x + lotteryCellSize / 2, last.y + lotteryCellSize / 2);
    ctx.stroke();
    const midX = (first.x + last.x + lotteryCellSize) / 2;
    const midY = (first.y + last.y + lotteryCellSize) / 2;
    ctx.fillStyle = "rgba(15,23,42,0.86)";
    ctx.beginPath();
    ctx.roundRect(midX - 36, midY - 14, 72, 28, 14);
    ctx.fill();
    ctx.fillStyle = primary;
    ctx.font = "900 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("줄 확인", midX, midY + 4);
    ctx.restore();
  }

  if (complete) {
    const bannerX = 178;
    const bannerY = 224;
    const bannerWidth = lotteryCanvasWidth - bannerX * 2;
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerWidth, 72, 20);
    ctx.fill();
    ctx.strokeStyle = state.lotteryLastPrize > 0 ? "rgba(250,204,21,0.85)" : "rgba(255,255,255,0.24)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = state.lotteryLastPrize > 0 ? accent : "rgba(248,250,252,0.86)";
    ctx.font = "900 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(completeLabel, lotteryCanvasWidth / 2, bannerY + 30);
    ctx.fillStyle = "rgba(248,250,252,0.72)";
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`전표를 읽고 멈춰도 됨 · 다음은 ${nextStageShortTitle}`, lotteryCanvasWidth / 2, bannerY + 52);
  }

  ctx.fillStyle = "rgba(15,23,42,0.56)";
  ctx.beginPath();
  ctx.roundRect(42, 468, lotteryCanvasWidth - 84, 34, 17);
  ctx.fill();
  ctx.fillStyle = "rgba(248,250,252,0.82)";
  ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  const status = complete
    ? `${completeLabel} · 전표 먼저`
    : winningLines.length > 0
      ? `${winningLines.length}줄 보임 · 전표 먼저`
      : `${stageShortTitle} 긁는 중 · 표식 ${stage.instantSymbol} 확인`;
  ctx.fillText(status, lotteryCanvasWidth / 2, 490);
}

function settleLotteryTicket(state: LotteryPlayState) {
  const stage = lotteryStageAt(state.lotteryStage);
  const winningLines = lotteryWinningLines(state);
  const linePrize = winningLines.length * stage.linePrize;
  if (linePrize > 0) {
    state.lotteryLastPrize += linePrize;
    state.lotteryTotalPrize += linePrize;
    rememberLotteryHistory(state, {
      label: `${winningLines.length}줄 확인`,
      detail: `${stage.title} 줄 전표`,
      score: linePrize,
    });
    return;
  }

  rememberLotteryHistory(state, {
    label: state.lotteryLastPrize > 0 ? "즉석 표식" : "꽝",
    detail: state.lotteryLastPrize > 0 ? "줄은 없고 즉석만" : "이번 장 전표 확인",
    score: 0,
  });
}

function rememberLotteryHistory(state: LotteryHistoryState, item: { label: string; detail: string; score: number }) {
  state.history = [item, ...state.history].slice(0, 8);
}
