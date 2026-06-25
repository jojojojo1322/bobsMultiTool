const siteUrl = "https://www.bobob.app";

type ShareImageKind = "home" | "blog" | "play" | "category";

export function shareImageUrl({ kind, title }: { kind: ShareImageKind; title: string }) {
  const params = new URLSearchParams({
    kind,
    title,
  });

  return `${siteUrl}/og-image?${params.toString()}`;
}

export function openGraphImage({ kind, title }: { kind: ShareImageKind; title: string }) {
  const url = shareImageUrl({ kind, title });

  return {
    url,
    width: 1200,
    height: 630,
    alt: `${title} - bobob.app`,
  };
}
