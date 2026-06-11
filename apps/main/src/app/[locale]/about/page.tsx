import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { defaultLocale, isLocale, languageAlternates, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { TrustPage } from "@/features/i18n/trust-page";
import { getLocalizedTrustContent } from "@/features/i18n/trust-content";

interface LocalizedAboutProps {
  params: Promise<{ locale: string }>;
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/about");
  return value;
}

export async function generateMetadata({ params }: LocalizedAboutProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const content = getLocalizedTrustContent(locale, "about");
  const url = `https://www.bobob.app${withLocale("/about", locale)}`;
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: url,
      languages: languageAlternates("/about"),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      siteName: "Bob's Multi Tool",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };
}

export default async function LocalizedAboutPage({ params }: LocalizedAboutProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  const content = getLocalizedTrustContent(locale, "about");
  return <TrustPage content={content} locale={locale} dir={dictionary.dir} />;
}
