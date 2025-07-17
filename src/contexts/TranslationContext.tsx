'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

// 내부 Provider 컴포넌트 (useSearchParams 사용)
function InnerTranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터, localStorage, 브라우저 언어 순서로 언어 감지
  useEffect(() => {
    // 1. URL 쿼리 파라미터 확인
    const urlLang = searchParams.get('lang') as Language;
    
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
  }, [searchParams]);

  // 언어 변경 시 URL도 업데이트
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // URL 파라미터 업데이트
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLanguage);
    window.history.replaceState({}, '', url);
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

// Suspense로 감싼 Provider
export function TranslationProvider({ children }: TranslationProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerTranslationProvider>
        {children}
      </InnerTranslationProvider>
    </Suspense>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 