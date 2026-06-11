import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJson = fs.readFileSync(path.join(root, "apps/main/package.json"), "utf8");
const globals = fs.readFileSync(path.join(root, "apps/main/src/app/globals.css"), "utf8");
const layout = fs.readFileSync(path.join(root, "apps/main/src/app/layout.tsx"), "utf8");
const provider = fs.readFileSync(path.join(root, "apps/main/src/components/theme-provider.tsx"), "utf8");
const toggle = fs.readFileSync(path.join(root, "apps/main/src/components/theme-toggle.tsx"), "utf8");
const pointerBackground = fs.readFileSync(path.join(root, "apps/main/src/components/pointer-background.tsx"), "utf8");
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
  [pointerBackground, "prefers-reduced-motion: reduce", "pointer background must respect reduced motion"],
  [pointerBackground, "window.addEventListener(\"pointermove\"", "pointer background must react to pointer movement"],
  [pointerBackground, "requestAnimationFrame", "pointer background must throttle CSS variable updates"],
  [pointerBackground, "light-rays", "ReactBits Light Rays variant missing"],
  [pointerBackground, "galaxy", "ReactBits Galaxy variant missing"],
  [pointerBackground, "await import(\"ogl\")", "ReactBits WebGL engine should be lazy-loaded after mount"],
  [pointerBackground, "uniform float uTheme", "pointer background missing theme-aware shader uniform"],
  [pointerBackground, "readThemeTone", "pointer background missing theme class observer"],
  [pointerBackground, "3.0 + seed * 0.12", "Light Rays speed should track the approved reference setting"],
  [pointerBackground, "float spread = 3.35", "Light Rays spread should stay broad"],
  [pointerBackground, "for (int i = 0; i < 5; i++)", "Light Rays should use fewer broad rays"],
  [pointerBackground, "smoothstep(4.6, 0.02, dist)", "Light Rays length should stay extended"],
  [pointerBackground, "smoothstep(0.32, 0.0, length(pointerDelta)) * 0.5", "Galaxy repulsion strength should track the approved reference setting"],
  [packageJson, "\"ogl\"", "ReactBits Light Rays/Galaxy ogl dependency missing"],
  [globals, ".bobob-pointer-background", "pointer background CSS missing"],
  [globals, ".bobob-reactbits-light-rays", "Light Rays CSS fallback missing"],
  [globals, ".bobob-reactbits-galaxy", "Galaxy CSS fallback missing"],
  [globals, ".dark .bobob-reactbits-light-rays", "dark Light Rays CSS fallback missing"],
  [globals, ".dark .bobob-reactbits-galaxy", "dark Galaxy CSS fallback missing"],
  [globals, ".dark .bobob-reactbits-canvas", "dark ReactBits canvas opacity missing"],
  [globals, "repeating-linear-gradient", "pointer background should keep subtle grid fallback"],
  [globals, "--bobob-grid-x", "pointer background grid offset variables missing"],
  [globals, "--bobob-depth-x", "pointer background depth offset variables missing"],
  [globals, "--bobob-flow-x", "pointer background flow offset variables missing"],
  [globals, "--bobob-horizon-x", "pointer background horizon point variables missing"],
  [globals, "--bobob-background-opacity", "pointer background opacity variable missing"],
  [globals, "--bobob-ray-rotation", "pointer background ray rotation variable missing"],
  [globals, "--bobob-ray-opacity", "pointer background ray opacity variable missing"],
  [directory, "<PointerBackground variant={backgroundVariant} />", "tool directory hero missing configurable pointer background"],
  [workspace, "<PointerBackground />", "tool detail workspace missing pointer background"],
  [guidesIndex, "<PointerBackground />", "guide directory missing pointer background"],
  [localizedGuidesIndex, "<PointerBackground />", "localized guide directory missing pointer background"],
  [guideDetail, "<PointerBackground />", "guide detail missing pointer background"],
  [localizedGuideDetail, "<PointerBackground />", "localized guide detail missing pointer background"],
]) {
  if (!source.includes(fragment)) failures.push(message);
}

if (packageJson.includes("\"framer-motion\"")) {
  failures.push("Bob's utility app should not add framer-motion for the pointer background");
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
