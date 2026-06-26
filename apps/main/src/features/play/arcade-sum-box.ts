import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pickLabel, type CanvasPoint, type CanvasRect } from "@/features/play/arcade-engine-utils";

const sumBoxCanvasWidth = 720;

export const sumBoxColumns = 9;
export const sumBoxRows = 6;
export const sumBoxGap = 8;
export const sumBoxStartX = 34;
export const sumBoxStartY = 78;
export const sumBoxTileHeight = 52;
export const sumBoxTileWidth = (sumBoxCanvasWidth - sumBoxStartX * 2 - sumBoxGap * (sumBoxColumns - 1)) / sumBoxColumns;
export const sumBoxBoardWidth = sumBoxColumns * sumBoxTileWidth + (sumBoxColumns - 1) * sumBoxGap;
export const sumBoxBoardHeight = sumBoxRows * sumBoxTileHeight + (sumBoxRows - 1) * sumBoxGap;
export const sumBoxTimeLimitSeconds = 60;

export type SumTile = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  label: string;
  selected: boolean;
  cleared: boolean;
};

type SumHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type SumBoxPlayState = SumBoxDragState & {
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  actions: number;
  sumCursor: number;
  history: SumHistoryItem[];
};

type SumBoxDragState = {
  sumTiles: SumTile[];
  sumDragStart: CanvasPoint | null;
  sumDragCurrent: CanvasPoint | null;
  sumDragMoved: boolean;
  sumDragTileIds: number[];
  sumDragBlockedTileId: number | null;
};

export function makeSumTiles(content: ArcadeGameContent): SumTile[] {
  if (content.arcade.variant !== "sum-box") return [];
  const values = [
    1, 9, 2, 8, 3, 7, 4, 6, 5, 5, 1, 4, 2, 6, 3, 7, 8, 5,
    9, 1, 6, 4, 8, 2, 7, 3, 5, 5, 2, 1, 9, 4, 6, 3, 7, 8,
    5, 1, 4, 2, 8, 6, 3, 7, 9, 1, 5, 5, 2, 8, 4, 6, 1, 9,
  ];
  return Array.from({ length: sumBoxColumns * sumBoxRows }, (_, index) => {
    const column = index % sumBoxColumns;
    const row = Math.floor(index / sumBoxColumns);
    const value = values[index % values.length] ?? 5;
    const labelSource = Number.isFinite(Number(content.arcade.goodLabels[index % content.arcade.goodLabels.length]))
      ? `${value}`
      : pickLabel(content.arcade.goodLabels, index);
    return {
      id: index,
      x: sumBoxStartX + column * (sumBoxTileWidth + sumBoxGap),
      y: sumBoxStartY + row * (sumBoxTileHeight + sumBoxGap),
      width: sumBoxTileWidth,
      height: sumBoxTileHeight,
      value,
      label: labelSource,
      selected: false,
      cleared: false,
    };
  });
}

export function selectedSum(state: { sumTiles: SumTile[] }) {
  return state.sumTiles.reduce((sum, tile) => sum + (!tile.cleared && tile.selected ? tile.value : 0), 0);
}

export function selectedSumTiles(state: { sumTiles: SumTile[] }) {
  return state.sumTiles.filter((tile) => !tile.cleared && tile.selected);
}

export function updateSumBox(content: ArcadeGameContent, state: SumBoxPlayState, dt: number) {
  state.elapsed += dt;
  const hasCombination = sumBoxCombinationHint(state).length > 0;
  if (
    !hasCombination &&
    state.score < content.arcade.targetScore &&
    state.actions < content.arcade.rounds &&
    !state.sumTiles.every((tile) => tile.cleared) &&
    state.history[0]?.label !== "남은 10 없음"
  ) {
    rememberSumHistory(state, {
      label: "남은 10 없음",
      detail: "판 종료",
      score: 0,
    });
  }
  if (
    state.score >= content.arcade.targetScore ||
    state.sumTiles.every((tile) => tile.cleared) ||
    !hasCombination ||
    state.actions >= content.arcade.rounds ||
    state.focus <= 0 ||
    state.elapsed >= sumBoxTimeLimitSeconds
  ) {
    state.finished = true;
  }
}

export function moveSumCursor(state: Pick<SumBoxPlayState, "sumTiles" | "sumCursor">, delta: number) {
  const tileCount = state.sumTiles.length;
  if (!tileCount || state.sumTiles.every((tile) => tile.cleared)) return;
  for (let step = 1; step <= tileCount; step += 1) {
    const next = (state.sumCursor + delta * step + tileCount * step) % tileCount;
    if (!state.sumTiles[next]?.cleared) {
      state.sumCursor = next;
      return;
    }
  }
}

export function chooseSumTile(content: ArcadeGameContent, state: SumBoxPlayState) {
  const tile = state.sumTiles[state.sumCursor];
  if (!tile || tile.cleared) {
    moveSumCursor(state, 1);
    return;
  }

  tile.selected = !tile.selected;
  const sum = selectedSum(state);
  if (sum === 10) {
    const cleared = clearSelectedSumTiles(state);
    state.actions += 1;
    const bonus = cleared.length >= 3 ? 1 : 0;
    state.score = Math.max(0, state.score + 5 + bonus);
    state.focus = clamp(state.focus + 4, 0, 100);
    rememberSumHistory(state, {
      label: cleared.map((item) => item.value).join(" + "),
      detail: "딱 10",
      score: 5 + bonus,
    });
    moveSumCursor(state, 1);
    if (state.score >= content.arcade.targetScore || state.sumTiles.every((item) => item.cleared)) state.finished = true;
    return;
  }

  if (sum > 10) {
    for (const item of state.sumTiles) item.selected = false;
    state.actions += 1;
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 7, 0, 100);
    rememberSumHistory(state, {
      label: `${sum}`,
      detail: "넘침",
      score: -1,
    });
    moveSumCursor(state, 1);
    return;
  }

  moveSumCursorToComplement(state);
}

export function commitDraggedSumTiles(content: ArcadeGameContent, state: SumBoxPlayState, tiles: SumTile[], blockedTile?: SumTile | null) {
  const activeTiles = tiles.filter((tile) => !tile.cleared);
  if (!activeTiles.length) return;

  for (const tile of state.sumTiles) tile.selected = false;
  for (const tile of activeTiles) tile.selected = true;

  const sum = sumTilesTotal(activeTiles);
  if (blockedTile && !blockedTile.cleared && !activeTiles.some((tile) => tile.id === blockedTile.id)) {
    const attemptedTiles = [...activeTiles, blockedTile];
    const attemptedSum = sumTilesTotal(attemptedTiles);
    for (const tile of state.sumTiles) tile.selected = false;
    state.actions += 1;
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 6, 0, 100);
    rememberSumHistory(state, {
      label: attemptedTiles.map((item) => item.value).join(" + "),
      detail: `${attemptedSum - 10} 넘침`,
      score: -1,
    });
    moveSumCursor(state, 1);
    if (state.actions >= content.arcade.rounds || state.focus <= 0) state.finished = true;
    return;
  }

  if (sum === 10) {
    const cleared = clearSelectedSumTiles(state);
    state.actions += 1;
    const bonus = cleared.length >= 3 ? 1 : 0;
    state.score = Math.max(0, state.score + 5 + bonus);
    state.focus = clamp(state.focus + 4, 0, 100);
    rememberSumHistory(state, {
      label: cleared.map((item) => item.value).join(" + "),
      detail: "쓸어서 10",
      score: 5 + bonus,
    });
    moveSumCursor(state, 1);
    if (state.score >= content.arcade.targetScore || state.sumTiles.every((item) => item.cleared)) state.finished = true;
    return;
  }

  for (const tile of state.sumTiles) tile.selected = false;
  state.actions += 1;
  const overflow = sum > 10;
  state.score = Math.max(0, state.score + (overflow ? -1 : 0));
  state.focus = clamp(state.focus + (overflow ? -6 : -2), 0, 100);
  rememberSumHistory(state, {
    label: activeTiles.map((item) => item.value).join(" + "),
    detail: overflow ? "넘침" : "모자람",
    score: overflow ? -1 : 0,
  });
  moveSumCursor(state, 1);
  if (state.actions >= content.arcade.rounds || state.focus <= 0) state.finished = true;
}

export function sumBoxSelectionSummary(state: { sumTiles: SumTile[] }, tiles: SumTile[]) {
  const tileIds = new Set(tiles.map((tile) => tile.id));
  const sum = sumTilesTotal(tiles);
  const neededValue = 10 - sum;
  const complementTileIds = new Set(
    sum > 0 && sum < 10
      ? state.sumTiles.filter((tile) => !tile.cleared && !tileIds.has(tile.id) && tile.value === neededValue).map((tile) => tile.id)
      : [],
  );
  const status = sum === 10 ? "딱 10" : sum > 10 ? `${sum - 10} 넘침` : sum > 0 ? `${neededValue} 더 필요` : "합 10 만들기";

  return {
    tileIds,
    sum,
    neededValue,
    complementTileIds,
    status,
  };
}

export function sumBoxCombinationHint(state: { sumTiles: SumTile[] }) {
  const combinations: Array<SumTile[] | null> = Array.from({ length: 11 }, () => null);
  combinations[0] = [];
  for (const tile of state.sumTiles) {
    if (tile.cleared || tile.value > 10) continue;
    for (let sum = 10; sum >= tile.value; sum -= 1) {
      const previous = combinations[sum - tile.value];
      if (!combinations[sum] && previous) combinations[sum] = [...previous, tile];
    }
  }
  return combinations[10] ?? [];
}

export function sumTileIndexAt(state: { sumTiles: SumTile[] }, x: number, y: number) {
  return state.sumTiles.findIndex((tile) => !tile.cleared && x >= tile.x && x <= tile.x + tile.width && y >= tile.y && y <= tile.y + tile.height);
}

export function sumDragRect(state: Pick<SumBoxDragState, "sumDragStart" | "sumDragCurrent">): CanvasRect | null {
  if (!state.sumDragStart || !state.sumDragCurrent) return null;
  const x = Math.min(state.sumDragStart.x, state.sumDragCurrent.x);
  const y = Math.min(state.sumDragStart.y, state.sumDragCurrent.y);
  const width = Math.abs(state.sumDragCurrent.x - state.sumDragStart.x);
  const height = Math.abs(state.sumDragCurrent.y - state.sumDragStart.y);
  return { x, y, width, height };
}

export function pointInSumBoard(point: CanvasPoint) {
  return (
    point.x >= sumBoxStartX - 12 &&
    point.x <= sumBoxStartX + sumBoxBoardWidth + 12 &&
    point.y >= sumBoxStartY - 12 &&
    point.y <= sumBoxStartY + sumBoxBoardHeight + 12
  );
}

export function rememberSumDragTile(state: Pick<SumBoxDragState, "sumTiles" | "sumDragTileIds" | "sumDragBlockedTileId">, index: number) {
  const tile = state.sumTiles[index];
  if (!tile || tile.cleared || state.sumDragTileIds.includes(index)) return;
  const currentSum = state.sumDragTileIds.reduce((sum, id) => sum + (state.sumTiles[id]?.value ?? 0), 0);
  if (currentSum >= 10 || currentSum + tile.value > 10) {
    state.sumDragBlockedTileId = index;
    return;
  }
  state.sumDragTileIds.push(index);
  state.sumDragBlockedTileId = null;
}

export function rememberSumDragSegment(state: Pick<SumBoxDragState, "sumTiles" | "sumDragTileIds" | "sumDragBlockedTileId">, from: CanvasPoint, to: CanvasPoint) {
  const rect = {
    x: Math.min(from.x, to.x) - 12,
    y: Math.min(from.y, to.y) - 12,
    width: Math.abs(to.x - from.x) + 24,
    height: Math.abs(to.y - from.y) + 24,
  };

  for (const tile of state.sumTiles) {
    if (!tile.cleared && tileIntersectsRect(tile, rect)) rememberSumDragTile(state, tile.id);
  }
}

export function sumDragTiles(state: SumBoxDragState) {
  if (state.sumDragTileIds.length) {
    return state.sumDragTileIds.map((id) => state.sumTiles[id]).filter((tile): tile is SumTile => Boolean(tile && !tile.cleared));
  }

  const rect = sumDragRect(state);
  if (!rect) return [];
  const paddedRect = {
    x: rect.x - 3,
    y: rect.y - 3,
    width: rect.width + 6,
    height: rect.height + 6,
  };
  return state.sumTiles.filter((tile) => !tile.cleared && tileIntersectsRect(tile, paddedRect));
}

export function sumTilesTotal(tiles: SumTile[]) {
  return tiles.reduce((sum, tile) => sum + tile.value, 0);
}

export function clearSumDrag(state: SumBoxDragState) {
  state.sumDragStart = null;
  state.sumDragCurrent = null;
  state.sumDragMoved = false;
  state.sumDragTileIds = [];
  state.sumDragBlockedTileId = null;
}

function moveSumCursorToComplement(state: Pick<SumBoxPlayState, "sumTiles" | "sumCursor">) {
  const sum = selectedSum(state);
  const target = 10 - sum;
  if (target <= 0) {
    moveSumCursor(state, 1);
    return;
  }
  const complement = state.sumTiles.findIndex((tile, index) => index !== state.sumCursor && !tile.cleared && !tile.selected && tile.value === target);
  if (complement >= 0) {
    state.sumCursor = complement;
    return;
  }
  moveSumCursor(state, 1);
}

function clearSelectedSumTiles(state: { sumTiles: SumTile[] }) {
  const selected = selectedSumTiles(state);
  for (const tile of selected) {
    tile.selected = false;
    tile.cleared = true;
  }
  return selected;
}

function rememberSumHistory(state: Pick<SumBoxPlayState, "history">, item: SumHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function tileIntersectsRect(tile: SumTile, rect: CanvasRect) {
  const centerX = tile.x + tile.width / 2;
  const centerY = tile.y + tile.height / 2;
  return centerX >= rect.x && centerX <= rect.x + rect.width && centerY >= rect.y && centerY <= rect.y + rect.height;
}
