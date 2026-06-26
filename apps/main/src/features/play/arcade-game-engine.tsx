"use client";

import * as React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArcadeGameContent } from "@/features/content/types";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

const canvasWidth = 720;
const canvasHeight = 420;
const crossingLanes = [326, 274, 222, 170, 118, 66];
const crossingStartY = canvasHeight - 42;
const crossingStepX = 48;
const crossingStepY = 52;
const sumBoxColumns = 5;
const sumBoxRows = 4;
const sumBoxGap = 12;
const sumBoxTileWidth = (canvasWidth - 96 - sumBoxGap * (sumBoxColumns - 1)) / sumBoxColumns;
const sumBoxTileHeight = 54;
const sumBoxStartX = 48;
const sumBoxStartY = 82;
const snakeCellSize = 24;
const snakeColumns = 24;
const snakeRows = 14;
const snakeBoardX = (canvasWidth - snakeColumns * snakeCellSize) / 2;
const snakeBoardY = 58;
const snakeMoveInterval = 0.18;
const passwordDigitCount = 3;
const passwordDigitWidth = 88;
const passwordDigitHeight = 112;
const passwordDigitGap = 20;
const passwordDigitStartX = (canvasWidth - passwordDigitCount * passwordDigitWidth - (passwordDigitCount - 1) * passwordDigitGap) / 2;
const passwordDigitY = 142;
const passwordSubmitRect = { x: canvasWidth / 2 - 82, y: 286, width: 164, height: 44 };
const passwordKeypadX = 38;
const passwordKeypadY = 344;
const passwordKeypadWidth = 38;
const passwordKeypadHeight = 32;
const passwordKeypadGap = 8;
const gemColumns = 6;
const gemRows = 5;
const gemCellSize = 54;
const gemGap = 8;
const gemBoardWidth = gemColumns * gemCellSize + (gemColumns - 1) * gemGap;
const gemBoardHeight = gemRows * gemCellSize + (gemRows - 1) * gemGap;
const gemBoardX = (canvasWidth - gemBoardWidth) / 2;
const gemBoardY = 70;
const mineColumns = 9;
const mineRows = 7;
const mineCount = 10;
const mineCellSize = 38;
const mineGap = 4;
const mineBoardX = 54;
const mineBoardY = 74;
const stackerBoardX = 96;
const stackerBoardY = 48;
const stackerBoardWidth = 528;
const stackerBoardHeight = 322;
const stackerBlockHeight = 26;
const stackerBaseWidth = 216;
const stackerBaseY = stackerBoardY + stackerBoardHeight - stackerBlockHeight;
const stackerMinOverlap = 18;
const moleColumns = 3;
const moleRows = 3;
const moleHoleSize = 82;
const moleGap = 28;
const moleBoardWidth = moleColumns * moleHoleSize + (moleColumns - 1) * moleGap;
const moleBoardHeight = moleRows * moleHoleSize + (moleRows - 1) * moleGap;
const moleBoardX = 72;
const moleBoardY = 76;

type Sprite = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  good: boolean;
};

type Bullet = {
  x: number;
  y: number;
  vy: number;
};

type Brick = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  good: boolean;
  alive: boolean;
};

type SumTile = {
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

type SnakeDirection = "up" | "down" | "left" | "right";

type SnakeCell = {
  x: number;
  y: number;
};

type SnakeFood = SnakeCell & {
  label: string;
  good: boolean;
};

type PasswordAttempt = {
  guess: string;
  exact: number;
  near: number;
  hint: string;
  repeated: boolean;
};

type GemTile = {
  id: number;
  column: number;
  row: number;
  kind: number;
  label: string;
  good: boolean;
};

type MineCell = {
  id: number;
  column: number;
  row: number;
  mine: boolean;
  adjacent: number;
  revealed: boolean;
};

type StackerBlock = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  quality: "base" | "perfect" | "solid" | "thin" | "miss";
};

type MoleTarget = {
  id: number;
  hole: number;
  label: string;
  good: boolean;
  age: number;
  ttl: number;
};

type HistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type GameState = {
  started: boolean;
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  actions: number;
  playerX: number;
  playerY: number;
  playerVy: number;
  nextSpriteId: number;
  spawnTimer: number;
  bullets: Bullet[];
  sprites: Sprite[];
  bricks: Brick[];
  sumTiles: SumTile[];
  sumCursor: number;
  snake: SnakeCell[];
  snakeDirection: SnakeDirection;
  snakeNextDirection: SnakeDirection;
  snakeMoveTimer: number;
  snakeFood: SnakeFood;
  passwordGuess: number[];
  passwordSecret: number[];
  passwordCursor: number;
  passwordAttempts: PasswordAttempt[];
  gemTiles: GemTile[];
  gemCursor: number;
  gemSelected: number | null;
  gemCombo: number;
  mineCells: MineCell[];
  mineCursor: number;
  stackerBlocks: StackerBlock[];
  stackerActiveX: number;
  stackerActiveY: number;
  stackerActiveWidth: number;
  stackerDirection: number;
  stackerSpeed: number;
  stackerLayer: number;
  moleTargets: MoleTarget[];
  moleCursor: number;
  moleSpawnTimer: number;
  brickBallX: number;
  brickBallY: number;
  brickBallVx: number;
  brickBallVy: number;
  brickLaunched: boolean;
  history: HistoryItem[];
  lastFrame: number | null;
};

type ViewState = Pick<GameState, "started" | "finished" | "elapsed" | "score" | "focus" | "actions" | "history">;

function makeInitialState(content: ArcadeGameContent): GameState {
  const snake = makeSnake();
  return {
    started: false,
    finished: false,
    elapsed: 0,
    score: 0,
    focus: 100,
    actions: 0,
    playerX: canvasWidth / 2,
    playerY:
      content.arcade.variant === "runner" || content.arcade.variant === "flight"
        ? canvasHeight - 92
        : content.arcade.variant === "crossing"
          ? crossingStartY
          : canvasHeight - 56,
    playerVy: 0,
    nextSpriteId: 1,
    spawnTimer: 0,
    bullets: [],
    sprites: [],
    bricks: makeBricks(content),
    sumTiles: makeSumTiles(content),
    sumCursor: 0,
    snake,
    snakeDirection: "right",
    snakeNextDirection: "right",
    snakeMoveTimer: snakeMoveInterval,
    snakeFood: makeSnakeFood(content, 1, snake),
    passwordGuess: [1, 2, 3],
    passwordSecret: makePasswordSecret(content),
    passwordCursor: 0,
    passwordAttempts: [],
    gemTiles: makeGemTiles(content),
    gemCursor: 0,
    gemSelected: null,
    gemCombo: 0,
    mineCells: makeMineCells(content),
    mineCursor: 0,
    stackerBlocks: makeStackerBlocks(content),
    stackerActiveX: stackerBoardX + 4,
    stackerActiveY: stackerBaseY - stackerBlockHeight,
    stackerActiveWidth: stackerBaseWidth,
    stackerDirection: 1,
    stackerSpeed: 168,
    stackerLayer: 0,
    moleTargets: [],
    moleCursor: 4,
    moleSpawnTimer: 0,
    brickBallX: canvasWidth / 2,
    brickBallY: canvasHeight - 96,
    brickBallVx: 180,
    brickBallVy: -260,
    brickLaunched: false,
    history: [],
    lastFrame: null,
  };
}

function makeStackerBlocks(content: ArcadeGameContent): StackerBlock[] {
  if (content.arcade.variant !== "stacker") return [];
  return [
    {
      id: 0,
      x: canvasWidth / 2 - stackerBaseWidth / 2,
      y: stackerBaseY,
      width: stackerBaseWidth,
      height: stackerBlockHeight,
      label: "바닥",
      quality: "base",
    },
  ];
}

function makeMineCells(content: ArcadeGameContent): MineCell[] {
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

function gemKindCount(content: ArcadeGameContent) {
  return Math.max(4, Math.min(6, content.arcade.goodLabels.length + content.arcade.badLabels.length));
}

function gemIsGood(content: ArcadeGameContent, kind: number) {
  return kind < Math.max(2, Math.min(4, content.arcade.goodLabels.length));
}

function gemLabel(content: ArcadeGameContent, kind: number) {
  const goodCount = Math.max(2, Math.min(4, content.arcade.goodLabels.length));
  if (kind < goodCount) return pickLabel(content.arcade.goodLabels, kind);
  return pickLabel(content.arcade.badLabels, kind - goodCount);
}

function makeGemTile(content: ArcadeGameContent, column: number, row: number, kind: number, seed: number): GemTile {
  return {
    id: seed,
    column,
    row,
    kind,
    label: gemLabel(content, kind),
    good: gemIsGood(content, kind),
  };
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

function makeGemTiles(content: ArcadeGameContent): GemTile[] {
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

function makePasswordSecret(content: ArcadeGameContent): number[] {
  const digits: number[] = [];
  for (let attempt = 0; digits.length < passwordDigitCount && attempt < 40; attempt += 1) {
    const digit = Math.floor(pseudoRandom(content.slug.length * 53 + attempt * 17 + 7) * 10);
    if (!digits.includes(digit)) digits.push(digit);
  }
  while (digits.length < passwordDigitCount) digits.push((digits.length * 3 + 4) % 10);
  return digits;
}

function makeSnake(): SnakeCell[] {
  const headX = Math.floor(snakeColumns / 2);
  const headY = Math.floor(snakeRows / 2);
  return [
    { x: headX, y: headY },
    { x: headX - 1, y: headY },
    { x: headX - 2, y: headY },
  ];
}

function makeSnakeFood(content: ArcadeGameContent, seed: number, snake: SnakeCell[]): SnakeFood {
  const occupied = new Set(snake.map((cell) => `${cell.x}:${cell.y}`));
  for (let attempt = 0; attempt < snakeColumns * snakeRows; attempt += 1) {
    const rawSeed = seed * 37 + attempt * 11 + content.slug.length * 19;
    const x = Math.floor(pseudoRandom(rawSeed + 1) * snakeColumns);
    const y = Math.floor(pseudoRandom(rawSeed + 2) * snakeRows);
    if (occupied.has(`${x}:${y}`)) continue;
    const good = pseudoRandom(rawSeed + 3) > 0.22;
    return {
      x,
      y,
      good,
      label: pickLabel(good ? content.arcade.goodLabels : content.arcade.badLabels, seed + attempt),
    };
  }
  return {
    x: 0,
    y: 0,
    good: true,
    label: pickLabel(content.arcade.goodLabels, seed),
  };
}

function makeSumTiles(content: ArcadeGameContent): SumTile[] {
  if (content.arcade.variant !== "sum-box") return [];
  const values = [1, 9, 2, 8, 3, 7, 4, 6, 5, 5, 1, 4, 2, 6, 3, 7, 8, 5, 9, 5];
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

function makeBricks(content: ArcadeGameContent): Brick[] {
  if (content.arcade.variant !== "brick-breaker") return [];
  const columns = 5;
  const rows = 3;
  const gap = 10;
  const brickWidth = (canvasWidth - 96 - gap * (columns - 1)) / columns;
  const bricks: Brick[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const id = row * columns + column;
      const good = (row + column) % 3 !== 0;
      const labels = good ? content.arcade.goodLabels : content.arcade.badLabels;
      bricks.push({
        id,
        x: 48 + column * (brickWidth + gap),
        y: 58 + row * 42,
        width: brickWidth,
        height: 28,
        label: pickLabel(labels, id),
        good,
        alive: true,
      });
    }
  }
  return bricks;
}

function snapshot(state: GameState): ViewState {
  return {
    started: state.started,
    finished: state.finished,
    elapsed: state.elapsed,
    score: state.score,
    focus: state.focus,
    actions: state.actions,
    history: state.history,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pseudoRandom(seed: number) {
  const raw = Math.sin(seed * 9283.37) * 10000;
  return raw - Math.floor(raw);
}

function pickLabel(labels: string[], index: number) {
  return labels[index % labels.length] ?? "신호";
}

function addHistory(state: GameState, item: HistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function selectedSum(state: GameState) {
  return state.sumTiles.reduce((sum, tile) => sum + (!tile.cleared && tile.selected ? tile.value : 0), 0);
}

function selectedSumTiles(state: GameState) {
  return state.sumTiles.filter((tile) => !tile.cleared && tile.selected);
}

function sumTileIndexAt(state: GameState, x: number, y: number) {
  return state.sumTiles.findIndex((tile) => !tile.cleared && x >= tile.x && x <= tile.x + tile.width && y >= tile.y && y <= tile.y + tile.height);
}

function mineCellAt(cells: MineCell[], column: number, row: number) {
  if (column < 0 || column >= mineColumns || row < 0 || row >= mineRows) return undefined;
  return cells[row * mineColumns + column];
}

function mineCellIndexAt(x: number, y: number) {
  const boardWidth = mineColumns * mineCellSize + (mineColumns - 1) * mineGap;
  const boardHeight = mineRows * mineCellSize + (mineRows - 1) * mineGap;
  if (x < mineBoardX || y < mineBoardY || x > mineBoardX + boardWidth || y > mineBoardY + boardHeight) return -1;
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

function neighborCells(cells: MineCell[], column: number, row: number) {
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

function revealedMineSafeCount(state: GameState) {
  return state.mineCells.filter((cell) => cell.revealed && !cell.mine).length;
}

function totalMineSafeCount(state: GameState) {
  return state.mineCells.filter((cell) => !cell.mine).length;
}

function moveMineCursor(state: GameState, delta: number) {
  const total = state.mineCells.length;
  if (!total) return;
  state.mineCursor = (state.mineCursor + delta + total) % total;
}

function moveMineCursorToNextSafe(state: GameState) {
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

function revealMineFlood(state: GameState, start: MineCell) {
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

function revealMineCell(content: ArcadeGameContent, state: GameState, index = state.mineCursor) {
  const cell = state.mineCells[index];
  if (!cell) return;
  state.mineCursor = index;
  if (cell.revealed) {
    moveMineCursorToNextSafe(state);
    return;
  }

  state.actions += 1;
  if (cell.mine) {
    cell.revealed = true;
    state.score = Math.max(0, state.score - 3);
    state.focus = clamp(state.focus - 20, 0, 100);
    addHistory(state, {
      label: "펑",
      detail: "너무 빨리 눌렀음",
      score: -3,
    });
  } else {
    const opened = revealMineFlood(state, cell);
    const delta = cell.adjacent === 0 ? Math.min(6, 2 + opened) : 2 + Math.max(0, 3 - cell.adjacent);
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + (cell.adjacent === 0 ? 3 : 1), 0, 100);
    addHistory(state, {
      label: cell.adjacent === 0 ? "빈칸" : `${cell.adjacent}`,
      detail: cell.adjacent === 0 ? `${opened}칸 열림` : "숫자 확인",
      score: delta,
    });
    moveMineCursorToNextSafe(state);
  }

  const openedSafe = revealedMineSafeCount(state);
  if (state.score >= content.arcade.targetScore || openedSafe >= totalMineSafeCount(state) || state.actions >= content.arcade.rounds || state.focus <= 0) {
    state.finished = true;
  }
}

const snakeDirectionDeltas: Record<SnakeDirection, SnakeCell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function snakeDirectionFromAction(action: "left" | "right" | "main" | "up" | "down"): SnakeDirection | null {
  if (action === "up") return "up";
  if (action === "down") return "down";
  if (action === "left") return "left";
  if (action === "right") return "right";
  return null;
}

function isSnakeReverse(next: SnakeDirection, current: SnakeDirection) {
  return (
    (next === "up" && current === "down") ||
    (next === "down" && current === "up") ||
    (next === "left" && current === "right") ||
    (next === "right" && current === "left")
  );
}

function setSnakeDirection(state: GameState, direction: SnakeDirection) {
  if (isSnakeReverse(direction, state.snakeDirection)) return;
  state.snakeNextDirection = direction;
}

function nextSnakeHead(state: GameState, direction: SnakeDirection) {
  const head = state.snake[0] ?? { x: Math.floor(snakeColumns / 2), y: Math.floor(snakeRows / 2) };
  const delta = snakeDirectionDeltas[direction];
  return { x: head.x + delta.x, y: head.y + delta.y };
}

function isSnakeCellUnsafe(state: GameState, direction: SnakeDirection) {
  const head = nextSnakeHead(state, direction);
  if (head.x < 0 || head.x >= snakeColumns || head.y < 0 || head.y >= snakeRows) return true;
  return state.snake.slice(0, -1).some((cell) => cell.x === head.x && cell.y === head.y);
}

function snakeAutoSteerTowardFood(state: GameState) {
  const head = state.snake[0];
  if (!head) return;
  const dx = state.snakeFood.x - head.x;
  const dy = state.snakeFood.y - head.y;
  const horizontal: SnakeDirection = dx < 0 ? "left" : "right";
  const vertical: SnakeDirection = dy < 0 ? "up" : "down";
  const preferred =
    Math.abs(dx) >= Math.abs(dy)
      ? [horizontal, vertical, state.snakeDirection, "up", "right", "down", "left"]
      : [vertical, horizontal, state.snakeDirection, "up", "right", "down", "left"];

  for (const direction of [...new Set(preferred)] as SnakeDirection[]) {
    if (isSnakeReverse(direction, state.snakeDirection)) continue;
    if (isSnakeCellUnsafe(state, direction)) continue;
    setSnakeDirection(state, direction);
    return;
  }
}

function resetSnakeAfterCrash(content: ArcadeGameContent, state: GameState) {
  const snake = makeSnake();
  state.snake = snake;
  state.snakeDirection = "right";
  state.snakeNextDirection = "right";
  state.snakeMoveTimer = snakeMoveInterval;
  state.snakeFood = makeSnakeFood(content, state.actions + state.score + 17, snake);
}

function finishSnakeIfNeeded(content: ArcadeGameContent, state: GameState) {
  if (state.score >= content.arcade.targetScore || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function advanceSnake(content: ArcadeGameContent, state: GameState, countAction: boolean) {
  if (state.finished) return;
  const direction = isSnakeReverse(state.snakeNextDirection, state.snakeDirection) ? state.snakeDirection : state.snakeNextDirection;
  state.snakeDirection = direction;
  if (countAction) state.actions += 1;

  const head = nextSnakeHead(state, direction);
  const willEat = head.x === state.snakeFood.x && head.y === state.snakeFood.y;
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitWall = head.x < 0 || head.x >= snakeColumns || head.y < 0 || head.y >= snakeRows;
  const hitSelf = bodyToCheck.some((cell) => cell.x === head.x && cell.y === head.y);

  if (hitWall || hitSelf) {
    state.score = Math.max(0, state.score - 2);
    state.focus = clamp(state.focus - 16, 0, 100);
    addHistory(state, {
      label: hitWall ? "벽" : "꼬리",
      detail: hitWall ? "한 박자 늦음" : "욕심내다 꼬임",
      score: -2,
    });
    resetSnakeAfterCrash(content, state);
    finishSnakeIfNeeded(content, state);
    return;
  }

  const movedSnake = [head, ...state.snake];
  if (!willEat) {
    state.snake = movedSnake.slice(0, state.snake.length);
    finishSnakeIfNeeded(content, state);
    return;
  }

  const delta = state.snakeFood.good ? 4 : -3;
  state.score = Math.max(0, state.score + delta);
  state.focus = clamp(state.focus + (state.snakeFood.good ? 3 : -10), 0, 100);
  state.snake = state.snakeFood.good ? movedSnake : movedSnake.slice(0, Math.max(3, state.snake.length - 1));
  addHistory(state, {
    label: state.snakeFood.label,
    detail: state.snakeFood.good ? "잘 먹음" : "괜히 물었음",
    score: delta,
  });
  state.snakeFood = makeSnakeFood(content, state.actions + state.score + state.snake.length, state.snake);
  finishSnakeIfNeeded(content, state);
}

function passwordGuessText(state: GameState) {
  return state.passwordGuess.join("");
}

function movePasswordCursor(state: GameState, delta: number) {
  state.passwordCursor = (state.passwordCursor + delta + passwordDigitCount) % passwordDigitCount;
}

function adjustPasswordDigit(state: GameState, delta: number) {
  const current = state.passwordGuess[state.passwordCursor] ?? 0;
  state.passwordGuess[state.passwordCursor] = (current + delta + 10) % 10;
}

function setPasswordDigit(state: GameState, digit: number, advance: boolean) {
  state.passwordGuess[state.passwordCursor] = clamp(Math.floor(digit), 0, 9);
  if (advance) movePasswordCursor(state, 1);
}

function setPasswordDigitFromClick(state: GameState, digitIndex: number) {
  state.passwordCursor = clamp(digitIndex, 0, passwordDigitCount - 1);
  adjustPasswordDigit(state, 1);
}

function evaluatePasswordGuess(secret: number[], guess: number[]) {
  let exact = 0;
  const secretRemainder: number[] = [];
  const guessRemainder: number[] = [];
  for (let index = 0; index < passwordDigitCount; index += 1) {
    if (guess[index] === secret[index]) {
      exact += 1;
    } else {
      secretRemainder.push(secret[index] ?? -1);
      guessRemainder.push(guess[index] ?? -2);
    }
  }
  let near = 0;
  for (const digit of guessRemainder) {
    const matchIndex = secretRemainder.indexOf(digit);
    if (matchIndex >= 0) {
      near += 1;
      secretRemainder.splice(matchIndex, 1);
    }
  }
  return { exact, near };
}

function parsePasswordGuess(guess: string) {
  return guess.split("").map((digit) => Number(digit));
}

function isRepeatedPasswordGuess(state: GameState, guess: string) {
  return state.passwordAttempts.some((attempt) => attempt.guess === guess);
}

function candidateMatchesAttempts(candidate: number[], attempts: PasswordAttempt[]) {
  return attempts.every((attempt) => {
    const { exact, near } = evaluatePasswordGuess(candidate, parsePasswordGuess(attempt.guess));
    return exact === attempt.exact && near === attempt.near;
  });
}

function passwordCandidates(state: GameState) {
  const candidates: number[][] = [];
  for (let a = 0; a <= 9; a += 1) {
    for (let b = 0; b <= 9; b += 1) {
      if (b === a) continue;
      for (let c = 0; c <= 9; c += 1) {
        if (c === a || c === b) continue;
        const candidate = [a, b, c];
        if (candidateMatchesAttempts(candidate, state.passwordAttempts)) {
          candidates.push(candidate);
        }
      }
    }
  }
  return candidates;
}

function passwordDigitMarks(state: GameState) {
  const marks: Array<"unknown" | "candidate" | "absent"> = Array.from({ length: 10 }, () => "unknown");
  for (const attempt of state.passwordAttempts) {
    const digits = new Set(parsePasswordGuess(attempt.guess));
    if (attempt.exact === 0 && attempt.near === 0) {
      digits.forEach((digit) => {
        marks[digit] = "absent";
      });
      continue;
    }
    digits.forEach((digit) => {
      if (marks[digit] !== "absent") marks[digit] = "candidate";
    });
  }
  return marks;
}

function passwordHint(state: GameState, exact: number, near: number) {
  if (exact === passwordDigitCount) return "열림";
  if (exact === 0 && near === 0) return "숫자부터 다시 보는 게 낫습니다";
  if (exact === 2) return "한 자리만 더 맞추면 됩니다";
  if (near >= 2) return "숫자는 좋은데 자리가 어긋났습니다";
  const guessSum = state.passwordGuess.reduce((sum, digit) => sum + digit, 0);
  const secretSum = state.passwordSecret.reduce((sum, digit) => sum + digit, 0);
  if (guessSum < secretSum) return "합이 조금 낮습니다";
  if (guessSum > secretSum) return "합이 조금 높습니다";
  return "방향은 나쁘지 않습니다";
}

function submitPasswordGuess(content: ArcadeGameContent, state: GameState) {
  if (state.finished) return;
  state.actions += 1;
  const { exact, near } = evaluatePasswordGuess(state.passwordSecret, state.passwordGuess);
  const hint = passwordHint(state, exact, near);
  const guess = passwordGuessText(state);
  const solved = exact === passwordDigitCount;
  const repeated = isRepeatedPasswordGuess(state, guess);
  const delta = solved ? content.arcade.targetScore : Math.max(0, exact * 5 + near * 2 - (exact === 0 && near === 0 ? 1 : 0) - (repeated ? 3 : 0));

  state.score = solved ? content.arcade.targetScore : Math.max(state.score, delta);
  state.focus = clamp(state.focus + (solved ? 8 : repeated ? -13 : exact > 0 || near > 0 ? -4 : -9), 0, 100);
  state.passwordAttempts = [{ guess, exact, near, hint: repeated ? "이미 해본 번호입니다" : hint, repeated }, ...state.passwordAttempts].slice(0, 6);
  addHistory(state, {
    label: guess,
    detail: solved ? "번호가 열림" : repeated ? "반복해서 손해" : `${exact}자리, ${near}숫자`,
    score: solved ? content.arcade.targetScore : delta,
  });

  if (solved || state.actions >= content.arcade.rounds || state.focus <= 0) {
    state.finished = true;
  }
}

function passwordDigitIndexAt(x: number, y: number) {
  if (y < passwordDigitY || y > passwordDigitY + passwordDigitHeight) return -1;
  for (let index = 0; index < passwordDigitCount; index += 1) {
    const left = passwordDigitStartX + index * (passwordDigitWidth + passwordDigitGap);
    if (x >= left && x <= left + passwordDigitWidth) return index;
  }
  return -1;
}

function passwordKeypadDigitAt(x: number, y: number) {
  if (y < passwordKeypadY || y > passwordKeypadY + passwordKeypadHeight) return -1;
  for (let digit = 0; digit <= 9; digit += 1) {
    const left = passwordKeypadX + digit * (passwordKeypadWidth + passwordKeypadGap);
    if (x >= left && x <= left + passwordKeypadWidth) return digit;
  }
  return -1;
}

function digitFromKeyboardCode(code: string) {
  if (/^Digit\d$/.test(code)) return Number(code.slice(5));
  if (/^Numpad\d$/.test(code)) return Number(code.slice(6));
  return null;
}

function gemIndex(column: number, row: number) {
  if (column < 0 || column >= gemColumns || row < 0 || row >= gemRows) return -1;
  return row * gemColumns + column;
}

function gemCellIndexAt(x: number, y: number) {
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

function moveGemCursor(state: GameState, delta: number) {
  const total = state.gemTiles.length;
  if (!total) return;
  state.gemCursor = (state.gemCursor + delta + total) % total;
}

function areGemAdjacent(first: number, second: number) {
  const a = { column: first % gemColumns, row: Math.floor(first / gemColumns) };
  const b = { column: second % gemColumns, row: Math.floor(second / gemColumns) };
  return Math.abs(a.column - b.column) + Math.abs(a.row - b.row) === 1;
}

function swapGemKinds(tiles: GemTile[], first: number, second: number) {
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

function findGemSwapTarget(state: GameState, index: number) {
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

function findGemMatches(tiles: GemTile[]) {
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

function collapseGemBoard(content: ArcadeGameContent, state: GameState, matches: Set<number>) {
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

function resolveGemMatches(content: ArcadeGameContent, state: GameState, swapped = true) {
  const matches = findGemMatches(state.gemTiles);
  if (!matches.size) {
    if (swapped) {
      state.focus = clamp(state.focus - 8, 0, 100);
      state.gemCombo = 0;
      addHistory(state, {
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
  addHistory(state, {
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

function chooseGemTile(content: ArcadeGameContent, state: GameState, index = state.gemCursor) {
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

  const first = state.gemSelected;
  const second = index;
  state.gemSelected = null;
  state.actions += 1;
  swapGemKinds(state.gemTiles, first, second);
  const matched = resolveGemMatches(content, state, true);
  if (!matched) {
    swapGemKinds(state.gemTiles, first, second);
    if (state.actions >= content.arcade.rounds || state.focus <= 0) state.finished = true;
  }
}

function topStackerBlock(state: GameState) {
  return state.stackerBlocks[state.stackerBlocks.length - 1];
}

function resetStackerActiveFromTop(state: GameState) {
  const top = topStackerBlock(state);
  const width = top ? top.width : stackerBaseWidth;
  const y = top ? top.y - stackerBlockHeight : stackerBaseY - stackerBlockHeight;
  const fromLeft = state.stackerLayer % 2 === 0;
  state.stackerActiveWidth = width;
  state.stackerActiveY = y;
  state.stackerActiveX = fromLeft ? stackerBoardX : stackerBoardX + stackerBoardWidth - width;
  state.stackerDirection = fromLeft ? 1 : -1;
  state.stackerSpeed = 168 + Math.min(132, state.stackerLayer * 15);
}

function nudgeStacker(state: GameState, delta: number) {
  state.stackerActiveX = clamp(state.stackerActiveX + delta, stackerBoardX, stackerBoardX + stackerBoardWidth - state.stackerActiveWidth);
}

function finishStackerIfNeeded(content: ArcadeGameContent, state: GameState) {
  if (
    state.score >= content.arcade.targetScore ||
    state.actions >= content.arcade.rounds ||
    state.focus <= 0 ||
    state.elapsed >= content.arcade.rounds * 5 ||
    state.stackerActiveY <= stackerBoardY + 6
  ) {
    state.finished = true;
  }
}

function placeStackerBlock(content: ArcadeGameContent, state: GameState) {
  if (state.finished) return;
  const previous = topStackerBlock(state);
  if (!previous) return;

  state.actions += 1;
  const activeLeft = state.stackerActiveX;
  const activeRight = state.stackerActiveX + state.stackerActiveWidth;
  const overlapLeft = Math.max(activeLeft, previous.x);
  const overlapRight = Math.min(activeRight, previous.x + previous.width);
  const overlap = overlapRight - overlapLeft;
  const centerGap = Math.abs(activeLeft + state.stackerActiveWidth / 2 - (previous.x + previous.width / 2));

  if (overlap < stackerMinOverlap) {
    state.score = Math.max(0, state.score - 2);
    state.focus = clamp(state.focus - 18, 0, 100);
    addHistory(state, {
      label: "놓침",
      detail: "겹친 면이 거의 없음",
      score: -2,
    });
    state.stackerDirection *= -1;
    nudgeStacker(state, state.stackerDirection * 34);
    finishStackerIfNeeded(content, state);
    return;
  }

  const nearPerfect = centerGap <= 7 || overlap >= previous.width * 0.96;
  const placedWidth = nearPerfect ? Math.min(stackerBaseWidth, previous.width + 4) : overlap;
  const placedX = nearPerfect ? previous.x - Math.max(0, placedWidth - previous.width) / 2 : overlapLeft;
  const quality: StackerBlock["quality"] = nearPerfect ? "perfect" : overlap >= previous.width * 0.72 ? "solid" : "thin";
  const delta = nearPerfect ? 4 : quality === "solid" ? 3 : 2;
  const focusDelta = nearPerfect ? 5 : quality === "solid" ? 2 : -6;

  const block: StackerBlock = {
    id: state.stackerBlocks.length,
    x: clamp(placedX, stackerBoardX, stackerBoardX + stackerBoardWidth - placedWidth),
    y: previous.y - stackerBlockHeight,
    width: placedWidth,
    height: stackerBlockHeight,
    label: nearPerfect ? "딱" : pickLabel(quality === "thin" ? content.arcade.badLabels : content.arcade.goodLabels, state.actions),
    quality,
  };
  state.stackerBlocks.push(block);
  state.stackerLayer += 1;
  state.score = Math.max(0, state.score + delta);
  state.focus = clamp(state.focus + focusDelta, 0, 100);
  addHistory(state, {
    label: block.label,
    detail: nearPerfect ? "거의 가운데" : quality === "solid" ? "잘 겹침" : "아슬아슬",
    score: delta,
  });

  resetStackerActiveFromTop(state);
  finishStackerIfNeeded(content, state);
}

function moleHoleCenter(hole: number) {
  const column = hole % moleColumns;
  const row = Math.floor(hole / moleColumns);
  return {
    x: moleBoardX + column * (moleHoleSize + moleGap) + moleHoleSize / 2,
    y: moleBoardY + row * (moleHoleSize + moleGap) + moleHoleSize / 2,
  };
}

function moleHoleAt(x: number, y: number) {
  for (let hole = 0; hole < moleColumns * moleRows; hole += 1) {
    const center = moleHoleCenter(hole);
    const dx = (x - center.x) / (moleHoleSize / 2);
    const dy = (y - center.y) / (moleHoleSize / 2.5);
    if (dx * dx + dy * dy <= 1) return hole;
  }
  return -1;
}

function moveMoleCursor(state: GameState, delta: number) {
  const total = moleColumns * moleRows;
  state.moleCursor = (state.moleCursor + delta + total) % total;
}

function occupiedMoleHoles(state: GameState) {
  return new Set(state.moleTargets.map((target) => target.hole));
}

function spawnMoleTarget(content: ArcadeGameContent, state: GameState, preferredHole?: number) {
  const occupied = occupiedMoleHoles(state);
  const total = moleColumns * moleRows;
  let hole = typeof preferredHole === "number" && preferredHole >= 0 && !occupied.has(preferredHole) ? preferredHole : -1;
  for (let attempt = 0; hole < 0 && attempt < total; attempt += 1) {
    const candidate = Math.floor(pseudoRandom(state.nextSpriteId * 29 + content.slug.length * 17 + attempt * 11) * total);
    if (!occupied.has(candidate)) hole = candidate;
  }
  if (hole < 0) return;

  const seed = state.nextSpriteId + content.slug.length * 31;
  const good = pseudoRandom(seed + 4) > 0.34;
  const target: MoleTarget = {
    id: state.nextSpriteId,
    hole,
    label: pickLabel(good ? content.arcade.goodLabels : content.arcade.badLabels, state.nextSpriteId),
    good,
    age: 0,
    ttl: 1.05 + pseudoRandom(seed + 9) * 0.5,
  };
  state.nextSpriteId += 1;
  state.moleTargets = [...state.moleTargets, target].slice(-4);
}

function activeMoleAt(state: GameState, hole: number) {
  return state.moleTargets.find((target) => target.hole === hole);
}

function finishMoleIfNeeded(content: ArcadeGameContent, state: GameState) {
  if (state.score >= content.arcade.targetScore || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= 60) {
    state.finished = true;
  }
}

function whackMole(content: ArcadeGameContent, state: GameState, hole = state.moleCursor) {
  if (state.finished) return;
  state.moleCursor = hole;
  let target = activeMoleAt(state, hole);
  if (!target && !state.moleTargets.length) {
    spawnMoleTarget(content, state, hole);
    target = activeMoleAt(state, hole);
  }
  if (!target && state.moleTargets.length) {
    target = state.moleTargets[0];
    state.moleCursor = target.hole;
  }

  state.actions += 1;
  if (!target) {
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 5, 0, 100);
    addHistory(state, { label: "빈칸", detail: "한 박자 빨랐음", score: -1 });
    finishMoleIfNeeded(content, state);
    return;
  }

  state.moleTargets = state.moleTargets.filter((item) => item.id !== target.id);
  const delta = target.good ? 3 : -4;
  state.score = Math.max(0, state.score + delta);
  state.focus = clamp(state.focus + (target.good ? 3 : -11), 0, 100);
  addHistory(state, {
    label: target.label,
    detail: target.good ? "지금 볼 것만 잡음" : "굳이 잡았음",
    score: delta,
  });
  finishMoleIfNeeded(content, state);
}

function pointInRect(point: { x: number; y: number }, rect: { x: number; y: number; width: number; height: number }) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}

function canvasPointFromEvent(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvasWidth,
    y: ((event.clientY - rect.top) / rect.height) * canvasHeight,
  };
}

function moveSumCursor(state: GameState, delta: number) {
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

function moveSumCursorToComplement(state: GameState) {
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

function clearSelectedSumTiles(state: GameState) {
  const selected = selectedSumTiles(state);
  for (const tile of selected) {
    tile.selected = false;
    tile.cleared = true;
  }
  return selected;
}

function spawnSprite(content: ArcadeGameContent, state: GameState) {
  const seed = state.nextSpriteId + content.slug.length * 17;
  const good = pseudoRandom(seed) > 0.34;
  const label = pickLabel(good ? content.arcade.goodLabels : content.arcade.badLabels, state.nextSpriteId);
  const sideScroller = content.arcade.variant === "runner" || content.arcade.variant === "flight";
  const radius = 18 + Math.floor(pseudoRandom(seed + 2) * 8);
  const sprite: Sprite = sideScroller
    ? {
        id: state.nextSpriteId,
        x: canvasWidth + 40,
        y: canvasHeight - 76 - pseudoRandom(seed + 1) * 150,
        vx: -150 - pseudoRandom(seed + 3) * 90,
        vy: 0,
        radius,
        label,
        good,
      }
    : {
        id: state.nextSpriteId,
        x: 60 + pseudoRandom(seed + 1) * (canvasWidth - 120),
        y: -30,
        vx: (pseudoRandom(seed + 4) - 0.5) * 34,
        vy: 82 + pseudoRandom(seed + 3) * 68,
        radius,
        label,
        good,
      };

  state.nextSpriteId += 1;
  state.sprites.push(sprite);
}

function shouldUseSideScroller(content: ArcadeGameContent) {
  return content.arcade.variant === "runner" || content.arcade.variant === "flight";
}

function mainActionLabel(content: ArcadeGameContent) {
  if (shouldUseSideScroller(content)) return "점프";
  if (content.arcade.variant === "crossing") return "건너기";
  if (content.arcade.variant === "brick-breaker") return "치기";
  if (content.arcade.variant === "sum-box") return "고르기";
  if (content.arcade.variant === "snake") return "한 칸";
  if (content.arcade.variant === "password") return "확인";
  if (content.arcade.variant === "minesweeper") return "열기";
  if (content.arcade.variant === "match-three") return "고르기";
  if (content.arcade.variant === "stacker") return "쌓기";
  if (content.arcade.variant === "mole") return "잡기";
  if (content.arcade.variant === "memory") return "입력";
  return "발사";
}

function updateGame(content: ArcadeGameContent, state: GameState, keys: Set<string>, now: number) {
  if (state.finished) return;
  if (!state.started) {
    state.lastFrame = now;
    return;
  }

  const previousFrame = state.lastFrame ?? now;
  const dt = clamp((now - previousFrame) / 1000, 0, 0.04);
  state.lastFrame = now;

  if (content.arcade.variant === "brick-breaker") {
    updateBrickBreaker(content, state, keys, dt);
    return;
  }

  if (content.arcade.variant === "crossing") {
    updateCrossing(content, state, dt);
    return;
  }

  if (content.arcade.variant === "sum-box") {
    updateSumBox(content, state, dt);
    return;
  }

  if (content.arcade.variant === "snake") {
    updateSnake(content, state, dt);
    return;
  }

  if (content.arcade.variant === "password") {
    updatePassword(content, state, dt);
    return;
  }

  if (content.arcade.variant === "minesweeper") {
    updateMinesweeper(content, state, dt);
    return;
  }

  if (content.arcade.variant === "match-three") {
    updateGemSwap(content, state, dt);
    return;
  }

  if (content.arcade.variant === "stacker") {
    updateStacker(content, state, keys, dt);
    return;
  }

  if (content.arcade.variant === "mole") {
    updateMole(content, state, dt);
    return;
  }

  state.elapsed += dt;
  state.spawnTimer -= dt;

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const up = keys.has("ArrowUp") || keys.has("KeyW");
  const down = keys.has("ArrowDown") || keys.has("KeyS");

  if (left) state.playerX -= 280 * dt;
  if (right) state.playerX += 280 * dt;
  if (up && content.arcade.variant !== "runner") state.playerY -= 220 * dt;
  if (down && content.arcade.variant !== "runner") state.playerY += 220 * dt;
  state.playerX = clamp(state.playerX, 34, canvasWidth - 34);
  state.playerY = clamp(state.playerY, 48, canvasHeight - 42);

  if (content.arcade.variant === "runner" || content.arcade.variant === "flight") {
    const lift = keys.has("Space") || keys.has("Enter") || up;
    state.playerVy += (content.arcade.variant === "flight" && lift ? -760 : 680) * dt;
    if (content.arcade.variant === "runner") {
      state.playerVy += 420 * dt;
    }
    state.playerY += state.playerVy * dt;
    const floor = canvasHeight - 72;
    if (state.playerY > floor) {
      state.playerY = floor;
      state.playerVy = 0;
    }
    state.playerY = clamp(state.playerY, 44, floor);
  }

  if (state.spawnTimer <= 0) {
    spawnSprite(content, state);
    state.spawnTimer = shouldUseSideScroller(content) ? 0.82 : 0.56;
  }

  state.bullets = state.bullets
    .map((bullet) => ({ ...bullet, y: bullet.y + bullet.vy * dt }))
    .filter((bullet) => bullet.y > -20);

  state.sprites = state.sprites
    .map((sprite) => ({ ...sprite, x: sprite.x + sprite.vx * dt, y: sprite.y + sprite.vy * dt }))
    .filter((sprite) => {
      if (sprite.y > canvasHeight + 60 || sprite.x < -70) {
        if (sprite.good) state.focus = clamp(state.focus - 4, 0, 100);
        return false;
      }
      return true;
    });

  for (const bullet of state.bullets) {
    const hit = state.sprites.find((sprite) => Math.hypot(sprite.x - bullet.x, sprite.y - bullet.y) < sprite.radius + 8);
    if (!hit) continue;
    state.sprites = state.sprites.filter((sprite) => sprite.id !== hit.id);
    bullet.y = -999;
    const delta = hit.good ? 3 : -3;
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + (hit.good ? 2 : -8), 0, 100);
    addHistory(state, {
      label: hit.label,
      detail: hit.good ? "좋은 타이밍" : "괜히 건드림",
      score: delta,
    });
  }
  state.bullets = state.bullets.filter((bullet) => bullet.y > -50);

  for (const sprite of state.sprites) {
    const hitPlayer = Math.hypot(sprite.x - state.playerX, sprite.y - state.playerY) < sprite.radius + 20;
    if (!hitPlayer) continue;
    state.sprites = state.sprites.filter((item) => item.id !== sprite.id);
    const delta = sprite.good ? 2 : -4;
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + (sprite.good ? 3 : -10), 0, 100);
    addHistory(state, {
      label: sprite.label,
      detail: sprite.good ? "챙김" : "부딪힘",
      score: delta,
    });
  }

  if (state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 4) {
    state.finished = true;
  }
}

function updateSnake(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  state.snakeMoveTimer -= dt;

  if (state.snakeMoveTimer <= 0) {
    advanceSnake(content, state, false);
    state.snakeMoveTimer = snakeMoveInterval;
  }

  finishSnakeIfNeeded(content, state);
}

function updatePassword(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  if (state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function updateMinesweeper(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
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

function updateGemSwap(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  if (state.score >= content.arcade.targetScore || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function updateStacker(content: ArcadeGameContent, state: GameState, keys: Set<string>, dt: number) {
  state.elapsed += dt;
  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const steer = (right ? 1 : 0) - (left ? 1 : 0);
  state.stackerActiveX += state.stackerDirection * state.stackerSpeed * dt + steer * 92 * dt;
  const minX = stackerBoardX;
  const maxX = stackerBoardX + stackerBoardWidth - state.stackerActiveWidth;
  if (state.stackerActiveX <= minX) {
    state.stackerActiveX = minX;
    state.stackerDirection = 1;
  } else if (state.stackerActiveX >= maxX) {
    state.stackerActiveX = maxX;
    state.stackerDirection = -1;
  }
  finishStackerIfNeeded(content, state);
}

function updateMole(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  state.moleSpawnTimer -= dt;
  state.moleTargets = state.moleTargets
    .map((target) => ({ ...target, age: target.age + dt }))
    .filter((target) => {
      const alive = target.age < target.ttl;
      if (!alive && target.good) state.focus = clamp(state.focus - 3, 0, 100);
      return alive;
    });

  if (state.moleSpawnTimer <= 0 && state.moleTargets.length < 3) {
    spawnMoleTarget(content, state);
    state.moleSpawnTimer = 0.38 + pseudoRandom(state.nextSpriteId + content.slug.length) * 0.34;
  }

  finishMoleIfNeeded(content, state);
}

function updateSumBox(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  if (
    state.score >= content.arcade.targetScore ||
    state.sumTiles.every((tile) => tile.cleared) ||
    state.actions >= content.arcade.rounds ||
    state.focus <= 0 ||
    state.elapsed >= content.arcade.rounds * 5
  ) {
    state.finished = true;
  }
}

function chooseSumTile(content: ArcadeGameContent, state: GameState) {
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
    addHistory(state, {
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
    addHistory(state, {
      label: `${sum}`,
      detail: "넘침",
      score: -1,
    });
    moveSumCursor(state, 1);
    return;
  }

  moveSumCursorToComplement(state);
}

function spawnCrossingObstacle(content: ArcadeGameContent, state: GameState) {
  const seed = state.nextSpriteId + content.slug.length * 23;
  const laneIndex = Math.floor(pseudoRandom(seed) * crossingLanes.length);
  const direction = laneIndex % 2 === 0 ? -1 : 1;
  const label = pickLabel(content.arcade.badLabels, state.nextSpriteId);
  state.nextSpriteId += 1;
  state.sprites.push({
    id: state.nextSpriteId,
    x: direction < 0 ? canvasWidth + 54 : -54,
    y: crossingLanes[laneIndex] ?? crossingLanes[0],
    vx: direction * (130 + pseudoRandom(seed + 1) * 105),
    vy: 0,
    radius: 24 + pseudoRandom(seed + 2) * 8,
    label,
    good: false,
  });
}

function updateCrossing(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  state.spawnTimer -= dt;

  if (state.spawnTimer <= 0) {
    spawnCrossingObstacle(content, state);
    state.spawnTimer = 0.38 + pseudoRandom(state.nextSpriteId + 5) * 0.24;
  }

  state.sprites = state.sprites
    .map((sprite) => ({ ...sprite, x: sprite.x + sprite.vx * dt }))
    .filter((sprite) => sprite.x > -90 && sprite.x < canvasWidth + 90);

  for (const sprite of state.sprites) {
    const hitPlayer = Math.abs(sprite.x - state.playerX) < sprite.radius + 18 && Math.abs(sprite.y - state.playerY) < 24;
    if (!hitPlayer) continue;
    state.focus = clamp(state.focus - 16, 0, 100);
    state.score = Math.max(0, state.score - 3);
    state.playerY = crossingStartY;
    addHistory(state, {
      label: sprite.label,
      detail: "멈춰 섬",
      score: -3,
    });
    break;
  }

  if (state.playerY <= crossingLanes[crossingLanes.length - 1] - 26) {
    state.score += 5;
    state.focus = clamp(state.focus + 5, 0, 100);
    state.playerY = crossingStartY;
    addHistory(state, {
      label: "건넘",
      detail: "빈틈을 잡음",
      score: 5,
    });
  }

  if (state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function updateBrickBreaker(content: ArcadeGameContent, state: GameState, keys: Set<string>, dt: number) {
  state.elapsed += dt;

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  if (left) state.playerX -= 340 * dt;
  if (right) state.playerX += 340 * dt;
  state.playerX = clamp(state.playerX, 70, canvasWidth - 70);
  state.playerY = canvasHeight - 52;

  if (!state.brickLaunched) {
    state.brickBallX = state.playerX;
    state.brickBallY = state.playerY - 23;
  } else {
    state.brickBallX += state.brickBallVx * dt;
    state.brickBallY += state.brickBallVy * dt;

    if (state.brickBallX < 16 || state.brickBallX > canvasWidth - 16) {
      state.brickBallX = clamp(state.brickBallX, 16, canvasWidth - 16);
      state.brickBallVx *= -1;
    }
    if (state.brickBallY < 18) {
      state.brickBallY = 18;
      state.brickBallVy = Math.abs(state.brickBallVy);
    }

    const paddleWidth = 112;
    const hitPaddle =
      state.brickBallVy > 0 &&
      state.brickBallY > state.playerY - 20 &&
      state.brickBallY < state.playerY + 10 &&
      Math.abs(state.brickBallX - state.playerX) < paddleWidth / 2;
    if (hitPaddle) {
      const offset = (state.brickBallX - state.playerX) / (paddleWidth / 2);
      state.brickBallY = state.playerY - 22;
      state.brickBallVy = -Math.abs(state.brickBallVy) - 8;
      state.brickBallVx = offset * 310;
    }

    const hitBrick = state.bricks.find(
      (brick) =>
        brick.alive &&
        state.brickBallX > brick.x - 8 &&
        state.brickBallX < brick.x + brick.width + 8 &&
        state.brickBallY > brick.y - 8 &&
        state.brickBallY < brick.y + brick.height + 8,
    );
    if (hitBrick) {
      hitBrick.alive = false;
      state.brickBallVy *= -1;
      state.actions += 1;
      const delta = hitBrick.good ? 3 : 1;
      state.score = Math.max(0, state.score + delta);
      state.focus = clamp(state.focus + (hitBrick.good ? 1 : -5), 0, 100);
      addHistory(state, {
        label: hitBrick.label,
        detail: hitBrick.good ? "제대로 깸" : "괜히 힘 씀",
        score: delta,
      });
    }

    if (state.brickBallY > canvasHeight + 24) {
      state.focus = clamp(state.focus - 12, 0, 100);
      state.brickLaunched = false;
      state.brickBallVx = state.brickBallVx >= 0 ? 180 : -180;
      state.brickBallVy = -260;
      addHistory(state, {
        label: "공 놓침",
        detail: "받침대가 늦음",
        score: -2,
      });
    }
  }

  const aliveCount = state.bricks.filter((brick) => brick.alive).length;
  if (aliveCount === 0 || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function drawGame(content: ArcadeGameContent, state: GameState, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = window.devicePixelRatio || 1;
  if (canvas.width !== canvasWidth * scale || canvas.height !== canvasHeight * scale) {
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const { background, primary, accent, danger } = content.arcade.palette;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (content.arcade.variant === "brick-breaker") {
    drawBrickBreaker(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "crossing") {
    drawCrossing(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "sum-box") {
    drawSumBox(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "snake") {
    drawSnake(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "password") {
    drawPassword(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "minesweeper") {
    drawMinesweeper(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "match-three") {
    drawGemSwap(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "stacker") {
    drawStacker(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "mole") {
    drawMole(content, state, ctx);
    return;
  }

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 40; x < canvasWidth; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = 52; y < canvasHeight; y += 70) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, canvasHeight - 84, canvasWidth, 2);

  for (const sprite of state.sprites) {
    ctx.beginPath();
    ctx.fillStyle = sprite.good ? accent : danger;
    ctx.arc(sprite.x, sprite.y, sprite.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sprite.label.slice(0, 8), sprite.x, sprite.y + sprite.radius + 15);
  }

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 25, state.playerY - 18, 50, 36, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(content.arcade.playerLabel.slice(0, 8), state.playerX, state.playerY + 4);

  ctx.fillStyle = "#f8fafc";
  for (const bullet of state.bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.62)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 172);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(content.arcade.controls, canvasWidth / 2, 206);
    ctx.fillText("Space 또는 시작 버튼으로 바로 시작", canvasWidth / 2, 232);
  }
}

function drawStackerBlock(ctx: CanvasRenderingContext2D, block: StackerBlock, fill: string, textFill: string) {
  const gradient = ctx.createLinearGradient(block.x, block.y, block.x, block.y + block.height);
  gradient.addColorStop(0, fill);
  gradient.addColorStop(1, "rgba(15,23,42,0.62)");
  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.roundRect(block.x + 4, block.y + 5, block.width, block.height, 8);
  ctx.fill();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(block.x, block.y, block.width, block.height, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1;
  ctx.stroke();
  if (block.width >= 42) {
    ctx.fillStyle = textFill;
    ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(block.label.slice(0, 5), block.x + block.width / 2, block.y + 17);
  }
}

function drawStacker(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const top = topStackerBlock(state);
  const activeCenter = state.stackerActiveX + state.stackerActiveWidth / 2;
  const topCenter = top ? top.x + top.width / 2 : canvasWidth / 2;
  const centerGap = Math.abs(activeCenter - topCenter);
  const overlap = top ? Math.max(0, Math.min(state.stackerActiveX + state.stackerActiveWidth, top.x + top.width) - Math.max(state.stackerActiveX, top.x)) : 0;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(canvasWidth / 2, 210, 40, canvasWidth / 2, 230, 360);
  glow.addColorStop(0, "rgba(251,191,36,0.18)");
  glow.addColorStop(1, "rgba(251,191,36,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(stackerBoardX - 18, stackerBoardY - 16, stackerBoardWidth + 36, stackerBoardHeight + 32, 22);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let x = stackerBoardX + stackerBoardWidth / 2; x <= stackerBoardX + stackerBoardWidth / 2; x += 1) {
    ctx.fillRect(x, stackerBoardY + 8, 1, stackerBoardHeight - 14);
  }
  for (let y = stackerBaseY + stackerBlockHeight; y > stackerBoardY; y -= stackerBlockHeight) {
    ctx.fillRect(stackerBoardX, y, stackerBoardWidth, 1);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(topCenter, stackerBoardY + 10);
  ctx.lineTo(topCenter, stackerBaseY + stackerBlockHeight);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const block of state.stackerBlocks) {
    const fill =
      block.quality === "base"
        ? "rgba(148,163,184,0.92)"
        : block.quality === "perfect"
          ? accent
          : block.quality === "solid"
            ? primary
            : "rgba(251,113,133,0.86)";
    drawStackerBlock(ctx, block, fill, block.quality === "base" ? "#0f172a" : "#111827");
  }

  if (top) {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(top.x, state.stackerActiveY + 1, top.width, stackerBlockHeight - 2, 8);
    ctx.fill();
  }

  const activeBlock: StackerBlock = {
    id: -1,
    x: state.stackerActiveX,
    y: state.stackerActiveY,
    width: state.stackerActiveWidth,
    height: stackerBlockHeight,
    label: "쌓기",
    quality: centerGap <= 7 ? "perfect" : overlap >= state.stackerActiveWidth * 0.72 ? "solid" : "thin",
  };
  drawStackerBlock(ctx, activeBlock, centerGap <= 7 ? accent : primary, "#111827");

  if (top && overlap > 0 && overlap < state.stackerActiveWidth) {
    const wasteLeft = Math.min(state.stackerActiveX, top.x);
    const wasteRight = Math.max(state.stackerActiveX + state.stackerActiveWidth, top.x + top.width);
    ctx.fillStyle = "rgba(251,113,133,0.42)";
    if (state.stackerActiveX < top.x) {
      ctx.fillRect(state.stackerActiveX, state.stackerActiveY, top.x - state.stackerActiveX, stackerBlockHeight);
    }
    if (state.stackerActiveX + state.stackerActiveWidth > top.x + top.width) {
      ctx.fillRect(top.x + top.width, state.stackerActiveY, state.stackerActiveX + state.stackerActiveWidth - (top.x + top.width), stackerBlockHeight);
    }
    ctx.strokeStyle = "rgba(251,113,133,0.62)";
    ctx.beginPath();
    ctx.moveTo(wasteLeft, state.stackerActiveY - 8);
    ctx.lineTo(wasteRight, state.stackerActiveY - 8);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`층 ${state.stackerLayer}`, 34, 36);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`폭 ${Math.round(state.stackerActiveWidth)} · 차이 ${Math.round(centerGap)}`, 94, 36);

  const meterX = 34;
  const meterY = 66;
  const meterWidth = 116;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(meterX, meterY, meterWidth, 10, 999);
  ctx.fill();
  ctx.fillStyle = centerGap <= 7 ? accent : centerGap <= 26 ? primary : danger;
  ctx.beginPath();
  ctx.roundRect(meterX, meterY, clamp(meterWidth - centerGap * 2.2, 8, meterWidth), 10, 999);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(centerGap <= 7 ? "지금 좋아요" : centerGap <= 26 ? "조금 더" : "아직 멀어요", meterX, meterY + 30);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Space/Enter나 마우스 클릭으로 멈춥니다. A/D는 살짝 보정만 합니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("움직이는 블록이 아래층과 겹칠 때 멈춥니다.", canvasWidth / 2, 202);
    ctx.fillText("마우스로 눌러도 되고, Space/Enter로 쌓아도 됩니다.", canvasWidth / 2, 228);
  }
}

function drawMole(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(moleBoardX + moleBoardWidth / 2, 210, 30, moleBoardX + moleBoardWidth / 2, 210, 330);
  glow.addColorStop(0, "rgba(245,158,11,0.18)");
  glow.addColorStop(1, "rgba(245,158,11,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(moleBoardX - 22, moleBoardY - 22, moleBoardWidth + 44, moleBoardHeight + 44, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let hole = 0; hole < moleColumns * moleRows; hole += 1) {
    const center = moleHoleCenter(hole);
    const hasCursor = state.moleCursor === hole;
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.beginPath();
    ctx.ellipse(center.x, center.y + 18, moleHoleSize / 2, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.ellipse(center.x, center.y + 16, moleHoleSize / 2 - 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    const target = activeMoleAt(state, hole);
    if (target) {
      const progress = clamp(target.age / target.ttl, 0, 1);
      const pop = Math.sin((Math.min(1, progress * 2) * Math.PI) / 2) * (1 - Math.max(0, progress - 0.72) * 0.9);
      const moleHeight = 42 * pop;
      ctx.fillStyle = target.good ? accent : danger;
      ctx.beginPath();
      ctx.roundRect(center.x - 28, center.y + 12 - moleHeight, 56, 44, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.38)";
      ctx.stroke();
      ctx.fillStyle = target.good ? "#111827" : "#fff7ed";
      ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(target.label.slice(0, 5), center.x, center.y + 38 - moleHeight);
    }

    if (hasCursor && !state.finished) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(center.x, center.y + 16, moleHoleSize / 2 + 8, 25, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }

  const panelX = 486;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(panelX, 78, 182, 210, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("지금 뜬 알림", panelX + 18, 112);
  ctx.font = "900 28px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = accent;
  ctx.fillText(`${state.moleTargets.filter((target) => target.good).length}`, panelX + 18, 152);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`소음 ${state.moleTargets.filter((target) => !target.good).length}`, panelX + 66, 149);
  ctx.fillText(`잡은 횟수 ${Math.min(state.actions, content.arcade.rounds)} / ${content.arcade.rounds}`, panelX + 18, 188);
  ctx.fillText("초록은 잡고, 빨강은 흘려보냅니다.", panelX + 18, 222);
  ctx.fillText("다 잡으려 들면 집중이 먼저 닳습니다.", panelX + 18, 246);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스로 알림을 누르거나 방향키/WASD로 칸을 옮겨 Space를 누릅니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("초록 알림만 잡고, 소음은 지나가게 둡니다.", canvasWidth / 2, 202);
    ctx.fillText("마우스로 누르거나 방향키와 Space로 잡으면 됩니다.", canvasWidth / 2, 228);
  }
}

function drawSnake(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const boardWidth = snakeColumns * snakeCellSize;
  const boardHeight = snakeRows * snakeCellSize;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(snakeBoardX - 12, snakeBoardY - 12, boardWidth + 24, boardHeight + 24, 18);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let column = 0; column <= snakeColumns; column += 1) {
    const x = snakeBoardX + column * snakeCellSize;
    ctx.fillRect(x, snakeBoardY, 1, boardHeight);
  }
  for (let row = 0; row <= snakeRows; row += 1) {
    const y = snakeBoardY + row * snakeCellSize;
    ctx.fillRect(snakeBoardX, y, boardWidth, 1);
  }

  ctx.fillStyle = state.snakeFood.good ? accent : danger;
  ctx.beginPath();
  ctx.roundRect(snakeBoardX + state.snakeFood.x * snakeCellSize + 4, snakeBoardY + state.snakeFood.y * snakeCellSize + 4, snakeCellSize - 8, snakeCellSize - 8, 9);
  ctx.fill();
  ctx.fillStyle = state.snakeFood.good ? "#172018" : "#fff7ed";
  ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.snakeFood.label.slice(0, 3), snakeBoardX + state.snakeFood.x * snakeCellSize + snakeCellSize / 2, snakeBoardY + state.snakeFood.y * snakeCellSize + 16);

  for (let index = state.snake.length - 1; index >= 0; index -= 1) {
    const cell = state.snake[index];
    if (!cell) continue;
    const isHead = index === 0;
    ctx.fillStyle = isHead ? primary : index % 2 === 0 ? "rgba(74,222,128,0.82)" : "rgba(52,211,153,0.72)";
    ctx.beginPath();
    ctx.roundRect(snakeBoardX + cell.x * snakeCellSize + 3, snakeBoardY + cell.y * snakeCellSize + 3, snakeCellSize - 6, snakeCellSize - 6, isHead ? 8 : 7);
    ctx.fill();
    if (isHead) {
      ctx.fillStyle = "#0f172a";
      const eyeY = snakeBoardY + cell.y * snakeCellSize + 9;
      ctx.beginPath();
      ctx.arc(snakeBoardX + cell.x * snakeCellSize + 9, eyeY, 2.4, 0, Math.PI * 2);
      ctx.arc(snakeBoardX + cell.x * snakeCellSize + snakeCellSize - 9, eyeY, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`길이 ${state.snake.length}`, 34, 36);
  ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.64)";
  ctx.fillText(`다음 ${state.snakeFood.label}`, 130, 36);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("방향키나 WASD로 방향을 틉니다. 벽과 꼬리는 피하고, 사과는 먹으면 됩니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("방향키나 WASD로 방향을 틀고 사과를 먹습니다.", canvasWidth / 2, 204);
    ctx.fillText("욕심내서 꺾으면 바로 꼬입니다. 천천히 가도 됩니다.", canvasWidth / 2, 230);
  }
}

function drawMinesweeper(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const boardWidth = mineColumns * mineCellSize + (mineColumns - 1) * mineGap;
  const boardHeight = mineRows * mineCellSize + (mineRows - 1) * mineGap;
  const openedSafe = revealedMineSafeCount(state);
  const totalSafe = totalMineSafeCount(state);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(mineBoardX + boardWidth / 2, mineBoardY + boardHeight / 2, 40, mineBoardX + boardWidth / 2, mineBoardY + boardHeight / 2, 310);
  glow.addColorStop(0, "rgba(147,197,253,0.14)");
  glow.addColorStop(1, "rgba(147,197,253,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.beginPath();
  ctx.roundRect(mineBoardX - 14, mineBoardY - 14, boardWidth + 28, boardHeight + 28, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  for (const cell of state.mineCells) {
    const x = mineBoardX + cell.column * (mineCellSize + mineGap);
    const y = mineBoardY + cell.row * (mineCellSize + mineGap);
    const isCursor = cell.id === state.mineCursor;
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.roundRect(x + 3, y + 4, mineCellSize, mineCellSize, 9);
    ctx.fill();

    if (cell.revealed && cell.mine) {
      ctx.fillStyle = danger;
    } else if (cell.revealed) {
      ctx.fillStyle = cell.adjacent === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.16)";
    } else {
      const gradient = ctx.createLinearGradient(x, y, x, y + mineCellSize);
      gradient.addColorStop(0, "rgba(255,255,255,0.22)");
      gradient.addColorStop(1, "rgba(255,255,255,0.08)");
      ctx.fillStyle = gradient;
    }
    ctx.beginPath();
    ctx.roundRect(x, y, mineCellSize, mineCellSize, 9);
    ctx.fill();
    ctx.strokeStyle = cell.revealed ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.24)";
    ctx.stroke();

    if (isCursor && !state.finished) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, mineCellSize + 8, mineCellSize + 8, 12);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    if (cell.revealed) {
      ctx.textAlign = "center";
      if (cell.mine) {
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.arc(x + mineCellSize / 2, y + mineCellSize / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#111827";
        ctx.beginPath();
        ctx.moveTo(x + 12, y + 12);
        ctx.lineTo(x + 26, y + 26);
        ctx.moveTo(x + 26, y + 12);
        ctx.lineTo(x + 12, y + 26);
        ctx.stroke();
      } else if (cell.adjacent > 0) {
        ctx.fillStyle = cell.adjacent >= 3 ? danger : cell.adjacent === 2 ? accent : primary;
        ctx.font = "900 19px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillText(`${cell.adjacent}`, x + mineCellSize / 2, y + 25);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.38)";
        ctx.beginPath();
        ctx.arc(x + mineCellSize / 2, y + mineCellSize / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const panelX = 466;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(panelX, mineBoardY - 12, 196, 238, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("열린 칸", panelX + 18, mineBoardY + 22);
  ctx.font = "900 32px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = accent;
  ctx.fillText(`${openedSafe}`, panelX + 18, mineBoardY + 62);
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.fillText(`/ ${totalSafe} 안전칸`, panelX + 80, mineBoardY + 59);

  const cursor = state.mineCells[state.mineCursor];
  ctx.fillStyle = "rgba(255,255,255,0.13)";
  ctx.beginPath();
  ctx.roundRect(panelX + 18, mineBoardY + 90, 160, 44, 12);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(cursor?.revealed ? "열린 칸입니다" : "여기를 열어볼까요", panelX + 32, mineBoardY + 116);

  ctx.fillStyle = "rgba(255,255,255,0.64)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("숫자는 가까운 위험 칸 수입니다.", panelX + 18, mineBoardY + 164);
  ctx.fillText("의심되면 다른 칸부터 열어도 됩니다.", panelX + 18, mineBoardY + 188);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스로 칸을 누르거나 방향키로 옮겨 Space를 누릅니다. 숫자를 보고 천천히 열면 됩니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("칸을 열고 숫자를 봅니다. 숫자는 가까운 위험 칸 수입니다.", canvasWidth / 2, 202);
    ctx.fillText("마우스로 바로 열거나 방향키로 옮겨 Space를 누르세요.", canvasWidth / 2, 228);
  }
}

function gemColor(content: ArcadeGameContent, tile: GemTile) {
  const colors = [content.arcade.palette.primary, content.arcade.palette.accent, "#86efac", "#fde68a", content.arcade.palette.danger, "#cbd5e1"];
  return colors[tile.kind % colors.length] ?? content.arcade.palette.primary;
}

function drawGemSwap(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(canvasWidth / 2, 200, 40, canvasWidth / 2, 200, 350);
  glow.addColorStop(0, "rgba(103,232,249,0.18)");
  glow.addColorStop(1, "rgba(103,232,249,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(15,23,42,0.44)";
  ctx.beginPath();
  ctx.roundRect(gemBoardX - 18, gemBoardY - 18, gemBoardWidth + 36, gemBoardHeight + 36, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "800 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("말조각 보드", 36, 64);
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`이동 ${Math.min(state.actions, content.arcade.rounds)} / ${content.arcade.rounds}`, 36, 88);
  ctx.fillText(`콤보 ${state.gemCombo}`, 36, 110);

  const selectedTile = state.gemSelected !== null ? state.gemTiles[state.gemSelected] : null;
  if (selectedTile) {
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(34, 132, 122, 70, 14);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("고른 조각", 48, 156);
    ctx.fillStyle = gemColor(content, selectedTile);
    ctx.font = "900 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(selectedTile.label.slice(0, 6), 48, 184);
  }

  for (const tile of state.gemTiles) {
    const index = gemIndex(tile.column, tile.row);
    const x = gemBoardX + tile.column * (gemCellSize + gemGap);
    const y = gemBoardY + tile.row * (gemCellSize + gemGap);
    const selected = state.gemSelected === index;
    const cursor = state.gemCursor === index;
    const color = gemColor(content, tile);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.roundRect(x, y, gemCellSize, gemCellSize, 14);
    ctx.fill();

    ctx.save();
    ctx.translate(x + gemCellSize / 2, y + gemCellSize / 2);
    ctx.rotate(((tile.kind % 4) - 1.5) * 0.08);
    ctx.fillStyle = color;
    ctx.shadowColor = selected || cursor ? color : "transparent";
    ctx.shadowBlur = selected || cursor ? 18 : 0;
    ctx.beginPath();
    ctx.roundRect(-18, -18, 36, 36, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = tile.good ? "rgba(255,255,255,0.62)" : "rgba(15,23,42,0.62)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = tile.good ? "#0f172a" : "#f8fafc";
    ctx.font = "900 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tile.label.slice(0, 3), x + gemCellSize / 2, y + gemCellSize / 2 + 4);

    if (selected || cursor) {
      ctx.strokeStyle = selected ? accent : primary;
      ctx.lineWidth = selected ? 4 : 2;
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, gemCellSize + 8, gemCellSize + 8, 16);
      ctx.stroke();
    }
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("마우스로 두 칸을 차례로 누르거나 방향키로 옮겨 Space를 누릅니다.", 34, canvasHeight - 20);
  if (state.focus < 35) {
    ctx.fillStyle = danger;
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("헛손이 많아졌습니다. 가까운 둘만 바꿔서 셋을 맞추세요.", 34, canvasHeight - 44);
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("옆 칸끼리 바꿔서 같은 말조각 셋을 맞춥니다.", canvasWidth / 2, 202);
    ctx.fillText("마우스로 두 칸을 누르거나 방향키와 Space로 고르면 됩니다.", canvasWidth / 2, 228);
  }
}

function drawPassword(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const latest = state.passwordAttempts[0];
  const candidates = passwordCandidates(state);
  const triedGuesses = new Set(state.passwordAttempts.map((attempt) => attempt.guess));
  const suggestion = candidates.find((candidate) => !triedGuesses.has(candidate.join("")))?.join("") ?? candidates[0]?.join("") ?? "---";
  const digitMarks = passwordDigitMarks(state);
  const currentGuess = passwordGuessText(state);
  const repeatedCurrent = state.passwordAttempts.some((attempt, index) => attempt.guess === currentGuess && (index > 0 || attempt.repeated));

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const centerX = canvasWidth / 2;
  const glow = ctx.createRadialGradient(centerX, 182, 20, centerX, 184, 230);
  glow.addColorStop(0, "rgba(96,165,250,0.24)");
  glow.addColorStop(1, "rgba(96,165,250,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(130, 26, 460, 310);

  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, 94, 54, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  ctx.fillStyle = "rgba(15,23,42,0.58)";
  ctx.beginPath();
  ctx.roundRect(centerX - 136, 84, 272, 248, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("번호를 좁혀가기", centerX, 120);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.roundRect(34, 72, 152, 84, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("남은 가능성", 48, 96);
  ctx.fillStyle = candidates.length <= 12 ? accent : "#f8fafc";
  ctx.font = "900 24px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(`${candidates.length}`, 48, 124);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`다음 후보 ${suggestion}`, 48, 145);
  ctx.textAlign = "center";

  for (let index = 0; index < passwordDigitCount; index += 1) {
    const x = passwordDigitStartX + index * (passwordDigitWidth + passwordDigitGap);
    const selected = index === state.passwordCursor;
    const digit = state.passwordGuess[index] ?? 0;
    const gradient = ctx.createLinearGradient(0, passwordDigitY, 0, passwordDigitY + passwordDigitHeight);
    gradient.addColorStop(0, selected ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)");
    gradient.addColorStop(1, selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, passwordDigitY, passwordDigitWidth, passwordDigitHeight, 18);
    ctx.fill();
    ctx.shadowColor = selected ? "rgba(96,165,250,0.35)" : "transparent";
    ctx.shadowBlur = selected ? 18 : 0;
    ctx.strokeStyle = selected ? primary : "rgba(255,255,255,0.2)";
    ctx.lineWidth = selected ? 3 : 1;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = selected ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.42)";
    ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${index + 1}번째`, x + passwordDigitWidth / 2, passwordDigitY + 22);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "900 54px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(`${digit}`, x + passwordDigitWidth / 2, passwordDigitY + 76);
    ctx.fillStyle = selected ? accent : "rgba(255,255,255,0.5)";
    ctx.font = "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("↑↓", x + passwordDigitWidth / 2, passwordDigitY + 100);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = repeatedCurrent ? danger : "rgba(255,255,255,0.62)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(repeatedCurrent ? "이미 해본 번호입니다" : latest ? latest.hint : "숫자키로 바로 넣어도 됩니다", centerX, 274);

  ctx.fillStyle = latest?.exact === passwordDigitCount ? primary : repeatedCurrent ? danger : accent;
  ctx.beginPath();
  ctx.roundRect(passwordSubmitRect.x, passwordSubmitRect.y, passwordSubmitRect.width, passwordSubmitRect.height, 14);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(repeatedCurrent ? "다른 번호" : "확인", centerX, passwordSubmitRect.y + 28);

  ctx.textAlign = "center";
  for (let digit = 0; digit <= 9; digit += 1) {
    const x = passwordKeypadX + digit * (passwordKeypadWidth + passwordKeypadGap);
    const mark = digitMarks[digit];
    ctx.fillStyle = mark === "absent" ? "rgba(148,163,184,0.18)" : mark === "candidate" ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(x, passwordKeypadY, passwordKeypadWidth, passwordKeypadHeight, 10);
    ctx.fill();
    ctx.strokeStyle = mark === "absent" ? "rgba(148,163,184,0.26)" : mark === "candidate" ? "rgba(251,191,36,0.55)" : "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = mark === "absent" ? "rgba(255,255,255,0.34)" : "#f8fafc";
    ctx.font = "900 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(`${digit}`, x + passwordKeypadWidth / 2, passwordKeypadY + 21);
  }
  const historyX = 510;
  const historyY = 72;
  const historyWidth = 176;
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "800 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("힌트 기록", historyX, historyY - 18);
  ctx.font = "650 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.56)";
  ctx.fillText("자리 / 숫자", historyX + 70, historyY - 18);

  const attempts = state.passwordAttempts.slice(0, 5);
  if (!attempts.length) {
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.roundRect(historyX, historyY, historyWidth, 34, 10);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("아직 찍은 번호 없음", historyX + 14, historyY + 22);
  }

  attempts.forEach((attempt, index) => {
    const y = historyY + index * 38;
    ctx.fillStyle = attempt.repeated ? "rgba(251,113,133,0.18)" : "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(historyX, y, historyWidth, 32, 9);
    ctx.fill();
    ctx.fillStyle = attempt.exact === passwordDigitCount ? primary : "#f8fafc";
    ctx.font = "900 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(attempt.guess, historyX + 12, y + 20);
    ctx.fillStyle = attempt.exact ? primary : "rgba(255,255,255,0.68)";
    ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${attempt.exact}자리`, historyX + 62, y + 20);
    ctx.fillStyle = attempt.near ? accent : "rgba(255,255,255,0.56)";
    ctx.fillText(`${attempt.near}숫자`, historyX + 110, y + 20);
    ctx.fillStyle = "rgba(255,255,255,0.56)";
    ctx.font = "700 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(attempt.hint.slice(0, 14), historyX + 12, y + 30);
  });

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("숫자키로 입력, ←/→ 자리 이동, ↑/↓ 변경, Space/Enter 확인. 마우스 키패드도 됩니다.", 34, canvasHeight - 20);

  if (state.focus < 35) {
    ctx.fillStyle = danger;
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("조급해졌습니다. 기록을 보고 하나씩 줄이세요.", 34, canvasHeight - 46);
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, centerX, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("세 자리 숫자를 맞춥니다. 숫자와 자리를 힌트로 줄여가면 됩니다.", centerX, 204);
    ctx.fillText("숫자키로 바로 넣거나, 마우스 키패드와 방향키로 바꾸면 됩니다.", centerX, 230);
  }
}

function drawSumBox(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const currentSum = selectedSum(state);
  const cleared = state.sumTiles.filter((tile) => tile.cleared).length;
  const selected = selectedSumTiles(state);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(canvasWidth / 2, 210, 40, canvasWidth / 2, 210, 360);
  glow.addColorStop(0, "rgba(255,255,255,0.09)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.beginPath();
  ctx.roundRect(30, 66, canvasWidth - 60, 288, 22);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`합 ${currentSum} / 10`, 34, 42);
  ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.fillText(`비운 칸 ${cleared} / ${state.sumTiles.length}`, 158, 42);
  ctx.fillText(selected.length ? `고른 숫자 ${selected.map((tile) => tile.value).join(" + ")}` : "칸을 클릭해서 고릅니다", 300, 42);

  for (const tile of state.sumTiles) {
    const isCursor = tile.id === state.sumCursor;
    const tileCenterX = tile.x + tile.width / 2;
    const tileCenterY = tile.y + tile.height / 2;
    ctx.globalAlpha = tile.cleared ? 0.2 : 1;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.roundRect(tile.x + 4, tile.y + 6, tile.width, tile.height, 16);
    ctx.fill();

    const tileGradient = ctx.createLinearGradient(tile.x, tile.y, tile.x, tile.y + tile.height);
    if (tile.cleared) {
      tileGradient.addColorStop(0, "rgba(255,255,255,0.08)");
      tileGradient.addColorStop(1, "rgba(255,255,255,0.03)");
    } else if (tile.selected) {
      tileGradient.addColorStop(0, accent);
      tileGradient.addColorStop(1, "rgba(251,191,36,0.78)");
    } else {
      tileGradient.addColorStop(0, "rgba(255,255,255,0.18)");
      tileGradient.addColorStop(1, "rgba(255,255,255,0.08)");
    }
    ctx.fillStyle = tileGradient;
    ctx.beginPath();
    ctx.roundRect(tile.x, tile.y, tile.width, tile.height, 16);
    ctx.fill();
    ctx.strokeStyle = tile.selected ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (isCursor && !tile.cleared) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(tile.x - 5, tile.y - 5, tile.width + 10, tile.height + 10, 20);
      ctx.stroke();
    }

    ctx.fillStyle = tile.selected ? "rgba(17,24,39,0.16)" : "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.arc(tile.x + 22, tile.y + 18, 7, 0, Math.PI * 2);
    ctx.arc(tile.x + tile.width - 20, tile.y + 17, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = tile.selected ? "#111827" : "#f8fafc";
    ctx.font = "900 27px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${tile.value}`, tileCenterX, tile.y + 34);
    ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = tile.selected ? "rgba(17,24,39,0.72)" : "rgba(248,250,252,0.72)";
    ctx.fillText(tile.label.slice(0, 6), tileCenterX, tileCenterY + 20);
    ctx.globalAlpha = 1;
  }

  const barWidth = clamp((currentSum / 10) * (canvasWidth - 68), 0, canvasWidth - 68);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(34, canvasHeight - 54, canvasWidth - 68, 14, 7);
  ctx.fill();
  ctx.fillStyle = currentSum > 10 ? danger : currentSum === 10 ? accent : primary;
  ctx.beginPath();
  ctx.roundRect(34, canvasHeight - 54, barWidth, 14, 7);
  ctx.fill();
  if (currentSum === 10) {
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("지금 누르면 지워집니다", canvasWidth - 34, canvasHeight - 66);
  }
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스로 칸을 누르거나 방향키로 옮겨 Space를 누릅니다. 합 10이면 칸이 사라집니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("마우스로 칸을 누르거나 방향키로 칸을 옮깁니다.", canvasWidth / 2, 202);
    ctx.fillText("합 10을 만들면 사라집니다. 많이 누르는 것보다 딱 맞추는 쪽입니다.", canvasWidth / 2, 228);
  }
}

function drawCrossing(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#182235";
  ctx.fillRect(0, 42, canvasWidth, canvasHeight - 98);
  ctx.fillStyle = "#233047";
  ctx.fillRect(0, 0, canvasWidth, 42);
  ctx.fillRect(0, crossingStartY - 23, canvasWidth, 58);

  for (const y of crossingLanes) {
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.setLineDash([16, 14]);
    ctx.beginPath();
    ctx.moveTo(24, y + 27);
    ctx.lineTo(canvasWidth - 24, y + 27);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = accent;
  ctx.fillRect(0, 42, canvasWidth, 4);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("도착선", 20, 30);

  for (const sprite of state.sprites) {
    ctx.fillStyle = danger;
    ctx.beginPath();
    ctx.roundRect(sprite.x - sprite.radius, sprite.y - 15, sprite.radius * 2, 30, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.beginPath();
    ctx.arc(sprite.x + (sprite.vx < 0 ? -sprite.radius + 8 : sprite.radius - 8), sprite.y - 8, 3, 0, Math.PI * 2);
    ctx.arc(sprite.x + (sprite.vx < 0 ? -sprite.radius + 8 : sprite.radius - 8), sprite.y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sprite.label.slice(0, 6), sprite.x, sprite.y + 4);
  }

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 17, state.playerY - 17, 34, 34, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.stroke();
  ctx.fillStyle = "#111827";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(content.arcade.playerLabel.slice(0, 4), state.playerX, state.playerY + 4);

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`건넌 횟수 ${Math.floor(state.score / 5)}`, 24, canvasHeight - 18);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.68)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 168);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("방향키로 한 칸씩 움직이고, 빈틈이 보이면 위로 건넙니다.", canvasWidth / 2, 204);
    ctx.fillText("멈춰도 됩니다. 이 게임은 급하게 가면 더 자주 막힙니다.", canvasWidth / 2, 230);
  }
}

function drawBrickBreaker(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 40; x < canvasWidth; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }

  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    ctx.fillStyle = brick.good ? accent : danger;
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(brick.label.slice(0, 8), brick.x + brick.width / 2, brick.y + 18);
  }

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 56, state.playerY - 8, 112, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(state.brickBallX, state.brickBallY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${state.bricks.filter((brick) => brick.alive).length}개 남음`, 24, canvasHeight - 22);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.68)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 172);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("A/D 또는 방향키로 받침대를 움직이고 Space로 공을 보냅니다.", canvasWidth / 2, 208);
    ctx.fillText("벽돌을 다급하게 쫓지 말고, 공이 돌아올 자리를 먼저 잡으세요.", canvasWidth / 2, 234);
  } else if (!state.brickLaunched) {
    ctx.fillStyle = "rgba(15,23,42,0.5)";
    ctx.fillRect(0, canvasHeight - 116, canvasWidth, 42);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Space로 다시 시작", canvasWidth / 2, canvasHeight - 90);
  }
}

function endingFor(content: ArcadeGameContent, score: number) {
  return [...content.endings].sort((a, b) => b.minScore - a.minScore).find((item) => score >= item.minScore) ?? content.endings[content.endings.length - 1];
}

export function ArcadeGameEngine({
  content,
  relatedBlogLinks,
  relatedPlayLinks,
}: {
  content: ArcadeGameContent;
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const stateRef = React.useRef<GameState>(makeInitialState(content));
  const keysRef = React.useRef<Set<string>>(new Set());
  const [view, setView] = React.useState<ViewState>(() => snapshot(stateRef.current));
  const [shareState, setShareState] = React.useState<"idle" | "copied" | "shared">("idle");
  const ending = endingFor(content, view.score);

  const syncView = React.useCallback(() => {
    setView(snapshot(stateRef.current));
  }, []);

  const restart = React.useCallback(() => {
    stateRef.current = makeInitialState(content);
    setShareState("idle");
    syncView();
  }, [content, syncView]);

  const performAction = React.useCallback(
    (action: "left" | "right" | "main" | "up" | "down") => {
      const state = stateRef.current;
      if (state.finished) return;
      state.started = true;
      state.lastFrame = performance.now();
      if (content.arcade.variant === "sum-box") {
        if (action === "left") moveSumCursor(state, -1);
        if (action === "right") moveSumCursor(state, 1);
        if (action === "up") moveSumCursor(state, -sumBoxColumns);
        if (action === "down") moveSumCursor(state, sumBoxColumns);
        if (action === "main") chooseSumTile(content, state);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "snake") {
        const direction = snakeDirectionFromAction(action);
        if (direction) setSnakeDirection(state, direction);
        if (action === "main") {
          snakeAutoSteerTowardFood(state);
          advanceSnake(content, state, true);
          state.snakeMoveTimer = snakeMoveInterval;
        }
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "password") {
        if (action === "left") movePasswordCursor(state, -1);
        if (action === "right") movePasswordCursor(state, 1);
        if (action === "up") adjustPasswordDigit(state, 1);
        if (action === "down") adjustPasswordDigit(state, -1);
        if (action === "main") submitPasswordGuess(content, state);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "minesweeper") {
        if (action === "left") moveMineCursor(state, -1);
        if (action === "right") moveMineCursor(state, 1);
        if (action === "up") moveMineCursor(state, -mineColumns);
        if (action === "down") moveMineCursor(state, mineColumns);
        if (action === "main") revealMineCell(content, state);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "match-three") {
        if (action === "left") moveGemCursor(state, -1);
        if (action === "right") moveGemCursor(state, 1);
        if (action === "up") moveGemCursor(state, -gemColumns);
        if (action === "down") moveGemCursor(state, gemColumns);
        if (action === "main") {
          if (state.gemSelected === null) {
            state.gemSelected = state.gemCursor;
            const target = findGemSwapTarget(state, state.gemCursor);
            if (target !== null) chooseGemTile(content, state, target);
          } else {
            chooseGemTile(content, state);
          }
        }
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "stacker") {
        if (action === "left") nudgeStacker(state, -18);
        if (action === "right") nudgeStacker(state, 18);
        if (action === "main") placeStackerBlock(content, state);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "mole") {
        if (action === "left") moveMoleCursor(state, -1);
        if (action === "right") moveMoleCursor(state, 1);
        if (action === "up") moveMoleCursor(state, -moleColumns);
        if (action === "down") moveMoleCursor(state, moleColumns);
        if (action === "main") whackMole(content, state);
        setShareState("idle");
        syncView();
        return;
      }
      const stepX = content.arcade.variant === "crossing" ? crossingStepX : 52;
      if (action === "left") state.playerX = clamp(state.playerX - stepX, 34, canvasWidth - 34);
      if (action === "right") state.playerX = clamp(state.playerX + stepX, 34, canvasWidth - 34);
      if (content.arcade.variant === "crossing" && action === "down") {
        state.actions += 1;
        state.playerY = clamp(state.playerY + crossingStepY, crossingLanes[crossingLanes.length - 1] - 36, crossingStartY);
      }
      if (action === "main") {
        if (content.arcade.variant === "crossing") {
          state.actions += 1;
          state.playerY = clamp(state.playerY - crossingStepY, crossingLanes[crossingLanes.length - 1] - 36, crossingStartY);
        } else if (content.arcade.variant === "brick-breaker") {
          if (!state.brickLaunched) {
            state.brickLaunched = true;
            state.brickBallVx = state.playerX < canvasWidth / 2 ? 185 : -185;
            state.brickBallVy = -270;
          } else {
            state.brickBallVx = clamp(state.brickBallVx + (state.brickBallX >= state.playerX ? 22 : -22), -340, 340);
            state.brickBallVy = Math.min(state.brickBallVy, -230);
          }
          state.actions += 1;
        } else if (content.arcade.variant === "runner") {
          state.actions += 1;
          state.playerVy = -390;
        } else if (content.arcade.variant === "flight") {
          state.actions += 1;
          state.playerVy -= 250;
        } else {
          state.actions += 1;
          state.bullets.push({ x: state.playerX, y: state.playerY - 26, vy: -420 });
        }
        if (state.actions >= content.arcade.rounds) state.finished = true;
      }
      setShareState("idle");
      syncView();
    },
    [content, syncView],
  );

  React.useEffect(() => {
    const keys = keysRef.current;
    function keyDown(event: KeyboardEvent) {
      const passwordDigitKey = content.arcade.variant === "password" ? digitFromKeyboardCode(event.code) : null;
      const passwordUtilityKey = content.arcade.variant === "password" && event.code === "Backspace";
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Enter", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code) ||
        passwordDigitKey !== null ||
        passwordUtilityKey
      ) {
        event.preventDefault();
        if (content.arcade.variant === "crossing") {
          if (event.repeat) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        if (content.arcade.variant === "sum-box") {
          if (event.repeat) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowUp" || event.code === "KeyW") performAction("up");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        if (content.arcade.variant === "snake") {
          const directionByKey: Record<string, SnakeDirection | undefined> = {
            ArrowLeft: "left",
            KeyA: "left",
            ArrowRight: "right",
            KeyD: "right",
            ArrowUp: "up",
            KeyW: "up",
            ArrowDown: "down",
            KeyS: "down",
          };
          const direction = directionByKey[event.code];
          if (direction) {
            stateRef.current.started = true;
            stateRef.current.lastFrame = performance.now();
            setSnakeDirection(stateRef.current, direction);
            setShareState("idle");
            syncView();
            return;
          }
          if ((event.code === "Space" || event.code === "Enter") && !event.repeat) {
            performAction("main");
            return;
          }
        }
        if (content.arcade.variant === "password") {
          if (passwordDigitKey !== null) {
            if (event.repeat) return;
            stateRef.current.started = true;
            stateRef.current.lastFrame = performance.now();
            setPasswordDigit(stateRef.current, passwordDigitKey, true);
            setShareState("idle");
            syncView();
            return;
          }
          if (event.code === "Backspace") {
            if (event.repeat) return;
            stateRef.current.started = true;
            stateRef.current.lastFrame = performance.now();
            movePasswordCursor(stateRef.current, -1);
            setShareState("idle");
            syncView();
            return;
          }
          if (event.repeat && (event.code === "Space" || event.code === "Enter")) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowUp" || event.code === "KeyW") performAction("up");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        if (content.arcade.variant === "minesweeper") {
          if (event.repeat) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowUp" || event.code === "KeyW") performAction("up");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        if (content.arcade.variant === "match-three") {
          if (event.repeat) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowUp" || event.code === "KeyW") performAction("up");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        if (content.arcade.variant === "stacker") {
          keys.add(event.code);
          if ((event.code === "Space" || event.code === "Enter") && !event.repeat) performAction("main");
          if ((event.code === "ArrowLeft" || event.code === "KeyA") && !event.repeat) performAction("left");
          if ((event.code === "ArrowRight" || event.code === "KeyD") && !event.repeat) performAction("right");
          return;
        }
        if (content.arcade.variant === "mole") {
          if (event.repeat) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowUp" || event.code === "KeyW") performAction("up");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        keys.add(event.code);
        if ((event.code === "Space" || event.code === "Enter") && !event.repeat) performAction("main");
      }
    }
    function keyUp(event: KeyboardEvent) {
      keys.delete(event.code);
    }
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [content, performAction, syncView]);

  React.useEffect(() => {
    let frame = 0;
    let lastSync = 0;
    function loop(now: number) {
      updateGame(content, stateRef.current, keysRef.current, now);
      const canvas = canvasRef.current;
      if (canvas) drawGame(content, stateRef.current, canvas);
      if (now - lastSync > 120 || stateRef.current.finished) {
        lastSync = now;
        syncView();
      }
      frame = window.requestAnimationFrame(loop);
    }
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [content, syncView]);

  const handleCanvasClick = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const point = canvasPointFromEvent(canvas, event);
      const state = stateRef.current;
      if (state.finished) return;

      if (content.arcade.variant === "sum-box") {
        const index = sumTileIndexAt(state, point.x, point.y);
        if (index < 0) return;
        state.started = true;
        state.lastFrame = performance.now();
        state.sumCursor = index;
        chooseSumTile(content, state);
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "password") {
        state.started = true;
        state.lastFrame = performance.now();
        const keypadDigit = passwordKeypadDigitAt(point.x, point.y);
        const digitIndex = passwordDigitIndexAt(point.x, point.y);
        if (keypadDigit >= 0) {
          setPasswordDigit(state, keypadDigit, true);
        } else if (digitIndex >= 0) {
          setPasswordDigitFromClick(state, digitIndex);
        } else if (pointInRect(point, passwordSubmitRect)) {
          submitPasswordGuess(content, state);
        } else {
          return;
        }
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "minesweeper") {
        const index = mineCellIndexAt(point.x, point.y);
        if (index < 0) return;
        state.started = true;
        state.lastFrame = performance.now();
        revealMineCell(content, state, index);
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "match-three") {
        const index = gemCellIndexAt(point.x, point.y);
        if (index < 0) return;
        state.started = true;
        state.lastFrame = performance.now();
        chooseGemTile(content, state, index);
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "stacker") {
        state.started = true;
        state.lastFrame = performance.now();
        placeStackerBlock(content, state);
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "mole") {
        const hole = moleHoleAt(point.x, point.y);
        if (hole < 0) return;
        state.started = true;
        state.lastFrame = performance.now();
        whackMole(content, state, hole);
        setShareState("idle");
        syncView();
      }
    },
    [content, syncView],
  );

  async function shareResult() {
    const title = `${content.title} - ${ending.title}`;
    const text = `${content.shareText}\n점수: ${view.score}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: window.location.href });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
      setShareState("copied");
    } catch {
      setShareState("idle");
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm" data-play-engine={content.slug}>
      <div className="border-b bg-muted/30 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">바로 한 판</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-right">
            <Metric label="점수" value={view.score} />
            <Metric label="집중" value={view.focus} />
            <Metric label="조작" value={`${Math.min(view.actions, content.arcade.rounds)} / ${content.arcade.rounds}`} />
          </div>
        </div>
      </div>

      {view.finished ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-result>
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
          </div>
          <HistoryPanel history={view.history} />
        </div>
      ) : (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-turn={`arcade-${view.actions}`}>
          <div>
            <div className="overflow-hidden rounded-lg border bg-background">
              <canvas
                ref={canvasRef}
                tabIndex={0}
                onClick={handleCanvasClick}
                aria-label={`${content.title} canvas`}
                className={`block aspect-[12/7] w-full outline-none ${
                  content.arcade.variant === "sum-box" ||
                  content.arcade.variant === "password" ||
                  content.arcade.variant === "minesweeper" ||
                  content.arcade.variant === "match-three" ||
                  content.arcade.variant === "stacker" ||
                  content.arcade.variant === "mole"
                    ? "cursor-pointer"
                    : ""
                }`}
                style={{ background: content.arcade.palette.background }}
              />
            </div>
            <div className="mt-3 rounded-md border bg-muted/20 p-3">
              <p className="text-sm font-semibold">{content.arcade.goal}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{content.arcade.controls}</p>
            </div>
            {content.arcade.variant === "snake" ||
            content.arcade.variant === "password" ||
            content.arcade.variant === "minesweeper" ||
            content.arcade.variant === "match-three" ||
            content.arcade.variant === "mole" ? (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <span aria-hidden />
                <Button variant="outline" className="h-12" onClick={() => performAction("up")} data-play-action="arcade-up" aria-label="위">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span aria-hidden />
                <Button variant="outline" className="h-12" onClick={() => performAction("left")} data-play-action="arcade-left" aria-label="왼쪽">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button className="h-12" onClick={() => performAction("main")} data-play-action="arcade-main">
                  {view.started ? mainActionLabel(content) : "시작"}
                </Button>
                <Button variant="outline" className="h-12" onClick={() => performAction("right")} data-play-action="arcade-right" aria-label="오른쪽">
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <span aria-hidden />
                <Button variant="outline" className="h-12" onClick={() => performAction("down")} data-play-action="arcade-down" aria-label="아래">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <span aria-hidden />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-12" onClick={() => performAction("left")} data-play-action="arcade-left">
                  왼쪽
                </Button>
                <Button className="h-12" onClick={() => performAction("main")} data-play-action="arcade-main">
                  {view.started ? mainActionLabel(content) : "시작"}
                </Button>
                <Button variant="outline" className="h-12" onClick={() => performAction("right")} data-play-action="arcade-right">
                  오른쪽
                </Button>
              </div>
            )}
          </div>
          <HistoryPanel history={view.history} />
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function HistoryPanel({ history }: { history: HistoryItem[] }) {
  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history>
      <p className="text-sm font-semibold">이번 판 흔적</p>
      {history.length ? (
        <ol className="mt-3 space-y-2">
          {history.map((item, index) => (
            <li key={`${item.label}-${index}`} className="rounded-sm border bg-background p-2.5">
              <p className="text-sm font-medium">{item.label}</p>
              <p className={item.score >= 0 ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-red-600"}>
                {item.detail} / {item.score > 0 ? `+${item.score}` : item.score}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">방향키와 Space로 움직이면 방금 지나간 선택이 여기에 남습니다.</p>
      )}
    </aside>
  );
}
