import { getBlogPosts } from "@/features/content/blog";
import { blogCategoryDefinitions, blogCategoryPath } from "@/features/content/blog-categories";
import { getPlayContents } from "@/features/content/play";
import { getLocalizedTools } from "@/features/i18n/localized-content";

const siteUrl = "https://www.bobob.app";
const popularToolSlugs = ["json-formatter", "regex-tester", "jwt-decoder", "base64-tool", "cron-generator", "dns-lookup"];

function markdownText(value: string) {
  return value.replaceAll("[", "(").replaceAll("]", ")").replace(/\s+/g, " ").trim();
}

function markdownLink(title: string, url: string, description: string) {
  return `- [${markdownText(title)}](${url}): ${markdownText(description)}`;
}

function blogLinks() {
  return getBlogPosts().map((post) => markdownLink(post.title, `${siteUrl}/blog/${post.slug}`, post.description));
}

function playLinks() {
  return getPlayContents().map((content) => markdownLink(content.title, `${siteUrl}/play/${content.slug}`, content.description));
}

function blogCategoryLinks() {
  const posts = getBlogPosts();

  return blogCategoryDefinitions
    .filter((category) => posts.some((post) => post.category === category.label))
    .map((category) => markdownLink(category.label, `${siteUrl}${blogCategoryPath(category.slug)}`, category.description));
}

function toolLinks() {
  const tools = getLocalizedTools("en");

  return popularToolSlugs.flatMap((slug) => {
    const tool = tools.find((item) => item.slug === slug);
    return tool ? [markdownLink(tool.shortTitle, `${siteUrl}/tools/${tool.slug}`, tool.description)] : [];
  });
}

export function llmsTxt() {
  return [
    "# bobob.app",
    "",
    "> 개발/AI 기록과 브라우저에서 바로 해보는 짧은 Play를 모은 정적 웹사이트입니다.",
    "",
    "bobob.app은 Blog + Play 중심의 정적 웹사이트입니다. 글은 실제 개발, AI 활용, 사이드 프로젝트 운영 판단을 다루고, Play는 단일 규칙과 짧은 플레이로 바로 시작하는 웹 놀이입니다.",
    "",
    "## Core",
    markdownLink("Home", `${siteUrl}/`, "Blog, Play, archived Tools로 이어지는 canonical landing page."),
    markdownLink("Search", `${siteUrl}/search`, "Blog, Play, archived Tools를 함께 찾는 전역 검색."),
    markdownLink("Blog index", `${siteUrl}/blog`, "개발, AI 활용, 생산성, 사이드 프로젝트, 웹서비스 운영 기록 목록."),
    markdownLink("Play index", `${siteUrl}/play`, "30초에서 3분 안에 끝나는 웹 게임 목록."),
    markdownLink("Tools archive", `${siteUrl}/tools`, "기존 개발자 도구를 보관한 archive hub."),
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
    "## Optional",
    ...toolLinks(),
    "",
  ].join("\n");
}
