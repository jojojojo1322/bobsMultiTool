import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = (process.env.BOBOB_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const canonicalHost = "https://www.bobob.app";
const blogDir = path.join(root, "content/blog");
const playDir = path.join(root, "content/play");
const categoryPath = path.join(root, "apps/main/src/features/content/blog-categories.ts");
const failures = [];

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Blog + Play rendered quality smoke requires the playwright dev dependency. Run npm install first.");
  process.exit(1);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return [line, ""];
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}

function blogPosts() {
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const frontmatter = parseFrontmatter(read(path.join(blogDir, file)));
      return {
        slug: frontmatter.slug,
        title: frontmatter.title,
        description: frontmatter.description,
        category: frontmatter.category,
      };
    })
    .filter((post) => post.slug)
    .sort((left, right) => left.slug.localeCompare(right.slug));
}

function playContents() {
  return fs
    .readdirSync(playDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(read(path.join(playDir, file))))
    .sort((left, right) => left.slug.localeCompare(right.slug));
}

function blogCategories(posts) {
  const source = read(categoryPath);
  const categories = Array.from(source.matchAll(/slug:\s+"([^"]+)"[\s\S]*?label:\s+"([^"]+)"[\s\S]*?description:\s+"([^"]+)"/g)).map((match) => ({
    slug: match[1],
    label: match[2],
    description: match[3],
  }));
  return categories.filter((category) => posts.some((post) => post.category === category.label));
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

function pageDefinitions() {
  const posts = blogPosts();
  const plays = playContents();
  const categories = blogCategories(posts);

  return [
    {
      kind: "blog-index",
      path: "/blog",
      canonical: `${canonicalHost}/blog`,
      minText: 2600,
      structuredFragments: ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"BreadcrumbList"'],
    },
    {
      kind: "play-index",
      path: "/play",
      canonical: `${canonicalHost}/play`,
      minText: 900,
      structuredFragments: ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"BreadcrumbList"'],
    },
    ...categories.map((category) => ({
      kind: "blog-category",
      path: `/blog/category/${category.slug}`,
      canonical: `${canonicalHost}/blog/category/${category.slug}`,
      expectedH1: category.label,
      expectedDescription: category.description,
      minText: 900,
      structuredFragments: ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"BreadcrumbList"'],
    })),
    ...posts.map((post) => ({
      kind: "blog-post",
      path: `/blog/${post.slug}`,
      canonical: `${canonicalHost}/blog/${post.slug}`,
      expectedH1: post.title,
      expectedDescription: post.description,
      minText: 850,
      structuredFragments: ['"@type":"BlogPosting"', '"@type":"BreadcrumbList"', '"author":', '"publisher":'],
    })),
    ...plays.map((play) => ({
      kind: "play-detail",
      path: `/play/${play.slug}`,
      canonical: `${canonicalHost}/play/${play.slug}`,
      expectedH1: play.title,
      expectedDescription: play.description,
      minText: 650,
      structuredFragments: ['"@type":"Game"', '"@type":"BreadcrumbList"', '"isAccessibleForFree":true', `data-play-engine="${play.slug}"`],
    })),
  ];
}

const pages = pageDefinitions();
const titleMap = new Map();
const descriptionMap = new Map();
const forbiddenText = /approval status|review-status|monetization tier|Advertisement Space|ca-pub-YOUR|Coming soon|TODO placeholder|후원\s*링크|커피값/i;
const browser = await launchBrowser();

try {
  for (const item of pages) {
    const context = await browser.newContext({
      locale: "ko-KR",
      viewport: { width: 1366, height: 900 },
      extraHTTPHeaders: { "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8" },
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
      const h1Texts = Array.from(document.querySelectorAll("main h1")).map((element) => element.textContent?.replace(/\s+/g, " ").trim()).filter(Boolean);
      return {
        title: document.title.trim(),
        description: document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "",
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || "",
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() || "",
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute("content")?.trim() || "",
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim() || "",
        ogImageWidth: document.querySelector('meta[property="og:image:width"]')?.getAttribute("content")?.trim() || "",
        ogImageHeight: document.querySelector('meta[property="og:image:height"]')?.getAttribute("content")?.trim() || "",
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute("content")?.trim() || "",
        twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute("content")?.trim() || "",
        twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute("content")?.trim() || "",
        h1Texts,
        h2Count: document.querySelectorAll("main h2").length,
        textLength: text.length,
        html: document.documentElement.outerHTML,
        text,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    await context.close();

    if (data.h1Texts.length !== 1) failures.push(`${item.path} should render exactly one main h1, found ${data.h1Texts.length}`);
    if (item.expectedH1 && data.h1Texts[0] !== item.expectedH1) failures.push(`${item.path} h1 "${data.h1Texts[0] ?? ""}" should equal "${item.expectedH1}"`);
    if (data.textLength < item.minText) failures.push(`${item.path} ${item.kind} visible text ${data.textLength} < ${item.minText}`);
    if (data.h2Count < 1 && item.kind === "blog-post") failures.push(`${item.path} blog post should render at least one h2`);
    if (data.canonical !== item.canonical) failures.push(`${item.path} canonical "${data.canonical}" should equal "${item.canonical}"`);
    if (!data.title || data.title.length < 12) failures.push(`${item.path} document title is missing or too short`);
    if (!data.description || data.description.length < 35) failures.push(`${item.path} meta description is missing or too short`);
    if (item.expectedDescription && data.description !== item.expectedDescription) {
      failures.push(`${item.path} meta description should match content description`);
    }
    if (!data.ogTitle || !data.ogDescription || !data.twitterTitle || !data.twitterDescription) {
      failures.push(`${item.path} missing OpenGraph or Twitter title/description metadata`);
    }
    if (!data.ogImage || !data.twitterImage || !data.ogImage.includes("/og-image?") || !data.twitterImage.includes("/og-image?")) {
      failures.push(`${item.path} missing share image metadata`);
    }
    if (data.ogImageWidth !== "1200" || data.ogImageHeight !== "630") {
      failures.push(`${item.path} OpenGraph image should expose 1200x630 dimensions`);
    }
    if (data.overflow > 2) failures.push(`${item.path} horizontal overflow ${data.overflow}px`);
    if (forbiddenText.test(data.text)) failures.push(`${item.path} exposes forbidden public wording`);
    for (const fragment of item.structuredFragments) {
      if (!data.html.includes(fragment)) failures.push(`${item.path} missing structured/rendered fragment ${fragment}`);
    }

    if (data.title) {
      const existing = titleMap.get(data.title) ?? [];
      existing.push(item.path);
      titleMap.set(data.title, existing);
    }
    if (data.description) {
      const existing = descriptionMap.get(data.description) ?? [];
      existing.push(item.path);
      descriptionMap.set(data.description, existing);
    }
  }
} finally {
  await browser.close();
}

for (const [title, paths] of titleMap) {
  if (paths.length > 1) failures.push(`duplicate Blog/Play document title "${title}" on ${paths.join(", ")}`);
}

for (const [description, paths] of descriptionMap) {
  if (paths.length > 1) failures.push(`duplicate Blog/Play meta description "${description}" on ${paths.join(", ")}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Blog + Play rendered quality smoke passed for ${pages.length} pages at ${baseUrl}.`);
