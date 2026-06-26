export type CanvasPoint = {
  x: number;
  y: number;
};

export type CanvasRect = CanvasPoint & {
  width: number;
  height: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function pseudoRandom(seed: number) {
  const raw = Math.sin(seed * 9283.37) * 10000;
  return raw - Math.floor(raw);
}

export function pickLabel(labels: string[], index: number) {
  return labels[index % labels.length] ?? "신호";
}

export function pointInRect(point: CanvasPoint, rect: CanvasRect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
}
