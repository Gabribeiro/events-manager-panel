import Link from 'next/link';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import type { Event } from '@/types';
import type { LangType } from '@/types/lang';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { formatDate, formatPercent } from '@/utils/format';
import { getT } from '@/utils/getT';

export default function EventCard({ event, lang }: { event: Event; lang: LangType }) {
  const t = getT(lang);

  return (
    <Link href={`/${lang}/events/${event.id}`} className="block group">
      <Card className="p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {event.name}
          </h2>
          <Badge variant={event.status}>{t(`event_status.${event.status}`)}</Badge>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>
              {t('event_card.participants', {
                checkin: event.checkin_count,
                expected: event.expected_count,
              })}
            </span>
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {t('event_card.entry_rate', { rate: formatPercent(event.entry_rate) })}
          </span>
        </div>
      </Card>
    </Link>
  );
}
