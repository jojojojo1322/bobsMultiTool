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
const directory = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-directory.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const guidesIndex = fs.readFileSync(path.join(root, "apps/main/src/app/guides/page.tsx"), "utf8");
const localizedGuidesIndex = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/guides/page.tsx"), "utf8");
const guideDetail = fs.readFileSync(path.join(root, "apps/main/src/app/guides/[slug]/page.tsx"), "utf8");
const localizedGuideDetail = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/guides/[slug]/page.tsx"), "utf8");

const failures = [];
for (const [source, fragment, message] of [
  [packageJson, "next-themes", "next-themes dependency missing"],
  [globals, ".dark", "dark class variables missing"],
  [globals, "--bobob-surface-shell", "surface shell token missing"],
  [globals, "--bobob-surface-raised", "raised surface token missing"],
  [globals, "--bobob-border-strong", "strong border token missing"],
  [globals, "--bobob-panel-shadow", "panel shadow token missing"],
  [globals, "--bobob-scrollbar-thumb", "modern scrollbar token missing"],
  [globals, "*::-webkit-scrollbar-thumb", "webkit scrollbar thumb styling missing"],
  [globals, "scrollbar-width: thin", "Firefox thin scrollbar styling missing"],
  [layout, "suppressHydrationWarning", "layout missing hydration suppression for theme"],
  [layout, "<ThemeProvider>", "layout missing ThemeProvider"],
  [provider, "defaultTheme=\"system\"", "ThemeProvider must default to system"],
  [toggle, "dictionary.theme.light", "ThemeToggle missing light option"],
  [toggle, "dictionary.theme.dark", "ThemeToggle missing dark option"],
  [toggle, "dictionary.theme.system", "ThemeToggle missing system option"],
  [workspace, "rounded-lg border bg-background", "workbench shell should use neutral border without raised accent"],
  [workspace, "bobob-workbench-shell", "workbench shell missing theme separation class"],
  [workspace, "bobob-side-panel", "side panels missing theme separation class"],
  [workspace, "bobob-center-panel", "center panel missing theme separation class"],
  [workspace, "bobob-primary-work-area", "primary work area missing theme separation class"],
  [workspace, "bobob-support-sections", "support sections missing theme separation class"],
]) {
  if (!source.includes(fragment)) failures.push(message);
}

if (packageJson.includes("\"framer-motion\"")) {
  failures.push("Bob's utility app should not add framer-motion for decorative backgrounds");
}

for (const [source, name] of [
  [packageJson, "package.json"],
  [globals, "globals.css"],
  [home, "home"],
  [localizedHome, "localized home"],
  [directory, "tool directory"],
  [workspace, "tool workspace"],
  [guidesIndex, "guide directory"],
  [localizedGuidesIndex, "localized guide directory"],
  [guideDetail, "guide detail"],
  [localizedGuideDetail, "localized guide detail"],
]) {
  for (const fragment of ["PointerBackground", "pointer-background", "data-reactbits-background", "bobob-reactbits", "bobob-pointer-background", "\"ogl\"", "await import(\"ogl\")", "backgroundVariant"]) {
    if (source.includes(fragment)) failures.push(`${name} still includes removed decorative background fragment ${fragment}`);
  }
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
