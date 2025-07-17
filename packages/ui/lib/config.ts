// 광고 및 분석 설정 - 프로덕션 환경에서 사용
export const adsConfig = {
  // 실제 구글 애드센스 설정
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-2620992505263949',
  
  // 구글 애널리틱스 4 설정
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  
  // 기능 토글
  enableAutoAds: process.env.NEXT_PUBLIC_ENABLE_AUTO_ADS !== 'false', // 기본값: true
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
  debugMode: process.env.NODE_ENV === 'development',
  
  // 앱 환경
  appEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // 광고 배치 세부 설정
  adPlacement: {
    // 자동 광고 옵션 - 수익 최적화를 위한 설정
    autoAds: {
      pageLevel: true,
      anchor: true,      // 하단 고정 광고 (모바일에서 효과적)
      multiplex: true,   // 추천 콘텐츠 광고
      vignette: true,    // 전면 광고 (페이지 이동 시)
      inFeed: true,      // 피드 내 광고
      inArticle: true    // 기사 내 광고
    },
    
    // 수동 광고 옵션
    manual: {
      responsive: true,
      fullWidthResponsive: true,
      format: 'auto'
    }
  }
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
  }
}; 