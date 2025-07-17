'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function ProTipsContent() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('proTipsTitle')}</h2>
      <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{t('testingBestPracticesTitle')}</h3>
          <ul className="space-y-1">
            <li>{t('testingBestPractice1')}</li>
            <li>{t('testingBestPractice2')}</li>
            <li>{t('testingBestPractice3')}</li>
            <li>{t('testingBestPractice4')}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{t('commonIssuesTitle')}</h3>
          <ul className="space-y-1">
            <li>{t('commonIssue1')}</li>
            <li>{t('commonIssue2')}</li>
            <li>{t('commonIssue3')}</li>
            <li>{t('commonIssue4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 