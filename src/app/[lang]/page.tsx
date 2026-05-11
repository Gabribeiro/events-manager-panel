'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import { use } from 'react';
import { useEvents } from '@/hooks/useEvents';
import EventList from '@/components/events/EventList';
import EventFilters, { type SortOrder } from '@/components/events/EventFilters';
import SelectLanguage from '@/components/SelectLanguage';
import ThemeToggle from '@/components/ThemeToggle';
import { useLang } from '@/providers/LanguageProvider';
import type { EventStatus } from '@/types';
import type { LangType } from '@/types/lang';

export default function HomePage({ params }: { params: Promise<{ lang: LangType }> }) {
  const { lang } = use(params);
  const { t } = useLang();
  const { data: events, isLoading, isError } = useEvents();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | ''>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSearchChange = useCallback((value: string) => setSearch(value), []);
  const handleStatusChange = useCallback((s: EventStatus | '') => setStatusFilter(s), []);
  const handleSortToggle = useCallback(
    () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc')),
    []
  );

  const filtered = useMemo(() => {
    if (!events) return [];
    return events
      .filter((e) => {
        const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === '' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [events, search, statusFilter, sortOrder]);

  const totalLabel = events
    ? t(events.length === 1 ? 'events_page.total_one' : 'events_page.total_other', {
        count: events.length,
      })
    : t('events_page.loading');

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('events_page.title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${lang}/api-docs`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              {t('events_page.api_docs')}
            </Link>
            <ThemeToggle />
            <SelectLanguage currentLang={lang} />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{totalLabel}</p>
      </header>

      <div className="mb-6">
        <EventFilters
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onSortToggle={handleSortToggle}
          sortOrder={sortOrder}
          statusFilter={statusFilter}
        />
      </div>

      <EventList events={filtered} isLoading={isLoading} isError={isError} lang={lang} />
    </main>
  );
}
