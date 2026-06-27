import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pickLabel, pseudoRandom, type CanvasPoint } from "@/features/play/arcade-engine-utils";

const snakeCanvasWidth = 720;

export const snakeCellSize = 24;
export const snakeColumns = 24;
export const snakeRows = 14;
export const snakeBoardX = (snakeCanvasWidth - snakeColumns * snakeCellSize) / 2;
export const snakeBoardY = 58;
export const snakeMoveInterval = 0.18;

export type SnakeDirection = "up" | "down" | "left" | "right";

export type SnakeCell = {
  x: number;
  y: number;
};

export type SnakeFood = SnakeCell & {
  label: string;
  good: boolean;
};

export type SnakeMovePreview = {
  direction: SnakeDirection;
  head: SnakeCell;
  willEat: boolean;
  hitWall: boolean;
  hitSelf: boolean;
  foodDistance: number;
  nextFoodDistance: number;
};

type SnakeHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type SnakePlayState = {
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  playTick: number;
  snake: SnakeCell[];
  snakeDirection: SnakeDirection;
  snakeNextDirection: SnakeDirection;
  snakeMoveTimer: number;
  snakeFood: SnakeFood;
  history: SnakeHistoryItem[];
};

const snakeDirectionDeltas: Record<SnakeDirection, SnakeCell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function makeSnake(): SnakeCell[] {
  const headX = Math.floor(snakeColumns / 2);
  const headY = Math.floor(snakeRows / 2);
  return [
    { x: headX, y: headY },
    { x: headX - 1, y: headY },
    { x: headX - 2, y: headY },
  ];
}

export function makeSnakeFood(content: ArcadeGameContent, seed: number, snake: SnakeCell[]): SnakeFood {
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

export function snakeDirectionFromAction(action: "left" | "right" | "main" | "up" | "down"): SnakeDirection | null {
  if (action === "up") return "up";
  if (action === "down") return "down";
  if (action === "left") return "left";
  if (action === "right") return "right";
  return null;
}

export function pointInSnakeBoard(point: CanvasPoint) {
  return (
    point.x >= snakeBoardX - 16 &&
    point.x <= snakeBoardX + snakeColumns * snakeCellSize + 16 &&
    point.y >= snakeBoardY - 16 &&
    point.y <= snakeBoardY + snakeRows * snakeCellSize + 16
  );
}

export function snakeDirectionFromDrag(start: CanvasPoint, current: CanvasPoint): SnakeDirection | null {
  const dx = current.x - start.x;
  const dy = current.y - start.y;
  if (Math.hypot(dx, dy) < 18) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "up" : "down";
}

export function snakeDirectionFromPoint(state: Pick<SnakePlayState, "snake">, point: CanvasPoint): SnakeDirection | null {
  const head = state.snake[0];
  if (!head) return null;
  const headCenterX = snakeBoardX + head.x * snakeCellSize + snakeCellSize / 2;
  const headCenterY = snakeBoardY + head.y * snakeCellSize + snakeCellSize / 2;
  return snakeDirectionFromDrag({ x: headCenterX, y: headCenterY }, point);
}

export function setSnakeDirection(state: Pick<SnakePlayState, "snakeDirection" | "snakeNextDirection">, direction: SnakeDirection) {
  if (isSnakeReverse(direction, state.snakeDirection)) return;
  state.snakeNextDirection = direction;
}

export function snakeAutoSteerTowardFood(state: SnakePlayState) {
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

export function snakeMovePreview(state: Pick<SnakePlayState, "snake" | "snakeDirection" | "snakeNextDirection" | "snakeFood">): SnakeMovePreview {
  const direction = isSnakeReverse(state.snakeNextDirection, state.snakeDirection) ? state.snakeDirection : state.snakeNextDirection;
  const head = nextSnakeHead(state, direction);
  const currentHead = state.snake[0] ?? head;
  const willEat = head.x === state.snakeFood.x && head.y === state.snakeFood.y;
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  return {
    direction,
    head,
    willEat,
    hitWall: head.x < 0 || head.x >= snakeColumns || head.y < 0 || head.y >= snakeRows,
    hitSelf: bodyToCheck.some((cell) => cell.x === head.x && cell.y === head.y),
    foodDistance: Math.abs(state.snakeFood.x - currentHead.x) + Math.abs(state.snakeFood.y - currentHead.y),
    nextFoodDistance: Math.abs(state.snakeFood.x - head.x) + Math.abs(state.snakeFood.y - head.y),
  };
}

export function snakeCellCenter(cell: SnakeCell) {
  return {
    x: snakeBoardX + cell.x * snakeCellSize + snakeCellSize / 2,
    y: snakeBoardY + cell.y * snakeCellSize + snakeCellSize / 2,
  };
}

export function advanceSnake(content: ArcadeGameContent, state: SnakePlayState, countAction: boolean) {
  if (state.finished) return;
  const direction = isSnakeReverse(state.snakeNextDirection, state.snakeDirection) ? state.snakeDirection : state.snakeNextDirection;
  state.snakeDirection = direction;
  if (countAction) state.playTick += 1;

  const head = nextSnakeHead(state, direction);
  const willEat = head.x === state.snakeFood.x && head.y === state.snakeFood.y;
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitWall = head.x < 0 || head.x >= snakeColumns || head.y < 0 || head.y >= snakeRows;
  const hitSelf = bodyToCheck.some((cell) => cell.x === head.x && cell.y === head.y);

  if (hitWall || hitSelf) {
    state.score = Math.max(0, state.score - 2);
    state.focus = clamp(state.focus - 16, 0, 100);
    rememberSnakeHistory(state, {
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
  rememberSnakeHistory(state, {
    label: state.snakeFood.label,
    detail: state.snakeFood.good ? "잘 먹음" : "괜히 물었음",
    score: delta,
  });
  state.snakeFood = makeSnakeFood(content, state.playTick + state.score + state.snake.length, state.snake);
  finishSnakeIfNeeded(content, state);
}

export function updateSnake(content: ArcadeGameContent, state: SnakePlayState, dt: number) {
  state.elapsed += dt;
  state.snakeMoveTimer -= dt;

  if (state.snakeMoveTimer <= 0) {
    advanceSnake(content, state, false);
    state.snakeMoveTimer = snakeMoveInterval;
  }

  finishSnakeIfNeeded(content, state);
}

function isSnakeReverse(next: SnakeDirection, current: SnakeDirection) {
  return (
    (next === "up" && current === "down") ||
    (next === "down" && current === "up") ||
    (next === "left" && current === "right") ||
    (next === "right" && current === "left")
  );
}

function nextSnakeHead(state: Pick<SnakePlayState, "snake">, direction: SnakeDirection) {
  const head = state.snake[0] ?? { x: Math.floor(snakeColumns / 2), y: Math.floor(snakeRows / 2) };
  const delta = snakeDirectionDeltas[direction];
  return { x: head.x + delta.x, y: head.y + delta.y };
}

function isSnakeCellUnsafe(state: SnakePlayState, direction: SnakeDirection) {
  const head = nextSnakeHead(state, direction);
  if (head.x < 0 || head.x >= snakeColumns || head.y < 0 || head.y >= snakeRows) return true;
  return state.snake.slice(0, -1).some((cell) => cell.x === head.x && cell.y === head.y);
}

function resetSnakeAfterCrash(content: ArcadeGameContent, state: SnakePlayState) {
  const snake = makeSnake();
  state.snake = snake;
  state.snakeDirection = "right";
  state.snakeNextDirection = "right";
  state.snakeMoveTimer = snakeMoveInterval;
  state.snakeFood = makeSnakeFood(content, state.playTick + state.score + 17, snake);
}

function finishSnakeIfNeeded(_content: ArcadeGameContent, state: SnakePlayState) {
  if (state.focus <= 0 || state.elapsed >= 60) {
    state.finished = true;
  }
}

function rememberSnakeHistory(state: Pick<SnakePlayState, "history">, item: SnakeHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}
