"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { Sidebar } from "@/components/ui/sidebar";
import { defaultLocale, withLocale, type Locale } from "@/features/i18n/config";
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedRelatedTools, searchLocalizedTools } from "@/features/i18n/localized-content";
import { cn } from "@/lib/utils";
import { toolCategories } from "./registry";
import { ToolPanel } from "./tool-components";
import type { ToolDefinition } from "./types";

const navigationScrollStorageKey = (locale: Locale) => `bobob:tool-nav-scroll:${locale}`;

function ToolNavigation({
  activeSlug,
  query,
  onQueryChange,
  onNavigate,
  locale,
  dictionary,
}: {
  activeSlug: string;
  query: string;
  onQueryChange: (query: string) => void;
  onNavigate?: () => void;
  locale: Locale;
  dictionary: ClientDictionary;
}) {
  const filteredTools = React.useMemo(() => {
    return searchLocalizedTools(query, locale);
  }, [locale, query]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollStorageKey = navigationScrollStorageKey(locale);

  React.useLayoutEffect(() => {
    const navigation = scrollRef.current;
    if (!navigation || typeof window === "undefined") return;

    const storedScrollTop = Number(window.localStorage.getItem(scrollStorageKey) ?? 0);
    if (!Number.isFinite(storedScrollTop) || storedScrollTop <= 0) return;

    const restore = () => {
      navigation.scrollTop = storedScrollTop;
    };
    const frame = window.requestAnimationFrame(restore);
    const timeout = window.setTimeout(restore, 80);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [activeSlug, scrollStorageKey]);

  const saveCurrentScroll = React.useCallback(() => {
    const navigation = scrollRef.current;
    if (!navigation || typeof window === "undefined") return;
    window.localStorage.setItem(scrollStorageKey, String(navigation.scrollTop));
  }, [scrollStorageKey]);

  const persistScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(scrollStorageKey, String(event.currentTarget.scrollTop));
    },
    [scrollStorageKey],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <Link href={withLocale("/", locale)} className="text-sm font-semibold tracking-tight">
        {dictionary.nav.brand}
      </Link>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={dictionary.nav.searchPlaceholder}
          className="pl-8"
        />
      </label>
      <div ref={scrollRef} data-tool-navigation-scroll onScroll={persistScroll} className="min-h-0 space-y-5 overflow-auto pr-1">
        {toolCategories.map((category) => {
          const categoryTools = filteredTools.filter((tool) => tool.category === category);
          if (!categoryTools.length) return null;
          return (
            <div key={category} className="space-y-2">
              <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{dictionary.categories[category] ?? category}</p>
              <div className="space-y-1">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={withLocale(`/tools/${tool.slug}`, locale)}
                    scroll={false}
                    onPointerDown={saveCurrentScroll}
                    onClick={() => {
                      saveCurrentScroll();
                      onNavigate?.();
                    }}
                    className={cn(
                      "block rounded-md border border-transparent px-2 py-2 text-sm transition-colors",
                      activeSlug === tool.slug
                        ? "border-border bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    <span className="font-medium">{tool.shortTitle}</span>
                    <span className="mt-0.5 block line-clamp-2 text-xs">{tool.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolReferencePanel({ tool, locale, dictionary }: { tool: ToolDefinition; locale: Locale; dictionary: ClientDictionary }) {
  const relatedTools = getLocalizedRelatedTools(tool.relatedTools, locale);

  return (
    <div className="space-y-5">
      <ReferenceSection title={dictionary.tool.useCases} description={tool.contentCluster}>
        <ul className="space-y-2">
          {tool.useCases.map((useCase) => (
            <li key={useCase} className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              {useCase}
            </li>
          ))}
        </ul>
      </ReferenceSection>
      <ReferenceSection title={dictionary.nav.examples} description={dictionary.tool.examplesDescription}>
        <div className="space-y-3">
          {tool.examples.map((example) => (
            <div key={example.label} className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{example.label}</p>
                <Badge>{dictionary.categories[tool.category] ?? tool.category}</Badge>
              </div>
              <code className="block break-all rounded bg-muted px-2 py-1 text-xs">{example.value}</code>
              <p className="mt-2 text-xs text-muted-foreground">{example.note}</p>
            </div>
          ))}
        </div>
      </ReferenceSection>
      <ReferenceSection title={dictionary.nav.faq} description={dictionary.tool.faqDescription}>
        <Accordion
          items={tool.faqs.map((faq) => ({
            title: faq.question,
            content: faq.answer,
          }))}
        />
      </ReferenceSection>
      <ReferenceSection title={dictionary.nav.guides} description={dictionary.nav.guideDescription}>
        <div className="space-y-2">
          {tool.guides.map((guide) => (
            <Link key={guide.href} href={withLocale(guide.href, locale)} className="block rounded-md border px-3 py-2 text-sm hover:bg-muted">
              {guide.title}
            </Link>
          ))}
        </div>
      </ReferenceSection>
      <ReferenceSection title={dictionary.nav.relatedTools} description={dictionary.nav.relatedToolsDescription}>
        <div className="grid gap-2">
          {relatedTools.map((related) => (
            <Link key={related.slug} href={withLocale(`/tools/${related.slug}`, locale)} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
              {related.title}
            </Link>
          ))}
        </div>
      </ReferenceSection>
    </div>
  );
}

function ReferenceSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="border-b pb-5 last:border-b-0">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ToolWorkspace({
  tool,
  locale = defaultLocale,
  dictionary,
}: {
  tool: ToolDefinition;
  locale?: Locale;
  dictionary: ClientDictionary;
}) {
  const [query, setQuery] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const privacyLabel = tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly;

  return (
    <main className="min-h-screen bg-background" lang={locale} dir={dictionary.dir}>
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label={dictionary.nav.openNavigation}>
              <Menu className="h-4 w-4" />
            </Button>
            <Link href={withLocale("/", locale)} className="shrink-0 text-sm font-semibold tracking-tight hover:text-muted-foreground">
              {dictionary.nav.brand}
            </Link>
            <div className="min-w-0 border-s ps-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{dictionary.tool.developerWorkbench}</p>
              <h1 className="truncate text-lg font-semibold tracking-normal">{tool.title}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ThemeToggle dictionary={dictionary} />
            <LocaleSwitcher locale={locale} dictionary={dictionary} />
            <Badge>{dictionary.categories[tool.category] ?? tool.category}</Badge>
          </div>
        </div>
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <ToolNavigation activeSlug={tool.slug} query={query} onQueryChange={setQuery} onNavigate={() => setMobileOpen(false)} locale={locale} dictionary={dictionary} />
      </Sheet>
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        <ResizablePanelGroup className="min-h-[calc(100vh-7rem)] rounded-lg border bg-background lg:h-[calc(100vh-7rem)] lg:min-h-0">
          <ResizablePanel className="hidden min-h-0 lg:block">
            <Sidebar className="h-full min-h-0 p-4">
              <ToolNavigation activeSlug={tool.slug} query={query} onQueryChange={setQuery} locale={locale} dictionary={dictionary} />
            </Sidebar>
          </ResizablePanel>
          <ResizablePanel className="min-h-0 overflow-auto bg-card">
            <section>
              <div className="border-b p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {tool.seo.keywords.slice(0, 4).map((keyword) => (
                    <Badge key={keyword} className="max-w-full break-words">{keyword}</Badge>
                  ))}
                  <Badge>{dictionary.tool.privacy}: {privacyLabel}</Badge>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-normal">{tool.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{tool.description}</p>
              </div>
              <div className="p-5">
                <ToolPanel component={tool.component} dictionary={dictionary} />
              </div>
            </section>
            <Separator />
            <section className="grid gap-0 md:grid-cols-3">
              <div className="border-b p-4 md:border-b-0 md:border-e">
                <p className="text-sm font-medium">{dictionary.tool.singleDomainTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{dictionary.tool.singleDomainBody}</p>
              </div>
              <div className="border-b p-4 md:border-b-0 md:border-e">
                <p className="text-sm font-medium">{dictionary.tool.localFirstTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{dictionary.tool.localFirstBody}</p>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium">{dictionary.tool.expandableRegistryTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{dictionary.tool.expandableRegistryBody}</p>
              </div>
            </section>
          </ResizablePanel>
          <ResizablePanel className="min-h-0">
            <aside className="h-full min-h-0 overflow-auto bg-background p-4">
              <ToolReferencePanel tool={tool} locale={locale} dictionary={dictionary} />
            </aside>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
