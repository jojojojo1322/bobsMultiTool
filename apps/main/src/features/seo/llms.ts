import { getIndexableBlogPosts } from "@/features/content/blog";
import { blogCategoryDefinitions, blogCategoryPath } from "@/features/content/blog-categories";
import { getPlayContents } from "@/features/content/play";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import { operationalToolSlugs } from "@/features/tools/operational-surface";

const siteUrl = "https://www.bobob.app";

function markdownText(value: string) {
  return value.replaceAll("[", "(").replaceAll("]", ")").replace(/\s+/g, " ").trim();
}

function markdownLink(title: string, url: string, description: string) {
  return `- [${markdownText(title)}](${url}): ${markdownText(description)}`;
}

function blogLinks() {
  return getIndexableBlogPosts().map((post) => markdownLink(post.title, `${siteUrl}/blog/${post.slug}`, post.description));
}

function playLinks() {
  return getPlayContents().map((content) => markdownLink(content.title, `${siteUrl}/play/${content.slug}`, content.description));
}

function blogCategoryLinks() {
  const posts = getIndexableBlogPosts();

  return blogCategoryDefinitions
    .filter((category) => posts.some((post) => post.category === category.label))
    .map((category) => markdownLink(category.label, `${siteUrl}${blogCategoryPath(category.slug)}`, category.description));
}

function toolLinks() {
  const tools = getLocalizedTools("en");

  return operationalToolSlugs.flatMap((slug) => {
    const tool = tools.find((item) => item.slug === slug);
    return tool ? [markdownLink(tool.shortTitle, `${siteUrl}/tools/${tool.slug}`, tool.description)] : [];
  });
}

export function llmsTxt() {
  return [
    "# bobob.app",
    "",
    "> URL, 헤더, DNS, sitemap, robots, JWT/API 응답을 점검하는 웹 운영 워크벤치입니다.",
    "",
    "bobob.app은 DevTools와 터미널에 흩어진 웹 운영 확인을 하나의 작업 흐름으로 묶고, Blog 운영 기록과 짧은 Play 실험을 함께 보존하는 정적 웹사이트입니다.",
    "",
    "## Core",
    markdownLink("Home", `${siteUrl}/`, "URL, header, sitemap 점검 흐름에서 Blog와 Play로 이어지는 canonical landing page."),
    markdownLink("Search", `${siteUrl}/search`, "운영 도구, Blog, Play를 함께 찾는 전역 검색."),
    markdownLink("Blog index", `${siteUrl}/blog`, "개발, AI 활용, 생산성, 사이드 프로젝트, 웹서비스 운영 기록 목록."),
    markdownLink("Play index", `${siteUrl}/play`, "30초에서 3분 안에 끝나는 웹 게임 목록."),
    markdownLink("Tools workbench", `${siteUrl}/tools`, "URL, DNS, sitemap, robots, meta, token, JSON 점검 도구 hub."),
    "",
    "## Blog Categories",
    ...blogCategoryLinks(),
    "",
    "## Play",
    ...playLinks(),
    "",
    "## Blog",
    ...blogLinks(),
    "",
    "## Discovery",
    markdownLink("Sitemap index", `${siteUrl}/sitemap.xml`, "Search Console에 제출하는 축소 canonical sitemap index."),
    markdownLink("RSS feed", `${siteUrl}/feed.xml`, "현재 Blog + Play canonical 콘텐츠 feed."),
    markdownLink("Atom feed", `${siteUrl}/atom.xml`, "RSS와 같은 Blog + Play 항목을 Atom 형식으로 제공하는 feed."),
    markdownLink("JSON feed", `${siteUrl}/feed.json`, "Blog + Play 항목을 JSON Feed 1.1 형식으로 제공하는 feed."),
    markdownLink("OpenSearch descriptor", `${siteUrl}/opensearch.xml`, "전역 검색 /search?q= endpoint discovery."),
    "",
    "## Trust",
    markdownLink("About", `${siteUrl}/about`, "사이트 방향과 운영자 설명."),
    markdownLink("Contact", `${siteUrl}/contact`, "문의와 오류 제보 경로."),
    markdownLink("Privacy", `${siteUrl}/privacy`, "입력 데이터와 브라우저/서버 경계 안내."),
    markdownLink("Terms", `${siteUrl}/terms`, "사이트 이용 조건."),
    "",
    "## Operational Tools",
    ...toolLinks(),
    "",
  ].join("\n");
}
