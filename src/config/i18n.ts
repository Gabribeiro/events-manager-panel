'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import pt from './locales/pt/translation.json';
import en from './locales/en/translation.json';

if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .init({
      resources: {
        pt: { translation: pt },
        en: { translation: en },
      },
      fallbackLng: 'pt',
      interpolation: { escapeValue: false },
      detection: {
        order: ['cookie', 'htmlTag', 'navigator'],
        caches: ['cookie'],
        cookieName: 'i18next',
      },
    } as any);
}

export default i18next;
