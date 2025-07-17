'use client';

import Script from 'next/script';
import { adsConfig } from '../lib/config';

interface GoogleAdsenseProps {
  publisherId?: string;
  enableAutoAds?: boolean;
}

export default function GoogleAdsense({ 
  publisherId = adsConfig.publisherId,
  enableAutoAds = adsConfig.enableAutoAds
}: GoogleAdsenseProps) {
  // 개발 환경이거나 Publisher ID가 없으면 광고를 로드하지 않음
  if (!publisherId || publisherId === 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID') {
    if (adsConfig.debugMode) {
      console.warn('애드센스: Publisher ID가 설정되지 않았습니다.');
    }
    return null;
  }

  return (
    <>
      {/* 메인 애드센스 스크립트 로드 */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* 자동 광고 설정 (활성화된 경우) */}
      {enableAutoAds && (
        <Script id="adsbygoogle-auto-setup" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${publisherId}",
              enable_page_level_ads: true,
              overlays: {
                bottom: ${adsConfig.adPlacement.autoAds.anchor}
              },
              vignette: {
                load: ${adsConfig.adPlacement.autoAds.vignette}
              },
              auto_ad_placement: {
                anchor: ${adsConfig.adPlacement.autoAds.anchor},
                multiplex: ${adsConfig.adPlacement.autoAds.multiplex},
                in_feed: ${adsConfig.adPlacement.autoAds.inFeed},
                in_article: ${adsConfig.adPlacement.autoAds.inArticle}
              }
            });
          `}
        </Script>
      )}

      {/* 개발 환경에서의 디버깅 정보 */}
      {adsConfig.debugMode && (
        <Script id="adsense-debug-info" strategy="afterInteractive">
          {`
            console.log('🎯 애드센스 초기화됨:', {
              publisherId: "${publisherId}",
              autoAds: ${enableAutoAds},
              environment: "${adsConfig.appEnv}"
            });
            
            // 광고 로드 이벤트 추적
            window.addEventListener('load', function() {
              if (window.gtag) {
                gtag('event', 'adsense_loaded', {
                  publisher_id: "${publisherId}",
                  auto_ads_enabled: ${enableAutoAds}
                });
              }
            });
          `}
        </Script>
      )}
    </>
  );
} 