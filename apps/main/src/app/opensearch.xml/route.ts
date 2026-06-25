import { openSearchXml } from "@/features/seo/opensearch";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function GET() {
  return new Response(openSearchXml(), {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
