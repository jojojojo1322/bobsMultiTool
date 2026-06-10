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
  const results = React.useMemo(() => {
    if (!query.trim()) return getLocalizedTools(locale).filter((tool) => tool.monetizationTier === "core").slice(0, 8);
    return searchLocalizedTools(query, locale).slice(0, 8);
  }, [locale, query]);

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
        <div className="grid max-h-80 gap-2 overflow-auto pr-1">
          {results.length ? results.map((tool) => {
            const relatedTools = getLocalizedRelatedTools(tool.relatedTools.slice(0, 2), locale);
            return (
              <div key={tool.slug} className="rounded-md border transition-colors hover:bg-muted/40">
                <Link href={withLocale(`/tools/${tool.slug}`, locale)} className="block px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{tool.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    <Badge>{tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly}</Badge>
                  </div>
                </Link>
                <div className="flex flex-wrap gap-1 border-t px-3 py-2">
                  {relatedTools.map((related) => (
                    <Link
                      key={related.slug}
                      href={withLocale(`/tools/${related.slug}`, locale)}
                      className="rounded-sm border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {dictionary.tool.nextActionPrefix} {related.shortTitle}
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
