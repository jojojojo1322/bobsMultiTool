import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { ContentNav } from "@/features/content/content-nav";
import { getBlogPostBySlug } from "@/features/content/blog";
import { playContentKeywords } from "@/features/content/discovery";
import { getPlayContentBySlug, getPlayContents } from "@/features/content/play";
import { playDetailStructuredData } from "@/features/content/structured-data";
import { SurvivalPlayEngine } from "@/features/play/survival-engine";
import { TapGameEngine } from "@/features/play/tap-game-engine";
import { SortMatchEngine } from "@/features/play/sort-match-engine";
import { ArcadeGameEngine } from "@/features/play/arcade-game-engine";
import type { PlayContent } from "@/features/content/types";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPlayContents().map((content) => ({ slug: content.slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getPlayContentBySlug(slug);
  if (!content) return {};
  const url = `https://www.bobob.app/play/${content.slug}`;
  const image = openGraphImage({ kind: "play", title: content.title });
  const relatedBlogs = content.relatedBlogSlugs.flatMap((blogSlug) => {
    const post = getBlogPostBySlug(blogSlug);
    return post ? [post] : [];
  });

  return {
    title: `${content.title} - bobob.app Play`,
    description: content.description,
    keywords: playContentKeywords(content, relatedBlogs),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "bobob.app",
      title: `${content.title} - bobob.app Play`,
      description: content.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.title} - bobob.app Play`,
      description: content.description,
      images: [shareImageUrl({ kind: "play", title: content.title })],
    },
  };
}

export default async function PlayDetailPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const content = getPlayContentBySlug(slug);
  if (!content) notFound();
  const dictionary = getClientDictionary(contentLocale);
  const relatedBlogs = content.relatedBlogSlugs.flatMap((blogSlug) => {
    const post = getBlogPostBySlug(blogSlug);
    return post ? [post] : [];
  });
  const relatedBlogLinks = content.relatedBlogSlugs.flatMap((blogSlug) => {
    const post = getBlogPostBySlug(blogSlug);
    return post ? [{ slug: post.slug, title: post.title, description: post.description }] : [];
  });
  const relatedPlayLinks = content.relatedPlaySlugs.flatMap((playSlug) => {
    const play = getPlayContentBySlug(playSlug);
    return play ? [{ slug: play.slug, title: play.title, description: play.description }] : [];
  });
  const jsonLd = playDetailStructuredData({ content, relatedBlogs });
  const detailMaxWidth = content.type === "arcade-game" ? "max-w-7xl" : "max-w-6xl";

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-2">
            <Badge>Play</Badge>
            <Badge>{content.durationLabel}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">{content.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{content.description}</p>
        </div>
      </section>
      <section className={`mx-auto ${detailMaxWidth} px-4 py-8`}>
        {content.type === "micro-sim" ? (
          <SurvivalPlayEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : content.type === "tap-game" ? (
          <TapGameEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : content.type === "arcade-game" ? (
          <ArcadeGameEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : (
          <SortMatchEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        )}
        <PlayContext content={content} relatedBlogLinks={relatedBlogLinks} />
      </section>
    </main>
  );
}
const contentLocale = "ko";

function PlayContext({
  content,
  relatedBlogLinks,
}: {
  content: PlayContent;
  relatedBlogLinks: Array<{ slug: string; title: string; description?: string }>;
}) {
  const typeLabel =
    content.type === "tap-game"
      ? "보이는 걸 빠르게 누르는 판"
      : content.type === "sort-match-game"
        ? "이것저것 나눠 보는 판"
        : content.type === "arcade-game"
          ? "마우스나 키보드로 움직이는 판"
          : "짧게 골라보는 판";
  const firstBlog = relatedBlogLinks[0];
  const pacingText =
    content.type === "arcade-game" && content.arcade.variant === "lottery"
      ? "한 장을 다 긁으면 곧장 다음 단계 복권으로 넘어갑니다. 더 긁고 싶으면 이어가고, 그만하고 싶으면 그 자리에서 멈추면 됩니다."
      : content.type === "arcade-game" && content.arcade.variant === "sum-box"
        ? `한 판은 ${content.durationLabel} 동안 갑니다. 결과는 그 시간 안에 만든 기록으로 남습니다.`
        : content.type === "arcade-game"
          ? `한 판은 ${content.durationLabel} 정도로 짧게 갑니다. 결과는 점수와 짧은 말로 남고, 다시 해도 바로 이어집니다.`
        : `한 판은 ${content.durationLabel} 정도로 짧게 갑니다. 결과는 점수와 짧은 말로 끝나고, 더 이어 보고 싶을 때만 관련 글을 열면 됩니다.`;

  return (
    <section className="mt-6 rounded-md border bg-muted/20 p-4" data-play-context>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">한 판 안내</p>
      <h2 className="mt-2 text-xl font-semibold tracking-normal">규칙은 화면에서 바로 확인</h2>
      <div className="mt-3 grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
        <p>
          이 판은 설명을 오래 읽고 시작하는 쪽이 아닙니다. {typeLabel}이라서 첫 움직임으로 감을 잡으면 됩니다. 맞으면 한 번 더 하고, 아니면 다음 카드로 넘어가세요.
        </p>
        <p>{pacingText}</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        점수는 정답표가 아니라 한 판 기록입니다. 마우스와 키보드 입력은 브라우저 안에서 바로 처리되고, 결과 공유도 같은 화면에서 이어집니다. 방금 감이 맞았다면 한 번 더, 아니면 다른 카드로 넘어가도 충분합니다.
      </p>
      {firstBlog ? (
        <div className="mt-4 rounded-sm border bg-background p-3 text-sm">
          <p className="font-medium">이어지는 기록</p>
          <Link href={`/blog/${firstBlog.slug}`} className="mt-1 inline-flex text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {firstBlog.title}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
