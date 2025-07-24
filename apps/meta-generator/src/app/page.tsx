'use client';

import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';
import MetaGenerator from '@/components/MetaGenerator';

export default function MetaGeneratorPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Header */}
      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-6">🏷️</div>
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

      {/* Meta Generator Tool */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <MetaGenerator />
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature1Title')}</h3>
              <p className="text-gray-600">{t('feature1Description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature2Title')}</h3>
              <p className="text-gray-600">{t('feature2Description')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{t('howToUseSubtitle')}</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li><strong>{t('step1')}</strong></li>
              <li><strong>{t('step2')}</strong></li>
              <li><strong>{t('step3')}</strong></li>
              <li><strong>{t('step4')}</strong></li>
            </ol>
            
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-purple-500">
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
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
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