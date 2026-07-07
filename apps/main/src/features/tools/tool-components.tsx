"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import CryptoJS from "crypto-js";
import { diffLines, diffWords } from "diff";
import { Copy, Download, ExternalLink, RefreshCcw } from "lucide-react";
import Papa from "papaparse";
import QRCode from "qrcode";
import { format as formatSql } from "sql-formatter";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { withLocale, type Locale } from "@/features/i18n/config";
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { ToolComponentKey, ToolDefinition } from "./types";
import type { LocalizedWorkflowRecipe } from "./workflows";
import { AestheticBioBuilderTool, AsciiArtGeneratorTool, DotArtEditorTool, EmojiComboBuilderTool, FancyTextGeneratorTool, KaomojiMakerTool, MemeTextTransformerTool, SpecialCharacterPickerTool, UpsideDownTextTool } from "./creative-text-tools";

const commonTimeZones = ["UTC", "Asia/Seoul", "Asia/Tokyo", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata"];
const sampleTimestampSeconds = "1704067200";
const sampleIsoDate = "2026-06-05T00:00:00.000Z";
const sampleUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const sampleUuids = [
  "550e8400-e29b-41d4-a716-446655440000",
  "6f0c0f2d-6f5d-4c6a-9a32-2f1c7e7b9a11",
  "9f8c7d6e-5b4a-4321-9012-3456789abcde",
  "2d931510-d99f-494a-8c67-87feb05e1594",
  "7c9e6679-7425-40de-944b-e07fc1f90ae7",
];
const sampleUlids = [
  "01JX0Z7X4M8F9H6Q5R4T3W2Y1Z",
  "01JX0Z7X4N9G0J7R6S5V4X3Z2A",
  "01JX0Z7X4P0H1K8S7T6W5Y4A3B",
  "01JX0Z7X4Q1J2M9T8V7X6Z5B4C",
  "01JX0Z7X4R2K3N0V9W8Y7A6C5D",
];

function copyToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    void navigator.clipboard.writeText(value);
  }
}

function ui(dictionary: ClientDictionary, key: string, fallback: string) {
  return dictionary.toolUi[key] ?? fallback;
}

function ResultBlock({
  title,
  value,
  dictionary,
  description,
}: {
  title: string;
  value: string;
  dictionary: ClientDictionary;
  description?: string;
}) {
  return (
    <Card className="bobob-tool-result-card overflow-hidden border-2" data-tool-output-block>
      <CardHeader className="border-b bg-muted/35 p-4">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge className="mb-2">{ui(dictionary, "output", "Output")}</Badge>
            <CardTitle className="break-words">{title}</CardTitle>
            <CardDescription>{description ?? ui(dictionary, "copyReadyOutput", "Copy-ready output")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(value)} className="shrink-0">
            <Copy className="h-4 w-4" />
            {dictionary.tool.copy}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="bg-background p-4">
        <pre className="max-h-96 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-foreground">
          <code className="break-words">{value || dictionary.tool.noOutput}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

function ErrorAlert({ title, message }: { title: string; message: string }) {
  return (
    <Alert className="bobob-tool-alert border-destructive/40 bg-destructive/5">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function byteLength(value: string) {
  if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(value).length;
  return value.length;
}

function clampInteger(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function ToolMetricGrid({ items }: { items: Array<{ label: string; value: string; description?: string }> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-tool-metric-grid>
      {items.map((item) => (
        <div key={item.label} className="bobob-diagnostic-card min-w-0 rounded-md border bg-card p-3">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="mt-1 break-words text-sm font-semibold">{item.value}</p>
          {item.description ? <p className="mt-1 text-xs text-muted-foreground">{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

function ToolWarningList({ title, warnings, emptyLabel }: { title: string; warnings: string[]; emptyLabel: string }) {
  return (
    <section className="bobob-diagnostic-list rounded-md border bg-card p-3" data-tool-warning-list>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {(warnings.length ? warnings : [emptyLabel]).map((warning) => (
          <li key={warning} className="break-words">
            {warning}
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface ToolActionContextValue {
  tool: ToolDefinition;
  locale: Locale;
  relatedTools: ToolDefinition[];
  workflowRecipes: LocalizedWorkflowRecipe[];
  allTools: ToolDefinition[];
}

type ResultNextActionSignal =
  | "json-valid"
  | "jwt-decoded"
  | "base64-json"
  | "base64-jwt"
  | "base64-image"
  | "http-result"
  | "dns-result"
  | "yaml-valid"
  | "yaml-compose"
  | "csv-converted"
  | "qr-generated"
  | "regex-tested";

const resultNextActionRules: Record<ResultNextActionSignal, string[]> = {
  "json-valid": ["jsonpath-tester", "json-to-typescript", "json-schema-validator"],
  "jwt-decoded": ["timestamp-converter", "base64-tool", "json-formatter"],
  "base64-json": ["json-formatter", "jsonpath-tester", "jwt-decoder"],
  "base64-jwt": ["jwt-decoder", "json-formatter", "timestamp-converter"],
  "base64-image": ["mime-type-lookup", "color-converter", "open-graph-preview"],
  "http-result": ["dns-lookup", "url-parser", "open-graph-preview"],
  "dns-result": ["http-status-checker", "url-parser", "sitemap-generator"],
  "yaml-valid": ["env-parser-validator", "yaml-json-converter", "json-formatter"],
  "yaml-compose": ["env-parser-validator", "yaml-json-converter", "json-formatter"],
  "csv-converted": ["text-sort-dedupe", "markdown-previewer", "json-formatter"],
  "qr-generated": ["url-parser", "open-graph-preview", "color-converter"],
  "regex-tested": ["url-encoder", "text-diff", "json-formatter"],
};

const ToolActionContext = React.createContext<ToolActionContextValue | null>(null);

function useToolActionContext() {
  return React.useContext(ToolActionContext);
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function ResultNextActions({ signals, dictionary, limit = 3 }: { signals: ResultNextActionSignal[]; dictionary: ClientDictionary; limit?: number }) {
  const context = useToolActionContext();
  if (!context || signals.length === 0) return null;

  const toolBySlug = new Map([...context.allTools, ...context.relatedTools].map((tool) => [tool.slug, tool]));
  const actionSlugs = uniqueValues(signals.flatMap((signal) => resultNextActionRules[signal] ?? [])).filter((slug) => slug !== context.tool.slug);
  const toolActions = actionSlugs
    .map((slug) => toolBySlug.get(slug))
    .filter((tool): tool is ToolDefinition => Boolean(tool))
    .slice(0, limit);
  const recipeActions = context.workflowRecipes
    .filter((recipe) => recipe.steps.some((step) => step.tool.slug === context.tool.slug))
    .slice(0, Math.max(0, limit - toolActions.length));

  if (!toolActions.length && !recipeActions.length) return null;

  return (
    <section className="rounded-md border bg-muted/20 p-3" data-result-next-actions>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{dictionary.nav.relatedTools}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{dictionary.nav.relatedToolsDescription}</p>
        </div>
        <Badge>{dictionary.tool.nextActionPrefix}</Badge>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {toolActions.map((tool) => (
          <Link key={tool.slug} href={withLocale(`/tools/${tool.slug}`, context.locale)} className="min-w-0 rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/60">
            <span className="block truncate font-medium">{tool.shortTitle}</span>
            <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">
              {dictionary.tool.nextActionPrefix} {tool.useCases[0] ?? tool.description}
            </span>
          </Link>
        ))}
        {recipeActions.map((recipe) => {
          const firstStep = recipe.steps[0];
          if (!firstStep) return null;
          return (
            <Link key={recipe.slug} href={withLocale(`/tools/${firstStep.tool.slug}`, context.locale)} className="min-w-0 rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/60">
              <span className="block truncate font-medium">{recipe.title}</span>
              <span className="mt-1 block line-clamp-2 text-xs text-muted-foreground">{recipe.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TextTransformTool({
  dictionary,
  inputLabel,
  defaultInput,
  modes,
}: {
  dictionary: ClientDictionary;
  inputLabel: string;
  defaultInput: string;
  modes: Array<{ value: string; label: string; labelKey?: string; transform: (value: string) => string }>;
}) {
  const [input, setInput] = React.useState(defaultInput);
  const [mode, setMode] = React.useState(modes[0]?.value ?? "");
  const activeMode = modes.find((item) => item.value === mode) ?? modes[0];
  const getModeLabel = React.useCallback((item: { label: string; labelKey?: string }) => (item.labelKey ? ui(dictionary, item.labelKey, item.label) : item.label), [dictionary]);
  const result = React.useMemo(() => {
    try {
      return { error: "", value: activeMode?.transform(input) ?? "" };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unable to transform input.", value: "" };
    }
  }, [activeMode, input]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{inputLabel}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-40" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "mode", "Mode")}</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value)}>
            {modes.map((item) => (
              <option key={item.value} value={item.value}>
                {getModeLabel(item)}
              </option>
            ))}
          </Select>
        </label>
      </div>
      {result.error ? <ErrorAlert title={ui(dictionary, "transformError", "Transform error")} message={result.error} /> : <ResultBlock title={activeMode ? getModeLabel(activeMode) : ui(dictionary, "output", "Output")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

const regexPresets = [
  {
    labelKey: "isoDatePattern",
    fallbackLabel: "ISO date",
    pattern: String.raw`(\d{4})-(\d{2})-(\d{2})`,
    flags: "g",
    sample: "Release dates: 2026-06-05 and 2026-07-01.",
  },
  {
    labelKey: "emailPattern",
    fallbackLabel: "Email",
    pattern: String.raw`([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})`,
    flags: "gi",
    sample: "Contact billing@example.com or support@bobob.app.",
  },
  {
    labelKey: "routePattern",
    fallbackLabel: "Route path",
    pattern: String.raw`^/tools/([a-z0-9-]+)$`,
    flags: "gm",
    sample: "/tools/json-formatter\n/tools/regex-tester\n/guides/seo-meta-tags",
  },
  {
    labelKey: "uuidPattern",
    fallbackLabel: "UUID v4",
    pattern: String.raw`\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b`,
    flags: "gi",
    sample: "id=550e8400-e29b-41d4-a716-446655440000 request=not-a-uuid",
  },
];

const regexCheatSnippets = [
  {
    labelKey: "emailPattern",
    fallbackLabel: "Email",
    descriptionKey: "regexSnippetEmailDescription",
    fallbackDescription: "Find common email addresses in logs, forms, and pasted payloads.",
    pattern: String.raw`\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b`,
    flags: "gi",
    sample: "billing@example.com support@bobob.app invalid@email",
  },
  {
    labelKey: "urlPattern",
    fallbackLabel: "URL",
    descriptionKey: "regexSnippetUrlDescription",
    fallbackDescription: "Extract http and https URLs without swallowing quotes, angle brackets, or trailing sentence punctuation.",
    pattern: String.raw`https?:\/\/[^\s"'<>]*[A-Za-z0-9/#]`,
    flags: "gi",
    sample: "See https://www.bobob.app/tools/json-formatter and http://localhost:3000/test.",
  },
  {
    labelKey: "isoDatePattern",
    fallbackLabel: "ISO date",
    descriptionKey: "regexSnippetIsoDateDescription",
    fallbackDescription: "Match yyyy-mm-dd dates before validating calendar rules in code.",
    pattern: String.raw`\b\d{4}-\d{2}-\d{2}\b`,
    flags: "g",
    sample: "Release dates: 2026-06-05, 2026-07-01, and 06/05/2026.",
  },
  {
    labelKey: "uuidPattern",
    fallbackLabel: "UUID v4",
    descriptionKey: "regexSnippetUuidDescription",
    fallbackDescription: "Find UUID values in request IDs, fixtures, and copied API responses.",
    pattern: String.raw`\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b`,
    flags: "gi",
    sample: "id=550e8400-e29b-41d4-a716-446655440000 request=not-a-uuid",
  },
  {
    labelKey: "ipv4Pattern",
    fallbackLabel: "IPv4",
    descriptionKey: "regexSnippetIpv4Description",
    fallbackDescription: "Spot IPv4 addresses in server logs and DNS troubleshooting notes.",
    pattern: String.raw`\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b`,
    flags: "g",
    sample: "Allowed: 192.168.0.1, 8.8.8.8. Invalid: 999.999.999.999",
  },
  {
    labelKey: "hexColorPattern",
    fallbackLabel: "Hex color",
    descriptionKey: "regexSnippetHexColorDescription",
    fallbackDescription: "Collect CSS hex colors including short, six-digit, and alpha forms.",
    pattern: String.raw`#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b`,
    flags: "g",
    sample: "Colors: #0f172a #fff #0066cc #11223344 not-a-color",
  },
  {
    labelKey: "slugPattern",
    fallbackLabel: "Slug",
    descriptionKey: "regexSnippetSlugDescription",
    fallbackDescription: "Match lowercase URL slugs used in routes, docs, and content IDs.",
    pattern: String.raw`\b[a-z0-9]+(?:-[a-z0-9]+)*\b`,
    flags: "g",
    sample: "json-formatter regex-tester Not_A_Slug /tools/base64-tool",
  },
];

function normalizeRegexFlags(flags: string) {
  return Array.from(new Set(flags.replace(/[^gimsuyd]/g, "").split(""))).join("");
}

function escapeRegexLiteral(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function commonPrefix(values: string[]) {
  if (!values.length) return "";
  let prefix = values[0] ?? "";
  for (const value of values.slice(1)) {
    while (prefix && !value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

function commonSuffix(values: string[]) {
  if (!values.length) return "";
  let suffix = values[0] ?? "";
  for (const value of values.slice(1)) {
    while (suffix && !value.endsWith(suffix)) suffix = suffix.slice(1);
  }
  return suffix;
}

function compactCharacterClass(values: string[]) {
  const maxLength = Math.max(...values.map((value) => value.length));
  const tokens: string[] = [];
  for (let index = 0; index < maxLength; index += 1) {
    const chars = values.map((value) => value[index] ?? "");
    if (chars.some((char) => !char)) return "";
    if (chars.every((char) => /\d/.test(char))) tokens.push(String.raw`\d`);
    else if (chars.every((char) => /[a-z]/.test(char))) tokens.push("[a-z]");
    else if (chars.every((char) => /[A-Z]/.test(char))) tokens.push("[A-Z]");
    else if (chars.every((char) => /[A-Za-z]/.test(char))) tokens.push("[A-Za-z]");
    else tokens.push(escapeRegexLiteral(chars[0] ?? ""));
  }
  return tokens.join("").replace(/(\\d)+/g, (match) => (match.length > 2 ? String.raw`\d{${match.length / 2}}` : match));
}

function generateRegexFromExamples(positiveInput: string, negativeInput: string, dictionary: ClientDictionary) {
  const positives = positiveInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const negatives = negativeInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!positives.length) {
    return {
      pattern: "",
      confidence: "0%",
      positiveMatches: 0,
      negativeMatches: 0,
      warnings: [ui(dictionary, "regexGeneratorNeedsExamples", "Add at least one positive example before generating a pattern.")],
    };
  }

  const presets = [
    { test: (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value), pattern: String.raw`\b\d{4}-\d{2}-\d{2}\b`, confidence: 92 },
    { test: (value: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value), pattern: String.raw`\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b`, confidence: 90 },
    { test: (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value), pattern: String.raw`\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b`, confidence: 90 },
    { test: (value: string) => /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/i.test(value), pattern: String.raw`^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$`, confidence: 82 },
    { test: (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value), pattern: String.raw`\b[a-z0-9]+(?:-[a-z0-9]+)*\b`, confidence: 78 },
    { test: (value: string) => /^\d+$/.test(value), pattern: String.raw`\b\d+\b`, confidence: 76 },
  ];
  const preset = presets.find((candidate) => positives.every(candidate.test));
  let pattern = preset?.pattern ?? "";
  let confidence = preset?.confidence ?? 55;
  const warnings: string[] = [];

  if (!pattern) {
    const prefix = commonPrefix(positives);
    const suffix = commonSuffix(positives);
    if (prefix.length >= 2 || suffix.length >= 2) {
      pattern = `${prefix ? escapeRegexLiteral(prefix) : ""}(.+)${suffix ? escapeRegexLiteral(suffix) : ""}`;
      confidence = 64;
    } else {
      const shape = compactCharacterClass(positives);
      if (shape) {
        pattern = `^${shape}$`;
        confidence = 58;
      } else {
        pattern = `(?:${positives.map(escapeRegexLiteral).join("|")})`;
        confidence = 42;
        warnings.push(ui(dictionary, "regexGeneratorLiteralWarning", "Generated a literal alternation because the examples do not share a clear shape."));
      }
    }
  }

  let positiveMatches = 0;
  let negativeMatches = 0;
  try {
    const regex = new RegExp(pattern, "i");
    positiveMatches = positives.filter((value) => regex.test(value)).length;
    negativeMatches = negatives.filter((value) => regex.test(value)).length;
  } catch {
    warnings.push(ui(dictionary, "regexGeneratorInvalidWarning", "The generated pattern could not be tested. Review it manually before applying."));
  }
  if (negativeMatches) warnings.push(ui(dictionary, "regexGeneratorNegativeWarning", "The generated pattern also matches negative examples. Tighten it before copying."));

  return {
    pattern,
    confidence: `${Math.max(0, Math.min(99, confidence - negativeMatches * 15))}%`,
    positiveMatches,
    negativeMatches,
    warnings,
  };
}

function RegexTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [pattern, setPattern] = React.useState(String.raw`(\d{4})-(\d{2})-(\d{2})`);
  const [flags, setFlags] = React.useState("g");
  const [sample, setSample] = React.useState("Release dates: 2026-06-05 and 2026-07-01.");
  const [positiveExamples, setPositiveExamples] = React.useState("2026-06-05\n2026-07-01");
  const [negativeExamples, setNegativeExamples] = React.useState("2026/06/05\nrelease-date");

  const result = React.useMemo(() => {
    try {
      const normalizedFlags = normalizeRegexFlags(flags);
      const safeFlags = normalizedFlags.includes("g") ? normalizedFlags : `${normalizedFlags}g`;
      const regex = new RegExp(pattern, safeFlags);
      const matches = Array.from(sample.matchAll(regex)).map((match, index) => ({
        index: index + 1,
        text: match[0],
        position: match.index ?? 0,
        groups: match.slice(1),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      }));
      return { error: "", matches, safeFlags };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid regular expression", matches: [], safeFlags: "" };
    }
  }, [flags, pattern, sample]);
  const generated = React.useMemo(() => generateRegexFromExamples(positiveExamples, negativeExamples, dictionary), [dictionary, negativeExamples, positiveExamples]);
  const rawPattern = pattern;
  const slashWrappedPattern = `/${pattern.replace(/\//g, "\\/")}/${result.safeFlags}`;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_120px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "pattern", "Pattern")}</span>
          <Input value={pattern} onChange={(event) => setPattern(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "flags", "Flags")}</span>
          <Input value={flags} onChange={(event) => setFlags(normalizeRegexFlags(event.target.value))} />
        </label>
      </div>
      <div className="space-y-2" data-regex-presets>
        <p className="text-sm font-medium">{ui(dictionary, "regexPresets", "Pattern presets")}</p>
        <div className="flex flex-wrap gap-2">
          {regexPresets.map((preset) => (
            <Button
              key={preset.labelKey}
              variant="outline"
              size="sm"
              onClick={() => {
                setPattern(preset.pattern);
                setFlags(preset.flags);
                setSample(preset.sample);
              }}
            >
              {ui(dictionary, preset.labelKey, preset.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <section className="rounded-md border bg-card" data-regex-cheat-snippets>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "regexCheatSnippets", "Regex snippets")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "regexCheatSnippetsDescription", "Apply common production patterns, then verify them against your own sample before copying.")}</p>
        </div>
        <div className="grid gap-2 p-3 md:grid-cols-2 xl:grid-cols-3">
          {regexCheatSnippets.map((snippet) => (
            <div key={snippet.labelKey} className="min-w-0 rounded-md bg-muted p-3">
              <div className="flex min-w-0 items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{ui(dictionary, snippet.labelKey, snippet.fallbackLabel)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, snippet.descriptionKey, snippet.fallbackDescription)}</p>
                </div>
                <Badge>{snippet.flags}</Badge>
              </div>
              <code className="mt-2 block break-all rounded bg-background px-2 py-1 text-xs text-muted-foreground">{snippet.pattern}</code>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPattern(snippet.pattern);
                    setFlags(snippet.flags);
                    setSample(snippet.sample);
                  }}
                >
                  {ui(dictionary, "applyRegexSnippet", "Apply")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(snippet.pattern)}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyRegexSnippet", "Copy")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{ui(dictionary, "sampleText", "Sample text")}</span>
        <Textarea value={sample} onChange={(event) => setSample(event.target.value)} />
      </label>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "syntaxError", "Syntax error")} message={result.error} />
      ) : (
        <div className="space-y-4" data-regex-result-details>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "regexMatches", "Matches")}</p>
              <p className="mt-2 text-lg font-semibold">{result.matches.length}</p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "effectiveFlags", "Effective flags")}</p>
              <p className="mt-2 font-mono text-sm font-semibold">{result.safeFlags}</p>
            </div>
            <div className="flex flex-wrap items-end gap-2 rounded-md border bg-card p-3">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(rawPattern)}>
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copyRawPattern", "Copy raw")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(slashWrappedPattern)}>
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copySlashPattern", "Copy /pattern/")}
              </Button>
            </div>
          </div>
          <section className="rounded-md border bg-card" data-regex-match-list>
            <div className="border-b p-3">
              <h3 className="text-sm font-semibold">{ui(dictionary, "matchDetails", "Match details")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "matchDetailsDescription", "Inspect positions and capture groups before copying the pattern.")}</p>
            </div>
            {result.matches.length ? (
              <div className="divide-y">
                {result.matches.map((match) => (
                  <div key={`${match.index}-${match.position}`} className="grid gap-2 p-3 text-sm md:grid-cols-[88px_1fr]">
                    <Badge className="w-fit">
                      #{match.index} @ {match.position}
                    </Badge>
                    <div className="min-w-0 space-y-2">
                      <code className="block break-all rounded bg-muted px-2 py-1 text-xs">{match.text}</code>
                      {match.groups.length || match.namedGroups ? (
                        <div className="flex min-w-0 flex-wrap gap-2">
                          {match.groups.map((group, groupIndex) => (
                            <code key={`${match.index}-group-${groupIndex}`} className="max-w-full break-all rounded-md border bg-background px-2 py-1 text-xs">
                              {ui(dictionary, "captureGroup", "Group")} {groupIndex + 1}: {group}
                            </code>
                          ))}
                          {match.namedGroups
                            ? Object.entries(match.namedGroups).map(([name, value]) => (
                                <code key={`${match.index}-named-${name}`} className="max-w-full break-all rounded-md border bg-background px-2 py-1 text-xs">
                                  {name}: {value}
                                </code>
                              ))
                            : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-3 text-sm text-muted-foreground">{ui(dictionary, "noRegexMatches", "No matches for this sample.")}</p>
            )}
          </section>
          <ResultNextActions signals={["regex-tested"]} dictionary={dictionary} />
          <ResultBlock title={ui(dictionary, "rawMatchJson", "Raw match JSON")} value={JSON.stringify(result.matches, null, 2)} dictionary={dictionary} />
        </div>
      )}
      <section className="rounded-md border bg-card" data-regex-generator>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "regexGeneratorTitle", "Generate from examples")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "regexGeneratorDescription", "Draft a starting pattern from positive and negative examples, then test it above before copying.")}</p>
        </div>
        <div className="grid gap-3 p-3 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "positiveExamples", "Positive examples")}</span>
            <Textarea value={positiveExamples} onChange={(event) => setPositiveExamples(event.target.value)} className="min-h-32" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "negativeExamples", "Negative examples")}</span>
            <Textarea value={negativeExamples} onChange={(event) => setNegativeExamples(event.target.value)} className="min-h-32" />
          </label>
        </div>
        <div className="space-y-3 border-t p-3" data-regex-generator-results>
          <ToolMetricGrid
            items={[
              { label: ui(dictionary, "generatorConfidence", "Confidence"), value: generated.confidence },
              { label: ui(dictionary, "positiveMatches", "Positive matches"), value: String(generated.positiveMatches) },
              { label: ui(dictionary, "negativeMatches", "Negative matches"), value: String(generated.negativeMatches) },
              { label: ui(dictionary, "suggestedPattern", "Suggested pattern"), value: generated.pattern || "—" },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(generated.pattern)} disabled={!generated.pattern}>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copyRawPattern", "Copy raw")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!generated.pattern) return;
                setPattern(generated.pattern);
                setFlags("gi");
                setSample([...positiveExamples.split(/\r?\n/), ...negativeExamples.split(/\r?\n/)].filter(Boolean).join("\n"));
              }}
              disabled={!generated.pattern}
            >
              {ui(dictionary, "applyGeneratedPattern", "Apply generated pattern")}
            </Button>
          </div>
          <ToolWarningList title={ui(dictionary, "generatorWarnings", "Generator warnings")} warnings={generated.warnings} emptyLabel={ui(dictionary, "regexGeneratedNoWarnings", "Generated pattern is ready for review in the tester above.")} />
        </div>
      </section>
    </div>
  );
}

const cronPresets = [
  { labelKey: "cronEvery15Minutes", fallback: "Every 15 minutes", value: "*/15 * * * *" },
  { labelKey: "cronWeekdayMorning", fallback: "Every weekday at 09:00", value: "0 9 * * 1-5" },
  { labelKey: "cronMonthlyMorning", fallback: "First day of month at 08:30", value: "30 8 1 * *" },
  { labelKey: "cronSundayMidnight", fallback: "Every Sunday at midnight", value: "0 0 * * 0" },
];

const cronFields = [
  { key: "minuteField", fallback: "Minute", min: 0, max: 59 },
  { key: "hourField", fallback: "Hour", min: 0, max: 23 },
  { key: "dayOfMonthField", fallback: "Day of month", min: 1, max: 31 },
  { key: "monthField", fallback: "Month", min: 1, max: 12 },
  { key: "dayOfWeekField", fallback: "Day of week", min: 0, max: 7 },
];

type CronDayMatchingMode = "or" | "and";

function normalizeCronValue(value: number, min: number, max: number) {
  if (min === 0 && max === 7 && value === 7) return 0;
  return value;
}

function expandCronField(field: string, min: number, max: number) {
  const values = new Set<number>();
  const add = (value: number) => {
    if (!Number.isInteger(value) || value < min || value > max) throw new Error("out-of-range");
    values.add(normalizeCronValue(value, min, max));
  };

  for (const segment of field.split(",")) {
    const part = segment.trim();
    if (!part) throw new Error("empty-segment");
    if (part === "*") {
      for (let value = min; value <= max; value += 1) add(value);
      continue;
    }
    const stepMatch = part.match(/^(\*|\d+-\d+)\/(\d+)$/);
    if (stepMatch) {
      const [, base, stepText] = stepMatch;
      const step = Number(stepText);
      if (!Number.isInteger(step) || step <= 0) throw new Error("bad-step");
      const [start, end] = base === "*" ? [min, max] : base!.split("-").map(Number);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) throw new Error("bad-range");
      for (let value = start; value <= end; value += step) add(value);
      continue;
    }
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) throw new Error("bad-range");
      for (let value = start; value <= end; value += 1) add(value);
      continue;
    }
    if (/^\d+$/.test(part)) {
      add(Number(part));
      continue;
    }
    throw new Error("unsupported-token");
  }

  return values;
}

function describeCronField(field: string, dictionary: ClientDictionary) {
  if (field === "*") return ui(dictionary, "cronAnyValue", "Any value");
  if (/^\*\/\d+$/.test(field)) return `${ui(dictionary, "cronEvery", "Every")} ${field.slice(2)} ${ui(dictionary, "cronUnits", "units")}`;
  if (/^\d+-\d+$/.test(field)) return ui(dictionary, "cronRange", "Range");
  if (field.includes(",")) return ui(dictionary, "cronList", "List");
  return ui(dictionary, "cronSpecificValue", "Specific value");
}

function getBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
  } catch {
    return "Local";
  }
}

function formatCronRun(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function matchesCronDay({
  day,
  dayOfWeek,
  dayOfMonthValues,
  dayOfWeekValues,
  dayOfMonthRestricted,
  dayOfWeekRestricted,
  mode,
}: {
  day: number;
  dayOfWeek: number;
  dayOfMonthValues: Set<number>;
  dayOfWeekValues: Set<number>;
  dayOfMonthRestricted: boolean;
  dayOfWeekRestricted: boolean;
  mode: CronDayMatchingMode;
}) {
  const dayOfMonthMatches = dayOfMonthValues.has(day);
  const dayOfWeekMatches = dayOfWeekValues.has(dayOfWeek);
  if (dayOfMonthRestricted && dayOfWeekRestricted) {
    return mode === "or" ? dayOfMonthMatches || dayOfWeekMatches : dayOfMonthMatches && dayOfWeekMatches;
  }
  return dayOfMonthMatches && dayOfWeekMatches;
}

function getCronAnalysis(expression: string, dictionary: ClientDictionary, dayMatchingMode: CronDayMatchingMode) {
  const parts = expression.trim().split(/\s+/).filter(Boolean);
  const timezone = getBrowserTimeZone();
  if (parts.length !== 5) {
    return {
      valid: false,
      parts,
      fields: [],
      nextRuns: [],
      warnings: [parts.length === 6 ? "cronSixFieldWarning" : "cronFiveFieldWarning"],
      timezone,
      dayMatchingMode,
    };
  }

  try {
    const expanded = cronFields.map((field, index) => expandCronField(parts[index]!, field.min, field.max));
    const dayOfMonthRestricted = parts[2] !== "*";
    const dayOfWeekRestricted = parts[4] !== "*";
    const now = new Date();
    const cursor = new Date(now);
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);
    const nextRuns: Date[] = [];
    for (let index = 0; index < 200000 && nextRuns.length < 5; index += 1) {
      const month = cursor.getMonth() + 1;
      const day = cursor.getDate();
      const dayOfWeek = cursor.getDay();
      const dayMatches = matchesCronDay({
        day,
        dayOfWeek,
        dayOfMonthValues: expanded[2]!,
        dayOfWeekValues: expanded[4]!,
        dayOfMonthRestricted,
        dayOfWeekRestricted,
        mode: dayMatchingMode,
      });
      if (expanded[0]!.has(cursor.getMinutes()) && expanded[1]!.has(cursor.getHours()) && dayMatches && expanded[3]!.has(month)) {
        nextRuns.push(new Date(cursor));
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }

    const warnings = [
      parts[0] === "*" ? "cronEveryMinuteWarning" : "",
      dayOfMonthRestricted && dayOfWeekRestricted ? (dayMatchingMode === "or" ? "cronDayOverlapOrWarning" : "cronDayOverlapAndWarning") : "",
      nextRuns.length === 0 ? "cronNoRunsWarning" : "",
      "cronTimezoneWarning",
    ].filter(Boolean);

    return {
      valid: true,
      parts,
      fields: cronFields.map((field, index) => ({
        ...field,
        value: parts[index]!,
        description: describeCronField(parts[index]!, dictionary),
        count: expanded[index]!.size,
      })),
      nextRuns,
      warnings,
      timezone,
      dayMatchingMode,
    };
  } catch {
    return {
      valid: false,
      parts,
      fields: cronFields.map((field, index) => ({
        ...field,
        value: parts[index] ?? "—",
        description: ui(dictionary, "cronInvalidField", "Invalid field"),
        count: 0,
      })),
      nextRuns: [],
      warnings: ["cronUnsupportedSyntaxWarning"],
      timezone,
      dayMatchingMode,
    };
  }
}

function buildCronScheduleReport({
  expression,
  analysis,
  previewTimezone,
  dayMatchingModeLabel,
  dictionary,
  checkedAt,
}: {
  expression: string;
  analysis: ReturnType<typeof getCronAnalysis>;
  previewTimezone: string;
  dayMatchingModeLabel: string;
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const syntaxLabel = analysis.valid ? ui(dictionary, "cronReportValidSyntax", "Valid five-field syntax") : ui(dictionary, "cronReportInvalidSyntax", "Needs syntax review");
  const reviewNotes = analysis.warnings.length ? analysis.warnings.map((key) => ui(dictionary, key, key)) : [ui(dictionary, "cronReportNoWarnings", "No obvious schedule warnings detected. Confirm the runtime timezone before deploying.")];
  const checklist = [
    ui(dictionary, "cronReportChecklistTimezone", "Confirm the scheduler timezone, not only the browser preview timezone."),
    ui(dictionary, "cronReportChecklistRuntime", "Check whether the target runtime uses standard crontab, Quartz, GitHub Actions, or another cron dialect."),
    ui(dictionary, "cronReportChecklistFrequency", "Confirm the job can handle the planned frequency, retries, and overlapping runs."),
    ui(dictionary, "cronReportChecklistDayMatching", "When day-of-month and day-of-week are both restricted, document OR/AND semantics."),
    ui(dictionary, "cronReportChecklistDryRun", "Run the schedule in staging or dry-run logs before shipping production automation."),
  ];
  const nextRunLines = analysis.nextRuns.length ? analysis.nextRuns.map((run) => `- ${formatCronRun(run, previewTimezone)}`) : [`- ${ui(dictionary, "cronNoRunsFound", "No runs found in the preview window.")}`];
  const fieldLines = analysis.fields.length
    ? analysis.fields.map((field) => `- ${ui(dictionary, field.key, field.fallback)}: ${field.value} (${field.description}, ${ui(dictionary, "cronAllowedValues", "Allowed values")}: ${field.count})`)
    : [`- ${ui(dictionary, "cronFiveFieldSyntax", "Use standard five-field crontab syntax: minute hour day-of-month month day-of-week.")}`];
  const metrics = [
    { label: ui(dictionary, "cronExpression", "Cron expression"), value: expression || ui(dictionary, "emptyValue", "Empty") },
    { label: ui(dictionary, "cronReportSyntax", "Syntax"), value: syntaxLabel },
    { label: ui(dictionary, "cronPreviewTimezone", "Preview timezone"), value: previewTimezone },
    { label: ui(dictionary, "cronDayMatching", "Day matching"), value: dayMatchingModeLabel },
    { label: ui(dictionary, "cronReportNextRuns", "Next runs in preview"), value: String(analysis.nextRuns.length) },
    { label: ui(dictionary, "cronReportFields", "Fields"), value: String(analysis.parts.length) },
  ];
  const markdown = [
    `# ${ui(dictionary, "cronScheduleReport", "Cron schedule report")}`,
    "",
    `- ${ui(dictionary, "cronReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "cronExpression", "Cron expression")}: ${expression || ui(dictionary, "emptyValue", "Empty")}`,
    `- ${ui(dictionary, "cronReportSyntax", "Syntax")}: ${syntaxLabel}`,
    `- ${ui(dictionary, "cronBrowserTimezone", "Browser timezone")}: ${analysis.timezone}`,
    `- ${ui(dictionary, "cronPreviewTimezone", "Preview timezone")}: ${previewTimezone}`,
    `- ${ui(dictionary, "cronDayMatching", "Day matching")}: ${dayMatchingModeLabel}`,
    "",
    `## ${ui(dictionary, "cronReportFields", "Fields")}`,
    ...fieldLines,
    "",
    `## ${ui(dictionary, "cronReportNextRuns", "Next runs in preview")}`,
    ...nextRunLines,
    "",
    `## ${ui(dictionary, "cronReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "cronReportChecklist", "Safe deployment checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function CronTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [expression, setExpression] = React.useState(cronPresets[0]!.value);
  const [dayMatchingMode, setDayMatchingMode] = React.useState<CronDayMatchingMode>("or");
  const [previewTimezone, setPreviewTimezone] = React.useState(getBrowserTimeZone);
  const analysis = React.useMemo(() => getCronAnalysis(expression, dictionary, dayMatchingMode), [dayMatchingMode, dictionary, expression]);
  const timezoneOptions = React.useMemo(() => Array.from(new Set([analysis.timezone, ...commonTimeZones])), [analysis.timezone]);
  const dayMatchingModeLabel =
    dayMatchingMode === "or"
      ? ui(dictionary, "cronDayMatchingOr", "OR, common crontab")
      : ui(dictionary, "cronDayMatchingAnd", "AND, strict match");
  const summary =
    analysis.valid && analysis.parts.length === 5
      ? `${ui(dictionary, "minuteField", "Minute")}: ${analysis.parts[0]}, ${ui(dictionary, "hourField", "Hour")}: ${analysis.parts[1]}, ${ui(dictionary, "dayOfMonthField", "Day of month")}: ${analysis.parts[2]}, ${ui(dictionary, "monthField", "Month")}: ${analysis.parts[3]}, ${ui(dictionary, "dayOfWeekField", "Day of week")}: ${analysis.parts[4]}.`
      : ui(dictionary, "cronFiveFieldSyntax", "Use standard five-field crontab syntax: minute hour day-of-month month day-of-week.");
  const scheduleReport = React.useMemo(
    () =>
      buildCronScheduleReport({
        expression,
        analysis,
        previewTimezone,
        dayMatchingModeLabel,
        dictionary,
        checkedAt: ui(dictionary, "cronReportCopyTime", "Browser copy time"),
      }),
    [analysis, dayMatchingModeLabel, dictionary, expression, previewTimezone],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">
        <label className="block min-w-0 space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "cronExpression", "Cron expression")}</span>
          <Input value={expression} onChange={(event) => setExpression(event.target.value)} />
        </label>
        <label className="block min-w-0 space-y-2" data-cron-scheduler-semantics>
          <span className="text-sm font-medium">{ui(dictionary, "cronDayMatching", "Day matching")}</span>
          <Select value={dayMatchingMode} onChange={(event) => setDayMatchingMode(event.target.value as CronDayMatchingMode)}>
            <option value="or">{ui(dictionary, "cronDayMatchingOr", "OR, common crontab")}</option>
            <option value="and">{ui(dictionary, "cronDayMatchingAnd", "AND, strict match")}</option>
          </Select>
        </label>
        <label className="block min-w-0 space-y-2" data-cron-timezone-select>
          <span className="text-sm font-medium">{ui(dictionary, "cronPreviewTimezone", "Preview timezone")}</span>
          <Select value={previewTimezone} onChange={(event) => setPreviewTimezone(event.target.value)}>
            {timezoneOptions.map((timeZone) => (
              <option key={timeZone} value={timeZone}>
                {timeZone}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2" data-cron-presets>
        {cronPresets.map((preset) => (
          <Button key={preset.labelKey} variant="outline" className="justify-start" onClick={() => setExpression(preset.value)}>
            {ui(dictionary, preset.labelKey, preset.fallback)}
          </Button>
        ))}
      </div>
      <Alert data-cron-result-details>
        <AlertTitle>{ui(dictionary, "fiveFieldInterpretation", "Five-field interpretation")}</AlertTitle>
        <AlertDescription>{summary}</AlertDescription>
      </Alert>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" data-cron-fields>
        {analysis.fields.map((field) => (
          <div key={field.key} className="rounded-md border bg-card p-3">
            <p className="text-xs text-muted-foreground">{ui(dictionary, field.key, field.fallback)}</p>
            <p className="mt-1 break-words text-sm font-medium">{field.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>
            <Badge className="mt-2">
              {ui(dictionary, "cronAllowedValues", "Allowed values")}: {field.count}
            </Badge>
          </div>
        ))}
      </div>
      <section className="rounded-md border bg-card p-3" data-cron-runtime-context>
        <div className="mb-3">
          <p className="text-sm font-medium">{ui(dictionary, "cronRuntimeContext", "Runtime context")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "cronRuntimeContextDescription", "Match the browser preview with the scheduler that will run this expression.")}</p>
        </div>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "cronBrowserTimezone", "Browser timezone"), value: analysis.timezone },
            { label: ui(dictionary, "cronPreviewTimezone", "Preview timezone"), value: previewTimezone },
            { label: ui(dictionary, "cronDayMatching", "Day matching"), value: dayMatchingModeLabel },
          ]}
        />
      </section>
      <section className="rounded-md border bg-card p-3" data-cron-next-runs>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{ui(dictionary, "cronNextRuns", "Next runs")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "cronNextRunsDescription", "Estimated from the browser's local timezone for quick schedule review.")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(expression)}>
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyCronExpression", "Copy cron")}
          </Button>
        </div>
        <div className="mt-3 grid gap-2">
          {analysis.nextRuns.length ? (
            analysis.nextRuns.map((run, index) => (
              <div key={`${run.toISOString()}-${index}`} className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                {formatCronRun(run, previewTimezone)}
              </div>
            ))
          ) : (
            <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {ui(dictionary, "cronNoRunsFound", "No runs found in the preview window.")}
            </div>
          )}
        </div>
      </section>
      <section className="space-y-3 rounded-md border bg-card p-3" data-cron-schedule-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{ui(dictionary, "cronScheduleReport", "Cron schedule report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "cronScheduleReportDescription", "Copy a compact handoff report with cron fields, timezone context, next runs, and deployment checks.")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-cron-schedule-report-copy
            onClick={() =>
              copyToClipboard(
                buildCronScheduleReport({
                  expression,
                  analysis,
                  previewTimezone,
                  dayMatchingModeLabel,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
          >
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyCronScheduleReport", "Copy schedule report")}
          </Button>
        </div>
        <ToolMetricGrid items={scheduleReport.metrics} />
        <ToolWarningList title={ui(dictionary, "cronReportReviewNotes", "Review notes")} warnings={scheduleReport.reviewNotes} emptyLabel={ui(dictionary, "cronReportNoWarnings", "No obvious schedule warnings detected. Confirm the runtime timezone before deploying.")} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "cronReportChecklist", "Safe deployment checklist")}</p>
          <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {scheduleReport.checklist.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-cron-schedule-report-preview>
          <code>{scheduleReport.markdown}</code>
        </pre>
      </section>
      <section className="rounded-md border bg-card p-3" data-cron-warnings>
        <p className="text-sm font-medium">{ui(dictionary, "cronReviewNotes", "Review notes")}</p>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {analysis.warnings.map((key) => (
            <li key={key}>- {ui(dictionary, key, key)}</li>
          ))}
        </ul>
      </section>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Kbd>*</Kbd> {ui(dictionary, "cronAnyValue", "Any value")} <Kbd>*/15</Kbd> {ui(dictionary, "cronEvery15Units", "Every 15 units")} <Kbd>1-5</Kbd> {ui(dictionary, "cronRange", "Range")} <Kbd>1,3,5</Kbd> {ui(dictionary, "cronList", "List")}
      </div>
    </div>
  );
}

function getUrlHostLabel(url: URL | null, dictionary: ClientDictionary) {
  return url?.hostname || ui(dictionary, "invalidUrl", "Invalid URL");
}

function getImageExtensionSignal(url: URL | null) {
  if (!url) return false;
  return /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(url.pathname);
}

function buildMetaCrawlerReport({
  titleText,
  descriptionText,
  canonicalUrl,
  rawCanonical,
  imageUrl,
  rawImage,
  robots,
  warnings,
  output,
  checkedAt,
  dictionary,
}: {
  titleText: string;
  descriptionText: string;
  canonicalUrl: URL | null;
  rawCanonical: string;
  imageUrl: URL | null;
  rawImage: string;
  robots: string;
  warnings: string[];
  output: string;
  checkedAt: string;
  dictionary: ClientDictionary;
}) {
  const canonicalValue = canonicalUrl?.href ?? (rawCanonical.trim() || "-");
  const imageValue = imageUrl?.href ?? (rawImage.trim() || "-");
  const canonicalHost = canonicalUrl?.hostname ?? ui(dictionary, "invalidUrl", "Invalid URL");
  const imageHost = rawImage.trim() ? imageUrl?.hostname ?? ui(dictionary, "invalidUrl", "Invalid URL") : "-";
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "metaCrawlerReportNoWarnings", "No metadata crawler warnings were detected.")];
  const checklist = [
    ui(dictionary, "metaChecklistFetch", "Fetch the final public page and confirm these tags render in the HTML head."),
    ui(dictionary, "metaChecklistCanonical", "Confirm canonical URL, Open Graph URL, and submitted sitemap URL describe the same final page."),
    ui(dictionary, "metaChecklistRobots", "Confirm the robots policy matches the indexing intent before submitting or requesting inspection."),
    ui(dictionary, "metaChecklistSocial", "Preview the Open Graph image with a public HTTPS URL and supported image extension."),
    ui(dictionary, "metaChecklistSearchConsole", "Record Search Console/Bing/Naver follow-up separately because valid tags are not indexing proof."),
  ];
  const markdown = [
    `# ${ui(dictionary, "metaCrawlerReport", "Meta crawler report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt || "-"}`,
    `- ${ui(dictionary, "title", "Title")}: ${titleText || "-"}`,
    `- ${ui(dictionary, "titleLength", "Title length")}: ${titleText.length}`,
    `- ${ui(dictionary, "descriptionLength", "Description length")}: ${descriptionText.length}`,
    `- ${ui(dictionary, "canonicalUrl", "Canonical URL")}: ${canonicalValue}`,
    `- ${ui(dictionary, "canonicalHost", "Canonical host")}: ${canonicalHost}`,
    `- ${ui(dictionary, "openGraphImage", "Open Graph image")}: ${imageValue}`,
    `- ${ui(dictionary, "imageHost", "Image host")}: ${imageHost}`,
    `- ${ui(dictionary, "robotsPolicy", "Robots policy")}: ${robots}`,
    "",
    `## ${ui(dictionary, "metaCrawlerReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "metaCrawlerReportChecklist", "Crawler checklist")}`,
    ...checklist.map((item) => `- ${item}`),
    "",
    `## ${ui(dictionary, "generatedMetaTags", "Generated meta tags")}`,
    "```html",
    output,
    "```",
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    metrics: [
      { label: ui(dictionary, "titleLength", "Title length"), value: String(titleText.length), description: "30-60" },
      { label: ui(dictionary, "descriptionLength", "Description length"), value: String(descriptionText.length), description: "70-160" },
      { label: ui(dictionary, "canonicalHost", "Canonical host"), value: canonicalHost },
      { label: ui(dictionary, "robotsPolicy", "Robots policy"), value: robots },
    ],
  };
}

function buildOpenGraphCrawlerReport({
  titleText,
  descriptionText,
  pageUrl,
  rawUrl,
  imageUrl,
  rawImage,
  robots,
  warnings,
  tags,
  checkedAt,
  dictionary,
}: {
  titleText: string;
  descriptionText: string;
  pageUrl: URL | null;
  rawUrl: string;
  imageUrl: URL | null;
  rawImage: string;
  robots: string;
  warnings: string[];
  tags: string;
  checkedAt: string;
  dictionary: ClientDictionary;
}) {
  const pageValue = pageUrl?.href ?? (rawUrl.trim() || "-");
  const imageValue = imageUrl?.href ?? (rawImage.trim() || "-");
  const pageHost = pageUrl?.hostname ?? ui(dictionary, "invalidUrl", "Invalid URL");
  const imageHost = rawImage.trim() ? imageUrl?.hostname ?? ui(dictionary, "invalidUrl", "Invalid URL") : "-";
  const reportTitle = `${ui(dictionary, "openGraphReview", "Open Graph review")} / ${ui(dictionary, "openGraphCrawlerReport", "Open Graph crawler report")}`;
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "metaCrawlerReportNoWarnings", "No metadata crawler warnings were detected.")];
  const checklist = [
    ui(dictionary, "metaChecklistFetch", "Fetch the final public page and confirm these tags render in the HTML head."),
    ui(dictionary, "metaChecklistCanonical", "Confirm canonical URL, Open Graph URL, and submitted sitemap URL describe the same final page."),
    ui(dictionary, "metaChecklistRobots", "Confirm the robots policy matches the indexing intent before submitting or requesting inspection."),
    ui(dictionary, "metaChecklistSocial", "Preview the Open Graph image with a public HTTPS URL and supported image extension."),
    ui(dictionary, "metaChecklistSearchConsole", "Record Search Console/Bing/Naver follow-up separately because valid tags are not indexing proof."),
  ];
  const markdown = [
    `# ${reportTitle}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt || "-"}`,
    `- ${ui(dictionary, "title", "Title")}: ${titleText || "-"}`,
    `- ${ui(dictionary, "titleLength", "Title length")}: ${titleText.length}`,
    `- ${ui(dictionary, "descriptionLength", "Description length")}: ${descriptionText.length}`,
    `- ${ui(dictionary, "url", "URL")}: ${pageValue}`,
    `- ${ui(dictionary, "pageHost", "Page host")}: ${pageHost}`,
    `- ${ui(dictionary, "openGraphImage", "Open Graph image")}: ${imageValue}`,
    `- ${ui(dictionary, "imageHost", "Image host")}: ${imageHost}`,
    `- ${ui(dictionary, "robotsPolicy", "Robots policy")}: ${robots}`,
    "",
    `## ${ui(dictionary, "metaCrawlerReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "metaCrawlerReportChecklist", "Crawler checklist")}`,
    ...checklist.map((item) => `- ${item}`),
    "",
    `## ${ui(dictionary, "openGraphTags", "Open Graph tags")}`,
    "```html",
    tags,
    "```",
  ].join("\n");

  return {
    markdown,
    metrics: [
      { label: ui(dictionary, "titleLength", "Title length"), value: String(titleText.length), description: "1-70" },
      { label: ui(dictionary, "descriptionLength", "Description length"), value: String(descriptionText.length), description: "1-200" },
      { label: ui(dictionary, "pageHost", "Page host"), value: pageHost },
      { label: ui(dictionary, "imageHost", "Image host"), value: imageHost },
      { label: ui(dictionary, "robotsPolicy", "Robots policy"), value: robots },
    ],
    reportTitle,
  };
}

function MetaTagTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [title, setTitle] = React.useState("Bob's Multi Tool - Practical Developer Utilities");
  const [description, setDescription] = React.useState("Fast browser tools for developers, built for daily workflows.");
  const [url, setUrl] = React.useState("https://www.bobob.app/tools/meta-tag-generator");
  const [image, setImage] = React.useState("https://www.bobob.app/og-image.png");
  const [robots, setRobots] = React.useState("index,follow");
  const [reportCheckedAt, setReportCheckedAt] = React.useState("");
  React.useEffect(() => {
    setReportCheckedAt(new Date().toISOString());
  }, [description, image, robots, title, url]);
  const titleText = title.trim();
  const descriptionText = description.trim();
  const canonicalUrl = parsePublicUrl(url.trim());
  const imageUrl = parsePublicUrl(image.trim());
  const escapedTitle = escapeXml(titleText);
  const escapedDescription = escapeXml(descriptionText);
  const escapedCanonical = escapeXml(canonicalUrl?.href ?? url.trim());
  const escapedImage = escapeXml(imageUrl?.href ?? image.trim());
  const warnings = [
    titleText.length < 30 ? ui(dictionary, "titleTooShortWarning", "Title is short. Add the page type, primary action, or keyword intent.") : "",
    titleText.length > 60 ? ui(dictionary, "titleTooLongWarning", "Title is long and may truncate in search results.") : "",
    descriptionText.length < 70 ? ui(dictionary, "descriptionTooShortWarning", "Description is short. Add the main use case and trust signal.") : "",
    descriptionText.length > 160 ? ui(dictionary, "descriptionTooLongWarning", "Description is long and may be rewritten or truncated.") : "",
    url.trim() && !canonicalUrl ? ui(dictionary, "canonicalInvalidWarning", "Canonical URL is not a valid absolute URL.") : "",
    canonicalUrl && canonicalUrl.protocol !== "https:" ? ui(dictionary, "canonicalNonHttpsWarning", "Use HTTPS for canonical URLs on public pages.") : "",
    canonicalUrl && isPrivateOrLocalHostname(canonicalUrl.hostname) ? ui(dictionary, "canonicalPrivateWarning", "Canonical URL points to a local or private host.") : "",
    url.includes("#") ? ui(dictionary, "canonicalHashWarning", "Canonical URLs should not include fragment identifiers.") : "",
    robots.startsWith("noindex") ? ui(dictionary, "noindexWarning", "Noindex prevents the page from appearing in search results.") : "",
    !image.trim() ? ui(dictionary, "imageMissingWarning", "Add an Open Graph image for richer social previews.") : "",
    image.trim() && !imageUrl ? ui(dictionary, "imageInvalidWarning", "Image URL is not a valid absolute URL.") : "",
    imageUrl && imageUrl.protocol !== "https:" ? ui(dictionary, "imageNonHttpsWarning", "Use HTTPS image URLs for social preview crawlers.") : "",
    imageUrl && isPrivateOrLocalHostname(imageUrl.hostname) ? ui(dictionary, "imagePrivateWarning", "Image URL points to a local or private host.") : "",
    imageUrl && !getImageExtensionSignal(imageUrl) ? ui(dictionary, "ogImageFormatWarning", "Image URL should usually end with PNG, JPG, WebP, GIF, or AVIF.") : "",
  ].filter(Boolean);
  const output = [
    `<title>${escapedTitle}</title>`,
    `<meta name="description" content="${escapedDescription}" />`,
    `<link rel="canonical" href="${escapedCanonical}" />`,
    `<meta name="robots" content="${escapeXml(robots)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${escapedDescription}" />`,
    `<meta property="og:url" content="${escapedCanonical}" />`,
    `<meta property="og:image" content="${escapedImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
    `<meta name="twitter:image" content="${escapedImage}" />`,
  ].join("\n");
  const crawlerReport = buildMetaCrawlerReport({
    titleText,
    descriptionText,
    canonicalUrl,
    rawCanonical: url,
    imageUrl,
    rawImage: image,
    robots,
    warnings,
    output,
    checkedAt: reportCheckedAt,
    dictionary,
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "title", "Title")}</span>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "canonicalUrl", "Canonical URL")}</span>
          <Input value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">{ui(dictionary, "description", "Description")}</span>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "openGraphImage", "Open Graph image")}</span>
          <Input value={image} onChange={(event) => setImage(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">Robots</span>
          <Select value={robots} onChange={(event) => setRobots(event.target.value)}>
            <option value="index,follow">index,follow</option>
            <option value="noindex,follow">noindex,follow</option>
            <option value="noindex,nofollow">noindex,nofollow</option>
          </Select>
        </label>
      </div>
      <ToolMetricGrid
        items={[
          { label: ui(dictionary, "titleLength", "Title length"), value: String(titleText.length), description: "30-60" },
          { label: ui(dictionary, "descriptionLength", "Description length"), value: String(descriptionText.length), description: "70-160" },
          { label: ui(dictionary, "canonicalHost", "Canonical host"), value: getUrlHostLabel(canonicalUrl, dictionary) },
          { label: ui(dictionary, "imageHost", "Image host"), value: image.trim() ? getUrlHostLabel(imageUrl, dictionary) : "-" },
          { label: ui(dictionary, "robotsPolicy", "Robots policy"), value: robots },
        ]}
      />
      <div data-meta-diagnostics>
        <ToolWarningList title={ui(dictionary, "metaSeoReview", "Meta SEO review")} warnings={warnings} emptyLabel={ui(dictionary, "metaLooksReady", "Meta tags look ready for search and social crawlers.")} />
      </div>
      <section className="rounded-md border bg-card" data-meta-crawler-report>
        <div className="border-b p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{ui(dictionary, "metaCrawlerReport", "Meta crawler report")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "metaCrawlerReportDescription", "Copy a compact title, description, canonical, robots, image, and crawler follow-up note before changing public metadata.")}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(crawlerReport.markdown)} data-meta-crawler-report-copy>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copyMetaCrawlerReport", "Copy report")}
            </Button>
          </div>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={crawlerReport.metrics} />
          <ToolWarningList title={ui(dictionary, "metaCrawlerReportReviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "metaCrawlerReportNoWarnings", "No metadata crawler warnings were detected.")} />
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-meta-crawler-report-preview>
            <code>{crawlerReport.markdown}</code>
          </pre>
        </div>
      </section>
      <ResultBlock title={ui(dictionary, "generatedMetaTags", "Generated meta tags")} value={output} dictionary={dictionary} />
    </div>
  );
}

function IframeTool({ dictionary }: { dictionary: ClientDictionary }) {
  const sizes = [
    { label: "Desktop", width: 1440, height: 900 },
    { label: "Tablet", width: 834, height: 1112 },
    { label: "Mobile", width: 390, height: 844 },
  ];
  const [url, setUrl] = React.useState("https://www.bobob.app");
  const [sizeLabel, setSizeLabel] = React.useState("Mobile");
  const size = sizes.find((item) => item.label === sizeLabel) ?? sizes[2];
  const normalizedUrl = React.useMemo(() => {
    try {
      return new URL(url.includes("://") ? url : `https://${url}`).toString();
    } catch {
      return "";
    }
  }, [url]);
  const iframeCode = normalizedUrl ? `<iframe src="${normalizedUrl}" width="${size.width}" height="${size.height}" loading="lazy"></iframe>` : "";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "url", "URL")}</span>
          <Input value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "viewport", "Viewport")}</span>
          <Select value={sizeLabel} onChange={(event) => setSizeLabel(event.target.value)}>
            {sizes.map((item) => (
              <option key={item.label} value={item.label}>
                {item.label} {item.width}x{item.height}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <div className="overflow-auto rounded-lg border bg-muted p-4">
        <div style={{ width: Math.min(size.width, 960), aspectRatio: `${size.width}/${size.height}` }} className="mx-auto overflow-hidden rounded-md border bg-background">
          {normalizedUrl ? (
            <iframe title="Preview" src={normalizedUrl} className="h-full w-full" sandbox="allow-scripts allow-forms allow-same-origin" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{ui(dictionary, "enterValidUrl", "Enter a valid URL.")}</div>
          )}
        </div>
      </div>
      <ResultBlock title={ui(dictionary, "iframeMarkup", "Iframe markup")} value={iframeCode} dictionary={dictionary} />
      <Alert>
        <AlertTitle>{ui(dictionary, "frameLoadingNote", "Frame loading note")}</AlertTitle>
        <AlertDescription>Some sites block iframe rendering with X-Frame-Options or Content-Security-Policy.</AlertDescription>
      </Alert>
    </div>
  );
}

const loremSentences = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  "Donec ullamcorper nulla non metus auctor fringilla.",
  "Aenean lacinia bibendum nulla sed consectetur.",
  "Cras mattis consectetur purus sit amet fermentum.",
  "Maecenas faucibus mollis interdum.",
];

function LoremTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [paragraphs, setParagraphs] = React.useState(3);
  const [sentences, setSentences] = React.useState(3);
  const output = Array.from({ length: paragraphs }, (_, paragraphIndex) =>
    Array.from({ length: sentences }, (_, sentenceIndex) => loremSentences[(paragraphIndex + sentenceIndex) % loremSentences.length]).join(" "),
  ).join("\n\n");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "paragraphs", "Paragraphs")}</span>
          <Input type="number" min={1} max={10} value={paragraphs} onChange={(event) => setParagraphs(Number(event.target.value))} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "sentencesPerParagraph", "Sentences per paragraph")}</span>
          <Input type="number" min={1} max={8} value={sentences} onChange={(event) => setSentences(Number(event.target.value))} />
        </label>
      </div>
      <ResultBlock title={ui(dictionary, "placeholderText", "Placeholder text")} value={output} dictionary={dictionary} />
    </div>
  );
}

const jsonFormatterExamples = [
  {
    labelKey: "apiResponseJson",
    fallback: "API response",
    value: '{"status":"ok","items":[{"id":1,"name":"Bob","roles":["admin","editor"]}],"meta":{"page":1,"total":42}}',
  },
  {
    labelKey: "apiDebugJson",
    fallback: "API debug",
    value: '{"user":{"id":"user_123","sessionToken":"redacted","email":""},"items":[{"id":1},{"id":2}],"meta":{"requestId":"req_123","errors":[]}}',
  },
  {
    labelKey: "packageConfigJson",
    fallback: "Package config",
    value: '{"name":"bobob-tools","private":true,"scripts":{"build":"next build","lint":"next lint"},"dependencies":{"next":"15.3.3"}}',
  },
  {
    labelKey: "analyticsEventJson",
    fallback: "Analytics event",
    value: '{"event":"tool_used","tool":"json-formatter","timestamp":"2026-06-10T08:00:00.000Z","properties":{"locale":"en","localOnly":true}}',
  },
];

function getJsonValueType(value: unknown) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function collectJsonStats(value: unknown, formatted: string) {
  let objectCount = 0;
  let arrayCount = 0;
  let keyCount = 0;
  let primitiveCount = 0;

  const walk = (node: unknown, depth: number): number => {
    if (Array.isArray(node)) {
      arrayCount += 1;
      if (node.length === 0) return depth;
      return Math.max(...node.map((item) => walk(item, depth + 1)));
    }
    if (node && typeof node === "object") {
      objectCount += 1;
      const entries = Object.entries(node as Record<string, unknown>);
      keyCount += entries.length;
      if (entries.length === 0) return depth;
      return Math.max(...entries.map(([, item]) => walk(item, depth + 1)));
    }
    primitiveCount += 1;
    return depth;
  };

  const rootType = getJsonValueType(value);
  const topLevelItems = Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value).length : 1;

  return {
    rootType,
    topLevelItems,
    depth: walk(value, 1),
    lines: formatted ? formatted.split("\n").length : 0,
    bytes: new Blob([formatted]).size,
    objectCount,
    arrayCount,
    keyCount,
    primitiveCount,
  };
}

function jsonPathKeySegment(key: string) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}

function getJsonRootEntries(value: unknown) {
  if (Array.isArray(value)) {
    return value.slice(0, 8).map((item, index) => ({ name: `[${index}]`, type: getJsonValueType(item) }));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .slice(0, 8)
      .map(([name, item]) => ({ name, type: getJsonValueType(item) }));
  }
  return [{ name: "value", type: getJsonValueType(value) }];
}

function getJsonPreviewValue(value: unknown) {
  if (Array.isArray(value)) return `${value.length} items`;
  if (value && typeof value === "object") return `${Object.keys(value as Record<string, unknown>).length} keys`;
  const serialized = JSON.stringify(value);
  return serialized === undefined ? String(value) : serialized;
}

function findDuplicateJsonObjectKeys(input: string) {
  const stack: Array<{ keys: Set<string> } | null> = [];
  const duplicateKeys = new Set<string>();
  let index = 0;

  while (index < input.length) {
    const character = input[index];
    if (character === "\"") {
      let value = "";
      index += 1;
      while (index < input.length) {
        const current = input[index];
        if (current === "\\") {
          value += current + (input[index + 1] ?? "");
          index += 2;
          continue;
        }
        if (current === "\"") break;
        value += current;
        index += 1;
      }
      const closeIndex = index;
      let nextIndex = closeIndex + 1;
      while (/\s/.test(input[nextIndex] ?? "")) nextIndex += 1;
      const objectContext = stack.at(-1);
      if (input[nextIndex] === ":" && objectContext) {
        let decodedKey = value;
        try {
          decodedKey = JSON.parse(`"${value}"`) as string;
        } catch {
          decodedKey = value;
        }
        if (objectContext.keys.has(decodedKey)) duplicateKeys.add(decodedKey);
        else objectContext.keys.add(decodedKey);
      }
      index = closeIndex + 1;
      continue;
    }
    if (character === "{") stack.push({ keys: new Set() });
    else if (character === "[") stack.push(null);
    else if (character === "}" || character === "]") stack.pop();
    index += 1;
  }

  return Array.from(duplicateKeys).slice(0, 8);
}

function collectJsonDiagnostics(value: unknown, formatted: string, input: string) {
  const sensitivePaths: string[] = [];
  const emptyValuePaths: string[] = [];
  const largeArrayPaths: Array<{ path: string; size: number }> = [];
  const duplicateKeys = findDuplicateJsonObjectKeys(input);
  const sensitivePattern = /\b(pass(word|wd)?|token|secret|api[_-]?key|authorization|cookie|session|refresh[_-]?token|access[_-]?token|client[_-]?secret)\b/i;

  const walk = (node: unknown, path: string) => {
    if (Array.isArray(node)) {
      if (node.length === 0) emptyValuePaths.push(path);
      if (node.length >= 100) largeArrayPaths.push({ path, size: node.length });
      node.slice(0, 250).forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }
    if (node && typeof node === "object") {
      const entries = Object.entries(node as Record<string, unknown>);
      if (entries.length === 0) emptyValuePaths.push(path);
      entries.forEach(([key, item]) => {
        const nextPath = `${path}${jsonPathKeySegment(key)}`;
        if (sensitivePattern.test(key)) sensitivePaths.push(nextPath);
        walk(item, nextPath);
      });
      return;
    }
    if (node === null || node === "") emptyValuePaths.push(path);
  };

  walk(value, "$");

  return {
    duplicateKeys,
    sensitivePaths: sensitivePaths.slice(0, 8),
    emptyValuePaths: emptyValuePaths.slice(0, 8),
    largeArrayPaths: largeArrayPaths.slice(0, 6),
    bytes: byteLength(formatted),
  };
}

function getJsonDiagnosticWarnings(stats: ReturnType<typeof collectJsonStats>, diagnostics: ReturnType<typeof collectJsonDiagnostics>, dictionary: ClientDictionary) {
  return [
    diagnostics.sensitivePaths.length ? ui(dictionary, "jsonSensitiveKeyWarning", "{count} sensitive-looking keys were found. Redact tokens, secrets, cookies, and identifiers before sharing.").replace("{count}", String(diagnostics.sensitivePaths.length)) : "",
    diagnostics.duplicateKeys.length ? ui(dictionary, "jsonDuplicateKeyWarning", "Duplicate keys can be overwritten by parsers. Review repeated keys before trusting the formatted output.") : "",
    diagnostics.emptyValuePaths.length ? ui(dictionary, "jsonEmptyValueWarning", "{count} null, empty string, empty array, or empty object values were found. Confirm blanks are intentional.").replace("{count}", String(diagnostics.emptyValuePaths.length)) : "",
    diagnostics.largeArrayPaths.length ? ui(dictionary, "jsonLargeArrayWarning", "{count} large arrays are present. Use JSONPath or a smaller sample before sharing or converting.").replace("{count}", String(diagnostics.largeArrayPaths.length)) : "",
    stats.depth >= 8 ? ui(dictionary, "jsonDeepNestingWarning", "This payload is deeply nested. Confirm downstream tools can handle the shape before copying.") : "",
    diagnostics.bytes > 100_000 ? ui(dictionary, "jsonLargePayloadWarning", "This is a large payload. Formatting is local, but sharing the full output can expose too much data.") : "",
  ].filter(Boolean);
}

function getJsonDiagnosticRows(diagnostics: ReturnType<typeof collectJsonDiagnostics>, dictionary: ClientDictionary) {
  return [
    ...diagnostics.sensitivePaths.map((path) => ({ label: ui(dictionary, "sensitiveKeys", "Sensitive keys"), value: path })),
    ...diagnostics.emptyValuePaths.map((path) => ({ label: ui(dictionary, "emptyValues", "Empty values"), value: path })),
    ...diagnostics.largeArrayPaths.map((item) => ({ label: ui(dictionary, "largeArrays", "Large arrays"), value: `${item.path} (${item.size})` })),
    ...diagnostics.duplicateKeys.map((key) => ({ label: ui(dictionary, "duplicateKeys", "Duplicate keys"), value: key })),
  ].slice(0, 10);
}

function buildJsonApiResponseReport({
  stats,
  diagnostics,
  paths,
  dictionary,
  checkedAt,
}: {
  stats: ReturnType<typeof collectJsonStats>;
  diagnostics: ReturnType<typeof collectJsonDiagnostics>;
  paths: ReturnType<typeof collectJsonPaths>;
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const reviewNotes = getJsonDiagnosticWarnings(stats, diagnostics, dictionary);
  const pathRows = paths.slice(0, 6);
  const checklist = [
    ui(dictionary, "jsonApiChecklistRedact", "Redact tokens, cookies, customer identifiers, and internal URLs before sharing."),
    ui(dictionary, "jsonApiChecklistParseError", "If the response is invalid, include the exact parse error line and column in the bug report."),
    ui(dictionary, "jsonApiChecklistLargePayload", "For large or deeply nested responses, share a JSONPath-focused sample instead of the full payload."),
    ui(dictionary, "jsonApiChecklistDuplicateKeys", "Confirm duplicate keys before trusting downstream parser output."),
    ui(dictionary, "jsonApiChecklistAttachSample", "Attach a formatted sample only after removing production-only values."),
  ];
  const metrics = [
    { label: ui(dictionary, "rootType", "Root type"), value: stats.rootType },
    { label: ui(dictionary, "topLevelItems", "Top-level items"), value: String(stats.topLevelItems) },
    { label: ui(dictionary, "nestedDepth", "Nested depth"), value: String(stats.depth) },
    { label: ui(dictionary, "outputLines", "Output lines"), value: String(stats.lines) },
    { label: ui(dictionary, "sensitiveKeys", "Sensitive keys"), value: String(diagnostics.sensitivePaths.length) },
    { label: ui(dictionary, "duplicateKeys", "Duplicate keys"), value: String(diagnostics.duplicateKeys.length) },
  ];
  const reviewLines = reviewNotes.length ? reviewNotes : [ui(dictionary, "jsonApiReportNoWarnings", "No obvious JSON structure warnings detected. Still redact production identifiers before sharing.")];
  const pathLines = pathRows.length
    ? pathRows.map((entry) => `- \`${entry.path}\` (${entry.type}) - ${entry.preview}`)
    : [`- ${ui(dictionary, "jsonApiReportNoPaths", "No preview paths were available for this payload.")}`];

  const markdown = [
    `# ${ui(dictionary, "jsonApiResponseReport", "API response report")}`,
    "",
    `- ${ui(dictionary, "jsonApiReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "rootType", "Root type")}: ${stats.rootType}`,
    `- ${ui(dictionary, "topLevelItems", "Top-level items")}: ${stats.topLevelItems}`,
    `- ${ui(dictionary, "nestedDepth", "Nested depth")}: ${stats.depth}`,
    `- ${ui(dictionary, "outputLines", "Output lines")}: ${stats.lines}`,
    `- ${ui(dictionary, "inputBytes", "Input bytes")}: ${diagnostics.bytes}`,
    "",
    `## ${ui(dictionary, "jsonApiReportReviewNotes", "Review notes")}`,
    ...reviewLines.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "jsonApiReportPaths", "Useful JSON paths")}`,
    ...pathLines,
    "",
    `## ${ui(dictionary, "jsonApiSafeHandoffChecklist", "Safe handoff checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, pathRows, checklist };
}

function collectJsonPaths(value: unknown, limit = 12) {
  const paths: Array<{ path: string; type: string; preview: string }> = [];
  const walk = (node: unknown, path: string, depth: number) => {
    if (paths.length >= limit || depth > 5) return;
    paths.push({ path, type: getJsonValueType(node), preview: getJsonPreviewValue(node) });

    if (Array.isArray(node)) {
      node.slice(0, 4).forEach((item, index) => walk(item, `${path}[${index}]`, depth + 1));
      return;
    }

    if (node && typeof node === "object") {
      Object.entries(node as Record<string, unknown>)
        .slice(0, 6)
        .forEach(([key, item]) => {
          walk(item, `${path}${jsonPathKeySegment(key)}`, depth + 1);
        });
    }
  };

  walk(value, "$", 1);
  return paths;
}

function parseSimpleJsonPath(path: string) {
  const trimmed = path.trim();
  const normalized = !trimmed || trimmed === "$" ? "$" : trimmed.startsWith("$") ? trimmed : trimmed.startsWith(".") || trimmed.startsWith("[") ? `$${trimmed}` : `$.${trimmed}`;
  const tokens: Array<string | number> = [];
  let index = 1;

  while (index < normalized.length) {
    if (normalized[index] === ".") {
      const match = normalized.slice(index + 1).match(/^[A-Za-z_$][\w$]*/);
      if (!match?.[0]) throw new Error("Use .key, [0], or [\"key\"] path syntax.");
      tokens.push(match[0]);
      index += match[0].length + 1;
      continue;
    }

    if (normalized[index] === "[") {
      const closeIndex = normalized.indexOf("]", index);
      if (closeIndex === -1) throw new Error("Path bracket is not closed.");
      const content = normalized.slice(index + 1, closeIndex).trim();
      if (/^\d+$/.test(content)) {
        tokens.push(Number(content));
      } else if ((content.startsWith("\"") && content.endsWith("\"")) || (content.startsWith("'") && content.endsWith("'"))) {
        const quoted = content.startsWith("'") ? `"${content.slice(1, -1).replace(/"/g, "\\\"")}"` : content;
        tokens.push(JSON.parse(quoted) as string);
      } else {
        throw new Error("Use a numeric index or quoted key inside brackets.");
      }
      index = closeIndex + 1;
      continue;
    }

    throw new Error("Use .key, [0], or [\"key\"] path syntax.");
  }

  return { normalized, tokens };
}

function inspectJsonPath(value: unknown, path: string) {
  const parsed = parseSimpleJsonPath(path);
  let current = value;

  for (const token of parsed.tokens) {
    if (Array.isArray(current) && typeof token === "number") {
      if (token < 0 || token >= current.length) return { ...parsed, found: false, value: undefined };
      current = current[token];
      continue;
    }

    if (current && typeof current === "object" && typeof token === "string" && Object.prototype.hasOwnProperty.call(current, token)) {
      current = (current as Record<string, unknown>)[token];
      continue;
    }

    return { ...parsed, found: false, value: undefined };
  }

  return { ...parsed, found: true, value: current };
}

function formatJsonInspectorValue(value: unknown) {
  if (typeof value === "string") return value;
  const serialized = JSON.stringify(value, null, 2);
  return serialized === undefined ? String(value) : serialized;
}

function getJsonErrorLocation(message: string, input: string) {
  const explicitLineColumn = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  const positionMatch = message.match(/position\s+(\d+)/i);
  const position = positionMatch ? Number(positionMatch[1]) : null;
  if (!explicitLineColumn && position === null) return null;

  const safePosition = typeof position === "number" && Number.isFinite(position) ? Math.max(0, Math.min(input.length, position)) : 0;
  const before = input.slice(0, safePosition);
  const line = explicitLineColumn ? Number(explicitLineColumn[1]) : before.split("\n").length;
  const column = explicitLineColumn ? Number(explicitLineColumn[2]) : before.split("\n").at(-1)!.length + 1;
  const lines = input.split("\n");
  const lineText = lines[Math.max(0, line - 1)] ?? input.slice(Math.max(0, safePosition - 40), safePosition + 40);
  const contextLines = lines.slice(Math.max(0, line - 2), Math.min(lines.length, line + 1)).map((text, index) => ({
    lineNumber: Math.max(1, line - 1) + index,
    text,
    isErrorLine: Math.max(1, line - 1) + index === line,
  }));

  return {
    position: safePosition,
    line,
    column,
    excerpt: lineText.trim() || input.slice(Math.max(0, safePosition - 40), safePosition + 40),
    contextLines,
  };
}

function getJsonErrorHintKey(message: string) {
  if (/property name|double-quoted|unexpected token '?[A-Za-z_]/i.test(message)) return "jsonErrorHintQuotesComma";
  if (/unexpected end|unterminated|end of json input/i.test(message)) return "jsonErrorHintClosing";
  if (/non-whitespace|after json/i.test(message)) return "jsonErrorHintTrailing";
  if (/control character|bad character/i.test(message)) return "jsonErrorHintControl";
  return "jsonErrorHintGeneric";
}

function JsonFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState('{"status":"ok","items":[{"id":1,"name":"Bob"}]}');
  const [space, setSpace] = React.useState("2");
  const [pathQuery, setPathQuery] = React.useState("$.items[0].name");
  const result = React.useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const value = JSON.stringify(parsed, null, Number(space));
      const minified = JSON.stringify(parsed);
      return {
        error: "",
        value,
        minified,
        parsed,
        stats: collectJsonStats(parsed, value),
        diagnostics: collectJsonDiagnostics(parsed, value, input),
        rootEntries: getJsonRootEntries(parsed),
        paths: collectJsonPaths(parsed),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      return { error: message, value: "", minified: "", parsed: null, stats: null, diagnostics: null, rootEntries: [], paths: [], errorLocation: getJsonErrorLocation(message, input) };
    }
  }, [input, space]);
  const pathInspection = React.useMemo(() => {
    if (result.error) return null;
    try {
      return { error: "", ...inspectJsonPath(result.parsed, pathQuery) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid path", normalized: pathQuery, tokens: [], found: false, value: undefined };
    }
  }, [pathQuery, result]);
  const apiResponseReport = React.useMemo(() => {
    if (!result.stats || !result.diagnostics) return null;
    return buildJsonApiResponseReport({
      stats: result.stats,
      diagnostics: result.diagnostics,
      paths: result.paths,
      dictionary,
      checkedAt: ui(dictionary, "jsonApiReportCopyTime", "Browser copy time"),
    });
  }, [dictionary, result.diagnostics, result.paths, result.stats]);

  return (
    <div className="space-y-4">
      <div className="space-y-2" data-json-examples>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jsonExamples", "JSON examples")}</p>
        <div className="flex flex-wrap gap-2">
          {jsonFormatterExamples.map((example) => (
            <Button key={example.labelKey} type="button" variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallback)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_140px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "jsonInput", "JSON input")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "indent", "Indent")}</span>
          <Select value={space} onChange={(event) => setSpace(event.target.value)}>
            <option value="2">{ui(dictionary, "twoSpaces", "2 spaces")}</option>
            <option value="4">{ui(dictionary, "fourSpaces", "4 spaces")}</option>
            <option value="0">{ui(dictionary, "minified", "Minified")}</option>
          </Select>
        </label>
      </div>
      {result.error ? (
        <div className="space-y-3">
          <ErrorAlert title={ui(dictionary, "invalidJson", "Invalid JSON")} message={result.error} />
          {result.errorLocation ? (
            <section className="rounded-md border bg-card p-3" data-json-error-details>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{ui(dictionary, "jsonErrorDetails", "JSON error details")}</p>
                <Badge>
                  {ui(dictionary, "errorPosition", "Position")} {result.errorLocation.position}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {ui(dictionary, "errorLineColumn", "Line / column")}: {result.errorLocation.line}:{result.errorLocation.column}
              </p>
              <div className="mt-3 rounded-md border bg-muted" data-json-error-context>
                <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">{ui(dictionary, "jsonErrorContext", "Error context")}</div>
                <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
                  <code>
                    {result.errorLocation.contextLines
                      .map((item) => {
                        const prefix = `${String(item.lineNumber).padStart(3, " ")} | `;
                        const caret = item.isErrorLine ? `\n${" ".repeat(prefix.length + Math.max(0, result.errorLocation!.column - 1))}^` : "";
                        return `${prefix}${item.text}${caret}`;
                      })
                      .join("\n")}
                  </code>
                </pre>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{ui(dictionary, "jsonRepairHint", "Repair hint")}:</span> {ui(dictionary, getJsonErrorHintKey(result.error), "Check missing commas, quotes, brackets, or trailing text around the highlighted location.")}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                <code>{result.errorLocation.excerpt}</code>
              </pre>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4" data-json-result-details>
          {result.stats ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: ui(dictionary, "rootType", "Root type"), value: result.stats.rootType },
                { label: ui(dictionary, "topLevelItems", "Top-level items"), value: String(result.stats.topLevelItems) },
                { label: ui(dictionary, "nestedDepth", "Nested depth"), value: String(result.stats.depth) },
                { label: ui(dictionary, "outputLines", "Output lines"), value: String(result.stats.lines) },
              ].map((item) => (
                <div key={item.label} className="rounded-md border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 break-words text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.stats && result.diagnostics ? (
            <section className="space-y-3 rounded-md border bg-card p-3" data-json-diagnostics>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{ui(dictionary, "jsonDiagnostics", "JSON diagnostics")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsonDiagnosticsDescription", "Review sensitive-looking keys, empty values, duplicate keys, and large arrays before copying or sharing.")}</p>
                </div>
                <Badge>{ui(dictionary, "jsonLocalOnly", "Local only")}</Badge>
              </div>
              <ToolMetricGrid
                items={[
                  { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(result.diagnostics.bytes) },
                  { label: ui(dictionary, "sensitiveKeys", "Sensitive keys"), value: String(result.diagnostics.sensitivePaths.length) },
                  { label: ui(dictionary, "emptyValues", "Empty values"), value: String(result.diagnostics.emptyValuePaths.length) },
                  { label: ui(dictionary, "duplicateKeys", "Duplicate keys"), value: String(result.diagnostics.duplicateKeys.length) },
                ]}
              />
              <div data-json-diagnostic-paths>
                {getJsonDiagnosticRows(result.diagnostics, dictionary).length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {getJsonDiagnosticRows(result.diagnostics, dictionary).map((item) => (
                      <div key={`${item.label}-${item.value}`} className="min-w-0 rounded-md bg-muted px-3 py-2 text-xs">
                        <p className="font-medium">{item.label}</p>
                        <code className="mt-1 block min-w-0 overflow-x-auto whitespace-nowrap text-muted-foreground">{item.value}</code>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <ToolWarningList title={ui(dictionary, "jsonReviewNotes", "JSON review notes")} warnings={getJsonDiagnosticWarnings(result.stats, result.diagnostics, dictionary)} emptyLabel={ui(dictionary, "jsonNoDiagnosticWarnings", "JSON structure looks ready to copy. Still redact real production identifiers before sharing.")} />
            </section>
          ) : null}
          {apiResponseReport && result.stats && result.diagnostics ? (
            <section className="space-y-3 rounded-md border bg-card p-3" data-json-api-report>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{ui(dictionary, "jsonApiResponseReport", "API response report")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsonApiResponseReportDescription", "Copy a compact handoff report with structure, diagnostics, useful JSON paths, and safe sharing checks.")}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-json-api-report-copy
                  onClick={() =>
                    copyToClipboard(
                      buildJsonApiResponseReport({
                        stats: result.stats!,
                        diagnostics: result.diagnostics!,
                        paths: result.paths,
                        dictionary,
                        checkedAt: new Date().toISOString(),
                      }).markdown,
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyJsonApiResponseReport", "Copy API report")}
                </Button>
              </div>
              <ToolMetricGrid items={apiResponseReport.metrics} />
              <ToolWarningList title={ui(dictionary, "jsonApiReportReviewNotes", "Review notes")} warnings={apiResponseReport.reviewNotes} emptyLabel={ui(dictionary, "jsonApiReportNoWarnings", "No obvious JSON structure warnings detected. Still redact production identifiers before sharing.")} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jsonApiSafeHandoffChecklist", "Safe handoff checklist")}</p>
                <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  {apiResponseReport.checklist.map((item) => (
                    <li key={item} className="rounded-md bg-muted px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-json-api-report-preview>
                <code>{apiResponseReport.markdown}</code>
              </pre>
            </section>
          ) : null}
          <section className="rounded-md border bg-card p-3" data-json-structure>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{ui(dictionary, "jsonStructure", "JSON structure")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsonStructureDescription", "Review the root shape before copying the formatted payload.")}</p>
              </div>
              {result.stats ? (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge>
                    {ui(dictionary, "totalKeys", "Keys")}: {result.stats.keyCount}
                  </Badge>
                  <Badge>
                    {ui(dictionary, "arrays", "Arrays")}: {result.stats.arrayCount}
                  </Badge>
                  <Badge>
                    {ui(dictionary, "primitives", "Primitives")}: {result.stats.primitiveCount}
                  </Badge>
                </div>
              ) : null}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {result.rootEntries.map((entry) => (
                <div key={`${entry.name}-${entry.type}`} className="min-w-0 rounded-md bg-muted px-3 py-2 text-xs">
                  <span className="font-medium break-words">{entry.name}</span>
                  <span className="mx-2 text-muted-foreground">:</span>
                  <span className="text-muted-foreground">{entry.type}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border bg-card p-3" data-json-path-preview>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{ui(dictionary, "jsonPathPreview", "JSON path preview")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsonPathPreviewDescription", "Copy common paths before moving into JSONPath or TypeScript generation.")}</p>
              </div>
              <Badge>{result.paths.length}</Badge>
            </div>
            <div className="mt-3 grid gap-2">
              {result.paths.map((entry) => (
                <div key={`${entry.path}-${entry.type}`} className="grid min-w-0 gap-2 rounded-md bg-muted px-3 py-2 text-xs md:grid-cols-[minmax(0,1.2fr)_7rem_minmax(0,1fr)_auto] md:items-center">
                  <code className="min-w-0 overflow-x-auto whitespace-nowrap rounded bg-background px-2 py-1">{entry.path}</code>
                  <span className="text-muted-foreground">{entry.type}</span>
                  <span className="min-w-0 truncate text-muted-foreground">{entry.preview}</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(entry.path)}>
                    <Copy className="h-4 w-4" />
                    {ui(dictionary, "copyJsonPath", "Copy path")}
                  </Button>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border bg-card p-3" data-json-path-inspector>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{ui(dictionary, "jsonPathInspector", "Path inspector")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsonPathInspectorDescription", "Extract one value from the formatted JSON with dot or bracket paths.")}</p>
              </div>
              <Badge>{pathInspection?.found ? getJsonValueType(pathInspection.value) : ui(dictionary, "pathNotFound", "Not found")}</Badge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "pathToInspect", "Path to inspect")}</span>
                <Input value={pathQuery} onChange={(event) => setPathQuery(event.target.value)} placeholder="$.items[0].name" />
              </label>
              <div className="flex items-end">
                <Button variant="outline" size="sm" disabled={!pathInspection?.found} onClick={() => pathInspection?.found && copyToClipboard(formatJsonInspectorValue(pathInspection.value))}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyExtractedValue", "Copy value")}
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{ui(dictionary, "pathSyntaxHint", "Supported: $, .key, [0], and [\"key with spaces\"].")}</p>
            {pathInspection?.error ? (
              <ErrorAlert title={ui(dictionary, "jsonPathInvalid", "Path error")} message={pathInspection.error} />
            ) : (
              <pre className="mt-3 max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
                <code>{pathInspection?.found ? formatJsonInspectorValue(pathInspection.value) : ui(dictionary, "pathNotFound", "Not found")}</code>
              </pre>
            )}
          </section>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.value)}>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copyFormattedJson", "Copy formatted JSON")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.minified)}>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copyMinifiedJson", "Copy minified JSON")}
            </Button>
          </div>
          <ResultNextActions signals={["json-valid"]} dictionary={dictionary} />
          <ResultBlock title={ui(dictionary, "formattedJson", "Formatted JSON")} value={result.value} dictionary={dictionary} />
        </div>
      )}
    </div>
  );
}

function escapeJsonString(value: string) {
  return JSON.stringify(value).slice(1, -1);
}

function quoteJsonEscapedInput(value: string) {
  let output = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const previous = value[index - 1];
    if (character === "\"" && previous !== "\\") {
      output += "\\\"";
    } else if (character === "\n") {
      output += "\\n";
    } else if (character === "\r") {
      output += "\\r";
    } else if (character === "\t") {
      output += "\\t";
    } else {
      output += character;
    }
  }
  return `"${output}"`;
}

function unescapeJsonString(value: string) {
  const trimmed = value.trim();
  const candidate = trimmed.startsWith("\"") && trimmed.endsWith("\"") ? trimmed : quoteJsonEscapedInput(value);
  const parsed = JSON.parse(candidate);
  if (typeof parsed !== "string") throw new Error("Input must be a JSON string value.");
  return parsed;
}

const jsonEscapeExamples = [
  { labelKey: "jsonEscapeLogLineExample", fallbackLabel: "Log line", value: '{"message":"Hello Bob","path":"/tools/json-formatter"}' },
  { labelKey: "jsonEscapeMultilineExample", fallbackLabel: "Multiline text", value: "Line 1\nLine 2\tTabbed\nQuote: \"Bob\"" },
  { labelKey: "jsonEscapeWindowsPathExample", fallbackLabel: "Windows path", value: "C:\\temp\\bob\\payload.json" },
];

function JsonEscapeTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState(jsonEscapeExamples[0].value);
  const [mode, setMode] = React.useState("escape");
  const result = React.useMemo(() => {
    try {
      return { error: "", value: mode === "escape" ? escapeJsonString(input) : unescapeJsonString(input) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "JSON string transform failed.", value: "" };
    }
  }, [input, mode]);
  const outputValue = result.value;
  const warnings = [
    mode === "unescape" && !input.trim().startsWith("\"") ? ui(dictionary, "jsonUnescapeQuoteWarning", "Unescape mode treats unquoted input as a JSON string value. Wrap copied JSON string literals in quotes when possible.") : "",
    /\\{3,}/.test(input) ? ui(dictionary, "jsonEscapeBackslashWarning", "The input already contains repeated backslashes. Confirm it is not already escaped before copying.") : "",
    mode === "escape" && /\r?\n|\t/.test(input) ? ui(dictionary, "jsonEscapeControlWarning", "Line breaks and tabs will be escaped for transport. Confirm the target expects literal escape sequences.") : "",
    mode === "escape" && /["']/.test(input) ? ui(dictionary, "jsonEscapeQuoteWarning", "Quotes are present. Check whether the output is going into a JSON string, JavaScript string, or shell command.") : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4" data-json-escape-tool>
      <div className="space-y-2" data-json-escape-examples>
        <p className="text-sm font-medium">{ui(dictionary, "jsonEscapeExamples", "JSON string examples")}</p>
        <div className="flex flex-wrap gap-2">
          {jsonEscapeExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "jsonStringInput", "JSON string input")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "mode", "Mode")}</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="escape">{ui(dictionary, "escapeJsonString", "Escape JSON string")}</option>
            <option value="unescape">{ui(dictionary, "unescapeJsonString", "Unescape JSON string")}</option>
          </Select>
        </label>
      </div>
      <div data-json-escape-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(byteLength(input)) },
            { label: ui(dictionary, "characters", "Characters"), value: String(input.length) },
            { label: ui(dictionary, "escapedLength", "Escaped length"), value: result.error ? "—" : String(outputValue.length) },
            { label: ui(dictionary, "lineBreaks", "Line breaks"), value: String((input.match(/\r?\n/g) ?? []).length) },
          ]}
        />
      </div>
      <div data-json-escape-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "jsonEscapeNoWarnings", "String is ready to copy for the selected mode.")} />
      </div>
      {result.error ? <ErrorAlert title={ui(dictionary, "transformError", "Transform error")} message={result.error} /> : <ResultBlock title={ui(dictionary, "output", "Output")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = globalThis.atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const jwtDecoderExamples = [
  {
    labelKey: "jwtActiveExample",
    fallback: "Session token",
    value:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImlzcyI6Imh0dHBzOi8vYXV0aC5leGFtcGxlLmNvbSIsImF1ZCI6ImJvYm9iLWFwaSIsInNjb3BlIjoicmVhZDp0b29scyB3cml0ZTpub3RlcyIsImlhdCI6MTc4MTA0OTYwMCwibmJmIjoxNzgxMDQ5NjAwLCJleHAiOjQxMDI0NDQ4MDB9.signature",
  },
  {
    labelKey: "jwtExpiredExample",
    fallback: "Expired token",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImlzcyI6ImxlZ2FjeS1hcHAiLCJhdWQiOiJhcGkiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMn0.signature",
  },
  {
    labelKey: "jwtUnsignedExample",
    fallback: "Unsigned dev token",
    value: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJkZXYiLCJzdWIiOiJsb2NhbC10ZXN0Iiwic2NvcGUiOlsiZGVidWciLCJwcmV2aWV3Il19.signature",
  },
];

function getRecordValue(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getNumericClaim(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function formatJwtDate(seconds: number | null) {
  if (seconds === null) return "—";
  return `${new Date(seconds * 1000).toISOString()} (${seconds})`;
}

function formatJwtDuration(totalSeconds: number | null, dictionary: ClientDictionary) {
  if (totalSeconds === null || !Number.isFinite(totalSeconds)) return "—";
  const absolute = Math.max(0, Math.trunc(totalSeconds));
  if (absolute < 60) return `${absolute}${ui(dictionary, "jwtSecondUnit", "s")}`;
  const minutes = Math.floor(absolute / 60);
  if (minutes < 60) return `${minutes}${ui(dictionary, "jwtMinuteUnit", "m")}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}${ui(dictionary, "jwtHourUnit", "h")} ${minutes % 60}${ui(dictionary, "jwtMinuteUnit", "m")}`;
  const days = Math.floor(hours / 24);
  return `${days}${ui(dictionary, "jwtDayUnit", "d")} ${hours % 24}${ui(dictionary, "jwtHourUnit", "h")}`;
}

function formatJwtRelative(seconds: number | null, nowSeconds: number, dictionary: ClientDictionary) {
  if (seconds === null) return "—";
  const delta = seconds - nowSeconds;
  if (Math.abs(delta) < 60) return ui(dictionary, "jwtNow", "now");
  const duration = formatJwtDuration(Math.abs(delta), dictionary);
  const template = delta > 0 ? ui(dictionary, "jwtInRelative", "in {duration}") : ui(dictionary, "jwtAgoRelative", "{duration} ago");
  return template.replace("{duration}", duration);
}

function getJwtStatus(payload: Record<string, unknown>, nowSeconds: number, dictionary: ClientDictionary) {
  const exp = getNumericClaim(payload, "exp");
  const nbf = getNumericClaim(payload, "nbf");
  if (nbf !== null && nowSeconds < nbf) return ui(dictionary, "notActiveYet", "Not active yet");
  if (exp !== null && nowSeconds >= exp) return ui(dictionary, "expiredTokenStatus", "Expired");
  if (exp === null) return ui(dictionary, "noExpiration", "No expiration");
  return ui(dictionary, "activeToken", "Active");
}

function getJwtTimeWindow(payload: Record<string, unknown>, nowSeconds: number, dictionary: ClientDictionary) {
  const issuedAt = getNumericClaim(payload, "iat");
  const notBefore = getNumericClaim(payload, "nbf");
  const expiresAt = getNumericClaim(payload, "exp");
  const lifetime = issuedAt !== null && expiresAt !== null && expiresAt >= issuedAt ? expiresAt - issuedAt : null;
  return [
    { label: ui(dictionary, "issuedAge", "Issued age"), value: formatJwtRelative(issuedAt, nowSeconds, dictionary) },
    { label: ui(dictionary, "validAfter", "Valid after"), value: formatJwtRelative(notBefore, nowSeconds, dictionary) },
    { label: ui(dictionary, "expiresIn", "Expires in"), value: formatJwtRelative(expiresAt, nowSeconds, dictionary) },
    { label: ui(dictionary, "tokenLifetime", "Token lifetime"), value: formatJwtDuration(lifetime, dictionary) },
  ];
}

function normalizeJwtExpectedList(value: string) {
  return value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeJwtClaimList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return normalizeJwtExpectedList(value);
  if (value === null || value === undefined) return [];
  return [String(value)];
}

function getJwtExpectedChecks(
  payload: Record<string, unknown>,
  expected: { issuer: string; audience: string; scope: string },
  dictionary: ClientDictionary,
) {
  const issuerExpected = expected.issuer.trim();
  const audienceExpected = normalizeJwtExpectedList(expected.audience);
  const scopeExpected = normalizeJwtExpectedList(expected.scope);
  const issuerActual = getRecordValue(payload, "iss");
  const audienceActualList = normalizeJwtClaimList(payload.aud);
  const scopeActualList = normalizeJwtClaimList(payload.scope);
  const checks = [
    {
      key: "iss",
      label: ui(dictionary, "issuer", "Issuer"),
      expected: issuerExpected,
      actual: issuerActual,
      configured: Boolean(issuerExpected),
      matches: issuerExpected ? issuerActual === issuerExpected : false,
    },
    {
      key: "aud",
      label: ui(dictionary, "audience", "Audience"),
      expected: audienceExpected.join(", "),
      actual: audienceActualList.join(", ") || "—",
      configured: audienceExpected.length > 0,
      matches: audienceExpected.length > 0 ? audienceExpected.every((item) => audienceActualList.includes(item)) : false,
    },
    {
      key: "scope",
      label: ui(dictionary, "scope", "Scope"),
      expected: scopeExpected.join(", "),
      actual: scopeActualList.join(", ") || "—",
      configured: scopeExpected.length > 0,
      matches: scopeExpected.length > 0 ? scopeExpected.every((item) => scopeActualList.includes(item)) : false,
    },
  ];
  const configuredChecks = checks.filter((check) => check.configured);
  return {
    checks,
    configuredCount: configuredChecks.length,
    matchedCount: configuredChecks.filter((check) => check.matches).length,
  };
}

const registeredJwtClaims = new Set(["iss", "sub", "aud", "exp", "nbf", "iat", "jti"]);

function getJwtClaimType(value: unknown) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function getJwtClaimCategoryKey(key: string) {
  if (registeredJwtClaims.has(key)) return "registeredClaim";
  if (key.includes(":") || key.includes("/") || key.includes(".")) return "publicClaim";
  return "privateClaim";
}

function getJwtClaimInspector(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => ({
      key,
      categoryKey: getJwtClaimCategoryKey(key),
      type: getJwtClaimType(value),
      preview: getRecordValue(payload, key),
    }));
}

function getJwtSensitiveReasonKey(key: string) {
  if (/password|secret|credential|cookie|session|refresh|access[_-]?token|id[_-]?token|api[_-]?key|private[_-]?key|authorization|auth/i.test(key)) return "jwtSensitiveSecret";
  if (/^(email|email_verified|name|given_name|family_name|phone|phone_number|address|ip|client_ip|device_id)$/i.test(key)) return "jwtSensitiveIdentity";
  if (/^(sub|uid|user_id|tenant|tenant_id|account|account_id|org|organization|jti)$/i.test(key)) return "jwtSensitiveIdentifier";
  return "";
}

function redactJwtPayloadValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => redactJwtPayloadValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => {
        const reasonKey = getJwtSensitiveReasonKey(key);
        return [key, reasonKey ? "[redacted]" : redactJwtPayloadValue(nestedValue)];
      }),
    );
  }
  return "[redacted]";
}

function getJwtRedaction(payload: Record<string, unknown>) {
  const sensitiveClaims = Object.entries(payload)
    .map(([key, value]) => ({
      key,
      type: getJwtClaimType(value),
      reasonKey: getJwtSensitiveReasonKey(key),
      preview: getRecordValue(payload, key),
    }))
    .filter((claim) => Boolean(claim.reasonKey));
  const redactedPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      const reasonKey = getJwtSensitiveReasonKey(key);
      return [key, reasonKey ? redactJwtPayloadValue(value) : value];
    }),
  );
  return {
    sensitiveClaims,
    redactedPayload: JSON.stringify(redactedPayload, null, 2),
  };
}

function buildJwtAuthReport({
  checkedAt,
  summary,
  claims,
  timeWindow,
  expectedChecks,
  warningKeys,
  dictionary,
}: {
  checkedAt: string;
  summary: {
    algorithm: string;
    type: string;
    status: string;
    expiresAt: string;
    claimCount: number;
    sensitiveClaimCount: number;
    expectedMatchCount: string;
  };
  claims: Array<{ label: string; value: string }>;
  timeWindow: Array<{ label: string; value: string }>;
  expectedChecks: ReturnType<typeof getJwtExpectedChecks>;
  warningKeys: string[];
  dictionary: ClientDictionary;
}) {
  const signatureState = claims.find((claim) => claim.label === ui(dictionary, "signature", "Signature"))?.value ?? "—";
  const expectedRows = expectedChecks.checks.map((check) => ({
    label: check.label,
    expected: check.expected || "—",
    actual: check.actual || "—",
    status: ui(
      dictionary,
      check.configured ? (check.matches ? "jwtExpectationMatch" : "jwtExpectationMismatch") : "jwtExpectationNotSet",
      check.configured ? (check.matches ? "Match" : "Mismatch") : "Not set",
    ),
  }));
  const reviewNotes = Array.from(new Set(warningKeys.map((key) => ui(dictionary, key, key))));
  const checklist = [
    ui(dictionary, "jwtChecklistSignature", "Do not treat decoded JWT content as signature verification."),
    ui(dictionary, "jwtChecklistExpectedClaims", "Verify issuer, audience, and scope against the target API or auth gateway."),
    ui(dictionary, "jwtChecklistRedaction", "Use the redacted payload before sharing a ticket, document, or chat message."),
    ui(dictionary, "jwtChecklistPrivateHeader", "Keep the full Authorization header in private logs or secure debugging tools only."),
    ui(dictionary, "jwtChecklistReproduce", "Reproduce the failing request against the intended environment before changing auth rules."),
  ];
  const markdown = [
    `# ${ui(dictionary, "jwtAuthReport", "JWT auth report")}`,
    "",
    `## ${ui(dictionary, "jwtReportTokenSummary", "Token summary")}`,
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "algorithm", "Algorithm")}: ${summary.algorithm}`,
    `- ${ui(dictionary, "tokenType", "Token type")}: ${summary.type}`,
    `- ${ui(dictionary, "tokenStatus", "Token status")}: ${summary.status}`,
    `- ${ui(dictionary, "expiresAt", "Expires at")}: ${summary.expiresAt}`,
    `- ${ui(dictionary, "jwtExpectedClaimsConfigured", "Expected matches")}: ${summary.expectedMatchCount}`,
    `- ${ui(dictionary, "sensitiveClaimCount", "Sensitive claims")}: ${summary.sensitiveClaimCount}/${summary.claimCount}`,
    `- ${ui(dictionary, "signature", "Signature")}: ${signatureState}`,
    "",
    `## ${ui(dictionary, "jwtClaims", "JWT claims")}`,
    ...claims.map((claim) => `- ${claim.label}: ${claim.value}`),
    "",
    `## ${ui(dictionary, "jwtExpectedChecks", "Expected claim checks")}`,
    ...(expectedRows.length
      ? expectedRows.map((row) => `- ${row.label}: ${row.status} (${ui(dictionary, "expectedClaim", "Expected")}: ${row.expected}; ${ui(dictionary, "actualClaim", "Actual")}: ${row.actual})`)
      : [`- ${ui(dictionary, "jwtNoExpectedChecks", "No expected issuer, audience, or scope values were configured.")}`]),
    "",
    `## ${ui(dictionary, "jwtTimeWindow", "JWT time window")}`,
    ...timeWindow.map((item) => `- ${item.label}: ${item.value}`),
    "",
    `## ${ui(dictionary, "jwtReportReviewNotes", "Review notes")}`,
    ...(reviewNotes.length ? reviewNotes.map((note) => `- ${note}`) : [`- ${ui(dictionary, "jwtReportNoWarnings", "No JWT review warnings were detected.")}`]),
    "",
    `## ${ui(dictionary, "jwtSafeHandoffChecklist", "Safe handoff checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    checklist,
    metrics: [
      { label: ui(dictionary, "tokenStatus", "Token status"), value: summary.status },
      { label: ui(dictionary, "algorithm", "Algorithm"), value: summary.algorithm },
      { label: ui(dictionary, "jwtExpectedClaimsConfigured", "Expected matches"), value: summary.expectedMatchCount },
      { label: ui(dictionary, "sensitiveClaimCount", "Sensitive claims"), value: `${summary.sensitiveClaimCount}/${summary.claimCount}` },
      { label: ui(dictionary, "signature", "Signature"), value: signatureState },
    ],
  };
}

function JwtDecoderTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [token, setToken] = React.useState(jwtDecoderExamples[0]!.value);
  const [expectedIssuer, setExpectedIssuer] = React.useState("https://auth.example.com");
  const [expectedAudience, setExpectedAudience] = React.useState("bobob-api");
  const [expectedScope, setExpectedScope] = React.useState("read:tools");
  const result = React.useMemo(() => {
    try {
      const [header, payload, signature] = token.trim().split(".");
      if (!header || !payload) throw new Error("JWT must contain header and payload segments.");
      const headerObject = JSON.parse(decodeBase64Url(header)) as Record<string, unknown>;
      const payloadObject = JSON.parse(decodeBase64Url(payload)) as Record<string, unknown>;
      const nowSeconds = Math.floor(Date.now() / 1000);
      const expiresAt = getNumericClaim(payloadObject, "exp");
      const notBefore = getNumericClaim(payloadObject, "nbf");
      const redaction = getJwtRedaction(payloadObject);
      const expectedChecks = getJwtExpectedChecks(payloadObject, { issuer: expectedIssuer, audience: expectedAudience, scope: expectedScope }, dictionary);
      const warningKeys = [
        "signatureNotVerified",
        !signature ? "missingSignatureWarning" : "",
        getRecordValue(headerObject, "alg").toLowerCase() === "none" ? "unsignedAlgorithmWarning" : "",
        expiresAt === null ? "missingExpirationWarning" : "",
        expiresAt !== null && expiresAt > nowSeconds && expiresAt - nowSeconds < 300 ? "jwtExpiresSoonWarning" : "",
        notBefore !== null && notBefore > nowSeconds ? "jwtNotBeforeFutureWarning" : "",
        redaction.sensitiveClaims.length ? "jwtSensitiveClaimWarning" : "",
        expectedChecks.configuredCount > expectedChecks.matchedCount ? "jwtExpectedClaimMismatchWarning" : "",
      ].filter(Boolean);
      const summary = {
        algorithm: getRecordValue(headerObject, "alg"),
        type: getRecordValue(headerObject, "typ"),
        status: getJwtStatus(payloadObject, nowSeconds, dictionary),
        expiresAt: formatJwtDate(expiresAt),
        claimCount: Object.keys(payloadObject).length,
        sensitiveClaimCount: redaction.sensitiveClaims.length,
        expectedMatchCount: expectedChecks.configuredCount ? `${expectedChecks.matchedCount}/${expectedChecks.configuredCount}` : ui(dictionary, "jwtExpectationNotSet", "Not set"),
      };
      const claims = [
        { label: ui(dictionary, "subject", "Subject"), value: getRecordValue(payloadObject, "sub") },
        { label: ui(dictionary, "issuer", "Issuer"), value: getRecordValue(payloadObject, "iss") },
        { label: ui(dictionary, "audience", "Audience"), value: getRecordValue(payloadObject, "aud") },
        { label: ui(dictionary, "scope", "Scope"), value: getRecordValue(payloadObject, "scope") },
        { label: ui(dictionary, "issuedAt", "Issued at"), value: formatJwtDate(getNumericClaim(payloadObject, "iat")) },
        { label: ui(dictionary, "notBefore", "Not before"), value: formatJwtDate(getNumericClaim(payloadObject, "nbf")) },
        { label: ui(dictionary, "expiresAt", "Expires at"), value: formatJwtDate(getNumericClaim(payloadObject, "exp")) },
        { label: ui(dictionary, "signature", "Signature"), value: signature ? ui(dictionary, "present", "Present") : ui(dictionary, "missing", "Missing") },
      ];
      const timeWindow = getJwtTimeWindow(payloadObject, nowSeconds, dictionary);
      const authReport = buildJwtAuthReport({
        checkedAt: new Date(nowSeconds * 1000).toISOString(),
        summary,
        claims,
        timeWindow,
        expectedChecks,
        warningKeys,
        dictionary,
      });

      return {
        error: "",
        header: JSON.stringify(headerObject, null, 2),
        payload: JSON.stringify(payloadObject, null, 2),
        redactedPayload: redaction.redactedPayload,
        authorizationHeader: `Authorization: Bearer ${token.trim()}`,
        summary,
        claims,
        claimInspector: getJwtClaimInspector(payloadObject),
        sensitiveClaims: redaction.sensitiveClaims,
        timeWindow,
        expectedChecks,
        warningKeys,
        authReport,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid token", header: "", payload: "", redactedPayload: "", authorizationHeader: "", summary: null, claims: [], claimInspector: [], sensitiveClaims: [], timeWindow: [], expectedChecks: { checks: [], configuredCount: 0, matchedCount: 0 }, warningKeys: [], authReport: null };
    }
  }, [dictionary, expectedAudience, expectedIssuer, expectedScope, token]);

  return (
    <div className="space-y-4">
      <div className="space-y-2" data-jwt-examples>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jwtExamples", "JWT examples")}</p>
        <div className="flex flex-wrap gap-2">
          {jwtDecoderExamples.map((example) => (
            <Button key={example.labelKey} type="button" variant="outline" size="sm" onClick={() => setToken(example.value)}>
              {ui(dictionary, example.labelKey, example.fallback)}
            </Button>
          ))}
        </div>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">JWT</span>
        <Textarea value={token} onChange={(event) => setToken(event.target.value)} className="min-h-28" />
      </label>
      <section className="rounded-md border bg-card p-3" data-jwt-expected-claims>
        <p className="text-sm font-medium">{ui(dictionary, "jwtExpectedClaims", "Expected claim check")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jwtExpectedClaimsDescription", "Compare issuer, audience, and scope against the values your API expects. This is a local debug check, not signature verification.")}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{ui(dictionary, "expectedIssuer", "Expected issuer")}</span>
            <Input value={expectedIssuer} onChange={(event) => setExpectedIssuer(event.target.value)} placeholder="https://auth.example.com" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{ui(dictionary, "expectedAudience", "Expected audience")}</span>
            <Input value={expectedAudience} onChange={(event) => setExpectedAudience(event.target.value)} placeholder="bobob-api" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{ui(dictionary, "expectedScope", "Expected scope")}</span>
            <Input value={expectedScope} onChange={(event) => setExpectedScope(event.target.value)} placeholder="read:tools write:notes" />
          </label>
        </div>
        {result.expectedChecks.checks.length ? (
          <div className="mt-3 grid gap-2">
            {result.expectedChecks.checks.map((check) => (
              <div key={check.key} className="grid min-w-0 gap-2 rounded-md bg-muted px-3 py-2 text-xs md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)_7rem] md:items-center">
                <span className="font-medium">{check.label}</span>
                <span className="min-w-0 break-words text-muted-foreground">
                  {ui(dictionary, "expectedClaim", "Expected")}: {check.expected || "—"}
                </span>
                <span className="min-w-0 break-words text-muted-foreground">
                  {ui(dictionary, "actualClaim", "Actual")}: {check.actual}
                </span>
                <Badge className={cn("w-fit", check.configured && !check.matches ? "border-destructive/40 bg-destructive/10 text-destructive" : "bg-background")}>
                  {ui(dictionary, check.configured ? (check.matches ? "jwtExpectationMatch" : "jwtExpectationMismatch") : "jwtExpectationNotSet", check.configured ? (check.matches ? "Match" : "Mismatch") : "Not set")}
                </Badge>
              </div>
            ))}
          </div>
        ) : null}
      </section>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "decodeError", "Decode error")} message={result.error} />
      ) : (
        <div className="space-y-4" data-jwt-result-details>
          {result.summary ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: ui(dictionary, "algorithm", "Algorithm"), value: result.summary.algorithm },
                { label: ui(dictionary, "tokenType", "Token type"), value: result.summary.type },
                { label: ui(dictionary, "tokenStatus", "Token status"), value: result.summary.status },
                { label: ui(dictionary, "jwtExpectedClaimsConfigured", "Expected matches"), value: result.summary.expectedMatchCount },
                { label: ui(dictionary, "sensitiveClaimCount", "Sensitive claims"), value: `${result.summary.sensitiveClaimCount}/${result.summary.claimCount}` },
              ].map((item) => (
                <div key={item.label} className="rounded-md border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 break-words text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
          <section className="rounded-md border bg-card p-3" data-jwt-copy-actions>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{ui(dictionary, "jwtCopyActions", "Copy actions")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "authenticationHeader", "Copy the bearer header or decoded payload without reselecting text.")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.authorizationHeader)}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyAuthorizationHeader", "Authorization header")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(token.trim())}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyJwtToken", "Token")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.payload)}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyJwtPayload", "Payload")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.redactedPayload)}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyRedactedPayload", "Redacted payload")}
                </Button>
              </div>
            </div>
          </section>
          {result.authReport ? (
            <section className="rounded-md border bg-card" data-jwt-auth-report>
              <div className="border-b p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{ui(dictionary, "jwtAuthReport", "JWT auth report")}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jwtAuthReportDescription", "Copy a compact token status, expected-claim, redaction, and handoff note for auth debugging.")}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.authReport.markdown)} data-jwt-auth-report-copy>
                    <Copy className="h-4 w-4" />
                    {ui(dictionary, "copyJwtAuthReport", "Copy report")}
                  </Button>
                </div>
              </div>
              <div className="space-y-3 p-3">
                <ToolMetricGrid items={result.authReport.metrics} />
                <ToolWarningList title={ui(dictionary, "jwtReportReviewNotes", "Review notes")} warnings={result.authReport.reviewNotes} emptyLabel={ui(dictionary, "jwtReportNoWarnings", "No JWT review warnings were detected.")} />
                <div className="rounded-md border bg-background p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jwtSafeHandoffChecklist", "Safe handoff checklist")}</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {result.authReport.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-jwt-auth-report-preview>
                  <code>{result.authReport.markdown}</code>
                </pre>
              </div>
            </section>
          ) : null}
          <section className="rounded-md border bg-card p-3" data-jwt-time-window>
            <p className="text-sm font-medium">{ui(dictionary, "jwtTimeWindow", "JWT time window")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jwtTimeWindowDescription", "Compare iat, nbf, exp, and lifetime against the current browser time before using the token.")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {result.timeWindow.map((item) => (
                <div key={item.label} className="min-w-0 rounded-md bg-muted px-3 py-2 text-xs">
                  <p className="text-muted-foreground">{item.label}</p>
                  <p className="mt-1 break-words font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border bg-card p-3" data-jwt-claim-inspector>
            <p className="text-sm font-medium">{ui(dictionary, "jwtClaimInspector", "Claim inspector")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jwtClaimInspectorDescription", "Classify registered, public, and private claims before sharing the decoded payload.")}</p>
            <div className="mt-3 grid gap-2">
              {result.claimInspector.map((claim) => (
                <div key={claim.key} className="grid min-w-0 gap-2 rounded-md bg-muted px-3 py-2 text-xs md:grid-cols-[10rem_8rem_6rem_minmax(0,1fr)] md:items-center">
                  <code className="min-w-0 overflow-x-auto whitespace-nowrap rounded bg-background px-2 py-1">{claim.key}</code>
                  <Badge className="w-fit">{ui(dictionary, claim.categoryKey, claim.categoryKey)}</Badge>
                  <span className="text-muted-foreground">{claim.type}</span>
                  <span className="min-w-0 truncate text-muted-foreground">{claim.preview}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border bg-card p-3" data-jwt-redaction>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{ui(dictionary, "jwtRedactionReview", "Redaction review")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jwtRedactionDescription", "Find identity and secret-like claims before sharing a decoded payload in tickets, docs, or chat.")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.redactedPayload)}>
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copyRedactedPayload", "Redacted payload")}
              </Button>
            </div>
            {result.sensitiveClaims.length ? (
              <div className="mt-3 grid gap-2">
                {result.sensitiveClaims.map((claim) => (
                  <div key={claim.key} className="grid min-w-0 gap-2 rounded-md bg-muted px-3 py-2 text-xs md:grid-cols-[10rem_9rem_6rem_minmax(0,1fr)] md:items-center">
                    <code className="min-w-0 overflow-x-auto whitespace-nowrap rounded bg-background px-2 py-1">{claim.key}</code>
                    <Badge className="w-fit">{ui(dictionary, claim.reasonKey, claim.reasonKey)}</Badge>
                    <span className="text-muted-foreground">{claim.type}</span>
                    <span className="min-w-0 truncate text-muted-foreground">{claim.preview}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{ui(dictionary, "noSensitiveClaims", "No obvious identity or secret-like claims detected.")}</p>
            )}
            <div className="mt-3" data-jwt-redacted-preview>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "redactedPayloadPreview", "Redacted preview")}</p>
              <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
                <code>{result.redactedPayload}</code>
              </pre>
            </div>
          </section>
          <section className="rounded-md border bg-card p-3" data-jwt-claims>
            <p className="text-sm font-medium">{ui(dictionary, "jwtClaims", "JWT claims")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jwtClaimsDescription", "Review identity, issuer, audience, time claims, and signature state before using the token.")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {result.claims.map((claim) => (
                <div key={claim.label} className="min-w-0 rounded-md bg-muted px-3 py-2 text-xs">
                  <span className="font-medium">{claim.label}</span>
                  <span className="mx-2 text-muted-foreground">:</span>
                  <span className="break-words text-muted-foreground">{claim.value}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-md border bg-card p-3" data-jwt-warnings>
            <p className="text-sm font-medium">{ui(dictionary, "jwtReviewNotes", "Review notes")}</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {result.warningKeys.map((key) => (
                <li key={key}>- {ui(dictionary, key, key)}</li>
              ))}
            </ul>
          </section>
          <ResultNextActions signals={["jwt-decoded"]} dictionary={dictionary} />
          <Tabs
            tabs={[
              { value: "header", label: ui(dictionary, "header", "Header"), content: <ResultBlock title={ui(dictionary, "header", "Header")} value={result.header} dictionary={dictionary} /> },
              { value: "payload", label: ui(dictionary, "payload", "Payload"), content: <ResultBlock title={ui(dictionary, "payload", "Payload")} value={result.payload} dictionary={dictionary} /> },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function encodeUtf8Base64(value: string) {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
  return globalThis.btoa(binary);
}

function decodeUtf8Base64(value: string) {
  const binary = globalThis.atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeBase64Bytes(value: string) {
  const binary = globalThis.atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

const base64Examples = [
  { labelKey: "base64PlainTextExample", fallback: "Plain text", value: "hello world", mode: "encode" },
  { labelKey: "base64JwtPayloadExample", fallback: "JWT payload", value: "eyJzdWIiOiIxMjMifQ==", mode: "decode" },
  { labelKey: "base64UrlSafeExample", fallback: "URL-safe token", value: "dG9rZW4_Ky8", mode: "decode" },
  { labelKey: "base64PngDataUrlExample", fallback: "PNG data URL", value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6Xr5eQAAAAASUVORK5CYII=", mode: "decode" },
];

function normalizeBase64Input(value: string) {
  const compact = (parseImageDataUrl(value)?.base64 ?? value).trim().replace(/\s+/g, "");
  const urlSafe = /[-_]/.test(compact);
  const normalized = compact.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) throw new Error("Input contains characters outside the Base64 alphabet.");
  const remainder = normalized.length % 4;
  if (remainder === 1) throw new Error("Base64 length is invalid. Check for missing or extra characters.");
  const padded = normalized + (remainder ? "=".repeat(4 - remainder) : "");
  return {
    compact,
    normalized,
    padded,
    urlSafe,
    missingPadding: padded.length - normalized.length,
    paddingCount: (compact.match(/=/g) ?? []).length,
  };
}

function encodeUrlSafeBase64(value: string) {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getTextKind(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "empty";
  try {
    JSON.parse(trimmed);
    return "json";
  } catch {
    return /^[\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]*$/.test(value) ? "text" : "binary";
  }
}

function formatJsonTextPreview(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return "";
  }
}

function countJsonKeys(value: string) {
  try {
    const parsed = JSON.parse(value);
    let count = 0;
    const visit = (node: unknown) => {
      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }
      if (node && typeof node === "object") {
        const entries = Object.entries(node);
        count += entries.length;
        entries.forEach(([, child]) => visit(child));
      }
    };
    visit(parsed);
    return count;
  } catch {
    return 0;
  }
}

function countControlCharacters(value: string) {
  return (value.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g) ?? []).length;
}

function parseImageDataUrl(value: string) {
  const match = value.trim().match(/^data:(image\/(?:png|jpe?g|gif|webp|svg\+xml));base64,([A-Za-z0-9+/=_-]+)$/i);
  if (!match?.[1] || !match[2]) return null;
  return { mime: match[1].toLowerCase().replace("image/jpg", "image/jpeg"), base64: match[2], dataUrl: value.trim() };
}

function detectImageMime(bytes: Uint8Array, decodedText: string) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  if (/^\s*<svg[\s>]/i.test(decodedText)) return "image/svg+xml";
  return "";
}

function containsSecretLikeText(value: string) {
  return /(?:password|passwd|secret|token|api[_-]?key|authorization|cookie|session|bearer\s+[a-z0-9._-]+)/i.test(value);
}

function looksLikeJwtBase64Segment(encoded: string, decoded: string) {
  const compact = encoded.trim().replace(/\s+/g, "").replace(/=+$/g, "");
  return /^[A-Za-z0-9_-]+$/.test(compact) && getTextKind(decoded) === "json" && /"(?:sub|iss|aud|exp|iat|nbf|scope)"\s*:/.test(decoded);
}

function getBase64ShapeKey(value: string, context: { urlSafe?: boolean; jwtSegment?: boolean; image?: boolean }) {
  if (context.image) return "base64ImageShape";
  if (context.jwtSegment) return "base64JwtSegmentShape";
  const kind = getTextKind(value);
  if (kind === "json") return "base64JsonShape";
  if (kind === "binary") return "base64BinaryShape";
  if (kind === "empty") return "base64EmptyShape";
  if (context.urlSafe) return "base64UrlSafeShape";
  return "base64TextShape";
}

type Base64ReportStats = {
  inputBytes: number;
  outputChars: number;
  padding: number;
  variant: string;
  outputKind: string;
};

type Base64ReportDiagnostics = {
  shapeKey: string;
  lineCount: number;
  jsonKeyCount: number;
  controlCharacters: number;
};

function buildBase64PayloadReport({
  mode,
  stats,
  diagnostics,
  warnings,
  imagePreview,
  dictionary,
  checkedAt,
}: {
  mode: string;
  stats: Base64ReportStats;
  diagnostics: Base64ReportDiagnostics;
  warnings: string[];
  imagePreview: { mime: string; bytes: number; dataUrl: string } | null;
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const reviewNotes = warnings.length ? warnings.map((key) => ui(dictionary, key, key)) : [ui(dictionary, "base64PayloadReportNoWarnings", "No obvious Base64 issues detected. Still redact secrets before sharing.")];
  const detectedContent = ui(dictionary, diagnostics.shapeKey, diagnostics.shapeKey);
  const checklist = [
    ui(dictionary, "base64PayloadChecklistRedact", "Redact tokens, cookies, passwords, and customer identifiers before sharing decoded text."),
    ui(dictionary, "base64PayloadChecklistVariant", "Confirm whether the target expects standard Base64 or URL-safe Base64 before copying."),
    ui(dictionary, "base64PayloadChecklistJson", "If decoded content is JSON, inspect it in JSON Formatter before attaching it to a ticket."),
    ui(dictionary, "base64PayloadChecklistJwt", "If decoded content looks like a JWT segment, use JWT Decoder for token context."),
    ui(dictionary, "base64PayloadChecklistBinary", "If the output is binary or an image, share the data URL or file preview instead of raw text."),
  ];
  const metrics = [
    { label: ui(dictionary, "mode", "Mode"), value: mode === "encode" ? ui(dictionary, "encodeBase64", "Encode UTF-8 to Base64") : ui(dictionary, "decodeBase64", "Decode Base64 to UTF-8") },
    { label: ui(dictionary, "base64DetectedContent", "Detected content"), value: detectedContent },
    { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(stats.inputBytes) },
    { label: ui(dictionary, "outputCharacters", "Output characters"), value: String(stats.outputChars) },
    { label: ui(dictionary, "paddingCharacters", "Padding characters"), value: String(stats.padding) },
    { label: ui(dictionary, "base64JsonKeys", "JSON keys"), value: String(diagnostics.jsonKeyCount) },
  ];
  const imageLines = imagePreview
    ? [
        `- ${ui(dictionary, "base64PayloadImageMime", "Image MIME")}: ${imagePreview.mime}`,
        `- ${ui(dictionary, "base64PayloadImageBytes", "Image bytes")}: ${imagePreview.bytes}`,
      ]
    : [];
  const markdown = [
    `# ${ui(dictionary, "base64PayloadReport", "Base64 payload report")}`,
    "",
    `- ${ui(dictionary, "base64PayloadReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "mode", "Mode")}: ${mode === "encode" ? ui(dictionary, "encodeBase64", "Encode UTF-8 to Base64") : ui(dictionary, "decodeBase64", "Decode Base64 to UTF-8")}`,
    `- ${ui(dictionary, "base64Variant", "Base64 variant")}: ${stats.variant}`,
    `- ${ui(dictionary, "base64DetectedContent", "Detected content")}: ${detectedContent}`,
    `- ${ui(dictionary, "inputBytes", "Input bytes")}: ${stats.inputBytes}`,
    `- ${ui(dictionary, "outputCharacters", "Output characters")}: ${stats.outputChars}`,
    `- ${ui(dictionary, "paddingCharacters", "Padding characters")}: ${stats.padding}`,
    `- ${ui(dictionary, "base64TextLines", "Text lines")}: ${diagnostics.lineCount}`,
    `- ${ui(dictionary, "base64JsonKeys", "JSON keys")}: ${diagnostics.jsonKeyCount}`,
    `- ${ui(dictionary, "base64ControlCharacters", "Control characters")}: ${diagnostics.controlCharacters}`,
    ...imageLines,
    "",
    `## ${ui(dictionary, "base64PayloadReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "base64PayloadSafeHandoffChecklist", "Safe handoff checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function UrlEncoderTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel={ui(dictionary, "textOrUrlComponent", "Text or URL component")}
      defaultInput="https://www.bobob.app/tools/cron-generator?q=every 5 minutes"
      modes={[
        { value: "encode", label: ui(dictionary, "encode", "Encode"), transform: encodeURIComponent },
        { value: "decode", label: ui(dictionary, "decode", "Decode"), transform: decodeURIComponent },
      ]}
    />
  );
}

function Base64Tool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("hello world");
  const [mode, setMode] = React.useState("encode");
  const result = React.useMemo(() => {
    try {
      if (mode === "encode") {
        const value = encodeUtf8Base64(input);
        const urlSafe = encodeUrlSafeBase64(value);
        const warningKeys = [
          input.trim().startsWith("{") ? "base64JsonWarning" : "",
          containsSecretLikeText(input) ? "base64SecretLikeWarning" : "",
          new TextEncoder().encode(input).length > 4096 ? "base64LargePayloadWarning" : "",
        ].filter(Boolean);
        return {
          error: "",
          value,
          alternate: urlSafe,
          warnings: warningKeys,
          stats: {
            inputBytes: new TextEncoder().encode(input).length,
            outputChars: value.length,
            padding: (value.match(/=/g) ?? []).length,
            variant: ui(dictionary, "standardBase64", "Standard Base64"),
            outputKind: getTextKind(input),
          },
          diagnostics: {
            shapeKey: getBase64ShapeKey(input, { urlSafe: false }),
            lineCount: input ? input.split(/\r?\n/).length : 0,
            jsonKeyCount: countJsonKeys(input),
            controlCharacters: countControlCharacters(input),
          },
          jsonPreview: formatJsonTextPreview(input),
          imagePreview: null,
        };
      }
      const inputDataUrl = parseImageDataUrl(input);
      const normalized = normalizeBase64Input(input);
      const decoded = decodeUtf8Base64(normalized.padded);
      const bytes = decodeBase64Bytes(normalized.padded);
      const imageMime = inputDataUrl?.mime ?? detectImageMime(bytes, decoded);
      const imagePreview = imageMime
        ? {
            mime: imageMime,
            bytes: bytes.length,
            dataUrl: inputDataUrl?.dataUrl ?? `data:${imageMime};base64,${normalized.padded}`,
          }
        : null;
      const jwtSegment = looksLikeJwtBase64Segment(normalized.compact, decoded);
      const warnings = [
        normalized.urlSafe ? "base64UrlSafeWarning" : "",
        normalized.missingPadding ? "base64PaddingAddedWarning" : "",
        imagePreview ? "base64ImageWarning" : "",
        getTextKind(decoded) === "binary" ? "base64BinaryWarning" : "",
        getTextKind(decoded) === "json" ? "base64DecodedJsonWarning" : "",
        jwtSegment ? "base64JwtSegmentWarning" : "",
        containsSecretLikeText(decoded) ? "base64SecretLikeWarning" : "",
        new TextEncoder().encode(decoded).length > 4096 ? "base64LargePayloadWarning" : "",
        decoded.includes("\uFFFD") ? "base64Utf8ReplacementWarning" : "",
      ].filter(Boolean);
      return {
        error: "",
        value: decoded,
        alternate: normalized.padded,
        warnings,
        stats: {
          inputBytes: new TextEncoder().encode(input).length,
          outputChars: decoded.length,
          padding: normalized.paddingCount + normalized.missingPadding,
          variant: normalized.urlSafe ? ui(dictionary, "urlSafeBase64", "URL-safe Base64") : ui(dictionary, "standardBase64", "Standard Base64"),
          outputKind: getTextKind(decoded),
        },
        diagnostics: {
          shapeKey: getBase64ShapeKey(decoded, { urlSafe: normalized.urlSafe, jwtSegment, image: Boolean(imagePreview) }),
          lineCount: decoded ? decoded.split(/\r?\n/).length : 0,
          jsonKeyCount: countJsonKeys(decoded),
          controlCharacters: countControlCharacters(decoded),
        },
        jsonPreview: formatJsonTextPreview(decoded),
        imagePreview,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Invalid Base64 input",
        value: "",
        alternate: "",
        warnings: [],
        stats: null,
        diagnostics: null,
        jsonPreview: "",
        imagePreview: null,
      };
    }
  }, [dictionary, input, mode]);
  const base64NextActionSignals = React.useMemo<ResultNextActionSignal[]>(() => {
    if (result.error) return [];
    const warningKeys: string[] = result.warnings;
    if (result.imagePreview) return ["base64-image"];
    if (warningKeys.includes("base64JwtSegmentWarning") || result.diagnostics?.shapeKey.toLowerCase().includes("jwt")) return ["base64-jwt"];
    if (result.jsonPreview || (result.diagnostics?.jsonKeyCount ?? 0) > 0) return ["base64-json"];
    return [];
  }, [result]);
  const payloadReport = React.useMemo(() => {
    if (!result.stats || !result.diagnostics) return null;
    return buildBase64PayloadReport({
      mode,
      stats: result.stats,
      diagnostics: result.diagnostics,
      warnings: result.warnings,
      imagePreview: result.imagePreview,
      dictionary,
      checkedAt: ui(dictionary, "base64PayloadReportCopyTime", "Browser copy time"),
    });
  }, [dictionary, mode, result.diagnostics, result.imagePreview, result.stats, result.warnings]);

  return (
    <div className="space-y-4">
      <div className="space-y-2" data-base64-examples>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "base64Examples", "Base64 examples")}</p>
        <div className="flex flex-wrap gap-2">
          {base64Examples.map((example) => (
            <Button
              key={example.labelKey}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(example.value);
                setMode(example.mode);
              }}
            >
              {ui(dictionary, example.labelKey, example.fallback)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "textOrBase64", "Text or Base64")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-40" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "mode", "Mode")}</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="encode">{ui(dictionary, "encodeBase64", "Encode UTF-8 to Base64")}</option>
            <option value="decode">{ui(dictionary, "decodeBase64", "Decode Base64 to UTF-8")}</option>
          </Select>
        </label>
      </div>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "decodeError", "Decode error")} message={result.error} />
      ) : (
        <div className="space-y-4" data-base64-result-details>
          {result.stats ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(result.stats.inputBytes) },
                { label: ui(dictionary, "outputCharacters", "Output characters"), value: String(result.stats.outputChars) },
                { label: ui(dictionary, "paddingCharacters", "Padding characters"), value: String(result.stats.padding) },
                { label: ui(dictionary, "base64Variant", "Base64 variant"), value: result.stats.variant },
              ].map((item) => (
                <div key={item.label} className="rounded-md border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 break-words text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
          <section className="rounded-md border bg-card p-3" data-base64-variants>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{mode === "encode" ? ui(dictionary, "base64OutputVariants", "Output variants") : ui(dictionary, "base64NormalizedInput", "Normalized input")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {mode === "encode"
                    ? ui(dictionary, "base64OutputVariantsDescription", "Copy the standard value for headers and storage, or URL-safe value for path and token segments.")
                    : ui(dictionary, "base64NormalizedInputDescription", "URL-safe characters and missing padding are normalized before decoding.")}
                </p>
              </div>
              <Badge>{ui(dictionary, result.stats?.outputKind ?? "text", result.stats?.outputKind ?? "text")}</Badge>
            </div>
            <div className="mt-3 grid gap-2">
              <div className="min-w-0 rounded-md bg-muted p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{mode === "encode" ? ui(dictionary, "urlSafeBase64", "URL-safe Base64") : ui(dictionary, "normalizedBase64", "Normalized Base64")}</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.alternate)}>
                    <Copy className="h-4 w-4" />
                    {dictionary.tool.copy}
                  </Button>
                </div>
                <code className="mt-2 block break-all text-muted-foreground">{result.alternate}</code>
              </div>
            </div>
          </section>
          {result.diagnostics ? (
            <section className="rounded-md border bg-card p-3" data-base64-diagnostics data-base64-shape>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{ui(dictionary, "base64Diagnostics", "Base64 diagnostics")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "base64DiagnosticsDescription", "Check decoded shape, JSON keys, line count, and control characters before copying the value.")}</p>
                </div>
                <Badge>{ui(dictionary, result.diagnostics.shapeKey, result.diagnostics.shapeKey)}</Badge>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: ui(dictionary, "base64DetectedContent", "Detected content"), value: ui(dictionary, result.diagnostics.shapeKey, result.diagnostics.shapeKey) },
                  { label: ui(dictionary, "base64TextLines", "Text lines"), value: String(result.diagnostics.lineCount) },
                  { label: ui(dictionary, "base64JsonKeys", "JSON keys"), value: String(result.diagnostics.jsonKeyCount) },
                  { label: ui(dictionary, "base64ControlCharacters", "Control characters"), value: String(result.diagnostics.controlCharacters) },
                ].map((item) => (
                  <div key={item.label} className="min-w-0 rounded-md bg-muted px-3 py-2 text-xs">
                    <p className="text-muted-foreground">{item.label}</p>
                    <p className="mt-1 break-words font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {result.jsonPreview ? (
            <section className="rounded-md border bg-card p-3" data-base64-json-preview>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{ui(dictionary, "base64JsonPreview", "JSON preview")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "base64JsonPreviewDescription", "Detected JSON text. Copy the formatted version before moving into JSON tools.")}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.jsonPreview)}>
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyFormattedJson", "Copy formatted JSON")}
                </Button>
              </div>
              <pre className="mt-3 max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs">
                <code>{result.jsonPreview}</code>
              </pre>
            </section>
          ) : null}
          {result.imagePreview ? (
            <section className="rounded-md border bg-card p-3" data-base64-image-preview>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{ui(dictionary, "base64ImagePreview", "Image preview")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "base64ImagePreviewDescription", "Detected image data from the Base64 payload. Preview it before copying decoded binary text.")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{result.imagePreview.mime}</Badge>
                  <Badge>{result.imagePreview.bytes} {ui(dictionary, "bytes", "bytes")}</Badge>
                  <Button variant="outline" size="sm" onClick={() => downloadDataUrl(result.imagePreview!.dataUrl, "bobob-base64-image.png")}>
                    <Download className="h-4 w-4" />
                    {ui(dictionary, "downloadImage", "Download image")}
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex min-h-48 items-center justify-center overflow-auto rounded-md bg-muted p-3">
                <Image src={result.imagePreview.dataUrl} alt={ui(dictionary, "base64ImagePreview", "Image preview")} width={320} height={220} unoptimized className="max-h-64 w-auto max-w-full rounded-sm object-contain" />
              </div>
            </section>
          ) : null}
          <section className="rounded-md border bg-card p-3" data-base64-warnings>
            <p className="text-sm font-medium">{ui(dictionary, "base64ReviewNotes", "Review notes")}</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {(result.warnings.length ? result.warnings : ["base64NoWarnings"]).map((key) => (
                <li key={key}>- {ui(dictionary, key, key)}</li>
              ))}
            </ul>
          </section>
          {payloadReport && result.stats && result.diagnostics ? (
            <section className="space-y-3 rounded-md border bg-card p-3" data-base64-payload-report>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{ui(dictionary, "base64PayloadReport", "Base64 payload report")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "base64PayloadReportDescription", "Copy a compact handoff report with Base64 variant, decoded shape, review notes, and safe sharing checks.")}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-base64-payload-report-copy
                  onClick={() =>
                    copyToClipboard(
                      buildBase64PayloadReport({
                        mode,
                        stats: result.stats!,
                        diagnostics: result.diagnostics!,
                        warnings: result.warnings,
                        imagePreview: result.imagePreview,
                        dictionary,
                        checkedAt: new Date().toISOString(),
                      }).markdown,
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                  {ui(dictionary, "copyBase64PayloadReport", "Copy Base64 report")}
                </Button>
              </div>
              <ToolMetricGrid items={payloadReport.metrics} />
              <ToolWarningList title={ui(dictionary, "base64PayloadReviewNotes", "Review notes")} warnings={payloadReport.reviewNotes} emptyLabel={ui(dictionary, "base64PayloadReportNoWarnings", "No obvious Base64 issues detected. Still redact secrets before sharing.")} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "base64PayloadSafeHandoffChecklist", "Safe handoff checklist")}</p>
                <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  {payloadReport.checklist.map((item) => (
                    <li key={item} className="rounded-md bg-muted px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-base64-payload-report-preview>
                <code>{payloadReport.markdown}</code>
              </pre>
            </section>
          ) : null}
          <ResultNextActions signals={base64NextActionSignals} dictionary={dictionary} />
          <ResultBlock
            title={result.imagePreview ? ui(dictionary, "dataUrl", "Data URL") : mode === "encode" ? ui(dictionary, "encodeBase64", "Encode UTF-8 to Base64") : ui(dictionary, "decodeBase64", "Decode Base64 to UTF-8")}
            value={result.imagePreview?.dataUrl ?? result.value}
            dictionary={dictionary}
          />
        </div>
      )}
    </div>
  );
}

function TimestampTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState(sampleTimestampSeconds);
  const result = React.useMemo(() => {
    const numeric = Number(input);
    const date = Number.isFinite(numeric)
      ? new Date(String(Math.trunc(Math.abs(numeric))).length <= 10 ? numeric * 1000 : numeric)
      : new Date(input);
    if (Number.isNaN(date.getTime())) return "Enter Unix seconds, Unix milliseconds, or an ISO date string.";
    return [`ISO: ${date.toISOString()}`, `Local: ${date.toLocaleString()}`, `Unix seconds: ${Math.floor(date.getTime() / 1000)}`, `Unix milliseconds: ${date.getTime()}`].join("\n");
  }, [input]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "timestampOrDate", "Timestamp or date")}</span>
          <Input value={input} onChange={(event) => setInput(event.target.value)} />
        </label>
        <div className="flex items-end">
          <Button variant="outline" onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}>
            <RefreshCcw className="h-4 w-4" />
            {ui(dictionary, "now", "Now")}
          </Button>
        </div>
      </div>
      <ResultBlock title={ui(dictionary, "convertedDate", "Converted date")} value={result} dictionary={dictionary} />
    </div>
  );
}

function makeUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) =>
    (Number(char) ^ (globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(char) / 4)))).toString(16),
  );
}

const uuidCountPresets = [1, 5, 20, 50];

function formatUuidValue(value: string, format: string) {
  if (format === "uppercase") return value.toUpperCase();
  if (format === "compact") return value.replace(/-/g, "");
  return value.toLowerCase();
}

function UuidTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [count, setCount] = React.useState(5);
  const [format, setFormat] = React.useState("lowercase");
  const [values, setValues] = React.useState<string[]>(sampleUuids.map((value) => formatUuidValue(value, "lowercase")));
  const regenerate = React.useCallback(() => {
    const nextCount = clampInteger(count, 1, 50);
    setValues(Array.from({ length: nextCount }, () => formatUuidValue(makeUuid(), format)));
  }, [count, format]);

  React.useEffect(() => {
    setValues((current) => current.map((value) => formatUuidValue(value.includes("-") ? value : `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`, format)));
  }, [format]);

  const uniqueCount = new Set(values).size;
  const warnings = [
    count > 50 ? ui(dictionary, "uuidClampedWarning", "Count is clamped to 50 to keep browser output readable.") : "",
    format === "compact" ? ui(dictionary, "uuidCompactWarning", "Compact UUIDs remove hyphens; confirm the target accepts 32-character IDs.") : "",
    count >= 25 ? ui(dictionary, "uuidBulkWarning", "Bulk UUIDs are useful for fixtures, but production IDs should be generated at write time.") : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4" data-uuid-tool>
      <div className="space-y-2" data-uuid-examples>
        <p className="text-sm font-medium">{ui(dictionary, "uuidExamples", "UUID examples")}</p>
        <div className="flex flex-wrap gap-2">
          {uuidCountPresets.map((preset) => (
            <Button key={preset} variant="outline" size="sm" onClick={() => setCount(preset)}>
              {preset} {ui(dictionary, "uuidCountSuffix", "values")}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[160px_180px_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "count", "Count")}</span>
          <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value))} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "uuidFormat", "UUID format")}</span>
          <Select value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value="lowercase">{ui(dictionary, "uuidLowercase", "Lowercase")}</option>
            <option value="uppercase">{ui(dictionary, "uuidUppercase", "Uppercase")}</option>
            <option value="compact">{ui(dictionary, "uuidCompact", "No hyphens")}</option>
          </Select>
        </label>
        <div className="flex items-end">
          <Button onClick={regenerate}>
            <RefreshCcw className="h-4 w-4" />
            {ui(dictionary, "generate", "Generate")}
          </Button>
        </div>
      </div>
      <div data-uuid-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "generatedCount", "Generated"), value: String(values.length) },
            { label: ui(dictionary, "uniqueCount", "Unique"), value: String(uniqueCount), description: uniqueCount === values.length ? ui(dictionary, "uuidUniqueOk", "No duplicate values in this batch.") : ui(dictionary, "uuidDuplicateWarning", "Duplicate detected in this batch.") },
            { label: ui(dictionary, "uuidVersion", "Version"), value: format === "compact" ? "4" : values[0]?.[14] ?? "4" },
            { label: ui(dictionary, "uuidVariant", "Variant"), value: "RFC 4122 / 9562" },
          ]}
        />
      </div>
      <div data-uuid-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "uuidNoWarnings", "Generated locally with browser crypto. Copy only the count you need.")} />
      </div>
      <ResultBlock title={ui(dictionary, "uuidValues", "UUID v4 values")} value={values.join("\n")} dictionary={dictionary} />
    </div>
  );
}

function GeneratorControls({ count, setCount, regenerate, dictionary }: { count: number; setCount: (value: number) => void; regenerate: () => void; dictionary: ClientDictionary }) {
  return (
    <div className="grid gap-3 md:grid-cols-[160px_auto]">
      <label className="space-y-2">
        <span className="text-sm font-medium">{ui(dictionary, "count", "Count")}</span>
        <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value))} />
      </label>
      <div className="flex items-end">
        <Button onClick={regenerate}>
          <RefreshCcw className="h-4 w-4" />
          {ui(dictionary, "generate", "Generate")}
        </Button>
      </div>
    </div>
  );
}

const hashExamples = [
  { labelKey: "hashPlainTextExample", fallbackLabel: "Plain text", value: "hello world" },
  { labelKey: "hashJsonExample", fallbackLabel: "JSON payload", value: '{"id":123,"status":"ok"}' },
  { labelKey: "hashReleaseExample", fallbackLabel: "Release label", value: "release-artifact-v1.2.3" },
  { labelKey: "hashWebhookExample", fallbackLabel: "Webhook body", value: '{"event":"checkout.session.completed","id":"evt_123"}' },
];

function buildHashSignatureReport({
  mode,
  input,
  secret,
  hashes,
  warnings,
  dictionary,
  checkedAt,
}: {
  mode: "digest" | "hmac";
  input: string;
  secret: string;
  hashes: Array<{ name: string; value: string; note: string }>;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const inputBytes = byteLength(input);
  const inputLines = input.split(/\r?\n/).length;
  const secretBytes = byteLength(secret);
  const modeLabel = mode === "hmac" ? ui(dictionary, "hashModeHmac", "HMAC") : ui(dictionary, "hashModeDigest", "Digest");
  const primaryHash = hashes.find((hash) => hash.name === (mode === "hmac" ? "HMAC-SHA-256" : "SHA-256")) ?? hashes[0];
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "hashSignatureReportNoWarnings", "No obvious hash or HMAC review warnings detected. Confirm normalization against the target system.")];
  const checklist = [
    ui(dictionary, "hashSignatureChecklistNormalize", "Normalize line endings, whitespace, and encoding before comparing with another system."),
    ui(dictionary, "hashSignatureChecklistAlgorithm", "Confirm the algorithm and output encoding match the receiving system."),
    ui(dictionary, "hashSignatureChecklistSecret", "Never share the HMAC secret itself; share only the signature and verification context."),
    ui(dictionary, "hashSignatureChecklistPassword", "Do not treat fast hashes as password storage or encryption."),
    ui(dictionary, "hashSignatureChecklistFullDigest", "Compare the full digest or signature, not only a short prefix."),
  ];
  const metrics = [
    { label: ui(dictionary, "hashReportMode", "Mode"), value: modeLabel },
    { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(inputBytes) },
    { label: ui(dictionary, "lines", "Lines"), value: String(inputLines) },
    { label: ui(dictionary, "hashAlgorithms", "Algorithms"), value: String(hashes.length) },
    { label: ui(dictionary, "hashReportPrimaryOutput", "Primary output"), value: primaryHash?.name ?? ui(dictionary, "notApplicable", "Not applicable") },
    ...(mode === "hmac" ? [{ label: ui(dictionary, "hmacSecretBytes", "Secret bytes"), value: String(secretBytes) }] : []),
  ];
  const markdown = [
    `# ${ui(dictionary, "hashSignatureReport", "Hash signature report")}`,
    "",
    `- ${ui(dictionary, "hashReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "hashReportMode", "Mode")}: ${modeLabel}`,
    `- ${ui(dictionary, "inputBytes", "Input bytes")}: ${inputBytes}`,
    `- ${ui(dictionary, "lines", "Lines")}: ${inputLines}`,
    ...(mode === "hmac" ? [`- ${ui(dictionary, "hmacSecretBytes", "Secret bytes")}: ${secretBytes}`] : []),
    `- ${ui(dictionary, "hashReportInputPolicy", "Input included")}: ${ui(dictionary, "hashReportInputExcluded", "No, only byte and line counts are included.")}`,
    "",
    `## ${ui(dictionary, "hashReportOutputs", "Digest and signature outputs")}`,
    ...hashes.map((hash) => `- ${hash.name}: ${hash.value} (${hash.note})`),
    "",
    `## ${ui(dictionary, "hashReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "hashReportChecklist", "Safe signature checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function HashGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("hello world");
  const [mode, setMode] = React.useState<"digest" | "hmac">("digest");
  const [secret, setSecret] = React.useState("shared-secret");
  const digestHashes = React.useMemo(
    () => [
      { name: "MD5", value: CryptoJS.MD5(input).toString(), note: ui(dictionary, "hashLegacyChecksum", "Legacy checksum only") },
      { name: "SHA-1", value: CryptoJS.SHA1(input).toString(), note: ui(dictionary, "hashLegacyCollision", "Legacy; collision-prone") },
      { name: "SHA-256", value: CryptoJS.SHA256(input).toString(), note: ui(dictionary, "hashRecommendedChecksum", "Recommended checksum default") },
      { name: "SHA-512", value: CryptoJS.SHA512(input).toString(), note: ui(dictionary, "hashLargeDigest", "Long digest for stronger comparison") },
    ],
    [dictionary, input],
  );
  const hmacHashes = React.useMemo(
    () => [
      { name: "HMAC-SHA-256", value: CryptoJS.HmacSHA256(input, secret).toString(), note: ui(dictionary, "hmacSha256Recommended", "Common webhook signature default") },
      { name: "HMAC-SHA-512", value: CryptoJS.HmacSHA512(input, secret).toString(), note: ui(dictionary, "hmacSha512LargeDigest", "Longer keyed digest") },
    ],
    [dictionary, input, secret],
  );
  const hashes = React.useMemo(
    () => (mode === "hmac" ? hmacHashes : digestHashes),
    [digestHashes, hmacHashes, mode],
  );
  const output = hashes.map((hash) => `${hash.name}: ${hash.value}`).join("\n");
  const trimmed = input.trim();
  const trimmedSecret = secret.trim();
  const warnings = [
    trimmed.length === 0 ? ui(dictionary, "hashEmptyWarning", "The input is empty, so these hashes represent an empty string.") : "",
    mode === "hmac" && trimmedSecret.length === 0 ? ui(dictionary, "hmacEmptySecretWarning", "HMAC mode needs a shared secret key before the digest is meaningful.") : "",
    mode === "hmac" && trimmedSecret.length > 0 && byteLength(secret) < 16 ? ui(dictionary, "hmacShortSecretWarning", "Short HMAC secrets are easy to guess. Use a high-entropy secret for real signatures.") : "",
    mode === "hmac" ? ui(dictionary, "hmacSecretWarning", "Do not share the HMAC secret itself. Copy only the resulting signature unless you are setting up a local test.") : "",
    ui(dictionary, "hashPasswordWarning", "Do not use plain hashes for password storage. Use a slow password hashing scheme with salt."),
    /[\r\n]/.test(input) ? ui(dictionary, "hashWhitespaceWarning", "Line endings and trailing spaces change every digest. Normalize before comparing with another system.") : "",
    /^[{\[]/.test(trimmed) ? ui(dictionary, "hashJsonWarning", "JSON key order and whitespace affect the digest. Format or canonicalize before using as a stable checksum.") : "",
  ].filter(Boolean);
  const signatureReport = React.useMemo(
    () =>
      buildHashSignatureReport({
        mode,
        input,
        secret,
        hashes,
        warnings,
        dictionary,
        checkedAt: ui(dictionary, "hashReportCopyTime", "Browser copy time"),
      }),
    [dictionary, hashes, input, mode, secret, warnings],
  );

  return (
    <div className="space-y-4" data-hash-tool>
      <div className="space-y-2" data-hash-examples>
        <p className="text-sm font-medium">{ui(dictionary, "hashExamples", "Hash examples")}</p>
        <div className="flex flex-wrap gap-2">
          {hashExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]" data-hash-hmac-options>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "hashMode", "Hash mode")}</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value as "digest" | "hmac")}>
            <option value="digest">{ui(dictionary, "hashModeDigest", "Digest")}</option>
            <option value="hmac">{ui(dictionary, "hashModeHmac", "HMAC")}</option>
          </Select>
        </label>
        {mode === "hmac" ? (
          <label className="space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "hmacSecret", "HMAC secret")}</span>
            <Input value={secret} onChange={(event) => setSecret(event.target.value)} />
          </label>
        ) : null}
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{ui(dictionary, "input", "Input")}</span>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
      </label>
      <div data-hash-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(byteLength(input)) },
            { label: ui(dictionary, "characters", "Characters"), value: String(input.length) },
            { label: ui(dictionary, "lines", "Lines"), value: String(input.split(/\r?\n/).length) },
            ...(mode === "hmac" ? [{ label: ui(dictionary, "hmacSecretBytes", "Secret bytes"), value: String(byteLength(secret)) }] : []),
            { label: ui(dictionary, "hashAlgorithms", "Algorithms"), value: String(hashes.length) },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-hash-algorithms>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "hashAlgorithmNotes", "Algorithm notes")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "hashAlgorithmNotesDescription", "Use the digest that matches the system you are comparing against.")}</p>
        </div>
        <div className="divide-y">
          {hashes.map((hash) => (
            <div key={hash.name} className="grid gap-1 p-3 text-sm md:grid-cols-[120px_1fr]">
              <div>
                <p className="font-semibold">{hash.name}</p>
                <p className="text-xs text-muted-foreground">{hash.note}</p>
              </div>
              <code className="min-w-0 break-all rounded bg-muted px-2 py-1 text-xs">{hash.value}</code>
            </div>
          ))}
        </div>
      </section>
      <div data-hash-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "hashNoWarnings", "Input looks suitable for local checksum generation.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-hash-signature-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{ui(dictionary, "hashSignatureReport", "Hash signature report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "hashSignatureReportDescription", "Copy a compact checksum or HMAC handoff report without including the raw input or secret.")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-hash-signature-report-copy
            onClick={() =>
              copyToClipboard(
                buildHashSignatureReport({
                  mode,
                  input,
                  secret,
                  hashes,
                  warnings,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
          >
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyHashSignatureReport", "Copy signature report")}
          </Button>
        </div>
        <ToolMetricGrid items={signatureReport.metrics} />
        <ToolWarningList title={ui(dictionary, "hashReportReviewNotes", "Review notes")} warnings={signatureReport.reviewNotes} emptyLabel={ui(dictionary, "hashSignatureReportNoWarnings", "No obvious hash or HMAC review warnings detected. Confirm normalization against the target system.")} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "hashReportChecklist", "Safe signature checklist")}</p>
          <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {signatureReport.checklist.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-hash-signature-report-preview>
          <code>{signatureReport.markdown}</code>
        </pre>
      </section>
      <ResultBlock title={mode === "hmac" ? ui(dictionary, "hmacHashes", "HMAC signatures") : ui(dictionary, "hashes", "Hashes")} value={output} dictionary={dictionary} />
    </div>
  );
}

function TextDiffTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [left, setLeft] = React.useState("alpha\nbeta\ngamma");
  const [right, setRight] = React.useState("alpha\nbeta updated\ngamma");
  const [mode, setMode] = React.useState("lines");
  const output = React.useMemo(() => {
    const changes = mode === "words" ? diffWords(left, right) : diffLines(left, right);
    return changes
      .map((part) => {
        const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
        return `${prefix}${part.value}`;
      })
      .join("");
  }, [left, mode, right]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Textarea value={left} onChange={(event) => setLeft(event.target.value)} className="min-h-44" aria-label={ui(dictionary, "originalText", "Original text")} />
        <Textarea value={right} onChange={(event) => setRight(event.target.value)} className="min-h-44" aria-label={ui(dictionary, "changedText", "Changed text")} />
      </div>
      <Select value={mode} onChange={(event) => setMode(event.target.value)} className="max-w-44">
        <option value="lines">{ui(dictionary, "lineDiff", "Line diff")}</option>
        <option value="words">{ui(dictionary, "wordDiff", "Word diff")}</option>
      </Select>
      <ResultBlock title={ui(dictionary, "diffResult", "Diff result")} value={output} dictionary={dictionary} />
    </div>
  );
}

function YamlJsonTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("name: Bob\nactive: true\nitems:\n  - json\n  - yaml");
  const [mode, setMode] = React.useState("yaml-json");
  const result = React.useMemo(() => {
    try {
      if (mode === "yaml-json") return { error: "", value: JSON.stringify(parseYaml(input), null, 2) };
      return { error: "", value: stringifyYaml(JSON.parse(input)) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Conversion failed", value: "" };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48" />
        <Select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="yaml-json">YAML to JSON</option>
          <option value="json-yaml">JSON to YAML</option>
        </Select>
      </div>
      {result.error ? <ErrorAlert title={ui(dictionary, "conversionError", "Conversion error")} message={result.error} /> : <ResultBlock title={ui(dictionary, "convertedOutput", "Converted output")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

const yamlValidatorExamples = [
  { labelKey: "yamlSimpleConfigExample", fallbackLabel: "App config", value: "name: Bob\nactive: true\nitems:\n  - json\n  - yaml" },
  { labelKey: "yamlDockerServiceExample", fallbackLabel: "Docker Compose", value: "services:\n  app:\n    image: node:20\n    ports:\n      - \"3000:3000\"\n    environment:\n      NODE_ENV: production\n    depends_on:\n      - db\n  db:\n    image: postgres:16\n    volumes:\n      - db-data:/var/lib/postgresql/data\nvolumes:\n  db-data:" },
  { labelKey: "yamlWorkflowExample", fallbackLabel: "Workflow env", value: "env:\n  NODE_ENV: production\n  FEATURE_FLAG: \"on\"\nsteps:\n  - run: npm test" },
];

function getYamlTopLevelSummary(value: unknown, dictionary: ClientDictionary) {
  if (Array.isArray(value)) {
    return { type: ui(dictionary, "array", "Array"), entries: value.length };
  }
  if (value && typeof value === "object") {
    return { type: ui(dictionary, "object", "Object"), entries: Object.keys(value as Record<string, unknown>).length };
  }
  if (value === null) return { type: "null", entries: 0 };
  return { type: typeof value, entries: 1 };
}

function asPlainRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function collectionSize(value: unknown) {
  if (Array.isArray(value)) return value.length;
  const record = asPlainRecord(value);
  if (record) return Object.keys(record).length;
  if (typeof value === "string" && value.trim()) return 1;
  return 0;
}

function listValue(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item));
  const record = asPlainRecord(value);
  if (record) return Object.keys(record);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function isUnpinnedComposeImage(value: unknown) {
  if (typeof value !== "string") return false;
  const image = value.trim();
  if (!image || image.includes("@sha256:")) return false;
  const lastSegment = image.split("/").pop() ?? image;
  return !lastSegment.includes(":") || lastSegment.endsWith(":latest");
}

function hasHostPathMount(value: unknown) {
  return listValue(value).some((item) => {
    const source = item.split(":")[0]?.trim() ?? "";
    return source === "." || source.startsWith("./") || source.startsWith("../") || source.startsWith("/") || source.startsWith("~/");
  });
}

function hasSecretLikeEnvironment(value: unknown) {
  const keys = Array.isArray(value)
    ? value.map((item) => String(item).split("=")[0] ?? "")
    : Object.keys(asPlainRecord(value) ?? {});
  return keys.some((key) => /secret|token|password|passwd|api[_-]?key|private/i.test(key));
}

function getComposeDiagnostics(parsed: unknown, dictionary: ClientDictionary) {
  const root = asPlainRecord(parsed);
  const services = asPlainRecord(root?.services);
  const serviceEntries = Object.entries(services ?? {});
  const serviceNames = new Set(serviceEntries.map(([name]) => name));
  const warnings: string[] = [];
  const serviceRows = serviceEntries.map(([name, value]) => {
    const service = asPlainRecord(value);
    if (!service) {
      warnings.push(ui(dictionary, "composeInvalidServiceWarning", "Service \"{service}\" should be a mapping with image, build, ports, and environment.").replace("{service}", name));
      return { name, imageOrBuild: "—", ports: "0", env: "0", volumes: "0", dependsOn: "—" };
    }
    const image = typeof service.image === "string" ? service.image : "";
    const build = service.build ? ui(dictionary, "composeBuild", "build") : "";
    const dependsOn = listValue(service.depends_on);
    if (!image && !service.build) warnings.push(ui(dictionary, "composeMissingImageBuildWarning", "Service \"{service}\" has neither image nor build.").replace("{service}", name));
    if (isUnpinnedComposeImage(image)) warnings.push(ui(dictionary, "composeUnpinnedImageWarning", "Service \"{service}\" uses an unpinned or latest image tag.").replace("{service}", name));
    if (service.privileged === true) warnings.push(ui(dictionary, "composePrivilegedWarning", "Service \"{service}\" runs privileged. Confirm this is required before sharing the file.").replace("{service}", name));
    if (hasHostPathMount(service.volumes)) warnings.push(ui(dictionary, "composeHostPathWarning", "Service \"{service}\" uses a host path volume. Check portability before copying.").replace("{service}", name));
    if (hasSecretLikeEnvironment(service.environment)) warnings.push(ui(dictionary, "composeSecretEnvWarning", "Service \"{service}\" contains secret-like environment keys. Redact production values before sharing.").replace("{service}", name));
    const missingDependencies = dependsOn.filter((dependency) => !serviceNames.has(dependency));
    if (missingDependencies.length) warnings.push(ui(dictionary, "composeUnknownDependencyWarning", "Service \"{service}\" depends on unknown services: {dependencies}.").replace("{service}", name).replace("{dependencies}", missingDependencies.join(", ")));
    return {
      name,
      imageOrBuild: image || build || "—",
      ports: String(collectionSize(service.ports)),
      env: String(collectionSize(service.environment)),
      volumes: String(collectionSize(service.volumes)),
      dependsOn: dependsOn.join(", ") || "—",
    };
  });
  const imageCount = serviceEntries.filter(([, value]) => Boolean(asPlainRecord(value)?.image)).length;
  const buildCount = serviceEntries.filter(([, value]) => Boolean(asPlainRecord(value)?.build)).length;
  const portCount = serviceEntries.reduce((count, [, value]) => count + collectionSize(asPlainRecord(value)?.ports), 0);
  const volumeCount = serviceEntries.reduce((count, [, value]) => count + collectionSize(asPlainRecord(value)?.volumes), 0);
  const environmentCount = serviceEntries.reduce((count, [, value]) => count + collectionSize(asPlainRecord(value)?.environment), 0);
  if (root && "services" in root && !services) warnings.push(ui(dictionary, "composeNoServicesWarning", "Compose services should be a mapping of service names."));
  return {
    isCompose: Boolean(services),
    serviceRows,
    warnings,
    metrics: [
      { label: ui(dictionary, "composeStatus", "Compose status"), value: services ? ui(dictionary, "composeDetected", "Detected") : ui(dictionary, "composeNotDetected", "Not detected") },
      { label: ui(dictionary, "composeServices", "Services"), value: String(serviceEntries.length) },
      { label: ui(dictionary, "composeImages", "Images"), value: String(imageCount) },
      { label: ui(dictionary, "composeBuildServices", "Build services"), value: String(buildCount) },
      { label: ui(dictionary, "composePublishedPorts", "Published ports"), value: String(portCount) },
      { label: ui(dictionary, "composeVolumeMounts", "Volume mounts"), value: String(volumeCount) },
      { label: ui(dictionary, "composeEnvironmentEntries", "Environment entries"), value: String(environmentCount) },
    ],
  };
}

function YamlValidatorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("name: Bob\nactive: true\nitems:\n  - json\n  - yaml");
  const result = React.useMemo(() => {
    try {
      const parsed = parseYaml(input);
      const summary = getYamlTopLevelSummary(parsed, dictionary);
      return { error: "", parsed, summary, formattedYaml: stringifyYaml(parsed), value: `${ui(dictionary, "validYaml", "Valid YAML")}\n\n${ui(dictionary, "parsedPreview", "Parsed preview")}:\n${JSON.stringify(parsed, null, 2)}` };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "YAML validation failed", parsed: null, summary: null, formattedYaml: "", value: "" };
    }
  }, [dictionary, input]);
  const composeDiagnostics = React.useMemo(() => (result.error ? null : getComposeDiagnostics(result.parsed, dictionary)), [dictionary, result.error, result.parsed]);
  const warnings = [
    input.trim().length === 0 ? ui(dictionary, "yamlEmptyWarning", "The YAML input is empty.") : "",
    /\t/.test(input) ? ui(dictionary, "yamlTabWarning", "Tabs can break YAML indentation. Use spaces before copying.") : "",
    /:\s*(yes|no|on|off)\s*(#.*)?$/im.test(input) ? ui(dictionary, "yamlAmbiguousBooleanWarning", "Unquoted yes/no/on/off values can behave differently across YAML tooling. Quote them when they are strings.") : "",
    /^\s*-\s*$/m.test(input) ? ui(dictionary, "yamlEmptyListItemWarning", "An empty list item is present. Confirm this is intentional.") : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4" data-yaml-validator-tool>
      <div className="space-y-2" data-yaml-examples>
        <p className="text-sm font-medium">{ui(dictionary, "yamlExamples", "YAML examples")}</p>
        <div className="flex flex-wrap gap-2">
          {yamlValidatorExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48" aria-label={ui(dictionary, "yamlInput", "YAML input")} />
      <div data-yaml-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(byteLength(input)) },
            { label: ui(dictionary, "lines", "Lines"), value: String(input.split(/\r?\n/).length) },
            { label: ui(dictionary, "documentType", "Document type"), value: result.summary?.type ?? "—" },
            { label: ui(dictionary, "topLevelEntries", "Top-level entries"), value: result.summary ? String(result.summary.entries) : "—" },
          ]}
        />
      </div>
      <div data-yaml-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "yamlNoWarnings", "YAML syntax and common indentation checks look ready.")} />
      </div>
      {composeDiagnostics ? (
        <section className="rounded-md border bg-card" data-compose-diagnostics>
          <div className="border-b p-3">
            <h3 className="text-sm font-semibold">{ui(dictionary, "dockerComposeChecks", "Docker Compose checks")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "dockerComposeDescription", "Inspect services, image/build coverage, ports, volumes, environment, and depends_on before copying a Compose file.")}</p>
          </div>
          <div className="space-y-3 p-3">
            <ToolMetricGrid items={composeDiagnostics.metrics} />
            {composeDiagnostics.serviceRows.length ? (
              <section className="rounded-md border bg-background p-3" data-compose-service-preview>
                <h4 className="text-sm font-semibold">{ui(dictionary, "composeServicePreview", "Service preview")}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "composeServicePreviewDescription", "Review each service entry before using the formatted YAML.")}</p>
                <div className="mt-3 grid gap-2">
                  {composeDiagnostics.serviceRows.map((service) => (
                    <div key={service.name} className="grid min-w-0 gap-2 rounded-md bg-muted p-3 text-xs md:grid-cols-[1fr_1.5fr_repeat(4,minmax(72px,auto))]">
                      <div className="min-w-0">
                        <p className="text-muted-foreground">{ui(dictionary, "composeServiceName", "Service")}</p>
                        <p className="break-words font-medium">{service.name}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground">{ui(dictionary, "composeImageOrBuild", "Image / build")}</p>
                        <p className="break-words font-medium">{service.imageOrBuild}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{ui(dictionary, "composePorts", "Ports")}</p>
                        <p className="font-medium">{service.ports}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{ui(dictionary, "composeEnv", "Env")}</p>
                        <p className="font-medium">{service.env}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{ui(dictionary, "composeVolumes", "Volumes")}</p>
                        <p className="font-medium">{service.volumes}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground">{ui(dictionary, "composeDependsOn", "Depends on")}</p>
                        <p className="break-words font-medium">{service.dependsOn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            <div data-compose-warnings>
              <ToolWarningList title={ui(dictionary, "composeWarnings", "Compose review notes")} warnings={composeDiagnostics.warnings} emptyLabel={ui(dictionary, "composeNoWarnings", "Compose service checks look ready for local validation or formatting.")} />
            </div>
          </div>
        </section>
      ) : null}
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "yamlValidationError", "YAML validation error")} message={result.error} />
      ) : (
        <div className="space-y-3">
          <ResultNextActions signals={[composeDiagnostics?.isCompose ? "yaml-compose" : "yaml-valid"]} dictionary={dictionary} />
          <div className="grid gap-3 xl:grid-cols-2">
            <ResultBlock title={ui(dictionary, "validationResult", "Validation result")} value={result.value} dictionary={dictionary} />
            <ResultBlock title={ui(dictionary, "formattedYaml", "Formatted YAML")} value={result.formattedYaml} dictionary={dictionary} />
          </div>
        </div>
      )}
    </div>
  );
}

type EnvWarning =
  | { type: "missingSyntax"; line: number }
  | { type: "invalidName"; line: number; key: string }
  | { type: "duplicateKey"; line: number; key: string; firstLine: number }
  | { type: "unclosedQuote"; line: number; key: string }
  | { type: "whitespace"; line: number; key: string };

function parseEnvContent(input: string) {
  const entries: Array<{ key: string; value: string; line: number }> = [];
  const warnings: EnvWarning[] = [];
  const seenKeys = new Map<string, number>();

  input.split(/\r?\n/).forEach((rawLine, index) => {
    const line = index + 1;
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const source = trimmed.startsWith("export ") ? trimmed.slice(7).trimStart() : trimmed;
    const equalsIndex = source.indexOf("=");
    if (equalsIndex <= 0) {
      warnings.push({ type: "missingSyntax", line });
      return;
    }

    const key = source.slice(0, equalsIndex).trim();
    let value = source.slice(equalsIndex + 1).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) warnings.push({ type: "invalidName", line, key });

    const firstLine = seenKeys.get(key);
    if (firstLine) warnings.push({ type: "duplicateKey", line, key, firstLine });
    else seenKeys.set(key, line);

    const quote = value[0];
    if (quote === "\"" || quote === "'") {
      if (value.length === 1 || !value.endsWith(quote)) {
        warnings.push({ type: "unclosedQuote", line, key });
      } else {
        value = value.slice(1, -1);
        if (quote === "\"") value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
      }
    } else {
      const commentIndex = value.search(/\s#/);
      if (commentIndex >= 0) value = value.slice(0, commentIndex).trimEnd();
      if (/\s/.test(value)) warnings.push({ type: "whitespace", line, key });
    }

    entries.push({ key, value, line });
  });

  return {
    entries,
    warnings,
    json: JSON.stringify(Object.fromEntries(entries.map((entry) => [entry.key, entry.value])), null, 2),
  };
}

const envParserExamples = [
  { labelKey: "envProductionExample", fallbackLabel: "Production env", value: "APP_ENV=production\nAPI_URL=https://api.example.com\nFEATURE_FLAG=true" },
  { labelKey: "envExportExample", fallbackLabel: "Export syntax", value: "export NODE_ENV=production\nTIMEOUT_MS=5000\nPUBLIC_URL=https://bobob.app" },
  { labelKey: "envQuotedSecretExample", fallbackLabel: "Quoted secret", value: "SECRET_KEY=\"redacted value\"\nDATABASE_URL=\"postgres://user:pass@example.com/app\"" },
];

function formatEnvWarning(dictionary: ClientDictionary, warning: EnvWarning) {
  const templates = {
    missingSyntax: ui(dictionary, "envMissingSyntaxWarning", "Line {line}: missing KEY=value syntax."),
    invalidName: ui(dictionary, "envInvalidNameWarning", "Line {line}: invalid variable name \"{key}\"."),
    duplicateKey: ui(dictionary, "envDuplicateKeyWarning", "Line {line}: duplicate key \"{key}\" also appears on line {firstLine}."),
    unclosedQuote: ui(dictionary, "envUnclosedQuoteWarning", "Line {line}: unclosed quoted value for \"{key}\"."),
    whitespace: ui(dictionary, "envWhitespaceWarning", "Line {line}: unquoted value for \"{key}\" contains whitespace."),
  };
  return templates[warning.type]
    .replaceAll("{line}", String(warning.line))
    .replaceAll("{key}", "key" in warning ? warning.key : "")
    .replaceAll("{firstLine}", "firstLine" in warning ? String(warning.firstLine) : "");
}

function EnvParserTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("APP_ENV=production\nAPI_URL=https://api.example.com\nFEATURE_FLAG=true");
  const result = React.useMemo(() => {
    const parsed = parseEnvContent(input);
    const warningBlock = parsed.warnings.length ? `\n\n${ui(dictionary, "envWarnings", "Warnings")}:\n${parsed.warnings.map((warning) => `- ${formatEnvWarning(dictionary, warning)}`).join("\n")}` : "";
    return `${ui(dictionary, "parsedVariables", "Parsed variables")}: ${parsed.entries.length}${warningBlock}\n\n${ui(dictionary, "parsedJson", "Parsed JSON")}:\n${parsed.json}`;
  }, [dictionary, input]);
  const parsed = React.useMemo(() => parseEnvContent(input), [input]);
  const duplicateCount = parsed.warnings.filter((warning) => warning.type === "duplicateKey").length;
  const malformedLineCount = parsed.warnings.filter((warning) => warning.type === "missingSyntax" || warning.type === "invalidName" || warning.type === "unclosedQuote").length;
  const secretLikeKeys = parsed.entries.filter((entry) => /secret|token|key|password|credential/i.test(entry.key));
  const warnings = [
    ...parsed.warnings.map((warning) => formatEnvWarning(dictionary, warning)),
    secretLikeKeys.length ? ui(dictionary, "envSecretWarning", "Secret-like keys are present. Do not paste production secrets into shared screenshots or tickets.") : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4" data-env-parser-tool>
      <div className="space-y-2" data-env-examples>
        <p className="text-sm font-medium">{ui(dictionary, "envExamples", "ENV examples")}</p>
        <div className="flex flex-wrap gap-2">
          {envParserExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48" aria-label={ui(dictionary, "envInput", "ENV input")} />
      <div data-env-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "variableCount", "Variables"), value: String(parsed.entries.length) },
            { label: ui(dictionary, "duplicateCount", "Duplicates"), value: String(duplicateCount) },
            { label: ui(dictionary, "malformedLineCount", "Malformed lines"), value: String(malformedLineCount) },
            { label: ui(dictionary, "secretLikeKeys", "Secret-like keys"), value: String(secretLikeKeys.length) },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-env-entry-list>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "parsedVariables", "Parsed variables")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "valuePreview", "Review key names and value shape before copying config.")}</p>
        </div>
        <div className="divide-y">
          {(parsed.entries.length ? parsed.entries : [{ key: "—", value: dictionary.tool.noOutput, line: 0 }]).map((entry) => (
            <div key={`${entry.line}-${entry.key}`} className="grid gap-1 p-3 text-sm md:grid-cols-[120px_1fr]">
              <p className="text-xs text-muted-foreground">{entry.line ? `${ui(dictionary, "lineLabel", "Line")} ${entry.line}` : ui(dictionary, "lineLabel", "Line")}</p>
              <div className="min-w-0">
                <p className="font-semibold">{entry.key}</p>
                <code className="mt-1 block max-h-24 overflow-auto break-all rounded bg-muted px-2 py-1 text-xs">{entry.value}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div data-env-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "envNoWarnings", "ENV syntax looks ready to copy into a local config file.")} />
      </div>
      <ResultBlock title={ui(dictionary, "validationResult", "Validation result")} value={result} dictionary={dictionary} />
    </div>
  );
}

const sqlExamples = [
  { labelKey: "joinQueryExample", fallbackLabel: "JOIN query", value: "select u.id,o.total from users u join orders o on o.user_id=u.id where o.status='paid' order by o.created_at desc" },
  { labelKey: "aggregateQueryExample", fallbackLabel: "Aggregate query", value: "select status,count(*) as total from orders where created_at >= '2026-01-01' group by status order by total desc" },
  { labelKey: "mutationQueryExample", fallbackLabel: "Mutation query", value: "update users set active=false where last_login_at < '2025-01-01'" },
];

function minifySql(value: string) {
  return value.replace(/\s+/g, " ").replace(/\s*([(),=<>+-])\s*/g, "$1").trim();
}

function getSqlDiagnostics(input: string, dictionary: ClientDictionary) {
  const source = input.trim();
  const lower = source.toLowerCase();
  const statements = source.split(";").map((item) => item.trim()).filter(Boolean);
  const tableReferences = Array.from(
    new Set(
      Array.from(source.matchAll(/\b(?:from|join|update|into|delete\s+from)\s+("?[\w.:-]+"?)/gi))
        .map((match) => match[1]?.replace(/^"|"$/g, "") ?? "")
        .filter(Boolean),
    ),
  ).slice(0, 8);
  const joinCount = (lower.match(/\bjoin\b/g) ?? []).length;
  const subqueryCount = (source.match(/\(\s*select\b/gi) ?? []).length;
  const parameterCount = (source.match(/(\$\d+|:[a-zA-Z_][\w]*|@[a-zA-Z_][\w]*|\?)/g) ?? []).length;
  const sensitiveFieldCount = (lower.match(/\b(password|passwd|token|secret|api_key|apikey|access_key|refresh_token)\b/g) ?? []).length;
  const hasSelect = /\bselect\b/i.test(source);
  const hasMutation = /\b(update|delete|insert|merge)\b/i.test(source);
  const hasSchemaChange = /\b(drop|truncate|alter|create)\b/i.test(source);
  const hasWhere = /\bwhere\b/i.test(source);
  const hasLimit = /\blimit\b|\bfetch\s+first\b|\btop\s+\d+\b/i.test(source);
  const hasReturning = /\breturning\b/i.test(source);
  const hasOrderBy = /\border\s+by\b/i.test(source);
  const hasGroupBy = /\bgroup\s+by\b/i.test(source);
  const hasComments = /--|\/\*/.test(source);
  const queryTypeKey = hasSchemaChange ? "sqlSchemaQuery" : hasMutation ? "sqlMutationQuery" : hasSelect ? "sqlSelectQuery" : source ? "sqlOtherQuery" : "sqlEmptyQuery";
  const clauseChecks = [
    { label: "WHERE", active: hasWhere },
    { label: "LIMIT", active: hasLimit },
    { label: "JOIN", active: joinCount > 0 },
    { label: "GROUP BY", active: hasGroupBy },
    { label: "ORDER BY", active: hasOrderBy },
    { label: "RETURNING", active: hasReturning },
  ];
  const warnings = [
    hasMutation && !hasWhere ? ui(dictionary, "sqlMutationWithoutWhereWarning", "Mutation query without a WHERE clause. Confirm this is intentional before copying.") : "",
    hasSchemaChange ? ui(dictionary, "sqlSchemaChangeWarning", "Schema-changing SQL was detected. Run it only through migration review or a controlled environment.") : "",
    hasSelect && !hasLimit && !hasGroupBy ? ui(dictionary, "sqlNoLimitWarning", "SELECT query has no LIMIT or aggregation. Add a limit before ad-hoc production checks.") : "",
    statements.length > 3 ? ui(dictionary, "sqlManyStatementsWarning", "Several statements were detected. Review execution order before copying as one block.") : "",
    joinCount >= 4 ? ui(dictionary, "sqlManyJoinsWarning", "Many JOIN clauses were detected. Check join keys and expected row multiplication.") : "",
    sensitiveFieldCount > 0 ? ui(dictionary, "sqlSecretWarning", "The query may reference sensitive fields. Redact real values before sharing.") : "",
    hasComments ? ui(dictionary, "sqlCommentWarning", "SQL comments are present. Remove private notes before sharing the formatted query.") : "",
  ].filter(Boolean);

  return {
    clauseChecks,
    tableReferences,
    warnings,
    queryType: ui(dictionary, queryTypeKey, queryTypeKey),
    statementCount: statements.length,
    joinCount,
    subqueryCount,
    parameterCount,
    sensitiveFieldCount,
    hasSelect,
    hasMutation,
    hasSchemaChange,
    hasWhere,
    hasLimit,
    metrics: [
      { label: ui(dictionary, "queryType", "Query type"), value: ui(dictionary, queryTypeKey, queryTypeKey) },
      { label: ui(dictionary, "tableReferences", "Table references"), value: String(tableReferences.length) },
      { label: ui(dictionary, "joinCount", "JOIN clauses"), value: String(joinCount) },
      { label: ui(dictionary, "subqueryCount", "Subqueries"), value: String(subqueryCount) },
      { label: ui(dictionary, "parameterCount", "Parameters"), value: String(parameterCount) },
      { label: ui(dictionary, "sensitiveFields", "Sensitive fields"), value: String(sensitiveFieldCount) },
    ],
  };
}

function buildSqlReviewReport({
  input,
  mode,
  output,
  diagnostics,
  warnings,
  dictionary,
  checkedAt,
}: {
  input: string;
  mode: string;
  output: string;
  diagnostics: ReturnType<typeof getSqlDiagnostics>;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const yesLabel = ui(dictionary, "yes", "Yes");
  const noLabel = ui(dictionary, "no", "No");
  const modeLabel = mode === "minify" ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print");
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "sqlReportNoWarnings", "No immediate SQL review warnings detected. Still run it in a safe environment first.")];
  const tableReferences = diagnostics.tableReferences.length ? diagnostics.tableReferences : [ui(dictionary, "noSqlTableReferences", "No table references detected yet.")];
  const checklist = [
    ui(dictionary, "sqlReportChecklistEnvironment", "Run the query against staging or a transaction-wrapped session before production."),
    ui(dictionary, "sqlReportChecklistWhere", "Confirm WHERE, LIMIT, and JOIN keys match the intended row set."),
    ui(dictionary, "sqlReportChecklistExplain", "Use EXPLAIN or the database query plan for expensive SELECT or JOIN queries."),
    ui(dictionary, "sqlReportChecklistTransaction", "Wrap UPDATE, DELETE, INSERT, and schema changes in a reviewed migration or rollback plan."),
    ui(dictionary, "sqlReportChecklistRedact", "Redact credentials, customer identifiers, and production literals before sharing."),
  ];
  const metrics = [
    { label: ui(dictionary, "sqlReportQueryType", "Query type"), value: diagnostics.queryType },
    { label: ui(dictionary, "sqlReportStatementCount", "Statements"), value: String(diagnostics.statementCount) },
    { label: ui(dictionary, "sqlReportTableReferences", "Table references"), value: String(diagnostics.tableReferences.length) },
    { label: ui(dictionary, "sqlReportJoinCount", "JOIN clauses"), value: String(diagnostics.joinCount) },
    { label: ui(dictionary, "sqlReportSubqueryCount", "Subqueries"), value: String(diagnostics.subqueryCount) },
    { label: ui(dictionary, "sqlReportParameterCount", "Parameters"), value: String(diagnostics.parameterCount) },
    { label: ui(dictionary, "sqlReportWhereStatus", "WHERE status"), value: diagnostics.hasWhere ? yesLabel : noLabel },
    { label: ui(dictionary, "sqlReportLimitStatus", "LIMIT status"), value: diagnostics.hasLimit ? yesLabel : noLabel },
  ];
  const markdown = [
    `# ${ui(dictionary, "sqlReviewReport", "SQL review report")}`,
    "",
    `- ${ui(dictionary, "sqlReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "sqlReportMode", "Output mode")}: ${modeLabel}`,
    `- ${ui(dictionary, "sqlReportQueryType", "Query type")}: ${diagnostics.queryType}`,
    `- ${ui(dictionary, "sqlReportStatementCount", "Statements")}: ${diagnostics.statementCount}`,
    `- ${ui(dictionary, "sqlReportTableReferences", "Table references")}: ${diagnostics.tableReferences.length}`,
    `- ${ui(dictionary, "sqlReportJoinCount", "JOIN clauses")}: ${diagnostics.joinCount}`,
    `- ${ui(dictionary, "sqlReportSubqueryCount", "Subqueries")}: ${diagnostics.subqueryCount}`,
    `- ${ui(dictionary, "sqlReportParameterCount", "Parameters")}: ${diagnostics.parameterCount}`,
    `- ${ui(dictionary, "sqlReportSensitiveFields", "Sensitive fields")}: ${diagnostics.sensitiveFieldCount}`,
    `- ${ui(dictionary, "sqlReportWhereStatus", "WHERE status")}: ${diagnostics.hasWhere ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "sqlReportLimitStatus", "LIMIT status")}: ${diagnostics.hasLimit ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "sqlReportMutationRisk", "Mutation or schema risk")}: ${diagnostics.hasMutation || diagnostics.hasSchemaChange ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "inputBytes", "Input bytes")}: ${byteLength(input)}`,
    `- ${ui(dictionary, "outputLines", "Output lines")}: ${output ? output.split(/\r?\n/).length : 0}`,
    `- ${ui(dictionary, "sqlReportRawSqlExcluded", "Raw SQL is excluded from this report; attach a redacted formatted query separately if needed.")}`,
    "",
    `## ${ui(dictionary, "sqlReportTableReferences", "Table references")}`,
    ...tableReferences.map((table) => `- ${table}`),
    "",
    `## ${ui(dictionary, "sqlReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "sqlReportChecklist", "Review checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function SqlFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState(sqlExamples[0].value);
  const [mode, setMode] = React.useState("pretty");
  const result = React.useMemo(() => {
    try {
      return { error: "", value: mode === "minify" ? minifySql(input) : formatSql(input, { language: "postgresql" }) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unable to format SQL.", value: "" };
    }
  }, [input, mode]);
  const lowerInput = input.toLowerCase();
  const sqlDiagnostics = React.useMemo(() => getSqlDiagnostics(input, dictionary), [dictionary, input]);
  const warnings = React.useMemo(
    () =>
      Array.from(
        new Set(
          [
            /\b(update|delete|drop|truncate|alter)\b/i.test(input) ? ui(dictionary, "destructiveSqlWarning", "This looks like a mutation query. Review WHERE clauses and transactions before copying.") : "",
            /\bselect\s+\*/i.test(input) ? ui(dictionary, "selectStarWarning", "SELECT * can hide schema changes. Prefer explicit columns for shared queries.") : "",
            !input.trim().endsWith(";") ? ui(dictionary, "sqlSemicolonWarning", "No trailing semicolon detected. Add one if your SQL client expects statement terminators.") : "",
            lowerInput.includes(" password") || lowerInput.includes(" token") || lowerInput.includes(" secret") ? ui(dictionary, "sqlSecretWarning", "The query may reference sensitive fields. Redact real values before sharing.") : "",
            ...sqlDiagnostics.warnings,
          ].filter(Boolean),
        ),
      ),
    [dictionary, input, lowerInput, sqlDiagnostics],
  );
  const sqlReviewReport = React.useMemo(
    () =>
      buildSqlReviewReport({
        input,
        mode,
        output: result.value,
        diagnostics: sqlDiagnostics,
        warnings: result.error ? [result.error, ...warnings] : warnings,
        dictionary,
        checkedAt: ui(dictionary, "sqlReportCopyTime", "Browser copy time"),
      }),
    [dictionary, input, mode, result.error, result.value, sqlDiagnostics, warnings],
  );

  return (
    <div className="space-y-4" data-sql-tool>
      <div className="space-y-2" data-sql-examples>
        <p className="text-sm font-medium">{ui(dictionary, "sqlExamples", "SQL examples")}</p>
        <div className="flex flex-wrap gap-2">
          {sqlExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">SQL</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "mode", "Mode")}</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="pretty">{ui(dictionary, "prettyPrint", "Pretty print")}</option>
            <option value="minify">{ui(dictionary, "minify", "Minify")}</option>
          </Select>
        </label>
      </div>
      <div data-sql-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "statementCount", "Statements"), value: String(input.split(";").map((item) => item.trim()).filter(Boolean).length) },
            { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(byteLength(input)) },
            { label: ui(dictionary, "outputLines", "Output lines"), value: result.value ? String(result.value.split(/\r?\n/).length) : "0" },
            { label: ui(dictionary, "dialect", "Dialect"), value: "PostgreSQL" },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-sql-diagnostics>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "sqlDiagnostics", "SQL diagnostics")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "sqlDiagnosticsDescription", "Review query shape, table references, clauses, and copy risks before running formatted SQL.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={sqlDiagnostics.metrics} />
          <div className="flex flex-wrap gap-2" data-sql-clause-checks>
            {sqlDiagnostics.clauseChecks.map((item) => (
              <Badge key={item.label} className={cn(item.active ? "border-foreground/30 text-foreground" : "opacity-65")}>
                {item.label}: {item.active ? ui(dictionary, "yes", "Yes") : ui(dictionary, "no", "No")}
              </Badge>
            ))}
          </div>
          <section className="rounded-md border bg-background" data-sql-table-list>
            <div className="border-b p-3">
              <h4 className="text-sm font-semibold">{ui(dictionary, "sqlTableReferences", "Table references")}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "sqlTableReferencesDescription", "First table-like references detected from FROM, JOIN, UPDATE, INSERT, or DELETE clauses.")}</p>
            </div>
            {sqlDiagnostics.tableReferences.length ? (
              <div className="flex flex-wrap gap-2 p-3">
                {sqlDiagnostics.tableReferences.map((table) => (
                  <Badge key={table} className="max-w-full break-all font-mono text-[11px]">
                    {table}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="p-3 text-sm text-muted-foreground">{ui(dictionary, "noSqlTableReferences", "No table references detected yet.")}</p>
            )}
          </section>
        </div>
      </section>
      <div data-sql-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={result.error ? [result.error] : warnings} emptyLabel={ui(dictionary, "sqlNoWarnings", "SQL is ready for review. Run it against a safe environment before production use.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-sql-review-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{ui(dictionary, "sqlReviewReport", "SQL review report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "sqlReviewReportDescription", "Copy a handoff report with query shape, table references, clause checks, warnings, and a safe execution checklist.")}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                buildSqlReviewReport({
                  input,
                  mode,
                  output: result.value,
                  diagnostics: sqlDiagnostics,
                  warnings: result.error ? [result.error, ...warnings] : warnings,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
            data-sql-review-report-copy
          >
            <Copy className="mr-2 h-4 w-4" />
            {ui(dictionary, "copySqlReviewReport", "Copy SQL report")}
          </Button>
        </div>
        <ToolMetricGrid items={sqlReviewReport.metrics} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "sqlReportReviewNotes", "Review notes")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {sqlReviewReport.reviewNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "sqlReportChecklist", "Review checklist")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {sqlReviewReport.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-sql-review-report-preview>
          {sqlReviewReport.markdown}
        </pre>
      </section>
      {result.error ? <ErrorAlert title={ui(dictionary, "transformError", "Transform error")} message={result.error} /> : <ResultBlock title={mode === "minify" ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function formatXmlLike(input: string) {
  const tokens = input.replace(/>\s*</g, "><").replace(/</g, "\n<").trim().split("\n").filter(Boolean);
  let depth = 0;
  return tokens
    .map((token) => {
      if (/^<\//.test(token)) depth = Math.max(depth - 1, 0);
      const line = `${"  ".repeat(depth)}${token}`;
      if (/^<[^!?/][^>]*[^/]?>$/.test(token) && !token.includes("</")) depth += 1;
      return line;
    })
    .join("\n");
}

function XmlFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="XML"
      defaultInput={'<root><item id="1">Bob</item></root>'}
      modes={[
        { value: "pretty", label: "Pretty print", labelKey: "prettyPrint", transform: formatXmlLike },
        { value: "minify", label: "Minify", labelKey: "minify", transform: (value) => value.replace(/>\s+</g, "><").trim() },
      ]}
    />
  );
}

const csvExamples = [
  { labelKey: "csvPeopleExample", fallbackLabel: "People CSV", value: "id,name,role\n1,Bob,admin\n2,Alice,editor\n2,Alice,editor" },
  { labelKey: "csvMessyExportExample", fallbackLabel: "Messy export", value: " id , name , status \n 1 , Bob , active \n\n 2 , Alice , pending " },
  { labelKey: "csvJsonArrayExample", fallbackLabel: "JSON array", value: '[{"id":"1","name":"Bob"},{"id":"2","name":"Alice"}]' },
];

function normalizeCsvRows(input: string, trimCells: boolean, skipEmptyRows: boolean, removeDuplicates: boolean) {
  const parsed = Papa.parse<string[]>(input, { skipEmptyLines: false });
  const rawRows = parsed.data.filter((row): row is string[] => Array.isArray(row));
  const rows = rawRows.map((row) => row.map((cell) => (trimCells ? String(cell ?? "").trim() : String(cell ?? ""))));
  const emptyRows = rows.filter((row) => row.every((cell) => cell.trim() === "")).length;
  const candidateRows = skipEmptyRows ? rows.filter((row) => row.some((cell) => cell.trim() !== "")) : rows;
  const seen = new Set<string>();
  let duplicateRows = 0;
  const cleanedRows = removeDuplicates
    ? candidateRows.filter((row, index) => {
        if (index === 0) return true;
        const key = JSON.stringify(row);
        if (seen.has(key)) {
          duplicateRows += 1;
          return false;
        }
        seen.add(key);
        return true;
      })
    : candidateRows;
  const columnCount = Math.max(0, ...cleanedRows.map((row) => row.length));
  const inconsistentRows = cleanedRows.filter((row) => row.length !== columnCount).length;
  return {
    errors: parsed.errors,
    rows: cleanedRows,
    rowCount: Math.max(cleanedRows.length - 1, 0),
    columnCount,
    emptyRows,
    duplicateRows,
    inconsistentRows,
  };
}

function rowsToCsv(rows: string[][]) {
  return Papa.unparse(rows);
}

function rowsToJson(rows: string[][]) {
  const csv = rowsToCsv(rows);
  return JSON.stringify(Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true }).data, null, 2);
}

function summarizeJsonArray(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) throw new Error("JSON input must be an array of objects.");
  const objectRows = parsed.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row));
  const keys = Array.from(new Set(objectRows.flatMap((row) => Object.keys(row))));
  return { rows: objectRows.length, columns: keys.length, value: Papa.unparse(objectRows) };
}

function CsvJsonTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState(csvExamples[0].value);
  const [mode, setMode] = React.useState("csv-json");
  const [trimCells, setTrimCells] = React.useState(true);
  const [skipEmptyRows, setSkipEmptyRows] = React.useState(true);
  const [removeDuplicates, setRemoveDuplicates] = React.useState(false);
  const csvSummary = React.useMemo(() => normalizeCsvRows(input, trimCells, skipEmptyRows, removeDuplicates), [input, removeDuplicates, skipEmptyRows, trimCells]);
  const result = React.useMemo(() => {
    try {
      if (mode === "json-csv") {
        const jsonSummary = summarizeJsonArray(input);
        return { error: "", value: jsonSummary.value, rowCount: jsonSummary.rows, columnCount: jsonSummary.columns };
      }
      const value = mode === "clean-csv" ? rowsToCsv(csvSummary.rows) : rowsToJson(csvSummary.rows);
      return { error: "", value, rowCount: csvSummary.rowCount, columnCount: csvSummary.columnCount };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "CSV conversion failed.", value: "", rowCount: 0, columnCount: 0 };
    }
  }, [csvSummary, input, mode]);
  const warnings = [
    ...csvSummary.errors.slice(0, 3).map((error) => `${ui(dictionary, "lineLabel", "Line")} ${error.row ?? "—"}: ${error.message}`),
    csvSummary.inconsistentRows ? ui(dictionary, "csvInconsistentWarning", "Some rows have a different column count. Check delimiters and quoted values before copying.") : "",
    csvSummary.duplicateRows ? ui(dictionary, "csvDuplicateWarning", "Duplicate rows were removed from the cleaned output.") : "",
    csvSummary.emptyRows && !skipEmptyRows ? ui(dictionary, "csvEmptyRowsWarning", "Empty rows are still included. Enable empty-row removal before copying clean data.") : "",
    mode === "json-csv" && !input.trim().startsWith("[") ? ui(dictionary, "csvJsonArrayWarning", "JSON to CSV expects an array of objects.") : "",
  ].filter(Boolean);
  const previewRows = csvSummary.rows.slice(0, 6);
  const previewColumns = previewRows[0] ?? [];

  return (
    <div className="space-y-4" data-csv-json-tool>
      <div className="space-y-2" data-csv-examples>
        <p className="text-sm font-medium">{ui(dictionary, "csvExamples", "CSV examples")}</p>
        <div className="flex flex-wrap gap-2">
          {csvExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "csvOrJsonInput", "CSV or JSON input")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48" />
        </label>
        <div className="space-y-3">
          <label className="space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "mode", "Mode")}</span>
            <Select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="csv-json">{ui(dictionary, "csvToJson", "CSV to JSON")}</option>
              <option value="json-csv">{ui(dictionary, "jsonToCsv", "JSON to CSV")}</option>
              <option value="clean-csv">{ui(dictionary, "cleanCsv", "Clean CSV")}</option>
            </Select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={trimCells} onChange={(event) => setTrimCells(event.target.checked)} />
            {ui(dictionary, "trimCells", "Trim cells")}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={skipEmptyRows} onChange={(event) => setSkipEmptyRows(event.target.checked)} />
            {ui(dictionary, "removeEmptyRows", "Remove empty rows")}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={removeDuplicates} onChange={(event) => setRemoveDuplicates(event.target.checked)} />
            {ui(dictionary, "removeDuplicateRows", "Remove duplicate rows")}
          </label>
        </div>
      </div>
      <div data-csv-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "rowCount", "Rows"), value: String(result.rowCount) },
            { label: ui(dictionary, "columnCount", "Columns"), value: String(result.columnCount) },
            { label: ui(dictionary, "emptyRows", "Empty rows"), value: String(csvSummary.emptyRows) },
            { label: ui(dictionary, "duplicateRows", "Duplicate rows"), value: String(csvSummary.duplicateRows) },
          ]}
        />
      </div>
      {mode !== "json-csv" ? (
        <section className="rounded-md border bg-card" data-csv-preview>
          <div className="border-b p-3">
            <h3 className="text-sm font-semibold">{ui(dictionary, "csvPreview", "CSV preview")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "csvPreviewDescription", "First rows after the selected cleaning options.")}</p>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <tbody>
                {previewRows.length ? (
                  previewRows.map((row, rowIndex) => (
                    <tr key={`${rowIndex}-${row.join("|")}`}>
                      {(rowIndex === 0 ? previewColumns : previewColumns).map((_, columnIndex) => (
                        <td key={columnIndex} className={cn("max-w-60 border-b border-e px-3 py-2 align-top", rowIndex === 0 ? "bg-muted font-medium" : "")}>
                          <span className="block break-words">{row[columnIndex] ?? ""}</span>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-2 text-muted-foreground">{dictionary.tool.noOutput}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      <div data-csv-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={result.error ? [result.error] : warnings} emptyLabel={ui(dictionary, "csvNoWarnings", "CSV output looks ready for conversion or cleanup.")} />
      </div>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "conversionError", "Conversion error")} message={result.error} />
      ) : (
        <>
          <ResultNextActions signals={["csv-converted"]} dictionary={dictionary} />
          <ResultBlock title={ui(dictionary, "convertedOutput", "Converted output")} value={result.value} dictionary={dictionary} />
        </>
      )}
    </div>
  );
}

const htmlEntityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function decodeEntities(value: string) {
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }
  return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

function HtmlEntityTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="HTML text"
      defaultInput={"<span>Bob & Co</span>"}
      modes={[
        { value: "encode", label: "Encode entities", transform: (value) => value.replace(/[&<>"']/g, (char) => htmlEntityMap[char] ?? char) },
        { value: "decode", label: "Decode entities", transform: decodeEntities },
      ]}
    />
  );
}

function parseColor(input: string) {
  const value = input.trim();
  const hex = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? hex.split("").map((char) => `${char}${char}`).join("") : hex;
    return {
      r: Number.parseInt(full.slice(0, 2), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      b: Number.parseInt(full.slice(4, 6), 16),
    };
  }
  const rgb = value.match(/^rgba?\(?\s*(\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})/i);
  if (rgb) {
    const color = { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
    if ([color.r, color.g, color.b].some((part) => part < 0 || part > 255)) throw new Error("RGB channels must be between 0 and 255.");
    return color;
  }
  const hsl = value.match(/^hsla?\(?\s*(\d{1,3})(?:deg)?[,\s]+(\d{1,3})%?[,\s]+(\d{1,3})%?/i);
  if (hsl) return hslToRgb({ h: Number(hsl[1]), s: Number(hsl[2]), l: Number(hsl[3]) });
  throw new Error("Use HEX, RGB, or HSL input.");
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }) {
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) throw new Error("HSL must use hue 0-360 and percentages 0-100.");
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = h / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const [r1, g1, b1] =
    huePrime < 1 ? [chroma, x, 0] : huePrime < 2 ? [x, chroma, 0] : huePrime < 3 ? [0, chroma, x] : huePrime < 4 ? [0, x, chroma] : huePrime < 5 ? [x, 0, chroma] : [chroma, 0, x];
  const m = lightness - chroma / 2;
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((part) => Math.max(0, Math.min(255, part)).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { h: 0, s: 0, l: lightness * 100 };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hue = max === rn ? ((gn - bn) / delta) % 6 : max === gn ? (bn - rn) / delta + 2 : (rn - gn) / delta + 4;
  return { h: Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60), s: saturation * 100, l: lightness * 100 };
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const colorExamples = [
  { labelKey: "blueOnWhite", fallbackLabel: "Blue on white", foreground: "#2563eb", background: "#ffffff" },
  { labelKey: "zincOnNearWhite", fallbackLabel: "Zinc on near-white", foreground: "rgb(24, 24, 27)", background: "#fafafa" },
  { labelKey: "hslAccentExample", fallbackLabel: "HSL accent", foreground: "hsl(220 90% 56%)", background: "hsl(0 0% 100%)" },
];

function formatRgbValue({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function formatHslValue(color: { r: number; g: number; b: number }) {
  const hsl = rgbToHsl(color);
  return `hsl(${hsl.h}, ${hsl.s.toFixed(1)}%, ${hsl.l.toFixed(1)}%)`;
}

function colorInputHasAlpha(value: string) {
  const input = value.trim().toLowerCase();
  return /^(rgba|hsla)\(/.test(input) || /\s\/\s*(?:0?\.\d+|1(?:\.0+)?|[1-9]\d?%|100%)\)?$/.test(input);
}

function formatPassState(passed: boolean, dictionary: ClientDictionary) {
  return passed ? ui(dictionary, "colorPass", "Pass") : ui(dictionary, "colorFail", "Fail");
}

function formatSignedDecimal(value: number) {
  const formatted = value.toFixed(2);
  return value > 0 ? `+${formatted}` : formatted;
}

function getColorContrastStatus(contrast: number, dictionary: ClientDictionary) {
  return contrast >= 7 ? "AAA" : contrast >= 4.5 ? "AA" : contrast >= 3 ? ui(dictionary, "largeTextOnly", "Large text only") : ui(dictionary, "failsContrast", "Fails");
}

function buildColorAccessibilityReport({
  foregroundInput,
  backgroundInput,
  fg,
  bg,
  contrast,
  foregroundLuminance,
  backgroundLuminance,
  hasAlphaInput,
  warnings,
  dictionary,
  checkedAt,
}: {
  foregroundInput: string;
  backgroundInput: string;
  fg: { r: number; g: number; b: number };
  bg: { r: number; g: number; b: number };
  contrast: number;
  foregroundLuminance: number;
  backgroundLuminance: number;
  hasAlphaInput: boolean;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const foregroundLabel = ui(dictionary, "foreground", "Foreground");
  const backgroundLabel = ui(dictionary, "background", "Background");
  const contrastStatus = getColorContrastStatus(contrast, dictionary);
  const yesLabel = ui(dictionary, "yes", "Yes");
  const noLabel = ui(dictionary, "no", "No");
  const alphaHandling = hasAlphaInput
    ? ui(dictionary, "colorReportAlphaReview", "Alpha input detected; recheck against the final rendered background.")
    : ui(dictionary, "colorReportAlphaNone", "No alpha input detected in the foreground/background fields.");
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "colorReportNoWarnings", "Color pair clears normal text AA. Still verify hover, disabled, and focus states.")];
  const checklist = [
    ui(dictionary, "colorReportChecklistFinalBackground", "Test the pair on the final rendered background, not only the solid preview."),
    ui(dictionary, "colorReportChecklistStates", "Check hover, focus, disabled, visited, and selected states before shipping."),
    ui(dictionary, "colorReportChecklistTextSize", "Confirm the actual font size and weight before relying on the large-text threshold."),
    ui(dictionary, "colorReportChecklistTokens", "Store foreground and background tokens together so the pair is reused intentionally."),
    ui(dictionary, "colorReportChecklistNonColor", "Do not use color alone to communicate errors, warnings, or required actions."),
  ];
  const metrics = [
    { label: ui(dictionary, "colorReportStatus", "Contrast status"), value: contrastStatus },
    { label: ui(dictionary, "contrastRatio", "Contrast ratio"), value: contrast.toFixed(2) },
    { label: ui(dictionary, "aaNormalText", "AA normal text"), value: formatPassState(contrast >= 4.5, dictionary), description: "4.5:1" },
    { label: ui(dictionary, "aaLargeText", "AA large text"), value: formatPassState(contrast >= 3, dictionary), description: "3:1" },
    { label: ui(dictionary, "aaaNormalText", "AAA normal text"), value: formatPassState(contrast >= 7, dictionary), description: "7:1" },
    { label: ui(dictionary, "colorContrastDelta", "AA delta"), value: formatSignedDecimal(contrast - 4.5) },
    { label: ui(dictionary, "luminanceGap", "Luminance gap"), value: Math.abs(foregroundLuminance - backgroundLuminance).toFixed(3) },
    { label: ui(dictionary, "colorReportAlphaInput", "Alpha input"), value: hasAlphaInput ? yesLabel : noLabel },
  ];
  const markdown = [
    `# ${ui(dictionary, "colorAccessibilityReport", "Color accessibility report")}`,
    "",
    `- ${ui(dictionary, "colorReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${foregroundLabel} ${ui(dictionary, "input", "Input")}: ${foregroundInput}`,
    `- ${foregroundLabel} HEX: ${rgbToHex(fg)}`,
    `- ${foregroundLabel} RGB: ${formatRgbValue(fg)}`,
    `- ${foregroundLabel} HSL: ${formatHslValue(fg)}`,
    `- ${backgroundLabel} ${ui(dictionary, "input", "Input")}: ${backgroundInput}`,
    `- ${backgroundLabel} HEX: ${rgbToHex(bg)}`,
    `- ${backgroundLabel} RGB: ${formatRgbValue(bg)}`,
    `- ${backgroundLabel} HSL: ${formatHslValue(bg)}`,
    `- ${ui(dictionary, "contrastRatio", "Contrast ratio")}: ${contrast.toFixed(2)}`,
    `- ${ui(dictionary, "colorReportStatus", "Contrast status")}: ${contrastStatus}`,
    `- ${ui(dictionary, "aaNormalText", "AA normal text")}: ${formatPassState(contrast >= 4.5, dictionary)} (4.5:1)`,
    `- ${ui(dictionary, "aaLargeText", "AA large text")}: ${formatPassState(contrast >= 3, dictionary)} (3:1)`,
    `- ${ui(dictionary, "aaaNormalText", "AAA normal text")}: ${formatPassState(contrast >= 7, dictionary)} (7:1)`,
    `- ${ui(dictionary, "colorContrastDelta", "AA delta")}: ${formatSignedDecimal(contrast - 4.5)}`,
    `- ${ui(dictionary, "luminanceGap", "Luminance gap")}: ${Math.abs(foregroundLuminance - backgroundLuminance).toFixed(3)}`,
    `- ${ui(dictionary, "colorReportAlphaHandling", "Alpha handling")}: ${alphaHandling}`,
    "",
    `## ${ui(dictionary, "colorReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "colorReportChecklist", "Accessibility checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function ColorConverterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [foreground, setForeground] = React.useState("#2563eb");
  const [background, setBackground] = React.useState("#ffffff");
  const result = React.useMemo(() => {
    const foregroundLabel = ui(dictionary, "foreground", "Foreground");
    const backgroundLabel = ui(dictionary, "background", "Background");
    const contrastLabel = ui(dictionary, "contrastRatio", "Contrast ratio");
    const aaNormalText = ui(dictionary, "aaNormalText", "AA normal text");
    const aaLargeText = ui(dictionary, "aaLargeText", "AA large text");
    const belowAaText = ui(dictionary, "belowAa", "Below AA");

    try {
      const fg = parseColor(foreground);
      const bg = parseColor(background);
      const foregroundLuminance = luminance(fg);
      const backgroundLuminance = luminance(bg);
      const contrast = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
      return {
        error: "",
        fg,
        bg,
        contrast,
        foregroundLuminance,
        backgroundLuminance,
        value: [
        `${foregroundLabel} HEX: ${rgbToHex(fg)}`,
        `${foregroundLabel} RGB: ${formatRgbValue(fg)}`,
        `${foregroundLabel} HSL: ${formatHslValue(fg)}`,
        `${backgroundLabel} HEX: ${rgbToHex(bg)}`,
        `${backgroundLabel} RGB: ${formatRgbValue(bg)}`,
        `${backgroundLabel} HSL: ${formatHslValue(bg)}`,
        `${contrastLabel}: ${contrast.toFixed(2)} (${contrast >= 4.5 ? aaNormalText : contrast >= 3 ? aaLargeText : belowAaText})`,
        ].join("\n"),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid color.", fg: null, bg: null, contrast: 0, foregroundLuminance: 0, backgroundLuminance: 0, value: "" };
    }
  }, [background, dictionary, foreground]);
  const contrastStatus = getColorContrastStatus(result.contrast, dictionary);
  const hasAlphaInput = colorInputHasAlpha(foreground) || colorInputHasAlpha(background);
  const colorWarnings = [
    result.error,
    !result.error && hasAlphaInput ? ui(dictionary, "colorAlphaIgnoredWarning", "Alpha channels are not blended here. Test against the final rendered background before shipping.") : "",
    !result.error && result.contrast <= 1.1 ? ui(dictionary, "colorSameColorWarning", "Foreground and background are nearly identical, so text will be unreadable.") : "",
    !result.error && result.contrast >= 3 && result.contrast < 4.5 ? ui(dictionary, "colorLargeOnlyWarning", "This pair only meets the large-text AA threshold. Do not use it for normal body text.") : "",
    !result.error && result.contrast < 3 ? ui(dictionary, "colorContrastWarning", "Normal body text should reach at least 4.5:1 contrast.") : "",
    !result.error && result.contrast >= 4.5 && result.contrast < 7 ? ui(dictionary, "colorAaaWarning", "AA passes, but AAA text requires 7:1 contrast.") : "",
  ].filter(Boolean);
  const diagnosticItems = [
    { label: ui(dictionary, "aaNormalText", "AA normal text"), value: result.error ? "-" : formatPassState(result.contrast >= 4.5, dictionary), description: "4.5:1" },
    { label: ui(dictionary, "aaLargeText", "AA large text"), value: result.error ? "-" : formatPassState(result.contrast >= 3, dictionary), description: "3:1" },
    { label: ui(dictionary, "aaaNormalText", "AAA normal text"), value: result.error ? "-" : formatPassState(result.contrast >= 7, dictionary), description: "7:1" },
    {
      label: ui(dictionary, "colorContrastDelta", "AA delta"),
      value: result.error ? "-" : formatSignedDecimal(result.contrast - 4.5),
      description: ui(dictionary, "colorContrastDeltaDescription", "Positive values clear normal text AA."),
    },
    {
      label: ui(dictionary, "luminanceGap", "Luminance gap"),
      value: result.error ? "-" : Math.abs(result.foregroundLuminance - result.backgroundLuminance).toFixed(3),
      description: ui(dictionary, "luminanceGapDescription", "Higher gaps usually read more clearly."),
    },
  ];
  const accessibilityReport = result.fg && result.bg
    ? buildColorAccessibilityReport({
        foregroundInput: foreground,
        backgroundInput: background,
        fg: result.fg,
        bg: result.bg,
        contrast: result.contrast,
        foregroundLuminance: result.foregroundLuminance,
        backgroundLuminance: result.backgroundLuminance,
        hasAlphaInput,
        warnings: colorWarnings,
        dictionary,
        checkedAt: ui(dictionary, "colorReportCopyTime", "Browser copy time"),
      })
    : null;

  return (
    <div className="space-y-4" data-color-tool>
      <div className="space-y-2" data-color-examples>
        <p className="text-sm font-medium">{ui(dictionary, "colorExamples", "Color examples")}</p>
        <div className="flex flex-wrap gap-2">
          {colorExamples.map((example) => (
            <Button
              key={example.labelKey}
              variant="outline"
              size="sm"
              onClick={() => {
                setForeground(example.foreground);
                setBackground(example.background);
              }}
            >
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "foreground", "Foreground")}</span>
          <Input value={foreground} onChange={(event) => setForeground(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "background", "Background")}</span>
          <Input value={background} onChange={(event) => setBackground(event.target.value)} />
        </label>
      </div>
      <div className="rounded-md border p-4 text-sm" style={{ color: result.error ? undefined : foreground, backgroundColor: result.error ? undefined : background }} data-color-preview>
        {ui(dictionary, "contrastPreviewText", "Preview text for contrast checking.")}
      </div>
      <div data-color-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "contrastRatio", "Contrast ratio"), value: result.error ? "-" : result.contrast.toFixed(2), description: contrastStatus },
            { label: ui(dictionary, "foreground", "Foreground"), value: result.fg ? rgbToHex(result.fg) : foreground },
            { label: ui(dictionary, "background", "Background"), value: result.bg ? rgbToHex(result.bg) : background },
            { label: ui(dictionary, "wcagTarget", "WCAG target"), value: "AA 4.5:1 / AAA 7:1", description: ui(dictionary, "wcagTargetDescription", "Use 3:1 only for large or bold text.") },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-color-diagnostics>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "colorDiagnostics", "Color diagnostics")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "colorDiagnosticsDescription", "Check AA/AAA thresholds, alpha limitations, and luminance before copying design tokens.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={diagnosticItems} />
          <div data-color-warnings>
            <ToolWarningList title={ui(dictionary, "colorReviewNotes", "Color review notes")} warnings={colorWarnings} emptyLabel={ui(dictionary, "colorNoDiagnosticWarnings", "Color pair clears normal text AA. Still verify hover, disabled, and focus states.")} />
          </div>
        </div>
      </section>
      {accessibilityReport ? (
        <section className="space-y-3 rounded-md border bg-card p-3" data-color-accessibility-report>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{ui(dictionary, "colorAccessibilityReport", "Color accessibility report")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "colorAccessibilityReportDescription", "Copy a WCAG contrast handoff report with color values, thresholds, warnings, and accessibility checks.")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  buildColorAccessibilityReport({
                    foregroundInput: foreground,
                    backgroundInput: background,
                    fg: result.fg!,
                    bg: result.bg!,
                    contrast: result.contrast,
                    foregroundLuminance: result.foregroundLuminance,
                    backgroundLuminance: result.backgroundLuminance,
                    hasAlphaInput,
                    warnings: colorWarnings,
                    dictionary,
                    checkedAt: new Date().toISOString(),
                  }).markdown,
                )
              }
              data-color-accessibility-report-copy
            >
              <Copy className="mr-2 h-4 w-4" />
              {ui(dictionary, "copyColorAccessibilityReport", "Copy accessibility report")}
            </Button>
          </div>
          <ToolMetricGrid items={accessibilityReport.metrics} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "colorReportReviewNotes", "Review notes")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {accessibilityReport.reviewNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "colorReportChecklist", "Accessibility checklist")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {accessibilityReport.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-color-accessibility-report-preview>
            {accessibilityReport.markdown}
          </pre>
        </section>
      ) : null}
      <section className="grid gap-3 md:grid-cols-2" data-color-swatches>
        {[
          { label: ui(dictionary, "foreground", "Foreground"), color: result.fg ? rgbToHex(result.fg) : foreground },
          { label: ui(dictionary, "background", "Background"), color: result.bg ? rgbToHex(result.bg) : background },
        ].map((item) => (
          <div key={item.label} className="rounded-md border bg-card p-3">
            <div className="h-12 rounded border" style={{ backgroundColor: item.color }} />
            <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
            <p className="break-all text-sm font-semibold">{item.color}</p>
          </div>
        ))}
      </section>
      {result.error ? <ErrorAlert title={ui(dictionary, "invalidColor", "Invalid color")} message={result.error} /> : <ResultBlock title={ui(dictionary, "colorValues", "Color values")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

const passwordCharacterSets = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};
const ambiguousPasswordCharacters = new Set("0Ool1I|`'\"{}[]()/\\");
const passphraseWords = [
  "anchor",
  "brisk",
  "copper",
  "delta",
  "ember",
  "forest",
  "granite",
  "harbor",
  "ivory",
  "jupiter",
  "keystone",
  "lantern",
  "matrix",
  "nebula",
  "orbit",
  "pixel",
  "quartz",
  "river",
  "signal",
  "timber",
  "uplink",
  "vector",
  "willow",
  "zenith",
  "atlas",
  "binary",
  "cipher",
  "drift",
  "echo",
  "frost",
  "garden",
  "helium",
  "island",
  "kernel",
  "ledger",
  "meadow",
  "north",
  "onyx",
  "prairie",
  "rocket",
  "summit",
  "tundra",
  "violet",
  "window",
  "yellow",
  "zephyr",
];

type PasswordMode = "password" | "passphrase";

function cleanPasswordSet(value: string, excludeAmbiguous: boolean) {
  return excludeAmbiguous
    ? value
        .split("")
        .filter((char) => !ambiguousPasswordCharacters.has(char))
        .join("")
    : value;
}

function secureCharacterFrom(value: string) {
  if (!value.length) return "";
  return value[randomBytes(1)[0] % value.length] ?? "";
}

function shuffleSecure(values: string[]) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomBytes(1)[0] % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.join("");
}

function makePassphrase(wordCount: number, separator: string, includeNumber: boolean) {
  const words = Array.from(randomBytes(wordCount), (byte) => passphraseWords[byte % passphraseWords.length] ?? passphraseWords[0]!);
  const suffix = includeNumber ? String(randomBytes(1)[0] % 100).padStart(2, "0") : "";
  return [...words, suffix].filter(Boolean).join(separator);
}

function describeEntropy(dictionary: ClientDictionary, entropy: number) {
  if (entropy >= 120) return ui(dictionary, "passwordStrengthExcellent", "Excellent");
  if (entropy >= 90) return ui(dictionary, "passwordStrengthStrong", "Strong");
  if (entropy >= 70) return ui(dictionary, "passwordStrengthGood", "Good");
  return ui(dictionary, "passwordStrengthWeak", "Needs more length");
}

function buildPasswordReport({
  mode,
  safeLength,
  safeWordCount,
  alphabetLength,
  selectedSetCount,
  symbols,
  excludeAmbiguous,
  includeNumber,
  separator,
  entropy,
  value,
  warnings,
  dictionary,
  checkedAt,
}: {
  mode: PasswordMode;
  safeLength: number;
  safeWordCount: number;
  alphabetLength: number;
  selectedSetCount: number;
  symbols: boolean;
  excludeAmbiguous: boolean;
  includeNumber: boolean;
  separator: string;
  entropy: number;
  value: string;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const roundedEntropy = Math.round(entropy);
  const modeLabel = mode === "passphrase" ? ui(dictionary, "passwordModePassphrase", "Passphrase") : ui(dictionary, "passwordModeRandom", "Random password");
  const yesLabel = ui(dictionary, "yes", "Yes");
  const noLabel = ui(dictionary, "no", "No");
  const lengthLabel = mode === "passphrase" ? ui(dictionary, "passphraseWords", "Words") : ui(dictionary, "length", "Length");
  const lengthValue = mode === "passphrase" ? String(safeWordCount) : String(safeLength);
  const complexityLabel = mode === "passphrase" ? ui(dictionary, "passphraseWordList", "Word list") : ui(dictionary, "charsetSize", "Charset size");
  const complexityValue = mode === "passphrase" ? String(passphraseWords.length) : String(alphabetLength);
  const compatibilityLabel = mode === "passphrase" ? ui(dictionary, "passphraseIncludeNumber", "Include number") : ui(dictionary, "symbols", "Symbols");
  const compatibilityValue = mode === "passphrase" ? (includeNumber ? yesLabel : noLabel) : symbols ? yesLabel : noLabel;
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "passwordReportNoWarnings", "No obvious password generation warnings detected. Store and rotate the secret deliberately.")];
  const checklist = [
    ui(dictionary, "passwordReportChecklistStore", "Store the generated secret in a password manager before sharing access."),
    ui(dictionary, "passwordReportChecklistUnique", "Use a unique password or passphrase for each account or environment."),
    ui(dictionary, "passwordReportChecklistPolicy", "Confirm the target accepts this length, symbols, separator, and passphrase shape."),
    ui(dictionary, "passwordReportChecklistRotate", "Record where the secret is used so it can be rotated later."),
    ui(dictionary, "passwordReportChecklistNoLogs", "Do not paste live credentials into logs, tickets, analytics, or screenshots."),
  ];
  const metrics = [
    { label: ui(dictionary, "passwordReportMode", "Mode"), value: modeLabel },
    { label: lengthLabel, value: lengthValue },
    { label: ui(dictionary, "entropyEstimate", "Entropy estimate"), value: `${roundedEntropy} bits`, description: describeEntropy(dictionary, entropy) },
    { label: complexityLabel, value: complexityValue },
    ...(mode === "password" ? [{ label: ui(dictionary, "characterGroups", "Character groups"), value: String(selectedSetCount) }] : []),
    { label: compatibilityLabel, value: compatibilityValue },
    { label: ui(dictionary, "avoidAmbiguous", "Avoid ambiguous"), value: mode === "password" && excludeAmbiguous ? yesLabel : mode === "password" ? noLabel : ui(dictionary, "notApplicable", "Not applicable") },
    { label: ui(dictionary, "generatedLocally", "Generated locally"), value: yesLabel },
    { label: ui(dictionary, "passwordReportValuePolicy", "Password included"), value: ui(dictionary, "passwordReportValueExcluded", "No, only password metrics, mode, and handling checks are included.") },
  ];
  const markdown = [
    `# ${ui(dictionary, "passwordReport", "Password safety report")}`,
    "",
    `- ${ui(dictionary, "passwordReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "passwordReportMode", "Mode")}: ${modeLabel}`,
    `- ${lengthLabel}: ${lengthValue}`,
    `- ${ui(dictionary, "entropyEstimate", "Entropy estimate")}: ${roundedEntropy} bits`,
    `- ${complexityLabel}: ${complexityValue}`,
    `- ${ui(dictionary, "generatedLocally", "Generated locally")}: ${yesLabel}`,
    `- ${ui(dictionary, "encodedLength", "Encoded length")}: ${value.length}`,
    `- ${ui(dictionary, "passwordReportValuePolicy", "Password included")}: ${ui(dictionary, "passwordReportValueExcluded", "No, only password metrics, mode, and handling checks are included.")}`,
    ...(mode === "passphrase" ? [`- ${ui(dictionary, "passphraseSeparator", "Separator")}: ${separator === " " ? ui(dictionary, "passphraseSeparatorSpace", "space") : separator}`] : []),
    "",
    `## ${ui(dictionary, "passwordReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "passwordReportChecklist", "Secret handling checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function PasswordGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [mode, setMode] = React.useState<PasswordMode>("password");
  const [length, setLength] = React.useState(24);
  const [symbols, setSymbols] = React.useState(true);
  const [uppercase, setUppercase] = React.useState(true);
  const [numbers, setNumbers] = React.useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = React.useState(true);
  const [wordCount, setWordCount] = React.useState(5);
  const [separator, setSeparator] = React.useState("-");
  const [includeNumber, setIncludeNumber] = React.useState(true);
  const [value, setValue] = React.useState("");
  const selectedSets = React.useMemo(() => {
    const sets = [cleanPasswordSet(passwordCharacterSets.lower, excludeAmbiguous)];
    if (uppercase) sets.push(cleanPasswordSet(passwordCharacterSets.upper, excludeAmbiguous));
    if (numbers) sets.push(cleanPasswordSet(passwordCharacterSets.numbers, excludeAmbiguous));
    if (symbols) sets.push(cleanPasswordSet(passwordCharacterSets.symbols, excludeAmbiguous));
    return sets.filter(Boolean);
  }, [excludeAmbiguous, numbers, symbols, uppercase]);
  const alphabet = selectedSets.join("");
  const safeLength = clampInteger(length, 8, 128);
  const safeWordCount = clampInteger(wordCount, 3, 8);
  const passphraseEntropy = safeWordCount * Math.log2(passphraseWords.length) + (includeNumber ? Math.log2(100) : 0);
  const entropy = mode === "passphrase" ? passphraseEntropy : alphabet.length > 0 ? safeLength * Math.log2(alphabet.length) : 0;
  const generate = React.useCallback(() => {
    if (mode === "passphrase") {
      setValue(makePassphrase(safeWordCount, separator, includeNumber));
      return;
    }
    const activeAlphabet = alphabet || passwordCharacterSets.lower;
    const required = selectedSets.map(secureCharacterFrom).filter(Boolean);
    const remainingLength = Math.max(0, safeLength - required.length);
    const remaining = Array.from(randomBytes(remainingLength), (byte) => activeAlphabet[byte % activeAlphabet.length] ?? "");
    setValue(shuffleSecure([...required, ...remaining]));
  }, [alphabet, includeNumber, mode, safeLength, safeWordCount, selectedSets, separator]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const selectedSetCount = selectedSets.length;
  const warnings = React.useMemo(
    () =>
      [
        mode === "password" && safeLength < 16 ? ui(dictionary, "passwordShortWarning", "Use at least 16 characters for reusable credentials.") : "",
        mode === "password" && selectedSetCount < 3 ? ui(dictionary, "passwordCharsetWarning", "Use at least three character groups unless the target system restricts them.") : "",
        mode === "password" && !symbols ? ui(dictionary, "passwordNoSymbolsWarning", "Symbols are disabled. Confirm the target accepts longer passwords if symbols are not allowed.") : "",
        mode === "passphrase" && safeWordCount < 4 ? ui(dictionary, "passphraseShortWarning", "Use at least four words for reusable passphrases.") : "",
        mode === "passphrase" ? ui(dictionary, "passphraseCompatibilityWarning", "Some systems reject spaces or long passphrases. Confirm the target policy before copying.") : "",
        ui(dictionary, "passwordStorageWarning", "Store generated secrets in a password manager. Do not paste production secrets into logs or tickets."),
      ].filter(Boolean),
    [dictionary, mode, safeLength, safeWordCount, selectedSetCount, symbols],
  );
  const passwordReport = React.useMemo(
    () =>
      buildPasswordReport({
        mode,
        safeLength,
        safeWordCount,
        alphabetLength: alphabet.length || passwordCharacterSets.lower.length,
        selectedSetCount,
        symbols,
        excludeAmbiguous,
        includeNumber,
        separator,
        entropy,
        value,
        warnings,
        dictionary,
        checkedAt: ui(dictionary, "passwordReportCopyTime", "Browser copy time"),
      }),
    [alphabet.length, dictionary, entropy, excludeAmbiguous, includeNumber, mode, safeLength, safeWordCount, selectedSetCount, separator, symbols, value, warnings],
  );

  return (
    <div className="space-y-4" data-password-tool>
      <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]" data-password-mode>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "passwordMode", "Password mode")}</span>
          <Select value={mode} onChange={(event) => setMode(event.target.value as PasswordMode)}>
            <option value="password">{ui(dictionary, "passwordModeRandom", "Random password")}</option>
            <option value="passphrase">{ui(dictionary, "passwordModePassphrase", "Passphrase")}</option>
          </Select>
        </label>
        <div className="rounded-md border bg-card p-3 text-sm text-muted-foreground">
          {mode === "passphrase"
            ? ui(dictionary, "passphraseModeDescription", "Generate memorable word-based secrets for systems that allow longer values.")
            : ui(dictionary, "passwordModeDescription", "Generate high-entropy random character strings for credential fields.")}
        </div>
      </div>
      {mode === "password" ? (
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-[160px_120px_120px_120px_160px_auto]" data-password-options>
          <label className="space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "length", "Length")}</span>
            <Input type="number" min={8} max={128} value={length} onChange={(event) => setLength(Number(event.target.value))} />
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} />
            {ui(dictionary, "uppercase", "Uppercase")}
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={numbers} onChange={(event) => setNumbers(event.target.checked)} />
            {ui(dictionary, "numbers", "Numbers")}
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />
            {ui(dictionary, "symbols", "Symbols")}
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={excludeAmbiguous} onChange={(event) => setExcludeAmbiguous(event.target.checked)} />
            {ui(dictionary, "avoidAmbiguous", "Avoid ambiguous")}
          </label>
          <div className="flex items-end">
            <Button onClick={generate}>{ui(dictionary, "generate", "Generate")}</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-[160px_160px_160px_auto]" data-password-passphrase-options>
          <label className="space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "passphraseWords", "Words")}</span>
            <Input type="number" min={3} max={8} value={wordCount} onChange={(event) => setWordCount(Number(event.target.value))} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "passphraseSeparator", "Separator")}</span>
            <Select value={separator} onChange={(event) => setSeparator(event.target.value)}>
              <option value="-">-</option>
              <option value=".">.</option>
              <option value="_">_</option>
              <option value=" ">{ui(dictionary, "passphraseSeparatorSpace", "space")}</option>
            </Select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={includeNumber} onChange={(event) => setIncludeNumber(event.target.checked)} />
            {ui(dictionary, "passphraseIncludeNumber", "Include number")}
          </label>
          <div className="flex items-end">
            <Button onClick={generate}>{ui(dictionary, "generate", "Generate")}</Button>
          </div>
        </div>
      )}
      <div data-password-strength>
        <ToolMetricGrid
          items={[
            { label: mode === "passphrase" ? ui(dictionary, "passphraseWordList", "Word list") : ui(dictionary, "charsetSize", "Charset size"), value: String(mode === "passphrase" ? passphraseWords.length : alphabet.length || passwordCharacterSets.lower.length) },
            { label: ui(dictionary, "entropyEstimate", "Entropy estimate"), value: `${Math.round(entropy)} bits`, description: describeEntropy(dictionary, entropy) },
            { label: mode === "passphrase" ? ui(dictionary, "passphraseWords", "Words") : ui(dictionary, "characterGroups", "Character groups"), value: String(mode === "passphrase" ? safeWordCount : selectedSetCount) },
            { label: ui(dictionary, "generatedLocally", "Generated locally"), value: ui(dictionary, "yes", "Yes") },
          ]}
        />
      </div>
      <div data-password-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "passwordNoWarnings", "Password settings look strong for local generation.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-password-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{ui(dictionary, "passwordReport", "Password safety report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "passwordReportDescription", "Copy a safe password handoff report without including the generated password or passphrase.")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-password-report-copy
            onClick={() =>
              copyToClipboard(
                buildPasswordReport({
                  mode,
                  safeLength,
                  safeWordCount,
                  alphabetLength: alphabet.length || passwordCharacterSets.lower.length,
                  selectedSetCount,
                  symbols,
                  excludeAmbiguous,
                  includeNumber,
                  separator,
                  entropy,
                  value,
                  warnings,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
          >
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyPasswordReport", "Copy password report")}
          </Button>
        </div>
        <ToolMetricGrid items={passwordReport.metrics} />
        <ToolWarningList title={ui(dictionary, "passwordReportReviewNotes", "Review notes")} warnings={passwordReport.reviewNotes} emptyLabel={ui(dictionary, "passwordReportNoWarnings", "No obvious password generation warnings detected. Store and rotate the secret deliberately.")} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "passwordReportChecklist", "Secret handling checklist")}</p>
          <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {passwordReport.checklist.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-password-report-preview>
          <code>{passwordReport.markdown}</code>
        </pre>
      </section>
      <ResultBlock title={mode === "passphrase" ? ui(dictionary, "passwordModePassphrase", "Passphrase") : ui(dictionary, "password", "Password")} value={value} dictionary={dictionary} />
    </div>
  );
}

const qrExamples = [
  { labelKey: "qrWebsiteExample", fallbackLabel: "Website", value: "https://www.bobob.app" },
  { labelKey: "qrWifiExample", fallbackLabel: "Wi-Fi", value: "WIFI:T:WPA;S:Guest Network;P:example-password;;" },
  { labelKey: "qrEmailExample", fallbackLabel: "Email", value: "mailto:hello@example.com?subject=Demo" },
  { labelKey: "qrVcardExample", fallbackLabel: "vCard", value: "BEGIN:VCARD\nVERSION:3.0\nFN:Bob\nURL:https://www.bobob.app\nEND:VCARD" },
];

type QrBuilderMode = "url" | "wifi" | "email" | "vcard";

function escapeWifiQrValue(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function buildMailto(to: string, subject: string, body: string) {
  const params = new URLSearchParams();
  if (subject.trim()) params.set("subject", subject.trim());
  if (body.trim()) params.set("body", body.trim());
  const query = params.toString();
  return `mailto:${to.trim()}${query ? `?${query}` : ""}`;
}

function buildVcard({ name, org, phone, email, url }: { name: string; org: string; phone: string; email: string; url: string }) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name.trim() || "Bob"}`,
    org.trim() ? `ORG:${org.trim()}` : "",
    phone.trim() ? `TEL:${phone.trim()}` : "",
    email.trim() ? `EMAIL:${email.trim()}` : "",
    url.trim() ? `URL:${url.trim()}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

function downloadDataUrl(dataUrl: string, filename: string) {
  if (!dataUrl || typeof document === "undefined") return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

function getQrPayloadInfo(value: string, errorCorrection: "L" | "M" | "Q" | "H") {
  const trimmed = value.trim();
  const bytes = byteLength(trimmed);
  let typeKey = "qrPlainTextType";
  let destinationHost = "—";
  let trackingParams = 0;

  if (/^WIFI:/i.test(trimmed)) {
    typeKey = "qrWifiType";
  } else if (/^BEGIN:VCARD/i.test(trimmed)) {
    typeKey = "qrVcardType";
  } else if (/^mailto:/i.test(trimmed)) {
    typeKey = "qrEmailType";
  } else if (/^tel:/i.test(trimmed)) {
    typeKey = "qrPhoneType";
  } else if (/^sms:/i.test(trimmed)) {
    typeKey = "qrSmsType";
  } else {
    try {
      const parsed = new URL(trimmed);
      typeKey = "qrUrlType";
      destinationHost = parsed.hostname || "—";
      trackingParams = Array.from(parsed.searchParams.keys()).filter((key) => /^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$)/i.test(key)).length;
    } catch {
      if (/^[\w.-]+\.[a-z]{2,}(?:\/|$)/i.test(trimmed)) {
        typeKey = "qrUrlWithoutProtocolType";
        destinationHost = trimmed.split(/[/?#]/)[0] ?? "—";
      }
    }
  }

  const densityKey = bytes > 900 ? "qrDensityHigh" : bytes > 240 ? "qrDensityMedium" : "qrDensityLow";
  const errorCorrectionKey = {
    L: "qrErrorCorrectionLow",
    M: "qrErrorCorrectionMedium",
    Q: "qrErrorCorrectionQuartile",
    H: "qrErrorCorrectionHigh",
  }[errorCorrection];

  return {
    typeKey,
    destinationHost,
    trackingParams,
    densityKey,
    errorCorrectionKey,
    lineCount: trimmed ? trimmed.split(/\r?\n/).length : 0,
  };
}

function buildQrScanReport({
  input,
  payloadInfo,
  errorCorrection,
  qrSize,
  qrMargin,
  warnings,
  dictionary,
  checkedAt,
}: {
  input: string;
  payloadInfo: ReturnType<typeof getQrPayloadInfo>;
  errorCorrection: "L" | "M" | "Q" | "H";
  qrSize: string;
  qrMargin: string;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const characters = input.length;
  const bytes = byteLength(input);
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "qrScanReportNoWarnings", "No QR scan review warnings detected. Test the image on target devices before publishing.")];
  const checklist = [
    ui(dictionary, "qrScanChecklistDevices", "Scan the final PNG on at least two phones before printing or posting."),
    ui(dictionary, "qrScanChecklistDestination", "Confirm the destination opens the expected page or app action."),
    ui(dictionary, "qrScanChecklistWifi", "For Wi-Fi QR codes, share only in places where the network password can be public."),
    ui(dictionary, "qrScanChecklistQuietZone", "Keep the quiet zone clear after resizing, cropping, or placing the image in artwork."),
    ui(dictionary, "qrScanChecklistProtocol", "Use HTTPS for public web URLs unless the target is intentionally local."),
  ];
  const payloadTypeLabel = ui(dictionary, payloadInfo.typeKey, payloadInfo.typeKey);
  const densityLabel = ui(dictionary, payloadInfo.densityKey, payloadInfo.densityKey);
  const errorCorrectionLabel = `${errorCorrection} · ${ui(dictionary, payloadInfo.errorCorrectionKey, payloadInfo.errorCorrectionKey)}`;
  const imageSettings = `${qrSize}px / ${ui(dictionary, "qrQuietZone", "Quiet zone")} ${qrMargin}`;
  const metrics = [
    { label: ui(dictionary, "qrPayloadType", "Payload type"), value: payloadTypeLabel },
    { label: ui(dictionary, "characters", "Characters"), value: String(characters) },
    { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(bytes) },
    { label: ui(dictionary, "qrDestinationHost", "Destination host"), value: payloadInfo.destinationHost },
    { label: ui(dictionary, "qrTrackingParameters", "Tracking parameters"), value: String(payloadInfo.trackingParams) },
    { label: ui(dictionary, "qrScanDensity", "Scan density"), value: densityLabel },
    { label: ui(dictionary, "errorCorrection", "Error correction"), value: errorCorrectionLabel },
    { label: ui(dictionary, "qrImageSize", "Image size"), value: imageSettings },
    { label: ui(dictionary, "qrReportInputPolicy", "Payload included"), value: ui(dictionary, "qrReportInputExcluded", "No, only payload metrics, type, and destination host are included.") },
  ];
  const markdown = [
    `# ${ui(dictionary, "qrScanReport", "QR scan report")}`,
    "",
    `- ${ui(dictionary, "qrReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "qrPayloadType", "Payload type")}: ${payloadTypeLabel}`,
    `- ${ui(dictionary, "characters", "Characters")}: ${characters}`,
    `- ${ui(dictionary, "inputBytes", "Input bytes")}: ${bytes}`,
    `- ${ui(dictionary, "qrDestinationHost", "Destination host")}: ${payloadInfo.destinationHost}`,
    `- ${ui(dictionary, "qrTrackingParameters", "Tracking parameters")}: ${payloadInfo.trackingParams}`,
    `- ${ui(dictionary, "qrScanDensity", "Scan density")}: ${densityLabel}`,
    `- ${ui(dictionary, "errorCorrection", "Error correction")}: ${errorCorrectionLabel}`,
    `- ${ui(dictionary, "qrImageSize", "Image size")}: ${imageSettings}`,
    `- ${ui(dictionary, "qrReportInputPolicy", "Payload included")}: ${ui(dictionary, "qrReportInputExcluded", "No, only payload metrics, type, and destination host are included.")}`,
    "",
    `## ${ui(dictionary, "qrReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "qrReportChecklist", "Scan checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function QrCodeTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("https://www.bobob.app");
  const [errorCorrection, setErrorCorrection] = React.useState<"L" | "M" | "Q" | "H">("M");
  const [qrSize, setQrSize] = React.useState("320");
  const [qrMargin, setQrMargin] = React.useState("2");
  const [builderMode, setBuilderMode] = React.useState<QrBuilderMode>("url");
  const [qrUrl, setQrUrl] = React.useState("https://www.bobob.app");
  const [wifiSecurity, setWifiSecurity] = React.useState("WPA");
  const [wifiSsid, setWifiSsid] = React.useState("Guest Network");
  const [wifiPassword, setWifiPassword] = React.useState("example-password");
  const [wifiHidden, setWifiHidden] = React.useState(false);
  const [emailTo, setEmailTo] = React.useState("hello@example.com");
  const [emailSubject, setEmailSubject] = React.useState("Demo");
  const [emailBody, setEmailBody] = React.useState("");
  const [vcardName, setVcardName] = React.useState("Bob");
  const [vcardOrg, setVcardOrg] = React.useState("Bob's Multi Tool");
  const [vcardPhone, setVcardPhone] = React.useState("");
  const [vcardEmail, setVcardEmail] = React.useState("hello@example.com");
  const [vcardUrl, setVcardUrl] = React.useState("https://www.bobob.app");
  const [dataUrl, setDataUrl] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    if (!input.trim()) {
      setDataUrl("");
      return () => {
        mounted = false;
      };
    }
    QRCode.toDataURL(input, { errorCorrectionLevel: errorCorrection, margin: Number(qrMargin), width: Number(qrSize) })
      .then((value) => {
        if (mounted) setDataUrl(value);
      })
      .catch(() => {
        if (mounted) setDataUrl("");
      });
    return () => {
      mounted = false;
    };
  }, [errorCorrection, input, qrMargin, qrSize]);

  const trimmed = input.trim();
  const builderPayload = React.useMemo(() => {
    if (builderMode === "wifi") {
      const type = wifiSecurity === "nopass" ? "nopass" : wifiSecurity;
      const passwordPart = type === "nopass" ? "" : `P:${escapeWifiQrValue(wifiPassword)};`;
      const hiddenPart = wifiHidden ? "H:true;" : "";
      return `WIFI:T:${type};S:${escapeWifiQrValue(wifiSsid)};${passwordPart}${hiddenPart};`;
    }
    if (builderMode === "email") return buildMailto(emailTo, emailSubject, emailBody);
    if (builderMode === "vcard") return buildVcard({ name: vcardName, org: vcardOrg, phone: vcardPhone, email: vcardEmail, url: vcardUrl });
    return qrUrl.trim();
  }, [builderMode, emailBody, emailSubject, emailTo, qrUrl, vcardEmail, vcardName, vcardOrg, vcardPhone, vcardUrl, wifiHidden, wifiPassword, wifiSecurity, wifiSsid]);
  const payloadInfo = React.useMemo(() => getQrPayloadInfo(trimmed, errorCorrection), [errorCorrection, trimmed]);
  const qrWarnings = [
    trimmed.length === 0 ? ui(dictionary, "qrEmptyWarning", "Enter content before generating a QR code.") : "",
    payloadInfo.typeKey === "qrUrlWithoutProtocolType" || /^www\./i.test(trimmed) ? ui(dictionary, "qrProtocolWarning", "Add https:// before web domains so scanners open the expected URL.") : "",
    /^http:\/\//i.test(trimmed) ? ui(dictionary, "qrHttpWarning", "The QR opens an HTTP URL. Use HTTPS for public pages when possible.") : "",
    /^WIFI:/i.test(trimmed) ? ui(dictionary, "qrWifiWarning", "Wi-Fi QR codes expose the network password to anyone who can scan the image.") : "",
    /^BEGIN:VCARD/i.test(trimmed) ? ui(dictionary, "qrVcardWarning", "vCard QR codes can expose personal contact data. Review every field before sharing.") : "",
    /^mailto:/i.test(trimmed) ? ui(dictionary, "qrEmailWarning", "mailto QR codes depend on the scanner's mail app and may not preserve every query parameter.") : "",
    payloadInfo.trackingParams > 0 ? ui(dictionary, "qrTrackingWarning", "Tracking parameters are present. Confirm analytics tags are intentional before download.") : "",
    byteLength(trimmed) > 900 ? ui(dictionary, "qrLongContentWarning", "Long content creates dense QR codes. Test scan quality before publishing.") : "",
    errorCorrection === "H" && byteLength(trimmed) > 700 ? ui(dictionary, "qrHighCorrectionWarning", "High error correction with long content can make the code very dense.") : "",
    ui(dictionary, "qrLocalWarning", "The QR image is generated locally in the browser; only the encoded content is visible in the PNG."),
  ].filter(Boolean);
  const scanReport = React.useMemo(
    () =>
      buildQrScanReport({
        input: trimmed,
        payloadInfo,
        errorCorrection,
        qrSize,
        qrMargin,
        warnings: qrWarnings,
        dictionary,
        checkedAt: ui(dictionary, "qrReportCopyTime", "Browser copy time"),
      }),
    [dictionary, errorCorrection, payloadInfo, qrMargin, qrSize, qrWarnings, trimmed],
  );

  return (
    <div className="space-y-4" data-qr-tool>
      <div className="space-y-2" data-qr-examples>
        <p className="text-sm font-medium">{ui(dictionary, "qrExamples", "QR examples")}</p>
        <div className="flex flex-wrap gap-2">
          {qrExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_130px_130px]">
        <label className="block space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "qrContent", "QR content")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "errorCorrection", "Error correction")}</span>
          <Select value={errorCorrection} onChange={(event) => setErrorCorrection(event.target.value as "L" | "M" | "Q" | "H")}>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="Q">Q</option>
            <option value="H">H</option>
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "qrImageSize", "Image size")}</span>
          <Select value={qrSize} onChange={(event) => setQrSize(event.target.value)}>
            <option value="256">256px</option>
            <option value="320">320px</option>
            <option value="512">512px</option>
            <option value="768">768px</option>
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "qrQuietZone", "Quiet zone")}</span>
          <Select value={qrMargin} onChange={(event) => setQrMargin(event.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </Select>
        </label>
      </div>
      <section className="rounded-md border bg-card p-3" data-qr-payload-builder>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{ui(dictionary, "qrPayloadBuilder", "Payload builder")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "qrPayloadBuilderDescription", "Build URL, Wi-Fi, email, or vCard payloads before generating the QR image.")}</p>
          </div>
          <Button size="sm" onClick={() => setInput(builderPayload)}>
            {ui(dictionary, "applyQrPayload", "Apply payload")}
          </Button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]" data-qr-builder-fields>
          <label className="space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "qrPayloadMode", "Payload type")}</span>
            <Select value={builderMode} onChange={(event) => setBuilderMode(event.target.value as QrBuilderMode)}>
              <option value="url">{ui(dictionary, "qrModeUrl", "URL")}</option>
              <option value="wifi">{ui(dictionary, "qrModeWifi", "Wi-Fi")}</option>
              <option value="email">{ui(dictionary, "qrModeEmail", "Email")}</option>
              <option value="vcard">{ui(dictionary, "qrModeVcard", "vCard")}</option>
            </Select>
          </label>
          {builderMode === "url" ? (
            <label className="space-y-2">
              <span className="text-sm font-medium">{ui(dictionary, "qrUrlValue", "URL")}</span>
              <Input value={qrUrl} onChange={(event) => setQrUrl(event.target.value)} />
            </label>
          ) : null}
          {builderMode === "wifi" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrWifiSsid", "Network name")}</span>
                <Input value={wifiSsid} onChange={(event) => setWifiSsid(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrWifiSecurity", "Security")}</span>
                <Select value={wifiSecurity} onChange={(event) => setWifiSecurity(event.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{ui(dictionary, "qrWifiNoPassword", "No password")}</option>
                </Select>
              </label>
              {wifiSecurity !== "nopass" ? (
                <label className="space-y-2">
                  <span className="text-sm font-medium">{ui(dictionary, "qrWifiPassword", "Password")}</span>
                  <Input value={wifiPassword} onChange={(event) => setWifiPassword(event.target.value)} />
                </label>
              ) : null}
              <label className="flex items-end gap-2 pb-2 text-sm">
                <input type="checkbox" checked={wifiHidden} onChange={(event) => setWifiHidden(event.target.checked)} />
                {ui(dictionary, "qrWifiHidden", "Hidden network")}
              </label>
            </div>
          ) : null}
          {builderMode === "email" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrEmailTo", "Email to")}</span>
                <Input value={emailTo} onChange={(event) => setEmailTo(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrEmailSubject", "Subject")}</span>
                <Input value={emailSubject} onChange={(event) => setEmailSubject(event.target.value)} />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrEmailBody", "Body")}</span>
                <Textarea value={emailBody} onChange={(event) => setEmailBody(event.target.value)} />
              </label>
            </div>
          ) : null}
          {builderMode === "vcard" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrVcardName", "Name")}</span>
                <Input value={vcardName} onChange={(event) => setVcardName(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrVcardOrg", "Organization")}</span>
                <Input value={vcardOrg} onChange={(event) => setVcardOrg(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrVcardPhone", "Phone")}</span>
                <Input value={vcardPhone} onChange={(event) => setVcardPhone(event.target.value)} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrVcardEmail", "Email")}</span>
                <Input value={vcardEmail} onChange={(event) => setVcardEmail(event.target.value)} />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium">{ui(dictionary, "qrVcardUrl", "Website")}</span>
                <Input value={vcardUrl} onChange={(event) => setVcardUrl(event.target.value)} />
              </label>
            </div>
          ) : null}
        </div>
        <div className="mt-3">
          <ResultBlock title={ui(dictionary, "builtQrPayload", "Built payload")} value={builderPayload} dictionary={dictionary} />
        </div>
      </section>
      <div data-qr-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "characters", "Characters"), value: String(trimmed.length) },
            { label: ui(dictionary, "inputBytes", "Input bytes"), value: String(byteLength(trimmed)) },
            { label: ui(dictionary, "qrPayloadType", "Payload type"), value: ui(dictionary, payloadInfo.typeKey, payloadInfo.typeKey) },
            { label: ui(dictionary, "qrScanDensity", "Scan density"), value: ui(dictionary, payloadInfo.densityKey, payloadInfo.densityKey) },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card p-3" data-qr-diagnostics data-qr-payload-type>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{ui(dictionary, "qrDiagnostics", "QR diagnostics")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "qrDiagnosticsDescription", "Review payload type, destination, density, and error correction before downloading the PNG.")}</p>
          </div>
          <Badge>{ui(dictionary, payloadInfo.typeKey, payloadInfo.typeKey)}</Badge>
        </div>
        <div className="mt-3">
          <ToolMetricGrid
            items={[
              { label: ui(dictionary, "qrDestinationHost", "Destination host"), value: payloadInfo.destinationHost },
              { label: ui(dictionary, "qrTrackingParameters", "Tracking parameters"), value: String(payloadInfo.trackingParams) },
              { label: ui(dictionary, "textLines", "Text lines"), value: String(payloadInfo.lineCount) },
              { label: ui(dictionary, "errorCorrection", "Error correction"), value: `${errorCorrection} · ${ui(dictionary, payloadInfo.errorCorrectionKey, payloadInfo.errorCorrectionKey)}` },
              { label: ui(dictionary, "qrImageSize", "Image size"), value: `${qrSize}px / ${ui(dictionary, "qrQuietZone", "Quiet zone")} ${qrMargin}` },
            ]}
          />
        </div>
      </section>
      <div data-qr-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={qrWarnings} emptyLabel={ui(dictionary, "qrNoWarnings", "QR content is ready for a local PNG preview.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-qr-scan-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{ui(dictionary, "qrScanReport", "QR scan report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "qrScanReportDescription", "Copy a safe scan-readiness report without including the raw QR payload.")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-qr-scan-report-copy
            onClick={() =>
              copyToClipboard(
                buildQrScanReport({
                  input: trimmed,
                  payloadInfo,
                  errorCorrection,
                  qrSize,
                  qrMargin,
                  warnings: qrWarnings,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
          >
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyQrScanReport", "Copy scan report")}
          </Button>
        </div>
        <ToolMetricGrid items={scanReport.metrics} />
        <ToolWarningList title={ui(dictionary, "qrReportReviewNotes", "Review notes")} warnings={scanReport.reviewNotes} emptyLabel={ui(dictionary, "qrScanReportNoWarnings", "No QR scan review warnings detected. Test the image on target devices before publishing.")} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "qrReportChecklist", "Scan checklist")}</p>
          <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {scanReport.checklist.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-qr-scan-report-preview>
          <code>{scanReport.markdown}</code>
        </pre>
      </section>
      <div className="grid gap-4 md:grid-cols-[340px_1fr]" data-qr-preview>
        <div className="flex min-h-80 items-center justify-center rounded-lg border bg-white p-4">
          {dataUrl ? <Image src={dataUrl} alt="Generated QR code" width={Number(qrSize)} height={Number(qrSize)} unoptimized className="h-auto max-h-72 w-auto max-w-full" /> : <span className="text-sm text-zinc-500">{dictionary.tool.noOutput}</span>}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{ui(dictionary, "download", "Download")}</CardTitle>
            <CardDescription>{ui(dictionary, "qrDownloadDescription", "PNG data URL generated in the browser.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={!dataUrl} onClick={() => dataUrl && window.open(dataUrl, "_blank")}>
                <Download className="h-4 w-4" />
                {ui(dictionary, "openPng", "Open PNG")}
              </Button>
              <Button variant="outline" disabled={!dataUrl} onClick={() => downloadDataUrl(dataUrl, "bobob-qr-code.png")}>
                <Download className="h-4 w-4" />
                {ui(dictionary, "downloadPng", "Download PNG")}
              </Button>
            </div>
            {dataUrl ? <ResultNextActions signals={["qr-generated"]} dictionary={dictionary} /> : null}
            <ResultBlock title={ui(dictionary, "dataUrl", "Data URL")} value={dataUrl} dictionary={dictionary} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function buildRandomTokenReport({
  bytes,
  format,
  purposeKey,
  value,
  warnings,
  dictionary,
  checkedAt,
}: {
  bytes: number;
  format: string;
  purposeKey: string;
  value: string;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const safeBytes = clampInteger(bytes, 8, 128);
  const entropyBits = safeBytes * 8;
  const formatLabel = format === "url" ? "URL-safe" : format === "base64" ? "Base64" : "Hex";
  const urlSafeLabel = format === "url" || format === "hex" ? ui(dictionary, "yes", "Yes") : ui(dictionary, "no", "No");
  const paddingLabel = format === "base64" ? "Base64 =" : ui(dictionary, "notApplicable", "Not applicable");
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "tokenReportNoWarnings", "No obvious token generation warnings detected. Store and rotate the secret deliberately.")];
  const checklist = [
    ui(dictionary, "tokenReportChecklistStore", "Store production secrets in a secret manager or password manager before sharing any access."),
    ui(dictionary, "tokenReportChecklistRotate", "Record where the token is used so it can be rotated or revoked later."),
    ui(dictionary, "tokenReportChecklistUrl", "Use URL-safe format for links, cookies, headers, and path segments."),
    ui(dictionary, "tokenReportChecklistNoLogs", "Do not paste production tokens into logs, tickets, analytics, or screenshots."),
    ui(dictionary, "tokenReportChecklistIdentifier", "Use UUIDs for identifiers only; use random tokens for secrets."),
  ];
  const metrics = [
    { label: ui(dictionary, "tokenReportFormat", "Format"), value: formatLabel },
    { label: ui(dictionary, "bytes", "Bytes"), value: String(safeBytes) },
    { label: ui(dictionary, "entropyEstimate", "Entropy estimate"), value: `${entropyBits} bits` },
    { label: ui(dictionary, "encodedLength", "Encoded length"), value: String(value.length) },
    { label: ui(dictionary, "tokenUse", "Intended use"), value: ui(dictionary, purposeKey, purposeKey) },
    { label: ui(dictionary, "tokenUrlSafe", "URL safe"), value: urlSafeLabel },
    { label: ui(dictionary, "tokenPadding", "Padding"), value: paddingLabel },
    { label: ui(dictionary, "tokenReportTokenPolicy", "Token included"), value: ui(dictionary, "tokenReportTokenExcluded", "No, only token metrics, format, and intended use are included.") },
  ];
  const markdown = [
    `# ${ui(dictionary, "randomTokenReport", "Random token report")}`,
    "",
    `- ${ui(dictionary, "tokenReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "tokenReportFormat", "Format")}: ${formatLabel}`,
    `- ${ui(dictionary, "bytes", "Bytes")}: ${safeBytes}`,
    `- ${ui(dictionary, "entropyEstimate", "Entropy estimate")}: ${entropyBits} bits`,
    `- ${ui(dictionary, "encodedLength", "Encoded length")}: ${value.length}`,
    `- ${ui(dictionary, "tokenUse", "Intended use")}: ${ui(dictionary, purposeKey, purposeKey)}`,
    `- ${ui(dictionary, "tokenUrlSafe", "URL safe")}: ${urlSafeLabel}`,
    `- ${ui(dictionary, "tokenPadding", "Padding")}: ${paddingLabel}`,
    `- ${ui(dictionary, "tokenReportTokenPolicy", "Token included")}: ${ui(dictionary, "tokenReportTokenExcluded", "No, only token metrics, format, and intended use are included.")}`,
    "",
    `## ${ui(dictionary, "tokenReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "tokenReportChecklist", "Secret handling checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

function RandomTokenTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [bytes, setBytes] = React.useState(32);
  const [format, setFormat] = React.useState("hex");
  const [purposeKey, setPurposeKey] = React.useState("tokenUseSession");
  const [value, setValue] = React.useState("");
  const tokenPresets = [
    { labelKey: "tokenSessionExample", fallbackLabel: "Session token", bytes: 32, format: "url", purposeKey: "tokenUseSession" },
    { labelKey: "tokenApiKeyExample", fallbackLabel: "API key seed", bytes: 48, format: "hex", purposeKey: "tokenUseApiKey" },
    { labelKey: "tokenCsrfExample", fallbackLabel: "CSRF token", bytes: 24, format: "url", purposeKey: "tokenUseUrlSafe" },
    { labelKey: "tokenWebhookExample", fallbackLabel: "Webhook secret", bytes: 32, format: "base64", purposeKey: "tokenUseBinary" },
  ];
  const generate = React.useCallback(() => {
    const raw = randomBytes(Math.max(8, Math.min(bytes, 128)));
    if (format === "hex") setValue(Array.from(raw, (byte) => byte.toString(16).padStart(2, "0")).join(""));
    if (format === "base64") setValue(globalThis.btoa(Array.from(raw, (byte) => String.fromCodePoint(byte)).join("")));
    if (format === "url") setValue(globalThis.btoa(Array.from(raw, (byte) => String.fromCodePoint(byte)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""));
  }, [bytes, format]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const safeBytes = clampInteger(bytes, 8, 128);
  const entropyBits = safeBytes * 8;
  const tokenWarnings = React.useMemo(
    () =>
      [
        safeBytes < 16 ? ui(dictionary, "tokenShortWarning", "Use at least 16 bytes for security-sensitive tokens.") : "",
        format === "base64" ? ui(dictionary, "tokenBase64PaddingWarning", "Standard Base64 can include +, /, and = padding. Use URL-safe format for links, cookies, and path segments.") : "",
        format !== "url" && purposeKey === "tokenUseUrlSafe" ? ui(dictionary, "tokenUrlFormatWarning", "This use case usually needs a URL-safe token. Switch format before copying.") : "",
        ui(dictionary, "tokenLocalWarning", "Generated locally with browser crypto. Store real secrets in a secret manager or password manager."),
      ].filter(Boolean),
    [dictionary, format, purposeKey, safeBytes],
  );
  const tokenReport = React.useMemo(
    () =>
      buildRandomTokenReport({
        bytes: safeBytes,
        format,
        purposeKey,
        value,
        warnings: tokenWarnings,
        dictionary,
        checkedAt: ui(dictionary, "tokenReportCopyTime", "Browser copy time"),
      }),
    [dictionary, format, purposeKey, safeBytes, tokenWarnings, value],
  );
  const applyPreset = (preset: (typeof tokenPresets)[number]) => {
    setBytes(preset.bytes);
    setFormat(preset.format);
    setPurposeKey(preset.purposeKey);
  };

  return (
    <div className="space-y-4" data-random-token-tool>
      <div className="space-y-2" data-random-token-examples>
        <p className="text-sm font-medium">{ui(dictionary, "tokenExamples", "Token examples")}</p>
        <div className="flex flex-wrap gap-2">
          {tokenPresets.map((preset) => (
            <Button key={preset.labelKey} variant="outline" size="sm" onClick={() => applyPreset(preset)}>
              {ui(dictionary, preset.labelKey, preset.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[160px_180px_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "bytes", "Bytes")}</span>
          <Input type="number" min={8} max={128} value={bytes} onChange={(event) => setBytes(Number(event.target.value))} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "tokenFormat", "Token format")}</span>
          <Select value={format} onChange={(event) => setFormat(event.target.value)}>
            <option value="hex">Hex</option>
            <option value="base64">Base64</option>
            <option value="url">URL-safe</option>
          </Select>
        </label>
        <Button onClick={generate}>{ui(dictionary, "generate", "Generate")}</Button>
      </div>
      <section className="rounded-md border bg-card p-3" data-random-token-diagnostics>
        <div className="mb-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "tokenDiagnostics", "Token diagnostics")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "tokenDiagnosticsDescription", "Check entropy, encoding length, URL safety, and intended use before copying a secret.")}</p>
        </div>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "entropyEstimate", "Entropy estimate"), value: `${entropyBits} bits`, description: describeEntropy(dictionary, entropyBits) },
            { label: ui(dictionary, "encodedLength", "Encoded length"), value: String(value.length) },
            { label: ui(dictionary, "tokenUse", "Intended use"), value: ui(dictionary, purposeKey, purposeKey) },
            { label: ui(dictionary, "tokenUrlSafe", "URL safe"), value: format === "url" || format === "hex" ? ui(dictionary, "yes", "Yes") : ui(dictionary, "no", "No") },
            { label: ui(dictionary, "tokenPadding", "Padding"), value: format === "base64" ? "Base64 =" : ui(dictionary, "notApplicable", "Not applicable") },
            { label: ui(dictionary, "generatedLocally", "Generated locally"), value: ui(dictionary, "yes", "Yes") },
          ]}
        />
      </section>
      <div data-random-token-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={tokenWarnings} emptyLabel={ui(dictionary, "tokenNoWarnings", "Token settings look ready for local generation.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-random-token-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{ui(dictionary, "randomTokenReport", "Random token report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "randomTokenReportDescription", "Copy a safe token handoff report without including the generated token value.")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-random-token-report-copy
            onClick={() =>
              copyToClipboard(
                buildRandomTokenReport({
                  bytes: safeBytes,
                  format,
                  purposeKey,
                  value,
                  warnings: tokenWarnings,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
          >
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyRandomTokenReport", "Copy token report")}
          </Button>
        </div>
        <ToolMetricGrid items={tokenReport.metrics} />
        <ToolWarningList title={ui(dictionary, "tokenReportReviewNotes", "Review notes")} warnings={tokenReport.reviewNotes} emptyLabel={ui(dictionary, "tokenReportNoWarnings", "No obvious token generation warnings detected. Store and rotate the secret deliberately.")} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "tokenReportChecklist", "Secret handling checklist")}</p>
          <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {tokenReport.checklist.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-random-token-report-preview>
          <code>{tokenReport.markdown}</code>
        </pre>
      </section>
      <ResultBlock title={ui(dictionary, "randomToken", "Random token")} value={value} dictionary={dictionary} />
    </div>
  );
}

function words(value: string) {
  return value
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamel(value: string) {
  const parts = words(value).map((part) => part.toLowerCase());
  return parts.map((part, index) => (index === 0 ? part : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)).join("");
}

function toPascal(value: string) {
  return words(value)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join("");
}

function CaseConverterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="Text"
      defaultInput="Bob's multi tool"
      modes={[
        { value: "lower", label: "lowercase", transform: (value) => value.toLowerCase() },
        { value: "upper", label: "UPPERCASE", transform: (value) => value.toUpperCase() },
        { value: "title", label: "Title Case", transform: (value) => words(value).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1).toLowerCase()}`).join(" ") },
        { value: "camel", label: "camelCase", transform: toCamel },
        { value: "pascal", label: "PascalCase", transform: toPascal },
        { value: "snake", label: "snake_case", transform: (value) => words(value).map((part) => part.toLowerCase()).join("_") },
        { value: "kebab", label: "kebab-case", transform: (value) => words(value).map((part) => part.toLowerCase()).join("-") },
      ]}
    />
  );
}

function SlugGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="Title"
      defaultInput="Bob's Multi Tool: JSON Formatter"
      modes={[
        { value: "slug", label: "URL slug", transform: (value) => words(value).map((part) => part.toLowerCase()).join("-") },
        { value: "path", label: "Path segment", transform: (value) => `/${words(value).map((part) => part.toLowerCase()).join("-")}` },
      ]}
    />
  );
}

function inferType(value: unknown, name = "Root"): string {
  if (Array.isArray(value)) {
    const child = value.length ? inferType(value[0], name) : "unknown";
    return `${child}[]`;
  }
  if (value && typeof value === "object") {
    const fields = Object.entries(value)
      .map(([key, child]) => `  ${key}: ${inferType(child, key)};`)
      .join("\n");
    return `{\n${fields}\n}`;
  }
  if (value === null) return "null";
  return typeof value;
}

function JsonToTypescriptTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="JSON sample"
      defaultInput='{"id":1,"name":"Bob","active":true,"roles":["admin"]}'
      modes={[
        {
          value: "interface",
          label: "Infer interface",
          transform: (value) => {
            const parsed = JSON.parse(value);
            const body = inferType(parsed);
            return `export interface Root ${body}`;
          },
        },
      ]}
    />
  );
}

function validateSchema(value: unknown, schema: Record<string, unknown>, path = "$"): string[] {
  const issues: string[] = [];
  const type = schema.type;
  if (typeof type === "string") {
    const actual = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
    if (actual !== type) issues.push(`${path}: expected ${type}, received ${actual}`);
  }
  if (schema.required && Array.isArray(schema.required) && value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of schema.required) {
      if (typeof key === "string" && !(key in value)) issues.push(`${path}.${key}: required`);
    }
  }
  if (schema.properties && typeof schema.properties === "object" && value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, childSchema] of Object.entries(schema.properties as Record<string, Record<string, unknown>>)) {
      if (key in value) issues.push(...validateSchema((value as Record<string, unknown>)[key], childSchema, `${path}.${key}`));
    }
  }
  return issues;
}

function JsonSchemaTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [json, setJson] = React.useState('{"id":1,"name":"Bob"}');
  const [schema, setSchema] = React.useState('{"type":"object","required":["id","name"],"properties":{"id":{"type":"number"},"name":{"type":"string"}}}');
  const result = React.useMemo(() => {
    try {
      const issues = validateSchema(JSON.parse(json), JSON.parse(schema));
      return issues.length ? `Invalid\n${issues.join("\n")}` : "Valid";
    } catch (error) {
      return error instanceof Error ? error.message : "Validation failed.";
    }
  }, [json, schema]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Textarea value={json} onChange={(event) => setJson(event.target.value)} className="min-h-48" aria-label="JSON value" />
        <Textarea value={schema} onChange={(event) => setSchema(event.target.value)} className="min-h-48" aria-label="JSON schema" />
      </div>
      <ResultBlock title={ui(dictionary, "validationResult", "Validation result")} value={result} dictionary={dictionary} />
    </div>
  );
}

const jsonPathExamples = [
  {
    labelKey: "jsonPathFirstItemExample",
    fallback: "First item name",
    path: "$.items[0].name",
    json: '{"items":[{"id":1,"name":"Bob","active":true},{"id":2,"name":"Alice","active":false}],"meta":{"total":2}}',
  },
  {
    labelKey: "jsonPathWildcardExample",
    fallback: "All item names",
    path: "$.items[*].name",
    json: '{"items":[{"id":1,"name":"Bob"},{"id":2,"name":"Alice"},{"id":3,"name":"Charlie"}]}',
  },
  {
    labelKey: "jsonPathRecursiveExample",
    fallback: "Every id",
    path: "$..id",
    json: '{"user":{"id":"u_123","team":{"id":"team_9"}},"items":[{"id":1},{"id":2}]}',
  },
  {
    labelKey: "jsonPathBracketExample",
    fallback: "Bracket key",
    path: "$.data['user-id']",
    json: '{"data":{"user-id":"bob-42","roles":["admin","editor"]}}',
  },
];

type JsonPathToken =
  | { kind: "key"; key: string }
  | { kind: "index"; index: number }
  | { kind: "wildcard" }
  | { kind: "recursiveKey"; key: string };

type JsonPathMatch = {
  path: string;
  value: unknown;
  type: string;
  preview: string;
};

function jsonPathSegment(key: string) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}

function readJsonPathIdentifier(source: string, start: number) {
  const match = source.slice(start).match(/^[A-Za-z_$][\w$]*/);
  if (!match) return null;
  return { value: match[0], end: start + match[0].length };
}

function parseJsonPath(path: string): JsonPathToken[] {
  const source = path.trim();
  if (!source.startsWith("$")) throw new Error("JSONPath must start with $.");

  const tokens: JsonPathToken[] = [];
  let index = 1;

  while (index < source.length) {
    if (source.startsWith("..", index)) {
      index += 2;
      const identifier = readJsonPathIdentifier(source, index);
      if (!identifier) throw new Error("Recursive descent supports keys such as $..id.");
      tokens.push({ kind: "recursiveKey", key: identifier.value });
      index = identifier.end;
      continue;
    }

    const character = source[index];
    if (character === ".") {
      index += 1;
      if (source[index] === "*") {
        tokens.push({ kind: "wildcard" });
        index += 1;
        continue;
      }
      const identifier = readJsonPathIdentifier(source, index);
      if (!identifier) throw new Error("Dot notation expects a property name.");
      tokens.push({ kind: "key", key: identifier.value });
      index = identifier.end;
      continue;
    }

    if (character === "[") {
      const closeIndex = source.indexOf("]", index);
      if (closeIndex === -1) throw new Error("Bracket notation is missing ].");
      const raw = source.slice(index + 1, closeIndex).trim();
      if (raw === "*") {
        tokens.push({ kind: "wildcard" });
      } else if (/^\d+$/.test(raw)) {
        tokens.push({ kind: "index", index: Number(raw) });
      } else {
        const quoted = raw.match(/^["'](.+)["']$/);
        if (!quoted) throw new Error("Supported brackets are [0], [*], ['key'], and [\"key\"].");
        tokens.push({ kind: "key", key: quoted[1]!.replace(/\\(["'])/g, "$1") });
      }
      index = closeIndex + 1;
      continue;
    }

    throw new Error(`Unsupported JSONPath syntax near "${source.slice(index)}".`);
  }

  return tokens;
}

function collectRecursiveJsonPathMatches(node: unknown, key: string, path: string, matches: JsonPathMatch[], limit: number) {
  if (matches.length >= limit) return;

  if (Array.isArray(node)) {
    node.forEach((item, index) => collectRecursiveJsonPathMatches(item, key, `${path}[${index}]`, matches, limit));
    return;
  }

  if (!node || typeof node !== "object") return;

  const record = node as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(record, key)) {
    const value = record[key];
    matches.push({
      path: `${path}${jsonPathSegment(key)}`,
      value,
      type: getJsonValueType(value),
      preview: getJsonPreviewValue(value),
    });
  }

  for (const [childKey, child] of Object.entries(record)) {
    collectRecursiveJsonPathMatches(child, key, `${path}${jsonPathSegment(childKey)}`, matches, limit);
  }
}

function evaluateJsonPath(json: string, path: string, limit = 80) {
  const root = JSON.parse(json);
  const tokens = parseJsonPath(path);
  let matches: JsonPathMatch[] = [{ path: "$", value: root, type: getJsonValueType(root), preview: getJsonPreviewValue(root) }];
  let truncated = false;

  for (const token of tokens) {
    const next: JsonPathMatch[] = [];

    for (const match of matches) {
      if (next.length >= limit) {
        truncated = true;
        break;
      }

      if (token.kind === "key") {
        if (match.value && typeof match.value === "object" && !Array.isArray(match.value)) {
          const record = match.value as Record<string, unknown>;
          if (Object.prototype.hasOwnProperty.call(record, token.key)) {
            const value = record[token.key];
            next.push({ path: `${match.path}${jsonPathSegment(token.key)}`, value, type: getJsonValueType(value), preview: getJsonPreviewValue(value) });
          }
        }
        continue;
      }

      if (token.kind === "index") {
        if (Array.isArray(match.value) && token.index < match.value.length) {
          const value = match.value[token.index];
          next.push({ path: `${match.path}[${token.index}]`, value, type: getJsonValueType(value), preview: getJsonPreviewValue(value) });
        }
        continue;
      }

      if (token.kind === "wildcard") {
        if (Array.isArray(match.value)) {
          match.value.slice(0, limit - next.length).forEach((value, childIndex) => {
            next.push({ path: `${match.path}[${childIndex}]`, value, type: getJsonValueType(value), preview: getJsonPreviewValue(value) });
          });
          truncated = truncated || match.value.length > limit - next.length;
        } else if (match.value && typeof match.value === "object") {
          for (const [key, value] of Object.entries(match.value as Record<string, unknown>)) {
            if (next.length >= limit) {
              truncated = true;
              break;
            }
            next.push({ path: `${match.path}${jsonPathSegment(key)}`, value, type: getJsonValueType(value), preview: getJsonPreviewValue(value) });
          }
        }
        continue;
      }

      collectRecursiveJsonPathMatches(match.value, token.key, match.path, next, limit);
      truncated = truncated || next.length >= limit;
    }

    matches = next;
  }

  const values = matches.map((match) => match.value);
  return {
    tokens,
    matches,
    truncated,
    output: JSON.stringify(matches.length === 1 ? values[0] : values, null, 2),
    rootType: getJsonValueType(root),
    resultType: matches.length === 1 ? getJsonValueType(values[0]) : "array",
  };
}

function JsonPathTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [json, setJson] = React.useState(jsonPathExamples[0]!.json);
  const [path, setPath] = React.useState(jsonPathExamples[0]!.path);
  const result = React.useMemo(() => {
    try {
      return { error: "", ...evaluateJsonPath(json, path) };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to evaluate path.",
        tokens: [],
        matches: [],
        truncated: false,
        output: "",
        rootType: "",
        resultType: "",
      };
    }
  }, [json, path]);

  const warnings = [
    !result.error && result.matches.length === 0 ? ui(dictionary, "jsonPathNoMatchesWarning", "No values matched this path. Check array indexes, key names, and wildcard placement.") : "",
    result.truncated ? ui(dictionary, "jsonPathTruncatedWarning", "Results were limited so the browser stays responsive. Narrow the path before copying.") : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-2" data-jsonpath-examples>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jsonPathExamples", "JSONPath examples")}</p>
        <div className="flex flex-wrap gap-2">
          {jsonPathExamples.map((example) => (
            <Button
              key={example.labelKey}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPath(example.path);
                setJson(example.json);
              }}
            >
              {ui(dictionary, example.labelKey, example.fallback)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "jsonPathExpression", "JSONPath expression")}</span>
          <Input value={path} onChange={(event) => setPath(event.target.value)} aria-label="JSONPath" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "jsonInput", "JSON input")}</span>
          <Textarea value={json} onChange={(event) => setJson(event.target.value)} className="min-h-44" />
        </label>
      </div>
      <section className="rounded-md border bg-card p-3" data-jsonpath-supported-syntax>
        <p className="text-sm font-medium">{ui(dictionary, "jsonPathSupportedSyntax", "Supported syntax")}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {["$.items[0].name", "$.items[*].name", "$..id", "$['data']['user-id']"].map((item) => (
            <Kbd key={item}>{item}</Kbd>
          ))}
        </div>
      </section>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "jsonPathError", "JSONPath error")} message={result.error} />
      ) : (
        <div className="space-y-4" data-jsonpath-result-details>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: ui(dictionary, "jsonPathMatches", "Matches"), value: String(result.matches.length) },
              { label: ui(dictionary, "jsonPathResultType", "Result type"), value: result.resultType },
              { label: ui(dictionary, "jsonPathTokens", "Path tokens"), value: String(result.tokens.length) },
              { label: ui(dictionary, "rootType", "Root type"), value: result.rootType },
            ].map((item) => (
              <div key={item.label} className="rounded-md border bg-card p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 break-words text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
          {warnings.length ? (
            <section className="rounded-md border bg-card p-3" data-jsonpath-warnings>
              <p className="text-sm font-medium">{ui(dictionary, "jsonPathReviewNotes", "Review notes")}</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <section className="rounded-md border bg-card p-3" data-jsonpath-matches>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{ui(dictionary, "jsonPathMatchedValues", "Matched values")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsonPathMatchedValuesDescription", "Review matched paths and values before copying the result.")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.matches.map((match) => match.path).join("\n"))}>
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copyMatchedPaths", "Copy paths")}
              </Button>
            </div>
            <div className="mt-3 grid gap-2">
              {result.matches.slice(0, 24).map((match) => (
                <div key={match.path} className="grid min-w-0 gap-2 rounded-md bg-muted px-3 py-2 text-xs md:grid-cols-[minmax(0,1.2fr)_6rem_minmax(0,1fr)_auto] md:items-center">
                  <code className="min-w-0 overflow-x-auto whitespace-nowrap rounded bg-background px-2 py-1">{match.path}</code>
                  <span className="text-muted-foreground">{match.type}</span>
                  <span className="min-w-0 truncate text-muted-foreground">{match.preview}</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(match.value, null, 2))}>
                    <Copy className="h-4 w-4" />
                    {dictionary.tool.copy}
                  </Button>
                </div>
              ))}
              {!result.matches.length ? <p className="text-xs text-muted-foreground">{ui(dictionary, "jsonPathNoMatches", "No matched values.")}</p> : null}
            </div>
          </section>
          <ResultBlock title={ui(dictionary, "pathResult", "Path result")} value={result.output} dictionary={dictionary} />
        </div>
      )}
    </div>
  );
}

function HtmlFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="HTML"
      defaultInput={"<div><span>Bob</span></div>"}
      modes={[
        { value: "pretty", label: "Pretty print", labelKey: "prettyPrint", transform: formatXmlLike },
        { value: "minify", label: "Minify", labelKey: "minify", transform: (value) => value.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim() },
      ]}
    />
  );
}

function formatCss(value: string) {
  return value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

function minifyCss(value: string) {
  return value.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").trim();
}

function stripCssComments(value: string) {
  return value.replace(/\/\*[\s\S]*?\*\//g, "");
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

function analyzeCss(value: string) {
  const withoutComments = stripCssComments(value);
  const selectorMatches = Array.from(withoutComments.matchAll(/(?:^|[{}])\s*([^@{};][^{}]*)\s*\{/g));
  const selectors = selectorMatches
    .map((match) => (match[1] ?? "").trim().replace(/\s+/g, " "))
    .filter(Boolean);
  const selectorCounts = selectors.reduce<Record<string, number>>((counts, selector) => {
    counts[selector] = (counts[selector] ?? 0) + 1;
    return counts;
  }, {});
  const duplicateSelectors = Object.entries(selectorCounts)
    .filter(([, count]) => count > 1)
    .map(([selector]) => selector);
  const atRules = uniqueStrings(Array.from(withoutComments.matchAll(/@[a-z-]+[^{;]*/gi)).map((match) => (match[0] ?? "").trim().replace(/\s+/g, " ")));
  const customProperties = uniqueStrings(Array.from(withoutComments.matchAll(/--[a-zA-Z0-9-_]+(?=\s*:)/g)).map((match) => match[0] ?? ""));
  const colorTokens = uniqueStrings(Array.from(withoutComments.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)).map((match) => (match[0] ?? "").trim()));
  const minifiedLength = minifyCss(value).length;
  const compressionRatio = value.trim() ? Math.max(0, (1 - minifiedLength / value.length) * 100) : 0;
  return {
    atRules,
    colorTokens,
    compressionRatio,
    customProperties,
    duplicateSelectors,
    hasComments: /\/\*/.test(value),
    hasIdSelector: selectors.some((selector) => /#[A-Za-z0-9_-]+/.test(selector)),
    selectors,
  };
}

function buildCssReviewReport({
  analysis,
  checkedAt,
  declarationCount,
  dictionary,
  input,
  minifier,
  output,
  warnings,
}: {
  analysis: ReturnType<typeof analyzeCss>;
  checkedAt: string;
  declarationCount: number;
  dictionary: ClientDictionary;
  input: string;
  minifier: boolean;
  output: string;
  warnings: string[];
}) {
  const yesLabel = ui(dictionary, "yes", "Yes");
  const noLabel = ui(dictionary, "no", "No");
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "cssReportNoWarnings", "No immediate CSS review warnings detected. Still test the snippet in the target layout.")];
  const checklist = [
    ui(dictionary, "cssReportChecklistVisual", "Test the CSS at the target breakpoint, theme, and browser before shipping."),
    ui(dictionary, "cssReportChecklistCascade", "Confirm selector order, duplicate selectors, and specificity match the intended cascade."),
    ui(dictionary, "cssReportChecklistTokens", "Compare custom properties and color tokens against the design system before copying."),
    ui(dictionary, "cssReportChecklistComments", "Preserve license and handoff comments if minifying or pasting into docs."),
    ui(dictionary, "cssReportChecklistFormatter", "Run the project formatter or build pipeline before committing large stylesheet changes."),
  ];
  const selectorSummary = analysis.selectors.slice(0, 8).join(", ") || ui(dictionary, "noSelectorsDetected", "No selectors detected.");
  const duplicateSummary = analysis.duplicateSelectors.join(", ") || noLabel;
  const metrics = [
    { label: ui(dictionary, "cssReportMode", "Output mode"), value: minifier ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print") },
    { label: ui(dictionary, "selectorBlocks", "Selector blocks"), value: String(analysis.selectors.length), description: selectorSummary },
    { label: ui(dictionary, "declarations", "Declarations"), value: String(declarationCount) },
    { label: ui(dictionary, "customProperties", "Custom properties"), value: String(analysis.customProperties.length), description: analysis.customProperties.slice(0, 3).join(", ") || ui(dictionary, "noCustomProperties", "No custom properties detected.") },
    { label: ui(dictionary, "colorTokens", "Color tokens"), value: String(analysis.colorTokens.length), description: analysis.colorTokens.slice(0, 3).join(", ") || ui(dictionary, "noColorTokens", "No color tokens detected.") },
    { label: ui(dictionary, "atRules", "At-rules"), value: String(analysis.atRules.length), description: analysis.atRules.slice(0, 2).join(", ") || ui(dictionary, "noAtRules", "No at-rules detected.") },
    { label: ui(dictionary, "cssReportDuplicateSelectors", "Duplicate selectors"), value: duplicateSummary },
    { label: ui(dictionary, "cssReportSpecificityRisk", "ID specificity risk"), value: analysis.hasIdSelector ? yesLabel : noLabel },
    { label: ui(dictionary, "cssReportCommentState", "Comments present"), value: analysis.hasComments ? yesLabel : noLabel },
    { label: ui(dictionary, "compressionRatio", "Compression ratio"), value: `${analysis.compressionRatio.toFixed(0)}%` },
  ];
  const markdown = [
    `# ${ui(dictionary, "cssReviewReport", "CSS review report")}`,
    "",
    `- ${ui(dictionary, "cssReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "cssReportMode", "Output mode")}: ${minifier ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print")}`,
    `- ${ui(dictionary, "characters", "Characters")}: ${input.length}`,
    `- ${ui(dictionary, "outputLines", "Output lines")}: ${output ? output.split(/\r?\n/).length : 0}`,
    `- ${ui(dictionary, "selectorBlocks", "Selector blocks")}: ${analysis.selectors.length}`,
    `- ${ui(dictionary, "declarations", "Declarations")}: ${declarationCount}`,
    `- ${ui(dictionary, "customProperties", "Custom properties")}: ${analysis.customProperties.length}`,
    `- ${ui(dictionary, "colorTokens", "Color tokens")}: ${analysis.colorTokens.length}`,
    `- ${ui(dictionary, "atRules", "At-rules")}: ${analysis.atRules.length}`,
    `- ${ui(dictionary, "cssReportDuplicateSelectors", "Duplicate selectors")}: ${duplicateSummary}`,
    `- ${ui(dictionary, "cssReportSpecificityRisk", "ID specificity risk")}: ${analysis.hasIdSelector ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "cssReportCommentState", "Comments present")}: ${analysis.hasComments ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "compressionRatio", "Compression ratio")}: ${analysis.compressionRatio.toFixed(0)}%`,
    `- ${ui(dictionary, "cssReportRawCssExcluded", "Raw CSS is excluded from this report; attach a redacted snippet separately if needed.")}`,
    "",
    `## ${ui(dictionary, "cssReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "cssReportChecklist", "Review checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");
  return { checklist, markdown, metrics, reviewNotes };
}

const cssExamples = [
  { labelKey: "flexRuleExample", fallbackLabel: "Flex rule", value: ".card{display:flex;gap:16px;color:#111}" },
  { labelKey: "mediaQueryExample", fallbackLabel: "Media query", value: "@media (min-width:768px){.grid{grid-template-columns:repeat(3,1fr)}}" },
  { labelKey: "cssVariableExample", fallbackLabel: "CSS variables", value: ":root{--gap:16px}.panel{padding:var(--gap);border:1px solid #ddd}" },
];

function CssFormatterPanel({ dictionary, minifier = false }: { dictionary: ClientDictionary; minifier?: boolean }) {
  const [input, setInput] = React.useState(minifier ? ".card { display: flex; color: #111; }" : cssExamples[0].value);
  const result = React.useMemo(() => {
    try {
      return { error: "", value: minifier ? minifyCss(input) : formatCss(input) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unable to format CSS.", value: "" };
    }
  }, [input, minifier]);
  const cssAnalysis = React.useMemo(() => analyzeCss(input), [input]);
  const openBraces = (input.match(/{/g) ?? []).length;
  const closeBraces = (input.match(/}/g) ?? []).length;
  const declarationCount = input.match(/:[^;{}]+[;}]/g)?.length ?? 0;
  const warnings = React.useMemo(
    () =>
      [
        openBraces !== closeBraces ? ui(dictionary, "cssUnbalancedBracesWarning", "Opening and closing brace counts do not match.") : "",
        /!important/.test(input) ? ui(dictionary, "cssImportantWarning", "The snippet contains !important. Confirm this is intentional before copying.") : "",
        cssAnalysis.duplicateSelectors.length ? ui(dictionary, "cssDuplicateSelectorWarning", "Duplicate selectors were detected. Confirm cascade order before copying.") : "",
        cssAnalysis.hasIdSelector ? ui(dictionary, "cssSpecificityWarning", "ID selectors raise specificity and can make overrides harder.") : "",
        minifier && cssAnalysis.hasComments ? ui(dictionary, "cssCommentRemovalWarning", "Minifying removes comments, including license or handoff notes.") : "",
        ui(dictionary, "cssHeuristicWarning", "This lightweight formatter is for small snippets. Run your project formatter before committing large stylesheets."),
      ].filter(Boolean),
    [closeBraces, cssAnalysis.duplicateSelectors.length, cssAnalysis.hasComments, cssAnalysis.hasIdSelector, dictionary, input, minifier, openBraces],
  );
  const cssReviewReport = React.useMemo(
    () =>
      buildCssReviewReport({
        analysis: cssAnalysis,
        checkedAt: ui(dictionary, "cssReportCopyTime", "Browser copy time"),
        declarationCount,
        dictionary,
        input,
        minifier,
        output: result.value,
        warnings: result.error ? [result.error] : warnings,
      }),
    [cssAnalysis, declarationCount, dictionary, input, minifier, result.error, result.value, warnings],
  );

  return (
    <div className="space-y-4" data-css-tool>
      <div className="space-y-2" data-css-examples>
        <p className="text-sm font-medium">{ui(dictionary, "cssExamples", "CSS examples")}</p>
        <div className="flex flex-wrap gap-2">
          {cssExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44" aria-label="CSS" />
      <div data-css-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "selectorBlocks", "Selector blocks"), value: String(cssAnalysis.selectors.length) },
            { label: ui(dictionary, "declarations", "Declarations"), value: String(declarationCount) },
            { label: ui(dictionary, "mediaQueries", "Media queries"), value: String(input.match(/@media/g)?.length ?? 0) },
            { label: ui(dictionary, "outputLines", "Output lines"), value: result.value ? String(result.value.split(/\r?\n/).length) : "0" },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-css-diagnostics>
        <div className="border-b px-3 py-2">
          <h3 className="text-sm font-semibold">{ui(dictionary, "cssDiagnostics", "CSS diagnostics")}</h3>
          <p className="text-xs text-muted-foreground">{ui(dictionary, "cssDiagnosticsDescription", "Inspect selectors, tokens, at-rules, and minified size before copying.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid
            items={[
              {
                label: ui(dictionary, "customProperties", "Custom properties"),
                value: String(cssAnalysis.customProperties.length),
                description: cssAnalysis.customProperties.slice(0, 3).join(", ") || ui(dictionary, "noCustomProperties", "No custom properties detected."),
              },
              {
                label: ui(dictionary, "colorTokens", "Color tokens"),
                value: String(cssAnalysis.colorTokens.length),
                description: cssAnalysis.colorTokens.slice(0, 3).join(", ") || ui(dictionary, "noColorTokens", "No color tokens detected."),
              },
              {
                label: ui(dictionary, "atRules", "At-rules"),
                value: String(cssAnalysis.atRules.length),
                description: cssAnalysis.atRules.slice(0, 2).join(", ") || ui(dictionary, "noAtRules", "No at-rules detected."),
              },
              {
                label: ui(dictionary, "compressionRatio", "Compression ratio"),
                value: `${cssAnalysis.compressionRatio.toFixed(0)}%`,
                description: ui(dictionary, "cssCompressionDescription", "Estimated reduction after whitespace and comment removal."),
              },
            ]}
          />
          <div className="rounded-md border bg-background p-3" data-css-selector-list>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{ui(dictionary, "selectorPreview", "Selector preview")}</p>
              <p className="text-xs text-muted-foreground">{ui(dictionary, "selectorPreviewDescription", "First selectors found in the snippet.")}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(cssAnalysis.selectors.length ? cssAnalysis.selectors.slice(0, 8) : [ui(dictionary, "noSelectorsDetected", "No selectors detected.")]).map((selector) => (
                <Badge key={selector} className="max-w-full break-all bg-muted font-mono text-xs">
                  {selector}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div data-css-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={result.error ? [result.error] : warnings} emptyLabel={ui(dictionary, "cssNoWarnings", "CSS snippet is ready for visual review.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-css-review-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{ui(dictionary, "cssReviewReport", "CSS review report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "cssReviewReportDescription", "Copy a handoff report with selector, token, cascade, specificity, compression, warning, and checklist signals.")}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                buildCssReviewReport({
                  analysis: cssAnalysis,
                  checkedAt: new Date().toISOString(),
                  declarationCount,
                  dictionary,
                  input,
                  minifier,
                  output: result.value,
                  warnings: result.error ? [result.error] : warnings,
                }).markdown,
              )
            }
            data-css-review-report-copy
          >
            <Copy className="h-4 w-4" />
            {ui(dictionary, "copyCssReviewReport", "Copy CSS report")}
          </Button>
        </div>
        <ToolMetricGrid items={cssReviewReport.metrics} />
        <div className="rounded-md border bg-background p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "cssReportReviewNotes", "Review notes")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            {cssReviewReport.reviewNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border bg-background p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "cssReportChecklist", "Review checklist")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            {cssReviewReport.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-css-review-report-preview>
          {cssReviewReport.markdown}
        </pre>
      </section>
      {result.error ? <ErrorAlert title={ui(dictionary, "transformError", "Transform error")} message={result.error} /> : <ResultBlock title={minifier ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function CssFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <CssFormatterPanel dictionary={dictionary} />;
}

function CssMinifierTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <CssFormatterPanel dictionary={dictionary} minifier />;
}

function formatJs(value: string) {
  return value
    .replace(/([{};])/g, "$1\n")
    .replace(/\n\s*\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function minifyJs(value: string) {
  return value.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}();,:=+\-*/<>])\s*/g, "$1").trim();
}

function stripJsComments(value: string) {
  return value.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function analyzeJavaScript(value: string) {
  const withoutComments = stripJsComments(value);
  const importCount = withoutComments.match(/\bimport\s+(?:[\s\S]*?\s+from\s+)?["'][^"']+["']|import\s*\(/g)?.length ?? 0;
  const exportCount = withoutComments.match(/\bexport\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|var|class|\{)/g)?.length ?? 0;
  const asyncCount = withoutComments.match(/\basync\b|\bawait\b/g)?.length ?? 0;
  const browserApiMatches = uniqueStrings(Array.from(withoutComments.matchAll(/\b(window|document|localStorage|sessionStorage|navigator|location|fetch)\b/g)).map((match) => match[0] ?? ""));
  const functionCount = withoutComments.match(/\bfunction\b|=>/g)?.length ?? 0;
  const consoleCalls = withoutComments.match(/\bconsole\./g)?.length ?? 0;
  const minifiedLength = minifyJs(value).length;
  const compressionRatio = value.trim() ? Math.max(0, (1 - minifiedLength / value.length) * 100) : 0;
  const signals = [
    importCount ? `${importCount} import` : "",
    exportCount ? `${exportCount} export` : "",
    asyncCount ? `${asyncCount} async/await` : "",
    browserApiMatches.length ? browserApiMatches.join(", ") : "",
    functionCount ? `${functionCount} function` : "",
  ].filter(Boolean);

  return {
    asyncCount,
    browserApiMatches,
    compressionRatio,
    consoleCalls,
    hasEval: /\beval\s*\(|new Function\s*\(/.test(withoutComments),
    exportCount,
    functionCount,
    hasComments: /\/\/|\/\*/.test(value),
    hasFetch: /\bfetch\s*\(/.test(withoutComments),
    hasTodo: /\b(?:TODO|FIXME|HACK)\b/i.test(value),
    importCount,
    signals,
  };
}

function buildJavaScriptReviewReport({
  input,
  output,
  minifier,
  analysis,
  warnings,
  dictionary,
  checkedAt,
}: {
  input: string;
  output: string;
  minifier: boolean;
  analysis: ReturnType<typeof analyzeJavaScript>;
  warnings: string[];
  dictionary: ClientDictionary;
  checkedAt: string;
}) {
  const yesLabel = ui(dictionary, "yes", "Yes");
  const noLabel = ui(dictionary, "no", "No");
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "jsReportNoWarnings", "No immediate JavaScript review warnings detected. Still run tests before shipping.")];
  const browserSignals = analysis.browserApiMatches.length ? analysis.browserApiMatches.join(", ") : ui(dictionary, "noBrowserApis", "No browser APIs detected.");
  const checklist = [
    ui(dictionary, "jsReportChecklistTests", "Run the snippet through project tests or a safe sandbox before shipping."),
    ui(dictionary, "jsReportChecklistRuntime", "Confirm whether the snippet targets browser, Node.js, edge runtime, or a bundler."),
    ui(dictionary, "jsReportChecklistNetwork", "Review fetch URLs, credentials, and error handling before copying network code."),
    ui(dictionary, "jsReportChecklistLogging", "Remove debug console output and TODO notes before production use."),
    ui(dictionary, "jsReportChecklistComments", "Preserve license and handoff comments if minifying or pasting into docs."),
  ];
  const metrics = [
    { label: ui(dictionary, "jsReportMode", "Output mode"), value: minifier ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print") },
    { label: ui(dictionary, "imports", "Imports"), value: String(analysis.importCount) },
    { label: ui(dictionary, "exports", "Exports"), value: String(analysis.exportCount) },
    { label: ui(dictionary, "asyncAwait", "Async/await"), value: String(analysis.asyncCount) },
    { label: ui(dictionary, "browserApis", "Browser APIs"), value: String(analysis.browserApiMatches.length), description: browserSignals },
    { label: ui(dictionary, "jsReportFetchCalls", "Fetch calls"), value: analysis.hasFetch ? yesLabel : noLabel },
    { label: ui(dictionary, "jsReportEvalRisk", "Eval risk"), value: analysis.hasEval ? yesLabel : noLabel },
    { label: ui(dictionary, "compressionRatio", "Compression ratio"), value: `${analysis.compressionRatio.toFixed(0)}%` },
  ];
  const markdown = [
    `# ${ui(dictionary, "jsReviewReport", "JavaScript review report")}`,
    "",
    `- ${ui(dictionary, "jsReportCheckedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "jsReportMode", "Output mode")}: ${minifier ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print")}`,
    `- ${ui(dictionary, "characters", "Characters")}: ${input.length}`,
    `- ${ui(dictionary, "outputLines", "Output lines")}: ${output ? output.split(/\r?\n/).length : 0}`,
    `- ${ui(dictionary, "functionCount", "Functions")}: ${analysis.functionCount}`,
    `- ${ui(dictionary, "imports", "Imports")}: ${analysis.importCount}`,
    `- ${ui(dictionary, "exports", "Exports")}: ${analysis.exportCount}`,
    `- ${ui(dictionary, "asyncAwait", "Async/await")}: ${analysis.asyncCount}`,
    `- ${ui(dictionary, "browserApis", "Browser APIs")}: ${browserSignals}`,
    `- ${ui(dictionary, "consoleCalls", "Console calls")}: ${analysis.consoleCalls}`,
    `- ${ui(dictionary, "jsReportFetchCalls", "Fetch calls")}: ${analysis.hasFetch ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "jsReportEvalRisk", "Eval risk")}: ${analysis.hasEval ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "jsReportTodoNotes", "TODO/FIXME/HACK notes")}: ${analysis.hasTodo ? yesLabel : noLabel}`,
    `- ${ui(dictionary, "compressionRatio", "Compression ratio")}: ${analysis.compressionRatio.toFixed(0)}%`,
    `- ${ui(dictionary, "jsReportRawCodeExcluded", "Raw JavaScript is excluded from this report; attach a redacted snippet separately if needed.")}`,
    "",
    `## ${ui(dictionary, "jsReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "jsReportChecklist", "Review checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return { markdown, metrics, reviewNotes, checklist };
}

const javascriptExamples = [
  { labelKey: "functionExample", fallbackLabel: "Function", value: "function hi(){console.log('bob');}" },
  { labelKey: "reduceExample", fallbackLabel: "Array reduce", value: "const total=items.reduce((sum,item)=>sum+item.price,0)" },
  { labelKey: "exportExample", fallbackLabel: "Export helper", value: "export function slugify(value){return value.toLowerCase().replace(/\\s+/g,'-')}" },
];

function JavaScriptFormatterPanel({ dictionary, minifier = false }: { dictionary: ClientDictionary; minifier?: boolean }) {
  const [input, setInput] = React.useState(minifier ? "function hi() { console.log('bob'); }" : javascriptExamples[0].value);
  const result = React.useMemo(() => {
    try {
      return { error: "", value: minifier ? minifyJs(input) : formatJs(input) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unable to format JavaScript.", value: "" };
    }
  }, [input, minifier]);
  const jsAnalysis = React.useMemo(() => analyzeJavaScript(input), [input]);
  const warnings = React.useMemo(
    () =>
      [
        jsAnalysis.hasEval ? ui(dictionary, "jsEvalWarning", "The snippet contains eval or Function constructor usage. Review it before copying.") : "",
        jsAnalysis.consoleCalls ? ui(dictionary, "jsConsoleWarning", "Console calls are present. Remove debug logging before production use if needed.") : "",
        jsAnalysis.browserApiMatches.length ? ui(dictionary, "jsBrowserApiWarning", "Browser APIs were detected. Confirm the snippet is not meant for Node.js before copying.") : "",
        jsAnalysis.hasFetch ? ui(dictionary, "jsFetchWarning", "Network calls were detected. Review URLs, credentials, and error handling before running.") : "",
        jsAnalysis.hasTodo ? ui(dictionary, "jsTodoWarning", "TODO, FIXME, or HACK notes are still present.") : "",
        minifier && jsAnalysis.hasComments ? ui(dictionary, "jsCommentRemovalWarning", "Minifying removes comments, including license or handoff notes.") : "",
        minifier ? ui(dictionary, "jsMinifyWarning", "The lightweight minifier removes comments and whitespace but does not perform AST-safe bundling.") : ui(dictionary, "jsHeuristicWarning", "This lightweight formatter is for short snippets and does not replace Prettier or your project formatter."),
      ].filter(Boolean),
    [dictionary, jsAnalysis, minifier],
  );
  const jsReviewReport = React.useMemo(
    () =>
      buildJavaScriptReviewReport({
        input,
        output: result.value,
        minifier,
        analysis: jsAnalysis,
        warnings: result.error ? [result.error, ...warnings] : warnings,
        dictionary,
        checkedAt: ui(dictionary, "jsReportCopyTime", "Browser copy time"),
      }),
    [dictionary, input, jsAnalysis, minifier, result.error, result.value, warnings],
  );

  return (
    <div className="space-y-4" data-javascript-tool>
      <div className="space-y-2" data-javascript-examples>
        <p className="text-sm font-medium">{ui(dictionary, "javascriptExamples", "JavaScript examples")}</p>
        <div className="flex flex-wrap gap-2">
          {javascriptExamples.map((example) => (
            <Button key={example.labelKey} variant="outline" size="sm" onClick={() => setInput(example.value)}>
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44" aria-label="JavaScript" />
      <div data-javascript-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "characters", "Characters"), value: String(input.length) },
            { label: ui(dictionary, "functionCount", "Functions"), value: String(jsAnalysis.functionCount) },
            { label: ui(dictionary, "consoleCalls", "Console calls"), value: String(jsAnalysis.consoleCalls) },
            { label: ui(dictionary, "outputLines", "Output lines"), value: result.value ? String(result.value.split(/\r?\n/).length) : "0" },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-javascript-diagnostics>
        <div className="border-b px-3 py-2">
          <h3 className="text-sm font-semibold">{ui(dictionary, "jsDiagnostics", "JavaScript diagnostics")}</h3>
          <p className="text-xs text-muted-foreground">{ui(dictionary, "jsDiagnosticsDescription", "Inspect module syntax, async usage, browser APIs, and minified size before copying.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid
            items={[
              { label: ui(dictionary, "imports", "Imports"), value: String(jsAnalysis.importCount) },
              { label: ui(dictionary, "exports", "Exports"), value: String(jsAnalysis.exportCount) },
              { label: ui(dictionary, "asyncAwait", "Async/await"), value: String(jsAnalysis.asyncCount) },
              {
                label: ui(dictionary, "browserApis", "Browser APIs"),
                value: String(jsAnalysis.browserApiMatches.length),
                description: jsAnalysis.browserApiMatches.join(", ") || ui(dictionary, "noBrowserApis", "No browser APIs detected."),
              },
              {
                label: ui(dictionary, "compressionRatio", "Compression ratio"),
                value: `${jsAnalysis.compressionRatio.toFixed(0)}%`,
                description: ui(dictionary, "jsCompressionDescription", "Estimated reduction after whitespace and comment removal."),
              },
            ]}
          />
          <div className="rounded-md border bg-background p-3" data-javascript-signal-list>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">{ui(dictionary, "jsSignalPreview", "Signal preview")}</p>
              <p className="text-xs text-muted-foreground">{ui(dictionary, "jsSignalPreviewDescription", "Runtime and module signals found in the snippet.")}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(jsAnalysis.signals.length ? jsAnalysis.signals : [ui(dictionary, "noJsSignals", "No module or runtime signals detected.")]).map((signal) => (
                <Badge key={signal} className="max-w-full break-all bg-muted font-mono text-xs">
                  {signal}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div data-javascript-warnings>
        <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={result.error ? [result.error] : warnings} emptyLabel={ui(dictionary, "jsNoWarnings", "JavaScript snippet is ready for review.")} />
      </div>
      <section className="space-y-3 rounded-md border bg-card p-3" data-javascript-review-report>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{ui(dictionary, "jsReviewReport", "JavaScript review report")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "jsReviewReportDescription", "Copy a handoff report with module/runtime signals, network and eval risks, warnings, and a safe review checklist.")}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              copyToClipboard(
                buildJavaScriptReviewReport({
                  input,
                  output: result.value,
                  minifier,
                  analysis: jsAnalysis,
                  warnings: result.error ? [result.error, ...warnings] : warnings,
                  dictionary,
                  checkedAt: new Date().toISOString(),
                }).markdown,
              )
            }
            data-javascript-review-report-copy
          >
            <Copy className="mr-2 h-4 w-4" />
            {ui(dictionary, "copyJsReviewReport", "Copy JS report")}
          </Button>
        </div>
        <ToolMetricGrid items={jsReviewReport.metrics} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jsReportReviewNotes", "Review notes")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {jsReviewReport.reviewNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "jsReportChecklist", "Review checklist")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {jsReviewReport.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs" data-javascript-review-report-preview>
          {jsReviewReport.markdown}
        </pre>
      </section>
      {result.error ? <ErrorAlert title={ui(dictionary, "transformError", "Transform error")} message={result.error} /> : <ResultBlock title={minifier ? ui(dictionary, "minify", "Minify") : ui(dictionary, "prettyPrint", "Pretty print")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function JavaScriptFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <JavaScriptFormatterPanel dictionary={dictionary} />;
}

function JavaScriptMinifierTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <JavaScriptFormatterPanel dictionary={dictionary} minifier />;
}

const markdownTableExamples = [
  { labelKey: "markdownTableCsvExample", fallbackLabel: "CSV table", value: "Name,Role,Status\nBob,Admin,Active\nAlice,Editor,Pending", delimiter: "comma" },
  { labelKey: "markdownTableTsvExample", fallbackLabel: "TSV table", value: "Package\tVersion\tPurpose\nnext\t15.5.19\tApp framework\nqrcode\tlatest\tQR output", delimiter: "tab" },
  { labelKey: "markdownTablePipeExample", fallbackLabel: "Pipe rows", value: "Metric | Value | Notes\nCLS | 0.02 | Stable\nLCP | 1.8s | Good", delimiter: "pipe" },
] as const;

type MarkdownTableDelimiter = "comma" | "tab" | "pipe";

function parseMarkdownTableRows(value: string, delimiter: MarkdownTableDelimiter) {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (delimiter === "pipe") {
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*\|?|\|?\s*$/g, "").split("|").map((cell) => cell.trim()))
      .filter((row) => row.some(Boolean));
  }
  const parsed = Papa.parse<string[]>(trimmed, {
    delimiter: delimiter === "tab" ? "\t" : ",",
    skipEmptyLines: "greedy",
  });
  return parsed.data.map((row) => row.map((cell) => String(cell ?? "").trim())).filter((row) => row.some(Boolean));
}

function escapeMarkdownTableCell(value: string) {
  return value.replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
}

function buildMarkdownTable(rows: string[][]) {
  if (!rows.length) return "";
  const columnCount = Math.max(...rows.map((row) => row.length), 1);
  const normalized = rows.map((row) => Array.from({ length: columnCount }, (_, index) => escapeMarkdownTableCell(row[index] ?? "")));
  const header = normalized[0]?.map((cell, index) => cell || `Column ${index + 1}`) ?? [];
  const separator = header.map(() => "---");
  const body = normalized.slice(1);
  return [header, separator, ...body].map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function getMarkdownTableDiagnostics(source: string, delimiter: MarkdownTableDelimiter, dictionary: ClientDictionary) {
  const rows = parseMarkdownTableRows(source, delimiter);
  const columnCount = rows.length ? Math.max(...rows.map((row) => row.length)) : 0;
  const inconsistentRows = rows.filter((row) => row.length !== columnCount).length;
  const emptyCells = rows.reduce((count, row) => count + row.filter((cell) => !cell.trim()).length, 0);
  const hasPipeCharacters = source.includes("|") && delimiter !== "pipe";
  const warnings = [
    !source.trim() ? ui(dictionary, "markdownTableEmptyWarning", "Paste rows before generating a Markdown table.") : "",
    rows.length === 1 ? ui(dictionary, "markdownTableHeaderOnlyWarning", "Only a header row was detected. Add at least one body row for a useful table.") : "",
    inconsistentRows > 0 ? ui(dictionary, "markdownTableInconsistentWarning", "Some rows have a different column count. Review the generated blanks before copying.") : "",
    emptyCells > 0 ? ui(dictionary, "markdownTableEmptyCellWarning", "Empty cells were detected. Confirm blanks are intentional.") : "",
    columnCount > 6 ? ui(dictionary, "markdownTableWideWarning", "Wide Markdown tables can be hard to read on mobile. Consider splitting columns.") : "",
    hasPipeCharacters ? ui(dictionary, "markdownTablePipeEscapeWarning", "Pipe characters inside CSV/TSV cells will be escaped for Markdown output.") : "",
  ].filter(Boolean);
  return {
    rows,
    markdown: buildMarkdownTable(rows),
    warnings,
    metrics: [
      { label: ui(dictionary, "tableRows", "Rows"), value: String(Math.max(0, rows.length - 1)) },
      { label: ui(dictionary, "tableColumns", "Columns"), value: String(columnCount) },
      { label: ui(dictionary, "emptyCells", "Empty cells"), value: String(emptyCells) },
      { label: ui(dictionary, "inconsistentRows", "Uneven rows"), value: String(inconsistentRows) },
    ],
  };
}

function MarkdownPreviewTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("# Release notes\n\n- Added JSON Formatter\n- Added Regex Tester\n\n`npm run build`");
  const [tableSource, setTableSource] = React.useState<string>(markdownTableExamples[0].value);
  const [tableDelimiter, setTableDelimiter] = React.useState<MarkdownTableDelimiter>("comma");
  const lines = input.split("\n");
  const tableDiagnostics = React.useMemo(() => getMarkdownTableDiagnostics(tableSource, tableDelimiter, dictionary), [dictionary, tableDelimiter, tableSource]);
  const appendTableToPreview = () => {
    if (!tableDiagnostics.markdown) return;
    setInput((current) => (current.trim() ? `${current.trim()}\n\n${tableDiagnostics.markdown}` : tableDiagnostics.markdown));
  };
  return (
    <div className="space-y-4" data-markdown-tool>
      <section className="rounded-md border bg-card" data-markdown-table-generator>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "markdownTableGenerator", "Markdown table generator")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "markdownTableGeneratorDescription", "Convert CSV, TSV, or pipe-separated rows into a copy-ready Markdown table for README files, docs, and issue comments.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <div className="flex flex-wrap gap-2" data-markdown-table-examples>
            {markdownTableExamples.map((example) => (
              <Button
                key={example.labelKey}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setTableSource(example.value);
                  setTableDelimiter(example.delimiter);
                }}
              >
                {ui(dictionary, example.labelKey, example.fallbackLabel)}
              </Button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="space-y-2">
              <span className="text-sm font-medium">{ui(dictionary, "tableInput", "Table input")}</span>
              <Textarea value={tableSource} onChange={(event) => setTableSource(event.target.value)} className="min-h-36 font-mono text-xs" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">{ui(dictionary, "delimiter", "Delimiter")}</span>
              <Select value={tableDelimiter} onChange={(event) => setTableDelimiter(event.target.value as MarkdownTableDelimiter)}>
                <option value="comma">{ui(dictionary, "comma", "Comma")}</option>
                <option value="tab">{ui(dictionary, "tab", "Tab")}</option>
                <option value="pipe">{ui(dictionary, "pipe", "Pipe")}</option>
              </Select>
            </label>
          </div>
          <div data-markdown-table-details>
            <ToolMetricGrid items={tableDiagnostics.metrics} />
          </div>
          <div data-markdown-table-warnings>
            <ToolWarningList title={ui(dictionary, "reviewNotes", "Review notes")} warnings={tableDiagnostics.warnings} emptyLabel={ui(dictionary, "markdownTableNoWarnings", "Markdown table rows look ready to copy or preview.")} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={appendTableToPreview} disabled={!tableDiagnostics.markdown}>
              {ui(dictionary, "useTableInPreview", "Use in preview")}
            </Button>
            <Button type="button" variant="outline" onClick={() => copyToClipboard(tableDiagnostics.markdown)} disabled={!tableDiagnostics.markdown}>
              <Copy className="h-4 w-4" />
              {dictionary.tool.copy}
            </Button>
          </div>
          <ResultBlock title={ui(dictionary, "markdownTableOutput", "Markdown table")} value={tableDiagnostics.markdown} dictionary={dictionary} />
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2" data-markdown-preview>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "markdownInput", "Markdown input")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-72" />
        </label>
        <div className="min-h-72 rounded-lg border bg-card p-4 text-sm">
          {lines.map((line, index) => {
            if (line.startsWith("# ")) return <h2 key={index} className="mb-3 text-xl font-semibold">{line.slice(2)}</h2>;
            if (line.startsWith("## ")) return <h3 key={index} className="mb-2 text-lg font-semibold">{line.slice(3)}</h3>;
            if (line.startsWith("- ")) return <li key={index} className="ml-4 list-disc">{line.slice(2)}</li>;
            if (/^`.*`$/.test(line)) return <code key={index} className="my-2 block rounded bg-muted px-2 py-1">{line.slice(1, -1)}</code>;
            if (/^\|.*\|$/.test(line)) return <code key={index} className="mb-1 block overflow-auto whitespace-pre rounded bg-muted px-2 py-1 text-xs">{line}</code>;
            return <p key={index} className="mb-2 text-muted-foreground">{line || "\u00a0"}</p>;
          })}
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(input)}>
            <Copy className="h-4 w-4" />
            {dictionary.tool.copy}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TextSortDedupeTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="Lines"
      defaultInput="beta\nalpha\nbeta\n"
      modes={[
        { value: "sort", label: "Sort lines", transform: (value) => value.split(/\r?\n/).filter(Boolean).sort((a, b) => a.localeCompare(b)).join("\n") },
        { value: "dedupe", label: "Dedupe lines", transform: (value) => Array.from(new Set(value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))).join("\n") },
        { value: "sort-dedupe", label: "Sort and dedupe", transform: (value) => Array.from(new Set(value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b)).join("\n") },
      ]}
    />
  );
}

function WordCounterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("Bob's Multi Tool has practical browser utilities.");
  const bytes = new TextEncoder().encode(input).length;
  const output = [
    `${ui(dictionary, "characters", "Characters")}: ${input.length}`,
    `${ui(dictionary, "charactersNoSpaces", "Characters without spaces")}: ${input.replace(/\s/g, "").length}`,
    `${ui(dictionary, "words", "Words")}: ${input.trim() ? input.trim().split(/\s+/).length : 0}`,
    `${ui(dictionary, "lines", "Lines")}: ${input.split(/\r?\n/).length}`,
    `${ui(dictionary, "bytes", "Bytes")}: ${bytes}`,
    `${ui(dictionary, "estimatedReadingTime", "Estimated reading time")}: ${Math.max(1, Math.ceil((input.trim().split(/\s+/).length || 0) / 220))} ${ui(dictionary, "minutes", "minute(s)")}`,
  ].join("\n");
  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44" />
      <ResultBlock title={ui(dictionary, "textMetrics", "Text metrics")} value={output} dictionary={dictionary} />
    </div>
  );
}

const urlParserExamples = [
  "https://www.bobob.app/tools/json-formatter?q=json&utm_source=docs#top",
  "bobob.app/tools/regex-tester?sample=email",
  "https://api.example.com/v1/users?page=2&sort=created_at",
];

const trackingParameterPattern = /^(utm_|fbclid$|gclid$|msclkid$|mc_cid$|mc_eid$)/i;

function parseUrlInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Empty URL");
  return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
}

function urlPathSegments(url: URL) {
  return url.pathname.split("/").filter(Boolean);
}

function urlQueryRows(url: URL) {
  return Array.from(url.searchParams.entries()).map(([key, value]) => ({
    key,
    value,
    tracking: trackingParameterPattern.test(key),
  }));
}

function cleanUrlCandidate(url: URL) {
  const clean = new URL(url.toString());
  clean.hash = "";
  for (const key of Array.from(clean.searchParams.keys())) {
    if (trackingParameterPattern.test(key)) clean.searchParams.delete(key);
  }
  return clean.toString();
}

function urlParserWarnings(rawValue: string, url: URL, rows: ReturnType<typeof urlQueryRows>, dictionary: ClientDictionary) {
  const rawTrimmed = rawValue.trim();
  return [
    !rawTrimmed.includes("://") ? ui(dictionary, "urlAssumedHttpsWarning", "No protocol was provided, so HTTPS was assumed for parsing.") : "",
    url.protocol !== "https:" ? ui(dictionary, "urlNonHttpsWarning", "Public canonical URLs should usually use HTTPS.") : "",
    url.username || url.password ? ui(dictionary, "urlCredentialsWarning", "Credentials are present in the URL. Remove them before sharing.") : "",
    isPrivateOrLocalHostname(url.hostname) ? ui(dictionary, "urlPrivateHostWarning", "Host looks local or private. Do not use it for public canonical links.") : "",
    url.hash ? ui(dictionary, "urlHashWarning", "Fragment identifiers are not sent to servers and should usually stay out of canonical URLs.") : "",
    rows.some((row) => row.tracking) ? ui(dictionary, "urlTrackingWarning", "Tracking parameters are present. Confirm they are intentional before copying.") : "",
    rows.length > 10 ? ui(dictionary, "urlManyQueryParamsWarning", "This URL has many query parameters. Check whether the canonical URL should be cleaner.") : "",
    /\/{2,}/.test(url.pathname) ? ui(dictionary, "urlDoubleSlashPathWarning", "Path contains repeated slashes. Confirm this is intentional.") : "",
  ].filter(Boolean);
}

function buildUrlCanonicalReport({
  rawValue,
  url,
  rows,
  pathSegments,
  cleanUrl,
  warnings,
  checkedAt,
  dictionary,
}: {
  rawValue: string;
  url: URL;
  rows: ReturnType<typeof urlQueryRows>;
  pathSegments: string[];
  cleanUrl: string;
  warnings: string[];
  checkedAt: string;
  dictionary: ClientDictionary;
}) {
  const canonicalCandidate = `${url.origin}${url.pathname}`;
  const trackingCount = rows.filter((row) => row.tracking).length;
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "urlNoWarnings", "URL structure looks ready for copy or metadata review.")];
  const checklist = [
    ui(dictionary, "urlChecklistFetch", "Fetch the final public URL after redirects before submitting it."),
    ui(dictionary, "urlChecklistCanonical", "Compare the clean URL with canonical tags, Open Graph URL, and sitemap entries."),
    ui(dictionary, "urlChecklistTracking", "Remove tracking parameters unless campaign attribution is intentional."),
    ui(dictionary, "urlChecklistSensitive", "Remove credentials, tokens, callback codes, and fragments before sharing."),
    ui(dictionary, "urlChecklistSearchConsole", "Record Search Console/Bing/Naver follow-up separately because clean URLs are not indexing proof."),
  ];
  const markdown = [
    `# ${ui(dictionary, "urlCanonicalReport", "URL canonical report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt || "-"}`,
    `- ${ui(dictionary, "url", "URL")}: ${url.href}`,
    `- ${ui(dictionary, "protocol", "Protocol")}: ${url.protocol}`,
    `- ${ui(dictionary, "host", "Host")}: ${url.host}`,
    `- ${ui(dictionary, "pathSegments", "Path segments")}: ${pathSegments.length ? pathSegments.join(" / ") : "/"}`,
    `- ${ui(dictionary, "queryParameters", "Query parameters")}: ${rows.length}`,
    `- ${ui(dictionary, "trackingParameters", "Tracking parameters")}: ${trackingCount}`,
    `- ${ui(dictionary, "fragment", "Fragment")}: ${url.hash || "-"}`,
    `- ${ui(dictionary, "canonicalCandidate", "Canonical candidate")}: ${canonicalCandidate}`,
    `- ${ui(dictionary, "cleanUrl", "Clean URL")}: ${cleanUrl}`,
    `- ${ui(dictionary, "commonInput", "Input")}: ${rawValue.trim() || "-"}`,
    "",
    `## ${ui(dictionary, "urlReviewNotes", "URL review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "urlReportChecklist", "Review checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return {
    canonicalCandidate,
    markdown,
    metrics: [
      { label: ui(dictionary, "host", "Host"), value: url.host },
      { label: ui(dictionary, "queryParameters", "Query parameters"), value: String(rows.length) },
      { label: ui(dictionary, "trackingParameters", "Tracking parameters"), value: String(trackingCount) },
      { label: ui(dictionary, "fragment", "Fragment"), value: url.hash || ui(dictionary, "notApplicable", "Not applicable") },
      { label: ui(dictionary, "cleanUrl", "Clean URL"), value: cleanUrl },
    ],
  };
}

function UrlParserTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState(urlParserExamples[0]!);
  const result = React.useMemo(() => {
    try {
      const url = parseUrlInput(input);
      const rows = urlQueryRows(url);
      const pathSegments = urlPathSegments(url);
      const cleanUrl = cleanUrlCandidate(url);
      return {
        error: "",
        url,
        rows,
        pathSegments,
        cleanUrl,
        warnings: urlParserWarnings(input, url, rows, dictionary),
        output: JSON.stringify(
          {
            href: url.href,
            protocol: url.protocol,
            origin: url.origin,
            hostname: url.hostname,
            port: url.port || null,
            pathname: url.pathname,
            pathSegments,
            search: url.search,
            queryParameters: rows,
            hash: url.hash,
            cleanUrl,
          },
          null,
          2,
        ),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : ui(dictionary, "enterValidUrl", "Enter a valid URL."),
        url: null,
        rows: [],
        pathSegments: [],
        cleanUrl: "",
        warnings: [],
        output: "",
      };
    }
  }, [dictionary, input]);
  const [reportCheckedAt, setReportCheckedAt] = React.useState("");
  React.useEffect(() => {
    setReportCheckedAt(new Date().toISOString());
  }, [input]);
  const urlReport = result.url
    ? buildUrlCanonicalReport({
        rawValue: input,
        url: result.url,
        rows: result.rows,
        pathSegments: result.pathSegments,
        cleanUrl: result.cleanUrl,
        warnings: result.warnings,
        checkedAt: reportCheckedAt,
        dictionary,
      })
    : null;

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-md border bg-card p-3" data-url-parser-examples>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "urlParserExamples", "URL examples")}</p>
        <div className="flex flex-wrap gap-2">
          {urlParserExamples.map((example) => (
            <Button key={example} variant="outline" size="sm" onClick={() => setInput(example)} className="max-w-full justify-start">
              <span className="truncate">{example}</span>
            </Button>
          ))}
        </div>
      </section>
      <label className="space-y-2">
        <span className="text-sm font-medium">{ui(dictionary, "url", "URL")}</span>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-28" aria-label={ui(dictionary, "url", "URL")} />
      </label>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "enterValidUrl", "Enter a valid URL.")} message={result.error} />
      ) : (
        <>
          <section className="space-y-3 rounded-md border bg-card p-3" data-url-parser-diagnostics>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{ui(dictionary, "urlStructure", "URL structure")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "urlStructureDescription", "Review host, path, query, tracking, and canonical copy signals before sharing.")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.cleanUrl)}>
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copyCleanUrl", "Copy clean URL")}
              </Button>
            </div>
            <ToolMetricGrid
              items={[
                { label: ui(dictionary, "protocol", "Protocol"), value: result.url?.protocol ?? "—" },
                { label: ui(dictionary, "host", "Host"), value: result.url?.host ?? "—" },
                { label: ui(dictionary, "pathSegments", "Path segments"), value: String(result.pathSegments.length), description: result.pathSegments.join(" / ") || "/" },
                { label: ui(dictionary, "queryParameters", "Query parameters"), value: String(result.rows.length) },
                { label: ui(dictionary, "trackingParameters", "Tracking parameters"), value: String(result.rows.filter((row) => row.tracking).length) },
                { label: ui(dictionary, "fragment", "Fragment"), value: result.url?.hash || ui(dictionary, "notApplicable", "Not applicable") },
              ]}
            />
          </section>
          <section className="rounded-md border bg-card" data-url-query-params>
            <div className="border-b p-3">
              <h3 className="text-sm font-semibold">{ui(dictionary, "queryParameters", "Query parameters")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "queryParameterDescription", "Inspect duplicate, empty, and tracking values before copying a URL into docs or metadata.")}</p>
            </div>
            {result.rows.length ? (
              <div className="divide-y">
                {result.rows.map((row, index) => (
                  <div key={`${row.key}-${index}`} className="grid gap-2 p-3 text-sm md:grid-cols-[minmax(0,180px)_1fr_auto]">
                    <code className="min-w-0 break-all font-medium">{row.key}</code>
                    <code className="min-w-0 break-all text-muted-foreground">{row.value || "—"}</code>
                    {row.tracking ? <Badge>{ui(dictionary, "trackingParameter", "Tracking")}</Badge> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-3 text-sm text-muted-foreground">{ui(dictionary, "noQueryParameters", "No query parameters found.")}</p>
            )}
          </section>
          <section className="space-y-3 rounded-md border bg-card p-3" data-url-canonical-review>
            <ToolMetricGrid
              items={[
                { label: ui(dictionary, "canonicalCandidate", "Canonical candidate"), value: urlReport?.canonicalCandidate ?? "—" },
                { label: ui(dictionary, "cleanUrl", "Clean URL"), value: result.cleanUrl },
              ]}
            />
            <ToolWarningList title={ui(dictionary, "urlReviewNotes", "URL review notes")} warnings={result.warnings} emptyLabel={ui(dictionary, "urlNoWarnings", "URL structure looks ready for copy or metadata review.")} />
          </section>
          {urlReport ? (
            <section className="rounded-md border bg-card" data-url-canonical-report>
              <div className="border-b p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{ui(dictionary, "urlCanonicalReport", "URL canonical report")}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "urlCanonicalReportDescription", "Copy a compact URL structure, clean URL, tracking, and canonical review note before submitting or sharing.")}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(urlReport.markdown)} data-url-canonical-report-copy>
                    <Copy className="h-4 w-4" />
                    {ui(dictionary, "copyUrlCanonicalReport", "Copy report")}
                  </Button>
                </div>
              </div>
              <div className="space-y-3 p-3">
                <ToolMetricGrid items={urlReport.metrics} />
                <ToolWarningList title={ui(dictionary, "urlReviewNotes", "URL review notes")} warnings={result.warnings} emptyLabel={ui(dictionary, "urlNoWarnings", "URL structure looks ready for copy or metadata review.")} />
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-url-canonical-report-preview>
                  <code>{urlReport.markdown}</code>
                </pre>
              </div>
            </section>
          ) : null}
          <ResultBlock title={ui(dictionary, "parsedUrlDetails", "Parsed URL details")} value={result.output} dictionary={dictionary} />
        </>
      )}
    </div>
  );
}

const mimeTypes: Record<string, string> = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  xml: "application/xml",
  csv: "text/csv",
  txt: "text/plain",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
  zip: "application/zip",
  wasm: "application/wasm",
};

function MimeLookupTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel={ui(dictionary, "extensionOrMimeType", "Extension or MIME type")}
      defaultInput=".json"
      modes={[
        {
          value: "lookup",
          label: ui(dictionary, "lookup", "Lookup"),
          transform: (value) => {
            const normalized = value.trim().toLowerCase().replace(/^\./, "");
            const byExtension = mimeTypes[normalized];
            const byMime = Object.entries(mimeTypes).filter(([, mime]) => mime === value.trim().toLowerCase()).map(([ext]) => `.${ext}`);
            return byExtension ? `${normalized}: ${byExtension}` : byMime.length ? `${value}: ${byMime.join(", ")}` : ui(dictionary, "noCommonMimeTypeFound", "No common MIME type found.");
          },
        },
      ]}
    />
  );
}

const crockford = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function makeUlid() {
  const now = Date.now();
  let time = "";
  let value = now;
  for (let index = 0; index < 10; index += 1) {
    time = crockford[value % 32] + time;
    value = Math.floor(value / 32);
  }
  const random = Array.from(randomBytes(16), (byte) => crockford[byte % 32]).join("");
  return `${time}${random}`;
}

function UlidTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [count, setCount] = React.useState(5);
  const [values, setValues] = React.useState<string[]>(sampleUlids);
  const regenerate = React.useCallback(() => {
    setValues(Array.from({ length: Math.max(1, Math.min(count, 50)) }, makeUlid));
  }, [count]);
  return (
    <div className="space-y-4">
      <GeneratorControls count={count} setCount={setCount} regenerate={regenerate} dictionary={dictionary} />
      <ResultBlock title={ui(dictionary, "ulidValues", "ULID values")} value={values.join("\n")} dictionary={dictionary} />
    </div>
  );
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isPrivateOrLocalHostname(hostname: string) {
  const lowerHostname = hostname.toLowerCase();
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(lowerHostname)) return true;
  if (lowerHostname.endsWith(".local") || lowerHostname.endsWith(".internal") || lowerHostname.endsWith(".test")) return true;
  const ipv4Parts = lowerHostname.split(".").map((part) => Number(part));
  if (ipv4Parts.length === 4 && ipv4Parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)) {
    const [first, second] = ipv4Parts;
    return first === 10 || first === 127 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168) || (first === 169 && second === 254);
  }
  return false;
}

function parsePublicUrl(value: string) {
  try {
    const parsed = new URL(value);
    parsed.hash = "";
    return parsed;
  } catch {
    return null;
  }
}

function buildSearchDiscoveryReport({
  rawUrlCount,
  uniqueUrls,
  duplicateCount,
  warnings,
  checkedAt,
  dictionary,
}: {
  rawUrlCount: number;
  uniqueUrls: URL[];
  duplicateCount: number;
  warnings: string[];
  checkedAt: string;
  dictionary: ClientDictionary;
}) {
  const hosts = Array.from(new Set(uniqueUrls.map((url) => url.hostname)));
  const primaryHost = hosts[0] ?? "-";
  const httpsUrls = uniqueUrls.filter((url) => url.protocol === "https:").length;
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "searchDiscoveryReportNoWarnings", "No sitemap URL warnings were detected.")];
  const checklist = [
    ui(dictionary, "searchDiscoveryChecklistFinal200", "Fetch submitted URLs as Googlebot or a public browser and confirm final 200 responses."),
    ui(dictionary, "searchDiscoveryChecklistSubmit", "Submit the sitemap in Search Console, Bing Webmaster Tools, and any regional webmaster tools you use."),
    ui(dictionary, "searchDiscoveryChecklistRobots", "Keep robots.txt pointing at the public sitemap URL."),
    ui(dictionary, "searchDiscoveryChecklistCanonical", "Confirm page canonical links use the same final host and URL shape."),
    ui(dictionary, "searchDiscoveryChecklistPing", "Use IndexNow or feed/WebSub pings only as discovery signals after content changes."),
  ];
  const urlSample = uniqueUrls.slice(0, 5).map((url) => url.href);
  const markdown = [
    `# ${ui(dictionary, "searchDiscoveryReport", "Search discovery report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt || "-"}`,
    `- ${ui(dictionary, "urlCount", "URL count")}: ${rawUrlCount}`,
    `- ${ui(dictionary, "generatedEntries", "Generated sitemap entries")}: ${uniqueUrls.length}`,
    `- ${ui(dictionary, "primaryHost", "Primary host")}: ${primaryHost}`,
    `- ${ui(dictionary, "uniqueHosts", "Unique hosts")}: ${hosts.length}`,
    `- ${ui(dictionary, "httpsUrls", "HTTPS URLs")}: ${httpsUrls}`,
    `- ${ui(dictionary, "duplicateUrls", "Duplicate URLs")}: ${duplicateCount}`,
    "",
    `## ${ui(dictionary, "searchDiscoveryReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "searchDiscoveryReportChecklist", "Submission checklist")}`,
    ...checklist.map((item) => `- ${item}`),
    "",
    `## ${ui(dictionary, "urlSample", "URL sample")}`,
    ...(urlSample.length ? urlSample.map((url) => `- ${url}`) : [`- ${ui(dictionary, "searchDiscoveryReportNoUrls", "Add public URLs before copying a discovery report.")}`]),
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    metrics: [
      { label: ui(dictionary, "generatedEntries", "Generated sitemap entries"), value: String(uniqueUrls.length) },
      { label: ui(dictionary, "primaryHost", "Primary host"), value: primaryHost },
      { label: ui(dictionary, "uniqueHosts", "Unique hosts"), value: String(hosts.length) },
      { label: ui(dictionary, "httpsUrls", "HTTPS URLs"), value: String(httpsUrls) },
    ],
  };
}

function buildRobotsCrawlReport({
  sitemap,
  sitemapUrl,
  mode,
  customRuleLines,
  output,
  warnings,
  checkedAt,
  dictionary,
}: {
  sitemap: string;
  sitemapUrl: URL | null;
  mode: string;
  customRuleLines: string[];
  output: string;
  warnings: string[];
  checkedAt: string;
  dictionary: ClientDictionary;
}) {
  const directiveCount = output.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#")).length;
  const crawlPolicy = mode === "allow" ? ui(dictionary, "robotsAllowAll", "Allow all") : ui(dictionary, "robotsBlockAll", "Block all");
  const sitemapValue = sitemapUrl?.href ?? (sitemap.trim() || "-");
  const sitemapHost = sitemapUrl?.hostname ?? ui(dictionary, "invalidUrl", "Invalid URL");
  const reviewNotes = warnings.length ? warnings : [ui(dictionary, "robotsCrawlReportNoWarnings", "No robots.txt crawl warnings were detected.")];
  const checklist = [
    ui(dictionary, "robotsChecklistFetch", "Fetch /robots.txt on the public host and confirm it returns 200 text/plain."),
    ui(dictionary, "robotsChecklistSitemap", "Confirm the Sitemap directive points at the submitted canonical sitemap."),
    ui(dictionary, "robotsChecklistPublicPaths", "Check that public tool, Blog, Play, trust, and sitemap paths are not accidentally blocked."),
    ui(dictionary, "robotsChecklistCanonical", "Keep canonical links, sitemap URLs, and robots host on the same public domain."),
    ui(dictionary, "robotsChecklistResubmit", "After changing crawl rules, refresh sitemap discovery and record Search Console/Bing/Naver follow-up separately."),
  ];
  const markdown = [
    `# ${ui(dictionary, "robotsCrawlReport", "Robots crawl report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt || "-"}`,
    `- ${ui(dictionary, "crawlPolicy", "Crawl policy")}: ${crawlPolicy}`,
    `- ${ui(dictionary, "sitemapUrl", "Sitemap URL")}: ${sitemapValue}`,
    `- ${ui(dictionary, "sitemapHost", "Sitemap host")}: ${sitemapHost}`,
    `- ${ui(dictionary, "directiveCount", "Directive count")}: ${directiveCount}`,
    `- ${ui(dictionary, "customDirectiveCount", "Custom directives")}: ${customRuleLines.length}`,
    "",
    `## ${ui(dictionary, "robotsCrawlReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "robotsCrawlReportChecklist", "Crawl checklist")}`,
    ...checklist.map((item) => `- ${item}`),
    "",
    "## robots.txt",
    "```txt",
    output,
    "```",
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    metrics: [
      { label: ui(dictionary, "crawlPolicy", "Crawl policy"), value: crawlPolicy },
      { label: ui(dictionary, "sitemapHost", "Sitemap host"), value: sitemapHost },
      { label: ui(dictionary, "directiveCount", "Directive count"), value: String(directiveCount) },
      { label: ui(dictionary, "customDirectiveCount", "Custom directives"), value: String(customRuleLines.length) },
    ],
  };
}

function RobotsGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [sitemap, setSitemap] = React.useState("https://www.bobob.app/sitemap.xml");
  const [mode, setMode] = React.useState("allow");
  const [customRules, setCustomRules] = React.useState("Disallow: /api/\nDisallow: /admin/");
  const [reportCheckedAt, setReportCheckedAt] = React.useState("");
  React.useEffect(() => {
    setReportCheckedAt(new Date().toISOString());
  }, [customRules, mode, sitemap]);
  const sitemapUrl = parsePublicUrl(sitemap.trim());
  const customRuleLines = customRules
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const output = [
    "User-agent: *",
    mode === "allow" ? "Allow: /" : "Disallow: /",
    ...customRuleLines,
    "",
    sitemap.trim() ? `Sitemap: ${sitemap.trim()}` : "",
  ].filter((line, index, lines) => line || (lines[index - 1] && lines[index + 1])).join("\n");
  const warnings = [
    !sitemap.trim() ? ui(dictionary, "robotsMissingSitemapWarning", "Add a sitemap URL so crawlers can discover canonical pages.") : "",
    sitemap.trim() && !sitemapUrl ? ui(dictionary, "robotsInvalidSitemapWarning", "Sitemap URL is not a valid absolute URL.") : "",
    sitemapUrl && sitemapUrl.protocol !== "https:" ? ui(dictionary, "robotsNonHttpsSitemapWarning", "Use an HTTPS sitemap URL for the production host.") : "",
    sitemapUrl && isPrivateOrLocalHostname(sitemapUrl.hostname) ? ui(dictionary, "robotsPrivateSitemapWarning", "Sitemap points to a local or private host. Use the public canonical domain.") : "",
    mode === "block" ? ui(dictionary, "robotsBlockAllWarning", "Block all prevents normal crawling. Use it only for private or temporary environments.") : "",
    customRuleLines.some((line) => !/^(allow|disallow|crawl-delay|user-agent):/i.test(line)) ? ui(dictionary, "robotsUnknownDirectiveWarning", "One or more custom lines are not common robots.txt directives.") : "",
  ].filter(Boolean);
  const crawlReport = buildRobotsCrawlReport({ sitemap, sitemapUrl, mode, customRuleLines, output, warnings, checkedAt: reportCheckedAt, dictionary });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <Input value={sitemap} onChange={(event) => setSitemap(event.target.value)} aria-label={ui(dictionary, "robotsSitemapUrl", "Sitemap URL")} />
        <Select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="allow">{ui(dictionary, "robotsAllowAll", "Allow all")}</option>
          <option value="block">{ui(dictionary, "robotsBlockAll", "Block all")}</option>
        </Select>
      </div>
      <Textarea value={customRules} onChange={(event) => setCustomRules(event.target.value)} className="min-h-28" aria-label={ui(dictionary, "robotsCustomRules", "Custom crawl directives")} />
      <ToolMetricGrid
        items={[
          { label: ui(dictionary, "crawlPolicy", "Crawl policy"), value: mode === "allow" ? ui(dictionary, "robotsAllowAll", "Allow all") : ui(dictionary, "robotsBlockAll", "Block all") },
          { label: ui(dictionary, "sitemapUrl", "Sitemap URL"), value: sitemapUrl ? sitemapUrl.hostname : ui(dictionary, "invalidUrl", "Invalid URL") },
          { label: ui(dictionary, "directiveCount", "Directive count"), value: String(output.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#")).length) },
          { label: ui(dictionary, "userAgentDirective", "User-agent"), value: "*" },
        ]}
      />
      <div data-robots-diagnostics>
        <ToolWarningList title={ui(dictionary, "robotsWarnings", "robots.txt review")} warnings={warnings} emptyLabel={ui(dictionary, "robotsLooksReady", "robots.txt is ready for a public crawl review.")} />
      </div>
      <section className="rounded-md border bg-card" data-robots-crawl-report>
        <div className="border-b p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{ui(dictionary, "robotsCrawlReport", "Robots crawl report")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "robotsCrawlReportDescription", "Copy a compact crawl policy, sitemap directive, warning, and follow-up checklist before changing public crawler access.")}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(crawlReport.markdown)} data-robots-crawl-report-copy>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copyRobotsCrawlReport", "Copy report")}
            </Button>
          </div>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={crawlReport.metrics} />
          <ToolWarningList title={ui(dictionary, "robotsCrawlReportReviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "robotsCrawlReportNoWarnings", "No robots.txt crawl warnings were detected.")} />
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-robots-crawl-report-preview>
            <code>{crawlReport.markdown}</code>
          </pre>
        </div>
      </section>
      <ResultBlock title="robots.txt" value={output} dictionary={dictionary} />
    </div>
  );
}

function SitemapGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [urls, setUrls] = React.useState("https://www.bobob.app/\nhttps://www.bobob.app/tools/json-formatter");
  const [reportCheckedAt, setReportCheckedAt] = React.useState("");
  React.useEffect(() => {
    setReportCheckedAt(new Date().toISOString());
  }, [urls]);
  const rawUrls = urls.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
  const parsedUrls = rawUrls.map((value) => ({ value, parsed: parsePublicUrl(value) }));
  const validUrls = parsedUrls.filter((entry): entry is { value: string; parsed: URL } => Boolean(entry.parsed));
  const uniqueUrls = Array.from(new Map(validUrls.map((entry) => [entry.parsed.href, entry.parsed])).values());
  const hostnames = new Set(uniqueUrls.map((url) => url.hostname));
  const privateUrls = uniqueUrls.filter((url) => isPrivateOrLocalHostname(url.hostname));
  const nonHttpsUrls = uniqueUrls.filter((url) => url.protocol !== "https:");
  const duplicateCount = Math.max(0, validUrls.length - uniqueUrls.length);
  const warnings = [
    parsedUrls.some((entry) => !entry.parsed) ? ui(dictionary, "sitemapInvalidUrlWarning", "One or more lines are not valid absolute URLs and were omitted.") : "",
    duplicateCount > 0 ? ui(dictionary, "sitemapDuplicateUrlWarning", "Duplicate URLs were removed from the generated sitemap.") : "",
    nonHttpsUrls.length > 0 ? ui(dictionary, "sitemapNonHttpsUrlWarning", "Use HTTPS URLs for production sitemap entries.") : "",
    privateUrls.length > 0 ? ui(dictionary, "sitemapPrivateUrlWarning", "Local or private hosts should not be included in a public sitemap.") : "",
    hostnames.size > 1 ? ui(dictionary, "sitemapMixedHostWarning", "Multiple hosts are present. Confirm canonical host strategy before submitting.") : "",
    uniqueUrls.length > 50000 ? ui(dictionary, "sitemapTooManyUrlsWarning", "A sitemap file should stay at or below 50,000 URLs.") : "",
  ].filter(Boolean);
  const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls
    .map((url) => `  <url><loc>${escapeXml(url.href)}</loc></url>`)
    .join("\n")}\n</urlset>`;
  const searchDiscoveryReport = buildSearchDiscoveryReport({
    rawUrlCount: rawUrls.length,
    uniqueUrls,
    duplicateCount,
    warnings,
    checkedAt: reportCheckedAt,
    dictionary,
  });
  return (
    <div className="space-y-4">
      <Textarea value={urls} onChange={(event) => setUrls(event.target.value)} className="min-h-44" aria-label={ui(dictionary, "sitemapUrlList", "Sitemap URL list")} />
      <ToolMetricGrid
        items={[
          { label: ui(dictionary, "urlCount", "URL count"), value: String(rawUrls.length) },
          { label: ui(dictionary, "validUrls", "Valid URLs"), value: String(uniqueUrls.length), description: ui(dictionary, "generatedEntries", "Generated sitemap entries") },
          { label: ui(dictionary, "duplicateUrls", "Duplicate URLs"), value: String(duplicateCount) },
          { label: ui(dictionary, "hostCount", "Host count"), value: String(hostnames.size) },
        ]}
      />
      <div data-sitemap-diagnostics>
        <ToolWarningList title={ui(dictionary, "sitemapWarnings", "Sitemap review")} warnings={warnings} emptyLabel={ui(dictionary, "sitemapLooksReady", "Sitemap entries are ready for a public crawl review.")} />
      </div>
      <section className="rounded-md border bg-card" data-search-discovery-report>
        <div className="border-b p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{ui(dictionary, "searchDiscoveryReport", "Search discovery report")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "searchDiscoveryReportDescription", "Copy a compact sitemap, host, warning, and submission checklist note before Search Console or webmaster follow-up.")}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(searchDiscoveryReport.markdown)}>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copySearchDiscoveryReport", "Copy report")}
            </Button>
          </div>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={searchDiscoveryReport.metrics} />
          <ToolWarningList title={ui(dictionary, "searchDiscoveryReportReviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "searchDiscoveryReportNoWarnings", "No sitemap URL warnings were detected.")} />
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-search-discovery-report-preview>
            <code>{searchDiscoveryReport.markdown}</code>
          </pre>
        </div>
      </section>
      <ResultBlock title={ui(dictionary, "xmlSitemap", "XML sitemap")} value={output} dictionary={dictionary} />
    </div>
  );
}

function OpenGraphPreviewTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [title, setTitle] = React.useState("Bob's Multi Tool");
  const [description, setDescription] = React.useState("Practical developer utilities for daily workflows.");
  const [url, setUrl] = React.useState("https://www.bobob.app");
  const [image, setImage] = React.useState("https://www.bobob.app/og-image.png");
  const [robots, setRobots] = React.useState("index,follow");
  const [reportCheckedAt, setReportCheckedAt] = React.useState("");
  React.useEffect(() => {
    setReportCheckedAt(new Date().toISOString());
  }, [description, image, robots, title, url]);
  const titleText = title.trim();
  const descriptionText = description.trim();
  const pageUrl = parsePublicUrl(url.trim());
  const imageUrl = parsePublicUrl(image.trim());
  const warnings = [
    !titleText ? ui(dictionary, "ogTitleMissingWarning", "Open Graph title is missing.") : "",
    titleText.length > 70 ? ui(dictionary, "ogTitleTooLongWarning", "Open Graph title is long and may truncate in link previews.") : "",
    !descriptionText ? ui(dictionary, "ogDescriptionMissingWarning", "Open Graph description is missing.") : "",
    descriptionText.length > 200 ? ui(dictionary, "ogDescriptionTooLongWarning", "Open Graph description is long and may be clipped.") : "",
    url.trim() && !pageUrl ? ui(dictionary, "canonicalInvalidWarning", "Canonical URL is not a valid absolute URL.") : "",
    pageUrl && pageUrl.protocol !== "https:" ? ui(dictionary, "canonicalNonHttpsWarning", "Use HTTPS for canonical URLs on public pages.") : "",
    pageUrl && isPrivateOrLocalHostname(pageUrl.hostname) ? ui(dictionary, "canonicalPrivateWarning", "Canonical URL points to a local or private host.") : "",
    url.includes("#") ? ui(dictionary, "canonicalHashWarning", "Canonical URLs should not include fragment identifiers.") : "",
    robots.startsWith("noindex") ? ui(dictionary, "noindexWarning", "Noindex prevents the page from appearing in search results.") : "",
    !image.trim() ? ui(dictionary, "imageMissingWarning", "Add an Open Graph image for richer social previews.") : "",
    image.trim() && !imageUrl ? ui(dictionary, "imageInvalidWarning", "Image URL is not a valid absolute URL.") : "",
    imageUrl && imageUrl.protocol !== "https:" ? ui(dictionary, "imageNonHttpsWarning", "Use HTTPS image URLs for social preview crawlers.") : "",
    imageUrl && isPrivateOrLocalHostname(imageUrl.hostname) ? ui(dictionary, "imagePrivateWarning", "Image URL points to a local or private host.") : "",
    imageUrl && !getImageExtensionSignal(imageUrl) ? ui(dictionary, "ogImageFormatWarning", "Image URL should usually end with PNG, JPG, WebP, GIF, or AVIF.") : "",
  ].filter(Boolean);
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeXml(titleText)}" />`,
    `<meta property="og:description" content="${escapeXml(descriptionText)}" />`,
    `<meta property="og:url" content="${escapeXml(pageUrl?.href ?? url.trim())}" />`,
    `<meta property="og:image" content="${escapeXml(imageUrl?.href ?? image.trim())}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeXml(titleText)}" />`,
    `<meta name="twitter:description" content="${escapeXml(descriptionText)}" />`,
    `<meta name="twitter:image" content="${escapeXml(imageUrl?.href ?? image.trim())}" />`,
  ].join("\n");
  const crawlerReport = buildOpenGraphCrawlerReport({
    titleText,
    descriptionText,
    pageUrl,
    rawUrl: url,
    imageUrl,
    rawImage: image,
    robots,
    warnings,
    tags,
    checkedAt: reportCheckedAt,
    dictionary,
  });
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "title", "Title")}</span>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "url", "URL")}</span>
          <Input value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium">{ui(dictionary, "description", "Description")}</span>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "openGraphImage", "Open Graph image")}</span>
          <Input value={image} onChange={(event) => setImage(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "robotsPolicy", "Robots policy")}</span>
          <Select value={robots} onChange={(event) => setRobots(event.target.value)}>
            <option value="index,follow">index,follow</option>
            <option value="noindex,follow">noindex,follow</option>
            <option value="noindex,nofollow">noindex,nofollow</option>
          </Select>
        </label>
      </div>
      <div className="max-w-xl overflow-hidden rounded-lg border bg-card">
        <div className="aspect-[1.91/1] bg-muted p-4 text-sm text-muted-foreground">{image}</div>
        <div className="space-y-1 p-4">
          <p className="text-xs uppercase text-muted-foreground">{url}</p>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ToolMetricGrid
        items={[
          { label: ui(dictionary, "titleLength", "Title length"), value: String(titleText.length), description: "1-70" },
          { label: ui(dictionary, "descriptionLength", "Description length"), value: String(descriptionText.length), description: "1-200" },
          { label: ui(dictionary, "pageHost", "Page host"), value: getUrlHostLabel(pageUrl, dictionary) },
          { label: ui(dictionary, "imageHost", "Image host"), value: image.trim() ? getUrlHostLabel(imageUrl, dictionary) : "-" },
          { label: ui(dictionary, "robotsPolicy", "Robots policy"), value: robots },
        ]}
      />
      <div data-og-diagnostics>
        <ToolWarningList title={ui(dictionary, "openGraphReview", "Open Graph review")} warnings={warnings} emptyLabel={ui(dictionary, "openGraphLooksReady", "Open Graph tags look ready for link previews.")} />
      </div>
      <section className="rounded-md border bg-card" data-og-crawler-report>
        <div className="border-b p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{crawlerReport.reportTitle}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "metaCrawlerReportDescription", "Copy a compact title, description, canonical, robots, image, and crawler follow-up note before changing public metadata.")}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(crawlerReport.markdown)} data-og-crawler-report-copy>
              <Copy className="h-4 w-4" />
              {ui(dictionary, "copyMetaCrawlerReport", "Copy report")}
            </Button>
          </div>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={crawlerReport.metrics} />
          <ToolWarningList title={ui(dictionary, "metaCrawlerReportReviewNotes", "Review notes")} warnings={warnings} emptyLabel={ui(dictionary, "metaCrawlerReportNoWarnings", "No metadata crawler warnings were detected.")} />
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-og-crawler-report-preview>
            <code>{crawlerReport.markdown}</code>
          </pre>
        </div>
      </section>
      <ResultBlock title={ui(dictionary, "openGraphTags", "Open Graph tags")} value={tags} dictionary={dictionary} />
    </div>
  );
}

function FaviconGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [text, setText] = React.useState("B");
  const [bg, setBg] = React.useState("#18181b");
  const [fg, setFg] = React.useState("#fafafa");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${bg}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="34" font-weight="700" fill="${fg}">${text.slice(0, 2)}</text></svg>`;
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Input value={text} onChange={(event) => setText(event.target.value)} aria-label={ui(dictionary, "text", "Text")} />
        <Input value={bg} onChange={(event) => setBg(event.target.value)} aria-label={ui(dictionary, "background", "Background")} />
        <Input value={fg} onChange={(event) => setFg(event.target.value)} aria-label={ui(dictionary, "foreground", "Foreground")} />
      </div>
      <div className="flex h-24 w-24 items-center justify-center rounded-lg border bg-muted">
        <Image src={dataUrl} alt={ui(dictionary, "generatedFavicon", "Generated favicon")} width={64} height={64} unoptimized className="h-16 w-16" />
      </div>
      <ResultBlock title={ui(dictionary, "faviconMarkup", "Favicon markup")} value={`<link rel="icon" href="${dataUrl}" />\n${svg}`} dictionary={dictionary} />
    </div>
  );
}

type HttpRedirectHop = {
  url: string;
  status: number;
  statusText: string;
  location: string | null;
  contentType: string | null;
  cacheControl?: string | null;
  elapsedMs?: number;
};

type HttpStatusResult = {
  inputUrl?: string;
  finalUrl?: string;
  redirectCount?: number;
  redirectChain?: HttpRedirectHop[];
  finalResponseHeaders?: Array<{ name: string; value: string }>;
  status?: number;
  statusText?: string;
  ok?: boolean;
  contentType?: string | null;
  cacheControl?: string | null;
  server?: string | null;
  error?: string;
};

type ParsedHttpHeader = {
  name: string;
  value: string;
  categoryKey: string;
  categoryFallback: string;
};

type SecurityHeaderCheck = {
  key: string;
  label: string;
  present: boolean;
  required: boolean;
  detail: string;
};

type CspDirectiveKey = "defaultSrc" | "scriptSrc" | "styleSrc" | "imgSrc" | "connectSrc" | "fontSrc" | "frameAncestors";
type CspDirectives = Record<CspDirectiveKey, string>;
type CspPresetKey = "strict" | "marketing" | "preview";

const cspDirectiveRows: Array<{
  key: CspDirectiveKey;
  directive: string;
  labelKey: string;
  fallbackLabel: string;
}> = [
  { key: "defaultSrc", directive: "default-src", labelKey: "defaultSrc", fallbackLabel: "default-src" },
  { key: "scriptSrc", directive: "script-src", labelKey: "scriptSrc", fallbackLabel: "script-src" },
  { key: "styleSrc", directive: "style-src", labelKey: "styleSrc", fallbackLabel: "style-src" },
  { key: "imgSrc", directive: "img-src", labelKey: "imgSrc", fallbackLabel: "img-src" },
  { key: "connectSrc", directive: "connect-src", labelKey: "connectSrc", fallbackLabel: "connect-src" },
  { key: "fontSrc", directive: "font-src", labelKey: "fontSrc", fallbackLabel: "font-src" },
  { key: "frameAncestors", directive: "frame-ancestors", labelKey: "frameAncestors", fallbackLabel: "frame-ancestors" },
];

const cspPresets: Record<CspPresetKey, { labelKey: string; fallbackLabel: string; directives: CspDirectives }> = {
  strict: {
    labelKey: "cspStrictPreset",
    fallbackLabel: "Strict app",
    directives: {
      defaultSrc: "'self'",
      scriptSrc: "'self'",
      styleSrc: "'self'",
      imgSrc: "'self' data:",
      connectSrc: "'self'",
      fontSrc: "'self'",
      frameAncestors: "'none'",
    },
  },
  marketing: {
    labelKey: "cspMarketingPreset",
    fallbackLabel: "Marketing site",
    directives: {
      defaultSrc: "'self'",
      scriptSrc: "'self' https:",
      styleSrc: "'self' 'unsafe-inline' https:",
      imgSrc: "'self' data: https:",
      connectSrc: "'self' https:",
      fontSrc: "'self' data: https:",
      frameAncestors: "'none'",
    },
  },
  preview: {
    labelKey: "cspPreviewPreset",
    fallbackLabel: "Local preview",
    directives: {
      defaultSrc: "'self'",
      scriptSrc: "'self' 'unsafe-inline' 'unsafe-eval' http: https:",
      styleSrc: "'self' 'unsafe-inline'",
      imgSrc: "'self' data: blob: http: https:",
      connectSrc: "'self' ws: http: https:",
      fontSrc: "'self' data:",
      frameAncestors: "'self'",
    },
  },
};

const httpHeaderExamples = [
  {
    labelKey: "httpHeadersSecurityExample",
    fallbackLabel: "Security headers",
    value: [
      "HTTP/2 200 OK",
      "content-type: text/html; charset=utf-8",
      "cache-control: public, max-age=3600",
      "strict-transport-security: max-age=31536000; includeSubDomains",
      "content-security-policy: default-src 'self'; img-src 'self' https:",
      "x-frame-options: DENY",
    ].join("\n"),
  },
  {
    labelKey: "httpHeadersCookieExample",
    fallbackLabel: "Cookie review",
    value: [
      "HTTP/1.1 200 OK",
      "content-type: text/html",
      "cache-control: public, max-age=600",
      "set-cookie: session=abc123; Path=/; HttpOnly",
      "set-cookie: theme=dark; Path=/; SameSite=Lax",
    ].join("\n"),
  },
  {
    labelKey: "httpHeadersCorsExample",
    fallbackLabel: "CORS headers",
    value: [
      "HTTP/1.1 204 No Content",
      "access-control-allow-origin: *",
      "access-control-allow-credentials: true",
      "access-control-allow-methods: GET, POST, OPTIONS",
      "vary: Origin",
    ].join("\n"),
  },
];

function classifyHttpHeader(name: string) {
  if (["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"].includes(name)) {
    return { categoryKey: "securityHeaderCategory", categoryFallback: "Security" };
  }
  if (["cache-control", "etag", "expires", "last-modified", "pragma"].includes(name)) {
    return { categoryKey: "cacheHeaderCategory", categoryFallback: "Cache" };
  }
  if (name.startsWith("access-control-") || name === "vary") {
    return { categoryKey: "corsHeaderCategory", categoryFallback: "CORS" };
  }
  if (name === "set-cookie" || name === "cookie") {
    return { categoryKey: "cookieHeaderCategory", categoryFallback: "Cookie" };
  }
  if (["content-type", "content-length", "content-encoding", "content-language"].includes(name)) {
    return { categoryKey: "contentHeaderCategory", categoryFallback: "Content" };
  }
  return { categoryKey: "generalHeaderCategory", categoryFallback: "General" };
}

function getSecurityHeaderChecks(valuesByName: Map<string, string[]>, dictionary: ClientDictionary): SecurityHeaderCheck[] {
  const valueOf = (name: string) => (valuesByName.get(name) ?? []).join(", ").toLowerCase();
  const hasHeader = (name: string) => valuesByName.has(name);
  const cspValue = `${valueOf("content-security-policy")} ${valueOf("content-security-policy-report-only")}`;
  const xContentTypeOptions = valueOf("x-content-type-options");

  return [
    {
      key: "hsts",
      label: "Strict-Transport-Security",
      present: hasHeader("strict-transport-security"),
      required: true,
      detail: ui(dictionary, "hstsHeaderDetail", "Protects HTTPS users from protocol downgrade after the first visit."),
    },
    {
      key: "csp",
      label: "Content-Security-Policy",
      present: hasHeader("content-security-policy") || hasHeader("content-security-policy-report-only"),
      required: true,
      detail: ui(dictionary, "cspHeaderDetail", "Restricts script, style, image, connection, and frame sources."),
    },
    {
      key: "x-content-type-options",
      label: "X-Content-Type-Options",
      present: xContentTypeOptions.includes("nosniff"),
      required: true,
      detail: ui(dictionary, "xContentTypeHeaderDetail", "nosniff helps browsers avoid MIME type confusion."),
    },
    {
      key: "frame-protection",
      label: "X-Frame-Options / frame-ancestors",
      present: hasHeader("x-frame-options") || cspValue.includes("frame-ancestors"),
      required: false,
      detail: ui(dictionary, "frameProtectionHeaderDetail", "Controls whether other sites can embed the page in a frame."),
    },
    {
      key: "referrer-policy",
      label: "Referrer-Policy",
      present: hasHeader("referrer-policy"),
      required: false,
      detail: ui(dictionary, "referrerPolicyHeaderDetail", "Limits how much URL information is sent to other origins."),
    },
    {
      key: "permissions-policy",
      label: "Permissions-Policy",
      present: hasHeader("permissions-policy"),
      required: false,
      detail: ui(dictionary, "permissionsPolicyHeaderDetail", "Restricts access to browser capabilities such as camera, geolocation, and fullscreen."),
    },
  ];
}

function parseHttpHeaders(rawHeaders: string, dictionary: ClientDictionary) {
  const entries: ParsedHttpHeader[] = [];
  let malformedLines = 0;

  for (const line of rawHeaders.split(/\r?\n/)) {
    const trimmed = line.trimEnd();
    if (!trimmed.trim()) continue;
    if (/^HTTP\/\d(?:\.\d)?\s+\d{3}/i.test(trimmed)) continue;
    if (/^\s/.test(line) && entries.length) {
      entries[entries.length - 1].value = `${entries[entries.length - 1].value} ${trimmed.trim()}`;
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex <= 0) {
      malformedLines += 1;
      continue;
    }

    const originalName = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    const normalizedName = originalName.toLowerCase();
    entries.push({
      name: normalizedName,
      value,
      ...classifyHttpHeader(normalizedName),
    });
  }

  const valuesByName = new Map<string, string[]>();
  for (const entry of entries) {
    const values = valuesByName.get(entry.name) ?? [];
    values.push(entry.value);
    valuesByName.set(entry.name, values);
  }

  const valueOf = (name: string) => (valuesByName.get(name) ?? []).join(", ").toLowerCase();
  const hasHeader = (name: string) => valuesByName.has(name);
  const cookies = valuesByName.get("set-cookie") ?? [];
  const securityHeaders = entries.filter((entry) => entry.categoryKey === "securityHeaderCategory").length;
  const corsHeaders = entries.filter((entry) => entry.categoryKey === "corsHeaderCategory").length;
  const duplicateHeaderNames = Array.from(valuesByName.values()).filter((values) => values.length > 1).length;
  const securityChecks = getSecurityHeaderChecks(valuesByName, dictionary);
  const presentSecurityHeaders = securityChecks.filter((check) => check.present).length;
  const missingRequiredSecurityHeaders = securityChecks.filter((check) => check.required && !check.present).length;
  const warnings = [
    !entries.length ? ui(dictionary, "httpHeadersEmptyWarning", "Paste response headers before reviewing.") : "",
    malformedLines ? ui(dictionary, "httpHeadersMalformedWarning", "{count} header lines could not be parsed.").replace("{count}", String(malformedLines)) : "",
    entries.length && !hasHeader("strict-transport-security") ? ui(dictionary, "httpHeadersMissingHstsWarning", "HSTS is missing. HTTPS pages usually need Strict-Transport-Security.") : "",
    entries.length && !hasHeader("content-security-policy") ? ui(dictionary, "httpHeadersMissingCspWarning", "Content-Security-Policy is missing. Add one before exposing sensitive pages.") : "",
    cookies.some((cookie) => !/;\s*secure\b/i.test(cookie)) ? ui(dictionary, "httpHeadersCookieSecureWarning", "At least one Set-Cookie header is missing Secure.") : "",
    cookies.some((cookie) => !/;\s*httponly\b/i.test(cookie)) ? ui(dictionary, "httpHeadersCookieHttpOnlyWarning", "At least one Set-Cookie header is missing HttpOnly.") : "",
    cookies.some((cookie) => !/;\s*samesite=/i.test(cookie)) ? ui(dictionary, "httpHeadersCookieSameSiteWarning", "At least one Set-Cookie header is missing SameSite.") : "",
    valueOf("access-control-allow-origin").includes("*") && valueOf("access-control-allow-credentials").includes("true")
      ? ui(dictionary, "httpHeadersCorsWildcardWarning", "CORS allows wildcard origin with credentials. Browsers reject or expose risky intent.")
      : "",
    valueOf("cache-control").includes("public") && cookies.length
      ? ui(dictionary, "httpHeadersPublicCookieCacheWarning", "Public cache headers appear with Set-Cookie. Confirm private data is not cacheable.")
      : "",
  ].filter(Boolean);

  return {
    entries,
    malformedLines,
    metrics: {
      headerCount: entries.length,
      duplicateHeaderNames,
      securityHeaders,
      corsHeaders,
      cookieHeaders: cookies.length,
      presentSecurityHeaders,
      securityCheckCount: securityChecks.length,
      missingRequiredSecurityHeaders,
    },
    securityChecks,
    warnings,
  };
}

function buildCspHeader(directives: CspDirectives, reportOnly: boolean) {
  const policy = cspDirectiveRows
    .map((row) => {
      const value = directives[row.key].trim();
      return value ? `${row.directive} ${value}` : "";
    })
    .filter(Boolean)
    .join("; ");
  const headerName = reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
  return policy ? `${headerName}: ${policy}` : `${headerName}:`;
}

function getCspWarnings(directives: CspDirectives, reportOnly: boolean, dictionary: ClientDictionary) {
  const combined = Object.values(directives).join(" ").toLowerCase();
  const frameAncestors = directives.frameAncestors.trim().toLowerCase();
  return [
    combined.includes("*") ? ui(dictionary, "cspWildcardWarning", "Wildcard sources should be tightened before production use.") : "",
    combined.includes("'unsafe-inline'") ? ui(dictionary, "cspUnsafeInlineWarning", "unsafe-inline is allowed. Use nonces or hashes when the app can support them.") : "",
    /\bhttp:/.test(combined) ? ui(dictionary, "cspHttpWarning", "http: sources are allowed. Prefer HTTPS sources for deployed pages.") : "",
    !frameAncestors || !/(^|\s)'(?:none|self)'(\s|$)/.test(frameAncestors)
      ? ui(dictionary, "cspFrameAncestorsWarning", "frame-ancestors should usually be 'none' or 'self' unless embedding is intentional.")
      : "",
    reportOnly ? ui(dictionary, "cspReportOnlyWarning", "Report-only mode observes violations but does not block them.") : "",
  ].filter(Boolean);
}

function parseUrlSafely(value?: string | null) {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function getRedirectDiagnostics(result: HttpStatusResult, dictionary: ClientDictionary) {
  const chain = result.redirectChain ?? [];
  const urls = chain.map((hop) => parseUrlSafely(hop.url)).filter((value): value is URL => value !== null);
  const inputUrl = parseUrlSafely(result.inputUrl ?? chain[0]?.url);
  const finalUrl = parseUrlSafely(result.finalUrl);
  const hostCount = new Set(urls.map((item) => item.host)).size;
  const hostChanges = Math.max(0, hostCount - 1);
  const finalStatus = result.status ? String(result.status) : "-";
  const finalProtocol = finalUrl?.protocol ? finalUrl.protocol.replace(":", "").toUpperCase() : "-";
  const lastHopStatus = chain.at(-1)?.status;
  const sawHttpsDowngrade = urls.some((item, index) => index > 0 && urls[index - 1]?.protocol === "https:" && item.protocol === "http:");
  const finalHostChanged = Boolean(inputUrl && finalUrl && inputUrl.host !== finalUrl.host);
  const finalPathChanged = Boolean(inputUrl && finalUrl && inputUrl.pathname !== finalUrl.pathname);
  const permanentRedirects = chain.filter((hop) => [301, 308].includes(hop.status)).length;
  const temporaryRedirects = chain.filter((hop) => [302, 303, 307].includes(hop.status)).length;
  const totalElapsedMs = chain.reduce((total, hop) => total + (hop.elapsedMs ?? 0), 0);
  const slowestHopMs = Math.max(0, ...chain.map((hop) => hop.elapsedMs ?? 0));
  const queryChanged = Boolean(inputUrl && finalUrl && inputUrl.search !== finalUrl.search);
  const trailingSlashChanged = Boolean(inputUrl && finalUrl && inputUrl.pathname.replace(/\/$/, "") === finalUrl.pathname.replace(/\/$/, "") && inputUrl.pathname !== finalUrl.pathname);
  const permanentRedirectWithoutCache = chain.some((hop) => [301, 308].includes(hop.status) && !hop.cacheControl);
  const warnings = [
    (result.redirectCount ?? 0) > 3 ? ui(dictionary, "redirectLongWarning", "{count} redirects were followed. Shorter chains are easier for crawlers and users.").replace("{count}", String(result.redirectCount)) : "",
    lastHopStatus && [301, 302, 303, 307, 308].includes(lastHopStatus) ? ui(dictionary, "redirectUnsettledWarning", "The last checked hop is still a redirect. The chain may not be settled.") : "",
    finalUrl?.protocol === "http:" ? ui(dictionary, "redirectFinalHttpWarning", "Final URL is still HTTP. Public canonical pages should usually finish on HTTPS.") : "",
    sawHttpsDowngrade ? ui(dictionary, "redirectDowngradeWarning", "The chain moves from HTTPS back to HTTP. Check canonical and security rules.") : "",
    hostChanges > 0 ? ui(dictionary, "redirectHostChangeWarning", "{count} host changes detected. Confirm apex, www, and locale routing are intentional.").replace("{count}", String(hostChanges)) : "",
    finalHostChanged || finalPathChanged ? ui(dictionary, "redirectCanonicalChangedWarning", "Final canonical target differs from the requested host or path. Confirm this is expected for SEO.") : "",
    temporaryRedirects > 0 ? ui(dictionary, "redirectTemporaryWarning", "{count} temporary redirects are present. Stable canonical routes usually use 301 or 308.").replace("{count}", String(temporaryRedirects)) : "",
    permanentRedirects > 0 && temporaryRedirects > 0 ? ui(dictionary, "redirectMixedTypeWarning", "Permanent and temporary redirects are mixed in one chain. Confirm this is intentional.") : "",
    queryChanged ? ui(dictionary, "redirectQueryChangedWarning", "Final URL query parameters differ from the requested URL. Check tracking, locale, and canonical rules.") : "",
    trailingSlashChanged ? ui(dictionary, "redirectTrailingSlashWarning", "Only the trailing slash changed. Confirm the canonical URL format is consistent in links and sitemap.") : "",
    slowestHopMs > 2000 ? ui(dictionary, "redirectSlowHopWarning", "At least one redirect hop took more than 2 seconds. Slow chains can hurt crawl and user experience.") : "",
    permanentRedirectWithoutCache ? ui(dictionary, "redirectPermanentCacheWarning", "A permanent redirect has no visible Cache-Control header. Confirm CDN/browser caching behavior.") : "",
    typeof result.status === "number" && result.status >= 400 ? ui(dictionary, "redirectErrorStatusWarning", "Final status is an error response. This URL is not ready for public linking.") : "",
  ].filter(Boolean);

  return {
    metrics: [
      { label: ui(dictionary, "redirectHopCount", "Hops"), value: String(chain.length) },
      { label: ui(dictionary, "redirectHostChanges", "Host changes"), value: String(hostChanges) },
      { label: ui(dictionary, "permanentRedirects", "Permanent redirects"), value: String(permanentRedirects) },
      { label: ui(dictionary, "temporaryRedirects", "Temporary redirects"), value: String(temporaryRedirects) },
      { label: ui(dictionary, "finalProtocol", "Final protocol"), value: finalProtocol },
      { label: ui(dictionary, "finalStatus", "Final status"), value: finalStatus },
      { label: ui(dictionary, "totalRedirectTime", "Total time"), value: `${totalElapsedMs} ms` },
      { label: ui(dictionary, "slowestHop", "Slowest hop"), value: `${slowestHopMs} ms` },
    ],
    warnings,
  };
}

function buildPublicUrlReport(
  result: HttpStatusResult,
  redirectDiagnostics: ReturnType<typeof getRedirectDiagnostics>,
  checkedHeaders: ReturnType<typeof parseHttpHeaders>,
  responseHeaderLines: string,
  dictionary: ClientDictionary,
) {
  const checkedAt = new Date().toISOString();
  const securityScore = `${checkedHeaders.metrics.presentSecurityHeaders}/${checkedHeaders.metrics.securityCheckCount}`;
  const requiredMissing = checkedHeaders.metrics.missingRequiredSecurityHeaders;
  const headerWarnings = responseHeaderLines
    ? checkedHeaders.warnings
    : [ui(dictionary, "publicUrlReportNoHeadersWarning", "No allowlisted final-response headers were available for the report.")];
  const reviewNotes = Array.from(new Set([...redirectDiagnostics.warnings, ...headerWarnings]));
  const finalStatus = `${result.status ?? "-"} ${result.statusText ?? ""}`.trim();
  const finalUrl = result.finalUrl ?? "-";
  const inputUrl = result.inputUrl ?? result.redirectChain?.[0]?.url ?? "-";
  const contentType = result.contentType ?? "-";
  const cacheControl = result.cacheControl ?? "-";
  const redirectCount = result.redirectCount ?? 0;

  const markdown = [
    `# ${ui(dictionary, "publicUrlReport", "Public URL report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "inputUrl", "Input URL")}: ${inputUrl}`,
    `- ${ui(dictionary, "finalUrl", "Final URL")}: ${finalUrl}`,
    `- ${ui(dictionary, "finalStatus", "Final status")}: ${finalStatus}`,
    `- ${ui(dictionary, "redirects", "Redirects")}: ${redirectCount}`,
    `- ${ui(dictionary, "securityHeaderScore", "Security header score")}: ${securityScore}`,
    `- ${ui(dictionary, "missingRequiredHeaders", "Missing required")}: ${requiredMissing}`,
    `- ${ui(dictionary, "contentType", "Content type")}: ${contentType}`,
    `- ${ui(dictionary, "cacheControl", "Cache-Control")}: ${cacheControl}`,
    "",
    `## ${ui(dictionary, "publicUrlReportReviewNotes", "Review notes")}`,
    ...(reviewNotes.length ? reviewNotes.map((note) => `- ${note}`) : [`- ${ui(dictionary, "publicUrlReportNoWarnings", "No redirect or final-response header warnings were detected.")}`]),
    "",
    `## ${ui(dictionary, "redirectChain", "Redirect chain")}`,
    ...(result.redirectChain?.length
      ? result.redirectChain.map((hop, index) => `- ${index + 1}. ${hop.status} ${hop.url}${hop.location ? ` -> ${hop.location}` : ""}`)
      : [`- ${ui(dictionary, "noRedirectHops", "No redirect hops recorded.")}`]),
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    metrics: [
      { label: ui(dictionary, "finalStatus", "Final status"), value: finalStatus },
      { label: ui(dictionary, "redirects", "Redirects"), value: String(redirectCount) },
      { label: ui(dictionary, "securityHeaderScore", "Security header score"), value: securityScore },
      { label: ui(dictionary, "missingRequiredHeaders", "Missing required"), value: String(requiredMissing) },
    ],
  };
}

function buildSecurityHeaderReport(parsedHeaders: ReturnType<typeof parseHttpHeaders>, dictionary: ClientDictionary, checkedAt: string) {
  const securityScore = `${parsedHeaders.metrics.presentSecurityHeaders}/${parsedHeaders.metrics.securityCheckCount}`;
  const reviewNotes = parsedHeaders.warnings.length ? parsedHeaders.warnings : [ui(dictionary, "securityHeaderReportNoWarnings", "No obvious security-header warnings detected. Still confirm the target app policy before publishing.")];
  const checklist = [
    ui(dictionary, "securityHeaderReportChecklistHsts", "Confirm HTTPS pages send Strict-Transport-Security after the first production response."),
    ui(dictionary, "securityHeaderReportChecklistCsp", "Review Content-Security-Policy sources before switching report-only policies to enforcement."),
    ui(dictionary, "securityHeaderReportChecklistCookies", "Check Set-Cookie values for Secure, HttpOnly, SameSite, and cache interaction."),
    ui(dictionary, "securityHeaderReportChecklistCors", "Verify CORS origins and credentials against the intended public API clients."),
    ui(dictionary, "securityHeaderReportChecklistRecheck", "Re-run the public URL check after CDN, proxy, or deployment changes."),
  ];
  const checkLines = parsedHeaders.securityChecks.map((check) => {
    const status = check.present ? ui(dictionary, "headerPresent", "Present") : ui(dictionary, "headerMissing", "Missing");
    const priority = check.required ? ui(dictionary, "requiredHeader", "Required") : ui(dictionary, "recommendedHeader", "Recommended");
    return `- ${check.label}: ${status} (${priority})`;
  });
  const markdown = [
    `# ${ui(dictionary, "securityHeaderReport", "Security header report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "headerCount", "Headers")}: ${parsedHeaders.metrics.headerCount}`,
    `- ${ui(dictionary, "duplicateHeaders", "Duplicate names")}: ${parsedHeaders.metrics.duplicateHeaderNames}`,
    `- ${ui(dictionary, "securityHeaderScore", "Security header score")}: ${securityScore}`,
    `- ${ui(dictionary, "missingRequiredHeaders", "Missing required")}: ${parsedHeaders.metrics.missingRequiredSecurityHeaders}`,
    `- ${ui(dictionary, "cookieHeaders", "Cookie headers")}: ${parsedHeaders.metrics.cookieHeaders}`,
    `- ${ui(dictionary, "corsHeaderCategory", "CORS")}: ${parsedHeaders.metrics.corsHeaders}`,
    `- ${ui(dictionary, "securityHeaderReportRawPolicy", "Raw headers included")}: ${ui(dictionary, "securityHeaderReportRawExcluded", "No, only metrics, readiness checks, and review notes are included.")}`,
    "",
    `## ${ui(dictionary, "securityHeaderReportReviewNotes", "Review notes")}`,
    ...reviewNotes.map((note) => `- ${note}`),
    "",
    `## ${ui(dictionary, "securityHeaderReportCheckResults", "Security header checks")}`,
    ...checkLines,
    "",
    `## ${ui(dictionary, "securityHeaderReportChecklist", "Deployment checklist")}`,
    ...checklist.map((item) => `- ${item}`),
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    checklist,
    metrics: [
      { label: ui(dictionary, "headerCount", "Headers"), value: String(parsedHeaders.metrics.headerCount) },
      { label: ui(dictionary, "securityHeaderScore", "Security header score"), value: securityScore },
      { label: ui(dictionary, "missingRequiredHeaders", "Missing required"), value: String(parsedHeaders.metrics.missingRequiredSecurityHeaders) },
      { label: ui(dictionary, "cookieHeaders", "Cookie headers"), value: String(parsedHeaders.metrics.cookieHeaders) },
      { label: ui(dictionary, "corsHeaderCategory", "CORS"), value: String(parsedHeaders.metrics.corsHeaders) },
      { label: ui(dictionary, "securityHeaderReportRawPolicy", "Raw headers included"), value: ui(dictionary, "no", "No"), description: ui(dictionary, "securityHeaderReportRawExcluded", "No, only metrics, readiness checks, and review notes are included.") },
    ],
  };
}

function formatHttpStatusError(message: string, dictionary: ClientDictionary) {
  if (/fetch failed/i.test(message)) {
    return ui(dictionary, "httpRequestFailedPublic", "The request failed before a response was received. The host may block server-side checks; try another public URL.");
  }
  if (/too many redirects/i.test(message)) {
    return ui(dictionary, "httpTooManyRedirects", "Too many redirects were followed. Check the canonical redirect rules for this URL.");
  }
  if (/too many requests/i.test(message)) {
    return ui(dictionary, "httpRateLimited", "Too many checks were made. Wait briefly, then try again.");
  }
  if (/public http|public hostname|private|reserved|localhost/i.test(message)) {
    return ui(dictionary, "httpPublicUrlRequired", "Use a public http or https URL. Local, private, and reserved hosts are blocked.");
  }
  return message;
}

function HttpStatusTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [url, setUrl] = React.useState("https://www.google.com");
  const [result, setResult] = React.useState<HttpStatusResult | null>(null);
  const [rawResult, setRawResult] = React.useState("");
  const [rawHeaders, setRawHeaders] = React.useState(httpHeaderExamples[0]?.value ?? "");
  const [cspDirectives, setCspDirectives] = React.useState<CspDirectives>(cspPresets.strict.directives);
  const [cspReportOnly, setCspReportOnly] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const hydratedUrlParamRef = React.useRef(false);
  React.useEffect(() => {
    if (hydratedUrlParamRef.current || typeof window === "undefined") return;
    hydratedUrlParamRef.current = true;
    const nextUrl = new URLSearchParams(window.location.search).get("url")?.trim();
    if (nextUrl && nextUrl.length <= 2048) setUrl(nextUrl);
  }, []);
  const check = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/http-status?url=${encodeURIComponent(url)}`);
      const body = (await response.json()) as HttpStatusResult;
      setResult(body);
      setRawResult(JSON.stringify(body, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed.";
      setResult({ error: message });
      setRawResult(message);
    } finally {
      setLoading(false);
    }
  };
  const headerRows = result
    ? (result.finalResponseHeaders?.length
        ? result.finalResponseHeaders.map((header) => ({ ...header, ...classifyHttpHeader(header.name.toLowerCase()) }))
        : [
            { name: "content-type", value: result.contentType ?? "", ...classifyHttpHeader("content-type") },
            { name: "cache-control", value: result.cacheControl ?? "", ...classifyHttpHeader("cache-control") },
            { name: "server", value: result.server ?? "", ...classifyHttpHeader("server") },
          ].filter((row) => row.value.length > 0))
    : [];
  const responseHeaderLines = result ? headerRows.map((header) => `${header.name}: ${header.value}`).join("\n") : "";
  const parsedHeaders = React.useMemo(() => parseHttpHeaders(rawHeaders, dictionary), [dictionary, rawHeaders]);
  const securityHeaderReport = React.useMemo(() => buildSecurityHeaderReport(parsedHeaders, dictionary, ui(dictionary, "securityHeaderReportCopyTime", "Browser copy time")), [dictionary, parsedHeaders]);
  const generatedCspHeader = React.useMemo(() => buildCspHeader(cspDirectives, cspReportOnly), [cspDirectives, cspReportOnly]);
  const cspWarnings = React.useMemo(() => getCspWarnings(cspDirectives, cspReportOnly, dictionary), [cspDirectives, cspReportOnly, dictionary]);
  const redirectDiagnostics = React.useMemo(() => (result && !result.error ? getRedirectDiagnostics(result, dictionary) : null), [dictionary, result]);
  const checkedResponseHeaders = React.useMemo(() => parseHttpHeaders(responseHeaderLines, dictionary), [dictionary, responseHeaderLines]);
  const publicUrlReport = React.useMemo(
    () => (result && !result.error && redirectDiagnostics ? buildPublicUrlReport(result, redirectDiagnostics, checkedResponseHeaders, responseHeaderLines, dictionary) : null),
    [checkedResponseHeaders, dictionary, redirectDiagnostics, responseHeaderLines, result],
  );
  const cspDirectiveCount = cspDirectiveRows.filter((row) => cspDirectives[row.key].trim()).length;
  const updateCspDirective = (key: CspDirectiveKey, value: string) => setCspDirectives((current) => ({ ...current, [key]: value }));
  const applyCspPreset = (preset: CspPresetKey) => setCspDirectives(cspPresets[preset].directives);
  const useGeneratedCspInParser = () => {
    const nextLines = rawHeaders
      .split(/\r?\n/)
      .filter((line) => {
        const normalized = line.trim().toLowerCase();
        return !normalized.startsWith("content-security-policy:") && !normalized.startsWith("content-security-policy-report-only:");
      })
      .filter((line) => line.trim().length > 0);
    setRawHeaders([...nextLines, generatedCspHeader].join("\n"));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input value={url} onChange={(event) => setUrl(event.target.value)} aria-label="URL" data-session-key="url" />
        <Button onClick={check} disabled={loading}>{loading ? ui(dictionary, "checking", "Checking") : ui(dictionary, "check", "Check")}</Button>
      </div>
      {result?.error ? <ErrorAlert title={ui(dictionary, "httpCheckFailed", "HTTP check failed")} message={formatHttpStatusError(result.error, dictionary)} /> : null}
      {result && !result.error ? (
        <div className="space-y-4" data-http-status-details>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "statusCode", "Status code")}</p>
              <p className="mt-2 text-lg font-semibold">
                {result.status} {result.statusText}
              </p>
            </div>
            <div className="rounded-md border bg-card p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "redirects", "Redirects")}</p>
              <p className="mt-2 text-lg font-semibold">{result.redirectCount ?? 0}</p>
            </div>
            <div className="rounded-md border bg-card p-3 md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "finalUrl", "Final URL")}</p>
              <p className="mt-2 break-all text-sm font-medium">{result.finalUrl}</p>
            </div>
          </div>
          <section className="rounded-md border bg-card" data-http-redirect-chain>
            <div className="border-b p-3">
              <h3 className="text-sm font-semibold">{ui(dictionary, "redirectChain", "Redirect chain")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "redirectChainDescription", "Each public hop followed by the checker.")}</p>
            </div>
            <div className="divide-y">
              {(result.redirectChain ?? []).map((hop, index) => (
	                <div key={`${hop.url}-${index}`} className="grid gap-2 p-3 text-sm md:grid-cols-[72px_1fr]">
	                  <Badge className="w-fit">
	                    {index + 1}. {hop.status}
	                  </Badge>
	                  <div className="min-w-0 space-y-1">
	                    <p className="break-all font-medium">{hop.url}</p>
	                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
	                      <span>{ui(dictionary, "hopTime", "Time")}: {hop.elapsedMs ?? 0} ms</span>
	                      {hop.cacheControl ? <span className="break-all">{ui(dictionary, "hopCache", "Cache")}: {hop.cacheControl}</span> : null}
	                    </div>
	                    {hop.location ? (
	                      <p className="break-all text-xs text-muted-foreground">
	                        {ui(dictionary, "locationHeader", "Location")}: {hop.location}
                      </p>
                    ) : null}
                    {hop.contentType ? <p className="break-all text-xs text-muted-foreground">{hop.contentType}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
          {redirectDiagnostics ? (
            <section className="rounded-md border bg-card" data-http-redirect-diagnostics>
              <div className="border-b p-3">
                <h3 className="text-sm font-semibold">{ui(dictionary, "redirectDiagnostics", "Redirect diagnostics")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "redirectDiagnosticsDescription", "Review canonical target, HTTPS finish, host changes, and crawler-friendly chain length.")}</p>
              </div>
              <div className="space-y-3 p-3">
                <ToolMetricGrid items={redirectDiagnostics.metrics} />
                <ToolWarningList title={ui(dictionary, "redirectReviewNotes", "Redirect review notes")} warnings={redirectDiagnostics.warnings} emptyLabel={ui(dictionary, "redirectNoWarnings", "Redirect chain looks settled for public linking and SEO review.")} />
              </div>
            </section>
          ) : null}
          {headerRows.length ? (
            <section className="rounded-md border bg-card" data-http-response-headers>
              <div className="border-b p-3">
                <h3 className="text-sm font-semibold">{ui(dictionary, "responseHeaders", "Response headers")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "responseHeadersDescription", "Key final-response headers for caching, MIME, and server checks.")}</p>
              </div>
	              <dl className="divide-y">
	                {headerRows.map((header) => (
	                  <div key={header.name} className="grid gap-2 p-3 text-sm md:grid-cols-[180px_1fr]">
	                    <dt className="min-w-0">
	                      <span className="block break-all font-medium">{header.name}</span>
	                      <Badge className="mt-1">{ui(dictionary, header.categoryKey, header.categoryFallback)}</Badge>
	                    </dt>
	                    <dd className="min-w-0 break-all text-muted-foreground">{header.value}</dd>
	                  </div>
	                ))}
	              </dl>
            </section>
          ) : null}
          {publicUrlReport ? (
            <section className="rounded-md border bg-card" data-public-url-report>
              <div className="border-b p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{ui(dictionary, "publicUrlReport", "Public URL report")}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "publicUrlReportDescription", "Copy a compact status, redirect, and security-header note for issue trackers, deploy handoffs, or Search Console follow-up.")}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(publicUrlReport.markdown)}>
                    <Copy className="h-4 w-4" />
                    {ui(dictionary, "copyPublicUrlReport", "Copy report")}
                  </Button>
                </div>
              </div>
              <div className="space-y-3 p-3">
                <ToolMetricGrid items={publicUrlReport.metrics} />
                <ToolWarningList title={ui(dictionary, "publicUrlReportReviewNotes", "Review notes")} warnings={publicUrlReport.reviewNotes} emptyLabel={ui(dictionary, "publicUrlReportNoWarnings", "No redirect or final-response header warnings were detected.")} />
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-public-url-report-preview>
                  <code>{publicUrlReport.markdown}</code>
                </pre>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
      <section className="rounded-md border bg-card" data-http-header-parser>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "httpHeaderParser", "HTTP header parser")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "httpHeaderParserDescription", "Paste response headers to review cache, security, cookie, and CORS signals before copying debug notes.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <div className="flex flex-wrap gap-2">
            {httpHeaderExamples.map((example) => (
              <Button key={example.labelKey} type="button" variant="outline" size="sm" onClick={() => setRawHeaders(example.value)}>
                {ui(dictionary, example.labelKey, example.fallbackLabel)}
              </Button>
            ))}
            {responseHeaderLines ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setRawHeaders(responseHeaderLines)}>
                {ui(dictionary, "useCheckedResponseHeaders", "Use checked response headers")}
              </Button>
            ) : null}
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-medium">{ui(dictionary, "rawHttpHeaders", "Raw HTTP headers")}</span>
            <Textarea value={rawHeaders} onChange={(event) => setRawHeaders(event.target.value)} className="min-h-40 font-mono text-xs" />
          </label>
          <div data-http-header-summary>
            <ToolMetricGrid
              items={[
                { label: ui(dictionary, "headerCount", "Headers"), value: String(parsedHeaders.metrics.headerCount) },
                { label: ui(dictionary, "duplicateHeaders", "Duplicate names"), value: String(parsedHeaders.metrics.duplicateHeaderNames) },
                { label: ui(dictionary, "securityHeaders", "Security headers"), value: String(parsedHeaders.metrics.securityHeaders) },
                { label: ui(dictionary, "cookieHeaders", "Cookie headers"), value: String(parsedHeaders.metrics.cookieHeaders) },
              ]}
            />
          </div>
          <section className="rounded-md border bg-background" data-http-security-readiness>
            <div className="border-b p-3">
              <h4 className="text-sm font-semibold">{ui(dictionary, "securityHeaderReadiness", "Security header readiness")}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "securityHeaderReadinessDescription", "Scan the response for the security headers developers usually check before publishing or debugging a public page.")}</p>
            </div>
            <div className="space-y-3 p-3">
              <ToolMetricGrid
                items={[
                  { label: ui(dictionary, "securityHeaderScore", "Security header score"), value: `${parsedHeaders.metrics.presentSecurityHeaders}/${parsedHeaders.metrics.securityCheckCount}` },
                  { label: ui(dictionary, "missingRequiredHeaders", "Missing required"), value: String(parsedHeaders.metrics.missingRequiredSecurityHeaders) },
                ]}
              />
              <div className="divide-y rounded-md border" data-http-security-checklist>
                {parsedHeaders.securityChecks.map((check) => (
                  <div key={check.key} className="grid gap-2 p-3 text-sm md:grid-cols-[220px_1fr_auto]">
                    <div className="min-w-0">
                      <p className="break-all font-medium">{check.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{check.required ? ui(dictionary, "requiredHeader", "Required") : ui(dictionary, "recommendedHeader", "Recommended")}</p>
                    </div>
                    <p className="min-w-0 text-xs text-muted-foreground">{check.detail}</p>
                    <Badge className={check.present ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300" : "border-amber-500/40 text-amber-700 dark:text-amber-300"}>
                      {check.present ? ui(dictionary, "headerPresent", "Present") : ui(dictionary, "headerMissing", "Missing")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="rounded-md border bg-background" data-http-header-list>
            <div className="border-b p-3">
              <h4 className="text-sm font-semibold">{ui(dictionary, "parsedHeaders", "Parsed headers")}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "parsedHeadersDescription", "Header names are normalized so duplicates and review categories are easier to scan.")}</p>
            </div>
            {parsedHeaders.entries.length ? (
              <dl className="divide-y">
                {parsedHeaders.entries.map((entry, index) => (
                  <div key={`${entry.name}-${index}`} className="grid gap-2 p-3 text-sm md:grid-cols-[180px_1fr]">
                    <dt className="min-w-0">
                      <span className="block break-all font-medium">{entry.name}</span>
                      <Badge className="mt-1">{ui(dictionary, entry.categoryKey, entry.categoryFallback)}</Badge>
                    </dt>
                    <dd className="min-w-0 break-all text-muted-foreground">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="p-3 text-sm text-muted-foreground">{ui(dictionary, "noParsedHeaders", "No parsed headers yet.")}</p>
            )}
          </section>
          <div data-http-header-warnings>
            <ToolWarningList title={ui(dictionary, "headerReviewNotes", "Header review notes")} warnings={parsedHeaders.warnings} emptyLabel={ui(dictionary, "httpHeadersNoWarnings", "Headers look ready for debugging notes. Still confirm policy with the target app.")} />
          </div>
          <section className="space-y-3 rounded-md border bg-background p-3" data-http-security-report>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold">{ui(dictionary, "securityHeaderReport", "Security header report")}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "securityHeaderReportDescription", "Copy a safe header-readiness report with security score, missing required headers, cookie/CORS notes, and deployment checks.")}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(buildSecurityHeaderReport(parsedHeaders, dictionary, new Date().toISOString()).markdown)}
                data-http-security-report-copy
              >
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copySecurityHeaderReport", "Copy security report")}
              </Button>
            </div>
            <ToolMetricGrid items={securityHeaderReport.metrics} />
            <ToolWarningList title={ui(dictionary, "securityHeaderReportReviewNotes", "Review notes")} warnings={securityHeaderReport.reviewNotes} emptyLabel={ui(dictionary, "securityHeaderReportNoWarnings", "No obvious security-header warnings detected. Still confirm the target app policy before publishing.")} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ui(dictionary, "securityHeaderReportChecklist", "Deployment checklist")}</p>
              <ul className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {securityHeaderReport.checklist.map((item) => (
                  <li key={item} className="rounded-md bg-muted px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs" data-http-security-report-preview>
              <code>{securityHeaderReport.markdown}</code>
            </pre>
          </section>
          <div className="rounded-md bg-muted p-3 text-xs" data-http-header-json>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{ui(dictionary, "parsedHeaderJson", "Parsed header JSON")}</span>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(parsedHeaders, null, 2))}>
                <Copy className="h-4 w-4" />
                {dictionary.tool.copy}
              </Button>
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words text-muted-foreground">
              <code>{JSON.stringify(parsedHeaders, null, 2)}</code>
            </pre>
          </div>
        </div>
      </section>
      <section className="rounded-md border bg-card" data-csp-generator>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "cspGenerator", "CSP generator")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "cspGeneratorDescription", "Draft a Content-Security-Policy header, review risky sources, then send it into the header parser.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <div className="flex flex-wrap gap-2">
            {(["strict", "marketing", "preview"] as const).map((preset) => (
              <Button key={preset} type="button" variant="outline" size="sm" onClick={() => applyCspPreset(preset)}>
                {ui(dictionary, cspPresets[preset].labelKey, cspPresets[preset].fallbackLabel)}
              </Button>
            ))}
            <Button type="button" variant={cspReportOnly ? "default" : "outline"} size="sm" onClick={() => setCspReportOnly((current) => !current)}>
              {ui(dictionary, "reportOnly", "Report-only")}
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2" data-csp-directives>
            {cspDirectiveRows.map((row) => (
              <label key={row.key} className="block min-w-0 space-y-2">
                <span className="text-sm font-medium">{ui(dictionary, row.labelKey, row.fallbackLabel)}</span>
                <Input value={cspDirectives[row.key]} onChange={(event) => updateCspDirective(row.key, event.target.value)} className="font-mono text-xs" />
              </label>
            ))}
          </div>
          <ToolMetricGrid
            items={[
              { label: ui(dictionary, "directiveCount", "Directives"), value: String(cspDirectiveCount) },
              { label: ui(dictionary, "cspHeaderMode", "Header mode"), value: cspReportOnly ? "Report-Only" : "Enforce" },
            ]}
          />
          <div className="rounded-md bg-muted p-3 text-xs" data-csp-output>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{ui(dictionary, "generatedCspHeader", "Generated CSP header")}</span>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedCspHeader)}>
                <Copy className="h-4 w-4" />
                {dictionary.tool.copy}
              </Button>
            </div>
            <pre className="overflow-auto whitespace-pre-wrap break-words text-muted-foreground">
              <code>{generatedCspHeader}</code>
            </pre>
          </div>
          <div data-csp-warnings>
            <ToolWarningList title={ui(dictionary, "cspWarnings", "CSP review notes")} warnings={cspWarnings} emptyLabel={ui(dictionary, "cspNoWarnings", "CSP sources look tight enough for a first enforcement review.")} />
          </div>
          <Button type="button" variant="outline" onClick={useGeneratedCspInParser}>
            {ui(dictionary, "useGeneratedCspInParser", "Use generated CSP in parser")}
          </Button>
        </div>
      </section>
      {result && !result.error && !loading ? <ResultNextActions signals={["http-result"]} dictionary={dictionary} /> : null}
      <ResultBlock title={ui(dictionary, "rawResponse", "Raw response")} value={rawResult} dictionary={dictionary} />
    </div>
  );
}

type DnsLookupResponse = {
  hostname?: string;
  record?: string;
  records?: unknown[];
  error?: string;
};

type DnsDeploymentCheck = {
  key: string;
  labelKey: string;
  fallbackLabel: string;
  detailKey: string;
  fallbackDetail: string;
  hostname: string;
  record: string;
  required: boolean;
  records: unknown[];
  error?: string;
};

const dnsExamples = [
  { labelKey: "dnsAExample", fallbackLabel: "A record", hostname: "bobob.app", record: "A" },
  { labelKey: "dnsMxExample", fallbackLabel: "MX record", hostname: "google.com", record: "MX" },
  { labelKey: "dnsTxtExample", fallbackLabel: "TXT record", hostname: "vercel.com", record: "TXT" },
  { labelKey: "dnsNsExample", fallbackLabel: "NS record", hostname: "example.com", record: "NS" },
];

const dnsDeploymentCheckConfigs = [
  {
    key: "web-address",
    labelKey: "dnsCheckWebAddress",
    fallbackLabel: "Web address",
    detailKey: "dnsCheckWebAddressDetail",
    fallbackDetail: "A records show whether the hostname has public IPv4 routing.",
    record: "A",
    required: true,
    host: "input",
  },
  {
    key: "ipv6",
    labelKey: "dnsCheckIpv6",
    fallbackLabel: "IPv6",
    detailKey: "dnsCheckIpv6Detail",
    fallbackDetail: "AAAA records show whether the hostname is reachable over IPv6.",
    record: "AAAA",
    required: false,
    host: "input",
  },
  {
    key: "canonical",
    labelKey: "dnsCheckCanonical",
    fallbackLabel: "Canonical target",
    detailKey: "dnsCheckCanonicalDetail",
    fallbackDetail: "CNAME records reveal whether a subdomain points to another canonical host.",
    record: "CNAME",
    required: false,
    host: "input",
  },
  {
    key: "name-servers",
    labelKey: "dnsCheckNameServers",
    fallbackLabel: "Name servers",
    detailKey: "dnsCheckNameServersDetail",
    fallbackDetail: "NS records help confirm the authoritative DNS provider for the domain.",
    record: "NS",
    required: true,
    host: "apex",
  },
  {
    key: "txt-policy",
    labelKey: "dnsCheckTxtPolicy",
    fallbackLabel: "TXT policy",
    detailKey: "dnsCheckTxtPolicyDetail",
    fallbackDetail: "TXT records often contain SPF, verification, and provider ownership signals.",
    record: "TXT",
    required: false,
    host: "apex",
  },
  {
    key: "dmarc",
    labelKey: "dnsCheckDmarc",
    fallbackLabel: "DMARC",
    detailKey: "dnsCheckDmarcDetail",
    fallbackDetail: "DMARC lives under _dmarc and helps protect mail sent from the domain.",
    record: "TXT",
    required: false,
    host: "dmarc",
  },
] as const;

function formatDnsRecordValue(record: unknown) {
  if (Array.isArray(record)) return record.join(" ");
  if (record && typeof record === "object") return Object.entries(record).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(" ") : String(value)}`).join(", ");
  return String(record);
}

function getDnsRecordTextValues(records: unknown[]) {
  return records.map((item) => formatDnsRecordValue(item));
}

function getApexHostname(hostname: string) {
  const labels = hostname.trim().replace(/\.$/, "").split(".").filter(Boolean);
  if (labels.length <= 2) return labels.join(".");
  return labels.slice(-2).join(".");
}

function getDnsDeploymentHostname(hostname: string, host: (typeof dnsDeploymentCheckConfigs)[number]["host"]) {
  const apex = getApexHostname(hostname);
  if (host === "apex") return apex;
  if (host === "dmarc") return apex ? `_dmarc.${apex}` : "_dmarc";
  return hostname.trim();
}

async function fetchDnsLookup(hostname: string, record: string) {
  const response = await fetch(`/api/dns-lookup?hostname=${encodeURIComponent(hostname)}&record=${encodeURIComponent(record)}`);
  return (await response.json()) as DnsLookupResponse;
}

function getDnsPrimarySignal(record: string, hostname: string, values: string[], dictionary: ClientDictionary) {
  const normalizedRecord = record.toUpperCase();
  const joined = values.join(" ").toLowerCase();
  if (!values.length) return ui(dictionary, "dnsNoSignal", "No public record");
  if (normalizedRecord === "A" || normalizedRecord === "AAAA") return ui(dictionary, "dnsHasPublicAddress", "Public address found");
  if (normalizedRecord === "CNAME") return ui(dictionary, "dnsHasCanonicalName", "Canonical name found");
  if (normalizedRecord === "MX") return ui(dictionary, "dnsHasMailRouting", "Mail routing found");
  if (normalizedRecord === "NS") return ui(dictionary, "dnsHasNameServers", "Name servers found");
  if (normalizedRecord === "TXT") {
    if (joined.includes("v=spf1")) return ui(dictionary, "dnsHasSpfPolicy", "SPF policy found");
    if (hostname.toLowerCase().startsWith("_dmarc") || joined.includes("v=dmarc1")) return ui(dictionary, "dnsHasDmarcPolicy", "DMARC policy found");
    if (/site-verification|domain-verification|verification/.test(joined)) return ui(dictionary, "dnsHasVerificationRecord", "Verification record found");
    return ui(dictionary, "dnsHasTextPolicy", "TXT records found");
  }
  return ui(dictionary, "dnsGenericSignal", "Records found");
}

function getDnsDiagnostics(hostname: string, record: string, result: DnsLookupResponse | null, dictionary: ClientDictionary) {
  const records = Array.isArray(result?.records) ? result.records : [];
  const values = getDnsRecordTextValues(records);
  const normalizedRecord = (result?.record ?? record).toUpperCase();
  const resolvedHostname = result?.hostname ?? hostname.trim();
  const labels = resolvedHostname.split(".").filter(Boolean);
  const lowerValues = values.map((value) => value.toLowerCase());
  const spfCount = lowerValues.filter((value) => value.includes("v=spf1")).length;
  const dmarcDetected = resolvedHostname.toLowerCase().startsWith("_dmarc") || lowerValues.some((value) => value.includes("v=dmarc1"));
  const hasVerification = lowerValues.some((value) => /site-verification|domain-verification|verification/.test(value));
  const warnings = [
    ui(dictionary, "dnsServerRouteWarning", "DNS lookup uses a server route and only accepts public hostnames."),
    result?.error ? result.error : "",
    records.length === 0 && result && !result.error ? ui(dictionary, "dnsNoRecordsWarning", "No records returned for this type. Try A, AAAA, TXT, MX, or NS.") : "",
    normalizedRecord === "AAAA" && result && !result.error && records.length === 0 ? ui(dictionary, "dnsAaaaMissingWarning", "No AAAA records returned. IPv6 may not be configured for this host.") : "",
    normalizedRecord === "CNAME" && records.length > 0 && labels.length <= 2 ? ui(dictionary, "dnsApexCnameWarning", "CNAME on an apex-like hostname can conflict with other required records. Confirm your DNS provider supports it.") : "",
    normalizedRecord === "MX" && records.length === 1 ? ui(dictionary, "dnsSingleMxWarning", "Only one MX record returned. Confirm that a single mail exchanger is intentional.") : "",
    normalizedRecord === "TXT" && spfCount > 1 ? ui(dictionary, "dnsMultipleSpfWarning", "More than one SPF policy was found. Mail providers usually expect a single SPF TXT record.") : "",
    normalizedRecord === "TXT" && records.length > 0 && !spfCount && !dmarcDetected && !hasVerification ? ui(dictionary, "dnsTxtPurposeWarning", "TXT records are present, but no SPF, DMARC, or common verification marker was detected.") : "",
    normalizedRecord === "NS" && records.length > 0 && records.length < 2 ? ui(dictionary, "dnsSingleNsWarning", "Only one name server returned. Public DNS usually needs at least two authoritative name servers.") : "",
    ui(dictionary, "dnsTtlWarning", "TTL is not shown by this resolver; verify DNS propagation with your DNS provider when timing matters."),
  ].filter(Boolean);

  return {
    metrics: [
      { label: ui(dictionary, "dnsRecordFamily", "Record family"), value: normalizedRecord },
      { label: ui(dictionary, "dnsHostnameDepth", "Host labels"), value: String(labels.length) },
      { label: ui(dictionary, "dnsResponseShape", "Response shape"), value: records.length ? ui(dictionary, "dnsListResponse", "List response") : ui(dictionary, "dnsEmptyResponse", "Empty response") },
      { label: ui(dictionary, "dnsPrimarySignal", "Primary signal"), value: getDnsPrimarySignal(normalizedRecord, resolvedHostname, values, dictionary) },
    ],
    warnings,
  };
}

function getDnsDeploymentStatus(check: DnsDeploymentCheck, dictionary: ClientDictionary) {
  if (check.records.length > 0) return ui(dictionary, "dnsCheckReady", "Ready");
  return check.required ? ui(dictionary, "dnsCheckMissing", "Missing") : ui(dictionary, "dnsCheckReview", "Review");
}

function buildDnsDeploymentReport(hostname: string, checks: DnsDeploymentCheck[], dictionary: ClientDictionary) {
  const checkedAt = new Date().toISOString();
  const targetHostname = hostname.trim() || "-";
  const readyCount = checks.filter((check) => check.records.length > 0).length;
  const missingRequiredCount = checks.filter((check) => check.required && check.records.length === 0).length;
  const reviewCount = checks.filter((check) => !check.required && check.records.length === 0).length;
  const reviewNotes = checks
    .filter((check) => check.records.length === 0)
    .map((check) => {
      const label = ui(dictionary, check.labelKey, check.fallbackLabel);
      const status = getDnsDeploymentStatus(check, dictionary);
      const reason = check.error || ui(dictionary, "dnsNoRecordsWarning", "No records returned for this type. Try A, AAAA, TXT, MX, or NS.");
      return `${label}: ${status} - ${reason}`;
    });
  const checklistRows = checks.map((check, index) => {
    const label = ui(dictionary, check.labelKey, check.fallbackLabel);
    const status = getDnsDeploymentStatus(check, dictionary);
    const values = getDnsRecordTextValues(check.records);
    const preview = values.length ? values.slice(0, 3).join(" / ") : check.error || ui(dictionary, "dnsNoRecordsWarning", "No records returned for this type. Try A, AAAA, TXT, MX, or NS.");
    const suffix = values.length > 3 ? ` (+${values.length - 3})` : "";
    return `- ${index + 1}. ${label} (${check.hostname} / ${check.record}) - ${status}: ${preview}${suffix}`;
  });

  const markdown = [
    `# ${ui(dictionary, "dnsDeploymentReport", "DNS deployment report")}`,
    "",
    `- ${ui(dictionary, "checkedAt", "Checked at")}: ${checkedAt}`,
    `- ${ui(dictionary, "targetHostname", "Target hostname")}: ${targetHostname}`,
    `- ${ui(dictionary, "dnsDeploymentReady", "Ready")}: ${readyCount}`,
    `- ${ui(dictionary, "dnsDeploymentMissingRequired", "Missing required")}: ${missingRequiredCount}`,
    `- ${ui(dictionary, "dnsDeploymentReview", "Review")}: ${reviewCount}`,
    `- ${ui(dictionary, "recordCount", "Record count")}: ${checks.reduce((total, check) => total + check.records.length, 0)}`,
    "",
    `## ${ui(dictionary, "dnsDeploymentReportReviewNotes", "Review notes")}`,
    ...(reviewNotes.length ? reviewNotes.map((note) => `- ${note}`) : [`- ${ui(dictionary, "dnsDeploymentReportNoWarnings", "Required DNS deployment signals were found.")}`]),
    "",
    `## ${ui(dictionary, "dnsDeploymentChecklist", "Deployment checklist")}`,
    ...(checklistRows.length ? checklistRows : [`- ${ui(dictionary, "dnsDeploymentReportNoChecks", "Run the deployment check before copying a report.")}`]),
  ].join("\n");

  return {
    markdown,
    reviewNotes,
    metrics: [
      { label: ui(dictionary, "targetHostname", "Target hostname"), value: targetHostname },
      { label: ui(dictionary, "dnsDeploymentReady", "Ready"), value: String(readyCount) },
      { label: ui(dictionary, "dnsDeploymentMissingRequired", "Missing required"), value: String(missingRequiredCount) },
      { label: ui(dictionary, "dnsDeploymentReview", "Review"), value: String(reviewCount) },
    ],
  };
}

function DnsLookupTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [hostname, setHostname] = React.useState("bobob.app");
  const [record, setRecord] = React.useState("A");
  const [loading, setLoading] = React.useState(false);
  const [deploymentLoading, setDeploymentLoading] = React.useState(false);
  const [result, setResult] = React.useState<DnsLookupResponse | null>(null);
  const [deploymentChecks, setDeploymentChecks] = React.useState<DnsDeploymentCheck[]>([]);
  const lookup = async () => {
    setLoading(true);
    try {
      setResult(await fetchDnsLookup(hostname, record));
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : ui(dictionary, "dnsLookupFailed", "DNS lookup failed.") });
    } finally {
      setLoading(false);
    }
  };
  const runDeploymentCheck = async () => {
    const trimmedHostname = hostname.trim();
    setDeploymentLoading(true);
    try {
      const checks = await Promise.all(
        dnsDeploymentCheckConfigs.map(async (config) => {
          const targetHostname = getDnsDeploymentHostname(trimmedHostname, config.host);
          try {
            const body = await fetchDnsLookup(targetHostname, config.record);
            return {
              key: config.key,
              labelKey: config.labelKey,
              fallbackLabel: config.fallbackLabel,
              detailKey: config.detailKey,
              fallbackDetail: config.fallbackDetail,
              hostname: body.hostname ?? targetHostname,
              record: body.record ?? config.record,
              required: config.required,
              records: Array.isArray(body.records) ? body.records : [],
              error: body.error,
            };
          } catch (error) {
            return {
              key: config.key,
              labelKey: config.labelKey,
              fallbackLabel: config.fallbackLabel,
              detailKey: config.detailKey,
              fallbackDetail: config.fallbackDetail,
              hostname: targetHostname,
              record: config.record,
              required: config.required,
              records: [],
              error: error instanceof Error ? error.message : ui(dictionary, "dnsLookupFailed", "DNS lookup failed."),
            };
          }
        }),
      );
      setDeploymentChecks(checks);
    } finally {
      setDeploymentLoading(false);
    }
  };
  const records = Array.isArray(result?.records) ? result.records : [];
  const rawResult = result ? JSON.stringify(result, null, 2) : "";
  const dnsDiagnostics = getDnsDiagnostics(hostname, record, result, dictionary);
  const deploymentReadyCount = deploymentChecks.filter((check) => check.records.length > 0).length;
  const deploymentMissingRequiredCount = deploymentChecks.filter((check) => check.required && check.records.length === 0).length;
  const deploymentReviewCount = deploymentChecks.filter((check) => !check.required && check.records.length === 0).length;
  const deploymentReport = deploymentChecks.length ? buildDnsDeploymentReport(hostname, deploymentChecks, dictionary) : null;

  return (
    <div className="space-y-4" data-dns-tool>
      <div className="space-y-2" data-dns-examples>
        <p className="text-sm font-medium">{ui(dictionary, "dnsExamples", "DNS examples")}</p>
        <div className="flex flex-wrap gap-2">
          {dnsExamples.map((example) => (
            <Button
              key={example.labelKey}
              variant="outline"
              size="sm"
              onClick={() => {
                setHostname(example.hostname);
                setRecord(example.record);
                setDeploymentChecks([]);
              }}
            >
              {ui(dictionary, example.labelKey, example.fallbackLabel)}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
        <Input
          value={hostname}
          onChange={(event) => {
            setHostname(event.target.value);
            setDeploymentChecks([]);
          }}
          aria-label={ui(dictionary, "hostname", "Hostname")}
        />
        <Select value={record} onChange={(event) => setRecord(event.target.value)}>
          {["A", "AAAA", "CNAME", "MX", "TXT", "NS"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Button onClick={lookup} disabled={loading}>{loading ? ui(dictionary, "checking", "Checking") : ui(dictionary, "lookup", "Lookup")}</Button>
      </div>
      <div data-dns-result-details>
        <ToolMetricGrid
          items={[
            { label: ui(dictionary, "hostname", "Hostname"), value: result?.hostname ?? hostname },
            { label: ui(dictionary, "recordType", "Record type"), value: result?.record ?? record },
            { label: ui(dictionary, "recordCount", "Record count"), value: String(records.length) },
            { label: ui(dictionary, "dnsStatus", "Status"), value: result?.error ? ui(dictionary, "dnsFailed", "Failed") : result ? ui(dictionary, "dnsResolved", "Resolved") : ui(dictionary, "notRunYet", "Not run yet") },
          ]}
        />
      </div>
      <section className="rounded-md border bg-card" data-dns-diagnostics>
        <div className="border-b p-3">
          <h3 className="text-sm font-semibold">{ui(dictionary, "dnsDiagnostics", "DNS diagnostics")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "dnsDiagnosticsDescription", "Review record shape, routing signal, DNS propagation limits, and provider-specific caveats before copying.")}</p>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid items={dnsDiagnostics.metrics} />
          <div data-dns-warnings>
            <ToolWarningList title={ui(dictionary, "dnsReviewNotes", "DNS review notes")} warnings={dnsDiagnostics.warnings} emptyLabel={ui(dictionary, "dnsNoDiagnosticWarnings", "DNS response looks ready for public deployment review.")} />
          </div>
        </div>
      </section>
      <section className="rounded-md border bg-card" data-dns-deployment-checklist>
        <div className="border-b p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{ui(dictionary, "dnsDeploymentChecklist", "Deployment checklist")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "dnsDeploymentChecklistDescription", "Check the DNS signals developers usually review before connecting a domain to hosting, email, or verification flows.")}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={runDeploymentCheck} disabled={deploymentLoading}>
              {deploymentLoading ? ui(dictionary, "checking", "Checking") : ui(dictionary, "runDeploymentCheck", "Run deployment check")}
            </Button>
          </div>
        </div>
        <div className="space-y-3 p-3">
          <ToolMetricGrid
            items={[
              { label: ui(dictionary, "dnsDeploymentReady", "Ready"), value: String(deploymentReadyCount) },
              { label: ui(dictionary, "dnsDeploymentMissingRequired", "Missing required"), value: String(deploymentMissingRequiredCount) },
              { label: ui(dictionary, "dnsDeploymentReview", "Review"), value: String(deploymentReviewCount) },
            ]}
          />
          {deploymentChecks.length ? (
            <div className="divide-y rounded-md border" data-dns-deployment-results>
              {deploymentChecks.map((check) => {
                const values = getDnsRecordTextValues(check.records);
                return (
                  <div key={check.key} className="grid gap-2 p-3 text-sm md:grid-cols-[180px_1fr_auto]">
                    <div className="min-w-0">
                      <p className="break-words font-medium">{ui(dictionary, check.labelKey, check.fallbackLabel)}</p>
                      <p className="mt-1 break-all text-xs text-muted-foreground">{check.hostname} / {check.record}</p>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs text-muted-foreground">{ui(dictionary, check.detailKey, check.fallbackDetail)}</p>
                      {values.length ? (
                        <p className="break-all text-xs font-medium">{values.slice(0, 2).join(" / ")}{values.length > 2 ? ` +${values.length - 2}` : ""}</p>
                      ) : (
                        <p className="break-words text-xs text-muted-foreground">{check.error || ui(dictionary, "dnsNoRecordsWarning", "No records returned for this type. Try A, AAAA, TXT, MX, or NS.")}</p>
                      )}
                    </div>
                    <Badge className={check.records.length ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300" : check.required ? "border-amber-500/40 text-amber-700 dark:text-amber-300" : ""}>
                      {getDnsDeploymentStatus(check, dictionary)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{ui(dictionary, "dnsDeploymentEmpty", "Run the checklist to review web routing, IPv6, name servers, TXT policy, and DMARC signals together.")}</p>
          )}
        </div>
      </section>
      {deploymentReport ? (
        <section className="rounded-md border bg-card" data-dns-deployment-report>
          <div className="border-b p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{ui(dictionary, "dnsDeploymentReport", "DNS deployment report")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "dnsDeploymentReportDescription", "Copy a compact DNS routing, provider, and mail-policy note for deploy handoffs or domain issue tickets.")}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => copyToClipboard(deploymentReport.markdown)}>
                <Copy className="h-4 w-4" />
                {ui(dictionary, "copyDnsDeploymentReport", "Copy report")}
              </Button>
            </div>
          </div>
          <div className="space-y-3 p-3">
            <ToolMetricGrid items={deploymentReport.metrics} />
            <ToolWarningList title={ui(dictionary, "dnsDeploymentReportReviewNotes", "Review notes")} warnings={deploymentReport.reviewNotes} emptyLabel={ui(dictionary, "dnsDeploymentReportNoWarnings", "Required DNS deployment signals were found.")} />
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground" data-dns-deployment-report-preview>
              <code>{deploymentReport.markdown}</code>
            </pre>
          </div>
        </section>
      ) : null}
      {records.length ? (
        <section className="rounded-md border bg-card" data-dns-record-list>
          <div className="border-b p-3">
            <h3 className="text-sm font-semibold">{ui(dictionary, "dnsRecords", "DNS records")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{ui(dictionary, "dnsRecordsDescription", "Resolved public records for the selected hostname and type.")}</p>
          </div>
          <div className="divide-y">
            {records.map((item, index) => (
              <div key={`${index}-${formatDnsRecordValue(item)}`} className="grid gap-1 p-3 text-sm md:grid-cols-[90px_1fr]">
                <dt className="text-muted-foreground">#{index + 1}</dt>
                <dd className="min-w-0 break-all font-medium">{formatDnsRecordValue(item)}</dd>
              </div>
            ))}
          </div>
        </section>
      ) : result?.error ? (
        <ErrorAlert title={ui(dictionary, "dnsLookupFailed", "DNS lookup failed.")} message={result.error} />
      ) : null}
      {result && !result.error && !loading ? <ResultNextActions signals={["dns-result"]} dictionary={dictionary} /> : null}
      <ResultBlock title={ui(dictionary, "rawResponse", "Raw response")} value={rawResult} dictionary={dictionary} />
    </div>
  );
}

function UserAgentParserTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="User-Agent"
      defaultInput={sampleUserAgent}
      modes={[
        {
          value: "parse",
          label: "Parse",
          transform: (value) => {
            const browser = value.includes("Firefox/") ? "Firefox" : value.includes("Edg/") ? "Edge" : value.includes("Chrome/") ? "Chrome" : value.includes("Safari/") ? "Safari" : "Unknown";
            const os = value.includes("Windows") ? "Windows" : value.includes("Mac OS X") ? "macOS" : value.includes("Android") ? "Android" : value.includes("iPhone") || value.includes("iPad") ? "iOS" : value.includes("Linux") ? "Linux" : "Unknown";
            const device = /Mobile|Android|iPhone/.test(value) ? "Mobile" : /iPad|Tablet/.test(value) ? "Tablet" : "Desktop";
            return JSON.stringify({ browser, os, device, rawLength: value.length }, null, 2);
          },
        },
      ]}
    />
  );
}

function TimezoneConverterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState(sampleIsoDate);
  const output = React.useMemo(() => {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return "Invalid date.";
    return commonTimeZones.map((zone) => `${zone}: ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "long", timeZone: zone }).format(date)}`).join("\n");
  }, [input]);
  return (
    <div className="space-y-4">
      <Input value={input} onChange={(event) => setInput(event.target.value)} />
      <ResultBlock title={ui(dictionary, "timeZones", "Time zones")} value={output} dictionary={dictionary} />
    </div>
  );
}

function CssUnitConverterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [px, setPx] = React.useState(16);
  const [root, setRoot] = React.useState(16);
  const output = [`px: ${px}px`, `rem: ${px / root}rem`, `em: ${px / root}em`, `percent of root: ${(px / root) * 100}%`].join("\n");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input type="number" value={px} onChange={(event) => setPx(Number(event.target.value))} aria-label="Pixels" />
        <Input type="number" value={root} onChange={(event) => setRoot(Number(event.target.value))} aria-label="Root pixels" />
      </div>
      <ResultBlock title={ui(dictionary, "convertedCssUnits", "Converted CSS units")} value={output} dictionary={dictionary} />
    </div>
  );
}

function CssClampGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [minSize, setMinSize] = React.useState(16);
  const [maxSize, setMaxSize] = React.useState(32);
  const [minViewport, setMinViewport] = React.useState(360);
  const [maxViewport, setMaxViewport] = React.useState(1200);
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intercept = minSize - slope * minViewport;
  const output = `clamp(${(minSize / 16).toFixed(4)}rem, ${(intercept / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${(maxSize / 16).toFixed(4)}rem)`;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Input type="number" value={minSize} onChange={(event) => setMinSize(Number(event.target.value))} aria-label="Minimum size" />
        <Input type="number" value={maxSize} onChange={(event) => setMaxSize(Number(event.target.value))} aria-label="Maximum size" />
        <Input type="number" value={minViewport} onChange={(event) => setMinViewport(Number(event.target.value))} aria-label="Minimum viewport" />
        <Input type="number" value={maxViewport} onChange={(event) => setMaxViewport(Number(event.target.value))} aria-label="Maximum viewport" />
      </div>
      <ResultBlock title={ui(dictionary, "cssClamp", "CSS clamp")} value={output} dictionary={dictionary} />
    </div>
  );
}

export const toolComponentMap: Record<ToolComponentKey, React.ComponentType<{ dictionary: ClientDictionary }>> = {
  regex: RegexTool,
  cron: CronTool,
  meta: MetaTagTool,
  iframe: IframeTool,
  lorem: LoremTool,
  json: JsonFormatterTool,
  jsonEscape: JsonEscapeTool,
  jwt: JwtDecoderTool,
  url: UrlEncoderTool,
  base64: Base64Tool,
  timestamp: TimestampTool,
  uuid: UuidTool,
  hash: HashGeneratorTool,
  diff: TextDiffTool,
  yamlJson: YamlJsonTool,
  yamlValidator: YamlValidatorTool,
  envParser: EnvParserTool,
  sqlFormatter: SqlFormatterTool,
  xmlFormatter: XmlFormatterTool,
  csvJson: CsvJsonTool,
  htmlEntity: HtmlEntityTool,
  colorConverter: ColorConverterTool,
  passwordGenerator: PasswordGeneratorTool,
  qrCode: QrCodeTool,
  randomToken: RandomTokenTool,
  caseConverter: CaseConverterTool,
  slugGenerator: SlugGeneratorTool,
  jsonToTypescript: JsonToTypescriptTool,
  jsonSchema: JsonSchemaTool,
  jsonPath: JsonPathTool,
  htmlFormatter: HtmlFormatterTool,
  cssFormatter: CssFormatterTool,
  cssMinifier: CssMinifierTool,
  javascriptFormatter: JavaScriptFormatterTool,
  javascriptMinifier: JavaScriptMinifierTool,
  markdownPreview: MarkdownPreviewTool,
  specialCharacterPicker: SpecialCharacterPickerTool,
  asciiArtGenerator: AsciiArtGeneratorTool,
  dotArtEditor: DotArtEditorTool,
  fancyTextGenerator: FancyTextGeneratorTool,
  upsideDownText: UpsideDownTextTool,
  memeTextTransformer: MemeTextTransformerTool,
  kaomojiMaker: KaomojiMakerTool,
  emojiComboBuilder: EmojiComboBuilderTool,
  aestheticBioBuilder: AestheticBioBuilderTool,
  textSortDedupe: TextSortDedupeTool,
  wordCounter: WordCounterTool,
  urlParser: UrlParserTool,
  mimeLookup: MimeLookupTool,
  ulid: UlidTool,
  robotsGenerator: RobotsGeneratorTool,
  sitemapGenerator: SitemapGeneratorTool,
  openGraphPreview: OpenGraphPreviewTool,
  faviconGenerator: FaviconGeneratorTool,
  httpStatus: HttpStatusTool,
  dnsLookup: DnsLookupTool,
  userAgentParser: UserAgentParserTool,
  timezoneConverter: TimezoneConverterTool,
  cssUnitConverter: CssUnitConverterTool,
  cssClampGenerator: CssClampGeneratorTool,
};

export function ToolEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool not found</CardTitle>
        <CardDescription>The selected tool is not registered.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => window.location.assign("/tools/regex-tester")}>
          <ExternalLink className="h-4 w-4" />
          Open Regex Tester
        </Button>
      </CardContent>
    </Card>
  );
}

export function ToolBadges({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value}>{value}</Badge>
      ))}
    </div>
  );
}

export function ToolPanel({
  component,
  dictionary,
  actionContext,
}: {
  component: ToolComponentKey;
  dictionary: ClientDictionary;
  actionContext?: ToolActionContextValue;
}) {
  const Component = toolComponentMap[component];
  const content = Component ? <Component dictionary={dictionary} /> : <ToolEmptyState />;
  return <ToolActionContext.Provider value={actionContext ?? null}>{content}</ToolActionContext.Provider>;
}
