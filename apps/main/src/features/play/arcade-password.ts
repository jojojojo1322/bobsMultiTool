import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pseudoRandom } from "@/features/play/arcade-engine-utils";

const passwordCanvasWidth = 720;

export const passwordDigitCount = 3;
export const passwordDigitWidth = 112;
export const passwordDigitHeight = 136;
export const passwordDigitGap = 24;
export const passwordDigitStartX = (passwordCanvasWidth - passwordDigitCount * passwordDigitWidth - (passwordDigitCount - 1) * passwordDigitGap) / 2;
export const passwordDigitY = 154;
export const passwordSubmitRect = { x: passwordCanvasWidth / 2 - 96, y: 326, width: 192, height: 50 };
export const passwordSuggestionRect = { x: 42, y: 178, width: 148, height: 46 };
export const passwordCandidateOptionCount = 3;
export const passwordCandidateOptionWidth = 38;
export const passwordCandidateOptionHeight = 22;
export const passwordCandidateOptionGap = 6;
export const passwordKeypadColumns = 5;
export const passwordKeypadWidth = 64;
export const passwordKeypadHeight = 40;
export const passwordKeypadGap = 10;
export const passwordKeypadX = (passwordCanvasWidth - passwordKeypadColumns * passwordKeypadWidth - (passwordKeypadColumns - 1) * passwordKeypadGap) / 2;
export const passwordKeypadY = 414;
export const passwordTimeLimitSeconds = 60;

export type PasswordAttempt = {
  guess: string;
  exact: number;
  near: number;
  hint: string;
  repeated: boolean;
  issue?: "duplicate" | "contradiction";
};

export type PasswordCurrentGuessIssue = "duplicate" | "repeated" | "contradiction";

type PasswordHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

export type PasswordGuessPreview = {
  issue?: "duplicate" | "contradiction";
  candidatesBefore: number;
  expectedRemaining: number;
  worstRemaining: number;
  outcomeCount: number;
};

export type PasswordOutcomeBucket = {
  exact: number;
  near: number;
  label: string;
  count: number;
  ratio: number;
};

type PasswordPlayState = {
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  playTick: number;
  passwordGuess: number[];
  passwordSecret: number[];
  passwordCursor: number;
  passwordSuggestionCursor: number;
  passwordAttempts: PasswordAttempt[];
  history: PasswordHistoryItem[];
};

export function makePasswordSecret(content: ArcadeGameContent): number[] {
  const digits: number[] = [];
  for (let attempt = 0; digits.length < passwordDigitCount && attempt < 40; attempt += 1) {
    const digit = Math.floor(pseudoRandom(content.slug.length * 53 + attempt * 17 + 7) * 10);
    if (!digits.includes(digit)) digits.push(digit);
  }
  while (digits.length < passwordDigitCount) digits.push((digits.length * 3 + 4) % 10);
  return digits;
}

export function passwordGuessText(guess: number[]) {
  return guess.join("");
}

export function parsePasswordGuess(guess: string) {
  return guess.split("").map((digit) => Number(digit));
}

export function passwordGuessHasDuplicateDigits(guess: number[] | string) {
  const digits = Array.isArray(guess) ? guess : parsePasswordGuess(guess);
  return new Set(digits).size !== digits.length;
}

export function passwordDigitIndexAt(x: number, y: number) {
  if (y < passwordDigitY || y > passwordDigitY + passwordDigitHeight) return -1;
  for (let index = 0; index < passwordDigitCount; index += 1) {
    const left = passwordDigitStartX + index * (passwordDigitWidth + passwordDigitGap);
    if (x >= left && x <= left + passwordDigitWidth) return index;
  }
  return -1;
}

export function passwordKeypadDigitAt(x: number, y: number) {
  for (let digit = 0; digit <= 9; digit += 1) {
    const column = digit % passwordKeypadColumns;
    const row = Math.floor(digit / passwordKeypadColumns);
    const left = passwordKeypadX + column * (passwordKeypadWidth + passwordKeypadGap);
    const top = passwordKeypadY + row * (passwordKeypadHeight + passwordKeypadGap);
    if (x >= left && x <= left + passwordKeypadWidth && y >= top && y <= top + passwordKeypadHeight) return digit;
  }
  return -1;
}

export function passwordDigitFromKeyboardCode(code: string) {
  if (/^Digit\d$/.test(code)) return Number(code.slice(5));
  if (/^Numpad\d$/.test(code)) return Number(code.slice(6));
  return null;
}

export function updatePassword(_content: ArcadeGameContent, state: PasswordPlayState, dt: number) {
  state.elapsed += dt;
  if (state.focus <= 0 || state.elapsed >= passwordTimeLimitSeconds) {
    state.finished = true;
  }
}

function passwordSolvedScore(content: ArcadeGameContent) {
  return Math.max(0, ...content.endings.map((ending) => ending.minScore));
}

export function movePasswordCursor(state: Pick<PasswordPlayState, "passwordCursor">, delta: number) {
  state.passwordCursor = (state.passwordCursor + delta + passwordDigitCount) % passwordDigitCount;
}

export function adjustPasswordDigit(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor">, delta: number) {
  const current = state.passwordGuess[state.passwordCursor] ?? 0;
  state.passwordGuess[state.passwordCursor] = (current + delta + 10) % 10;
}

export function setPasswordDigit(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor">, digit: number, advance: boolean) {
  state.passwordGuess[state.passwordCursor] = clamp(Math.floor(digit), 0, 9);
  if (advance) movePasswordCursor(state, 1);
}

export function setPasswordDigitFromClick(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor" | "passwordAttempts">, digitIndex: number) {
  state.passwordCursor = clamp(digitIndex, 0, passwordDigitCount - 1);
  const candidates = passwordCandidatesForAttempts(state.passwordAttempts);
  const options = passwordPositionOptions(candidates)[state.passwordCursor] ?? [];
  const current = state.passwordGuess[state.passwordCursor] ?? 0;
  if (state.passwordAttempts.length > 0 && options.length > 0 && options.length < 10) {
    const currentIndex = options.indexOf(current);
    state.passwordGuess[state.passwordCursor] = options[(currentIndex + 1 + options.length) % options.length] ?? options[0] ?? current;
    return;
  }
  adjustPasswordDigit(state, 1);
}

export function applyPasswordCandidate(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor">, candidate: string) {
  if (!/^\d{3}$/.test(candidate)) return;
  state.passwordGuess = parsePasswordGuess(candidate);
  state.passwordCursor = 0;
}

export function setPasswordSuggestionCursor(state: Pick<PasswordPlayState, "passwordSuggestionCursor">, index: number, optionCount: number) {
  state.passwordSuggestionCursor = optionCount > 0 ? (Math.floor(index) + optionCount) % optionCount : 0;
}

export function applyPasswordSuggestion(
  state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor" | "passwordAttempts" | "passwordSuggestionCursor">,
) {
  const options = passwordCandidateOptions(state.passwordAttempts);
  const index = options.length ? state.passwordSuggestionCursor % options.length : 0;
  applyPasswordCandidate(state, options[index] ?? passwordSuggestion(state.passwordAttempts));
}

export function passwordCurrentGuessIssue(attempts: PasswordAttempt[], guess: number[] | string): PasswordCurrentGuessIssue | null {
  const guessText = Array.isArray(guess) ? passwordGuessText(guess) : guess;
  if (passwordGuessHasDuplicateDigits(guessText)) return "duplicate";
  if (attempts.some((attempt) => attempt.guess === guessText)) return "repeated";
  if (attempts.length > 0 && !passwordGuessIsPossible(attempts, guessText)) return "contradiction";
  return null;
}

export function cyclePasswordSuggestion(
  state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor" | "passwordAttempts" | "passwordSuggestionCursor">,
  delta = 1,
) {
  const options = passwordCandidateOptions(state.passwordAttempts);
  if (!options.length) return;
  const currentIndex = options.indexOf(passwordGuessText(state.passwordGuess));
  setPasswordSuggestionCursor(state, currentIndex >= 0 ? currentIndex + delta : state.passwordSuggestionCursor, options.length);
  applyPasswordCandidate(state, options[state.passwordSuggestionCursor] ?? options[0] ?? "---");
}

export function submitPasswordGuess(content: ArcadeGameContent, state: PasswordPlayState) {
  if (state.finished) return;
  state.playTick += 1;
  const { exact, near } = evaluatePasswordGuess(state.passwordSecret, state.passwordGuess);
  const guess = passwordGuessText(state.passwordGuess);
  const duplicate = passwordGuessHasDuplicateDigits(state.passwordGuess);
  const repeated = isRepeatedPasswordGuess(state.passwordAttempts, guess);
  const contradiction = state.passwordAttempts.length > 0 && !duplicate && !repeated && !passwordGuessIsPossible(state.passwordAttempts, guess);
  const issue: PasswordAttempt["issue"] | undefined = duplicate ? "duplicate" : contradiction ? "contradiction" : undefined;
  const solved = !issue && exact === passwordDigitCount;
  const solvedScore = passwordSolvedScore(content);
  const hint = duplicate
    ? "중복 숫자는 쓰지 않습니다"
    : contradiction
      ? "기록과 안 맞는 번호입니다"
      : passwordHint(state.passwordSecret, state.passwordGuess, exact, near);
  const delta = solved
    ? solvedScore
    : issue
      ? 0
      : Math.max(0, exact * 5 + near * 2 - (exact === 0 && near === 0 ? 1 : 0) - (repeated ? 3 : 0));

  state.score = solved ? solvedScore : Math.max(state.score, delta);
  state.focus = clamp(state.focus + (solved ? 8 : duplicate ? -14 : repeated ? -13 : contradiction ? -11 : exact > 0 || near > 0 ? -4 : -9), 0, 100);
  state.passwordAttempts = [{ guess, exact, near, hint: repeated ? "이미 해본 번호입니다" : hint, repeated, issue }, ...state.passwordAttempts].slice(0, 6);
  state.passwordSuggestionCursor = 0;
  rememberPasswordHistory(state, {
    label: guess,
    detail: solved ? "번호가 열림" : duplicate ? "중복 숫자" : repeated ? "반복해서 손해" : contradiction ? "기록과 충돌" : `${exact}자리, ${near}숫자`,
    score: solved ? solvedScore : delta,
  });

  if (solved || state.focus <= 0) {
    state.finished = true;
  }
}

export function evaluatePasswordGuess(secret: number[], guess: number[]) {
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

export function isRepeatedPasswordGuess(attempts: PasswordAttempt[], guess: string) {
  return attempts.some((attempt) => attempt.guess === guess);
}

export function passwordCandidatesForAttempts(attempts: PasswordAttempt[]) {
  const candidates: number[][] = [];
  for (let a = 0; a <= 9; a += 1) {
    for (let b = 0; b <= 9; b += 1) {
      if (b === a) continue;
      for (let c = 0; c <= 9; c += 1) {
        if (c === a || c === b) continue;
        const candidate = [a, b, c];
        if (candidateMatchesAttempts(candidate, attempts)) {
          candidates.push(candidate);
        }
      }
    }
  }
  return candidates;
}

export function passwordCandidateStats(attempts: PasswordAttempt[]) {
  const candidates = passwordCandidatesForAttempts(attempts);
  const previousCandidates = attempts.length ? passwordCandidatesForAttempts(attempts.slice(1)) : candidates;
  return {
    candidates,
    previousCount: previousCandidates.length,
    narrowedBy: Math.max(0, previousCandidates.length - candidates.length),
  };
}

export function passwordAttemptCandidateSummary(attempts: PasswordAttempt[], index: number) {
  const before = passwordCandidatesForAttempts(attempts.slice(index + 1)).length;
  const after = passwordCandidatesForAttempts(attempts.slice(index)).length;
  return {
    before,
    after,
    reduced: Math.max(0, before - after),
  };
}

export function passwordGuessPreview(attempts: PasswordAttempt[], guess: number[] | string): PasswordGuessPreview {
  const guessText = Array.isArray(guess) ? passwordGuessText(guess) : guess;
  const candidates = passwordCandidatesForAttempts(attempts);
  if (passwordGuessHasDuplicateDigits(guessText)) {
    return {
      issue: "duplicate" as const,
      candidatesBefore: candidates.length,
      expectedRemaining: candidates.length,
      worstRemaining: candidates.length,
      outcomeCount: 0,
    };
  }

  const alreadyTried = attempts.some((attempt) => attempt.guess === guessText);
  const guessDigits = parsePasswordGuess(guessText);
  const isCandidate = candidates.some((candidate) => candidate.join("") === guessText);
  if (attempts.length > 0 && !alreadyTried && !isCandidate) {
    return {
      issue: "contradiction" as const,
      candidatesBefore: candidates.length,
      expectedRemaining: candidates.length,
      worstRemaining: candidates.length,
      outcomeCount: 0,
    };
  }

  if (!candidates.length) {
    return {
      issue: undefined,
      candidatesBefore: 0,
      expectedRemaining: 0,
      worstRemaining: 0,
      outcomeCount: 0,
    };
  }

  const buckets = new Map<string, number>();
  for (const possibleSecret of candidates) {
    const outcome = evaluatePasswordGuess(possibleSecret, guessDigits);
    const key = `${outcome.exact}-${outcome.near}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const bucketSizes = [...buckets.values()];
  return {
    issue: undefined,
    candidatesBefore: candidates.length,
    expectedRemaining: bucketSizes.reduce((sum, size) => sum + size * size, 0) / candidates.length,
    worstRemaining: Math.max(...bucketSizes),
    outcomeCount: buckets.size,
  };
}

export function passwordGuessOutcomeBuckets(attempts: PasswordAttempt[], guess: number[] | string, limit = 3): PasswordOutcomeBucket[] {
  const guessText = Array.isArray(guess) ? passwordGuessText(guess) : guess;
  const candidates = passwordCandidatesForAttempts(attempts);
  if (!candidates.length || passwordGuessHasDuplicateDigits(guessText)) return [];

  const alreadyTried = attempts.some((attempt) => attempt.guess === guessText);
  const guessDigits = parsePasswordGuess(guessText);
  const isCandidate = candidates.some((candidate) => candidate.join("") === guessText);
  if (attempts.length > 0 && !alreadyTried && !isCandidate) return [];

  const buckets = new Map<string, PasswordOutcomeBucket>();
  for (const possibleSecret of candidates) {
    const outcome = evaluatePasswordGuess(possibleSecret, guessDigits);
    const key = `${outcome.exact}-${outcome.near}`;
    const previous = buckets.get(key);
    if (previous) {
      previous.count += 1;
    } else {
      buckets.set(key, {
        exact: outcome.exact,
        near: outcome.near,
        label: `${outcome.exact}자리 ${outcome.near}숫자`,
        count: 1,
        ratio: 0,
      });
    }
  }

  return [...buckets.values()]
    .map((bucket) => ({ ...bucket, ratio: bucket.count / candidates.length }))
    .sort((left, right) => right.count - left.count || right.exact - left.exact || right.near - left.near)
    .slice(0, limit);
}

export function passwordGuessSplitRatio(preview: PasswordGuessPreview) {
  if (preview.issue || preview.candidatesBefore <= 0) return 0;
  return clamp(1 - preview.expectedRemaining / preview.candidatesBefore, 0, 1);
}

export function passwordGuessSplitLabel(preview: PasswordGuessPreview) {
  if (preview.issue === "duplicate") return "중복";
  if (preview.issue === "contradiction") return "충돌";
  if (preview.candidatesBefore <= 0) return "흐름 막힘";
  const ratio = passwordGuessSplitRatio(preview);
  if (ratio >= 0.68 && preview.worstRemaining <= Math.ceil(preview.candidatesBefore * 0.38)) return "아주 좋음";
  if (ratio >= 0.5) return "좋음";
  if (ratio >= 0.32) return "보통";
  return "약함";
}

export function passwordPositionOptions(candidates: number[][]) {
  return Array.from({ length: passwordDigitCount }, (_, position) => {
    const digits = new Set<number>();
    for (const candidate of candidates) {
      const digit = candidate[position];
      if (digit !== undefined) digits.add(digit);
    }
    return [...digits].sort((left, right) => left - right);
  });
}

export function formatPasswordOptionDigits(digits: number[]) {
  if (!digits.length) return "-";
  if (digits.length >= 9) return "0-9";
  return digits.join("");
}

export function passwordDigitFrequency(candidates: number[][]) {
  const counts = Array.from({ length: 10 }, () => 0);
  for (const candidate of candidates) {
    for (const digit of candidate) counts[digit] += 1;
  }
  const max = Math.max(1, ...counts);
  return counts.map((count) => ({ count, ratio: count / max }));
}

export function passwordPositionDigitFrequency(candidates: number[][]) {
  const counts = Array.from({ length: passwordDigitCount }, () => Array.from({ length: 10 }, () => 0));
  for (const candidate of candidates) {
    candidate.forEach((digit, position) => {
      if (counts[position]) counts[position][digit] += 1;
    });
  }
  return counts.map((positionCounts) => {
    const max = Math.max(1, ...positionCounts);
    return positionCounts.map((count) => ({ count, ratio: count / max }));
  });
}

export function formatTopPasswordDigits(positionCounts: Array<{ count: number }>, limit = 3) {
  const ranked = positionCounts
    .map((entry, digit) => ({ digit, count: entry.count }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count || left.digit - right.digit)
    .slice(0, limit);
  return ranked.length ? ranked.map((entry) => entry.digit).join("") : "-";
}

export function passwordSuggestion(attempts: PasswordAttempt[]) {
  return passwordRankedCandidateOptions(attempts, 1)[0] ?? "---";
}

export function passwordCandidateOptions(attempts: PasswordAttempt[]) {
  return passwordRankedCandidateOptions(attempts, passwordCandidateOptionCount);
}

function passwordRankedCandidateOptions(attempts: PasswordAttempt[], limit: number) {
  const candidates = passwordCandidatesForAttempts(attempts).map((candidate) => candidate.join(""));
  const triedGuesses = new Set(attempts.map((attempt) => attempt.guess));
  const untried = candidates.filter((candidate) => !triedGuesses.has(candidate));
  const pool = untried.length ? untried : candidates;
  if (!attempts.length || candidates.length > 240) return pool.slice(0, limit);

  const candidateDigits = candidates.map(parsePasswordGuess);

  return pool
    .map((guess) => {
      const buckets = new Map<string, number>();
      const guessDigits = parsePasswordGuess(guess);
      for (const possibleSecret of candidateDigits) {
        const outcome = evaluatePasswordGuess(possibleSecret, guessDigits);
        const key = `${outcome.exact}-${outcome.near}`;
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
      const sizes = [...buckets.values()];
      const worstRemaining = Math.max(...sizes);
      const expectedRemaining = sizes.reduce((sum, size) => sum + size * size, 0) / candidates.length;
      return { guess, expectedRemaining, worstRemaining };
    })
    .sort((left, right) => left.expectedRemaining - right.expectedRemaining || left.worstRemaining - right.worstRemaining || left.guess.localeCompare(right.guess))
    .slice(0, limit)
    .map((item) => item.guess);
}

export function passwordCandidateOptionRect(index: number) {
  const totalWidth = passwordCandidateOptionCount * passwordCandidateOptionWidth + (passwordCandidateOptionCount - 1) * passwordCandidateOptionGap;
  const startX = passwordSuggestionRect.x + (passwordSuggestionRect.width - totalWidth) / 2;
  return {
    x: startX + index * (passwordCandidateOptionWidth + passwordCandidateOptionGap),
    y: passwordSuggestionRect.y + 18,
    width: passwordCandidateOptionWidth,
    height: passwordCandidateOptionHeight,
  };
}

export function passwordCandidateOptionAt(x: number, y: number) {
  for (let index = 0; index < passwordCandidateOptionCount; index += 1) {
    const rect = passwordCandidateOptionRect(index);
    if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) return index;
  }
  return -1;
}

export function passwordGuessIsPossible(attempts: PasswordAttempt[], guess: string) {
  if (passwordGuessHasDuplicateDigits(guess)) return false;
  return passwordCandidatesForAttempts(attempts).some((candidate) => candidate.join("") === guess);
}

export function passwordDigitMarks(attempts: PasswordAttempt[]) {
  const marks: Array<"unknown" | "candidate" | "absent"> = Array.from({ length: 10 }, () => "unknown");
  for (const attempt of attempts) {
    if (attempt.issue) continue;
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

export function passwordHint(secret: number[], guess: number[], exact: number, near: number) {
  if (exact === passwordDigitCount) return "열림";
  if (exact === 0 && near === 0) return "숫자부터 다시 보는 게 낫습니다";
  if (exact === 2) return "한 자리만 더 맞추면 됩니다";
  if (near >= 2) return "숫자는 좋은데 자리가 어긋났습니다";
  const guessSum = guess.reduce((sum, digit) => sum + digit, 0);
  const secretSum = secret.reduce((sum, digit) => sum + digit, 0);
  if (guessSum < secretSum) return "합이 조금 낮습니다";
  if (guessSum > secretSum) return "합이 조금 높습니다";
  return "방향은 나쁘지 않습니다";
}

function candidateMatchesAttempts(candidate: number[], attempts: PasswordAttempt[]) {
  return attempts.every((attempt) => {
    if (attempt.issue) return true;
    const { exact, near } = evaluatePasswordGuess(candidate, parsePasswordGuess(attempt.guess));
    return exact === attempt.exact && near === attempt.near;
  });
}

function rememberPasswordHistory(state: Pick<PasswordPlayState, "history">, item: PasswordHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}
