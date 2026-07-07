import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const argValue = (name) => args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1);
const hasArg = (name) => args.includes(name);

const canonicalBaseUrl = "https://www.bobob.app";
const baseUrl = (argValue("--base-url") || process.env.BOBOB_INDEXING_PACKET_BASE_URL || canonicalBaseUrl).replace(/\/$/, "");
const outputPath = argValue("--out") || process.env.BOBOB_INDEXING_PACKET_OUT;
const checkOnly = hasArg("--check");
const logPath = path.join(root, "docs/search-indexing-observation-log.md");
const discoveryRegistrationPath = path.join(root, "docs/search-discovery-registration.md");
const searchConsoleProperty = "sc-domain:bobob.app";
const searchConsoleResource = encodeURIComponent(searchConsoleProperty);
const searchConsoleSitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${searchConsoleResource}&hl=ko`;
const searchConsoleIndexUrl = `https://search.google.com/search-console/index?resource_id=${searchConsoleResource}&hl=ko`;
const bingWebmasterUrl = "https://www.bing.com/webmasters/";
const naverSearchAdvisorUrl = "https://searchadvisor.naver.com/";
const retiredSitemapPaths = [
  "/sitemaps/ko",
  "/sitemaps/ja",
  "/sitemaps/zh-CN",
  "/sitemaps/zh-TW",
  "/sitemaps/es",
  "/sitemaps/pt-BR",
  "/sitemaps/de",
  "/sitemaps/fr",
  "/sitemaps/hi",
  "/sitemaps/id",
  "/sitemaps/vi",
  "/sitemaps/th",
  "/sitemaps/ar",
];
const retiredSitemapDestination = `${canonicalBaseUrl}/sitemaps/en`;
const representativeUrls = [
  `${canonicalBaseUrl}/`,
  `${canonicalBaseUrl}/blog`,
  `${canonicalBaseUrl}/play`,
  `${canonicalBaseUrl}/blog/ai-side-project-realistic-order`,
  `${canonicalBaseUrl}/blog/search-console-misreads-for-indie-devs`,
  `${canonicalBaseUrl}/play/office-survival`,
  `${canonicalBaseUrl}/play/prompt-cleanup`,
  `${canonicalBaseUrl}/tools`,
];

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function countMatches(source, pattern) {
  return (source.match(pattern) ?? []).length;
}

function latestLoggedCount(log, label) {
  const matches = [...log.matchAll(new RegExp(`${label}: \`(\\d+)\``, "g"))];
  return matches.length ? Number.parseInt(matches[matches.length - 1][1], 10) : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function latestRegisteredCount(registration, label) {
  const matches = [...registration.matchAll(new RegExp(`${escapeRegExp(label)}: \`(\\d+)\``, "g"))];
  return matches.length ? Number.parseInt(matches[matches.length - 1][1], 10) : null;
}

function sourceTargets(registration) {
  return {
    sitemapUrlCount: latestRegisteredCount(registration, "Current submitted sitemap source target URL count"),
    feedItemCount: latestRegisteredCount(registration, "Current feed source target item count"),
    representativeBlogCount: latestRegisteredCount(registration, "Current representative Blog count"),
    playCount: latestRegisteredCount(registration, "Current Play count"),
  };
}

function targetStatus(liveCount, targetCount) {
  if (targetCount === null) {
    return {
      label: "not parsed",
      gap: "not parsed",
    };
  }
  const gap = targetCount - liveCount;
  return {
    label: gap === 0 ? "aligned" : "pending deployment",
    gap,
  };
}

function feedTargetStatus(checks, targetCount) {
  if (targetCount === null) {
    return {
      label: "not parsed",
      gap: "not parsed",
    };
  }
  const feedCounts = [checks.rssItemCount, checks.atomEntryCount, checks.jsonFeedItemCount];
  const aligned = feedCounts.every((count) => count === targetCount);
  return {
    label: aligned ? "aligned" : "pending deployment",
    gap: targetCount - Math.min(...feedCounts),
  };
}

function latestSitemapDiscoveredPages(log) {
  const matches = [...log.matchAll(/\/sitemaps\/en[^\n]*discovered pages `(\d+)`/g)];
  return matches.length ? Number.parseInt(matches[matches.length - 1][1], 10) : null;
}

function firstSitemapDiscoveredPages(log) {
  const match = log.match(/\/sitemaps\/en[^\n]*discovered pages `(\d+)`/);
  return match ? Number.parseInt(match[1], 10) : null;
}

async function fetchText(routePath, accept = "text/plain,*/*") {
  const response = await fetch(`${baseUrl}${routePath}`, {
    headers: {
      "user-agent": "BobobIndexingFollowupPacket/1.0",
      accept,
    },
  });
  if (!response.ok) throw new Error(`${routePath} returned ${response.status}`);
  return {
    body: await response.text(),
    contentType: response.headers.get("content-type") ?? "",
  };
}

async function fetchRedirect(routePath) {
  const response = await fetch(`${baseUrl}${routePath}`, {
    headers: {
      "user-agent": "BobobIndexingFollowupPacket/1.0",
      accept: "application/xml,text/xml,*/*",
    },
    redirect: "manual",
  });
  return {
    path: routePath,
    status: response.status,
    location: response.headers.get("location") ?? "",
  };
}

async function snapshotDiscovery() {
  const [home, robots, sitemapIndex, sitemap, rss, atom, jsonFeedResponse, llms, opensearch] = await Promise.all([
    fetchText("/", "text/html,*/*"),
    fetchText("/robots.txt"),
    fetchText("/sitemap.xml", "application/xml,text/xml,*/*"),
    fetchText("/sitemaps/en", "application/xml,text/xml,*/*"),
    fetchText("/feed.xml", "application/rss+xml,application/xml,text/xml,*/*"),
    fetchText("/atom.xml", "application/atom+xml,application/xml,text/xml,*/*"),
    fetchText("/feed.json", "application/json,*/*"),
    fetchText("/llms.txt"),
    fetchText("/opensearch.xml", "application/opensearchdescription+xml,application/xml,text/xml,*/*"),
  ]);
  const jsonFeed = JSON.parse(jsonFeedResponse.body);
  const sitemapUrls = xmlLocs(sitemap.body);
  const sitemapIndexUrls = xmlLocs(sitemapIndex.body);
  const rssItemCount = countMatches(rss.body, /<item>/g);
  const atomEntryCount = countMatches(atom.body, /<entry>/g);
  const jsonFeedItemCount = Array.isArray(jsonFeed.items) ? jsonFeed.items.length : 0;
  const retiredSitemapRedirects = await Promise.all(retiredSitemapPaths.map((routePath) => fetchRedirect(routePath)));
  const retiredSitemapRedirectCount = retiredSitemapRedirects.filter(
    (redirect) => redirect.status === 308 && redirect.location === retiredSitemapDestination,
  ).length;
  const checks = {
    homeFeedDiscovery: home.body.includes('rel="alternate" type="application/rss+xml"') && home.body.includes('rel="search" type="application/opensearchdescription+xml"'),
    robotsSitemap: robots.body.includes(`${canonicalBaseUrl}/sitemap.xml`),
    sitemapIndex: sitemapIndex.body.includes("<sitemapindex") && sitemapIndexUrls.includes(`${canonicalBaseUrl}/sitemaps/en`),
    sitemapUrlCount: sitemapUrls.length,
    rssItemCount,
    atomEntryCount,
    jsonFeedItemCount,
    feedCountsAligned: rssItemCount === atomEntryCount && rssItemCount === jsonFeedItemCount,
    webSubDiscovery: rss.body.includes('rel="hub"') && atom.body.includes('rel="hub"') && jsonFeed.hubs?.some((hub) => hub.type === "WebSub"),
    llmsDiscovery: llms.body.includes("## Discovery") && llms.body.includes(`${canonicalBaseUrl}/sitemap.xml`),
    opensearch: opensearch.body.includes("/search?q={searchTerms}"),
    retiredSitemapRedirectsAligned: retiredSitemapRedirectCount === retiredSitemapPaths.length,
  };

  return {
    checks,
    sitemapUrls,
    sitemapIndexUrls,
    retiredSitemapRedirects,
    retiredSitemapRedirectCount,
    contentTypes: {
      rss: rss.contentType,
      atom: atom.contentType,
      jsonFeed: jsonFeedResponse.contentType,
      llms: llms.contentType,
      opensearch: opensearch.contentType,
    },
  };
}

function assertSnapshot(snapshot, log) {
  const failures = [];
  const checks = snapshot.checks;
  const latestIndexNowCount = latestLoggedCount(log, "IndexNow submitted URL count");
  const latestDiscoveredPages = latestSitemapDiscoveredPages(log);
  const failedRetiredRedirects = snapshot.retiredSitemapRedirects.filter(
    (redirect) => redirect.status !== 308 || redirect.location !== retiredSitemapDestination,
  );

  for (const [key, value] of Object.entries(checks)) {
    if (value === false || value === 0) failures.push(`discovery check failed: ${key}`);
  }
  for (const redirect of failedRetiredRedirects) {
    failures.push(
      `retired sitemap redirect failed: ${redirect.path} returned ${redirect.status} to ${redirect.location || "(empty)"}, expected 308 to ${retiredSitemapDestination}`,
    );
  }
  if (latestIndexNowCount !== null && checks.sitemapUrlCount !== latestIndexNowCount) {
    failures.push(`live sitemap URL count ${checks.sitemapUrlCount} should match latest logged IndexNow count ${latestIndexNowCount}`);
  }
  for (const fragment of [
    "`2026-07-02`",
    "`2026-07-09`",
    "Bing Webmaster recommendations",
    "Naver Search Advisor still needs a signed-in pass",
    "not be treated as indexed or search-ready",
  ]) {
    if (!log.includes(fragment)) failures.push(`observation log missing follow-up fragment: ${fragment}`);
  }

  if (failures.length) {
    throw new Error(failures.join("\n"));
  }
}

function assertPacket(packet, snapshot, log, registration) {
  const initialDiscoveredPages = firstSitemapDiscoveredPages(log);
  const latestDiscoveredPages = latestSitemapDiscoveredPages(log);
  const latestIndexNowCount = latestLoggedCount(log, "IndexNow submitted URL count");
  const targets = sourceTargets(registration);
  const liveSitemapUrlCount = snapshot.checks.sitemapUrlCount;
  const liveSitemapStatus = targetStatus(liveSitemapUrlCount, targets.sitemapUrlCount);
  const liveFeedStatus = feedTargetStatus(snapshot.checks, targets.feedItemCount);
  const searchConsoleGap = latestDiscoveredPages === null ? "not parsed" : liveSitemapUrlCount - latestDiscoveredPages;
  const retiredSitemapStatus =
    snapshot.retiredSitemapRedirectCount === retiredSitemapPaths.length ? "aligned" : "check";
  const requiredFragments = [
    `Source /sitemaps/en target: \`${targets.sitemapUrlCount ?? "not parsed"}\``,
    `Source feed target: \`${targets.feedItemCount ?? "not parsed"}\``,
    `Source-vs-live sitemap status: \`${liveSitemapStatus.label}\``,
    `Source-vs-live feed status: \`${liveFeedStatus.label}\``,
    `Initial Search Console discovered pages baseline: \`${initialDiscoveredPages ?? "not parsed"}\``,
    `Latest Search Console discovered pages after resubmission: \`${latestDiscoveredPages ?? "not parsed"}\``,
    `Search Console discovered-vs-live gap: \`${searchConsoleGap}\``,
    `Retired locale sitemap redirects: \`${retiredSitemapStatus}\``,
    `Retired redirect sample: \`/sitemaps/ar\` -> \`308\` \`${retiredSitemapDestination}\``,
    "## Deployment Gate",
    "Do not resubmit `/sitemaps/en`, run IndexNow/WebSub submit commands, or request AdSense re-review until live counts match the source targets.",
    "Chrome profile/session already signed in as `bobob935@gmail.com`",
    `same-day post-expansion sitemap resubmission: /sitemaps/en discovered pages ${latestDiscoveredPages ?? "not parsed"}`,
    `live sitemap URL count ${liveSitemapUrlCount}`,
    `latest IndexNow URL count ${latestIndexNowCount ?? "not parsed"}`,
    "## Naver Search Advisor Check",
    "Naver Search Advisor checklist",
    "If Naver still shows old locale sitemap rows",
    `Property: \`${searchConsoleProperty}\``,
    `Sitemaps report: ${searchConsoleSitemapsUrl}`,
    `Page indexing report: ${searchConsoleIndexUrl}`,
  ];
  const missing = requiredFragments.filter((fragment) => !packet.includes(fragment));
  if (missing.length) throw new Error(`indexing follow-up packet missing current-count guidance:\n${missing.join("\n")}`);
  if (targets.sitemapUrlCount === null || targets.feedItemCount === null) {
    throw new Error("indexing follow-up packet could not parse source sitemap/feed targets");
  }
}

function renderPacket(snapshot, log, registration) {
  const latestIndexNowCount = latestLoggedCount(log, "IndexNow submitted URL count");
  const initialDiscoveredPages = firstSitemapDiscoveredPages(log);
  const latestDiscoveredPages = latestSitemapDiscoveredPages(log);
  const checks = snapshot.checks;
  const targets = sourceTargets(registration);
  const liveSitemapStatus = targetStatus(checks.sitemapUrlCount, targets.sitemapUrlCount);
  const liveFeedStatus = feedTargetStatus(checks, targets.feedItemCount);
  const deploymentGateStatus =
    liveSitemapStatus.label === "aligned" && liveFeedStatus.label === "aligned" ? "ready" : "blocked";
  const searchConsoleGap = latestDiscoveredPages === null ? "not parsed" : checks.sitemapUrlCount - latestDiscoveredPages;
  const retiredSitemapStatus =
    snapshot.retiredSitemapRedirectCount === retiredSitemapPaths.length ? "aligned" : "check";
  const retiredSitemapSample =
    snapshot.retiredSitemapRedirects.find((redirect) => redirect.path === "/sitemaps/ar") ?? snapshot.retiredSitemapRedirects[0];

  return [
    "# bobob.app Indexing Follow-up Packet",
    "",
    "This packet is for the next manual indexing pass. It does not prove indexing by itself.",
    "",
    "## Current Discovery Snapshot",
    "",
    `- Base URL checked: \`${baseUrl}\``,
    `- Canonical property: \`${searchConsoleProperty}\``,
    `- Sitemap index entries: \`${snapshot.sitemapIndexUrls.length}\``,
    `- Source /sitemaps/en target: \`${targets.sitemapUrlCount ?? "not parsed"}\``,
    `- Live /sitemaps/en URL count: \`${checks.sitemapUrlCount}\``,
    `- Source-vs-live sitemap status: \`${liveSitemapStatus.label}\` (target-live gap \`${liveSitemapStatus.gap}\`)`,
    `- Source feed target: \`${targets.feedItemCount ?? "not parsed"}\``,
    `- Latest logged IndexNow URL count: \`${latestIndexNowCount ?? "not parsed"}\``,
    `- Initial Search Console discovered pages baseline: \`${initialDiscoveredPages ?? "not parsed"}\``,
    `- Latest Search Console discovered pages after resubmission: \`${latestDiscoveredPages ?? "not parsed"}\``,
    `- Search Console discovered-vs-live gap: \`${searchConsoleGap}\``,
    `- Retired locale sitemap redirects: \`${retiredSitemapStatus}\` (${snapshot.retiredSitemapRedirectCount}/${retiredSitemapPaths.length} to \`${retiredSitemapDestination}\`)`,
    `- Retired redirect sample: \`${retiredSitemapSample.path}\` -> \`${retiredSitemapSample.status}\` \`${retiredSitemapSample.location || "(empty)"}\``,
    `- Feed counts: RSS \`${checks.rssItemCount}\`, Atom \`${checks.atomEntryCount}\`, JSON Feed \`${checks.jsonFeedItemCount}\``,
    `- Source-vs-live feed status: \`${liveFeedStatus.label}\` (target-min-live gap \`${liveFeedStatus.gap}\`)`,
    `- Representative Blog source count: \`${targets.representativeBlogCount ?? "not parsed"}\``,
    `- Play source count: \`${targets.playCount ?? "not parsed"}\``,
    `- WebSub discovery: \`${checks.webSubDiscovery ? "ok" : "check"}\``,
    `- robots.txt sitemap: \`${checks.robotsSitemap ? "ok" : "check"}\``,
    `- OpenSearch descriptor: \`${checks.opensearch ? "ok" : "check"}\``,
    `- llms.txt discovery section: \`${checks.llmsDiscovery ? "ok" : "check"}\``,
    "",
    "## Deployment Gate",
    "",
    `- Deployment gate: \`${deploymentGateStatus}\``,
    "- Do not resubmit `/sitemaps/en`, run IndexNow/WebSub submit commands, or request AdSense re-review until live counts match the source targets.",
    `- Current gate check: source sitemap target \`${targets.sitemapUrlCount ?? "not parsed"}\` vs live \`${checks.sitemapUrlCount}\`; source feed target \`${targets.feedItemCount ?? "not parsed"}\` vs live RSS/Atom/JSON \`${checks.rssItemCount}/${checks.atomEntryCount}/${checks.jsonFeedItemCount}\`.`,
    "",
    "## Google Search Console Check",
    "",
    `- Account to use: \`bobob935@gmail.com\``,
    "- Browser session: use the Chrome profile/session already signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.",
    `- Property: \`${searchConsoleProperty}\``,
    `- Sitemaps report: ${searchConsoleSitemapsUrl}`,
    `- Page indexing report: ${searchConsoleIndexUrl}`,
    "- Compare this domain-property view against older URL-prefix rows only when reviewing historical observations.",
    `- Compare against the 2026-06-25 baseline: clicks 0, impressions 0, indexed pages 0, not indexed pages 5, initial /sitemaps/en discovered pages ${initialDiscoveredPages ?? "not parsed"}.`,
    `- Also compare against the same-day post-expansion sitemap resubmission: /sitemaps/en discovered pages ${latestDiscoveredPages ?? "not parsed"}, live sitemap URL count ${checks.sitemapUrlCount}, latest IndexNow URL count ${latestIndexNowCount ?? "not parsed"}.`,
    "- Record whether `리디렉션이 포함된 페이지` and `적절한 표준 태그가 포함된 대체 페이지` changed, disappeared, or gained sample URLs.",
    "- If impressions appear, export Search Console Page + Query rows to `reports/search-console.csv` or `reports/search-console.tsv` and run `npm run harness:seo-opportunities`.",
    "",
    "### URL Inspection Targets",
    "",
    ...representativeUrls.map((url) => `- ${url}`),
    "",
    "## Bing Webmaster Check",
    "",
    `- Open: ${bingWebmasterUrl}`,
    "- Check SEO recommendations before calling the indexing loop complete.",
    "- Watch for the prior issue classes: missing h1, duplicate title, duplicate description, insufficient content, and weak inbound-link signals.",
    "- If Bing shows page-level examples, compare them against the live rendered route before changing public metadata.",
    "",
    "## Naver Search Advisor Check",
    "",
    `- Open: ${naverSearchAdvisorUrl}`,
    "- Naver Search Advisor checklist: confirm the `https://www.bobob.app` site property, sitemap submission state, robots.txt state, and representative URL collection/request status.",
    "- If Naver still shows old locale sitemap rows, record whether rows such as `sitemaps/ar`, `sitemaps/th`, and `sitemaps/zh-CN` now resolve through the 308 redirect to `/sitemaps/en` instead of dead XML routes.",
    "- If a page collection request is submitted, record the exact date, URL, and UI confirmation in `docs/search-indexing-observation-log.md`.",
    "- Do not treat a Naver page collection request or sitemap submission as indexing proof; compare later collection/indexing evidence separately.",
    "",
    "## Commands Before The Manual Check",
    "",
    "```bash",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:indexing-observation",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:indexnow",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:websub",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run seo:indexing-followup",
    "```",
    "",
    "## Stop Rule",
    "",
    "- Do not mark search readiness complete from deployment, sitemap fetch, WebSub 204, IndexNow 200, or a Naver collection request alone.",
    "- Do not begin the manual submission loop or AdSense re-review while the deployment gate is `blocked`.",
    "- The next completion evidence must be changed Search Console/Bing/Naver numbers or measured exports that cover the submitted Blog + Play URL set.",
    "",
  ].join("\n");
}

const log = fs.readFileSync(logPath, "utf8");
const registration = fs.readFileSync(discoveryRegistrationPath, "utf8");
const snapshot = await snapshotDiscovery();
assertSnapshot(snapshot, log);
const packet = renderPacket(snapshot, log, registration);
assertPacket(packet, snapshot, log, registration);

if (checkOnly) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        baseUrl,
        sitemapUrlCount: snapshot.checks.sitemapUrlCount,
        rssItemCount: snapshot.checks.rssItemCount,
        atomEntryCount: snapshot.checks.atomEntryCount,
        jsonFeedItemCount: snapshot.checks.jsonFeedItemCount,
        retiredSitemapRedirects: `${snapshot.retiredSitemapRedirectCount}/${retiredSitemapPaths.length}`,
      },
      null,
      2,
    ),
  );
} else if (outputPath) {
  fs.mkdirSync(path.dirname(path.resolve(root, outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(root, outputPath), packet);
  console.log(`Wrote ${outputPath}`);
} else {
  console.log(packet);
}
