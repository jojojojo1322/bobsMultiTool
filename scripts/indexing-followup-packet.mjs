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
const searchConsoleProperty = "https://www.bobob.app/";
const searchConsoleResource = encodeURIComponent(searchConsoleProperty);
const searchConsoleSitemapsUrl = `https://search.google.com/u/1/search-console/sitemaps?resource_id=${searchConsoleResource}&pageId=none`;
const bingWebmasterUrl = "https://www.bing.com/webmasters/";
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

function latestSitemapDiscoveredPages(log) {
  const matches = [...log.matchAll(/\/sitemaps\/en[^\n]*discovered pages `(\d+)`/g)];
  return matches.length ? Number.parseInt(matches[matches.length - 1][1], 10) : null;
}

function latestPendingSearchConsoleCount(log) {
  const matches = [...log.matchAll(/Search Console pending live sitemap URL count: `(\d+)`/g)];
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
  };

  return {
    checks,
    sitemapUrls,
    sitemapIndexUrls,
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
  const pendingSearchConsoleCount = latestPendingSearchConsoleCount(log);

  for (const [key, value] of Object.entries(checks)) {
    if (value === false || value === 0) failures.push(`discovery check failed: ${key}`);
  }
  if (latestIndexNowCount !== null && checks.sitemapUrlCount !== latestIndexNowCount) {
    failures.push(`live sitemap URL count ${checks.sitemapUrlCount} should match latest logged IndexNow count ${latestIndexNowCount}`);
  }
  if (latestDiscoveredPages !== null && checks.sitemapUrlCount !== latestDiscoveredPages && checks.sitemapUrlCount !== pendingSearchConsoleCount) {
    failures.push(`live sitemap URL count ${checks.sitemapUrlCount} should match latest logged Search Console discovered pages ${latestDiscoveredPages}`);
  }
  for (const fragment of ["`2026-07-02`", "`2026-07-09`", "Bing Webmaster recommendations", "not be treated as indexed or search-ready"]) {
    if (!log.includes(fragment)) failures.push(`observation log missing follow-up fragment: ${fragment}`);
  }

  if (failures.length) {
    throw new Error(failures.join("\n"));
  }
}

function assertPacket(packet, snapshot, log) {
  const initialDiscoveredPages = firstSitemapDiscoveredPages(log);
  const latestDiscoveredPages = latestSitemapDiscoveredPages(log);
  const latestIndexNowCount = latestLoggedCount(log, "IndexNow submitted URL count");
  const pendingSearchConsoleCount = latestPendingSearchConsoleCount(log);
  const liveSitemapUrlCount = snapshot.checks.sitemapUrlCount;
  const requiredFragments = [
    `Initial Search Console discovered pages baseline: \`${initialDiscoveredPages ?? "not parsed"}\``,
    `Latest Search Console discovered pages after resubmission: \`${latestDiscoveredPages ?? "not parsed"}\``,
    `Search Console pending live sitemap URL count: \`${pendingSearchConsoleCount ?? "not parsed"}\``,
    "Chrome profile/session already signed in as `bobob935@gmail.com`",
    `same-day post-expansion sitemap resubmission: /sitemaps/en discovered pages ${latestDiscoveredPages ?? "not parsed"}`,
    `live sitemap URL count ${liveSitemapUrlCount}`,
    `latest IndexNow URL count ${latestIndexNowCount ?? "not parsed"}`,
  ];
  const missing = requiredFragments.filter((fragment) => !packet.includes(fragment));
  if (missing.length) throw new Error(`indexing follow-up packet missing current-count guidance:\n${missing.join("\n")}`);
}

function renderPacket(snapshot, log) {
  const latestIndexNowCount = latestLoggedCount(log, "IndexNow submitted URL count");
  const initialDiscoveredPages = firstSitemapDiscoveredPages(log);
  const latestDiscoveredPages = latestSitemapDiscoveredPages(log);
  const pendingSearchConsoleCount = latestPendingSearchConsoleCount(log);
  const checks = snapshot.checks;

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
    `- Live /sitemaps/en URL count: \`${checks.sitemapUrlCount}\``,
    `- Latest logged IndexNow URL count: \`${latestIndexNowCount ?? "not parsed"}\``,
    `- Initial Search Console discovered pages baseline: \`${initialDiscoveredPages ?? "not parsed"}\``,
    `- Latest Search Console discovered pages after resubmission: \`${latestDiscoveredPages ?? "not parsed"}\``,
    `- Search Console pending live sitemap URL count: \`${pendingSearchConsoleCount ?? "not parsed"}\``,
    `- Feed counts: RSS \`${checks.rssItemCount}\`, Atom \`${checks.atomEntryCount}\`, JSON Feed \`${checks.jsonFeedItemCount}\``,
    `- WebSub discovery: \`${checks.webSubDiscovery ? "ok" : "check"}\``,
    `- robots.txt sitemap: \`${checks.robotsSitemap ? "ok" : "check"}\``,
    `- OpenSearch descriptor: \`${checks.opensearch ? "ok" : "check"}\``,
    `- llms.txt discovery section: \`${checks.llmsDiscovery ? "ok" : "check"}\``,
    "",
    "## Google Search Console Check",
    "",
    `- Account to use: \`bobob935@gmail.com\``,
    "- Browser session: use the Chrome profile/session already signed in as `bobob935@gmail.com`; do not inspect Search Console from another signed-in Chrome profile.",
    `- Property: \`${searchConsoleProperty}\``,
    `- Sitemaps report: ${searchConsoleSitemapsUrl}`,
    `- Compare against the 2026-06-25 baseline: clicks 0, impressions 0, indexed pages 0, not indexed pages 5, initial /sitemaps/en discovered pages ${initialDiscoveredPages ?? "not parsed"}.`,
    `- Also compare against the same-day post-expansion sitemap resubmission: /sitemaps/en discovered pages ${latestDiscoveredPages ?? "not parsed"}, live sitemap URL count ${checks.sitemapUrlCount}, latest IndexNow URL count ${latestIndexNowCount ?? "not parsed"}.`,
    `- If Search Console still shows ${latestDiscoveredPages ?? "not parsed"} discovered pages, resubmit or refresh /sitemaps/en for the pending ${pendingSearchConsoleCount ?? "not parsed"} URL live sitemap set before interpreting the next observation window.`,
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
    "## Commands Before The Manual Check",
    "",
    "```bash",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:live-discovery",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:indexing-observation",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:indexnow",
    "NODE_TLS_REJECT_UNAUTHORIZED=0 npm run harness:websub",
    "npm run seo:indexing-followup",
    "```",
    "",
    "## Stop Rule",
    "",
    "- Do not mark search readiness complete from deployment, sitemap fetch, WebSub 204, or IndexNow 200 alone.",
    "- The next completion evidence must be changed Search Console/Bing numbers or measured exports that cover the submitted Blog + Play URL set.",
    "",
  ].join("\n");
}

const log = fs.readFileSync(logPath, "utf8");
const snapshot = await snapshotDiscovery();
assertSnapshot(snapshot, log);
const packet = renderPacket(snapshot, log);
assertPacket(packet, snapshot, log);

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
