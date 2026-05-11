import type { ReactNode } from 'react';
import Card from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: 'indigo' | 'green' | 'red' | 'amber';
  subtitle?: string;
}

const accentStyles = {
  indigo: { icon: 'bg-indigo-100 text-indigo-600', value: 'text-indigo-700' },
  green: { icon: 'bg-green-100 text-green-600', value: 'text-green-700' },
  red: { icon: 'bg-red-100 text-red-600', value: 'text-red-700' },
  amber: { icon: 'bg-amber-100 text-amber-600', value: 'text-amber-700' },
};

export default function MetricCard({
  title,
  value,
  icon,
  accent = 'indigo',
  subtitle,
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <span className={cn('p-2 rounded-lg', styles.icon)}>{icon}</span>
      </div>
      <p className={cn('text-3xl font-bold', styles.value)}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
    </Card>
  );
}
