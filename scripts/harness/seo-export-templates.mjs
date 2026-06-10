import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assertIncludes(source, fragment, label) {
  if (!source.includes(fragment)) failures.push(`${label} missing ${fragment}`);
}

const reportHarness = read("scripts/harness/seo-opportunity-report.mjs");
const reportsReadmePath = path.join(root, "reports/README.md");
const searchTemplatePath = path.join(root, "reports/templates/search-console.example.csv");
const adsenseTemplatePath = path.join(root, "reports/templates/adsense.example.csv");

for (const filePath of [reportsReadmePath, searchTemplatePath, adsenseTemplatePath]) {
  if (!fs.existsSync(filePath)) failures.push(`${path.relative(root, filePath)} is missing`);
}

const reportsReadme = fs.existsSync(reportsReadmePath) ? read("reports/README.md") : "";
const searchTemplate = fs.existsSync(searchTemplatePath) ? read("reports/templates/search-console.example.csv") : "";
const adsenseTemplate = fs.existsSync(adsenseTemplatePath) ? read("reports/templates/adsense.example.csv") : "";

const searchHeader = "Page,Query,Impressions,Clicks,CTR,Position";
const adsenseHeader = "Page,Impressions,Page RPM,Estimated earnings,CTR";

assertIncludes(searchTemplate, searchHeader, "Search Console template");
assertIncludes(adsenseTemplate, adsenseHeader, "AdSense template");
assertIncludes(reportHarness, `searchConsoleHeader: "${searchHeader}"`, "SEO opportunity report harness");
assertIncludes(reportHarness, `adsenseHeader: "${adsenseHeader}"`, "SEO opportunity report harness");

for (const fragment of [
  "reports/search-console.csv",
  "reports/search-console.tsv",
  "reports/adsense.csv",
  "reports/adsense.tsv",
  "BOBOB_SEO_REPORT_FORMAT=export-packet",
  "metadataRewriteReadiness.canRewritePublicMetadata",
  "measuredExportPlan.copyTargets.searchConsolePageRegex",
  "reports/templates/search-console.example.csv",
  "reports/templates/adsense.example.csv",
]) {
  assertIncludes(reportsReadme, fragment, "reports README");
}

const gitignore = read(".gitignore");
for (const fragment of ["reports/*.csv", "reports/*.tsv", "reports/seo-opportunities*.md", "reports/seo-export*.md"]) {
  assertIncludes(gitignore, fragment, ".gitignore");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("SEO export templates harness passed.");
