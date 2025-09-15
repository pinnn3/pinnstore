
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { DEFAULT_LANG, SUPPORTED_LANGS } from '../constants';
import { id } from '../i18n/id';
import { en } from '../i18n/en';

type Lang = 'id' | 'en';
type Dictionary = typeof id;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof Dictionary) => string;
}

const dictionaries: Record<Lang, Dictionary> = { id, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const savedLang = localStorage.getItem('lang');
    return savedLang && SUPPORTED_LANGS.includes(savedLang) ? (savedLang as Lang) : DEFAULT_LANG;
  });

  const setLang = (newLang: Lang) => {
    if (SUPPORTED_LANGS.includes(newLang)) {
      setLangState(newLang);
      localStorage.setItem('lang', newLang);
    }
  };

  const t = useCallback((key: keyof Dictionary): string => {
    return dictionaries[lang][key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
