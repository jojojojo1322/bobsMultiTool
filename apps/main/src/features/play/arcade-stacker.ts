import type { ArcadeGameContent } from "@/features/content/types";
import { clamp } from "@/features/play/arcade-engine-utils";

const stackerCanvasWidth = 720;

export const stackerBoardX = 96;
export const stackerBoardY = 48;
export const stackerBoardWidth = 528;
export const stackerBoardHeight = 322;
export const stackerBlockHeight = 26;
export const stackerBaseWidth = 216;
export const stackerBaseY = stackerBoardY + stackerBoardHeight - stackerBlockHeight;
export const stackerMinOverlap = 18;

export type StackerBlock = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  quality: "base" | "perfect" | "solid" | "thin" | "miss";
};

export type StackerPlacementPreview = {
  activeLeft: number;
  activeRight: number;
  overlapLeft: number;
  overlapRight: number;
  overlap: number;
  cutLeft: number;
  cutRight: number;
  centerGap: number;
  nearPerfect: boolean;
  placedWidth: number;
  placedX: number;
  quality: StackerBlock["quality"];
  scoreDelta: number;
  focusDelta: number;
  status: string;
  detail: string;
};

type StackerBlockState = {
  stackerBlocks: StackerBlock[];
};

type StackerActiveState = StackerBlockState & {
  stackerActiveX: number;
  stackerActiveY: number;
  stackerActiveWidth: number;
  stackerDirection: number;
  stackerSpeed: number;
  stackerLayer: number;
};

export function makeStackerBlocks(content: ArcadeGameContent): StackerBlock[] {
  if (content.arcade.variant !== "stacker") return [];
  return [
    {
      id: 0,
      x: stackerCanvasWidth / 2 - stackerBaseWidth / 2,
      y: stackerBaseY,
      width: stackerBaseWidth,
      height: stackerBlockHeight,
      label: "기반",
      quality: "base",
    },
  ];
}

export function topStackerBlock(state: StackerBlockState) {
  return state.stackerBlocks[state.stackerBlocks.length - 1];
}

export function resetStackerActiveFromTop(state: StackerActiveState) {
  const top = topStackerBlock(state);
  const width = top ? top.width : stackerBaseWidth;
  const y = top ? top.y - stackerBlockHeight : stackerBaseY - stackerBlockHeight;
  const fromLeft = state.stackerLayer % 2 === 0;
  state.stackerActiveWidth = width;
  state.stackerActiveY = y;
  state.stackerActiveX = fromLeft ? stackerBoardX : stackerBoardX + stackerBoardWidth - width;
  state.stackerDirection = fromLeft ? 1 : -1;
  state.stackerSpeed = 168 + Math.min(132, state.stackerLayer * 15);
}

export function nudgeStacker(state: Pick<StackerActiveState, "stackerActiveX" | "stackerActiveWidth">, delta: number) {
  state.stackerActiveX = clamp(state.stackerActiveX + delta, stackerBoardX, stackerBoardX + stackerBoardWidth - state.stackerActiveWidth);
}

export function centerStackerActiveAt(state: Pick<StackerActiveState, "stackerActiveX" | "stackerActiveWidth">, centerX: number) {
  state.stackerActiveX = clamp(centerX - state.stackerActiveWidth / 2, stackerBoardX, stackerBoardX + stackerBoardWidth - state.stackerActiveWidth);
}

export function stackerPlacementPreview(state: StackerActiveState): StackerPlacementPreview | null {
  const previous = topStackerBlock(state);
  if (!previous) return null;

  const activeLeft = state.stackerActiveX;
  const activeRight = state.stackerActiveX + state.stackerActiveWidth;
  const overlapLeft = Math.max(activeLeft, previous.x);
  const overlapRight = Math.min(activeRight, previous.x + previous.width);
  const overlap = Math.max(0, overlapRight - overlapLeft);
  const centerGap = Math.abs(activeLeft + state.stackerActiveWidth / 2 - (previous.x + previous.width / 2));
  const cutLeft = Math.max(0, previous.x - activeLeft);
  const cutRight = Math.max(0, activeRight - (previous.x + previous.width));

  if (overlap < stackerMinOverlap) {
    return {
      activeLeft,
      activeRight,
      overlapLeft,
      overlapRight,
      overlap,
      cutLeft,
      cutRight,
      centerGap,
      nearPerfect: false,
      placedWidth: 0,
      placedX: overlapLeft,
      quality: "miss",
      scoreDelta: -2,
      focusDelta: -18,
      status: "착지 끊김",
      detail: "겹친 면이 거의 없음",
    };
  }

  const nearPerfect = centerGap <= 7 || overlap >= previous.width * 0.96;
  const placedWidth = nearPerfect ? Math.min(stackerBaseWidth, previous.width + 4) : overlap;
  const placedX = nearPerfect ? previous.x - Math.max(0, placedWidth - previous.width) / 2 : overlapLeft;
  const quality: StackerBlock["quality"] = nearPerfect ? "perfect" : overlap >= previous.width * 0.72 ? "solid" : "thin";
  const scoreDelta = nearPerfect ? 4 : quality === "solid" ? 3 : 2;
  const focusDelta = nearPerfect ? 5 : quality === "solid" ? 2 : -6;

  return {
    activeLeft,
    activeRight,
    overlapLeft,
    overlapRight,
    overlap,
    cutLeft,
    cutRight,
    centerGap,
    nearPerfect,
    placedWidth,
    placedX,
    quality,
    scoreDelta,
    focusDelta,
    status: nearPerfect ? "착지 성공" : quality === "solid" ? "층 안정" : "잘림 경고",
    detail: nearPerfect ? "가운데 정렬" : quality === "solid" ? "남을 폭 안정" : "다음 폭이 얇아짐",
  };
}
