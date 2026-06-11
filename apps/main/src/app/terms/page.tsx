import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultLocale, languageAlternates } from "@/features/i18n/config";
import { getLocalizedLegalContent } from "@/features/i18n/legal-content";

const content = getLocalizedLegalContent(defaultLocale, "terms");

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  alternates: {
    canonical: "https://www.bobob.app/terms",
    languages: languageAlternates("/terms"),
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
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
    </main>
  );
}
