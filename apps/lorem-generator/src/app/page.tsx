'use client';

import { TranslationProvider, useTranslation } from '@/contexts/TranslationContext';
import LoremGenerator from '@/components/LoremGenerator';
import LanguageSelector from '@/components/LanguageSelector';

function HomeContent() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Header */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-6">📝</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('mainTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            {t('mainSubtitle')}
          </p>
          <p className="text-sm text-gray-500">
            {t('partOfText')}
          </p>
        </div>
      </section>

      {/* Lorem Generator Tool */}
      <section className="py-8 px-4">
        <LoremGenerator />
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t('featuresTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature1Title')}</h3>
              <p className="text-gray-600">{t('feature1Description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature2Title')}</h3>
              <p className="text-gray-600">{t('feature2Description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature3Title')}</h3>
              <p className="text-gray-600">{t('feature3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t('howToUseTitle')}
          </h2>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t('howToUseSubtitle')}</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li><strong>{t('step1')}</strong></li>
              <li><strong>{t('step2')}</strong></li>
              <li><strong>{t('step3')}</strong></li>
              <li><strong>{t('step4')}</strong></li>
              <li><strong>{t('step5')}</strong></li>
            </ol>
            
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-gray-900 mb-2">{t('proTipTitle')}</h4>
              <p className="text-gray-700">
                {t('proTipDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <a
            href="https://bobob.app"
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToHome')}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">{t('footerTitle')}</h3>
            <div className="flex justify-center space-x-6 text-sm text-gray-400 mb-3">
              <a href="/privacy" className="hover:text-white transition-colors">{t('footerPrivacy')}</a>
              <a href="/terms" className="hover:text-white transition-colors">{t('footerTerms')}</a>
              <a href="mailto:bobob935@gmail.com" className="hover:text-white transition-colors">{t('footerContact')}</a>
              <a href="https://bobob.app" className="hover:text-white transition-colors">{t('footerBackHome')}</a>
            </div>
            <p className="text-xs text-gray-500">
              📧 {t('footerSupport')} <a href="mailto:bobob935@gmail.com" className="text-orange-400 hover:text-orange-300">bobob935@gmail.com</a>
            </p>
          </div>
          <p className="text-sm text-gray-400">{t('footerCopyright')}</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <TranslationProvider>
      <HomeContent />
    </TranslationProvider>
  );
} 