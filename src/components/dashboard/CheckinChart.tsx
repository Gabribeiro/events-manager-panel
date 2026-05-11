'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import type { Checkin } from '@/types';
import Card from '@/components/ui/Card';
import { useLang } from '@/providers/LanguageProvider';

function buildHourlyData(checkins: Checkin[]) {
  const successCheckins = checkins.filter((c) => c.success);
  if (successCheckins.length === 0) return [];
  const counts: Record<string, number> = {};
  for (const c of successCheckins) {
    const date = new Date(c.timestamp);
    const key = `${String(date.getHours()).padStart(2, '0')}:00`;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hora, entradas]) => ({ hora, entradas }));
}

export default function CheckinChart({ checkins }: { checkins: Checkin[] }) {
  const { t } = useLang();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  const data = buildHourlyData(checkins);

  const gridColor = dark ? '#374151' : '#f0f0f0';
  const tooltipStyle = {
    borderRadius: 8,
    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
    background: dark ? '#1f2937' : '#fff',
    color: dark ? '#f3f4f6' : '#111827',
    fontSize: 12,
  };

  if (data.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('dashboard.chart_entries_title')}</h3>
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
          {t('dashboard.chart_no_checkins')}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('dashboard.chart_entries_title')}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="fillEntradas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="hora" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [v, t('dashboard.chart_entries_title')]}
          />
          <Area type="monotone" dataKey="entradas" stroke="#6366f1" strokeWidth={2} fill="url(#fillEntradas)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
