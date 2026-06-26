import type { ArcadeGameContent } from "@/features/content/types";
import { pseudoRandom } from "@/features/play/arcade-engine-utils";

const passwordCanvasWidth = 720;

export const passwordDigitCount = 3;
export const passwordDigitWidth = 112;
export const passwordDigitHeight = 136;
export const passwordDigitGap = 24;
export const passwordDigitStartX = (passwordCanvasWidth - passwordDigitCount * passwordDigitWidth - (passwordDigitCount - 1) * passwordDigitGap) / 2;
export const passwordDigitY = 154;
export const passwordSubmitRect = { x: passwordCanvasWidth / 2 - 96, y: 326, width: 192, height: 50 };
export const passwordSuggestionRect = { x: 42, y: 178, width: 148, height: 46 };
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
  const candidates = passwordCandidatesForAttempts(attempts);
  const triedGuesses = new Set(attempts.map((attempt) => attempt.guess));
  return candidates.find((candidate) => !triedGuesses.has(candidate.join("")))?.join("") ?? candidates[0]?.join("") ?? "---";
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
