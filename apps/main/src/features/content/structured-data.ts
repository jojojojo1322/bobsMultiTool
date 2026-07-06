import type { BlogPost, PlayContent } from "./types";
import type { BlogCategoryDefinition } from "./blog-categories";
import { blogCategoryPath } from "./blog-categories";
import { blogIndexKeywords, blogPostKeywords, playContentKeywords, playIndexKeywords } from "./discovery";
import type { ToolDefinition } from "@/features/tools/types";
import type { LocalizedWorkflowRecipe } from "@/features/tools/workflows";

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

function topicThings(keywords: string[]) {
  return keywords.slice(0, 10).map((keyword) => ({
    "@type": "Thing",
    name: keyword,
  }));
}

function playGenre(content: PlayContent) {
  if (content.type === "micro-sim") return "Micro simulation";
  if (content.type === "tap-game") return "Tap game";
  if (content.type === "arcade-game") return "Canvas arcade game";
  return "Sort and match game";
}

function blogModifiedDate(post: BlogPost) {
  return post.updatedAt ?? post.date;
}

export function blogIndexStructuredData(posts: BlogPost[]) {
  const url = `${siteUrl}/blog`;
  const keywords = blogIndexKeywords(posts);
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
          dateModified: blogModifiedDate(post),
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
    keywords,
    about: topicThings(keywords),
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

export function blogCategoryStructuredData({ category, posts }: { category: BlogCategoryDefinition; posts: BlogPost[] }) {
  const path = blogCategoryPath(category.slug);
  const url = `${siteUrl}${path}`;
  const keywords = blogIndexKeywords(posts);
  const itemList = {
    "@type": "ItemList",
    name: `${category.label} - bobob.app Blog`,
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
          dateModified: blogModifiedDate(post),
          articleSection: category.label,
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
    name: `${category.label} - bobob.app Blog`,
    url,
    description: category.description,
    inLanguage: contentLocale,
    keywords,
    about: topicThings([category.label, ...keywords]),
    isPartOf: websiteNode(),
    mainEntity: itemList,
  };

  return [
    collectionPage,
    breadcrumbList([
      { name: siteName, path: "" },
      { name: "Blog", path: "/blog" },
      { name: category.label, path },
    ]),
  ];
}

export function playIndexStructuredData(contents: PlayContent[]) {
  const url = `${siteUrl}/play`;
  const keywords = playIndexKeywords(contents);
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
          keywords: playContentKeywords(content),
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
    description: "단일 규칙과 짧은 플레이로 바로 시작하는 bobob.app의 웹 게임 목록.",
    inLanguage: contentLocale,
    keywords,
    about: topicThings(keywords),
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
  const keywords = blogPostKeywords(post, relatedPlays);
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    inLanguage: contentLocale,
    datePublished: post.date,
    dateModified: blogModifiedDate(post),
    articleSection: post.category,
    keywords,
    about: topicThings(keywords),
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

export function playDetailStructuredData({ content, relatedBlogs }: { content: PlayContent; relatedBlogs: BlogPost[] }) {
  const url = `${siteUrl}/play/${content.slug}`;
  const keywords = playContentKeywords(content, relatedBlogs);
  const game = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: content.title,
    description: content.description,
    url,
    genre: playGenre(content),
    keywords,
    about: topicThings(keywords),
    inLanguage: contentLocale,
    isAccessibleForFree: true,
    numberOfPlayers: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 1,
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: "bobob.app Play",
      url: `${siteUrl}/play`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    subjectOf: relatedBlogs.length
      ? relatedBlogs.map((relatedBlog) => ({
          "@type": "BlogPosting",
          headline: relatedBlog.title,
          url: `${siteUrl}/blog/${relatedBlog.slug}`,
          description: relatedBlog.description,
        }))
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
  workflowResults,
  blogResults,
  playResults,
  toolResults,
}: {
  query: string;
  workflowResults: LocalizedWorkflowRecipe[];
  blogResults: BlogPost[];
  playResults: PlayContent[];
  toolResults: ToolDefinition[];
}) {
  const url = query ? `${siteUrl}/search?q=${encodeURIComponent(query)}` : `${siteUrl}/search`;
  const items = [
    ...workflowResults.map((recipe) => {
      const firstStep = recipe.steps[0];

      return {
        "@type": "HowTo",
        name: recipe.title,
        description: recipe.description,
        url: firstStep ? `${siteUrl}/tools/${firstStep.tool.slug}` : url,
        inLanguage: contentLocale,
        step: recipe.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.tool.title,
          text: step.reason,
          url: `${siteUrl}/tools/${step.tool.slug}`,
        })),
      };
    }),
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
    description: "bobob.app의 웹 운영 점검 흐름, 개발/AI 글, 가벼운 Play, 도구 결과를 함께 찾는 검색 페이지.",
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
