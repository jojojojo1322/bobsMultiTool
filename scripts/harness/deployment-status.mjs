import { execFileSync } from "node:child_process";

const repo = process.env.BOBOB_GITHUB_REPO ?? "jojojojo1322/bobsMultiTool";
const sha =
  process.env.BOBOB_DEPLOY_SHA ??
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const mainContext = process.env.BOBOB_MAIN_VERCEL_CONTEXT ?? "Vercel – bobs-multi-tool-main";
const legacyContexts = (
  process.env.BOBOB_LEGACY_VERCEL_CONTEXTS ??
  [
    "Vercel – bobs-multi-tool-cron-generator",
    "Vercel – bobs-multi-tool-lorem-generator",
    "Vercel – bobs-multi-tool-iframe-viewer",
    "Vercel – bobs-multi-tool-regax",
    "Vercel – bobs-multi-tool-meta-generator",
  ].join(",")
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const strictNoLegacy = process.env.BOBOB_REQUIRE_NO_LEGACY_VERCEL === "1";

const headers = {
  "Accept": "application/vnd.github+json",
  "User-Agent": "bobob-deployment-status-harness",
};
const githubToken = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/status`, { headers });
if (!response.ok) {
  throw new Error(`GitHub status request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const statuses = payload.statuses ?? [];
const mainStatus = statuses.find((status) => status.context === mainContext);
const legacyStatusSet = new Set(legacyContexts);
const legacyStatuses = statuses.filter((status) => legacyStatusSet.has(status.context));
const unknownFailures = statuses.filter(
  (status) => status.state !== "success" && status.context !== mainContext && !legacyStatusSet.has(status.context),
);
const failures = [];

if (!mainStatus) {
  failures.push(`missing main Vercel status context: ${mainContext}`);
} else if (mainStatus.state !== "success") {
  failures.push(`main Vercel deployment is ${mainStatus.state}: ${mainStatus.description ?? "(no description)"}`);
}

if (unknownFailures.length) {
  failures.push(`unknown failing status contexts: ${unknownFailures.map((status) => status.context).join(", ")}`);
}

if (strictNoLegacy && legacyStatuses.length) {
  failures.push(`legacy Vercel status contexts still attached: ${legacyStatuses.map((status) => status.context).join(", ")}`);
}

const report = {
  repo,
  sha,
  overallState: payload.state,
  mainStatus: mainStatus
    ? {
        context: mainStatus.context,
        state: mainStatus.state,
        description: mainStatus.description,
        targetUrl: mainStatus.target_url,
      }
    : null,
  legacyStatusCount: legacyStatuses.length,
  legacyStatuses: legacyStatuses.map((status) => ({
    context: status.context,
    state: status.state,
    description: status.description,
    targetUrl: status.target_url,
  })),
  unknownFailures: unknownFailures.map((status) => ({
    context: status.context,
    state: status.state,
    description: status.description,
    targetUrl: status.target_url,
  })),
  strictNoLegacy,
  nextActions: legacyStatuses.length
    ? [
        "In Vercel, unlink or delete the legacy projects listed in docs/vercel-legacy-project-cleanup.md.",
        "Keep bobs-multi-tool-main connected to the repository.",
        "After cleanup, run BOBOB_REQUIRE_NO_LEGACY_VERCEL=1 npm run harness:deployment-status.",
      ]
    : [],
};

console.log(JSON.stringify(report, null, 2));

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

if (legacyStatuses.length) {
  console.warn(`Main deployment is healthy, but ${legacyStatuses.length} legacy Vercel project status context(s) still need external cleanup.`);
} else {
  console.log("Deployment status harness passed with no legacy Vercel status contexts.");
}
