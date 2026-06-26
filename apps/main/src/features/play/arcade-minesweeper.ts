import type { ArcadeGameContent } from "@/features/content/types";
import { pseudoRandom } from "@/features/play/arcade-engine-utils";

export const mineColumns = 9;
export const mineRows = 7;
export const mineCount = 10;
export const mineCellSize = 38;
export const mineGap = 4;
export const mineBoardX = 54;
export const mineBoardY = 74;
export const mineBoardWidth = mineColumns * mineCellSize + (mineColumns - 1) * mineGap;
export const mineBoardHeight = mineRows * mineCellSize + (mineRows - 1) * mineGap;

export type MineCell = {
  id: number;
  column: number;
  row: number;
  mine: boolean;
  adjacent: number;
  revealed: boolean;
};

type MineCellState = {
  mineCells: MineCell[];
};

type MineCursorState = MineCellState & {
  mineCursor: number;
};

export function makeMineCells(content: ArcadeGameContent): MineCell[] {
  const total = mineColumns * mineRows;
  const mines = new Set<number>();
  for (let attempt = 0; mines.size < mineCount && attempt < total * 5; attempt += 1) {
    const candidate = Math.floor(pseudoRandom(content.slug.length * 41 + attempt * 13 + 5) * total);
    if (candidate === 0 || candidate === 1 || candidate === mineColumns) continue;
    mines.add(candidate);
  }

  const cells = Array.from({ length: total }, (_, id) => ({
    id,
    column: id % mineColumns,
    row: Math.floor(id / mineColumns),
    mine: mines.has(id),
    adjacent: 0,
    revealed: false,
  }));

  for (const cell of cells) {
    if (cell.mine) continue;
    cell.adjacent = neighborMineCount(cells, cell.column, cell.row);
  }

  return cells;
}

export function mineCellIndexAt(x: number, y: number) {
  if (x < mineBoardX || y < mineBoardY || x > mineBoardX + mineBoardWidth || y > mineBoardY + mineBoardHeight) return -1;
  const localX = x - mineBoardX;
  const localY = y - mineBoardY;
  const column = Math.floor(localX / (mineCellSize + mineGap));
  const row = Math.floor(localY / (mineCellSize + mineGap));
  const insideCellX = localX - column * (mineCellSize + mineGap);
  const insideCellY = localY - row * (mineCellSize + mineGap);
  if (insideCellX > mineCellSize || insideCellY > mineCellSize) return -1;
  if (column < 0 || column >= mineColumns || row < 0 || row >= mineRows) return -1;
  return row * mineColumns + column;
}

export function neighborCells(cells: MineCell[], column: number, row: number) {
  const neighbors: MineCell[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (!dx && !dy) continue;
      const neighbor = mineCellAt(cells, column + dx, row + dy);
      if (neighbor) neighbors.push(neighbor);
    }
  }
  return neighbors;
}

function neighborMineCount(cells: MineCell[], column: number, row: number) {
  return neighborCells(cells, column, row).filter((cell) => cell.mine).length;
}

export function revealedMineSafeCount(state: MineCellState) {
  return state.mineCells.filter((cell) => cell.revealed && !cell.mine).length;
}

export function totalMineSafeCount(state: MineCellState) {
  return state.mineCells.filter((cell) => !cell.mine).length;
}

export function moveMineCursor(state: MineCursorState, delta: number) {
  const total = state.mineCells.length;
  if (!total) return;
  state.mineCursor = (state.mineCursor + delta + total) % total;
}

export function moveMineCursorToNextSafe(state: MineCursorState) {
  const total = state.mineCells.length;
  for (let step = 0; step < total; step += 1) {
    const index = (state.mineCursor + step) % total;
    const cell = state.mineCells[index];
    if (cell && !cell.revealed && !cell.mine) {
      state.mineCursor = index;
      return;
    }
  }
}

export function revealMineFlood(state: MineCellState, start: MineCell) {
  const queue = [start];
  const revealed = new Set<number>();
  while (queue.length) {
    const cell = queue.shift();
    if (!cell || cell.revealed || cell.mine || revealed.has(cell.id)) continue;
    cell.revealed = true;
    revealed.add(cell.id);
    if (cell.adjacent === 0) {
      for (const neighbor of neighborCells(state.mineCells, cell.column, cell.row)) {
        if (!neighbor.revealed && !neighbor.mine) queue.push(neighbor);
      }
    }
  }
  return revealed.size;
}

function mineCellAt(cells: MineCell[], column: number, row: number) {
  if (column < 0 || column >= mineColumns || row < 0 || row >= mineRows) return undefined;
  return cells[row * mineColumns + column];
}
