import type { BlogPost, PlayContent } from "./types";
import type { ToolDefinition } from "@/features/tools/types";

const siteUrl = "https://www.bobob.app";
const siteName = "bobob.app";
const contentLocale = "ko";

function websiteNode() {
  return {
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}

function organizationNode() {
  return {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  };
}

function personNode() {
  return {
    "@type": "Person",
    name: "Bob",
  };
}

function breadcrumbList(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

function playMetric(content: PlayContent) {
  if (content.type === "micro-sim") return `${content.turns.length}턴`;
  if (content.type === "tap-game") return `${content.targets.length}개 판단`;
  return `${content.items.length}개 분류`;
}

function playGenre(content: PlayContent) {
  if (content.type === "micro-sim") return "Micro simulation";
  if (content.type === "tap-game") return "Tap game";
  return "Sort and match game";
}

export function blogIndexStructuredData(posts: BlogPost[]) {
  const url = `${siteUrl}/blog`;
  const itemList = {
    "@type": "ItemList",
    name: "bobob.app Blog",
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        url: postUrl,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url: postUrl,
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: contentLocale,
          author: personNode(),
          publisher: organizationNode(),
        },
      };
    }),
  };

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog - bobob.app",
    url,
    description: "개발, AI 사용, 생산성, 사이드 프로젝트 운영 기록을 짧게 읽고 관련 Play로 이어지는 bobob.app 글 목록.",
    inLanguage: contentLocale,
    isPartOf: websiteNode(),
    mainEntity: itemList,
  };

  return [
    collectionPage,
    breadcrumbList([
      { name: siteName, path: "" },
      { name: "Blog", path: "/blog" },
    ]),
  ];
}

export function playIndexStructuredData(contents: PlayContent[]) {
  const url = `${siteUrl}/play`;
  const itemList = {
    "@type": "ItemList",
    name: "bobob.app Play",
    numberOfItems: contents.length,
    itemListElement: contents.map((content, index) => {
      const playUrl = `${siteUrl}/play/${content.slug}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        url: playUrl,
        item: {
          "@type": "Game",
          name: content.title,
          description: content.description,
          url: playUrl,
          genre: playGenre(content),
          inLanguage: contentLocale,
          isAccessibleForFree: true,
          numberOfPlayers: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 1,
          },
        },
      };
    }),
  };

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Play - bobob.app",
    url,
    description: "단일 규칙과 짧은 조작으로 바로 끝나는 bobob.app의 가벼운 웹 게임과 실험 목록.",
    inLanguage: contentLocale,
    isPartOf: websiteNode(),
    mainEntity: itemList,
  };

  return [
    collectionPage,
    breadcrumbList([
      { name: siteName, path: "" },
      { name: "Play", path: "/play" },
    ]),
  ];
}

export function blogPostStructuredData({ post, relatedPlays }: { post: BlogPost; relatedPlays: PlayContent[] }) {
  const url = `${siteUrl}/blog/${post.slug}`;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    inLanguage: contentLocale,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    timeRequired: `PT${post.readingMinutes}M`,
    author: personNode(),
    publisher: organizationNode(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: {
      "@type": "Blog",
      name: "bobob.app Blog",
      url: `${siteUrl}/blog`,
    },
    mentions: relatedPlays.map((play) => ({
      "@type": "Game",
      name: play.title,
      url: `${siteUrl}/play/${play.slug}`,
      description: play.description,
    })),
  };

  return [
    blogPosting,
    breadcrumbList([
      { name: siteName, path: "" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];
}

export function playDetailStructuredData({ content, relatedBlog }: { content: PlayContent; relatedBlog?: BlogPost }) {
  const url = `${siteUrl}/play/${content.slug}`;
  const game = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: content.title,
    description: content.description,
    url,
    genre: playGenre(content),
    inLanguage: contentLocale,
    isAccessibleForFree: true,
    numberOfPlayers: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 1,
    },
    gameItem: playMetric(content),
    isPartOf: {
      "@type": "CollectionPage",
      name: "bobob.app Play",
      url: `${siteUrl}/play`,
    },
    subjectOf: relatedBlog
      ? {
          "@type": "BlogPosting",
          headline: relatedBlog.title,
          url: `${siteUrl}/blog/${relatedBlog.slug}`,
          description: relatedBlog.description,
        }
      : undefined,
  };

  return [
    game,
    breadcrumbList([
      { name: siteName, path: "" },
      { name: "Play", path: "/play" },
      { name: content.title, path: `/play/${content.slug}` },
    ]),
  ];
}

export function searchPageStructuredData({
  query,
  blogResults,
  playResults,
  toolResults,
}: {
  query: string;
  blogResults: BlogPost[];
  playResults: PlayContent[];
  toolResults: ToolDefinition[];
}) {
  const url = query ? `${siteUrl}/search?q=${encodeURIComponent(query)}` : `${siteUrl}/search`;
  const items = [
    ...blogResults.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      inLanguage: contentLocale,
    })),
    ...playResults.map((content) => ({
      "@type": "Game",
      name: content.title,
      description: content.description,
      url: `${siteUrl}/play/${content.slug}`,
      inLanguage: contentLocale,
      isAccessibleForFree: true,
    })),
    ...toolResults.map((tool) => ({
      "@type": "SoftwareApplication",
      name: tool.title,
      description: tool.description,
      url: `${siteUrl}/tools/${tool.slug}`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      isAccessibleForFree: true,
    })),
  ];

  const searchResultsPage = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: query ? `${query} - bobob.app search` : "bobob.app search",
    url,
    description: "bobob.app의 개발/AI 글, 가벼운 Play, 보관된 개발자 도구를 함께 찾는 검색 페이지.",
    inLanguage: contentLocale,
    isPartOf: websiteNode(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item,
      })),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return [
    searchResultsPage,
    breadcrumbList([
      { name: siteName, path: "" },
      { name: "Search", path: "/search" },
    ]),
  ];
}
