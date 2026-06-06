import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, isLocale, languageAlternates, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";

interface LocalizedPolicyProps {
  params: Promise<{ locale: string }>;
}

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  if (value === defaultLocale) redirect("/privacy");
  return value;
}

export async function generateMetadata({ params }: LocalizedPolicyProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = validLocale(value);
  return {
    title: "Privacy Policy",
    description: "Privacy policy for Bob's Multi Tool developer utilities.",
    alternates: {
      canonical: `https://www.bobob.app${withLocale("/privacy", locale)}`,
      languages: languageAlternates("/privacy"),
    },
  };
}

export default async function LocalizedPrivacyPage({ params }: LocalizedPolicyProps) {
  const { locale: value } = await params;
  const locale = validLocale(value);
  const dictionary = getClientDictionary(locale);
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10" lang={locale} dir={dictionary.dir}>
      <Link href={withLocale("/", locale)} className="text-sm text-muted-foreground hover:text-foreground">
        Back to tools
      </Link>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <CardDescription>Last updated: June 5, 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>Bob&apos;s Multi Tool is designed around local browser utilities. Inputs used for formatting, encoding, decoding, generation, and conversion are processed in your browser where practical and are not stored by this site.</p>
          <p>HTTP status and DNS tools require a small server route because browsers cannot perform those checks directly. Do not submit private internal hostnames or confidential data.</p>
          <p>The site may use Google Analytics and Google AdSense. These third-party services may use cookies or similar technologies according to their own policies.</p>
          <p>Questions about this policy can be sent to <a className="text-foreground underline" href="mailto:bobob935@gmail.com">bobob935@gmail.com</a>.</p>
        </CardContent>
      </Card>
    </main>
  );
}
