import Link from "next/link";
import type { Dictionary } from "@/features/i18n/dictionaries";
import type { Locale } from "@/features/i18n/config";
import { withLocale } from "@/features/i18n/config";
import type { ToolDefinition } from "@/features/tools/types";

interface GuideReviewSectionsProps {
  dictionary: Dictionary;
  locale: Locale;
  tools: ToolDefinition[];
}

export function GuideReviewSections({ dictionary, locale, tools }: GuideReviewSectionsProps) {
  if (!tools.length) return null;

  return (
    <section className="mt-8 rounded-lg border bg-card p-5" data-guide-review-sections>
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold">{dictionary.tool.preCopyChecklist}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{dictionary.tool.preCopyChecklistDescription}</p>
      </div>
      <div className="mt-5 divide-y rounded-md border bg-background/60">
        {tools.map((tool) => (
          <article key={tool.slug} className="p-4" data-guide-tool-review={tool.slug}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">
                  <Link href={withLocale(`/tools/${tool.slug}`, locale)} className="hover:text-muted-foreground">
                    {tool.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
              </div>
              <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">{dictionary.categories[tool.category] ?? tool.category}</span>
            </div>

            {tool.useCases.length ? (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{dictionary.tool.useCases}</h4>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
                  {tool.useCases.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tool.failureCases?.length ? (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{dictionary.tool.failureCases}</h4>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                  {tool.failureCases.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tool.preCopyChecklist?.length ? (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{dictionary.tool.preCopyChecklist}</h4>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                  {tool.preCopyChecklist.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tool.examples.length || tool.faqs.length ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {tool.examples.length ? (
                  <div className="rounded-md border bg-card/70 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{dictionary.nav.examples}</h4>
                    <div className="mt-3 space-y-3">
                      {tool.examples.slice(0, 3).map((example) => (
                        <div key={`${tool.slug}-${example.label}`} className="text-sm leading-6">
                          <p className="font-medium text-foreground">{example.label}</p>
                          <p className="text-muted-foreground">{example.note}</p>
                          <code className="mt-2 block whitespace-pre-wrap break-words rounded-md bg-muted px-2 py-1 text-xs leading-5 text-foreground">{example.value}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {tool.faqs.length ? (
                  <div className="rounded-md border bg-card/70 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{dictionary.nav.faq}</h4>
                    <div className="mt-3 space-y-3 text-sm leading-6">
                      {tool.faqs.slice(0, 3).map((faq) => (
                        <div key={`${tool.slug}-${faq.question}`}>
                          <p className="font-medium text-foreground">{faq.question}</p>
                          <p className="mt-1 text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
