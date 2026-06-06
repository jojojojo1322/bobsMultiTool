"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { withLocale, type Locale } from "@/features/i18n/config";
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedTools, searchLocalizedTools } from "@/features/i18n/localized-content";

export function ToolSearchPanel({ locale, dictionary }: { locale: Locale; dictionary: ClientDictionary }) {
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => {
    if (!query.trim()) return getLocalizedTools(locale).filter((tool) => tool.monetizationTier === "core").slice(0, 8);
    return searchLocalizedTools(query, locale).slice(0, 8);
  }, [locale, query]);

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
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dictionary.nav.searchPlaceholder}
            className="pl-8"
          />
        </label>
        <div className="grid max-h-80 gap-2 overflow-auto pr-1">
          {results.map((tool) => (
            <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, locale)} className="rounded-md border px-3 py-2 transition-colors hover:bg-muted/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{tool.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                </div>
                <Badge>{locale === "en" ? tool.demandTier : (tool.seo.keywords[3] ?? tool.demandTier)}</Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
