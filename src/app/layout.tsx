import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Events Manager',
  description: 'Painel de gestão de eventos com controle de acesso e check-in de participantes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
