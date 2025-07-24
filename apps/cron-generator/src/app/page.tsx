'use client';

import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';
import CronGenerator from '@/components/CronGenerator';

export default function CronGeneratorPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Header */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
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

      {/* Cron Generator Tool */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <CronGenerator />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t('featuresTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature1Title')}</h3>
              <p className="text-gray-600">{t('feature1Description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature2Title')}</h3>
              <p className="text-gray-600">{t('feature2Description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t('howToUseSubtitle')}</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li><strong>{t('step1')}</strong></li>
              <li><strong>{t('step2')}</strong></li>
              <li><strong>{t('step3')}</strong></li>
              <li><strong>{t('step4')}</strong></li>
            </ol>
            
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 mb-2">{t('exampleTitle')}</h4>
              <p className="text-gray-700">
                {t('exampleDescription')}
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
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
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
              📧 {t('footerSupport')} <a href="mailto:bobob935@gmail.com" className="text-blue-400 hover:text-blue-300">bobob935@gmail.com</a>
            </p>
          </div>
          <p className="text-sm text-gray-400">&copy; {t('footerCopyright')}</p>
        </div>
      </footer>
    </main>
  );
} 