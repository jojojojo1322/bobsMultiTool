import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

const appsDir = path.join(root, "apps");
const appDirs = fs.existsSync(appsDir)
  ? fs.readdirSync(appsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  : [];

if (JSON.stringify(appDirs) !== JSON.stringify(["main"])) {
  failures.push(`apps directory must contain only main, found: ${appDirs.join(", ") || "(none)"}`);
}

for (const legacyPath of [
  "packages",
  "packages/ui",
  "apps/regax",
  "apps/cron-generator",
  "apps/meta-generator",
  "apps/iframe-viewer",
  "apps/lorem-generator",
  "turbo.json",
]) {
  if (fs.existsSync(path.join(root, legacyPath))) failures.push(`${legacyPath} must stay archived/deleted`);
}

const packageJson = JSON.parse(read("package.json"));
if (JSON.stringify(packageJson.workspaces) !== JSON.stringify(["apps/main"])) {
  failures.push('root package workspaces must stay ["apps/main"]');
}
if (packageJson.devDependencies?.turbo || packageJson.dependencies?.turbo) {
  failures.push("turbo dependency must not be restored");
}
for (const [scriptName, scriptValue] of Object.entries(packageJson.scripts ?? {})) {
  if (String(scriptValue).includes("turbo")) failures.push(`script ${scriptName} must not call turbo`);
}

const nextConfig = read("apps/main/next.config.ts");
for (const [source, destination] of [
  ["/regax", "/tools/regex-tester"],
  ["/cron-generator", "/tools/cron-generator"],
  ["/meta-generator", "/tools/meta-tag-generator"],
  ["/iframe-viewer", "/tools/iframe-viewer"],
  ["/lorem-generator", "/tools/lorem-ipsum-generator"],
]) {
  if (!nextConfig.includes(`source: "${source}"`) || !nextConfig.includes(`destination: "${destination}"`) || !nextConfig.includes("permanent: true")) {
    failures.push(`missing permanent redirect ${source} -> ${destination}`);
  }
}

const archivePath = path.join(root, "docs/legacy-apps-archive.md");
if (!fs.existsSync(archivePath)) {
  failures.push("docs/legacy-apps-archive.md must document the archive decision");
} else {
  const archive = read("docs/legacy-apps-archive.md");
  for (const fragment of ["apps/main", "No archived source copy", "Removed App Packages", "Preserved Public Entry Paths", "apps/regax", "packages/ui", "turbo.json", "permanent redirects", "harness:legacy"]) {
    if (!archive.includes(fragment)) failures.push(`legacy archive doc missing ${fragment}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Legacy main-only harness passed.");
