"use client";

import * as React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArcadeGameContent } from "@/features/content/types";
import {
  adjustPasswordDigit,
  applyPasswordSuggestion,
  formatPasswordOptionDigits,
  makePasswordSecret,
  movePasswordCursor,
  passwordCandidateStats,
  passwordDigitFromKeyboardCode,
  passwordDigitCount,
  passwordDigitGap,
  passwordDigitHeight,
  passwordDigitIndexAt,
  passwordDigitMarks,
  passwordDigitStartX,
  passwordDigitWidth,
  passwordDigitY,
  passwordGuessHasDuplicateDigits,
  passwordGuessIsPossible,
  passwordGuessText,
  passwordKeypadColumns,
  passwordKeypadDigitAt,
  passwordKeypadGap,
  passwordKeypadHeight,
  passwordKeypadWidth,
  passwordKeypadX,
  passwordKeypadY,
  passwordPositionOptions,
  passwordSubmitRect,
  passwordSuggestionRect,
  passwordTimeLimitSeconds,
  passwordSuggestion,
  setPasswordDigit,
  setPasswordDigitFromClick,
  submitPasswordGuess,
  updatePassword,
  type PasswordAttempt,
} from "@/features/play/arcade-password";
import { clamp, pickLabel, pointInRect, pseudoRandom, type CanvasPoint } from "@/features/play/arcade-engine-utils";
import {
  chooseGemTile,
  clearGemDrag,
  commitGemSwap,
  gemBoardHeight,
  gemBoardWidth,
  gemBoardX,
  gemBoardY,
  gemCellCenter,
  gemCellIndexAt,
  gemCellSize,
  gemColumns,
  gemGap,
  gemIndex,
  gemTargetFromDrag,
  makeGemTiles,
  moveGemCursor,
  pressGemMain,
  updateGemSwap,
  type GemTile,
} from "@/features/play/arcade-match-three";
import {
  makeMineCells,
  mineBoardHeight,
  mineBoardWidth,
  mineBoardX,
  mineBoardY,
  mineCellIndexAt,
  mineCellSize,
  mineColumns,
  mineGap,
  moveMineCursor,
  moveMineCursorToNextSafe,
  revealMineFlood,
  revealedMineSafeCount,
  totalMineSafeCount,
  type MineCell,
} from "@/features/play/arcade-minesweeper";
import {
  activeMoleAt,
  moleBoardHeight,
  moleBoardWidth,
  moleBoardX,
  moleBoardY,
  moleColumns,
  moleHoleAt,
  moleHoleCenter,
  moleHoleSize,
  moleRows,
  moveMoleCursor,
  spawnMoleTarget,
  type MoleTarget,
} from "@/features/play/arcade-mole";
import {
  centerStackerActiveAt,
  makeStackerBlocks,
  nudgeStacker,
  resetStackerActiveFromTop,
  stackerBaseWidth,
  stackerBaseY,
  stackerBlockHeight,
  stackerBoardHeight,
  stackerBoardWidth,
  stackerBoardX,
  stackerBoardY,
  stackerMinOverlap,
  topStackerBlock,
  type StackerBlock,
} from "@/features/play/arcade-stacker";
import {
  advanceSnake,
  makeSnake,
  makeSnakeFood,
  setSnakeDirection,
  snakeAutoSteerTowardFood,
  snakeBoardX,
  snakeBoardY,
  snakeCellSize,
  snakeColumns,
  snakeDirectionFromAction,
  snakeMoveInterval,
  snakeRows,
  updateSnake,
  type SnakeCell,
  type SnakeDirection,
  type SnakeFood,
} from "@/features/play/arcade-snake";
import {
  chooseSumTile,
  clearSumDrag,
  commitDraggedSumTiles,
  makeSumTiles,
  moveSumCursor,
  pointInSumBoard,
  rememberSumDragSegment,
  rememberSumDragTile,
  selectedSumTiles,
  sumBoxBoardHeight,
  sumBoxBoardWidth,
  sumBoxColumns,
  sumBoxGap,
  sumBoxRows,
  sumBoxStartX,
  sumBoxStartY,
  sumBoxTileHeight,
  sumBoxTimeLimitSeconds,
  sumBoxSelectionSummary,
  sumDragTiles,
  sumTileIndexAt,
  updateSumBox,
  type SumTile,
} from "@/features/play/arcade-sum-box";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

const canvasWidth = 720;
const canvasHeight = 520;
const crossingLanes = [326, 274, 222, 170, 118, 66];
const crossingStartY = canvasHeight - 42;
const crossingStepX = 48;
const crossingStepY = 52;
const memoryColumns = 3;
const memoryRows = 3;
const memoryCellSize = 78;
const memoryGap = 18;
const memoryBoardWidth = memoryColumns * memoryCellSize + (memoryColumns - 1) * memoryGap;
const memoryBoardHeight = memoryRows * memoryCellSize + (memoryRows - 1) * memoryGap;
const memoryBoardX = 86;
const memoryBoardY = 82;
const memoryFlashStep = 0.58;
const memoryFlashOn = 0.36;

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
  sumDragStart: CanvasPoint | null;
  sumDragCurrent: CanvasPoint | null;
  sumDragMoved: boolean;
  sumDragTileIds: number[];
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
  gemDragStart: CanvasPoint | null;
  gemDragCurrent: CanvasPoint | null;
  gemDragStartIndex: number | null;
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
  memorySequence: number[];
  memoryInput: number[];
  memoryCursor: number;
  memoryRound: number;
  memoryShowing: boolean;
  memoryFlashIndex: number;
  memoryFlashTimer: number;
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
    sumDragStart: null,
    sumDragCurrent: null,
    sumDragMoved: false,
    sumDragTileIds: [],
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
    gemDragStart: null,
    gemDragCurrent: null,
    gemDragStartIndex: null,
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
    memorySequence: makeMemorySequence(content, 1, 0),
    memoryInput: [],
    memoryCursor: 4,
    memoryRound: 1,
    memoryShowing: true,
    memoryFlashIndex: 0,
    memoryFlashTimer: 0,
    brickBallX: canvasWidth / 2,
    brickBallY: canvasHeight - 96,
    brickBallVx: 180,
    brickBallVy: -260,
    brickLaunched: false,
    history: [],
    lastFrame: null,
  };
}

function memoryLengthForRound(round: number) {
  return clamp(3 + Math.floor((round - 1) / 2), 3, 7);
}

function makeMemorySequence(content: ArcadeGameContent, round: number, salt: number) {
  if (content.arcade.variant !== "memory") return [];
  const length = memoryLengthForRound(round);
  const sequence: number[] = [];
  for (let index = 0; index < length; index += 1) {
    const seed = content.slug.length * 83 + round * 47 + salt * 19 + index * 29;
    let cell = Math.floor(pseudoRandom(seed) * memoryColumns * memoryRows);
    const previous = sequence[sequence.length - 1];
    if (cell === previous) cell = (cell + 1 + (index % 3)) % (memoryColumns * memoryRows);
    sequence.push(cell);
  }
  return sequence;
}

function resetMemoryPreview(content: ArcadeGameContent, state: GameState, keepSequence = true) {
  state.memorySequence = keepSequence ? state.memorySequence : makeMemorySequence(content, state.memoryRound, state.actions + state.score);
  state.memoryInput = [];
  state.memoryShowing = true;
  state.memoryFlashIndex = 0;
  state.memoryFlashTimer = 0;
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

function addHistory(state: GameState, item: HistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function arcadeTimeLimitSeconds(content: ArcadeGameContent) {
  if (content.arcade.variant === "sum-box") return sumBoxTimeLimitSeconds;
  if (content.arcade.variant === "password") return passwordTimeLimitSeconds;
  return content.arcade.rounds * 5;
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

function memoryCellCenter(cell: number) {
  const column = cell % memoryColumns;
  const row = Math.floor(cell / memoryColumns);
  return {
    x: memoryBoardX + column * (memoryCellSize + memoryGap) + memoryCellSize / 2,
    y: memoryBoardY + row * (memoryCellSize + memoryGap) + memoryCellSize / 2,
  };
}

function memoryCellAt(x: number, y: number) {
  const boardRight = memoryBoardX + memoryBoardWidth;
  const boardBottom = memoryBoardY + memoryBoardHeight;
  if (x < memoryBoardX || y < memoryBoardY || x > boardRight || y > boardBottom) return -1;
  const localX = x - memoryBoardX;
  const localY = y - memoryBoardY;
  const column = Math.floor(localX / (memoryCellSize + memoryGap));
  const row = Math.floor(localY / (memoryCellSize + memoryGap));
  const insideX = localX - column * (memoryCellSize + memoryGap);
  const insideY = localY - row * (memoryCellSize + memoryGap);
  if (insideX > memoryCellSize || insideY > memoryCellSize) return -1;
  if (column < 0 || column >= memoryColumns || row < 0 || row >= memoryRows) return -1;
  return row * memoryColumns + column;
}

function moveMemoryCursor(state: GameState, delta: number) {
  const total = memoryColumns * memoryRows;
  state.memoryCursor = (state.memoryCursor + delta + total) % total;
}

function memoryDigitFromKeyboardCode(code: string) {
  if (/^Digit[1-9]$/.test(code)) return Number(code.slice(5)) - 1;
  if (/^Numpad[1-9]$/.test(code)) return Number(code.slice(6)) - 1;
  return -1;
}

function activeMemoryFlashCell(state: GameState) {
  if (!state.memoryShowing || !state.memorySequence.length || state.memoryFlashIndex < 0) return -1;
  const phase = state.memoryFlashTimer % memoryFlashStep;
  if (phase > memoryFlashOn) return -1;
  return state.memorySequence[state.memoryFlashIndex] ?? -1;
}

function finishMemoryIfNeeded(content: ArcadeGameContent, state: GameState) {
  if (state.score >= content.arcade.targetScore || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= 60) {
    state.finished = true;
  }
}

function chooseMemoryCell(content: ArcadeGameContent, state: GameState, cell = state.memoryCursor) {
  if (state.finished) return;
  if (state.memoryShowing) {
    state.actions += 1;
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 6, 0, 100);
    addHistory(state, {
      label: "너무 빠름",
      detail: "불빛 끝나고 누르기",
      score: -1,
    });
    resetMemoryPreview(content, state, true);
    finishMemoryIfNeeded(content, state);
    return;
  }

  state.memoryCursor = cell;
  const expected = state.memorySequence[state.memoryInput.length];
  if (cell === expected) {
    state.memoryInput = [...state.memoryInput, cell];
    if (state.memoryInput.length < state.memorySequence.length) return;

    state.actions += 1;
    const delta = 4 + state.memorySequence.length;
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + 5, 0, 100);
    addHistory(state, {
      label: `${state.memorySequence.length}칸`,
      detail: "순서 맞음",
      score: delta,
    });
    state.memoryRound += 1;
    resetMemoryPreview(content, state, false);
    finishMemoryIfNeeded(content, state);
    return;
  }

  state.actions += 1;
  state.score = Math.max(0, state.score - 2);
  state.focus = clamp(state.focus - 13, 0, 100);
  addHistory(state, {
    label: `${cell + 1}번`,
    detail: "순서 놓침",
    score: -2,
  });
  resetMemoryPreview(content, state, true);
  finishMemoryIfNeeded(content, state);
}

function canvasPointFromEvent(canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement> | React.PointerEvent<HTMLCanvasElement>) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvasWidth,
    y: ((event.clientY - rect.top) / rect.height) * canvasHeight,
  };
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

  if (content.arcade.variant === "memory") {
    updateMemory(content, state, dt);
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

function updateMemory(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  if (!state.memorySequence.length) {
    resetMemoryPreview(content, state, false);
  }

  if (state.memoryShowing) {
    state.memoryFlashTimer += dt;
    const nextIndex = Math.floor(state.memoryFlashTimer / memoryFlashStep);
    if (nextIndex >= state.memorySequence.length) {
      state.memoryShowing = false;
      state.memoryFlashIndex = -1;
      state.memoryFlashTimer = 0;
      state.memoryInput = [];
    } else {
      state.memoryFlashIndex = nextIndex;
    }
  }

  finishMemoryIfNeeded(content, state);
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

  if (content.arcade.variant === "memory") {
    drawMemory(content, state, ctx);
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

function drawMemory(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent } = content.arcade.palette;
  const activeCell = activeMemoryFlashCell(state);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(memoryBoardX + memoryBoardWidth / 2, 210, 20, memoryBoardX + memoryBoardWidth / 2, 210, 330);
  glow.addColorStop(0, "rgba(129,140,248,0.2)");
  glow.addColorStop(1, "rgba(129,140,248,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(memoryBoardX - 20, memoryBoardY - 20, memoryBoardWidth + 40, memoryBoardHeight + 40, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let cell = 0; cell < memoryColumns * memoryRows; cell += 1) {
    const column = cell % memoryColumns;
    const row = Math.floor(cell / memoryColumns);
    const x = memoryBoardX + column * (memoryCellSize + memoryGap);
    const y = memoryBoardY + row * (memoryCellSize + memoryGap);
    const isActive = activeCell === cell;
    const isCursor = state.memoryCursor === cell;
    const isEntered = state.memoryInput.includes(cell);
    const label = pickLabel(content.arcade.goodLabels, cell);

    if (isActive) {
      const center = memoryCellCenter(cell);
      const cellGlow = ctx.createRadialGradient(center.x, center.y, 8, center.x, center.y, 76);
      cellGlow.addColorStop(0, "rgba(190,242,100,0.5)");
      cellGlow.addColorStop(1, "rgba(190,242,100,0)");
      ctx.fillStyle = cellGlow;
      ctx.fillRect(x - 28, y - 28, memoryCellSize + 56, memoryCellSize + 56);
    }

    ctx.fillStyle = isActive ? accent : isEntered ? "rgba(129,140,248,0.88)" : "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(x, y, memoryCellSize, memoryCellSize, 18);
    ctx.fill();
    ctx.strokeStyle = isCursor ? primary : "rgba(255,255,255,0.18)";
    ctx.lineWidth = isCursor ? 3 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.fillStyle = isActive || isEntered ? "#111827" : "rgba(248,250,252,0.78)";
    ctx.font = "900 24px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${cell + 1}`, x + memoryCellSize / 2, y + 38);
    ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(label.slice(0, 4), x + memoryCellSize / 2, y + 58);
  }

  const panelX = 430;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(panelX, 82, 218, 238, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "850 17px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(state.memoryShowing ? "불빛 보는 중" : "이제 그대로 누르기", panelX + 18, 118);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`차례 ${state.memoryRound} · 길이 ${state.memorySequence.length}`, panelX + 18, 146);

  const dotY = 184;
  for (let index = 0; index < state.memorySequence.length; index += 1) {
    const dotX = panelX + 22 + index * 24;
    const done = index < state.memoryInput.length;
    const current = !state.memoryShowing && index === state.memoryInput.length;
    ctx.fillStyle = done ? accent : current ? primary : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(dotX, dotY, current ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`입력 ${Math.min(state.actions, content.arcade.rounds)} / ${content.arcade.rounds}`, panelX + 18, 224);
  ctx.fillText("틀리면 같은 불빛을 한 번 더 보여줍니다.", panelX + 18, 252);
  ctx.fillText("외웠으면 숫자키로 바로 눌러도 됩니다.", panelX + 18, 276);

  if (!state.memoryShowing && state.memoryInput.length) {
    const last = state.memoryInput[state.memoryInput.length - 1];
    ctx.fillStyle = "rgba(190,242,100,0.9)";
    ctx.font = "850 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`방금 ${typeof last === "number" ? last + 1 : ""}번`, panelX + 18, 304);
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스로 칸을 누르거나 방향키/WASD로 옮겨 Space. 숫자 1~9도 됩니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("빛난 칸 순서를 기억해서 같은 순서로 누릅니다.", canvasWidth / 2, 202);
    ctx.fillText("마우스로 눌러도 되고, 방향키와 Space로 골라도 됩니다.", canvasWidth / 2, 228);
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
  const openedSafe = revealedMineSafeCount(state);
  const totalSafe = totalMineSafeCount(state);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(mineBoardX + mineBoardWidth / 2, mineBoardY + mineBoardHeight / 2, 40, mineBoardX + mineBoardWidth / 2, mineBoardY + mineBoardHeight / 2, 310);
  glow.addColorStop(0, "rgba(147,197,253,0.14)");
  glow.addColorStop(1, "rgba(147,197,253,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.beginPath();
  ctx.roundRect(mineBoardX - 14, mineBoardY - 14, mineBoardWidth + 28, mineBoardHeight + 28, 18);
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
  const dragTarget = state.gemDragStartIndex !== null ? gemTargetFromDrag(state) : -1;
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
  ctx.fillText("색돌 보드", 36, 64);
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`이동 ${Math.min(state.actions, content.arcade.rounds)} / ${content.arcade.rounds}`, 36, 88);
  ctx.fillText(`콤보 ${state.gemCombo}`, 36, 110);

  const selectedIndex = state.gemDragStartIndex ?? state.gemSelected;
  const selectedTile = selectedIndex !== null ? state.gemTiles[selectedIndex] : null;
  if (selectedTile) {
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(34, 132, 122, 70, 14);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(state.gemDragStartIndex !== null ? "잡은 돌" : "고른 돌", 48, 156);
    ctx.fillStyle = gemColor(content, selectedTile);
    ctx.font = "900 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(selectedTile.label.slice(0, 6), 48, 184);
  }

  for (const tile of state.gemTiles) {
    const index = gemIndex(tile.column, tile.row);
    const x = gemBoardX + tile.column * (gemCellSize + gemGap);
    const y = gemBoardY + tile.row * (gemCellSize + gemGap);
    const selected = state.gemSelected === index || state.gemDragStartIndex === index;
    const cursor = state.gemCursor === index || dragTarget === index;
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

  if (state.gemDragStartIndex !== null && dragTarget >= 0 && state.gemTiles[dragTarget]) {
    const start = gemCellCenter(state.gemDragStartIndex);
    const end = gemCellCenter(dragTarget);
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(end.x, end.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("마우스로 색돌을 옆 칸으로 끌거나, 방향키로 옮겨 Space를 누릅니다.", 34, canvasHeight - 20);
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
    ctx.fillText("색돌을 옆 칸으로 끌어 셋을 맞춥니다.", canvasWidth / 2, 202);
    ctx.fillText("마우스로 드래그하거나 방향키와 Space로 고르면 됩니다.", canvasWidth / 2, 228);
  }
}

function drawPassword(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const latest = state.passwordAttempts[0];
  const candidateStats = passwordCandidateStats(state.passwordAttempts);
  const candidates = candidateStats.candidates;
  const positionOptions = passwordPositionOptions(candidates);
  const suggestion = passwordSuggestion(state.passwordAttempts);
  const digitMarks = passwordDigitMarks(state.passwordAttempts);
  const currentGuess = passwordGuessText(state.passwordGuess);
  const duplicateCurrent = passwordGuessHasDuplicateDigits(state.passwordGuess);
  const repeatedCurrent = state.passwordAttempts.some((attempt, index) => attempt.guess === currentGuess && (index > 0 || attempt.repeated));
  const impossibleCurrent =
    !duplicateCurrent && state.passwordAttempts.length > 0 && !state.passwordAttempts.some((attempt) => attempt.guess === currentGuess) && !passwordGuessIsPossible(state.passwordAttempts, currentGuess);
  const statusText = duplicateCurrent
    ? "중복 숫자는 열리지 않습니다"
    : repeatedCurrent
      ? "이미 해본 번호입니다"
      : impossibleCurrent
        ? "기록과 안 맞는 번호입니다"
        : latest
          ? latest.hint
          : "숫자키로 바로 넣어도 됩니다";

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const centerX = canvasWidth / 2;
  const glow = ctx.createRadialGradient(centerX, 188, 20, centerX, 188, 250);
  glow.addColorStop(0, "rgba(96,165,250,0.22)");
  glow.addColorStop(1, "rgba(96,165,250,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(120, 24, 480, 318);

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
  ctx.fillText("금고 번호 맞히기", centerX, 120);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.roundRect(34, 72, 152, 138, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("남은 후보", 48, 96);
  ctx.fillStyle = candidates.length <= 12 ? accent : "#f8fafc";
  ctx.font = "900 24px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(`${candidates.length}`, 48, 124);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    state.passwordAttempts.length ? `이번 힌트로 ${candidateStats.narrowedBy}개 줄임` : "괜찮은 다음 수",
    48,
    146,
  );
  ctx.fillStyle = "rgba(251,191,36,0.18)";
  ctx.beginPath();
  ctx.roundRect(passwordSuggestionRect.x, passwordSuggestionRect.y, passwordSuggestionRect.width, passwordSuggestionRect.height, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(251,191,36,0.46)";
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 17px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(suggestion, passwordSuggestionRect.x + 14, passwordSuggestionRect.y + 24);
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "750 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("누르면 넣기", passwordSuggestionRect.x + 68, passwordSuggestionRect.y + 24);
  ctx.textAlign = "center";

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(34, 224, 152, 104, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.64)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("자리별 가능성", 48, 248);
  positionOptions.forEach((digits, index) => {
    const y = 272 + index * 18;
    ctx.fillStyle = index === state.passwordCursor ? accent : "rgba(255,255,255,0.52)";
    ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${index + 1}칸`, 48, y);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "850 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(formatPasswordOptionDigits(digits), 86, y);
  });
  ctx.textAlign = "center";

  for (let index = 0; index < passwordDigitCount; index += 1) {
    const x = passwordDigitStartX + index * (passwordDigitWidth + passwordDigitGap);
    const selected = index === state.passwordCursor;
    const digit = state.passwordGuess[index] ?? 0;
    const positionConflict = state.passwordAttempts.length > 0 && !positionOptions[index]?.includes(digit);
    const gradient = ctx.createLinearGradient(0, passwordDigitY, 0, passwordDigitY + passwordDigitHeight);
    gradient.addColorStop(0, selected ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)");
    gradient.addColorStop(1, selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, passwordDigitY, passwordDigitWidth, passwordDigitHeight, 18);
    ctx.fill();
    ctx.shadowColor = selected ? "rgba(96,165,250,0.35)" : "transparent";
    ctx.shadowBlur = selected ? 18 : 0;
    ctx.strokeStyle = positionConflict ? danger : selected ? primary : "rgba(255,255,255,0.2)";
    ctx.lineWidth = selected ? 3 : 1;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = selected ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.42)";
    ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${index + 1}칸`, x + passwordDigitWidth / 2, passwordDigitY + 22);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x + 16, passwordDigitY + 34, passwordDigitWidth - 32, 1);
    ctx.fillRect(x + 16, passwordDigitY + 83, passwordDigitWidth - 32, 1);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "900 54px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(`${digit}`, x + passwordDigitWidth / 2, passwordDigitY + 76);
    ctx.fillStyle = selected ? accent : "rgba(255,255,255,0.5)";
    ctx.font = "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("↑↓", x + passwordDigitWidth / 2, passwordDigitY + 100);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = duplicateCurrent || repeatedCurrent || impossibleCurrent ? danger : "rgba(255,255,255,0.62)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(statusText, centerX, passwordSubmitRect.y - 18);

  const pegStartX = centerX - 38;
  const pegY = passwordSubmitRect.y - 40;
  const latestEvidence = latest && !latest.issue ? latest : null;
  for (let index = 0; index < passwordDigitCount; index += 1) {
    const filledExact = latestEvidence ? index < latestEvidence.exact : false;
    const filledNear = latestEvidence ? index >= latestEvidence.exact && index < latestEvidence.exact + latestEvidence.near : false;
    ctx.fillStyle = filledExact ? primary : filledNear ? accent : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(pegStartX + index * 38, pegY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.stroke();
  }

  ctx.fillStyle = latest?.exact === passwordDigitCount ? primary : duplicateCurrent || repeatedCurrent || impossibleCurrent ? danger : accent;
  ctx.beginPath();
  ctx.roundRect(passwordSubmitRect.x, passwordSubmitRect.y, passwordSubmitRect.width, passwordSubmitRect.height, 14);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(duplicateCurrent || repeatedCurrent || impossibleCurrent ? "다른 번호" : "확인", centerX, passwordSubmitRect.y + 28);

  ctx.textAlign = "center";
  for (let digit = 0; digit <= 9; digit += 1) {
    const column = digit % passwordKeypadColumns;
    const row = Math.floor(digit / passwordKeypadColumns);
    const x = passwordKeypadX + column * (passwordKeypadWidth + passwordKeypadGap);
    const y = passwordKeypadY + row * (passwordKeypadHeight + passwordKeypadGap);
    const mark = digitMarks[digit];
    ctx.fillStyle = mark === "absent" ? "rgba(148,163,184,0.18)" : mark === "candidate" ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(x, y, passwordKeypadWidth, passwordKeypadHeight, 10);
    ctx.fill();
    ctx.strokeStyle = mark === "absent" ? "rgba(148,163,184,0.26)" : mark === "candidate" ? "rgba(251,191,36,0.55)" : "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = mark === "absent" ? "rgba(255,255,255,0.34)" : "#f8fafc";
    ctx.font = "900 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(`${digit}`, x + passwordKeypadWidth / 2, y + 19);
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
    const issueLabel = attempt.issue === "duplicate" ? "중복" : attempt.issue === "contradiction" ? "충돌" : null;
    ctx.fillStyle = attempt.repeated || attempt.issue ? "rgba(251,113,133,0.18)" : "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(historyX, y, historyWidth, 32, 9);
    ctx.fill();
    ctx.fillStyle = attempt.exact === passwordDigitCount ? primary : "#f8fafc";
    ctx.font = "900 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(attempt.guess, historyX + 12, y + 20);
    ctx.fillStyle = attempt.exact ? primary : "rgba(255,255,255,0.68)";
    ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(issueLabel ?? `${attempt.exact}자리`, historyX + 62, y + 20);
    ctx.fillStyle = attempt.near ? accent : "rgba(255,255,255,0.56)";
    ctx.fillText(issueLabel ? "무효" : `${attempt.near}숫자`, historyX + 110, y + 20);
    ctx.fillStyle = "rgba(255,255,255,0.56)";
    ctx.font = "700 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(attempt.hint.slice(0, 14), historyX + 12, y + 30);
  });

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("숫자키 입력, ←/→ 자리 이동, ↑/↓ 변경, R 추천, Space/Enter 확인. 후보도 누를 수 있습니다.", 34, passwordKeypadY - 18);

  if (state.focus < 35) {
    ctx.fillStyle = danger;
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("조급해졌습니다. 기록을 보고 하나씩 줄이세요.", 34, passwordKeypadY - 38);
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
  const dragging = state.sumDragStart !== null && state.sumDragCurrent !== null;
  const dragTiles = dragging ? sumDragTiles(state) : [];
  const dragTileIds = new Set(dragTiles.map((tile) => tile.id));
  const shownTiles = dragging ? dragTiles : selectedSumTiles(state);
  const selectionSummary = sumBoxSelectionSummary(state, shownTiles);
  const shownSum = selectionSummary.sum;
  const complementTileIds = selectionSummary.complementTileIds;
  const cleared = state.sumTiles.filter((tile) => tile.cleared).length;
  const timeLimit = arcadeTimeLimitSeconds(content);
  const timeLeft = Math.max(0, Math.ceil(timeLimit - state.elapsed));
  const timeRatio = clamp(timeLeft / timeLimit, 0, 1);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const glow = ctx.createRadialGradient(canvasWidth / 2, 212, 30, canvasWidth / 2, 212, 360);
  glow.addColorStop(0, "rgba(255,255,255,0.12)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(sumBoxStartX - 14, sumBoxStartY - 14, sumBoxBoardWidth + 28, sumBoxBoardHeight + 28, 22);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 1;
  ctx.stroke();
  for (let row = 0; row < sumBoxRows; row += 1) {
    ctx.fillStyle = row % 2 === 0 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)";
    ctx.fillRect(sumBoxStartX - 8, sumBoxStartY - 7 + row * (sumBoxTileHeight + sumBoxGap), sumBoxBoardWidth + 16, sumBoxTileHeight + 10);
  }

  ctx.fillStyle = "rgba(15,23,42,0.36)";
  ctx.beginPath();
  ctx.roundRect(24, 18, canvasWidth - 48, 48, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(canvasWidth - 176, 52, 132, 6, 3);
  ctx.fill();
  ctx.fillStyle = timeLeft <= 10 ? danger : accent;
  ctx.beginPath();
  ctx.roundRect(canvasWidth - 176, 52, 132 * timeRatio, 6, 3);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${dragging ? "드래그 합" : "합"} ${shownSum} / 10`, 42, 48);
  ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.fillText(`비운 칸 ${cleared} / ${state.sumTiles.length}`, 190, 48);
  ctx.textAlign = "right";
  ctx.fillText(`남은 ${timeLeft}초`, canvasWidth - 44, 48);
  ctx.textAlign = "left";
  ctx.fillText(shownTiles.length ? `${shownTiles.map((tile) => tile.value).join(" + ")} · ${selectionSummary.status}` : "마우스로 쓸어 담기", 42, 68);

  if (dragging && dragTiles.length > 1) {
    ctx.strokeStyle = shownSum === 10 ? "rgba(251,191,36,0.68)" : shownSum > 10 ? "rgba(251,113,133,0.58)" : "rgba(255,255,255,0.38)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    dragTiles.forEach((tile, index) => {
      const x = tile.x + tile.width / 2;
      const y = tile.y + tile.height / 2;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  for (const tile of state.sumTiles) {
    const isCursor = tile.id === state.sumCursor;
    const isActive = dragging ? dragTileIds.has(tile.id) : tile.selected;
    const isComplement = complementTileIds.has(tile.id);
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
    } else if (isActive) {
      tileGradient.addColorStop(0, "rgba(254,243,199,0.96)");
      tileGradient.addColorStop(1, accent);
    } else {
      tileGradient.addColorStop(0, "rgba(255,255,255,0.2)");
      tileGradient.addColorStop(1, "rgba(255,255,255,0.075)");
    }
    ctx.fillStyle = tileGradient;
    ctx.beginPath();
    ctx.roundRect(tile.x, tile.y, tile.width, tile.height, 16);
    ctx.fill();
    ctx.strokeStyle = isActive ? "rgba(255,255,255,0.9)" : isComplement ? "rgba(250,204,21,0.62)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = isActive || isComplement ? 2 : 1;
    ctx.stroke();

    if (isCursor && !tile.cleared) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(tile.x - 5, tile.y - 5, tile.width + 10, tile.height + 10, 20);
      ctx.stroke();
    }

    if (isComplement) {
      ctx.strokeStyle = "rgba(250,204,21,0.34)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(tile.x - 4, tile.y - 4, tile.width + 8, tile.height + 8, 19);
      ctx.stroke();
    }

    const appleGradient = ctx.createRadialGradient(tileCenterX - 9, tileCenterY - 10, 5, tileCenterX, tileCenterY, 29);
    if (isActive) {
      appleGradient.addColorStop(0, "#fff7ed");
      appleGradient.addColorStop(0.42, "#fb923c");
      appleGradient.addColorStop(1, "#ea580c");
    } else {
      appleGradient.addColorStop(0, "#fecaca");
      appleGradient.addColorStop(0.48, "#fb7185");
      appleGradient.addColorStop(1, "#be123c");
    }
    ctx.fillStyle = appleGradient;
    ctx.beginPath();
    ctx.ellipse(tileCenterX - 8, tileCenterY + 2, 22, 24, -0.18, 0, Math.PI * 2);
    ctx.ellipse(tileCenterX + 8, tileCenterY + 2, 22, 24, 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(127,29,29,0.28)";
    ctx.beginPath();
    ctx.ellipse(tileCenterX, tileCenterY - 18, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(tileCenterX + 10, tileCenterY - 24);
    ctx.rotate(-0.42);
    ctx.fillStyle = isActive ? "#22c55e" : "#65a30d";
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#fffaf0";
    ctx.font = "900 27px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${tile.value}`, tileCenterX, tileCenterY + 12);
    const activeOrder = shownTiles.findIndex((item) => item.id === tile.id);
    if (activeOrder >= 0) {
      ctx.fillStyle = shownSum === 10 ? accent : shownSum > 10 ? danger : primary;
      ctx.beginPath();
      ctx.arc(tile.x + 16, tile.y + 16, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shownSum === 10 ? "#111827" : "#f8fafc";
      ctx.font = "900 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(`${activeOrder + 1}`, tile.x + 16, tile.y + 20);
    }
    if (tile.label !== `${tile.value}`) {
      ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = isActive ? "rgba(17,24,39,0.72)" : "rgba(248,250,252,0.72)";
      ctx.fillText(tile.label.slice(0, 5), tileCenterX, tile.y + tile.height - 7);
    }
    ctx.globalAlpha = 1;
  }

  if (dragging && state.sumDragMoved && state.sumDragCurrent) {
    const pillX = clamp(state.sumDragCurrent.x + 18, 36, canvasWidth - 96);
    const pillY = clamp(state.sumDragCurrent.y + 18, 94, canvasHeight - 84);
    ctx.fillStyle = shownSum === 10 ? "rgba(251,191,36,0.95)" : shownSum > 10 ? "rgba(251,113,133,0.94)" : "rgba(15,23,42,0.86)";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, 68, 28, 14);
    ctx.fill();
    ctx.fillStyle = shownSum === 10 ? "#111827" : "#f8fafc";
    ctx.font = "900 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${shownSum} / 10`, pillX + 34, pillY + 19);
  }

  const barWidth = clamp((shownSum / 10) * (canvasWidth - 68), 0, canvasWidth - 68);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(34, canvasHeight - 54, canvasWidth - 68, 14, 7);
  ctx.fill();
  ctx.fillStyle = shownSum > 10 ? danger : shownSum === 10 ? accent : primary;
  ctx.beginPath();
  ctx.roundRect(34, canvasHeight - 54, barWidth, 14, 7);
  ctx.fill();
  if (shownSum === 10) {
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(dragging ? "놓으면 사라집니다" : "Space 누르면 사라집니다", canvasWidth - 34, canvasHeight - 66);
  }
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스로 사과를 쓸어 합 10을 만들면 사라집니다. 방향키로 옮기고 Space로 골라도 됩니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("마우스로 사과를 쓸어 담습니다.", canvasWidth / 2, 202);
    ctx.fillText("합 10이면 사라집니다. 1분 안에 많이 비우면 됩니다.", canvasWidth / 2, 228);
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
  const timeLeft = Math.max(0, Math.ceil(arcadeTimeLimitSeconds(content) - view.elapsed));

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
      const wasStarted = state.started;
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
        if (action === "main") pressGemMain(content, state);
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
      if (content.arcade.variant === "memory") {
        if (!wasStarted) {
          setShareState("idle");
          syncView();
          return;
        }
        if (action === "left") moveMemoryCursor(state, -1);
        if (action === "right") moveMemoryCursor(state, 1);
        if (action === "up") moveMemoryCursor(state, -memoryColumns);
        if (action === "down") moveMemoryCursor(state, memoryColumns);
        if (action === "main") chooseMemoryCell(content, state);
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
      const passwordDigitKey = content.arcade.variant === "password" ? passwordDigitFromKeyboardCode(event.code) : null;
      const passwordUtilityKey = content.arcade.variant === "password" && event.code === "Backspace";
      const passwordSuggestionKey = content.arcade.variant === "password" && event.code === "KeyR";
      const memoryDigitKey = content.arcade.variant === "memory" ? memoryDigitFromKeyboardCode(event.code) : -1;
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Enter", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code) ||
        passwordDigitKey !== null ||
        passwordUtilityKey ||
        passwordSuggestionKey ||
        memoryDigitKey >= 0
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
          if (passwordSuggestionKey) {
            if (event.repeat) return;
            stateRef.current.started = true;
            stateRef.current.lastFrame = performance.now();
            applyPasswordSuggestion(stateRef.current);
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
        if (content.arcade.variant === "memory") {
          if (event.repeat) return;
          if (memoryDigitKey >= 0) {
            const state = stateRef.current;
            const wasStarted = state.started;
            state.started = true;
            state.lastFrame = performance.now();
            state.memoryCursor = memoryDigitKey;
            if (wasStarted) chooseMemoryCell(content, state, memoryDigitKey);
            setShareState("idle");
            syncView();
            return;
          }
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

      if (content.arcade.variant === "sum-box" || content.arcade.variant === "match-three") {
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
        } else if (pointInRect(point, passwordSuggestionRect)) {
          applyPasswordSuggestion(state);
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

      if (content.arcade.variant === "stacker") {
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
        return;
      }

      if (content.arcade.variant === "memory") {
        const cell = memoryCellAt(point.x, point.y);
        if (cell < 0) return;
        const wasStarted = state.started;
        state.started = true;
        state.lastFrame = performance.now();
        state.memoryCursor = cell;
        if (wasStarted) chooseMemoryCell(content, state, cell);
        setShareState("idle");
        syncView();
      }
    },
    [content, syncView],
  );

  const handleCanvasPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (content.arcade.variant !== "sum-box" && content.arcade.variant !== "match-three" && content.arcade.variant !== "stacker") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const point = canvasPointFromEvent(canvas, event);
      const state = stateRef.current;
      if (state.finished) return;
      if (content.arcade.variant === "stacker") {
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some synthetic browser environments do not expose pointer capture.
        }
        state.started = true;
        state.lastFrame = performance.now();
        centerStackerActiveAt(state, point.x);
        setShareState("idle");
        syncView();
        return;
      }
      const index = content.arcade.variant === "sum-box" ? sumTileIndexAt(state, point.x, point.y) : gemCellIndexAt(point.x, point.y);
      if (content.arcade.variant === "sum-box") {
        if (index < 0 && !pointInSumBoard(point)) return;
      } else if (index < 0) {
        return;
      }
      event.preventDefault();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Some synthetic browser environments do not expose pointer capture.
      }
      state.started = true;
      state.lastFrame = performance.now();
      if (content.arcade.variant === "sum-box") {
        if (index >= 0) state.sumCursor = index;
        state.sumDragStart = point;
        state.sumDragCurrent = point;
        state.sumDragMoved = false;
        state.sumDragTileIds = [];
        if (index >= 0) rememberSumDragTile(state, index);
      } else {
        state.gemCursor = index;
        state.gemSelected = null;
        state.gemDragStart = point;
        state.gemDragCurrent = point;
        state.gemDragStartIndex = index;
      }
      setShareState("idle");
      syncView();
    },
    [content.arcade.variant, syncView],
  );

  const handleCanvasPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (content.arcade.variant !== "sum-box" && content.arcade.variant !== "match-three" && content.arcade.variant !== "stacker") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const state = stateRef.current;
      if (state.finished) return;
      const point = canvasPointFromEvent(canvas, event);
      if (content.arcade.variant === "stacker") {
        if (event.buttons === 0) return;
        state.started = true;
        state.lastFrame = performance.now();
        centerStackerActiveAt(state, point.x);
        return;
      }
      if (content.arcade.variant === "sum-box") {
        if (!state.sumDragStart) return;
        const movedDistance = Math.hypot(point.x - state.sumDragStart.x, point.y - state.sumDragStart.y);
        const previousPoint = state.sumDragCurrent ?? state.sumDragStart;
        state.sumDragCurrent = point;
        if (movedDistance > 5) state.sumDragMoved = true;
        const index = sumTileIndexAt(state, point.x, point.y);
        rememberSumDragSegment(state, previousPoint, point);
        if (index >= 0) {
          state.sumCursor = index;
          rememberSumDragTile(state, index);
        }
        return;
      }
      if (state.gemDragStartIndex === null) return;
      state.gemDragCurrent = point;
      const target = gemTargetFromDrag(state, point);
      if (target >= 0 && state.gemTiles[target]) state.gemCursor = target;
    },
    [content.arcade.variant],
  );

  const handleCanvasPointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (content.arcade.variant !== "sum-box" && content.arcade.variant !== "match-three" && content.arcade.variant !== "stacker") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const state = stateRef.current;
      if (state.finished) return;
      event.preventDefault();
      const point = canvasPointFromEvent(canvas, event);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may be unavailable in tests.
      }
      if (content.arcade.variant === "stacker") {
        state.started = true;
        state.lastFrame = performance.now();
        centerStackerActiveAt(state, point.x);
        placeStackerBlock(content, state);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "sum-box") {
        if (!state.sumDragStart) return;
        const previousPoint = state.sumDragCurrent ?? state.sumDragStart;
        state.sumDragCurrent = point;
        rememberSumDragSegment(state, previousPoint, point);
        const movedDistance = Math.hypot(point.x - state.sumDragStart.x, point.y - state.sumDragStart.y);
        const dragged = state.sumDragMoved || movedDistance > 5;
        const draggedTiles = dragged ? sumDragTiles(state) : [];
        const fallbackPoint = state.sumDragStart;
        const clickedIndex = sumTileIndexAt(state, point.x, point.y);
        const fallbackIndex = clickedIndex >= 0 ? clickedIndex : sumTileIndexAt(state, fallbackPoint.x, fallbackPoint.y);
        clearSumDrag(state);
        if (dragged) {
          commitDraggedSumTiles(content, state, draggedTiles);
        } else if (fallbackIndex >= 0) {
          state.sumCursor = fallbackIndex;
          chooseSumTile(content, state);
        }
      } else {
        if (state.gemDragStartIndex === null || !state.gemDragStart) return;
        state.gemDragCurrent = point;
        const movedDistance = Math.hypot(point.x - state.gemDragStart.x, point.y - state.gemDragStart.y);
        const startIndex = state.gemDragStartIndex;
        const target = gemTargetFromDrag(state, point);
        const clickedIndex = gemCellIndexAt(point.x, point.y);
        clearGemDrag(state);
        if (movedDistance > 12 && target >= 0 && state.gemTiles[target]) {
          commitGemSwap(content, state, startIndex, target);
        } else if (clickedIndex >= 0) {
          chooseGemTile(content, state, clickedIndex);
        }
      }
      setShareState("idle");
      syncView();
    },
    [content, syncView],
  );

  const handleCanvasPointerCancel = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (content.arcade.variant !== "sum-box" && content.arcade.variant !== "match-three" && content.arcade.variant !== "stacker") return;
      const state = stateRef.current;
      clearSumDrag(state);
      clearGemDrag(state);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may be unavailable in tests.
      }
      syncView();
    },
    [content.arcade.variant, syncView],
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
          <div className="grid grid-cols-2 gap-2 text-right sm:grid-cols-4">
            <Metric label="점수" value={view.score} />
            <Metric label="집중" value={view.focus} />
            <Metric label="남은 시간" value={`${timeLeft}s`} />
            <Metric label="조작" value={`${Math.min(view.actions, content.arcade.rounds)} / ${content.arcade.rounds}`} />
          </div>
        </div>
      </div>

      {view.finished ? (
        <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_280px]" data-play-result>
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
        <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_280px]" data-play-turn={`arcade-${view.actions}`}>
          <div>
            <div className="overflow-hidden rounded-lg border bg-background">
              <canvas
                ref={canvasRef}
                tabIndex={0}
                onClick={handleCanvasClick}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onPointerCancel={handleCanvasPointerCancel}
                aria-label={`${content.title} canvas`}
                className={`block aspect-[18/13] w-full select-none outline-none ${
                  content.arcade.variant === "sum-box" ||
                  content.arcade.variant === "password" ||
                  content.arcade.variant === "minesweeper" ||
                  content.arcade.variant === "match-three" ||
                  content.arcade.variant === "stacker" ||
                  content.arcade.variant === "mole" ||
                  content.arcade.variant === "memory"
                    ? "cursor-pointer touch-none"
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
            content.arcade.variant === "sum-box" ||
            content.arcade.variant === "password" ||
            content.arcade.variant === "minesweeper" ||
            content.arcade.variant === "match-three" ||
            content.arcade.variant === "mole" ||
            content.arcade.variant === "memory" ? (
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
