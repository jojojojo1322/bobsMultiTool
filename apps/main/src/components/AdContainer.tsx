'use client';

interface AdContainerProps {
  slot?: string;
  size?: 'banner' | 'leaderboard' | 'sidebar' | 'large-rectangle' | 'square';
  className?: string;
  isPreview?: boolean;
}

const AD_SIZES = {
  banner: { width: '320px', height: '100px' },
  leaderboard: { width: '728px', height: '90px' },
  sidebar: { width: '300px', height: '600px' },
  'large-rectangle': { width: '336px', height: '280px' },
  square: { width: '250px', height: '250px' },
};

export default function AdContainer({ 
  slot = '', 
  size = 'banner', 
  className = '',
  isPreview = false 
}: AdContainerProps) {
  const adSize = AD_SIZES[size];
  
  if (isPreview) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ 
          width: adSize.width, 
          height: adSize.height,
          maxWidth: '100%'
        }}
      >
        <div className="text-center p-4">
          <div className="text-gray-500 text-sm font-medium">Advertisement Space</div>
          <div className="text-gray-400 text-xs mt-1">{size} - {adSize.width} × {adSize.height}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={{ width: adSize.width, height: adSize.height, maxWidth: '100%' }}>
      {/* Google AdSense 코드가 여기에 들어갑니다 */}
      <ins 
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: adSize.width,
          height: adSize.height 
        }}
        data-ad-client="ca-pub-YOUR_ACTUAL_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
    </div>
  );
} 