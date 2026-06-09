import { isSitemapLocale, localizedSitemapXml, sitemapLocales } from "@/features/seo/sitemaps";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function generateStaticParams() {
  return sitemapLocales().map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSitemapLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(localizedSitemapXml(locale), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
