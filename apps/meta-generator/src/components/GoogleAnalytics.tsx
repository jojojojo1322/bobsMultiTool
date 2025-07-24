'use client';

import Script from 'next/script';
import { GA4_MEASUREMENT_ID, ENABLE_ANALYTICS } from '@/lib/config';

export default function GoogleAnalytics() {
  // GA4 ID가 없거나 분석이 비활성화된 경우 렌더링하지 않음
  if (!GA4_MEASUREMENT_ID || !ENABLE_ANALYTICS) {
    return null;
  }

  return (
    <>
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${GA4_MEASUREMENT_ID}', {
            // 크로스 도메인 추적 설정
            linker: {
              domains: ['bobob.app', 'iframe.bobob.app', 'regax.bobob.app', 'lorem.bobob.app', 'cron.bobob.app', 'meta.bobob.app']
            },
            // 쿠키 설정
            cookie_domain: '.bobob.app',
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
} 