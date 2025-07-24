'use client';

import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('privacyPolicy')}
          </h1>
          <p className="text-gray-600">
            {t('privacySubtitle')}
          </p>
          
          {/* 언어 선택 버튼 */}
          <div className="absolute top-0 right-0">
            <LanguageSelector />
          </div>
        </div>

        {/* 내용 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">{t('privacyDataCollection')}</h2>
            <p className="mb-4 text-gray-700">{t('privacyDataCollectionDesc')}</p>

            <h2 className="text-xl font-semibold mb-4">{t('privacyGoogleServices')}</h2>
            <p className="mb-4 text-gray-700">{t('privacyGoogleServicesDesc')}</p>

            <h2 className="text-xl font-semibold mb-4">{t('privacyDataUsage')}</h2>
            <p className="mb-4 text-gray-700">{t('privacyDataUsageDesc')}</p>

            <h2 className="text-xl font-semibold mb-4">{t('privacyContact')}</h2>
            <p className="text-gray-700">{t('privacyContactDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 