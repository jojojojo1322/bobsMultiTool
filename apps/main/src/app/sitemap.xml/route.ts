import { sitemapIndexXml } from "@/features/seo/sitemaps";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function GET() {
  return new Response(sitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
