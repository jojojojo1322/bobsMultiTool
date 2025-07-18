'use client';

import Script from 'next/script';

interface GoogleAdsenseProps {
  publisherId?: string;
}

export default function GoogleAdsense({ publisherId = "ca-pub-XXXXXXXXXX" }: GoogleAdsenseProps) {
  // 애드센스 미승인 상태에서는 로드하지 않음
  if (publisherId === "ca-pub-XXXXXXXXXX") {
    console.log('Google AdSense not configured - awaiting approval');
    return null;
  }

  return (
    <>
      <Script
        id="google-adsense-auto"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        id="google-adsense-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${publisherId}",
              enable_page_level_ads: true,
              overlays: {bottom: true}
            });
          `
        }}
      />
    </>
  );
} 