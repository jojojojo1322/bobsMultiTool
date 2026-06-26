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
      ? "판단을 빠르게 누르는 형식"
      : content.type === "sort-match-game"
        ? "항목을 나눠보는 형식"
        : content.type === "arcade-game"
          ? "키보드로 직접 움직이는 캔버스 형식"
          : "선택을 쌓아 결과를 보는 형식";
  const firstBlog = relatedBlogLinks[0];

  return (
    <section className="mt-6 rounded-md border bg-muted/20 p-4" data-play-context>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Play note</p>
      <h2 className="mt-2 text-xl font-semibold tracking-normal">이 작은 Play를 둔 이유</h2>
      <div className="mt-3 grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
        <p>
          {content.title}은 오래 설명하려고 만든 페이지가 아닙니다. {typeLabel}으로, 머리로만 읽던 상황을 손으로 한 번 눌러보게 만드는 쪽에 가깝습니다. 잘 만든 게임이라기보다
          “아, 이런 느낌이었지...” 하고 짧게 확인하는 실험입니다.
        </p>
        <p>
          한 판은 {content.durationLabel}, {playMetric} 정도로 끝납니다. 결과가 대단한 진단은 아니지만, 어떤 선택을 반복했는지 돌아보는 작은 흔적은 남습니다. 그래서 글만 읽고
          지나가기보다 한 번 눌러보고, 마음에 걸리면 관련 글로 다시 돌아오는 흐름을 보고 있습니다.
        </p>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        점수나 결과 문구는 정답표가 아닙니다. 이 사이트가 지금 어떤 작은 반응을 만들 수 있는지 확인하는 재료에 가깝습니다. 너무 진지하게 붙잡기보다, 한 번 해보고 “이건 좀
        되네” 싶은 감각만 가져가면 됩니다.
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
