import Link from 'next/link';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import type { Event } from '@/types';
import type { LangType } from '@/types/lang';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/format';
import { getT } from '@/utils/getT';

export default function DashboardHeader({ event, lang }: { event: Event; lang: LangType }) {
  const t = getT(lang);

  return (
    <div className="mb-6">
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.back_to_events')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{event.name}</h1>
            <Badge variant={event.status}>{t(`event_status.${event.status}`)}</Badge>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {event.status === 'closed' && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <span>⚠️</span>
          {t('dashboard.event_closed_msg')}
        </div>
      )}
      {event.status === 'cancelled' && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          <span>❌</span>
          {t('dashboard.event_cancelled_msg')}
        </div>
      )}
    </div>
  );
}
