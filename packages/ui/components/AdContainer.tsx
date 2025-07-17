'use client';

import { useEffect, useRef } from 'react';
import { adsConfig } from '../lib/config';

export type AdSize = 'banner' | 'leaderboard' | 'sidebar' | 'large-rectangle' | 'square' | 'responsive';

interface AdContainerProps {
  slot?: string;
  size?: AdSize;
  className?: string;
  isPreview?: boolean;
  publisherId?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

// 광고 크기별 설정 - 구글 애드센스 표준 사이즈
const AD_SIZES = {
  banner: { width: '320px', height: '100px', displaySize: '320x100' },
  leaderboard: { width: '728px', height: '90px', displaySize: '728x90' },
  sidebar: { width: '300px', height: '600px', displaySize: '300x600' },
  'large-rectangle': { width: '336px', height: '280px', displaySize: '336x280' },
  square: { width: '250px', height: '250px', displaySize: '250x250' },
  responsive: { width: '100%', height: 'auto', displaySize: 'responsive' },
};

export default function AdContainer({ 
  slot = '', 
  size = 'banner', 
  className = '',
  isPreview = false,
  publisherId = adsConfig.publisherId,
  format = 'auto'
}: AdContainerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adSize = AD_SIZES[size];
  
  // 실제 광고를 표시할지 결정
  const shouldShowRealAd = !isPreview && 
    publisherId && 
    publisherId !== 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID' && 
    adsConfig.appEnv === 'production';

  useEffect(() => {
    if (shouldShowRealAd && adRef.current && window.adsbygoogle) {
      try {
        // 광고 초기화
        (window.adsbygoogle as Record<string, unknown>[]).push({});
        
        // 분석 도구로 광고 노출 추적
        if (window.gtag) {
          window.gtag('event', 'ad_impression', {
            ad_unit_slot: slot,
            ad_size: size,
            event_category: 'advertising'
          });
        }
        
        if (adsConfig.debugMode) {
          console.log(`💰 광고 초기화: ${slot} (${size})`);
        }
      } catch (error) {
        if (adsConfig.debugMode) {
          console.error('광고 초기화 오류:', error);
        }
      }
    }
  }, [shouldShowRealAd, slot, size]);

  // 미리보기 모드 또는 개발 환경
  if (isPreview || !shouldShowRealAd) {
    return (
      <div 
        className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center ${className} hover:border-blue-300 transition-all duration-200`}
        style={{ 
          width: adSize.width, 
          height: adSize.height,
          maxWidth: '100%',
          minHeight: size === 'responsive' ? '120px' : adSize.height
        }}
      >
        <div className="text-center p-4">
          <div className="text-blue-600 text-sm font-medium mb-2">
            💡 광고 영역
          </div>
          <div className="text-blue-500 text-xs font-mono">
            {size === 'responsive' ? '반응형' : adSize.displaySize}
          </div>
          {slot && (
            <div className="text-blue-400 text-xs mt-1 opacity-75">
              슬롯: {slot}
            </div>
          )}
          {!shouldShowRealAd && (
            <div className="text-orange-500 text-xs mt-2 px-2 py-1 bg-orange-50 rounded">
              개발 모드
            </div>
          )}
        </div>
      </div>
    );
  }

  // 실제 애드센스 광고 렌더링
  const isResponsive = size === 'responsive';
  
  return (
    <div 
      ref={adRef}
      className={`ad-container ${className}`} 
      style={{ 
        width: adSize.width, 
        height: isResponsive ? 'auto' : adSize.height, 
        maxWidth: '100%',
        minHeight: isResponsive ? '120px' : undefined
      }}
    >
      <ins 
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: isResponsive ? '100%' : adSize.width,
          height: isResponsive ? 'auto' : adSize.height 
        }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={isResponsive ? 'auto' : format}
        data-full-width-responsive={adsConfig.adPlacement.manual.fullWidthResponsive ? 'true' : 'false'}
        data-ad-layout={isResponsive ? 'in-article' : undefined}
        data-ad-layout-key={isResponsive ? '-ef+6k-30-ac+ty' : undefined}
      />
    </div>
  );
}

// 편의성을 위한 사전 정의된 컴포넌트들
export function ResponsiveAdBanner({ 
  slot, 
  className = '',
  ...props 
}: Omit<AdContainerProps, 'size'>) {
  return (
    <AdContainer 
      size="responsive" 
      slot={slot}
      className={`w-full ${className}`}
      {...props}
    />
  );
}

export function MobileAdBanner({ 
  slot, 
  className = '',
  ...props 
}: Omit<AdContainerProps, 'size'>) {
  return (
    <div className="md:hidden">
      <AdContainer 
        size="banner" 
        slot={slot}
        className={`mx-auto ${className}`}
        {...props}
      />
    </div>
  );
}

export function DesktopAdLeaderboard({ 
  slot, 
  className = '',
  ...props 
}: Omit<AdContainerProps, 'size'>) {
  return (
    <div className="hidden md:block">
      <AdContainer 
        size="leaderboard" 
        slot={slot}
        className={`mx-auto ${className}`}
        {...props}
      />
    </div>
  );
}

// 타입 정의
declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
} 