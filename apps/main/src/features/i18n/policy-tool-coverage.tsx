import Link from "next/link";
import { type Locale, withLocale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedTools } from "@/features/i18n/localized-content";
import type { ToolDefinition } from "@/features/tools/types";

type LegalCoverageKind = "privacy" | "terms";

const coverageSlugs = [
  "json-formatter",
  "regex-tester",
  "jwt-decoder",
  "base64-tool",
  "cron-generator",
  "uuid-generator",
  "hash-generator",
  "password-generator",
  "qr-code-generator",
  "dns-lookup",
  "http-status-checker",
  "color-converter",
  "sql-formatter",
  "css-formatter",
  "javascript-formatter",
];

function isToolDefinition(tool: ToolDefinition | undefined): tool is ToolDefinition {
  return Boolean(tool);
}

function getCoverageTools(locale: Locale) {
  const toolBySlug = new Map(getLocalizedTools(locale).map((tool) => [tool.slug, tool]));
  return coverageSlugs.map((slug) => toolBySlug.get(slug)).filter(isToolDefinition);
}

function CoverageRow({
  tool,
  locale,
  compact = false,
}: {
  tool: ToolDefinition;
  locale: Locale;
  compact?: boolean;
}) {
  const dictionary = getClientDictionary(locale);
  const privacyLabel = tool.requiresServer ? dictionary.tool.serverRequired : dictionary.tool.localOnly;
  const href = withLocale(`/tools/${tool.slug}`, locale);
  const useCases = tool.useCases.slice(0, compact ? 1 : 2);
  const examples = tool.inputExamples.slice(0, compact ? 1 : 2);
  const failureCase = tool.failureCases?.[0];
  const preCopyCheck = tool.preCopyChecklist?.[0];

  return (
    <article className="py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link href={href} className="text-sm font-semibold text-foreground underline-offset-4 hover:underline">
          {tool.title}
        </Link>
        <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{privacyLabel}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-normal text-foreground">{dictionary.tool.useCases}</h3>
          <ul className="mt-1 list-disc space-y-1 ps-5">
            {useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-normal text-foreground">{dictionary.tool.examplesDescription}</h3>
          <ul className="mt-1 list-disc space-y-1 ps-5">
            {examples.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {!compact && (failureCase || preCopyCheck) ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {failureCase ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-normal text-foreground">{dictionary.tool.failureCases}</h3>
              <p className="mt-1">{failureCase}</p>
            </div>
          ) : null}
          {preCopyCheck ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-normal text-foreground">{dictionary.tool.preCopyChecklist}</h3>
              <p className="mt-1">{preCopyCheck}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ToolCoverageList({
  title,
  tools,
  locale,
  compact,
}: {
  title?: string;
  tools: ToolDefinition[];
  locale: Locale;
  compact?: boolean;
}) {
  if (!tools.length) return null;

  return (
    <div>
      {title ? <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3> : null}
      <div className="divide-y border-y">
        {tools.map((tool) => (
          <CoverageRow key={tool.slug} tool={tool} locale={locale} compact={compact} />
        ))}
      </div>
    </div>
  );
}

export function TrustToolCoverage({ locale }: { locale: Locale }) {
  const dictionary = getClientDictionary(locale);
  const tools = getCoverageTools(locale);

  return (
    <section className="space-y-4 border-t pt-6">
      <div>
        <h2 className="mb-2 text-base font-semibold text-foreground">{dictionary.tool.developerWorkbench}</h2>
        <p>
          {dictionary.tool.singleDomainBody} {dictionary.tool.localFirstBody} {dictionary.tool.expandableRegistryBody}
        </p>
      </div>
      <ToolCoverageList tools={tools} locale={locale} />
    </section>
  );
}

export function LegalToolCoverage({ locale, kind }: { locale: Locale; kind: LegalCoverageKind }) {
  const dictionary = getClientDictionary(locale);
  const tools = getCoverageTools(locale);
  const localTools = tools.filter((tool) => !tool.requiresServer);
  const serverTools = tools.filter((tool) => tool.requiresServer);
  const title = kind === "privacy" ? dictionary.tool.privacy : dictionary.tool.developerWorkbench;
  const intro =
    kind === "privacy"
      ? `${dictionary.tool.localFirstBody} ${dictionary.tool.localSessionBody}`
      : `${dictionary.tool.singleDomainBody} ${dictionary.tool.expandableRegistryBody}`;

  return (
    <section className="space-y-5 border-t pt-6">
      <div>
        <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
        <p>{intro}</p>
      </div>
      <ToolCoverageList title={dictionary.tool.localOnly} tools={localTools} locale={locale} compact />
      <ToolCoverageList title={dictionary.tool.serverRequired} tools={serverTools} locale={locale} compact />
    </section>
  );
}
