import { Toaster } from 'sonner';
import QueryProvider from '@/providers/QueryProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import LangSyncer from '@/components/LangSyncer';
import type { LangType } from '@/types/lang';
import { SUPPORTED_LANGS } from '@/types/lang';

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: LangType };

  return (
    <QueryProvider>
      <LanguageProvider lang={lang}>
        <LangSyncer lang={lang} />
        {children}
      </LanguageProvider>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
