import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pseudoRandom } from "@/features/play/arcade-engine-utils";

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
  flagged: boolean;
};

type MineCellState = {
  mineCells: MineCell[];
};

type MineCursorState = MineCellState & {
  mineCursor: number;
};

type MineHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type MinesweeperPlayState = MineCursorState & {
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  actions: number;
  history: MineHistoryItem[];
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
    flagged: false,
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

export function flaggedMineCount(state: MineCellState) {
  return state.mineCells.filter((cell) => cell.flagged && !cell.revealed).length;
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
    if (cell && !cell.revealed && !cell.flagged && !cell.mine) {
      state.mineCursor = index;
      return;
    }
  }
}

export function toggleMineFlag(state: MinesweeperPlayState, index = state.mineCursor) {
  const cell = state.mineCells[index];
  if (!cell || cell.revealed) return;
  state.mineCursor = index;
  cell.flagged = !cell.flagged;
  state.focus = clamp(state.focus + (cell.flagged ? 1 : -1), 0, 100);
  rememberMineHistory(state, {
    label: cell.flagged ? "표시" : "해제",
    detail: cell.flagged ? "의심 칸 보류" : "다시 볼 칸",
    score: 0,
  });
}

export function revealMineCell(content: ArcadeGameContent, state: MinesweeperPlayState, index = state.mineCursor) {
  const cell = state.mineCells[index];
  if (!cell) return;
  state.mineCursor = index;
  if (cell.flagged) {
    rememberMineHistory(state, {
      label: "표시",
      detail: "표시한 칸은 보류",
      score: 0,
    });
    return;
  }
  if (cell.revealed) {
    moveMineCursorToNextSafe(state);
    return;
  }

  state.actions += 1;
  if (cell.mine) {
    cell.revealed = true;
    state.score = Math.max(0, state.score - 3);
    state.focus = clamp(state.focus - 20, 0, 100);
    rememberMineHistory(state, {
      label: "펑",
      detail: "너무 빨리 눌렀음",
      score: -3,
    });
  } else {
    const opened = revealMineFlood(state, cell);
    const delta = cell.adjacent === 0 ? Math.min(6, 2 + opened) : 2 + Math.max(0, 3 - cell.adjacent);
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + (cell.adjacent === 0 ? 3 : 1), 0, 100);
    rememberMineHistory(state, {
      label: cell.adjacent === 0 ? "빈칸" : `${cell.adjacent}`,
      detail: cell.adjacent === 0 ? `${opened}칸 열림` : "숫자 확인",
      score: delta,
    });
    moveMineCursorToNextSafe(state);
  }

  finishMinesweeperIfNeeded(content, state);
}

export function updateMinesweeper(content: ArcadeGameContent, state: MinesweeperPlayState, dt: number) {
  state.elapsed += dt;
  finishMinesweeperIfNeeded(content, state);
}

function revealMineFlood(state: MineCellState, start: MineCell) {
  const queue = [start];
  const revealed = new Set<number>();
  while (queue.length) {
    const cell = queue.shift();
    if (!cell || cell.revealed || cell.flagged || cell.mine || revealed.has(cell.id)) continue;
    cell.revealed = true;
    revealed.add(cell.id);
    if (cell.adjacent === 0) {
      for (const neighbor of neighborCells(state.mineCells, cell.column, cell.row)) {
        if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine) queue.push(neighbor);
      }
    }
  }
  return revealed.size;
}

function finishMinesweeperIfNeeded(content: ArcadeGameContent, state: MinesweeperPlayState) {
  if (
    state.score >= content.arcade.targetScore ||
    revealedMineSafeCount(state) >= totalMineSafeCount(state) ||
    state.actions >= content.arcade.rounds ||
    state.focus <= 0 ||
    state.elapsed >= content.arcade.rounds * 5
  ) {
    state.finished = true;
  }
}

function rememberMineHistory(state: Pick<MinesweeperPlayState, "history">, item: MineHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function mineCellAt(cells: MineCell[], column: number, row: number) {
  if (column < 0 || column >= mineColumns || row < 0 || row >= mineRows) return undefined;
  return cells[row * mineColumns + column];
}
