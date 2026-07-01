import type { CanvasPoint } from "@/features/play/arcade-engine-utils";

export const crossingLanes = [326, 274, 222, 170, 118, 66];
export const crossingStartY = 478;
export const crossingStepX = 48;
export const crossingStepY = 52;
export const crossingFinishY = crossingLanes[crossingLanes.length - 1] - 26;

export type CrossingAction = "left" | "right" | "up" | "down";

export type CrossingSpriteLike = {
  x: number;
  y: number;
  vx: number;
  radius: number;
};

export type CrossingDanger = {
  level: "safe" | "watch" | "danger";
  seconds: number | null;
  gap: number;
  laneY: number;
};

export function crossingActionFromPoint(playerX: number, playerY: number, point: CanvasPoint): CrossingAction {
  const dx = point.x - playerX;
  const dy = point.y - playerY;
  if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? "up" : "down";
  return dx < 0 ? "left" : "right";
}

export function crossingNextY(playerY: number, action: CrossingAction) {
  if (action === "up") return Math.max(crossingFinishY - 10, playerY - crossingStepY);
  if (action === "down") return Math.min(crossingStartY, playerY + crossingStepY);
  return playerY;
}

export function crossingDangerForY(sprites: CrossingSpriteLike[], playerX: number, laneY: number): CrossingDanger {
  let nearestSeconds: number | null = null;
  let nearestGap = Number.POSITIVE_INFINITY;

  for (const sprite of sprites) {
    if (Math.abs(sprite.y - laneY) > 28) continue;
    const rawGap = Math.abs(sprite.x - playerX) - (sprite.radius + 18);
    nearestGap = Math.min(nearestGap, rawGap);
    const seconds = sprite.vx === 0 ? null : (playerX - sprite.x) / sprite.vx;
    if (seconds !== null && seconds >= 0 && seconds <= 1.4) {
      nearestSeconds = nearestSeconds === null ? seconds : Math.min(nearestSeconds, seconds);
    }
  }

  if (!Number.isFinite(nearestGap)) {
    return { level: "safe", seconds: null, gap: 999, laneY };
  }
  if (nearestGap <= 14 || (nearestSeconds !== null && nearestSeconds < 0.48)) {
    return { level: "danger", seconds: nearestSeconds, gap: nearestGap, laneY };
  }
  if (nearestGap <= 82 || nearestSeconds !== null) {
    return { level: "watch", seconds: nearestSeconds, gap: nearestGap, laneY };
  }
  return { level: "safe", seconds: null, gap: nearestGap, laneY };
}

export function crossingDangerLabel(danger: CrossingDanger) {
  if (danger.level === "danger") return "빨강 멈춤";
  if (danger.level === "watch") return "노랑 차단봉";
  return "초록 통과";
}
