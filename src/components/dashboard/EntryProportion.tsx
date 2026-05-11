'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import type { Checkin } from '@/types';
import Card from '@/components/ui/Card';
import { useLang } from '@/providers/LanguageProvider';

const COLORS = ['#6366f1', '#f87171'];

export default function EntryProportion({ checkins }: { checkins: Checkin[] }) {
  const { t } = useLang();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  const success = checkins.filter((c) => c.success).length;
  const errors = checkins.filter((c) => !c.success).length;
  const total = checkins.length;

  const tooltipStyle = {
    borderRadius: 8,
    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
    background: dark ? '#1f2937' : '#fff',
    color: dark ? '#f3f4f6' : '#111827',
    fontSize: 12,
  };

  if (total === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('dashboard.chart_proportion_title')}</h3>
        <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
          {t('dashboard.chart_no_checkins')}
        </div>
      </Card>
    );
  }

  const data = [
    { name: t('dashboard.chart_success'), value: success },
    { name: t('dashboard.chart_errors'), value: errors },
  ].filter((d) => d.value > 0);

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('dashboard.chart_proportion_title')}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v, name) => [`${v} (${Math.round((Number(v) / total) * 100)}%)`, name]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: dark ? '#9ca3af' : undefined }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
