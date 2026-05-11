export type LangType = 'pt' | 'en';

export const LANGUAGES: { value: LangType; label: string; flag: string }[] = [
  { value: 'pt', label: 'Português', flag: '🇧🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
];

export const DEFAULT_LANG: LangType = 'pt';
export const SUPPORTED_LANGS: LangType[] = ['pt', 'en'];
