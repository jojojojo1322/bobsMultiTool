"use client";

import * as React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArcadeGameContent } from "@/features/content/types";
import {
  crossingActionFromPoint,
  crossingDangerForY,
  crossingDangerLabel,
  crossingFinishY,
  crossingLanes,
  crossingNextY,
  crossingStartY,
  crossingStepX,
  crossingStepY,
  type CrossingAction,
} from "@/features/play/arcade-crossing";
import {
  clearLotteryDragTrail,
  drawLottery,
  lotteryCellIndexAt,
  lotteryColumns,
  lotteryPrizeLabel,
  lotteryRevealedCount,
  lotteryStageAt,
  lotteryStages,
  lotteryTicketComplete,
  makeLotteryCells,
  moveLotteryCursor,
  nextLotteryTicket,
  revealLotteryCell,
  scratchLotteryAt,
  type LotteryCell,
} from "@/features/play/arcade-lottery";
import {
  adjustPasswordDigit,
  applyPasswordCandidate,
  applyPasswordSuggestion,
  cyclePasswordSuggestion,
  formatPasswordOptionDigits,
  makePasswordSecret,
  movePasswordCursor,
  passwordCandidateOptionAt,
  passwordCandidateOptionRect,
  passwordCandidateOptions,
  passwordCandidateStats,
  passwordAttemptCandidateSummary,
  passwordDigitFrequency,
  passwordGuessPreview,
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
  passwordGuessOutcomeBuckets,
  passwordGuessIsPossible,
  passwordGuessSplitLabel,
  passwordGuessSplitRatio,
  passwordGuessText,
  passwordKeypadColumns,
  passwordKeypadDigitAt,
  passwordKeypadGap,
  passwordKeypadHeight,
  passwordKeypadWidth,
  passwordKeypadX,
  passwordKeypadY,
  passwordPositionOptions,
  passwordPositionDigitFrequency,
  passwordSubmitRect,
  passwordSuggestionRect,
  passwordTimeLimitSeconds,
  passwordSuggestion,
  setPasswordDigit,
  setPasswordDigitFromClick,
  setPasswordSuggestionCursor,
  submitPasswordGuess,
  updatePassword,
  formatTopPasswordDigits,
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
  findGemSwapHint,
  gemTargetFromDrag,
  makeGemTiles,
  moveGemCursor,
  pressGemMain,
  updateGemSwap,
  type GemTile,
} from "@/features/play/arcade-match-three";
import {
  activeMemoryFlashCell,
  chooseMemoryCell,
  makeMemorySequence,
  memoryBoardHeight,
  memoryBoardWidth,
  memoryBoardX,
  memoryBoardY,
  memoryCellAt,
  memoryCellCenter,
  memoryCellSize,
  memoryColumns,
  memoryDigitFromKeyboardCode,
  memoryGap,
  memoryRows,
  moveMemoryCursor,
  replayMemoryPreview,
  setMemoryCursor,
  updateMemory,
} from "@/features/play/arcade-memory";
import {
  flaggedMineCount,
  makeMineCells,
  mineBoardHeight,
  mineBoardWidth,
  mineBoardX,
  mineBoardY,
  mineCellIndexAt,
  mineCellSize,
  mineColumns,
  mineCount,
  mineGap,
  mineNeighborIds,
  mineNeighborSummary,
  moveMineCursor,
  revealMineCell,
  revealedMineSafeCount,
  toggleMineFlag,
  totalMineSafeCount,
  updateMinesweeper,
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
  moleTargetTiming,
  moleWhackOutcome,
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
  stackerPlacementPreview,
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
  snakeDirectionFromDrag,
  snakeDirectionFromAction,
  snakeDirectionFromPoint,
  snakeMoveInterval,
  pointInSnakeBoard,
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
  sumBoxClearScore,
  sumBoxCombinationHint,
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
  sumBoxStreakBonus,
  sumBoxTenCombinationCount,
  sumDragTiles,
  sumTileIndexAt,
  updateSumBox,
  type SumBoxFeedback,
  type SumTile,
} from "@/features/play/arcade-sum-box";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

const canvasWidth = 720;
const canvasHeight = 520;
const shooterPointerFireInterval = 0.26;

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
  playTick: number;
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
  sumDragBlockedTileId: number | null;
  sumStreak: number;
  sumBestStreak: number;
  sumFeedbacks: SumBoxFeedback[];
  sumNextFeedbackId: number;
  lotteryCells: LotteryCell[];
  lotteryCursor: number;
  lotteryStage: number;
  lotteryDraws: number;
  lotteryLastPrize: number;
  lotteryTotalPrize: number;
  lotteryDragTrail: CanvasPoint[];
  lotteryDragging: boolean;
  lotterySuppressClick: boolean;
  snake: SnakeCell[];
  snakeDirection: SnakeDirection;
  snakeNextDirection: SnakeDirection;
  snakeMoveTimer: number;
  snakeFood: SnakeFood;
  snakeDragStart: CanvasPoint | null;
  passwordGuess: number[];
  passwordSecret: number[];
  passwordCursor: number;
  passwordSuggestionCursor: number;
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
  shooterAimX: number;
  shooterAimY: number;
  shooterPointerActive: boolean;
  shooterFireCooldown: number;
  shooterSuppressClick: boolean;
  history: HistoryItem[];
  lastFrame: number | null;
};

type ViewState = Pick<
  GameState,
  | "started"
  | "finished"
  | "elapsed"
  | "score"
  | "focus"
  | "playTick"
  | "sumStreak"
  | "sumBestStreak"
  | "lotteryStage"
  | "lotteryDraws"
  | "lotteryLastPrize"
  | "lotteryTotalPrize"
  | "history"
> & {
  sumClearedCount: number;
  lotteryRevealedCount: number;
  lotteryTicketDone: boolean;
};

function makeInitialState(content: ArcadeGameContent): GameState {
  const snake = makeSnake();
  return {
    started: false,
    finished: false,
    elapsed: 0,
    score: 0,
    focus: 100,
    playTick: 0,
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
    sumDragBlockedTileId: null,
    sumStreak: 0,
    sumBestStreak: 0,
    sumFeedbacks: [],
    sumNextFeedbackId: 1,
    lotteryCells: makeLotteryCells(content),
    lotteryCursor: 0,
    lotteryStage: 0,
    lotteryDraws: 0,
    lotteryLastPrize: 0,
    lotteryTotalPrize: 0,
    lotteryDragTrail: [],
    lotteryDragging: false,
    lotterySuppressClick: false,
    snake,
    snakeDirection: "right",
    snakeNextDirection: "right",
    snakeMoveTimer: snakeMoveInterval,
    snakeFood: makeSnakeFood(content, 1, snake),
    snakeDragStart: null,
    passwordGuess: [1, 2, 3],
    passwordSecret: makePasswordSecret(content),
    passwordCursor: 0,
    passwordSuggestionCursor: 0,
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
    shooterAimX: canvasWidth / 2,
    shooterAimY: canvasHeight - 170,
    shooterPointerActive: false,
    shooterFireCooldown: 0,
    shooterSuppressClick: false,
    history: [],
    lastFrame: null,
  };
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
    playTick: state.playTick,
    sumStreak: state.sumStreak,
    sumBestStreak: state.sumBestStreak,
    sumClearedCount: state.sumTiles.filter((tile) => tile.cleared).length,
    lotteryStage: state.lotteryStage,
    lotteryDraws: state.lotteryDraws,
    lotteryLastPrize: state.lotteryLastPrize,
    lotteryTotalPrize: state.lotteryTotalPrize,
    lotteryRevealedCount: lotteryRevealedCount(state),
    lotteryTicketDone: lotteryTicketComplete(state),
    history: state.history,
  };
}

function addHistory(state: GameState, item: HistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function arcadeTimeLimitSeconds(content: ArcadeGameContent) {
  if (content.arcade.variant === "lottery") return 0;
  if (content.arcade.variant === "sum-box") return sumBoxTimeLimitSeconds;
  if (content.arcade.variant === "password") return passwordTimeLimitSeconds;
  return 60;
}

function finishStackerIfNeeded(content: ArcadeGameContent, state: GameState) {
  if (
    state.focus <= 0 ||
    state.elapsed >= arcadeTimeLimitSeconds(content) ||
    state.stackerActiveY <= stackerBoardY + 6
  ) {
    state.finished = true;
  }
}

function placeStackerBlock(content: ArcadeGameContent, state: GameState) {
  if (state.finished) return;
  const previous = topStackerBlock(state);
  if (!previous) return;
  const preview = stackerPlacementPreview(state);
  if (!preview) return;

  state.playTick += 1;

  if (preview.quality === "miss") {
    state.score = Math.max(0, state.score + preview.scoreDelta);
    state.focus = clamp(state.focus + preview.focusDelta, 0, 100);
    addHistory(state, {
      label: preview.status,
      detail: preview.detail,
      score: preview.scoreDelta,
    });
    state.stackerDirection *= -1;
    nudgeStacker(state, state.stackerDirection * 34);
    finishStackerIfNeeded(content, state);
    return;
  }

  const block: StackerBlock = {
    id: state.stackerBlocks.length,
    x: clamp(preview.placedX, stackerBoardX, stackerBoardX + stackerBoardWidth - preview.placedWidth),
    y: previous.y - stackerBlockHeight,
    width: preview.placedWidth,
    height: stackerBlockHeight,
    label: preview.nearPerfect ? "딱" : pickLabel(preview.quality === "thin" ? content.arcade.badLabels : content.arcade.goodLabels, state.playTick),
    quality: preview.quality,
  };
  state.stackerBlocks.push(block);
  state.stackerLayer += 1;
  state.score = Math.max(0, state.score + preview.scoreDelta);
  state.focus = clamp(state.focus + preview.focusDelta, 0, 100);
  addHistory(state, {
    label: block.label,
    detail: preview.detail,
    score: preview.scoreDelta,
  });

  resetStackerActiveFromTop(state);
  finishStackerIfNeeded(content, state);
}

function finishMoleIfNeeded(content: ArcadeGameContent, state: GameState) {
  if (state.focus <= 0 || state.elapsed >= arcadeTimeLimitSeconds(content)) {
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

  state.playTick += 1;
  if (!target) {
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 5, 0, 100);
    addHistory(state, { label: "빈칸", detail: "한 박자 빨랐음", score: -1 });
    finishMoleIfNeeded(content, state);
    return;
  }

  state.moleTargets = state.moleTargets.filter((item) => item.id !== target.id);
  const outcome = moleWhackOutcome(target);
  state.score = Math.max(0, state.score + outcome.score);
  state.focus = clamp(state.focus + outcome.focus, 0, 100);
  addHistory(state, {
    label: target.label,
    detail: outcome.detail,
    score: outcome.score,
  });
  finishMoleIfNeeded(content, state);
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
  if (content.arcade.variant === "flight") return "상승";
  if (shouldUseSideScroller(content)) return "점프";
  if (content.arcade.variant === "crossing") return "건너기";
  if (content.arcade.variant === "brick-breaker") return "치기";
  if (content.arcade.variant === "sum-box") return "고르기";
  if (content.arcade.variant === "lottery") return "긁기";
  if (content.arcade.variant === "snake") return "한 칸";
  if (content.arcade.variant === "password") return "확인";
  if (content.arcade.variant === "minesweeper") return "열기";
  if (content.arcade.variant === "match-three") return "고르기";
  if (content.arcade.variant === "stacker") return "쌓기";
  if (content.arcade.variant === "mole") return "잡기";
  if (content.arcade.variant === "memory") return "입력";
  return "발사";
}

function aimShooterAt(state: GameState, point: CanvasPoint) {
  state.playerX = clamp(point.x, 34, canvasWidth - 34);
  state.shooterAimX = state.playerX;
  state.shooterAimY = clamp(point.y, 72, state.playerY - 36);
}

function fireArcadeBullet(_content: ArcadeGameContent, state: GameState) {
  if (state.bullets.length >= 5) return;
  state.playTick += 1;
  state.bullets.push({ x: state.playerX, y: state.playerY - 30, vy: -430 });
}

function startFlightLift(_content: ArcadeGameContent, state: GameState) {
  state.started = true;
  state.lastFrame = performance.now();
  state.playTick += 1;
  state.playerVy = Math.min(state.playerVy - 180, -80);
}

function moveBrickPaddleTo(state: GameState, x: number) {
  state.playerX = clamp(x, 70, canvasWidth - 70);
  if (!state.brickLaunched) {
    state.brickBallX = state.playerX;
    state.brickBallY = state.playerY - 23;
  }
}

function launchOrNudgeBrickBall(state: GameState) {
  if (!state.brickLaunched) {
    state.brickLaunched = true;
    state.brickBallVx = state.playerX < canvasWidth / 2 ? 185 : -185;
    state.brickBallVy = -270;
  } else {
    state.brickBallVx = clamp(state.brickBallVx + (state.brickBallX >= state.playerX ? 22 : -22), -340, 340);
    state.brickBallVy = Math.min(state.brickBallVy, -230);
  }
  state.playTick += 1;
}

const brickPaddleWidth = 112;
const brickBallRadius = 8;
const brickWallPadding = 16;

function reflectedBrickX(rawX: number) {
  const min = brickWallPadding;
  const max = canvasWidth - brickWallPadding;
  const span = max - min;
  if (span <= 0) return clamp(rawX, min, max);
  const cycle = span * 2;
  const normalized = (((rawX - min) % cycle) + cycle) % cycle;
  return normalized <= span ? min + normalized : max - (normalized - span);
}

function brickLandingX(state: GameState) {
  if (!state.brickLaunched || state.brickBallVy <= 0) return null;
  const targetY = state.playerY - 20;
  const secondsToPaddle = (targetY - state.brickBallY) / state.brickBallVy;
  if (secondsToPaddle <= 0 || secondsToPaddle > 4) return null;
  return reflectedBrickX(state.brickBallX + state.brickBallVx * secondsToPaddle);
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

  if (content.arcade.variant === "lottery") {
    state.elapsed += dt;
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

  if (content.arcade.variant === "shooter") {
    state.shooterFireCooldown = Math.max(0, state.shooterFireCooldown - dt);
    state.shooterAimX = state.playerX;
    if (state.shooterPointerActive && state.shooterFireCooldown <= 0) {
      fireArcadeBullet(content, state);
      state.shooterFireCooldown = shooterPointerFireInterval;
    }
  }

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

  if (state.focus <= 0 || state.elapsed >= arcadeTimeLimitSeconds(content)) {
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

  if (state.playerY <= crossingFinishY) {
    state.score += 5;
    state.focus = clamp(state.focus + 5, 0, 100);
    state.playerY = crossingStartY;
    addHistory(state, {
      label: "건넘",
      detail: "빈틈을 잡음",
      score: 5,
    });
  }

  if (state.focus <= 0 || state.elapsed >= arcadeTimeLimitSeconds(content)) {
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

    const hitPaddle =
      state.brickBallVy > 0 &&
      state.brickBallY > state.playerY - 20 &&
      state.brickBallY < state.playerY + 10 &&
      Math.abs(state.brickBallX - state.playerX) < brickPaddleWidth / 2;
    if (hitPaddle) {
      const offset = (state.brickBallX - state.playerX) / (brickPaddleWidth / 2);
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
      state.playTick += 1;
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
  if (aliveCount === 0 || state.focus <= 0 || state.elapsed >= arcadeTimeLimitSeconds(content)) {
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

  if (content.arcade.variant === "lottery") {
    drawLottery(content, state, ctx);
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

  if (content.arcade.variant === "flight") {
    drawFlight(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "shooter") {
    drawShooter(content, state, ctx);
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

function drawFlight(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const liftActive = state.playerVy < -25;
  const horizon = canvasHeight - 74;
  const incomingSprite = state.sprites
    .filter((sprite) => sprite.x > state.playerX - 42)
    .sort((a, b) => a.x - b.x)[0] ?? null;
  const altitudeTop = 82;
  const altitudeBottom = horizon - 30;
  const altitudeRange = Math.max(altitudeBottom - altitudeTop, 1);
  const playerAltitudeRatio = clamp((state.playerY - altitudeTop) / altitudeRange, 0, 1);
  const projectedY = clamp(state.playerY + state.playerVy * 0.18, altitudeTop, altitudeBottom);
  const incomingLabel = incomingSprite
    ? incomingSprite.good
      ? "다음 빈틈"
      : "피할 벽"
    : "통로 대기";
  const backdrop = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  backdrop.addColorStop(0, background);
  backdrop.addColorStop(0.56, "rgba(30,41,59,0.95)");
  backdrop.addColorStop(1, "rgba(2,6,23,1)");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = (state.elapsed * 42) % 96; x < canvasWidth + 96; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, 54);
    ctx.lineTo(x - 80, horizon);
    ctx.stroke();
  }
  for (let y = 90; y < horizon; y += 62) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(canvasWidth - 30, y + Math.sin(state.elapsed + y) * 5);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(15,23,42,0.56)";
  ctx.beginPath();
  ctx.roundRect(26, 20, canvasWidth - 52, 44, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("누르면 상승, 떼면 하강", 44, 48);
  ctx.textAlign = "right";
  ctx.fillStyle = liftActive ? primary : "rgba(255,255,255,0.64)";
  ctx.font = "750 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`${incomingLabel} · ${liftActive ? "상승" : "하강"}`, canvasWidth - 44, 47);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(0, horizon, canvasWidth, canvasHeight - horizon, 0);
  ctx.fill();
  ctx.fillStyle = "rgba(250,204,21,0.14)";
  ctx.beginPath();
  ctx.roundRect(34, 80, 6, horizon - 110, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(canvasWidth - 40, 80, 6, horizon - 110, 3);
  ctx.fill();

  if (incomingSprite) {
    const guideColor = incomingSprite.good ? accent : danger;
    ctx.strokeStyle = guideColor;
    ctx.globalAlpha = incomingSprite.good ? 0.58 : 0.5;
    ctx.lineWidth = incomingSprite.good ? 3 : 2;
    ctx.setLineDash(incomingSprite.good ? [16, 12] : [8, 8]);
    ctx.beginPath();
    ctx.moveTo(state.playerX + 26, incomingSprite.y);
    ctx.lineTo(canvasWidth - 44, incomingSprite.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    ctx.fillStyle = incomingSprite.good ? "rgba(14,165,233,0.24)" : "rgba(251,113,133,0.22)";
    ctx.beginPath();
    ctx.roundRect(Math.min(canvasWidth - 176, Math.max(state.playerX + 42, incomingSprite.x - 74)), incomingSprite.y - 28, 142, 24, 12);
    ctx.fill();
    ctx.strokeStyle = incomingSprite.good ? "rgba(147,197,253,0.46)" : "rgba(251,113,133,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(incomingSprite.good ? "높이 맞추기" : "높이 피하기", Math.min(canvasWidth - 105, Math.max(state.playerX + 113, incomingSprite.x - 3)), incomingSprite.y - 12);
  }

  ctx.strokeStyle = liftActive ? "rgba(250,204,21,0.68)" : "rgba(147,197,253,0.5)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.moveTo(state.playerX - 34, state.playerY);
  ctx.quadraticCurveTo(state.playerX + 42, (state.playerY + projectedY) / 2, state.playerX + 114, projectedY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(15,23,42,0.5)";
  ctx.beginPath();
  ctx.roundRect(48, altitudeTop - 10, 18, altitudeRange + 20, 9);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "rgba(248,250,252,0.26)";
  ctx.beginPath();
  ctx.roundRect(56, altitudeTop, 2, altitudeRange, 1);
  ctx.fill();
  ctx.fillStyle = liftActive ? primary : accent;
  ctx.beginPath();
  ctx.arc(57, altitudeTop + altitudeRange * playerAltitudeRatio, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(248,250,252,0.72)";
  ctx.font = "700 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("고도", 42, altitudeBottom + 24);

  for (const sprite of state.sprites) {
    ctx.save();
    ctx.translate(sprite.x, sprite.y);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(0, sprite.radius + 9, sprite.radius * 0.86, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    if (sprite.good) {
      const gate = ctx.createLinearGradient(-sprite.radius, -sprite.radius, sprite.radius, sprite.radius);
      gate.addColorStop(0, "rgba(255,255,255,0.86)");
      gate.addColorStop(0.45, accent);
      gate.addColorStop(1, "rgba(59,130,246,0.74)");
      ctx.strokeStyle = gate;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, sprite.radius + 12, sprite.radius + 20, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(15,23,42,0.76)";
      ctx.beginPath();
      ctx.roundRect(-sprite.radius - 10, -10, sprite.radius * 2 + 20, 24, 12);
      ctx.fill();
    } else {
      const cloud = ctx.createRadialGradient(-sprite.radius * 0.2, -sprite.radius * 0.3, 4, 0, 0, sprite.radius * 1.5);
      cloud.addColorStop(0, "rgba(255,255,255,0.84)");
      cloud.addColorStop(0.42, danger);
      cloud.addColorStop(1, "rgba(127,29,29,0.95)");
      ctx.fillStyle = cloud;
      ctx.beginPath();
      ctx.arc(-sprite.radius * 0.42, 2, sprite.radius * 0.78, 0, Math.PI * 2);
      ctx.arc(sprite.radius * 0.16, -sprite.radius * 0.18, sprite.radius * 0.9, 0, Math.PI * 2);
      ctx.arc(sprite.radius * 0.58, 5, sprite.radius * 0.68, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = sprite.good ? "#f8fafc" : "#fff7ed";
    ctx.font = "850 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sprite.label.slice(0, 5), 0, sprite.good ? 5 : sprite.radius + 19);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(state.playerX, state.playerY);
  ctx.fillStyle = liftActive ? "rgba(250,204,21,0.28)" : "rgba(147,197,253,0.18)";
  ctx.beginPath();
  ctx.ellipse(-32, 10, 42, 14, -0.16, 0, Math.PI * 2);
  ctx.fill();
  const body = ctx.createLinearGradient(-28, -20, 28, 18);
  body.addColorStop(0, "#f8fafc");
  body.addColorStop(0.48, primary);
  body.addColorStop(1, "rgba(14,165,233,0.95)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(34, 0);
  ctx.lineTo(-24, -23);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-24, 23);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.58)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#0f172a";
  ctx.font = "900 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(content.arcade.playerLabel.slice(0, 5), -5, 4);
  ctx.restore();

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("높이선을 보고 누르거나 떼세요. Space/Enter도 됩니다.", 34, canvasHeight - 24);
  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("누르면 뜨고, 떼면 내려갑니다.", canvasWidth / 2, 204);
    ctx.fillText("다가오는 높이선을 보고 빈틈을 통과하세요.", canvasWidth / 2, 230);
  }
}

function drawShooter(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const mode = content.slug.includes("bubble")
    ? "bubble"
    : content.slug.includes("missile")
      ? "missile"
      : content.slug.includes("invaders")
        ? "invader"
        : "signal";
  const dangerLineY = canvasHeight - 96;

  const backdrop = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  backdrop.addColorStop(0, background);
  backdrop.addColorStop(0.62, "rgba(15,23,42,0.96)");
  backdrop.addColorStop(1, "rgba(2,6,23,1)");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 60; x < canvasWidth; x += 74) {
    ctx.beginPath();
    ctx.moveTo(x, 62);
    ctx.lineTo(x, dangerLineY + 18);
    ctx.stroke();
  }
  for (let y = 84; y < dangerLineY; y += 58) {
    ctx.beginPath();
    ctx.moveTo(34, y);
    ctx.lineTo(canvasWidth - 34, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(15,23,42,0.54)";
  ctx.beginPath();
  ctx.roundRect(28, 20, canvasWidth - 56, 42, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "800 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(mode === "missile" ? "낙하 지점 보기" : mode === "bubble" ? "필요한 버블만 터뜨리기" : "진짜 신호만 쏘기", 44, 47);
  ctx.textAlign = "right";
  ctx.fillStyle = state.focus <= 30 ? danger : "rgba(255,255,255,0.68)";
  ctx.font = "750 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`기록 ${state.score} · 집중 ${Math.round(state.focus)}`, canvasWidth - 44, 46);

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(state.playerX, 68);
  ctx.lineTo(state.playerX, state.playerY - 26);
  ctx.stroke();
  ctx.setLineDash([]);

  if (state.shooterPointerActive) {
    const readyRatio = 1 - clamp(state.shooterFireCooldown / shooterPointerFireInterval, 0, 1);
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(state.playerX, state.playerY - 28);
    ctx.lineTo(state.shooterAimX, state.shooterAimY);
    ctx.stroke();
    ctx.strokeStyle = "rgba(248,250,252,0.88)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.shooterAimX, state.shooterAimY, 18, 0, Math.PI * 2);
    ctx.moveTo(state.shooterAimX - 26, state.shooterAimY);
    ctx.lineTo(state.shooterAimX - 9, state.shooterAimY);
    ctx.moveTo(state.shooterAimX + 9, state.shooterAimY);
    ctx.lineTo(state.shooterAimX + 26, state.shooterAimY);
    ctx.moveTo(state.shooterAimX, state.shooterAimY - 26);
    ctx.lineTo(state.shooterAimX, state.shooterAimY - 9);
    ctx.moveTo(state.shooterAimX, state.shooterAimY + 9);
    ctx.lineTo(state.shooterAimX, state.shooterAimY + 26);
    ctx.stroke();
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.beginPath();
    ctx.roundRect(state.playerX - 38, state.playerY + 28, 76, 8, 4);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(state.playerX - 38, state.playerY + 28, 76 * readyRatio, 8, 4);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(0, dangerLineY, canvasWidth, 5, 2);
  ctx.fill();
  ctx.fillStyle = state.focus < 38 ? "rgba(251,113,133,0.42)" : "rgba(96,165,250,0.16)";
  ctx.beginPath();
  ctx.roundRect(32, dangerLineY + 16, canvasWidth - 64, 28, 14);
  ctx.fill();

  for (const sprite of state.sprites) {
    drawShooterSprite(ctx, sprite, mode, accent, danger);
  }

  for (const bullet of state.bullets) {
    const beam = ctx.createLinearGradient(bullet.x, bullet.y - 22, bullet.x, bullet.y + 18);
    beam.addColorStop(0, "rgba(248,250,252,0)");
    beam.addColorStop(0.45, "rgba(248,250,252,0.96)");
    beam.addColorStop(1, primary);
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.roundRect(bullet.x - 4, bullet.y - 24, 8, 34, 4);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y - 24, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawShooterPlayer(ctx, content, state, mode, primary, accent);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("마우스/터치로 누른 채 드래그하면 조준선이 따라가며 발사합니다. A/D와 Space도 됩니다.", 34, canvasHeight - 22);
  if (state.focus < 35) {
    ctx.fillStyle = danger;
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("눈에 띄는 걸 다 쏘면 먼저 지칩니다. 좋은 신호만 고르세요.", 34, canvasHeight - 48);
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("누른 채 조준선을 끌거나 A/D로 움직여 Space로 쏩니다.", canvasWidth / 2, 204);
    ctx.fillText("좋은 신호만 맞히면 오래 버팁니다.", canvasWidth / 2, 230);
  }
}

function drawShooterSprite(ctx: CanvasRenderingContext2D, sprite: Sprite, mode: string, accent: string, danger: string) {
  const fill = sprite.good ? accent : danger;
  ctx.save();
  ctx.translate(sprite.x, sprite.y);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, sprite.radius + 8, sprite.radius * 0.82, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyGradient = ctx.createRadialGradient(-sprite.radius * 0.35, -sprite.radius * 0.4, 4, 0, 0, sprite.radius * 1.35);
  bodyGradient.addColorStop(0, "rgba(255,255,255,0.92)");
  bodyGradient.addColorStop(0.35, fill);
  bodyGradient.addColorStop(1, sprite.good ? "rgba(20,83,45,0.96)" : "rgba(127,29,29,0.96)");
  ctx.fillStyle = bodyGradient;

  if (mode === "missile") {
    ctx.beginPath();
    ctx.moveTo(0, -sprite.radius - 10);
    ctx.lineTo(sprite.radius * 0.72, sprite.radius + 8);
    ctx.lineTo(-sprite.radius * 0.72, sprite.radius + 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = sprite.good ? "rgba(96,165,250,0.7)" : "rgba(251,191,36,0.8)";
    ctx.beginPath();
    ctx.ellipse(0, sprite.radius + 16, 7, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mode === "bubble") {
    ctx.beginPath();
    ctx.arc(0, 0, sprite.radius + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.64)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(-sprite.radius * 0.32, -sprite.radius * 0.38, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (mode === "invader") {
    ctx.beginPath();
    ctx.roundRect(-sprite.radius, -sprite.radius, sprite.radius * 2, sprite.radius * 1.8, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(-sprite.radius * 0.42, -sprite.radius * 0.25, 5, 5);
    ctx.fillRect(sprite.radius * 0.28, -sprite.radius * 0.25, 5, 5);
    ctx.strokeStyle = fill;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-sprite.radius * 0.82, sprite.radius * 0.98);
    ctx.lineTo(-sprite.radius * 1.12, sprite.radius * 1.28);
    ctx.moveTo(sprite.radius * 0.82, sprite.radius * 0.98);
    ctx.lineTo(sprite.radius * 1.12, sprite.radius * 1.28);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.roundRect(-sprite.radius - 6, -sprite.radius * 0.72, sprite.radius * 2 + 12, sprite.radius * 1.44, 12);
    ctx.fill();
  }

  ctx.strokeStyle = sprite.good ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.34)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = sprite.good ? "#0f172a" : "#f8fafc";
  ctx.font = "900 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(sprite.label.slice(0, 5), 0, mode === "missile" ? 9 : sprite.radius + 19);
  ctx.restore();
}

function drawShooterPlayer(
  ctx: CanvasRenderingContext2D,
  content: ArcadeGameContent,
  state: GameState,
  mode: string,
  primary: string,
  accent: string,
) {
  ctx.save();
  ctx.translate(state.playerX, state.playerY);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(0, 23, 42, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = primary;
  if (mode === "missile") {
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI, Math.PI * 2);
    ctx.lineTo(30, 6);
    ctx.lineTo(-30, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.58)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillRect(-3, 6, 6, 24);
  } else {
    ctx.beginPath();
    ctx.roundRect(-34, -18, 68, 36, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(12, -16);
    ctx.lineTo(-12, -16);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#0f172a";
  ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(content.arcade.playerLabel.slice(0, 5), 0, 5);
  ctx.restore();
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
  const preview = stackerPlacementPreview(state);
  const activeCenter = state.stackerActiveX + state.stackerActiveWidth / 2;
  const topCenter = top ? top.x + top.width / 2 : canvasWidth / 2;
  const centerGap = preview?.centerGap ?? Math.abs(activeCenter - topCenter);
  const overlap = preview?.overlap ?? 0;
  const cutTotal = preview ? preview.cutLeft + preview.cutRight : 0;
  const statusFill = preview?.quality === "miss" ? danger : preview?.quality === "perfect" ? accent : preview?.quality === "solid" ? primary : "rgba(251,113,133,0.86)";

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
    if (preview && preview.overlap > 0) {
      ctx.fillStyle =
        preview.quality === "miss"
          ? "rgba(248,113,113,0.2)"
          : preview.quality === "perfect"
            ? "rgba(167,243,208,0.32)"
            : preview.quality === "solid"
              ? "rgba(251,191,36,0.25)"
              : "rgba(248,113,113,0.22)";
      ctx.beginPath();
      ctx.roundRect(preview.overlapLeft, state.stackerActiveY + 3, preview.overlap, stackerBlockHeight - 6, 7);
      ctx.fill();
    }
  }

  const activeBlock: StackerBlock = {
    id: -1,
    x: state.stackerActiveX,
    y: state.stackerActiveY,
    width: state.stackerActiveWidth,
    height: stackerBlockHeight,
    label: "쌓기",
    quality: preview?.quality === "miss" ? "thin" : (preview?.quality ?? (centerGap <= 7 ? "perfect" : overlap >= state.stackerActiveWidth * 0.72 ? "solid" : "thin")),
  };
  drawStackerBlock(ctx, activeBlock, preview?.quality === "miss" ? "rgba(248,113,113,0.9)" : statusFill, "#111827");

  if (top && preview && cutTotal > 0) {
    ctx.fillStyle = "rgba(251,113,133,0.42)";
    if (preview.cutLeft > 0) {
      ctx.fillRect(preview.activeLeft, state.stackerActiveY, preview.cutLeft, stackerBlockHeight);
    }
    if (preview.cutRight > 0) {
      ctx.fillRect(preview.activeRight - preview.cutRight, state.stackerActiveY, preview.cutRight, stackerBlockHeight);
    }
    ctx.strokeStyle = "rgba(251,113,133,0.62)";
    ctx.beginPath();
    ctx.moveTo(preview.activeLeft, state.stackerActiveY - 8);
    ctx.lineTo(preview.activeRight, state.stackerActiveY - 8);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.font = "800 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`층 ${state.stackerLayer}`, 34, 36);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    `폭 ${Math.round(state.stackerActiveWidth)} · 놓으면 ${Math.round(preview?.placedWidth ?? 0)} · 잘림 ${Math.round(cutTotal)}`,
    94,
    36,
  );
  ctx.fillStyle = preview?.quality === "miss" ? "rgba(248,113,113,0.9)" : preview?.quality === "perfect" ? "rgba(167,243,208,0.9)" : "rgba(255,255,255,0.68)";
  ctx.fillText(preview ? `${preview.status} · 차이 ${Math.round(centerGap)}` : `차이 ${Math.round(centerGap)}`, 94, 56);

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
  ctx.fillText(preview?.quality === "miss" ? "거의 안 겹침" : centerGap <= 7 ? "지금 좋아요" : centerGap <= 26 ? "조금 더" : "아직 멀어요", meterX, meterY + 30);

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
      const timing = moleTargetTiming(target);
      const outcome = moleWhackOutcome(target);
      const urgencyAlpha = (0.36 + timing.urgency * 0.44).toFixed(2);
      ctx.strokeStyle = target.good ? `rgba(134,239,172,${urgencyAlpha})` : `rgba(251,113,133,${urgencyAlpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(center.x, center.y + 10, moleHoleSize / 2 + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timing.remaining);
      ctx.stroke();
      ctx.lineWidth = 1;

      const moleHeight = 42 * timing.pop;
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
      ctx.fillStyle = target.good ? "rgba(220,252,231,0.92)" : "rgba(255,228,230,0.92)";
      ctx.font = "800 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(`${outcome.score > 0 ? "+" : ""}${outcome.score}`, center.x, center.y - 38);
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
  const goodMoles = state.moleTargets.filter((target) => target.good).length;
  const noiseMoles = state.moleTargets.filter((target) => !target.good).length;
  const urgentGoodMoles = state.moleTargets.filter((target) => target.good && moleTargetTiming(target).remaining <= 0.32).length;
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
  ctx.fillText(`${goodMoles}`, panelX + 18, 152);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`소음 ${noiseMoles}`, panelX + 66, 149);
  ctx.fillText(`곧 사라질 핵심 ${urgentGoodMoles}`, panelX + 18, 174);
  ctx.fillText(`기록 ${state.score} · 집중 ${Math.round(state.focus)}`, panelX + 18, 188);
  ctx.fillText("링이 줄수록 시간이 없습니다.", panelX + 18, 222);
  ctx.fillText("빨강은 지나가게 두는 편이 낫습니다.", panelX + 18, 246);

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

  if (!state.memoryShowing && state.memoryInput.length) {
    const enteredCenters = state.memoryInput.map((cell) => memoryCellCenter(cell));
    if (enteredCenters.length > 1) {
      ctx.strokeStyle = "rgba(190,242,100,0.62)";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      enteredCenters.forEach((center, index) => {
        if (index === 0) ctx.moveTo(center.x, center.y);
        else ctx.lineTo(center.x, center.y);
      });
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    for (const center of enteredCenters) {
      ctx.fillStyle = "rgba(190,242,100,0.22)";
      ctx.beginPath();
      ctx.arc(center.x, center.y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

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

    if (!state.memoryShowing && isEntered) {
      const inputOrder = state.memoryInput.lastIndexOf(cell) + 1;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x + memoryCellSize - 15, y + 15, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.font = "900 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(`${inputOrder}`, x + memoryCellSize - 15, y + 19);
    }
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
  ctx.fillText(`순서 ${state.memoryInput.length}/${state.memorySequence.length}`, panelX + 18, 224);
  ctx.fillText("맞게 누른 순서는 보드에 선으로 남습니다.", panelX + 18, 252);
  ctx.fillText("헷갈리면 R로 다시 봅니다.", panelX + 18, 276);

  if (!state.memoryShowing && state.memoryInput.length) {
    const last = state.memoryInput[state.memoryInput.length - 1];
    ctx.fillStyle = "rgba(190,242,100,0.9)";
    ctx.font = "850 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`방금 ${typeof last === "number" ? last + 1 : ""}번`, panelX + 18, 304);
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스/방향키/숫자 1~9로 입력합니다. 맞게 누른 순서는 선으로 남고, 헷갈리면 R로 다시 봅니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("빛난 칸 순서를 기억해서 같은 순서로 누릅니다.", canvasWidth / 2, 202);
    ctx.fillText("헷갈리면 R로 다시 보고, 숫자 1~9로 바로 누를 수 있습니다.", canvasWidth / 2, 228);
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
  ctx.fillText("방향키/WASD 또는 캔버스 드래그로 방향을 틉니다. 탭하면 머리 기준으로 가까운 방향을 잡습니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("방향키/WASD나 캔버스 드래그로 방향을 틀고 사과를 먹습니다.", canvasWidth / 2, 204);
    ctx.fillText("손가락으로 쓸어도 됩니다. 욕심내서 꺾으면 바로 꼬입니다.", canvasWidth / 2, 230);
  }
}

function drawMinesweeper(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const openedSafe = revealedMineSafeCount(state);
  const totalSafe = totalMineSafeCount(state);
  const flaggedCount = flaggedMineCount(state);
  const cursor = state.mineCells[state.mineCursor];
  const cursorSummary = mineNeighborSummary(state, state.mineCursor);
  const cursorNeighborIds = new Set(cursor?.revealed && !cursor.mine && cursor.adjacent > 0 ? mineNeighborIds(state, state.mineCursor) : []);

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
    const isCursorNeighbor = cursorNeighborIds.has(cell.id) && !cell.revealed && !cell.flagged;
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.roundRect(x + 3, y + 4, mineCellSize, mineCellSize, 9);
    ctx.fill();

    if (isCursorNeighbor) {
      ctx.fillStyle = "rgba(147,197,253,0.15)";
      ctx.beginPath();
      ctx.roundRect(x - 3, y - 3, mineCellSize + 6, mineCellSize + 6, 12);
      ctx.fill();
    }

    if (cell.revealed && cell.mine) {
      ctx.fillStyle = danger;
    } else if (cell.revealed) {
      ctx.fillStyle = cell.adjacent === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.16)";
    } else if (cell.flagged) {
      const gradient = ctx.createLinearGradient(x, y, x, y + mineCellSize);
      gradient.addColorStop(0, "rgba(248,113,113,0.42)");
      gradient.addColorStop(1, "rgba(248,113,113,0.18)");
      ctx.fillStyle = gradient;
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
    } else if (cell.flagged) {
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 15, y + 11);
      ctx.lineTo(x + 15, y + 29);
      ctx.stroke();
      ctx.fillStyle = danger;
      ctx.beginPath();
      ctx.moveTo(x + 16, y + 12);
      ctx.lineTo(x + 29, y + 17);
      ctx.lineTo(x + 16, y + 22);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 1;
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
  ctx.fillText(`표시 ${flaggedCount} / ${mineCount}`, panelX + 18, mineBoardY + 82);

  ctx.fillStyle = "rgba(255,255,255,0.13)";
  ctx.beginPath();
  ctx.roundRect(panelX + 18, mineBoardY + 102, 160, 58, 12);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(cursor?.revealed ? (cursor.mine ? "터진 칸입니다" : `숫자 ${cursor.adjacent}`) : cursor?.flagged ? "표시한 칸입니다" : "여기를 열어볼까요", panelX + 32, mineBoardY + 124);
  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`주변 닫힘 ${cursorSummary.closed} · 표시 ${cursorSummary.flagged}`, panelX + 32, mineBoardY + 144);

  ctx.fillStyle = "rgba(255,255,255,0.64)";
  ctx.font = "650 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("F 또는 Shift+클릭으로 표시합니다.", panelX + 18, mineBoardY + 182);
  ctx.fillText("숫자 칸을 다시 누르면 주변을 엽니다.", panelX + 18, mineBoardY + 206);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("클릭/Space로 열고, 숫자 칸은 표시 수가 맞을 때 주변 닫힌 칸을 같이 엽니다.", 34, canvasHeight - 20);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("칸을 열고 숫자를 봅니다. 숫자는 가까운 위험 칸 수입니다.", canvasWidth / 2, 202);
    ctx.fillText("표시 수가 맞는 숫자 칸은 한 번 더 눌러 주변을 엽니다.", canvasWidth / 2, 228);
  }
}

function gemColor(content: ArcadeGameContent, tile: GemTile) {
  const colors = [content.arcade.palette.primary, content.arcade.palette.accent, "#86efac", "#fde68a", content.arcade.palette.danger, "#cbd5e1"];
  return colors[tile.kind % colors.length] ?? content.arcade.palette.primary;
}

function drawGemSwap(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const dragTarget = state.gemDragStartIndex !== null ? gemTargetFromDrag(state) : -1;
  const hint = state.gemSelected === null && state.gemDragStartIndex === null && !state.finished ? findGemSwapHint(state) : null;
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
  ctx.fillText(hint ? "보이는 한 수 있음" : "콤보 만들기", 36, 88);
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
  } else if (hint) {
    const fromTile = state.gemTiles[hint.from];
    const toTile = state.gemTiles[hint.to];
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(34, 132, 122, 70, 14);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("보이는 한 수", 48, 156);
    ctx.fillStyle = accent;
    ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${fromTile.label.slice(0, 3)} ↔ ${toTile.label.slice(0, 3)}`, 48, 184);
  }

  if (hint) {
    const start = gemCellCenter(hint.from);
    const end = gemCellCenter(hint.to);
    ctx.strokeStyle = "rgba(248,250,252,0.46)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineCap = "butt";
  }

  for (const tile of state.gemTiles) {
    const index = gemIndex(tile.column, tile.row);
    const x = gemBoardX + tile.column * (gemCellSize + gemGap);
    const y = gemBoardY + tile.row * (gemCellSize + gemGap);
    const selected = state.gemSelected === index || state.gemDragStartIndex === index;
    const cursor = state.gemCursor === index || dragTarget === index;
    const hinted = hint !== null && (hint.from === index || hint.to === index);
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
    } else if (hinted) {
      ctx.strokeStyle = "rgba(248,250,252,0.52)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, gemCellSize + 8, gemCellSize + 8, 16);
      ctx.stroke();
      ctx.setLineDash([]);
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
  ctx.fillText("마우스로 옆 칸에 끌어 놓습니다. 점선은 한 번 가능한 교환입니다.", 34, canvasHeight - 20);
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
  const positionFrequency = passwordPositionDigitFrequency(candidates);
  const digitFrequency = passwordDigitFrequency(candidates);
  const suggestion = passwordSuggestion(state.passwordAttempts);
  const candidateOptions = passwordCandidateOptions(state.passwordAttempts);
  const suggestionIndex = candidateOptions.length ? state.passwordSuggestionCursor % candidateOptions.length : -1;
  const digitMarks = passwordDigitMarks(state.passwordAttempts);
  const currentGuess = passwordGuessText(state.passwordGuess);
  const duplicateCurrent = passwordGuessHasDuplicateDigits(state.passwordGuess);
  const repeatedCurrent = state.passwordAttempts.some((attempt, index) => attempt.guess === currentGuess && (index > 0 || attempt.repeated));
  const impossibleCurrent =
    !duplicateCurrent && state.passwordAttempts.length > 0 && !state.passwordAttempts.some((attempt) => attempt.guess === currentGuess) && !passwordGuessIsPossible(state.passwordAttempts, currentGuess);
  const guessPreview = passwordGuessPreview(state.passwordAttempts, state.passwordGuess);
  const outcomeBuckets = passwordGuessOutcomeBuckets(state.passwordAttempts, state.passwordGuess);
  const splitRatio = passwordGuessSplitRatio(guessPreview);
  const splitLabel = passwordGuessSplitLabel(guessPreview);
  const splitOutcomeText = guessPreview.issue
    ? "확인 전 수정"
    : guessPreview.candidatesBefore
      ? `결과 ${guessPreview.outcomeCount}갈래`
      : "후보 없음";
  const guessPreviewText = duplicateCurrent
    ? "중복은 무효"
    : repeatedCurrent
      ? "이미 본 번호"
      : impossibleCurrent || guessPreview.issue === "contradiction"
        ? "기록과 충돌"
        : state.passwordAttempts.length
          ? `평균 ${Math.ceil(guessPreview.expectedRemaining)} · 최악 ${guessPreview.worstRemaining}`
          : `후보 ${guessPreview.candidatesBefore}개 시작`;
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
  ctx.fillText(state.passwordAttempts.length ? `이번 힌트로 ${candidateStats.narrowedBy}개 줄임` : "첫 시도는 빠르게", 48, 146);
  ctx.fillStyle = duplicateCurrent || repeatedCurrent || impossibleCurrent ? danger : "rgba(255,255,255,0.62)";
  ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(guessPreviewText, 48, 166);
  ctx.fillStyle = "rgba(251,191,36,0.18)";
  ctx.beginPath();
  ctx.roundRect(passwordSuggestionRect.x, passwordSuggestionRect.y, passwordSuggestionRect.width, passwordSuggestionRect.height, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(251,191,36,0.46)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "750 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("R 추천 순환", passwordSuggestionRect.x + 12, passwordSuggestionRect.y + 13);
  candidateOptions.forEach((candidate, index) => {
    const rect = passwordCandidateOptionRect(index);
    const selected = candidate === currentGuess;
    const keyboardTarget = index === suggestionIndex;
    ctx.fillStyle = selected ? primary : keyboardTarget ? "rgba(96,165,250,0.84)" : index === 0 ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 7);
    ctx.fill();
    ctx.strokeStyle = selected
      ? "rgba(147,197,253,0.82)"
      : keyboardTarget
        ? "rgba(191,219,254,0.82)"
        : index === 0
          ? "rgba(251,191,36,0.6)"
          : "rgba(255,255,255,0.18)";
    ctx.stroke();
    ctx.fillStyle = selected || keyboardTarget || index === 0 ? "#111827" : "#f8fafc";
    ctx.font = "900 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(candidate, rect.x + rect.width / 2, rect.y + 15);
    ctx.textAlign = "left";
  });
  if (!candidateOptions.length) {
    ctx.fillStyle = accent;
    ctx.font = "900 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(suggestion, passwordSuggestionRect.x + 14, passwordSuggestionRect.y + 32);
  }
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
    const topDigits = formatTopPasswordDigits(positionFrequency[index] ?? []);
    ctx.fillText(`${topDigits} / ${formatPasswordOptionDigits(digits)}`, 86, y);
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
    const positionDigit = positionFrequency[index]?.[digit];
    const heatWidth = passwordDigitWidth - 34;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(x + 17, passwordDigitY + 87, heatWidth, 5, 3);
    ctx.fill();
    ctx.fillStyle = positionConflict ? danger : positionDigit && positionDigit.count > 0 ? accent : "rgba(148,163,184,0.35)";
    ctx.beginPath();
    ctx.roundRect(x + 17, passwordDigitY + 87, Math.max(4, heatWidth * (positionDigit?.ratio ?? 0)), 5, 3);
    ctx.fill();
    ctx.fillStyle = positionConflict ? danger : "rgba(255,255,255,0.54)";
    ctx.font = "750 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(positionDigit && positionDigit.count > 0 ? `후보 ${positionDigit.count}` : "후보 없음", x + passwordDigitWidth / 2, passwordDigitY + 113);
    ctx.fillStyle = selected ? accent : "rgba(255,255,255,0.5)";
    ctx.font = "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("↑↓", x + passwordDigitWidth / 2, passwordDigitY + 130);
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

  const splitX = centerX - 140;
  const splitY = passwordSubmitRect.y + passwordSubmitRect.height + 5;
  const splitWidth = 280;
  ctx.textAlign = "left";
  ctx.fillStyle = duplicateCurrent || repeatedCurrent || impossibleCurrent ? danger : "rgba(255,255,255,0.72)";
  ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`가르는 힘 ${splitLabel} · ${splitOutcomeText}`, splitX, splitY - 4);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(splitX, splitY + 4, splitWidth, 8, 4);
  ctx.fill();
  ctx.fillStyle = duplicateCurrent || repeatedCurrent || impossibleCurrent ? danger : splitRatio >= 0.5 ? primary : accent;
  ctx.beginPath();
  ctx.roundRect(splitX, splitY + 4, Math.max(6, splitWidth * splitRatio), 8, 4);
  ctx.fill();
  ctx.textAlign = "center";

  ctx.textAlign = "center";
  for (let digit = 0; digit <= 9; digit += 1) {
    const column = digit % passwordKeypadColumns;
    const row = Math.floor(digit / passwordKeypadColumns);
    const x = passwordKeypadX + column * (passwordKeypadWidth + passwordKeypadGap);
    const y = passwordKeypadY + row * (passwordKeypadHeight + passwordKeypadGap);
    const mark = digitMarks[digit];
    const frequency = digitFrequency[digit] ?? { count: 0, ratio: 0 };
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
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(x + 10, y + passwordKeypadHeight - 9, passwordKeypadWidth - 20, 4, 2);
    ctx.fill();
    ctx.fillStyle = mark === "absent" ? "rgba(148,163,184,0.38)" : frequency.count > 0 ? accent : "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.roundRect(x + 10, y + passwordKeypadHeight - 9, Math.max(3, (passwordKeypadWidth - 20) * frequency.ratio), 4, 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = "750 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(`${frequency.count}`, x + passwordKeypadWidth / 2, y + 33);
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
  ctx.fillText("자리 / 숫자 / 후보", historyX + 58, historyY - 18);

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
    const candidateSummary = passwordAttemptCandidateSummary(state.passwordAttempts, index);
    const candidateLine = issueLabel
      ? attempt.hint
      : candidateSummary.reduced
        ? `후보 ${candidateSummary.before}→${candidateSummary.after}`
        : `후보 ${candidateSummary.after} 유지`;
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
    ctx.textAlign = "right";
    ctx.fillStyle = candidateSummary.after <= 12 && !issueLabel ? accent : "rgba(255,255,255,0.62)";
    ctx.font = "850 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(issueLabel ? "무효" : `${candidateSummary.after}`, historyX + historyWidth - 10, y + 20);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.56)";
    ctx.font = "700 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(candidateLine.slice(0, 20), historyX + 12, y + 30);
  });

  const outcomeY = 284;
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "800 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("예상 힌트", historyX, outcomeY - 10);
  if (!outcomeBuckets.length) {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(historyX, outcomeY, historyWidth, 32, 10);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("번호를 고르면 분포가 나옵니다", historyX + 12, outcomeY + 20);
  } else {
    outcomeBuckets.forEach((bucket, index) => {
      const y = outcomeY + index * 24;
      const barWidth = Math.max(8, (historyWidth - 18) * bucket.ratio);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.roundRect(historyX, y, historyWidth, 19, 9);
      ctx.fill();
      ctx.fillStyle = index === 0 ? "rgba(251,191,36,0.34)" : "rgba(96,165,250,0.22)";
      ctx.beginPath();
      ctx.roundRect(historyX, y, barWidth, 19, 9);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(bucket.label, historyX + 10, y + 13);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.76)";
      ctx.font = "850 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillText(`${bucket.count}개`, historyX + historyWidth - 10, y + 13);
      ctx.textAlign = "left";
    });
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("숫자키·후보칩·R 추천 순환·Enter / 막대=후보 빈도", 34, passwordKeypadY - 4);

  if (state.focus < 35) {
    ctx.fillStyle = danger;
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("조급해졌습니다. 기록을 보고 하나씩 줄이세요.", 34, passwordKeypadY - 48);
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, centerX, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("세 자리 숫자를 맞춥니다. 힌트 기록으로 남은 후보를 줄입니다.", centerX, 204);
    ctx.fillText("현재 번호가 후보를 얼마나 잘 가르는지도 보고 눌러봅니다.", centerX, 230);
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
  const blockedTile = dragging && state.sumDragBlockedTileId !== null ? state.sumTiles[state.sumDragBlockedTileId] : undefined;
  const blockedSum = blockedTile ? shownSum + blockedTile.value : shownSum;
  const complementTileIds = selectionSummary.complementTileIds;
  const comboHint = sumBoxCombinationHint(state);
  const tenCombinationCount = sumBoxTenCombinationCount(state);
  const tenCombinationLabel = tenCombinationCount >= 99 ? "99+" : `${tenCombinationCount}`;
  const hintTiles = !dragging && !shownTiles.length ? comboHint : [];
  const hintTileIds = new Set(hintTiles.map((tile) => tile.id));
  const nextStreak = shownSum === 10 ? state.sumStreak + 1 : state.sumStreak;
  const clearStreakBonus = shownSum === 10 ? sumBoxStreakBonus(nextStreak) : 0;
  const clearScore = shownSum === 10 ? sumBoxClearScore(shownTiles) + clearStreakBonus : 0;
  const clearScoreLabel = clearStreakBonus > 0 ? `+${clearScore}점(연속 +${clearStreakBonus})` : `+${clearScore}점`;
  const dragPrimaryLabel = blockedTile ? `${blockedSum} 넘침` : shownSum === 10 ? "합 10" : shownSum > 0 ? `합 ${shownSum}` : "쓸기 시작";
  const dragSecondaryLabel = blockedTile
    ? "마지막 사과 빼기"
    : shownSum === 10
      ? `놓으면 +${clearScore}`
      : shownSum > 0
        ? `${selectionSummary.neededValue} 더 필요`
        : "사과 위로 지나가기";
  const releaseLabel = blockedTile
    ? `${blockedSum} · 넘침`
    : shownSum === 10
      ? dragging
        ? `놓으면 ${clearScoreLabel}`
        : `Space ${clearScoreLabel}`
      : shownSum > 0
        ? selectionSummary.status
        : "합 10 만들기";
  const comboHintLabel = comboHint.length
    ? comboHint
        .map((tile) => tile.value)
        .slice(0, 5)
        .join(" + ") + (comboHint.length > 5 ? " + ..." : "")
    : "없음";
  const cleared = state.sumTiles.filter((tile) => tile.cleared).length;
  const timeLimit = arcadeTimeLimitSeconds(content);
  const timeLeft = Math.max(0, Math.ceil(timeLimit - state.elapsed));
  const timeRatio = clamp(timeLeft / timeLimit, 0, 1);
  const timerX = canvasWidth - 56;
  const timerY = 42;
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

  if (state.started && timeLeft <= 10 && timeLeft > 0) {
    const pulse = 0.34 + Math.sin(state.elapsed * 8) * 0.14;
    ctx.strokeStyle = `rgba(251,113,133,${pulse.toFixed(3)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(sumBoxStartX - 18, sumBoxStartY - 18, sumBoxBoardWidth + 36, sumBoxBoardHeight + 36, 26);
    ctx.stroke();
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
  ctx.fillText(`비운 ${cleared}/${state.sumTiles.length} · 연속 ${state.sumStreak}`, 190, 48);
  ctx.fillStyle = comboHint.length ? "rgba(255,255,255,0.66)" : "rgba(251,113,133,0.88)";
  ctx.fillText(`남은 10 ${tenCombinationLabel}개 · 힌트 ${comboHintLabel}`, 330, 48);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(timerX, timerY, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = timeLeft <= 10 ? danger : accent;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(timerX, timerY, 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timeRatio);
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${timeLeft}`, timerX, timerY + 4);
  ctx.textAlign = "left";
  ctx.fillText(
    blockedTile
      ? `${shownTiles.map((tile) => tile.value).join(" + ") || "0"} + ${blockedTile.value} = ${blockedSum} · 넘침`
      : shownTiles.length
        ? `${shownTiles.map((tile) => tile.value).join(" + ")} · ${selectionSummary.status}${shownSum === 10 ? ` · ${clearScoreLabel}` : ""}`
        : hintTiles.length
          ? `노란 힌트 사과를 그대로 쓸면 10 · 최고 연속 ${state.sumBestStreak}`
          : `마우스로 쓸어 담기 · 최고 연속 ${state.sumBestStreak}`,
    42,
    68,
  );

  if (hintTiles.length > 1) {
    ctx.strokeStyle = "rgba(250,204,21,0.42)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    hintTiles.forEach((tile, index) => {
      const x = tile.x + tile.width / 2;
      const y = tile.y + tile.height / 2;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

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

  if (dragging && state.sumDragCurrent && dragTiles.length) {
    const lastTile = dragTiles[dragTiles.length - 1];
    if (lastTile) {
      const startX = lastTile.x + lastTile.width / 2;
      const startY = lastTile.y + lastTile.height / 2;
      ctx.strokeStyle = blockedTile ? "rgba(251,113,133,0.72)" : shownSum === 10 ? "rgba(251,191,36,0.72)" : "rgba(255,255,255,0.28)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.setLineDash([8, 9]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(state.sumDragCurrent.x, state.sumDragCurrent.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  for (const tile of state.sumTiles) {
    const isCursor = tile.id === state.sumCursor;
    const isActive = dragging ? dragTileIds.has(tile.id) : tile.selected;
    const isComplement = complementTileIds.has(tile.id);
    const isBlocked = blockedTile?.id === tile.id;
    const isHint = hintTileIds.has(tile.id);
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
    } else if (isHint) {
      tileGradient.addColorStop(0, "rgba(254,249,195,0.7)");
      tileGradient.addColorStop(1, "rgba(250,204,21,0.18)");
    } else {
      tileGradient.addColorStop(0, "rgba(255,255,255,0.2)");
      tileGradient.addColorStop(1, "rgba(255,255,255,0.075)");
    }
    ctx.fillStyle = tileGradient;
    ctx.beginPath();
    ctx.roundRect(tile.x, tile.y, tile.width, tile.height, 16);
    ctx.fill();
    ctx.strokeStyle = isActive
      ? "rgba(255,255,255,0.9)"
      : isBlocked
        ? "rgba(251,113,133,0.9)"
        : isComplement || isHint
          ? "rgba(250,204,21,0.72)"
          : "rgba(255,255,255,0.22)";
    ctx.lineWidth = isActive || isComplement || isBlocked || isHint ? 2 : 1;
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
      ctx.fillStyle = "rgba(250,204,21,0.94)";
      ctx.beginPath();
      ctx.roundRect(tile.x + 7, tile.y + tile.height - 23, 36, 17, 8);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.font = "900 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(`+${selectionSummary.neededValue}`, tile.x + 25, tile.y + tile.height - 11);
    }

    if (isHint) {
      ctx.strokeStyle = "rgba(250,204,21,0.38)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(tile.x - 4, tile.y - 4, tile.width + 8, tile.height + 8, 19);
      ctx.stroke();
      ctx.fillStyle = "rgba(250,204,21,0.94)";
      ctx.beginPath();
      ctx.roundRect(tile.x + tile.width - 35, tile.y + 7, 27, 17, 8);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.font = "900 9px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("힌트", tile.x + tile.width - 21.5, tile.y + 19);
    }

    if (isBlocked) {
      ctx.strokeStyle = "rgba(251,113,133,0.42)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(tile.x - 6, tile.y - 6, tile.width + 12, tile.height + 12, 21);
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

  for (const feedback of state.sumFeedbacks) {
    const progress = clamp(feedback.age / 0.95, 0, 1);
    const alpha = 1 - progress;
    const lift = progress * 32;
    const clear = feedback.kind === "clear";
    ctx.save();
    for (const point of feedback.points) {
      ctx.globalAlpha = alpha * (clear ? 0.72 : 0.48);
      ctx.strokeStyle = clear ? "rgba(250,204,21,0.88)" : "rgba(251,113,133,0.82)";
      ctx.lineWidth = clear ? 4 : 3;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 20 + progress * 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = alpha;
    ctx.font = "900 16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    const pillWidth = clamp(ctx.measureText(feedback.label).width + 30, 58, 116);
    const pillX = clamp(feedback.x - pillWidth / 2, 28, canvasWidth - pillWidth - 28);
    const pillY = clamp(feedback.y - 46 - lift, 76, canvasHeight - 88);
    ctx.fillStyle = clear ? "rgba(250,204,21,0.95)" : "rgba(127,29,29,0.9)";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, 30, 15);
    ctx.fill();
    ctx.strokeStyle = clear ? "rgba(255,255,255,0.72)" : "rgba(251,113,133,0.86)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = clear ? "#111827" : "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText(feedback.label, pillX + pillWidth / 2, pillY + 21);
    ctx.restore();
  }

  if (dragging && state.sumDragMoved && state.sumDragCurrent) {
    const pillWidth = 124;
    const pillHeight = 42;
    const pillX = clamp(state.sumDragCurrent.x + 18, 36, canvasWidth - pillWidth - 36);
    const pillY = clamp(state.sumDragCurrent.y + 18, 94, canvasHeight - pillHeight - 50);
    ctx.fillStyle = blockedTile ? "rgba(251,113,133,0.94)" : shownSum === 10 ? "rgba(251,191,36,0.95)" : shownSum > 10 ? "rgba(251,113,133,0.94)" : "rgba(15,23,42,0.86)";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 16);
    ctx.fill();
    ctx.fillStyle = shownSum === 10 && !blockedTile ? "#111827" : "#f8fafc";
    ctx.font = "900 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(dragPrimaryLabel, pillX + pillWidth / 2, pillY + 17);
    ctx.fillStyle = shownSum === 10 && !blockedTile ? "rgba(17,24,39,0.72)" : "rgba(248,250,252,0.72)";
    ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(dragSecondaryLabel, pillX + pillWidth / 2, pillY + 32);
  }

  if (shownTiles.length || dragging) {
    const releaseWidth = shownSum === 10 || blockedTile ? 158 : 124;
    const releaseX = canvasWidth - releaseWidth - 34;
    const releaseY = canvasHeight - 92;
    ctx.fillStyle = blockedTile ? "rgba(127,29,29,0.9)" : shownSum === 10 ? "rgba(250,204,21,0.92)" : "rgba(15,23,42,0.88)";
    ctx.beginPath();
    ctx.roundRect(releaseX, releaseY, releaseWidth, 30, 15);
    ctx.fill();
    ctx.strokeStyle = blockedTile ? "rgba(251,113,133,0.85)" : shownSum === 10 ? "rgba(254,240,138,0.9)" : "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = shownSum === 10 && !blockedTile ? "#111827" : "#f8fafc";
    ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(releaseLabel.slice(0, 18), releaseX + releaseWidth / 2, releaseY + 20);
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
    ctx.fillText(dragging ? `놓으면 ${clearScoreLabel}` : `Space 누르면 ${clearScoreLabel}`, canvasWidth - 34, canvasHeight - 66);
  }
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    dragging
      ? "지나온 사과 쪽으로 되돌아가면 마지막 선택이 빠집니다."
      : "연속 10은 보너스가 붙습니다. 넘치거나 모자라면 연속이 끊깁니다.",
    34,
    canvasHeight - 20,
  );

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 164);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("마우스로 사과를 쓸어 담습니다. 노란 힌트는 한 조합만 보여줍니다.", canvasWidth / 2, 202);
    ctx.fillText("합 10을 이어가면 연속 보너스가 붙습니다.", canvasWidth / 2, 228);
  }
}

function drawCrossing(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const nextAction: CrossingAction = "up";
  const nextY = crossingNextY(state.playerY, nextAction);
  const nextDanger = crossingDangerForY(state.sprites, state.playerX, nextY);
  const nextColor = nextDanger.level === "danger" ? danger : nextDanger.level === "watch" ? primary : accent;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#182235";
  ctx.fillRect(0, 42, canvasWidth, canvasHeight - 98);
  ctx.fillStyle = "#233047";
  ctx.fillRect(0, 0, canvasWidth, 42);
  ctx.fillRect(0, crossingStartY - 23, canvasWidth, 58);

  for (const y of crossingLanes) {
    const laneDanger = crossingDangerForY(state.sprites, state.playerX, y);
    if (laneDanger.level !== "safe") {
      ctx.fillStyle = laneDanger.level === "danger" ? "rgba(251,113,133,0.16)" : "rgba(250,204,21,0.11)";
      ctx.fillRect(0, y - 26, canvasWidth, 52);
    }
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

  ctx.strokeStyle = nextColor;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.roundRect(state.playerX - 24, nextY - 24, 48, 48, 12);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

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

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(500, 64, 178, 116, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("다음 한 칸", 518, 98);
  ctx.fillStyle = nextColor;
  ctx.font = "900 24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(crossingDangerLabel(nextDanger), 518, 132);
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const secondsText = nextDanger.seconds === null ? "차 간격을 보고 이동" : `${nextDanger.seconds.toFixed(1)}초 안에 차가 옴`;
  ctx.fillText(secondsText, 518, 156);

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`건넌 기록 ${Math.floor(state.score / 5)} · 마우스/터치로 가고 싶은 방향을 누르면 한 칸 움직입니다.`, 24, canvasHeight - 18);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.68)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 168);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("다음 칸 표시가 초록이면 건너고, 노랑이나 빨강이면 잠깐 봅니다.", canvasWidth / 2, 204);
    ctx.fillText("방향키/WASD 또는 마우스/터치로 한 칸씩 움직입니다.", canvasWidth / 2, 230);
  }
}

function drawBrickLandingGuide(state: GameState, ctx: CanvasRenderingContext2D, accent: string, danger: string) {
  const landingX = brickLandingX(state);
  if (landingX === null) return;

  const catchable = Math.abs(landingX - state.playerX) <= brickPaddleWidth / 2;
  const guideColor = catchable ? accent : danger;
  const labelX = clamp(landingX, 70, canvasWidth - 70);
  const paddleY = state.playerY - 8;

  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = catchable ? "rgba(163,230,53,0.72)" : "rgba(251,113,133,0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(landingX, Math.max(state.brickBallY + 12, 88));
  ctx.lineTo(landingX, paddleY - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = catchable ? "rgba(163,230,53,0.18)" : "rgba(251,113,133,0.16)";
  ctx.strokeStyle = catchable ? "rgba(163,230,53,0.7)" : "rgba(251,113,133,0.72)";
  ctx.beginPath();
  ctx.roundRect(landingX - brickPaddleWidth / 2, paddleY - 7, brickPaddleWidth, 22, 11);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = guideColor;
  ctx.beginPath();
  ctx.arc(landingX, paddleY - 16, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(catchable ? "받을 자리" : "패들 이동", labelX, paddleY - 28);
  ctx.restore();
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

  drawBrickLandingGuide(state, ctx, accent, danger);

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - brickPaddleWidth / 2, state.playerY - 8, brickPaddleWidth, 16, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 10, state.playerY - 10, 20, 20, 6);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(state.brickBallX, state.brickBallY, brickBallRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${state.bricks.filter((brick) => brick.alive).length}개 남음`, 24, canvasHeight - 22);
  ctx.textAlign = "right";
  ctx.fillText("착지선을 보고 마우스/터치로 패들을 맞춥니다.", canvasWidth - 24, canvasHeight - 22);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.68)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 172);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("패들을 움직일 곳을 누르면 바로 공을 보냅니다.", canvasWidth / 2, 208);
    ctx.fillText("벽돌을 다급하게 쫓지 말고, 공이 돌아올 자리를 먼저 잡으세요.", canvasWidth / 2, 234);
  } else if (!state.brickLaunched) {
    ctx.fillStyle = "rgba(15,23,42,0.5)";
    ctx.fillRect(0, canvasHeight - 116, canvasWidth, 42);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("패들 위치를 누르거나 Space로 다시 시작", canvasWidth / 2, canvasHeight - 90);
  }
}

function endingFor(content: ArcadeGameContent, score: number) {
  return [...content.endings].sort((a, b) => b.minScore - a.minScore).find((item) => score >= item.minScore) ?? content.endings[content.endings.length - 1];
}

function arcadeTurnKey(playTick: number) {
  return `arcade-${(((playTick + 1) * 2654435761) >>> 0).toString(36)}`;
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
  const activeActionLabel =
    content.arcade.variant === "lottery" && view.lotteryTicketDone ? "다음 복권" : view.started ? mainActionLabel(content) : "시작";
  const shareScoreLabel = content.arcade.variant === "lottery" ? `누적 당첨: ${lotteryPrizeLabel(view.lotteryTotalPrize)}` : `점수: ${view.score}`;
  const lotteryStage = lotteryStageAt(view.lotteryStage);
  const lotteryNextStage = lotteryStageAt((view.lotteryStage + 1) % lotteryStages.length);
  const shortLotteryStageTitle = (title: string) => title.replace(/^[0-9]단계\s*/, "");
  const metricItems =
    content.arcade.variant === "lottery"
      ? [
          { label: "현재 단계", value: shortLotteryStageTitle(lotteryStage.title) },
          { label: "다음 단계", value: shortLotteryStageTitle(lotteryNextStage.title) },
          { label: "이번 장", value: lotteryPrizeLabel(view.lotteryLastPrize) },
          { label: "방식", value: "끝 없음" },
        ]
      : content.arcade.variant === "sum-box"
        ? [
            { label: "기록", value: view.score },
            { label: "남은 시간", value: `${timeLeft}s` },
            { label: "연속", value: view.sumStreak },
            { label: "방식", value: "드래그" },
          ]
        : [
            { label: "점수", value: view.score },
            { label: "집중", value: view.focus },
            { label: "남은 시간", value: `${timeLeft}s` },
            { label: "상태", value: view.started ? "진행" : "대기" },
          ];

  const syncView = React.useCallback(() => {
    setView(snapshot(stateRef.current));
  }, []);

  const restart = React.useCallback(() => {
    keysRef.current.clear();
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
      if (content.arcade.variant === "lottery") {
        if (action === "left") moveLotteryCursor(state, -1);
        if (action === "right") moveLotteryCursor(state, 1);
        if (action === "up") moveLotteryCursor(state, -lotteryColumns);
        if (action === "down") moveLotteryCursor(state, lotteryColumns);
        if (action === "main") revealLotteryCell(content, state);
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
        state.playTick += 1;
        state.playerY = clamp(state.playerY + crossingStepY, crossingFinishY - 10, crossingStartY);
      }
      if (action === "main" || (content.arcade.variant === "crossing" && action === "up")) {
        if (content.arcade.variant === "crossing") {
          state.playTick += 1;
          state.playerY = clamp(state.playerY - crossingStepY, crossingFinishY - 10, crossingStartY);
        } else if (content.arcade.variant === "brick-breaker") {
          launchOrNudgeBrickBall(state);
        } else if (content.arcade.variant === "runner") {
          state.playTick += 1;
          state.playerVy = -390;
        } else if (content.arcade.variant === "flight") {
          state.playTick += 1;
          state.playerVy -= 250;
        } else {
          fireArcadeBullet(content, state);
        }
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
      const mineFlagKey = content.arcade.variant === "minesweeper" && event.code === "KeyF";
      const memoryDigitKey = content.arcade.variant === "memory" ? memoryDigitFromKeyboardCode(event.code) : -1;
      const memoryReplayKey = content.arcade.variant === "memory" && event.code === "KeyR";
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Enter", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code) ||
        passwordDigitKey !== null ||
        passwordUtilityKey ||
        passwordSuggestionKey ||
        mineFlagKey ||
        memoryDigitKey >= 0 ||
        memoryReplayKey
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
        if (content.arcade.variant === "lottery") {
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
            cyclePasswordSuggestion(stateRef.current);
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
          if (mineFlagKey) {
            stateRef.current.started = true;
            stateRef.current.lastFrame = performance.now();
            toggleMineFlag(stateRef.current);
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
          if (memoryReplayKey) {
            const state = stateRef.current;
            state.started = true;
            state.lastFrame = performance.now();
            replayMemoryPreview(content, state);
            setShareState("idle");
            syncView();
            return;
          }
          if (memoryDigitKey >= 0) {
            const state = stateRef.current;
            const wasStarted = state.started;
            state.started = true;
            state.lastFrame = performance.now();
            setMemoryCursor(state, memoryDigitKey);
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

      if (content.arcade.variant === "lottery") {
        if (state.lotterySuppressClick) {
          state.lotterySuppressClick = false;
          return;
        }
        if (lotteryTicketComplete(state)) {
          event.preventDefault();
          state.started = true;
          state.lastFrame = performance.now();
          nextLotteryTicket(content, state);
          setShareState("idle");
          syncView();
          return;
        }
        const index = lotteryCellIndexAt(state, point);
        if (index < 0) return;
        event.preventDefault();
        state.started = true;
        state.lastFrame = performance.now();
        state.lotteryCursor = index;
        revealLotteryCell(content, state, index);
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "password") {
        state.started = true;
        state.lastFrame = performance.now();
        const keypadDigit = passwordKeypadDigitAt(point.x, point.y);
        const digitIndex = passwordDigitIndexAt(point.x, point.y);
        const candidateOptions = passwordCandidateOptions(state.passwordAttempts);
        const candidateOptionIndex = passwordCandidateOptionAt(point.x, point.y);
        if (keypadDigit >= 0) {
          setPasswordDigit(state, keypadDigit, true);
        } else if (digitIndex >= 0) {
          setPasswordDigitFromClick(state, digitIndex);
        } else if (candidateOptionIndex >= 0 && candidateOptions[candidateOptionIndex]) {
          setPasswordSuggestionCursor(state, candidateOptionIndex, candidateOptions.length);
          applyPasswordCandidate(state, candidateOptions[candidateOptionIndex]);
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
        if (event.shiftKey) {
          event.preventDefault();
          toggleMineFlag(state, index);
        } else {
          revealMineCell(content, state, index);
        }
        setShareState("idle");
        syncView();
        return;
      }

      if (content.arcade.variant === "stacker") {
        return;
      }

      if (content.arcade.variant === "crossing") {
        event.preventDefault();
        const crossingAction = crossingActionFromPoint(state.playerX, state.playerY, point);
        performAction(crossingAction === "up" ? "main" : crossingAction);
        return;
      }

      if (content.arcade.variant === "shooter") {
        if (state.shooterSuppressClick) {
          state.shooterSuppressClick = false;
          return;
        }
        event.preventDefault();
        state.started = true;
        state.lastFrame = performance.now();
        aimShooterAt(state, point);
        fireArcadeBullet(content, state);
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
        return;
      }

      if (content.arcade.variant === "memory") {
        const cell = memoryCellAt(point.x, point.y);
        if (cell < 0) return;
        const wasStarted = state.started;
        state.started = true;
        state.lastFrame = performance.now();
        setMemoryCursor(state, cell);
        if (wasStarted) chooseMemoryCell(content, state, cell);
        setShareState("idle");
        syncView();
      }
    },
    [content, performAction, syncView],
  );

  const handleCanvasContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (content.arcade.variant !== "minesweeper") return;
      event.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const point = canvasPointFromEvent(canvas, event);
      const index = mineCellIndexAt(point.x, point.y);
      if (index < 0) return;
      const state = stateRef.current;
      if (state.finished) return;
      state.started = true;
      state.lastFrame = performance.now();
      toggleMineFlag(state, index);
      setShareState("idle");
      syncView();
    },
    [content, syncView],
  );

  const handleCanvasPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        content.arcade.variant !== "snake" &&
        content.arcade.variant !== "sum-box" &&
        content.arcade.variant !== "match-three" &&
        content.arcade.variant !== "lottery" &&
        content.arcade.variant !== "stacker" &&
        content.arcade.variant !== "shooter" &&
        content.arcade.variant !== "flight" &&
        content.arcade.variant !== "brick-breaker"
      )
        return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const point = canvasPointFromEvent(canvas, event);
      const state = stateRef.current;
      if (state.finished) return;
      if (content.arcade.variant === "shooter") {
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some synthetic browser environments do not expose pointer capture.
        }
        state.started = true;
        state.lastFrame = performance.now();
        state.shooterPointerActive = true;
        state.shooterSuppressClick = true;
        aimShooterAt(state, point);
        fireArcadeBullet(content, state);
        state.shooterFireCooldown = shooterPointerFireInterval;
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "lottery") {
        const alreadyComplete = lotteryTicketComplete(state);
        if (alreadyComplete) {
          event.preventDefault();
          state.started = true;
          state.lastFrame = performance.now();
          state.lotterySuppressClick = true;
          nextLotteryTicket(content, state);
          setShareState("idle");
          syncView();
          return;
        }
        const index = lotteryCellIndexAt(state, point);
        if (index < 0) return;
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some synthetic browser environments do not expose pointer capture.
        }
        state.started = true;
        state.lastFrame = performance.now();
        state.lotteryDragging = true;
        state.lotterySuppressClick = true;
        clearLotteryDragTrail(state);
        scratchLotteryAt(content, state, point);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "snake") {
        if (!pointInSnakeBoard(point)) return;
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some synthetic browser environments do not expose pointer capture.
        }
        state.started = true;
        state.lastFrame = performance.now();
        state.snakeDragStart = point;
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "brick-breaker") {
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some synthetic browser environments do not expose pointer capture.
        }
        state.started = true;
        state.lastFrame = performance.now();
        moveBrickPaddleTo(state, point.x);
        if (!state.brickLaunched) launchOrNudgeBrickBall(state);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "flight") {
        event.preventDefault();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some synthetic browser environments do not expose pointer capture.
        }
        keysRef.current.add("Space");
        startFlightLift(content, state);
        setShareState("idle");
        syncView();
        return;
      }
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
        state.sumDragBlockedTileId = null;
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
    [content, syncView],
  );

  const handleCanvasPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        content.arcade.variant !== "snake" &&
        content.arcade.variant !== "sum-box" &&
        content.arcade.variant !== "match-three" &&
        content.arcade.variant !== "lottery" &&
        content.arcade.variant !== "stacker" &&
        content.arcade.variant !== "shooter" &&
        content.arcade.variant !== "flight" &&
        content.arcade.variant !== "brick-breaker"
      )
        return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const state = stateRef.current;
      if (state.finished) return;
      const point = canvasPointFromEvent(canvas, event);
      if (content.arcade.variant === "shooter") {
        if (!state.shooterPointerActive || (event.buttons === 0 && event.pointerType !== "touch")) return;
        state.started = true;
        state.lastFrame = performance.now();
        aimShooterAt(state, point);
        setShareState("idle");
        return;
      }
      if (content.arcade.variant === "lottery") {
        if (!state.lotteryDragging || (event.buttons === 0 && event.pointerType !== "touch")) return;
        state.started = true;
        state.lastFrame = performance.now();
        scratchLotteryAt(content, state, point);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "snake") {
        if ((event.buttons === 0 && event.pointerType !== "touch") || !state.snakeDragStart) return;
        const direction = snakeDirectionFromDrag(state.snakeDragStart, point);
        if (!direction) return;
        state.started = true;
        state.lastFrame = performance.now();
        setSnakeDirection(state, direction);
        state.snakeDragStart = point;
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "brick-breaker") {
        if (event.buttons === 0) return;
        state.started = true;
        state.lastFrame = performance.now();
        moveBrickPaddleTo(state, point.x);
        return;
      }
      if (content.arcade.variant === "flight") {
        if (event.buttons === 0) keysRef.current.delete("Space");
        return;
      }
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
    [content, syncView],
  );

  const handleCanvasPointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        content.arcade.variant !== "snake" &&
        content.arcade.variant !== "sum-box" &&
        content.arcade.variant !== "match-three" &&
        content.arcade.variant !== "lottery" &&
        content.arcade.variant !== "stacker" &&
        content.arcade.variant !== "shooter" &&
        content.arcade.variant !== "flight" &&
        content.arcade.variant !== "brick-breaker"
      )
        return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const state = stateRef.current;
      if (content.arcade.variant === "flight" && state.finished) {
        keysRef.current.delete("Space");
        return;
      }
      if (content.arcade.variant === "shooter" && state.finished) {
        state.shooterPointerActive = false;
        return;
      }
      if (state.finished) return;
      event.preventDefault();
      const point = canvasPointFromEvent(canvas, event);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may be unavailable in tests.
      }
      if (content.arcade.variant === "shooter") {
        aimShooterAt(state, point);
        state.shooterPointerActive = false;
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "lottery") {
        if (state.lotteryDragging) scratchLotteryAt(content, state, point);
        state.lotteryDragging = false;
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "snake") {
        const direction = state.snakeDragStart ? snakeDirectionFromDrag(state.snakeDragStart, point) : snakeDirectionFromPoint(state, point);
        const tapDirection = direction ?? snakeDirectionFromPoint(state, point);
        state.snakeDragStart = null;
        if (tapDirection) {
          state.started = true;
          state.lastFrame = performance.now();
          setSnakeDirection(state, tapDirection);
        }
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "brick-breaker") {
        moveBrickPaddleTo(state, point.x);
        setShareState("idle");
        syncView();
        return;
      }
      if (content.arcade.variant === "flight") {
        keysRef.current.delete("Space");
        setShareState("idle");
        syncView();
        return;
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
        const blockedTile = state.sumDragBlockedTileId !== null ? state.sumTiles[state.sumDragBlockedTileId] : null;
        const fallbackPoint = state.sumDragStart;
        const clickedIndex = sumTileIndexAt(state, point.x, point.y);
        const fallbackIndex = clickedIndex >= 0 ? clickedIndex : sumTileIndexAt(state, fallbackPoint.x, fallbackPoint.y);
        clearSumDrag(state);
        if (dragged) {
          commitDraggedSumTiles(content, state, draggedTiles, blockedTile);
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
      if (
        content.arcade.variant !== "snake" &&
        content.arcade.variant !== "sum-box" &&
        content.arcade.variant !== "match-three" &&
        content.arcade.variant !== "lottery" &&
        content.arcade.variant !== "stacker" &&
        content.arcade.variant !== "shooter" &&
        content.arcade.variant !== "flight" &&
        content.arcade.variant !== "brick-breaker"
      )
        return;
      const state = stateRef.current;
      keysRef.current.delete("Space");
      state.snakeDragStart = null;
      state.shooterPointerActive = false;
      state.lotteryDragging = false;
      clearLotteryDragTrail(state);
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
    const text = `${content.shareText}\n${shareScoreLabel}`;
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
            {metricItems.map((item) => (
              <Metric key={item.label} label={item.label} value={item.value} />
            ))}
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
        <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_280px]" data-play-turn={arcadeTurnKey(view.playTick)}>
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
                onContextMenu={handleCanvasContextMenu}
                aria-label={`${content.title} canvas`}
                className={`block aspect-[18/13] w-full select-none outline-none ${
                  content.arcade.variant === "sum-box" ||
                  content.arcade.variant === "lottery" ||
                  content.arcade.variant === "snake" ||
                  content.arcade.variant === "password" ||
                  content.arcade.variant === "minesweeper" ||
                  content.arcade.variant === "match-three" ||
                  content.arcade.variant === "stacker" ||
                  content.arcade.variant === "shooter" ||
                  content.arcade.variant === "flight" ||
                  content.arcade.variant === "brick-breaker" ||
                  content.arcade.variant === "mole" ||
                  content.arcade.variant === "memory" ||
                  content.arcade.variant === "crossing"
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
            content.arcade.variant === "lottery" ||
            content.arcade.variant === "password" ||
            content.arcade.variant === "minesweeper" ||
            content.arcade.variant === "match-three" ||
            content.arcade.variant === "mole" ||
            content.arcade.variant === "memory" ||
            content.arcade.variant === "crossing" ? (
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
                  {activeActionLabel}
                </Button>
                <Button variant="outline" className="h-12" onClick={() => performAction("right")} data-play-action="arcade-right" aria-label="오른쪽">
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <span aria-hidden />
                <Button variant="outline" className="h-12" onClick={() => performAction("down")} data-play-action="arcade-down" aria-label="아래">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <span aria-hidden />
                {content.arcade.variant === "memory" ? (
                  <Button
                    variant="outline"
                    className="col-span-3 h-12"
                    onClick={() => {
                      const state = stateRef.current;
                      if (state.finished) return;
                      state.started = true;
                      state.lastFrame = performance.now();
                      replayMemoryPreview(content, state);
                      setShareState("idle");
                      syncView();
                    }}
                    data-play-action="arcade-replay"
                  >
                    다시 보기
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-12" onClick={() => performAction("left")} data-play-action="arcade-left">
                  왼쪽
                </Button>
                <Button className="h-12" onClick={() => performAction("main")} data-play-action="arcade-main">
                  {activeActionLabel}
                </Button>
                <Button variant="outline" className="h-12" onClick={() => performAction("right")} data-play-action="arcade-right">
                  오른쪽
                </Button>
              </div>
            )}
          </div>
          <LiveArcadeResultPanel
            content={content}
            ending={ending}
            onShare={shareResult}
            relatedBlogLinks={relatedBlogLinks}
            relatedPlayLinks={relatedPlayLinks}
            shareState={shareState}
            view={view}
          />
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

function historyDetailText(item: HistoryItem, isLottery = false) {
  if (isLottery) return item.score > 0 ? `${item.detail} / 당첨 +${item.score}` : item.detail;
  return `${item.detail} / ${item.score > 0 ? `+${item.score}` : item.score}`;
}

function historyToneClassName(item: HistoryItem, isLottery = false) {
  if (isLottery) return item.score > 0 ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-muted-foreground";
  return item.score >= 0 ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-red-600";
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
              <p className={historyToneClassName(item)}>{historyDetailText(item)}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">방향키와 Space로 움직이면 방금 지나간 선택이 여기에 남습니다.</p>
      )}
    </aside>
  );
}

function LiveArcadeResultPanel({
  content,
  ending,
  onShare,
  relatedBlogLinks,
  relatedPlayLinks,
  shareState,
  view,
}: {
  content: ArcadeGameContent;
  ending: { title: string; description: string };
  onShare: () => void | Promise<void>;
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
  shareState: "idle" | "copied" | "shared";
  view: ViewState;
}) {
  const isLottery = content.arcade.variant === "lottery";
  const isSumBox = content.arcade.variant === "sum-box";
  const stage = lotteryStageAt(view.lotteryStage);
  const nextStage = lotteryStageAt((view.lotteryStage + 1) % lotteryStages.length);
  const title = isLottery ? "현재 복권" : "현재 기록";
  const headline = isLottery ? stage.title : ending.title;
  const detail = isLottery
    ? view.lotteryTicketDone
      ? `이번 장 ${lotteryPrizeLabel(view.lotteryLastPrize)}. 다음은 ${nextStage.title}이고, 누르면 바로 이어서 긁습니다.`
      : `이번 장 ${lotteryPrizeLabel(view.lotteryLastPrize)}. 마음 가는 칸부터 긁고, 다 보면 다음 장으로 이어집니다.`
    : isSumBox
      ? `${view.score}점, 연속 ${view.sumStreak}. 타이머가 끝날 때까지 손이 가는 만큼 합 10을 이어갑니다.`
      : `${view.score}점, 집중 ${view.focus}. 지금 기록을 바로 공유할 수 있고 판은 시간과 집중 상태에 맞춰 이어집니다.`;

  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history data-play-result>
      <p className="text-sm font-semibold">{title}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-normal">{headline}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onShare} data-play-share>
          <Share2 className="h-4 w-4" />
          {shareState === "copied" ? "복사됨" : shareState === "shared" ? "공유됨" : "공유"}
        </Button>
      </div>
      <PlayResultLinks relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
      {view.history.length ? (
        <ol className="mt-3 space-y-2">
          {view.history.slice(0, 5).map((item, index) => (
            <li key={`${item.label}-${index}`} className="rounded-sm border bg-background p-2.5">
              <p className="text-sm font-medium">{item.label}</p>
              <p className={historyToneClassName(item, isLottery)}>{historyDetailText(item, isLottery)}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {isLottery ? "칸을 긁으면 당첨 기록이 여기에 남습니다." : "움직이면 방금 지나간 선택이 여기에 남습니다."}
        </p>
      )}
    </aside>
  );
}
