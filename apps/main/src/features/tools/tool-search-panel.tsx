"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { withLocale, type Locale } from "@/features/i18n/config";
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedRelatedTools, getLocalizedTools, searchLocalizedTools } from "@/features/i18n/localized-content";
import type { ToolDefinition } from "./types";
import { getLocalizedWorkflowRecipes, type LocalizedWorkflowRecipe } from "./workflows";

function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getSearchMatchSignals(tool: ToolDefinition, query: string, relatedTools: ToolDefinition[] = []) {
  const normalizedQuery = normalizeSearchValue(query);
  const queryTokens = normalizedQuery.split(" ").filter((token) => token.length > 1);
  const candidates = [
    tool.title,
    tool.shortTitle,
    tool.slug,
    ...tool.aliases,
    ...tool.searchIntents,
    ...tool.seo.keywords,
    ...tool.useCases,
    ...tool.inputExamples,
    ...(tool.failureCases ?? []),
    ...(tool.preCopyChecklist ?? []),
    ...tool.examples.flatMap((example) => [example.label, example.note]),
    ...tool.faqs.flatMap((faq) => [faq.question]),
    ...tool.guides.map((guide) => guide.title),
    ...relatedTools.flatMap((related) => [related.title, related.shortTitle, related.description, ...related.useCases]),
  ]
    .map((value) => value.trim())
    .filter(Boolean);

  const matched = normalizedQuery
    ? candidates.filter((value) => {
        const normalizedValue = normalizeSearchValue(value);
        return normalizedValue.includes(normalizedQuery) || queryTokens.some((token) => normalizedValue.includes(token));
      })
    : [...tool.useCases, ...tool.inputExamples, ...tool.searchIntents];

  const suppressed = new Set([tool.title, tool.shortTitle, tool.description].map(normalizeSearchValue));
  return Array.from(new Set(matched))
    .filter((value) => !suppressed.has(normalizeSearchValue(value)))
    .slice(0, 3);
}

function workflowRecipeMatches(recipe: LocalizedWorkflowRecipe, query: string) {
  return scoreWorkflowRecipeSearch(recipe, query) > 0;
}

function scoreWorkflowRecipeSearch(recipe: LocalizedWorkflowRecipe, query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return 0;
  const queryTokens = normalizedQuery.split(" ").filter((token) => token.length > 1);
  const title = normalizeSearchValue(recipe.title);
  const description = normalizeSearchValue(recipe.description);
  const intents = recipe.searchIntents.map(normalizeSearchValue);
  const stepTitles = recipe.steps.flatMap((step) => [step.tool.title, step.tool.shortTitle]).map(normalizeSearchValue);
  const stepReasons = recipe.steps.map((step) => normalizeSearchValue(step.reason));
  const stepToolSignals = recipe.steps.flatMap((step) => [step.tool.description, ...step.tool.searchIntents, ...step.tool.aliases]).map(normalizeSearchValue);
  const candidates = [title, description, ...intents, ...stepTitles, ...stepReasons, ...stepToolSignals];

  let score = 0;
  if (title === normalizedQuery) score += 140;
  if (title.startsWith(normalizedQuery)) score += 90;
  if (title.includes(normalizedQuery)) score += 70;
  if (intents.some((intent) => intent === normalizedQuery)) score += 130;
  if (intents.some((intent) => intent.includes(normalizedQuery))) score += 95;
  if (description.includes(normalizedQuery)) score += 40;
  if (stepTitles.some((value) => value.includes(normalizedQuery))) score += 25;
  if (stepReasons.some((value) => value.includes(normalizedQuery))) score += 25;
  if (stepToolSignals.some((value) => value.includes(normalizedQuery))) score += 15;

  if (queryTokens.length > 1 && queryTokens.every((token) => [title, ...intents].some((value) => value.includes(token)))) score += 80;
  if (queryTokens.length > 1 && queryTokens.every((token) => candidates.some((value) => value.includes(token)))) score += 25;

  for (const token of queryTokens) {
    if (title.includes(token)) score += 18;
    if (intents.some((intent) => intent.includes(token))) score += 24;
    if (description.includes(token)) score += 8;
    if (stepReasons.some((value) => value.includes(token))) score += 6;
    if (stepToolSignals.some((value) => value.includes(token))) score += 4;
  }

  return score;
}

export function ToolSearchPanel({
  locale,
  dictionary,
  initialQuery = "",
}: {
  locale: Locale;
  dictionary: ClientDictionary;
  initialQuery?: string;
}) {
  const [query, setQuery] = React.useState(initialQuery);
  const localizedTools = React.useMemo(() => getLocalizedTools(locale), [locale]);
  const results = React.useMemo(() => {
    if (!query.trim()) return localizedTools.filter((tool) => tool.monetizationTier === "core").slice(0, 8);
    return searchLocalizedTools(query, locale).slice(0, 8);
  }, [locale, localizedTools, query]);
  const workflowResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return getLocalizedWorkflowRecipes(locale, localizedTools)
      .map((recipe) => ({ recipe, score: scoreWorkflowRecipeSearch(recipe, query) }))
      .filter((match) => match.score > 0 && workflowRecipeMatches(match.recipe, query))
      .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title))
      .slice(0, 3)
      .map((match) => match.recipe);
  }, [locale, localizedTools, query]);

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const updateQuery = React.useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const trimmed = nextQuery.trim();
    if (trimmed) {
      url.searchParams.set("q", trimmed);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.home.toolIndexTitle}</CardTitle>
        <CardDescription>{dictionary.home.toolIndexDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder={dictionary.nav.searchPlaceholder}
            className="pl-8"
          />
        </label>
        {workflowResults.length ? (
          <div className="grid gap-2" data-search-workflow-recipes>
            {workflowResults.map((recipe) => {
              const firstStep = recipe.steps[0];
              if (!firstStep) return null;
              return (
                <Link key={recipe.slug} href={withLocale(`/tools/${firstStep.tool.slug}`, locale)} className="rounded-md border bg-muted/20 px-3 py-2 text-sm transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{recipe.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{recipe.description}</p>
                    </div>
                    <Badge>{dictionary.tool.developerWorkbench}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {recipe.steps.map((step, index) => (
                      <span key={`${recipe.slug}-${step.tool.slug}`} className="max-w-full rounded-sm border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {index + 1}. {step.tool.shortTitle}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
        <div className="grid max-h-80 gap-2 overflow-auto pr-1">
          {results.length ? results.map((tool) => {
            const relatedTools = getLocalizedRelatedTools(tool.relatedTools.slice(0, 2), locale);
            const matchSignals = getSearchMatchSignals(tool, query, relatedTools);
            return (
              <div key={tool.slug} className="rounded-md border transition-colors hover:bg-muted/40">
                <Link href={withLocale(`/tools/${tool.slug}`, locale)} className="block px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{tool.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                      {matchSignals.length ? (
                        <div className="mt-2 flex flex-wrap gap-1" data-search-match-signals>
                          {matchSignals.map((signal) => (
                            <Badge key={signal} className="max-w-[12rem] truncate text-[11px] font-normal sm:max-w-[14rem]">
                              {signal}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <Badge>{tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly}</Badge>
                  </div>
                </Link>
                <div className="flex flex-wrap gap-1 border-t px-3 py-2">
                  {relatedTools.map((related) => (
                    <Link
                      key={related.slug}
                      href={withLocale(`/tools/${related.slug}`, locale)}
                      className="max-w-full rounded-sm border bg-background px-2 py-1 text-xs transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">
                        {dictionary.tool.nextActionPrefix} {related.shortTitle}
                      </span>
                      <span className="mt-0.5 block max-w-[12rem] truncate text-muted-foreground">{related.useCases[0] ?? related.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }) : (
            <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
              {dictionary.nav.tools}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
