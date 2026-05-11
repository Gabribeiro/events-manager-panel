'use client';

import { use } from 'react';
import { Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useEventDetail } from '@/hooks/useEventDetail';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import CheckinChart from '@/components/dashboard/CheckinChart';
import EntryProportion from '@/components/dashboard/EntryProportion';
import ParticipantTable from '@/components/dashboard/ParticipantTable';
import SelectLanguage from '@/components/SelectLanguage';
import ThemeToggle from '@/components/ThemeToggle';
import Spinner from '@/components/ui/Spinner';
import { useLang } from '@/providers/LanguageProvider';
import { formatPercent } from '@/utils/format';
import type { LangType } from '@/types/lang';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ lang: LangType; id: string }>;
}) {
  const { lang, id } = use(params);
  const { t } = useLang();
  const { event, participants, checkins } = useEventDetail(id);

  if (event.isLoading || participants.isLoading || checkins.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (event.isError || !event.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <span className="text-4xl mb-3">⚠️</span>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('dashboard.not_found_title')}</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">{t('dashboard.not_found_desc')}</p>
      </div>
    );
  }

  const e = event.data;
  const ps = participants.data ?? [];
  const cs = checkins.data ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-end items-center gap-2 mb-2">
        <ThemeToggle />
        <SelectLanguage currentLang={lang} />
      </div>

      <DashboardHeader event={e} lang={lang} />

      <section
        aria-label={t('dashboard.expected_participants')}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <MetricCard
          title={t('dashboard.expected_participants')}
          value={e.expected_count}
          icon={<Users className="h-4 w-4" />}
          accent="indigo"
        />
        <MetricCard
          title={t('dashboard.checkins_done')}
          value={e.checkin_count}
          icon={<CheckCircle className="h-4 w-4" />}
          accent="green"
          subtitle={t('dashboard.of_expected', { count: e.expected_count })}
        />
        <MetricCard
          title={t('dashboard.error_attempts')}
          value={e.error_count}
          icon={<XCircle className="h-4 w-4" />}
          accent="red"
        />
        <MetricCard
          title={t('dashboard.entry_rate_label')}
          value={formatPercent(e.entry_rate)}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="amber"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CheckinChart checkins={cs} />
        <EntryProportion checkins={cs} />
      </section>

      <section>
        <ParticipantTable event={e} participants={ps} checkins={cs} />
      </section>
    </main>
  );
}
