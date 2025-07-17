'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Language } from '@/types';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; flag: string }[] = [
    { code: 'en', flag: '🇺🇸' },
    { code: 'ko', flag: '🇰🇷' },
    { code: 'zh', flag: '🇨🇳' },
    { code: 'ja', flag: '🇯🇵' },
    { code: 'vi', flag: '🇻🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 h-10 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors w-full"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
                 <span className="text-sm font-medium text-gray-700">
           {(() => {
             switch(language) {
               case 'en': return t('language.en');
               case 'ko': return t('language.ko');
               case 'zh': return t('language.zh');
               case 'ja': return t('language.ja');
               case 'vi': return t('language.vi');
               default: return language;
             }
           })()}
         </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ml-auto ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors ${
                  language === lang.code ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                                 <span>{(() => {
                   switch(lang.code) {
                     case 'en': return t('language.en');
                     case 'ko': return t('language.ko');
                     case 'zh': return t('language.zh');
                     case 'ja': return t('language.ja');
                     case 'vi': return t('language.vi');
                     default: return lang.code;
                   }
                 })()}</span>
                {language === lang.code && (
                  <span className="ml-auto text-orange-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 드롭다운 외부 클릭 시 닫기 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 