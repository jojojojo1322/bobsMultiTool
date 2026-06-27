import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = (process.env.BOBOB_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const playDir = path.join(root, "content/play");
const requiredPlaySlugs = ["office-survival", "prompt-cleanup", "meeting-escape", "priority-sorter", "bug-clicker"];
const failures = [];
const actionCountPattern =
  /조작\s*횟수|행동\s*횟수|발사\s*횟수|횟수\s*제한|조작\s*제한|남은\s*조작|남은\s*횟수|\d+\s*턴\s*짜리|제한\s*없는\s*루프|action[-\s]*count|move[-\s]*count|action\s*limit|move\s*limit|actions?\s+left|moves?\s+left/i;
const playCountTonePattern =
  /몇\s*번\s*(?:흔들|헛발|멈칫|스쳤|꼬임|건드렸)|남은\s*후보|건넌\s*기록|방금\s*지나간\s*선택|오늘의\s*선택\s*로그|판단\s*로그|분류\s*로그/i;
const lotteryRenderedLimitScorePattern = /점수판|점수표|스코어|남은\s*시간|타이머|누적\s*당첨|조작\s*횟수|횟수\s*제한|조작\s*제한/i;

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Play interaction smoke requires the playwright dev dependency. Run npm install first.");
  process.exit(1);
}

function readPlayContents() {
  return fs
    .readdirSync(playDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(playDir, file), "utf8")))
    .sort((left, right) => (left.order ?? 99) - (right.order ?? 99) || left.slug.localeCompare(right.slug));
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    try {
      return await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chrome", headless: true });
    } catch {
      throw error;
    }
  }
}

async function gotoWithRetry(page, url) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function playLength(content) {
  if (content.type === "micro-sim") return content.turns.length;
  if (content.type === "tap-game") return content.targets.length;
  if (content.type === "arcade-game") return 12;
  return content.items.length;
}

async function clickNextAction(page, content) {
  if (content.type === "micro-sim") {
    const choice = page.locator('[data-play-action="choice"]').first();
    await choice.scrollIntoViewIfNeeded().catch(() => undefined);
    await choice.click();
    return;
  }
  if (content.type === "tap-game") {
    await page.locator('[data-play-action="tap"]').click();
    return;
  }
  if (content.type === "arcade-game") {
    await page.locator('[data-play-action="arcade-main"]').click();
    return;
  }
  await page.locator('[data-play-action="category"]').first().click();
}

function isIgnoredRuntimeError(message) {
  return message.includes("https://www.google.com/") && message.includes("report-only Content Security Policy directive");
}

async function playState(page) {
  return page.evaluate(() => ({
    result: Boolean(document.querySelector("[data-play-result]")),
    state: document.querySelector("[data-play-state]")?.getAttribute("data-play-state") ?? null,
    controlCount: document.querySelectorAll("[data-play-action]").length,
    oldTurnHookCount: document.querySelectorAll("[data-play-turn]").length,
  }));
}

async function verifyPlay(browser, content, viewport) {
  const context = await browser.newContext({
    viewport,
    permissions: ["clipboard-write"],
    locale: "ko-KR",
    extraHTTPHeaders: { "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8" },
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => {
    if (!isIgnoredRuntimeError(error.message)) runtimeErrors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error" && !isIgnoredRuntimeError(message.text())) runtimeErrors.push(message.text());
  });

  try {
    const route = `/play/${content.slug}`;
    const response = await gotoWithRetry(page, `${baseUrl}${route}`).catch((error) => {
      failures.push(`${content.slug} ${viewport.width}x${viewport.height} navigation failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    });
    if (!response || response.status() !== 200) {
      failures.push(`${content.slug} ${viewport.width}x${viewport.height} returned ${response?.status() ?? "no response"}`);
      return;
    }

    await page.waitForSelector(`[data-play-engine="${content.slug}"]`, { timeout: 20_000 });
    if (!(await page.locator("main h1").filter({ hasText: content.title }).first().isVisible().catch(() => false))) {
      failures.push(`${content.slug} ${viewport.width}x${viewport.height} missing visible h1 title`);
    }
    if (!(await page.locator("[data-play-history]").first().isVisible().catch(() => false))) {
      failures.push(`${content.slug} ${viewport.width}x${viewport.height} missing play history panel`);
    }
    const initialText = await page.locator("body").innerText().catch(() => "");
    if (actionCountPattern.test(initialText) || playCountTonePattern.test(initialText)) {
      failures.push(`${content.slug} ${viewport.width}x${viewport.height} exposes action-count, move-limit, or count-toned wording`);
    }
    if (content.slug === "lucky-scratch") {
      const engineText = await page.locator(`[data-play-engine="${content.slug}"]`).innerText().catch(() => "");
      if (lotteryRenderedLimitScorePattern.test(engineText)) {
        failures.push(`${content.slug} ${viewport.width}x${viewport.height} should render as endless lottery play without scoreboards, timers, or move limits`);
      }
      for (const requiredText of ["현재 단계", "다음 단계", "끝 없음"]) {
        if (!engineText.includes(requiredText)) {
          failures.push(`${content.slug} ${viewport.width}x${viewport.height} should show staged endless lottery flow: ${requiredText}`);
        }
      }
    }
    if (content.arcade?.variant === "sum-box") {
      const engineText = await page.locator(`[data-play-engine="${content.slug}"]`).innerText().catch(() => "");
      if (/타이머/.test(engineText)) {
        failures.push(`${content.slug} ${viewport.width}x${viewport.height} should describe sum-box as 1분 동안 instead of timer wording`);
      }
    }

    const steps = playLength(content);
    for (let index = 0; index < steps + 2; index += 1) {
      const beforeState = await playState(page);
      if (beforeState.result) break;
      if (!beforeState.controlCount) break;
      if (beforeState.oldTurnHookCount) failures.push(`${content.slug} ${viewport.width}x${viewport.height} still exposes old data-play-turn hook`);
      await clickNextAction(page, content);
      await page
        .waitForFunction(
          (previousState) => {
            const result = Boolean(document.querySelector("[data-play-result]"));
            const currentState = document.querySelector("[data-play-state]")?.getAttribute("data-play-state") ?? null;
            return result || currentState !== previousState;
          },
          beforeState.state,
          { timeout: 1_500 },
        )
        .catch(() => undefined);
    }

    if (!(await page.locator("[data-play-result]").first().isVisible().catch(() => false))) {
      failures.push(`${content.slug} ${viewport.width}x${viewport.height} did not reach result after ${steps} probes`);
      return;
    }

    for (const selector of ["[data-play-share]", "[data-play-result-links]", "[data-play-related-play]", "[data-play-related-blog]"]) {
      if (!(await page.locator(selector).first().isVisible().catch(() => false))) {
        failures.push(`${content.slug} ${viewport.width}x${viewport.height} missing result selector ${selector}`);
      }
    }

    await page.locator("[data-play-share]").first().click();
    await page.waitForTimeout(100);

    const layout = await page.evaluate(() => {
      const root = document.documentElement;
      const interactiveRects = Array.from(document.querySelectorAll("button, a, [role='button']"))
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0);
      return {
        overflow: root.scrollWidth - root.clientWidth,
        tinyInteractiveCount: interactiveRects.filter((rect) => rect.width < 24 && rect.height < 24).length,
        textLength: document.body.innerText.trim().length,
      };
    });

    if (layout.overflow > 2) failures.push(`${content.slug} ${viewport.width}x${viewport.height} has horizontal overflow ${layout.overflow}px`);
    if (layout.tinyInteractiveCount > 0) failures.push(`${content.slug} ${viewport.width}x${viewport.height} has undersized interactive controls`);
    if (layout.textLength < 700) failures.push(`${content.slug} ${viewport.width}x${viewport.height} rendered too little text after completion`);
    if (runtimeErrors.length) failures.push(`${content.slug} ${viewport.width}x${viewport.height} console/page errors: ${runtimeErrors.join(" | ")}`);
  } finally {
    await context.close();
  }
}

const playContents = readPlayContents();
const playBySlug = new Map(playContents.map((content) => [content.slug, content]));
for (const slug of requiredPlaySlugs) {
  if (!playBySlug.has(slug)) failures.push(`missing required Play content: ${slug}`);
}

const viewports = [
  { width: 390, height: 844 },
  { width: 1366, height: 900 },
];

const browser = await launchBrowser();
try {
  for (const content of playContents) {
    for (const viewport of viewports) {
      await verifyPlay(browser, content, viewport);
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Play interaction smoke passed for ${playContents.length} Play entries across ${viewports.length} viewports at ${baseUrl}.`);
