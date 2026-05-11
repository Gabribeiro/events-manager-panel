'use client';

import type { Event, Participant, Checkin } from '@/types';
import Badge from '@/components/ui/Badge';
import CheckinButton from './CheckinButton';
import Card from '@/components/ui/Card';
import { useLang } from '@/providers/LanguageProvider';

interface ParticipantTableProps {
  event: Event;
  participants: Participant[];
  checkins: Checkin[];
}

export default function ParticipantTable({ event, participants, checkins }: ParticipantTableProps) {
  const { t } = useLang();

  if (participants.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-400 text-sm">
        {t('dashboard.no_participants')}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('dashboard.participants_title', { count: participants.length })}
        </h3>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">{t('dashboard.col_name')}</th>
              <th className="px-5 py-3 font-medium">{t('dashboard.col_type')}</th>
              <th className="px-5 py-3 font-medium">{t('dashboard.col_status')}</th>
              <th className="px-5 py-3 font-medium text-center">{t('dashboard.col_checkins')}</th>
              <th className="px-5 py-3 font-medium text-right">{t('dashboard.col_action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">{p.name}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={p.type}>{t(`participant_type.${p.type}`)}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={p.status}>{t(`participant_status.${p.status}`)}</Badge>
                </td>
                <td className="px-5 py-3.5 text-center text-gray-600 dark:text-gray-400">{p.checkin_count}</td>
                <td className="px-5 py-3.5 text-right">
                  <CheckinButton event={event} participant={p} checkins={checkins} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {participants.map((p) => (
          <div key={p.id} className="px-5 py-4">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{p.name}</p>
              <div className="flex gap-1.5 flex-wrap justify-end">
                <Badge variant={p.type}>{t(`participant_type.${p.type}`)}</Badge>
                <Badge variant={p.status}>{t(`participant_status.${p.status}`)}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t(
                  p.checkin_count === 1
                    ? 'dashboard.mobile_checkins_one'
                    : 'dashboard.mobile_checkins_other',
                  { count: p.checkin_count }
                )}
              </p>
              <CheckinButton event={event} participant={p} checkins={checkins} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
