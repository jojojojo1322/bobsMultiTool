import type { BlogPost, PlayContent } from "./types";

const siteKeywords = ["bobob.app", "웹 운영 점검", "URL 상태 점검", "개발 기록", "AI 활용", "사이드프로젝트", "정적 웹", "작은 웹게임"];

const categoryKeywords: Record<string, string[]> = {
  일기: ["개발 일기", "작업 기록", "개인 프로젝트"],
  "요즘 관심사": ["작은 웹", "웹 놀이", "인터넷 문화"],
  AI: ["AI 코딩", "AI 도구", "프롬프트", "Cursor", "Codex"],
  개발: ["웹 개발", "정적 배포", "Vercel", "Next.js"],
  "운영 기록": ["Search Console", "sitemap", "canonical", "색인 기록"],
};

const playTypeKeywords: Record<PlayContent["type"], string[]> = {
  "micro-sim": ["선택형 시뮬레이션", "짧은 시뮬레이터"],
  "tap-game": ["탭 게임", "클릭 게임", "반응형 게임"],
  "sort-match-game": ["분류 게임", "매칭 게임", "과일상자류 게임"],
  "arcade-game": ["캔버스 게임", "키보드 게임", "아케이드 게임"],
};

function compactUnique(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export function playTypeLabel(type: PlayContent["type"]) {
  if (type === "micro-sim") return "짧은 시뮬레이션";
  if (type === "tap-game") return "탭 게임";
  if (type === "arcade-game") return "아케이드 게임";
  return "분류 게임";
}

export function blogPostKeywords(post: BlogPost, relatedPlays: PlayContent[] = []) {
  return compactUnique([
    "bobob.app",
    post.category,
    ...(categoryKeywords[post.category] ?? []),
    ...siteKeywords,
    post.title,
    post.slug,
    ...post.relatedPlaySlugs,
    ...relatedPlays.flatMap((play) => [play.title, play.slug, playTypeLabel(play.type), ...playTypeKeywords[play.type]]),
  ]).slice(0, 18);
}

export function playContentKeywords(content: PlayContent, relatedPosts: BlogPost[] = []) {
  return compactUnique([
    "bobob.app",
    "Play",
    "웹 게임",
    "모바일 웹 게임",
    content.title,
    content.slug,
    content.durationLabel,
    playTypeLabel(content.type),
    ...playTypeKeywords[content.type],
    ...siteKeywords,
    ...content.relatedBlogSlugs,
    ...content.relatedPlaySlugs,
    ...relatedPosts.flatMap((post) => [post.title, post.slug, post.category, ...(categoryKeywords[post.category] ?? [])]),
  ]).slice(0, 20);
}

export function blogIndexKeywords(posts: BlogPost[]) {
  return compactUnique([
    ...siteKeywords,
    "Blog",
    "개발 블로그",
    "AI 블로그",
    ...posts.map((post) => post.category),
    ...posts.flatMap((post) => categoryKeywords[post.category] ?? []),
  ]).slice(0, 18);
}

export function playIndexKeywords(contents: PlayContent[]) {
  return compactUnique([
    ...siteKeywords,
    "Play",
    "웹 게임",
    "모바일 게임",
    "정적 게임",
    ...contents.map((content) => playTypeLabel(content.type)),
    ...contents.flatMap((content) => playTypeKeywords[content.type]),
  ]).slice(0, 18);
}

export function homeContentKeywords(posts: BlogPost[], contents: PlayContent[]) {
  return compactUnique([
    ...blogIndexKeywords(posts),
    ...playIndexKeywords(contents),
    "redirect chain checker",
    "sitemap health check",
    "security headers checker",
    "개발자 도구 워크벤치",
    "Blog and Play",
  ]).slice(0, 22);
}
