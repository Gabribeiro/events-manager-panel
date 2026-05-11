'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { LangType } from '@/types/lang';
import { useTranslation } from '@/hooks/useTranslation';

type TFn = (key: string, vars?: Record<string, string | number>) => string;

type LanguageContextType = { lang: LangType; t: TFn };

const LanguageContext = createContext<LanguageContextType>({
  lang: 'pt',
  t: (key) => key,
});

export function LanguageProvider({ lang, children }: { lang: LangType; children: ReactNode }) {
  const { t } = useTranslation(lang);
  return (
    <LanguageContext.Provider value={{ lang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
