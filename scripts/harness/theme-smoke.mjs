import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJson = fs.readFileSync(path.join(root, "apps/main/package.json"), "utf8");
const globals = fs.readFileSync(path.join(root, "apps/main/src/app/globals.css"), "utf8");
const layout = fs.readFileSync(path.join(root, "apps/main/src/app/layout.tsx"), "utf8");
const provider = fs.readFileSync(path.join(root, "apps/main/src/components/theme-provider.tsx"), "utf8");
const toggle = fs.readFileSync(path.join(root, "apps/main/src/components/theme-toggle.tsx"), "utf8");
const home = fs.readFileSync(path.join(root, "apps/main/src/app/page.tsx"), "utf8");
const localizedHome = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/page.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");

const failures = [];
for (const [source, fragment, message] of [
  [packageJson, "next-themes", "next-themes dependency missing"],
  [globals, ".dark", "dark class variables missing"],
  [layout, "suppressHydrationWarning", "layout missing hydration suppression for theme"],
  [layout, "<ThemeProvider>", "layout missing ThemeProvider"],
  [provider, "defaultTheme=\"system\"", "ThemeProvider must default to system"],
  [toggle, "dictionary.theme.light", "ThemeToggle missing light option"],
  [toggle, "dictionary.theme.dark", "ThemeToggle missing dark option"],
  [toggle, "dictionary.theme.system", "ThemeToggle missing system option"],
  [workspace, "rounded-lg border bg-background", "workbench shell should use neutral border without raised accent"],
]) {
  if (!source.includes(fragment)) failures.push(message);
}

for (const [source, name] of [
  [home, "home"],
  [localizedHome, "localized home"],
  [workspace, "tool workspace"],
]) {
  if (source.includes("border-t-4")) failures.push(`${name} still uses border-t-4 accent`);
  if (source.includes("tool.accent")) failures.push(`${name} still renders tool accent classes`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Theme smoke passed.");
