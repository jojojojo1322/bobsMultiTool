import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, isLocale, languageAlternates, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedLegalContent } from "@/features/i18n/legal-content";

interface LocalizedTermsProps {
  params: Promise<{ locale: string }>;
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/terms");
  return value;
}

export async function generateMetadata({ params }: LocalizedTermsProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const content = getLocalizedLegalContent(locale, "terms");
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://www.bobob.app${withLocale("/terms", locale)}`,
      languages: languageAlternates("/terms"),
    },
  };
}

export default async function LocalizedTermsPage({ params }: LocalizedTermsProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  const content = getLocalizedLegalContent(locale, "terms");
  return (
    <main className="relative min-h-screen overflow-hidden bg-background" lang={locale} dir={dictionary.dir}>
      <div className="relative mx-auto max-w-4xl px-4 py-10">
        <Link href={withLocale("/", locale)} className="text-sm text-muted-foreground hover:text-foreground">
          {content.backToTools}
        </Link>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-3xl">{content.title}</CardTitle>
            <CardDescription>{content.lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-2 text-base font-semibold text-foreground">{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            <section>
              <h2 className="mb-2 text-base font-semibold text-foreground">{content.contact.heading}</h2>
              <p>
                {content.contact.body}{" "}
                <a className="text-foreground underline" href="mailto:bobob935@gmail.com">
                  bobob935@gmail.com
                </a>
                .
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
