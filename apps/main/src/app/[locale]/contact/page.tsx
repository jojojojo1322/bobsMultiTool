import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { defaultLocale, isLocale, languageAlternates, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { TrustPage } from "@/features/i18n/trust-page";
import { getLocalizedTrustContent } from "@/features/i18n/trust-content";

interface LocalizedContactProps {
  params: Promise<{ locale: string }>;
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/contact");
  return value;
}

export async function generateMetadata({ params }: LocalizedContactProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const content = getLocalizedTrustContent(locale, "contact");
  const url = `https://www.bobob.app${withLocale("/contact", locale)}`;
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: url,
      languages: languageAlternates("/contact"),
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

export default async function LocalizedContactPage({ params }: LocalizedContactProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  const content = getLocalizedTrustContent(locale, "contact");
  return <TrustPage content={content} locale={locale} dir={dictionary.dir} />;
}
