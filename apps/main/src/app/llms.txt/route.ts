import { llmsTxt } from "@/features/seo/llms";

export const dynamic = "force-static";
export const revalidate = 86_400;

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
