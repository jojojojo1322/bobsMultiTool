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
      label: "바닥",
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
