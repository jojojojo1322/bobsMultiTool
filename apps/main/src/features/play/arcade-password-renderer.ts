import type { ArcadeGameContent } from "@/features/content/types";
import { clamp } from "@/features/play/arcade-engine-utils";
import {
  formatPasswordOptionDigits,
  formatTopPasswordDigits,
  passwordAttemptCandidateSummary,
  passwordCandidateOptionRect,
  passwordCandidateOptions,
  passwordCandidateStats,
  passwordCurrentGuessIssue,
  passwordDigitCount,
  passwordDigitFrequency,
  passwordDigitGap,
  passwordDigitHeight,
  passwordDigitMarks,
  passwordDigitStartX,
  passwordDigitWidth,
  passwordDigitY,
  passwordGuessOutcomeBuckets,
  passwordGuessPreview,
  passwordGuessSplitLabel,
  passwordGuessSplitRatio,
  passwordGuessText,
  passwordKeypadColumns,
  passwordKeypadGap,
  passwordKeypadHeight,
  passwordKeypadWidth,
  passwordKeypadX,
  passwordKeypadY,
  passwordPositionDigitFrequency,
  passwordPositionOptions,
  passwordSubmitRect,
  passwordSuggestion,
  passwordSuggestionRect,
  type PasswordAttempt,
} from "@/features/play/arcade-password";

const passwordCanvasWidth = 720;
const passwordCanvasHeight = 520;

export type PasswordRenderState = {
  started: boolean;
  focus: number;
  passwordGuess: number[];
  passwordCursor: number;
  passwordSuggestionCursor: number;
  passwordAttempts: PasswordAttempt[];
};

export function drawPassword(content: ArcadeGameContent, state: PasswordRenderState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const latest = state.passwordAttempts[0];
  const candidateStats = passwordCandidateStats(state.passwordAttempts);
  const candidates = candidateStats.candidates;
  const positionOptions = passwordPositionOptions(candidates);
  const positionFrequency = passwordPositionDigitFrequency(candidates);
  const selectedPositionOptions = new Set(positionOptions[state.passwordCursor] ?? []);
  const selectedPositionFrequency = positionFrequency[state.passwordCursor] ?? [];
  const selectedPositionHasSignal = state.passwordAttempts.length > 0 && selectedPositionFrequency.some((entry) => entry.count > 0);
  const positionTopDigits = positionFrequency.map((positionCounts) =>
    state.passwordAttempts.length
      ? positionCounts
          .map((entry, digit) => ({ digit, ...entry }))
          .filter((entry) => entry.count > 0)
          .sort((left, right) => right.count - left.count || left.digit - right.digit)
          .slice(0, 3)
      : [],
  );
  const selectedTopDigits = positionTopDigits[state.passwordCursor] ?? [];
  const digitFrequency = passwordDigitFrequency(candidates);
  const suggestion = passwordSuggestion(state.passwordAttempts);
  const candidateOptions = passwordCandidateOptions(state.passwordAttempts);
  const suggestionIndex = candidateOptions.length ? state.passwordSuggestionCursor % candidateOptions.length : -1;
  const digitMarks = passwordDigitMarks(state.passwordAttempts);
  const currentGuess = passwordGuessText(state.passwordGuess);
  const currentIssue = passwordCurrentGuessIssue(state.passwordAttempts, state.passwordGuess);
  const duplicateCurrent = currentIssue === "duplicate";
  const repeatedCurrent = currentIssue === "repeated";
  const impossibleCurrent = currentIssue === "contradiction";
  const guessPreview = passwordGuessPreview(state.passwordAttempts, state.passwordGuess);
  const outcomeBuckets = passwordGuessOutcomeBuckets(state.passwordAttempts, state.passwordGuess);
  const splitRatio = passwordGuessSplitRatio(guessPreview);
  const splitLabel = passwordGuessSplitLabel(guessPreview);
  const splitOutcomeText = guessPreview.issue ? "확인 전 수정" : guessPreview.candidatesBefore ? "힌트가 갈림" : "흐름 막힘";
  const guessPreviewText = duplicateCurrent
    ? "중복은 무효"
    : repeatedCurrent
      ? "이미 본 번호"
      : impossibleCurrent || guessPreview.issue === "contradiction"
        ? "기록과 충돌"
        : state.passwordAttempts.length
          ? `${splitLabel} · ${passwordCandidateMood(Math.ceil(guessPreview.expectedRemaining))}`
          : "처음은 가볍게";
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
  ctx.fillRect(0, 0, passwordCanvasWidth, passwordCanvasHeight);

  const centerX = passwordCanvasWidth / 2;
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
  ctx.fillText("힌트 보고 금고 열기", centerX, 120);

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.roundRect(34, 72, 152, 138, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("번호 흐름", 48, 96);
  ctx.fillStyle = candidates.length <= 12 ? accent : "#f8fafc";
  ctx.font = "900 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(passwordCandidateMood(candidates.length), 48, 124);
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(state.passwordAttempts.length ? passwordNarrowingMood(candidateStats.narrowedBy) : "첫 입력은 가볍게", 48, 146);
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
  ctx.fillStyle = selectedPositionHasSignal ? primary : "rgba(255,255,255,0.5)";
  ctx.font = "800 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`현재 ${state.passwordCursor + 1}칸 추천 ${formatTopPasswordDigits(selectedPositionFrequency)}`, 48, 322);
  ctx.textAlign = "center";

  if (selectedTopDigits.length) {
    const selectedX = passwordDigitStartX + state.passwordCursor * (passwordDigitWidth + passwordDigitGap);
    const railWidth = 106;
    const railX = clamp(selectedX + passwordDigitWidth / 2 - railWidth / 2, 196, 418);
    const railY = passwordDigitY - 28;
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.beginPath();
    ctx.roundRect(railX, railY, railWidth, 22, 11);
    ctx.fill();
    ctx.strokeStyle = "rgba(96,165,250,0.58)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "rgba(191,219,254,0.82)";
    ctx.font = "800 9px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("이 칸 후보", railX + 9, railY + 14);
    selectedTopDigits.forEach((entry, index) => {
      const chipX = railX + 60 + index * 15;
      ctx.fillStyle = index === 0 ? accent : "rgba(96,165,250,0.76)";
      ctx.beginPath();
      ctx.roundRect(chipX, railY + 4, 13, 14, 6);
      ctx.fill();
      ctx.fillStyle = index === 0 ? "#111827" : "#f8fafc";
      ctx.font = "900 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${entry.digit}`, chipX + 6.5, railY + 14);
    });
    ctx.strokeStyle = "rgba(96,165,250,0.45)";
    ctx.beginPath();
    ctx.moveTo(selectedX + passwordDigitWidth / 2, railY + 22);
    ctx.lineTo(selectedX + passwordDigitWidth / 2, passwordDigitY - 4);
    ctx.stroke();
    ctx.textAlign = "center";
  }

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
    ctx.fillText(positionDigit && positionDigit.count > 0 ? `가능성 ${passwordRatioMood(positionDigit.ratio, positionDigit.count)}` : "가능성 낮음", x + passwordDigitWidth / 2, passwordDigitY + 113);
    ctx.fillStyle = selected ? accent : "rgba(255,255,255,0.5)";
    ctx.font = selected ? "850 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif" : "800 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(selected && state.passwordAttempts.length ? "클릭 순환" : "↑↓", x + passwordDigitWidth / 2, passwordDigitY + 130);
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
  ctx.fillText(currentIssue ? "추천 확인" : "확인", centerX, passwordSubmitRect.y + 28);

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
    const positionFrequencyEntry = selectedPositionFrequency[digit] ?? { count: 0, ratio: 0 };
    const slotCandidate = selectedPositionHasSignal && selectedPositionOptions.has(digit);
    const selectedDigit = digit === state.passwordGuess[state.passwordCursor];
    const keypadFrequency = selectedPositionHasSignal ? positionFrequencyEntry : frequency;
    ctx.fillStyle = selectedDigit
      ? "rgba(96,165,250,0.34)"
      : slotCandidate
        ? "rgba(96,165,250,0.2)"
        : selectedPositionHasSignal
          ? "rgba(148,163,184,0.14)"
          : mark === "absent"
            ? "rgba(148,163,184,0.18)"
            : mark === "candidate"
              ? "rgba(251,191,36,0.22)"
              : "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(x, y, passwordKeypadWidth, passwordKeypadHeight, 10);
    ctx.fill();
    ctx.strokeStyle = selectedDigit
      ? primary
      : slotCandidate
        ? "rgba(96,165,250,0.68)"
        : mark === "absent"
          ? "rgba(148,163,184,0.26)"
          : mark === "candidate"
            ? "rgba(251,191,36,0.55)"
            : "rgba(255,255,255,0.15)";
    ctx.lineWidth = selectedDigit ? 2 : 1;
    ctx.stroke();
    ctx.fillStyle = selectedPositionHasSignal && !slotCandidate && !selectedDigit ? "rgba(255,255,255,0.34)" : "#f8fafc";
    ctx.font = "900 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(`${digit}`, x + passwordKeypadWidth / 2, y + 19);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(x + 10, y + passwordKeypadHeight - 9, passwordKeypadWidth - 20, 4, 2);
    ctx.fill();
    ctx.fillStyle = selectedDigit ? primary : slotCandidate ? accent : mark === "absent" ? "rgba(148,163,184,0.38)" : keypadFrequency.count > 0 ? accent : "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.roundRect(x + 10, y + passwordKeypadHeight - 9, Math.max(3, (passwordKeypadWidth - 20) * keypadFrequency.ratio), 4, 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = "750 9px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(passwordRatioMood(keypadFrequency.ratio, keypadFrequency.count), x + passwordKeypadWidth / 2, y + 33);
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
  ctx.fillText("자리 / 숫자 / 흐름", historyX + 58, historyY - 18);

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
    const candidateLine = issueLabel ? attempt.hint : candidateSummary.reduced ? passwordNarrowingMood(candidateSummary.reduced) : "흐름 유지";
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
    ctx.font = "850 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(issueLabel ? "무효" : passwordCandidateMood(candidateSummary.after), historyX + historyWidth - 10, y + 20);
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
      ctx.font = "850 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(passwordRatioMood(bucket.ratio, bucket.count), historyX + historyWidth - 10, y + 13);
      ctx.textAlign = "left";
    });
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    state.passwordAttempts.length ? "숫자키·칸 클릭 후보 순환·추천칩·Enter / 막대=현재 칸 흐름" : "숫자키·칸 클릭 숫자 변경·추천칩·Enter / 막대=가능성 흐름",
    34,
    passwordKeypadY - 4,
  );

  if (state.focus < 35) {
    ctx.fillStyle = danger;
    ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("조급해졌습니다. 기록을 보고 하나씩 줄이세요.", 34, passwordKeypadY - 48);
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, 0, passwordCanvasWidth, passwordCanvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "800 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, centerX, 166);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("세 자리 숫자를 맞춥니다. 힌트 흐름을 보며 번호를 좁힙니다.", centerX, 204);
    ctx.fillText("현재 번호가 힌트를 얼마나 잘 가르는지도 보고 눌러봅니다.", centerX, 230);
  }
}

function passwordCandidateMood(count: number) {
  if (count <= 0) return "막힘";
  if (count <= 3) return "거의 잠김";
  if (count <= 12) return "좁아짐";
  if (count <= 80) return "갈림";
  return "넓음";
}

function passwordNarrowingMood(reduced: number) {
  if (reduced >= 120) return "크게 좁힘";
  if (reduced >= 24) return "잘 좁힘";
  if (reduced > 0) return "조금 좁힘";
  return "흐름 유지";
}

function passwordRatioMood(ratio: number, count: number) {
  if (count <= 0) return "낮음";
  if (ratio >= 0.62) return "강함";
  if (ratio >= 0.28) return "보통";
  return "낮음";
}
