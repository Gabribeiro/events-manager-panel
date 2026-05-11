'use client';

import { useEffect } from 'react';
import type { LangType } from '@/types/lang';

export default function LangSyncer({ lang }: { lang: LangType }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
