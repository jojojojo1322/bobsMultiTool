'use client';

import Script from 'next/script';

interface GoogleAdsenseProps {
  publisherId?: string;
}

export default function GoogleAdsense({ publisherId }: GoogleAdsenseProps) {
  if (!publisherId || !/^ca-pub-\d+$/.test(publisherId)) {
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
