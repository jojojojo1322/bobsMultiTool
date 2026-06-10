import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const defaultSearchCsvRelativePath = "reports/search-console.csv";
const defaultAdsenseCsvRelativePath = "reports/adsense.csv";
function resolveCsvInput(envName, defaultRelativePath) {
  const explicitPath = process.env[envName];
  if (explicitPath) {
    return { path: explicitPath, displayPath: explicitPath, source: envName, defaultPath: defaultRelativePath };
  }
  const defaultPath = path.join(root, defaultRelativePath);
  if (fs.existsSync(defaultPath)) {
    return { path: defaultPath, displayPath: defaultRelativePath, source: "default", defaultPath: defaultRelativePath };
  }
  return { path: undefined, displayPath: null, source: "missing", defaultPath: defaultRelativePath };
}
const searchCsvInput = resolveCsvInput("BOBOB_SEARCH_CONSOLE_CSV", defaultSearchCsvRelativePath);
const adsenseCsvInput = resolveCsvInput("BOBOB_ADSENSE_CSV", defaultAdsenseCsvRelativePath);
const searchCsvPath = searchCsvInput.path;
const adsenseCsvPath = adsenseCsvInput.path;
const reportFormat = process.env.BOBOB_SEO_REPORT_FORMAT ?? "json";
const reportOutputPath = process.env.BOBOB_SEO_REPORT_OUT;
const minImpressions = Number(process.env.BOBOB_MIN_IMPRESSIONS ?? 100);
const lowCtr = Number(process.env.BOBOB_LOW_CTR ?? 0.025);
const lowRpm = Number(process.env.BOBOB_LOW_RPM ?? 1);
const localePrefix = /^\/(?:ko|ja|zh-CN|zh-TW|es|pt-BR|de|fr|hi|id|vi|th|ar)(?=\/)/;
const inputWarnings = [];
const clusterByCategory = {
  Text: "text-cleanup",
  Code: "code-formatting",
  Web: "web-debugging",
  Data: "data-conversion",
  Time: "time-scheduling",
  Security: "security-generators",
  Color: "color-css",
  SEO: "seo-webmaster",
  Network: "network-debugging",
};

function parseCsvTable(source) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (!rows.length) return { headers: [], rows: [] };
  const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]+/g, ""));
  return {
    headers,
    rows: rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))),
  };
}

function hasAnyHeader(headers, aliases) {
  return aliases.some((alias) => headers.includes(alias.toLowerCase().replace(/[^a-z0-9]+/g, "")));
}

function readCsvTable(csvPath, label, requiredHeaderGroups, recommendedHeaderGroups) {
  const table = parseCsvTable(fs.readFileSync(csvPath, "utf8"));
  if (!table.headers.length) {
    inputWarnings.push(`${label} CSV has no header row or parseable rows.`);
    return table;
  }
  for (const aliases of requiredHeaderGroups) {
    if (!hasAnyHeader(table.headers, aliases)) {
      inputWarnings.push(`${label} CSV missing required column: one of ${aliases.join(", ")}.`);
    }
  }
  for (const aliases of recommendedHeaderGroups) {
    if (!hasAnyHeader(table.headers, aliases)) {
      inputWarnings.push(`${label} CSV missing recommended column: one of ${aliases.join(", ")}.`);
    }
  }
  if (!table.rows.length) inputWarnings.push(`${label} CSV has headers but no data rows.`);
  return table;
}

function numberValue(value) {
  if (value == null) return 0;
  const normalized = String(value).replace(/[%,$\s]/g, "").replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function ctrValue(value) {
  const number = numberValue(value);
  if (String(value).includes("%")) return number / 100;
  return number > 1 ? number / 100 : number;
}

function pathOnly(value) {
  if (!value) return "";
  try {
    return new URL(value, "https://www.bobob.app").pathname;
  } catch {
    return String(value).split("?")[0];
  }
}

function readRegistryInventory() {
  const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
  const slugMatches = Array.from(registry.matchAll(/\n\s+slug:\s+"([^"]+)"/g));
  const toolsBySlug = new Map();

  for (const [index, match] of slugMatches.entries()) {
    const start = match.index ?? 0;
    const end = slugMatches[index + 1]?.index ?? registry.indexOf("\n];", start);
    const block = registry.slice(start, end === -1 ? undefined : end);
    const parsed = (() => {
      const pick = (field) => block.match(new RegExp(`${field}:\\s+"([^"]+)"`))?.[1] ?? "";
      const pickArray = (field) => {
        const source = block.match(new RegExp(`${field}:\\s+\\[([^\\]]+)\\]`))?.[1] ?? "";
        return Array.from(source.matchAll(/"([^"]+)"/g)).map((item) => item[1]);
      };
      const slug = pick("slug");
      const title = pick("title");
      const category = pick("category");
      const description = pick("description");
      const demandTier = pick("demandTier") || "growth";
      const monetizationTier = pick("monetizationTier") || demandTier;
      const contentCluster = pick("contentCluster") || clusterByCategory[category] || category.toLowerCase();
      const requiresServer = /requiresServer:\s+true/.test(block);
      if (!slug || !title) return null;
      const explicitSeo = block.match(/seo:\s+seo\(\s*"([^"]+)",\s*"([^"]+)"/);
      const seoTitle = explicitSeo?.[1] ?? `${title} - Free Online ${category} Tool`;
      const seoDescription =
        explicitSeo?.[2] ??
        `Free online ${title.toLowerCase()} for ${category.toLowerCase()} workflows. ${description} ${requiresServer ? "Uses public server checks." : "Runs locally in your browser."}`;
      const titleHasIntent = /\b(free|online|formatter|validator|generator|converter|checker|decoder|encoder|parser|preview|lookup)\b/i.test(seoTitle);
      const descriptionHasIntent = /\bfree online|local|browser|public|examples|FAQ|related tools\b/i.test(seoDescription);
      return {
        contentType: "tool",
        path: `/tools/${slug}`,
        slug,
        toolName: title,
        title: seoTitle,
        description: seoDescription,
        titleLength: seoTitle.length,
        descriptionLength: seoDescription.length,
        category,
        demandTier,
        monetizationTier,
        contentCluster,
        requiresServer,
        searchIntents: [...pickArray("keywords"), ...pickArray("searchIntents")],
        titleHasIntent,
        descriptionHasIntent,
      };
    })();
    if (parsed) toolsBySlug.set(parsed.slug, parsed);
  }

  return Array.from(toolsBySlug.values());
}

function readGuideInventory() {
  const registry = fs.readFileSync(path.join(root, "apps/main/src/features/guides/registry.ts"), "utf8");
  const slugMatches = Array.from(registry.matchAll(/\n\s+slug:\s+"([^"]+)"/g));
  const guidesBySlug = new Map();

  for (const [index, match] of slugMatches.entries()) {
    const start = match.index ?? 0;
    const end = slugMatches[index + 1]?.index ?? registry.indexOf("\n];", start);
    const block = registry.slice(start, end === -1 ? undefined : end);
    const pick = (field) => block.match(new RegExp(`${field}:\\s+"([^"]+)"`))?.[1] ?? "";
    const slug = pick("slug");
    const title = pick("title");
    const description = pick("description");
    if (!slug || !title || !description) continue;
    guidesBySlug.set(slug, {
      contentType: "guide",
      path: `/guides/${slug}`,
      slug,
      toolName: title,
      title,
      description,
      titleLength: title.length,
      descriptionLength: description.length,
      category: "Guide",
      demandTier: "growth",
      monetizationTier: "growth",
      contentCluster: "guide",
      requiresServer: false,
      searchIntents: [slug.replace(/-/g, " "), title],
      titleHasIntent: true,
      descriptionHasIntent: true,
    });
  }

  return Array.from(guidesBySlug.values());
}

function readContentInventory() {
  const tools = readRegistryInventory();
  const guides = readGuideInventory();
  return { tools, guides, all: [...tools, ...guides] };
}

function searchConsoleRows() {
  if (!searchCsvPath) return [];
  const { rows } = readCsvTable(
    searchCsvPath,
    "Search Console",
    [["page", "url", "pages", "landingpage", "path"], ["impressions"]],
    [["query", "queries"], ["clicks"], ["ctr"], ["position", "avgposition", "averageposition"]],
  );
  return rows
    .map((row) => {
      const page = row.page || row.url || row.pages || row.landingpage || row.path;
      const query = row.query || row.queries || "";
      const impressions = numberValue(row.impressions);
      const clicks = numberValue(row.clicks);
      const ctr = ctrValue(row.ctr);
      const position = numberValue(row.position || row.avgposition || row.averageposition);
      return { page: pathOnly(page), query, impressions, clicks, ctr, position };
    })
    .filter((row) => row.page);
}

function searchConsoleOpportunities(rows) {
  return rows
    .filter((row) => row.page && row.impressions >= minImpressions && row.ctr <= lowCtr && (!row.position || row.position <= 20))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);
}

function adsenseRows() {
  if (!adsenseCsvPath) return [];
  const { rows } = readCsvTable(
    adsenseCsvPath,
    "AdSense",
    [["page", "url", "pages", "path", "landingpage"], ["impressions", "pageviews", "views"]],
    [["pagerpm", "rpm"], ["estimatedearnings", "earnings"], ["ctr"]],
  );
  return rows
    .map((row) => {
      const page = row.page || row.url || row.pages || row.path || row.landingpage;
      const impressions = numberValue(row.impressions || row.pageviews || row.views);
      const rpm = numberValue(row.pagerpm || row.rpm);
      const earnings = numberValue(row.estimatedearnings || row.earnings);
      const ctr = ctrValue(row.ctr);
      return { page: pathOnly(page), impressions, rpm, earnings, ctr };
    })
    .filter((row) => row.page);
}

function adsenseOpportunities(rows) {
  return rows
    .filter((row) => row.page && row.impressions >= minImpressions && row.rpm <= lowRpm)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);
}

function canonicalContentPath(page) {
  const path = pathOnly(page).replace(localePrefix, "") || "/";
  if (path.startsWith("/tools/") || path.startsWith("/guides/")) return path;
  return "";
}

function titleCaseQuery(query) {
  const fixed = new Map([
    ["json", "JSON"],
    ["jwt", "JWT"],
    ["uuid", "UUID"],
    ["ulid", "ULID"],
    ["css", "CSS"],
    ["html", "HTML"],
    ["xml", "XML"],
    ["sql", "SQL"],
    ["dns", "DNS"],
    ["http", "HTTP"],
    ["url", "URL"],
    ["base64", "Base64"],
    ["yaml", "YAML"],
    ["csv", "CSV"],
  ]);
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => fixed.get(word) ?? `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function clampText(value, maxLength) {
  if (value.length <= maxLength) return value;
  const trimmed = value.slice(0, maxLength - 1).replace(/\s+\S*$/, "").trim();
  return `${trimmed}.`;
}

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function cleanDescriptionSource(description) {
  return description
    .replace(/^Free online [^.]+\.?\s*/i, "")
    .replace(/\s*(Runs locally in your browser|Checks public targets only|Uses public server checks)\.?$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

function rowsByCanonicalContentPage(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const page = canonicalContentPath(row.page);
    if (!page) continue;
    const list = grouped.get(page) ?? [];
    list.push(row);
    grouped.set(page, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
  }
  return grouped;
}

function measuredMetadataSuggestion(item, pageRows, adsenseRow) {
  const primary = pageRows[0];
  const primaryQuery = primary?.query?.trim() ?? "";
  const queryIncludesTool = primaryQuery && normalizeText(primaryQuery).includes(normalizeText(item.toolName));
  const queryTitle = primaryQuery ? titleCaseQuery(primaryQuery) : "";
  const titleBase = item.contentType === "guide"
    ? (primaryQuery ? `${queryTitle.includes("Guide") ? queryTitle : `${queryTitle} Guide`}` : item.toolName)
    : (!primaryQuery || queryIncludesTool ? `Free Online ${item.toolName}` : `${item.toolName} - ${queryTitle}`);
  const suggestedTitle = clampText(titleBase, 62);
  const descriptionIntent = primaryQuery && !queryIncludesTool ? ` for ${primaryQuery}` : "";
  const localOrServer = item.requiresServer ? "Checks public targets only." : "Runs locally in your browser.";
  const descriptionSource = cleanDescriptionSource(item.description);
  const suggestedDescription = item.contentType === "guide"
    ? clampText(`${descriptionSource} Use this guide with the related browser tools before copying output.`, 155)
    : clampText(`Free online ${item.toolName.toLowerCase()}${descriptionIntent}. ${descriptionSource} ${localOrServer}`, 155);
  const reasons = [];
  if (primary) {
    reasons.push(`Search Console: ${primary.impressions} impressions, ${(primary.ctr * 100).toFixed(2)}% CTR, avg position ${primary.position || "n/a"} for "${primary.query}".`);
  }
  if (adsenseRow) {
    reasons.push(`AdSense: ${adsenseRow.impressions} impressions, RPM ${adsenseRow.rpm}.`);
  }
  if (item.descriptionLength > 158) reasons.push(`Current description length is ${item.descriptionLength}.`);
  if (item.titleLength > 62) reasons.push(`Current title length is ${item.titleLength}.`);
  if (!item.titleHasIntent) reasons.push("Current title lacks a clear search-intent word.");
  if (!item.descriptionHasIntent) reasons.push("Current description lacks local/browser/public intent wording.");
  return {
    path: item.path,
    sourcePage: primary?.page ?? adsenseRow?.page ?? item.path,
    primaryQuery: primaryQuery || null,
    currentTitle: item.title,
    currentDescription: item.description,
    suggestedTitle,
    suggestedDescription,
    reason: reasons.join(" "),
    relatedQueries: pageRows.slice(0, 5).map((row) => ({
      query: row.query,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })),
  };
}

function tierScore(tier) {
  return { core: 3, growth: 2, "long-tail": 1 }[tier] ?? 0;
}

function measurementBacklog(contentItems, searchRowsByPage, adsenseRowsByPage) {
  return contentItems
    .map((item) => {
      const hasSearchConsoleRows = (searchRowsByPage.get(item.path) ?? []).length > 0;
      const hasAdsenseRows = (adsenseRowsByPage.get(item.path) ?? []).length > 0;
      const missingInputs = [
        !hasSearchConsoleRows ? "Search Console page/query rows" : "",
        !hasAdsenseRows ? "AdSense page/RPM rows" : "",
      ].filter(Boolean);
      const score =
        tierScore(item.monetizationTier) * 100 +
        tierScore(item.demandTier) * 20 +
        (item.contentType === "tool" ? 10 : 0) +
        (item.requiresServer ? 3 : 0);
      return {
        path: item.path,
        contentType: item.contentType,
        title: item.toolName,
        monetizationTier: item.monetizationTier,
        demandTier: item.demandTier,
        contentCluster: item.contentCluster,
        missingInputs,
        score,
        searchIntents: item.searchIntents.slice(0, 4),
      };
    })
    .filter((item) => item.missingInputs.length > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, 25)
    .map(({ score, ...item }) => item);
}

function markdownTable(headers, rows) {
  if (!rows.length) return "_None._";
  const escape = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const headerRow = `| ${headers.map(escape).join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(escape).join(" | ")} |`).join("\n");
  return `${headerRow}\n${divider}\n${body}`;
}

function formatMarkdownReport(report) {
  const lines = [
    "# Bob's Multi Tool SEO Opportunity Report",
    "",
    "## Inputs",
    "",
    markdownTable(
      ["Field", "Value"],
      [
        ["Search Console CSV", report.inputs.searchConsoleCsv ?? "not provided"],
        ["AdSense CSV", report.inputs.adsenseCsv ?? "not provided"],
        ["Minimum impressions", report.inputs.minImpressions],
        ["Low CTR threshold", percent(report.inputs.lowCtr)],
        ["Low RPM threshold", report.inputs.lowRpm],
        ["Inventory", `${report.inventoryCount} pages (${report.toolInventoryCount} tools, ${report.guideInventoryCount} guides)`],
      ],
    ),
    "",
    "## Input Warnings",
    "",
    markdownTable(
      ["Warning"],
      report.inputWarnings.map((warning) => [warning]),
    ),
    "",
    "## Title And Description Recommendations",
    "",
    markdownTable(
      ["Path", "Source", "Primary query", "Suggested title", "Suggested description", "Reason"],
      report.titleDescriptionRecommendations.map((item) => [
        item.path,
        item.sourcePage,
        item.primaryQuery ?? "",
        item.suggestedTitle,
        item.suggestedDescription,
        item.reason,
      ]),
    ),
    "",
    "## Measurement Backlog",
    "",
    markdownTable(
      ["Path", "Type", "Tier", "Cluster", "Missing measured inputs", "Search intents"],
      report.measurementBacklog.map((row) => [
        row.path,
        row.contentType,
        `${row.monetizationTier}/${row.demandTier}`,
        row.contentCluster,
        row.missingInputs.join(", "),
        row.searchIntents.join(", "),
      ]),
    ),
    "",
    "## Search Console Opportunities",
    "",
    markdownTable(
      ["Page", "Query", "Impressions", "Clicks", "CTR", "Position"],
      report.searchConsoleOpportunities.map((row) => [
        row.page,
        row.query,
        row.impressions,
        row.clicks,
        percent(row.ctr),
        row.position || "",
      ]),
    ),
    "",
    "## AdSense Opportunities",
    "",
    markdownTable(
      ["Page", "Impressions", "RPM", "Earnings", "CTR"],
      report.adsenseOpportunities.map((row) => [
        row.page,
        row.impressions,
        row.rpm,
        row.earnings,
        percent(row.ctr),
      ]),
    ),
    "",
    "## Metadata Warnings",
    "",
    markdownTable(
      ["Path", "Title length", "Description length", "Title intent", "Description intent"],
      report.metadataWarnings.map((row) => [
        row.path,
        row.titleLength,
        row.descriptionLength,
        row.titleHasIntent ? "yes" : "no",
        row.descriptionHasIntent ? "yes" : "no",
      ]),
    ),
    "",
    "## Unsupported Measured Pages",
    "",
    markdownTable(
      ["Source", "Page", "Canonical path", "Impressions"],
      report.unsupportedMeasuredPages.map((row) => [
        row.source,
        row.page,
        row.canonicalPath || "not a tracked tool/guide page",
        row.impressions ?? "",
      ]),
    ),
    "",
  ];
  return lines.join("\n");
}

function emitReport(report) {
  const output = reportFormat === "markdown" || reportFormat === "md"
    ? formatMarkdownReport(report)
    : JSON.stringify(report, null, 2);
  if (reportOutputPath) {
    const outputPath = path.resolve(root, reportOutputPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${output}\n`);
  } else {
    console.log(output);
  }
}

const inventory = readRegistryInventory();
const contentInventory = readContentInventory();
const inventoryByPath = new Map(contentInventory.all.map((item) => [item.path, item]));
const scRows = searchConsoleRows();
const adRows = adsenseRows();
const scOpportunities = searchConsoleOpportunities(scRows);
const adOpportunities = adsenseOpportunities(adRows);
const metadataWarnings = inventory
  .filter((item) => item.titleLength > 62 || item.descriptionLength > 158 || !item.titleHasIntent || !item.descriptionHasIntent)
  .map((item) => ({
    path: item.path,
    titleLength: item.titleLength,
    descriptionLength: item.descriptionLength,
    titleHasIntent: item.titleHasIntent,
    descriptionHasIntent: item.descriptionHasIntent,
  }));

const searchRowsByPage = rowsByCanonicalContentPage(scRows);
const adsenseRowsByPage = rowsByCanonicalContentPage(adRows);
const adsenseByPage = new Map(adOpportunities.map((row) => [canonicalContentPath(row.page), row]));
const recommendationPaths = new Set([
  ...scOpportunities.map((row) => canonicalContentPath(row.page)).filter(Boolean),
  ...adOpportunities.map((row) => canonicalContentPath(row.page)).filter(Boolean),
  ...metadataWarnings.map((row) => row.path),
]);
const titleDescriptionRecommendations = Array.from(recommendationPaths)
  .map((toolPath) => {
    const item = inventoryByPath.get(toolPath);
    if (!item) return null;
    return measuredMetadataSuggestion(item, searchRowsByPage.get(toolPath) ?? [], adsenseByPage.get(toolPath));
  })
  .filter(Boolean)
  .slice(0, 25);
const measuredRows = [...scRows.map((row) => ({ source: "search-console", ...row })), ...adRows.map((row) => ({ source: "adsense", ...row }))];
const unsupportedMeasuredPages = measuredRows
  .map((row) => ({ ...row, canonicalPath: canonicalContentPath(row.page) }))
  .filter((row) => row.page && (!row.canonicalPath || !inventoryByPath.has(row.canonicalPath)))
  .slice(0, 25);
const measurementBacklogRows = measurementBacklog(contentInventory.all, searchRowsByPage, adsenseRowsByPage);

const report = {
  inputs: {
    searchConsoleCsv: searchCsvInput.displayPath,
    searchConsoleCsvSource: searchCsvInput.source,
    searchConsoleDefaultCsv: searchCsvInput.defaultPath,
    adsenseCsv: adsenseCsvInput.displayPath,
    adsenseCsvSource: adsenseCsvInput.source,
    adsenseDefaultCsv: adsenseCsvInput.defaultPath,
    minImpressions,
    lowCtr,
    lowRpm,
  },
  inventoryCount: contentInventory.all.length,
  toolInventoryCount: contentInventory.tools.length,
  guideInventoryCount: contentInventory.guides.length,
  inputWarnings,
  searchConsoleOpportunities: scOpportunities,
  adsenseOpportunities: adOpportunities,
  metadataWarnings,
  titleDescriptionRecommendations,
  measurementBacklog: measurementBacklogRows,
  unsupportedMeasuredPages,
};

emitReport(report);

if (!searchCsvPath) console.error(`No Search Console CSV provided; set BOBOB_SEARCH_CONSOLE_CSV or create ${searchCsvInput.defaultPath}. Search Console CTR opportunities were skipped.`);
if (!adsenseCsvPath) console.error(`No AdSense CSV provided; set BOBOB_ADSENSE_CSV or create ${adsenseCsvInput.defaultPath}. AdSense RPM opportunities were skipped.`);
for (const warning of inputWarnings) console.error(`SEO input warning: ${warning}`);
