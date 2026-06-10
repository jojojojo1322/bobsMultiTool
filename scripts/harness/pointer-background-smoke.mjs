const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const failures = [];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Pointer background smoke requires the playwright dev dependency. Run npm install first.");
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

async function readPointerState(page) {
  return page.evaluate(() => {
    const layer = document.querySelector(".bobob-pointer-background");
    const host = layer?.parentElement;
    if (!layer || !host) return null;

    const hostStyle = getComputedStyle(host);
    const layerStyle = getComputedStyle(layer);
    return {
      pointerX: hostStyle.getPropertyValue("--bobob-pointer-x").trim(),
      pointerY: hostStyle.getPropertyValue("--bobob-pointer-y").trim(),
      gridX: hostStyle.getPropertyValue("--bobob-grid-x").trim(),
      gridY: hostStyle.getPropertyValue("--bobob-grid-y").trim(),
      transform: layerStyle.transform,
    };
  });
}

const scenarios = [
  { name: "tool-directory", path: "/tools", first: [220, 180], second: [980, 260] },
  { name: "tool-detail", path: "/tools/json-formatter", first: [260, 220], second: [980, 520] },
];

const browser = await launchBrowser();

try {
  for (const scenario of scenarios) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
    const response = await page.goto(`${baseUrl}${scenario.path}`, { waitUntil: "networkidle", timeout: 20_000 });
    if (!response || response.status() >= 400) {
      failures.push(`${scenario.name} returned ${response?.status() ?? "no response"}`);
      await page.close();
      continue;
    }

    await page.mouse.move(...scenario.first);
    await page.waitForTimeout(80);
    const firstState = await readPointerState(page);
    await page.mouse.move(...scenario.second);
    await page.waitForTimeout(80);
    const secondState = await readPointerState(page);

    if (!firstState || !secondState) {
      failures.push(`${scenario.name} missing pointer background layer`);
      await page.close();
      continue;
    }

    if (!firstState.pointerX || !secondState.pointerX || !firstState.gridX || !secondState.gridX) {
      failures.push(`${scenario.name} pointer CSS variables were not populated`);
    }

    if (firstState.pointerX === secondState.pointerX && firstState.pointerY === secondState.pointerY) {
      failures.push(`${scenario.name} pointer coordinates did not change after mouse movement`);
    }

    if (firstState.gridX === secondState.gridX && firstState.gridY === secondState.gridY) {
      failures.push(`${scenario.name} grid offsets did not change after mouse movement`);
    }

    if (secondState.transform === "none") {
      failures.push(`${scenario.name} pointer layer did not compute a transform`);
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Pointer background smoke passed for ${scenarios.length} scenarios at ${baseUrl}.`);
