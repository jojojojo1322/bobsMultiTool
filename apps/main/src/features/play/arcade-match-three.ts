import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pickLabel, pseudoRandom, type CanvasPoint } from "@/features/play/arcade-engine-utils";

const gemCanvasWidth = 720;

export const gemColumns = 6;
export const gemRows = 5;
export const gemCellSize = 54;
export const gemGap = 8;
export const gemBoardWidth = gemColumns * gemCellSize + (gemColumns - 1) * gemGap;
export const gemBoardHeight = gemRows * gemCellSize + (gemRows - 1) * gemGap;
export const gemBoardX = (gemCanvasWidth - gemBoardWidth) / 2;
export const gemBoardY = 70;

export type GemTile = {
  id: number;
  column: number;
  row: number;
  kind: number;
  label: string;
  good: boolean;
};

type GemCursorState = {
  gemTiles: GemTile[];
  gemCursor: number;
};

type GemDragState = {
  gemDragStart: CanvasPoint | null;
  gemDragCurrent: CanvasPoint | null;
  gemDragStartIndex: number | null;
};

type GemHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

export type GemSwapHint = {
  from: number;
  to: number;
  matches: number;
  goodMatches: number;
};

type GemPlayState = GemCursorState &
  GemDragState & {
    finished: boolean;
    elapsed: number;
    score: number;
    focus: number;
    actions: number;
    gemSelected: number | null;
    gemCombo: number;
    history: GemHistoryItem[];
  };

export function gemKindCount(content: ArcadeGameContent) {
  return Math.max(4, Math.min(6, content.arcade.goodLabels.length + content.arcade.badLabels.length));
}

export function gemIsGood(content: ArcadeGameContent, kind: number) {
  return kind < Math.max(2, Math.min(4, content.arcade.goodLabels.length));
}

export function gemLabel(content: ArcadeGameContent, kind: number) {
  const goodCount = Math.max(2, Math.min(4, content.arcade.goodLabels.length));
  if (kind < goodCount) return pickLabel(content.arcade.goodLabels, kind);
  return pickLabel(content.arcade.badLabels, kind - goodCount);
}

export function makeGemTile(content: ArcadeGameContent, column: number, row: number, kind: number, seed: number): GemTile {
  return {
    id: seed,
    column,
    row,
    kind,
    label: gemLabel(content, kind),
    good: gemIsGood(content, kind),
  };
}

export function makeGemTiles(content: ArcadeGameContent): GemTile[] {
  if (content.arcade.variant !== "match-three") return [];
  const tiles = new Array<GemTile>(gemColumns * gemRows);
  for (let row = 0; row < gemRows; row += 1) {
    for (let column = 0; column < gemColumns; column += 1) {
      const seed = content.slug.length * 97 + row * 37 + column * 19 + 5;
      const kind = pickGemKind(content, tiles, column, row, seed);
      tiles[gemIndex(column, row)] = makeGemTile(content, column, row, kind, seed);
    }
  }
  return tiles;
}

export function gemIndex(column: number, row: number) {
  if (column < 0 || column >= gemColumns || row < 0 || row >= gemRows) return -1;
  return row * gemColumns + column;
}

export function gemCellIndexAt(x: number, y: number) {
  if (x < gemBoardX || y < gemBoardY || x > gemBoardX + gemBoardWidth || y > gemBoardY + gemBoardHeight) return -1;
  const localX = x - gemBoardX;
  const localY = y - gemBoardY;
  const column = Math.floor(localX / (gemCellSize + gemGap));
  const row = Math.floor(localY / (gemCellSize + gemGap));
  const insideX = localX - column * (gemCellSize + gemGap);
  const insideY = localY - row * (gemCellSize + gemGap);
  if (insideX > gemCellSize || insideY > gemCellSize) return -1;
  return gemIndex(column, row);
}

export function gemCellCenter(index: number) {
  const column = index % gemColumns;
  const row = Math.floor(index / gemColumns);
  return {
    x: gemBoardX + column * (gemCellSize + gemGap) + gemCellSize / 2,
    y: gemBoardY + row * (gemCellSize + gemGap) + gemCellSize / 2,
  };
}

export function moveGemCursor(state: GemCursorState, delta: number) {
  const total = state.gemTiles.length;
  if (!total) return;
  state.gemCursor = (state.gemCursor + delta + total) % total;
}

export function updateGemSwap(content: ArcadeGameContent, state: GemPlayState, dt: number) {
  state.elapsed += dt;
  if (state.score >= content.arcade.targetScore || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

export function pressGemMain(content: ArcadeGameContent, state: GemPlayState) {
  if (state.gemSelected === null) {
    state.gemSelected = state.gemCursor;
    const target = findGemSwapTarget(state, state.gemCursor);
    if (target !== null) chooseGemTile(content, state, target);
    return;
  }
  chooseGemTile(content, state);
}

export function chooseGemTile(content: ArcadeGameContent, state: GemPlayState, index = state.gemCursor) {
  if (state.finished || !state.gemTiles[index]) return;
  state.gemCursor = index;
  if (state.gemSelected === null) {
    state.gemSelected = index;
    return;
  }
  if (state.gemSelected === index) {
    const target = findGemSwapTarget(state, index);
    if (target === null) {
      state.gemSelected = null;
      return;
    }
    index = target;
    state.gemCursor = target;
  }
  if (!areGemAdjacent(state.gemSelected, index)) {
    state.gemSelected = index;
    return;
  }

  commitGemSwap(content, state, state.gemSelected, index);
}

export function commitGemSwap(content: ArcadeGameContent, state: GemPlayState, first: number, second: number) {
  if (state.finished || !state.gemTiles[first] || !state.gemTiles[second] || !areGemAdjacent(first, second)) return;
  state.gemSelected = null;
  state.gemCursor = second;
  state.actions += 1;
  swapGemKinds(state.gemTiles, first, second);
  const matched = resolveGemMatches(content, state, true);
  if (!matched) {
    swapGemKinds(state.gemTiles, first, second);
    if (state.actions >= content.arcade.rounds || state.focus <= 0) state.finished = true;
  }
}

export function areGemAdjacent(first: number, second: number) {
  const a = { column: first % gemColumns, row: Math.floor(first / gemColumns) };
  const b = { column: second % gemColumns, row: Math.floor(second / gemColumns) };
  return Math.abs(a.column - b.column) + Math.abs(a.row - b.row) === 1;
}

export function swapGemKinds(tiles: GemTile[], first: number, second: number) {
  const a = tiles[first];
  const b = tiles[second];
  if (!a || !b) return;
  const aKind = a.kind;
  const aLabel = a.label;
  const aGood = a.good;
  a.kind = b.kind;
  a.label = b.label;
  a.good = b.good;
  b.kind = aKind;
  b.label = aLabel;
  b.good = aGood;
}

export function findGemSwapTarget(state: { gemTiles: GemTile[] }, index: number) {
  const column = index % gemColumns;
  const row = Math.floor(index / gemColumns);
  const candidates = [
    gemIndex(column + 1, row),
    gemIndex(column - 1, row),
    gemIndex(column, row + 1),
    gemIndex(column, row - 1),
  ].filter((candidate) => candidate >= 0 && state.gemTiles[candidate]);

  for (const candidate of candidates) {
    swapGemKinds(state.gemTiles, index, candidate);
    const matched = findGemMatches(state.gemTiles).size > 0;
    swapGemKinds(state.gemTiles, index, candidate);
    if (matched) return candidate;
  }
  return candidates[0] ?? null;
}

export function findGemSwapHint(state: { gemTiles: GemTile[] }) {
  let best: GemSwapHint | null = null;

  for (let row = 0; row < gemRows; row += 1) {
    for (let column = 0; column < gemColumns; column += 1) {
      const index = gemIndex(column, row);
      const candidates = [gemIndex(column + 1, row), gemIndex(column, row + 1)];
      for (const candidate of candidates) {
        if (candidate < 0 || !state.gemTiles[index] || !state.gemTiles[candidate]) continue;
        swapGemKinds(state.gemTiles, index, candidate);
        const matches = findGemMatches(state.gemTiles);
        const goodMatches = [...matches].filter((matchIndex) => state.gemTiles[matchIndex]?.good).length;
        swapGemKinds(state.gemTiles, index, candidate);

        if (!matches.size) continue;
        if (!best || matches.size > best.matches || (matches.size === best.matches && goodMatches > best.goodMatches)) {
          best = { from: index, to: candidate, matches: matches.size, goodMatches };
        }
      }
    }
  }

  return best;
}

export function gemTargetFromDrag(state: GemDragState, point = state.gemDragCurrent) {
  if (state.gemDragStartIndex === null || !state.gemDragStart || !point) return -1;
  const directIndex = gemCellIndexAt(point.x, point.y);
  if (directIndex >= 0 && areGemAdjacent(state.gemDragStartIndex, directIndex)) return directIndex;

  const dx = point.x - state.gemDragStart.x;
  const dy = point.y - state.gemDragStart.y;
  if (Math.hypot(dx, dy) < 14) return -1;
  const column = state.gemDragStartIndex % gemColumns;
  const row = Math.floor(state.gemDragStartIndex / gemColumns);
  if (Math.abs(dx) >= Math.abs(dy)) return gemIndex(column + (dx > 0 ? 1 : -1), row);
  return gemIndex(column, row + (dy > 0 ? 1 : -1));
}

export function clearGemDrag(state: GemDragState) {
  state.gemDragStart = null;
  state.gemDragCurrent = null;
  state.gemDragStartIndex = null;
}

export function findGemMatches(tiles: GemTile[]) {
  const matches = new Set<number>();
  for (let row = 0; row < gemRows; row += 1) {
    let runStart = 0;
    for (let column = 1; column <= gemColumns; column += 1) {
      const current = column < gemColumns ? tiles[gemIndex(column, row)]?.kind : -1;
      const previous = tiles[gemIndex(column - 1, row)]?.kind;
      if (current === previous) continue;
      if (column - runStart >= 3) {
        for (let matchColumn = runStart; matchColumn < column; matchColumn += 1) {
          matches.add(gemIndex(matchColumn, row));
        }
      }
      runStart = column;
    }
  }

  for (let column = 0; column < gemColumns; column += 1) {
    let runStart = 0;
    for (let row = 1; row <= gemRows; row += 1) {
      const current = row < gemRows ? tiles[gemIndex(column, row)]?.kind : -1;
      const previous = tiles[gemIndex(column, row - 1)]?.kind;
      if (current === previous) continue;
      if (row - runStart >= 3) {
        for (let matchRow = runStart; matchRow < row; matchRow += 1) {
          matches.add(gemIndex(column, matchRow));
        }
      }
      runStart = row;
    }
  }
  return matches;
}

export function collapseGemBoard(content: ArcadeGameContent, state: { actions: number; score: number; gemTiles: GemTile[] }, matches: Set<number>) {
  const nextTiles = state.gemTiles.slice();
  let fillSeed = state.actions * 101 + state.score * 13 + 31;
  for (let column = 0; column < gemColumns; column += 1) {
    const survivors: GemTile[] = [];
    for (let row = gemRows - 1; row >= 0; row -= 1) {
      const index = gemIndex(column, row);
      const tile = nextTiles[index];
      if (tile && !matches.has(index)) survivors.push(tile);
    }
    for (let row = gemRows - 1; row >= 0; row -= 1) {
      const existing = survivors[gemRows - 1 - row];
      const index = gemIndex(column, row);
      if (existing) {
        nextTiles[index] = { ...existing, column, row };
      } else {
        fillSeed += 17;
        const kind = Math.floor(pseudoRandom(fillSeed + column * 7 + row * 11) * gemKindCount(content));
        nextTiles[index] = makeGemTile(content, column, row, kind, fillSeed);
      }
    }
  }
  state.gemTiles = nextTiles;
}

function resolveGemMatches(content: ArcadeGameContent, state: GemPlayState, swapped = true) {
  const matches = findGemMatches(state.gemTiles);
  if (!matches.size) {
    if (swapped) {
      state.focus = clamp(state.focus - 8, 0, 100);
      state.gemCombo = 0;
      rememberGemHistory(state, {
        label: "헛손",
        detail: "셋이 안 맞음",
        score: -1,
      });
    }
    return false;
  }

  const matchedTiles = [...matches].map((index) => state.gemTiles[index]).filter(Boolean);
  const goodCount = matchedTiles.filter((tile) => tile.good).length;
  const badCount = matchedTiles.length - goodCount;
  const delta = Math.max(1, goodCount * 2 + Math.max(0, matches.size - 3) + state.gemCombo - badCount);
  state.score = Math.max(0, state.score + delta);
  state.focus = clamp(state.focus + Math.max(1, goodCount - badCount), 0, 100);
  state.gemCombo += 1;
  rememberGemHistory(state, {
    label: `${matches.size}개`,
    detail: badCount ? "잡말도 섞임" : "깔끔하게 맞음",
    score: delta,
  });
  collapseGemBoard(content, state, matches);

  const chain = findGemMatches(state.gemTiles);
  if (chain.size) {
    resolveGemMatches(content, state, false);
  }

  if (state.score >= content.arcade.targetScore || state.actions >= content.arcade.rounds || state.focus <= 0) {
    state.finished = true;
  }
  return true;
}

function rememberGemHistory(state: Pick<GemPlayState, "history">, item: GemHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function pickGemKind(content: ArcadeGameContent, tiles: GemTile[], column: number, row: number, seed: number) {
  const count = gemKindCount(content);
  for (let offset = 0; offset < count; offset += 1) {
    const kind = (Math.floor(pseudoRandom(seed + offset * 23) * count) + offset) % count;
    const left1 = tiles[gemIndex(column - 1, row)];
    const left2 = tiles[gemIndex(column - 2, row)];
    const up1 = tiles[gemIndex(column, row - 1)];
    const up2 = tiles[gemIndex(column, row - 2)];
    if (left1?.kind === kind && left2?.kind === kind) continue;
    if (up1?.kind === kind && up2?.kind === kind) continue;
    return kind;
  }
  return seed % count;
}
