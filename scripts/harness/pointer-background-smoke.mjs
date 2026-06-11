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
    const canvas = host.querySelector(".bobob-reactbits-canvas");
    const canvasRect = canvas?.getBoundingClientRect();
    return {
      pointerX: hostStyle.getPropertyValue("--bobob-pointer-x").trim(),
      pointerY: hostStyle.getPropertyValue("--bobob-pointer-y").trim(),
      gridX: hostStyle.getPropertyValue("--bobob-grid-x").trim(),
      gridY: hostStyle.getPropertyValue("--bobob-grid-y").trim(),
      horizonX: hostStyle.getPropertyValue("--bobob-horizon-x").trim(),
      horizonY: hostStyle.getPropertyValue("--bobob-horizon-y").trim(),
      depthX: hostStyle.getPropertyValue("--bobob-depth-x").trim(),
      depthY: hostStyle.getPropertyValue("--bobob-depth-y").trim(),
      flowX: hostStyle.getPropertyValue("--bobob-flow-x").trim(),
      flowY: hostStyle.getPropertyValue("--bobob-flow-y").trim(),
      sweepX: hostStyle.getPropertyValue("--bobob-sweep-x").trim(),
      backgroundOpacity: hostStyle.getPropertyValue("--bobob-background-opacity").trim(),
      rayRotation: hostStyle.getPropertyValue("--bobob-ray-rotation").trim(),
      rayOpacity: hostStyle.getPropertyValue("--bobob-ray-opacity").trim(),
      lineOpacity: hostStyle.getPropertyValue("--bobob-line-opacity").trim(),
      transform: layerStyle.transform,
      variant: host.getAttribute("data-reactbits-background") || "",
      canvasCount: host.querySelectorAll(".bobob-reactbits-canvas").length,
      canvasCssWidth: canvasRect ? Math.round(canvasRect.width) : 0,
      canvasCssHeight: canvasRect ? Math.round(canvasRect.height) : 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });
}

const scenarios = [
  { name: "home", path: "/", variant: "light-rays", first: [220, 180], second: [980, 260] },
  { name: "localized-home", path: "/ko", variant: "light-rays", first: [220, 180], second: [980, 260] },
  { name: "tool-directory", path: "/tools", variant: "galaxy", first: [220, 180], second: [980, 260] },
  { name: "tool-detail", path: "/tools/json-formatter", variant: "galaxy", first: [260, 220], second: [980, 520] },
  { name: "guide-directory", path: "/guides", variant: "galaxy", first: [220, 180], second: [980, 260] },
  { name: "guide-detail", path: "/guides/developer-utility-workflow", variant: "galaxy", first: [260, 220], second: [980, 520] },
  { name: "localized-guide-detail", path: "/ko/guides/developer-utility-workflow", variant: "galaxy", first: [260, 220], second: [980, 520] },
  { name: "privacy", path: "/privacy", variant: "galaxy", first: [220, 180], second: [980, 260] },
];

const browser = await launchBrowser();

try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      locale: "en-US",
      viewport: { width: 1280, height: 860 },
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${scenario.path}`, { waitUntil: "load", timeout: 45_000 });
    if (!response || response.status() >= 400) {
      failures.push(`${scenario.name} returned ${response?.status() ?? "no response"}`);
      await context.close();
      continue;
    }
    await page.waitForSelector(".bobob-pointer-background", { state: "attached", timeout: 45_000 });
    await page.waitForFunction(() => {
      const layer = document.querySelector(".bobob-pointer-background");
      const host = layer?.parentElement;
      if (!host) return false;
      return Boolean(getComputedStyle(host).getPropertyValue("--bobob-pointer-x").trim());
    }, { timeout: 45_000 });

    await page.mouse.move(...scenario.first);
    await page.waitForTimeout(80);
    const firstState = await readPointerState(page);
    await page.mouse.move(...scenario.second);
    await page.waitForTimeout(80);
    const secondState = await readPointerState(page);

    if (!firstState || !secondState) {
      failures.push(`${scenario.name} missing pointer background layer`);
      await context.close();
      continue;
    }

    if (secondState.variant !== scenario.variant) {
      failures.push(`${scenario.name} expected ${scenario.variant} background but rendered ${secondState.variant || "none"}`);
    }

    if (!secondState.canvasCount) {
      failures.push(`${scenario.name} missing ReactBits WebGL canvas`);
    }

    if (secondState.canvasCssWidth > secondState.viewportWidth * 1.3 || secondState.canvasCssHeight > secondState.viewportHeight + 24) {
      failures.push(`${scenario.name} ReactBits canvas is not viewport-bounded: ${secondState.canvasCssWidth}x${secondState.canvasCssHeight} for ${secondState.viewportWidth}x${secondState.viewportHeight}`);
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

    if (firstState.depthX === secondState.depthX && firstState.depthY === secondState.depthY) {
      failures.push(`${scenario.name} depth offsets did not change after mouse movement`);
    }

    if (firstState.flowX === secondState.flowX && firstState.flowY === secondState.flowY) {
      failures.push(`${scenario.name} flow offsets did not change after mouse movement`);
    }

    if (firstState.horizonX === secondState.horizonX && firstState.horizonY === secondState.horizonY) {
      failures.push(`${scenario.name} horizon point did not change after mouse movement`);
    }

    if (!secondState.sweepX || !secondState.rayRotation || !secondState.rayOpacity || !secondState.lineOpacity || !secondState.backgroundOpacity) {
      failures.push(`${scenario.name} pointer sweep, ray, and opacity variables were not populated`);
    }

    if (secondState.transform === "none") {
      failures.push(`${scenario.name} pointer layer did not compute a transform`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Pointer background smoke passed for ${scenarios.length} scenarios at ${baseUrl}.`);
