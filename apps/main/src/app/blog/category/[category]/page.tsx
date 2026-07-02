import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentNav } from "@/features/content/content-nav";
import { blogCategoryDefinitions, blogCategoryPath, getBlogCategoryBySlug } from "@/features/content/blog-categories";
import { getIndexableBlogPosts } from "@/features/content/blog";
import { blogIndexKeywords } from "@/features/content/discovery";
import { getPlayContentBySlug } from "@/features/content/play";
import { blogCategoryStructuredData } from "@/features/content/structured-data";
import { getClientDictionary } from "@/features/i18n/dictionaries";
import { openGraphImage, shareImageUrl } from "@/features/seo/share-image";

const contentLocale = "ko";

const categoryReviewNotes = {
  diary: {
    focus: "일기 분류는 새 출발, 방향 전환, 작업 리듬처럼 사이트의 결을 설명하는 기록만 대표로 남깁니다. 단순한 기분 메모나 하루치 스케치가 아니라, 이후 Blog와 Play가 왜 이런 모양이 되었는지 읽을 수 있는 글을 우선합니다.",
    kept: "대표 글은 판단이 바뀐 이유, 다음 작업의 기준, 독자가 자기 프로젝트에 옮겨볼 수 있는 작은 체크포인트를 함께 담아야 합니다.",
    archived: "짧은 밤 기록, 이름 후보, 한 줄짜리 다짐처럼 맥락이 약한 조각은 직접 URL로는 남기되 목록과 제출 표면에서는 빼서 한 묶음의 제작 기록 안에서 보게 합니다.",
  },
  interests: {
    focus: "요즘 관심사 분류는 재미있어 보였던 웹 감각을 그냥 모으지 않고, 왜 다시 열어보게 됐는지와 실제 Bobob Play에 어떤 힌트를 줬는지를 함께 적은 글만 앞에 둡니다.",
    kept: "대표 글은 버튼 하나, 짧은 피드백, 다시 해보고 싶은 순간처럼 작지만 반복 방문을 만드는 감각을 구체적인 화면 판단으로 연결합니다.",
    archived: "북마크 목록이나 막연한 취향 기록은 검색 제출용 글로 밀지 않습니다. Play 제작 로그나 관련 글 안에서 근거로 쓰일 때만 다시 꺼냅니다.",
  },
  ai: {
    focus: "AI 분류는 도구 소개보다 실제 작업에서 빨라진 부분과 사람이 다시 책임져야 했던 부분을 분리해서 기록합니다. 편한 자동화보다 마지막 검수 기준을 더 중요하게 봅니다.",
    kept: "대표 글은 어떤 작업을 맡겼는지, 어디서 판단이 흐려졌는지, 최종적으로 사람이 확인한 계약과 화면 기준이 무엇인지 드러내야 합니다.",
    archived: "도구 피로감, 짧은 사용 소감, 아직 검증되지 않은 프롬프트 조각은 대표 글로 올리지 않고 더 긴 경험담이나 체크리스트에 흡수합니다.",
  },
  development: {
    focus: "개발 분류는 정적 라우트, 콘텐츠 등록, Play 엔진, 배포 검증처럼 실제로 만진 표면이 남아 있는 글을 대표로 둡니다. 구현 전 상상보다 구현 후에 깨진 지점을 더 신뢰합니다.",
    kept: "대표 글은 파일 구조, 데이터 흐름, QA hook, sitemap/feed 같은 운영 결과까지 연결되어야 합니다. 그래서 짧은 작업 메모는 Play별 build log로 합칩니다.",
    archived: "한 기능의 작은 hover, cue, drag 수정처럼 단독 글로는 얇은 기록은 직접 노출하지 않고, 해당 게임의 제작 로그에서 흐름으로 읽히게 정리합니다.",
  },
  operations: {
    focus: "운영 기록 분류는 Search Console, sitemap, canonical, feed, 배포 상태처럼 재미없지만 사이트 신뢰를 흔드는 항목을 남깁니다. 숫자와 확인 시점을 숨기지 않는 글을 우선합니다.",
    kept: "대표 글은 무엇을 제출했는지, 어떤 화면에서 확인했는지, 아직 증거가 아닌 부분이 무엇인지 분리해야 합니다. 재심사나 재제출 전 확인 순서를 남기는 글도 여기에 둡니다.",
    archived: "기다리는 동안의 짧은 상태 메모나 같은 오류를 반복해서 본 기록은 공개 목록에 계속 쌓지 않고, 관찰 로그나 대표 운영 글에 합칩니다.",
  },
  info: {
    focus: "정보 분류는 가격, 일정, 자격, 할인처럼 시간이 지나면 달라지는 항목을 기준일과 표로 먼저 보여주는 글만 대표로 둡니다. 읽기 전에 복사해갈 비교 기준이 보여야 합니다.",
    kept: "대표 글은 공식 페이지 확인 지점, 헷갈리는 선택지, 먼저 눌러봐야 할 화면을 분명히 적어야 합니다. 날짜가 지난 뒤에도 무엇을 다시 확인해야 하는지 남깁니다.",
    archived: "근거가 약하거나 날짜가 없는 생활 정보, 표 없이 말로만 정리한 조각, 같은 질문을 반복한 글은 제출 표면에서 빼고 다음 업데이트 때 합칩니다.",
  },
} as const;

type BlogCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  const posts = getIndexableBlogPosts();

  return blogCategoryDefinitions
    .filter((category) => posts.some((post) => post.category === category.label))
    .map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);
  if (!category) return {};

  const url = `https://www.bobob.app${blogCategoryPath(category.slug)}`;
  const posts = getIndexableBlogPosts().filter((post) => post.category === category.label);
  const image = openGraphImage({ kind: "category", title: `${category.label} 글 모음` });
  return {
    title: `${category.label} - bobob.app Blog`,
    description: category.description,
    keywords: blogIndexKeywords(posts),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "bobob.app",
      title: `${category.label} - bobob.app Blog`,
      description: category.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.label} - bobob.app Blog`,
      description: category.description,
      images: [shareImageUrl({ kind: "category", title: `${category.label} 글 모음` })],
    },
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);
  if (!category) notFound();

  const posts = getIndexableBlogPosts().filter((post) => post.category === category.label);
  if (!posts.length) notFound();

  const dictionary = getClientDictionary(contentLocale);
  const jsonLd = blogCategoryStructuredData({ category, posts });
  const reviewNote = categoryReviewNotes[category.slug as keyof typeof categoryReviewNotes];

  return (
    <main className="min-h-screen bg-background" lang={contentLocale} dir={dictionary.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentNav dictionary={dictionary} />
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Badge>Blog 분류</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal">{category.label}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{category.description}</p>
          <div className="mt-5 max-w-3xl rounded-md border bg-background p-4 text-sm leading-7 text-muted-foreground" data-blog-category-context>
            <h2 className="text-base font-semibold tracking-normal text-foreground">이 분류에서 보는 것</h2>
            <p className="mt-2">
              이 페이지는 같은 결의 대표 글만 모아둔 작은 묶음입니다. 짧은 제작 메모를 전부 펼쳐두기보다, 만들다가 막힌 순간, 방향을 바꾼 이유, 다음에 다시 확인할 기준이
              분명한 글을 먼저 보여줍니다. 필요한 짧은 기록은 Play 제작 로그 안에서 이어 보게 정리합니다.
            </p>
            <p className="mt-3">
              현재 이 분류에서 제출 표면에 남긴 대표 글은 {posts.length}개입니다. 글 수를 억지로 늘리기보다, 목록에서 바로 열었을 때 날짜, 판단 근거, 다음 행동이 읽히는
              글만 남기는 방식으로 관리합니다.
            </p>
            <p className="mt-3">{reviewNote.focus}</p>
            <ul className="mt-3 space-y-2">
              <li>- 남기는 기준: {reviewNote.kept}</li>
              <li>- 보관하는 기준: {reviewNote.archived}</li>
            </ul>
            <p className="mt-3">
              다음 업데이트에서는 이 분류의 새 글을 바로 늘리지 않고, 이미 남긴 대표 글이 실제 검색 질문과 Play 이동을 설명하는지 먼저 봅니다. 같은 말을 반복하는 글은 새
              URL로 만들지 않고 기존 대표 글의 표, 체크리스트, 제작 로그에 합쳐서 읽는 시간을 아끼는 쪽을 선택합니다.
            </p>
          </div>
          <Link href="/blog" className="mt-6 inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            전체 글 보기
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8" data-blog-category-page={category.slug}>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => {
            const relatedPlay = post.relatedPlaySlugs[0] ? getPlayContentBySlug(post.relatedPlaySlugs[0]) : undefined;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge>{post.category}</Badge>
                      <Badge>{post.readingMinutes}분 읽기</Badge>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="border-t pt-4 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="inline-flex items-center gap-2">
                        <Newspaper className="h-4 w-4" />
                        {post.date}
                      </p>
                      {relatedPlay ? (
                        <span className="inline-flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-foreground">
                          바로 해보기: {relatedPlay.title}
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </span>
                      ) : null}
                    </div>
                    {!relatedPlay ? <p className="mt-3 leading-6">글만 남긴 기록입니다.</p> : null}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
