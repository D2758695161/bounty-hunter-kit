'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, t as translate } from './i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        setLangState('zh');
      } else {
        setLangState('en');
      }
    }
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem('lang', l);
    // Update html lang attribute
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (key: string) => translate(key, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
