"use client";

import * as React from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArcadeGameContent } from "@/features/content/types";
import { PlayResultLinks, type PlayResultLink } from "@/features/play/result-links";

const canvasWidth = 720;
const canvasHeight = 420;
const crossingLanes = [326, 274, 222, 170, 118, 66];
const crossingStartY = canvasHeight - 42;
const crossingStepX = 48;
const crossingStepY = 52;

type Sprite = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  good: boolean;
};

type Bullet = {
  x: number;
  y: number;
  vy: number;
};

type Brick = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  good: boolean;
  alive: boolean;
};

type HistoryItem = {
  label: string;
  detail: string;
  score: number;
};

type GameState = {
  started: boolean;
  finished: boolean;
  elapsed: number;
  score: number;
  focus: number;
  actions: number;
  playerX: number;
  playerY: number;
  playerVy: number;
  nextSpriteId: number;
  spawnTimer: number;
  bullets: Bullet[];
  sprites: Sprite[];
  bricks: Brick[];
  brickBallX: number;
  brickBallY: number;
  brickBallVx: number;
  brickBallVy: number;
  brickLaunched: boolean;
  history: HistoryItem[];
  lastFrame: number | null;
};

type ViewState = Pick<GameState, "started" | "finished" | "elapsed" | "score" | "focus" | "actions" | "history">;

function makeInitialState(content: ArcadeGameContent): GameState {
  return {
    started: false,
    finished: false,
    elapsed: 0,
    score: 0,
    focus: 100,
    actions: 0,
    playerX: canvasWidth / 2,
    playerY:
      content.arcade.variant === "runner" || content.arcade.variant === "flight"
        ? canvasHeight - 92
        : content.arcade.variant === "crossing"
          ? crossingStartY
          : canvasHeight - 56,
    playerVy: 0,
    nextSpriteId: 1,
    spawnTimer: 0,
    bullets: [],
    sprites: [],
    bricks: makeBricks(content),
    brickBallX: canvasWidth / 2,
    brickBallY: canvasHeight - 96,
    brickBallVx: 180,
    brickBallVy: -260,
    brickLaunched: false,
    history: [],
    lastFrame: null,
  };
}

function makeBricks(content: ArcadeGameContent): Brick[] {
  if (content.arcade.variant !== "brick-breaker") return [];
  const columns = 5;
  const rows = 3;
  const gap = 10;
  const brickWidth = (canvasWidth - 96 - gap * (columns - 1)) / columns;
  const bricks: Brick[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const id = row * columns + column;
      const good = (row + column) % 3 !== 0;
      const labels = good ? content.arcade.goodLabels : content.arcade.badLabels;
      bricks.push({
        id,
        x: 48 + column * (brickWidth + gap),
        y: 58 + row * 42,
        width: brickWidth,
        height: 28,
        label: pickLabel(labels, id),
        good,
        alive: true,
      });
    }
  }
  return bricks;
}

function snapshot(state: GameState): ViewState {
  return {
    started: state.started,
    finished: state.finished,
    elapsed: state.elapsed,
    score: state.score,
    focus: state.focus,
    actions: state.actions,
    history: state.history,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pseudoRandom(seed: number) {
  const raw = Math.sin(seed * 9283.37) * 10000;
  return raw - Math.floor(raw);
}

function pickLabel(labels: string[], index: number) {
  return labels[index % labels.length] ?? "신호";
}

function addHistory(state: GameState, item: HistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function spawnSprite(content: ArcadeGameContent, state: GameState) {
  const seed = state.nextSpriteId + content.slug.length * 17;
  const good = pseudoRandom(seed) > 0.34;
  const label = pickLabel(good ? content.arcade.goodLabels : content.arcade.badLabels, state.nextSpriteId);
  const sideScroller = content.arcade.variant === "runner" || content.arcade.variant === "flight";
  const radius = 18 + Math.floor(pseudoRandom(seed + 2) * 8);
  const sprite: Sprite = sideScroller
    ? {
        id: state.nextSpriteId,
        x: canvasWidth + 40,
        y: canvasHeight - 76 - pseudoRandom(seed + 1) * 150,
        vx: -150 - pseudoRandom(seed + 3) * 90,
        vy: 0,
        radius,
        label,
        good,
      }
    : {
        id: state.nextSpriteId,
        x: 60 + pseudoRandom(seed + 1) * (canvasWidth - 120),
        y: -30,
        vx: (pseudoRandom(seed + 4) - 0.5) * 34,
        vy: 82 + pseudoRandom(seed + 3) * 68,
        radius,
        label,
        good,
      };

  state.nextSpriteId += 1;
  state.sprites.push(sprite);
}

function shouldUseSideScroller(content: ArcadeGameContent) {
  return content.arcade.variant === "runner" || content.arcade.variant === "flight";
}

function mainActionLabel(content: ArcadeGameContent) {
  if (shouldUseSideScroller(content)) return "점프";
  if (content.arcade.variant === "crossing") return "건너기";
  if (content.arcade.variant === "brick-breaker") return "치기";
  if (content.arcade.variant === "stacker") return "쌓기";
  if (content.arcade.variant === "mole") return "잡기";
  if (content.arcade.variant === "memory") return "입력";
  return "발사";
}

function updateGame(content: ArcadeGameContent, state: GameState, keys: Set<string>, now: number) {
  if (state.finished) return;
  if (!state.started) {
    state.lastFrame = now;
    return;
  }

  const previousFrame = state.lastFrame ?? now;
  const dt = clamp((now - previousFrame) / 1000, 0, 0.04);
  state.lastFrame = now;

  if (content.arcade.variant === "brick-breaker") {
    updateBrickBreaker(content, state, keys, dt);
    return;
  }

  if (content.arcade.variant === "crossing") {
    updateCrossing(content, state, dt);
    return;
  }

  state.elapsed += dt;
  state.spawnTimer -= dt;

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const up = keys.has("ArrowUp") || keys.has("KeyW");
  const down = keys.has("ArrowDown") || keys.has("KeyS");

  if (left) state.playerX -= 280 * dt;
  if (right) state.playerX += 280 * dt;
  if (up && content.arcade.variant !== "runner") state.playerY -= 220 * dt;
  if (down && content.arcade.variant !== "runner") state.playerY += 220 * dt;
  state.playerX = clamp(state.playerX, 34, canvasWidth - 34);
  state.playerY = clamp(state.playerY, 48, canvasHeight - 42);

  if (content.arcade.variant === "runner" || content.arcade.variant === "flight") {
    const lift = keys.has("Space") || keys.has("Enter") || up;
    state.playerVy += (content.arcade.variant === "flight" && lift ? -760 : 680) * dt;
    if (content.arcade.variant === "runner") {
      state.playerVy += 420 * dt;
    }
    state.playerY += state.playerVy * dt;
    const floor = canvasHeight - 72;
    if (state.playerY > floor) {
      state.playerY = floor;
      state.playerVy = 0;
    }
    state.playerY = clamp(state.playerY, 44, floor);
  }

  if (state.spawnTimer <= 0) {
    spawnSprite(content, state);
    state.spawnTimer = shouldUseSideScroller(content) ? 0.82 : 0.56;
  }

  state.bullets = state.bullets
    .map((bullet) => ({ ...bullet, y: bullet.y + bullet.vy * dt }))
    .filter((bullet) => bullet.y > -20);

  state.sprites = state.sprites
    .map((sprite) => ({ ...sprite, x: sprite.x + sprite.vx * dt, y: sprite.y + sprite.vy * dt }))
    .filter((sprite) => {
      if (sprite.y > canvasHeight + 60 || sprite.x < -70) {
        if (sprite.good) state.focus = clamp(state.focus - 4, 0, 100);
        return false;
      }
      return true;
    });

  for (const bullet of state.bullets) {
    const hit = state.sprites.find((sprite) => Math.hypot(sprite.x - bullet.x, sprite.y - bullet.y) < sprite.radius + 8);
    if (!hit) continue;
    state.sprites = state.sprites.filter((sprite) => sprite.id !== hit.id);
    bullet.y = -999;
    const delta = hit.good ? 3 : -3;
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + (hit.good ? 2 : -8), 0, 100);
    addHistory(state, {
      label: hit.label,
      detail: hit.good ? "좋은 타이밍" : "괜히 건드림",
      score: delta,
    });
  }
  state.bullets = state.bullets.filter((bullet) => bullet.y > -50);

  for (const sprite of state.sprites) {
    const hitPlayer = Math.hypot(sprite.x - state.playerX, sprite.y - state.playerY) < sprite.radius + 20;
    if (!hitPlayer) continue;
    state.sprites = state.sprites.filter((item) => item.id !== sprite.id);
    const delta = sprite.good ? 2 : -4;
    state.score = Math.max(0, state.score + delta);
    state.focus = clamp(state.focus + (sprite.good ? 3 : -10), 0, 100);
    addHistory(state, {
      label: sprite.label,
      detail: sprite.good ? "챙김" : "부딪힘",
      score: delta,
    });
  }

  if (state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 4) {
    state.finished = true;
  }
}

function spawnCrossingObstacle(content: ArcadeGameContent, state: GameState) {
  const seed = state.nextSpriteId + content.slug.length * 23;
  const laneIndex = Math.floor(pseudoRandom(seed) * crossingLanes.length);
  const direction = laneIndex % 2 === 0 ? -1 : 1;
  const label = pickLabel(content.arcade.badLabels, state.nextSpriteId);
  state.nextSpriteId += 1;
  state.sprites.push({
    id: state.nextSpriteId,
    x: direction < 0 ? canvasWidth + 54 : -54,
    y: crossingLanes[laneIndex] ?? crossingLanes[0],
    vx: direction * (130 + pseudoRandom(seed + 1) * 105),
    vy: 0,
    radius: 24 + pseudoRandom(seed + 2) * 8,
    label,
    good: false,
  });
}

function updateCrossing(content: ArcadeGameContent, state: GameState, dt: number) {
  state.elapsed += dt;
  state.spawnTimer -= dt;

  if (state.spawnTimer <= 0) {
    spawnCrossingObstacle(content, state);
    state.spawnTimer = 0.38 + pseudoRandom(state.nextSpriteId + 5) * 0.24;
  }

  state.sprites = state.sprites
    .map((sprite) => ({ ...sprite, x: sprite.x + sprite.vx * dt }))
    .filter((sprite) => sprite.x > -90 && sprite.x < canvasWidth + 90);

  for (const sprite of state.sprites) {
    const hitPlayer = Math.abs(sprite.x - state.playerX) < sprite.radius + 18 && Math.abs(sprite.y - state.playerY) < 24;
    if (!hitPlayer) continue;
    state.focus = clamp(state.focus - 16, 0, 100);
    state.score = Math.max(0, state.score - 3);
    state.playerY = crossingStartY;
    addHistory(state, {
      label: sprite.label,
      detail: "멈춰 섬",
      score: -3,
    });
    break;
  }

  if (state.playerY <= crossingLanes[crossingLanes.length - 1] - 26) {
    state.score += 5;
    state.focus = clamp(state.focus + 5, 0, 100);
    state.playerY = crossingStartY;
    addHistory(state, {
      label: "건넘",
      detail: "빈틈을 잡음",
      score: 5,
    });
  }

  if (state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function updateBrickBreaker(content: ArcadeGameContent, state: GameState, keys: Set<string>, dt: number) {
  state.elapsed += dt;

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  if (left) state.playerX -= 340 * dt;
  if (right) state.playerX += 340 * dt;
  state.playerX = clamp(state.playerX, 70, canvasWidth - 70);
  state.playerY = canvasHeight - 52;

  if (!state.brickLaunched) {
    state.brickBallX = state.playerX;
    state.brickBallY = state.playerY - 23;
  } else {
    state.brickBallX += state.brickBallVx * dt;
    state.brickBallY += state.brickBallVy * dt;

    if (state.brickBallX < 16 || state.brickBallX > canvasWidth - 16) {
      state.brickBallX = clamp(state.brickBallX, 16, canvasWidth - 16);
      state.brickBallVx *= -1;
    }
    if (state.brickBallY < 18) {
      state.brickBallY = 18;
      state.brickBallVy = Math.abs(state.brickBallVy);
    }

    const paddleWidth = 112;
    const hitPaddle =
      state.brickBallVy > 0 &&
      state.brickBallY > state.playerY - 20 &&
      state.brickBallY < state.playerY + 10 &&
      Math.abs(state.brickBallX - state.playerX) < paddleWidth / 2;
    if (hitPaddle) {
      const offset = (state.brickBallX - state.playerX) / (paddleWidth / 2);
      state.brickBallY = state.playerY - 22;
      state.brickBallVy = -Math.abs(state.brickBallVy) - 8;
      state.brickBallVx = offset * 310;
    }

    const hitBrick = state.bricks.find(
      (brick) =>
        brick.alive &&
        state.brickBallX > brick.x - 8 &&
        state.brickBallX < brick.x + brick.width + 8 &&
        state.brickBallY > brick.y - 8 &&
        state.brickBallY < brick.y + brick.height + 8,
    );
    if (hitBrick) {
      hitBrick.alive = false;
      state.brickBallVy *= -1;
      state.actions += 1;
      const delta = hitBrick.good ? 3 : 1;
      state.score = Math.max(0, state.score + delta);
      state.focus = clamp(state.focus + (hitBrick.good ? 1 : -5), 0, 100);
      addHistory(state, {
        label: hitBrick.label,
        detail: hitBrick.good ? "제대로 깸" : "괜히 힘 씀",
        score: delta,
      });
    }

    if (state.brickBallY > canvasHeight + 24) {
      state.focus = clamp(state.focus - 12, 0, 100);
      state.brickLaunched = false;
      state.brickBallVx = state.brickBallVx >= 0 ? 180 : -180;
      state.brickBallVy = -260;
      addHistory(state, {
        label: "공 놓침",
        detail: "받침대가 늦음",
        score: -2,
      });
    }
  }

  const aliveCount = state.bricks.filter((brick) => brick.alive).length;
  if (aliveCount === 0 || state.actions >= content.arcade.rounds || state.focus <= 0 || state.elapsed >= content.arcade.rounds * 5) {
    state.finished = true;
  }
}

function drawGame(content: ArcadeGameContent, state: GameState, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = window.devicePixelRatio || 1;
  if (canvas.width !== canvasWidth * scale || canvas.height !== canvasHeight * scale) {
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const { background, primary, accent, danger } = content.arcade.palette;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (content.arcade.variant === "brick-breaker") {
    drawBrickBreaker(content, state, ctx);
    return;
  }

  if (content.arcade.variant === "crossing") {
    drawCrossing(content, state, ctx);
    return;
  }

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 40; x < canvasWidth; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = 52; y < canvasHeight; y += 70) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, canvasHeight - 84, canvasWidth, 2);

  for (const sprite of state.sprites) {
    ctx.beginPath();
    ctx.fillStyle = sprite.good ? accent : danger;
    ctx.arc(sprite.x, sprite.y, sprite.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sprite.label.slice(0, 8), sprite.x, sprite.y + sprite.radius + 15);
  }

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 25, state.playerY - 18, 50, 36, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(content.arcade.playerLabel.slice(0, 8), state.playerX, state.playerY + 4);

  ctx.fillStyle = "#f8fafc";
  for (const bullet of state.bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.62)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 172);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(content.arcade.controls, canvasWidth / 2, 206);
    ctx.fillText("Space 또는 시작 버튼으로 바로 시작", canvasWidth / 2, 232);
  }
}

function drawCrossing(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#182235";
  ctx.fillRect(0, 42, canvasWidth, canvasHeight - 98);
  ctx.fillStyle = "#233047";
  ctx.fillRect(0, 0, canvasWidth, 42);
  ctx.fillRect(0, crossingStartY - 23, canvasWidth, 58);

  for (const y of crossingLanes) {
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.setLineDash([16, 14]);
    ctx.beginPath();
    ctx.moveTo(24, y + 27);
    ctx.lineTo(canvasWidth - 24, y + 27);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = accent;
  ctx.fillRect(0, 42, canvasWidth, 4);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "700 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("도착선", 20, 30);

  for (const sprite of state.sprites) {
    ctx.fillStyle = danger;
    ctx.beginPath();
    ctx.roundRect(sprite.x - sprite.radius, sprite.y - 15, sprite.radius * 2, 30, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.beginPath();
    ctx.arc(sprite.x + (sprite.vx < 0 ? -sprite.radius + 8 : sprite.radius - 8), sprite.y - 8, 3, 0, Math.PI * 2);
    ctx.arc(sprite.x + (sprite.vx < 0 ? -sprite.radius + 8 : sprite.radius - 8), sprite.y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111827";
    ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sprite.label.slice(0, 6), sprite.x, sprite.y + 4);
  }

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 17, state.playerY - 17, 34, 34, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.stroke();
  ctx.fillStyle = "#111827";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(content.arcade.playerLabel.slice(0, 4), state.playerX, state.playerY + 4);

  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`건넌 횟수 ${Math.floor(state.score / 5)}`, 24, canvasHeight - 18);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.68)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 168);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("방향키로 한 칸씩 움직이고, 빈틈이 보이면 위로 건넙니다.", canvasWidth / 2, 204);
    ctx.fillText("멈춰도 됩니다. 이 게임은 급하게 가면 더 자주 막힙니다.", canvasWidth / 2, 230);
  }
}

function drawBrickBreaker(content: ArcadeGameContent, state: GameState, ctx: CanvasRenderingContext2D) {
  const { background, primary, accent, danger } = content.arcade.palette;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let x = 40; x < canvasWidth; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }

  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    ctx.fillStyle = brick.good ? accent : danger;
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(brick.label.slice(0, 8), brick.x + brick.width / 2, brick.y + 18);
  }

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(state.playerX - 56, state.playerY - 8, 112, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(state.brickBallX, state.brickBallY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${state.bricks.filter((brick) => brick.alive).length}개 남음`, 24, canvasHeight - 22);

  if (!state.started) {
    ctx.fillStyle = "rgba(15,23,42,0.68)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(content.title, canvasWidth / 2, 172);
    ctx.font = "500 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("A/D 또는 방향키로 받침대를 움직이고 Space로 공을 보냅니다.", canvasWidth / 2, 208);
    ctx.fillText("벽돌을 다급하게 쫓지 말고, 공이 돌아올 자리를 먼저 잡으세요.", canvasWidth / 2, 234);
  } else if (!state.brickLaunched) {
    ctx.fillStyle = "rgba(15,23,42,0.5)";
    ctx.fillRect(0, canvasHeight - 116, canvasWidth, 42);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Space로 다시 시작", canvasWidth / 2, canvasHeight - 90);
  }
}

function endingFor(content: ArcadeGameContent, score: number) {
  return [...content.endings].sort((a, b) => b.minScore - a.minScore).find((item) => score >= item.minScore) ?? content.endings[content.endings.length - 1];
}

export function ArcadeGameEngine({
  content,
  relatedBlogLinks,
  relatedPlayLinks,
}: {
  content: ArcadeGameContent;
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const stateRef = React.useRef<GameState>(makeInitialState(content));
  const keysRef = React.useRef<Set<string>>(new Set());
  const [view, setView] = React.useState<ViewState>(() => snapshot(stateRef.current));
  const [shareState, setShareState] = React.useState<"idle" | "copied" | "shared">("idle");
  const ending = endingFor(content, view.score);

  const syncView = React.useCallback(() => {
    setView(snapshot(stateRef.current));
  }, []);

  const restart = React.useCallback(() => {
    stateRef.current = makeInitialState(content);
    setShareState("idle");
    syncView();
  }, [content, syncView]);

  const performAction = React.useCallback(
    (action: "left" | "right" | "main" | "down") => {
      const state = stateRef.current;
      if (state.finished) return;
      state.started = true;
      state.lastFrame = performance.now();
      const stepX = content.arcade.variant === "crossing" ? crossingStepX : 52;
      if (action === "left") state.playerX = clamp(state.playerX - stepX, 34, canvasWidth - 34);
      if (action === "right") state.playerX = clamp(state.playerX + stepX, 34, canvasWidth - 34);
      if (content.arcade.variant === "crossing" && action === "down") {
        state.actions += 1;
        state.playerY = clamp(state.playerY + crossingStepY, crossingLanes[crossingLanes.length - 1] - 36, crossingStartY);
      }
      if (action === "main") {
        if (content.arcade.variant === "crossing") {
          state.actions += 1;
          state.playerY = clamp(state.playerY - crossingStepY, crossingLanes[crossingLanes.length - 1] - 36, crossingStartY);
        } else if (content.arcade.variant === "brick-breaker") {
          if (!state.brickLaunched) {
            state.brickLaunched = true;
            state.brickBallVx = state.playerX < canvasWidth / 2 ? 185 : -185;
            state.brickBallVy = -270;
          } else {
            state.brickBallVx = clamp(state.brickBallVx + (state.brickBallX >= state.playerX ? 22 : -22), -340, 340);
            state.brickBallVy = Math.min(state.brickBallVy, -230);
          }
          state.actions += 1;
        } else if (content.arcade.variant === "runner") {
          state.actions += 1;
          state.playerVy = -390;
        } else if (content.arcade.variant === "flight") {
          state.actions += 1;
          state.playerVy -= 250;
        } else {
          state.actions += 1;
          state.bullets.push({ x: state.playerX, y: state.playerY - 26, vy: -420 });
        }
        if (state.actions >= content.arcade.rounds) state.finished = true;
      }
      setShareState("idle");
      syncView();
    },
    [content, syncView],
  );

  React.useEffect(() => {
    const keys = keysRef.current;
    function keyDown(event: KeyboardEvent) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Enter", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code)) {
        event.preventDefault();
        if (content.arcade.variant === "crossing") {
          if (event.repeat) return;
          if (event.code === "ArrowLeft" || event.code === "KeyA") performAction("left");
          if (event.code === "ArrowRight" || event.code === "KeyD") performAction("right");
          if (event.code === "ArrowDown" || event.code === "KeyS") performAction("down");
          if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space" || event.code === "Enter") performAction("main");
          return;
        }
        keys.add(event.code);
        if ((event.code === "Space" || event.code === "Enter") && !event.repeat) performAction("main");
      }
    }
    function keyUp(event: KeyboardEvent) {
      keys.delete(event.code);
    }
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [content, performAction]);

  React.useEffect(() => {
    let frame = 0;
    let lastSync = 0;
    function loop(now: number) {
      updateGame(content, stateRef.current, keysRef.current, now);
      const canvas = canvasRef.current;
      if (canvas) drawGame(content, stateRef.current, canvas);
      if (now - lastSync > 120 || stateRef.current.finished) {
        lastSync = now;
        syncView();
      }
      frame = window.requestAnimationFrame(loop);
    }
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [content, syncView]);

  async function shareResult() {
    const title = `${content.title} - ${ending.title}`;
    const text = `${content.shareText}\n점수: ${view.score}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: window.location.href });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
      setShareState("copied");
    } catch {
      setShareState("idle");
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm" data-play-engine={content.slug}>
      <div className="border-b bg-muted/30 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">바로 한 판</p>
            <h2 className="mt-1 text-xl font-semibold tracking-normal">{content.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-right">
            <Metric label="점수" value={view.score} />
            <Metric label="집중" value={view.focus} />
            <Metric label="조작" value={`${Math.min(view.actions, content.arcade.rounds)} / ${content.arcade.rounds}`} />
          </div>
        </div>
      </div>

      {view.finished ? (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-result>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Result</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-normal">{ending.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{ending.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={shareResult} data-play-share>
                <Share2 className="h-4 w-4" />
                {shareState === "copied" ? "결과 복사됨" : shareState === "shared" ? "공유 완료" : "결과 공유"}
              </Button>
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                다시 하기
              </Button>
            </div>
            <PlayResultLinks relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
          </div>
          <HistoryPanel history={view.history} />
        </div>
      ) : (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_300px]" data-play-turn={`arcade-${view.actions}`}>
          <div>
            <div className="overflow-hidden rounded-lg border bg-background">
              <canvas
                ref={canvasRef}
                tabIndex={0}
                aria-label={`${content.title} canvas`}
                className="block aspect-[12/7] w-full outline-none"
                style={{ background: content.arcade.palette.background }}
              />
            </div>
            <div className="mt-3 rounded-md border bg-muted/20 p-3">
              <p className="text-sm font-semibold">{content.arcade.goal}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{content.arcade.controls}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-12" onClick={() => performAction("left")} data-play-action="arcade-left">
                왼쪽
              </Button>
              <Button className="h-12" onClick={() => performAction("main")} data-play-action="arcade-main">
                {view.started ? mainActionLabel(content) : "시작"}
              </Button>
              <Button variant="outline" className="h-12" onClick={() => performAction("right")} data-play-action="arcade-right">
                오른쪽
              </Button>
            </div>
          </div>
          <HistoryPanel history={view.history} />
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function HistoryPanel({ history }: { history: HistoryItem[] }) {
  return (
    <aside className="rounded-md border bg-muted/20 p-3" data-play-history>
      <p className="text-sm font-semibold">이번 판 흔적</p>
      {history.length ? (
        <ol className="mt-3 space-y-2">
          {history.map((item, index) => (
            <li key={`${item.label}-${index}`} className="rounded-sm border bg-background p-2.5">
              <p className="text-sm font-medium">{item.label}</p>
              <p className={item.score >= 0 ? "mt-1 text-xs text-emerald-600" : "mt-1 text-xs text-red-600"}>
                {item.detail} / {item.score > 0 ? `+${item.score}` : item.score}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">방향키와 Space로 움직이면 방금 지나간 선택이 여기에 남습니다.</p>
      )}
    </aside>
  );
}
