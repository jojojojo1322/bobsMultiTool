import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pickLabel, pseudoRandom } from "@/features/play/arcade-engine-utils";

export const moleColumns = 3;
export const moleRows = 3;
export const moleHoleSize = 82;
export const moleGap = 28;
export const moleBoardWidth = moleColumns * moleHoleSize + (moleColumns - 1) * moleGap;
export const moleBoardHeight = moleRows * moleHoleSize + (moleRows - 1) * moleGap;
export const moleBoardX = 72;
export const moleBoardY = 76;

export type MoleTarget = {
  id: number;
  hole: number;
  label: string;
  good: boolean;
  age: number;
  ttl: number;
};

export type MoleTargetTiming = {
  progress: number;
  remaining: number;
  urgency: number;
  pop: number;
};

export type MoleWhackOutcome = {
  score: number;
  focus: number;
  detail: string;
};

type MoleTargetState = {
  moleTargets: MoleTarget[];
};

type MoleCursorState = {
  moleCursor: number;
};

type MoleSpawnState = MoleTargetState & {
  nextSpriteId: number;
};

export function moleHoleCenter(hole: number) {
  const column = hole % moleColumns;
  const row = Math.floor(hole / moleColumns);
  return {
    x: moleBoardX + column * (moleHoleSize + moleGap) + moleHoleSize / 2,
    y: moleBoardY + row * (moleHoleSize + moleGap) + moleHoleSize / 2,
  };
}

export function moleHoleAt(x: number, y: number) {
  for (let hole = 0; hole < moleColumns * moleRows; hole += 1) {
    const center = moleHoleCenter(hole);
    const dx = (x - center.x) / (moleHoleSize / 2);
    const dy = (y - center.y) / (moleHoleSize / 2.5);
    if (dx * dx + dy * dy <= 1) return hole;
  }
  return -1;
}

export function moveMoleCursor(state: MoleCursorState, delta: number) {
  const total = moleColumns * moleRows;
  state.moleCursor = (state.moleCursor + delta + total) % total;
}

export function occupiedMoleHoles(state: MoleTargetState) {
  return new Set(state.moleTargets.map((target) => target.hole));
}

export function spawnMoleTarget(content: ArcadeGameContent, state: MoleSpawnState, preferredHole?: number) {
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

export function activeMoleAt(state: MoleTargetState, hole: number) {
  return state.moleTargets.find((target) => target.hole === hole);
}

export function moleTargetTiming(target: MoleTarget): MoleTargetTiming {
  const progress = clamp(target.age / target.ttl, 0, 1);
  const remaining = 1 - progress;
  return {
    progress,
    remaining,
    urgency: clamp((progress - 0.58) / 0.42, 0, 1),
    pop: Math.sin((Math.min(1, progress * 2) * Math.PI) / 2) * (1 - Math.max(0, progress - 0.72) * 0.9),
  };
}

export function molePriorityTarget(state: MoleTargetState) {
  return (
    state.moleTargets
      .filter((target) => target.good)
      .sort((left, right) => {
        const leftTiming = moleTargetTiming(left);
        const rightTiming = moleTargetTiming(right);
        return leftTiming.remaining - rightTiming.remaining;
      })[0] ?? null
  );
}

export function moleAvoidTarget(state: MoleTargetState) {
  return (
    state.moleTargets
      .filter((target) => !target.good)
      .sort((left, right) => moleTargetTiming(right).urgency - moleTargetTiming(left).urgency)[0] ?? null
  );
}

export function moleWhackOutcome(target: MoleTarget): MoleWhackOutcome {
  const timing = moleTargetTiming(target);
  if (target.good) {
    if (timing.remaining >= 0.48) return { score: 4, focus: 4, detail: "핵심 알림 빠르게 처리" };
    if (timing.remaining <= 0.2) return { score: 2, focus: 1, detail: "늦게라도 핵심 잡음" };
    return { score: 3, focus: 3, detail: "지금 볼 것만 잡음" };
  }
  if (timing.urgency > 0.72) return { score: -5, focus: -13, detail: "사라질 소음에 손이 감" };
  return { score: -4, focus: -11, detail: "굳이 잡았음" };
}
