import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const resizable = fs.readFileSync(path.join(root, "apps/main/src/components/ui/resizable.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");

const failures = [];
for (const fragment of [
  "bobob:workbench-layout",
  "defaultLeftWidth = 280",
  "defaultRightWidth = 340",
  "minLeftWidth = 220",
  "minRightWidth = 280",
  "minCenterWidth = 560",
  "localStorage",
  "Resize left sidebar",
  "Resize right sidebar",
  "role=\"separator\"",
  "data-resizable-handle",
  "lg:grid-cols-[var(--bobob-grid-columns)]",
]) {
  if (!resizable.includes(fragment)) failures.push(`resizable layout missing ${fragment}`);
}

if (!workspace.includes("<Sheet")) failures.push("mobile navigation Sheet fallback missing");
if (!workspace.includes("rounded-lg border bg-background")) failures.push("single-shell workbench border missing");
if (!workspace.includes("lg:h-[calc(100vh-7rem)]")) failures.push("desktop workbench shell must keep a fixed height with internal panel scroll");
if (!workspace.includes("h-full min-h-0")) failures.push("workbench panels must use min-h-0 for internal scrolling");
if (!workspace.includes("withLocale(\"/\", locale)")) failures.push("detail top bar home link missing");
if (workspace.includes("rounded-lg border bg-card shadow-none")) failures.push("center panel still has separate outer rounded border");
if (workspace.includes("sticky top-4")) failures.push("desktop panels still use separate sticky card layout");
if (!resizable.includes("after:bg-border")) failures.push("resize handle missing single neutral divider policy");
if (resizable.includes("border-x border-transparent")) failures.push("resize handle still uses extra border columns");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Layout smoke passed.");
