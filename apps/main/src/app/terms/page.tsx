import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of service for Bob's Multi Tool developer utilities.",
  alternates: {
    canonical: "https://www.bobob.app/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        Back to tools
      </Link>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>Last updated: June 5, 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Use of the service</h2>
            <p>
              Bob&apos;s Multi Tool provides free browser-based utilities for development workflows. The tools are provided as is
              and should be verified before relying on their output in production systems.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Acceptable use</h2>
            <p>
              You agree not to disrupt the service, automate abusive traffic, use the tools for unlawful activity, or paste data
              that you are not allowed to process in a third-party browser utility.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Third-party content</h2>
            <p>
              Some tools, such as the iframe viewer, may display third-party websites. Bob&apos;s Multi Tool does not control those
              websites and is not responsible for their content, frame blocking behavior, or availability.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Advertising</h2>
            <p>
              The site may display ads through Google AdSense after approval. Advertisement content is served by third-party
              networks and may be personalized according to their policies.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
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
