'use client';

import { useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import '@/config/i18n';
import type { LangType } from '@/types/lang';

export function useTranslation(lang: LangType) {
  const { t, i18n } = useI18nTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      document.cookie = `i18next=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [lang, i18n]);

  return { t };
}
