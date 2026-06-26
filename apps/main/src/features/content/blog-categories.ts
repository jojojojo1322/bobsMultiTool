export type BlogCategoryDefinition = {
  slug: string;
  label: string;
  description: string;
};

export const blogCategoryDefinitions = [
  {
    slug: "diary",
    label: "일기",
    description: "방향을 바꾸거나 다시 작게 시작하면서 남긴 개인 기록입니다. 완성된 선언보다 그날의 흔들림과 판단을 남깁니다.",
  },
  {
    slug: "interests",
    label: "요즘 관심사",
    description: "작은 웹 놀이, 짧은 상호작용, 요즘 눈에 밟히는 웹 감각을 저장해두고 왜 다시 열어봤는지 적습니다.",
  },
  {
    slug: "ai",
    label: "AI",
    description: "AI 코딩 도구를 쓰며 빨라진 부분, 오히려 헷갈린 부분, 사람이 마지막에 다시 정해야 했던 기준을 적습니다.",
  },
  {
    slug: "development",
    label: "개발",
    description: "정적 배포, 데이터 구조, 라우트, 구현 범위를 실제로 만지며 정리한 개발 기록입니다. 작게 만들다 막힌 지점을 남깁니다.",
  },
  {
    slug: "operations",
    label: "운영 기록",
    description: "Search Console, sitemap, canonical, 배포처럼 재미없지만 계속 발목 잡는 운영 메모입니다.",
  },
  {
    slug: "info",
    label: "정보",
    description: "가격, 할인, 제품 선택처럼 날짜가 지나면 바로 달라질 수 있는 생활형 정보를 기준일과 함께 정리합니다.",
  },
] as const satisfies BlogCategoryDefinition[];

export function getBlogCategoryBySlug(slug: string) {
  return blogCategoryDefinitions.find((category) => category.slug === slug);
}

export function getBlogCategoryByLabel(label: string) {
  return blogCategoryDefinitions.find((category) => category.label === label);
}

export function blogCategoryPath(slug: string) {
  return `/blog/category/${slug}`;
}
