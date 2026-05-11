import pt from '@/config/locales/pt/translation.json';
import en from '@/config/locales/en/translation.json';
import type { LangType } from '@/types/lang';

const resources: Record<LangType, Record<string, unknown>> = { pt, en };

export function getT(lang: LangType) {
  const dict = resources[lang] ?? resources.pt;
  return (key: string, vars?: Record<string, string | number>): string => {
    const val = key.split('.').reduce<unknown>((node, k) => {
      if (node && typeof node === 'object') return (node as Record<string, unknown>)[k];
      return undefined;
    }, dict);
    if (typeof val !== 'string') return key;
    if (!vars) return val;
    return val.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''));
  };
}
