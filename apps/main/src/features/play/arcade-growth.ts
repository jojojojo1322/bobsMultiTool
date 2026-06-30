import type { ArcadeGameContent } from "@/features/content/types";
import { clamp, pointInRect, type CanvasPoint, type CanvasRect } from "@/features/play/arcade-engine-utils";

export type GrowthUpgradeKey = "force" | "cooling" | "auto" | "gear";
export type GrowthBuildKey = "output" | "cooling" | "automation";
export type GrowthCanvasAction = "work" | "build" | GrowthUpgradeKey;

export type GrowthHistoryItem = {
  label: string;
  detail: string;
  score: number;
};

export type GrowthWorkshopState = {
  scrap: number;
  totalParts: number;
  heat: number;
  order: number;
  orderProgress: number;
  build: GrowthBuildKey;
  selectedUpgrade: GrowthUpgradeKey;
  forceLevel: number;
  coolingLevel: number;
  beltLevel: number;
  autoLevel: number;
  skillLevel: number;
  gearLevel: number;
  skillCharge: number;
  skillActive: number;
  autoTimer: number;
  resetBonus: number;
  score: number;
  tick: number;
  finished: boolean;
  history: GrowthHistoryItem[];
};

type GrowthUpgradeDefinition = {
  key: GrowthUpgradeKey;
  label: string;
  shortLabel: string;
  ledger: string;
  baseCost: number;
  scale: number;
  unlockOrder: number;
};

const canvasWidth = 720;
const canvasHeight = 520;

const workbenchRect: CanvasRect = { x: 34, y: 126, width: 306, height: 238 };
const deliveryRect: CanvasRect = { x: 34, y: 384, width: 306, height: 102 };
const buildRect: CanvasRect = { x: 374, y: 402, width: 314, height: 76 };
const ledgerX = 374;
const ledgerY = 154;
const ledgerWidth = 314;
const ledgerRowHeight = 56;

const upgradeDefinitions: GrowthUpgradeDefinition[] = [
  { key: "force", label: "제작 힘", shortLabel: "힘", ledger: "제작대 한 번의 부품량 증가", baseCost: 10, scale: 1.55, unlockOrder: 0 },
  { key: "cooling", label: "냉각팬", shortLabel: "냉각", ledger: "과열 전까지 더 오래 제작", baseCost: 14, scale: 1.58, unlockOrder: 0 },
  { key: "auto", label: "자동벨트", shortLabel: "자동", ledger: "손을 떼도 납품 상자 채우기", baseCost: 26, scale: 1.72, unlockOrder: 1 },
  { key: "gear", label: "장비지그", shortLabel: "장비", ledger: "납품 목표량을 조금 낮추기", baseCost: 54, scale: 1.86, unlockOrder: 2 },
];

const buildDefinitions: Record<
  GrowthBuildKey,
  {
    label: string;
    detail: string;
    output: number;
    cooling: number;
    auto: number;
    forceCost: number;
    coolingCost: number;
    autoCost: number;
  }
> = {
  output: {
    label: "출력 위주",
    detail: "부품은 많이 나오고 열도 빨리 오릅니다.",
    output: 1.18,
    cooling: 0.86,
    auto: 0.94,
    forceCost: 0.88,
    coolingCost: 1.08,
    autoCost: 1,
  },
  cooling: {
    label: "안정 위주",
    detail: "조금 천천히 만들고 과열을 늦춥니다.",
    output: 0.94,
    cooling: 1.25,
    auto: 0.96,
    forceCost: 1.04,
    coolingCost: 0.86,
    autoCost: 1,
  },
  automation: {
    label: "자동 위주",
    detail: "초반은 느려도 납품 상자가 계속 찹니다.",
    output: 0.96,
    cooling: 1,
    auto: 1.28,
    forceCost: 1.05,
    coolingCost: 1,
    autoCost: 0.86,
  },
};

const upgradeKeyToLevelField = {
  force: "forceLevel",
  cooling: "coolingLevel",
  auto: "autoLevel",
  gear: "gearLevel",
} as const satisfies Record<GrowthUpgradeKey, keyof GrowthWorkshopState>;

export function makeGrowthWorkshop(): GrowthWorkshopState {
  return {
    scrap: 8,
    totalParts: 0,
    heat: 0,
    order: 0,
    orderProgress: 0,
    build: "output",
    selectedUpgrade: "force",
    forceLevel: 0,
    coolingLevel: 0,
    beltLevel: 0,
    autoLevel: 0,
    skillLevel: 0,
    gearLevel: 0,
    skillCharge: 0,
    skillActive: 0,
    autoTimer: 0,
    resetBonus: 0,
    score: 0,
    tick: 0,
    finished: false,
    history: [],
  };
}

export function growthUpgradeKeys() {
  return upgradeDefinitions.map((item) => item.key);
}

export function growthBuildLabel(state: GrowthWorkshopState) {
  return buildDefinitions[state.build].label;
}

export function growthCurrentOrderTarget(state: GrowthWorkshopState) {
  return Math.max(28, Math.round(34 + state.order * 22 + Math.pow(state.order + 1, 1.38) * 7 - state.gearLevel * 5));
}

export function growthHeatCap(state: GrowthWorkshopState) {
  return Math.round((40 + state.coolingLevel * 10 + state.gearLevel * 4) * buildDefinitions[state.build].cooling);
}

export function growthOutput(state: GrowthWorkshopState) {
  const skillMultiplier = state.skillActive > 0 ? 2.15 + state.skillLevel * 0.18 : 1;
  const resetMultiplier = 1 + state.resetBonus * 0.08;
  return Math.round((6 + state.forceLevel * 3.2 + state.gearLevel * 4.4) * buildDefinitions[state.build].output * skillMultiplier * resetMultiplier);
}

export function growthAutoIncome(state: GrowthWorkshopState) {
  return (state.autoLevel * (1.9 + state.beltLevel * 0.72 + state.gearLevel * 0.26) * buildDefinitions[state.build].auto * (1 + state.resetBonus * 0.04));
}

export function growthBottleneckLabel(state: GrowthWorkshopState) {
  const heatRatio = state.heat / growthHeatCap(state);
  const nextUpgrade = recommendedGrowthUpgrade(state);
  if (heatRatio >= 0.82) return "열 식히기";
  if (nextUpgrade && state.scrap < growthUpgradeCost(state, nextUpgrade)) return "부품 모으기";
  if (state.order >= 1 && state.autoLevel === 0) return "자동 설비";
  if (state.order >= 2 && state.gearLevel === 0) return "장비 설비";
  return "부품 제작";
}

export function growthScore(state: GrowthWorkshopState) {
  return Math.round(state.totalParts * 0.42 + state.order * 22 + state.forceLevel * 4 + state.coolingLevel * 4 + state.autoLevel * 6 + state.gearLevel * 8);
}

function growthUpgradeDefinition(key: GrowthUpgradeKey) {
  return upgradeDefinitions.find((item) => item.key === key) ?? upgradeDefinitions[0];
}

function growthUpgradeLevel(state: GrowthWorkshopState, key: GrowthUpgradeKey) {
  return Number(state[upgradeKeyToLevelField[key]]) || 0;
}

function setGrowthUpgradeLevel(state: GrowthWorkshopState, key: GrowthUpgradeKey, value: number) {
  if (key === "force") state.forceLevel = value;
  if (key === "cooling") state.coolingLevel = value;
  if (key === "auto") state.autoLevel = value;
  if (key === "gear") state.gearLevel = value;
}

function growthCostModifier(state: GrowthWorkshopState, key: GrowthUpgradeKey) {
  const build = buildDefinitions[state.build];
  if (key === "force") return build.forceCost;
  if (key === "cooling") return build.coolingCost;
  if (key === "auto") return build.autoCost;
  return 1;
}

export function isGrowthUpgradeUnlocked(state: GrowthWorkshopState, key: GrowthUpgradeKey) {
  return state.order >= growthUpgradeDefinition(key).unlockOrder;
}

export function growthUpgradeCost(state: GrowthWorkshopState, key: GrowthUpgradeKey) {
  const definition = growthUpgradeDefinition(key);
  const level = growthUpgradeLevel(state, key);
  return Math.ceil(definition.baseCost * Math.pow(definition.scale, level) * growthCostModifier(state, key));
}

function addGrowthHistory(state: GrowthWorkshopState, item: GrowthHistoryItem) {
  state.history = [item, ...state.history].slice(0, 8);
}

function coolGrowthBench(state: GrowthWorkshopState) {
  const before = state.heat;
  state.heat = Math.max(0, state.heat - (13 + state.coolingLevel * 4));
  state.tick += 1;
  addGrowthHistory(state, {
    label: "냉각",
    detail: `열 ${Math.round(before)} -> ${Math.round(state.heat)}`,
    score: 0,
  });
}

function completeGrowthOrders(state: GrowthWorkshopState) {
  while (state.orderProgress >= growthCurrentOrderTarget(state)) {
    const target = growthCurrentOrderTarget(state);
    state.orderProgress -= target;
    state.order += 1;
    const reward = 18 + state.order * 7 + state.gearLevel * 5;
    state.scrap += reward;
    state.resetBonus = Math.max(state.resetBonus, Math.floor(state.order / 2));
    addGrowthHistory(state, {
      label: `납품 ${state.order}건`,
      detail: `상자 출고 · 보너스 부품 +${reward}`,
      score: reward,
    });
  }
}

function growthHeatGain(state: GrowthWorkshopState) {
  return Math.max(4, 9 + state.forceLevel * 0.8 + state.gearLevel * 1.2 - state.coolingLevel * 1.2);
}

function activateGrowthSkill(state: GrowthWorkshopState) {
  if (state.skillLevel <= 0 || state.skillCharge < 100 || state.skillActive > 0) return false;
  state.skillCharge = 0;
  state.skillActive = 6 + state.skillLevel * 1.4;
  state.heat = Math.min(growthHeatCap(state), state.heat + 8);
  addGrowthHistory(state, {
    label: "과부하",
    detail: "출력은 뛰고 열도 같이 오름",
    score: 8,
  });
  return true;
}

function workGrowthBench(state: GrowthWorkshopState) {
  if (state.heat >= growthHeatCap(state) * 0.96) {
    coolGrowthBench(state);
    return;
  }

  if (state.skillLevel > 0 && state.skillCharge >= 100 && state.heat / growthHeatCap(state) < 0.72) {
    activateGrowthSkill(state);
  }

  const output = growthOutput(state);
  state.scrap += output;
  state.totalParts += output;
  state.orderProgress += output;
  state.heat = clamp(state.heat + growthHeatGain(state), 0, growthHeatCap(state));
  state.skillCharge = Math.min(100, state.skillCharge + 9);
  state.tick += 1;
  state.score = growthScore(state);
  addGrowthHistory(state, {
    label: "부품 제작",
    detail: `부품 +${output} · 납품 상자 채움`,
    score: output,
  });
  completeGrowthOrders(state);
}

function recommendedGrowthUpgrade(state: GrowthWorkshopState): GrowthUpgradeKey | null {
  if (state.heat / growthHeatCap(state) > 0.68 && isGrowthUpgradeUnlocked(state, "cooling")) return "cooling";
  if (state.order >= 1 && state.autoLevel === 0 && isGrowthUpgradeUnlocked(state, "auto")) return "auto";
  if (state.forceLevel <= state.coolingLevel + 1) return "force";
  if (state.order >= 2 && isGrowthUpgradeUnlocked(state, "gear")) return "gear";
  return isGrowthUpgradeUnlocked(state, "cooling") ? "cooling" : "force";
}

export function buyGrowthUpgrade(_content: ArcadeGameContent, state: GrowthWorkshopState, key: GrowthUpgradeKey) {
  state.selectedUpgrade = key;
  const definition = growthUpgradeDefinition(key);
  if (!isGrowthUpgradeUnlocked(state, key)) {
    addGrowthHistory(state, {
      label: "아직 잠김",
      detail: `납품 ${definition.unlockOrder}건 이후 ${definition.shortLabel}`,
      score: 0,
    });
    state.tick += 1;
    return false;
  }

  const cost = growthUpgradeCost(state, key);
  if (state.scrap < cost) {
    addGrowthHistory(state, {
      label: `${definition.shortLabel} 대기`,
      detail: `부품 ${Math.max(0, cost - state.scrap)} 더 필요`,
      score: 0,
    });
    state.tick += 1;
    return false;
  }

  state.scrap -= cost;
  const nextLevel = growthUpgradeLevel(state, key) + 1;
  setGrowthUpgradeLevel(state, key, nextLevel);
  if (key === "cooling") state.heat = Math.max(0, state.heat - 10);
  state.tick += 1;
  state.score = growthScore(state);
  addGrowthHistory(state, {
    label: `${definition.shortLabel} Lv.${nextLevel}`,
    detail: `비용 ${cost} · ${definition.ledger}`,
    score: Math.max(1, Math.round(cost / 5)),
  });
  return true;
}

export function cycleGrowthBuild(state: GrowthWorkshopState) {
  state.build = state.build === "output" ? "cooling" : state.build === "cooling" ? "automation" : "output";
  state.tick += 1;
  addGrowthHistory(state, {
    label: buildDefinitions[state.build].label,
    detail: buildDefinitions[state.build].detail,
    score: 0,
  });
}

export function resetGrowthRun(state: GrowthWorkshopState) {
  const bonus = Math.max(1, Math.floor(state.order / 2) + Math.floor(growthScore(state) / 80));
  const build = state.build;
  state.scrap = 10 + bonus * 4;
  state.totalParts = 0;
  state.heat = 0;
  state.order = 0;
  state.orderProgress = 0;
  state.forceLevel = 0;
  state.coolingLevel = 0;
  state.beltLevel = 0;
  state.autoLevel = 0;
  state.skillLevel = 0;
  state.gearLevel = 0;
  state.skillCharge = 0;
  state.skillActive = 0;
  state.autoTimer = 0;
  state.resetBonus = bonus;
  state.score = 0;
  state.tick += 1;
  state.finished = false;
  state.build = build;
  addGrowthHistory(state, {
    label: `리셋 보너스 +${bonus}`,
    detail: "이번 판 감각만 남기고 장부를 새로 폄",
    score: bonus,
  });
}

export function performGrowthMainAction(content: ArcadeGameContent, state: GrowthWorkshopState) {
  void content;
  workGrowthBench(state);
}

export function updateGrowthWorkshop(_content: ArcadeGameContent, state: GrowthWorkshopState, dt: number) {
  if (state.finished) return;
  state.autoTimer += dt;
  state.skillActive = Math.max(0, state.skillActive - dt);
  state.heat = Math.max(0, state.heat - (3.8 + state.coolingLevel * 1.4) * buildDefinitions[state.build].cooling * dt);

  const autoIncome = growthAutoIncome(state);
  if (autoIncome > 0 && state.autoTimer >= 0.75) {
    const cycles = Math.floor(state.autoTimer / 0.75);
    state.autoTimer -= cycles * 0.75;
    const gained = Math.max(1, Math.round(autoIncome * cycles));
    state.scrap += gained;
    state.totalParts += gained;
    state.orderProgress += gained * 0.72;
    state.skillCharge = Math.min(100, state.skillCharge + cycles * 2);
    state.tick += cycles;
    state.score = growthScore(state);
    completeGrowthOrders(state);
  }
}

export function growthActionAt(point: CanvasPoint): GrowthCanvasAction {
  if (pointInRect(point, buildRect)) return "build";
  if (pointInRect(point, workbenchRect)) return "work";
  for (let index = 0; index < upgradeDefinitions.length; index += 1) {
    const rect = growthUpgradeRowRect(index);
    if (pointInRect(point, rect)) return upgradeDefinitions[index].key;
  }
  return "work";
}

function growthUpgradeRowRect(index: number): CanvasRect {
  return {
    x: ledgerX,
    y: ledgerY + index * ledgerRowHeight,
    width: ledgerWidth,
    height: ledgerRowHeight - 8,
  };
}

function drawGauge(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, ratio: number, fill: string, label: string) {
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(x, y, width, 12, 6);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, clamp(width * ratio, 0, width), 12, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y - 6);
}

export function drawGrowthWorkshop(content: ArcadeGameContent, state: GrowthWorkshopState, ctx: CanvasRenderingContext2D, started: boolean) {
  const { background, primary, accent, danger } = content.arcade.palette;
  const heatCap = growthHeatCap(state);
  const heatRatio = state.heat / heatCap;
  const deliveryTarget = growthCurrentOrderTarget(state);
  const deliveryRatio = clamp(state.orderProgress / deliveryTarget, 0, 1);
  const build = buildDefinitions[state.build];
  const output = growthOutput(state);
  const autoIncome = growthAutoIncome(state);
  const bottleneck = growthBottleneckLabel(state);
  const bottleneckShort =
    bottleneck === "열 식히기" ? "냉각" : bottleneck === "부품 모으기" ? "부품" : bottleneck.replace(" 설비", "");
  const animationTime = typeof performance !== "undefined" ? performance.now() / 1000 : state.tick;
  const pistonOffset = Math.sin(animationTime * 5 + state.tick * 0.7) * 5;
  const beltPhase = (animationTime * (28 + state.autoLevel * 4) + state.tick * 11 + state.orderProgress * 0.18) % 86;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const grit = ctx.createRadialGradient(244, 240, 30, 260, 260, 500);
  grit.addColorStop(0, "rgba(250,204,21,0.11)");
  grit.addColorStop(0.58, "rgba(45,212,191,0.05)");
  grit.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = grit;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  for (let x = 22; x < canvasWidth; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 54);
    ctx.lineTo(x - 12, canvasHeight);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.roundRect(24, 24, canvasWidth - 48, 74, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.stroke();
  ctx.fillStyle = "rgba(248,250,252,0.82)";
  ctx.font = "900 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("부품 공방 성장판", 44, 54);
  ctx.fillStyle = primary;
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("제작대 -> 부품 -> 설비 -> 납품 상자", 44, 78, 260);

  const statusItems = [
    { label: "출고", value: `${state.order}건` },
    { label: "부품", value: `${Math.round(state.scrap)}` },
    { label: "과열", value: `${Math.round(state.heat)}/${heatCap}` },
    { label: "병목", value: bottleneckShort },
  ];
  statusItems.forEach((item, index) => {
    const x = 318 + index * 90;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.roundRect(x, 38, 78, 42, 12);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.56)";
    ctx.font = "750 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(item.label, x + 12, 55);
    ctx.fillStyle = item.label === "과열" && heatRatio > 0.82 ? danger : "#f8fafc";
    ctx.font = item.label === "병목" ? "900 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif" : "900 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillText(item.value, x + 12, 73, 58);
  });

  ctx.fillStyle = "rgba(0,0,0,0.26)";
  ctx.beginPath();
  ctx.roundRect(workbenchRect.x + 8, workbenchRect.y + 10, workbenchRect.width, workbenchRect.height, 22);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.065)";
  ctx.beginPath();
  ctx.roundRect(workbenchRect.x, workbenchRect.y, workbenchRect.width, workbenchRect.height, 22);
  ctx.fill();
  ctx.strokeStyle = heatRatio > 0.82 ? danger : "rgba(255,255,255,0.18)";
  ctx.lineWidth = heatRatio > 0.82 ? 3 : 1;
  ctx.stroke();
  ctx.lineWidth = 1;

  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("제작대", workbenchRect.x + 22, workbenchRect.y + 28);
  ctx.fillStyle = heatRatio > 0.82 ? danger : "rgba(255,255,255,0.58)";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`병목: ${bottleneck}`, workbenchRect.x + 178, workbenchRect.y + 28, 130);

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.roundRect(66, 168, 242, 116, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(94, 254 + pistonOffset, 74, 18, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(126, 194, 10, 60 + pistonOffset);
  ctx.fillStyle = heatRatio > 0.82 ? danger : accent;
  ctx.beginPath();
  ctx.arc(232, 262, 15 + Math.sin(animationTime * 4) * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(15,23,42,0.82)";
  ctx.beginPath();
  ctx.roundRect(206, 276, 56, 16, 6);
  ctx.fill();

  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.roundRect(86, 192, 202, 48, 14);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.font = "950 19px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("부품 만들기", 187, 223);

  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.font = "850 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("한 번 제작", 76, 310);
  ctx.fillStyle = accent;
  ctx.font = "950 29px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText(`+${output}`, 76, 342);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`자동 +${autoIncome.toFixed(1)}/s`, 176, 326);
  ctx.fillText(`상자 +${Math.round(state.orderProgress)}/${deliveryTarget}`, 176, 346);

  drawGauge(ctx, 66, 118, 242, deliveryRatio, primary, "납품 상자");
  drawGauge(ctx, 66, 360, 242, heatRatio, heatRatio > 0.78 ? danger : accent, "과열");

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.roundRect(deliveryRect.x, deliveryRect.y, deliveryRect.width, deliveryRect.height, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("납품 라인", deliveryRect.x + 18, deliveryRect.y + 26);
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`출고 ${state.order}건 · 상자 ${Math.round(state.orderProgress)}/${deliveryTarget}`, deliveryRect.x + 108, deliveryRect.y + 26, 176);

  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.roundRect(deliveryRect.x + 20, deliveryRect.y + 43, 266, 24, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();
  for (let index = 0; index < 12; index += 1) {
    const railX = deliveryRect.x + 28 + index * 22;
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.beginPath();
    ctx.moveTo(railX, deliveryRect.y + 47);
    ctx.lineTo(railX - 9, deliveryRect.y + 63);
    ctx.stroke();
  }
  for (let index = 0; index < 3; index += 1) {
    const boxX = deliveryRect.x + 28 + ((index * 86 + beltPhase) % 246);
    const boxY = deliveryRect.y + 38 + Math.sin(animationTime * 4 + index) * 2;
    ctx.fillStyle = index === 2 ? primary : accent;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, 28, 24, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(15,23,42,0.48)";
    ctx.stroke();
    ctx.fillStyle = "rgba(15,23,42,0.55)";
    ctx.fillRect(boxX + 12, boxY + 2, 4, 20);
  }
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.roundRect(deliveryRect.x + 244, deliveryRect.y + 32, 42, 44, 8);
  ctx.fill();
  ctx.strokeStyle = primary;
  ctx.stroke();
  ctx.fillStyle = primary;
  ctx.font = "900 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("납품", deliveryRect.x + 265, deliveryRect.y + 58);
  ctx.textAlign = "left";
  drawGauge(ctx, deliveryRect.x + 20, deliveryRect.y + 88, 266, deliveryRatio, primary, "다음 출고");

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.roundRect(ledgerX - 14, 112, ledgerWidth + 28, 276, 22);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.stroke();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("설비 장부", ledgerX, 132);
  ctx.fillStyle = "rgba(255,255,255,0.56)";
  ctx.font = "800 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("부품으로 한 줄씩 올립니다", ledgerX, 150, 210);

  for (let index = 0; index < upgradeDefinitions.length; index += 1) {
    const definition = upgradeDefinitions[index];
    const rect = growthUpgradeRowRect(index);
    const level = growthUpgradeLevel(state, definition.key);
    const unlocked = isGrowthUpgradeUnlocked(state, definition.key);
    const cost = growthUpgradeCost(state, definition.key);
    const affordable = unlocked && state.scrap >= cost;
    const selected = state.selectedUpgrade === definition.key;

    ctx.fillStyle = selected ? "rgba(250,204,21,0.18)" : affordable ? "rgba(45,212,191,0.13)" : "rgba(255,255,255,0.045)";
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 12);
    ctx.fill();
    ctx.strokeStyle = selected ? primary : affordable ? "rgba(45,212,191,0.44)" : "rgba(255,255,255,0.12)";
    ctx.stroke();

    ctx.fillStyle = affordable ? accent : unlocked ? "rgba(255,255,255,0.54)" : "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 12, rect.y + 12, 26, 26, 8);
    ctx.fill();
    ctx.fillStyle = unlocked ? "#0f172a" : "rgba(15,23,42,0.55)";
    ctx.font = "950 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${index + 1}`, rect.x + 25, rect.y + 30);
    ctx.textAlign = "left";

    ctx.fillStyle = unlocked ? "#f8fafc" : "rgba(248,250,252,0.42)";
    ctx.font = "900 14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`${definition.label} Lv.${level}`, rect.x + 50, rect.y + 21, 132);
    ctx.fillStyle = affordable ? accent : unlocked ? "rgba(255,255,255,0.66)" : danger;
    ctx.font = "850 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(unlocked ? `${cost}부품` : `납품 ${definition.unlockOrder}건`, rect.x + rect.width - 14, rect.y + 22, 86);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(definition.ledger, rect.x + 50, rect.y + 40, 214);
  }

  ctx.fillStyle = "rgba(255,255,255,0.055)";
  ctx.beginPath();
  ctx.roundRect(buildRect.x, buildRect.y, buildRect.width, buildRect.height, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.stroke();
  ctx.fillStyle = primary;
  ctx.font = "900 13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("작업 방향", buildRect.x + 16, buildRect.y + 24);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "900 15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(build.label, buildRect.x + 134, buildRect.y + 24, 120);
  ctx.fillStyle = "rgba(255,255,255,0.48)";
  ctx.font = "800 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("누르면 전환", buildRect.x + buildRect.width - 16, buildRect.y + 24);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.56)";
  ctx.font = "700 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(build.detail, buildRect.x + 16, buildRect.y + 48, buildRect.width - 32);
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.fillRect(buildRect.x + 16, buildRect.y + 60, buildRect.width - 32, 1);

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "750 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("마우스/터치: 제작대, 설비 장부, 작업 방향만 화면 안에서 조작", 36, canvasHeight - 18);

  if (!started) {
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(84, 190, 206, 52, 16);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = "#f8fafc";
    ctx.font = "900 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("먼저 제작대 누르기", 187, 254);
  }
}
