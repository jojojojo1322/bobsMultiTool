"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, Link2, ListChecks, Menu, RotateCcw, Search, Star, Trash2 } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { GoogleAdUnit } from "@/components/GoogleAdsense";
import { PointerBackground } from "@/components/pointer-background";
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
import { getLocalizedRelatedTools, getLocalizedTools, searchLocalizedTools } from "@/features/i18n/localized-content";
import { cn } from "@/lib/utils";
import { toolCategories } from "./registry";
import { ToolPanel } from "./tool-components";
import type { ToolDefinition } from "./types";
import { getWorkflowRecipesForTool, type LocalizedWorkflowRecipe } from "./workflows";

const navigationScrollStorageKey = (locale: Locale) => `bobob:tool-nav-scroll:${locale}`;
const recentToolsStorageKey = (locale: Locale) => `bobob:recent-tools:${locale}`;
const favoriteToolsStorageKey = (locale: Locale) => `bobob:favorite-tools:${locale}`;
const toolSessionStorageKey = (locale: Locale, slug: string) => `bobob:tool-session:${locale}:${slug}`;
const adsEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";
const adsPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const toolResultAdSlot = process.env.NEXT_PUBLIC_ADSENSE_TOOL_RESULT_SLOT;
const referenceAdSlot = process.env.NEXT_PUBLIC_ADSENSE_REFERENCE_SLOT;
const maxRecentTools = 6;
const maxFavoriteTools = 12;
type ToolSessionField = { key: string; value: string; checked?: boolean };
type ToolSession = { fields: ToolSessionField[]; updatedAt: number };

function readStoredToolSlugs(storageKey: string, limit: number) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((slug): slug is string => typeof slug === "string").slice(0, limit);
  } catch {
    return [];
  }
}

function readRecentToolSlugs(locale: Locale) {
  return readStoredToolSlugs(recentToolsStorageKey(locale), maxRecentTools);
}

function writeRecentToolSlug(locale: Locale, slug: string) {
  if (typeof window === "undefined") return;
  const slugs = readRecentToolSlugs(locale);
  const nextSlugs = [slug, ...slugs.filter((storedSlug) => storedSlug !== slug)].slice(0, maxRecentTools);
  window.localStorage.setItem(recentToolsStorageKey(locale), JSON.stringify(nextSlugs));
}

function readFavoriteToolSlugs(locale: Locale) {
  return readStoredToolSlugs(favoriteToolsStorageKey(locale), maxFavoriteTools);
}

function writeFavoriteToolSlugs(locale: Locale, slugs: string[]) {
  if (typeof window === "undefined") return;
  const uniqueSlugs = Array.from(new Set(slugs)).slice(0, maxFavoriteTools);
  window.localStorage.setItem(favoriteToolsStorageKey(locale), JSON.stringify(uniqueSlugs));
}

async function writeClipboardText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function getSessionControls(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select")).filter((element) => {
    if (element instanceof HTMLInputElement) {
      return !["button", "submit", "reset", "hidden", "file"].includes(element.type);
    }
    return true;
  });
}

function sessionControlKey(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, index: number) {
  const explicitKey = element.getAttribute("data-session-key") || element.getAttribute("name") || element.getAttribute("aria-label");
  return `${element.tagName.toLowerCase()}:${explicitKey || index}`;
}

function readToolSession(storageKey: string): ToolSession | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as ToolSession | null;
    if (!parsed || !Array.isArray(parsed.fields)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function collectToolSession(root: HTMLElement): ToolSession {
  return {
    fields: getSessionControls(root).map((element, index) => ({
      key: sessionControlKey(element, index),
      value: element.value,
      checked: element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type) ? element.checked : undefined,
    })),
    updatedAt: Date.now(),
  };
}

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string, checked?: boolean) {
  if (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) {
    element.checked = Boolean(checked);
  }
  const descriptor = Object.getOwnPropertyDescriptor(element.constructor.prototype, "value");
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function applyToolSession(root: HTMLElement, session: ToolSession) {
  const byKey = new Map(session.fields.map((field) => [field.key, field]));
  getSessionControls(root).forEach((element, index) => {
    const field = byKey.get(sessionControlKey(element, index));
    if (!field) return;
    setNativeValue(element, field.value, field.checked);
  });
}

function ToolSessionControls({
  locale,
  toolSlug,
  dictionary,
  children,
}: {
  locale: Locale;
  toolSlug: string;
  dictionary: ClientDictionary;
  children: React.ReactNode;
}) {
  const storageKey = toolSessionStorageKey(locale, toolSlug);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const initialSessionRef = React.useRef<ToolSession | null>(null);
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    const storedSession = readToolSession(storageKey);
    initialSessionRef.current = storedSession;
    setHasSession(Boolean(storedSession));
  }, [storageKey]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    const save = () => {
      const session = collectToolSession(root);
      if (!session.fields.length) return;
      window.localStorage.setItem(storageKey, JSON.stringify(session));
      setHasSession(true);
    };
    root.addEventListener("input", save);
    root.addEventListener("change", save);
    return () => {
      root.removeEventListener("input", save);
      root.removeEventListener("change", save);
    };
  }, [storageKey]);

  const restoreSession = React.useCallback(() => {
    const root = rootRef.current;
    const session = initialSessionRef.current ?? readToolSession(storageKey);
    if (!root || !session) return;
    applyToolSession(root, session);
    setHasSession(true);
  }, [storageKey]);

  const clearSession = React.useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
    initialSessionRef.current = null;
    setHasSession(false);
  }, [storageKey]);

  return (
    <div ref={rootRef} className="space-y-4" data-tool-session={hasSession ? "saved" : "empty"}>
      {children}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3" data-tool-session-controls>
        <div className="min-w-0">
          <p className="text-sm font-medium">{dictionary.tool.localSessionTitle}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{dictionary.tool.localSessionBody}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={restoreSession} disabled={!hasSession}>
            <RotateCcw className="h-4 w-4" />
            {dictionary.tool.restoreLastWork}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={clearSession} disabled={!hasSession}>
            <Trash2 className="h-4 w-4" />
            {dictionary.tool.clearLocalHistory}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToolNavigation({
  activeSlug,
  query,
  onQueryChange,
  onNavigate,
  locale,
  dictionary,
  favoriteSlugs,
}: {
  activeSlug: string;
  query: string;
  onQueryChange: (query: string) => void;
  onNavigate?: () => void;
  locale: Locale;
  dictionary: ClientDictionary;
  favoriteSlugs: string[];
}) {
  const filteredTools = React.useMemo(() => {
    return searchLocalizedTools(query, locale);
  }, [locale, query]);
  const [recentSlugs, setRecentSlugs] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollStorageKey = navigationScrollStorageKey(locale);
  const recentTools = React.useMemo(() => getLocalizedRelatedTools(recentSlugs, locale), [locale, recentSlugs]);
  const favoriteTools = React.useMemo(() => getLocalizedRelatedTools(favoriteSlugs, locale), [favoriteSlugs, locale]);
  const showFavoriteTools = !query.trim() && favoriteTools.length > 0;
  const showRecentTools = !query.trim() && recentTools.length > 0;

  React.useEffect(() => {
    setRecentSlugs(readRecentToolSlugs(locale).filter((slug) => slug !== activeSlug));
  }, [activeSlug, locale]);

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
        {showFavoriteTools ? (
          <div className="space-y-2" data-favorite-tools>
            <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{dictionary.nav.favoriteTools}</p>
            <div className="space-y-1">
              {favoriteTools.map((tool) => (
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
                    activeSlug === tool.slug ? "border-border bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  )}
                >
                  <span className="inline-flex min-w-0 items-center gap-2 font-medium">
                    <Star className="h-3.5 w-3.5 shrink-0 fill-current" />
                    <span className="truncate">{tool.shortTitle}</span>
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-xs">{tool.description}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {showRecentTools ? (
          <div className="space-y-2" data-recent-tools>
            <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{dictionary.nav.recentTools}</p>
            <div className="space-y-1">
              {recentTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={withLocale(`/tools/${tool.slug}`, locale)}
                  scroll={false}
                  onPointerDown={saveCurrentScroll}
                  onClick={() => {
                    saveCurrentScroll();
                    onNavigate?.();
                  }}
                  className="block rounded-md border border-transparent px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  <span className="font-medium">{tool.shortTitle}</span>
                  <span className="mt-0.5 block line-clamp-1 text-xs">{tool.description}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
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
  const workflowRecipes = getWorkflowRecipesForTool(tool.slug, locale, getLocalizedTools(locale), 3);
  const nextRelatedTitle = relatedTools[0]?.shortTitle;
  const categoryLabel = dictionary.categories[tool.category] ?? tool.category;
  const fallbackFailureCases = React.useMemo(() => commonFailureCases(tool, dictionary), [tool, dictionary]);
  const fallbackPreCopyChecklist = React.useMemo(() => commonPreCopyChecklist(tool, dictionary, nextRelatedTitle), [tool, dictionary, nextRelatedTitle]);
  const failureCases = tool.failureCases?.length ? tool.failureCases : fallbackFailureCases;
  const preCopyChecklist = tool.preCopyChecklist?.length ? tool.preCopyChecklist : fallbackPreCopyChecklist;

  return (
    <div className="space-y-5">
      <ReferenceSection title={dictionary.tool.useCases} description={categoryLabel}>
        <ul className="space-y-2">
          {tool.useCases.map((useCase) => (
            <li key={useCase} className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              {useCase}
            </li>
          ))}
        </ul>
      </ReferenceSection>
      {workflowRecipes.length ? (
        <ReferenceSection title={dictionary.tool.developerWorkbench} description={dictionary.home.description}>
          <WorkflowRecipeList recipes={workflowRecipes} locale={locale} dictionary={dictionary} />
        </ReferenceSection>
      ) : null}
      <ReferenceSection title={dictionary.tool.failureCases} description={dictionary.tool.failureCasesDescription}>
        <ul className="space-y-2">
          {failureCases.map((failureCase) => (
            <li key={failureCase} className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              {failureCase}
            </li>
          ))}
        </ul>
      </ReferenceSection>
      <ReferenceSection title={dictionary.tool.preCopyChecklist} description={dictionary.tool.preCopyChecklistDescription}>
        <ul className="space-y-2">
          {preCopyChecklist.map((item) => (
            <li key={item} className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              {item}
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
              <span className="font-medium">{related.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {dictionary.tool.nextActionPrefix} {related.useCases[0] ?? related.shortTitle}
              </span>
            </Link>
          ))}
        </div>
      </ReferenceSection>
      <GoogleAdUnit
        enabled={adsEnabled}
        publisherId={adsPublisherId}
        slot={referenceAdSlot}
        position="reference-panel"
        format="rectangle"
        minHeight={280}
        className="border-t pt-5"
      />
    </div>
  );
}

function MobileReferenceAccordion({ tool, locale, dictionary }: { tool: ToolDefinition; locale: Locale; dictionary: ClientDictionary }) {
  const relatedTools = getLocalizedRelatedTools(tool.relatedTools.slice(0, 3), locale);
  const workflowRecipes = getWorkflowRecipesForTool(tool.slug, locale, getLocalizedTools(locale), 2);
  const nextRelatedTitle = relatedTools[0]?.shortTitle;
  const failureCases = (tool.failureCases?.length ? tool.failureCases : commonFailureCases(tool, dictionary)).slice(0, 3);
  const preCopyChecklist = (tool.preCopyChecklist?.length ? tool.preCopyChecklist : commonPreCopyChecklist(tool, dictionary, nextRelatedTitle)).slice(0, 3);

  return (
    <section id="tool-mobile-reference" className="border-b bg-background lg:hidden" data-mobile-reference-sections>
      <div className="p-4">
        <Accordion
          className="bg-card"
          items={[
            {
              title: dictionary.tool.preCopyChecklist,
              content: (
                <ul className="space-y-2">
                  {preCopyChecklist.map((item) => (
                    <li key={item} className="border-s ps-3 leading-5">
                      {item}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: dictionary.tool.failureCases,
              content: (
                <ul className="space-y-2">
                  {failureCases.map((failureCase) => (
                    <li key={failureCase} className="border-s ps-3 leading-5">
                      {failureCase}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: dictionary.nav.examples,
              content: (
                <div className="space-y-3">
                  {tool.examples.map((example) => (
                    <div key={example.label} className="rounded-md border bg-background p-3">
                      <p className="font-medium text-foreground">{example.label}</p>
                      <code className="mt-2 block max-h-24 overflow-auto break-all rounded bg-muted px-2 py-1 text-xs">{example.value}</code>
                      <p className="mt-2 text-xs">{example.note}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: dictionary.nav.faq,
              content: (
                <div className="space-y-3">
                  {tool.faqs.map((faq) => (
                    <div key={faq.question}>
                      <p className="font-medium text-foreground">{faq.question}</p>
                      <p className="mt-1 leading-5">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: dictionary.nav.relatedTools,
              content: (
                <div className="grid gap-2">
                  {workflowRecipes.map((recipe) => (
                    <WorkflowRecipeLink key={recipe.slug} recipe={recipe} locale={locale} dictionary={dictionary} />
                  ))}
                  {tool.guides.slice(0, 2).map((guide) => (
                    <Link key={guide.href} href={withLocale(guide.href, locale)} className="rounded-md border bg-background px-3 py-2 text-sm text-foreground">
                      {guide.title}
                    </Link>
                  ))}
                  {relatedTools.map((related) => (
                    <Link key={related.slug} href={withLocale(`/tools/${related.slug}`, locale)} className="rounded-md border bg-background px-3 py-2 text-sm text-foreground">
                      <span className="font-medium">{related.shortTitle}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {dictionary.tool.nextActionPrefix} {related.useCases[0] ?? related.description}
                      </span>
                    </Link>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}

function MobileActionBar({
  tool,
  locale,
  dictionary,
  isFavorite,
  onToggleFavorite,
}: {
  tool: ToolDefinition;
  locale: Locale;
  dictionary: ClientDictionary;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const nextTool = getLocalizedRelatedTools(tool.relatedTools.slice(0, 1), locale)[0];

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-[1fr_1fr_1fr] gap-1 rounded-lg border bg-background/95 p-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden"
      data-mobile-action-bar
      aria-label={dictionary.tool.developerWorkbench}
    >
      <a href="#tool-surface" className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
        <ListChecks className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{dictionary.toolUi.input}</span>
      </a>
      <button
        type="button"
        className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
      >
        <Star className={cn("h-3.5 w-3.5 shrink-0", isFavorite ? "fill-current" : "")} />
        <span className="truncate">{isFavorite ? dictionary.tool.removeFavorite : dictionary.tool.addFavorite}</span>
      </button>
      {nextTool ? (
        <Link href={withLocale(`/tools/${nextTool.slug}`, locale)} className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{nextTool.shortTitle}</span>
        </Link>
      ) : (
        <a href="#tool-mobile-reference" className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{dictionary.tool.preCopyChecklist}</span>
        </a>
      )}
    </nav>
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

function PrimaryWorkArea({ dictionary, children }: { dictionary: ClientDictionary; children: React.ReactNode }) {
  return (
    <section id="tool-surface" className="border-b bg-background p-4 sm:p-5" data-tool-surface>
      <div className="bobob-primary-work-area overflow-hidden rounded-lg border bg-card shadow-sm ring-1 ring-border/60" data-primary-work-area>
        <div className="bobob-primary-work-heading flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {dictionary.toolUi.input} / {dictionary.toolUi.output}
          </p>
          <span className="text-xs text-muted-foreground">{dictionary.toolUi.copyReadyOutput}</span>
        </div>
        <div className="p-4 md:p-5" data-primary-work-content>
          {children}
        </div>
      </div>
    </section>
  );
}

function ToolQuickStart({ tool, dictionary }: { tool: ToolDefinition; dictionary: ClientDictionary }) {
  const inputExamples = tool.inputExamples.slice(0, 3);
  const useCases = tool.useCases.slice(0, 2);
  const categoryLabel = dictionary.categories[tool.category] ?? tool.category;

  return (
    <section className="grid gap-0 border-b bg-background/60 md:grid-cols-[1fr_1fr]" data-tool-quick-start>
      <div className="border-b p-4 md:border-b-0 md:border-e">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">{dictionary.nav.examples}</h3>
          <span className="text-xs text-muted-foreground">{dictionary.tool.examplesDescription}</span>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          {inputExamples.map((example) => (
            <code key={example} className="max-w-full break-all rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground">
              {example}
            </code>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">{dictionary.tool.useCases}</h3>
          <span className="text-xs text-muted-foreground">{categoryLabel}</span>
        </div>
        <ul className="grid gap-2">
          {useCases.map((useCase) => (
            <li key={useCase} className="text-sm leading-5 text-muted-foreground">
              {useCase}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ToolReviewStrip({ tool, dictionary }: { tool: ToolDefinition; dictionary: ClientDictionary }) {
  const failureCases = (tool.failureCases?.length ? tool.failureCases : commonFailureCases(tool, dictionary)).slice(0, 2);
  const preCopyChecklist = (tool.preCopyChecklist?.length ? tool.preCopyChecklist : commonPreCopyChecklist(tool, dictionary)).slice(0, 2);

  return (
    <section className="grid gap-0 border-b bg-muted/20 md:grid-cols-[1fr_1fr]" data-tool-review-strip>
      <div className="border-b p-4 md:border-b-0 md:border-e">
        <div className="mb-3">
          <h3 className="text-sm font-semibold">{dictionary.tool.failureCases}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{dictionary.tool.failureCasesDescription}</p>
        </div>
        <ul className="grid gap-2">
          {failureCases.map((failureCase) => (
            <li key={failureCase} className="border-s ps-3 text-sm leading-5 text-muted-foreground">
              {failureCase}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold">{dictionary.tool.preCopyChecklist}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{dictionary.tool.preCopyChecklistDescription}</p>
        </div>
        <ul className="grid gap-2">
          {preCopyChecklist.map((item) => (
            <li key={item} className="border-s ps-3 text-sm leading-5 text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ToolNextActions({ tool, locale, dictionary }: { tool: ToolDefinition; locale: Locale; dictionary: ClientDictionary }) {
  const relatedTools = getLocalizedRelatedTools(tool.relatedTools.slice(0, 3), locale);
  const workflowRecipes = getWorkflowRecipesForTool(tool.slug, locale, getLocalizedTools(locale), 2);
  if (!relatedTools.length && !workflowRecipes.length) return null;

  return (
    <section className="bg-muted/20 px-5 py-4" data-tool-next-actions>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{dictionary.nav.relatedTools}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{dictionary.nav.relatedToolsDescription}</p>
        </div>
        {tool.guides[0] ? (
          <Link href={withLocale(tool.guides[0].href, locale)} className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            {dictionary.nav.guides}
          </Link>
        ) : null}
      </div>
      {workflowRecipes.length ? (
        <div className="mb-3 grid gap-2 md:grid-cols-2" data-tool-workflow-recipes>
          {workflowRecipes.map((recipe) => (
            <WorkflowRecipeLink key={recipe.slug} recipe={recipe} locale={locale} dictionary={dictionary} />
          ))}
        </div>
      ) : null}
      <div className="grid gap-2 md:grid-cols-3">
        {relatedTools.map((related) => (
          <Link key={related.slug} href={withLocale(`/tools/${related.slug}`, locale)} className="rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/60">
            <span className="block font-medium">{related.shortTitle}</span>
            <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">
              {dictionary.tool.nextActionPrefix} {related.useCases[0] ?? related.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WorkflowRecipeList({
  recipes,
  locale,
  dictionary,
}: {
  recipes: LocalizedWorkflowRecipe[];
  locale: Locale;
  dictionary: ClientDictionary;
}) {
  return (
    <div className="grid gap-2">
      {recipes.map((recipe) => (
        <WorkflowRecipeLink key={recipe.slug} recipe={recipe} locale={locale} dictionary={dictionary} />
      ))}
    </div>
  );
}

function WorkflowRecipeLink({
  recipe,
  locale,
  dictionary,
}: {
  recipe: LocalizedWorkflowRecipe;
  locale: Locale;
  dictionary: ClientDictionary;
}) {
  const firstStep = recipe.steps[0];
  if (!firstStep) return null;

  return (
    <Link href={withLocale(`/tools/${firstStep.tool.slug}`, locale)} className="block rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted">
      <span className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate font-medium">{recipe.title}</span>
          <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">{recipe.description}</span>
        </span>
        <Badge className="shrink-0">{recipe.steps.length} {dictionary.nav.tools}</Badge>
      </span>
      <span className="mt-2 flex flex-wrap gap-1">
        {recipe.steps.map((step, index) => (
          <span key={`${recipe.slug}-${step.tool.slug}`} className="max-w-full rounded-sm border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground">
            {index + 1}. {step.tool.shortTitle}
          </span>
        ))}
      </span>
    </Link>
  );
}

function commonFailureCases(tool: ToolDefinition, dictionary: ClientDictionary) {
  const category = dictionary.categories[tool.category] ?? tool.category;
  const inputExample = tool.inputExamples[0] ?? tool.seo.keywords[0] ?? tool.shortTitle;
  const privacyLabel = tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly;
  return [
    `${dictionary.tool.failureCaseInputPrefix} ${inputExample}`,
    `${dictionary.tool.failureCaseCategoryPrefix} ${category}`,
    `${dictionary.tool.failureCasePrivacyPrefix} ${privacyLabel}`,
  ];
}

function commonPreCopyChecklist(tool: ToolDefinition, dictionary: ClientDictionary, nextRelatedTitle?: string) {
  const primaryIntent = tool.searchIntents[0] ?? tool.shortTitle;
  const relatedIntent = nextRelatedTitle ?? tool.guides[0]?.title ?? primaryIntent;
  return [
    `${dictionary.tool.preCopyCheckSourcePrefix} ${primaryIntent}`,
    dictionary.tool.preCopyCheckSecrets,
    `${dictionary.tool.preCopyCheckRelatedPrefix} ${relatedIntent}`,
  ];
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
  const [favoriteSlugs, setFavoriteSlugs] = React.useState<string[]>([]);
  const [copiedToolLink, setCopiedToolLink] = React.useState(false);
  const copiedToolLinkTimerRef = React.useRef<number | null>(null);
  const privacyLabel = tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly;
  const isFavorite = favoriteSlugs.includes(tool.slug);
  const headerKeywordBadges = locale === defaultLocale ? tool.seo.keywords.slice(0, 4) : [tool.shortTitle, dictionary.categories[tool.category] ?? tool.category];

  React.useEffect(() => {
    writeRecentToolSlug(locale, tool.slug);
  }, [locale, tool.slug]);

  React.useEffect(() => {
    setFavoriteSlugs(readFavoriteToolSlugs(locale));
  }, [locale]);

  const toggleFavorite = React.useCallback(() => {
    setFavoriteSlugs((currentSlugs) => {
      const nextSlugs = currentSlugs.includes(tool.slug) ? currentSlugs.filter((slug) => slug !== tool.slug) : [tool.slug, ...currentSlugs].slice(0, maxFavoriteTools);
      writeFavoriteToolSlugs(locale, nextSlugs);
      return nextSlugs;
    });
  }, [locale, tool.slug]);

  const copyToolLink = React.useCallback(async () => {
    if (typeof window === "undefined") return;
    const toolUrl = new URL(withLocale(`/tools/${tool.slug}`, locale), window.location.origin).toString();
    const copied = await writeClipboardText(toolUrl);
    if (!copied) return;
    setCopiedToolLink(true);
    if (copiedToolLinkTimerRef.current) window.clearTimeout(copiedToolLinkTimerRef.current);
    copiedToolLinkTimerRef.current = window.setTimeout(() => setCopiedToolLink(false), 1600);
  }, [locale, tool.slug]);

  React.useEffect(() => {
    return () => {
      if (copiedToolLinkTimerRef.current) window.clearTimeout(copiedToolLinkTimerRef.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background" lang={locale} dir={dictionary.dir}>
      <PointerBackground />
      <div className="bobob-topbar relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto grid max-w-[1600px] gap-3 px-4 py-3 lg:flex lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label={dictionary.nav.openNavigation}>
              <Menu className="h-4 w-4" />
            </Button>
            <Link href={withLocale("/", locale)} className="shrink-0 text-sm font-semibold tracking-tight hover:text-muted-foreground">
              {dictionary.nav.brand}
            </Link>
            <div className="min-w-0 border-s ps-3">
              <p className="hidden text-xs uppercase tracking-wide text-muted-foreground sm:block">{dictionary.tool.developerWorkbench}</p>
              <h1 className="truncate text-base font-semibold tracking-normal sm:text-lg">{tool.title}</h1>
            </div>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-2 lg:flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToolLink}
              aria-label={copiedToolLink ? dictionary.tool.copiedLink : dictionary.tool.copyLink}
              data-copy-tool-link
            >
              {copiedToolLink ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{copiedToolLink ? dictionary.tool.copiedLink : dictionary.tool.copyLink}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFavorite} aria-pressed={isFavorite} aria-label={isFavorite ? dictionary.tool.removeFavorite : dictionary.tool.addFavorite}>
              <Star className={cn("h-4 w-4", isFavorite ? "fill-current" : "")} />
              <span className="hidden sm:inline">{isFavorite ? dictionary.tool.removeFavorite : dictionary.tool.addFavorite}</span>
            </Button>
            <ThemeToggle dictionary={dictionary} />
            <LocaleSwitcher locale={locale} dictionary={dictionary} />
            <Badge className="hidden sm:inline-flex">{dictionary.categories[tool.category] ?? tool.category}</Badge>
          </div>
        </div>
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <ToolNavigation activeSlug={tool.slug} query={query} onQueryChange={setQuery} onNavigate={() => setMobileOpen(false)} locale={locale} dictionary={dictionary} favoriteSlugs={favoriteSlugs} />
      </Sheet>
      <div className="relative mx-auto max-w-[1600px] px-4 py-4">
        <ResizablePanelGroup className="bobob-workbench-shell min-h-[calc(100vh-7rem)] rounded-lg border bg-background lg:h-[calc(100vh-7rem)] lg:min-h-0">
          <ResizablePanel className="hidden min-h-0 lg:block">
            <Sidebar className="bobob-side-panel h-full min-h-0 p-4">
              <ToolNavigation activeSlug={tool.slug} query={query} onQueryChange={setQuery} locale={locale} dictionary={dictionary} favoriteSlugs={favoriteSlugs} />
            </Sidebar>
          </ResizablePanel>
          <ResizablePanel className="bobob-center-panel min-h-0 overflow-auto bg-card pb-20 lg:pb-0">
            <section>
              <div className="border-b p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {headerKeywordBadges.map((keyword) => (
                    <Badge key={keyword} className="max-w-full break-words">{keyword}</Badge>
                  ))}
                  <Badge>{dictionary.tool.privacy}: {privacyLabel}</Badge>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-normal">{tool.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{tool.description}</p>
              </div>
              <PrimaryWorkArea dictionary={dictionary}>
                <ToolSessionControls locale={locale} toolSlug={tool.slug} dictionary={dictionary}>
                  <ToolPanel component={tool.component} dictionary={dictionary} />
                </ToolSessionControls>
              </PrimaryWorkArea>
              <div className="bobob-support-sections border-t bg-background" data-tool-support-sections>
                <GoogleAdUnit
                  enabled={adsEnabled}
                  publisherId={adsPublisherId}
                  slot={toolResultAdSlot}
                  position="tool-result"
                  minHeight={90}
                  className="border-b bg-background px-5 py-4"
                />
                <div className="hidden lg:block">
                  <ToolQuickStart tool={tool} dictionary={dictionary} />
                </div>
                <div className="hidden lg:block">
                  <ToolReviewStrip tool={tool} dictionary={dictionary} />
                </div>
                <MobileReferenceAccordion tool={tool} locale={locale} dictionary={dictionary} />
                <ToolNextActions tool={tool} locale={locale} dictionary={dictionary} />
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
          <ResizablePanel className="hidden min-h-0 lg:block">
            <aside className="bobob-side-panel h-full min-h-0 overflow-auto bg-background p-4">
              <ToolReferencePanel tool={tool} locale={locale} dictionary={dictionary} />
            </aside>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <MobileActionBar tool={tool} locale={locale} dictionary={dictionary} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
    </main>
  );
}
