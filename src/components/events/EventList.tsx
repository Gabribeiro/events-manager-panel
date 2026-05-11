import { CalendarX } from 'lucide-react';
import type { Event } from '@/types';
import type { LangType } from '@/types/lang';
import EventCard from './EventCard';
import { getT } from '@/utils/getT';

interface EventListProps {
  events: Event[] | undefined;
  isLoading: boolean;
  isError: boolean;
  lang: LangType;
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800 mb-3" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function EventList({ events, isLoading, isError, lang }: EventListProps) {
  const t = getT(lang);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label={t('event_list.loading_aria')}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-3">⚠️</span>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('event_list.error_title')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('event_list.error_desc')}</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CalendarX className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">{t('event_list.empty_title')}</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">{t('event_list.empty_desc')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} lang={lang} />
      ))}
    </div>
  );
}
