import Link from "next/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PointerBackground } from "@/components/pointer-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, languageAlternates, withLocale } from "@/features/i18n/config";
import { getClientDictionary, getDictionary } from "@/features/i18n/dictionaries";
import { guides } from "@/features/guides/registry";

const metadataDictionary = getDictionary(defaultLocale);
const dictionary = getClientDictionary(defaultLocale);

export const metadata = {
  title: metadataDictionary.metadata.guidesTitle,
  description: metadataDictionary.metadata.guidesDescription,
  alternates: {
    canonical: "https://www.bobob.app/guides",
    languages: languageAlternates("/guides"),
  },
};

export default function GuidesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <PointerBackground />
      <div className="relative mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {dictionary.nav.brand}
          </Link>
          <div className="flex flex-wrap justify-end gap-2">
            <ThemeToggle dictionary={dictionary} />
            <LocaleSwitcher locale={defaultLocale} dictionary={dictionary} />
          </div>
        </header>
        <Badge>{dictionary.guides.badge}</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">{dictionary.guides.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{dictionary.guides.description}</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {guides.map((guide) => (
            <Link key={guide.slug} href={withLocale(`/guides/${guide.slug}`, defaultLocale)}>
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
