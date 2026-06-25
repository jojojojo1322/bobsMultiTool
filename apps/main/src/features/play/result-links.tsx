import Link from "next/link";

export type PlayResultLink = {
  slug: string;
  title: string;
  description?: string;
};

export function PlayResultLinks({
  relatedBlogLinks,
  relatedPlayLinks,
}: {
  relatedBlogLinks: PlayResultLink[];
  relatedPlayLinks: PlayResultLink[];
}) {
  return (
    <div className="mt-6 rounded-md border bg-muted/20 p-3" data-play-result-links>
      <p className="text-sm font-medium">다음에 이어서 보기</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {relatedPlayLinks.slice(0, 2).map((play) => (
          <Link key={play.slug} href={`/play/${play.slug}`} className="rounded-md border bg-background p-3 text-sm hover:bg-muted" data-play-related-play>
            <span className="block font-medium">{play.title}</span>
            {play.description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{play.description}</span> : null}
          </Link>
        ))}
        {relatedBlogLinks.slice(0, 2).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-md border bg-background p-3 text-sm hover:bg-muted" data-play-related-blog>
            <span className="block font-medium">{post.title}</span>
            {post.description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{post.description}</span> : null}
          </Link>
        ))}
        <Link href="/play" className="rounded-md border bg-background p-3 text-sm hover:bg-muted">
          다른 Play 콘텐츠 보기
        </Link>
      </div>
    </div>
  );
}
