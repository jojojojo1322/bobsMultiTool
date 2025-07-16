'use client';

import { useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/locales';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');

  // 브라우저 언어 감지 및 localStorage에서 저장된 언어 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // 브라우저 언어 감지
      const browserLanguage = navigator.language.toLowerCase();
      if (browserLanguage.startsWith('ko')) {
        setLanguage('ko');
      } else if (browserLanguage.startsWith('zh')) {
        setLanguage('zh');
      } else if (browserLanguage.startsWith('ja')) {
        setLanguage('ja');
      } else if (browserLanguage.startsWith('vi')) {
        setLanguage('vi');
      } else {
        setLanguage('en'); // 기본값
      }
    }
  }, []);

  // 언어 변경
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // 번역 함수
  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return {
    language,
    changeLanguage,
    t,
  };
} 