import Script from 'next/script';
import { adsConfig } from '@/lib/config';

interface GoogleAdsenseProps {
  publisherId?: string;
}

export default function GoogleAdsense({ 
  publisherId = adsConfig.adsensePublisherId 
}: GoogleAdsenseProps) {
  if (!adsConfig.enableAutoAds || publisherId === 'ca-pub-XXXXXXXXXX') {
    if (adsConfig.debugMode) {
      console.log('Google AdSense disabled or not configured');
    }
    return null;
  }

  return (
    <>
      <Script
        id="google-adsense-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      />
      
      <Script
        id="google-adsense-config"
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