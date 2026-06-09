import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, withLocale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { toolCategories, tools } from "@/features/tools/registry";
import { ToolSearchPanel } from "@/features/tools/tool-search-panel";

export default function HomePage() {
  const dictionary = getClientDictionary(defaultLocale);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {dictionary.nav.brand}
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <ThemeToggle dictionary={dictionary} />
            <LocaleSwitcher locale={defaultLocale} dictionary={dictionary} />
          </div>
        </div>
      </header>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <Badge>{dictionary.home.badge}</Badge>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
                {dictionary.home.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{dictionary.home.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={withLocale("/tools/regex-tester", defaultLocale)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200"
                >
                  {dictionary.home.openTools} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={withLocale("/guides", defaultLocale)}
                  className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {dictionary.home.readGuides}
                </Link>
              </div>
            </div>
            <ToolSearchPanel locale={defaultLocale} dictionary={dictionary} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8">
        {toolCategories.map((category) => (
          <div key={category} className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{dictionary.categories[category] ?? category}</h2>
              <Badge>{tools.filter((tool) => tool.category === category).length} tools</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {tools
                .filter((tool) => tool.category === category)
                .map((tool) => (
                  <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, defaultLocale)}>
                    <Card className="h-full transition-colors hover:bg-muted/50">
                      <CardHeader>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge>{tool.contentCluster}</Badge>
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
        ))}
      </section>
    </main>
  );
}
