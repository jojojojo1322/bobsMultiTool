import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Bob's Multi Tool developer utilities.",
  alternates: {
    canonical: "https://www.bobob.app/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        Back to tools
      </Link>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <CardDescription>Last updated: June 5, 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Information processed by tools</h2>
            <p>
              Bob&apos;s Multi Tool is designed around local browser utilities. Inputs used for formatting, encoding, decoding,
              timestamp conversion, UUID generation, iframe previews, and placeholder text generation are processed in your
              browser where practical and are not stored by this site.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Analytics and advertising</h2>
            <p>
              The site may use Google Analytics to understand usage patterns and Google AdSense to display ads after approval.
              These third-party services may use cookies or similar technologies according to their own policies.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Sensitive data</h2>
            <p>
              Do not paste production secrets, private keys, live access tokens, or confidential customer data into any online
              utility. JWT decoding and formatting tools are intended for inspection of safe test data and development payloads.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
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
