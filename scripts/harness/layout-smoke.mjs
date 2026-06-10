import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const resizable = fs.readFileSync(path.join(root, "apps/main/src/components/ui/resizable.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const directory = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-directory.tsx"), "utf8");
const dictionaries = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/dictionaries.ts"), "utf8");
const localizedContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/localized-content.ts"), "utf8");
const toolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/tools/page.tsx"), "utf8");
const localizedToolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/tools/page.tsx"), "utf8");
const guideDetail = fs.readFileSync(path.join(root, "apps/main/src/app/guides/[slug]/page.tsx"), "utf8");
const localizedGuideDetail = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/guides/[slug]/page.tsx"), "utf8");

const failures = [];
for (const fragment of [
  "bobob:workbench-layout",
  "defaultLeftWidth = 280",
  "defaultRightWidth = 340",
  "minLeftWidth = 220",
  "minRightWidth = 280",
  "minCenterWidth = 560",
  "localStorage",
  "ResizeObserver",
  "clampLayoutToAvailable",
  "Resize left sidebar",
  "Resize right sidebar",
  "role=\"separator\"",
  "data-resizable-handle",
  "lg:grid-cols-[var(--bobob-grid-columns)]",
  "minmax(0,1fr)",
]) {
  if (!resizable.includes(fragment)) failures.push(`resizable layout missing ${fragment}`);
}

if (!workspace.includes("<Sheet")) failures.push("mobile navigation Sheet fallback missing");
if (!directory.includes("ToolSearchPanel")) failures.push("tool directory must include shared search panel");
if (!directory.includes("toolCategories.map")) failures.push("tool directory must expose category sections");
if (toolsIndex.includes("redirect(") || localizedToolsIndex.includes("redirect(withLocale(\"/tools/regex-tester\"")) failures.push("tools directory pages must not redirect to a single tool");
if (!workspace.includes("rounded-lg border bg-background")) failures.push("single-shell workbench border missing");
if (!workspace.includes("lg:h-[calc(100vh-7rem)]")) failures.push("desktop workbench shell must keep a fixed height with internal panel scroll");
if (!workspace.includes("h-full min-h-0")) failures.push("workbench panels must use min-h-0 for internal scrolling");
if (!workspace.includes("withLocale(\"/\", locale)")) failures.push("detail top bar home link missing");
if (!workspace.includes("function ToolNextActions")) failures.push("tool detail center panel next-action strip missing");
if (!workspace.includes("data-tool-next-actions")) failures.push("tool detail next-action strip must expose a stable QA attribute");
if (!guideDetail.includes("withLocale(\"/\", defaultLocale)") || !guideDetail.includes("Bob&apos;s Multi Tool")) failures.push("default guide detail home link missing");
if (!localizedGuideDetail.includes("withLocale(\"/\", locale)") || !localizedGuideDetail.includes("Bob&apos;s Multi Tool")) failures.push("localized guide detail home link missing");
if (!workspace.includes("bobob:tool-nav-scroll")) failures.push("tool navigation scroll persistence missing");
if (!workspace.includes("data-tool-navigation-scroll")) failures.push("tool navigation scroll container should expose a stable QA attribute");
if (!workspace.includes("React.useLayoutEffect")) failures.push("tool navigation scroll restore must happen before paint");
if (!workspace.includes("onScroll={persistScroll}")) failures.push("tool navigation scroll position is not persisted");
if (!workspace.includes("saveCurrentScroll")) failures.push("tool navigation must save scroll immediately before navigation");
if (!workspace.includes("onPointerDown={saveCurrentScroll}")) failures.push("tool navigation pointer navigation must preserve scroll");
if (!workspace.includes("window.setTimeout(restore, 80)")) failures.push("tool navigation restore should retry after route hydration");
if (!workspace.includes("scroll={false}")) failures.push("tool navigation links must not reset document scroll");
if (workspace.includes("dictionary.tool.demand") || workspace.includes("demandLabel")) failures.push("tool detail must not expose demand wording");
if (dictionaries.includes("demand:")) failures.push("visible dictionary must not keep a demand label");
if (localizedContent.includes("coreChip") || localizedContent.includes("growthChip") || localizedContent.includes("longTailChip")) {
  failures.push("localized content must not keep demand-tier chip copy");
}
if (workspace.includes("rounded-lg border bg-card shadow-none")) failures.push("center panel still has separate outer rounded border");
if (workspace.includes("sticky top-4")) failures.push("desktop panels still use separate sticky card layout");
if (!resizable.includes("after:bg-border")) failures.push("resize handle missing single neutral divider policy");
if (resizable.includes("border-x border-transparent")) failures.push("resize handle still uses extra border columns");

for (const file of [
  "apps/main/src/features/tools/tool-search-panel.tsx",
  "apps/main/src/app/page.tsx",
  "apps/main/src/app/[locale]/page.tsx",
]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (source.includes("tool.demandTier")) failures.push(`${file} exposes demand tier in the UI`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Layout smoke passed.");
