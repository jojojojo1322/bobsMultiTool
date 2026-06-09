import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bobob-seo-smoke-"));
const failures = [];

function writeFixture(name, content) {
  const filePath = path.join(tempDir, name);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function runReport(env) {
  const result = spawnSync("node", ["scripts/harness/seo-opportunity-report.mjs"], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`SEO report exited with ${result.status}:\n${result.stderr}`);
  }
  return { stdout: result.stdout, stderr: result.stderr };
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const searchConsoleCsv = writeFixture(
  "search-console.csv",
  [
    "Page,Query,Impressions,Clicks,CTR,Position",
    "https://www.bobob.app/tools/json-formatter,json formatter online,1200,12,1%,8",
    "https://www.bobob.app/ko/tools/dns-lookup,dns lookup,900,9,1%,6",
    "https://www.bobob.app/guides/seo-meta-tags,meta tags guide,800,8,1%,7",
    "https://www.bobob.app/not-tracked,random page,500,5,1%,5",
  ].join("\n"),
);

const adsenseCsv = writeFixture(
  "adsense.csv",
  [
    "Page,Impressions,Page RPM,Estimated earnings,CTR",
    "https://www.bobob.app/tools/dns-lookup,700,0.4,0.28,0.8%",
    "https://www.bobob.app/pt-BR/guides/hash-generator-security,400,0.3,0.12,0.7%",
  ].join("\n"),
);

const validRun = runReport({
  BOBOB_SEARCH_CONSOLE_CSV: searchConsoleCsv,
  BOBOB_ADSENSE_CSV: adsenseCsv,
});
const report = JSON.parse(validRun.stdout);

assert(report.inputWarnings.length === 0, "valid measured CSV fixtures should not produce inputWarnings");
assert(!validRun.stderr.includes("SEO input warning"), "valid measured CSV fixtures should not write SEO input warnings to stderr");
assert(report.inventoryCount === 64, "SEO opportunity report should cover 48 tools plus 16 guides");
assert(report.toolInventoryCount === 48, "SEO opportunity report should include 48 tool pages");
assert(report.guideInventoryCount === 16, "SEO opportunity report should include 16 guide pages");
assert(report.searchConsoleOpportunities.some((row) => row.page === "/tools/json-formatter" && row.query === "json formatter online"), "Search Console low-CTR tool opportunity missing");
assert(report.adsenseOpportunities.some((row) => row.page === "/tools/dns-lookup" && row.rpm === 0.4), "AdSense low-RPM tool opportunity missing");
assert(report.titleDescriptionRecommendations.some((item) => item.path === "/tools/json-formatter" && item.suggestedTitle.includes("JSON Formatter")), "tool title/description recommendation missing");
assert(report.titleDescriptionRecommendations.some((item) => item.path === "/guides/seo-meta-tags" && item.suggestedTitle.includes("Guide")), "guide title/description recommendation missing");
assert(report.unsupportedMeasuredPages.some((row) => row.page === "/not-tracked"), "unsupported measured page warning missing");

const badSearchConsoleCsv = writeFixture("bad-search-console.csv", "Bad,Columns\n/tools/json-formatter,1000\n");
const markdownOutput = path.join(tempDir, "seo-opportunities.md");
const badRun = runReport({
  BOBOB_SEARCH_CONSOLE_CSV: badSearchConsoleCsv,
  BOBOB_SEO_REPORT_FORMAT: "markdown",
  BOBOB_SEO_REPORT_OUT: markdownOutput,
});

assert(badRun.stdout === "", "markdown report with BOBOB_SEO_REPORT_OUT should not write report body to stdout");
assert(badRun.stderr.includes("SEO input warning:"), "malformed CSV fixture should write input warnings to stderr");
const markdownReport = fs.readFileSync(markdownOutput, "utf8");
assert(markdownReport.includes("## Input Warnings"), "markdown report should include Input Warnings section");
assert(markdownReport.includes("Search Console CSV missing required column"), "bad Search Console CSV should show required-column warning");
assert(markdownReport.includes("## Title And Description Recommendations"), "markdown report should include recommendations section");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("SEO opportunity report smoke passed.");
