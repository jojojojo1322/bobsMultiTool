'use client';

import Script from 'next/script';

interface GoogleAdsenseProps {
  publisherId?: string;
}

export default function GoogleAdsense({ publisherId = "ca-pub-2620992505263949" }: GoogleAdsenseProps) {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script id="adsbygoogle-init" strategy="afterInteractive">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${publisherId}",
            enable_page_level_ads: true
          });
        `}
      </Script>
    </>
  );
} 