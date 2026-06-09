import fs from "node:fs";
import path from "node:path";

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

const failures = [];
const requiredLocales = ["en", "ko", "ja", "zh-CN", "zh-TW", "es", "pt-BR", "de", "fr", "hi", "id", "vi", "th", "ar"];
for (const locale of requiredLocales) {
  if (!config.includes(`"${locale}"`)) failures.push(`locale missing from config: ${locale}`);
}

for (const fragment of ["NEXT_LOCALE", "accept-language", "x-vercel-ip-country", "cf-ipcountry"]) {
  if (!middleware.includes(fragment)) failures.push(`middleware missing locale signal: ${fragment}`);
}
for (const fragment of ["x-bobob-locale", "nextWithLocale"]) {
  if (!middleware.includes(fragment)) failures.push(`middleware missing root html locale handoff: ${fragment}`);
}

for (const fragment of ["homeTitle", "homeDescription", "toolDescription", "guideDescription", "categories"]) {
  if (!dictionaries.includes(fragment)) failures.push(`dictionary missing fragment: ${fragment}`);
}

if (!config.includes('"x-default"')) failures.push("languageAlternates missing x-default hreflang");
if (!sitemapSource.includes('hreflang="x-default"')) failures.push("localized sitemap missing x-default hreflang links");
if (!sitemapSource.includes("xmlns:xhtml")) failures.push("localized sitemap missing xhtml alternate namespace");
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

for (const routeFile of [
  "apps/main/src/app/[locale]/page.tsx",
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
