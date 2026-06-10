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

function runReportAllowFailure(env) {
  const result = spawnSync("node", ["scripts/harness/seo-opportunity-report.mjs"], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
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
    "https://www.bobob.app/tools/uuid-generator,uuid generator,700,7,1%,5",
    "https://www.bobob.app/guides/seo-meta-tags,meta tags guide,800,8,1%,7",
    "https://www.bobob.app/not-tracked,random page,500,5,1%,5",
  ].join("\n"),
);

const adsenseCsv = writeFixture(
  "adsense.csv",
  [
    "Page,Impressions,Page RPM,Estimated earnings,CTR",
    "https://www.bobob.app/tools/json-formatter,1000,0.5,0.50,0.7%",
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
assert(report.measuredCoverage.requiredMode === "tiers", "default measured coverage should use tier mode");
assert(report.measuredCoverage.requiredSources.includes("search-console") && report.measuredCoverage.requiredSources.includes("adsense"), "measured coverage should require Search Console and AdSense by default");
assert(report.measuredExportPlan.defaultFiles.searchConsole.includes("reports/search-console.csv"), "measured export plan should list default Search Console CSV path");
assert(report.measuredExportPlan.defaultFiles.adsense.includes("reports/adsense.csv"), "measured export plan should list default AdSense CSV path");
assert(report.measuredExportPlan.priorityPages.some((row) => row.path === "/tools/regex-tester" && row.canonicalUrl === "https://www.bobob.app/tools/regex-tester"), "measured export plan should include canonical priority URLs");
assert(report.measuredExportPlan.commands.includes("npm run harness:seo-measured"), "measured export plan should include strict measured gate command");
assert(report.measuredExportPlan.copyTargets.canonicalUrls.includes("https://www.bobob.app/tools/regex-tester"), "measured export plan copy targets should include canonical URL batch");
assert(report.measuredExportPlan.copyTargets.searchConsolePageRegex.includes("https://www\\.bobob\\.app/tools/regex-tester"), "measured export plan should include escaped Search Console page regex");
assert(report.measuredExportPlan.copyTargets.requiredMeasuredPathsEnv.includes("/tools/regex-tester"), "measured export plan should include focused measured paths env value");
assert(report.measuredExportPlan.copyTargets.searchIntentSeedList.includes("regex tester"), "measured export plan should include search intent seeds");
assert(report.measuredExportPlan.csvTemplates.searchConsoleHeader === "Page,Query,Impressions,Clicks,CTR,Position", "measured export plan should include Search Console CSV template header");
assert(report.measuredExportPlan.csvTemplates.adsenseHeader === "Page,Impressions,Page RPM,Estimated earnings,CTR", "measured export plan should include AdSense CSV template header");
assert(report.metadataRewriteReadiness.status === "needs-measured-data-first", "default fixture should not be ready until required measured coverage is complete");
assert(report.metadataRewriteReadiness.canRewritePublicMetadata === false, "default fixture should not allow metadata rewrites with partial measured coverage");
assert(report.metadataRewriteReadiness.nextActions.some((action) => action.includes("Search Console rows grouped by Page and Query")), "metadata readiness should tell reviewers how to collect Search Console rows");
assert(report.searchConsoleOpportunities.some((row) => row.page === "/tools/json-formatter" && row.query === "json formatter online"), "Search Console low-CTR tool opportunity missing");
assert(report.adsenseOpportunities.some((row) => row.page === "/tools/dns-lookup" && row.rpm === 0.4), "AdSense low-RPM tool opportunity missing");
assert(report.titleDescriptionRecommendations.some((item) => item.path === "/tools/json-formatter" && item.suggestedTitle.includes("JSON Formatter")), "tool title/description recommendation missing");
assert(report.titleDescriptionRecommendations.some((item) => item.path === "/guides/seo-meta-tags" && item.suggestedTitle.includes("Guide")), "guide title/description recommendation missing");
assert(report.measurementBacklog.some((item) => item.path === "/tools/regex-tester" && item.missingInputs.includes("Search Console page/query rows")), "measurement backlog should include unmeasured core tool pages");
assert(report.unsupportedMeasuredPages.some((row) => row.page === "/not-tracked"), "unsupported measured page warning missing");

const strictPass = runReport({
  BOBOB_SEARCH_CONSOLE_CSV: searchConsoleCsv,
  BOBOB_ADSENSE_CSV: adsenseCsv,
  BOBOB_REQUIRE_MEASURED_SEO: "1",
  BOBOB_REQUIRED_MEASURED_PATHS: "/tools/json-formatter,/tools/dns-lookup",
});
const strictPassReport = JSON.parse(strictPass.stdout);
assert(strictPassReport.measuredCoverage.pass === true, "strict measured SEO gate should pass for fully covered fixture pages");
assert(strictPassReport.metadataRewriteReadiness.status === "ready-for-measured-copy-review", "strict measured SEO gate should enable measured metadata review when recommendations have queries");
assert(strictPassReport.metadataRewriteReadiness.canRewritePublicMetadata === true, "strict measured SEO gate should allow measured metadata review when coverage and query recommendations exist");
assert(strictPass.stderr === "", "strict measured SEO gate should not warn when fixture coverage is complete");

const strictFail = runReportAllowFailure({
  BOBOB_SEARCH_CONSOLE_CSV: searchConsoleCsv,
  BOBOB_ADSENSE_CSV: adsenseCsv,
  BOBOB_REQUIRE_MEASURED_SEO: "1",
  BOBOB_REQUIRED_MEASURED_PATHS: "/tools/uuid-generator",
});
assert(strictFail.status === 1, "strict measured SEO gate should fail when required page coverage is partial");
assert(strictFail.stderr.includes("Measured SEO gate failed."), "strict measured SEO failure should explain the gate failure");
assert(strictFail.stderr.includes("/tools/uuid-generator: missing AdSense page/RPM rows"), "strict measured SEO failure should list missing AdSense page coverage");

const searchConsoleTsv = writeFixture(
  "search-console.tsv",
  [
    "\uFEFFPage\tQuery\tImpressions\tClicks\tCTR\tPosition",
    "https://www.bobob.app/tools/jwt-decoder\tjwt decoder\t1500\t15\t1%\t5",
  ].join("\n"),
);
const adsenseSemicolonCsv = writeFixture(
  "adsense-semicolon.csv",
  [
    "Page;Impressions;Page RPM;Estimated earnings;CTR",
    "https://www.bobob.app/tools/jwt-decoder;800;0,4;0,32;0,8%",
  ].join("\n"),
);
const flexibleDelimiterRun = runReport({
  BOBOB_SEARCH_CONSOLE_CSV: searchConsoleTsv,
  BOBOB_ADSENSE_CSV: adsenseSemicolonCsv,
});
const flexibleDelimiterReport = JSON.parse(flexibleDelimiterRun.stdout);
assert(flexibleDelimiterReport.searchConsoleOpportunities.some((row) => row.page === "/tools/jwt-decoder" && row.query === "jwt decoder"), "TSV Search Console export with BOM should parse");
assert(flexibleDelimiterReport.adsenseOpportunities.some((row) => row.page === "/tools/jwt-decoder" && row.rpm === 0.4), "semicolon AdSense export with decimal comma should parse");

const defaultReportsDir = path.join(root, "reports");
const defaultSearchConsoleCsv = path.join(defaultReportsDir, "search-console.csv");
const defaultAdsenseCsv = path.join(defaultReportsDir, "adsense.csv");
const defaultSearchConsoleTsv = path.join(defaultReportsDir, "search-console.tsv");
const defaultAdsenseTsv = path.join(defaultReportsDir, "adsense.tsv");
const defaultInputsAlreadyExist = fs.existsSync(defaultSearchConsoleCsv) || fs.existsSync(defaultAdsenseCsv) || fs.existsSync(defaultSearchConsoleTsv) || fs.existsSync(defaultAdsenseTsv);
if (!defaultInputsAlreadyExist) {
  fs.mkdirSync(defaultReportsDir, { recursive: true });
  fs.writeFileSync(defaultSearchConsoleTsv, fs.readFileSync(searchConsoleTsv, "utf8"));
  fs.writeFileSync(defaultAdsenseTsv, "Page\tImpressions\tPage RPM\tEstimated earnings\tCTR\nhttps://www.bobob.app/tools/jwt-decoder\t800\t0.4\t0.32\t0.8%\n");
  try {
    const defaultRun = runReport({
      BOBOB_SEARCH_CONSOLE_CSV: "",
      BOBOB_ADSENSE_CSV: "",
    });
    const defaultReport = JSON.parse(defaultRun.stdout);
    assert(defaultReport.inputs.searchConsoleCsv === "reports/search-console.tsv", "default Search Console TSV path should be auto-detected when CSV is absent");
    assert(defaultReport.inputs.searchConsoleCsvSource === "default", "default Search Console CSV source missing");
    assert(defaultReport.inputs.searchConsoleDefaultInputs.includes("reports/search-console.csv") && defaultReport.inputs.searchConsoleDefaultInputs.includes("reports/search-console.tsv"), "default Search Console input candidates missing");
    assert(defaultReport.inputs.adsenseCsv === "reports/adsense.tsv", "default AdSense TSV path should be auto-detected when CSV is absent");
    assert(defaultReport.inputs.adsenseCsvSource === "default", "default AdSense CSV source missing");
    assert(defaultReport.inputs.adsenseDefaultInputs.includes("reports/adsense.csv") && defaultReport.inputs.adsenseDefaultInputs.includes("reports/adsense.tsv"), "default AdSense input candidates missing");
    assert(defaultReport.searchConsoleOpportunities.some((row) => row.page === "/tools/jwt-decoder"), "default Search Console TSV should create opportunities");
  } finally {
    fs.rmSync(defaultSearchConsoleCsv, { force: true });
    fs.rmSync(defaultAdsenseCsv, { force: true });
    fs.rmSync(defaultSearchConsoleTsv, { force: true });
    fs.rmSync(defaultAdsenseTsv, { force: true });
  }
}

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
assert(markdownReport.includes("## Measured Export Plan"), "markdown report should include measured export plan section");
assert(markdownReport.includes("### Copy Targets"), "markdown report should include measured export copy targets");
assert(markdownReport.includes("reports/search-console.csv"), "markdown measured export plan should include default Search Console path");
assert(markdownReport.includes("Search Console page regex"), "markdown measured export plan should include Search Console regex copy target");
assert(markdownReport.includes("BOBOB_REQUIRED_MEASURED_PATHS"), "markdown measured export plan should include focused gate copy target");
assert(markdownReport.includes("Search Console CSV header"), "markdown measured export plan should include Search Console CSV header template");
assert(markdownReport.includes("AdSense CSV header"), "markdown measured export plan should include AdSense CSV header template");
assert(markdownReport.includes("## Metadata Rewrite Readiness"), "markdown report should include metadata rewrite readiness section");
assert(markdownReport.includes("needs-measured-data-first"), "markdown report should show metadata rewrite is not ready without measured coverage");
assert(markdownReport.includes("## Measurement Backlog"), "markdown report should include measurement backlog section");

const exportPacketRun = runReport({
  BOBOB_SEARCH_CONSOLE_CSV: searchConsoleCsv,
  BOBOB_ADSENSE_CSV: adsenseCsv,
  BOBOB_SEO_REPORT_FORMAT: "export-packet",
});
const exportPacket = exportPacketRun.stdout;
assert(exportPacket.includes("# Bob's Multi Tool Measured SEO Export Packet"), "export packet should have a clear title");
assert(exportPacket.includes("not approval to rewrite public title or description metadata"), "export packet should include the metadata rewrite stop rule");
assert(exportPacket.includes("## Search Console Page Regex"), "export packet should include Search Console regex copy target");
assert(exportPacket.includes("https://www\\.bobob\\.app/tools/regex-tester"), "export packet should include escaped core page regex values");
assert(exportPacket.includes("## Canonical URL Batch"), "export packet should include canonical URL batch");
assert(exportPacket.includes("https://www.bobob.app/tools/regex-tester"), "export packet should include canonical core URLs");
assert(exportPacket.includes("Page,Query,Impressions,Clicks,CTR,Position"), "export packet should include Search Console CSV header");
assert(exportPacket.includes("Page,Impressions,Page RPM,Estimated earnings,CTR"), "export packet should include AdSense CSV header");
assert(exportPacket.includes("BOBOB_REQUIRED_MEASURED_PATHS="), "export packet should include focused gate env copy target");
assert(exportPacket.includes("metadataRewriteReadiness.canRewritePublicMetadata"), "export packet should include metadata readiness stop rule");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("SEO opportunity report smoke passed.");
