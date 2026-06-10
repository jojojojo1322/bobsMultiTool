import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PointerBackground } from "@/components/pointer-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDictionary, getDictionary } from "@/features/i18n/dictionaries";
import { getLocalizedGuides } from "@/features/i18n/localized-content";
import { defaultLocale, isLocale, languageAlternates, locales, withLocale, type Locale } from "@/features/i18n/config";

interface LocalizedGuidesPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/guides");
  return value;
}

export async function generateMetadata({ params }: LocalizedGuidesPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getDictionary(locale);
  const pathname = "/guides";
  return {
    title: dictionary.metadata.guidesTitle,
    description: dictionary.metadata.guidesDescription,
    alternates: {
      canonical: `https://www.bobob.app${withLocale(pathname, locale)}`,
      languages: languageAlternates(pathname),
    },
  };
}

export default async function LocalizedGuidesPage({ params }: LocalizedGuidesPageProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  const localizedGuides = getLocalizedGuides(locale);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background" lang={locale} dir={dictionary.dir}>
      <PointerBackground />
      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex items-center justify-between gap-3">
          <Link href={withLocale("/", locale)} className="text-sm font-semibold tracking-tight">
            {dictionary.nav.brand}
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <ThemeToggle dictionary={dictionary} />
            <LocaleSwitcher locale={locale} dictionary={dictionary} />
          </div>
        </header>
        <Badge>{dictionary.guides.badge}</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">{dictionary.guides.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{dictionary.guides.description}</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {localizedGuides.map((guide) => (
            <Link key={guide.slug} href={withLocale(`/guides/${guide.slug}`, locale)}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
