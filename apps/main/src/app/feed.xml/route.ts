import { rssFeedXml } from "@/features/seo/feed";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function GET() {
  return new Response(rssFeedXml(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
