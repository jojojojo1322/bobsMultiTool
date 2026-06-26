import type { ArcadeGameContent } from "@/features/content/types";
import { pseudoRandom } from "@/features/play/arcade-engine-utils";

export const passwordDigitCount = 3;

export type PasswordAttempt = {
  guess: string;
  exact: number;
  near: number;
  hint: string;
  repeated: boolean;
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

export function passwordDigitMarks(attempts: PasswordAttempt[]) {
  const marks: Array<"unknown" | "candidate" | "absent"> = Array.from({ length: 10 }, () => "unknown");
  for (const attempt of attempts) {
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
    const { exact, near } = evaluatePasswordGuess(candidate, parsePasswordGuess(attempt.guess));
    return exact === attempt.exact && near === attempt.near;
  });
}
