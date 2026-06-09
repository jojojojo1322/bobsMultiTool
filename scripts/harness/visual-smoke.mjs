import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const outputDir = process.env.BOBOB_VISUAL_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(), "bobob-visual-"));
const failures = [];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Visual smoke requires the playwright dev dependency. Run npm install first.");
  process.exit(1);
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

const scenarios = [
  {
    name: "tools-desktop",
    path: "/tools?q=json",
    viewport: { width: 1440, height: 1000 },
    expectedText: ["Tool index", "JSON"],
  },
  {
    name: "ko-tools-mobile",
    path: "/ko/tools?q=uuid",
    viewport: { width: 390, height: 844 },
    expectedText: ["도구", "UUID"],
  },
  {
    name: "ja-regex-desktop",
    path: "/ja/tools/regex-tester",
    viewport: { width: 1366, height: 900 },
    expectedText: ["Regex", "開発者"],
  },
  {
    name: "ar-json-rtl",
    path: "/ar/tools/json-formatter",
    viewport: { width: 1366, height: 900 },
    expectedText: ["JSON"],
    rtl: true,
  },
];

const browser = await launchBrowser();

try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: scenario.viewport,
      extraHTTPHeaders: {
        "Accept-Language": scenario.acceptLanguage || "en-US,en;q=0.9",
      },
    });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${scenario.path}`, { waitUntil: "networkidle", timeout: 20_000 });
    if (!response || response.status() >= 400) {
      failures.push(`${scenario.name} returned ${response?.status() ?? "no response"}`);
      await context.close();
      continue;
    }

    for (const text of scenario.expectedText) {
      if (!(await page.getByText(text, { exact: false }).first().isVisible().catch(() => false))) {
        failures.push(`${scenario.name} missing visible text: ${text}`);
      }
    }

    const layout = await page.evaluate(() => {
      const root = document.documentElement;
      const main = document.querySelector("main");
      const viewportWidth = root.clientWidth;
      const overflow = root.scrollWidth - viewportWidth;
      const tinyText = Array.from(document.querySelectorAll("a, button, input, textarea, [role='button']"))
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0 && rect.width < 24 && rect.height < 24)
        .length;

      return {
        dir: main?.getAttribute("dir") || root.getAttribute("dir") || "ltr",
        overflow,
        bodyTextLength: document.body.innerText.trim().length,
        tinyInteractiveCount: tinyText,
      };
    });

    if (layout.bodyTextLength < 200) failures.push(`${scenario.name} rendered too little visible text`);
    if (layout.overflow > 2) failures.push(`${scenario.name} has horizontal overflow of ${layout.overflow}px`);
    if (layout.tinyInteractiveCount > 0) failures.push(`${scenario.name} has undersized interactive controls`);
    if (scenario.rtl && layout.dir !== "rtl") failures.push(`${scenario.name} expected rtl main direction`);

    const screenshotPath = path.join(outputDir, `${scenario.name}.png`);
    const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });
    if (screenshot.byteLength < 10_000) failures.push(`${scenario.name} screenshot looks unexpectedly small`);
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`Screenshots: ${outputDir}`);
  process.exit(1);
}

console.log(`Visual smoke passed for ${scenarios.length} scenarios. Screenshots: ${outputDir}`);
