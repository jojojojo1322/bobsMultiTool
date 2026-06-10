import { execFileSync } from "node:child_process";

const repo = process.env.BOBOB_GITHUB_REPO ?? "jojojojo1322/bobsMultiTool";
const sha =
  process.env.BOBOB_DEPLOY_SHA ??
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const mainContext = process.env.BOBOB_MAIN_VERCEL_CONTEXT ?? "Vercel – bobs-multi-tool-main";
const vercelProjectId = process.env.BOBOB_VERCEL_PROJECT_ID ?? "prj_WrsYIi8UQHDpPaBFgmWuxYXeshOD";
const vercelTeamId = process.env.BOBOB_VERCEL_TEAM_ID ?? "team_P8ix2Tih2GAvv8SF561aDrp6";
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
const requireMainDeployment = process.env.BOBOB_REQUIRE_MAIN_VERCEL === "1";

const headers = {
  "Accept": "application/vnd.github+json",
  "User-Agent": "bobob-deployment-status-harness",
};
const githubToken = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (githubToken) headers.Authorization = `Bearer ${githubToken}`;
const vercelToken = process.env.VERCEL_TOKEN;

let payload = { state: "unknown", statuses: [] };
let githubStatusError = null;
const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/status`, { headers });
if (response.ok) {
  payload = await response.json();
} else {
  githubStatusError = `${response.status} ${response.statusText}`;
}

const statuses = payload.statuses ?? [];
const mainStatus = statuses.find((status) => status.context === mainContext);
const legacyStatusSet = new Set(legacyContexts);
const legacyStatuses = statuses.filter((status) => legacyStatusSet.has(status.context));
const unknownFailures = statuses.filter(
  (status) => status.state !== "success" && status.context !== mainContext && !legacyStatusSet.has(status.context),
);
const failures = [];
let vercelProjectStatus = null;
let vercelLegacyProjects = [];
const vercelHeaders = vercelToken
  ? {
      "Authorization": `Bearer ${vercelToken}`,
      "User-Agent": "bobob-deployment-status-harness",
    }
  : null;

if (!mainStatus && vercelToken) {
  const projectResponse = await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}?teamId=${vercelTeamId}`, {
    headers: vercelHeaders,
  });
  if (projectResponse.ok) {
    const project = await projectResponse.json();
    const production = project.targets?.production;
    vercelProjectStatus = {
      projectId: project.id,
      projectName: project.name,
      source: "vercel-project-api",
      readyState: production?.readyState ?? null,
      readySubstate: production?.readySubstate ?? null,
      deploymentId: production?.id ?? null,
      deployedSha: production?.meta?.githubCommitSha ?? null,
      deployedMessage: production?.meta?.githubCommitMessage ?? null,
      aliases: production?.alias ?? [],
    };
  } else {
    vercelProjectStatus = {
      source: "vercel-project-api",
      error: `${projectResponse.status} ${projectResponse.statusText}`,
    };
  }
}

if (vercelToken && (strictNoLegacy || githubStatusError)) {
  const projectsResponse = await fetch(`https://api.vercel.com/v9/projects?teamId=${vercelTeamId}&limit=100`, {
    headers: vercelHeaders,
  });
  if (projectsResponse.ok) {
    const projectsPayload = await projectsResponse.json();
    const legacyProjectNames = new Set(legacyContexts.map((context) => context.replace("Vercel – ", "")));
    vercelLegacyProjects = (projectsPayload.projects ?? [])
      .filter((project) => legacyProjectNames.has(project.name))
      .map((project) => ({ id: project.id, name: project.name }));
  } else if (strictNoLegacy) {
    failures.push(`Vercel projects fallback failed: ${projectsResponse.status} ${projectsResponse.statusText}`);
  }
}

if (!mainStatus) {
  if (vercelProjectStatus?.readyState === "READY" && vercelProjectStatus.deployedSha === sha) {
    // GitHub may omit project-specific contexts after stale projects are removed.
  } else if (requireMainDeployment) {
    failures.push(`missing main Vercel status context: ${mainContext}`);
  }
} else if (mainStatus.state !== "success") {
  failures.push(`main Vercel deployment is ${mainStatus.state}: ${mainStatus.description ?? "(no description)"}`);
}

if (requireMainDeployment) {
  if (!mainStatus && !vercelToken) {
    failures.push("BOBOB_REQUIRE_MAIN_VERCEL=1 needs VERCEL_TOKEN so the harness can verify the Vercel project fallback.");
  }
  if (vercelProjectStatus?.error) {
    failures.push(`Vercel project fallback failed: ${vercelProjectStatus.error}`);
  }
  if (vercelProjectStatus && vercelProjectStatus.readyState !== "READY") {
    failures.push(`main Vercel project is not READY: ${vercelProjectStatus.readyState ?? "(missing)"}`);
  }
  if (vercelProjectStatus && vercelProjectStatus.deployedSha !== sha) {
    failures.push(`main Vercel project deployed ${vercelProjectStatus.deployedSha ?? "(missing sha)"} instead of ${sha}`);
  }
}
if (strictNoLegacy && githubStatusError && !vercelToken) {
  failures.push("BOBOB_REQUIRE_NO_LEGACY_VERCEL=1 needs GitHub status access or VERCEL_TOKEN fallback when the GitHub status API is unavailable.");
}

if (unknownFailures.length) {
  failures.push(`unknown failing status contexts: ${unknownFailures.map((status) => status.context).join(", ")}`);
}

if (strictNoLegacy && legacyStatuses.length) {
  failures.push(`legacy Vercel status contexts still attached: ${legacyStatuses.map((status) => status.context).join(", ")}`);
}
if (strictNoLegacy && vercelLegacyProjects.length) {
  failures.push(`legacy Vercel projects still exist: ${vercelLegacyProjects.map((project) => project.name).join(", ")}`);
}

const report = {
  repo,
  sha,
  overallState: payload.state,
  githubStatusError,
  mainStatus: mainStatus
    ? {
        context: mainStatus.context,
        state: mainStatus.state,
        description: mainStatus.description,
        targetUrl: mainStatus.target_url,
      }
    : null,
  vercelProjectStatus,
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
  vercelLegacyProjectCount: vercelLegacyProjects.length,
  vercelLegacyProjects,
  strictNoLegacy,
  requireMainDeployment,
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
} else if (!mainStatus && vercelProjectStatus?.readyState === "READY" && vercelProjectStatus.deployedSha === sha) {
  console.log("Deployment status harness passed using Vercel project API fallback, with no legacy Vercel status contexts.");
} else if (!mainStatus) {
  console.warn("No GitHub main Vercel status context was found. Set VERCEL_TOKEN and BOBOB_REQUIRE_MAIN_VERCEL=1 for a strict Vercel project check.");
  if (githubStatusError) {
    console.warn(`GitHub status API was unavailable: ${githubStatusError}`);
  }
} else {
  console.log("Deployment status harness passed with no legacy Vercel status contexts.");
}
