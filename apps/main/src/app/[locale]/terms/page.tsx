import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, isLocale, languageAlternates, withLocale, type Locale } from "@/features/i18n/config";
import { getClientDictionary } from "@/features/i18n/dictionaries";

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
  return {
    title: "Terms of Service",
    description: "Terms of service for Bob's Multi Tool developer utilities.",
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
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10" lang={locale} dir={dictionary.dir}>
      <Link href={withLocale("/", locale)} className="text-sm text-muted-foreground hover:text-foreground">
        Back to tools
      </Link>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>Last updated: June 5, 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>Bob&apos;s Multi Tool provides free browser-based utilities for development workflows. Tool output should be verified before relying on it in production systems.</p>
          <p>You agree not to disrupt the service, automate abusive traffic, use the tools for unlawful activity, or submit private data you are not allowed to process in a browser utility.</p>
          <p>Some tools may use third-party services or server routes. Bob&apos;s Multi Tool does not control third-party websites, DNS providers, or remote endpoints.</p>
          <p>Questions about these terms can be sent to <a className="text-foreground underline" href="mailto:bobob935@gmail.com">bobob935@gmail.com</a>.</p>
        </CardContent>
      </Card>
    </main>
  );
}
