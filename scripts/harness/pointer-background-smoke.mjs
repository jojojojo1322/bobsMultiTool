import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const forbiddenSourceFragments = [
  "PointerBackground",
  "pointer-background",
  "data-reactbits-background",
  "bobob-reactbits",
  "bobob-pointer-background",
  "await import(\"ogl\")",
  "\"ogl\"",
  "backgroundVariant",
];

const sourceFiles = [
  "apps/main/package.json",
  "apps/main/src/app/globals.css",
  "apps/main/src/app/page.tsx",
  "apps/main/src/app/[locale]/page.tsx",
  "apps/main/src/features/tools/tool-directory.tsx",
  "apps/main/src/features/tools/tool-workspace.tsx",
  "apps/main/src/features/i18n/trust-page.tsx",
  "apps/main/src/app/guides/page.tsx",
  "apps/main/src/app/[locale]/guides/page.tsx",
  "apps/main/src/app/guides/[slug]/page.tsx",
  "apps/main/src/app/[locale]/guides/[slug]/page.tsx",
  "apps/main/src/app/privacy/page.tsx",
  "apps/main/src/app/terms/page.tsx",
  "apps/main/src/app/[locale]/privacy/page.tsx",
  "apps/main/src/app/[locale]/terms/page.tsx",
];

if (fs.existsSync(path.join(root, "apps/main/src/components/pointer-background.tsx"))) {
  failures.push("removed WebGL pointer background component still exists");
}

for (const file of sourceFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const fragment of forbiddenSourceFragments) {
    if (source.includes(fragment)) failures.push(`${file} still contains ${fragment}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Pointer background removal smoke passed.");
