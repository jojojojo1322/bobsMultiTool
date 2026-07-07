import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = fs.readFileSync(path.join(root, "apps/main/src/features/tools/registry.ts"), "utf8");
const searchPanel = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-search-panel.tsx"), "utf8");
const workspace = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-workspace.tsx"), "utf8");
const localizedContent = fs.readFileSync(path.join(root, "apps/main/src/features/i18n/localized-content.ts"), "utf8");
const home = fs.readFileSync(path.join(root, "apps/main/src/app/page.tsx"), "utf8");
const localizedHome = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/page.tsx"), "utf8");
const contentSearch = fs.readFileSync(path.join(root, "apps/main/src/features/content/search.ts"), "utf8");
const searchPage = fs.readFileSync(path.join(root, "apps/main/src/app/search/page.tsx"), "utf8");
const layout = fs.readFileSync(path.join(root, "apps/main/src/app/layout.tsx"), "utf8");
const toolDirectory = fs.readFileSync(path.join(root, "apps/main/src/features/tools/tool-directory.tsx"), "utf8");
const toolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/tools/page.tsx"), "utf8");
const localizedToolsIndex = fs.readFileSync(path.join(root, "apps/main/src/app/[locale]/tools/page.tsx"), "utf8");
const workflows = fs.readFileSync(path.join(root, "apps/main/src/features/tools/workflows.ts"), "utf8");

const failures = [];
for (const fragment of [
  "getToolSearchText",
  "scoreToolSearch",
  "searchTools",
  "tool.faqs.flatMap",
  "tool.guides.map",
  "tool.aliases",
  "tool.useCases",
  "tool.inputExamples",
  "tool.failureCases",
  "tool.preCopyChecklist",
  "demandWeight",
]) {
  if (!registry.includes(fragment)) failures.push(`registry search missing ${fragment}`);
}

for (const [source, name] of [
  [searchPanel, "tool search panel"],
  [workspace, "tool workspace"],
]) {
  if (!source.includes("searchLocalizedTools(")) failures.push(`${name} does not use localized shared search`);
}
if (!localizedContent.includes("searchTools(query)")) failures.push("localized search does not reuse registry search ranking");
if (!localizedContent.includes("const toolBySlug = new Map") || !localizedContent.includes(".map((slug) => toolBySlug.get(slug))")) {
  failures.push("localized related tools must preserve registry relatedTools order");
}
if (!searchPanel.includes("getLocalizedTools(")) failures.push("tool search panel does not localize empty-query results");
if (!searchPanel.includes("function getSearchMatchSignals")) failures.push("tool search panel missing match-signal extraction");
if (!searchPanel.includes("data-search-match-signals")) failures.push("tool search panel must expose stable match-signal chips");
for (const fragment of ["tool.inputExamples", "tool.failureCases", "tool.preCopyChecklist", "tool.aliases", "tool.searchIntents", "tool.seo.keywords", "tool.faqs.flatMap", "tool.guides.map", "relatedTools.flatMap"]) {
  if (!searchPanel.includes(fragment)) failures.push(`tool search match signals missing ${fragment}`);
}
if (!searchPanel.includes("getLocalizedRelatedTools(")) failures.push("tool search panel must expose related next-action links");
if (!searchPanel.includes("related.useCases[0]")) failures.push("tool search panel related links must expose localized use-case context");
if (!searchPanel.includes("initialQuery")) failures.push("tool search panel does not accept initial URL query");
if (!searchPanel.includes("url.searchParams.set(\"q\"")) failures.push("tool search panel does not sync q search param");
if (!layout.includes("https://www.bobob.app/search?q={search_term_string}")) failures.push("SearchAction target is not aligned to /search?q=");
if (!layout.includes('rel="search"') || !layout.includes("https://www.bobob.app/opensearch.xml")) {
  failures.push("root layout missing OpenSearch discovery link");
}
for (const fragment of ["searchContentLab", "scoreBlogPost", "scorePlayContent", "scoreTool", "scoreWorkflowRecipe", "getIndexableBlogPosts", "getPlayContents", "getLocalizedTools", "getLocalizedWorkflowRecipes", "scoreWorkflowRecipeSearch"]) {
  if (!contentSearch.includes(fragment)) failures.push(`content lab search helper missing ${fragment}`);
}
for (const fragment of ["data-content-search-form", "data-content-search-count", "data-content-search-workflows", "data-content-search-workflow-slug", "data-content-search-play", "data-content-search-blog", "data-content-search-tools", "searchPageStructuredData"]) {
  if (!searchPage.includes(fragment)) failures.push(`content search page missing ${fragment}`);
}
if (!toolDirectory.includes("acquisitionClusterSlugs")) failures.push("tool directory missing acquisition workflow clusters");
if (!toolDirectory.includes("data-acquisition-clusters")) failures.push("tool directory acquisition clusters need a stable QA attribute");
if (!toolDirectory.includes("dictionary.tool.nextActionPrefix")) failures.push("tool directory clusters must expose next-action links");
if (!toolDirectory.includes("tool.useCases[0]")) failures.push("tool directory clusters must expose localized use-case context");
if (!workflows.includes("workflowRecipes") || !workflows.includes("getWorkflowRecipesForTool") || !workflows.includes("getLocalizedWorkflowRecipes")) {
  failures.push("workflow recipe registry must expose localized recipe helpers");
}
if (!toolDirectory.includes("data-workflow-recipes") || !toolDirectory.includes("WorkflowRecipeCard")) {
  failures.push("tool directory must expose workflow recipe cards for session-depth entry paths");
}
if (!searchPanel.includes("data-search-workflow-recipes") || !searchPanel.includes("workflowRecipeMatches")) {
  failures.push("tool search panel must surface workflow recipe matches for task-shaped queries");
}
if (!searchPanel.includes("data-search-workflow-slug")) {
  failures.push("tool search workflow cards need stable slug QA attributes");
}
if (!searchPanel.includes("scoreWorkflowRecipeSearch") || !searchPanel.includes(".sort((a, b) => b.score - a.score")) {
  failures.push("tool search panel must rank workflow recipe matches by exact title and intent score");
}
for (const fragment of ["export function scoreWorkflowRecipeSearch", "title === normalizedQuery", "intents.some((intent) => intent === normalizedQuery)", "stepToolSignals", "score += 1000"]) {
  if (!workflows.includes(fragment)) failures.push(`workflow search ranking helper missing ${fragment}`);
}
if (!workspace.includes("data-tool-workflow-recipes") || !workspace.includes("getWorkflowRecipesForTool")) {
  failures.push("tool detail pages must surface workflow recipes connected to the active tool");
}
for (const recipeSlug of ["format-api-response", "extract-json-field", "review-sql-query", "review-css-snippet", "review-javascript-snippet", "decode-api-token", "debug-redirect", "check-search-discovery-readiness", "diagnose-not-indexed-url", "inspect-image-data-url", "check-color-accessibility", "check-dns-deployment", "create-wifi-qr", "create-safe-password", "generate-secure-token", "verify-webhook-signature", "review-security-headers", "validate-deploy-config", "clean-csv-for-api"]) {
  if (!workflows.includes(`slug: "${recipeSlug}"`)) failures.push(`workflow recipe registry missing ${recipeSlug}`);
}
for (const intent of ["api response formatter", "api response report", "json response report", "api error report", "json error line column", "json parse error context", "json field extractor", "json path extractor", "recursive jsonpath", "sql review report", "sql query review report", "sql mutation checklist", "sql where clause report", "sql handoff report", "css review report", "css selector report", "css cascade checklist", "css specificity checker", "css handoff report", "javascript review report", "js snippet risk report", "javascript fetch checklist", "javascript eval checker", "javascript handoff report", "jwt exp checker", "jwt authorization header", "jwt sensitive claims", "jwt redacted payload", "jwt issuer checker", "jwt audience checker", "jwt scope checker", "jwt auth report", "api token handoff report", "token auth report", "password handoff report", "password safety report", "password compatibility report", "passphrase report", "temporary password report", "credential handoff report", "secure token report", "token handoff report", "csrf token report", "api key seed report", "base64 payload report", "base64 decode report", "base64 json report", "hash signature report", "hmac handoff report", "hmac verification report", "color accessibility report", "wcag contrast report", "design token contrast report", "redirect chain checker", "canonical redirect checker", "apex to www redirect", "www redirect checker", "308 redirect checker", "http to https redirect checker", "redirect loop checker", "too many redirects checker", "search console redirect page", "page with redirect", "리디렉션이 포함된 페이지", "www 리디렉션 확인", "308 리디렉션 확인", "리디렉션 루프 점검", "site indexing checklist", "google indexing checker", "search console sitemap", "search console update delay", "search console last updated", "search discovery report", "sitemap indexing check", "sitemap submission report", "robots crawl report", "robots txt report", "crawl policy report", "meta crawler report", "seo meta report", "social preview report", "open graph crawler report", "link preview qa report", "url canonical report", "clean url report", "utm cleanup report", "robots canonical check", "search discovery checklist", "naver search advisor sitemap", "naver sitemap not found", "search advisor sitemap not found", "사이트맵을 찾을 수 없습니다", "Search Console 색인 업데이트", "페이지 색인 생성 최종 업데이트", "색인 리포트 언제 업데이트", "crawled currently not indexed", "discovered currently not indexed", "page indexing report", "page indexing report not updated", "page indexing report refresh", "when does search console update", "url inspection request", "indexing request queued", "indexing observation log", "not indexed after crawl", "googlebot final 200", "indexable url checker", "색인 대체 언제 업데이트", "base64 image decoder", "download base64 image", "data url decoder", "dns propagation checklist", "dns deployment checker", "dns deployment checklist", "dns deployment report", "domain dns report", "dmarc checker", "name server checker", "wifi qr code generator", "qr quiet zone", "qr scan report", "qr print checklist", "wifi qr scan report", "csrf token generator", "security headers checker", "security response header checker", "security header report", "http security report", "csp review report", "hsts report", "hsts checker", "referrer policy checker", "content security policy generator", "cors header checker", "cors preflight checker", "cors error devtools", "fetch cors error", "preflight request failed", "access control allow origin checker", "access-control-allow-origin", "cors credentials wildcard", "CORS 오류 확인", "프리플라이트 요청 실패", "Access-Control-Allow-Origin 확인", "CORS credentials 점검", "docker compose validator", "docker compose yaml validator", "deployment config checker", "deploy config validator", "deployment config report", "vercel environment variables", "vercel env checker", "production env checker", "missing env variable deploy", "배포 설정 점검", "환경변수 누락 확인", "도커 컴포즈 검증", "csv cleaner", "markdown table generator"]) {
  if (!workflows.includes(intent)) failures.push(`workflow recipe search intent missing ${intent}`);
}
for (const intent of ["copy api response from devtools", "devtools network response json", "network response json formatter", "api response handoff report", "api response markdown report", "redacted api response report", "DevTools API 응답 복사", "네트워크 응답 JSON 정리", "API 응답 보고서", "API 오류 응답 정리"]) {
  if (!workflows.includes(intent)) failures.push(`API response workflow search intent missing ${intent}`);
}
for (const intent of ["search discovery report", "sitemap submission report", "search console sitemap report", "page indexing report", "page indexing report not updated", "url inspection evidence", "indexing observation log", "crawled currently not indexed", "discovered currently not indexed", "search console update delay", "search console last updated", "색인 리포트 언제 업데이트", "페이지 색인 생성 최종 업데이트", "naver search advisor sitemap", "naver sitemap not found", "search advisor sitemap not found", "사이트맵을 찾을 수 없습니다"]) {
  if (!registry.includes(intent)) failures.push(`Sitemap Generator registry search surface missing ${intent}`);
}
for (const intent of ["robots crawl report", "robots txt report", "crawl policy report"]) {
  if (!registry.includes(intent)) failures.push(`Robots.txt Generator registry search surface missing ${intent}`);
}
for (const intent of ["apex to www redirect", "www redirect checker", "308 redirect checker", "http to https redirect checker", "redirect loop checker", "search console redirect page", "리디렉션이 포함된 페이지", "www 리디렉션 확인", "리디렉션 루프 점검"]) {
  if (!registry.includes(intent)) failures.push(`HTTP Status Checker registry search surface missing ${intent}`);
}
for (const intent of ["https redirect checker", "ssl redirect checker", "certificate error redirect", "net::err_cert_common_name_invalid", "err_cert_date_invalid", "HTTPS 리디렉션 확인", "SSL 리디렉션 확인", "인증서 오류 리디렉션"]) {
  if (!workflows.includes(intent)) failures.push(`redirect workflow certificate/HTTPS intent missing ${intent}`);
  if (!registry.includes(intent)) failures.push(`HTTP Status Checker certificate/HTTPS redirect surface missing ${intent}`);
}
for (const intent of ["ssl certificate checker", "tls certificate checker", "https certificate checker", "ssl certificate error", "ssl expiration checker", "certificate error devtools", "mixed content checker", "mixed content warning", "blocked mixed content", "SSL 인증서 확인", "TLS 인증서 확인", "HTTPS 인증서 확인", "인증서 만료 확인", "보안 인증서 오류", "혼합 콘텐츠 확인", "혼합 콘텐츠 경고"]) {
  if (!workflows.includes(intent)) failures.push(`security header workflow certificate/mixed-content intent missing ${intent}`);
  if (!registry.includes(intent)) failures.push(`HTTP Status Checker certificate/mixed-content search surface missing ${intent}`);
}
for (const intent of ["meta crawler report", "seo meta report", "social preview report", "open graph crawler report", "link preview qa report", "indexable metadata check", "noindex metadata checker", "canonical metadata report"]) {
  if (!registry.includes(intent)) failures.push(`Meta Tag Generator registry search surface missing ${intent}`);
}
for (const intent of ["url canonical report", "clean url report", "utm cleanup report", "canonical url mismatch", "search console duplicate canonical", "inspected url canonical check"]) {
  if (!registry.includes(intent)) failures.push(`URL Parser registry search surface missing ${intent}`);
}
for (const intent of ["dns deployment checker", "dns deployment checklist", "dns deployment report", "domain dns report", "dmarc checker", "name server checker"]) {
  if (!registry.includes(intent)) failures.push(`DNS Lookup registry search surface missing ${intent}`);
}
for (const intent of ["sql review report", "sql query review report", "sql mutation checklist", "sql handoff report"]) {
  if (!registry.includes(intent)) failures.push(`SQL Formatter registry search surface missing ${intent}`);
}
for (const intent of ["css review report", "css selector report", "css cascade checklist", "css specificity checker", "css handoff report"]) {
  if (!registry.includes(intent)) failures.push(`CSS Formatter registry search surface missing ${intent}`);
}
for (const intent of ["javascript review report", "js snippet risk report", "javascript fetch checklist", "javascript eval checker", "javascript handoff report"]) {
  if (!registry.includes(intent)) failures.push(`JavaScript Formatter registry search surface missing ${intent}`);
}
for (const slug of ["json-formatter", "jwt-decoder", "http-status-checker", "color-converter", "uuid-generator", "regex-tester"]) {
  if (!toolDirectory.includes(`"${slug}"`)) failures.push(`tool directory acquisition clusters missing ${slug}`);
}
for (const fragment of [
  "commonFailureCases",
  "commonPreCopyChecklist",
  "dictionary.tool.failureCases",
  "dictionary.tool.preCopyChecklist",
  "dictionary.tool.nextActionPrefix",
  "related.useCases[0]",
]) {
  if (!workspace.includes(fragment)) failures.push(`tool workspace missing retention detail ${fragment}`);
}

if (!home.includes("readSearchQuery")) failures.push("default home does not read ?q=");
if (!localizedHome.includes("readSearchQuery")) failures.push("localized home does not read ?q=");
if (!toolsIndex.includes("readSearchQuery") || !localizedToolsIndex.includes("readSearchQuery")) failures.push("tools directory pages do not read ?q=");
if (!toolsIndex.includes("ToolDirectory") || !localizedToolsIndex.includes("ToolDirectory")) failures.push("tools directory pages do not use shared ToolDirectory");
if (home.includes("readOnly") || localizedHome.includes("readOnly")) failures.push("home search must not be read-only");
if (!registry.includes("regexp tester")) failures.push("core alias sample missing");
for (const intent of ["email regex", "url regex", "uuid regex", "ipv4 regex", "hex color regex", "slug regex"]) {
  if (!registry.includes(intent)) failures.push(`Regex Tester search intent missing ${intent}`);
}
if (!registry.includes("jwt sensitive claims") || !registry.includes("jwt redacted payload") || !registry.includes("jwt redaction checker")) failures.push("JWT Decoder search intents must cover sensitive claim and redacted payload queries");
if (!registry.includes("jwt issuer checker") || !registry.includes("jwt audience checker") || !registry.includes("jwt scope checker") || !registry.includes("jwt audience mismatch")) failures.push("JWT Decoder search intents must cover issuer, audience, scope, and mismatch debug queries");
if (!registry.includes("jwt auth report") || !registry.includes("api token handoff report") || !registry.includes("token handoff report")) failures.push("JWT Decoder search intents must cover auth report and handoff report queries");
for (const intent of ["security headers checker", "security response header checker", "security header report", "http security report", "csp review report", "hsts report", "hsts checker", "x content type options checker", "referrer policy checker", "cors header checker", "cors preflight checker", "cors error devtools", "fetch cors error", "preflight request failed", "access control allow origin checker", "access-control-allow-origin", "cors credentials wildcard", "CORS 오류 확인", "프리플라이트 요청 실패", "Access-Control-Allow-Origin 확인", "CORS credentials 점검", "public url report", "website status report", "googlebot final 200", "indexable url checker", "url inspection status"]) {
  if (!registry.includes(intent)) failures.push(`HTTP Status Checker search intent missing ${intent}`);
}
for (const intent of ["base64 payload report", "base64 decode report", "base64 json report", "base64 image decoder", "base64 to png", "download base64 image", "base64 json formatter", "data url decoder", "image data url preview"]) {
  if (!registry.includes(intent)) failures.push(`Base64 search intent missing ${intent}`);
}
for (const intent of ["api response report", "json response report", "api error report", "json error line column", "json parse error context", "json sensitive key checker", "json duplicate key checker", "json empty value finder", "json path extractor", "json field extractor", "jsonpath wildcard", "recursive jsonpath", "extract json value"]) {
  if (!registry.includes(intent)) failures.push(`JSON data cluster search intent missing ${intent}`);
}
for (const intent of ["copy api response from devtools", "devtools network response json", "network response json formatter", "api response handoff report", "api response markdown report", "redacted api response report", "DevTools API 응답 복사", "네트워크 응답 JSON 정리", "API 응답 보고서", "API 오류 응답 정리"]) {
  if (!registry.includes(intent)) failures.push(`JSON Formatter DevTools response search surface missing ${intent}`);
}
for (const intent of ["docker compose validator", "compose yaml validator", "docker compose yaml validator", "yaml config checker", "deployment yaml checker", "deploy config validator", "도커 컴포즈 검증"]) {
  if (!registry.includes(intent)) failures.push(`YAML Validator search surface missing ${intent}`);
}
for (const intent of ["env parser validator", "dotenv validator", ".env validator", "env variable checker", "production env checker", "missing env variable deploy", "vercel environment variables", "vercel env checker", "환경변수 누락 확인"]) {
  if (!registry.includes(intent)) failures.push(`ENV Parser search surface missing ${intent}`);
}
if (!registry.includes("csrf token generator") || !registry.includes("api key generator") || !registry.includes("url safe token generator")) failures.push("Random Token search intents must cover CSRF, API key, and URL-safe token queries");
for (const intent of ["hmac sha256 generator", "webhook signature generator", "webhook hmac", "hash signature report", "hmac handoff report", "sha256 checksum report"]) {
  if (!registry.includes(intent)) failures.push(`Hash Generator search intent missing ${intent}`);
}
if (!registry.includes("passphrase generator") || !registry.includes("memorable password generator") || !registry.includes("secure passphrase generator")) failures.push("Password Generator search intents must cover passphrase and memorable password queries");
for (const intent of ["color accessibility report", "wcag contrast report", "design token contrast report"]) {
  if (!registry.includes(intent)) failures.push(`Color Converter search intent missing ${intent}`);
}
for (const intent of ["password safety report", "password handoff report", "passphrase report", "temporary password report", "password compatibility report"]) {
  if (!registry.includes(intent)) failures.push(`Password Generator search intent missing ${intent}`);
}
for (const intent of ["secure token report", "token handoff report", "csrf token report", "api key seed report"]) {
  if (!registry.includes(intent)) failures.push(`Random Token Generator search intent missing ${intent}`);
}
for (const intent of ["cron timezone preview", "cron timezone checker", "cron schedule report", "cron handoff report", "cron deployment schedule"]) {
  if (!registry.includes(intent)) failures.push(`Cron Generator search intent missing ${intent}`);
}
for (const intent of ["cron schedule report", "cron timezone report", "cron next run report"]) {
  if (!workflows.includes(intent)) failures.push(`Cron workflow search intent missing ${intent}`);
}
if (!registry.includes("wifi qr code generator") || !registry.includes("free qr code generator") || !registry.includes("contact qr code generator") || !registry.includes("qr quiet zone") || !registry.includes("qr code size") || !registry.includes("qr scan report") || !registry.includes("qr print checklist") || !registry.includes("wifi qr scan report")) failures.push("QR Code Generator search intents must cover Wi-Fi, free QR, contact QR, sizing, quiet-zone, scan report, and print checklist queries");
if (!registry.includes("monetizationTier")) failures.push("monetization tier field missing");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Search smoke passed.");
