import { atomFeedXml } from "@/features/seo/feed";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function GET() {
  return new Response(atomFeedXml(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
