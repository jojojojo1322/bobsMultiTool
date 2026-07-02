import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const config = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/config.ts"), "utf8");
const dictionaries = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/dictionaries.ts"), "utf8");
const middleware = fs.readFileSync(path.join(root, "apps/main/src/middleware.ts"), "utf8");
const rootLayout = fs.readFileSync(path.join(root, "apps/main/src/app/layout.tsx"), "utf8");
const sitemapSource = fs.readFileSync(path.join(root, "apps/main/src/features/seo/sitemaps.ts"), "utf8");
const sitemapIndexRoute = fs.readFileSync(path.join(root, "apps/main/src/app/sitemap.xml/route.ts"), "utf8");
const localizedSitemapRoute = fs.readFileSync(path.join(root, "apps/main/src/app/sitemaps/[locale]/route.ts"), "utf8");
const toolWorkspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const toolDirectory = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-directory.tsx"), "utf8");
const localizedContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/localized-content.ts"), "utf8");
const trustContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/trust-content.ts"), "utf8");

const failures = [];
function latestRelevantGitDate() {
  try {
    return execSync(
      "git log -1 --format=%cs -- apps/main/src/app apps/main/src/features/guides apps/main/src/features/i18n apps/main/src/features/tools",
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {
    return "";
  }
}

const requiredLocales = ["en", "ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"];
for (const locale of requiredLocales) {
  if (!config.includes(`"${locale}"`)) failures.push(`locale missing from config: ${locale}`);
}

for (const fragment of ['ko: "한국어"', 'ja: "日本語"', '"zh-CN": "简体中文"', '"zh-TW": "繁體中文"', 'hi: "हिन्दी"', 'th: "ไทย"', 'ar: "العربية"']) {
  if (!config.includes(fragment)) failures.push(`locale switcher should use native language label: ${fragment}`);
}

for (const fragment of ['ko: "Korean"', 'ja: "Japanese"', '"zh-CN": "Chinese (Simplified)"', '"zh-TW": "Chinese (Traditional)"']) {
  if (config.includes(fragment)) failures.push(`locale switcher should not use English-only language label: ${fragment}`);
}

for (const fragment of ["NEXT_LOCALE", "accept-language", "x-vercel-ip-country", "cf-ipcountry"]) {
  if (!middleware.includes(fragment)) failures.push(`middleware missing locale signal: ${fragment}`);
}
for (const fragment of ["bingbot", "isSearchCrawler", "defaultLocale"]) {
  if (!middleware.includes(fragment)) failures.push(`middleware missing search crawler canonical bypass: ${fragment}`);
}
for (const fragment of ["x-bobob-locale", "nextWithLocale"]) {
  if (!middleware.includes(fragment)) failures.push(`middleware missing root html locale handoff: ${fragment}`);
}
for (const fragment of ['const apexHost = "bobob.app"', 'const canonicalHost = "www.bobob.app"', "canonicalHostRedirect", "NextResponse.redirect(url, 308)"]) {
  if (!middleware.includes(fragment)) failures.push(`middleware missing canonical host redirect fragment: ${fragment}`);
}

for (const fragment of ["homeTitle", "homeDescription", "toolDescription", "guideDescription", "categories"]) {
  if (!dictionaries.includes(fragment)) failures.push(`dictionary missing fragment: ${fragment}`);
}

if (!config.includes('"x-default"')) failures.push("languageAlternates missing x-default hreflang");
if (!sitemapSource.includes('hreflang="x-default"')) failures.push("localized sitemap missing x-default hreflang links");
if (!sitemapSource.includes("xmlns:xhtml")) failures.push("localized sitemap missing xhtml alternate namespace");
for (const fragment of ["archiveLastmod", "latestDate", "blogLastmod", "playLastmod", "siteLastmod", "blogPostLastmod", "lastmod: blogPostLastmod(post)", "lastmod: content.updatedAt", "<lastmod>${entry.lastmod}</lastmod>"]) {
  if (!sitemapSource.includes(fragment)) failures.push(`sitemap source missing dynamic lastmod fragment: ${fragment}`);
}
const latestContentDate = latestRelevantGitDate();
if (latestContentDate && !sitemapSource.includes(latestContentDate)) {
  failures.push(`sitemap archive lastmod should be reviewed for latest relevant content commit ${latestContentDate}`);
}
if (!sitemapIndexRoute.includes("sitemapIndexXml")) failures.push("sitemap index route missing generator");
if (!localizedSitemapRoute.includes("generateStaticParams")) failures.push("localized sitemap route missing static params");
if (!middleware.includes("/sitemaps")) failures.push("middleware must skip sitemap routes");
if (!dictionaries.includes('ar:') || !dictionaries.includes('dir: "rtl"')) failures.push("Arabic RTL dictionary missing");
if (!rootLayout.includes('headers()') || !rootLayout.includes('"x-bobob-locale"')) {
  failures.push("root layout must read the middleware locale handoff");
}
if (!rootLayout.includes("lang={locale}") || !rootLayout.includes("dir={dictionary.dir}")) {
  failures.push("root html element must render localized lang and dir attributes");
}
if (!toolWorkspace.includes("dir={dictionary.dir}") || !toolWorkspace.includes("lang={locale}")) {
  failures.push("tool workspace missing locale lang/dir attributes");
}
if (!toolDirectory.includes("dir={dictionary.dir}") || !toolDirectory.includes("lang={locale}")) {
  failures.push("tool directory missing locale lang/dir attributes");
}
if (!localizedContent.includes("getLocalizedTool") || !localizedContent.includes("getLocalizedGuide")) {
  failures.push("localized content resolvers missing");
}
if (!trustContent.includes("getLocalizedTrustContent") || !trustContent.includes("bobob.app 소개") || !trustContent.includes("حول bobob.app")) {
  failures.push("localized trust content resolver or locale prose missing");
}

for (const routeFile of [
  "apps/main/src/app/[locale]/page.tsx",
  "apps/main/src/app/[locale]/about/page.tsx",
  "apps/main/src/app/[locale]/contact/page.tsx",
  "apps/main/src/app/[locale]/tools/page.tsx",
  "apps/main/src/app/[locale]/tools/[slug]/page.tsx",
  "apps/main/src/app/[locale]/guides/[slug]/page.tsx",
  "apps/main/src/app/[locale]/privacy/page.tsx",
  "apps/main/src/app/[locale]/terms/page.tsx",
]) {
  if (!fs.existsSync(path.join(root, routeFile))) failures.push(`localized route file missing: ${routeFile}`);
  const source = fs.readFileSync(path.join(root, routeFile), "utf8");
  const delegatesDirectoryDir = source.includes("ToolDirectory") && toolDirectory.includes("dir={dictionary.dir}");
  if (routeFile.endsWith("/page.tsx") && !routeFile.includes("/tools/[slug]/") && !source.includes("dir={dictionary.dir}") && !delegatesDirectoryDir) {
    failures.push(`localized route missing dir attribute: ${routeFile}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("i18n smoke passed.");
