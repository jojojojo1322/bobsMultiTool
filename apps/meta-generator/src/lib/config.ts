// Google Analytics 4 설정
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';

// Google AdSense 설정
export const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-2620992505263949';

// 기능 토글
export const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false';
export const ENABLE_AUTO_ADS = process.env.NEXT_PUBLIC_ENABLE_AUTO_ADS !== 'false';

// 앱 URL
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://meta.bobob.app'; 