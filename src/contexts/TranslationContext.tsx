'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/locales';

interface TranslationContextType {
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // URL 쿼리 파라미터, localStorage, 브라우저 언어 순서로 언어 감지
  useEffect(() => {
    // 1. URL 쿼리 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Language;
    
    if (urlLang && translations[urlLang]) {
      setLanguage(urlLang);
      localStorage.setItem('language', urlLang);
      return;
    }
    
    // 2. localStorage에서 저장된 언어 확인
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      return;
    }
    
    // 3. 브라우저 언어 감지
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

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, t }}>
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