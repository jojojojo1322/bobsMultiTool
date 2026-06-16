import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withLocale, type Locale } from "@/features/i18n/config";
import { getLocalizedTrustContent, type TrustPageContent } from "@/features/i18n/trust-content";

export function TrustPage({
  content,
  locale,
  dir,
}: {
  content: TrustPageContent;
  locale: Locale;
  dir: "ltr" | "rtl";
}) {
  const aboutTitle = getLocalizedTrustContent(locale, "about").title;
  const contactTitle = getLocalizedTrustContent(locale, "contact").title;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background" lang={locale} dir={dir}>
      <div className="relative mx-auto max-w-4xl px-4 py-10">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Link href={withLocale("/", locale)} className="hover:text-foreground">
            {content.backToTools}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={withLocale("/about", locale)} className="hover:text-foreground">
            {aboutTitle}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={withLocale("/contact", locale)} className="hover:text-foreground">
            {contactTitle}
          </Link>
        </nav>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-3xl">{content.title}</CardTitle>
            <CardDescription>{content.lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
            <p>{content.description}</p>
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-2 text-base font-semibold text-foreground">{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            <Link
              href={content.primaryLink.href.startsWith("/") ? withLocale(content.primaryLink.href, locale) : content.primaryLink.href}
              className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {content.primaryLink.label}
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
