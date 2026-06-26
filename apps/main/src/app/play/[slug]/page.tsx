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
  const playMetric =
    content.type === "micro-sim"
      ? `${content.turns.length}턴`
      : content.type === "tap-game"
        ? `${content.targets.length}개 판단`
        : content.type === "arcade-game"
          ? `${content.arcade.rounds}번 조작`
          : `${content.items.length}개 분류`;
  const jsonLd = playDetailStructuredData({ content, relatedBlogs });

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-2">
            <Badge>Play</Badge>
            <Badge>{content.durationLabel}</Badge>
            <Badge>{playMetric}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">{content.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{content.description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        {content.type === "micro-sim" ? (
          <SurvivalPlayEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : content.type === "tap-game" ? (
          <TapGameEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : content.type === "arcade-game" ? (
          <ArcadeGameEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        ) : (
          <SortMatchEngine content={content} relatedBlogLinks={relatedBlogLinks} relatedPlayLinks={relatedPlayLinks} />
        )}
        <PlayContext content={content} relatedBlogLinks={relatedBlogLinks} playMetric={playMetric} />
      </section>
    </main>
  );
}
const contentLocale = "ko";

function PlayContext({
  content,
  relatedBlogLinks,
  playMetric,
}: {
  content: PlayContent;
  relatedBlogLinks: Array<{ slug: string; title: string; description?: string }>;
  playMetric: string;
}) {
  const typeLabel =
    content.type === "tap-game"
      ? "빠르게 누르는 게임"
      : content.type === "sort-match-game"
        ? "이것저것 나눠 보는 게임"
        : content.type === "arcade-game"
          ? "손으로 직접 조작하는 게임"
          : "몇 번 골라보고 결과를 보는 게임";
  const firstBlog = relatedBlogLinks[0];

  return (
    <section className="mt-6 rounded-md border bg-muted/20 p-4" data-play-context>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Play note</p>
      <h2 className="mt-2 text-xl font-semibold tracking-normal">왜 만들었냐면</h2>
      <div className="mt-3 grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
        <p>
          {content.title}은 설명을 오래 읽는 페이지가 아닙니다. {typeLabel}이고, 화면 보고 바로 한 번 움직여보면 됩니다. 잘 맞으면 다시 하고, 별로면 결과만 보고 그냥 닫아도 됩니다.
        </p>
        <p>
          한 판은 {content.durationLabel}, {playMetric} 정도로 끝납니다. 결과는 거창한 분석이 아니라 점수와 짧은 코멘트에 가깝습니다. 마음에 남는 부분이 있으면 관련 글을
          이어서 보면 됩니다.
        </p>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        점수는 정답표가 아닙니다. 그냥 한 판 해보고 “이건 좀 되네” 싶으면 한 번 더, 아니면 다음 카드로 넘어가면 됩니다. 그 정도면 충분합니다.
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
