'use client';

import { use, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SelectLanguage from '@/components/SelectLanguage';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/providers/ThemeProvider';
import { getT } from '@/utils/getT';
import type { LangType } from '@/types/lang';

export default function ApiDocsPage({
  params,
}: {
  params: Promise<{ lang: LangType }>;
}) {
  const { lang } = use(params);
  const t = getT(lang);
  const { resolvedTheme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const send = () =>
      iframe.contentWindow?.postMessage({ type: 'theme', value: resolvedTheme }, '*');

    if (iframe.contentDocument?.readyState === 'complete') {
      send();
    } else {
      iframe.addEventListener('load', send);
      return () => iframe.removeEventListener('load', send);
    }
  }, [resolvedTheme]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('nav.back_to_panel')}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {t('api_docs.base_url')}{' '}
            <code className="bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-1 rounded">
              http://localhost:3001
            </code>
          </span>
          <ThemeToggle />
          <SelectLanguage currentLang={lang} />
        </div>
      </header>
      <iframe
        ref={iframeRef}
        src="/swagger.html"
        className="flex-1 w-full border-0"
        title="API Reference"
      />
    </div>
  );
}
