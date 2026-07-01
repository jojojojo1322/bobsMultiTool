import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pseudoRandom } from "@/features/play/arcade-engine-utils";

export const memoryColumns = 3;
export const memoryRows = 3;
export const memoryCellSize = 78;
export const memoryGap = 18;
export const memoryBoardWidth = memoryColumns * memoryCellSize + (memoryColumns - 1) * memoryGap;
export const memoryBoardHeight = memoryRows * memoryCellSize + (memoryRows - 1) * memoryGap;
export const memoryBoardX = 86;
export const memoryBoardY = 82;
export const memoryFlashStep = 0.58;
export const memoryFlashOn = 0.36;

type MemoryHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type MemoryPlayState = {
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  playTick: number;
  memorySequence: number[];
  memoryInput: number[];
  memoryCursor: number;
  memoryRound: number;
  memoryShowing: boolean;
  memoryFlashIndex: number;
  memoryFlashTimer: number;
  history: MemoryHistoryItem[];
};

export function memoryLengthForRound(round: number) {
  return clamp(3 + Math.floor((round - 1) / 2), 3, 7);
}

export function makeMemorySequence(content: ArcadeGameContent, round: number, salt: number) {
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

export function resetMemoryPreview(content: ArcadeGameContent, state: MemoryPlayState, keepSequence = true) {
  state.memorySequence = keepSequence ? state.memorySequence : makeMemorySequence(content, state.memoryRound, state.playTick + state.score);
  state.memoryInput = [];
  state.memoryShowing = true;
  state.memoryFlashIndex = 0;
  state.memoryFlashTimer = 0;
}

export function memoryCellCenter(cell: number) {
  const column = cell % memoryColumns;
  const row = Math.floor(cell / memoryColumns);
  return {
    x: memoryBoardX + column * (memoryCellSize + memoryGap) + memoryCellSize / 2,
    y: memoryBoardY + row * (memoryCellSize + memoryGap) + memoryCellSize / 2,
  };
}

export function memoryCellAt(x: number, y: number) {
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

export function moveMemoryCursor(state: Pick<MemoryPlayState, "memoryCursor">, delta: number) {
  const total = memoryColumns * memoryRows;
  state.memoryCursor = (state.memoryCursor + delta + total) % total;
}

export function setMemoryCursor(state: Pick<MemoryPlayState, "memoryCursor">, cell: number) {
  state.memoryCursor = clamp(cell, 0, memoryColumns * memoryRows - 1);
}

export function memoryDigitFromKeyboardCode(code: string) {
  if (/^Digit[1-9]$/.test(code)) return Number(code.slice(5)) - 1;
  if (/^Numpad[1-9]$/.test(code)) return Number(code.slice(6)) - 1;
  return -1;
}

export function activeMemoryFlashCell(state: MemoryPlayState) {
  if (!state.memoryShowing || !state.memorySequence.length || state.memoryFlashIndex < 0) return -1;
  const phase = state.memoryFlashTimer % memoryFlashStep;
  if (phase > memoryFlashOn) return -1;
  return state.memorySequence[state.memoryFlashIndex] ?? -1;
}

export function chooseMemoryCell(content: ArcadeGameContent, state: MemoryPlayState, cell = state.memoryCursor) {
  if (state.finished) return;
  if (state.memoryShowing) {
    state.playTick += 1;
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 6, 0, 100);
    rememberMemoryHistory(state, {
      label: "너무 빠름",
      detail: "대기 불 뒤에 누르기",
      score: -1,
    });
    resetMemoryPreview(content, state, true);
    finishMemoryIfNeeded(state);
    return;
  }

  setMemoryCursor(state, cell);
  const expected = state.memorySequence[state.memoryInput.length];
  if (cell === expected) {
    state.memoryInput = [...state.memoryInput, cell];
    if (state.memoryInput.length < state.memorySequence.length) return;

    state.playTick += 1;
    const delta = 4 + state.memorySequence.length;
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + 5, 0, 100);
    rememberMemoryHistory(state, {
      label: "램프 순서 성공",
      detail: "누른 순서 맞음",
      score: delta,
    });
    state.memoryRound += 1;
    resetMemoryPreview(content, state, false);
    finishMemoryIfNeeded(state);
    return;
  }

  state.playTick += 1;
  state.score = Math.max(0, state.score - 2);
  state.focus = clamp(state.focus - 13, 0, 100);
  rememberMemoryHistory(state, {
    label: "다른 램프",
    detail: "순서 놓침",
    score: -2,
  });
  resetMemoryPreview(content, state, true);
  finishMemoryIfNeeded(state);
}

export function replayMemoryPreview(content: ArcadeGameContent, state: MemoryPlayState) {
  if (state.finished) return;
  if (!state.memorySequence.length) resetMemoryPreview(content, state, false);
  if (!state.memoryShowing) {
    state.playTick += 1;
    state.score = Math.max(0, state.score - 1);
    state.focus = clamp(state.focus - 5, 0, 100);
    rememberMemoryHistory(state, {
      label: "다시 보기",
      detail: "램프 순서 재확인",
      score: -1,
    });
  }
  resetMemoryPreview(content, state, true);
  finishMemoryIfNeeded(state);
}

export function updateMemory(content: ArcadeGameContent, state: MemoryPlayState, dt: number) {
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

  finishMemoryIfNeeded(state);
}

function finishMemoryIfNeeded(state: MemoryPlayState) {
  if (state.focus <= 0 || state.elapsed >= 60) {
    state.finished = true;
  }
}

function rememberMemoryHistory(state: Pick<MemoryPlayState, "history">, item: MemoryHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}
