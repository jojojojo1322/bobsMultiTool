import type { ArcadeGameContent } from "@/features/content/types";
import { pickLabel, pseudoRandom } from "@/features/play/arcade-engine-utils";

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
