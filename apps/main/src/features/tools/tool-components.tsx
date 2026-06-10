"use client";

import * as React from "react";
import Image from "next/image";
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
import type { ClientDictionary } from "@/features/i18n/dictionaries";
import type { ToolComponentKey } from "./types";

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
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description ?? ui(dictionary, "copyReadyOutput", "Copy-ready output")}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => copyToClipboard(value)}>
          <Copy className="h-4 w-4" />
          {dictionary.tool.copy}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed text-foreground">
          <code>{value || dictionary.tool.noOutput}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

function ErrorAlert({ title, message }: { title: string; message: string }) {
  return (
    <Alert className="border-destructive/40">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
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
  modes: Array<{ value: string; label: string; transform: (value: string) => string }>;
}) {
  const [input, setInput] = React.useState(defaultInput);
  const [mode, setMode] = React.useState(modes[0]?.value ?? "");
  const activeMode = modes.find((item) => item.value === mode) ?? modes[0];
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
                {item.label}
              </option>
            ))}
          </Select>
        </label>
      </div>
      {result.error ? <ErrorAlert title={ui(dictionary, "transformError", "Transform error")} message={result.error} /> : <ResultBlock title={activeMode?.label ?? ui(dictionary, "output", "Output")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function RegexTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [pattern, setPattern] = React.useState(String.raw`(\d{4})-(\d{2})-(\d{2})`);
  const [flags, setFlags] = React.useState("g");
  const [sample, setSample] = React.useState("Release dates: 2026-06-05 and 2026-07-01.");

  const result = React.useMemo(() => {
    try {
      const safeFlags = flags.includes("g") ? flags : `${flags}g`;
      const regex = new RegExp(pattern, safeFlags);
      const matches = Array.from(sample.matchAll(regex)).map((match, index) => ({
        index: index + 1,
        text: match[0],
        position: match.index ?? 0,
        groups: match.slice(1),
      }));
      return { error: "", matches };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid regular expression", matches: [] };
    }
  }, [flags, pattern, sample]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_120px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "pattern", "Pattern")}</span>
          <Input value={pattern} onChange={(event) => setPattern(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "flags", "Flags")}</span>
          <Input value={flags} onChange={(event) => setFlags(event.target.value.replace(/[^gimsuyd]/g, ""))} />
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{ui(dictionary, "sampleText", "Sample text")}</span>
        <Textarea value={sample} onChange={(event) => setSample(event.target.value)} />
      </label>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "syntaxError", "Syntax error")} message={result.error} />
      ) : (
        <ResultBlock title={`${result.matches.length} match${result.matches.length === 1 ? "" : "es"}`} value={JSON.stringify(result.matches, null, 2)} dictionary={dictionary} />
      )}
    </div>
  );
}

function CronTool({ dictionary }: { dictionary: ClientDictionary }) {
  const presets = [
    ["Every 15 minutes", "*/15 * * * *"],
    ["Every weekday at 09:00", "0 9 * * 1-5"],
    ["First day of month at 08:30", "30 8 1 * *"],
    ["Every Sunday at midnight", "0 0 * * 0"],
  ];
  const [expression, setExpression] = React.useState(presets[0][1]);
  const parts = expression.trim().split(/\s+/);
  const summary =
    parts.length === 5
      ? `Minute: ${parts[0]}, hour: ${parts[1]}, day of month: ${parts[2]}, month: ${parts[3]}, day of week: ${parts[4]}.`
      : "Use standard five-field crontab syntax: minute hour day-of-month month day-of-week.";

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">{ui(dictionary, "cronExpression", "Cron expression")}</span>
        <Input value={expression} onChange={(event) => setExpression(event.target.value)} />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {presets.map(([label, value]) => (
          <Button key={label} variant="outline" className="justify-start" onClick={() => setExpression(value)}>
            {label}
          </Button>
        ))}
      </div>
      <Alert>
        <AlertTitle>{ui(dictionary, "fiveFieldInterpretation", "Five-field interpretation")}</AlertTitle>
        <AlertDescription>{summary}</AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Kbd>*</Kbd> any value <Kbd>*/15</Kbd> every 15 units <Kbd>1-5</Kbd> range <Kbd>1,3,5</Kbd> list
      </div>
    </div>
  );
}

function MetaTagTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [title, setTitle] = React.useState("Bob's Multi Tool - Practical Developer Utilities");
  const [description, setDescription] = React.useState("Fast browser tools for developers, built for daily workflows.");
  const [url, setUrl] = React.useState("https://www.bobob.app/tools/meta-tag-generator");
  const [image, setImage] = React.useState("https://www.bobob.app/og-image.png");
  const [robots, setRobots] = React.useState("index,follow");
  const output = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n");

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

function JsonFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState('{"status":"ok","items":[{"id":1,"name":"Bob"}]}');
  const [space, setSpace] = React.useState("2");
  const result = React.useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return { error: "", value: JSON.stringify(parsed, null, Number(space)) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid JSON", value: "" };
    }
  }, [input, space]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_140px]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "jsonInput", "JSON input")}</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "indent", "Indent")}</span>
          <Select value={space} onChange={(event) => setSpace(event.target.value)}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="0">Minified</option>
          </Select>
        </label>
      </div>
      {result.error ? <ErrorAlert title={ui(dictionary, "invalidJson", "Invalid JSON")} message={result.error} /> : <ResultBlock title={ui(dictionary, "formattedJson", "Formatted JSON")} value={result.value} dictionary={dictionary} />}
    </div>
  );
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = globalThis.atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function JwtDecoderTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [token, setToken] = React.useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJvYiIsImlhdCI6MTUxNjIzOTAyMn0.signature");
  const result = React.useMemo(() => {
    try {
      const [header, payload] = token.split(".");
      if (!header || !payload) throw new Error("JWT must contain header and payload segments.");
      return {
        error: "",
        header: JSON.stringify(JSON.parse(decodeBase64Url(header)), null, 2),
        payload: JSON.stringify(JSON.parse(decodeBase64Url(payload)), null, 2),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid token", header: "", payload: "" };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">JWT</span>
        <Textarea value={token} onChange={(event) => setToken(event.target.value)} className="min-h-28" />
      </label>
      {result.error ? (
        <ErrorAlert title={ui(dictionary, "decodeError", "Decode error")} message={result.error} />
      ) : (
        <Tabs
          tabs={[
            { value: "header", label: ui(dictionary, "header", "Header"), content: <ResultBlock title={ui(dictionary, "header", "Header")} value={result.header} dictionary={dictionary} /> },
            { value: "payload", label: ui(dictionary, "payload", "Payload"), content: <ResultBlock title={ui(dictionary, "payload", "Payload")} value={result.payload} dictionary={dictionary} /> },
          ]}
        />
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
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel={ui(dictionary, "textOrBase64", "Text or Base64")}
      defaultInput="hello world"
      modes={[
        { value: "encode", label: ui(dictionary, "encodeBase64", "Encode UTF-8 to Base64"), transform: encodeUtf8Base64 },
        { value: "decode", label: ui(dictionary, "decodeBase64", "Decode Base64 to UTF-8"), transform: decodeUtf8Base64 },
      ]}
    />
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

function UuidTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [count, setCount] = React.useState(5);
  const [values, setValues] = React.useState<string[]>(sampleUuids);
  const regenerate = React.useCallback(() => {
    setValues(Array.from({ length: Math.max(1, Math.min(count, 50)) }, makeUuid));
  }, [count]);

  return (
    <div className="space-y-4">
      <GeneratorControls count={count} setCount={setCount} regenerate={regenerate} dictionary={dictionary} />
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

function HashGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("hello world");
  const output = React.useMemo(
    () =>
      [
        `MD5: ${CryptoJS.MD5(input).toString()}`,
        `SHA-1: ${CryptoJS.SHA1(input).toString()}`,
        `SHA-256: ${CryptoJS.SHA256(input).toString()}`,
        `SHA-512: ${CryptoJS.SHA512(input).toString()}`,
      ].join("\n"),
    [input],
  );

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "input", "Input")}</span>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
      </label>
      <ResultBlock title={ui(dictionary, "hashes", "Hashes")} value={output} dictionary={dictionary} />
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

function SqlFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="SQL"
      defaultInput="select id,name from users where active=1 order by created_at desc"
      modes={[
        { value: "pretty", label: "Pretty print", transform: (value) => formatSql(value, { language: "postgresql" }) },
        { value: "minify", label: "Minify", transform: (value) => value.replace(/\s+/g, " ").replace(/\s*([(),=<>+-])\s*/g, "$1").trim() },
      ]}
    />
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
        { value: "pretty", label: "Pretty print", transform: formatXmlLike },
        { value: "minify", label: "Minify", transform: (value) => value.replace(/>\s+</g, "><").trim() },
      ]}
    />
  );
}

function CsvJsonTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="CSV or JSON"
      defaultInput="id,name\n1,Bob\n2,Alice"
      modes={[
        {
          value: "csv-json",
          label: "CSV to JSON",
          transform: (value) => JSON.stringify(Papa.parse<Record<string, string>>(value, { header: true, skipEmptyLines: true }).data, null, 2),
        },
        {
          value: "json-csv",
          label: "JSON to CSV",
          transform: (value) => Papa.unparse(JSON.parse(value)),
        },
      ]}
    />
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
  const rgb = value.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgb) return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
  throw new Error("Use HEX or RGB input.");
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
      const fgHsl = rgbToHsl(fg);
      const contrast = (Math.max(luminance(fg), luminance(bg)) + 0.05) / (Math.min(luminance(fg), luminance(bg)) + 0.05);
      return [
        `${foregroundLabel} HEX: ${rgbToHex(fg)}`,
        `${foregroundLabel} RGB: rgb(${fg.r}, ${fg.g}, ${fg.b})`,
        `${foregroundLabel} HSL: hsl(${fgHsl.h}, ${fgHsl.s.toFixed(1)}%, ${fgHsl.l.toFixed(1)}%)`,
        `${backgroundLabel} HEX: ${rgbToHex(bg)}`,
        `${contrastLabel}: ${contrast.toFixed(2)} (${contrast >= 4.5 ? aaNormalText : contrast >= 3 ? aaLargeText : belowAaText})`,
      ].join("\n");
    } catch (error) {
      return error instanceof Error ? error.message : "Invalid color.";
    }
  }, [background, dictionary, foreground]);

  return (
    <div className="space-y-4">
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
      <div className="rounded-md border p-4 text-sm" style={{ color: foreground, backgroundColor: background }}>
        {ui(dictionary, "contrastPreviewText", "Preview text for contrast checking.")}
      </div>
      <ResultBlock title={ui(dictionary, "colorValues", "Color values")} value={result} dictionary={dictionary} />
    </div>
  );
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

function PasswordGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [length, setLength] = React.useState(24);
  const [symbols, setSymbols] = React.useState(true);
  const [value, setValue] = React.useState("");
  const generate = React.useCallback(() => {
    const alphabet = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789${symbols ? "!@#$%^&*()-_=+[]{};:,.?" : ""}`;
    const bytes = randomBytes(Math.max(8, Math.min(length, 128)));
    setValue(Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join(""));
  }, [length, symbols]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[160px_160px_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium">{ui(dictionary, "length", "Length")}</span>
          <Input type="number" min={8} max={128} value={length} onChange={(event) => setLength(Number(event.target.value))} />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />
          {ui(dictionary, "symbols", "Symbols")}
        </label>
        <div className="flex items-end">
          <Button onClick={generate}>{ui(dictionary, "generate", "Generate")}</Button>
        </div>
      </div>
      <ResultBlock title={ui(dictionary, "password", "Password")} value={value} dictionary={dictionary} />
    </div>
  );
}

function QrCodeTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("https://www.bobob.app");
  const [dataUrl, setDataUrl] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    QRCode.toDataURL(input, { margin: 2, width: 320 })
      .then((value) => {
        if (mounted) setDataUrl(value);
      })
      .catch(() => {
        if (mounted) setDataUrl("");
      });
    return () => {
      mounted = false;
    };
  }, [input]);

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">QR content</span>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
      </label>
      <div className="grid gap-4 md:grid-cols-[340px_1fr]">
        <div className="flex min-h-80 items-center justify-center rounded-lg border bg-white p-4">
          {dataUrl ? <Image src={dataUrl} alt="Generated QR code" width={288} height={288} unoptimized className="h-72 w-72" /> : <span className="text-sm text-zinc-500">{dictionary.tool.noOutput}</span>}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{ui(dictionary, "download", "Download")}</CardTitle>
            <CardDescription>PNG data URL generated in the browser.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" disabled={!dataUrl} onClick={() => dataUrl && window.open(dataUrl, "_blank")}>
              <Download className="h-4 w-4" />
              {ui(dictionary, "openPng", "Open PNG")}
            </Button>
            <ResultBlock title={ui(dictionary, "dataUrl", "Data URL")} value={dataUrl} dictionary={dictionary} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RandomTokenTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [bytes, setBytes] = React.useState(32);
  const [format, setFormat] = React.useState("hex");
  const [value, setValue] = React.useState("");
  const generate = React.useCallback(() => {
    const raw = randomBytes(Math.max(8, Math.min(bytes, 128)));
    if (format === "hex") setValue(Array.from(raw, (byte) => byte.toString(16).padStart(2, "0")).join(""));
    if (format === "base64") setValue(globalThis.btoa(Array.from(raw, (byte) => String.fromCodePoint(byte)).join("")));
    if (format === "url") setValue(globalThis.btoa(Array.from(raw, (byte) => String.fromCodePoint(byte)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""));
  }, [bytes, format]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[160px_180px_auto]">
        <Input type="number" min={8} max={128} value={bytes} onChange={(event) => setBytes(Number(event.target.value))} aria-label="Bytes" />
        <Select value={format} onChange={(event) => setFormat(event.target.value)}>
          <option value="hex">Hex</option>
          <option value="base64">Base64</option>
          <option value="url">URL-safe</option>
        </Select>
        <Button onClick={generate}>{ui(dictionary, "generate", "Generate")}</Button>
      </div>
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

function JsonPathTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [json, setJson] = React.useState('{"items":[{"name":"Bob"},{"name":"Alice"}]}');
  const [path, setPath] = React.useState("$.items[0].name");
  const result = React.useMemo(() => {
    try {
      const parts = path.replace(/^\$\.?/, "").replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
      const value = parts.reduce<unknown>((current, part) => (current as Record<string, unknown> | unknown[])?.[part as keyof typeof current], JSON.parse(json));
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return error instanceof Error ? error.message : "Unable to evaluate path.";
    }
  }, [json, path]);

  return (
    <div className="space-y-4">
      <Input value={path} onChange={(event) => setPath(event.target.value)} aria-label="JSONPath" />
      <Textarea value={json} onChange={(event) => setJson(event.target.value)} className="min-h-44" />
      <ResultBlock title={ui(dictionary, "pathResult", "Path result")} value={result} dictionary={dictionary} />
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
        { value: "pretty", label: "Pretty print", transform: formatXmlLike },
        { value: "minify", label: "Minify", transform: (value) => value.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim() },
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

function CssFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <TextTransformTool dictionary={dictionary} inputLabel="CSS" defaultInput=".card{display:flex;color:#111}" modes={[{ value: "format", label: "Format CSS", transform: formatCss }]} />;
}

function CssMinifierTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <TextTransformTool dictionary={dictionary} inputLabel="CSS" defaultInput=".card { display: flex; color: #111; }" modes={[{ value: "minify", label: "Minify CSS", transform: minifyCss }]} />;
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

function JavaScriptFormatterTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <TextTransformTool dictionary={dictionary} inputLabel="JavaScript" defaultInput="function hi(){console.log('bob');}" modes={[{ value: "format", label: "Format JavaScript", transform: formatJs }]} />;
}

function JavaScriptMinifierTool({ dictionary }: { dictionary: ClientDictionary }) {
  return <TextTransformTool dictionary={dictionary} inputLabel="JavaScript" defaultInput="function hi() { console.log('bob'); }" modes={[{ value: "minify", label: "Minify JavaScript", transform: minifyJs }]} />;
}

function MarkdownPreviewTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [input, setInput] = React.useState("# Release notes\n\n- Added JSON Formatter\n- Added Regex Tester\n\n`npm run build`");
  const lines = input.split("\n");
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-72" />
      <div className="min-h-72 rounded-lg border bg-card p-4 text-sm">
        {lines.map((line, index) => {
          if (line.startsWith("# ")) return <h2 key={index} className="mb-3 text-xl font-semibold">{line.slice(2)}</h2>;
          if (line.startsWith("## ")) return <h3 key={index} className="mb-2 text-lg font-semibold">{line.slice(3)}</h3>;
          if (line.startsWith("- ")) return <li key={index} className="ml-4 list-disc">{line.slice(2)}</li>;
          if (/^`.*`$/.test(line)) return <code key={index} className="my-2 block rounded bg-muted px-2 py-1">{line.slice(1, -1)}</code>;
          return <p key={index} className="mb-2 text-muted-foreground">{line || "\u00a0"}</p>;
        })}
        <Button variant="outline" size="sm" onClick={() => copyToClipboard(input)}>
          <Copy className="h-4 w-4" />
          {dictionary.tool.copy}
        </Button>
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

function UrlParserTool({ dictionary }: { dictionary: ClientDictionary }) {
  return (
    <TextTransformTool
      dictionary={dictionary}
      inputLabel="URL"
      defaultInput="https://www.bobob.app/tools/json-formatter?q=json#top"
      modes={[
        {
          value: "parse",
          label: "Parse URL",
          transform: (value) => {
            const url = new URL(value.includes("://") ? value : `https://${value}`);
            return JSON.stringify(
              {
                protocol: url.protocol,
                origin: url.origin,
                hostname: url.hostname,
                port: url.port,
                pathname: url.pathname,
                search: Object.fromEntries(url.searchParams.entries()),
                hash: url.hash,
              },
              null,
              2,
            );
          },
        },
      ]}
    />
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

function RobotsGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [sitemap, setSitemap] = React.useState("https://www.bobob.app/sitemap.xml");
  const [mode, setMode] = React.useState("allow");
  const output = [`User-agent: *`, mode === "allow" ? "Allow: /" : "Disallow: /", "", `Sitemap: ${sitemap}`].join("\n");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <Input value={sitemap} onChange={(event) => setSitemap(event.target.value)} aria-label="Sitemap URL" />
        <Select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="allow">Allow all</option>
          <option value="block">Block all</option>
        </Select>
      </div>
      <ResultBlock title="robots.txt" value={output} dictionary={dictionary} />
    </div>
  );
}

function SitemapGeneratorTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [urls, setUrls] = React.useState("https://www.bobob.app/\nhttps://www.bobob.app/tools/json-formatter");
  const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>`;
  return (
    <div className="space-y-4">
      <Textarea value={urls} onChange={(event) => setUrls(event.target.value)} className="min-h-44" />
      <ResultBlock title={ui(dictionary, "xmlSitemap", "XML sitemap")} value={output} dictionary={dictionary} />
    </div>
  );
}

function OpenGraphPreviewTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [title, setTitle] = React.useState("Bob's Multi Tool");
  const [description, setDescription] = React.useState("Practical developer utilities for daily workflows.");
  const [url, setUrl] = React.useState("https://www.bobob.app");
  const [image, setImage] = React.useState("https://www.bobob.app/og-image.png");
  const tags = [`<meta property="og:title" content="${title}" />`, `<meta property="og:description" content="${description}" />`, `<meta property="og:url" content="${url}" />`, `<meta property="og:image" content="${image}" />`].join("\n");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} aria-label={ui(dictionary, "title", "Title")} />
        <Input value={url} onChange={(event) => setUrl(event.target.value)} aria-label="URL" />
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="md:col-span-2" aria-label={ui(dictionary, "description", "Description")} />
        <Input value={image} onChange={(event) => setImage(event.target.value)} aria-label={ui(dictionary, "imageUrl", "Image URL")} className="md:col-span-2" />
      </div>
      <div className="max-w-xl overflow-hidden rounded-lg border bg-card">
        <div className="aspect-[1.91/1] bg-muted p-4 text-sm text-muted-foreground">{image}</div>
        <div className="space-y-1 p-4">
          <p className="text-xs uppercase text-muted-foreground">{url}</p>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
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

function HttpStatusTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [url, setUrl] = React.useState("https://www.bobob.app");
  const [result, setResult] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const check = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/http-status?url=${encodeURIComponent(url)}`);
      setResult(JSON.stringify(await response.json(), null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input value={url} onChange={(event) => setUrl(event.target.value)} />
        <Button onClick={check} disabled={loading}>{loading ? ui(dictionary, "checking", "Checking") : ui(dictionary, "check", "Check")}</Button>
      </div>
      <ResultBlock title={ui(dictionary, "httpStatus", "HTTP status")} value={result} dictionary={dictionary} />
    </div>
  );
}

function DnsLookupTool({ dictionary }: { dictionary: ClientDictionary }) {
  const [hostname, setHostname] = React.useState("bobob.app");
  const [record, setRecord] = React.useState("A");
  const [result, setResult] = React.useState("");
  const lookup = async () => {
    try {
      const response = await fetch(`/api/dns-lookup?hostname=${encodeURIComponent(hostname)}&record=${encodeURIComponent(record)}`);
      setResult(JSON.stringify(await response.json(), null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : ui(dictionary, "dnsLookupFailed", "DNS lookup failed."));
    }
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
        <Input value={hostname} onChange={(event) => setHostname(event.target.value)} />
        <Select value={record} onChange={(event) => setRecord(event.target.value)}>
          {["A", "AAAA", "CNAME", "MX", "TXT", "NS"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Button onClick={lookup}>{ui(dictionary, "lookup", "Lookup")}</Button>
      </div>
      <ResultBlock title={ui(dictionary, "dnsRecords", "DNS records")} value={result} dictionary={dictionary} />
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
  jwt: JwtDecoderTool,
  url: UrlEncoderTool,
  base64: Base64Tool,
  timestamp: TimestampTool,
  uuid: UuidTool,
  hash: HashGeneratorTool,
  diff: TextDiffTool,
  yamlJson: YamlJsonTool,
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

export function ToolPanel({ component, dictionary }: { component: ToolComponentKey; dictionary: ClientDictionary }) {
  const Component = toolComponentMap[component];
  return Component ? <Component dictionary={dictionary} /> : <ToolEmptyState />;
}
