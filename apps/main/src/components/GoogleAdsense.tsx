'use client';

import * as React from 'react';
import Script from 'next/script';

interface GoogleAdsenseProps {
  enabled?: boolean;
  publisherId?: string;
}

interface GoogleAdUnitProps extends GoogleAdsenseProps {
  slot?: string;
  position: string;
  className?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  fullWidthResponsive?: boolean;
  minHeight?: number;
}

function isValidPublisherId(publisherId?: string) {
  return Boolean(publisherId && /^ca-pub-\d+$/.test(publisherId));
}

function isValidAdSlot(slot?: string) {
  return Boolean(slot && /^\d+$/.test(slot));
}

export function GoogleAdUnit({
  enabled = false,
  publisherId,
  slot,
  position,
  className,
  format = 'auto',
  fullWidthResponsive = true,
  minHeight = 90,
}: GoogleAdUnitProps) {
  const shouldRender = enabled && isValidPublisherId(publisherId) && isValidAdSlot(slot);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [readyToLoad, setReadyToLoad] = React.useState(false);

  React.useEffect(() => {
    if (!shouldRender) {
      setReadyToLoad(false);
      return;
    }
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setReadyToLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReadyToLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '640px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldRender]);

  React.useEffect(() => {
    if (!shouldRender || !readyToLoad) return;
    try {
      const win = window as unknown as { adsbygoogle?: unknown[] };
      win.adsbygoogle = win.adsbygoogle ?? [];
      win.adsbygoogle.push({});
    } catch {
      // The ad script can be blocked by extensions or privacy tools; the page must keep working.
    }
  }, [shouldRender, readyToLoad, publisherId, slot]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div ref={containerRef} className={className} data-bobob-ad-slot={position} data-bobob-ad-loading={readyToLoad ? 'ready' : 'deferred'} style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

export default function GoogleAdsense({ enabled = false, publisherId }: GoogleAdsenseProps) {
  if (!enabled || !isValidPublisherId(publisherId)) {
    return null;
  }

  return (
    <Script
      id="google-adsense-auto"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
} 
