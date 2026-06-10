import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PointerBackground } from "@/components/pointer-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, withLocale, type Locale } from "@/features/i18n/config";
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import { toolCategories } from "@/features/tools/registry";
import { ToolSearchPanel } from "@/features/tools/tool-search-panel";
import type { ToolDefinition } from "@/features/tools/types";

const acquisitionClusterSlugs = [
  ["json-formatter", "json-to-typescript", "json-schema-validator", "base64-tool"],
  ["jwt-decoder", "timestamp-converter", "base64-tool", "hash-generator"],
  ["http-status-checker", "dns-lookup", "meta-tag-generator", "open-graph-preview"],
  ["color-converter", "css-formatter", "css-unit-converter", "css-clamp-generator"],
  ["uuid-generator", "password-generator", "qr-code-generator", "random-token-generator"],
  ["regex-tester", "javascript-formatter", "sql-formatter", "text-diff"],
];

const isToolDefinition = (tool: ToolDefinition | undefined): tool is ToolDefinition => Boolean(tool);

export function readSearchQuery(searchParams?: Record<string, string | string[] | undefined>) {
  const value = searchParams?.q;
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function ToolDirectory({
  locale = defaultLocale,
  dictionary,
  initialQuery = "",
  compactHero = false,
}: {
  locale?: Locale;
  dictionary: ClientDictionary;
  initialQuery?: string;
  compactHero?: boolean;
}) {
  const localizedTools = getLocalizedTools(locale);
  const coreTools = localizedTools.filter((tool) => tool.monetizationTier === "core").slice(0, 12);
  const localizedToolBySlug = new Map(localizedTools.map((tool) => [tool.slug, tool]));
  const acquisitionClusters = acquisitionClusterSlugs
    .map((cluster) => cluster.map((slug) => localizedToolBySlug.get(slug)).filter(isToolDefinition))
    .filter((cluster) => cluster.length >= 3);

  return (
    <main className="min-h-screen bg-background" lang={locale} dir={dictionary.dir}>
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href={withLocale("/", locale)} className="text-sm font-semibold tracking-tight">
            {dictionary.nav.brand}
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <ThemeToggle dictionary={dictionary} />
            <LocaleSwitcher locale={locale} dictionary={dictionary} />
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden border-b">
        <PointerBackground />
        <div className={compactHero ? "relative mx-auto max-w-7xl px-4 py-8" : "relative mx-auto max-w-7xl px-4 py-10"}>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <Badge>{dictionary.home.badge}</Badge>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
                {compactHero ? dictionary.home.toolIndexTitle : dictionary.home.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {compactHero ? dictionary.home.toolIndexDescription : dictionary.home.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={withLocale("/tools", locale)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
                >
                  {dictionary.home.openTools} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={withLocale("/guides", locale)}
                  className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {dictionary.home.readGuides}
                </Link>
              </div>
            </div>
            <ToolSearchPanel locale={locale} dictionary={dictionary} initialQuery={initialQuery} />
          </div>
        </div>
      </section>
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {coreTools.map((tool) => (
              <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, locale)} className="rounded-md border bg-background px-3 py-3 transition-colors hover:bg-muted/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{tool.shortTitle}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  <Badge>{dictionary.categories[tool.category] ?? tool.category}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b" data-acquisition-clusters>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{dictionary.nav.relatedTools}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{dictionary.nav.relatedToolsDescription}</p>
            </div>
            <Badge>{dictionary.nav.tools}</Badge>
          </div>
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {acquisitionClusters.map((cluster) => {
              const [leadTool, ...nextTools] = cluster;
              if (!leadTool) return null;

              return (
                <div key={leadTool.slug} className="rounded-md border bg-background p-3">
                  <Link href={withLocale(`/tools/${leadTool.slug}`, locale)} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{leadTool.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{leadTool.description}</p>
                      </div>
                      <Badge>{dictionary.categories[leadTool.category] ?? leadTool.category}</Badge>
                    </div>
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                    {nextTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={withLocale(`/tools/${tool.slug}`, locale)}
                        className="rounded-sm border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {dictionary.tool.nextActionPrefix} {tool.shortTitle}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8">
        {toolCategories.map((category) => {
          const categoryTools = localizedTools.filter((tool) => tool.category === category);
          if (!categoryTools.length) return null;

          return (
            <div key={category} className="mb-10">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{dictionary.categories[category] ?? category}</h2>
                <Badge>{categoryTools.length} {dictionary.nav.tools}</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {categoryTools.map((tool) => (
                  <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, locale)}>
                    <Card className="h-full transition-colors hover:bg-muted/50">
                      <CardHeader>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge>{dictionary.categories[tool.category] ?? tool.category}</Badge>
                          <Badge>{tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly}</Badge>
                        </div>
                        <CardTitle>{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {tool.seo.keywords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword}>{keyword}</Badge>
                        ))}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
