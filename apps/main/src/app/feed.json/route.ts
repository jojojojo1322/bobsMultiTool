import { jsonFeed } from "@/features/seo/feed";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function GET() {
  return Response.json(jsonFeed(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
