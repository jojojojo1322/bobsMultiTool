'use client';

import { TranslationProvider, useTranslation } from "@/contexts/TranslationContext";
import LanguageSelector from "@/components/LanguageSelector";
// import AdContainer from "@/components/AdContainer";
import Link from "next/link";

function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 광고 - 주석처리 */}
      {/*
      <div className="w-full bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center">
          <AdContainer size="leaderboard" slot="header-leaderboard" className="hidden md:block" isPreview={true} />
          <AdContainer size="banner" slot="header-mobile" className="md:hidden" isPreview={true} />
        </div>
      </div>
      */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 언어 선택기 */}
        <div className="mb-6 flex justify-end">
          <LanguageSelector />
        </div>
        
        {/* 메인 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('mainTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {t('mainSubtitle')}
          </p>
          <p className="text-lg text-gray-500">
            {t('mainDescription')}
          </p>
        </div>

        {/* 도구들 그리드 - 4개 도구 2x2 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Iframe Viewer */}
          <Link href="https://iframe.bobob.app" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 h-64 flex flex-col">
              <div className="text-4xl mb-4 text-blue-500">🖼️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                {t('iframeViewerTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {t('iframeViewerDescription')}
              </p>
              <div className="text-blue-500 text-sm font-medium group-hover:text-blue-700 mt-auto">
                {t('useToolButton')} →
              </div>
            </div>
          </Link>

          {/* RegEx Tester */}
          <Link href="https://regax.bobob.app" className="group" target="_blank">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-green-300 h-64 flex flex-col">
              <div className="text-4xl mb-4 text-green-500">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                {t('regaxTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {t('regaxToolDescription')}
              </p>
              <div className="text-green-500 text-sm font-medium group-hover:text-green-700 mt-auto">
                {t('useToolButton')} →
              </div>
            </div>
          </Link>

          {/* Lorem Ipsum Generator */}
          <Link href={process.env.NODE_ENV === 'development' ? "http://localhost:3003" : "https://lorem.bobob.app"} className="group" target="_blank">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-orange-300 h-64 flex flex-col">
              <div className="text-4xl mb-4 text-orange-500">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600">
                {t('loremGeneratorTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {t('loremGeneratorDescription')}
              </p>
              <div className="text-orange-500 text-sm font-medium group-hover:text-orange-700 mt-auto">
                {t('useToolButton')} →
              </div>
            </div>
          </Link>

          {/* Cron Expression Generator */}
          <Link href={process.env.NODE_ENV === 'development' ? "http://localhost:3004" : "https://cron.bobob.app"} className="group" target="_blank">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 h-64 flex flex-col">
              <div className="text-4xl mb-4 text-blue-500">⏰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                {t('cronGeneratorTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {t('cronGeneratorDescription')}
              </p>
              <div className="text-blue-500 text-sm font-medium group-hover:text-blue-700 mt-auto">
                {t('useToolButton')} →
              </div>
            </div>
          </Link>

          {/* Meta Tag Generator */}
          <Link href={process.env.NODE_ENV === 'development' ? "http://localhost:3005" : "https://meta.bobob.app"} className="group" target="_blank">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-purple-300 h-64 flex flex-col">
              <div className="text-4xl mb-4 text-purple-500">🏷️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                {t('metaGeneratorTitle')}
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {t('metaGeneratorDescription')}
              </p>
              <div className="text-purple-500 text-sm font-medium group-hover:text-purple-700 mt-auto">
                {t('useToolButton')} →
              </div>
            </div>
          </Link>


        </div>
        
        {/* 콘텐츠 중간 광고 - 주석처리 */}
        {/*
        <div className="flex justify-center mb-8">
          <AdContainer size="large-rectangle" slot="content-responsive" className="max-w-4xl" isPreview={true} />
        </div>
        */}

        {/* 사용법 설명 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('ctaTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                {t('toolsTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('ctaDescription')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                {t('fastAndEasyTitle')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('fastAndEasyDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 광고 - 주석처리 */}
        {/*
        <div className="flex justify-center mb-8">
          <AdContainer size="leaderboard" slot="footer-leaderboard" className="hidden md:block" isPreview={true} />
          <AdContainer size="banner" slot="footer-mobile" className="md:hidden" isPreview={true} />
        </div>
        */}

        {/* 특징 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">{t('fastAndEasyTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('fastAndEasyDescription')}</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">{t('completelyFreeTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('completelyFreeDescription')}</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">{t('developerFriendlyTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('developerFriendlyDescription')}</p>
          </div>
        </div>
      </div>

      {/* 푸터 - 다국어 완성 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('mainTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('footerDescription')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">🛠️ {t('footerToolsTitle')}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="https://iframe.bobob.app" target="_blank" className="hover:text-white transition-colors">
                    🖼️ {t('iframeViewerTitle')}
                  </a>
                </li>
                <li>
                  <a href="https://regax.bobob.app" target="_blank" className="hover:text-white transition-colors">
                    🔍 {t('regaxTitle')}
                  </a>
                </li>
                <li>
                  <a href="https://lorem.bobob.app" target="_blank" className="hover:text-white transition-colors">
                    📝 {t('loremGeneratorTitle')}
                  </a>
                </li>
                <li>
                  <a href="https://cron.bobob.app" target="_blank" className="hover:text-white transition-colors">
                    ⏰ {t('cronGeneratorTitle')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">📋 {t('footerInfoTitle')}</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/privacy" className="hover:text-white transition-colors">{t('footerPrivacy')}</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">{t('footerTerms')}</a></li>
                <li>
                  <a href="mailto:bobob935@gmail.com" className="hover:text-white transition-colors">
                    {t('footerContact')} (bobob935@gmail.com)
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>{t('footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <TranslationProvider>
      <HomeContent />
    </TranslationProvider>
  );
}
