import type { ArcadeGameContent } from "@/features/content/types";
import { pickLabel, type CanvasPoint, type CanvasRect } from "@/features/play/arcade-engine-utils";

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

type SumBoxDragState = {
  sumTiles: SumTile[];
  sumDragStart: CanvasPoint | null;
  sumDragCurrent: CanvasPoint | null;
  sumDragMoved: boolean;
  sumDragTileIds: number[];
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

export function rememberSumDragTile(state: Pick<SumBoxDragState, "sumTiles" | "sumDragTileIds">, index: number) {
  const tile = state.sumTiles[index];
  if (!tile || tile.cleared || state.sumDragTileIds.includes(index)) return;
  const currentSum = state.sumDragTileIds.reduce((sum, id) => sum + (state.sumTiles[id]?.value ?? 0), 0);
  if (currentSum >= 10 || currentSum + tile.value > 10) return;
  state.sumDragTileIds.push(index);
}

export function rememberSumDragSegment(state: Pick<SumBoxDragState, "sumTiles" | "sumDragTileIds">, from: CanvasPoint, to: CanvasPoint) {
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
}

function tileIntersectsRect(tile: SumTile, rect: CanvasRect) {
  const centerX = tile.x + tile.width / 2;
  const centerY = tile.y + tile.height / 2;
  return centerX >= rect.x && centerX <= rect.x + rect.width && centerY >= rect.y && centerY <= rect.y + rect.height;
}
