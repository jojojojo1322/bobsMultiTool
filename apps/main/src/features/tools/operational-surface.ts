import type { ToolDefinition } from './types';

export const operationalToolSlugs = [
  "http-status-checker",
  "dns-lookup",
  "sitemap-generator",
  "robots-txt-generator",
  "meta-tag-generator",
  "url-parser",
  "jwt-decoder",
  "json-formatter",
] as const;

export function orderToolsWithOperationalFirst<T extends { slug: string }>(tools: T[]) {
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const orderedSlugs = Array.from(new Set([...operationalToolSlugs, ...tools.map((tool) => tool.slug)]));
  return orderedSlugs.map((slug) => toolBySlug.get(slug)).filter((tool): tool is T => Boolean(tool));
}

export function pickOperationalCoreTools(tools: ToolDefinition[], limit: number) {
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const orderedSlugs = Array.from(
    new Set([
      ...operationalToolSlugs,
      ...tools.filter((tool) => tool.monetizationTier === 'core').map((tool) => tool.slug),
    ]),
  );
  return orderedSlugs
    .map((slug) => toolBySlug.get(slug))
    .filter((tool): tool is ToolDefinition => Boolean(tool))
    .slice(0, limit);
}
