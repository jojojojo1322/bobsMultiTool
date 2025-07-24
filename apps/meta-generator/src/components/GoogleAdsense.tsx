'use client';

import Script from 'next/script';
import { ADSENSE_PUBLISHER_ID, ENABLE_AUTO_ADS } from '@/lib/config';

export default function GoogleAdsense() {
  // AdSense Publisher ID가 없거나 Auto Ads가 비활성화된 경우 렌더링하지 않음
  if (!ADSENSE_PUBLISHER_ID || !ENABLE_AUTO_ADS) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
} 