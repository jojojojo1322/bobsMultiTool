'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage, TranslationKey, Translation } from '@/locales';

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>('ko');

  // 클라이언트에서만 localStorage와 브라우저 언어 감지
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // URL 쿼리 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') as SupportedLanguage;
      
      if (langParam && translations[langParam]) {
        setLanguage(langParam);
        localStorage.setItem('bobob-language', langParam);
        return;
      }

      // localStorage 확인
      const savedLang = localStorage.getItem('bobob-language') as SupportedLanguage;
      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
        return;
      }

      // 브라우저 언어 감지
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ko')) {
        setLanguage('ko');
      } else if (browserLang.startsWith('zh')) {
        setLanguage('zh');
      } else if (browserLang.startsWith('ja')) {
        setLanguage('ja');
      } else if (browserLang.startsWith('vi')) {
        setLanguage('vi');
      } else {
        setLanguage('en');
      }
    }
  }, []);

  // 언어 변경 시 localStorage에 저장
  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bobob-language', lang);
    }
  };

  // 번역 함수
  const t = (key: TranslationKey): string => {
    const translation = translations[language] as Translation;
    return translation[key] || translations.en[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 