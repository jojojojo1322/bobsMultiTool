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

type PasswordHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type PasswordPlayState = {
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  actions: number;
  passwordGuess: number[];
  passwordSecret: number[];
  passwordCursor: number;
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

export function updatePassword(content: ArcadeGameContent, state: PasswordPlayState, dt: number) {
  state.elapsed += dt;
  if (state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= passwordTimeLimitSeconds) {
    state.finished = true;
  }
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

export function setPasswordDigitFromClick(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor">, digitIndex: number) {
  state.passwordCursor = clamp(digitIndex, 0, passwordDigitCount - 1);
  adjustPasswordDigit(state, 1);
}

export function applyPasswordCandidate(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor">, candidate: string) {
  if (!/^\d{3}$/.test(candidate)) return;
  state.passwordGuess = parsePasswordGuess(candidate);
  state.passwordCursor = 0;
}

export function applyPasswordSuggestion(state: Pick<PasswordPlayState, "passwordGuess" | "passwordCursor" | "passwordAttempts">) {
  applyPasswordCandidate(state, passwordSuggestion(state.passwordAttempts));
}

export function submitPasswordGuess(content: ArcadeGameContent, state: PasswordPlayState) {
  if (state.finished) return;
  state.actions += 1;
  const { exact, near } = evaluatePasswordGuess(state.passwordSecret, state.passwordGuess);
  const guess = passwordGuessText(state.passwordGuess);
  const duplicate = passwordGuessHasDuplicateDigits(state.passwordGuess);
  const repeated = isRepeatedPasswordGuess(state.passwordAttempts, guess);
  const contradiction = state.passwordAttempts.length > 0 && !duplicate && !repeated && !passwordGuessIsPossible(state.passwordAttempts, guess);
  const issue: PasswordAttempt["issue"] | undefined = duplicate ? "duplicate" : contradiction ? "contradiction" : undefined;
  const solved = !issue && exact === passwordDigitCount;
  const hint = duplicate
    ? "중복 숫자는 쓰지 않습니다"
    : contradiction
      ? "기록과 안 맞는 번호입니다"
      : passwordHint(state.passwordSecret, state.passwordGuess, exact, near);
  const delta = solved
    ? content.arcade.targetScore
    : issue
      ? 0
      : Math.max(0, exact * 5 + near * 2 - (exact === 0 && near === 0 ? 1 : 0) - (repeated ? 3 : 0));

  state.score = solved ? content.arcade.targetScore : Math.max(state.score, delta);
  state.focus = clamp(state.focus + (solved ? 8 : duplicate ? -14 : repeated ? -13 : contradiction ? -11 : exact > 0 || near > 0 ? -4 : -9), 0, 100);
  state.passwordAttempts = [{ guess, exact, near, hint: repeated ? "이미 해본 번호입니다" : hint, repeated, issue }, ...state.passwordAttempts].slice(0, 6);
  rememberPasswordHistory(state, {
    label: guess,
    detail: solved ? "번호가 열림" : duplicate ? "중복 숫자" : repeated ? "반복해서 손해" : contradiction ? "기록과 충돌" : `${exact}자리, ${near}숫자`,
    score: solved ? content.arcade.targetScore : delta,
  });

  if (solved || state.actions >= content.arcade.rounds || state.focus <= 0) {
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
