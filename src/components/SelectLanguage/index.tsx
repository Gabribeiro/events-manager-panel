'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { LangType } from '@/types/lang';
import { LANGUAGES } from '@/types/lang';

export default function SelectLanguage({ currentLang }: { currentLang: LangType }) {
  const pathname = usePathname();
  const router = useRouter();

  function changeLang(newLang: LangType) {
    const newPath = pathname.replace(/^\/(pt|en)/, `/${newLang}`);
    router.push(newPath);
  }

  return (
    <select
      value={currentLang}
      onChange={(e) => changeLang(e.target.value as LangType)}
      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      aria-label="Select language"
    >
      {LANGUAGES.map((l) => (
        <option key={l.value} value={l.value}>
          {l.flag} {l.label}
        </option>
      ))}
    </select>
  );
}
