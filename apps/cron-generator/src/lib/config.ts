// Google Analytics & AdSense 설정
export const adsConfig = {
  // 환경변수에서 가져오기
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-Q48NBF1YD2',
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-2620992505263949',
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
  
  // 기능 토글
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
  enableAutoAds: process.env.NEXT_PUBLIC_ENABLE_AUTO_ADS !== 'false',
  
  // 앱별 URL
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://cron.bobob.app',
  
  // 디버그 모드
  debugMode: process.env.NODE_ENV === 'development',
};

// 각 앱별 광고 슬롯 ID (실제 애드센스에서 생성한 슬롯 ID로 교체 필요)
export const adSlots = {
  main: {
    header: 'main-header-banner',
    sidebar: 'main-sidebar-300x600', 
    content: 'main-content-responsive',
    footer: 'main-footer-leaderboard'
  },
  iframe: {
    header: 'iframe-header-banner',
    sidebar: 'iframe-sidebar-300x600',
    content: 'iframe-content-responsive', 
    footer: 'iframe-footer-leaderboard'
  },
  regax: {
    header: 'regax-header-banner',
    sidebar: 'regax-sidebar-300x600',
    content: 'regax-content-responsive',
    footer: 'regax-footer-leaderboard'
  },
  cron: {
    header: 'cron-header-banner',
    sidebar: 'cron-sidebar-300x600',
    content: 'cron-content-responsive',
    footer: 'cron-footer-leaderboard'
  }
}; 