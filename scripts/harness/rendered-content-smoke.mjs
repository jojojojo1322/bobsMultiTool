import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BOBOB_BASE_URL || "http://localhost:3000";
const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const guideRegistry = fs.readFileSync(path.join(root, "apps/main/src/features/guides/registry.ts"), "utf8");

const toolSlugs = Array.from(registry.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const guideSlugs = Array.from(guideRegistry.matchAll(/slug:\s+"([^"]+)"/g)).map((match) => match[1]);
const locales = ["ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"];
const failures = [];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Rendered content smoke requires the playwright dev dependency. Run npm install first.");
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

const paths = [
  { path: "/", kind: "home", minChars: 2500 },
  { path: "/tools", kind: "directory", minChars: 3000 },
  ...toolSlugs.map((slug) => ({ path: `/tools/${slug}`, kind: "tool", minChars: 3000 })),
  { path: "/guides", kind: "guide-index", minChars: 3000 },
  ...guideSlugs.map((slug) => ({ path: `/guides/${slug}`, kind: "guide", minChars: 3000 })),
  { path: "/about", kind: "trust", minChars: 1400 },
  { path: "/contact", kind: "trust", minChars: 1200 },
  { path: "/privacy", kind: "legal", minChars: 2600 },
  { path: "/terms", kind: "legal", minChars: 2600 },
  ...locales.flatMap((locale) => [
    { path: `/${locale}/tools`, kind: "localized-directory", minChars: 1800 },
    { path: `/${locale}/tools/json-formatter`, kind: "localized-tool", minChars: 2200 },
    ...guideSlugs.map((slug) => ({ path: `/${locale}/guides/${slug}`, kind: "localized-guide", minChars: 3000 })),
    { path: `/${locale}/about`, kind: "localized-trust", minChars: 1800 },
    { path: `/${locale}/contact`, kind: "localized-trust", minChars: 1800 },
    { path: `/${locale}/privacy`, kind: "localized-legal", minChars: 2400 },
    { path: `/${locale}/terms`, kind: "localized-legal", minChars: 2400 },
  ]),
];

const forbiddenPublicText = /approval status|review-status|monetization tier|Advertisement Space|ca-pub-YOUR|Coming soon|TODO placeholder/i;
const browser = await launchBrowser();
const rows = [];

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

try {
  for (const item of paths) {
    const context = await browser.newContext({
      locale: "en-US",
      viewport: { width: 1366, height: 900 },
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    const page = await context.newPage();
    const response = await gotoWithRetry(page, `${baseUrl}${item.path}`).catch((error) => {
      failures.push(`${item.path} navigation failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    });
    if (!response || response.status() !== 200) {
      failures.push(`${item.path} returned ${response?.status() ?? "no response"}`);
      await context.close();
      continue;
    }
    await page.waitForSelector("main", { timeout: 20_000 }).catch((error) => {
      failures.push(`${item.path} missing main element: ${error instanceof Error ? error.message : String(error)}`);
    });
    const data = await page.evaluate(() => {
      const main = document.querySelector("main");
      const text = (main?.innerText || document.body.innerText || "").replace(/\s+/g, " ").trim();
      const description = document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
      return {
        chars: text.length,
        words: text.split(/\s+/).filter(Boolean).length,
        h1: document.querySelectorAll("main h1").length,
        h2: document.querySelectorAll("main h2").length,
        title: document.title.trim(),
        description,
        lang: document.documentElement.lang,
        dir: document.documentElement.dir || "ltr",
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        text,
      };
    });
    await context.close();

    rows.push({
      ...item,
      chars: data.chars,
      words: data.words,
      h1: data.h1,
      h2: data.h2,
      title: data.title,
      description: data.description,
      lang: data.lang,
      dir: data.dir,
      overflow: data.overflow,
    });
    if (data.chars < item.minChars) failures.push(`${item.path} ${item.kind} visible chars ${data.chars} < ${item.minChars}`);
    if (data.h1 < 1) failures.push(`${item.path} missing main h1`);
    if (!data.title || data.title.length < 12) failures.push(`${item.path} document title is missing or too short`);
    if (!data.description || data.description.length < 50) failures.push(`${item.path} meta description is missing or too short`);
    if (data.overflow > 2) failures.push(`${item.path} horizontal overflow ${data.overflow}px`);
    if (forbiddenPublicText.test(data.text)) failures.push(`${item.path} exposes forbidden public wording`);
  }
} finally {
  await browser.close();
}

const duplicatedTitles = Object.entries(
  rows.reduce((acc, row) => {
    if (row.title) (acc[row.title] ??= []).push(row.path);
    return acc;
  }, {}),
).filter(([, paths]) => paths.length > 1);

const duplicatedDescriptions = Object.entries(
  rows.reduce((acc, row) => {
    if (row.description) (acc[row.description] ??= []).push(row.path);
    return acc;
  }, {}),
).filter(([, paths]) => paths.length > 1);

for (const [title, pathsWithTitle] of duplicatedTitles) {
  failures.push(`duplicate document title "${title}" on ${pathsWithTitle.join(", ")}`);
}

for (const [description, pathsWithDescription] of duplicatedDescriptions) {
  failures.push(`duplicate meta description "${description}" on ${pathsWithDescription.join(", ")}`);
}

const summary = Object.values(
  rows.reduce((acc, row) => {
    const entry = (acc[row.kind] ??= { kind: row.kind, count: 0, min: Infinity, median: 0, max: 0 });
    entry.count += 1;
    entry.min = Math.min(entry.min, row.chars);
    entry.max = Math.max(entry.max, row.chars);
    return acc;
  }, {}),
);

for (const entry of summary) {
  const chars = rows.filter((row) => row.kind === entry.kind).map((row) => row.chars).sort((a, b) => a - b);
  entry.median = chars[Math.floor(chars.length / 2)];
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.table(summary);
  process.exit(1);
}

console.table(summary);
console.log(`Rendered content smoke passed for ${rows.length} pages at ${baseUrl}.`);
