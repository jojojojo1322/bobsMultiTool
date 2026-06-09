import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { defaultLocale, isLocale, languageAlternates, locales, openGraphLocales, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary, getDictionary } from "@/features/i18n/dictionaries";
import { readSearchQuery, ToolDirectory } from "@/features/tools/tool-directory";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/");
  return value;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getDictionary(locale);
  const url = `https://www.bobob.app${withLocale("/", locale)}`;
  return {
    title: dictionary.metadata.homeTitle,
    description: dictionary.metadata.homeDescription,
    alternates: {
      canonical: url,
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale],
      url,
      siteName: "Bob's Multi Tool",
      title: dictionary.metadata.homeTitle,
      description: dictionary.metadata.homeDescription,
    },
  };
}

export default async function LocalizedHomePage({ params, searchParams }: LocalePageProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  const initialQuery = readSearchQuery(await searchParams);

  return <ToolDirectory locale={locale} dictionary={dictionary} initialQuery={initialQuery} />;
}
