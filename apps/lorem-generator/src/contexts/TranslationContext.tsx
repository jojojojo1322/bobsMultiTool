'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKey } from '@/locales';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // URL 쿼리에서 언어 감지
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Language;
    
    // localStorage에서 언어 감지
    const savedLang = localStorage.getItem('language') as Language;
    
    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0] as Language;
    
    // 우선순위: URL > localStorage > browser > default(en)
    const detectedLang = urlLang || savedLang || browserLang || 'en';
    
    // 지원하는 언어인지 확인
    const supportedLanguages: Language[] = ['en', 'ko', 'zh', 'ja', 'vi'];
    const finalLang = supportedLanguages.includes(detectedLang) ? detectedLang : 'en';
    
    setLanguage(finalLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // URL 업데이트
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  };

  const t = (key: TranslationKey): string => {
    const translation = translations[language];
    
    // 직접 키로 먼저 찾아보기 (예: 'language.en')
    if (key in translation) {
      const value = translation[key as keyof typeof translation];
      return typeof value === 'string' ? value : key;
    }
    
    // 점으로 분해해서 nested object에서 찾기 (예: type.words -> type: { words: "Words" })
    const keys = key.split('.');
    let value: unknown = translation;
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
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