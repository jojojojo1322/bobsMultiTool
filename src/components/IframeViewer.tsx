'use client';

import { useState, useCallback } from 'react';
import { DeviceType, DEVICE_CONFIGS } from '@/types';

export default function IframeViewer() {
  const [url, setUrl] = useState<string>('https://example.com');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('Desktop');
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // URL 정규화 함수
  const normalizeUrl = useCallback((inputUrl: string): string => {
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) return 'https://example.com';
    
    // http 또는 https로 시작하지 않으면 http를 붙임
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      return `http://${trimmedUrl}`;
    }
    
    return trimmedUrl;
  }, []);

  // URL 변경 핸들러
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setIframeError(false);
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

  // URL 로드 핸들러
  const handleLoadUrl = () => {
    setIsLoading(true);
    setIframeError(false);
  };

  const normalizedUrl = normalizeUrl(url);
  const currentDevice = DEVICE_CONFIGS[selectedDevice];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📱 Iframe Viewer Tool
          </h1>
          <p className="text-gray-600">
            다양한 디바이스 크기로 웹사이트를 미리보기하세요
          </p>
        </div>

        {/* 컨트롤 패널 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* URL 입력 */}
          <div className="mb-10">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              웹사이트 URL
            </label>
            <div className="flex gap-2">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={handleUrlChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="https://example.com"
              />
              <button
                onClick={handleLoadUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                로드
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              http:// 또는 https://를 생략하면 자동으로 http://가 추가됩니다
            </p>
          </div>

          {/* 디바이스 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              디바이스 크기
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DEVICE_CONFIGS) as DeviceType[]).map((deviceType) => {
                const device = DEVICE_CONFIGS[deviceType];
                const isSelected = selectedDevice === deviceType;
                
                return (
                  <button
                    key={deviceType}
                    onClick={() => setSelectedDevice(deviceType)}
                    className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{device.icon}</span>
                    {device.name}
                    <span className="ml-2 text-xs opacity-75">
                      {device.width}×{device.height}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 현재 설정 표시 */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <strong>현재 설정:</strong> {currentDevice.name} ({currentDevice.width}×{currentDevice.height}px) - {normalizedUrl}
          </div>
        </div>

        {/* iframe 미리보기 영역 */}
        <div className="flex justify-center">
          <div className="relative">
            {/* 디바이스 프레임 */}
            <div 
              className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
              style={{
                width: currentDevice.width + 40,
                height: currentDevice.height + 40,
                padding: '20px'
              }}
            >
              {/* 로딩 상태 */}
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600">로딩 중...</p>
                  </div>
                </div>
              )}

              {/* 에러 상태 */}
              {iframeError && (
                <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                  <div className="text-center p-4">
                    <div className="text-red-600 text-4xl mb-2">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">
                      로딩 실패
                    </h3>
                    <p className="text-red-600 text-sm mb-2">
                      웹사이트를 불러올 수 없습니다.
                    </p>
                    <p className="text-red-500 text-xs">
                      CORS 정책 차단이나 잘못된 URL일 수 있습니다.
                    </p>
                    <button
                      onClick={handleLoadUrl}
                      className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {/* iframe */}
              <iframe
                src={normalizedUrl}
                width={currentDevice.width}
                height={currentDevice.height}
                className="border-0 bg-white"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`${currentDevice.name} 미리보기`}
              />
            </div>
            
            {/* 디바이스 라벨 */}
            <div className="absolute -top-8 left-0 text-sm text-gray-600 font-medium">
              {currentDevice.icon} {currentDevice.name} - {currentDevice.width}×{currentDevice.height}px
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 