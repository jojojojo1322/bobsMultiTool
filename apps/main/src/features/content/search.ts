import { getLocalizedTools } from "@/features/i18n/localized-content";
import {
  getLocalizedWorkflowRecipes,
  scoreWorkflowRecipeSearch,
  type LocalizedWorkflowRecipe,
} from "@/features/tools/workflows";
import { getIndexableBlogPosts } from "./blog";
import { getPlayContents } from "./play";
import type { BlogBlock, BlogPost, PlayContent } from "./types";

export type ContentSearchResult<T> = {
  item: T;
  score: number;
  signals: string[];
};

function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/g, " ").trim();
}

function queryTokens(query: string) {
  return normalizeSearchValue(query).split(" ").filter((token) => token.length > 1);
}

function blockText(block: BlogBlock) {
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "table") return [...block.headers, ...block.rows.flat()].join(" ");
  return block.text;
}

function playSearchValues(content: PlayContent) {
  const baseValues = [
    content.title,
    content.description,
    content.slug,
    content.durationLabel,
    content.type,
    content.shareText,
    ...content.relatedBlogSlugs,
    ...content.relatedPlaySlugs,
  ];

  if (content.type === "micro-sim") {
    return [
      ...baseValues,
      ...content.stats.map((stat) => stat.label),
      ...content.turns.flatMap((turn) => [turn.title, turn.situation, ...turn.choices.flatMap((choice) => [choice.label, choice.detail])]),
      ...content.endings.flatMap((ending) => [ending.title, ending.description]),
    ];
  }

  if (content.type === "tap-game") {
    return [
      ...baseValues,
      content.targetLabel,
      content.decoyLabel,
      ...content.targets.flatMap((target) => [target.label, target.detail, target.kind]),
      ...content.endings.flatMap((ending) => [ending.title, ending.description]),
    ];
  }

  if (content.type === "arcade-game") {
    return [
      ...baseValues,
      content.arcade.variant,
      content.arcade.goal,
      content.arcade.controls,
      content.arcade.playerLabel,
      ...content.arcade.goodLabels,
      ...content.arcade.badLabels,
      ...content.endings.flatMap((ending) => [ending.title, ending.description]),
    ];
  }

  return [
    ...baseValues,
    ...content.categories.flatMap((category) => [category.label, category.description]),
    ...content.items.flatMap((item) => [item.label, item.detail, item.categoryId]),
    ...content.endings.flatMap((ending) => [ending.title, ending.description]),
  ];
}

function scoreValues({
  query,
  title,
  description,
  values,
}: {
  query: string;
  title: string;
  description: string;
  values: string[];
}) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return { score: 0, signals: [] };
  const tokens = queryTokens(query);
  const normalizedTitle = normalizeSearchValue(title);
  const normalizedDescription = normalizeSearchValue(description);
  const normalizedValues = values.map((value) => ({ raw: value, normalized: normalizeSearchValue(value) })).filter((value) => value.normalized);
  let score = 0;

  if (normalizedTitle === normalizedQuery) score += 120;
  if (normalizedTitle.includes(normalizedQuery)) score += 80;
  if (normalizedDescription.includes(normalizedQuery)) score += 45;

  for (const token of tokens) {
    if (normalizedTitle.includes(token)) score += 25;
    if (normalizedDescription.includes(token)) score += 12;
  }

  const signals = normalizedValues
    .filter(({ normalized }) => normalized.includes(normalizedQuery) || tokens.some((token) => normalized.includes(token)))
    .map(({ raw }) => raw)
    .filter((value) => normalizeSearchValue(value) !== normalizedTitle && normalizeSearchValue(value) !== normalizedDescription);

  score += Math.min(signals.length, 6) * 8;

  return {
    score,
    signals: Array.from(new Set(signals)).slice(0, 4),
  };
}

function scoreBlogPost(post: BlogPost, query: string, playBySlug: Map<string, PlayContent>): ContentSearchResult<BlogPost> {
  const relatedPlayValues = post.relatedPlaySlugs.flatMap((slug) => {
    const content = playBySlug.get(slug);
    return content ? [slug, content.title, content.description, content.type] : [slug];
  });
  const values = [post.category, post.slug, ...relatedPlayValues, ...post.body.map(blockText)];
  const result = scoreValues({ query, title: post.title, description: post.description, values });
  return { item: post, ...result };
}

function scorePlayContent(content: PlayContent, query: string): ContentSearchResult<PlayContent> {
  const result = scoreValues({ query, title: content.title, description: content.description, values: playSearchValues(content) });
  return { item: content, ...result };
}

function scoreTool(tool: ReturnType<typeof getLocalizedTools>[number], query: string) {
  const values = [
    tool.shortTitle,
    tool.slug,
    tool.category,
    ...tool.aliases,
    ...tool.searchIntents,
    ...tool.seo.keywords,
    ...tool.useCases,
    ...tool.inputExamples,
    ...(tool.failureCases ?? []),
    ...(tool.preCopyChecklist ?? []),
    ...tool.examples.flatMap((example) => [example.label, example.note]),
    ...tool.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];
  return scoreValues({ query, title: tool.title, description: tool.description, values });
}

const defaultWorkflowSlugs = [
  "debug-redirect",
  "check-search-discovery-readiness",
  "check-dns-deployment",
  "review-security-headers",
];

function workflowSearchValues(recipe: LocalizedWorkflowRecipe) {
  return [
    recipe.slug,
    ...recipe.searchIntents,
    ...recipe.steps.flatMap((step) => [
      step.reason,
      step.tool.title,
      step.tool.shortTitle,
      step.tool.slug,
      step.tool.description,
      ...step.tool.aliases,
      ...step.tool.searchIntents,
      ...step.tool.useCases,
      ...step.tool.inputExamples,
      ...(step.tool.failureCases ?? []),
      ...(step.tool.preCopyChecklist ?? []),
    ]),
  ];
}

function scoreWorkflowRecipe(recipe: LocalizedWorkflowRecipe, query: string): ContentSearchResult<LocalizedWorkflowRecipe> {
  const workflowScore = scoreWorkflowRecipeSearch(recipe, query);
  const result = scoreValues({
    query,
    title: recipe.title,
    description: recipe.description,
    values: workflowSearchValues(recipe),
  });

  return {
    item: recipe,
    score: workflowScore + result.score,
    signals: result.signals,
  };
}

export function readContentSearchQuery(searchParams?: Record<string, string | string[] | undefined>) {
  const value = searchParams?.q;
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function searchContentLab(query: string) {
  const trimmedQuery = query.trim();
  const blogPosts = getIndexableBlogPosts();
  const playContents = getPlayContents();
  const playBySlug = new Map(playContents.map((content) => [content.slug, content]));
  const tools = getLocalizedTools("ko");
  const workflowRecipes = getLocalizedWorkflowRecipes("ko", tools);

  if (!trimmedQuery) {
    const defaultWorkflowRank = new Map(defaultWorkflowSlugs.map((slug, index) => [slug, index]));

    return {
      query: "",
      workflowResults: workflowRecipes
        .filter((recipe) => defaultWorkflowRank.has(recipe.slug))
        .sort((left, right) => (defaultWorkflowRank.get(left.slug) ?? 999) - (defaultWorkflowRank.get(right.slug) ?? 999))
        .map((recipe) => ({
          item: recipe,
          score: 0,
          signals: recipe.steps.map((step) => step.tool.shortTitle).slice(0, 4),
        })),
      blogResults: blogPosts.slice(0, 5).map((post) => ({ item: post, score: 0, signals: [post.category] })),
      playResults: playContents.slice(0, 5).map((content) => ({ item: content, score: 0, signals: [content.durationLabel] })),
      toolResults: tools.filter((tool) => tool.monetizationTier === "core").slice(0, 6).map((tool) => ({ item: tool, score: 0, signals: tool.useCases.slice(0, 2) })),
    };
  }

  return {
    query: trimmedQuery,
    workflowResults: workflowRecipes
      .map((recipe) => scoreWorkflowRecipe(recipe, trimmedQuery))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 5),
    blogResults: blogPosts
      .map((post) => scoreBlogPost(post, trimmedQuery, playBySlug))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
      .slice(0, 8),
    playResults: playContents
      .map((content) => scorePlayContent(content, trimmedQuery))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || (a.item.order ?? 999) - (b.item.order ?? 999))
      .slice(0, 8),
    toolResults: tools
      .map((tool) => ({ item: tool, ...scoreTool(tool, trimmedQuery) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 6),
  };
}
