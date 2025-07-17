'use client';

import { useState, useCallback, useEffect } from 'react';
import { DeviceType, DEVICE_CONFIGS } from '@/types';
import { TranslationKey } from '@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

export default function IframeViewer() {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>('https://www.example.com');
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.example.com'); // 실제 iframe에 표시되는 URL
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('Desktop');
  const [customWidth, setCustomWidth] = useState<number>(800);
  const [customHeight, setCustomHeight] = useState<number>(600);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [forceZoom, setForceZoom] = useState<boolean>(false); // 자동 조정 무시 플래그
  const [windowSize, setWindowSize] = useState<{width: number; height: number}>({
    width: 1920, // 기본값
    height: 1080
  });
  const [isClient, setIsClient] = useState<boolean>(false);

  // 클라이언트에서만 실행되는 효과
  useEffect(() => {
    setIsClient(true);
    
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // URL 정규화 함수
  const normalizeUrl = useCallback((inputUrl: string): string => {
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) return 'https://www.example.com';
    
    // 이미 프로토콜이 있으면 그대로 반환
    if (/^https?:\/\//i.test(trimmedUrl)) {
      return trimmedUrl;
    }
    
    // localhost, IP 주소, 포트가 포함된 경우는 http 사용
    if (/^(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+|.*:\d+)/i.test(trimmedUrl)) {
      return `http://${trimmedUrl}`;
    }
    
    // www로 시작하는 경우 https만 추가
    if (/^www\./i.test(trimmedUrl)) {
      return `https://${trimmedUrl}`;
    }
    
    // 일반 도메인의 경우 https://www. 추가
    return `https://www.${trimmedUrl}`;
  }, []);

  // URL 변경 핸들러
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setIframeError(false);
  };

  // 엔터키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoadUrl();
    }
  };

  // iframe 로드 핸들러
  const handleIframeLoad = () => {
    setIsLoading(false);
    setIframeError(false);
  };

  // iframe 에러 핸들러
  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
  };

  // URL 로드 핸들러 - 실제로 iframe src를 업데이트
  const handleLoadUrl = () => {
    const normalizedUrl = normalizeUrl(url);
    setIsLoading(true);
    setIframeError(false);
    setCurrentUrl(normalizedUrl); // 실제 iframe src 업데이트
  };

  // 커스텀 크기 업데이트 핸들러
  const handleCustomSizeChange = (width: number, height: number) => {
    setCustomWidth(width);
    setCustomHeight(height);
    // Custom 디바이스 설정도 업데이트
    DEVICE_CONFIGS.Custom.width = width;
    DEVICE_CONFIGS.Custom.height = height;
  };

  // 줌 레벨 변경 핸들러
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    setForceZoom(true); // 강제 줌 활성화
  };

  // 디바이스 변경 시 강제 줌 해제
  const handleDeviceChange = (deviceType: DeviceType) => {
    setSelectedDevice(deviceType);
    setForceZoom(false); // 디바이스 변경 시 자동 조정 다시 활성화
  };

  // iframe 코드 생성 함수들
  const generateBasicIframe = () => {
    return `<iframe src="${currentUrl}" width="${currentDevice.width}" height="${currentDevice.height}" frameborder="0"></iframe>`;
  };

  const generateResponsiveIframe = () => {
    return `<div style="position: relative; width: 100%; max-width: ${currentDevice.width}px; aspect-ratio: ${currentDevice.width}/${currentDevice.height};">
  <iframe 
    src="${currentUrl}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    frameborder="0">
  </iframe>
</div>`;
  };

  const generateInlineStyleIframe = () => {
    return `<iframe 
  src="${currentUrl}"
  style="width: ${currentDevice.width}px; height: ${currentDevice.height}px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  frameborder="0">
</iframe>`;
  };

  const generateCSSClassIframe = () => {
    return `<!-- CSS (add to your stylesheet) -->
<style>
.iframe-viewer {
  width: ${currentDevice.width}px;
  height: ${currentDevice.height}px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>

<!-- HTML -->
<iframe src="${currentUrl}" class="iframe-viewer" frameborder="0"></iframe>`;
  };

  // 클립보드에 복사
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t('copySuccess'));
    } catch (err) {
      console.error('복사 실패:', err);
      alert(t('copyFailed'));
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowCodeModal(false);
  };

  // Esc키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCodeModal) {
        closeModal();
      }
    };

    if (showCodeModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCodeModal]);

  const currentDevice = selectedDevice === 'Custom' 
    ? { ...DEVICE_CONFIGS.Custom, width: customWidth, height: customHeight }
    : DEVICE_CONFIGS[selectedDevice];

  // 화면 크기에 맞는 자동 zoom 계산
  const getOptimalZoom = () => {
    if (!isClient) return zoomLevel; // 클라이언트가 아닐 때는 기본 zoom 반환
    
    const maxWidth = windowSize.width - 100; // 여백 고려
    const maxHeight = windowSize.height - 400; // 헤더와 컨트롤 패널 공간 고려
    
    const widthScale = maxWidth / (currentDevice.width + 40);
    const heightScale = maxHeight / (currentDevice.height + 40);
    
    const autoScale = Math.min(widthScale, heightScale, 1) * 100;
    
    // 강제 줌이 활성화되었거나 자동 계산된 zoom이 사용자 설정보다 크면 사용자 설정 사용
    if (forceZoom || autoScale >= zoomLevel) {
      return zoomLevel;
    }
    
    return autoScale;
  };

  const effectiveZoom = getOptimalZoom();
  const isAutoAdjusted = isClient && !forceZoom && effectiveZoom < zoomLevel;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('toolTitle')}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {t('toolSubtitle')}
          </p>
          
          {/* 언어 선택 버튼 - 오른쪽 상단 */}
          <div className="absolute top-0 right-0">
            <LanguageSelector />
          </div>
        </div>

        {/* 컨트롤 패널 - 항상 위에 표시 */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8 sm:mb-12">
          {/* URL 입력 */}
          <div className="mb-6 sm:mb-8">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              {t('urlLabel')}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={handleUrlChange}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder={t('urlPlaceholder')}
              />
              <button
                onClick={handleLoadUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
              >
                {t('loadButton')}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('urlHint')}
            </p>
          </div>

          {/* 반응형 그리드 레이아웃 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* 왼쪽 컬럼: 디바이스 선택 */}
            <div className="space-y-6">
              {/* 디바이스 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Device Size
                </label>
                
                {/* 모바일 디바이스 */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">{t('mobileCategory')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(['iPhone_15', 'iPhone_SE', 'Galaxy_S24'] as DeviceType[]).map((deviceType) => {
                      const device = DEVICE_CONFIGS[deviceType];
                      const isSelected = selectedDevice === deviceType;
                      
                      return (
                        <button
                          key={deviceType}
                          onClick={() => handleDeviceChange(deviceType)}
                          className={`px-2 sm:px-3 py-2 rounded-md border-2 transition-all duration-200 text-xs sm:text-sm ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-1">{device.icon}</span>
                          <span className="hidden sm:inline">{t(`device.${deviceType}` as TranslationKey)}</span>
                          <span className="sm:hidden">{device.name.split(' ')[0]}</span>
                          <span className="ml-1 text-xs opacity-75">
                            {device.width}×{device.height}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 태블릿 디바이스 */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">{t('tabletCategory')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(['iPad', 'iPad_Pro'] as DeviceType[]).map((deviceType) => {
                      const device = DEVICE_CONFIGS[deviceType];
                      const isSelected = selectedDevice === deviceType;
                      
                      return (
                        <button
                          key={deviceType}
                          onClick={() => handleDeviceChange(deviceType)}
                          className={`px-2 sm:px-3 py-2 rounded-md border-2 transition-all duration-200 text-xs sm:text-sm ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-1">{device.icon}</span>
                          {t(`device.${deviceType}` as TranslationKey)}
                          <span className="ml-1 text-xs opacity-75">
                            {device.width}×{device.height}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 데스크톱 디바이스 */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">{t('desktopCategory')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(['Laptop', 'Desktop', 'Desktop_4K'] as DeviceType[]).map((deviceType) => {
                      const device = DEVICE_CONFIGS[deviceType];
                      const isSelected = selectedDevice === deviceType;
                      
                      return (
                        <button
                          key={deviceType}
                          onClick={() => handleDeviceChange(deviceType)}
                          className={`px-2 sm:px-3 py-2 rounded-md border-2 transition-all duration-200 text-xs sm:text-sm ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-1">{device.icon}</span>
                          <span className="hidden sm:inline">{t(`device.${deviceType}` as TranslationKey)}</span>
                          <span className="sm:hidden">{device.name.split(' ')[0]}</span>
                          <span className="ml-1 text-xs opacity-75">
                            {device.width}×{device.height}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 커스텀 크기 */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">{t('customCategory')}</h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => handleDeviceChange('Custom')}
                      className={`px-2 sm:px-3 py-2 rounded-md border-2 transition-all duration-200 text-xs sm:text-sm ${
                        selectedDevice === 'Custom'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-1">⚙️</span>
                      {t('device.Custom' as TranslationKey)}
                      <span className="ml-1 text-xs opacity-75">
                        {customWidth}×{customHeight}
                      </span>
                    </button>
                    
                    {selectedDevice === 'Custom' && (
                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2">
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => handleCustomSizeChange(Number(e.target.value), customHeight)}
                          className="w-16 sm:w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Width"
                          min="100"
                          max="5000"
                        />
                        <span className="text-gray-400">×</span>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => handleCustomSizeChange(customWidth, Number(e.target.value))}
                          className="w-16 sm:w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Height"
                          min="100"
                          max="5000"
                        />
                        <span className="text-xs text-gray-500">px</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 컬럼: 설정 및 줌 */}
            <div className="space-y-6">
              {/* 배율 조절 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🔍 Zoom Level: {zoomLevel}%
                  {isAutoAdjusted && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({t('autoAdjusted')}: {Math.round(effectiveZoom)}%)
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[80, 90, 100, 110, 120].map((zoom) => (
                    <button
                      key={zoom}
                      onClick={() => handleZoomChange(zoom)}
                      className={`px-3 py-1 text-sm rounded-md border transition-all duration-200 ${
                        !isAutoAdjusted && zoomLevel === zoom
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {zoom}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 현재 설정 표시 */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="text-sm text-gray-600">
                    <strong>{t('currentSettings')}</strong><br className="sm:hidden" />
                    <span className="sm:ml-1">{currentDevice.name} ({currentDevice.width}×{currentDevice.height}px)</span><br className="sm:hidden" />
                    <span className="sm:ml-1 text-xs sm:text-sm">{currentUrl}</span>
                  </div>
                  <button
                    onClick={() => setShowCodeModal(true)}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                  >
                    {t('exportCodeButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iframe 미리보기 영역 */}
        <div className="flex justify-center">
          <div className="relative">
            {/* 디바이스 프레임 */}
            <div 
              className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mx-auto"
              style={{
                width: (currentDevice.width * effectiveZoom / 100) + 40,
                height: (currentDevice.height * effectiveZoom / 100) + 40,
                padding: '20px'
              }}
            >
              {/* 로딩 상태 */}
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600">{t('loading')}</p>
                  </div>
                </div>
              )}

              {/* 에러 상태 */}
              {iframeError && (
                <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                  <div className="text-center p-4">
                    <div className="text-red-600 text-4xl mb-2">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">
                      {t('loadingFailed')}
                    </h3>
                    <p className="text-red-600 text-sm mb-2">
                      {t('loadingFailedMessage')}
                    </p>
                    <p className="text-red-500 text-xs">
                      {t('corsMessage')}
                    </p>
                    <button
                      onClick={handleLoadUrl}
                      className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      {t('retryButton')}
                    </button>
                  </div>
                </div>
              )}

              {/* iframe */}
              <iframe
                key={currentUrl} // URL이 변경될 때 iframe을 강제로 다시 렌더링
                src={currentUrl}
                width={currentDevice.width}
                height={currentDevice.height}
                className="border-0 bg-white"
                style={{
                  transform: `scale(${effectiveZoom / 100})`,
                  transformOrigin: 'top left',
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`${t(`device.${selectedDevice}` as TranslationKey)} Preview`}
              />
            </div>
            
            {/* 디바이스 라벨 */}
            <div className="absolute -top-6 sm:-top-8 left-0 text-xs sm:text-sm text-gray-600 font-medium">
              {currentDevice.icon} {currentDevice.name} - {currentDevice.width}×{currentDevice.height}px
            </div>
          </div>
        </div>

        {/* iframe 코드 추출 모달 */}
        {showCodeModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('exportCodeTitle')}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {t('exportCodeDescription')}
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  
                  {/* 기본 iframe */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">{t('basicIframe')}</h3>
                      <button
                        onClick={() => copyToClipboard(generateBasicIframe())}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        {t('copyButton')}
                      </button>
                    </div>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <code className="text-gray-900">{generateBasicIframe()}</code>
                    </pre>
                  </div>

                  {/* 반응형 iframe */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">{t('responsiveIframe')}</h3>
                      <button
                        onClick={() => copyToClipboard(generateResponsiveIframe())}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        {t('copyButton')}
                      </button>
                    </div>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <code className="text-gray-900">{generateResponsiveIframe()}</code>
                    </pre>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('responsiveDescription')}
                    </p>
                  </div>

                  {/* 인라인 스타일 iframe */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">{t('styledIframe')}</h3>
                      <button
                        onClick={() => copyToClipboard(generateInlineStyleIframe())}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        {t('copyButton')}
                      </button>
                    </div>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <code className="text-gray-900">{generateInlineStyleIframe()}</code>
                    </pre>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('styledDescription')}
                    </p>
                  </div>

                  {/* CSS 클래스 iframe */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">{t('cssClassIframe')}</h3>
                      <button
                        onClick={() => copyToClipboard(generateCSSClassIframe())}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        {t('copyButton')}
                      </button>
                    </div>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <code className="text-gray-900">{generateCSSClassIframe()}</code>
                    </pre>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('cssClassDescription')}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 