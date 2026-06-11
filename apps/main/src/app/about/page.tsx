import type { Metadata } from "next";
import { defaultLocale, languageAlternates } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { TrustPage } from "@/features/i18n/trust-page";
import { getLocalizedTrustContent } from "@/features/i18n/trust-content";

const content = getLocalizedTrustContent(defaultLocale, "about");

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: "https://www.bobob.app/about",
    languages: languageAlternates("/about"),
  },
  openGraph: {
    title: content.title,
    description: content.description,
    url: "https://www.bobob.app/about",
    siteName: "Bob's Multi Tool",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: content.title,
    description: content.description,
  },
};

export default function AboutPage() {
  const dictionary = getClientDictionary(defaultLocale);
  return <TrustPage content={content} locale={defaultLocale} dir={dictionary.dir} />;
}
